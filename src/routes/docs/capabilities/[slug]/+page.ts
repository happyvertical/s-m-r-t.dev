import { error, redirect } from '@sveltejs/kit';
import { capabilityHome, capabilityRoutePath, movedPath, movedSlugs } from '$lib/data/doc-moves';
import { capabilityGuides } from '$lib/data/guides';
import type { PageLoad } from './$types';

export const prerender = true;

const base = '/docs/capabilities';

/** The capability pages this route renders: those whose home is not UI. */
const pages = () => capabilityGuides.filter((guide) => capabilityHome(guide) !== 'ui');

// Moved pages (docMoves) keep a prerendered one-hop 301 at their old slug. A
// capability served from another section (UI) is not a page here.
export const entries = () =>
	[...pages().map((guide) => guide.slug), ...movedSlugs(base)].map((slug) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const moved = movedPath(capabilityRoutePath(params.slug));
	if (moved) redirect(301, moved);
	const guide = pages().find((candidate) => candidate.slug === params.slug);
	if (!guide) error(404, 'Capability guide not found');
	return { guide };
};
