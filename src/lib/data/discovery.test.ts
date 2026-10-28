import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { searchItems } from '$lib/data/navigation';
import { searchDocs } from '$lib/data/search';
import { GET as sitemap } from '../../routes/sitemap.xml/+server';

const llms = readFileSync('scripts/agent-docs/source.txt', 'utf8');

describe('Why s-m-r-t discovery surfaces', () => {
	it('uses the canonical homepage in navigation, search, and the sitemap', async () => {
		// The homepage is not a docs page (#365), so it is registered for the
		// palette only, outside the docs panel.
		const why = searchItems.filter((item) => item.href === '/');

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
		expect(searchDocs('features map')[0]).toMatchObject({ label: 'Home', href: '/' });

		const sitemapXml = await (await sitemap({} as never)).text();
		expect(sitemapXml).toContain('<loc>https://s-m-r-t.dev</loc>');
		expect(sitemapXml).not.toContain('/why-smrt');
	});

	it('publishes the thesis, canonical technical routes, and runtime boundary for crawlers', () => {
		// The lede is the quotable paragraph: the same text as the homepage SEO
		// description, and it names the three doors and the features -> sections
		// shape of the site (#361, #366).
		expect(llms).toContain(
			'> s-m-r-t is an MIT-licensed TypeScript stack for agentic software that people and agents use through the same screens, rules and permissions.'
		);
		expect(llms).toContain('BUILD, FEATURES and DOCS');
		expect(llms).toContain('nine groups');
		expect(llms).toContain('assembles a working mock-up for a kind of business');
		expect(llms).not.toMatch(/\bblocks?\b/i);
		expect(llms).not.toContain('Build a boilerplate');
		expect(llms).toContain('https://s-m-r-t.dev/build-a-boilerplate');
		expect(llms).toContain('https://s-m-r-t.dev/docs —');
		expect(llms).toContain('https://s-m-r-t.dev/docs/agents');
		expect(llms).toContain('https://s-m-r-t.dev/docs/reference/evidence');
		expect(llms).toContain('Awareness is not authority');
		expect(llms).toContain('https://s-m-r-t.dev/docs/capabilities/agent-legible-applications');
		expect(llms).toContain('https://s-m-r-t.dev/docs/tooling/app-mcp');
		expect(llms).toContain(
			'Runtime provenance in the development MCP: read-only and only when configured'
		);
		expect(llms).toContain('never executes the project’s application entry');
		expect(llms).not.toMatch(/\b\d+\.\d+\.\d+\b/);
	});
});
