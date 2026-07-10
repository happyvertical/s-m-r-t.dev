import { error } from '@sveltejs/kit';
import { getReferenceGuide, referenceGuides } from '$lib/data/reference';
import type { PageLoad } from './$types';

export const prerender = true;
export const entries = () => referenceGuides.map((guide) => ({ slug: guide.slug }));

export const load: PageLoad = ({ params }) => {
	const guide = getReferenceGuide(params.slug);
	if (!guide) error(404, 'Reference page not found');
	return { guide };
};
