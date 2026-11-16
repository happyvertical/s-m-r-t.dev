import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Harness from './SiteShell.test.svelte';

vi.mock('$app/navigation', () => ({
	afterNavigate: vi.fn(),
	beforeNavigate: vi.fn(),
	goto: vi.fn()
}));

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

const sidebar = () => screen.queryByRole('navigation', { name: 'Documentation' });

describe('site shell docs sidebar', () => {
	it.each([
		['/docs'],
		['/docs/framework'],
		['/docs/framework/agents'],
		['/docs/capabilities/webmcp'],
		['/docs/reference/packages/smrt-core']
	])('renders the sidebar on %s', (pathname) => {
		render(Harness, { props: { pathname } });

		expect(sidebar()).toBeTruthy();
	});

	it.each([
		['/'],
		['/demo'],
		['/tools'],
		['/features'],
		['/features/sell'],
		['/build-a-boilerplate'],
		['/docsish']
	])('renders no sidebar on %s', (pathname) => {
		render(Harness, { props: { pathname } });

		expect(sidebar()).toBeNull();
		expect(document.querySelector('aside.docs-aside')).toBeNull();
	});

	// The skip link, the focus move after navigation and the generated agent
	// docs all take #main-content as the page, so the sidebar stays beside it.
	it('keeps the sidebar in an aside beside the route content, not inside it', () => {
		render(Harness, { props: { pathname: '/docs/tooling' } });
		const nav = sidebar() as HTMLElement;
		const content = document.getElementById('main-content') as HTMLElement;

		expect(nav.closest('aside')).toBeTruthy();
		expect(content.contains(nav)).toBe(false);
		expect(content.textContent).toContain('Route content');
		expect(nav.closest('aside')?.nextElementSibling).toBe(content);
		expect(document.querySelector('footer')?.closest('.route-frame')).toBeNull();
	});

	it('keeps the route content mounted when the route leaves Docs', async () => {
		const { rerender } = render(Harness, { props: { pathname: '/docs' } });
		const content = document.getElementById('main-content');

		await rerender({ pathname: '/features' });

		expect(sidebar()).toBeNull();
		expect(document.getElementById('main-content')).toBe(content);
	});
});
