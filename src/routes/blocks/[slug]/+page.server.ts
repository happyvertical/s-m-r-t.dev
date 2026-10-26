import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = true;

/**
 * The 23 #358 building-block pages and where each went in the #361 redesign:
 * the block's closest feature showcase, or the section index when the old
 * block spanned several features. Frozen here because the data it was read
 * from (`blocks.ts`) is gone; `legacy-routes.test.ts` checks every target
 * still prerenders.
 */
export const _aliases: Record<string, string> = {
	'agent-tools': '/features/agents/tools',
	'agent-legible-applications': '/features/agents/blueprint',
	'agents-included': '/features/agents/agents',
	'agent-assisted-forms': '/features/agents/forms',
	'learning-agents': '/features/agents/memory',
	'approvals-and-governance': '/features/agents/approvals',
	ingestion: '/features/agents/ingestion',
	'jobs-and-automation': '/features/agents/jobs',
	facts: '/features/agents/facts',
	records: '/features/basics/records',
	'people-and-permissions': '/features/basics/people',
	'live-data': '/features/basics/realtime',
	reports: '/features/basics/reports',
	'content-and-media': '/features/content',
	messaging: '/features/messaging',
	'commerce-and-money': '/features/commerce',
	operations: '/features/operations',
	'insight-and-marketing': '/features/marketing',
	events: '/features/world/events',
	places: '/features/world/places',
	tags: '/features/world/tags',
	'screens-and-shell': '/features/screens/shell',
	mobile: '/features/screens/mobile'
};

export const entries = () => Object.keys(_aliases).map((slug) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	redirect(301, _aliases[params.slug] ?? '/features');
};
