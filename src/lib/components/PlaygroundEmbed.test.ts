import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import ui from '@happyvertical/smrt-ui/playground';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AGENT_AWARE_FORM_ENTRY_ID, sitePlayground } from '$lib/data/site-playground';
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
	it('renders the standalone host without a site wrapper', () => {
		render(PlaygroundEmbed, {
			modules: [ui],
			standalone: true
		});

		expect(document.querySelector('.playground-embed')).toBeNull();
		expect(document.querySelector('.playground-shell')).toBeTruthy();
	});

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

		await fireEvent.click(await screen.findByRole('button', { name: 'Sort Name ascending' }));
		await screen.findByText('Sort: name asc');
	});

	it('opens the canonical site demonstration by stable entry identity', async () => {
		render(PlaygroundEmbed, {
			modules: [sitePlayground],
			standalone: true,
			selectedEntryId: AGENT_AWARE_FORM_ENTRY_ID
		});

		expect(
			await screen.findByRole('heading', {
				name: 'A proposal succeeds. A protected change fails.'
			})
		).toBeTruthy();
		expect(screen.getAllByText(/no language model runs in this demo/i)).toHaveLength(2);
		expect(screen.getByText('Scripted demonstration · released registry')).toBeTruthy();
	});
});
