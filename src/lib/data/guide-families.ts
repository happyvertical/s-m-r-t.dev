/**
 * Every `Guide[]` route family in `$lib/data`, discovered rather than listed.
 *
 * A new family is more than a data file: a `[slug]` route, `navigation.ts`,
 * `guideTracks` in `search.ts`, and `sitemap.xml/+server.ts` each need it added
 * by hand, and none of the four is auto-discovered. A test that hand-writes the
 * family list to check those registrations reproduces the same gap one layer
 * up — the family nobody registered is also the family nobody added to the
 * test, so it passes trivially.
 *
 * So the list is derived from the modules themselves. Export a `Guide[]` from
 * a `$lib/data` module and `registration.test.ts` starts demanding all four
 * registrations for it on the next run.
 */
import type { Guide } from '$lib/data/guides';

export interface GuideFamily {
	/** Module the family is exported from, e.g. `task-guides.ts`. */
	module: string;
	/** Exported binding, e.g. `taskGuides`. */
	name: string;
	guides: Guide[];
}

/** Sibling data modules, minus this one and the tests that consume it. */
const dataModules = import.meta.glob<Record<string, unknown>>(
	['./*.ts', '!./guide-families.ts', '!./*.test.ts'],
	{ eager: true }
);

/**
 * `Guide` structurally, without importing every module's element type. A
 * `SmrtPackage` also carries a `slug`, so `sections` and `lede` are what
 * separate the two.
 */
function isGuideArray(value: unknown): value is Guide[] {
	return (
		Array.isArray(value) &&
		value.length > 0 &&
		value.every(
			(item) =>
				typeof item === 'object' &&
				item !== null &&
				typeof (item as Guide).slug === 'string' &&
				typeof (item as Guide).lede === 'string' &&
				Array.isArray((item as Guide).sections)
		)
	);
}

export const guideFamilies: GuideFamily[] = Object.entries(dataModules)
	.flatMap(([path, module]) =>
		Object.entries(module)
			.filter((entry): entry is [string, Guide[]] => isGuideArray(entry[1]))
			.map(([name, guides]) => ({ module: path.replace(/^\.\//, ''), name, guides }))
	)
	.sort((a, b) => a.module.localeCompare(b.module) || a.name.localeCompare(b.name));

/** One entry per guide page, tagged with the family it came from. */
export const guidePages = guideFamilies.flatMap((family) =>
	family.guides.map((guide) => ({ family, guide }))
);

export type GuidePage = (typeof guidePages)[number];

/** Every prerendered `[slug]` route, keyed by the slugs its `entries()` yields. */
const slugRoutes = Object.entries(
	import.meta.glob<{ entries?: () => { slug: string }[] }>('/src/routes/*/*/+page.ts', {
		eager: true
	})
)
	.filter(([path]) => path.includes('/[slug]/'))
	.map(([path, module]) => ({
		// `/src/routes/reference/[slug]/+page.ts` → `/reference`
		base: `/${path.split('/')[3]}`,
		slugs: new Set((module.entries?.() ?? []).map((entry) => entry.slug))
	}))
	.sort((a, b) => a.slugs.size - b.slugs.size);

/**
 * The URL prefix a family's pages live under — `/reference` for
 * `referenceGuides` — resolved through the route that renders them.
 *
 * The route is the only place a family's URL is actually defined, and its
 * `entries()` maps the family array, so the route that prerenders all of a
 * family's slugs is that family's route. Containment rather than equality
 * because a route may add slugs of its own: `/foundations` also prerenders
 * three renamed aliases that redirect.
 *
 * Pairing runs from the route's side, and one route claims one family — the
 * one it covers with the fewest slugs to spare. Otherwise a new family could
 * be *contained* in a foreign route by sharing a single slug (`collections` is
 * already both a capability page and a reference page), inherit that route's
 * URL, and satisfy the sidebar and sitemap checks below on a page belonging to
 * someone else. Reading the prefix off the sidebar has the same flaw.
 */
const familyBases = new Map<GuideFamily, string>();

for (const route of slugRoutes) {
	const owner = guideFamilies
		.filter((family) => family.guides.every((guide) => route.slugs.has(guide.slug)))
		.sort((a, b) => b.guides.length - a.guides.length)[0];
	if (owner && !familyBases.has(owner)) familyBases.set(owner, route.base);
}

/** Prefix for a family, or `undefined` when no `[slug]` route renders it. */
export function familyBase(family: GuideFamily): string | undefined {
	return familyBases.get(family);
}

/** Site URL for a page, or `undefined` when no `[slug]` route renders its family. */
export function guideHref({ family, guide }: GuidePage): string | undefined {
	const base = familyBases.get(family);
	return base === undefined ? undefined : `${base}/${guide.slug}`;
}

/** How a failure names the page it is complaining about. */
export function describePage({ family, guide }: GuidePage): string {
	return `${family.name} (${family.module}) → ${guide.slug}`;
}
