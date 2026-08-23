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

/**
 * The homepage has four document-level destinations in the sidebar. Only one
 * can describe the reader's current position, so its hash is tracked by the
 * sidebar's scroll spy rather than treating every root link as a page match.
 *
 * `Choose a starting point` is an index, not an umbrella selection: once a
 * visitor follows one of its child routes, that child is the active entry.
 */
export function isSidebarItemActive(
	href: string,
	pathname: string,
	activeHomepageHref = '/'
): boolean {
	if (pathname === '/') {
		if (href === '/' || href.startsWith('/#')) return href === activeHomepageHref;
		return false;
	}

	if (href === '/') return false;
	if (href === '/starters') return pathname === href;
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function sidebarAriaCurrent(href: string): 'location' | 'page' {
	return href.startsWith('/#') ? 'location' : 'page';
}

export const docsNavigation: NavigationGroup[] = [
	{
		label: 'Overview',
		items: [
			{
				label: 'Why s-m-r-t?',
				href: '/',
				description:
					'One source of truth for application logic generates storage, forms, APIs, commands, permissions, and AI-agent tools.',
				keywords: [
					'smrt',
					'agent-native',
					'agent-legible',
					'governed',
					'awareness is not authority',
					'Software as Agentic Domain Logic',
					'SAADL'
				]
			},
			{
				label: 'How it works',
				href: '/#how-it-works',
				description: 'A real model and the surfaces generated from it.'
			},
			{
				label: 'What you get',
				href: '/#what-you-get',
				description: 'What the shared definition enables.'
			},
			{
				label: 'What you lose',
				href: '/#what-you-lose',
				description: 'Familiar costs the shared model retires.'
			}
		]
	},
	{
		label: 'Getting started',
		items: [
			{
				label: 'Choose a starting point',
				href: '/starters',
				description: 'Start small or begin with a SaaS app.'
			},
			{
				label: 'Basic SvelteKit app',
				href: '/starters/ground-up',
				description: 'Build from the ground-up template.'
			},
			{
				label: 'SaaS starter',
				href: '/starters/saas',
				description: 'Begin with the production-shaped monorepo.'
			}
		]
	},
	{
		label: 'Application foundations',
		items: foundationGuides.map((guide) => ({
			label: guide.navTitle ?? guide.title,
			href: `/foundations/${guide.slug}`,
			description: guide.plainEnglish,
			keywords: guide.packages
		}))
	},
	{
		label: 'Capabilities',
		items: capabilityGuides.map((guide) => ({
			label: guide.navTitle ?? guide.title,
			href: `/capabilities/${guide.slug}`,
			description: guide.plainEnglish,
			keywords: guide.packages
		}))
	},
	{
		label: 'Task guides',
		items: [
			{
				label: 'Guides overview',
				href: '/guides',
				description: 'Runnable end-to-end walkthroughs for one job at a time.',
				keywords: ['tutorial', 'how-to', 'guide', 'runnable', 'end-to-end']
			},
			...taskGuides.map((guide) => ({
				label: guide.navTitle ?? guide.title,
				href: `/guides/${guide.slug}`,
				description: guide.plainEnglish,
				keywords: guide.packages
			}))
		]
	},
	{
		label: 'Packages and tools',
		items: [
			{
				label: 'Packages',
				href: '/packages',
				description: 'Browse packages, components, and generated interfaces.'
			},
			{
				label: 'Playground',
				href: '/playground',
				description: 'Try the components package by package.'
			}
		]
	},
	{
		label: 'Developer tooling',
		items: [
			{
				label: 'Tooling overview',
				href: '/tooling',
				description: 'Choose between the CLI, dev MCP, generated MCP, app MCP, and Agent Plugins.',
				keywords: ['mcp', 'agent', 'cli', 'knowledge', 'plugin']
			},
			...toolingGuides.map((guide) => ({
				label: guide.navTitle ?? guide.title,
				href: `/tooling/${guide.slug}`,
				description: guide.plainEnglish,
				keywords: guide.packages
			}))
		]
	},
	{
		label: 'Reference',
		items: [
			{
				label: 'Reference overview',
				href: '/reference',
				description: 'Configuration, decorators, collections, and terminology.'
			},
			...referenceGuides.map((guide) => ({
				label: guide.navTitle ?? guide.title,
				href: `/reference/${guide.slug}`,
				description: guide.plainEnglish,
				keywords: guide.packages
			})),
			{ label: 'FAQ', href: '/faq', description: 'Short answers to common framework questions.' }
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
