import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const destinations: Record<string, string> = {
	'getting-started': '/',
	'how-it-works': '/foundations',
	objects: '/foundations/objects-and-collections',
	collections: '/capabilities/collections',
	agents: '/capabilities/learning-agents',
	'agents/dispatch': '/packages/smrt-agents',
	'components/feedback/confirm-dialog': '/packages/smrt-ui',
	'components/feedback/progress-bar': '/packages/smrt-ui',
	migration: '/starters/ground-up',
	security: '/reference/security',
	'concepts/configuration': '/reference/configuration',
	'concepts/multi-tenancy': '/foundations/tenants',
	'concepts/context-memory': '/reference/ai-and-retrieval',
	'concepts/semantic-search': '/reference/ai-and-retrieval',
	'concepts/testing': '/reference/testing',
	'guides/multi-tenant-lifecycle': '/foundations/tenants',
	'guides/expose-app-via-mcp': '/foundations/interfaces',
	'guides/add-semantic-search': '/reference/ai-and-retrieval'
};

export const prerender = true;

export const entries = () => Object.keys(destinations).map((legacy) => ({ legacy }));

export const load: PageServerLoad = ({ params }) => {
	redirect(301, destinations[params.legacy ?? ''] ?? '/');
};
