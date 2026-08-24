import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Page from './+page.svelte';

afterEach(cleanup);

describe('Framework landing page', () => {
	it('leads with the model example and all concept families', () => {
		render(Page);

		expect(
			screen.getByRole('heading', { name: 'One application definition supplies every interface.' })
		).toBeTruthy();
		expect(screen.getByRole('heading', { name: 'Describe the record once.' })).toBeTruthy();
		expect(screen.getByText('Models and collections')).toBeTruthy();
		expect(screen.getByText('Agent awareness and introspection')).toBeTruthy();
		expect(
			screen.getByRole('link', { name: /Software as Agentic Domain Logic/ }).getAttribute('href')
		).toBe('/reference/saadl');
	});
});
