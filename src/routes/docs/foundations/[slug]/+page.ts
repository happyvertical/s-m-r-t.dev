import { error, redirect } from '@sveltejs/kit';
import { foundationGuides, getFoundationGuide } from '$lib/data/guides';
import { movedPath, movedSlugs } from '$lib/data/doc-moves';
import type { PageLoad } from './$types';

export const prerender = true;

const base = '/docs/foundations';

// Moved pages (docMoves) keep a prerendered one-hop 301 at their old slug. The
// renamed pre-move slugs (app-model, …) redirect from /foundations/<old>
// straight to the renamed page; they never existed under /docs.
export const entries = () =>
	[...foundationGuides.map((guide) => guide.slug), ...movedSlugs(base)].map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const moved = movedPath(`${base}/${params.slug}`);
	if (moved) redirect(301, moved);
	const guide = getFoundationGuide(params.slug);
	if (!guide) error(404, 'Foundation guide not found');
	return { guide };
};
