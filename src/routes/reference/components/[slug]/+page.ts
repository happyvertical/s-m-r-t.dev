import { error, redirect } from '@sveltejs/kit';
import { getUiComponent, uiComponents } from '$lib/data/ui-components.generated';
import type { PageLoad } from './$types';

export const prerender = true;

// Component pages whose upstream component was removed or replaced. The site is
// static, so a slug that stops being generated is a hard 404 in production.
// Hand-written: the generated inventory no longer lists these.
export const _aliases: Record<string, string> = {
	'invoice-line-editor': 'money-invoice-editor'
};

export const entries = () => [
	...uiComponents.map((component) => ({ slug: component.slug })),
	...Object.keys(_aliases).map((slug) => ({ slug }))
];

export const load: PageLoad = ({ params }) => {
	if (_aliases[params.slug]) redirect(301, `/reference/components/${_aliases[params.slug]}`);
	const component = getUiComponent(params.slug);
	if (!component) error(404, 'UI component not found');
	return { component };
};
