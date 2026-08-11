/**
 * The registration checklist for a `Guide[]` route family, as a test.
 *
 * Four things are hand-maintained and silent when forgotten: the `[slug]`
 * route, the sidebar, the palette's section-level entries, and the sitemap.
 * The families come from `guide-families.ts`, which discovers them, so a family
 * registered nowhere still arrives here and fails.
 */
import { describe, expect, it } from 'vitest';
import { toAnchorId } from '$lib/data/anchors';
import {
	describePage,
	familyBase,
	guideFamilies,
	guideHref,
	guidePages
} from '$lib/data/guide-families';
import { docsNavigation } from '$lib/data/navigation';
import { searchEntries } from '$lib/data/search';
import { GET as sitemap } from '../../routes/sitemap.xml/+server';

const navHrefs = docsNavigation.flatMap((group) => group.items.map((item) => item.href));

// The handler ignores its request event; it renders straight from the data.
const sitemapXml = await (await sitemap({} as unknown as Parameters<typeof sitemap>[0])).text();

/**
 * Pages whose family has a route, which is all of them once the route check
 * passes. The later checks work from this list so that a family missing its
 * route fails once, on the route, rather than three more times on URLs that
 * were never going to exist.
 */
const routed = guidePages
	.map((page) => ({ page, href: guideHref(page) }))
	.filter((entry): entry is { page: (typeof guidePages)[number]; href: string } => !!entry.href);

describe('guide route family registration', () => {
	it('discovers the families, so nothing below passes vacuously', () => {
		// If the glob in guide-families.ts ever stops matching, every loop in
		// this file iterates nothing and the whole checklist goes green empty.
		expect(guideFamilies.length).toBeGreaterThanOrEqual(5);
		expect(guidePages.length).toBeGreaterThan(20);
	});

	it('renders every family from a [slug] route (src/routes/<base>/[slug]/)', () => {
		for (const family of guideFamilies) {
			expect(
				familyBase(family),
				`${family.name} (${family.module}) — no src/routes/<base>/[slug]/+page.ts whose ` +
					'`entries()` maps this array. Prerendering is driven by that route, so without ' +
					'one every link to these pages is a hard 404 and the build will not say so.'
			).toBeDefined();
		}
	});

	it('gives every guide a sidebar entry (navigation.ts)', () => {
		for (const { page, href } of routed) {
			expect(
				navHrefs.includes(href),
				`${describePage(page)} — ${href} is not in docsNavigation (navigation.ts). The ` +
					'sidebar, the palette’s page entries, and prev/next all derive from that list.'
			).toBe(true);
		}
	});

	it('indexes every guide section in the palette (guideTracks in search.ts)', () => {
		for (const { page, href } of routed) {
			for (const section of page.guide.sections) {
				// GuidePage renders `id={toAnchorId(section.title)}` from this helper.
				const anchor = `${href}#${toAnchorId(section.title)}`;
				expect(
					searchEntries.some((entry) => entry.kind === 'section' && entry.href === anchor),
					`${describePage(page)} — no palette entry for ${anchor}. Add the family to ` +
						'guideTracks in search.ts, or ⌘K finds the page but none of its headings.'
				).toBe(true);
			}
		}
	});

	it('lists every guide in the sitemap (sitemap.xml/+server.ts)', () => {
		for (const { page, href } of routed) {
			expect(
				sitemapXml.includes(`<loc>https://s-m-r-t.dev${href}</loc>`),
				`${describePage(page)} — ${href} is missing from sitemap.xml/+server.ts.`
			).toBe(true);
		}
	});
});
