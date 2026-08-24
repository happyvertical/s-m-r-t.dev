import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './+page.svelte';

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

describe('playground page', () => {
	it('places the Docs escape link before the playground host for keyboard users', () => {
		const { container } = render(Page);
		const docsLink = screen.getByRole('link', { name: '← Docs' });
		const host = container.querySelector('.playground-shell');

		expect(host).toBeTruthy();
		expect(docsLink.compareDocumentPosition(host!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
	});
});
