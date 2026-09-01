import { describe, expect, it } from 'vitest';
import { getUiComponent, uiComponentGroups, uiComponents } from '$lib/data/ui-components.generated';

describe('generated UI component reference', () => {
	it('publishes unique stable destinations for every public export', () => {
		expect(uiComponents.length).toBeGreaterThan(70);
		expect(new Set(uiComponents.map((component) => component.slug)).size).toBe(uiComponents.length);
		expect(uiComponentGroups.length).toBeGreaterThan(8);

		for (const component of uiComponents) {
			expect(component.name).toBeTruthy();
			expect(component.importPath).toMatch(/^@happyvertical\/smrt-[a-z-]+/);
			expect(component.source).toMatch(/^packages\/.+\.svelte$/);
			expect(component.related.href).toBe('/ui');
		}
	});

	it('publishes the prop prose the packages already ship', () => {
		const described = uiComponents.flatMap((component) =>
			component.details.filter((prop) => prop.description)
		);
		const props = uiComponents.flatMap((component) => component.details);

		// Roughly half of smrt-ui's props carry JSDoc, and svelte-package preserves
		// it into the shipped declarations. A collapse to zero means the generator
		// stopped reading them, which is the defect this guards.
		expect(described.length).toBeGreaterThan(props.length * 0.3);
		expect(uiComponents.some((component) => !component.summarySynthesized)).toBe(true);

		const cell = getUiComponent('data-table')?.details.find((prop) => prop.name === 'cell');
		expect(cell?.description).toBe('Global cell renderer - takes precedence over column.cell');
	});

	it('marks a summary it had to synthesize', () => {
		for (const component of uiComponents) {
			const placeholder = `${component.name} is part of the ${component.category.toLowerCase()} component family.`;
			expect(component.summarySynthesized).toBe(component.summary === placeholder);
		}
	});

	it('puts DataTable under Components with its complete public contract', () => {
		const table = getUiComponent('data-table');
		expect(table).toMatchObject({
			name: 'DataTable',
			category: 'Collections and tables',
			importPath: '@happyvertical/smrt-ui/data',
			demo: { id: 'data-table', href: '/playground' }
		});
		expect(table?.details.map((prop) => prop.name)).toEqual(
			expect.arrayContaining(['data', 'columns', 'rowKey', 'controller', 'state', 'cell'])
		);
		expect(table?.sections.map((member) => member.name)).toEqual([
			'selected',
			'sort',
			'page',
			'expanded'
		]);
		expect(table?.items.map((event) => event.name)).toEqual(
			expect.arrayContaining(['onSelectionChange', 'onSortChange', 'onPageChange', 'onStateChange'])
		);
	});

	it('links package-owned examples only where the published Playground provides one', () => {
		expect(getUiComponent('button')?.demo?.id).toBe('base-controls');
		expect(getUiComponent('checkbox')?.demo?.id).toBe('interactive-controls');
		expect(getUiComponent('modal')?.demo?.id).toBe('feedback-overlays');
		expect(getUiComponent('collection-list')?.demo?.id).toBe('collections');
		expect(getUiComponent('calendar')?.demo).toBeNull();
	});

	it('includes components from every public component barrel', () => {
		expect(getUiComponent('date-picker')?.importPath).toBe('@happyvertical/smrt-ui/forms');
		expect(getUiComponent('input')?.importPath).toBe('@happyvertical/smrt-ui/forms');
		expect(getUiComponent('trans')).toMatchObject({
			name: 'Trans',
			category: 'Internationalization',
			importPath: '@happyvertical/smrt-ui/i18n'
		});
	});
});
