import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Pre-redesign `/docs/<x>` URLs. Since #365 `/docs` is a real section, so this
// table only keeps the paths no `/docs` page or route now owns, and every
// target is the final `/docs/…` page — never a pre-move URL that would 301 again.
// What left the table and why is in the RESTORE note in legacy-routes.test.ts.
const destinations: Record<string, string> = {
	'how-it-works': '/docs/framework',
	objects: '/docs/foundations/objects-and-collections',
	collections: '/docs/capabilities/collections',
	'agents/dispatch': '/docs/reference/packages/smrt-agents',
	'components/feedback/confirm-dialog': '/docs/reference/packages/smrt-ui',
	'components/feedback/progress-bar': '/docs/reference/packages/smrt-ui',
	migration: '/docs/getting-started/smrt-start',
	security: '/docs/reference/security',
	'concepts/configuration': '/docs/reference/configuration',
	'concepts/multi-tenancy': '/docs/foundations/tenants',
	'concepts/context-memory': '/docs/reference/ai-and-retrieval',
	'concepts/semantic-search': '/docs/reference/ai-and-retrieval',
	'concepts/testing': '/docs/reference/testing'
};

export const prerender = true;

export const entries = () => Object.keys(destinations).map((legacy) => ({ legacy }));

export const load: PageServerLoad = ({ params }) => {
	redirect(301, destinations[params.legacy ?? ''] ?? '/docs');
};
