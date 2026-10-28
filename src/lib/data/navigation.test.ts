import { describe, expect, it } from 'vitest';
import { featurePath, featureSections, features } from '$lib/data/features';
import { taskGuides } from '$lib/data/task-guides';
import {
	documentationSectionForPathname,
	documentationSections,
	featureNavigation,
	isDocsPathname,
	isNavigationGroupActive,
	isNavigationItemActive,
	isPrimaryNavigationActive,
	primaryNavigation
} from './navigation';

describe('primary navigation', () => {
	it('opens the three doors in order: BUILD · FEATURES · DOCS (#361)', () => {
		expect(primaryNavigation.map((item) => [item.label, item.href])).toEqual([
			['Build', '/build-a-boilerplate'],
			['Features', '/features'],
			['Docs', '/docs']
		]);
	});

	it('keeps each door active across its route family', () => {
		const active = (pathname: string) =>
			primaryNavigation
				.filter((item) => isPrimaryNavigationActive(item, pathname))
				.map((item) => item.label);

		expect(active('/build-a-boilerplate')).toEqual(['Build']);
		expect(active('/features')).toEqual(['Features']);
		expect(active('/features/team/approvals')).toEqual(['Features']);
		for (const pathname of [
			'/docs',
			'/docs/foundations/objects-and-collections',
			'/docs/capabilities/webmcp',
			'/docs/guides/testing-your-app',
			'/docs/getting-started/smrt-start',
			'/docs/reference/packages/smrt-ui'
		]) {
			expect(active(pathname), pathname).toEqual(['Docs']);
		}
		expect(active('/')).toEqual([]);
		expect(active('/playground')).toEqual([]);
		// A lookalike prefix is not inside Docs.
		expect(active('/docs-other')).toEqual([]);
	});

	it('scopes the docs panel to /docs', () => {
		expect(isDocsPathname('/docs')).toBe(true);
		expect(isDocsPathname('/docs/ui')).toBe(true);
		expect(isDocsPathname('/')).toBe(false);
		expect(isDocsPathname('/features/assistant')).toBe(false);
		expect(isDocsPathname('/docsx')).toBe(false);
	});
});

describe('contextual navigation', () => {
	it('resolves every route family to one section', () => {
		expect(documentationSectionForPathname('/docs').id).toBe('docs');
		expect(documentationSectionForPathname('/docs/getting-started').id).toBe('docs');
		expect(documentationSectionForPathname('/docs/framework').id).toBe('framework');
		expect(documentationSectionForPathname('/docs/agents').id).toBe('agents');
		expect(documentationSectionForPathname('/docs/capabilities/webmcp').id).toBe('agents');
		expect(documentationSectionForPathname('/docs/interaction').id).toBe('interaction');
		expect(documentationSectionForPathname('/docs/ui').id).toBe('ui');
		expect(documentationSectionForPathname('/docs/capabilities/agent-assisted-forms').id).toBe(
			'interaction'
		);
		expect(documentationSectionForPathname('/docs/capabilities/application-shell').id).toBe('ui');
		expect(documentationSectionForPathname('/docs/foundations/tenants').id).toBe('framework');
		expect(documentationSectionForPathname('/docs/tooling/dev-mcp').id).toBe('tooling');
		expect(documentationSectionForPathname('/docs/guides/semantic-search').id).toBe('guides');
		expect(documentationSectionForPathname('/docs/reference/security').id).toBe('reference');
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
		const section = documentationSectionForPathname('/docs/tooling/dev-mcp');
		const activeGroups = section.groups.filter((group) =>
			isNavigationGroupActive(group, '/docs/tooling/dev-mcp')
		);

		expect(activeGroups.map((group) => group.label)).toEqual(['Developer and coding-agent tools']);
	});

	it('uses location state for homepage anchors', () => {
		expect(isNavigationItemActive('/#doors', '/', '#doors')).toBe(true);
		expect(isNavigationItemActive('/', '/', '#doors')).toBe(false);
		expect(isNavigationItemActive('/#features', '/', '#doors')).toBe(false);
	});

	it('marks exactly one /agents "On this page" anchor active for the current topic', () => {
		const section = documentationSections.find((candidate) => candidate.id === 'agents');
		const onThisPage = section?.groups.find((group) => group.label === 'On this page');
		expect(onThisPage).toBeTruthy();
		expect(onThisPage!.items.length).toBeGreaterThan(1);

		for (const target of onThisPage!.items) {
			const hash = new URL(target.href, 'https://s-m-r-t.dev').hash;
			const activeHrefs = onThisPage!.items
				.filter((item) => isNavigationItemActive(item.href, '/docs/agents', hash))
				.map((item) => item.href);

			expect(activeHrefs).toEqual([target.href]);
		}
	});

	it('keeps showcases out of the docs panel (#365)', () => {
		const hrefs = documentationSections.flatMap((section) =>
			section.groups.flatMap((group) => group.items.map((item) => item.href))
		);
		expect(hrefs.filter((href) => /^\/(features|blocks)(\/|$)/.test(href))).toEqual([]);
	});

	it('registers every feature section and showcase, one group per section', () => {
		expect(featureNavigation.map((group) => group.label)).toEqual(
			featureSections.map((section) => section.word)
		);
		const hrefs = new Set(featureNavigation.flatMap((group) => group.items.map((i) => i.href)));
		expect(hrefs.size).toBe(featureSections.length + features.length);
		for (const item of features) {
			expect(hrefs.has(featurePath(item)), `${item.id} is not registered`).toBe(true);
		}
	});

	it('keeps prefix matching for section overview and nested-page links', () => {
		// Long-standing pattern: a hash-less overview link (e.g. /docs/tooling) stays
		// active on its own page and on every nested page under it, alongside the
		// exact-match link for that nested page. Same-page hash anchors must not
		// change this.
		expect(isNavigationItemActive('/docs/tooling', '/docs/tooling/dev-mcp', '')).toBe(true);
		expect(isNavigationItemActive('/docs/tooling/dev-mcp', '/docs/tooling/dev-mcp', '')).toBe(true);
		expect(isNavigationItemActive('/docs/tooling', '/docs/tooling', '#anything')).toBe(true);
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
			const href = `/docs/guides/${guide.slug}`;
			expect(
				guideFamilyHrefs.has(href),
				`${href} is missing from its guide-family navigation`
			).toBe(true);
			expect(contextualHrefs.has(href), `${href} has no contextual inbound link`).toBe(true);
		}
	});
});
