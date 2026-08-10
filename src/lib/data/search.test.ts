import { describe, it, expect } from 'vitest';
import { toAnchorId } from '$lib/data/anchors';
import { capabilityGuides, foundationGuides, type Guide } from '$lib/data/guides';
import { searchDocs, searchEntries } from '$lib/data/search';
import { referenceGuides } from '$lib/data/reference';
import { taskGuides } from '$lib/data/task-guides';
import { toolingGuides } from '$lib/data/tooling';

/**
 * Every `Guide[]` route family on the site. A new one added to `$lib/data`
 * must be listed both here and in `search.ts`, or its headings are missing
 * from the palette while its pages still appear — which is exactly the silent
 * gap these tests exist to catch.
 */
const tracks: { base: string; guides: Guide[] }[] = [
	{ base: '/foundations', guides: foundationGuides },
	{ base: '/capabilities', guides: capabilityGuides },
	{ base: '/guides', guides: taskGuides },
	{ base: '/tooling', guides: toolingGuides },
	{ base: '/reference', guides: referenceGuides }
];

describe('search index', () => {
	it('indexes section headings, not just page titles', () => {
		const sections = searchEntries.filter((entry) => entry.kind === 'section');
		const guideSectionCount = tracks
			.flatMap((track) => track.guides)
			.reduce((total, guide) => total + guide.sections.length, 0);

		expect(guideSectionCount).toBeGreaterThan(0);
		expect(sections.length).toBeGreaterThanOrEqual(guideSectionCount);
		expect(searchEntries.length).toBeGreaterThan(200);
	});

	it('deep-links every guide section to an anchor the page actually renders', () => {
		for (const { base, guides } of tracks) {
			for (const guide of guides) {
				for (const section of guide.sections) {
					// GuidePage renders `id={toAnchorId(section.title)}` from the same helper.
					const href = `${base}/${guide.slug}#${toAnchorId(section.title)}`;
					expect(
						searchEntries.some((entry) => entry.href === href),
						`missing search entry for ${href}`
					).toBe(true);
				}
			}
		}
	});

	it('has no duplicate entries', () => {
		const keys = searchEntries.map((entry) => `${entry.kind}:${entry.href}:${entry.label}`);
		expect(new Set(keys).size).toBe(keys.length);
	});

	it('returns page suggestions for an empty query', () => {
		const results = searchDocs('');
		expect(results.length).toBeGreaterThan(0);
		expect(results.every((entry) => entry.kind === 'page')).toBe(true);
	});

	it('ranks an exact heading match above pages that merely mention it', () => {
		const [first] = searchDocs('Retrieval is not authority');
		expect(first.kind).toBe('section');
		expect(first.href).toBe('/reference/ai-and-retrieval#retrieval-is-not-authority');
	});

	it('finds a component by name and opens the package Components tab', () => {
		const [first] = searchDocs('Combobox');
		expect(first.label).toBe('Combobox');
		expect(first.href).toContain('?tab=components');
	});

	it('matches on multiple words in any order', () => {
		const results = searchDocs('tenant scope');
		expect(results.length).toBeGreaterThan(0);
	});

	it('returns nothing for a query with no match', () => {
		expect(searchDocs('zzzznotathing')).toHaveLength(0);
	});
});
