import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Page from './+page.svelte';
import ShellStateHarness from './ShellStateHarness.test.svelte';

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
		expect(
			screen.getByRole('heading', { name: 'A proposal succeeds. A protected change fails.' })
		).toBeTruthy();
		expect(screen.getByText(/no language model runs in this demo/i)).toBeTruthy();
	});

	it('operates controller-backed DataTable mechanisms through shared state', async () => {
		const { container } = render(Page);
		const table = screen.getByRole('table', { name: 'Released SMRT UI surfaces' });

		expect(within(table).getByText('DataTable')).toBeTruthy();
		expect(screen.getByText('0', { selector: '.state-summary strong' })).toBeTruthy();

		const search = screen.getByRole('searchbox', { name: 'Search surfaces' });
		await fireEvent.input(search, { target: { value: 'Browser AI' } });
		expect(within(table).getByText('Browser AI')).toBeTruthy();
		expect(within(table).queryByText('DataTable')).toBeNull();

		await fireEvent.click(screen.getByRole('button', { name: 'Reset controller state' }));
		expect(within(table).getByText('DataTable')).toBeTruthy();

		await fireEvent.click(screen.getByRole('button', { name: 'Show released previews' }));
		expect(screen.getByRole('button', { name: 'Show every preview status' })).toBeTruthy();
		await fireEvent.click(screen.getByRole('button', { name: 'Show every preview status' }));

		await fireEvent.click(within(table).getByRole('button', { name: 'Surface' }));
		expect(within(table).getByText('Browser AI')).toBeTruthy();
		expect(screen.getByText(/title (asc|desc)/, { selector: '.controller-state dd' })).toBeTruthy();

		await fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
		expect(within(table).getByText('DataTable')).toBeTruthy();
		expect(screen.getByText('2', { selector: '.controller-state dd' })).toBeTruthy();

		await fireEvent.click(screen.getByRole('button', { name: 'Reset controller state' }));
		await fireEvent.click(within(table).getAllByRole('button', { name: 'Expand row' })[0]);
		expect(within(table).getByText(/duplicate row identities fail closed/i)).toBeTruthy();
		expect(screen.getByText('1', { selector: '.controller-state div:last-child dd' })).toBeTruthy();

		await fireEvent.click(within(table).getAllByRole('checkbox', { name: 'Select row' })[0]);
		expect(screen.getByText('1', { selector: '.state-summary strong' })).toBeTruthy();

		const controllerStateBeforeDensity = container.querySelector('.controller-state')?.textContent;
		const selectedCountBeforeDensity =
			container.querySelector('.state-summary strong')?.textContent;
		await fireEvent.click(screen.getByRole('button', { name: 'Use dense rows' }));
		expect(table.classList.contains('data-table--dense')).toBe(true);
		expect(screen.getByRole('button', { name: 'Use comfortable rows' })).toBeTruthy();
		expect(container.querySelector('.controller-state')?.textContent).toBe(
			controllerStateBeforeDensity
		);
		expect(container.querySelector('.state-summary strong')?.textContent).toBe(
			selectedCountBeforeDensity
		);

		await fireEvent.click(screen.getByRole('button', { name: 'Reset controller state' }));
		expect(table.classList.contains('data-table--dense')).toBe(true);
	});

	it('operates the active ShellState without creating another shell in the story', async () => {
		const { container } = render(ShellStateHarness);

		expect(screen.getByText('collapsed', { selector: '.panel-operation strong' })).toBeTruthy();
		await fireEvent.click(screen.getByRole('button', { name: 'Open documentation panel' }));
		expect(screen.getByText('expanded', { selector: '.panel-operation strong' })).toBeTruthy();
		expect(screen.getByRole('button', { name: 'Collapse documentation panel' })).toBeTruthy();
		expect(container.querySelectorAll('.smrt-admin-shell')).toHaveLength(1);
	});
});
