/**
 * The ⌘K palette's search index.
 *
 * Derived from the same `$lib/data` modules the pages render, so it is exact by
 * construction and needs no build step, no DOM crawl, and no network fetch —
 * it is a static import that ships in the app bundle.
 *
 * Depth comes from the structure the data already has: every guide, capability,
 * and reference section is a heading with a stable anchor, and every package
 * carries its component groups and component names. Page-level entries are
 * reused from `searchItems` so anything added to the navigation is indexed
 * automatically.
 */
import { toAnchorId } from '$lib/data/anchors';
import { capabilityGuides, foundationGuides, type Guide } from '$lib/data/guides';
import { docsNavigation, searchItems } from '$lib/data/navigation';
import { packages } from '$lib/data/packages';
import { referenceGuides } from '$lib/data/reference';
import { taskGuides } from '$lib/data/task-guides';
import { toolingGuides } from '$lib/data/tooling';

export type SearchKind = 'page' | 'section' | 'component';

export interface SearchEntry {
	/** Result title. */
	label: string;
	/** Destination, including a `#anchor` for section results. */
	href: string;
	/** Where the result lives, shown above the label. */
	breadcrumb?: string;
	description?: string;
	keywords?: string[];
	kind: SearchKind;
}

/** Sidebar group that owns a page, used as its breadcrumb. */
const groupByHref = new Map<string, string>(
	docsNavigation.flatMap((group) => group.items.map((item) => [item.href, group.label] as const))
);

/**
 * Every route family whose pages render through `GuidePage`.
 *
 * Page-level entries come from `searchItems` automatically, but section-level
 * entries do not: a new `Guide[]` route family must be added here, or its
 * headings will be missing from the palette while its pages appear.
 */
const guideTracks: { base: string; label: string; guides: Guide[] }[] = [
	{ base: '/foundations', label: 'Application foundations', guides: foundationGuides },
	{ base: '/capabilities', label: 'Capabilities', guides: capabilityGuides },
	{ base: '/guides', label: 'Task guides', guides: taskGuides },
	{ base: '/tooling', label: 'Developer tooling', guides: toolingGuides },
	{ base: '/reference', label: 'Reference', guides: referenceGuides }
];

const pageEntries: SearchEntry[] = searchItems.map((item) => ({
	label: item.label,
	href: item.href,
	breadcrumb:
		groupByHref.get(item.href) ?? (item.href.startsWith('/packages/') ? 'Packages' : undefined),
	description: item.description,
	keywords: item.keywords,
	kind: 'page'
}));

const sectionEntries: SearchEntry[] = guideTracks.flatMap(({ base, label, guides }) =>
	guides.flatMap((guide) =>
		guide.sections.map((section) => ({
			label: section.title,
			href: `${base}/${guide.slug}#${toAnchorId(section.title)}`,
			breadcrumb: `${label} · ${guide.navTitle ?? guide.title}`,
			description: section.intro,
			keywords: [...guide.packages, ...(section.points ?? [])],
			kind: 'section' as const
		}))
	)
);

const packageEntries: SearchEntry[] = packages.flatMap((pkg) => {
	const componentsHref = `/packages/${pkg.slug}?tab=components`;
	const entries: SearchEntry[] = [];

	for (const group of pkg.componentGroups) {
		entries.push({
			label: group.title,
			href: componentsHref,
			breadcrumb: `${pkg.name} · Components`,
			description: group.description,
			keywords: [group.importPath],
			kind: 'section'
		});

		for (const component of group.components) {
			entries.push({
				label: component,
				href: componentsHref,
				breadcrumb: `${pkg.name} · ${group.title}`,
				description: `Exported from ${group.importPath}`,
				keywords: [group.importPath, pkg.category],
				kind: 'component'
			});
		}
	}

	if (!pkg.componentGroups.length) {
		for (const component of pkg.components) {
			entries.push({
				label: component,
				href: componentsHref,
				breadcrumb: `${pkg.name} · Components`,
				description: `Exported from ${pkg.componentImport ?? pkg.name}`,
				keywords: [pkg.category],
				kind: 'component'
			});
		}
	}

	return entries;
});

function dedupe(entries: SearchEntry[]): SearchEntry[] {
	const seen = new Set<string>();
	return entries.filter((entry) => {
		const key = `${entry.kind}:${entry.href}:${entry.label}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

export const searchEntries: SearchEntry[] = dedupe([
	...pageEntries,
	...sectionEntries,
	...packageEntries
]);

/** Pages rank above sections, which rank above individual component names. */
const kindRank: Record<SearchKind, number> = { page: 0, section: 1, component: 2 };

function haystack(entry: SearchEntry): string {
	return [entry.label, entry.breadcrumb ?? '', entry.description ?? '', ...(entry.keywords ?? [])]
		.join(' ')
		.toLowerCase();
}

/** Precomputed once so keystrokes only do string comparisons. */
const indexed = searchEntries.map((entry) => ({
	entry,
	label: entry.label.toLowerCase(),
	haystack: haystack(entry)
}));

/**
 * Rank a single candidate. Lower is better; `null` means no match.
 *
 * A title hit always beats a body hit, so typing a heading verbatim surfaces
 * that heading rather than every page that mentions it in passing.
 */
function rank(candidate: (typeof indexed)[number], query: string, tokens: string[]): number | null {
	if (!tokens.every((token) => candidate.haystack.includes(token))) return null;

	if (candidate.label === query) return 0;
	if (candidate.label.startsWith(query)) return 1;
	if (candidate.label.includes(query)) return 2;
	if (tokens.every((token) => candidate.label.includes(token))) return 3;
	if ((candidate.entry.breadcrumb ?? '').toLowerCase().includes(query)) return 4;
	if ((candidate.entry.description ?? '').toLowerCase().includes(query)) return 5;
	return 6;
}

export function searchDocs(query: string, limit = 12): SearchEntry[] {
	const normalized = query.trim().toLowerCase();
	if (!normalized) {
		return searchEntries.filter((entry) => entry.kind === 'page').slice(0, 8);
	}

	const tokens = normalized.split(/\s+/).filter(Boolean);

	return indexed
		.map((candidate) => ({ candidate, score: rank(candidate, normalized, tokens) }))
		.filter((scored): scored is { candidate: (typeof indexed)[number]; score: number } => {
			return scored.score !== null;
		})
		.sort(
			(a, b) =>
				a.score - b.score ||
				kindRank[a.candidate.entry.kind] - kindRank[b.candidate.entry.kind] ||
				a.candidate.label.length - b.candidate.label.length ||
				a.candidate.label.localeCompare(b.candidate.label)
		)
		.slice(0, limit)
		.map((scored) => scored.candidate.entry);
}
