import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import GuideLibraryMetadata from '$lib/components/GuideLibraryMetadata.svelte';
import { getGuideLibraryItem } from '$lib/data/task-guides';

describe('GuideLibraryMetadata', () => {
	it('shows metadata and family-local sibling links', () => {
		const guide = getGuideLibraryItem('/starters/ground-up');
		expect(guide).toBeDefined();
		render(GuideLibraryMetadata, { props: { guide: guide! } });

		expect(screen.getByText('Getting started')).toBeTruthy();
		expect(screen.getByText('Beginner')).toBeTruthy();
		expect(
			screen.getByText(
				'The application runs on loopback and opens owner onboarding, with one example object behind it.'
			)
		).toBeTruthy();
		expect(
			screen.getByRole('link', { name: 'Start with the SaaS starter' }).getAttribute('href')
		).toBe('/starters/saas');
	});
});
