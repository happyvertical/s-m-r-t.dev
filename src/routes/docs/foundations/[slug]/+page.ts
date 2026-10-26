import { error } from '@sveltejs/kit';
import { foundationGuides, getFoundationGuide } from '$lib/data/guides';
import type { PageLoad } from './$types';

export const prerender = true;

// The renamed pre-move slugs (app-model, …) redirect from /foundations/<old>
// straight to the renamed page; they never existed under /docs.
export const entries = () => foundationGuides.map((guide) => ({ slug: guide.slug }));

export const load: PageLoad = ({ params }) => {
	const guide = getFoundationGuide(params.slug);
	if (!guide) error(404, 'Foundation guide not found');
	return { guide };
};
