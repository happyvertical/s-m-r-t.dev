/**
 * Source-level integrity checks for the site's information architecture (#187 S4).
 *
 * This file builds the emitted-route set the same way SvelteKit's prerenderer
 * does — walking `src/routes/**` and calling each dynamic route's `entries()`
 * — then checks the rest of the codebase against it:
 *
 *  - every literal `href: '/…'` / `href="/…"` in `src/lib/data`, `src/lib/components`,
 *    and `src/routes` resolves to something that will actually exist;
 *  - every redirect route's target exists and is itself a non-redirect page
 *    (no redirect chains);
 *  - the count of redirect-shaped routes this scan discovers matches the sum of
 *    the hand-guarded families in `legacy-routes.test.ts` plus the small,
 *    single-file static redirects — so a new, unguarded redirect family
 *    changes this number and fails loudly instead of shipping silently;
 *  - exactly one `primaryNavigation` item is active for every emitted content
 *    route.
 *
 * What this file does NOT check: canonical-URL correctness and sitemap
 * coverage need the actual rendered HTML/meta, so they live in the
 * build-output sweep, `scripts/check-links.mjs`, run after `vite build`.
 */
import { describe, expect, it } from 'vitest';
import { isPrimaryNavigationActive, primaryNavigation } from '$lib/data/navigation';
import { packages } from '$lib/data/packages';
import {
	contentRoutes,
	redirectRoutes,
	routes,
	routesByPath,
	stripQueryAndHash
} from '$lib/server/route-inventory';
import { docsMoveRedirectCount } from '$lib/server/legacy-inventory';
import { entries as componentEntries } from '../routes/components/[...legacy]/+page.server';
import { entries as docsEntries } from '../routes/docs/[...legacy]/+page.server';
import { _aliases as docsGuideAliases } from '../routes/docs/guides/[slug]/+page';
import { entries as blockEntries } from '../routes/blocks/[slug]/+page.server';
import { entries as moduleEntries } from '../routes/modules/[slug]/+page.server';
import { entries as packageEntries } from '../routes/packages/[slug]/+page.server';

describe('emitted-route inventory (#187 S4)', () => {
	it('discovers a plausible number of routes, so nothing below passes vacuously', () => {
		expect(routes.length).toBeGreaterThan(400);
		expect(contentRoutes.length).toBeGreaterThan(300);
	});

	it('counts every redirect-shaped route against the families legacy-routes.test.ts guards', async () => {
		const componentCount = (await componentEntries()).length;
		const docsCount = (await docsEntries()).length;
		const moduleCount = (await moduleEntries()).length;
		// #361 slice E: the 23 retired #358 /blocks/<slug> pages (the /blocks index is a
		// single-file redirect, listed below). Guarded in legacy-routes.test.ts.
		const blockCount = (await blockEntries()).length;
		const packageCount = (await packageEntries()).length;
		// The 3 /foundations/* aliases (guarded in legacy-routes.test.ts) plus an
		// EXPLICIT, hand-maintained list of the small single-file static redirects
		// below — they aren't dynamic-entries families, so they aren't guarded
		// there. This list must stay hand-maintained rather than derived from the
		// route inventory: deriving it from the same scan this test is checking
		// would make the assertion tautological (a new unguarded redirect family
		// would inflate both sides of the comparison equally and could never
		// fail). Adding a new single-file redirect route means adding it here; a
		// new *family* of redirects (multiple entries from one dynamic route)
		// belongs in legacy-routes.test.ts instead, the way the foundations
		// aliases were added — do not just widen this list or number.
		// #365: every pre-move URL of the families that moved under /docs —
		// static pages, every slug, and the foundations and reference-component
		// aliases the old routes already carried. Guarded in legacy-routes.test.ts.
		const docsMoveCount = docsMoveRedirectCount();
		// The two `/docs/guides/<old>` aliases that left the `/docs/[...legacy]`
		// table for the guides route (#365; guarded in legacy-routes.test.ts).
		const docsGuideAliasCount = Object.keys(docsGuideAliases).length;
		const knownSingleRedirectRoutes = [
			'/components',
			'/sdk',
			'/saadl',
			'/themes',
			'/packages',
			'/faq',
			// #338: the ground-up page became /starters/smrt-start; the SaaS
			// starter page was retired. Both are guarded in legacy-routes.test.ts.
			'/starters/ground-up',
			'/starters/saas',
			// #355 / #361: the module-cluster index was /blocks and is now /features;
			// the /blocks landing it pointed at redirects there too. Guarded in
			// legacy-routes.test.ts.
			'/modules',
			'/blocks'
		];
		for (const path of knownSingleRedirectRoutes) {
			expect(
				routesByPath.get(path)?.isRedirect,
				`${path} is expected to still be a known single-file redirect route.`
			).toBe(true);
		}
		const staticSingleRedirectCount = knownSingleRedirectRoutes.length;

		expect(
			redirectRoutes.length,
			'A new redirect-shaped route appeared that is not one of the guarded families ' +
				'(components, docs, modules, blocks, packages, the #365 /docs moves and docs guide aliases) or a known single-file ' +
				'static redirect. If it is a real new family, add it to legacy-routes.test.ts the way ' +
				'the foundations aliases were added; if it is a new single-file redirect, add it to ' +
				'`knownSingleRedirectRoutes` above. Do not just widen this expectation.'
		).toBe(
			componentCount +
				docsCount +
				moduleCount +
				blockCount +
				packageCount +
				docsMoveCount +
				docsGuideAliasCount +
				staticSingleRedirectCount
		);
	});

	it('never redirects to another redirect (no chains)', () => {
		for (const route of redirectRoutes) {
			const target = stripQueryAndHash(route.target ?? '');
			const destination = routesByPath.get(target);
			expect(
				destination,
				`${route.path} -> ${route.target} does not resolve to any emitted route.`
			).toBeDefined();
			expect(
				destination?.isRedirect,
				`${route.path} -> ${route.target} -> ${destination?.target}: redirect chain. ` +
					'Point the first redirect straight at the final destination.'
			).toBe(false);
		}
	});

	it('resolves exactly one active primaryNavigation item per emitted content route', () => {
		// The three doors (#361) — BUILD, FEATURES, DOCS — cover every content
		// route except the homepage (the brand link) and the standalone
		// playground, which belong to no door by design, not by omission.
		const noPrimaryDestination = (path: string) => path === '/' || path === '/playground';

		for (const route of contentRoutes) {
			const activeCount = primaryNavigation.filter((item) =>
				isPrimaryNavigationActive(item, route.path)
			).length;
			const expected = noPrimaryDestination(route.path) ? 0 : 1;
			expect(
				activeCount,
				`${route.path} has ${activeCount} active primaryNavigation items (want ${expected}).`
			).toBe(expected);
		}
	});
});

describe('href literals resolve to an emitted route (#187 S4)', () => {
	const sourceFiles = import.meta.glob(
		[
			'/src/lib/data/**/*.{ts,svelte}',
			'/src/lib/components/**/*.svelte',
			'/src/routes/**/*.svelte'
		],
		{ eager: true, query: '?raw', import: 'default' }
	) as Record<string, string>;

	// href="/..." (svelte templates) and href: '/...' or href: "/..." (data literals).
	const hrefPattern = /href(?:="([^"]+)"|:\s*['"]([^'"]+)['"])/g;

	const hrefsByFile = Object.entries(sourceFiles).map(([file, contents]) => {
		const hrefs = new Set<string>();
		for (const match of contents.matchAll(hrefPattern)) {
			const href = match[1] ?? match[2];
			// Skip Svelte template interpolation (`href="/foo/{bar}"`) and JS template
			// literals — this scan only resolves true string literals, per spec.
			if (href?.startsWith('/') && !href.includes('{')) hrefs.add(href);
		}
		return { file, hrefs: [...hrefs] };
	});

	it('finds a plausible number of href literals, so nothing below passes vacuously', () => {
		const total = hrefsByFile.reduce((sum, { hrefs }) => sum + hrefs.length, 0);
		expect(total).toBeGreaterThan(50);
	});

	it('resolves every literal href to a route this scan discovered', () => {
		for (const { file, hrefs } of hrefsByFile) {
			for (const href of hrefs) {
				const target = stripQueryAndHash(href);
				expect(
					// Generated after prerender; exhaustive artifact coverage is checked by check:agent-docs.
					routesByPath.has(target) || target === '/llms.txt' || target === '/llms-full.txt',
					`${file}: href "${href}" does not resolve to any route in ` +
						`src/routes (checked "${target}").`
				).toBe(true);
			}
		}
	});
});

// Guard against `packages` becoming empty, which would make the redirect-count
// check above pass vacuously for the modules family.
describe('sanity', () => {
	it('has packages to redirect /modules/<slug> for', () => {
		expect(packages.length).toBeGreaterThan(0);
	});
});
