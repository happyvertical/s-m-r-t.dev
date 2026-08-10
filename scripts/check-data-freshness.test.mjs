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
	it('matches the installed tree', () => {
		// If this fails the framework moved without the data files being
		// re-verified. That is the drift the scheduled audit reports; fix it by
		// re-reading the changed packages and running `pnpm run audit:data -- --update`.
		expect(diffPackages(baseline.packages, collectInstalled(ROOT)).drifted).toBe(false);
	});

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
			drifted: false
		});
	});

	it('separates a rewritten AGENTS.md from a bare version bump', () => {
		const diff = diffPackages(before, {
			'@happyvertical/smrt-core': { version: '1.1.0', agentsMd: 'aaa' },
			'@happyvertical/smrt-ui': { version: '1.0.0', agentsMd: 'zzz' },
			'@happyvertical/smrt-old': { version: '1.0.0', agentsMd: 'ccc' }
		});

		expect(diff.drifted).toBe(true);
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

	it('ignores package-like text inside prose', () => {
		// `smrt-knowledge.json` and `no-smrt-objects-in-sources` appear in
		// tooling.ts copy; neither is a package.
		expect(references.has('smrt-knowledge')).toBe(false);
		expect(references.has('smrt-objects-in-sources')).toBe(false);
	});

	it('names packages the site documents but does not install', () => {
		const missing = undocumentableSlugs(references, baseline.packages);
		// The audit is blind to these; the report has to say so rather than imply
		// the whole site was checked.
		expect(missing).toContain('smrt-cli');
		expect(missing).not.toContain('smrt-core');
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

		expect(formatReport(diff, references, current)).toContain('matches the baseline');
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
