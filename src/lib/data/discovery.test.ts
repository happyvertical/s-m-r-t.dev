import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { docsNavigation } from '$lib/data/navigation';
import { searchDocs } from '$lib/data/search';
import { GET as sitemap } from '../../routes/sitemap.xml/+server';

const llms = readFileSync('static/llms.txt', 'utf8');

describe('Why s-m-r-t discovery surfaces', () => {
	it('uses the canonical homepage in navigation, search, and the sitemap', async () => {
		const why = docsNavigation.flatMap((group) => group.items).filter((item) => item.href === '/');

		expect(why).toHaveLength(1);
		expect(why[0]?.label).toBe('Home');
		expect(why[0]?.keywords).toEqual(
			expect.arrayContaining(['SAADL', 'Software as Agentic Domain Logic'])
		);
		expect(searchDocs('home')[0]).toMatchObject({
			label: 'Home',
			href: '/',
			kind: 'page'
		});
		// The visible nav label moved from "Why s-m-r-t?" to "Home", but the old
		// queries stay discoverable via keywords so a returning visitor's habit
		// still works.
		expect(searchDocs('why s-m-r-t')[0]).toMatchObject({ label: 'Home', href: '/' });
		expect(searchDocs('why smrt')[0]).toMatchObject({ label: 'Home', href: '/' });

		const sitemapXml = await (await sitemap({} as never)).text();
		expect(sitemapXml).toContain('<loc>https://s-m-r-t.dev</loc>');
		expect(sitemapXml).not.toContain('/why-smrt');
	});

	it('publishes the thesis, canonical technical routes, and runtime boundary for crawlers', () => {
		expect(llms).toContain('Awareness is not authority');
		expect(llms).toContain('https://s-m-r-t.dev/capabilities/agent-legible-applications');
		expect(llms).toContain('https://s-m-r-t.dev/tooling/app-mcp');
		expect(llms).toContain(
			'Runtime-environment registry boundary: conditional and unreleased by default'
		);
		expect(llms).toContain('does not connect to a running application');
		expect(llms).not.toMatch(/\b\d+\.\d+\.\d+\b/);
	});
});
