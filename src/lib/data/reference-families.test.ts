import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getReferenceGuide, referenceGuides } from '$lib/data/reference';
import { referenceFamilies } from '$lib/data/reference-families';

const expectedFamilies = [
	'API Reference',
	'Package Reference',
	'UI Component Reference',
	'Configuration',
	'Decorators',
	'Collections and relationships',
	'Generated interfaces',
	'Authorization and security',
	'Field policy API',
	'Terminology and SAADL',
	'Versions and support status',
	'FAQ'
];

const guideRouteSlugs = new Set([
	'configuration',
	'decorators',
	'collections',
	'interfaces',
	'authorization',
	'field-policies',
	'terminology',
	'versions'
]);

describe('Reference families', () => {
	it('publishes the approved family list in one stable order', () => {
		expect(referenceFamilies.map((family) => family.label)).toEqual(expectedFamilies);
		expect(new Set(referenceFamilies.map((family) => family.href)).size).toBe(
			referenceFamilies.length
		);
	});

	it('gives every family a route or a generated guide entry', () => {
		for (const family of referenceFamilies) {
			const slug = family.href.replace('/reference/', '');
			if (guideRouteSlugs.has(slug)) {
				expect(
					getReferenceGuide(slug),
					`${family.href} is missing from reference.ts`
				).toBeDefined();
				continue;
			}

			expect(
				existsSync(`src/routes${family.href}/+page.svelte`),
				`${family.href} has no stable page route`
			).toBe(true);
		}
	});

	it('keeps generated inventories out of the family list', () => {
		expect(referenceFamilies.some((family) => family.href.includes('[slug]'))).toBe(false);
		expect(referenceFamilies.some((family) => family.label.startsWith('@happyvertical/'))).toBe(
			false
		);
	});

	it('introduces SAADL before the complete terminology contract', () => {
		const saadlIndex = referenceGuides.findIndex((guide) => guide.slug === 'saadl');
		const terminologyIndex = referenceGuides.findIndex((guide) => guide.slug === 'terminology');
		expect(saadlIndex).toBeGreaterThanOrEqual(0);
		expect(terminologyIndex).toBeGreaterThan(saadlIndex);
		expect(getReferenceGuide('terminology')?.related?.[0]).toEqual({
			label: 'What is a SAADL?',
			href: '/reference/saadl'
		});
	});
});
