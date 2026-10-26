import { error } from '@sveltejs/kit';
import { getPackage, packages } from '$lib/data/packages';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => packages.map((pkg) => ({ slug: pkg.slug }));

export const load: PageLoad = ({ params }) => {
	const pkg = getPackage(params.slug);
	if (!pkg) error(404, 'Package not found');
	return { pkg };
};
