import { error, redirect } from '@sveltejs/kit';
import { featureSections, getFeatureSection } from '$lib/data/features';
import { legacySectionTargets } from '$lib/legacy-features';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => [
	...featureSections.map((section) => ({ section: section.id })),
	...Object.keys(legacySectionTargets).map((section) => ({ section }))
];

export const load: PageLoad = ({ params }) => {
	const legacy = legacySectionTargets[params.section];
	if (legacy) redirect(301, legacy);
	const section = getFeatureSection(params.section);
	if (!section) error(404, 'Feature section not found');
	return { section };
};
