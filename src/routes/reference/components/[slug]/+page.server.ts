import { redirect } from '@sveltejs/kit';
import { uiComponents } from '$lib/data/ui-components.generated';
import type { PageServerLoad } from './$types';

// Moved under /docs (#365). Every pre-move slug keeps a prerendered 301 to
// its /docs page; legacy-routes.test.ts holds the inventory.
export const prerender = true;

// Component pages whose upstream component was removed or replaced before the
// move. Hand-written: the generated inventory no longer lists these. They 301
// straight to the replacement's /docs page, never through a second redirect.
export const _aliases: Record<string, string> = {
	'invoice-line-editor': 'money-invoice-editor'
};

export const entries = () => [
	...uiComponents.map((component) => ({ slug: component.slug })),
	...Object.keys(_aliases).map((slug) => ({ slug }))
];

export const load: PageServerLoad = ({ params }) => {
	redirect(301, `/docs/reference/components/${_aliases[params.slug] ?? params.slug}`);
};
