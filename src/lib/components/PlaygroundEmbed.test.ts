import { cleanup, render, screen, waitFor } from '@testing-library/svelte';
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
	it('opens the selected package-owned preview', async () => {
		render(PlaygroundEmbed, {
			modules: [ui],
			selectedEntryId: '@happyvertical/smrt-ui:data-table'
		});

		await waitFor(() => {
			expect(screen.getByRole('heading', { name: /^Data Table$/ })).toBeTruthy();
		});

		expect(screen.getByRole('button', { name: 'Data Table' }).getAttribute('aria-pressed')).toBe(
			'true'
		);
	});
});
