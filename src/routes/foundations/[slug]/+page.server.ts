import { redirect } from '@sveltejs/kit';
import { currentPath, foundationPath, movedSlugs, withoutRenamedSlugs } from '$lib/data/doc-moves';
import { foundationGuides } from '$lib/data/guides';
import type { PageServerLoad } from './$types';

// Moved under /docs (#365). Every pre-move slug keeps a prerendered 301 to
// its /docs page; legacy-routes.test.ts holds the inventory.
export const prerender = true;

// Old foundation-guide names that were renamed before the move. They 301
// straight to the renamed /docs page, never through a second redirect: the
// value is the name the page had at the #365 move, and `currentPath` carries it
// through any later rename in docMoves.
export const _aliases: Record<string, string> = {
	'app-model': 'objects-and-collections',
	'identity-access': 'users-and-profiles',
	'generated-surfaces': 'interfaces'
};

export const entries = () =>
	[
		...new Set([
			...withoutRenamedSlugs(foundationGuides.map((guide) => guide.slug)),
			...movedSlugs('/docs/foundations'),
			...Object.keys(_aliases)
		])
	].map((slug) => ({ slug }));

export const load: PageServerLoad = ({ params }) => {
	redirect(301, currentPath(foundationPath(_aliases[params.slug] ?? params.slug)));
};
