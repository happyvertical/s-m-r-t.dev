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
import { agentsTopics } from '$lib/data/agents';
import { frameworkTopics, type FrameworkTopic } from '$lib/data/framework';
import { capabilityGuides, foundationGuides, type Guide } from '$lib/data/guides';
import { interactionContent } from '$lib/data/interaction';
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

/**
 * The single-route landing pages: `/framework`, `/interaction`, and `/agents`
 * each render several topics on one page rather than one route per topic, so
 * — unlike `guideTracks`, where every guide already has its own page entry —
 * neither the topics nor their subsections get a palette entry unless this
 * track builds one. Framework's 22 topics and Interaction's 5 concepts had
 * none before this track existed.
 */
const landingTracks: {
	base: string;
	label: string;
	topics: readonly (FrameworkTopic | Guide)[];
}[] = [
	{ base: '/framework', label: 'Framework', topics: frameworkTopics },
	{ base: '/interaction', label: 'Interaction', topics: interactionContent.guides },
	{ base: '/agents', label: 'Agents', topics: agentsTopics }
];

/**
 * `FrameworkTopic` and `Guide` differ only in their body field —
 * `content: GuideSection[]` for `FrameworkTopic`, `sections: GuideSection[]`
 * for `Guide` — so this narrows on `content` to read subsections generically.
 * `FrameworkTopic.svelte` writes a real anchor id per content item
 * (`id={slug}-${toAnchorId(item.title)}`); `Guide`-shaped tracks (Interaction)
 * render their inner headings without ids, so they get topic-level entries
 * only — honest rather than a deep link the page cannot honor.
 */
const landingEntries: SearchEntry[] = landingTracks.flatMap(({ base, label, topics }) =>
	topics.flatMap((topic) => {
		const topicEntry: SearchEntry = {
			label: topic.navTitle ?? topic.title,
			href: `${base}#${topic.slug}`,
			breadcrumb: label,
			description: 'summary' in topic ? topic.summary : topic.lede,
			keywords: topic.packages,
			kind: 'section'
		};

		if (!('content' in topic)) return [topicEntry];

		const subsectionEntries: SearchEntry[] = topic.content.map((item) => ({
			label: item.title,
			href: `${base}#${topic.slug}-${toAnchorId(item.title)}`,
			breadcrumb: `${label} · ${topic.navTitle ?? topic.title}`,
			description: item.intro,
			keywords: [...topic.packages, ...(item.points ?? [])],
			kind: 'section' as const
		}));

		return [topicEntry, ...subsectionEntries];
	})
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
	...landingEntries,
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
	normalizedLabel: entry.label.toLowerCase(),
	haystack: haystack(entry)
}));

/**
 * Rank a single candidate. Lower is better; `null` means no match.
 *
 * A title hit always beats a body hit, so typing a heading verbatim surfaces
 * that heading rather than every page that mentions it in passing.
 *
 * A keyword that exactly equals the whole query is treated the same way: it
 * is how a former title (or a spelling variant) keeps resolving a page after
 * a rename, without the loose per-word keyword match below letting an
 * unrelated page that merely mentions one of those words outrank it.
 */
function rank(candidate: (typeof indexed)[number], query: string, tokens: string[]): number | null {
	if (!tokens.every((token) => candidate.haystack.includes(token))) return null;

	if (candidate.normalizedLabel === query) return 0;
	if ((candidate.entry.keywords ?? []).some((keyword) => keyword.toLowerCase() === query)) return 1;
	if (candidate.normalizedLabel.startsWith(query)) return 2;
	if (candidate.normalizedLabel.includes(query)) return 3;
	if (tokens.every((token) => candidate.normalizedLabel.includes(token))) return 4;
	if ((candidate.entry.breadcrumb ?? '').toLowerCase().includes(query)) return 5;
	if ((candidate.entry.description ?? '').toLowerCase().includes(query)) return 6;
	return 7;
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
				a.candidate.normalizedLabel.length - b.candidate.normalizedLabel.length ||
				a.candidate.normalizedLabel.localeCompare(b.candidate.normalizedLabel)
		)
		.slice(0, limit)
		.map((scored) => scored.candidate.entry);
}
