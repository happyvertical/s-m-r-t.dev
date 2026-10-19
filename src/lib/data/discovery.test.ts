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
		// The visible H1 ("The s-m-r-t application stack") and the lede's subject
		// are registered as keywords so the page's own words find it.
		expect(searchDocs('application stack')[0]).toMatchObject({ label: 'Home', href: '/' });
		expect(searchDocs('agentic software')[0]).toMatchObject({ label: 'Home', href: '/' });

		const sitemapXml = await (await sitemap({} as never)).text();
		expect(sitemapXml).toContain('<loc>https://s-m-r-t.dev</loc>');
		expect(sitemapXml).not.toContain('/why-smrt');
	});

	it('publishes the thesis, canonical technical routes, and runtime boundary for crawlers', () => {
		// The lede is the quotable paragraph from the homepage proposal (#321
		// slice E): the same text as the homepage SEO description.
		expect(llms).toContain(
			'> s-m-r-t is an MIT-licensed TypeScript stack for agentic software that people and agents use through the same screens, rules and permissions.'
		);
		expect(llms).toContain('build-a-boilerplate assembles a working mock-up');
		expect(llms).not.toContain('Build a boilerplate');
		expect(llms).toContain('https://s-m-r-t.dev/build-a-boilerplate');
		expect(llms).toContain('https://s-m-r-t.dev/agents');
		expect(llms).toContain('https://s-m-r-t.dev/reference/evidence');
		expect(llms).toContain('Awareness is not authority');
		expect(llms).toContain('https://s-m-r-t.dev/capabilities/agent-legible-applications');
		expect(llms).toContain('https://s-m-r-t.dev/tooling/app-mcp');
		expect(llms).toContain(
			'Runtime provenance in the development MCP: read-only and only when configured'
		);
		expect(llms).toContain('never executes the project’s application entry');
		expect(llms).not.toMatch(/\b\d+\.\d+\.\d+\b/);
	});
});
