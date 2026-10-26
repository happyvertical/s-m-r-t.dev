import { describe, it, expect } from 'vitest';
import { agentsTopics } from '$lib/data/agents';
import { featurePath, features } from '$lib/data/features';
import { frameworkTopics } from '$lib/data/framework';
import { guidePages } from '$lib/data/guide-families';
import { interactionContent } from '$lib/data/interaction';
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
		expect(first.href).toBe('/docs/reference/ai-and-retrieval#retrieval-is-not-authority');
	});

	it('finds a component by name and opens its generated contract page', () => {
		const [first] = searchDocs('Combobox');
		expect(first.label).toBe('Combobox');
		expect(first.href).toMatch(/^\/docs\/reference\/components\//);
	});

	it('matches on multiple words in any order', () => {
		const results = searchDocs('tenant scope');
		expect(results.length).toBeGreaterThan(0);
	});

	it('returns nothing for a query with no match', () => {
		expect(searchDocs('zzzznotathing')).toHaveLength(0);
	});

	describe('landing-page tracks', () => {
		it('gives every Framework topic a section-level entry (previously none)', () => {
			for (const topic of frameworkTopics) {
				const entry = searchEntries.find(
					(candidate) =>
						candidate.kind === 'section' && candidate.href === `/docs/framework#${topic.slug}`
				);
				expect(entry?.label, `missing entry for /framework#${topic.slug}`).toBe(topic.navTitle);
			}
		});

		it('gives every Framework subsection its own deep-linkable entry', () => {
			const topic = frameworkTopics[0];
			const item = topic.content[0];
			const entry = searchEntries.find(
				(candidate) =>
					candidate.kind === 'section' &&
					candidate.href ===
						`/docs/framework#${topic.slug}-${item.title
							.toLowerCase()
							.replace(/[^a-z0-9]+/g, '-')
							.replace(/(^-|-$)/g, '')}`
			);
			expect(entry?.label).toBe(item.title);
		});

		it('gives every Interaction concept a topic-level entry only (no invented subsection anchors)', () => {
			for (const guide of interactionContent.guides) {
				const entry = searchEntries.find(
					(candidate) =>
						candidate.kind === 'section' && candidate.href === `/docs/interaction#${guide.slug}`
				);
				expect(entry?.label, `missing entry for /interaction#${guide.slug}`).toBe(
					guide.navTitle ?? guide.title
				);
			}
			const subsectionEntries = searchEntries.filter((candidate) =>
				candidate.href.startsWith('/docs/interaction#human-agent-communication-')
			);
			expect(subsectionEntries).toHaveLength(0);
		});

		it('gives every Agents topic and subsection a section-level entry', () => {
			for (const topic of agentsTopics) {
				const topicEntry = searchEntries.find(
					(candidate) =>
						candidate.kind === 'section' && candidate.href === `/docs/agents#${topic.slug}`
				);
				expect(topicEntry?.label, `missing entry for /agents#${topic.slug}`).toBe(topic.navTitle);

				for (const item of topic.content) {
					const anchorId = item.title
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, '-')
						.replace(/(^-|-$)/g, '');
					const subEntry = searchEntries.find(
						(candidate) =>
							candidate.kind === 'section' &&
							candidate.href === `/docs/agents#${topic.slug}-${anchorId}`
					);
					expect(subEntry?.label, `missing entry for /agents#${topic.slug}-${anchorId}`).toBe(
						item.title
					);
				}
			}
		});

		it('resolves an Agents topic heading through fuzzy search', () => {
			const [first] = searchDocs('Where agents connect');
			expect(first.kind).toBe('section');
			expect(first.href).toBe('/docs/agents#where-agents-connect');
		});
	});

	describe('features', () => {
		it('gives every feature a page entry with its package slugs as keywords', () => {
			for (const item of features) {
				const entry = searchEntries.find(
					(candidate) => candidate.kind === 'page' && candidate.href === featurePath(item)
				);
				expect(entry?.label, `missing entry for ${featurePath(item)}`).toBe(item.word);
				expect(entry?.description).toBe(item.hint);
				expect(entry?.keywords).toEqual(item.packages);
			}
		});

		it('keeps the retired /blocks pages out of the index', () => {
			expect(searchEntries.some((entry) => entry.href.startsWith('/blocks'))).toBe(false);
		});

		it('keeps the retired module-cluster entries out of the index', () => {
			expect(searchEntries.some((entry) => entry.href.startsWith('/modules'))).toBe(false);
		});
	});
});
