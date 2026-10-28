import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { features, featureSections } from '$lib/data/features';
import Landing from './+page.svelte';
import { entries as sectionEntries, load as sectionLoad } from './[section]/+page';
import { entries as featureEntries, load as featureLoad } from './[section]/[feature]/+page';

afterEach(cleanup);

describe('/features routes', () => {
	it('prerenders every section and every feature', () => {
		const isLegacy = (entry: Record<string, string>) =>
			!featureSections.some((section) => section.id === entry.section) ||
			(entry.feature !== undefined && !features.some((feature) => feature.id === entry.feature));
		const sections = sectionEntries() as Record<string, string>[];
		const pages = featureEntries() as Record<string, string>[];
		expect(sections.filter((entry) => !isLegacy(entry))).toEqual(
			featureSections.map((section) => ({ section: section.id }))
		);
		expect(pages.filter((entry) => !isLegacy(entry))).toHaveLength(features.length);
		// Live entries render; the retired #375 ones are 301s.
		for (const entry of sections.filter((entry) => !isLegacy(entry))) {
			expect(() => sectionLoad({ params: entry } as never)).not.toThrow();
		}
		for (const entry of pages.filter((entry) => !isLegacy(entry))) {
			expect(() => featureLoad({ params: entry } as never)).not.toThrow();
		}
		for (const entry of [...sections, ...pages].filter(isLegacy)) {
			const load = entry.feature ? featureLoad : sectionLoad;
			expect(() => load({ params: entry } as never)).toThrow();
		}
	});

	it('404s a feature under the wrong section', () => {
		expect(() =>
			featureLoad({ params: { section: 'plan', feature: 'agents' } } as never)
		).toThrow();
		expect(() => sectionLoad({ params: { section: 'nope' } } as never)).toThrow();
	});

	it('lands on the nine groups', () => {
		const { container } = render(Landing);
		const links = [...container.querySelectorAll('.tile a')].map((a) => a.getAttribute('href'));
		expect(links).toEqual(featureSections.map((section) => `/features/${section.id}`));
	});
});
