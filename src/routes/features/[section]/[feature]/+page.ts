import { error } from '@sveltejs/kit';
import { features, getFeature, getFeatureSection } from '$lib/data/features';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => features.map((item) => ({ section: item.section, feature: item.id }));

export const load: PageLoad = ({ params }) => {
	const feature = getFeature(params.feature);
	if (!feature || feature.section !== params.section) error(404, 'Feature not found');
	const section = getFeatureSection(feature.section);
	if (!section) error(404, 'Feature section not found');
	return { feature, section };
};
