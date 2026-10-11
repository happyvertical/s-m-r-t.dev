import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Page from './+page.svelte';

afterEach(cleanup);

describe('starter index', () => {
	it('offers the Planner before code-first starters', () => {
		render(Page);

		const choices = screen.getAllByRole('link').map((link) => link.getAttribute('href'));
		expect(choices.slice(0, 3)).toEqual(['/plan/', '/starters/ground-up', '/starters/saas']);
		expect(screen.getByText(/planning and export work without an assistant/i)).toBeTruthy();
	});
});
