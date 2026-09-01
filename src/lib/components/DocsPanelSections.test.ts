import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { tick } from 'svelte';
import { docsNavigation, documentationSections } from '$lib/data/navigation';
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

	/**
	 * The band marked "current" comes from `documentationSectionForPathname`,
	 * which resolves a pathname to a section by *route family* (e.g. every
	 * `/starters/*` route is part of the Guides route family). The band an
	 * item actually renders in comes from `docs-panel.ts`'s join against
	 * `docsNavigation`, which assigns each page to exactly one *canonical
	 * nav group* (e.g. the starter links are canonically Home group pages,
	 * introduced from the homepage). These two classifications usually
	 * agree, but where they do not — a docsNavigation item's own pathname
	 * resolves to a different section than the band that actually lists it
	 * — the item can fall outside its (non-current) band's key-page limit
	 * with nothing to extend it, so the page a reader is actually on gets no
	 * link and no aria-current anywhere in the panel. This asserts the
	 * invariant that must hold regardless of that classification mismatch:
	 * every page reachable in docsNavigation gets a link with the correct
	 * aria-current when it is the current page, whether or not its own band
	 * is the one carrying the "you are here" treatment.
	 */
	// One render plus 64 rerenders (one per docsNavigation item) took ~1.5s
	// locally but over 7s on CI's slower/shared runner, past vitest's default
	// 5000ms test timeout. The assertions are cheap; the render count is what
	// is large, so this test below gets explicit headroom instead of trimming
	// its coverage.
	const PAGE_COVERAGE_TIMEOUT_MS = 20000;

	it(
		'shows a matching aria-current link for every page reachable in docsNavigation',
		async () => {
			const shell = createDocsShellState();
			shell.expandPanel('top');
			const { rerender } = render(Harness, { props: { pathname: '/', hash: '', shell } });
			await tick();
			await new Promise((resolve) => setTimeout(resolve, 0));

			const allItems = docsNavigation.flatMap((group) => group.items);
			const failures: string[] = [];

			for (const item of allItems) {
				const url = new URL(item.href, 'https://s-m-r-t.dev');
				await rerender({ pathname: url.pathname, hash: url.hash, shell });

				const nav = screen.getByRole('navigation', { name: 'Documentation section map' });
				const links = within(nav).getAllByRole('link');
				const match = links.find((link) => link.getAttribute('href') === item.href);
				const expectedCurrent = url.hash ? 'location' : 'page';

				if (!match) {
					failures.push(`${item.href} ("${item.label}"): no link rendered`);
				} else if (match.getAttribute('aria-current') !== expectedCurrent) {
					failures.push(
						`${item.href} ("${item.label}"): expected aria-current="${expectedCurrent}", got ${
							match.getAttribute('aria-current') ?? 'null'
						}`
					);
				}
			}

			expect(failures, `\n${failures.join('\n')}`).toEqual([]);
		},
		PAGE_COVERAGE_TIMEOUT_MS
	);
});
