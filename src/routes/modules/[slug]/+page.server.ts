import { redirect } from '@sveltejs/kit';
import { packages } from '$lib/data/packages';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const entries = () => [
	...packages.map((pkg) => ({ slug: pkg.slug })),
	{ slug: 'browser-ai' },
	{ slug: 'template-sveltekit' },
	{ slug: 'template-site-static-json' }
];

export const load: PageServerLoad = ({ params }) => {
	if (params.slug === 'browser-ai') redirect(301, '/packages/smrt-svelte?tab=components');
	if (params.slug.startsWith('template-')) redirect(301, `/packages/smrt-${params.slug}`);
	redirect(301, `/packages/${params.slug}`);
};
