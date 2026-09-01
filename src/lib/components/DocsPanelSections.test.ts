import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tick } from 'svelte';
import { documentationSections } from '$lib/data/navigation';
import { createDocsShellState } from '$lib/shell';
import Harness from './DocsPanelSections.test.svelte';

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

async function renderExpanded(props: { pathname?: string; hash?: string }) {
	const shell = createDocsShellState();
	shell.expandPanel('top');
	render(Harness, { props: { ...props, shell } });
	// AdminShell hydrates panel visibility from localStorage asynchronously on
	// mount. Let that settle before asserting/interacting, otherwise the
	// hydrate resolving after a synchronous state change (e.g. a click below)
	// can clobber it back to the pre-render value — a test-only race, since a
	// real user's first click always lands long after mount has settled.
	await tick();
	await new Promise((resolve) => setTimeout(resolve, 0));
	return shell;
}

describe('docs panel section map', () => {
	it('renders one band per documentation section, in canonical order', async () => {
		await renderExpanded({ pathname: '/framework' });
		const nav = screen.getByRole('navigation', { name: 'Documentation section map' });
		const headingLinks = within(nav)
			.getAllByRole('heading', { level: 3 })
			.map((heading) => within(heading).getByRole('link').textContent);

		expect(headingLinks).toEqual(documentationSections.map((section) => section.label));
	});

	it('marks the current section as "you are here" and links its landing page', async () => {
		await renderExpanded({ pathname: '/tooling/dev-mcp' });
		const nav = screen.getByRole('navigation', { name: 'Documentation section map' });
		const bands = within(nav).getAllByRole('heading', { level: 3 });
		const toolingHeading = bands.find((heading) => heading.textContent?.includes('Tooling'));

		expect(toolingHeading).toBeTruthy();
		expect(within(toolingHeading as HTMLElement).getByText('you are here')).toBeTruthy();

		const otherHeadings = bands.filter((heading) => heading !== toolingHeading);
		for (const heading of otherHeadings) {
			expect(within(heading).queryByText('you are here')).toBeNull();
		}
	});

	it('marks the current page link with aria-current', async () => {
		await renderExpanded({ pathname: '/reference' });
		expect(screen.getByRole('link', { name: 'Reference' }).getAttribute('aria-current')).toBe(
			'page'
		);
	});

	it('closes the panel when a link is clicked', async () => {
		const shell = await renderExpanded({ pathname: '/framework' });
		expect(shell.panels.top).toBe('expanded');

		const link = screen.getByRole('link', { name: 'UI' });
		// Prevent jsdom's unimplemented anchor navigation so it does not log
		// noise for a link this test never intends to follow.
		link.addEventListener('click', (event) => event.preventDefault());
		await fireEvent.click(link);

		expect(shell.panels.top).toBe('collapsed');
	});
});
