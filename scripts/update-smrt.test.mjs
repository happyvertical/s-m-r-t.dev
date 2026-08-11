import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const script = join(process.cwd(), 'scripts', 'update-smrt.mjs');
const temporaryDirectories = [];

afterEach(() => {
	for (const directory of temporaryDirectories.splice(0)) {
		rmSync(directory, { recursive: true, force: true });
	}
});

function check(dependencies) {
	const directory = mkdtempSync(join(tmpdir(), 'smrt-update-check-'));
	temporaryDirectories.push(directory);
	writeFileSync(join(directory, 'package.json'), JSON.stringify({ dependencies }));
	return execFileSync(process.execPath, [script, '--check'], {
		cwd: directory,
		encoding: 'utf8',
		stdio: ['ignore', 'pipe', 'pipe']
	});
}

describe('update-smrt --check', () => {
	it('accepts one exact lockstep version', () => {
		expect(
			check({
				'@happyvertical/smrt-core': '0.40.63',
				'@happyvertical/smrt-svelte': '0.40.63'
			})
		).toContain('coherent at 0.40.63 (2 packages)');
	});

	it('rejects ranged versions', () => {
		expect(() =>
			check({
				'@happyvertical/smrt-core': '^0.40.63',
				'@happyvertical/smrt-svelte': '0.40.63'
			})
		).toThrow(/SMRT dependencies must use exact versions/);
	});

	it.each(['file:../smrt-core', 'link:../smrt-core', 'workspace:*'])(
		'rejects the local spec %s',
		(spec) => {
			expect(() =>
				check({
					'@happyvertical/smrt-core': spec,
					'@happyvertical/smrt-svelte': '0.40.63'
				})
			).toThrow(/SMRT dependencies must use exact versions/);
		}
	);

	it('rejects mixed exact versions', () => {
		expect(() =>
			check({
				'@happyvertical/smrt-core': '0.40.62',
				'@happyvertical/smrt-svelte': '0.40.63'
			})
		).toThrow(/SMRT dependencies must move in lockstep/);
	});
});
