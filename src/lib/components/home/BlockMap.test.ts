import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { blockIsPreview } from '$lib/data/block-status';
import { blockBranches, buildingBlocks } from '$lib/data/blocks';
import BlockMap from './BlockMap.svelte';
import source from './BlockMap.svelte?raw';

afterEach(cleanup);

const squash = (node: Element | null | undefined) =>
	node?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe('BlockMap', () => {
	it('renders the four branches and all 23 blocks as SVG links with titles', () => {
		const { container } = render(BlockMap);
		const leaves = [...container.querySelectorAll('svg a.leaf')];

		expect(blockBranches.map((branch) => branch.title)).toEqual([
			'Agents',
			'The Basics',
			'Ready-made pieces',
			'Screens'
		]);
		expect(container.querySelectorAll('svg g.branch')).toHaveLength(4);
		expect(buildingBlocks).toHaveLength(23);
		expect(leaves).toHaveLength(23);
		expect(leaves.map((leaf) => leaf.getAttribute('href'))).toEqual(
			buildingBlocks.map((block) => `/blocks/${block.id}`)
		);
		leaves.forEach((leaf, index) => {
			expect(leaf.querySelector(':scope > title')?.textContent).toContain(
				buildingBlocks[index].title
			);
		});
	});

	it('puts build-a-boilerplate at the centre, in the map and above the lists', () => {
		const { container } = render(BlockMap);
		const svgCentre = container.querySelector('svg a.centre');
		const listCentre = container.querySelector('a.centre-link');

		expect(svgCentre?.getAttribute('href')).toBe('/build-a-boilerplate');
		expect(squash(svgCentre?.querySelector('text'))).toBe('build-a-boilerplate');
		expect(listCentre?.getAttribute('href')).toBe('/build-a-boilerplate');
		expect(squash(listCentre)).toContain('build-a-boilerplate');
		expect(
			container
				.querySelector('a.centre-link')!
				.compareDocumentPosition(container.querySelector('.lists')!) &
				Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();
	});

	it('marks Preview blocks in words, in both the map and the lists', () => {
		const { container } = render(BlockMap);
		const previewIds = buildingBlocks.filter(blockIsPreview).map((block) => block.id);

		expect(previewIds.length).toBeGreaterThan(0);
		const marked = [...container.querySelectorAll('svg a.leaf.preview')].map((leaf) =>
			leaf.getAttribute('href')
		);
		expect(marked).toEqual(previewIds.map((id) => `/blocks/${id}`));
		for (const leaf of container.querySelectorAll('svg a.leaf.preview')) {
			expect(leaf.querySelector('.preview-text')?.textContent).toBe('Preview');
			expect(leaf.querySelector(':scope > title')?.textContent).toMatch(/\(Preview\)$/);
		}
		expect(container.querySelectorAll('svg a.leaf:not(.preview) .preview-text')).toHaveLength(0);
		expect(container.querySelectorAll('.lists .list-chip')).toHaveLength(previewIds.length);
	});

	it('renders the same blocks as four plain lists for narrow screens', () => {
		const { container } = render(BlockMap);
		const groups = [...container.querySelectorAll('.lists .list-group')];

		expect(groups).toHaveLength(4);
		groups.forEach((group, index) => {
			const branch = blockBranches[index];
			expect(squash(group.querySelector('.list-label'))).toBe(branch.title);
			const expected = buildingBlocks.filter((block) => block.branch === branch.id);
			expect(
				[...group.querySelectorAll('li a')].map((link) => [
					link.getAttribute('href'),
					link.textContent
				])
			).toEqual(expected.map((block) => [`/blocks/${block.id}`, block.title]));
		});
		expect(container.querySelectorAll('.lists a')).toHaveLength(23);
	});

	it('takes both sizes', () => {
		for (const layout of ['compact', 'full'] as const) {
			const { container } = render(BlockMap, { layout });
			expect(container.querySelector('.block-map')?.getAttribute('data-layout')).toBe(layout);
			cleanup();
		}
	});

	it('types no block name or slug by hand', () => {
		for (const block of buildingBlocks) {
			expect(source, block.id).not.toContain(`'${block.id}'`);
			expect(source, block.title).not.toContain(block.title);
		}
		for (const branch of blockBranches) {
			expect(source, branch.title).not.toContain(`'${branch.title}'`);
		}
	});

	it('keeps colours to the site tokens', () => {
		const style = source.slice(source.indexOf('<style>'));
		expect(style).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/);
	});
});
