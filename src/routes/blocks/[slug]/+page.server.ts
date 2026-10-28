import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = true;

/**
 * The 23 #358 building-block pages and where each went in the #361 redesign
 * and again after the #375 regrouping: the block's closest feature showcase,
 * group index or Docs page. Targets are the final page, never the retired
 * `/features/<section>/<feature>` redirect. Frozen here because the data it was read
 * from (`blocks.ts`) is gone; `legacy-routes.test.ts` checks every target
 * still prerenders.
 */
export const _aliases: Record<string, string> = {
	'agent-tools': '/features/assistant/tools',
	'agent-legible-applications': '/docs/capabilities/agent-legible-applications',
	'agents-included': '/features/assistant/agents',
	'agent-assisted-forms': '/docs/capabilities/agent-assisted-forms',
	'learning-agents': '/features/assistant/memory',
	'approvals-and-governance': '/features/team/approvals',
	ingestion: '/docs/reference/packages/smrt-ingestion',
	'jobs-and-automation': '/docs/reference/packages/smrt-jobs',
	facts: '/docs/reference/packages/smrt-facts',
	records: '/docs/foundations/objects-and-collections',
	'people-and-permissions': '/features/team/people',
	'live-data': '/docs/capabilities/live-data',
	reports: '/features/grow/reports',
	'content-and-media': '/features/publish',
	messaging: '/features/talk',
	'commerce-and-money': '/features/sell',
	operations: '/features/plan',
	'insight-and-marketing': '/features/grow',
	events: '/features/plan/events',
	places: '/features/plan/places',
	tags: '/docs/reference/packages/smrt-tags',
	'screens-and-shell': '/docs/capabilities/application-shell',
	mobile: '/docs/capabilities/mobile'
};

export const entries = () => Object.keys(_aliases).map((slug) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	redirect(301, _aliases[params.slug] ?? '/features');
};
