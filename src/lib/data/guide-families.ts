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
import { movedSlugs } from '$lib/data/doc-moves';
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

/**
 * Every prerendered `[slug]` route, keyed by the slugs it serves as pages.
 *
 * `entries()` also yields the old slugs of moved pages (`docMoves`) and a
 * route's `_aliases`, which are one-hop 301s, not pages; they are left out here.
 */
const slugRoutes = Object.entries(
	// Every guide family lives under /docs since #365; the pre-move
	// `src/routes/<family>/[slug]/` routes are redirect-only `+page.server.ts`
	// files and so never match this glob.
	import.meta.glob<{
		entries?: () => { slug: string }[];
		_aliases?: Record<string, string>;
	}>('/src/routes/docs/*/*/+page.ts', {
		eager: true
	})
)
	.filter(([path]) => path.includes('/[slug]/'))
	.map(([path, module]) => {
		// `/src/routes/docs/reference/[slug]/+page.ts` → `/docs/reference`
		const base = path.replace(/^\/src\/routes/, '').replace(/\/\[slug\]\/\+page\.ts$/, '');
		const moved = new Set([...movedSlugs(base), ...Object.keys(module._aliases ?? {})]);
		return {
			base,
			slugs: new Set(
				(module.entries?.() ?? []).map((entry) => entry.slug).filter((slug) => !moved.has(slug))
			)
		};
	});

/**
 * The routes that render a family's pages — `/docs/reference` for
 * `referenceGuides`; `/docs/capabilities` and `/docs/ui` for `capabilityGuides`,
 * which are split by `capabilityHome`.
 *
 * The route is the only place a family's URL is actually defined, and its
 * `entries()` maps the family array, so a route belongs to the family that
 * contains every page the route serves. Pairing runs from the route's side:
 * a route is claimed by the smallest family holding all of its slugs.
 * Otherwise a new family could be *matched* to a foreign route by sharing a
 * single slug and inherit that route's URL, satisfying the sidebar and sitemap
 * checks on a page belonging to someone else. Reading the prefix off the
 * sidebar has the same flaw.
 */
const familyRoutes = new Map<GuideFamily, { base: string; slugs: Set<string> }[]>();

for (const route of slugRoutes) {
	if (route.slugs.size === 0) continue;
	const owner = guideFamilies
		.filter((family) => {
			const slugs = new Set(family.guides.map((guide) => guide.slug));
			return [...route.slugs].every((slug) => slugs.has(slug));
		})
		.sort((a, b) => a.guides.length - b.guides.length)[0];
	if (owner) familyRoutes.set(owner, [...(familyRoutes.get(owner) ?? []), route]);
}

/** Every URL prefix a family's pages live under (more than one when it is split). */
export function familyBases(family: GuideFamily): string[] {
	return (familyRoutes.get(family) ?? []).map((route) => route.base);
}

/** Prefix for a family, or `undefined` when no `[slug]` route renders it. */
export function familyBase(family: GuideFamily): string | undefined {
	return familyBases(family)[0];
}

/** Site URL for a page, or `undefined` when no `[slug]` route renders it. */
export function guideHref({ family, guide }: GuidePage): string | undefined {
	const route = familyRoutes.get(family)?.find((candidate) => candidate.slugs.has(guide.slug));
	return route && `${route.base}/${guide.slug}`;
}

/** How a failure names the page it is complaining about. */
export function describePage({ family, guide }: GuidePage): string {
	return `${family.name} (${family.module}) → ${guide.slug}`;
}
