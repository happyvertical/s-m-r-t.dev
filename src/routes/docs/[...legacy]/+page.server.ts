import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const destinations: Record<string, string> = {
	'getting-started': '/starters',
	'how-it-works': '/framework',
	objects: '/foundations/objects-and-collections',
	collections: '/capabilities/collections',
	agents: '/agents',
	'agents/dispatch': '/reference/packages/smrt-agents',
	'components/feedback/confirm-dialog': '/reference/packages/smrt-ui',
	'components/feedback/progress-bar': '/reference/packages/smrt-ui',
	migration: '/starters/ground-up',
	security: '/reference/security',
	'concepts/configuration': '/reference/configuration',
	'concepts/multi-tenancy': '/foundations/tenants',
	'concepts/context-memory': '/reference/ai-and-retrieval',
	'concepts/semantic-search': '/reference/ai-and-retrieval',
	'concepts/testing': '/reference/testing',
	'guides/multi-tenant-lifecycle': '/guides/multi-tenant-lifecycle',
	'guides/expose-app-via-mcp': '/guides/expose-your-app-over-mcp',
	'guides/add-semantic-search': '/guides/semantic-search'
};

export const prerender = true;

export const entries = () => Object.keys(destinations).map((legacy) => ({ legacy }));

export const load: PageServerLoad = ({ params }) => {
	redirect(301, destinations[params.legacy ?? ''] ?? '/');
};
