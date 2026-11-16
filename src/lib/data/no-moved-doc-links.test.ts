import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import { describe, expect, it } from 'vitest';
import { docMoves, movedPath } from '$lib/data/doc-moves';

/**
 * #399 moved docs pages. An old address still answers one 301, but nothing on
 * the site may link to it: every internal href names the page's current
 * address (`docMoves` values). Prose links are literals, so this is what
 * catches a link left behind by a move or a later rename.
 *
 * Test files are skipped (they pin old paths on purpose), as are `doc-moves.ts`
 * (it names them) and the redirect stubs under `routes/**\/+page.server.ts`.
 */
const files = globSync(
	[
		'src/lib/**/*.{ts,svelte}',
		'src/routes/**/*.svelte',
		'src/routes/**/+page.ts',
		'src/routes/sitemap.xml/+server.ts',
		'scripts/agent-docs/source.txt',
		'README.md',
		'docs/**/*.md'
	],
	{ ignore: ['**/*.test.*', 'src/lib/data/doc-moves.ts', 'src/lib/server/**'] }
);

// Only landed moves: a pending one still serves its page at the old address.
const oldPaths = Object.keys(docMoves).filter((path) => movedPath(path) !== undefined);
// Old path, then a character that ends it: `#fragment`, `?query`, a quote,
// backtick, paren, whitespace — but not `-` or a letter (`…/collections-x`).
const boundary = String.raw`(?=[#?'"\`)\s<]|$)`;
const oldLink = new RegExp(
	`(?:${oldPaths.map((path) => path.replace(/[/.]/g, '\\$&')).join('|')})${boundary}`,
	'g'
);

describe('no internal links to moved docs pages (#399)', () => {
	it('scans the site sources', () => {
		expect(files.length).toBeGreaterThan(100);
	});

	for (const file of files) {
		it(`${file} links to current addresses`, () => {
			const found = [...readFileSync(file, 'utf8').matchAll(oldLink)].map((match) => match[0]);
			expect(
				found,
				`Link to the new address instead: ${found
					.map((href) => `${href} → ${docMoves[href]}`)
					.join(', ')}`
			).toEqual([]);
		});
	}
});
