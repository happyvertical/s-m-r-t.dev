import { describe, expect, it } from 'vitest';
import { appLayers } from '$lib/data/layers';
import { getPackage } from '$lib/data/packages';
import {
	curatedChipsFor,
	curatedLayerChips,
	maximumChipCount,
	minimumChipCount
} from '$lib/data/layer-chips';

describe('curated scope chips (#327)', () => {
	it('curates every layer the homepage renders, and nothing else', () => {
		expect(curatedLayerChips.map((entry) => entry.id).sort()).toEqual(
			appLayers.map((layer) => layer.id).sort()
		);
	});

	it('names only real packages that belong to the layer they appear under', () => {
		for (const layer of appLayers) {
			const memberSlugs = new Set(layer.packages.map((pkg) => pkg.slug));
			for (const chip of curatedChipsFor(layer)) {
				expect(getPackage(chip.slug), `${chip.slug} is not in packages.ts`).toBeDefined();
				expect(memberSlugs.has(chip.slug), `${chip.slug} is not in layer ${layer.id}`).toBe(true);
				expect(chip.label.trim().length, `${chip.slug} needs a label`).toBeGreaterThan(0);
			}
		}
	});

	it('keeps each layer between six and eight chips, or lists a smaller layer whole', () => {
		for (const layer of appLayers) {
			const chips = curatedChipsFor(layer);
			const slugs = chips.map((chip) => chip.slug);
			expect(new Set(slugs).size, `${layer.id} repeats a chip`).toBe(slugs.length);
			expect(chips.length, `${layer.id} has too few chips`).toBeGreaterThanOrEqual(
				minimumChipCount(layer)
			);
			expect(chips.length, `${layer.id} has too many chips`).toBeLessThanOrEqual(maximumChipCount);
			expect(chips.length).toBeLessThanOrEqual(layer.packages.length);
		}
	});

	it('labels chips in plain words, not package names', () => {
		for (const layer of appLayers) {
			for (const chip of curatedChipsFor(layer)) {
				expect(chip.label, `${chip.slug} label is a package name`).not.toMatch(
					/^smrt-|^@happyvertical/
				);
			}
		}
	});
});
