import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import ui from '@happyvertical/smrt-ui/playground';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PlaygroundEmbed from './PlaygroundEmbed.svelte';

beforeEach(() => {
	vi.stubGlobal(
		'matchMedia',
		vi.fn().mockImplementation(() => ({
			matches: false,
			media: '',
			onchange: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn()
		}))
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

describe('PlaygroundEmbed', () => {
	it('switches between interactive package-owned previews', async () => {
		render(PlaygroundEmbed, {
			modules: [ui]
		});

		await waitFor(() => {
			expect(screen.getByRole('heading', { name: /^Base Controls$/ })).toBeTruthy();
		});

		await fireEvent.click(await screen.findByRole('button', { name: 'Save changes' }));
		await screen.findByText('Saved 1 time.');

		await fireEvent.click(screen.getByRole('button', { name: 'Data Table' }));

		await waitFor(() => {
			expect(screen.getByRole('heading', { name: /^Data Table$/ })).toBeTruthy();
		});
		expect(screen.getByRole('button', { name: 'Data Table' }).getAttribute('aria-pressed')).toBe(
			'true'
		);

		await fireEvent.click(await screen.findByRole('button', { name: 'Name' }));
		await screen.findByText('Sort: name asc');
	});
});
