import { redirect } from '@sveltejs/kit';
import { foundationGuides } from '$lib/data/guides';
import type { PageServerLoad } from './$types';

// Moved under /docs (#365). Every pre-move slug keeps a prerendered 301 to
// its /docs page; legacy-routes.test.ts holds the inventory.
export const prerender = true;

// Old foundation-guide names that were renamed before the move. They 301
// straight to the renamed /docs page, never through a second redirect.
export const _aliases: Record<string, string> = {
	'app-model': 'objects-and-collections',
	'identity-access': 'users-and-profiles',
	'generated-surfaces': 'interfaces'
};

export const entries = () => [
	...foundationGuides.map((guide) => ({ slug: guide.slug })),
	...Object.keys(_aliases).map((slug) => ({ slug }))
];

export const load: PageServerLoad = ({ params }) => {
	redirect(301, `/docs/foundations/${_aliases[params.slug] ?? params.slug}`);
};
