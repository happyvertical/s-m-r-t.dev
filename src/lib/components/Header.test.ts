import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
// @ts-ignore
import Header from './Header.svelte';

describe('Header Component', () => {
	it('renders the branding correctly', () => {
		const { getByText } = render(Header);
		const branding = getByText('s-m-r-t');
		expect(branding).toBeTruthy();
	});
});