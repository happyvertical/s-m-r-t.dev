import { describe, expect, it } from 'vitest';
import { contentRoutes, routesByPath } from '../server/route-inventory';
import {
	capabilityHome,
	currentPath,
	movedSlugs,
	capabilityPath,
	docMoves,
	movedPages,
	type MovedPageKey,
	movedHref,
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

	it.each(Object.entries(docMoves))('%s -> %s is one 301 hop to a page', (from, to) => {
		expect(served.has(to), `${to} is not a page`).toBe(true);
		expect(movedPath(from)).toBe(to);
		expect(routesByPath.get(from)?.isRedirect, `${from} must redirect`).toBe(true);
		expect(routesByPath.get(from)?.target).toBe(to);
		expect(served.has(from)).toBe(false);
	});

	it('resolves a path to its final address, one hop, never an old one', () => {
		expect(currentPath('/docs/capabilities/webmcp')).toBe('/docs/capabilities/webmcp');
		for (const old of Object.keys(docMoves)) {
			expect(Object.hasOwn(docMoves, currentPath(old)), `${old} chains`).toBe(false);
		}
	});

	it('lists the old slugs per family', () => {
		expect(movedSlugs('/docs/foundations')).toEqual(['interfaces']);
		expect(movedSlugs('/docs/capabilities').sort()).toEqual([
			'application-shell',
			'collections',
			'field-policies',
			'field-policy-operations',
			'policy-aware-forms'
		]);
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
			expect(capabilityPath(guide).startsWith('/docs/ui/')).toBe(capabilityHome(guide) === 'ui');
			expect(capabilityPath(guide.slug)).toBe(capabilityPath(guide));
		}
		expect(taskPath('x')).toBe('/docs/guides/x');
		expect(toolingPath('x')).toBe('/docs/tooling/x');
		expect(referencePath('x')).toBe('/docs/reference/x');
	});

	it('reads capability homes from the placement table', () => {
		const slugOf = (href: string) => href.split('/').at(-1) as string;
		expect(capabilityHome(slugOf(movedHref('applicationShell')))).toBe('ui');
		expect(capabilityHome({ slug: 'webmcp' })).toBe('agents-and-interaction');
		expect(capabilityHome(slugOf(movedHref('collectionReads')))).toBeUndefined();
	});
});

describe('movedHref', () => {
	it('resolves every id to its docMoves target, with an optional fragment', () => {
		for (const [key, old] of Object.entries(movedPages)) {
			expect(movedHref(key as MovedPageKey)).toBe(docMoves[old]);
			expect(movedHref(key as MovedPageKey, 'x')).toBe(`${docMoves[old]}#x`);
		}
		expect(Object.values(movedPages).sort()).toEqual(Object.keys(docMoves).sort());
	});
});

describe('doc-moves.ts holds addresses only (it is exempt from check-copy)', () => {
	it('has no string literal that is not a path, slug, or id', () => {
		const raw = import.meta.glob('./doc-moves.ts', {
			query: '?raw',
			import: 'default',
			eager: true
		}) as Record<string, string>;
		const source = Object.values(raw)[0]
			.replace(/\/\*[\s\S]*?\*\//g, '')
			.replace(/^\s*\/\/.*$/gm, '');
		const literals = [...source.matchAll(/'([^'\\\n]*)'|"([^"\\\n]*)"|`([^`\\]*)`/g)].map((match) =>
			(match[1] ?? match[2] ?? match[3]).replace(/\$\{[^}]*\}/g, '')
		);
		expect(literals.length).toBeGreaterThan(10);
		const prose = literals.filter((text) => !/^[A-Za-z0-9#/:._-]*$/.test(text));
		expect(prose).toEqual([]);
	});
});
