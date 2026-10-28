import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import FrontControls from './FrontControls.svelte';

afterEach(cleanup);

describe('front page controls (#381)', () => {
	it('offers BUILD, FEATURES, DOCS and the source, with no logo or search', () => {
		const { container } = render(FrontControls, {
			props: {
				count: 3,
				buildTarget: '/build-a-boilerplate?features=a',
				sky: true,
				busy: false,
				onbuild: vi.fn()
			}
		});
		const nav = screen.getByRole('navigation', { name: 'Primary navigation' });

		expect([...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual([
			'/build-a-boilerplate?features=a',
			'/features',
			'/docs'
		]);
		expect(nav.textContent).toContain('3');
		expect(screen.getByRole('link', { name: /GitHub/ }).getAttribute('href')).toBe(
			'https://github.com/happyvertical/smrt'
		);
		expect(container.querySelector('img, input, [role="search"]')).toBeNull();
	});
});
