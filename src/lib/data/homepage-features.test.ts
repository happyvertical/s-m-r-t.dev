import { describe, expect, it } from 'vitest';
import { agentsTopics } from '$lib/data/agents';
import { homepageFeatures, homepageMoneyNote } from '$lib/data/homepage-features';
import { interactionContent } from '$lib/data/interaction';
import { applicationModuleClusters } from '$lib/data/modules';
import { searchDocs } from '$lib/data/search';
import { whySmrtClaims } from '$lib/data/why-smrt-claims';
import { SMRT_VERSION } from '$lib/version';

/**
 * Mirrors `scripts/check-copy.mjs`: descriptive sentences hold at most 25
 * words and a passage at most 6 sentences. `check:copy` only warns; this pins
 * the homepage copy to the limit so a landing-page sentence cannot drift long.
 */
const SENTENCE_WORD_LIMIT = 25;
const PASSAGE_SENTENCE_LIMIT = 6;

function sentences(text: string): string[] {
	return text
		.replace(/(["“]).*?(["”])/gu, ' QUOTED_TEXT ')
		.split(/(?<=[.!?])\s+/u)
		.map((sentence) => sentence.trim())
		.filter(Boolean);
}

function wordCount(sentence: string): number {
	return sentence.match(/[\p{L}\p{N}][\p{L}\p{N}@_./:'’()-]*/gu)?.length ?? 0;
}

function expectWithinCopyLimits(text: string, where: string) {
	const parts = sentences(text);
	expect(parts.length, `${where} has ${parts.length} sentences`).toBeLessThanOrEqual(
		PASSAGE_SENTENCE_LIMIT
	);
	for (const sentence of parts) {
		expect(
			wordCount(sentence),
			`${where}: "${sentence}" has ${wordCount(sentence)} words`
		).toBeLessThanOrEqual(SENTENCE_WORD_LIMIT);
	}
}

/** In-page anchors the data links to, by landing route. */
const knownAnchors: Record<string, Set<string>> = {
	'/modules': new Set(applicationModuleClusters.map((cluster) => cluster.id)),
	'/agents': new Set(agentsTopics.map((topic) => topic.slug)),
	'/interaction': new Set(interactionContent.guides.map((guide) => guide.slug))
};

describe('homepage feature sections (#321 slice B)', () => {
	it('renders six sections with unique ids and the agreed order', () => {
		expect(homepageFeatures.map((feature) => feature.id)).toEqual([
			'assistant',
			'agents-propose-people-confirm',
			'ask-for-a-report',
			'paperwork-in-proposals-out',
			'who-can-see-what',
			'outside-agents-same-rules'
		]);
	});

	it('labels only ingestion as Preview, and keeps the PostgreSQL qualifier', () => {
		const preview = homepageFeatures.filter((feature) => feature.label === 'Preview');
		expect(preview.map((feature) => feature.id)).toEqual(['paperwork-in-proposals-out']);

		const visibility = homepageFeatures.find((feature) => feature.id === 'who-can-see-what');
		expect(visibility?.body.join(' ')).toContain('on PostgreSQL the database enforces it too');
	});

	it('states the propose-then-confirm rule with its four real instances', () => {
		const rule = homepageFeatures.find((feature) => feature.id === 'agents-propose-people-confirm');
		expect(rule?.points?.map((point) => point.label)).toEqual([
			'Forms',
			'Approvals',
			'Agent instructions',
			'Reports and paperwork'
		]);
	});

	it('keeps every sentence within the copy-length limits', () => {
		for (const feature of homepageFeatures) {
			expectWithinCopyLimits(feature.title, `${feature.id} title`);
			feature.body.forEach((paragraph, index) =>
				expectWithinCopyLimits(paragraph, `${feature.id} body[${index}]`)
			);
			for (const point of feature.points ?? []) {
				expectWithinCopyLimits(point.body, `${feature.id} point ${point.label}`);
			}
			expect(feature.body.length, `${feature.id} paragraphs`).toBeLessThanOrEqual(2);
		}
		expectWithinCopyLimits(homepageMoneyNote.body, 'money note');
		expect(sentences(homepageMoneyNote.body)).toHaveLength(1);
	});

	it('links only to internal pages, with anchors the landing pages render', () => {
		const links = [
			...homepageFeatures.flatMap((feature) => feature.links),
			{ label: homepageMoneyNote.linkLabel, href: homepageMoneyNote.href }
		];
		expect(links.length).toBeGreaterThan(homepageFeatures.length);
		for (const link of links) {
			expect(link.href, link.label).toMatch(/^\/[a-z]/);
			expect(link.label.toLowerCase()).not.toMatch(/learn more|click here/);
			const [path, anchor] = link.href.split('#');
			if (anchor === undefined) continue;
			expect(knownAnchors[path], `${link.href}: no anchor inventory for ${path}`).toBeDefined();
			expect(
				knownAnchors[path].has(anchor),
				`${link.href} points at an anchor ${path} does not render`
			).toBe(true);
		}
		// Route existence for every internal href literal is enforced by
		// `src/lib/integrity.test.ts`, which scans this data file too.
	});

	it('names an evidence row per section, each verified against the installed release', () => {
		const claimsById = new Map(whySmrtClaims.map((claim) => [claim.id, claim]));
		const evidenceIds = homepageFeatures.map((feature) => feature.evidenceId);

		expect(new Set(evidenceIds).size).toBe(homepageFeatures.length);
		for (const feature of homepageFeatures) {
			const claim = claimsById.get(feature.evidenceId);
			expect(claim, `${feature.id}: no whySmrtClaims row "${feature.evidenceId}"`).toBeDefined();
			expect(claim?.source.href).toContain(`/blob/v${SMRT_VERSION}/packages/`);
			expect(claim?.source.href).toMatch(/\/AGENTS\.md$/);
		}
	});

	it('is discoverable from the command palette in plain words', () => {
		expect(searchDocs('assistant').some((entry) => entry.href === '/#assistant')).toBe(true);
		expect(searchDocs('who can see what')[0]).toMatchObject({ href: '/#who-can-see-what' });
		expect(searchDocs('paperwork')[0]).toMatchObject({ href: '/#paperwork-in-proposals-out' });
		expect(searchDocs('outside agents')[0]).toMatchObject({ href: '/#outside-agents-same-rules' });
	});
});
