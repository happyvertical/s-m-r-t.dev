import { error, redirect } from '@sveltejs/kit';
import { features, getFeature, getFeatureSection } from '$lib/data/features';
import { legacyFeatureTargets } from '$lib/legacy-features';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => [
	...features.map((item) => ({ section: item.section, feature: item.id })),
	...Object.keys(legacyFeatureTargets).map((key) => {
		const [section, feature] = key.split('/');
		return { section, feature };
	})
];

export const load: PageLoad = ({ params }) => {
	const legacy = legacyFeatureTargets[`${params.section}/${params.feature}`];
	if (legacy) redirect(301, legacy);
	const feature = getFeature(params.feature);
	if (!feature || feature.section !== params.section) error(404, 'Feature not found');
	const section = getFeatureSection(feature.section);
	if (!section) error(404, 'Feature section not found');
	return { feature, section };
};
