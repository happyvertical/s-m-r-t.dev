import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Page from './+page.svelte';

afterEach(cleanup);

describe('documentation home page', () => {
	it('keeps the overview focused on the framework', () => {
		render(Page);

		expect(screen.getByRole('heading', { name: 'Why s-m-r-t?' })).toBeTruthy();
		expect(screen.getByText(/one source of truth for your application logic/i)).toBeTruthy();
		expect(screen.queryByRole('heading', { name: 'Data tables for application logic' })).toBeNull();
	});
});
