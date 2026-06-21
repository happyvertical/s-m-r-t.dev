/**
 * Single source of truth for the unified left sidebar and the prev/next
 * track navigation (issue #101).
 *
 * The sidebar is shared across the docs / modules / components / reference
 * sections. The "Concepts" and "Guides" groups double as ordered *tracks*:
 * `PrevNext.svelte` walks them so those pages are linearly navigable.
 *
 * Coordination note: the concept pages (#97) and task guides (#98) are
 * authored by sibling units. The hrefs below are the agreed canonical slugs
 * for those pages — keep this list and those routes in lockstep.
 */
import { categories } from '$lib/data/components';

export interface NavLink {
	label: string;
	href: string;
}

export interface NavGroup {
	title: string;
	/** Optional link for the group heading itself (e.g. a section overview). */
	href?: string;
	items: NavLink[];
	/**
	 * When true, this group is an ordered track that `PrevNext` can walk.
	 * Used for the Concepts and Guides tracks.
	 */
	track?: boolean;
}

export interface NavSection {
	/** Top-level section id, used to pick which groups a route should show. */
	id: 'docs' | 'modules' | 'components' | 'reference';
	groups: NavGroup[];
}

// --- Documentation: getting started + the two ordered tracks ----------------

export const conceptsTrack: NavGroup = {
	title: 'Concepts',
	track: true,
	items: [
		{ label: 'Objects', href: '/docs/objects' },
		{ label: 'Collections', href: '/docs/collections' },
		{ label: 'Agents', href: '/docs/agents' },
		{ label: 'Testing', href: '/docs/concepts/testing' },
		{ label: 'Configuration', href: '/docs/concepts/configuration' },
		{ label: 'Multi-tenancy', href: '/docs/concepts/multi-tenancy' },
		{ label: 'Context Memory', href: '/docs/concepts/context-memory' },
		{ label: 'Semantic Search', href: '/docs/concepts/semantic-search' }
	]
};

export const guidesTrack: NavGroup = {
	title: 'Guides',
	track: true,
	items: [
		{ label: 'Multi-tenant SaaS lifecycle', href: '/docs/guides/multi-tenant-lifecycle' },
		{ label: 'Expose your app via MCP', href: '/docs/guides/expose-via-mcp' },
		{ label: 'Add semantic search', href: '/docs/guides/semantic-search' }
	]
};

const docsGroups: NavGroup[] = [
	{
		title: 'Getting Started',
		items: [
			{ label: 'Introduction', href: '/docs' },
			{ label: 'Getting Started', href: '/docs/getting-started' },
			{ label: 'Migration', href: '/docs/migration' }
		]
	},
	conceptsTrack,
	guidesTrack
];

// --- Modules: mirrors the curated grouping on /modules ----------------------

const modulesGroups: NavGroup[] = [
	{
		title: 'Modules',
		href: '/modules',
		items: [{ label: 'All modules', href: '/modules' }]
	},
	{
		title: 'Foundation',
		items: [
			{ label: 'smrt-core', href: '/modules/smrt-core' },
			{ label: 'smrt-config', href: '/modules/smrt-config' },
			{ label: 'smrt-cli', href: '/modules/smrt-cli' },
			{ label: 'smrt-types', href: '/modules/smrt-types' },
			{ label: 'smrt-vitest', href: '/modules/smrt-vitest' },
			{ label: 'smrt-scanner', href: '/modules/smrt-scanner' },
			{ label: 'smrt-tenancy', href: '/modules/smrt-tenancy' }
		]
	},
	{
		title: 'Agents & Runtime',
		items: [
			{ label: 'smrt-agents', href: '/modules/smrt-agents' },
			{ label: 'smrt-jobs', href: '/modules/smrt-jobs' },
			{ label: 'smrt-users', href: '/modules/smrt-users' },
			{ label: 'smrt-profiles', href: '/modules/smrt-profiles' }
		]
	},
	{
		title: 'Content & Media',
		items: [
			{ label: 'smrt-content', href: '/modules/smrt-content' },
			{ label: 'smrt-messages', href: '/modules/smrt-messages' },
			{ label: 'smrt-chat', href: '/modules/smrt-chat' },
			{ label: 'smrt-assets', href: '/modules/smrt-assets' },
			{ label: 'smrt-images', href: '/modules/smrt-images' },
			{ label: 'smrt-video', href: '/modules/smrt-video' },
			{ label: 'smrt-voice', href: '/modules/smrt-voice' }
		]
	},
	{
		title: 'Business',
		items: [
			{ label: 'smrt-commerce', href: '/modules/smrt-commerce' },
			{ label: 'smrt-products', href: '/modules/smrt-products' },
			{ label: 'smrt-ads', href: '/modules/smrt-ads' },
			{ label: 'smrt-affiliates', href: '/modules/smrt-affiliates' },
			{ label: 'smrt-ledgers', href: '/modules/smrt-ledgers' },
			{ label: 'smrt-analytics', href: '/modules/smrt-analytics' }
		]
	},
	{
		title: 'Domain',
		items: [
			{ label: 'smrt-events', href: '/modules/smrt-events' },
			{ label: 'smrt-places', href: '/modules/smrt-places' },
			{ label: 'smrt-properties', href: '/modules/smrt-properties' },
			{ label: 'smrt-facts', href: '/modules/smrt-facts' },
			{ label: 'smrt-social', href: '/modules/smrt-social' },
			{ label: 'smrt-projects', href: '/modules/smrt-projects' },
			{ label: 'smrt-tags', href: '/modules/smrt-tags' },
			{ label: 'smrt-languages', href: '/modules/smrt-languages' },
			{ label: 'smrt-sites', href: '/modules/smrt-sites' }
		]
	},
	{
		title: 'Tooling',
		items: [
			{ label: 'smrt-svelte', href: '/modules/smrt-svelte' },
			{ label: 'browser-ai', href: '/modules/browser-ai' },
			{ label: 'smrt-dev-mcp', href: '/modules/smrt-dev-mcp' },
			{ label: 'smrt-features', href: '/modules/smrt-features' },
			{ label: 'smrt-prompts', href: '/modules/smrt-prompts' }
		]
	}
];

// --- Components: built from the component category data ----------------------

const componentsGroups: NavGroup[] = [
	{
		title: 'Components',
		href: '/components',
		items: [{ label: 'Overview', href: '/components' }]
	},
	...categories.map((cat) => ({
		title: cat.name,
		items: cat.components.map((c) => ({
			label: c.name,
			href: `/components/${cat.slug}/${c.slug}`
		}))
	}))
];

// --- Reference ---------------------------------------------------------------

const referenceGroups: NavGroup[] = [
	{
		title: 'Reference',
		href: '/reference',
		items: [
			{ label: 'API Reference', href: '/reference' },
			{ label: 'Themes', href: '/themes' },
			{ label: 'FAQ', href: '/faq' }
		]
	}
];

export const navSections: NavSection[] = [
	{ id: 'docs', groups: docsGroups },
	{ id: 'modules', groups: modulesGroups },
	{ id: 'components', groups: componentsGroups },
	{ id: 'reference', groups: referenceGroups }
];

/** Pick the sidebar section for a given pathname. */
export function sectionForPath(pathname: string): NavSection | undefined {
	const top = pathname.split('/')[1];
	return navSections.find((s) => s.id === top);
}

/** Flat, ordered list of the pages in a track (for prev/next). */
export interface TrackNeighbor {
	track: NavGroup;
	prev: NavLink | null;
	next: NavLink | null;
}

/**
 * If `pathname` is a member of one of the ordered tracks, return that track
 * plus its prev/next neighbours. Path matching ignores trailing slashes and
 * hash fragments. Returns null when the page is not in any track.
 */
export function trackNeighbors(pathname: string): TrackNeighbor | null {
	const normalize = (p: string) => p.replace(/#.*$/, '').replace(/\/$/, '') || '/';
	const current = normalize(pathname);
	for (const group of [conceptsTrack, guidesTrack]) {
		const idx = group.items.findIndex((item) => normalize(item.href) === current);
		if (idx !== -1) {
			return {
				track: group,
				prev: idx > 0 ? group.items[idx - 1] : null,
				next: idx < group.items.length - 1 ? group.items[idx + 1] : null
			};
		}
	}
	return null;
}
