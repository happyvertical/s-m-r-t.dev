import { error, redirect } from '@sveltejs/kit';
import { getTaskGuide, taskGuides } from '$lib/data/task-guides';
import type { PageLoad } from './$types';

export const prerender = true;

// Two pre-#365 `/docs/guides/<old>` URLs from the `/docs/[...legacy]` table.
// This route now owns `/docs/guides/*`, so SvelteKit would match those paths
// here rather than in the catch-all; the redirects therefore live where the
// router sends them. legacy-routes.test.ts counts them.
export const _aliases: Record<string, string> = {
	'expose-app-via-mcp': 'expose-your-app-over-mcp',
	'add-semantic-search': 'semantic-search'
};

export const entries = () => [
	...taskGuides.map((guide) => ({ slug: guide.slug })),
	...Object.keys(_aliases).map((slug) => ({ slug }))
];

export const load: PageLoad = ({ params }) => {
	if (_aliases[params.slug]) redirect(301, `/docs/guides/${_aliases[params.slug]}`);
	const guide = getTaskGuide(params.slug);
	if (!guide) error(404, 'Task guide not found');
	return { guide };
};
