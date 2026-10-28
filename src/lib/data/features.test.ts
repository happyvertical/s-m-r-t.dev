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
	offMapPackageSlugs,
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

/** The 9 × 41 list from #375, in map order. */
const lockedMap: Record<FeatureSectionId, string[]> = {
	sell: ['Customers', 'Orders', 'Invoices', 'Products', 'Quotes', 'Subscriptions', 'Payments'],
	buy: ['Vendors', 'Purchase orders', 'Expenses', 'Inventory'],
	make: ['Assemblies', 'Production', 'Stock'],
	team: ['People', 'Roles', 'Timesheets', 'HR', 'Approvals'],
	publish: ['Articles', 'Images', 'Video', 'Voice', 'Comments', 'Social'],
	talk: ['Chat', 'Email', 'Slack', 'Support'],
	grow: ['Campaigns', 'Analytics', 'Reports', 'Ads', 'Affiliates'],
	plan: ['Projects', 'Tasks', 'Events', 'Places'],
	assistant: ['Agents', 'Tools', 'Memory']
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
			'sell',
			'buy',
			'make',
			'team',
			'publish',
			'talk',
			'grow',
			'plan',
			'assistant'
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
	it('are the locked 41, each under its section in map order', () => {
		expect(features).toHaveLength(41);
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
			expect(item.word, `${item.id} word`).toMatch(/^[A-Z][A-Za-z]*( [a-z]+)?$/);
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
		// Playground entries the installed packages ship for the #375 list.
		for (const id of [
			'customers',
			'invoices',
			'quotes',
			'vendors',
			'purchase-orders',
			'people',
			'roles',
			'images',
			'articles',
			'chat',
			'email',
			'slack',
			'analytics',
			'reports',
			'projects',
			'events',
			'agents'
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
		for (const slug of [...toolingPackageSlugs, ...offMapPackageSlugs]) {
			expect(packageSlugs.has(slug), `tooling or off-map names unknown package ${slug}`).toBe(true);
		}
	});

	it('place every published package in at least one feature or under Tooling', () => {
		const covered = new Set([
			...features.flatMap((item) => item.packages),
			...toolingPackageSlugs,
			...offMapPackageSlugs
		]);
		const missing = packages.map((pkg) => pkg.slug).filter((slug) => !covered.has(slug));
		expect(
			missing,
			`Published packages absent from every feature, toolingPackageSlugs and offMapPackageSlugs: ${missing.join(', ')}. ` +
				'Add each to a feature in features.ts, to toolingPackageSlugs if it is a developer tool, or to offMapPackageSlugs if it is plumbing.'
		).toEqual([]);
	});

	it('keep the package assignments for Talk, Publish and Sell', () => {
		expect(getFeature('chat')?.packages[0]).toBe('smrt-chat');
		expect(getFeature('email')?.packages[0]).toBe('smrt-messages');
		expect(getFeature('slack')?.packages[0]).toBe('smrt-messages');
		expect(getFeature('social')?.packages).toEqual(['smrt-social', 'smrt-messages']);
		expect(getFeature('social')?.inTheBox).toContain('posts');
		expect(getFeature('articles')?.packages[0]).toBe('smrt-content');
		for (const id of ['customers', 'orders', 'quotes', 'invoices', 'payments']) {
			expect(getFeature(id)?.packages, id).toContain('smrt-commerce');
		}
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
		expect(getFeature('approvals')?.section).toBe('team');
		expect(getFeatureSection('assistant')?.word).toBe('Assistant');
		expect(getFeature('nope')).toBeUndefined();
	});
});

describe('everyday sets (#373)', () => {
	it('gives every section one to five everyday features', () => {
		for (const section of sectionIds) {
			const count = featuresInSection(section).filter((feature) => feature.everyday).length;
			expect(count, `${section} everyday features`).toBeGreaterThanOrEqual(1);
			expect(count, `${section} everyday features`).toBeLessThanOrEqual(5);
		}
	});

	it('names the approved set', () => {
		const everyday = (section: FeatureSectionId) =>
			featuresInSection(section)
				.filter((feature) => feature.everyday)
				.map((feature) => feature.id);
		expect(everyday('sell')).toEqual(['customers', 'orders', 'invoices', 'products']);
		expect(everyday('buy')).toEqual(['vendors', 'purchase-orders']);
		expect(everyday('make')).toEqual(['assemblies', 'production']);
		expect(everyday('team')).toEqual(['people', 'roles']);
		expect(everyday('publish')).toEqual(['articles', 'images']);
		expect(everyday('talk')).toEqual(['chat', 'email']);
		expect(everyday('grow')).toEqual(['campaigns', 'analytics', 'reports']);
		expect(everyday('plan')).toEqual(['projects', 'tasks']);
		expect(everyday('assistant')).toEqual(['agents', 'tools']);
	});
});

describe('the user’s-side rule (#375)', () => {
	it('keeps agentic plumbing off the map', () => {
		const offMap = [
			'blueprint',
			'forms',
			'ingestion',
			'webhooks',
			'facts',
			'records',
			'fields',
			'flags',
			'tenants',
			'realtime',
			'shell',
			'mobile',
			'tags',
			'jobs',
			'ledgers',
			'properties',
			'manufacturing',
			'commerce',
			'sales'
		];
		for (const id of offMap) expect(getFeature(id), `${id} is back on the map`).toBeUndefined();
	});

	it('maps recipes only where one exists in the installed planner catalog', () => {
		// Verified by build-handoff.test.ts against the catalog; here only the
		// features the issue says have no recipe yet must stay empty.
		for (const id of ['assemblies', 'production', 'subscriptions', 'agents', 'support', 'affiliates']) {
			expect(getFeature(id)?.recipes, `${id} has no planner recipe yet`).toEqual([]);
		}
	});
});
