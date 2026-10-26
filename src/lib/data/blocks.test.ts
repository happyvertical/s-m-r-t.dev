/**
 * The contract for the building-block data (#352 slice A, #353).
 *
 * The block map is the one place a builder sees every capability at once, so
 * it must never silently omit a package, point at a page that does not exist,
 * or drift into the register the epic rules out. Each rule the epic states is
 * a test here rather than prose someone has to remember.
 */
import { describe, expect, it } from 'vitest';
import {
	blockBranches,
	buildingBlocks,
	toolingPackageSlugs,
	type BlockBranchId
} from '$lib/data/blocks';
import { packages } from '$lib/data/packages';
import { whySmrtClaims } from '$lib/data/why-smrt-claims';
import { GET as sitemap } from '../../routes/sitemap.xml/+server';

// The handler ignores its request event; it renders straight from the data.
const sitemapXml = await (await sitemap({} as unknown as Parameters<typeof sitemap>[0])).text();

const packageSlugs = new Set(packages.map((pkg) => pkg.slug));
const branchIds = blockBranches.map((branch) => branch.id);
const claimIds = new Set(whySmrtClaims.map((claim) => claim.id));

/** Every prose string a block or branch carries, for register checks. */
const allText = JSON.stringify([buildingBlocks, blockBranches]);

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

function wordCount(sentence: string): number {
	return sentence.trim().split(/\s+/u).filter(Boolean).length;
}

describe('building block branches', () => {
	it('are exactly agents, basics, ready-made and screens, in that order', () => {
		expect(branchIds).toEqual(['agents', 'basics', 'ready-made', 'screens']);
		expect(blockBranches.map((branch) => branch.order)).toEqual([1, 2, 3, 4]);
	});

	it('carry the first-time-builder titles Will chose', () => {
		expect(blockBranches.map((branch) => branch.title)).toEqual([
			'Agents',
			'The Basics',
			'Ready-made pieces',
			'Screens'
		]);
		for (const branch of blockBranches) {
			expect(branch.lede, `${branch.id} needs a lede`).toBeTruthy();
		}
	});
});

describe('building blocks', () => {
	it('has 23 blocks with unique ids, each on an existing branch', () => {
		expect(buildingBlocks).toHaveLength(23);

		const ids = buildingBlocks.map((block) => block.id);
		expect(new Set(ids).size).toBe(ids.length);

		for (const block of buildingBlocks) {
			expect(branchIds, `${block.id} names branch ${block.branch}`).toContain(block.branch);
		}
	});

	it('gives every branch at least one block', () => {
		for (const branch of blockBranches) {
			expect(
				buildingBlocks.some((block) => block.branch === branch.id),
				`${branch.id} has no blocks`
			).toBe(true);
		}
	});

	it('keeps a hand-typed status out of titles; status derives from packages.ts', () => {
		for (const block of buildingBlocks) {
			expect(block.title, `${block.id} title carries a status`).not.toMatch(
				/\b(preview|new|stable|stub)\b/i
			);
			expect(block.title).not.toMatch(/[()]/);
		}
	});

	it('states each capability in one sentence of at most 25 words', () => {
		for (const block of buildingBlocks) {
			const sentence = block.capability.trim();
			expect(wordCount(sentence), `${block.id}: "${sentence}"`).toBeLessThanOrEqual(25);
			expect(sentence, `${block.id} capability must end with a period`).toMatch(/\.$/);
			// One sentence: no sentence terminator before the final one.
			expect(sentence.slice(0, -1), `${block.id} capability is more than one sentence`).not.toMatch(
				/[.!?](\s|$)/
			);
		}
	});

	it('keeps the three lists inside the block page budget (3–5, 3–5, 2–4 bullets)', () => {
		for (const block of buildingBlocks) {
			expect(block.fromScratch.length, `${block.id} fromScratch`).toBeGreaterThanOrEqual(3);
			expect(block.fromScratch.length, `${block.id} fromScratch`).toBeLessThanOrEqual(5);
			expect(block.supplied.length, `${block.id} supplied`).toBeGreaterThanOrEqual(3);
			expect(block.supplied.length, `${block.id} supplied`).toBeLessThanOrEqual(5);
			expect(block.youDecide.length, `${block.id} youDecide`).toBeGreaterThanOrEqual(2);
			expect(block.youDecide.length, `${block.id} youDecide`).toBeLessThanOrEqual(4);
		}
	});

	it('lands each block page in the ~250–400 word budget', () => {
		for (const block of buildingBlocks) {
			const words = [
				block.title,
				block.capability,
				...block.fromScratch,
				...block.supplied,
				...block.youDecide,
				...block.guides.map((guide) => guide.label)
			].reduce((total, text) => total + wordCount(text), 0);
			// The renderer adds its fixed headings, the branch eyebrow and the
			// package chips on top, so the data alone sits under the page's lower
			// bound; a single-package block (Tags, Places) is the floor.
			expect(words, `${block.id} has ${words} words of copy`).toBeGreaterThanOrEqual(130);
			expect(words, `${block.id} has ${words} words of copy`).toBeLessThanOrEqual(400);
		}
	});
});

describe('building block packages', () => {
	it('names only packages that exist in packages.ts', () => {
		for (const block of buildingBlocks) {
			expect(block.packages.length, `${block.id} lists no packages`).toBeGreaterThan(0);
			for (const slug of block.packages) {
				expect(packageSlugs.has(slug), `${block.id} names unknown package ${slug}`).toBe(true);
			}
			expect(new Set(block.packages).size, `${block.id} repeats a package`).toBe(
				block.packages.length
			);
		}
		for (const slug of toolingPackageSlugs) {
			expect(packageSlugs.has(slug), `tooling names unknown package ${slug}`).toBe(true);
		}
	});

	it('places every published package in at least one block or under Tooling', () => {
		const covered = new Set([
			...buildingBlocks.flatMap((block) => block.packages),
			...toolingPackageSlugs
		]);
		const missing = packages.map((pkg) => pkg.slug).filter((slug) => !covered.has(slug));
		expect(
			missing,
			`Published packages absent from every block and from toolingPackageSlugs: ${missing.join(', ')}. ` +
				'Add each to a block in blocks.ts, or to toolingPackageSlugs if it is a developer tool.'
		).toEqual([]);
	});

	it('keeps the proposal’s non-block packages under Tooling', () => {
		for (const slug of [
			'smrt-cli',
			'smrt-app-cli',
			'smrt-vitest',
			'smrt-template-sveltekit',
			'smrt-template-site-static-json',
			'smrt-workbench',
			'smrt-app-runtime',
			'smrt-planner'
		]) {
			expect(toolingPackageSlugs, `${slug} should be tooling`).toContain(slug);
		}
	});
});

describe('building block guides', () => {
	it('links only to pages the sitemap prerenders', () => {
		for (const block of buildingBlocks) {
			expect(block.guides.length, `${block.id} has no guides`).toBeGreaterThan(0);
			for (const guide of block.guides) {
				const [path] = guide.href.split('#');
				expect(guide.label, `${block.id} guide ${guide.href} has no label`).toBeTruthy();
				expect(
					sitemapXml.includes(`<loc>https://s-m-r-t.dev${path}</loc>`),
					`${block.id} → ${guide.href} is not a prerendered page (sitemap.xml/+server.ts). ` +
						'Point at a registered guide, package page or landing page.'
				).toBe(true);
			}
		}
	});
});

describe('building block evidence', () => {
	it('cites only rows that exist in why-smrt-claims.ts', () => {
		for (const block of buildingBlocks) {
			for (const id of block.evidence ?? []) {
				expect(claimIds.has(id), `${block.id} cites unknown evidence row ${id}`).toBe(true);
			}
		}
	});

	it('keeps the verified People sentence verbatim and avoids the overstatement', () => {
		const people = buildingBlocks.find((block) => block.id === 'people-and-permissions');
		expect(people?.supplied).toContain(
			'A Person is a kind of Profile, so relationships, metadata, assets, audit history and facts attached to the profile are reachable through one record and its generated tools.'
		);
		const peopleText = JSON.stringify(people);
		// Not established at the verified release; see the epic's Decisions.
		expect(peopleText).not.toMatch(/everything about a person/i);
		expect(peopleText).not.toMatch(/tags, places (and|or) events attach/i);
	});
});

describe('building block register', () => {
	it('contains none of the phrases the epic rules out', () => {
		for (const pattern of bannedPhrases) {
			expect(allText, `blocks copy matches ${pattern}`).not.toMatch(pattern);
		}
	});

	it('writes build-a-boilerplate lowercase and hyphenated when it appears', () => {
		expect(allText).not.toMatch(/Build[- ]a[- ]boilerplate/);
		expect(allText).not.toMatch(/build a boilerplate/i);
	});

	it('never claims "my app has this"; the reader test is "I won’t build this from scratch"', () => {
		expect(allText).not.toMatch(/your app has/i);
		expect(allText).not.toMatch(/my app has/i);
	});

	it('uses the branch union the data declares', () => {
		const branches: BlockBranchId[] = ['agents', 'basics', 'ready-made', 'screens'];
		expect(branchIds).toEqual(branches);
	});
});
