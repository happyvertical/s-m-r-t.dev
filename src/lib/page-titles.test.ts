import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * SEO.svelte appends " | smrt" to every page title, so a title that itself
 * names the site ("smrt docs") renders doubled ("smrt docs | smrt").
 *
 * Allow list: `smrt-*` package and template names (e.g. "Clone smrt-start"),
 * and the exact landing title "smrt framework" (src/routes/+page.svelte),
 * which SEO.svelte renders without a suffix.
 */
const ROOTS = ['src/routes', 'src/lib/components'];
const LANDING = 'src/routes/+page.svelte';

function svelteFiles(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) return svelteFiles(path);
		return path.endsWith('.svelte') ? [path] : [];
	});
}

/** Title expressions passed to <SEO ...> (literal or template literal). */
function seoTitles(source: string): string[] {
	const titles: string[] = [];
	for (const tag of source.matchAll(/<SEO\b[\s\S]*?(?:\/>|>)/g)) {
		const m = tag[0].match(/\btitle=(?:"([^"]*)"|\{`([^`]*)`\}|\{([^}]*)\})/);
		if (m) titles.push(m[1] ?? m[2] ?? m[3]);
	}
	return titles;
}

describe('page titles', () => {
	const files = ROOTS.flatMap(svelteFiles).filter((f) => f !== LANDING);

	it('finds SEO titles to check', () => {
		const count = files.flatMap((f) => seoTitles(readFileSync(f, 'utf8'))).length;
		expect(count).toBeGreaterThan(10);
	});

	it('never repeats the site name that SEO.svelte already appends', () => {
		const offenders = files.flatMap((file) =>
			seoTitles(readFileSync(file, 'utf8'))
				.filter((t) => /\bsmrt\b(?!-)/i.test(t))
				.map((t) => `${file}: ${t}`)
		);
		expect(offenders).toEqual([]);
	});
});
