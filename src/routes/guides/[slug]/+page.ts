import { error } from '@sveltejs/kit';
import { getTaskGuide, taskGuides } from '$lib/data/task-guides';
import type { PageLoad } from './$types';

export const prerender = true;
export const entries = () => taskGuides.map((guide) => ({ slug: guide.slug }));

export const load: PageLoad = ({ params }) => {
	const guide = getTaskGuide(params.slug);
	if (!guide) error(404, 'Task guide not found');
	return { guide };
};
