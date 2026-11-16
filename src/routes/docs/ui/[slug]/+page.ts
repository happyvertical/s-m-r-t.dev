import { error } from '@sveltejs/kit';
import { capabilityHome } from '$lib/data/doc-moves';
import { capabilityGuides } from '$lib/data/guides';
import type { PageLoad } from './$types';

export const prerender = true;

/** The capability pages whose home is the UI section (`docMoves`, `/docs/ui/…`). */
const pages = () => capabilityGuides.filter((guide) => capabilityHome(guide) === 'ui');

export const entries = () => pages().map((guide) => ({ slug: guide.slug }));

export const load: PageLoad = ({ params }) => {
	const guide = pages().find((candidate) => candidate.slug === params.slug);
	if (!guide) error(404, 'UI guide not found');
	return { guide };
};
