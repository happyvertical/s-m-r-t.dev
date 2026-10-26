import { agentsTopics } from '$lib/data/agents';
import { capabilityGuides, foundationGuides } from '$lib/data/guides';
import { featurePath, featureSectionPath, featureSections, features } from '$lib/data/features';
import { packages } from '$lib/data/packages';
import { referenceGuides } from '$lib/data/reference';
import { referenceFamilies } from '$lib/data/reference-families';
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
	'docs' | 'framework' | 'agents' | 'interaction' | 'ui' | 'tooling' | 'guides' | 'reference';

export interface DocumentationSection {
	id: DocumentationSectionId;
	label: string;
	title: string;
	href: string;
	description: string;
	groups: NavigationGroup[];
}

/** One of the three doors (#361): BUILD · FEATURES · DOCS. */
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

const interactionCapabilitySlugs = new Set([
	'agent-legible-applications',
	'agent-assisted-forms',
	'learning-agents'
]);
const uiCapabilitySlugs = new Set([
	'application-shell',
	'field-policies',
	'policy-aware-forms',
	'field-policy-operations'
]);
/**
 * The WebMCP deep-dive lives under Agents, not Interaction: it is the
 * protocol-level mechanics behind the tool surfaces `/docs/agents` maps, not a
 * moment-to-moment interaction concept. The URL is unchanged
 * (`/docs/capabilities/webmcp`) — only which primary section claims it moves.
 */
const agentsCapabilitySlugs = new Set(['webmcp']);

const frameworkCapabilityItems = capabilityItems.filter(
	(item) =>
		!interactionCapabilitySlugs.has(item.href.split('/').at(-1) ?? '') &&
		!uiCapabilitySlugs.has(item.href.split('/').at(-1) ?? '') &&
		!agentsCapabilitySlugs.has(item.href.split('/').at(-1) ?? '')
);
const interactionCapabilityItems = capabilityItems.filter((item) =>
	interactionCapabilitySlugs.has(item.href.split('/').at(-1) ?? '')
);
const uiCapabilityItems = capabilityItems.filter((item) =>
	uiCapabilitySlugs.has(item.href.split('/').at(-1) ?? '')
);
const agentsCapabilityItems = capabilityItems.filter((item) =>
	agentsCapabilitySlugs.has(item.href.split('/').at(-1) ?? '')
);

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
		// s-m-r-t?" before the homepage rebuild, and these exact-phrase
		// aliases keep those queries resolving here now that the visible
		// label is "Home".
		'why s-m-r-t',
		'why smrt',
		'agent-native',
		'agent-legible',
		'governed',
		'awareness is not authority',
		'Software as Agentic Domain Logic',
		'SAADL',
		// The visible H1 and the hero's subject, so a visitor who read the page
		// name or the lede can get back to it from search.
		'application stack',
		'agentic software',
		// The three doors below the feature map.
		'features map'
	]
};

/** The `/docs` landing (#365), the entry into every technical section. */
const docsItem: NavigationItem = {
	label: 'Docs overview',
	href: '/docs',
	description: 'Start as a developer or point an agent at the machine-readable entry points.',
	keywords: ['docs', 'documentation', 'llms.txt', 'agent docs', 'developers', 'agents']
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
		'agents',
		{
			label: 'Agents overview',
			href: '/docs/agents',
			description: 'See where agents connect, what they may do, and whose authority they carry.'
		}
	],
	[
		'interaction',
		{
			label: 'Interaction overview',
			href: '/docs/interaction',
			description: 'See how persons and application agents communicate and share control.'
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
	{ label: 'build-a-boilerplate', href: '/build-a-boilerplate' },
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
					sectionOverviewItem('agents'),
					sectionOverviewItem('interaction'),
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
				label: 'Application foundations',
				items: [{ label: 'Foundations overview', href: '/docs/foundations' }, ...foundationItems]
			},
			{
				label: 'Framework capabilities',
				items: [
					{ label: 'Capabilities overview', href: '/docs/capabilities' },
					...frameworkCapabilityItems
				]
			},
			relatedGuides('/docs/guides/multi-tenant-lifecycle', '/docs/guides/semantic-search'),
			{
				label: 'Reference',
				items: [
					{ label: 'Generated interfaces', href: '/docs/reference/interfaces' },
					{ label: 'Authorization model', href: '/docs/reference/authorization' },
					sectionOverviewItem('reference')
				]
			}
		]
	},
	{
		id: 'agents',
		label: 'Agents',
		title: 'Agents',
		href: '/docs/agents',
		description: 'See where agents connect, what they may do, and whose authority they carry.',
		groups: [
			{
				label: 'On this page',
				items: agentsTopics.map((topic) => ({
					label: topic.navTitle,
					href: `/docs/agents#${topic.slug}`
				}))
			},
			{
				label: 'Deep dives',
				items: [
					...agentsCapabilityItems,
					{ label: 'Application MCP', href: '/docs/tooling/app-mcp' }
				]
			},
			{
				label: 'Related reference',
				items: [
					{ label: 'Authorization model', href: '/docs/reference/authorization' },
					{ label: 'Security defaults', href: '/docs/reference/security' },
					{ label: 'Generated interfaces', href: '/docs/reference/interfaces' }
				]
			}
		]
	},
	{
		id: 'interaction',
		label: 'Interaction',
		title: 'Human-Agent Interaction',
		href: '/docs/interaction',
		description:
			'Learn how persons and application agents communicate, propose changes, and share control.',
		groups: [
			{ label: 'Current interaction topics', items: interactionCapabilityItems },
			{
				label: 'Related material',
				items: [
					{ label: 'Security defaults', href: '/docs/reference/security' },
					{ label: 'Field policy API', href: '/docs/reference/field-policies' },
					sectionOverviewItem('guides')
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
					{ label: 'build-a-boilerplate', href: '/build-a-boilerplate' }
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
 * The three doors (#361): BUILD · FEATURES · DOCS. Every technical section is
 * reached through Docs, whose panel (`DocsPanelSections.svelte`) carries the
 * section map; the labels render uppercase in `Header.svelte`.
 */
export const primaryNavigation: PrimaryNavigationItem[] = [
	{ label: 'Build', href: '/build-a-boilerplate' },
	{ label: 'Features', href: '/features' },
	{ label: 'Docs', href: '/docs' }
];

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
	if (underPath(pathname, '/docs/agents')) return getDocumentationSection('agents');
	if (underPath(pathname, '/docs/interaction')) return getDocumentationSection('interaction');
	if (underPath(pathname, '/docs/ui')) return getDocumentationSection('ui');
	if (underPath(pathname, '/docs/guides')) return getDocumentationSection('guides');
	if (underPath(pathname, '/docs/tooling')) return getDocumentationSection('tooling');
	if (underPath(pathname, '/docs/capabilities')) {
		// `/docs/capabilities/<slug>`
		const slug = pathname.split('/')[3] ?? '';
		if (agentsCapabilitySlugs.has(slug)) return getDocumentationSection('agents');
		if (interactionCapabilitySlugs.has(slug)) return getDocumentationSection('interaction');
		if (uiCapabilitySlugs.has(slug)) return getDocumentationSection('ui');
		return getDocumentationSection('framework');
	}
	if (underPath(pathname, '/docs/reference')) return getDocumentationSection('reference');
	// `/docs` itself and Getting Started, plus any page outside Docs.
	return getDocumentationSection('docs');
}

export function isPrimaryNavigationActive(item: PrimaryNavigationItem, pathname: string): boolean {
	if (item.href === '/features') {
		return underPath(pathname, '/features');
	}
	return isNavigationItemActive(item.href, pathname);
}

export function isNavigationItemActive(href: string, pathname: string, hash = ''): boolean {
	const url = new URL(href, 'https://s-m-r-t.dev');
	if (url.pathname === '/') {
		return pathname === '/' && (url.hash ? url.hash === hash : hash === '');
	}
	// A same-page anchor (e.g. /agents#topic) only owns the current location when
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
			...gettingStartedItems.filter((item) => item.href !== '/build-a-boilerplate')
		]
	},
	{
		label: 'Framework',
		items: [
			sectionOverviewItem('framework'),
			{ label: 'Foundations overview', href: '/docs/foundations' },
			...foundationItems,
			{ label: 'Capabilities overview', href: '/docs/capabilities' },
			...frameworkCapabilityItems
		]
	},
	{
		label: 'Agents',
		items: [sectionOverviewItem('agents'), ...agentsCapabilityItems]
	},
	{
		label: 'Interaction',
		items: [sectionOverviewItem('interaction'), ...interactionCapabilityItems]
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
	...featureNavigation.flatMap((group) => group.items),
	{
		label: 'build-a-boilerplate',
		href: '/build-a-boilerplate',
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
