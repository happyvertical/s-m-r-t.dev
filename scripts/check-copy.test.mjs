import { describe, expect, it } from 'vitest';
import {
	auditPassages,
	extractProjectPassages,
	extractSveltePassages,
	extractTypeScriptPassages,
	findProjectCopySources
} from './check-copy.mjs';

const passage = (text) => [{ file: 'fixture.svelte', line: 1, text }];

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
				'static/llms.txt'
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
			'<div>Public introduction.</div><span>Use business logic here.</span>',
			'fixture.svelte'
		);
		expect(passages.map((item) => item.text)).toEqual(
			expect.arrayContaining(['Public introduction.', 'Use business logic here.'])
		);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'prohibited-business-logic', severity: 'error' })
			])
		);
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
			"<input placeholder={ready ? 'Search records' : 'Use business logic here.'}>",
			'fixture.svelte'
		);
		expect(auditPassages(passages)).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ id: 'prohibited-business-logic', severity: 'error' })
			])
		);
	});

	it('keeps interpolated data copy in the project passages', async () => {
		const { passages } = await extractProjectPassages();
		expect(passages).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					file: 'src/lib/data/guides.ts',
					text: expect.stringContaining('current tooling reference is pinned')
				})
			])
		);
	});

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
});
