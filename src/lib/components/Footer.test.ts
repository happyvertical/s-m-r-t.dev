import { cleanup, render, screen, within } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { primaryLinks } from '$lib/data/doors';
import { SMRT_VERSION } from '$lib/version';
import Footer from './Footer.svelte';

afterEach(cleanup);

describe('footer', () => {
	it('states the licence, the project and the documented release', () => {
		const { container } = render(Footer);
		const text = container.textContent?.replace(/\s+/g, ' ') ?? '';

		expect(text).toContain('MIT licensed');
		expect(text).toContain('A HappyVertical project');
		expect(text).toContain(`Docs for ${SMRT_VERSION}`);
	});

	it('repeats the header links, then the FAQ and the source', () => {
		render(Footer);
		const navigation = screen.getByRole('navigation', { name: 'Footer navigation' });
		const links = within(navigation).getAllByRole('link');

		expect(links.slice(0, primaryLinks.length).map((a) => a.getAttribute('href'))).toEqual(
			primaryLinks.map((link) => link.href)
		);
		expect(within(navigation).getByRole('link', { name: 'FAQ' }).getAttribute('href')).toBe(
			'/docs/reference/faq'
		);
		expect(
			within(navigation)
				.getByRole('link', { name: /GitHub/ })
				.getAttribute('href')
		).toBe('https://github.com/happyvertical/smrt');
	});
});
