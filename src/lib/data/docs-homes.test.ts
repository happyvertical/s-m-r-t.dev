/**
 * Guards for where a docs page lives (#399).
 *
 * 1. A slug has one home. No slug may be served by two of the guide route
 *    families (foundations, capabilities, reference, guides, tooling, and ui once it has pages):
 *    two pages sharing a slug read as one topic in search and in people's
 *    heads, and the second one silently loses the name.
 * 2. A page's URL family says which section lists it: `/docs/foundations` and
 *    `/docs/capabilities` are Framework, `/docs/ui` is UI. A page whose URL
 *    says one section while the sidebar lists it in another is in the wrong
 *    home.
 *
 * Families are derived from the data modules and their `[slug]` routes, never
 * listed by hand, so a new family is judged on the next run.
 */
import { describe, expect, it } from 'vitest';
import { familyBase, guideFamilies, guideHref } from '$lib/data/guide-families';
import { documentationSectionForPathname, documentationSections } from '$lib/data/navigation';
import type { DocumentationSectionId } from '$lib/data/navigation';

/**
 * Slugs still served by two route families. Item 3 of #399 renames the concept
 * sides (`collection-reads`, `connect-interfaces`, `field-policy-layers`) and
 * deletes this allowance. Asserted exact: fixing one without removing it here
 * fails, and so does a new duplicate.
 */
const knownDuplicates = ['collections', 'field-policies', 'interfaces'];

/**
 * Capability pages the sidebar lists under UI that are still served from
 * `/docs/capabilities`. Item 4 of #399 moves them to `/docs/ui/<slug>` and
 * deletes this allowance. Asserted exact, like `knownDuplicates`.
 */
const knownMismatches = [
	'/docs/capabilities/application-shell',
	'/docs/capabilities/field-policies',
	'/docs/capabilities/field-policy-operations',
	'/docs/capabilities/policy-aware-forms'
];

const servedPages = guideFamilies.flatMap((family) =>
	family.guides.flatMap((guide) => {
		const base = familyBase(family);
		return base === undefined
			? []
			: [{ base, slug: guide.slug, href: guideHref({ family, guide }) as string }];
	})
);

/** The section a URL's family names, independent of the placement table. */
function sectionOfUrlFamily(href: string): DocumentationSectionId | undefined {
	if (href.startsWith('/docs/foundations/') || href.startsWith('/docs/capabilities/')) {
		return 'framework';
	}
	if (href.startsWith('/docs/ui/')) return 'ui';
	return undefined;
}

function listingSection(href: string): DocumentationSectionId | undefined {
	return documentationSections.find((section) =>
		section.groups.some((group) => group.items.some((item) => item.href === href))
	)?.id;
}

describe('docs homes', () => {
	it('discovers the five guide route families', () => {
		expect([...new Set(servedPages.map((page) => page.base))].sort()).toEqual([
			'/docs/capabilities',
			'/docs/foundations',
			'/docs/guides',
			'/docs/reference',
			'/docs/tooling'
		]);
	});

	it('serves no slug from two route families, apart from the named duplicates', () => {
		const basesBySlug = new Map<string, Set<string>>();
		for (const { slug, base } of servedPages) {
			basesBySlug.set(slug, (basesBySlug.get(slug) ?? new Set()).add(base));
		}
		const duplicates = [...basesBySlug].filter(([, bases]) => bases.size > 1).map(([slug]) => slug);
		expect(duplicates.sort()).toEqual([...knownDuplicates].sort());
	});

	it("keeps a foundation or capability page's URL family in its listed section", () => {
		const mismatches: string[] = [];
		for (const { href } of servedPages) {
			const urlSection = sectionOfUrlFamily(href);
			if (!urlSection) continue;
			const listed = listingSection(href);
			expect(listed, `${href} is in no sidebar group`).toBeDefined();
			// The pathname resolver must always agree with the listing.
			expect(documentationSectionForPathname(href).id, href).toBe(listed);
			if (urlSection !== listed) mismatches.push(href);
		}
		expect(mismatches.sort()).toEqual([...knownMismatches].sort());
	});
});
