import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
// @ts-ignore
import Page from './+page.svelte';

describe('FAQ Page', () => {
	it('renders the s-m-r-t meaning question', () => {
		const { getByText } = render(Page);
		expect(getByText(/what does s-m-r-t stand for/i)).toBeTruthy();
	});

	it('renders the unlabelled youtube link', () => {
		const { container } = render(Page);
		const link = container.querySelector('a[href="https://www.youtube.com/watch?v=ls5BFzuxGw4"]');
		expect(link).toBeTruthy();
	});
});