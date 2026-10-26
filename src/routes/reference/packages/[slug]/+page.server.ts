import { redirect } from '@sveltejs/kit';
import { packages } from '$lib/data/packages';
import type { PageServerLoad } from './$types';

// Moved under /docs (#365). Every pre-move slug keeps a prerendered 301 to
// its /docs page; legacy-routes.test.ts holds the inventory.
export const prerender = true;

export const entries = () => packages.map((item) => ({ slug: item.slug }));

export const load: PageServerLoad = ({ params }) => {
	redirect(301, `/docs/reference/packages/${params.slug}`);
};
