import { describe, expect, it } from 'vitest';
import { contentRoutes } from '../server/route-inventory';
import {
	capabilityHome,
	capabilityPath,
	docMoves,
	foundationPath,
	movedPath,
	referencePath,
	taskPath,
	toolingPath
} from './doc-moves';
import { capabilityGuides, foundationGuides } from './guides';

const served = new Set(contentRoutes.map((route) => route.path));

describe('docMoves', () => {
	it('names exactly the six planned moves', () => {
		expect(Object.keys(docMoves)).toHaveLength(6);
	});

	it.each(Object.entries(docMoves))('%s is served now and %s is not yet', (from, to) => {
		expect(served.has(from), `${from} is not served`).toBe(true);
		expect(served.has(to), `${to} is already served`).toBe(false);
		expect(movedPath(from)).toBe(to);
	});

	it('returns undefined for a path that never moved', () => {
		expect(movedPath('/docs/capabilities/webmcp')).toBeUndefined();
		expect(movedPath('toString')).toBeUndefined();
	});
});

describe('path helpers', () => {
	it('return the URLs the routes serve today', () => {
		for (const guide of foundationGuides) {
			expect(served.has(foundationPath(guide)), guide.slug).toBe(true);
		}
		for (const guide of capabilityGuides) {
			expect(served.has(capabilityPath(guide)), guide.slug).toBe(true);
			expect(capabilityPath(guide.slug)).toBe(capabilityPath(guide));
		}
		expect(taskPath('x')).toBe('/docs/guides/x');
		expect(toolingPath('x')).toBe('/docs/tooling/x');
		expect(referencePath('x')).toBe('/docs/reference/x');
	});

	it('reads capability homes from the placement table', () => {
		expect(capabilityHome('application-shell')).toBe('ui');
		expect(capabilityHome({ slug: 'webmcp' })).toBe('agents-and-interaction');
		expect(capabilityHome('collections')).toBeUndefined();
	});
});
