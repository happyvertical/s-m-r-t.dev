import { capabilityGuides, foundationGuides } from '$lib/data/guides';
import { packages } from '$lib/data/packages';
import { referenceGuides } from '$lib/data/reference';
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
	| 'why'
	| 'framework'
	| 'interaction'
	| 'ui'
	| 'modules'
	| 'tooling'
	| 'guides'
	| 'reference';

export interface DocumentationSection {
	id: DocumentationSectionId;
	label: string;
	title: string;
	href: string;
	description: string;
	groups: NavigationGroup[];
}

export interface PrimaryNavigationItem extends NavigationItem {
	section?: DocumentationSectionId;
}

const foundationItems: NavigationItem[] = foundationGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/foundations/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));
const capabilityItems: NavigationItem[] = capabilityGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/capabilities/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));
const taskItems: NavigationItem[] = taskGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/guides/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));
const toolingItems: NavigationItem[] = toolingGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/tooling/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));
const referenceItems: NavigationItem[] = referenceGuides.map((guide) => ({
	label: guide.navTitle ?? guide.title,
	href: `/reference/${guide.slug}`,
	description: guide.plainEnglish,
	keywords: guide.packages
}));

const interactionCapabilitySlugs = new Set([
	'agent-legible-applications',
	'agent-assisted-forms',
	'learning-agents',
	'webmcp'
]);
const uiCapabilitySlugs = new Set([
	'application-shell',
	'field-policies',
	'policy-aware-forms',
	'field-policy-operations'
]);

const frameworkCapabilityItems = capabilityItems.filter(
	(item) =>
		!interactionCapabilitySlugs.has(item.href.split('/').at(-1) ?? '') &&
		!uiCapabilitySlugs.has(item.href.split('/').at(-1) ?? '')
);
const interactionCapabilityItems = capabilityItems.filter((item) =>
	interactionCapabilitySlugs.has(item.href.split('/').at(-1) ?? '')
);
const uiCapabilityItems = capabilityItems.filter((item) =>
	uiCapabilitySlugs.has(item.href.split('/').at(-1) ?? '')
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
		'agent-native',
		'agent-legible',
		'governed',
		'awareness is not authority',
		'Software as Agentic Domain Logic',
		'SAADL'
	]
};

const sectionOverviewItems = new Map<DocumentationSectionId, NavigationItem>([
	['why', whyItem],
	[
		'framework',
		{
			label: 'Framework overview',
			href: '/framework',
			description: 'See how the application model connects framework mechanisms and interfaces.'
		}
	],
	[
		'interaction',
		{
			label: 'Interaction overview',
			href: '/interaction',
			description: 'See how persons and application agents communicate and share control.'
		}
	],
	[
		'ui',
		{
			label: 'UI overview',
			href: '/ui',
			description: 'See the components that make application meaning, state, and change visible.'
		}
	],
	[
		'modules',
		{
			label: 'Application modules overview',
			href: '/modules',
			description: 'Find prebuilt application parts by the outcome they supply.'
		}
	],
	[
		'tooling',
		{
			label: 'Tooling overview',
			href: '/tooling',
			description: 'Choose tools for developer and coding-agent workflows.'
		}
	],
	[
		'guides',
		{
			label: 'All guides',
			href: '/guides',
			description: 'Use task procedures for one complete result at a time.'
		}
	],
	[
		'reference',
		{
			label: 'Reference overview',
			href: '/reference',
			description: 'Find exhaustive package, interface, configuration, and contract details.'
		}
	]
]);

const sectionOverviewItem = (id: DocumentationSectionId): NavigationItem => {
	const item = sectionOverviewItems.get(id);
	if (!item) throw new Error(`Section overview item not found: ${id}`);
	return item;
};

const relatedGuides = (...hrefs: string[]): NavigationGroup => ({
	label: 'Related guides',
	items: [...hrefs.map((href) => itemByHref(taskItems, href)), sectionOverviewItem('guides')]
});

export const documentationSections: DocumentationSection[] = [
	{
		id: 'why',
		label: 'Home',
		title: 'Home',
		href: '/',
		description:
			'Start with the reason for one shared application model and choose a deeper section.',
		groups: [
			{
				label: 'On this overview',
				items: [
					{ label: 'What you get', href: '/#what-you-get' },
					{ label: 'How it works', href: '/#how-it-works' },
					{ label: 'What you lose', href: '/#what-you-lose' }
				]
			},
			{
				label: 'Start building',
				items: [
					{ label: 'Choose a starting point', href: '/starters' },
					{ label: 'Basic SvelteKit app', href: '/starters/ground-up' },
					{ label: 'SaaS starter', href: '/starters/saas' }
				]
			},
			{
				label: 'Explore',
				items: [
					sectionOverviewItem('framework'),
					sectionOverviewItem('interaction'),
					sectionOverviewItem('guides')
				]
			}
		]
	},
	{
		id: 'framework',
		label: 'Framework',
		title: 'Framework',
		href: '/framework',
		description:
			'Learn how models, data, identity, permissions, and generated interfaces fit together.',
		groups: [
			{
				label: 'Application foundations',
				items: [{ label: 'Foundations overview', href: '/foundations' }, ...foundationItems]
			},
			{
				label: 'Framework capabilities',
				items: [
					{ label: 'Capabilities overview', href: '/capabilities' },
					...frameworkCapabilityItems
				]
			},
			relatedGuides('/guides/multi-tenant-lifecycle', '/guides/semantic-search'),
			{
				label: 'Reference',
				items: [
					{ label: 'Generated interfaces', href: '/reference/interfaces' },
					{ label: 'Authorization model', href: '/reference/authorization' },
					sectionOverviewItem('reference')
				]
			}
		]
	},
	{
		id: 'interaction',
		label: 'Interaction',
		title: 'Human-Agent Interaction',
		href: '/interaction',
		description:
			'Learn how persons and application agents communicate, propose changes, and share control.',
		groups: [
			{ label: 'Current interaction topics', items: interactionCapabilityItems },
			{
				label: 'Related material',
				items: [
					{ label: 'Security defaults', href: '/reference/security' },
					{ label: 'Field policy API', href: '/reference/field-policies' },
					sectionOverviewItem('guides')
				]
			}
		]
	},
	{
		id: 'ui',
		label: 'UI',
		title: 'UI',
		href: '/ui',
		description: 'Explore the visible components and patterns that implement governed interaction.',
		groups: [
			{
				label: 'Components and shell',
				items: [
					{ label: 'Foundation components', href: '/packages/smrt-ui?tab=components' },
					...uiCapabilityItems,
					{ label: 'Working playground', href: '/playground' }
				]
			},
			{
				label: 'Related material',
				items: [
					{ label: 'Field policy API', href: '/reference/field-policies' },
					{ label: 'Package reference', href: '/packages' },
					sectionOverviewItem('guides')
				]
			}
		]
	},
	{
		id: 'modules',
		label: 'Modules',
		title: 'Application modules',
		href: '/modules',
		description: 'Find substantial application parts by the outcome they provide.',
		groups: [
			{
				label: 'Browse',
				items: [
					{ label: 'Package reference', href: '/packages' },
					{ label: 'Working playground', href: '/playground' }
				]
			},
			{
				label: 'Related material',
				items: [sectionOverviewItem('framework'), sectionOverviewItem('guides')]
			}
		]
	},
	{
		id: 'tooling',
		label: 'Tooling',
		title: 'Tooling',
		href: '/tooling',
		description:
			'Use development tools, framework knowledge, and MCP surfaces for the correct job.',
		groups: [
			{ label: 'Developer and coding-agent tools', items: toolingItems },
			relatedGuides('/guides/expose-your-app-over-mcp', '/guides/testing-your-app'),
			{
				label: 'Reference',
				items: [
					{ label: 'Generated interfaces', href: '/reference/interfaces' },
					{ label: 'Testing', href: '/reference/testing' },
					sectionOverviewItem('reference')
				]
			}
		]
	},
	{
		id: 'guides',
		label: 'Guides',
		title: 'Guides',
		href: '/guides',
		description:
			'Follow task procedures and keep concept and reference details in their source sections.',
		groups: [
			{ label: 'Task guides', items: taskItems },
			{
				label: 'Getting started',
				items: [
					{ label: 'Choose a starting point', href: '/starters' },
					{ label: 'Basic SvelteKit app', href: '/starters/ground-up' },
					{ label: 'SaaS starter', href: '/starters/saas' }
				]
			},
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
		href: '/reference',
		description: 'Look up exhaustive package, interface, configuration, and contract details.',
		groups: [
			{
				label: 'Reference families',
				items: [...referenceItems, { label: 'FAQ', href: '/faq' }]
			},
			{
				label: 'Generated inventories',
				items: [
					{ label: 'Package reference', href: '/packages' },
					{ label: 'UI component reference', href: '/packages/smrt-ui?tab=components' }
				]
			},
			{ label: 'Related guides', items: [sectionOverviewItem('guides')] }
		]
	}
];

export const primaryNavigation: PrimaryNavigationItem[] = [
	{ label: 'Home', href: '/', section: 'why' },
	{ label: 'Framework', href: '/framework', section: 'framework' },
	{ label: 'Interaction', href: '/interaction', section: 'interaction' },
	{ label: 'UI', href: '/ui', section: 'ui' },
	{ label: 'Modules', href: '/modules', section: 'modules' },
	{ label: 'Tooling', href: '/tooling', section: 'tooling' },
	{ label: 'Playground', href: '/playground' },
	{ label: 'Reference', href: '/reference', section: 'reference' }
];

export function getDocumentationSection(id: DocumentationSectionId): DocumentationSection {
	const section = documentationSections.find((candidate) => candidate.id === id);
	if (!section) throw new Error(`Documentation section not found: ${id}`);
	return section;
}

export function documentationSectionForPathname(pathname: string): DocumentationSection {
	if (pathname === '/') return getDocumentationSection('why');
	if (pathname === '/framework' || pathname.startsWith('/foundations')) {
		return getDocumentationSection('framework');
	}
	if (pathname === '/interaction') return getDocumentationSection('interaction');
	if (pathname === '/ui' || pathname === '/themes' || pathname.startsWith('/packages/smrt-ui')) {
		return getDocumentationSection('ui');
	}
	if (pathname === '/modules') return getDocumentationSection('modules');
	if (
		pathname === '/guides' ||
		pathname.startsWith('/guides/') ||
		pathname.startsWith('/starters')
	) {
		return getDocumentationSection('guides');
	}
	if (pathname === '/tooling' || pathname.startsWith('/tooling/')) {
		return getDocumentationSection('tooling');
	}
	if (pathname === '/capabilities' || pathname.startsWith('/capabilities/')) {
		const slug = pathname.split('/')[2] ?? '';
		if (interactionCapabilitySlugs.has(slug)) return getDocumentationSection('interaction');
		if (uiCapabilitySlugs.has(slug)) return getDocumentationSection('ui');
		return getDocumentationSection('framework');
	}
	if (
		pathname === '/reference' ||
		pathname.startsWith('/reference/') ||
		pathname === '/packages' ||
		pathname.startsWith('/packages/') ||
		pathname === '/faq'
	) {
		return getDocumentationSection('reference');
	}
	return getDocumentationSection('why');
}

export function isPrimaryNavigationActive(item: PrimaryNavigationItem, pathname: string): boolean {
	if (item.href === '/playground') return pathname === '/playground';
	if (pathname === '/playground') return false;
	return item.section === documentationSectionForPathname(pathname).id;
}

export function isNavigationItemActive(href: string, pathname: string, hash = ''): boolean {
	const url = new URL(href, 'https://s-m-r-t.dev');
	if (url.pathname === '/') {
		return pathname === '/' && (url.hash ? url.hash === hash : hash === '');
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
 * The shell does not render this list. Its application panel renders only the
 * groups for the active section from `documentationSections`.
 */
export const docsNavigation: NavigationGroup[] = [
	{
		label: 'Home',
		items: [
			whyItem,
			{ label: 'What you get', href: '/#what-you-get' },
			{ label: 'How it works', href: '/#how-it-works' },
			{ label: 'What you lose', href: '/#what-you-lose' },
			{ label: 'Choose a starting point', href: '/starters' },
			{ label: 'Basic SvelteKit app', href: '/starters/ground-up' },
			{ label: 'SaaS starter', href: '/starters/saas' }
		]
	},
	{
		label: 'Framework',
		items: [
			sectionOverviewItem('framework'),
			{ label: 'Foundations overview', href: '/foundations' },
			...foundationItems,
			{ label: 'Capabilities overview', href: '/capabilities' },
			...frameworkCapabilityItems
		]
	},
	{
		label: 'Interaction',
		items: [sectionOverviewItem('interaction'), ...interactionCapabilityItems]
	},
	{ label: 'UI', items: [sectionOverviewItem('ui'), ...uiCapabilityItems] },
	{ label: 'Application modules', items: [sectionOverviewItem('modules')] },
	{ label: 'Tooling', items: [sectionOverviewItem('tooling'), ...toolingItems] },
	{ label: 'Guides', items: [sectionOverviewItem('guides'), ...taskItems] },
	{
		label: 'Reference',
		items: [
			sectionOverviewItem('reference'),
			...referenceItems,
			{ label: 'Package reference', href: '/packages' },
			{ label: 'UI component reference', href: '/packages/smrt-ui?tab=components' },
			{ label: 'FAQ', href: '/faq' }
		]
	}
];

export const searchItems: NavigationItem[] = [
	...docsNavigation.flatMap((group) => group.items),
	...packages.map((pkg) => ({
		label: pkg.name,
		href: `/packages/${pkg.slug}`,
		description: pkg.summary,
		keywords: [pkg.category, pkg.kind, ...pkg.components]
	}))
];
