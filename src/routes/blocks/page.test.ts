import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import BlockPage from '$lib/components/BlockPage.svelte';
import { blockBranches, buildingBlocks, getBuildingBlock } from '$lib/data/blocks';
import { getPackage } from '$lib/data/packages';
import { entries, load } from './[slug]/+page';
import Landing from './+page.svelte';

afterEach(cleanup);

const oldClusterIds = [
	'identity-and-access',
	'agents-and-automation',
	'content-and-media',
	'commerce-and-operations',
	'support-and-projects',
	'analytics-and-growth',
	'domain-knowledge',
	'mobile'
];

describe('/blocks landing', () => {
	it('lists the four branches and every block, linked to its page', () => {
		const { container } = render(Landing);
		expect(blockBranches).toHaveLength(4);
		expect(buildingBlocks).toHaveLength(23);
		expect(container.querySelectorAll('section.branch')).toHaveLength(4);
		expect(container.querySelector('h1')?.textContent).toBe('Agentic building blocks');
		for (const block of buildingBlocks) {
			const entry = container.querySelector(`li#${block.id}`);
			expect(entry, `${block.id} entry`).toBeTruthy();
			expect(entry!.querySelector(`a[href="/blocks/${block.id}"]`)?.textContent).toContain(
				block.title
			);
			expect(entry!.textContent).toContain(block.capability);
		}
	});

	it('mounts the building blocks map above the branch lists', () => {
		const { container } = render(Landing);
		const map = container.querySelector('.block-map');

		expect(map?.getAttribute('data-layout')).toBe('full');
		expect(map?.querySelectorAll('svg a.leaf')).toHaveLength(buildingBlocks.length);
		expect(map?.querySelector('a.centre')?.getAttribute('href')).toBe('/build-a-boilerplate');
		expect(
			map!.compareDocumentPosition(container.querySelector('section.branch')!) &
				Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();
	});

	it('keeps every old /modules cluster id as an anchor', () => {
		const { container } = render(Landing);
		for (const id of oldClusterIds) {
			expect(container.querySelector(`#${id}`), `#${id}`).toBeTruthy();
		}
		const alias = (id: string, target: string) =>
			expect(
				container.querySelector(`#${target}`)?.contains(container.querySelector(`#${id}`))
			).toBe(true);
		alias('identity-and-access', 'people-and-permissions');
		alias('agents-and-automation', 'agents-included');
		alias('commerce-and-operations', 'commerce-and-money');
		alias('support-and-projects', 'operations');
		alias('analytics-and-growth', 'insight-and-marketing');
		alias('domain-knowledge', 'facts');
	});
});

describe('/blocks/[slug]', () => {
	it('prerenders one entry per block and 404s an unknown slug', () => {
		expect((entries() as { slug: string }[]).map((entry) => entry.slug)).toEqual(
			buildingBlocks.map((b) => b.id)
		);
		expect(() => load({ params: { slug: 'nope' } } as Parameters<typeof load>[0])).toThrow();
	});

	for (const block of buildingBlocks) {
		it(`renders ${block.id} in the fixed order`, () => {
			const { container } = render(BlockPage, { block });
			const h1 = container.querySelector('h1')!;
			expect(h1.textContent).toContain(block.title);
			const eyebrow = container.querySelector('.eyebrow')!;
			expect(eyebrow.textContent).toBe(blockBranches.find((b) => b.id === block.branch)!.title);

			const headings = [...container.querySelectorAll('h2')].map((h) => h.textContent);
			expect(headings).toEqual([
				'Building this yourself',
				'What comes in the box',
				'What you still decide',
				'Packages'
			]);
			const order = [container.querySelector('.capability')!, ...container.querySelectorAll('h2')];
			order.forEach((node, index) => {
				if (index === 0) return;
				expect(
					order[index - 1].compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING
				).toBeTruthy();
			});
			expect(container.querySelector('.capability')!.textContent).toBe(block.capability);

			for (const item of [...block.fromScratch, ...block.supplied, ...block.youDecide]) {
				expect(container.textContent).toContain(item);
			}
			for (const slug of block.packages) {
				expect(container.querySelector(`a[href="/docs/reference/packages/${slug}"]`)).toBeTruthy();
			}
			for (const guide of block.guides) {
				expect(container.querySelector(`a[href="${guide.href}"]`)).toBeTruthy();
			}
			expect(!!container.querySelector('a[href="/docs/reference/evidence"]')).toBe(
				!!block.evidence?.length
			);
		});
	}

	it('shows the Preview chip exactly when a package behind the block is new', () => {
		for (const block of buildingBlocks) {
			const { container } = render(BlockPage, { block });
			const derived = block.packages.some((slug) => getPackage(slug)?.status === 'new');
			expect(!!container.querySelector('h1 .preview-chip'), block.id).toBe(derived);
			cleanup();
		}
		expect(getBuildingBlock('ingestion')).toBeTruthy();
	});
});
