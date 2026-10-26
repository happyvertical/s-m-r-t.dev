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
		const node = container.querySelector('svg a.n.d2') as SVGAElement;

		expect(node.getAttribute('aria-label')).toMatch(/: .+/);
		node
			.querySelector('circle.dot')!
			.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		await vi.waitFor(() => expect(node.classList.contains('sel')).toBe(true));
		expect(goto).not.toHaveBeenCalled();
		expect(node.querySelector('circle.ring')).not.toBeNull();
		expect(node.getAttribute('aria-label')).toMatch(/, selected: /);
		expect(container.querySelector('svg a.hub text')?.textContent).toBe('BUILD · 1');
		expect(JSON.parse(sessionStorage.getItem('smrt-map-selection')!)).toHaveLength(1);

		node
			.querySelector('text')!
			.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
		expect(goto).toHaveBeenCalledWith(node.getAttribute('href'));
		expect(node.classList.contains('sel')).toBe(true);
	});

	it('selects with Space and restores the selection after a round trip', async () => {
		const { container, unmount } = render(FeatureGraph);
		const nodes = [...container.querySelectorAll('svg a.n.d2')];
		for (const node of nodes.slice(0, 3)) {
			node.dispatchEvent(
				new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
			);
		}
		await vi.waitFor(() =>
			expect(container.querySelector('svg a.hub text')?.textContent).toBe('BUILD · 3')
		);
		const href = container.querySelector('svg a.hub')!.getAttribute('href')!;
		expect(href).toMatch(/^\/build-a-boilerplate\?features=[a-z-]+(,[a-z-]+){2}$/);
		unmount();

		const again = render(FeatureGraph);
		await vi.waitFor(() =>
			expect(again.container.querySelector('svg a.hub text')?.textContent).toBe('BUILD · 3')
		);
		expect(again.container.querySelectorAll('svg a.n.sel')).toHaveLength(3);
	});

	it('shows one hover sentence and lights the section', async () => {
		const { container } = render(FeatureGraph);
		const node = [...container.querySelectorAll('svg a.n.d2')].find(
			(a) => a.querySelector('text')?.textContent === 'Approvals'
		)!;
		node.dispatchEvent(new MouseEvent('mouseenter'));

		await vi.waitFor(() => {
			expect(container.querySelector('.hint')?.textContent?.trim()).toBe(
				features.find((f) => f.id === 'approvals')!.hint
			);
		});
		const lit = [...container.querySelectorAll('svg a.n.on')].map(
			(a) => a.querySelector('text')?.textContent
		);
		expect(lit).toEqual(expect.arrayContaining(['Agents', 'Approvals']));
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
});
