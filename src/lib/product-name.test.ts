/**
 * The product name is written `smrt`, lowercase, in prose (#396).
 *
 * This guard fails when the retired spellings `s-m-r-t` and `SMRT` are used as
 * the product name anywhere in the repository's own text. It does not flag:
 *
 * - the hostname `s-m-r-t.dev` (and the repository `happyvertical/s-m-r-t.dev`),
 *   which `site.test.ts` polices separately;
 * - identifiers that merely contain the letters: `SMRT_VERSION`, `SMRT_`-prefixed
 *   environment variables, `SMRTToggle`, `@happyvertical/smrt-*` package names;
 * - lowercase `smrt` in any form.
 *
 * A sentence that starts with the name still starts with lowercase `smrt`.
 * The exceptions below are files that must keep an old spelling; each is
 * checked to still need its entry.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/** `s-m-r-t` not followed by `.dev` (plain or regex-escaped) and not a hyphenated compound. */
const DASHED = /(?<![\w/.@-])s-m-r-t(?!\.dev|\\\.dev|-|\w)/;
/** Whole-word `SMRT`: not part of `SMRT_VERSION`, `SMRTToggle`, `<SMRT>` or `@SMRT`. */
const SHOUTED = /(?<![<@/\w])SMRT(?![\w>])/;

/** Tracked files that may carry an old spelling, and why. First match wins. */
const EXCEPTIONS: { test: (_file: string) => boolean; why: string }[] = [
	{
		test: (f) => f === 'src/lib/product-name.test.ts',
		why: 'this guard names the retired spellings'
	},
	{
		test: (f) =>
			f === 'src/lib/legacy-features.ts' ||
			f.includes('[...legacy]') ||
			/^src\/routes\/(blocks|modules|packages|faq)\//.test(f),
		why: 'legacy redirect tables and routes are a frozen URL contract'
	},
	{
		test: (f) => /^src\/lib\/legacy-.*\.test\.ts$/.test(f) || /legacy-routes\.test/.test(f),
		why: 'legacy redirect tests assert the frozen tables'
	},
	{
		test: (f) => f === 'src/lib/data/ui-components.generated.ts',
		why: 'generated from upstream package docs; the text is upstream-owned'
	},
	{
		test: (f) => f === 'COMPONENT_MAP.md' || f === 'COMPONENT_RENAME_PLAN.md',
		why: 'historical records of the `<SMRT>` provider component and SMRT-prefixed component names'
	},
	{ test: (f) => f.startsWith('.github/'), why: 'workflows' },
	{ test: (f) => f.startsWith('infra/'), why: 'CloudFront and Terraform configuration' },
	{ test: (f) => f.startsWith('.claude/'), why: 'local agent tooling settings' },
	{ test: (f) => f === 'pnpm-lock.yaml', why: 'lockfile' },
	{ test: (f) => f.startsWith('static/stills/'), why: 'generated artwork' }
];

/** The offending lines of one file's text. */
export function offendingLines(text: string): number[] {
	return text
		.split('\n')
		.flatMap((line, index) => (DASHED.test(line) || SHOUTED.test(line) ? [index + 1] : []));
}

const root = resolve(process.cwd());
const tracked = execFileSync(
	'git',
	['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
	{ cwd: root, encoding: 'utf8' }
)
	.split('\0')
	.filter((file) => file && !/\.(png|jpe?g|webp|gif|ico|woff2?|zip)$/.test(file));

const flagged = tracked.flatMap((file) => {
	let text: string;
	try {
		text = readFileSync(resolve(root, file), 'utf8');
	} catch {
		return [];
	}
	const lines = offendingLines(text);
	return lines.length ? [{ file, lines }] : [];
});

describe('product name', () => {
	it('recognises the retired spellings and ignores identifiers and hostnames', () => {
		expect(offendingLines('an s-m-r-t app')).toEqual([1]);
		expect(offendingLines('the SMRT framework')).toEqual([1]);
		expect(offendingLines('https://s-m-r-t.dev/docs\nhappyvertical/s-m-r-t.dev')).toEqual([]);
		expect(offendingLines('/s-m-r-t\\.dev/g')).toEqual([]);
		expect(offendingLines('SMRT_VERSION SMRTToggle <SMRT> @happyvertical/smrt-core')).toEqual([]);
		expect(offendingLines('the smrt framework')).toEqual([]);
	});

	it('scans real files, so nothing below passes vacuously', () => {
		expect(tracked.length).toBeGreaterThan(200);
		expect(tracked).toContain('src/routes/+page.svelte');
	});

	it('uses lowercase smrt as the product name outside the documented exceptions', () => {
		const offenders = flagged
			.filter(({ file }) => !EXCEPTIONS.some((exception) => exception.test(file)))
			.map(({ file, lines }) => `${file}:${lines.join(',')}`);
		expect(
			offenders,
			'"s-m-r-t" or "SMRT" is used as the product name. Write it lowercase: smrt (the hostname s-m-r-t.dev is fine), or add a documented entry to EXCEPTIONS.'
		).toEqual([]);
	});

	it('keeps every exception needed', () => {
		for (const exception of EXCEPTIONS) {
			const needed = flagged.some(({ file }) => exception.test(file));
			// Exceptions for areas that carry no old spelling today are guardrails, not leftovers.
			const guardrail =
				/workflows|CloudFront|local agent|lockfile|generated artwork|legacy redirect/.test(
					exception.why
				);
			expect(needed || guardrail, `no file needs the exception "${exception.why}"; remove it`).toBe(
				true
			);
		}
	});
});
