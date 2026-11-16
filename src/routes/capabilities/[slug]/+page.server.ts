import { redirect } from '@sveltejs/kit';
import { capabilityPath, currentPath, movedSlugs } from '$lib/data/doc-moves';
import { capabilityGuides } from '$lib/data/guides';
import type { PageServerLoad } from './$types';

// Moved under /docs (#365). Every pre-move slug keeps a prerendered 301 to
// its /docs page; legacy-routes.test.ts holds the inventory. A page #399 moved
// again goes straight to its final address (docMoves), never through a second hop.
export const prerender = true;

export const entries = () =>
	[
		...new Set([...capabilityGuides.map((item) => item.slug), ...movedSlugs('/docs/capabilities')])
	].map((slug) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	redirect(301, currentPath(capabilityPath(params.slug)));
};
