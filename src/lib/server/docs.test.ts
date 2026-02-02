/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { getDoc, listDocs } from './docs';

describe('Docs Utility', () => {
	it('lists docs from the dependency', () => {
		const docs = listDocs();
		expect(docs.length).toBeGreaterThan(0);
		// Check for some known files from my previous 'ls'
		expect(docs).toContain('index');
		expect(docs).toContain('agents');
	});

	it('fetches a specific doc', async () => {
		const doc = await getDoc('index');
		expect(doc).not.toBeNull();
		expect(doc?.slug).toBe('index');
		expect(doc?.html).toBeTruthy();
	});

	it('handles nested docs', async () => {
		const doc = await getDoc('api/core/classes/SmrtObject');
		expect(doc).not.toBeNull();
		expect(doc?.slug).toBe('api/core/classes/SmrtObject');
	});

	it('returns null for non-existent doc', async () => {
		const doc = await getDoc('does-not-exist');
		expect(doc).toBeNull();
	});
});
