import { cleanup, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import type { UiComponentReference as Reference } from '$lib/data/ui-components.generated';
import UiComponentReference from './UiComponentReference.svelte';

const base: Reference = {
	slug: 'sample-control',
	name: 'SampleControl',
	family: 'forms',
	category: 'Forms and controls',
	importPath: '@happyvertical/smrt-ui/forms',
	summary: 'SampleControl is part of the forms and controls component family.',
	summarySynthesized: true,
	details: [
		{ name: 'value', code: 'string', status: false, description: '' },
		{ name: 'label', code: 'string', status: true, description: 'Visible name for the control.' }
	],
	sources: [],
	sections: [],
	items: [],
	components: [],
	demo: null,
	related: { label: 'UI showcase', href: '/ui' },
	source: 'src/components/forms/SampleControl.svelte'
};

afterEach(cleanup);

describe('UI component reference page', () => {
	it('never presents a fallback sentence as though it were a written description', () => {
		render(UiComponentReference, { component: base });

		expect(screen.queryByText(/See the canonical source for details/)).toBeNull();
		expect(screen.getAllByText('Not described').length).toBe(1);
	});

	it('reports an unwritten summary instead of printing the synthesized one', () => {
		render(UiComponentReference, { component: base });

		expect(screen.queryByText(base.summary)).toBeNull();
		expect(screen.getByText(/No summary has been written for SampleControl/)).toBeTruthy();
	});

	it('counts how many props carry a description', () => {
		render(UiComponentReference, { component: base });

		expect(screen.getByText('1 of 2')).toBeTruthy();
	});

	it('prints authored prose whenever the package ships it', () => {
		render(UiComponentReference, {
			component: {
				...base,
				summary: 'Collects a single value and reports every change to its host.',
				summarySynthesized: false,
				details: [
					{ name: 'value', code: 'string', status: false, description: 'Current control value.' }
				]
			}
		});

		expect(
			screen.getByText('Collects a single value and reports every change to its host.')
		).toBeTruthy();
		expect(screen.getByText('Current control value.')).toBeTruthy();
		expect(screen.queryByText('Not described')).toBeNull();
	});
});
