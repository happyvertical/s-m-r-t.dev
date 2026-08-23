import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Page from './+page.svelte';

afterEach(cleanup);

describe('documentation home page', () => {
	it('features the released DataTable as an accessible application surface', () => {
		render(Page);

		expect(screen.getByRole('heading', { name: 'Data tables for application logic' })).toBeTruthy();
		expect(
			screen.getByRole('table', { name: 'Application surfaces sharing one model' })
		).toBeTruthy();
	});

	it('sorts the featured table through the released component interaction', async () => {
		render(Page);

		await fireEvent.click(screen.getByRole('button', { name: 'Surface' }));

		expect(screen.getByRole('columnheader', { name: 'Surface' }).getAttribute('aria-sort')).toBe(
			'ascending'
		);
	});
});
