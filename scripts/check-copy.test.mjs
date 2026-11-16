import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
	auditPassages,
	extractProjectPassages,
	extractSveltePassages,
	extractTypeScriptPassages,
	findProjectCopySources,
	isStrictCopyFile,
	runCopyCheck,
	STRICT_COPY_GLOBS
} from './check-copy.mjs';

// Existing tests exercise the Tier B (STE-style) rules, so their default
// fixture sits on a strict reference path.
const STRICT_FILE = 'src/routes/docs/reference/api/+page.svelte';
const WELCOME_FILE = 'src/routes/docs/getting-started/+page.svelte';
const passage = (text, file = STRICT_FILE) => [{ file, line: 1, text }];

describe('copy checker tiers', () => {
	it('fails a Tier A wording violation on a welcome page', () => {
		for (const text of [
			'smrt runs software agents for you.',
			'smrt builds business software from your models.',
			'An AI decision engine for your team.',
			'A domain-specific toolkit.',
			'SM' + 'RT is the framework.',
			'Try Build a boilerplate today.',
			'Install smrt 0.55.16 to get started.',
			'Put business logic in the model.'
		]) {
			const findings = auditPassages(passage(text, WELCOME_FILE));
			expect(findings.filter((item) => item.severity === 'error')).not.toHaveLength(0);
		}
	});

	it('fails a Tier A wording violation on a reference page too', () => {
		const findings = auditPassages(passage('smrt runs software agents.', STRICT_FILE));
		expect(findings).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ severity: 'error', id: 'wording-software-agents' })
			])
		);
	});

	it('allows other tools version numbers in copy', () => {
		const findings = auditPassages(passage('smrt needs Node 26.0.0 or newer.', WELCOME_FILE));
		expect(findings.filter((item) => item.severity === 'error')).toHaveLength(0);
	});

	it('passes a Tier B violation on a welcome page', () => {
		const long =
			'Use this deliberately oversized procedural sentence to verify that the checker stays quiet for relaxed pages without claiming anything about the project behavior in general terms.';
		const findings = auditPassages(
			passage(`Put the rules in the model, simply via HTTP. ${long}`, WELCOME_FILE)
		);
		expect(findings).toEqual([]);
	});

	it('fails and warns on the same Tier B violation on a reference page', () => {
		const long =
			'Use this deliberately oversized procedural sentence to verify that the checker reports for strict pages without claiming anything about the project behavior in general terms.';
		const findings = auditPassages(
			passage(`Put the rules in the model, simply via HTTP. ${long}`, STRICT_FILE)
		);
		const ids = findings.map((item) => item.id);
		expect(ids).toEqual(
			expect.arrayContaining(['phrase-simply', 'phrase-via', 'procedural-sentence-length'])
		);
	});

	it('keeps the strict boundary in one path list', () => {
		expect(STRICT_COPY_GLOBS.length).toBeGreaterThan(0);
		expect(isStrictCopyFile('src/routes/docs/reference/packages/[slug]/+page.svelte')).toBe(true);
		expect(isStrictCopyFile('src/lib/data/packages.ts')).toBe(true);
		expect(isStrictCopyFile('src/routes/docs/getting-started/+page.svelte')).toBe(false);
		expect(isStrictCopyFile('src/routes/+page.svelte')).toBe(false);
	});
});

describe('copy checker', () => {
	it('rejects prohibited project terminology', () => {
		const findings = auditPassages(passage('Put business logic in the model.'));
		expect(findings).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ severity: 'error', id: 'prohibited-business-logic' })
			])
		);
	});

	it('reports sentence and paragraph limits as advisory findings', () => {
		const sentences = [
			'Use this deliberately oversized procedural sentence to verify that the checker reports more than twenty words for technical documentation without claiming automatic conformity or changing project behavior.',
			'This is sentence two.',
			'This is sentence three.',
			'This is sentence four.',
			'This is sentence five.',
			'This is sentence six.',
			'This is sentence seven.'
		].join(' ');
		const findings = auditPassages(passage(sentences));
		expect(findings).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ severity: 'warning', id: 'procedural-sentence-length' }),
				expect.objectContaining({ severity: 'warning', id: 'descriptive-paragraph-length' })
			])
		);
	});

	it('classifies numbered instructions as procedural sentences', () => {
		const findings = auditPassages(
			passage(
				'1. Add this deliberately oversized dependency declaration to the application package file and retain every unrelated configuration value before you run the installation command.'
			)
		);
		expect(findings).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ severity: 'warning', id: 'procedural-sentence-length' })
			])
		);
	});

	it('reports common disallowed and ambiguous phrases', () => {
		const findings = auditPassages(
			passage(
				'Simply use the adapter via HTTP. This allows the caller to continue. Open the labelled catalogue.'
			)
		);
		expect(findings.map((finding) => finding.id)).toEqual(
			expect.arrayContaining([
				'phrase-simply',
				'phrase-via',
				'ambiguous-pronoun',
				'spelling-label',
				'spelling-catalog'
			])
		);
	});

	it('covers route, component, data, and static copy sources', async () => {
		const files = await findProjectCopySources();
		expect(files).toEqual(
			expect.arrayContaining([
				'src/routes/+page.svelte',
				'src/lib/components/GuidePage.svelte',
				'src/lib/data/guides.ts',
				'scripts/agent-docs/source.txt'
			])
		);
		expect(files.some((file) => file.includes('.test.'))).toBe(false);
	});

	it('keeps prose around nested links in the checked passage', () => {
		const passages = extractSveltePassages(
			'<p>Read the <a href="/guide">complete guide</a> before deployment.</p>',
			'fixture.svelte'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ text: 'Read the complete guide before deployment.' })
			])
		);
	});

	it('checks visible text in standalone elements', () => {
		const passages = extractSveltePassages(
			'<div>Public introduction.</div><span>Use software agents here.</span>',
			'fixture.svelte'
		);
		expect(passages.map((item) => item.text)).toEqual(
			expect.arrayContaining(['Public introduction.', 'Use software agents here.'])
		);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('rejects visible copy imported from an unscanned module', () => {
		const passages = extractSveltePassages(
			"<script>import { copy } from '$lib/messages';</script><p>{copy}</p>",
			'fixture.svelte'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ extractionErrorId: 'copy-svelte-expression-unextractable' })
			])
		);
	});

	it('allows visible copy imported from an audited data module', () => {
		const passages = extractSveltePassages(
			"<script>import { copy } from '$lib/data/messages';</script><p>{copy}</p>",
			'fixture.svelte'
		);
		expect(passages.some((item) => item.extractionError)).toBe(false);
	});

	it('rejects unclassified page data from SvelteKit runtime state', () => {
		const passages = extractSveltePassages(
			"<script>import { page } from '$app/state';</script><p>{page.data.copy}</p>",
			'fixture.svelte'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ extractionErrorId: 'copy-svelte-expression-unextractable' })
			])
		);
	});

	it('allows the displayed SvelteKit error state fields', () => {
		const passages = extractSveltePassages(
			"<script>import { page } from '$app/state';</script><p>{page.status}</p><span>{page.error?.message}</span>",
			'fixture.svelte'
		);
		expect(passages.some((item) => item.extractionError)).toBe(false);
	});

	it('checks literal alternatives in visible Svelte expressions', () => {
		const passages = extractSveltePassages(
			"<button>{open ? 'Close menu' : 'Open menu'}</button>",
			'fixture.svelte'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ text: expect.stringContaining('Close menu') }),
				expect.objectContaining({ text: expect.stringContaining('Open menu') })
			])
		);
	});

	it('checks literal alternatives in dynamic copy attributes', () => {
		const passages = extractSveltePassages(
			"<input placeholder={ready ? 'Search records' : 'Use software agents here.'}>",
			'fixture.svelte'
		);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('checks copy-bearing native attributes and component props', () => {
		for (const source of [
			'<input type="submit" value="Use software agents here.">',
			'<div aria-description="Use software agents here."></div>',
			'<Widget body="Use software agents here." />'
		]) {
			const findings = auditPassages(extractSveltePassages(source, 'fixture.svelte'));
			expect(findings).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
				])
			);
		}
	});

	it('rejects an unclassified component text prop', () => {
		for (const source of [
			'<Widget helperText="Help the reader." />',
			"<Widget helperText={'Use software agents here.'} />",
			"<Widget helperText={ready ? 'Ready.' : 'Wait.'} />",
			"<Widget helperText={String('Use software agents here.')} />"
		]) {
			const passages = extractSveltePassages(source, 'fixture.svelte');
			expect(passages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						classificationError: expect.stringContaining('helperText')
					})
				])
			);
		}
	});

	it('fails closed for an unsupported Svelte copy attribute shape', () => {
		const passages = extractSveltePassages('<input aria-label>', 'fixture.svelte');
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extractionError: expect.stringContaining('aria-label')
				})
			])
		);
	});

	it('reports an unsupported Svelte copy attribute shape as an error', async () => {
		const projectRoot = await mkdtemp(path.join(tmpdir(), 'smrt-copy-check-'));
		try {
			const routeDirectory = path.join(projectRoot, 'src/routes');
			await mkdir(routeDirectory, { recursive: true });
			await writeFile(path.join(routeDirectory, '+page.svelte'), '<input aria-label>');
			const result = await runCopyCheck(projectRoot);
			expect(result.errors).toEqual(
				expect.arrayContaining([expect.objectContaining({ id: 'copy-attribute-unextractable' })])
			);
		} finally {
			await rm(projectRoot, { recursive: true, force: true });
		}
	});

	it('fails closed for unresolved visible Svelte copy', () => {
		for (const source of [
			'<p>{copy}</p>',
			'<input alt={copy}>',
			'<input {...props}>',
			'{#each getItems() as item}<p>{item.copy}</p>{/each}'
		]) {
			const passages = extractSveltePassages(source, 'fixture.svelte');
			expect(passages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						extractionError: expect.any(String)
					})
				])
			);
		}
	});

	it('allows copy that arrives through an explicit component prop', () => {
		const passages = extractSveltePassages(
			'<script>let { copy } = $props();</script><p>{copy}</p><input alt={copy}>',
			'fixture.svelte'
		);
		expect(passages.some((item) => item.extractionError)).toBe(false);
	});

	it('checks visible copy referenced through script bindings', () => {
		const passages = extractSveltePassages(
			"<script>const label = 'Use software agents here.';</script><p>{label}</p><input placeholder={label}>",
			'fixture.svelte'
		);
		expect(passages.filter((item) => item.text === 'Use software agents here.')).toHaveLength(2);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('checks document-title copy', () => {
		const passages = extractSveltePassages(
			'<svelte:head><title>Use software agents here.</title></svelte:head>',
			'fixture.svelte'
		);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('checks literal raw HTML copy', () => {
		const passages = extractSveltePassages(
			"{@html '<p>Use software agents here.</p>'}",
			'fixture.svelte'
		);
		expect(passages).toEqual(
			expect.arrayContaining([expect.objectContaining({ text: 'Use software agents here.' })])
		);
	});

	it('checks statically bound copy in each blocks', () => {
		const passages = extractSveltePassages(
			"{#each ['Use software agents here.'] as copy}<p>{copy}</p>{/each}",
			'fixture.svelte'
		);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('checks statically bound object properties in each blocks', () => {
		const passages = extractSveltePassages(
			"{#each [{ body: 'Use software agents here.' }] as item}<p>{item.body}</p>{/each}",
			'fixture.svelte'
		);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('keeps inline each-block records in separate passages', () => {
		const passages = extractSveltePassages(
			"{#each [{ body: 'First.' }, { body: 'Second.' }] as item}<p>{item.body}</p>{/each}",
			'fixture.svelte'
		);
		expect(passages.map((item) => item.text)).toEqual(['First.', 'Second.']);
	});

	it('keeps script-array records in separate passages', () => {
		const passages = extractSveltePassages(
			"<script>const items = ['First.', 'Second.'];</script>{#each items as item}<p>{item}</p>{/each}",
			'fixture.svelte'
		);
		expect(passages.map((item) => item.text)).toEqual(['First.', 'Second.']);
	});

	it('checks nested script bindings in object-based each blocks', () => {
		const passages = extractSveltePassages(
			"<script>const copy = 'Use software agents here.'; const items = [{ body: copy }];</script>{#each items as item}<p>{item.body}</p>{/each}",
			'fixture.svelte'
		);
		expect(passages.map((item) => item.text)).toEqual(['Use software agents here.']);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('does not duplicate nested script object passages', () => {
		const passages = extractSveltePassages(
			"<script>const items = [{ meta: { body: 'First.' } }, { meta: { body: 'Second.' } }];</script>{#each items as item}<p>{item.meta.body}</p>{/each}",
			'fixture.svelte'
		);
		expect(passages.map((item) => item.text)).toEqual(['First.', 'Second.']);
	});

	it('checks unrendered prose configuration in Svelte scripts', () => {
		const passages = extractSveltePassages(
			"<script>const config = { meta: { title: 'Use software agents here.' } };</script><Widget article={config} />",
			'fixture.svelte'
		);
		expect(passages.map((item) => item.text)).toEqual(['Use software agents here.']);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('keeps repeated unrendered script declarations separate', () => {
		const passages = extractSveltePassages(
			"<script>const first = { title: 'Same.' }; const second = { title: 'Same.' };</script><Widget article={first} guide={second} />",
			'fixture.svelte'
		);
		expect(passages.map((item) => item.text)).toEqual(['Same.', 'Same.']);
	});

	// This is the only whole-project scan in this suite: extractProjectPassages()
	// walks every copy source with no fixture root. Its corpus scales with the
	// generated component reference (1,719 described props at 0.44.0) plus
	// batteries stories, and CI's shared runner has measured over 5000ms against
	// vitest's default test timeout even though this ran in ~2s locally. Give it
	// explicit headroom rather than trimming the scan.
	const PROJECT_SCAN_TIMEOUT_MS = 20000;

	it(
		'keeps interpolated data copy in the project passages',
		async () => {
			const { passages } = await extractProjectPassages();
			expect(passages).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						file: 'src/lib/data/guides.ts',
						text: expect.stringContaining('current tooling reference is pinned')
					})
				])
			);
		},
		PROJECT_SCAN_TIMEOUT_MS
	);

	it('rejects an unclassified data-copy property', () => {
		const passages = extractTypeScriptPassages(
			"export const item = { helperText: 'Help the reader.' };",
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					classificationError: expect.stringContaining('helperText')
				})
			])
		);
	});

	it('rejects an unclassified data property with identifier-bound copy', () => {
		const passages = extractTypeScriptPassages(
			"const copy = 'Help the reader.'; export const item = { helperText: copy };",
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					classificationError: expect.stringContaining('helperText')
				})
			])
		);
	});

	it('rejects a computed unclassified data-copy property', () => {
		const passages = extractTypeScriptPassages(
			"const key = 'helperText'; const copy = 'Use software agents here.'; export const item = { [key]: copy };",
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					classificationError: expect.stringContaining('[computed property]')
				})
			])
		);
	});

	it('rejects a literal computed data-copy property', () => {
		const passages = extractTypeScriptPassages(
			"const copy = 'Use software agents here.'; export const item = { ['title']: copy };",
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					classificationError: expect.stringContaining('[computed property]')
				})
			])
		);
	});

	it('checks prose properties with identifier-bound copy', () => {
		const passages = extractTypeScriptPassages(
			"const copy = 'Use software agents here.'; export const item = { title: copy };",
			'src/lib/data/fixture.ts'
		);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('checks guide metadata prose and accepts its structural fields', () => {
		const passages = extractTypeScriptPassages(
			`export const guide = {
				task: {
					purpose: 'Use software agents here.',
					prerequisites: ['A working application'],
					difficulty: 'Beginner',
					supportRange: '1.x',
					concepts: ['Application model'],
					relatedUi: [],
					relatedModules: [],
					relatedReference: [],
					expectedResult: 'The application starts.'
				},
				stepCount: 3
			};`,
			'src/lib/data/fixture.ts'
		);

		expect(passages.some((item) => item.classificationError)).toBe(false);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('rejects a computed value for a data prose property', () => {
		const passages = extractTypeScriptPassages(
			'export const item = { title: getCopy() };',
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extractionErrorId: 'copy-prose-value-unextractable'
				})
			])
		);
	});

	it('rejects a dynamic producer inside a data prose template', () => {
		const passages = extractTypeScriptPassages(
			'export const item = { title: `Prefix ${getCopy()}` };',
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ extractionErrorId: 'copy-prose-value-unextractable' })
			])
		);
	});

	it('rejects a member value derived from an unsupported prose producer', () => {
		const passages = extractTypeScriptPassages(
			'export const item = { title: getCopy().title };',
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extractionErrorId: 'copy-prose-value-unextractable'
				})
			])
		);
	});

	it('rejects an unbound data prose identifier', () => {
		const passages = extractTypeScriptPassages(
			'declare const copy: string; export const item = { title: copy };',
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					extractionErrorId: 'copy-prose-value-unextractable'
				})
			])
		);
	});

	it('allows callback-derived prose that points to audited source data', () => {
		const passages = extractTypeScriptPassages(
			"const items = [{ title: 'Source title.' }]; export const derived = items.map((item) => ({ title: item.title }));",
			'src/lib/data/fixture.ts'
		);
		expect(passages.some((item) => item.extractionError)).toBe(false);
		expect(passages).toEqual(
			expect.arrayContaining([expect.objectContaining({ text: 'Source title.' })])
		);
	});

	it('rejects prose derived from an unproven function parameter', () => {
		const passages = extractTypeScriptPassages(
			'export const derived = (item) => ({ title: item.title });',
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ extractionErrorId: 'copy-prose-value-unextractable' })
			])
		);
	});

	it('rejects a callback over an unsupported prose producer', () => {
		const passages = extractTypeScriptPassages(
			'export const derived = getCopy().map((item) => ({ title: item.title }));',
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ extractionErrorId: 'copy-prose-value-unextractable' })
			])
		);
	});

	it('rejects a callback over an object that contains an unsupported producer', () => {
		const passages = extractTypeScriptPassages(
			'declare function loadUnscannedCopy(); const source = { items: loadUnscannedCopy() }; export const derived = Object.values(source).map((item) => ({ title: item.title }));',
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ extractionErrorId: 'copy-prose-value-unextractable' })
			])
		);
	});

	it('rejects a callback over an unscanned imported collection', () => {
		const passages = extractTypeScriptPassages(
			"import { items } from 'external'; export const derived = items.map((item) => ({ title: item.title }));",
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ extractionErrorId: 'copy-prose-value-unextractable' })
			])
		);
	});

	it('allows a callback over an audited local data import', () => {
		const passages = extractTypeScriptPassages(
			"import { items } from '$lib/data/source'; export const derived = items.map((item) => ({ title: item.title }));",
			'src/lib/data/fixture.ts'
		);
		expect(passages.some((item) => item.extractionError)).toBe(false);
	});

	it('rejects a safe string method on an unsupported prose producer', () => {
		const passages = extractTypeScriptPassages(
			'export const item = { title: getCopy().trim() };',
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ extractionErrorId: 'copy-prose-value-unextractable' })
			])
		);
	});

	it('audits prose passed through a private static factory', () => {
		const passages = extractTypeScriptPassages(
			"function defineItem(summary) { return { summary }; } export const item = defineItem('Use software agents here.');",
			'src/lib/data/fixture.ts'
		);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'wording-software-agents', severity: 'error' })
			])
		);
	});

	it('rejects prose passed through a factory that escapes static analysis', () => {
		const passages = extractTypeScriptPassages(
			"function defineItem(summary) { return { summary }; } defineItem('Audited.'); export const escaped = defineItem;",
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ extractionErrorId: 'copy-prose-value-unextractable' })
			])
		);
	});

	it('reports a computed data prose value as an end-to-end error', async () => {
		const projectRoot = await mkdtemp(path.join(tmpdir(), 'smrt-copy-check-'));
		try {
			const dataDirectory = path.join(projectRoot, 'src/lib/data');
			await mkdir(dataDirectory, { recursive: true });
			await writeFile(
				path.join(dataDirectory, 'fixture.ts'),
				'export const item = { title: getCopy() };'
			);
			const result = await runCopyCheck(projectRoot);
			expect(result.errors).toEqual(
				expect.arrayContaining([expect.objectContaining({ id: 'copy-prose-value-unextractable' })])
			);
		} finally {
			await rm(projectRoot, { recursive: true, force: true });
		}
	});

	it('reports malformed TypeScript copy sources', () => {
		const passages = extractTypeScriptPassages(
			"export const item = { title: 'Fine copy.';",
			'src/lib/data/fixture.ts'
		);
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					parseError: expect.stringContaining("'}' expected")
				})
			])
		);
	});

	it('audits prose after a same-block fenced code sample', async () => {
		const projectRoot = await mkdtemp(path.join(tmpdir(), 'smrt-copy-check-'));
		try {
			const staticDirectory = path.join(projectRoot, 'static');
			await mkdir(staticDirectory, { recursive: true });
			await writeFile(
				path.join(staticDirectory, 'llms.txt'),
				'```js\nconst example = true;\n```\nUse software agents here.'
			);
			const result = await runCopyCheck(projectRoot);
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ id: 'wording-software-agents', file: 'static/llms.txt' })
				])
			);
		} finally {
			await rm(projectRoot, { recursive: true, force: true });
		}
	});

	it('does not close a long fence with a shorter marker', async () => {
		const projectRoot = await mkdtemp(path.join(tmpdir(), 'smrt-copy-check-'));
		try {
			const staticDirectory = path.join(projectRoot, 'static');
			await mkdir(staticDirectory, { recursive: true });
			await writeFile(
				path.join(staticDirectory, 'llms.txt'),
				'````markdown\n```\n````\nUse software agents here.'
			);
			const result = await runCopyCheck(projectRoot);
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ id: 'wording-software-agents', file: 'static/llms.txt' })
				])
			);
		} finally {
			await rm(projectRoot, { recursive: true, force: true });
		}
	});

	it('supports tilde fences', async () => {
		const projectRoot = await mkdtemp(path.join(tmpdir(), 'smrt-copy-check-'));
		try {
			const staticDirectory = path.join(projectRoot, 'static');
			await mkdir(staticDirectory, { recursive: true });
			await writeFile(
				path.join(staticDirectory, 'llms.txt'),
				'~~~js\nconst example = true;\n~~~\nUse software agents here.'
			);
			const result = await runCopyCheck(projectRoot);
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ id: 'wording-software-agents', file: 'static/llms.txt' })
				])
			);
		} finally {
			await rm(projectRoot, { recursive: true, force: true });
		}
	});

	it('reports an unclosed fence', async () => {
		const projectRoot = await mkdtemp(path.join(tmpdir(), 'smrt-copy-check-'));
		try {
			const staticDirectory = path.join(projectRoot, 'static');
			await mkdir(staticDirectory, { recursive: true });
			await writeFile(path.join(staticDirectory, 'llms.txt'), '```js\nconst example = true;');
			const result = await runCopyCheck(projectRoot);
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ id: 'copy-fence-unclosed', file: 'static/llms.txt' })
				])
			);
		} finally {
			await rm(projectRoot, { recursive: true, force: true });
		}
	});

	it('does not treat a four-space-indented marker as a fence', async () => {
		const projectRoot = await mkdtemp(path.join(tmpdir(), 'smrt-copy-check-'));
		try {
			const staticDirectory = path.join(projectRoot, 'static');
			await mkdir(staticDirectory, { recursive: true });
			await writeFile(path.join(staticDirectory, 'llms.txt'), '    ```\nUse software agents here.');
			const result = await runCopyCheck(projectRoot);
			expect(result.errors).toEqual(
				expect.arrayContaining([
					expect.objectContaining({ id: 'wording-software-agents', file: 'static/llms.txt' })
				])
			);
			expect(result.errors.some((item) => item.id === 'copy-fence-unclosed')).toBe(false);
		} finally {
			await rm(projectRoot, { recursive: true, force: true });
		}
	});
});
