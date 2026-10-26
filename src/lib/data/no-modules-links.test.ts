import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * `/modules` is a prerendered 301 to `/blocks` (#355). Data must link to the
 * block pages directly rather than chain through the redirect.
 *
 * Test files are skipped; they may name the path.
 */
const dataDir = __dirname;

describe('no internal /modules links in site data', () => {
	const files = readdirSync(dataDir).filter(
		(name) => name.endsWith('.ts') && !name.endsWith('.test.ts')
	);

	it('scans the data files', () => {
		expect(files.length).toBeGreaterThan(10);
	});

	for (const name of files) {
		it(`${name} does not link to /modules`, () => {
			const source = readFileSync(join(dataDir, name), 'utf8');
			expect(source).not.toMatch(/['"`]\/modules(?=[/#?'"`])/);
		});
	}
});
