import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { capabilityGuides, foundationGuides } from '$lib/data/guides';
import { getPackage } from '$lib/data/packages';
import { SMRT_VERSION } from '$lib/version';

/**
 * Regression guard for the WebMCP guide correction (2026-09, bundled with the
 * `/docs/framework/agents` section). Before this fix the guide claimed custom model actions
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
		// Word-bounded: the superseded filter read `tool.readOnly`; the bespoke
		// tool sample legitimately declares its effect with `readOnlyHint`.
		expect(code).not.toMatch(/\breadOnly\b/);
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
		const webmcpTabStart = source.indexOf("tab.id === 'webmcp'");
		expect(webmcpTabStart).toBeGreaterThan(-1);
		const webmcpTabSample = source.slice(webmcpTabStart, webmcpTabStart + 1500);

		expect(webmcpTabSample).toContain('webMcpToolDefinitions');
		expect(webmcpTabSample).not.toContain('collectionDefinitions');
		expect(webmcpTabSample).not.toContain('readOnly');
	});
});

describe('retired MCP tier and plane terminology (#197)', () => {
	it('never reintroduces the Tier 1/2 or development/runtime plane taxonomy Tooling retired', () => {
		const guideText = JSON.stringify([...foundationGuides, ...capabilityGuides]);

		expect(guideText).not.toMatch(/\bTier[\s-]?[12]\b/i);
		expect(guideText).not.toMatch(/development plane/i);
		expect(guideText).not.toMatch(/runtime plane/i);
	});
});

/**
 * #412: the AI usage, inference tuning and ingestion pages. The ingestion page
 * must keep saying what upstream says: it is a preview, a reviewer decides, and
 * automation is disabled. A reword that drops that would oversell the package.
 */
describe('AI usage, inference tuning and ingestion capability pages (#412)', () => {
	const slugs = ['ai-usage', 'inference-tuning', 'ingestion'];
	const text = (slug: string) =>
		JSON.stringify(capabilityGuides.find((guide) => guide.slug === slug) ?? '');

	it.each(slugs)('%s is a capability page pinned to the installed release', (slug) => {
		const guide = capabilityGuides.find((entry) => entry.slug === slug);
		expect(guide).toBeTruthy();
		expect(guide?.pinnedVersion).toBe(SMRT_VERSION);
		expect(guide?.sources?.length).toBeGreaterThan(0);
	});

	it.each(slugs)('%s links only package pages that exist', (slug) => {
		// GuidePage links every entry to /docs/reference/packages/<name>, and the
		// site has no page for smrt-inference.
		const guide = capabilityGuides.find((entry) => entry.slug === slug);
		for (const name of guide?.packages ?? []) expect(getPackage(name), name).toBeTruthy();
	});

	it('says usage recording is on by default and transcripts are not', () => {
		expect(text('ai-usage')).toContain('On by default');
		expect(text('ai-usage')).toContain('off by default');
	});

	it('says tiers change nothing until they are bound', () => {
		expect(text('inference-tuning')).toContain('change nothing until you bind them');
	});

	it('describes ingestion as a reviewed preview with automation disabled', () => {
		const ingestion = text('ingestion');
		expect(ingestion).toContain('automation disabled');
		expect(ingestion).toContain('did not meet its quality gates');
		expect(ingestion).toContain('A reviewer decides');
		expect(ingestion).not.toMatch(/fully automat|automatically (applies|approves)/i);
	});
});
