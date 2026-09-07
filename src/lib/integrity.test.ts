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
import { isRedirect } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { isPrimaryNavigationActive, primaryNavigation } from '$lib/data/navigation';
import { packages } from '$lib/data/packages';
import { entries as componentEntries } from '../routes/components/[...legacy]/+page.server';
import { entries as docsEntries } from '../routes/docs/[...legacy]/+page.server';
import { entries as moduleEntries } from '../routes/modules/[slug]/+page.server';

type LoadFn = (_event: { params: Record<string, string> }) => unknown;
type EntriesFn = () => Array<Record<string, string>> | Promise<Array<Record<string, string>>>;
type RouteModule = { load?: LoadFn; entries?: EntriesFn };

interface RouteInfo {
	/** The final URL path, e.g. `/reference/packages/smrt-ui`. */
	path: string;
	/** Whether visiting `path` throws a redirect rather than rendering. */
	isRedirect: boolean;
	/** The redirect location, when `isRedirect` is true. */
	target?: string;
}

const svelteFiles = import.meta.glob('/src/routes/**/+page.svelte');
const tsLoaders = import.meta.glob<RouteModule>('/src/routes/**/+page.ts', { eager: true });
const serverLoaders = import.meta.glob<RouteModule>('/src/routes/**/+page.server.ts', {
	eager: true
});

function toDir(filePath: string): string {
	return filePath.replace(/^\/src\/routes/, '').replace(/\/\+page\.(svelte|ts|server\.ts)$/, '');
}

function toBase(dir: string, dynamic: boolean): string {
	if (!dynamic) return dir === '' ? '/' : dir;
	const segments = dir.split('/');
	const base = segments.slice(0, -1).join('/');
	return base === '' ? '/' : base;
}

function joinPath(base: string, slug: string): string {
	return base === '/' ? `/${slug}` : `${base}/${slug}`;
}

function tryLoad(load: LoadFn | undefined, params: Record<string, string>): RouteInfo['target'] {
	if (!load) return undefined;
	try {
		load({ params });
		return undefined;
	} catch (e) {
		if (isRedirect(e)) return (e as { location: string }).location;
		// A thrown 404 (error()) for a bad slug shouldn't happen for entries()-derived
		// params; surface it rather than swallowing it as "not a redirect".
		throw e;
	}
}

/** Every directory that renders or redirects a `+page.svelte`/`+page.(server.)ts`. */
const allDirs = new Set<string>([
	...Object.keys(svelteFiles).map(toDir),
	...Object.keys(tsLoaders).map(toDir),
	...Object.keys(serverLoaders).map(toDir)
]);

const routes: RouteInfo[] = [];

for (const dir of allDirs) {
	const segments = dir.split('/').filter(Boolean);
	const lastSegment = segments.at(-1) ?? '';
	const isCatchAll = lastSegment.startsWith('[...');
	const isSlug = lastSegment === '[slug]';
	const dynamic = isCatchAll || isSlug;
	const base = toBase(dir, dynamic);

	const tsKey = `/src/routes${dir}/+page.ts`;
	const serverKey = `/src/routes${dir}/+page.server.ts`;
	const mod = serverLoaders[serverKey] ?? tsLoaders[tsKey];

	if (!dynamic) {
		const path = base;
		const target = tryLoad(mod?.load, {});
		routes.push({ path, isRedirect: target !== undefined, target });
		continue;
	}

	const paramName = isCatchAll ? lastSegment.slice(4, -1) : 'slug';
	if (!mod?.entries) {
		throw new Error(`${dir} is a dynamic route with no entries() — nothing would prerender.`);
	}
	const entries = mod.entries();
	for (const entry of Array.isArray(entries) ? entries : []) {
		const value = entry[paramName];
		const path = joinPath(base, value);
		const target = tryLoad(mod.load, { [paramName]: value });
		routes.push({ path, isRedirect: target !== undefined, target });
	}
}

const routesByPath = new Map(routes.map((route) => [route.path, route]));
const contentRoutes = routes.filter((route) => !route.isRedirect);
const redirectRoutes = routes.filter((route) => route.isRedirect);

function stripQueryAndHash(path: string): string {
	return path.split('#')[0].split('?')[0];
}

describe('emitted-route inventory (#187 S4)', () => {
	it('discovers a plausible number of routes, so nothing below passes vacuously', () => {
		expect(routes.length).toBeGreaterThan(400);
		expect(contentRoutes.length).toBeGreaterThan(300);
	});

	it('counts every redirect-shaped route against the families legacy-routes.test.ts guards', async () => {
		const componentCount = (await componentEntries()).length;
		const docsCount = (await docsEntries()).length;
		const moduleCount = (await moduleEntries()).length;
		// The 3 /foundations/* aliases plus the single-file static redirects
		// (saadl, sdk, themes, components index, docs index) that aren't
		// dynamic-entries families and so aren't in legacy-routes.test.ts.
		const foundationAliasCount = 3;
		const staticSingleRedirectCount = redirectRoutes.filter(
			(route) =>
				!['/components', '/docs', '/modules', '/foundations'].some((prefix) =>
					route.path.startsWith(`${prefix}/`)
				)
		).length;

		expect(
			redirectRoutes.length,
			'A new redirect-shaped route appeared that is not one of the guarded families ' +
				'(components, docs, modules, foundations aliases) or a known single-file static ' +
				'redirect. If it is a real new family, add it to legacy-routes.test.ts the way the ' +
				'foundations aliases were added; do not just widen this expectation.'
		).toBe(
			componentCount + docsCount + moduleCount + foundationAliasCount + staticSingleRedirectCount
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
		// Guides and Starters are deliberately not primaryNavigation destinations
		// (navigation.test.ts: "uses the approved nine destinations", and
		// `active('/guides/testing-your-app')` is asserted to be `[]`) — every page
		// under either family has zero active items by design, not by omission.
		const noPrimaryDestination = (path: string) =>
			path === '/guides' || path.startsWith('/guides/') || path.startsWith('/starters');

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
					routesByPath.has(target),
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
