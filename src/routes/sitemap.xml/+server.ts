import { capabilityGuides, foundationGuides } from '$lib/data/guides';
import { packages } from '$lib/data/packages';
import { referenceGuides } from '$lib/data/reference';
import { taskGuides } from '$lib/data/task-guides';
import { toolingGuides } from '$lib/data/tooling';
import { uiComponents } from '$lib/data/ui-components.generated';
import type { RequestHandler } from './$types';

export const prerender = true;

const baseUrl = 'https://s-m-r-t.dev';

const staticRoutes = [
	{ path: '', priority: '1.0', changefreq: 'weekly' },
	{ path: '/framework', priority: '0.95', changefreq: 'weekly' },
	{ path: '/agents', priority: '0.95', changefreq: 'weekly' },
	{ path: '/interaction', priority: '0.95', changefreq: 'weekly' },
	{ path: '/ui', priority: '0.95', changefreq: 'weekly' },
	{ path: '/modules', priority: '0.95', changefreq: 'weekly' },
	{ path: '/starters', priority: '0.9', changefreq: 'monthly' },
	{ path: '/starters/ground-up', priority: '0.9', changefreq: 'monthly' },
	{ path: '/starters/saas', priority: '0.9', changefreq: 'monthly' },
	{ path: '/foundations', priority: '0.9', changefreq: 'monthly' },
	{ path: '/capabilities', priority: '0.9', changefreq: 'weekly' },
	{ path: '/guides', priority: '0.9', changefreq: 'monthly' },
	{ path: '/playground', priority: '0.9', changefreq: 'weekly' },
	{ path: '/tooling', priority: '0.85', changefreq: 'monthly' },
	{ path: '/reference', priority: '0.8', changefreq: 'monthly' }
];

function entry(path: string, priority: string, changefreq: string): string {
	return `<url><loc>${baseUrl}${path}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export const GET: RequestHandler = () => {
	const urls = [
		...staticRoutes.map((route) => entry(route.path, route.priority, route.changefreq)),
		...foundationGuides.map((guide) => entry(`/foundations/${guide.slug}`, '0.8', 'monthly')),
		...capabilityGuides.map((guide) => entry(`/capabilities/${guide.slug}`, '0.85', 'weekly')),
		...taskGuides.map((guide) => entry(`/guides/${guide.slug}`, '0.85', 'monthly')),
		...toolingGuides.map((guide) => entry(`/tooling/${guide.slug}`, '0.8', 'monthly')),
		...referenceGuides.map((guide) => entry(`/reference/${guide.slug}`, '0.75', 'monthly')),
		// /packages* and /faq are redirects to these Reference URLs (S3) and are
		// intentionally absent here — a sitemap must not list a redirecting URL.
		entry('/reference/api', '0.8', 'monthly'),
		entry('/reference/faq', '0.6', 'monthly'),
		entry('/reference/packages', '0.9', 'weekly'),
		...packages.map((pkg) => entry(`/reference/packages/${pkg.slug}`, '0.75', 'monthly')),
		entry('/reference/components', '0.5', 'weekly'),
		...uiComponents.map((component) =>
			entry(`/reference/components/${component.slug}`, '0.5', 'monthly')
		)
	];

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`,
		{
			headers: { 'Content-Type': 'application/xml; charset=utf-8' }
		}
	);
};
