import { describe, it, expect } from 'vitest';
import { guidePages } from '$lib/data/guide-families';
import { searchDocs, searchEntries } from '$lib/data/search';

describe('search index', () => {
	it('indexes section headings, not just page titles', () => {
		const sections = searchEntries.filter((entry) => entry.kind === 'section');
		// Families are discovered, not listed, so a new one is counted here the
		// moment it exists. `registration.test.ts` checks each one individually.
		const guideSectionCount = guidePages.reduce(
			(total, { guide }) => total + guide.sections.length,
			0
		);

		expect(guideSectionCount).toBeGreaterThan(0);
		expect(sections.length).toBeGreaterThanOrEqual(guideSectionCount);
		expect(searchEntries.length).toBeGreaterThan(200);
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
