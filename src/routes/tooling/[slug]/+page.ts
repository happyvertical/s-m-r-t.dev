import { error } from '@sveltejs/kit';
import { getToolingGuide, toolingGuides } from '$lib/data/tooling';
import type { PageLoad } from './$types';

export const prerender = true;
export const entries = () => toolingGuides.map((guide) => ({ slug: guide.slug }));

export const load: PageLoad = ({ params }) => {
	const guide = getToolingGuide(params.slug);
	if (!guide) error(404, 'Developer tooling page not found');
	return { guide };
};
