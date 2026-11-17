/**
 * Guard for `:global(.smrt-…)` selectors (#415).
 *
 * A component style that targets a framework class by name fails silently when
 * a release renames it: the rule just stops matching. This reads every such
 * class the site targets and checks the installed `@happyvertical` packages
 * still mention it, so a bump that renames one fails here instead of in the
 * layout.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

type Keep = (_: string) => boolean;

const walk = (dir: string, keep: Keep): string[] =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) return walk(path, keep);
		return keep(path) ? [path] : [];
	});

const sources = walk('src', (f) => f.endsWith('.svelte'));
const targeted = new Map<string, string>();
for (const file of sources) {
	const text = readFileSync(file, 'utf8');
	for (const [, inner] of text.matchAll(/:global\(([^)]*)\)/g)) {
		for (const [, cls] of inner.matchAll(/\.(smrt-[\w-]+)/g)) {
			targeted.set(cls, file);
		}
	}
}

const scope = '@happyvertical';
const installed = readdirSync(join('node_modules', scope))
	.map((name) => join('node_modules', scope, name, 'dist'))
	.filter((dir) => {
		try {
			return statSync(dir).isDirectory();
		} catch {
			return false;
		}
	})
	.flatMap((dir) => walk(dir, (f) => /\.(svelte|js|css)$/.test(f)))
	.map((f) => readFileSync(f, 'utf8'))
	.join('\n');

describe('framework class names the site targets with :global()', () => {
	it('finds the selectors it is meant to guard', () => {
		expect(targeted.size).toBeGreaterThan(0);
	});

	it.each([...targeted])('%s still exists in the installed packages (%s)', (cls) => {
		const exists = new RegExp(`(?<![\\w-])${cls}(?![\\w-])`).test(installed);
		expect(exists, `${cls} is not in any installed package`).toBe(true);
	});
});
