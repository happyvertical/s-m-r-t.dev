import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN } from '$lib/site';
import { GET as getSitemap } from '../../routes/sitemap.xml/+server';
import { frozenDocsPages, frozenDocsRedirects } from './docs-url-inventory';
import { routesByPath, stripQueryAndHash } from './route-inventory';

// Both counts may only grow. A smaller number means a served /docs URL was
// dropped from the frozen list; restore it instead of lowering the number.
const FROZEN_PAGES = 550;
const FROZEN_REDIRECTS = 15;

describe('frozen /docs url inventory (#399)', () => {
	it('keeps every frozen entry (the list never shrinks)', () => {
		expect(frozenDocsPages.length).toBeGreaterThanOrEqual(FROZEN_PAGES);
		expect(Object.keys(frozenDocsRedirects).length).toBeGreaterThanOrEqual(FROZEN_REDIRECTS);
		const all = [...frozenDocsPages, ...Object.keys(frozenDocsRedirects)];
		expect(new Set(all).size).toBe(all.length);
		for (const path of all) {
			expect(path === '/docs' || path.startsWith('/docs/'), path).toBe(true);
		}
	});

	it('answers every frozen URL with a page or exactly one redirect hop to a page', () => {
		const problems: string[] = [];
		for (const path of [...frozenDocsPages, ...Object.keys(frozenDocsRedirects)]) {
			const route = routesByPath.get(path);
			if (!route) {
				problems.push(`${path}: 404`);
				continue;
			}
			if (!route.isRedirect) continue;
			const destination = routesByPath.get(stripQueryAndHash(route.target ?? ''));
			if (!destination) problems.push(`${path} -> ${route.target}: target 404`);
			else if (destination.isRedirect) problems.push(`${path} -> ${route.target}: redirect chain`);
		}
		expect(problems).toEqual([]);
	});
});

describe('sitemap', () => {
	it('lists only real pages, never a redirect or a 404', async () => {
		const xml = await getSitemap({} as Parameters<typeof getSitemap>[0]).text();
		const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
		expect(locs.length).toBeGreaterThan(0);

		const problems: string[] = [];
		for (const loc of locs) {
			expect(loc.startsWith(SITE_ORIGIN), loc).toBe(true);
			const route = routesByPath.get(loc.slice(SITE_ORIGIN.length) || '/');
			if (!route) problems.push(`${loc}: 404`);
			else if (route.isRedirect) problems.push(`${loc}: redirect to ${route.target}`);
		}
		expect(problems).toEqual([]);
		expect(new Set(locs).size).toBe(locs.length);
	});
});
