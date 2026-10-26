import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { features, featureSections } from '$lib/data/features';
import Landing from './+page.svelte';
import { entries as sectionEntries, load as sectionLoad } from './[section]/+page';
import { entries as featureEntries, load as featureLoad } from './[section]/[feature]/+page';

afterEach(cleanup);

describe('/features routes', () => {
	it('prerenders every section and every feature', () => {
		expect(sectionEntries() as unknown[]).toEqual(
			featureSections.map((section) => ({ section: section.id }))
		);
		expect(featureEntries() as unknown[]).toHaveLength(features.length);
		for (const entry of sectionEntries() as Record<string, string>[]) {
			expect(() => sectionLoad({ params: entry } as never)).not.toThrow();
		}
		for (const entry of featureEntries() as Record<string, string>[]) {
			expect(() => featureLoad({ params: entry } as never)).not.toThrow();
		}
	});

	it('404s a feature under the wrong section', () => {
		expect(() => featureLoad({ params: { section: 'world', feature: 'jobs' } } as never)).toThrow();
		expect(() => sectionLoad({ params: { section: 'nope' } } as never)).toThrow();
	});

	it('lands on the nine sections', () => {
		const { container } = render(Landing);
		const links = [...container.querySelectorAll('.tile a')].map((a) => a.getAttribute('href'));
		expect(links).toEqual(featureSections.map((section) => `/features/${section.id}`));
	});
});
