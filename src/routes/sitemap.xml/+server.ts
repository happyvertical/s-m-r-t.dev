import { capabilityGuides, foundationGuides } from '$lib/data/guides';
import { featurePath, featureSectionPath, featureSections, features } from '$lib/data/features';
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
	{ path: '/features', priority: '0.95', changefreq: 'weekly' },
	{ path: '/docs', priority: '0.95', changefreq: 'weekly' },
	{ path: '/docs/framework', priority: '0.95', changefreq: 'weekly' },
	{ path: '/docs/agents', priority: '0.95', changefreq: 'weekly' },
	{ path: '/docs/interaction', priority: '0.95', changefreq: 'weekly' },
	{ path: '/docs/ui', priority: '0.95', changefreq: 'weekly' },
	{ path: '/docs/getting-started', priority: '0.9', changefreq: 'monthly' },
	{ path: '/docs/getting-started/smrt-start', priority: '0.9', changefreq: 'monthly' },
	{ path: '/docs/foundations', priority: '0.9', changefreq: 'monthly' },
	{ path: '/docs/capabilities', priority: '0.9', changefreq: 'weekly' },
	{ path: '/docs/guides', priority: '0.9', changefreq: 'monthly' },
	{ path: '/playground', priority: '0.9', changefreq: 'weekly' },
	{ path: '/build-a-boilerplate', priority: '0.9', changefreq: 'weekly' },
	{ path: '/docs/tooling', priority: '0.85', changefreq: 'monthly' },
	{ path: '/docs/reference', priority: '0.8', changefreq: 'monthly' }
];

function entry(path: string, priority: string, changefreq: string): string {
	return `<url><loc>${baseUrl}${path}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export const GET: RequestHandler = () => {
	const urls = [
		...staticRoutes.map((route) => entry(route.path, route.priority, route.changefreq)),
		...foundationGuides.map((guide) => entry(`/docs/foundations/${guide.slug}`, '0.8', 'monthly')),
		...capabilityGuides.map((guide) => entry(`/docs/capabilities/${guide.slug}`, '0.85', 'weekly')),
		...featureSections.map((section) => entry(featureSectionPath(section), '0.9', 'monthly')),
		...features.map((item) => entry(featurePath(item), '0.85', 'monthly')),
		...taskGuides.map((guide) => entry(`/docs/guides/${guide.slug}`, '0.85', 'monthly')),
		...toolingGuides.map((guide) => entry(`/docs/tooling/${guide.slug}`, '0.8', 'monthly')),
		...referenceGuides.map((guide) => entry(`/docs/reference/${guide.slug}`, '0.75', 'monthly')),
		// /packages*, /faq, /blocks* and every pre-#365 path outside /docs are redirects to
		// these URLs and are intentionally absent here — a sitemap must not list a
		// redirecting URL.
		entry('/docs/reference/api', '0.8', 'monthly'),
		entry('/docs/reference/faq', '0.6', 'monthly'),
		entry('/docs/reference/evidence', '0.6', 'monthly'),
		entry('/docs/reference/packages', '0.9', 'weekly'),
		...packages.map((pkg) => entry(`/docs/reference/packages/${pkg.slug}`, '0.75', 'monthly')),
		entry('/docs/reference/components', '0.5', 'weekly'),
		...uiComponents.map((component) =>
			entry(`/docs/reference/components/${component.slug}`, '0.5', 'monthly')
		)
	];

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`,
		{
			headers: { 'Content-Type': 'application/xml; charset=utf-8' }
		}
	);
};
