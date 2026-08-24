import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Page from './+page.svelte';

afterEach(cleanup);

describe('/ui', () => {
	it('renders the curated stories without nesting another application shell', () => {
		const { container } = render(Page);

		expect(
			screen.getByRole('heading', {
				level: 1,
				name: 'Interfaces for people. Contracts for agents.'
			})
		).toBeTruthy();
		expect(screen.getByRole('navigation', { name: 'UI story index' })).toBeTruthy();
		expect(container.querySelectorAll('article')).toHaveLength(8);
		expect(container.querySelector('.smrt-admin-shell')).toBeNull();
		expect(screen.getByRole('heading', { level: 3, name: 'Active ShellState' })).toBeTruthy();
		expect(screen.getByRole('link', { name: /read the interaction contract/i })).toBeTruthy();
		expect(screen.getByRole('link', { name: /framework architecture/i })).toBeTruthy();
	});

	it('renders an agent-addressable DataTable with shared interactive state', async () => {
		render(Page);
		const table = screen.getByRole('table', { name: 'Released SMRT UI surfaces' });

		expect(within(table).getByText('DataTable')).toBeTruthy();
		expect(screen.getByText('0', { selector: '.state-summary strong' })).toBeTruthy();

		const search = screen.getByRole('searchbox', { name: 'Search surfaces' });
		await fireEvent.input(search, { target: { value: 'Browser AI' } });
		expect(within(table).getByText('Browser AI')).toBeTruthy();
		expect(within(table).queryByText('DataTable')).toBeNull();

		await fireEvent.click(screen.getByRole('button', { name: 'Reset table' }));
		expect(within(table).getByText('DataTable')).toBeTruthy();
	});
});
