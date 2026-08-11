/**
 * Version numbers in page copy.
 *
 * The site once shipped four different hardcoded framework versions, none of
 * them the release it was built against. `$lib/version` exists so the rendered
 * version comes from the installed tree instead; the only sanctioned literals
 * are the `*_PINNED_VERSION` constants, which pin a release a person actually
 * ran the pages against and are documented at each declaration.
 *
 * So: every version literal in `src/lib/data` is either that one shared pin or
 * a version of something that is not the framework. A fifth wrong number
 * cannot get in without either agreeing with the pin or being declared below.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Versions of things other than the framework. Each says nothing about the
 * release this site documents, so each is a literal on purpose.
 */
const NON_FRAMEWORK_VERSIONS: Record<string, string> = {
	'0.1.0': 'the example app’s own version in MCP serverInfo snippets',
	'1.0.0': 'the Agent Plugins schema revision smrt-dev-mcp targets',
	'2.0.0': 'the @modelcontextprotocol/server version both MCP packages pin'
};

/**
 * A bare `x.y.z`. The lookarounds keep `0.40.5x` and `0.39.x` — prose about a
 * release line rather than a release — from reading as versions, while still
 * catching one embedded in a URL such as `/blob/v0.40.61` and one ending a
 * sentence. Only a following `.<digit>` is treated as part of the number, so
 * `0.40.61.` at a full stop still counts; the cases below pin that down.
 */
const VERSION_LITERAL = /(?<![\d.])\d+\.\d+\.\d+(?![\w-]|\.\d)/g;

const PINNED_DECLARATION = /const\s+(\w*PINNED_VERSION)\s*=\s*'([^']+)'/g;

// The literals have to be read as source: the point is what someone typed into
// page copy, which is indistinguishable from the pin once the module evaluates.
const dataDir = resolve(process.cwd(), 'src/lib/data');

const sources = readdirSync(dataDir)
	.filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
	.map((file) => ({ file, text: readFileSync(join(dataDir, file), 'utf8') }));

describe('version numbers in page copy', () => {
	it('reads the data modules, so nothing below passes vacuously', () => {
		expect(sources.length).toBeGreaterThan(5);
	});

	it('recognises a version wherever prose puts one', () => {
		const found = (text: string) => text.match(VERSION_LITERAL) ?? [];

		// Sentence-final is the one that got away first: a trailing `.` reads as
		// punctuation, not as a fourth segment.
		expect(found('No task lifecycle is available in 0.40.61.')).toEqual(['0.40.61']);
		expect(found('https://github.com/happyvertical/smrt/blob/v0.40.61')).toEqual(['0.40.61']);
		expect(found("version: '0.1.0',")).toEqual(['0.1.0']);
		expect(found('at s-m-r-t 0.40.61: static ui hints')).toEqual(['0.40.61']);

		// A release *line* is prose about a range, not a claim about a release.
		expect(found('first appeared in the 0.40.5x line and is not part of 0.39.x')).toEqual([]);
		expect(found('the 2026-07-28 revision')).toEqual([]);
		expect(found('a four-segment 1.2.3.4 build id')).toEqual([]);
	});

	it('pins every section to the same release', () => {
		const pins = sources.flatMap(({ file, text }) =>
			[...text.matchAll(PINNED_DECLARATION)].map(([, name, version]) => ({ file, name, version }))
		);

		expect(
			pins.length,
			'no *_PINNED_VERSION constant found — has one been renamed?'
		).toBeGreaterThan(2);
		expect(
			[...new Set(pins.map((pin) => pin.version))],
			`the pinned versions disagree: ${pins.map((pin) => `${pin.file}:${pin.name}=${pin.version}`).join(', ')}. ` +
				'Sections pinned to different releases is how the site ended up claiming four at once.'
		).toHaveLength(1);
	});

	it('writes no other version number into page copy', () => {
		const [pinned] = [
			...new Set(
				sources.flatMap(({ text }) =>
					[...text.matchAll(PINNED_DECLARATION)].map(([, , version]) => version)
				)
			)
		];

		for (const { file, text } of sources) {
			for (const literal of new Set(text.match(VERSION_LITERAL) ?? [])) {
				expect(
					literal === pinned || literal in NON_FRAMEWORK_VERSIONS,
					`${file} hardcodes ${literal}. Import SMRT_VERSION from $lib/version for the ` +
						`release the site is built against, reuse the ${pinned} pin for a claim a ` +
						'person checked, or add the number to NON_FRAMEWORK_VERSIONS here if it ' +
						'versions something other than the framework.'
				).toBe(true);
			}
		}
	});
});
