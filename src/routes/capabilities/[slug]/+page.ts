import { error } from '@sveltejs/kit';
import { capabilityGuides, getCapabilityGuide } from '$lib/data/guides';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => capabilityGuides.map((guide) => ({ slug: guide.slug }));

export const load: PageLoad = ({ params }) => {
	const guide = getCapabilityGuide(params.slug);
	if (!guide) error(404, 'Capability guide not found');
	return { guide };
};
