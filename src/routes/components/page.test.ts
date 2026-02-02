import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
// @ts-ignore
import Page from './+page.svelte';

describe('Component Browser Page', () => {
	it('renders', () => {
		const { getByText } = render(Page);
		expect(getByText('Components')).toBeTruthy();
	});
});
