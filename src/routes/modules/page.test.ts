import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { applicationModuleClusters } from '$lib/data/modules';
import Page from './+page.svelte';

afterEach(cleanup);

describe('application modules page', () => {
	it('renders the curated title and all outcome clusters', () => {
		render(Page);

		expect(screen.getByText('Application modules')).toBeTruthy();
		expect(
			screen.getByRole('heading', {
				name: 'Start with the application parts that already exist.'
			})
		).toBeTruthy();

		for (const cluster of applicationModuleClusters) {
			expect(screen.getByRole('heading', { name: cluster.title })).toBeTruthy();
		}
	});

	it('links every named package to its Package Reference page', () => {
		const { container } = render(Page);

		for (const cluster of applicationModuleClusters) {
			for (const pkg of cluster.packages) {
				expect(
					container.querySelector(`a[href="/packages/${pkg.slug}"]`),
					`${pkg.slug} is missing its Package Reference link`
				).toBeTruthy();
			}
		}
	});

	it('keeps package maturity and guide gaps visible', () => {
		render(Page);

		expect(screen.getByText('Deprecated · compatibility only')).toBeTruthy();
		expect(screen.getByText('Not implemented')).toBeTruthy();
		expect(screen.getAllByText('Source distribution').length).toBeGreaterThan(0);
		expect(screen.getAllByText(/^Guide gap:/).length).toBeGreaterThan(0);
	});
});
