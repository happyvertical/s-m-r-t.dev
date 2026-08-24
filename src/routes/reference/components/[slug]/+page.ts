import { error } from '@sveltejs/kit';
import { getUiComponent, uiComponents } from '$lib/data/ui-components.generated';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => uiComponents.map((component) => ({ slug: component.slug }));

export const load: PageLoad = ({ params }) => {
	const component = getUiComponent(params.slug);
	if (!component) error(404, 'UI component not found');
	return { component };
};
