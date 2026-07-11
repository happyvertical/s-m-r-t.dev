import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Grid from './Grid.svelte';

describe('Grid Component', () => {
	it('renders', () => {
		const { container } = render(Grid);
		expect(container).toBeTruthy();
	});
});
