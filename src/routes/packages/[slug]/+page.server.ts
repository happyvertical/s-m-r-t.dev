import { redirect } from '@sveltejs/kit';
import { packages } from '$lib/data/packages';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const entries = () => packages.map((pkg) => ({ slug: pkg.slug }));

export const load: PageServerLoad = ({ params }) => {
	redirect(301, `/reference/packages/${params.slug}`);
};
