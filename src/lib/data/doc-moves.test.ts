import { describe, expect, it } from 'vitest';
import { contentRoutes, routesByPath } from '../server/route-inventory';
import {
	capabilityHome,
	currentPath,
	movedSlugs,
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

	// A move is landed once its target is a page; from then on the old URL is
	// one 301 to it. A pending move (target route not built yet) still serves
	// the page at the old URL. #399 item 4 lands the last four.
	it.each(Object.entries(docMoves))('%s -> %s is pending or one 301 hop', (from, to) => {
		if (served.has(to)) {
			expect(movedPath(from)).toBe(to);
			expect(routesByPath.get(from)?.isRedirect, `${from} must redirect`).toBe(true);
			expect(routesByPath.get(from)?.target).toBe(to);
		} else {
			expect(movedPath(from)).toBeUndefined();
			expect(served.has(from), `${from} is not served`).toBe(true);
		}
	});

	it('resolves a path to its final address, one hop, never an old one', () => {
		expect(currentPath('/docs/capabilities/webmcp')).toBe('/docs/capabilities/webmcp');
		for (const old of Object.keys(docMoves)) {
			if (movedPath(old) === undefined) continue;
			expect(Object.hasOwn(docMoves, currentPath(old)), `${old} chains`).toBe(false);
		}
	});

	it('lists the old slugs per family', () => {
		expect(movedSlugs('/docs/foundations')).toEqual(['interfaces']);
		expect(movedSlugs('/docs/capabilities')).toContain('collections');
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
		expect(capabilityHome('collection-reads')).toBeUndefined();
	});
});
