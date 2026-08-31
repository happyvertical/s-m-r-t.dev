import { describe, expect, it } from 'vitest';
import { taskGuides } from '$lib/data/task-guides';
import {
	documentationSectionForPathname,
	documentationSections,
	isNavigationGroupActive,
	isNavigationItemActive,
	isPrimaryNavigationActive,
	primaryNavigation
} from './navigation';

describe('primary navigation', () => {
	it('uses the approved eight destinations in order', () => {
		expect(primaryNavigation.map((item) => item.label)).toEqual([
			'Home',
			'Framework',
			'Interaction',
			'UI',
			'Modules',
			'Tooling',
			'Playground',
			'Reference'
		]);
		expect(primaryNavigation.some((item) => item.label === 'Guides')).toBe(false);
	});

	it('keeps section destinations active for their current route families', () => {
		const active = (pathname: string) =>
			primaryNavigation.filter((item) => isPrimaryNavigationActive(item, pathname));

		expect(active('/foundations/objects-and-collections').map((item) => item.label)).toEqual([
			'Framework'
		]);
		expect(active('/capabilities/agent-assisted-forms').map((item) => item.label)).toEqual([
			'Interaction'
		]);
		expect(active('/capabilities/application-shell').map((item) => item.label)).toEqual(['UI']);
		expect(active('/packages/smrt-content').map((item) => item.label)).toEqual(['Reference']);
		expect(active('/playground').map((item) => item.label)).toEqual(['Playground']);
		expect(active('/guides/testing-your-app')).toEqual([]);
	});
});

describe('contextual navigation', () => {
	it('resolves every route family to one section', () => {
		expect(documentationSectionForPathname('/').id).toBe('why');
		expect(documentationSectionForPathname('/framework').id).toBe('framework');
		expect(documentationSectionForPathname('/interaction').id).toBe('interaction');
		expect(documentationSectionForPathname('/ui').id).toBe('ui');
		expect(documentationSectionForPathname('/modules').id).toBe('modules');
		expect(documentationSectionForPathname('/tooling/dev-mcp').id).toBe('tooling');
		expect(documentationSectionForPathname('/guides/semantic-search').id).toBe('guides');
		expect(documentationSectionForPathname('/reference/security').id).toBe('reference');
	});

	it('uses only group and item levels in every section', () => {
		for (const section of documentationSections) {
			expect(section.href).toBeTruthy();
			expect(section.description).toBeTruthy();
			expect(section.groups.length).toBeGreaterThan(0);
			for (const group of section.groups) {
				expect(group.label).toBeTruthy();
				expect(group.items.length).toBeGreaterThan(0);
				expect(group.items.every((item) => !('children' in item))).toBe(true);
			}
		}
	});

	it('expands the group that owns the current page', () => {
		const section = documentationSectionForPathname('/tooling/dev-mcp');
		const activeGroups = section.groups.filter((group) =>
			isNavigationGroupActive(group, '/tooling/dev-mcp')
		);

		expect(activeGroups.map((group) => group.label)).toEqual(['Developer and coding-agent tools']);
	});

	it('uses location state for homepage anchors', () => {
		expect(isNavigationItemActive('/#how-it-works', '/', '#how-it-works')).toBe(true);
		expect(isNavigationItemActive('/', '/', '#how-it-works')).toBe(false);
		expect(isNavigationItemActive('/#what-you-get', '/', '#how-it-works')).toBe(false);
	});

	it('gives every task guide a family link and a non-Guides contextual link', () => {
		const guidesSection = documentationSections.find((section) => section.id === 'guides');
		const guideFamilyHrefs = new Set(
			guidesSection?.groups.flatMap((group) => group.items.map((item) => item.href))
		);
		const contextualHrefs = new Set(
			documentationSections
				.filter((section) => section.id !== 'guides')
				.flatMap((section) =>
					section.groups.flatMap((group) => group.items.map((item) => item.href))
				)
		);

		for (const guide of taskGuides) {
			const href = `/guides/${guide.slug}`;
			expect(
				guideFamilyHrefs.has(href),
				`${href} is missing from its guide-family navigation`
			).toBe(true);
			expect(contextualHrefs.has(href), `${href} has no contextual inbound link`).toBe(true);
		}
	});
});
