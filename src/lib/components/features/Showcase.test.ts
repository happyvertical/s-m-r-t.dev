import { cleanup, render } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { features, featureSections, getFeatureSection, type Feature } from '$lib/data/features';
import { resolvePlaygroundSlug } from '$lib/data/playgrounds';
import { alsoInTheBox } from './also-in-the-box';
import SectionIndex from './SectionIndex.svelte';
import Showcase from './Showcase.svelte';

beforeEach(() => {
	vi.stubGlobal(
		'matchMedia',
		vi.fn().mockImplementation(() => ({
			matches: false,
			media: '',
			onchange: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn()
		}))
	);
});
afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function showcase(feature: Feature) {
	return render(Showcase, { feature, section: getFeatureSection(feature.section)! });
}

function precedes(a: Element, b: Element) {
	return Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
}

describe('showcase template', () => {
	it('keeps the locked order', () => {
		const feature = features.find((item) => item.id === 'inventory')!;
		const { container } = showcase(feature);
		const order = [
			'nav.strip',
			'p.kicker',
			'h1',
			'p.one',
			'#in-the-box',
			'[data-example-kind]',
			'#also-in-the-box',
			'a.big:not(.src)',
			'a.big.src',
			'.use',
			'nav.pn'
		].map((selector) => {
			const found = container.querySelector(selector);
			expect(found, selector).toBeTruthy();
			return found!;
		});
		for (let i = 1; i < order.length; i += 1) {
			expect(precedes(order[i - 1], order[i]), `${i}`).toBe(true);
		}
	});

	it('says the feature name, sentence, nouns and the tick bar', () => {
		const feature = features.find((item) => item.id === 'approvals')!;
		const { container } = showcase(feature);
		expect(container.querySelector('h1')?.textContent).toBe(feature.word);
		expect(container.querySelector('p.one')?.textContent).toBe(feature.hint);
		expect(container.querySelectorAll('.saves li')).toHaveLength(feature.inTheBox.length);
		expect(container.querySelector('.use')?.textContent).toContain(
			`Tick ${feature.word} when you build-a-boilerplate`
		);
		expect(container.querySelector('a.big')?.getAttribute('href')).toBe(feature.reference);
		expect(container.querySelector('a.big.src')?.getAttribute('href')).toBe(feature.source);
		expect(container.querySelector('nav.strip [aria-current="page"]')?.textContent).toBe(
			feature.word
		);
	});

	it('renders every feature without the banned word and with its example frame', () => {
		for (const feature of features) {
			const { container } = showcase(feature);
			expect(container.textContent, feature.id).not.toMatch(/mechanic/i);
			const frame = container.querySelector('[data-example-kind]');
			expect(frame?.getAttribute('data-example-kind'), feature.id).toBe(feature.example.kind);
			if (feature.example.kind === 'still') {
				expect(frame?.querySelector('img')?.getAttribute('src')).toBe(feature.example.src);
			} else {
				expect(resolvePlaygroundSlug(feature.example.entry), feature.id).toBeTruthy();
			}
			cleanup();
		}
	});

	it('shows at most three component tiles, only for real features', () => {
		const ids = new Set(features.map((item) => item.id));
		for (const [id, tiles] of Object.entries(alsoInTheBox)) {
			expect(ids.has(id), id).toBe(true);
			expect(tiles.length, id).toBeGreaterThan(0);
			expect(tiles.length, id).toBeLessThanOrEqual(3);
			for (const tile of tiles) expect(tile.from).toMatch(/^@happyvertical\/smrt-/);
		}
		const { container } = showcase(features.find((item) => item.id === 'orders')!);
		expect(container.querySelector('#also-in-the-box')).toBeNull();
	});

	it('never repeats the live example as a tile', () => {
		for (const feature of features) {
			if (feature.example.kind !== 'playground') continue;
			const title = resolvePlaygroundSlug(feature.example.entry)!.entryTitle.replace(/\s+/g, '');
			for (const tile of alsoInTheBox[feature.id] ?? []) {
				expect(tile.name.toLowerCase(), `${feature.id}: ${tile.name}`).not.toContain(
					title.toLowerCase()
				);
			}
		}
	});
});

describe('section index', () => {
	it('lists every feature of every section with a link and its sentence', () => {
		for (const section of featureSections) {
			const { container } = render(SectionIndex, { section });
			expect(container.querySelector('h1')?.textContent).toBe(section.word);
			expect(container.querySelector('p.one')?.textContent).toBe(section.hint);
			const tiles = [...container.querySelectorAll('.tile a')];
			const expected = features.filter((item) => item.section === section.id);
			expect(tiles.map((a) => a.getAttribute('href'))).toEqual(
				expected.map((item) => `/features/${section.id}/${item.id}`)
			);
			expect(container.textContent).not.toMatch(/mechanic/i);
			cleanup();
		}
	});
});
