import { cleanup, fireEvent, render, screen, within } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Harness from './Header.test.svelte';

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

describe('application bar', () => {
	it('renders the approved primary navigation and active state', () => {
		render(Harness, { props: { pathname: '/ui' } });
		const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
		const links = within(nav).getAllByRole('link');

		expect(links.map((link) => link.textContent)).toEqual([
			'Why s-m-r-t?',
			'Framework',
			'Interaction',
			'UI',
			'Modules',
			'Tooling',
			'Playground',
			'Reference'
		]);
		expect(within(nav).getByRole('link', { name: 'UI' }).getAttribute('aria-current')).toBe('page');
	});

	it('opens the AdminShell application panel from the app bar', async () => {
		render(Harness);
		const toggle = screen.getByRole('button', { name: 'Open documentation navigation' });

		expect(toggle.getAttribute('aria-expanded')).toBe('false');
		await fireEvent.click(toggle);
		expect(toggle.getAttribute('aria-expanded')).toBe('true');
	});

	it('gives the GitHub and color-scheme actions names, tooltips, and touch targets', () => {
		render(Harness);
		const github = screen.getByRole('link', { name: 'Open the s-m-r-t source on GitHub' });
		const scheme = screen.getByRole('button', { name: 'Switch to dark color scheme' });

		expect(github.classList.contains('icon-action')).toBe(true);
		expect(scheme.classList.contains('icon-action')).toBe(true);
		expect(scheme.getAttribute('data-next-color-scheme')).toBe('dark');
		expect(screen.getByRole('tooltip', { name: 'Open the s-m-r-t source on GitHub' })).toBeTruthy();
		expect(screen.getByRole('tooltip', { name: 'Switch to dark color scheme' })).toBeTruthy();
	});

	it('exposes all destinations through the responsive menu', async () => {
		render(Harness);
		const toggle = screen.getByRole('button', { name: 'Open primary navigation' });

		await fireEvent.click(toggle);
		const navs = screen.getAllByRole('navigation', { name: 'Primary navigation' });
		expect(navs).toHaveLength(2);
		expect(within(navs[1]).getAllByRole('link')).toHaveLength(8);
		expect(toggle.getAttribute('aria-expanded')).toBe('true');
	});
});
