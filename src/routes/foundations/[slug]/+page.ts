import { error, redirect } from '@sveltejs/kit';
import { foundationGuides, getFoundationGuide } from '$lib/data/guides';
import type { PageLoad } from './$types';

export const prerender = true;

const aliases: Record<string, string> = {
	'app-model': 'objects-and-collections',
	'identity-access': 'users-and-profiles',
	'generated-surfaces': 'interfaces'
};

export const entries = () => [
	...foundationGuides.map((guide) => ({ slug: guide.slug })),
	...Object.keys(aliases).map((slug) => ({ slug }))
];

export const load: PageLoad = ({ params }) => {
	if (aliases[params.slug]) redirect(301, `/foundations/${aliases[params.slug]}`);
	const guide = getFoundationGuide(params.slug);
	if (!guide) error(404, 'Foundation guide not found');
	return { guide };
};
