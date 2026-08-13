import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { docsNavigation } from '$lib/data/navigation';
import { searchDocs } from '$lib/data/search';
import { GET as sitemap } from '../../routes/sitemap.xml/+server';

const llms = readFileSync('static/llms.txt', 'utf8');

describe('Why s-m-r-t discovery surfaces', () => {
	it('uses the canonical homepage in navigation, search, and the sitemap', async () => {
		const why = docsNavigation
			.flatMap((group) => group.items)
			.filter((item) => item.label === 'Why s-m-r-t?');

		expect(why).toHaveLength(1);
		expect(why[0]?.href).toBe('/');
		expect(searchDocs('why s-m-r-t')[0]).toMatchObject({
			label: 'Why s-m-r-t?',
			href: '/',
			kind: 'page'
		});
		expect(searchDocs('why smrt')[0]).toMatchObject({
			label: 'Why s-m-r-t?',
			href: '/',
			kind: 'page'
		});

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
