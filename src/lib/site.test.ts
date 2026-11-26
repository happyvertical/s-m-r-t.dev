/**
 * The hostname in one place.
 *
 * `src/lib/site.js` owns the site origin so a domain move is a one-line change
 * there. This guard fails when the hostname is typed anywhere else, so a new
 * `SEO url` or link cannot quietly bring the search-and-replace back. Use
 * `SITE_ORIGIN`, `SITE_HOST` or `siteUrl()` from `$lib/site`; scripts import
 * `../src/lib/site.js`; `scripts/agent-docs/source.txt` uses `{{SITE_ORIGIN}}`.
 *
 * The exceptions below are files that cannot import the constant, or that
 * assert the literal on purpose. Each is checked to still need its entry.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SITE_HOST, SITE_ORIGIN, siteUrl } from '$lib/site';

const HOST = new RegExp(SITE_HOST.replaceAll('.', '\\.'), 'g');

/** Tracked files that may carry the hostname, and why. First match wins. */
const EXCEPTIONS: { test: (_file: string) => boolean; why: string }[] = [
	{ test: (f) => f === 'src/lib/site.js', why: 'the one place the origin is written' },
	{
		test: (f) => /\.test\.(ts|mjs|js)$/.test(f),
		why: 'tests assert the published URLs literally, independent of the constant (this includes the legacy redirect tests)'
	},
	{
		test: (f) => f.startsWith('.github/'),
		why: 'workflows run post-deploy origin checks and cannot import src/'
	},
	{ test: (f) => f.startsWith('infra/'), why: 'CloudFront and Terraform configuration' },
	{
		test: (f) => f === 'static/robots.txt',
		why: 'served verbatim; checked against SITE_ORIGIN below'
	},
	{ test: (f) => /\.md$/.test(f), why: 'repository documentation, not shipped copy' },
	{ test: (f) => f === '.agents/project.yaml' || f === '.env.example', why: 'tooling config' }
];

const root = resolve(process.cwd());
const tracked = execFileSync(
	'git',
	['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
	{ cwd: root, encoding: 'utf8' }
)
	.split('\0')
	.filter((file) => file && !/\.(png|jpe?g|webp|gif|ico|woff2?|zip)$/.test(file));

const withHostname = tracked.flatMap((file) => {
	let text: string;
	try {
		text = readFileSync(resolve(root, file), 'utf8');
	} catch {
		return []; // listed but not present, e.g. a deletion in the working tree
	}
	const lines = text
		.split('\n')
		.map((line, index) => ({ line, number: index + 1 }))
		.filter(({ line }) => new RegExp(HOST.source).test(line));
	return lines.length ? [{ file, lines }] : [];
});

describe('site origin', () => {
	it('derives the host and URLs from one origin', () => {
		expect(SITE_ORIGIN).toMatch(/^https:\/\/[^/]+$/);
		expect(SITE_HOST).toBe(new URL(SITE_ORIGIN).hostname);
		expect(siteUrl()).toBe(SITE_ORIGIN);
		expect(siteUrl('/')).toBe(SITE_ORIGIN);
		expect(siteUrl('/docs')).toBe(`${SITE_ORIGIN}/docs`);
	});

	it('scans real files, so nothing below passes vacuously', () => {
		expect(tracked.length).toBeGreaterThan(200);
		expect(withHostname.some(({ file }) => file === 'src/lib/site.js')).toBe(true);
	});

	it('writes the hostname nowhere outside the constant and the documented exceptions', () => {
		const offenders = withHostname
			.filter(({ file }) => !EXCEPTIONS.some((exception) => exception.test(file)))
			.map(({ file, lines }) => `${file}:${lines.map((l) => l.number).join(',')}`);
		expect(
			offenders,
			'the site hostname is hardcoded. Import SITE_ORIGIN / SITE_HOST / siteUrl from $lib/site ' +
				'(scripts: ../src/lib/site.js; source.txt: {{SITE_ORIGIN}}), or add a documented entry to EXCEPTIONS.'
		).toEqual([]);
	});

	it('keeps every exception needed', () => {
		for (const exception of EXCEPTIONS) {
			expect(
				withHostname.some(({ file }) => exception.test(file)),
				`no file needs the exception "${exception.why}"; remove it from EXCEPTIONS`
			).toBe(true);
		}
	});

	it('keeps robots.txt pointing at the same origin', () => {
		const robots = readFileSync(resolve(root, 'static/robots.txt'), 'utf8');
		expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`);
	});
});
