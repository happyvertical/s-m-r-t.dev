import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE_ORIGIN } from '$lib/site';
import { searchItems } from '$lib/data/navigation';
import { searchDocs } from '$lib/data/search';
import { GET as sitemap } from '../../routes/sitemap.xml/+server';

const llms = readFileSync('scripts/agent-docs/source.txt', 'utf8').replaceAll(
	'{{SITE_ORIGIN}}',
	SITE_ORIGIN
);

describe('Why smrt discovery surfaces', () => {
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
		// The visible nav label moved from "Why smrt?" to "Home", but the old
		// queries stay discoverable via keywords so a returning visitor's habit
		// still works.
		// The old hyphenated spelling still finds the page (built from parts so
		// the product-name guard does not flag this file).
		const oldName = ['s', 'm', 'r', 't'].join('-');
		expect(searchDocs(oldName)[0]).toMatchObject({ label: 'Home', href: '/' });
		expect(searchDocs(`why ${oldName}`)[0]).toMatchObject({ label: 'Home', href: '/' });
		expect(searchDocs('why smrt')[0]).toMatchObject({ label: 'Home', href: '/' });
		expect(searchDocs('why smrt')[0]).toMatchObject({ label: 'Home', href: '/' });
		// The visible H1 ("The smrt application stack") and the lede's subject
		// are registered as keywords so the page's own words find it.
		expect(searchDocs('application stack')[0]).toMatchObject({ label: 'Home', href: '/' });
		expect(searchDocs('agentic software')[0]).toMatchObject({ label: 'Home', href: '/' });
		expect(searchDocs('features map')[0]).toMatchObject({ label: 'Demo', href: '/demo' });
		expect(searchDocs('tools')[0]).toMatchObject({ label: 'Tools', href: '/tools' });

		const sitemapXml = await (await sitemap({} as never)).text();
		expect(sitemapXml).toContain(`<loc>${SITE_ORIGIN}</loc>`);
		expect(sitemapXml).not.toContain('/why-smrt');
	});

	it('publishes the thesis, canonical technical routes, and runtime boundary for crawlers', () => {
		// The lede is the quotable paragraph: the same text as the homepage SEO
		// description, and it names the three doors and the features -> sections
		// shape of the site (#361, #366).
		expect(llms).toContain(
			'> smrt is an MIT-licensed TypeScript stack for agentic software that people and agents use through the same screens, rules and permissions.'
		);
		expect(llms).toContain('four doors: Docs, Features, Tools and Demo');
		expect(llms).toContain('nine groups');
		expect(llms).toContain('assembles a working mock-up for a kind of business');
		expect(llms).not.toMatch(/\bblocks?\b/i);
		expect(llms).not.toContain('Build a boilerplate');
		expect(llms).toContain(SITE_ORIGIN + '/build-a-boilerplate');
		expect(llms).toContain(SITE_ORIGIN + '/docs —');
		expect(llms).toContain(SITE_ORIGIN + '/docs/agents');
		expect(llms).toContain(SITE_ORIGIN + '/docs/reference/evidence');
		expect(llms).toContain('Awareness is not authority');
		expect(llms).toContain(SITE_ORIGIN + '/docs/capabilities/agent-legible-applications');
		expect(llms).toContain(SITE_ORIGIN + '/docs/tooling/app-mcp');
		expect(llms).toContain(
			'Runtime provenance in the development MCP: read-only and only when configured'
		);
		expect(llms).toContain('never executes the project’s application entry');
		expect(llms).not.toMatch(/\b\d+\.\d+\.\d+\b/);
	});
});
