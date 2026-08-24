import { describe, expect, it } from 'vitest';
import {
	getGuideLibraryItem,
	guideLibrary,
	guideLibraryItemsInFamily,
	guideLibrarySearchTerms,
	guideMigrationDecisions,
	taskGuideFamilies,
	taskGuides
} from '$lib/data/task-guides';

describe('guide library', () => {
	it('uses the approved six families in order', () => {
		expect(taskGuideFamilies.map((family) => family.label)).toEqual([
			'Getting started',
			'Build the foundation',
			'Add interfaces',
			'Add application modules',
			'Connect agents',
			'Operate and ship'
		]);
	});

	it('gives every family at least one current content destination', () => {
		for (const family of taskGuideFamilies) {
			expect(guideLibraryItemsInFamily(family.id), family.label).not.toHaveLength(0);
		}
	});

	it('exposes complete metadata for every library item', () => {
		expect(new Set(guideLibrary.map((guide) => guide.href)).size).toBe(guideLibrary.length);

		for (const guide of guideLibrary) {
			expect(guide.task.purpose).toBeTruthy();
			expect(guide.task.prerequisites.length).toBeGreaterThan(0);
			expect(guide.task.difficulty).toMatch(/^(Beginner|Intermediate|Advanced)$/);
			expect(guide.task.supportRange).toBeTruthy();
			expect(guide.packages.length).toBeGreaterThan(0);
			expect(guide.task.concepts.length).toBeGreaterThan(0);
			expect(
				guide.task.relatedUi.length + guide.task.relatedModules.length,
				`${guide.href} needs a related UI or Modules destination`
			).toBeGreaterThan(0);
			expect(guide.task.relatedReference.length).toBeGreaterThan(0);
			expect(guide.task.expectedResult).toBeTruthy();
		}
	});

	it('places starter content in Getting started', () => {
		expect(getGuideLibraryItem('/starters/ground-up')?.task.family).toBe('getting-started');
		expect(getGuideLibraryItem('/starters/saas')?.task.family).toBe('getting-started');
	});

	it('places the procedural agent guide in Connect agents', () => {
		expect(getGuideLibraryItem('/guides/expose-your-app-over-mcp')?.task.family).toBe(
			'connect-agents'
		);
		expect(guideMigrationDecisions).toContainEqual({
			source: '/capabilities/agent-legible-applications',
			decision: 'split',
			family: 'connect-agents'
		});
	});

	it('records a content decision for every guide source in this migration', () => {
		expect(guideMigrationDecisions.map((record) => record.source)).toEqual([
			'/guides/multi-tenant-lifecycle',
			'/guides/expose-your-app-over-mcp',
			'/guides/semantic-search',
			'/guides/testing-your-app',
			'/starters',
			'/starters/ground-up',
			'/starters/saas',
			'/foundations/interfaces',
			'/capabilities/agent-legible-applications'
		]);
	});

	it('uses metadata in guide filtering terms', () => {
		const tenant = getGuideLibraryItem('/guides/multi-tenant-lifecycle');
		expect(tenant).toBeDefined();
		expect(guideLibrarySearchTerms(tenant!)).toEqual(
			expect.arrayContaining(['Build the foundation', 'Tenant hierarchy', 'Intermediate'])
		);
	});

	it('keeps published task guides on their existing routes for issue 187', () => {
		expect(taskGuides.map((guide) => `/guides/${guide.slug}`)).toEqual([
			'/guides/multi-tenant-lifecycle',
			'/guides/expose-your-app-over-mcp',
			'/guides/semantic-search',
			'/guides/testing-your-app'
		]);
	});
});
