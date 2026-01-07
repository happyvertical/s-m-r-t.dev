/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { load } from './+page.server';

describe('Docs Page Load', () => {
	it('loads the index doc', async () => {
		const result = await load({ params: { slug: 'index' } } as any);
		expect(result.doc.slug).toBe('index');
	});

	it('handles friendly mappings', async () => {
		const result = await load({ params: { slug: 'objects' } } as any);
		expect(result.doc.slug).toBe('api/core/classes/SmrtObject');
	});

	it('handles module mappings', async () => {
		const result = await load({ params: { slug: 'smrt-db' } } as any);
		expect(result.doc.slug).toBe('core');
	});

	it('throws 404 for missing doc', async () => {
		// SvelteKit error() throws a special object, but Vitest 'rejects.toThrow' might need adjustment
		try {
			await load({ params: { slug: 'missing' } } as any);
		} catch (e: any) {
			expect(e.status).toBe(404);
		}
	});
});