export interface ReferenceFamily {
	id: string;
	label: string;
	href: string;
	description: string;
	keywords: string[];
}

/**
 * Stable entry points for the exhaustive Reference section.
 *
 * Keep this list small. Package and component records belong in their filtered
 * indexes and search results, not in the application panel.
 */
export const referenceFamilies: ReferenceFamily[] = [
	{
		id: 'api',
		label: 'API Reference',
		href: '/reference/api',
		description: 'Find generated REST, MCP, WebMCP, and CLI contracts.',
		keywords: ['API', 'REST', 'MCP', 'WebMCP', 'CLI', 'OpenAPI']
	},
	{
		id: 'packages',
		label: 'Package Reference',
		href: '/reference/packages',
		description: 'Search the complete package inventory and its generated surfaces.',
		keywords: ['packages', 'modules', 'exports', 'status', 'version']
	},
	{
		id: 'components',
		label: 'UI Component Reference',
		href: '/reference/components',
		description: 'Search public UI exports, props, state, events, imports, and examples.',
		keywords: ['components', 'Svelte', 'props', 'events', 'state', 'DataTable']
	},
	{
		id: 'configuration',
		label: 'Configuration',
		href: '/reference/configuration',
		description: 'Look up configuration precedence, exports, and runtime boundaries.',
		keywords: ['config', 'environment', 'secrets', 'settings']
	},
	{
		id: 'decorators',
		label: 'Decorators',
		href: '/reference/decorators',
		description: 'Look up model, field, and generated-surface metadata.',
		keywords: ['decorators', 'smrt', 'field', 'metadata']
	},
	{
		id: 'collections',
		label: 'Collections and relationships',
		href: '/reference/collections',
		description: 'Look up query, loading, relationship, and projection contracts.',
		keywords: ['collections', 'relationships', 'queries', 'projections']
	},
	{
		id: 'interfaces',
		label: 'Generated interfaces',
		href: '/reference/interfaces',
		description: 'See how one model becomes human and agent interfaces.',
		keywords: ['generated', 'interfaces', 'REST', 'MCP', 'WebMCP', 'CLI']
	},
	{
		id: 'authorization',
		label: 'Authorization and security',
		href: '/reference/authorization',
		description: 'Look up permissions, guards, row security, and secure defaults.',
		keywords: ['authorization', 'security', 'permissions', 'RLS', 'authentication']
	},
	{
		id: 'field-policies',
		label: 'Field policy API',
		href: '/reference/field-policies',
		description: 'Look up field-policy resolution and operation contracts.',
		keywords: ['field policy', 'forms', 'personalization', 'permissions']
	},
	{
		id: 'terminology',
		label: 'Terminology and SAADL',
		href: '/reference/terminology',
		description: 'Use the canonical terms after the framework concept introduction.',
		keywords: ['terminology', 'SAADL', 'Software as Agentic Domain Logic']
	},
	{
		id: 'versions',
		label: 'Versions and support status',
		href: '/reference/versions',
		description: 'Check release alignment, package status, and support evidence.',
		keywords: ['versions', 'support', 'status', 'release', 'compatibility']
	},
	{
		id: 'faq',
		label: 'FAQ',
		href: '/reference/faq',
		description: 'Find short answers and links to the complete contract.',
		keywords: ['FAQ', 'questions', 'answers']
	}
];

export function getReferenceFamily(id: string): ReferenceFamily | undefined {
	return referenceFamilies.find((family) => family.id === id);
}

const guideFamily = new Map<string, string>([
	['configuration', 'configuration'],
	['decorators', 'decorators'],
	['collections', 'collections'],
	['relationships', 'collections'],
	['field-naming', 'collections'],
	['interfaces', 'interfaces'],
	['security', 'authorization'],
	['authorization', 'authorization'],
	['field-policies', 'field-policies'],
	['control-interaction', 'components'],
	['saadl', 'terminology'],
	['terminology', 'terminology'],
	['versions', 'versions'],
	['have-sdk', 'api'],
	['ai-and-retrieval', 'api'],
	['testing', 'api']
]);

export function referenceFamilyForSlug(slug: string): ReferenceFamily | undefined {
	return getReferenceFamily(guideFamily.get(slug) ?? slug);
}
