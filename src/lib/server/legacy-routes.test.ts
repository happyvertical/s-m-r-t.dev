import { describe, expect, it } from 'vitest';
import { featureSections } from '$lib/data/features';
import { legacyFeatureTargets, legacySectionTargets } from '$lib/legacy-features';
import { packages } from '$lib/data/packages';
import { foundationGuides } from '$lib/data/guides';
import { capabilityGuides } from '$lib/data/guides';
import { referenceGuides } from '$lib/data/reference';
import { taskGuides } from '$lib/data/task-guides';
import { toolingGuides } from '$lib/data/tooling';
import { entries as componentEntries } from '../../routes/components/[...legacy]/+page.server';
import { entries as docsEntries } from '../../routes/docs/[...legacy]/+page.server';
import { _aliases as docsGuideAliases } from '../../routes/docs/guides/[slug]/+page';
import {
	_aliases as blockAliases,
	entries as blockEntries
} from '../../routes/blocks/[slug]/+page.server';
import { entries as moduleEntries } from '../../routes/modules/[slug]/+page.server';
import {
	_aliases as referenceComponentAliases,
	entries as referenceComponentEntries
} from '../../routes/reference/components/[slug]/+page.server';
import { uiComponents } from '$lib/data/ui-components.generated';
import { entries as foundationEntries } from '../../routes/foundations/[slug]/+page.server';
import { entries as packageEntries } from '../../routes/packages/[slug]/+page.server';
import {
	docsMoveRedirectPaths,
	movedSlugFamilies,
	movedStaticPaths,
	preMoveDocsLegacyKeys,
	preMoveRouteDirs
} from './legacy-inventory';
import { routesByPath, stripQueryAndHash } from './route-inventory';

const RESTORE_DONT_RENUMBER =
	'A prerendered redirect is a live URL. If this count dropped, restore the removed ' +
	'entry rather than updating the number — the site is static, so the path it covered ' +
	'is a hard 404 in production the moment it stops being generated.';

/**
 * #365 moved every technical family under /docs, which made `/docs` a real
 * section and so collided with the `/docs/[...legacy]` table (18 entries).
 * The rule applied, rather than a renumbering:
 *
 * - A new /docs page that now owns the exact legacy path wins, and the entry
 *   leaves the table because the URL resolves to a page: `getting-started`
 *   (Getting Started moved to /docs/getting-started), `agents`, and
 *   `guides/multi-tenant-lifecycle`. −3.
 * - A legacy path under a new `[slug]` route (`/docs/guides/*`) is routed to
 *   that route, not the catch-all, so its entry moved into that route's
 *   `_aliases`: `guides/expose-app-via-mcp`, `guides/add-semantic-search`.
 *   −2 here, +2 there — still live, counted below.
 * - The other 13 stay, with every target re-pointed at the final /docs page
 *   so no legacy URL chains through a pre-move path.
 *
 * So 18 → 13 is not a lost URL: all 18 still answer, as the pre-move test at
 * the bottom of this file checks. If 13 drops, restore the entry.
 */
const DOCS_LEGACY_COLLISION_NOTE = RESTORE_DONT_RENUMBER + ' See the #365 note above the count.';

describe('legacy static routes', () => {
	it('prerenders every removed component page', async () => {
		const paths = (await componentEntries()).map(({ legacy }) => legacy);

		expect(paths, RESTORE_DONT_RENUMBER).toHaveLength(110);
		expect(new Set(paths).size).toBe(paths.length);
		expect(paths).toEqual(
			expect.arrayContaining([
				'forms/text-input',
				'ui/button',
				'hooks',
				'hooks/use-app-state',
				'memberships/membership-card',
				'permissions/permission-check',
				'roles/role-badge',
				'tenants/tenant-switcher'
			])
		);
	});

	it('prerenders every removed documentation page', async () => {
		const paths = (await docsEntries()).map(({ legacy }) => legacy);

		expect(paths, DOCS_LEGACY_COLLISION_NOTE).toHaveLength(13);
		expect(new Set(paths).size).toBe(paths.length);
		expect(paths).toEqual(
			expect.arrayContaining([
				'components/feedback/confirm-dialog',
				'components/feedback/progress-bar'
			])
		);
		// The five that left the table, and where each one went (#365).
		for (const owned of ['getting-started', 'agents', 'guides/multi-tenant-lifecycle']) {
			expect(paths).not.toContain(owned);
			expect(routesByPath.get(`/docs/${owned}`)?.isRedirect, owned).toBe(false);
		}
		expect(Object.keys(docsGuideAliases), DOCS_LEGACY_COLLISION_NOTE).toEqual([
			'expose-app-via-mcp',
			'add-semantic-search'
		]);
	});

	it('prerenders the module slugs that never became packages', async () => {
		const paths = (await moduleEntries()).map(({ slug }) => slug);

		// Every package redirects from /modules/<slug> automatically (the /modules
		// index itself redirects to /features, asserted below). These three
		// do not correspond to a package, so they exist only as hand-written
		// entries and are the ones a cleanup would quietly drop.
		expect(paths.filter((slug) => !packages.some((pkg) => pkg.slug === slug))).toEqual([
			'browser-ai',
			'template-sveltekit',
			'template-site-static-json'
		]);
		expect(paths, RESTORE_DONT_RENUMBER).toHaveLength(packages.length + 3);
		expect(new Set(paths).size).toBe(paths.length);
	});

	it('prerenders a redirect for every removed reference component page', async () => {
		const aliased = (await referenceComponentEntries())
			.map(({ slug }) => slug)
			.filter((slug) => !uiComponents.some((component) => component.slug === slug));

		expect(aliased, RESTORE_DONT_RENUMBER).toEqual(['invoice-line-editor']);
		// Every target must be a live generated page, never another alias.
		for (const target of Object.values(referenceComponentAliases)) {
			expect(uiComponents.some((component) => component.slug === target)).toBe(true);
		}
	});

	it('prerenders every pre-move /foundations alias redirect', async () => {
		const slugs = (await foundationEntries())
			.map(({ slug }) => slug)
			.filter((slug) => !foundationGuides.some((guide) => guide.slug === slug));

		// These three slugs are old foundation-guide names that were renamed. They
		// exist only as hand-written aliases in the pre-move redirect route
		// foundations/[slug]/+page.server.ts, so a cleanup there would silently
		// 404 a live URL rather than fail a build.
		expect(slugs, RESTORE_DONT_RENUMBER).toHaveLength(3);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect(slugs).toEqual(
			expect.arrayContaining(['app-model', 'identity-access', 'generated-surfaces'])
		);
	});

	it('prerenders every legacy /packages/<slug> page as a redirect to Reference (76 pages: 75 slugs + the index)', async () => {
		const paths = (await packageEntries()).map(({ slug }) => slug);

		// /packages/[slug] mirrors packages.ts exactly, with no hand-written
		// extras — /packages itself (the +76th page in this family) is a
		// separate, non-parametrized redirect route with nothing to enumerate.
		expect(paths, RESTORE_DONT_RENUMBER).toHaveLength(75);
		expect(paths).toHaveLength(packages.length);
		expect(new Set(paths).size).toBe(paths.length);
	});

	const redirectTarget = (load: () => never) => {
		try {
			load();
		} catch (response) {
			return response as { status: number; location: string };
		}
		throw new Error('expected a redirect');
	};

	it('redirects the retired /modules index to /features (#355, #366)', async () => {
		// /modules/<slug> (counted above) still goes to Reference; the index is a
		// single non-parametrized route, so there is nothing to enumerate.
		const { load } = await import('../../routes/modules/+page.server');

		expect(redirectTarget(load as () => never), RESTORE_DONT_RENUMBER).toMatchObject({
			status: 301,
			location: '/features'
		});
	});

	it('prerenders a 301 for every retired #358 /blocks page (#366)', async () => {
		// #366 deleted the /blocks landing, its 23 block pages and `blocks.ts`.
		// The block slugs are frozen in the route's `_aliases` because the data
		// they came from is gone, so this is the only record of them: a cleanup
		// there would 404 a live URL without a build warning.
		const slugs = (await blockEntries()).map(({ slug }) => slug);
		expect(slugs, RESTORE_DONT_RENUMBER).toHaveLength(23);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect(slugs).toEqual(expect.arrayContaining(['agent-tools', 'records', 'mobile']));

		const { load: landingLoad } = await import('../../routes/blocks/+page.server');
		expect(redirectTarget(landingLoad as () => never), RESTORE_DONT_RENUMBER).toMatchObject({
			status: 301,
			location: '/features'
		});

		// Each target is a live feature or section page, never another redirect.
		for (const [slug, target] of Object.entries(blockAliases)) {
			const route = routesByPath.get(target);
			expect(route, `/blocks/${slug} -> ${target} does not prerender.`).toBeDefined();
			expect(route?.isRedirect, `/blocks/${slug} -> ${target} is a redirect chain.`).toBe(false);
		}
	});

	it('prerenders a 301 for every retired pre-#375 /features page (#375)', () => {
		// #375 regrouped the map from the package tree to Sell, Buy, Make, ... and
		// froze the nine old sections and forty-nine old features in
		// `legacy-features.ts`: that table is the only record of those URLs, so a
		// cleanup there 404s a live URL without a build warning.
		expect(Object.keys(legacySectionTargets), RESTORE_DONT_RENUMBER).toHaveLength(9);
		expect(Object.keys(legacyFeatureTargets), RESTORE_DONT_RENUMBER).toHaveLength(51);

		const liveSections = new Set(featureSections.map((section) => section.id));
		for (const [section, target] of Object.entries(legacySectionTargets)) {
			expect(liveSections.has(section as never), `${section} is a live group again`).toBe(false);
			const route = routesByPath.get(`/features/${section}`);
			expect(route?.status, `/features/${section}`).toBe(301);
			expect(route?.target).toBe(target);
		}
		for (const [key, target] of Object.entries(legacyFeatureTargets)) {
			const route = routesByPath.get(`/features/${key}`);
			expect(route?.status, `/features/${key}`).toBe(301);
			expect(route?.target).toBe(target);
			// Each target is a live page, never another redirect.
			const destination = routesByPath.get(target);
			expect(destination, `/features/${key} -> ${target} does not prerender.`).toBeDefined();
			expect(destination?.isRedirect, `/features/${key} -> ${target} chains.`).toBe(false);
		}
	});

	it('redirects the legacy /packages and /faq singular pages to Reference', async () => {
		const { load: packagesLoad } = await import('../../routes/packages/+page.server');
		const { load: faqLoad } = await import('../../routes/faq/+page.server');

		expect(redirectTarget(packagesLoad as () => never)).toMatchObject({
			status: 301,
			location: '/docs/reference/packages'
		});
		expect(redirectTarget(faqLoad as () => never)).toMatchObject({
			status: 301,
			location: '/docs/reference/faq'
		});
	});

	it('redirects the two retired starter pages without chaining (#338)', async () => {
		// /starters/ground-up became /starters/smrt-start; /starters/saas was
		// retired with smrt-saas-starter. Both are single-file, non-parametrized
		// redirect routes, so there is nothing to enumerate — only the target,
		// which since #365 is the Getting Started page under /docs.
		const { load: groundUpLoad } = await import('../../routes/starters/ground-up/+page.server');
		const { load: saasLoad } = await import('../../routes/starters/saas/+page.server');

		expect(redirectTarget(groundUpLoad as () => never)).toMatchObject({
			status: 301,
			location: '/docs/getting-started/smrt-start'
		});
		expect(redirectTarget(saasLoad as () => never)).toMatchObject({
			status: 301,
			location: '/docs/getting-started'
		});

		// The docs legacy map's `migration` entry points straight at the live page,
		// never through /starters/ground-up (a 301 to a 301).
		const { load: docsLoad } = await import('../../routes/docs/[...legacy]/+page.server');
		expect(
			redirectTarget((() => docsLoad({ params: { legacy: 'migration' } } as never)) as () => never)
		).toMatchObject({ status: 301, location: '/docs/getting-started/smrt-start' });
	});
});

describe('the #365 move under /docs', () => {
	it('keeps a prerendered 301 for every moved page and slug', () => {
		const paths = docsMoveRedirectPaths();

		// 16 single pages, then each slug family as it stood before the move.
		// The foundations and reference-component families keep the aliases
		// (3 and 1) their pre-move routes already redirected.
		expect(movedStaticPaths, RESTORE_DONT_RENUMBER).toHaveLength(16);
		const familySizes = Object.fromEntries(
			Object.entries(movedSlugFamilies).map(([base, entries]) => [base, entries().length])
		);
		expect(familySizes, RESTORE_DONT_RENUMBER).toEqual({
			'/capabilities': capabilityGuides.length,
			'/foundations': foundationGuides.length + 3,
			'/guides': taskGuides.length,
			'/reference': referenceGuides.length,
			'/reference/components': uiComponents.length + Object.keys(referenceComponentAliases).length,
			'/reference/packages': packages.length,
			'/tooling': toolingGuides.length
		});
		expect(new Set(paths).size).toBe(paths.length);
		for (const path of paths) {
			expect(routesByPath.get(path)?.status, `${path} is not a prerendered 301`).toBe(301);
		}
	});

	/**
	 * Every URL the site served before the move — the route list of the
	 * pre-move tree, its dynamic slugs, and the old `/docs/[...legacy]`
	 * table — must still answer: either a page that prerenders (the URL was
	 * never moved, or a new /docs page now owns it), or one 301 straight to a
	 * page that prerenders. Never a 404, never a chain.
	 */
	it('answers every pre-move URL with a page or one 301 to a page', () => {
		const preMoveUrls = new Set<string>();
		for (const dir of preMoveRouteDirs) {
			if (!dir.includes('[')) {
				preMoveUrls.add(dir);
				continue;
			}
			const base = dir.slice(0, dir.lastIndexOf('/'));
			if (dir === '/docs/[...legacy]') {
				for (const key of preMoveDocsLegacyKeys) preMoveUrls.add(`/docs/${key}`);
				continue;
			}
			// Every other pre-move dynamic family still enumerates its slugs from
			// the same route file or data (a moved family through its stub).
			const family = movedSlugFamilies[base as keyof typeof movedSlugFamilies];
			const prefix = `${base}/`;
			const found = family
				? family().map(({ slug }) => `${prefix}${slug}`)
				: [...routesByPath.keys()].filter(
						(path) => path.startsWith(prefix) && !path.slice(prefix.length).includes('/')
					);
			expect(found.length, `${dir}: no slugs found`).toBeGreaterThan(0);
			for (const path of found) preMoveUrls.add(path);
		}
		expect(preMoveUrls.size).toBeGreaterThan(700);

		for (const url of preMoveUrls) {
			const route = routesByPath.get(url);
			expect(route, `${url} no longer prerenders — a hard 404 in production.`).toBeDefined();
			if (!route?.isRedirect) continue;
			// `/docs` was a 308 to `/` before the move; every redirect now is a 301.
			expect(route.status, `${url} must be a permanent 301`).toBe(301);
			const destination = routesByPath.get(stripQueryAndHash(route.target ?? ''));
			expect(destination, `${url} -> ${route.target} does not prerender.`).toBeDefined();
			expect(
				destination?.isRedirect,
				`${url} -> ${route.target} -> ${destination?.target}: redirect chain.`
			).toBe(false);
		}
	});

	it('sends every moved URL to its /docs counterpart', () => {
		const target = (path: string) => routesByPath.get(path)?.target;
		expect(target('/framework')).toBe('/docs/framework');
		expect(target('/reference/packages/smrt-core')).toBe('/docs/reference/packages/smrt-core');
		expect(target('/starters')).toBe('/docs/getting-started');
		expect(target('/foundations/app-model')).toBe('/docs/foundations/objects-and-collections');
		expect(target('/reference/components/invoice-line-editor')).toBe(
			'/docs/reference/components/money-invoice-editor'
		);
		expect(target('/docs/guides/expose-app-via-mcp')).toBe('/docs/guides/expose-your-app-over-mcp');
	});
});
