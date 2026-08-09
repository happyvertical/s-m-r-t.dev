import { capabilityGuides, foundationGuides } from '$lib/data/guides';
import { packages } from '$lib/data/packages';
import { referenceGuides } from '$lib/data/reference';
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

export const docsNavigation: NavigationGroup[] = [
	{
		label: 'Getting started',
		items: [
			{
				label: 'Overview',
				href: '/',
				description: 'Understand the framework and choose where to begin.'
			},
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
