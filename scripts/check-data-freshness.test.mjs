import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
	BASELINE_PATH,
	collectInstalled,
	collectReferences,
	diffPackages,
	formatReport,
	undocumentableSlugs
} from './check-data-freshness.mjs';

// Built with dirname rather than `new URL('..', import.meta.url)`: vite rewrites
// that exact pattern into an asset URL, which is not a filesystem path.
const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));

describe('committed baseline', () => {
	// Deliberately NOT asserted here: that the baseline still matches the
	// installed tree. `pnpm test` is the pull-request gate, so asserting it would
	// make a Renovate bump fail CI until someone refreshed the baseline — turning
	// an advisory audit into the merge blocker it is designed not to be. Drift is
	// the scheduled workflow's job to report. What is asserted is that the walk
	// still works and the file is still shaped like a baseline.
	// `collectInstalled` now shells out to `smrt dev:knowledge-index`, which
	// spawns a cold Node process that loads the CLI's own dependency graph and
	// serializes every installed package's AGENTS.md. That is comfortably under a
	// second on this repository, but a generous explicit timeout keeps a slower
	// or colder CI runner from turning a merely-slow subprocess into a spurious
	// PR-gate failure (vitest's default is 5s).
	it('reads the real installed tree', () => {
		const installed = collectInstalled(ROOT);

		expect(Object.keys(installed).length).toBeGreaterThan(20);
		for (const [name, entry] of Object.entries(installed)) {
			expect(name).toMatch(/^@happyvertical\/smrt-/);
			expect(entry.version).toMatch(/^\d+\.\d+\.\d+/);
			expect(entry.agentsMd).toMatch(/^[0-9a-f]{64}$/);
		}
	}, 30_000);

	it('records a version and an AGENTS.md hash for every package', () => {
		const entries = Object.entries(baseline.packages);
		expect(entries.length).toBeGreaterThan(20);
		for (const [name, entry] of entries) {
			expect(name).toMatch(/^@happyvertical\/smrt-/);
			expect(entry.version).toMatch(/^\d+\.\d+\.\d+/);
			expect(entry.agentsMd).toMatch(/^[0-9a-f]{64}$/);
		}
	});
});

describe('diffPackages', () => {
	const before = {
		'@happyvertical/smrt-core': { version: '1.0.0', agentsMd: 'aaa' },
		'@happyvertical/smrt-ui': { version: '1.0.0', agentsMd: 'bbb' },
		'@happyvertical/smrt-old': { version: '1.0.0', agentsMd: 'ccc' }
	};

	it('reports nothing when the tree is unchanged', () => {
		expect(diffPackages(before, before)).toMatchObject({
			added: [],
			removed: [],
			changed: [],
			documented: [],
			drifted: false
		});
	});

	it('separates a rewritten AGENTS.md from a bare version bump', () => {
		const diff = diffPackages(before, {
			'@happyvertical/smrt-core': { version: '1.1.0', agentsMd: 'aaa' },
			'@happyvertical/smrt-ui': { version: '1.0.0', agentsMd: 'zzz' },
			'@happyvertical/smrt-old': { version: '1.0.0', agentsMd: 'ccc' }
		});

		expect(diff.changed).toEqual([
			{
				name: '@happyvertical/smrt-core',
				from: '1.0.0',
				to: '1.1.0',
				versionChanged: true,
				docChanged: false
			},
			{
				name: '@happyvertical/smrt-ui',
				from: '1.0.0',
				to: '1.0.0',
				versionChanged: false,
				docChanged: true
			}
		]);
		expect(diff.documented.map((entry) => entry.name)).toEqual(['@happyvertical/smrt-ui']);
		expect(diff.drifted).toBe(true);
	});

	it('does not call a lockstep version bump drift', () => {
		// Every smrt package moves together every few days. If that raised the
		// alarm the report would be noise within a month.
		const bumped = Object.fromEntries(
			Object.entries(before).map(([name, entry]) => [name, { ...entry, version: '1.1.0' }])
		);
		const diff = diffPackages(before, bumped);

		expect(diff.changed).toHaveLength(3);
		expect(diff.documented).toEqual([]);
		expect(diff.drifted).toBe(false);
	});

	it('reports packages that appeared and disappeared', () => {
		const diff = diffPackages(before, {
			'@happyvertical/smrt-core': { version: '1.0.0', agentsMd: 'aaa' },
			'@happyvertical/smrt-ui': { version: '1.0.0', agentsMd: 'bbb' },
			'@happyvertical/smrt-new': { version: '2.0.0', agentsMd: 'ddd' }
		});

		expect(diff.added).toEqual([{ name: '@happyvertical/smrt-new', version: '2.0.0' }]);
		expect(diff.removed).toEqual([{ name: '@happyvertical/smrt-old', version: '1.0.0' }]);
	});
});

describe('collectReferences', () => {
	const references = collectReferences(join(ROOT, 'src', 'lib', 'data'));

	it('finds the data files that name a package', () => {
		expect(references.get('smrt-core')).toContain('packages.ts');
	});

	it('finds packages named inside code examples, not just as bare slugs', () => {
		// guides.ts and reference.ts reach smrt-content only as
		// `'@happyvertical/smrt-content:Article'`; those pages still need
		// re-reading when that package's docs change.
		expect(references.get('smrt-content')).toEqual(
			expect.arrayContaining(['guides.ts', 'reference.ts'])
		);
	});

	it('ignores package-like text inside prose', () => {
		// `smrt-knowledge.json` and `no-smrt-objects-in-sources` appear in
		// tooling.ts copy; neither is a package.
		expect(references.has('smrt-knowledge')).toBe(false);
		expect(references.has('smrt-objects-in-sources')).toBe(false);
	});

	it('names packages the site documents but does not install', () => {
		const missing = undocumentableSlugs(references, baseline.packages);
		// The audit is blind to these; the report has to say so rather than imply
		// the whole site was checked. `smrt-cli` is now a devDependency (the CLI
		// this audit itself shells out to), so it is discovered like any other
		// installed package and is no longer in this list. `smrt dev:knowledge-index
		// --scope installed` discovers direct dependencies only (it does not walk the
		// pnpm store for transitive-only packages the way the old hand-rolled scan
		// did), so `smrt-core` — a transitive dependency with its own page — is now
		// correctly reported as unauditable rather than silently assumed covered.
		expect(missing).not.toContain('smrt-cli');
		expect(missing).toContain('smrt-core');
	});
});

describe('formatReport', () => {
	const references = new Map([['smrt-ui', ['packages.ts', 'reference.ts']]]);
	const current = { '@happyvertical/smrt-ui': { version: '2.0.0', agentsMd: 'zzz' } };

	it('points a changed package at the files that describe it', () => {
		const diff = diffPackages(
			{ '@happyvertical/smrt-ui': { version: '1.0.0', agentsMd: 'bbb' } },
			current
		);
		const report = formatReport(diff, references, current);

		expect(report).toContain('1.0.0 → 2.0.0');
		expect(report).toContain('`packages.ts`, `reference.ts`');
		expect(report).toContain('pnpm run audit:data -- --update');
	});

	it('says so plainly when nothing changed', () => {
		const diff = diffPackages(current, current);

		expect(formatReport(diff, references, current)).toContain('is known to be stale');
	});

	it('notes a version-only move without listing files to re-read', () => {
		const diff = diffPackages(
			{ '@happyvertical/smrt-ui': { version: '1.0.0', agentsMd: 'zzz' } },
			current
		);
		const report = formatReport(diff, references, current);

		expect(diff.drifted).toBe(false);
		expect(report).toContain('moved version without touching');
		expect(report).not.toContain('Data files to re-read');
	});

	it('refuses to print a version that would forge table rows', () => {
		// The report becomes a GitHub issue body, and versions come from
		// third-party package.json files.
		const hostile = {
			'@happyvertical/smrt-ui': { version: '1.0.0 | x |\n| forged |', agentsMd: 'z' }
		};
		const report = formatReport(
			diffPackages({ '@happyvertical/smrt-ui': { version: '1.0.0', agentsMd: 'b' } }, hostile),
			references,
			hostile
		);

		expect(report).not.toContain('forged');
		expect(report).toContain('(unprintable version)');
	});
});
