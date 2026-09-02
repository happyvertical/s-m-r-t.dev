import { cleanup, render, screen } from '@testing-library/svelte';
import { page } from '$app/state';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Page from './+page.svelte';

vi.mock('$app/environment', () => ({ browser: true }));

vi.mock('$app/state', async () => {
	const { SvelteURL } = await import('svelte/reactivity');
	return { page: { url: new SvelteURL('http://localhost/playground') } };
});

beforeEach(() => {
	window.history.replaceState({}, '', '/playground');
	page.url.search = '';
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

	it('opens the agent-aware form from its stable deep link', async () => {
		page.url.search = '?entry=agent-aware-form';
		render(Page);

		expect(
			await screen.findByRole('heading', {
				name: 'Agent-aware form: success and refusal',
				level: 2
			})
		).toBeTruthy();
	});

	it('opens a non-site package entry from its generic slug (job-dashboard)', async () => {
		page.url.search = '?entry=job-dashboard';
		render(Page);

		expect(await screen.findByRole('heading', { name: 'Job Dashboard', level: 2 })).toBeTruthy();
	});

	it('shows an inline notice instead of silently falling back for an unknown slug', async () => {
		page.url.search = '?entry=not-a-real-entry';
		render(Page);

		expect(await screen.findByText(/No playground entry named/)).toBeTruthy();
		expect(screen.getByText('not-a-real-entry')).toBeTruthy();
	});

	it('updates one mounted host during query-only client navigation in both directions', async () => {
		const { container } = render(Page);
		const mountedHost = container.querySelector('.playground-shell');

		expect(mountedHost).toBeTruthy();
		expect(screen.getByRole('heading', { name: 'Base Controls', level: 2 })).toBeTruthy();

		page.url.search = '?entry=agent-aware-form';
		expect(
			await screen.findByRole('heading', {
				name: 'Agent-aware form: success and refusal',
				level: 2
			})
		).toBeTruthy();

		page.url.search = '';
		expect(await screen.findByRole('heading', { name: 'Base Controls', level: 2 })).toBeTruthy();
		expect(container.querySelector('.playground-shell')).toBe(mountedHost);
	});
});
