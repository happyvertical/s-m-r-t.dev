import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { capabilityGuides } from '$lib/data/guides';
import { SMRT_VERSION } from '$lib/version';

/**
 * Regression guard for the WebMCP guide correction (2026-09, bundled with the
 * `/agents` section). Before this fix the guide claimed custom model actions
 * "currently return a clear not-wired response" — false as of 0.43.9 — and
 * taught the superseded `collectionDefinitions` + `filter: (_d, tool) =>
 * tool.readOnly` registration path instead of the canonical
 * `webMcpToolDefinitions` array, which is already read-only by default.
 * `PackageWorkbench.svelte` duplicated the same superseded sample on every
 * package page with a generated surface. Nothing else in the suite would
 * catch either regressing back to the old claim or the old sample, so this
 * test reads both sources directly.
 */
describe('WebMCP guide correction stays fixed', () => {
	const webmcpGuide = capabilityGuides.find((guide) => guide.slug === 'webmcp');

	it('finds the webmcp capability guide', () => {
		expect(webmcpGuide).toBeTruthy();
	});

	it('no longer claims custom actions are not wired', () => {
		const proseAndCode = (webmcpGuide?.sections ?? [])
			.flatMap((section) => [section.intro, section.code ?? ''])
			.join('\n');

		expect(proseAndCode.toLowerCase()).not.toContain('not wired');
		expect(proseAndCode.toLowerCase()).not.toContain('not-wired');
	});

	it('teaches the canonical webMcpToolDefinitions registration, not the superseded sample', () => {
		const code = (webmcpGuide?.sections ?? []).map((section) => section.code ?? '').join('\n');

		expect(code).toContain('webMcpToolDefinitions');
		expect(code).not.toContain('collectionDefinitions');
		expect(code).not.toContain('readOnly');
	});

	it('carries pinnedVersion, related, and sources — the fields it previously had none of', () => {
		expect(webmcpGuide?.pinnedVersion).toBe(SMRT_VERSION);
		expect(webmcpGuide?.related?.length).toBeGreaterThan(0);
		expect(webmcpGuide?.sources?.length).toBeGreaterThan(0);
		expect(webmcpGuide?.packages).toContain('smrt-svelte');
	});

	it('keeps PackageWorkbench.svelte off the same superseded sample it used to duplicate', () => {
		const source = readFileSync(
			resolve(process.cwd(), 'src/lib/components/PackageWorkbench.svelte'),
			'utf8'
		);
		// Scope to the WebMCP tab's code sample rather than the whole file:
		// `collectionDefinitions` legitimately appears elsewhere (the
		// unrelated ObjectFormSourceRegistry sample) and would false-positive
		// a whole-file check.
		const webmcpTabStart = source.indexOf("activeTab === 'webmcp'");
		expect(webmcpTabStart).toBeGreaterThan(-1);
		const webmcpTabSample = source.slice(webmcpTabStart, webmcpTabStart + 1500);

		expect(webmcpTabSample).toContain('webMcpToolDefinitions');
		expect(webmcpTabSample).not.toContain('collectionDefinitions');
		expect(webmcpTabSample).not.toContain('readOnly');
	});
});
