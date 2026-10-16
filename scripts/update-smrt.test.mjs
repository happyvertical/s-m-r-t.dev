import { execFile, execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { promisify } from 'node:util';
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

	it('exempts an independent package from lockstep but not from exact pins', () => {
		expect(
			check({
				'@happyvertical/smrt-core': '0.40.63',
				'@happyvertical/smrt-svelte': '0.40.63',
				'@happyvertical/smrt-planner': '0.1.0'
			})
		).toContain('coherent at 0.40.63 (2 packages)');
		for (const spec of ['^0.1.0', 'link:../smrt-planner']) {
			expect(() =>
				check({
					'@happyvertical/smrt-core': '0.40.63',
					'@happyvertical/smrt-planner': spec
				})
			).toThrow(/SMRT dependencies must use exact versions/);
		}
	});

	it('rejects mixed exact versions', () => {
		expect(() =>
			check({
				'@happyvertical/smrt-core': '0.40.62',
				'@happyvertical/smrt-svelte': '0.40.63'
			})
		).toThrow(/SMRT dependencies must move in lockstep/);
	});
});

describe('update-smrt update', () => {
	it('moves lockstep packages to --to and an independent package to its own latest', async () => {
		const latest = {
			'@happyvertical/smrt-core': '0.41.0',
			'@happyvertical/smrt-planner': '0.2.0'
		};
		const server = createServer((request, response) => {
			const name = decodeURIComponent(request.url.slice(1));
			if (!latest[name]) {
				response.writeHead(404).end();
				return;
			}
			response.writeHead(200, { 'content-type': 'application/json' });
			response.end(JSON.stringify({ 'dist-tags': { latest: latest[name] } }));
		});
		await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
		try {
			const directory = mkdtempSync(join(tmpdir(), 'smrt-update-run-'));
			temporaryDirectories.push(directory);
			const { port } = server.address();
			writeFileSync(
				join(directory, '.npmrc'),
				`@happyvertical:registry=http://127.0.0.1:${port}/\n`
			);
			writeFileSync(
				join(directory, 'package.json'),
				JSON.stringify({
					dependencies: {
						'@happyvertical/smrt-core': '0.40.63',
						'@happyvertical/smrt-planner': '0.1.0'
					}
				})
			);
			await promisify(execFile)(process.execPath, [script, '--to', '0.41.0', '--no-install'], {
				cwd: directory,
				encoding: 'utf8'
			});
			const written = JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8'));
			expect(written.dependencies).toEqual({
				'@happyvertical/smrt-core': '0.41.0',
				'@happyvertical/smrt-planner': '0.2.0'
			});
		} finally {
			server.close();
		}
	}, 30_000);
});
