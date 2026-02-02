import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
// @ts-ignore
import Page from './+page.svelte';

describe('FAQ Page', () => {
	it('renders the page', () => {
		const { container } = render(Page);
		const h1 = container.querySelector('h1');
		expect(h1?.textContent).toContain('Frequently Asked Questions');
	});

	it('renders multiple FAQ sections', () => {
		const { container } = render(Page);
		const sections = container.querySelectorAll('section');
		expect(sections.length).toBeGreaterThan(0);
	});
});
