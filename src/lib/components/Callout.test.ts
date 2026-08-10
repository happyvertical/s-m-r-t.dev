import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Callout from './Callout.svelte';
import { calloutVariantLabels, type CalloutVariant } from '$lib/data/callouts';
import { capabilityGuides, foundationGuides } from '$lib/data/guides';
import { referenceGuides } from '$lib/data/reference';
import { toolingGuides } from '$lib/data/tooling';

const variants = Object.keys(calloutVariantLabels) as CalloutVariant[];

describe('Callout', () => {
	it('renders each variant with its own class and label', () => {
		for (const variant of variants) {
			const { container } = render(Callout, { props: { variant, body: 'Body copy.' } });
			const callout = container.querySelector('.callout');

			expect(callout?.classList.contains(`callout--${variant}`)).toBe(true);
			expect(callout?.textContent).toContain(calloutVariantLabels[variant]);
			expect(callout?.textContent).toContain('Body copy.');
		}
	});

	it('exposes the callout as a labelled note for assistive technology', () => {
		const { container } = render(Callout, {
			props: { variant: 'security', title: 'Check the boundary', body: 'Body copy.' }
		});
		const callout = container.querySelector('.callout');
		const titleId = callout?.getAttribute('aria-labelledby');

		expect(callout?.getAttribute('role')).toBe('note');
		expect(titleId).toBeTruthy();
		expect(container.querySelector(`#${titleId}`)?.textContent).toContain('Check the boundary');
	});

	it('is used by real guide content rather than being dead code', () => {
		const declared = [
			...foundationGuides,
			...capabilityGuides,
			...toolingGuides,
			...referenceGuides
		]
			.flatMap((guide) => guide.sections)
			.map((section) => section.callout)
			.filter((callout) => callout !== undefined);

		expect(declared.length).toBeGreaterThan(0);
		for (const callout of declared) {
			expect(variants).toContain(callout.variant);
			expect(callout.body.length).toBeGreaterThan(0);
		}
	});
});
