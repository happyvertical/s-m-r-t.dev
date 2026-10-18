import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { whySmrtClaims } from '$lib/data/why-smrt-claims';
import Page from './+page.svelte';

afterEach(cleanup);

describe('/reference/evidence', () => {
	it('renders every claim row with its id as the anchor, so #<rowId> links land on it', () => {
		const { container } = render(Page);
		const rows = [...container.querySelectorAll('tbody tr')];

		expect(rows).toHaveLength(whySmrtClaims.length);
		expect(rows.map((row) => row.id)).toEqual(whySmrtClaims.map((claim) => claim.id));
		// The homepage's "Sources" links (slice B of #321) and anything else on
		// the site cite rows by this URL shape; a renamed id breaks them silently.
		for (const claim of whySmrtClaims) {
			expect(container.querySelector(`tr#${claim.id} a[href="#${claim.id}"]`)).toBeTruthy();
		}
	});

	it('shows two columns: the claim and the released source it was verified in', () => {
		const { container } = render(Page);
		expect(
			[...container.querySelectorAll('thead th')].map((cell) => cell.textContent?.trim())
		).toEqual(['Claim', 'Source']);

		for (const claim of whySmrtClaims) {
			const row = container.querySelector(`tr#${claim.id}`)!;
			const cells = row.querySelectorAll('td');
			expect(cells).toHaveLength(2);
			expect(cells[0].textContent).toContain(claim.display);
			expect(cells[0].querySelector(`a[href="${claim.canonical.href}"]`)).toBeTruthy();
			expect(cells[1].querySelector(`a[href="${claim.source.href}"]`)).toBeTruthy();
		}
	});
});
