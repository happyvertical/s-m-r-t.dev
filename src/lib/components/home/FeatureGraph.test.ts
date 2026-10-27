import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { featurePath, featureSectionPath, featureSections, features } from '$lib/data/features';
import FeatureGraph from './FeatureGraph.svelte';
import { fitGraph, HUB_RADIUS, RIM_RADIUS } from './graph-layout';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));

let resizeCallback: (() => void) | undefined;

beforeEach(() => {
	sessionStorage.clear();
	vi.stubGlobal(
		'ResizeObserver',
		class {
			constructor(callback: () => void) {
				resizeCallback = callback;
			}
			observe() {}
			disconnect() {}
		}
	);
	// The sun draws on a canvas jsdom does not implement; SunCanvas.test.ts covers it.
	vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
	vi.stubGlobal(
		'matchMedia',
		vi.fn((query: string) => ({
			matches: false,
			media: query,
			addEventListener: () => {},
			removeEventListener: () => {}
		}))
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
	resizeCallback = undefined;
});

const rim = (line: Element, cx: number, cy: number) =>
	Math.hypot(Number(line.getAttribute('x1')) - cx, Number(line.getAttribute('y1')) - cy);

const mappable = (nodes: Element[]) =>
	nodes.filter((a) => {
		const word = a.querySelector('text')?.textContent;
		return features.some((f) => f.word === word && f.recipes.length > 0);
	});

describe('FeatureGraph', () => {
	it('renders the hub, nine sections and forty-nine features', () => {
		const { container } = render(FeatureGraph);

		expect(container.querySelectorAll('svg a.hub')).toHaveLength(1);
		expect(container.querySelectorAll('svg a.n.d1')).toHaveLength(9);
		expect(container.querySelectorAll('svg a.n.d2')).toHaveLength(49);
		expect(container.querySelectorAll('svg circle')).toHaveLength(1 + 9 + 49);
		expect(container.querySelectorAll('svg line')).toHaveLength(9 + 49);
		expect(featureSections).toHaveLength(9);
		expect(features).toHaveLength(49);
	});

	it('links sections to their index and features to their showcase', () => {
		const { container } = render(FeatureGraph);

		for (const section of featureSections) {
			const node = [...container.querySelectorAll('svg a.n.d1')].find(
				(a) => a.querySelector('text')?.textContent === section.word
			);
			expect(node?.getAttribute('href')).toBe(featureSectionPath(section));
		}
		const hrefs = [...container.querySelectorAll('svg a.n.d2')].map((a) => a.getAttribute('href'));
		expect(hrefs).toEqual(expect.arrayContaining(features.map(featurePath)));
		expect(container.querySelector('svg a.hub')?.getAttribute('href')).toBe('/build-a-boilerplate');
	});

	it('starts every hub link at the sun rim', () => {
		const { container } = render(FeatureGraph);
		const hub = container.querySelector('svg a.hub')!.parentElement!.getAttribute('transform')!;
		const [cx, cy] = hub.match(/-?[\d.]+/g)!.map(Number);
		const lines = [...container.querySelectorAll('svg line.l1')];

		expect(lines).toHaveLength(9);
		for (const line of lines) expect(rim(line, cx, cy)).toBeCloseTo(RIM_RADIUS, 3);
		expect(RIM_RADIUS).toBeGreaterThan(HUB_RADIUS);
	});

	it('refits to the map when it resizes, without moving the rim', () => {
		const { container } = render(FeatureGraph);
		const map = container.querySelector('section.map') as HTMLElement;
		const svg = container.querySelector('svg')!;
		const before = svg.getAttribute('viewBox');
		const hubBefore = container
			.querySelector('svg a.hub')!
			.parentElement!.getAttribute('transform');

		Object.defineProperty(map, 'clientWidth', { configurable: true, value: 1000 });
		Object.defineProperty(map, 'clientHeight', { configurable: true, value: 700 });
		resizeCallback!();

		return vi.waitFor(() => {
			expect(svg.getAttribute('viewBox')).toBe('0 0 1000 700');
			expect(before).not.toBe(svg.getAttribute('viewBox'));
			const hub = container.querySelector('svg a.hub')!.parentElement!.getAttribute('transform')!;
			expect(hub).not.toBe(hubBefore);
			expect(hub).toBe('translate(500,350)');
			for (const line of container.querySelectorAll('svg line.l1')) {
				expect(rim(line, 500, 350)).toBeCloseTo(RIM_RADIUS, 3);
			}
		});
	});

	it('selects on circle click, opens on label click, and counts on the hub', async () => {
		const { goto } = await import('$app/navigation');
		const { container } = render(FeatureGraph);
		const node = mappable([...container.querySelectorAll('svg a.n.d2')])[0] as SVGAElement;

		expect(node.getAttribute('aria-label')).toMatch(/: .+/);
		node
			.querySelector('circle.dot')!
			.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		await vi.waitFor(() => expect(node.classList.contains('sel')).toBe(true));
		expect(goto).not.toHaveBeenCalled();
		expect(node.querySelector('circle.ring')).not.toBeNull();
		expect(node.getAttribute('aria-label')).toMatch(/, selected: /);
		expect(container.querySelector('svg a.hub > text')?.textContent).toBe('BUILD');
		expect(container.querySelector('svg a.hub .badge text')?.textContent).toBe('1');
		expect(JSON.parse(sessionStorage.getItem('smrt-map-selection')!)).toHaveLength(1);

		node
			.querySelector('text')!
			.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		expect(goto).toHaveBeenCalledWith(node.getAttribute('href'));
		expect(node.classList.contains('sel')).toBe(true);
	});

	it('selects with Space and restores the selection after a round trip', async () => {
		const { container, unmount } = render(FeatureGraph);
		const nodes = mappable([...container.querySelectorAll('svg a.n.d2')]);
		for (const node of nodes.slice(0, 3)) {
			node.dispatchEvent(
				new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
			);
		}
		await vi.waitFor(() =>
			expect(container.querySelector('svg a.hub .badge text')?.textContent).toBe('3')
		);
		const href = container.querySelector('svg a.hub')!.getAttribute('href')!;
		expect(href).toMatch(/^\/build-a-boilerplate\?features=[a-z-]+(,[a-z-]+){2}$/);
		unmount();

		const again = render(FeatureGraph);
		await vi.waitFor(() =>
			expect(again.container.querySelector('svg a.hub .badge text')?.textContent).toBe('3')
		);
		expect(again.container.querySelectorAll('svg a.n.sel')).toHaveLength(3);
	});

	it('shows one hover sentence and lights the section', async () => {
		const { container } = render(FeatureGraph);
		const node = [...container.querySelectorAll('svg a.n.d2')].find(
			(a) => a.querySelector('text')?.textContent === 'Chat'
		)!;
		node.dispatchEvent(new MouseEvent('mouseenter'));

		await vi.waitFor(() => {
			expect(container.querySelector('.hint')?.textContent?.trim()).toBe(
				features.find((f) => f.id === 'chat')!.hint
			);
		});
		const lit = [...container.querySelectorAll('svg a.n.on')].map(
			(a) => a.querySelector('text')?.textContent
		);
		expect(lit).toEqual(expect.arrayContaining(['Chat']));
		expect(container.querySelector('section.map')?.classList.contains('focus')).toBe(true);
	});

	it('stacks a BUILD button and nine sections with feature chips for phones', () => {
		const { container } = render(FeatureGraph);

		expect(container.querySelector('.stacks .hubbtn a')?.getAttribute('href')).toBe(
			'/build-a-boilerplate'
		);
		expect(container.querySelectorAll('.stacks .stack')).toHaveLength(9);
		expect(container.querySelectorAll('.stacks .stack li a')).toHaveLength(49);
	});
});

describe('group selection (#373)', () => {
	const sectionNode = (container: Element, word: string) =>
		[...container.querySelectorAll('svg a.n.d1')].find(
			(a) => a.querySelector('text')?.textContent === word
		) as SVGAElement;
	const click = (el: Element) =>
		el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
	const badge = (container: Element) =>
		container.querySelector('svg a.hub .badge text')?.textContent;
	const everyday = (section: string) => features.filter((f) => f.section === section && f.everyday);

	it('toggles the everyday set on a section circle click and clears the whole section on the next', async () => {
		const { goto } = await import('$app/navigation');
		vi.mocked(goto).mockClear();
		const { container } = render(FeatureGraph);
		const node = sectionNode(container, 'Content');

		click(node.querySelector('circle.dot')!);
		await vi.waitFor(() => expect(node.classList.contains('set')).toBe(true));
		expect(goto).not.toHaveBeenCalled();
		expect(container.querySelectorAll('svg a.n.d2.sel')).toHaveLength(everyday('content').length);
		expect(node.getAttribute('aria-label')).toMatch(/section, selected: /);
		expect(badge(container)).toBe(
			String(everyday('content').filter((f) => f.recipes.length).length)
		);

		// A niche feature on top; the next click clears the lot, niche included.
		const nicheId = features.find((f) => f.section === 'content' && !f.everyday)!.id;
		const niche = [...container.querySelectorAll('svg a.n.d2')].find(
			(a) => a.getAttribute('href') === `/features/content/${nicheId}`
		)!;
		click(niche.querySelector('circle.dot')!);
		await vi.waitFor(() => expect(niche.classList.contains('sel')).toBe(true));
		click(node.querySelector('circle.dot')!);
		await vi.waitFor(() => expect(node.classList.contains('set')).toBe(false));
		expect(container.querySelectorAll('svg a.n.d2.sel')).toHaveLength(0);
	});

	it('toggles with Space on a focused section circle and opens the index from the label', async () => {
		const { goto } = await import('$app/navigation');
		const { container } = render(FeatureGraph);
		const node = sectionNode(container, 'Agents');

		node.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
		await vi.waitFor(() => expect(node.classList.contains('set')).toBe(true));
		click(node.querySelector('text')!);
		expect(goto).toHaveBeenCalledWith(node.getAttribute('href'));
	});

	it('marks niche features in the hover text and gives a selected one the niche treatment', async () => {
		const { container } = render(FeatureGraph);
		const nicheF = features.find((f) => f.recipes.length && !f.everyday)!;
		const everydayF = features.find((f) => f.recipes.length && f.everyday)!;
		const find = (id: string) =>
			[...container.querySelectorAll('svg a.n.d2')].find((a) =>
				a.getAttribute('href')!.endsWith(`/${id}`)
			)!;

		expect(find(nicheF.id).getAttribute('aria-label')).toContain(' · niche');
		expect(find(everydayF.id).getAttribute('aria-label')).not.toContain('niche');
		click(find(nicheF.id).querySelector('circle.dot')!);
		await vi.waitFor(() => expect(find(nicheF.id).classList.contains('sel')).toBe(true));
		expect(find(nicheF.id).classList.contains('niche')).toBe(true);
		expect(find(nicheF.id).querySelector('circle.ring')).not.toBeNull();
	});

	it('gives each phone stack an Everyday set checkbox that drives the same rule', async () => {
		const { container } = render(FeatureGraph);
		const boxes = container.querySelectorAll<HTMLInputElement>('.stack .set input');
		expect(boxes).toHaveLength(9);

		boxes[1].click();
		await vi.waitFor(() => expect(boxes[1].checked).toBe(true));
		expect(container.querySelectorAll('.stack')[1].querySelectorAll('li.sel')).toHaveLength(
			everyday('basics').length
		);
		boxes[1].click();
		await vi.waitFor(() => expect(boxes[1].checked).toBe(false));
		expect(container.querySelectorAll('.stack li.sel')).toHaveLength(0);
	});
});

describe('fitGraph', () => {
	it('stretches to the viewport and keeps every node inside it', () => {
		for (const [w, h] of [
			[1440, 860],
			[1000, 700],
			[2400, 900]
		]) {
			const placed = fitGraph(w, h);
			expect(placed.nodes).toHaveLength(59);
			for (const node of placed.nodes) {
				expect(node.x).toBeGreaterThanOrEqual(0);
				expect(node.x).toBeLessThanOrEqual(w);
				expect(node.y).toBeGreaterThanOrEqual(0);
				expect(node.y).toBeLessThanOrEqual(h);
			}
			expect(placed.nodes[0].x).toBe(w / 2);
			expect(placed.nodes[0].y).toBe(h / 2);
		}
	});

	it('gives each section an angular slice that grows with its feature count', () => {
		const placed = fitGraph(1440, 860);
		const angleOf = (n: { x: number; y: number }) => Math.atan2(n.y - placed.cy, n.x - placed.cx);
		const counts = featureSections.map(
			(section) => features.filter((f) => f.section === section.id).length
		);
		const spans = featureSections.map((_, si) => {
			const angles = placed.nodes.filter((n) => n.section === si && n.depth === 2).map(angleOf);
			return Math.max(...angles) - Math.min(...angles);
		});
		const biggest = counts.indexOf(Math.max(...counts));
		const smallest = counts.indexOf(Math.min(...counts));
		expect(spans[biggest]).toBeGreaterThan(spans[smallest]);
	});

	it('marks features without a recipe, shows a hollow ring and leaves the count alone', async () => {
		const { container } = render(FeatureGraph);
		const nodes = [...container.querySelectorAll('svg a.n.d2')];
		const off = nodes.find((a) => a.classList.contains('unmapped')) as SVGAElement;
		expect(nodes.filter((a) => a.classList.contains('unmapped'))).toHaveLength(
			features.filter((f) => f.recipes.length === 0).length
		);

		off.dispatchEvent(new MouseEvent('mouseenter'));
		await vi.waitFor(() =>
			expect(container.querySelector('.hint')?.textContent).toContain('· not in the planner yet')
		);
		off
			.querySelector('circle.dot')!
			.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		await vi.waitFor(() => expect(off.classList.contains('sel')).toBe(true));
		expect(off.getAttribute('aria-label')).toContain('not in the planner yet');
		expect(container.querySelector('svg a.hub .badge')).toBeNull();
	});

	it('clears the selection with the Clear control and with Escape', async () => {
		const { container } = render(FeatureGraph);
		expect(container.querySelector('button.clear')).toBeNull();
		const pick = () =>
			mappable([...container.querySelectorAll('svg a.n.d2')])[0].dispatchEvent(
				new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
			);
		pick();
		await vi.waitFor(() => expect(container.querySelector('svg a.hub .badge')).not.toBeNull());
		(container.querySelector('button.clear') as HTMLButtonElement).click();
		await vi.waitFor(() => expect(container.querySelector('svg a.hub .badge')).toBeNull());
		expect(JSON.parse(sessionStorage.getItem('smrt-map-selection')!)).toEqual([]);

		pick();
		await vi.waitFor(() => expect(container.querySelector('svg a.hub .badge')).not.toBeNull());
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
		await vi.waitFor(() => expect(container.querySelector('svg a.hub .badge')).toBeNull());
		expect(container.querySelector('button.clear')).toBeNull();
	});

	it('selects from the phone stacks and shows the same badge', async () => {
		const { container } = render(FeatureGraph);
		const box = container.querySelector('.stacks li:not(.unmapped) input') as HTMLInputElement;
		expect(container.querySelectorAll('.stacks li input')).toHaveLength(features.length);
		box.click();
		await vi.waitFor(() => expect(container.querySelector('.hubbtn .badge')).not.toBeNull());
		expect(container.querySelector('.hubbtn a')?.textContent).toMatch(/^BUILD\s*1, 1 selected$/);
		expect(container.querySelector('.hubbtn a .sr')?.textContent).toBe(', 1 selected');
		(container.querySelector('.hubbtn button.clear') as HTMLButtonElement).click();
		await vi.waitFor(() => expect(container.querySelector('.hubbtn .badge')).toBeNull());
		box.click();
		await vi.waitFor(() => expect(container.querySelector('.hubbtn .badge')).not.toBeNull());
		expect(container.querySelector('.stacks li.sel')).not.toBeNull();
	});
});
