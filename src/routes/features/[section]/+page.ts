import { error } from '@sveltejs/kit';
import { featureSections, getFeatureSection } from '$lib/data/features';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => featureSections.map((section) => ({ section: section.id }));

export const load: PageLoad = ({ params }) => {
	const section = getFeatureSection(params.section);
	if (!section) error(404, 'Feature section not found');
	return { section };
};
