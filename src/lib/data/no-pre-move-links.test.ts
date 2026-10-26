import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import { describe, expect, it } from 'vitest';
import { docsMoves, docsPath } from '$lib/docs-paths';

/**
 * #365 moved every technical family under `/docs`; each pre-move URL is a
 * prerendered 301. Site data, components and pages must link to the `/docs`
 * page directly rather than through the redirect, so no internal href may
 * still start with a moved prefix (`/framework`, `/reference/…`, `/starters`, …).
 *
 * Test files are skipped (they may name the old paths), as are the redirect
 * stubs themselves (`+page.server.ts`), which exist to answer them.
 */
const files = globSync(
	[
		'src/lib/data/**/*.ts',
		'src/lib/components/**/*.{svelte,ts}',
		'src/lib/ui-showcase/**/*.svelte',
		'src/routes/**/*.svelte',
		'src/routes/**/+page.ts',
		'src/routes/sitemap.xml/+server.ts',
		'scripts/agent-docs/source.txt'
	],
	{ ignore: ['**/*.test.*'] }
);

const families = docsMoves.map(([from]) => from.slice(1)).join('|');
// A quote, backtick, markdown-link paren or the site origin, then a moved prefix.
const preMoveHref = new RegExp(
	`(?:['"\`(]|https://s-m-r-t\\.dev)(/(?:${families})(?:[/?#][^'"\`)\\s]*)?)(?=['"\`)\\s]|$)`,
	'g'
);

describe('no internal links to pre-move paths (#365)', () => {
	it('scans the site sources', () => {
		expect(files.length).toBeGreaterThan(60);
	});

	it('maps every moved family under /docs', () => {
		expect(docsPath('/framework')).toBe('/docs/framework');
		expect(docsPath('/reference/packages/smrt-core?tab=api')).toBe(
			'/docs/reference/packages/smrt-core?tab=api'
		);
		expect(docsPath('/starters#cookbook')).toBe('/docs/getting-started#cookbook');
		expect(docsPath('/uikit')).toBe('/uikit');
		expect(docsPath('/docs/ui')).toBe('/docs/ui');
	});

	for (const file of files) {
		it(`${file} links to /docs, not a pre-move path`, () => {
			const source = readFileSync(file, 'utf8');
			const found = [...source.matchAll(preMoveHref)].map((match) => match[1]);
			expect(
				found,
				`Replace each with its /docs path (docsPath in $lib/docs-paths): ${found
					.map((href) => `${href} → ${docsPath(href)}`)
					.join(', ')}`
			).toEqual([]);
		});
	}
});
