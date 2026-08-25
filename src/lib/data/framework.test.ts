import { describe, expect, it } from 'vitest';
import { foundationGuides } from '$lib/data/guides';
import { frameworkMigrationDecisions, frameworkTopics } from './framework';

describe('Framework content family', () => {
	it('provides the six approved concept destinations', () => {
		expect(frameworkTopics.map((topic) => topic.slug)).toEqual([
			'models-and-collections',
			'persistence-and-live-data',
			'tenancy-and-identity',
			'permissions-and-security',
			'generated-interfaces',
			'agent-awareness'
		]);
	});

	it('records a migration decision for every existing Foundation page', () => {
		const decisions = new Map(
			frameworkMigrationDecisions.map((decision) => [decision.source, decision])
		);

		expect(decisions.get('/foundations')).toMatchObject({
			status: 'redirect',
			href: '/framework'
		});

		for (const guide of foundationGuides) {
			const source = `/foundations/${guide.slug}`;
			expect(decisions.get(source), `${source} has no migration decision`).toBeDefined();
			expect(decisions.get(source)?.href).toMatch(/^\/framework#/);
		}
	});
});
