import { agentsTopics } from '$lib/data/agents';
import { capabilityGuides, foundationGuides } from '$lib/data/guides';
import { BUILD_PATH, DEMO_PATH, TOOLS_PATH, primaryLinks } from '$lib/data/doors';
import { featurePath, featureSectionPath, featureSections, features } from '$lib/data/features';
import { packages } from '$lib/data/packages';
import { referenceGuides } from '$lib/data/reference';
import { referenceFamilies } from '$lib/data/reference-families';
import { SITE_ORIGIN } from '$lib/site';
import { taskGuides } from '$lib/data/task-guides';
import { toolingGuides } from '$lib/data/tooling';

export interface NavigationItem {
	label: string;
	href: string;
	description?: string;
	keywords?: string[];
}

export interface NavigationGroup {
	label: string;
	items: NavigationItem[];
}

export type DocumentationSectionId =
	'docs' | 'framework' | 'ui' | 'tooling' | 'guides' | 'reference';

export interface DocumentationSection {
	id: DocumentationSectionId;
	label: string;
	title: string;
	href: string;
	description: string;
	groups: NavigationGroup[];
}

/** One header link: Docs · Features · Tools · Demo. */
export type PrimaryNavigationItem = NavigationItem;

const foundationItems: NavigationItem[] = foundationGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/docs/foundations/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));
const capabilityItems: NavigationItem[] = capabilityGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/docs/capabilities/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));
const taskItems: NavigationItem[] = taskGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/docs/guides/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));
const toolingItems: NavigationItem[] = toolingGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/docs/tooling/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));
const referenceItems: NavigationItem[] = referenceGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/docs/reference/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));
/**
 * The four canonical Reference hubs (D7) — API, Packages, Components, FAQ —
 * lead the Reference group ahead of the detail entries below. Filtered from
 * `referenceFamilies`, not hand-duplicated, so a family's label/href only
 * ever has one source of truth; `referenceFamilies`' own order already puts
 * these four first among themselves, so the filter needs no re-sort.
 * `DocsPanelSections.svelte` renders only the first several items per
 * section, so a hub sitting after all 17 `referenceItems` was invisible
 * outside its own page.
 */
const referenceHubIds = new Set(['api', 'packages', 'components', 'faq']);
const referenceHubItems: NavigationItem[] = referenceFamilies
	.filter((family) => referenceHubIds.has(family.id))
	.map((family) => ({ label: family.label, href: family.href }));
/**
 * The evidence ledger (#321 slice E) is a hand-written Reference page, not a
 * `referenceGuides` entry, so it is registered here by hand; `docsNavigation`
 * below feeds the docs panel and the palette's page entries.
 */
const referenceEvidenceItem: NavigationItem = {
	label: 'Evidence',
	href: '/docs/reference/evidence',
	description: 'Each site claim beside the released source it was verified in.',
	keywords: ['evidence', 'claims', 'sources', 'audit']
};
/**
 * The FEATURES door (#361): one group per section, its index page first and
 * then one entry per feature showcase. Feature pages are generated from
 * `features.ts`, not `Guide[]`, so they are registered here by hand. Like the
 * rest of the front-door pages they are showcases, not documentation: palette only, no docs panel.
 */
export const featureNavigation: NavigationGroup[] = featureSections.map((section) => ({
	label: section.word,
	items: [
		{
			label: section.word,
			href: featureSectionPath(section),
			description: section.hint,
			keywords: section.packages
		},
		...features
			.filter((item) => item.section === section.id)
			.map((item) => ({
				label: item.word,
				href: featurePath(item),
				description: item.hint,
				keywords: item.packages
			}))
	]
}));

/**
 * Where each capability page is listed. Every capability stays at
 * `/docs/capabilities/<slug>`; this table is the only place that says which
 * section claims it, and both the sidebar and
 * `documentationSectionForPathname` read it. A slug that is not here is a plain
 * Framework capability.
 *
 * - `ui`: the UI section.
 * - `agents-and-interaction`: Framework, listed with the Agents and Interaction
 *   pages. WebMCP sits here because it is the protocol-level mechanics behind
 *   the tool surfaces the Agents page maps.
 */
const capabilityPlacement = new Map<string, 'ui' | 'agents-and-interaction'>([
	['application-shell', 'ui'],
	['field-policies', 'ui'],
	['policy-aware-forms', 'ui'],
	['field-policy-operations', 'ui'],
	['webmcp', 'agents-and-interaction'],
	['agent-legible-applications', 'agents-and-interaction'],
	['agent-assisted-forms', 'agents-and-interaction'],
	['learning-agents', 'agents-and-interaction']
]);

const placementOfSlug = (slug: string) => capabilityPlacement.get(slug);
const placementOf = (item: NavigationItem) => placementOfSlug(item.href.split('/').at(-1) ?? '');

const frameworkCapabilityItems = capabilityItems.filter((item) => !placementOf(item));
const agentsAndInteractionCapabilityItems = capabilityItems.filter(
	(item) => placementOf(item) === 'agents-and-interaction'
);
const uiCapabilityItems = capabilityItems.filter((item) => placementOf(item) === 'ui');

const itemByHref = (items: NavigationItem[], href: string): NavigationItem => {
	const item = items.find((candidate) => candidate.href === href);
	if (!item) throw new Error(`Navigation item not found: ${href}`);
	return item;
};

const whyItem: NavigationItem = {
	label: 'Home',
	href: '/',
	description:
		'One application model supplies storage, forms, APIs, commands, permissions, and agent tools.',
	keywords: [
		'smrt',
		's-m-r-t',
		'why',
		// Former nav label and its spelling variants: this item was "Why
		// smrt?" before the homepage rebuild, and these exact-phrase
		// aliases keep those queries resolving here now that the visible
		// label is "Home". The hyphenated spelling stays as an alias because
		// people still search for it.
		'why smrt',
		'why s-m-r-t',
		'agent-native',
		'agent-legible',
		'governed',
		'awareness is not authority',
		'Software as Agentic Domain Logic',
		'SAADL',
		// The visible H1 and the hero's subject, so a visitor who read the page
		// name or the lede can get back to it from search.
		'application stack',
		'agentic software'
	]
};

/** The map flow (map, selection, warp into build-a-boilerplate), moved from `/`. */
const demoItem: NavigationItem = {
	label: 'Demo',
	href: DEMO_PATH,
	description: 'Pick features on the map, then send the selection to build-a-boilerplate.',
	keywords: ['demo', 'features map', 'map', 'galaxy', 'selection', 'warp']
};

/** The tools index; build-a-boilerplate is listed there. */
const toolsItem: NavigationItem = {
	label: 'Tools',
	href: TOOLS_PATH,
	description: 'Tools that plan and start a smrt application, and the tooling docs.',
	keywords: ['tools', 'planner', 'cli', 'build-a-boilerplate', 'tooling']
};

/** The `/docs` landing (#365), the entry into every technical section. */
const docsItem: NavigationItem = {
	label: 'Docs overview',
	href: '/docs',
	description: 'Start as a developer or point an agent at the machine-readable entry points.',
	keywords: ['docs', 'documentation', 'llms.txt', 'agent docs', 'developers', 'agents']
};

/** The two topic pages that used to be sections of their own (#399). */
const agentsPageItem: NavigationItem = {
	label: 'Agents overview',
	href: '/docs/framework/agents',
	description: 'See where agents connect, what they may do, and whose authority they carry.'
};
const interactionPageItem: NavigationItem = {
	label: 'Interaction overview',
	href: '/docs/framework/interaction',
	description: 'See how persons and application agents communicate and share control.'
};

const sectionOverviewItems = new Map<DocumentationSectionId, NavigationItem>([
	['docs', docsItem],
	[
		'framework',
		{
			label: 'Framework overview',
			href: '/docs/framework',
			description: 'See how the application model connects framework mechanisms and interfaces.'
		}
	],
	[
		'ui',
		{
			label: 'UI overview',
			href: '/docs/ui',
			description: 'See the components that make application meaning, state, and change visible.'
		}
	],
	[
		'tooling',
		{
			label: 'Tooling overview',
			href: '/docs/tooling',
			description: 'Choose tools for developer and coding-agent workflows.'
		}
	],
	[
		'guides',
		{
			label: 'All guides',
			href: '/docs/guides',
			description: 'Use task procedures for one complete result at a time.'
		}
	],
	[
		'reference',
		{
			label: 'Reference overview',
			href: '/docs/reference',
			description: 'Find exhaustive package, interface, configuration, and contract details.'
		}
	]
]);

const sectionOverviewItem = (id: DocumentationSectionId): NavigationItem => {
	const item = sectionOverviewItems.get(id);
	if (!item) throw new Error(`Section overview item not found: ${id}`);
	return item;
};

/** Getting Started moved from the old starters path to `/docs/getting-started` in #365. */
const gettingStartedItems: NavigationItem[] = [
	{ label: 'Getting Started', href: '/docs/getting-started' },
	{ label: 'build-a-boilerplate', href: BUILD_PATH },
	{ label: 'Start from a cookbook', href: '/docs/getting-started#cookbook' },
	{ label: 'smrt-start', href: '/docs/getting-started/smrt-start' }
];

const relatedGuides = (...hrefs: string[]): NavigationGroup => ({
	label: 'Related guides',
	items: [...hrefs.map((href) => itemByHref(taskItems, href)), sectionOverviewItem('guides')]
});

export const documentationSections: DocumentationSection[] = [
	{
		id: 'docs',
		label: 'Docs',
		title: 'Docs',
		href: '/docs',
		description: 'Start as a developer or point an agent at the machine-readable entry points.',
		groups: [
			{ label: 'For developers', items: gettingStartedItems },
			{
				label: 'For agents',
				items: [
					itemByHref(toolingItems, '/docs/tooling/app-mcp'),
					itemByHref(toolingItems, '/docs/tooling/dev-mcp'),
					referenceEvidenceItem
				]
			},
			{
				label: 'Sections',
				items: [
					sectionOverviewItem('framework'),
					sectionOverviewItem('ui'),
					sectionOverviewItem('tooling'),
					sectionOverviewItem('guides'),
					sectionOverviewItem('reference')
				]
			}
		]
	},
	{
		id: 'framework',
		label: 'Framework',
		title: 'Framework',
		href: '/docs/framework',
		description:
			'Learn how models, data, identity, permissions, and generated interfaces fit together.',
		groups: [
			{
				label: 'Foundations',
				items: [{ label: 'Foundations overview', href: '/docs/foundations' }, ...foundationItems]
			},
			{
				label: 'Capabilities',
				items: [
					{ label: 'Capabilities overview', href: '/docs/capabilities' },
					...frameworkCapabilityItems
				]
			},
			{
				label: 'Agents and interaction',
				items: [
					agentsPageItem,
					interactionPageItem,
					...agentsAndInteractionCapabilityItems,
					{ label: 'Application MCP', href: '/docs/tooling/app-mcp' }
				]
			},
			{
				label: 'On the agents page',
				items: agentsTopics.map((topic) => ({
					label: topic.navTitle,
					href: `/docs/framework/agents#${topic.slug}`
				}))
			},
			relatedGuides('/docs/guides/multi-tenant-lifecycle', '/docs/guides/semantic-search'),
			{
				label: 'Reference',
				items: [
					{ label: 'Generated interfaces', href: '/docs/reference/interfaces' },
					{ label: 'Authorization model', href: '/docs/reference/authorization' },
					{ label: 'Security defaults', href: '/docs/reference/security' },
					sectionOverviewItem('reference')
				]
			}
		]
	},
	{
		id: 'ui',
		label: 'UI',
		title: 'UI',
		href: '/docs/ui',
		description: 'Explore the visible components and patterns that implement governed interaction.',
		groups: [
			{
				label: 'Components and shell',
				items: [
					{
						label: 'Foundation components',
						href: '/docs/reference/packages/smrt-ui?tab=components'
					},
					...uiCapabilityItems,
					{ label: 'Working playground', href: '/playground' },
					{ label: 'build-a-boilerplate', href: BUILD_PATH }
				]
			},
			{
				label: 'Related material',
				items: [
					{ label: 'Field policy API', href: '/docs/reference/field-policies' },
					{ label: 'Package Reference', href: '/docs/reference/packages' },
					sectionOverviewItem('guides')
				]
			}
		]
	},
	{
		id: 'tooling',
		label: 'Tooling',
		title: 'Tooling',
		href: '/docs/tooling',
		description:
			'Use development tools, framework knowledge, and MCP surfaces for the correct job.',
		groups: [
			{ label: 'Developer and coding-agent tools', items: toolingItems },
			relatedGuides('/docs/guides/expose-your-app-over-mcp', '/docs/guides/testing-your-app'),
			{
				label: 'Reference',
				items: [
					{ label: 'Generated interfaces', href: '/docs/reference/interfaces' },
					{ label: 'Testing', href: '/docs/reference/testing' },
					sectionOverviewItem('reference')
				]
			}
		]
	},
	{
		id: 'guides',
		label: 'Guides',
		title: 'Guides',
		href: '/docs/guides',
		description:
			'Follow task procedures and keep concept and reference details in their source sections.',
		groups: [
			{ label: 'Task guides', items: taskItems },
			{ label: 'Getting Started', items: gettingStartedItems },
			{
				label: 'Look up details',
				items: [sectionOverviewItem('framework'), sectionOverviewItem('reference')]
			}
		]
	},
	{
		id: 'reference',
		label: 'Reference',
		title: 'Reference',
		href: '/docs/reference',
		description: 'Look up exhaustive package, interface, configuration, and contract details.',
		groups: [
			{
				label: 'Reference families',
				items: [
					...referenceItems,
					referenceEvidenceItem,
					{ label: 'FAQ', href: '/docs/reference/faq' }
				]
			},
			{
				label: 'Generated inventories',
				items: [
					{ label: 'Package Reference', href: '/docs/reference/packages' },
					{ label: 'UI Component Reference', href: '/docs/reference/components' }
				]
			},
			{ label: 'Related guides', items: [sectionOverviewItem('guides')] }
		]
	}
];

/**
 * The header navigation: Docs · Features · Tools · Demo, from `doors.ts`.
 * Every technical section is reached through Docs, whose panel
 * (`DocsPanelSections.svelte`) carries the section map.
 */
export const primaryNavigation: PrimaryNavigationItem[] = primaryLinks.map((link) => ({
	...link
}));

export function getDocumentationSection(id: DocumentationSectionId): DocumentationSection {
	const section = documentationSections.find((candidate) => candidate.id === id);
	if (!section) throw new Error(`Documentation section not found: ${id}`);
	return section;
}

/** True for `/docs` and every page under it — the only pages with the docs panel. */
export function isDocsPathname(pathname: string): boolean {
	return pathname === '/docs' || pathname.startsWith('/docs/');
}

const underPath = (pathname: string, base: string) =>
	pathname === base || pathname.startsWith(`${base}/`);

export function documentationSectionForPathname(pathname: string): DocumentationSection {
	if (underPath(pathname, '/docs/framework') || underPath(pathname, '/docs/foundations')) {
		return getDocumentationSection('framework');
	}
	if (underPath(pathname, '/docs/ui')) return getDocumentationSection('ui');
	if (underPath(pathname, '/docs/guides')) return getDocumentationSection('guides');
	if (underPath(pathname, '/docs/tooling')) return getDocumentationSection('tooling');
	if (underPath(pathname, '/docs/capabilities')) {
		// `/docs/capabilities/<slug>`
		const slug = pathname.split('/')[3] ?? '';
		if (placementOfSlug(slug) === 'ui') return getDocumentationSection('ui');
		return getDocumentationSection('framework');
	}
	if (underPath(pathname, '/docs/reference')) return getDocumentationSection('reference');
	// `/docs` itself and Getting Started, plus any page outside Docs.
	return getDocumentationSection('docs');
}

export function isPrimaryNavigationActive(item: PrimaryNavigationItem, pathname: string): boolean {
	// build-a-boilerplate is a tool, so Tools stays lit while it is open.
	if (item.href === TOOLS_PATH && underPath(pathname, BUILD_PATH)) return true;
	return underPath(pathname, item.href);
}

export function isNavigationItemActive(href: string, pathname: string, hash = ''): boolean {
	const url = new URL(href, SITE_ORIGIN);
	if (url.pathname === '/') {
		return pathname === '/' && (url.hash ? url.hash === hash : hash === '');
	}
	// A same-page anchor (e.g. /docs/framework/agents#topic) only owns the current location when
	// its hash matches; without this, every anchor sharing that pathname would
	// match at once. A plain page link (no hash) keeps the prefix match below,
	// which also covers a section overview link staying active on its nested pages.
	if (url.hash && pathname === url.pathname) {
		return url.hash === hash;
	}
	return pathname === url.pathname || pathname.startsWith(`${url.pathname}/`);
}

export function isNavigationGroupActive(
	group: NavigationGroup,
	pathname: string,
	hash = ''
): boolean {
	return group.items.some((item) => isNavigationItemActive(item.href, pathname, hash));
}

/**
 * Complete page registration for search and the linear reading track.
 *
 * `docs-panel.ts` also joins this list with `documentationSections` to
 * derive the application panel's whole-site section map.
 */
export const docsNavigation: NavigationGroup[] = [
	{
		label: 'Docs',
		items: [
			docsItem,
			// build-a-boilerplate is not a documentation page; it is registered
			// for the palette in `searchItems` below, so it is not repeated here.
			...gettingStartedItems.filter((item) => item.href !== BUILD_PATH)
		]
	},
	{
		label: 'Framework',
		items: [
			sectionOverviewItem('framework'),
			{ label: 'Foundations overview', href: '/docs/foundations' },
			...foundationItems,
			{ label: 'Capabilities overview', href: '/docs/capabilities' },
			...frameworkCapabilityItems,
			agentsPageItem,
			interactionPageItem,
			...agentsAndInteractionCapabilityItems
		]
	},
	{ label: 'UI', items: [sectionOverviewItem('ui'), ...uiCapabilityItems] },
	{ label: 'Tooling', items: [sectionOverviewItem('tooling'), ...toolingItems] },
	{ label: 'Guides', items: [sectionOverviewItem('guides'), ...taskItems] },
	{
		label: 'Reference',
		items: [
			sectionOverviewItem('reference'),
			...referenceHubItems,
			...referenceItems,
			referenceEvidenceItem
		]
	}
];

export const searchItems: NavigationItem[] = [
	...docsNavigation.flatMap((group) => group.items),
	// The homepage, the feature showcases and
	// build-a-boilerplate are not documentation pages, so they are outside
	// `docsNavigation` (the reading track and the docs panel) and registered
	// for the palette here, like the package entries below.
	whyItem,
	demoItem,
	toolsItem,
	...featureNavigation.flatMap((group) => group.items),
	{
		label: 'build-a-boilerplate',
		href: BUILD_PATH,
		description:
			'Add recipes or packages and an app mock-up assembles around them; export the cookbook it produces to start a project.',
		// Older wording stays searchable: the page used to be called the planner.
		keywords: [
			'boilerplate',
			'planner',
			'app planner',
			'recipes',
			'cookbook',
			'mock-up',
			'smrt-planner'
		]
	},
	...packages.map((pkg) => ({
		label: pkg.name,
		href: `/docs/reference/packages/${pkg.slug}`,
		description: pkg.summary,
		keywords: [pkg.category, pkg.kind, ...pkg.components]
	}))
];
