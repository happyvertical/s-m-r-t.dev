import { cleanup, render, screen, within } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { SMRT_VERSION } from '$lib/version';
import Footer from './Footer.svelte';

afterEach(cleanup);

describe('footer', () => {
	it('keeps version, FAQ, and source destinations in the shell reading flow', () => {
		render(Footer);
		const navigation = screen.getByRole('navigation', { name: 'Footer navigation' });

		expect(screen.getByText(`Framework documentation · ${SMRT_VERSION}`)).toBeTruthy();
		expect(within(navigation).getByRole('link', { name: 'FAQ' }).getAttribute('href')).toBe('/faq');
		expect(
			within(navigation)
				.getByRole('link', { name: /GitHub/ })
				.getAttribute('href')
		).toBe('https://github.com/happyvertical/smrt');
	});
});
