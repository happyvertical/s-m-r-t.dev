import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import GuideLibraryMetadata from '$lib/components/GuideLibraryMetadata.svelte';
import { getGuideLibraryItem } from '$lib/data/task-guides';

describe('GuideLibraryMetadata', () => {
	it('shows metadata and the family footer for the smrt-start page', () => {
		const guide = getGuideLibraryItem('/docs/getting-started/smrt-start');
		expect(guide).toBeDefined();
		render(GuideLibraryMetadata, { props: { guide: guide! } });

		expect(screen.getByText('Getting started')).toBeTruthy();
		expect(screen.getByText('Beginner')).toBeTruthy();
		expect(
			screen.getByText(
				'The application runs on loopback with you as its owner, and one Note model behind it.'
			)
		).toBeTruthy();
		// smrt-start is the only Getting started guide since the SaaS starter was
		// retired (#338), so the family footer says so instead of linking siblings.
		expect(screen.getByText('This is the only guide in this family.')).toBeTruthy();
		expect(screen.queryByRole('link', { name: /SaaS starter/ })).toBeNull();
	});
});
