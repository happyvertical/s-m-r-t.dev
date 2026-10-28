import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SvelteSet } from 'svelte/reactivity';
import { features } from '$lib/data/features';
import SkyMap from './SkyMap.svelte';

beforeEach(() => {
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
});

function mount(selected = new SvelteSet<string>()) {
	const calls = { feature: [] as string[], group: [] as string[], build: 0, clear: 0 };
	const view = render(SkyMap, {
		props: {
			size: { width: 1400, height: 800 },
			selected,
			count: selected.size,
			buildTarget: '/build-a-boilerplate',
			flight: 0,
			ontogglefeature: (id: string) => calls.feature.push(id),
			ontogglegroup: (id: string) => calls.group.push(id),
			onbuild: (event: MouseEvent) => {
				event.preventDefault();
				calls.build += 1;
			},
			onclear: () => (calls.clear += 1)
		}
	});
	return { ...view, calls };
}

describe('SkyMap (#381)', () => {
	it('renders nine group buttons and one checkbox chip per feature', () => {
		const { container } = mount();

		expect(container.querySelectorAll('g.title[role="button"]')).toHaveLength(9);
		const chips = container.querySelectorAll('g.chip[role="checkbox"]');
		expect(chips).toHaveLength(features.length);
		for (const chip of chips) expect(chip.getAttribute('aria-checked')).toBe('false');
		expect(container.querySelectorAll('g.chip.niche').length).toBe(
			features.filter((f) => !f.everyday).length
		);
	});

	it('reports chip and group clicks and answers Space and Enter', async () => {
		const { container, calls } = mount();
		const chip = container.querySelector('g.chip')!;
		const title = container.querySelector('g.title')!;

		await fireEvent.click(chip);
		await fireEvent.keyDown(chip, { key: ' ' });
		await fireEvent.click(title);
		await fireEvent.keyDown(title, { key: 'Enter' });

		expect(calls.feature).toHaveLength(2);
		expect(calls.group).toEqual(['sell', 'sell']);
	});

	it('marks selected chips and a lit group, and counts on the sun', () => {
		const selected = new SvelteSet(['customers', 'orders', 'invoices', 'products']);
		const { container } = mount(selected);

		expect(container.querySelectorAll('g.chip.sel')).toHaveLength(4);
		expect(container.querySelector('g.chip.sel')!.getAttribute('aria-checked')).toBe('true');
		expect(container.querySelector('g.title.all')).not.toBeNull();
		expect(container.querySelector('a.hub .badge text')?.textContent).toBe('4');
		expect(container.querySelector('button.clear')).not.toBeNull();
	});

	it('shows the hint on hover and BUILD runs the hand-off', async () => {
		const { container, calls } = mount();
		const chip = container.querySelector('g.chip')!;

		await fireEvent.mouseEnter(chip);
		await vi.waitFor(() =>
			expect(container.querySelector('.hint')!.textContent!.trim().length).toBeGreaterThan(0)
		);
		await fireEvent.click(container.querySelector('a.hub')!);
		expect(calls.build).toBe(1);
	});
});
