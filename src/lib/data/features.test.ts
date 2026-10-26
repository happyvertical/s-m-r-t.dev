/**
 * The contract for the feature data (#361 slice A, #362).
 *
 * The map is the one place a builder sees every capability at once, so it
 * must never silently omit a package, point at an example that does not
 * exist, or drift into the register the epic rules out. Each rule the epic
 * states is a test here rather than prose someone has to remember.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	featurePath,
	featureSectionPath,
	featureSections,
	features,
	featuresInSection,
	getFeature,
	getFeatureSection,
	packageReferenceUrl,
	packageSourceUrl,
	toolingPackageSlugs,
	type FeatureSectionId
} from '$lib/data/features';
import { packages } from '$lib/data/packages';
import { resolvePlaygroundSlug } from '$lib/data/playgrounds';
import { SMRT_VERSION } from '$lib/version';

const packageSlugs = new Set(packages.map((pkg) => pkg.slug));
const sectionIds = featureSections.map((section) => section.id);

/** Every prose string a feature or section carries, for register checks. */
const allText = JSON.stringify([features, featureSections]);

/**
 * Exact phrasing the epic forbids. "Backend" is word-bounded so a package
 * name or an identifier such as `InferenceBackend` could not trip it, but a
 * bare "Backend" or "backend" in copy does.
 */
const bannedPhrases: RegExp[] = [
	/business software/i,
	/software agents/i,
	/AI decision engine/i,
	/\bbackend\b/i,
	/world models/i
];

/** The locked 9 × 49 list from #361, in map order. */
const lockedMap: Record<FeatureSectionId, string[]> = {
	agents: [
		'Tools',
		'Blueprint',
		'Agents',
		'Forms',
		'Memory',
		'Approvals',
		'Ingestion',
		'Jobs',
		'Webhooks',
		'Facts'
	],
	basics: ['Records', 'Fields', 'Flags', 'People', 'Tenants', 'Realtime', 'Reports'],
	screens: ['Shell', 'Mobile'],
	content: ['Articles', 'Assets', 'Images', 'Voice', 'Video', 'Comments'],
	messaging: ['Chat', 'Email', 'Slack', 'Social'],
	commerce: ['Commerce', 'Products', 'Ledgers', 'Subscriptions'],
	operations: ['Inventory', 'Manufacturing', 'Projects', 'Support', 'Timesheets', 'Expenses', 'HR'],
	marketing: ['Campaigns', 'Ads', 'Affiliates', 'Sales', 'Analytics', 'Properties'],
	world: ['Events', 'Places', 'Tags']
};

function wordCount(sentence: string): number {
	return sentence.trim().split(/\s+/u).filter(Boolean).length;
}

function expectOneSentence(text: string, label: string, maxWords: number) {
	const sentence = text.trim();
	expect(sentence, `${label} must end with a period`).toMatch(/\.$/);
	expect(sentence.slice(0, -1), `${label} is more than one sentence`).not.toMatch(/[.!?](\s|$)/);
	expect(wordCount(sentence), `${label}: "${sentence}"`).toBeLessThanOrEqual(maxWords);
}

describe('feature sections', () => {
	it('are the nine locked sections, in map order', () => {
		expect(sectionIds).toEqual([
			'agents',
			'basics',
			'screens',
			'content',
			'messaging',
			'commerce',
			'operations',
			'marketing',
			'world'
		]);
	});

	it('carry one word, one hint of at most 12 words, packages, reference and source', () => {
		for (const section of featureSections) {
			expect(section.word, `${section.id} word`).toMatch(/^[A-Z][A-Za-z]+$/);
			expectOneSentence(section.hint, `${section.id} hint`, 12);
			expect(section.packages.length, `${section.id} lists no packages`).toBeGreaterThan(0);
			expect(section.reference).toBe(packageReferenceUrl(section.packages[0]));
			expect(section.source).toBe(packageSourceUrl(section.packages[0]));
		}
	});

	it('list the union of their features’ packages, without repeats', () => {
		for (const section of featureSections) {
			const expected = new Set(featuresInSection(section.id).flatMap((item) => item.packages));
			expect(new Set(section.packages)).toEqual(expected);
			expect(new Set(section.packages).size).toBe(section.packages.length);
		}
	});
});

describe('features', () => {
	it('are the locked 49, each under its section in map order', () => {
		expect(features).toHaveLength(49);
		for (const section of featureSections) {
			expect(
				featuresInSection(section.id).map((item) => item.word),
				`${section.id} words`
			).toEqual(lockedMap[section.id]);
		}
	});

	it('have unique ids on an existing section, and route under /features', () => {
		const ids = features.map((item) => item.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const item of features) {
			expect(item.id, `${item.id} is not a slug`).toMatch(/^[a-z][a-z0-9-]*$/);
			expect(sectionIds, `${item.id} names section ${item.section}`).toContain(item.section);
			expect(featurePath(item)).toBe(`/features/${item.section}/${item.id}`);
		}
		for (const section of featureSections) {
			expect(featureSectionPath(section)).toBe(`/features/${section.id}`);
		}
	});

	it('carry every field of the locked shape', () => {
		for (const item of features) {
			expect(item.word, `${item.id} word`).toMatch(/^[A-Z][A-Za-z]*$/);
			expectOneSentence(item.hint, `${item.id} hint`, 12);
			expect(Array.isArray(item.packages), `${item.id} packages`).toBe(true);
			expect(typeof item.reference, `${item.id} reference`).toBe('string');
			expect(typeof item.source, `${item.id} source`).toBe('string');
			expect(['playground', 'still'], `${item.id} example kind`).toContain(item.example.kind);
			expect(Array.isArray(item.inTheBox), `${item.id} inTheBox`).toBe(true);
			expect(Array.isArray(item.recipes), `${item.id} recipes`).toBe(true);
			for (const recipe of item.recipes) expect(typeof recipe).toBe('string');
		}
	});

	it('put 3–5 distinct, non-empty nouns in the box', () => {
		for (const item of features) {
			expect(item.inTheBox.length, `${item.id} inTheBox`).toBeGreaterThanOrEqual(3);
			expect(item.inTheBox.length, `${item.id} inTheBox`).toBeLessThanOrEqual(5);
			expect(new Set(item.inTheBox).size, `${item.id} repeats a noun`).toBe(item.inTheBox.length);
			for (const noun of item.inTheBox) {
				expect(noun.trim(), `${item.id} has an empty noun`).toBeTruthy();
				expect(noun, `${item.id} noun "${noun}" is a sentence`).not.toMatch(/\.$/);
			}
		}
	});

	it('derive reference and source from the primary package at the installed tag', () => {
		for (const item of features) {
			const [primary] = item.packages;
			expect(item.reference).toBe(`/docs/reference/packages/${primary}`);
			expect(item.source).toBe(packageSourceUrl(primary));
			expect(item.source).toContain(`/tree/v${SMRT_VERSION}/packages/`);
		}
		// The monorepo keeps the prefix for a few directories and drops it elsewhere.
		expect(packageSourceUrl('smrt-ui')).toMatch(/\/packages\/smrt-ui$/);
		expect(packageSourceUrl('smrt-chat')).toMatch(/\/packages\/chat$/);
	});
});

describe('feature examples', () => {
	it('mount only playground entries that resolve in playgrounds.ts', () => {
		for (const item of features) {
			if (item.example.kind !== 'playground') continue;
			expect(
				resolvePlaygroundSlug(item.example.entry),
				`${item.id} → playground entry "${item.example.entry}" does not resolve; ` +
					'use a slug from listPlaygroundSlugs() or switch the example to a still.'
			).not.toBeNull();
		}
	});

	it('point every still at a file under static/', () => {
		for (const item of features) {
			if (item.example.kind !== 'still') continue;
			expect(item.example.src, `${item.id} still path`).toBe(`/stills/features/${item.id}.svg`);
			const file = resolve(process.cwd(), 'static', item.example.src.replace(/^\//, ''));
			expect(
				existsSync(file),
				`${item.id} still is missing at ${file}; run node scripts/generate-feature-stills.mjs`
			).toBe(true);
		}
	});

	it('use a live playground wherever one shows the feature', () => {
		// Locked in #362: the proposal names these packages as shipping entries.
		for (const id of [
			'agents',
			'forms',
			'jobs',
			'records',
			'fields',
			'people',
			'tenants',
			'articles',
			'assets',
			'images',
			'chat',
			'email',
			'slack',
			'commerce',
			'projects',
			'analytics',
			'events'
		]) {
			expect(getFeature(id)?.example.kind, `${id} should mount a playground`).toBe('playground');
		}
	});
});

describe('feature packages', () => {
	it('name only packages that exist in packages.ts, without repeats', () => {
		for (const item of features) {
			expect(item.packages.length, `${item.id} lists no packages`).toBeGreaterThan(0);
			for (const slug of item.packages) {
				expect(packageSlugs.has(slug), `${item.id} names unknown package ${slug}`).toBe(true);
			}
			expect(new Set(item.packages).size, `${item.id} repeats a package`).toBe(
				item.packages.length
			);
		}
		for (const slug of toolingPackageSlugs) {
			expect(packageSlugs.has(slug), `tooling names unknown package ${slug}`).toBe(true);
		}
	});

	it('place every published package in at least one feature or under Tooling', () => {
		const covered = new Set([...features.flatMap((item) => item.packages), ...toolingPackageSlugs]);
		const missing = packages.map((pkg) => pkg.slug).filter((slug) => !covered.has(slug));
		expect(
			missing,
			`Published packages absent from every feature and from toolingPackageSlugs: ${missing.join(', ')}. ` +
				'Add each to a feature in features.ts, or to toolingPackageSlugs if it is a developer tool.'
		).toEqual([]);
	});

	it('keep the epic’s package assignments for Messaging and Articles', () => {
		expect(getFeature('chat')?.packages[0]).toBe('smrt-chat');
		expect(getFeature('email')?.packages[0]).toBe('smrt-messages');
		expect(getFeature('slack')?.packages[0]).toBe('smrt-messages');
		expect(getFeature('social')?.packages).toEqual(['smrt-social', 'smrt-messages']);
		expect(getFeature('social')?.inTheBox).toContain('posts');
		expect(getFeature('articles')?.packages[0]).toBe('smrt-content');
		expect(getFeature('realtime')?.packages).toContain('smrt-web');
		expect(getFeature('flags')?.packages).toEqual(['smrt-features']);
	});
});

describe('feature register', () => {
	it('contains none of the phrases the epic rules out', () => {
		for (const pattern of bannedPhrases) {
			expect(allText, `features copy matches ${pattern}`).not.toMatch(pattern);
		}
	});

	it('writes build-a-boilerplate lowercase and hyphenated when it appears', () => {
		expect(allText).not.toMatch(/Build[- ]a[- ]boilerplate/);
		expect(allText).not.toMatch(/build a boilerplate/i);
	});

	it('uses Acme Corp example data, never the retired Mechanic example', () => {
		expect(allText).not.toMatch(/mechanic/i);
	});

	it('resolves lookups by id', () => {
		expect(getFeature('approvals')?.section).toBe('agents');
		expect(getFeatureSection('world')?.word).toBe('World');
		expect(getFeature('nope')).toBeUndefined();
	});
});
