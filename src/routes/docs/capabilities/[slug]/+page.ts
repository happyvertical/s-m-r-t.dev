import { error, redirect } from '@sveltejs/kit';
import { capabilityGuides, getCapabilityGuide } from '$lib/data/guides';
import { movedPath, movedSlugs } from '$lib/data/doc-moves';
import type { PageLoad } from './$types';

export const prerender = true;

const base = '/docs/capabilities';

// Moved pages (docMoves) keep a prerendered one-hop 301 at their old slug.
export const entries = () =>
	[...capabilityGuides.map((guide) => guide.slug), ...movedSlugs(base)].map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const moved = movedPath(`${base}/${params.slug}`);
	if (moved) redirect(301, moved);
	const guide = getCapabilityGuide(params.slug);
	if (!guide) error(404, 'Capability guide not found');
	return { guide };
};
