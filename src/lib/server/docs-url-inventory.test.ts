import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN } from '$lib/site';
import { GET as getSitemap } from '../../routes/sitemap.xml/+server';
import { docMoves, movedPath } from '$lib/data/doc-moves';
import { frozenDocsPages, frozenDocsRedirects } from './docs-url-inventory';
import { routesByPath, stripQueryAndHash } from './route-inventory';

// Both counts may only grow. A smaller number means a served /docs URL was
// dropped from the frozen list; restore it instead of lowering the number.
const FROZEN_PAGES = 558;
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

describe('moved pages (#399 part 1)', () => {
	it.each([
		['/docs/agents', '/docs/framework/agents'],
		['/docs/interaction', '/docs/framework/interaction']
	])('%s answers 301 to %s', (from, to) => {
		const route = routesByPath.get(from);
		expect(route?.isRedirect).toBe(true);
		expect(route?.status).toBe(301);
		expect(stripQueryAndHash(route?.target ?? '')).toBe(to);
	});
});

describe('renamed and moved pages (#399 items 3 and 4)', () => {
	// The literal targets are written out on purpose: a rename in docMoves must
	// not silently re-point these without someone updating the pin.
	it.each([
		['/docs/capabilities/collections', '/docs/capabilities/collection-reads'],
		['/docs/foundations/interfaces', '/docs/foundations/connect-interfaces'],
		['/docs/capabilities/application-shell', '/docs/ui/application-shell'],
		['/docs/capabilities/policy-aware-forms', '/docs/ui/policy-aware-forms'],
		['/docs/capabilities/field-policy-operations', '/docs/ui/field-policy-operations'],
		['/docs/capabilities/field-policies', '/docs/ui/field-policy-layers'],
		// Older stubs go straight to the final page, never through the old URL.
		['/docs/collections', '/docs/capabilities/collection-reads'],
		['/capabilities/collections', '/docs/capabilities/collection-reads'],
		['/foundations/interfaces', '/docs/foundations/connect-interfaces'],
		['/foundations/generated-surfaces', '/docs/foundations/connect-interfaces'],
		['/capabilities/application-shell', '/docs/ui/application-shell'],
		['/capabilities/policy-aware-forms', '/docs/ui/policy-aware-forms'],
		['/capabilities/field-policy-operations', '/docs/ui/field-policy-operations'],
		['/capabilities/field-policies', '/docs/ui/field-policy-layers'],
		['/blocks/screens-and-shell', '/docs/ui/application-shell'],
		['/features/screens/shell', '/docs/ui/application-shell']
	])('%s answers 301 to %s', (from, to) => {
		const route = routesByPath.get(from);
		expect(route?.isRedirect, from).toBe(true);
		expect(route?.status).toBe(301);
		expect(stripQueryAndHash(route?.target ?? '')).toBe(to);
		expect(routesByPath.get(to)?.isRedirect).toBe(false);
	});

	it.each(Object.entries(docMoves))('docMoves sends %s to %s, a page', (from, to) => {
		expect(movedPath(from)).toBe(to);
		expect(routesByPath.get(to)?.isRedirect, to).toBe(false);
		expect(stripQueryAndHash(routesByPath.get(from)?.target ?? '')).toBe(to);
	});

	it('never stubs a name that did not exist before the move', () => {
		for (const path of [
			'/capabilities/collection-reads',
			'/capabilities/field-policy-layers',
			'/foundations/connect-interfaces'
		]) {
			expect(routesByPath.has(path), path).toBe(false);
		}
	});

	it('does not serve a moved UI page from /docs/capabilities', () => {
		for (const slug of ['application-shell', 'policy-aware-forms', 'field-policy-operations']) {
			expect(routesByPath.get(`/docs/capabilities/${slug}`)?.isRedirect, slug).toBe(true);
		}
		expect(routesByPath.has('/docs/capabilities/field-policy-layers')).toBe(false);
	});
});

describe('sitemap', () => {
	it('lists only real pages, never a redirect or a 404', async () => {
		const xml = await (await getSitemap({} as Parameters<typeof getSitemap>[0])).text();
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
		expect(locs).toContain(`${SITE_ORIGIN}/docs/capabilities/collection-reads`);
		expect(locs).toContain(`${SITE_ORIGIN}/docs/foundations/connect-interfaces`);
		expect(locs).not.toContain(`${SITE_ORIGIN}/docs/capabilities/collections`);
		expect(locs).not.toContain(`${SITE_ORIGIN}/docs/foundations/interfaces`);
		for (const to of Object.values(docMoves)) expect(locs).toContain(`${SITE_ORIGIN}${to}`);
		for (const from of Object.keys(docMoves)) expect(locs).not.toContain(`${SITE_ORIGIN}${from}`);
	});
});
