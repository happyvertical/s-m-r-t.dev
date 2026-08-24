import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import DocsSearch from './DocsSearch.svelte';

afterEach(cleanup);

describe('documentation search', () => {
	it('opens from the app bar, finds section pages, and restores trigger focus', async () => {
		render(DocsSearch);
		const trigger = screen.getByRole('button', { name: 'Search documentation' });
		trigger.focus();
		await fireEvent.click(trigger);

		const input = screen.getByRole('combobox', { name: 'Search documentation' });
		await fireEvent.input(input, { target: { value: 'Interaction overview' } });
		expect(screen.getByRole('option', { name: /Interaction overview/ })).toBeTruthy();

		await fireEvent.keyDown(window, { key: 'Escape' });
		expect(screen.queryByRole('dialog', { name: 'Search documentation' })).toBeNull();
		expect(document.activeElement).toBe(trigger);
	});

	it('opens and closes with the documented keyboard shortcut', async () => {
		render(DocsSearch);
		await fireEvent.keyDown(window, { key: 'k', metaKey: true });
		expect(screen.getByRole('dialog', { name: 'Search documentation' })).toBeTruthy();
		await fireEvent.keyDown(window, { key: 'k', metaKey: true });
		expect(screen.queryByRole('dialog', { name: 'Search documentation' })).toBeNull();
	});
});
