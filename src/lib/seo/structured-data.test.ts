import { describe, expect, it } from 'vitest';
import { isDocPath, serializeJsonLd, structuredData } from './structured-data';

describe('agent structured data', () => {
	it('identifies the website, organization and released source on the home page', () => {
		const graph = structuredData('s-m-r-t', 'Stack', 'https://s-m-r-t.dev')['@graph'];
		expect(graph.map((node) => node['@type'])).toEqual([
			'Organization',
			'WebSite',
			'SoftwareSourceCode'
		]);
		expect(graph[0].sameAs).toEqual(['https://github.com/happyvertical']);
		expect(graph[2]).toMatchObject({
			codeRepository: 'https://github.com/happyvertical/smrt',
			license: 'https://opensource.org/license/mit',
			programmingLanguage: 'TypeScript'
		});
	});
	it('uses page metadata for the article and ordered canonical breadcrumbs', () => {
		const url = 'https://s-m-r-t.dev/docs/reference/packages/core';
		const graph = structuredData('Core', 'Domain models', url)['@graph'];
		expect(graph[3]).toMatchObject({
			'@type': 'TechArticle',
			headline: 'Core',
			description: 'Domain models',
			url
		});
		expect(graph[4].itemListElement).toEqual([
			{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://s-m-r-t.dev' },
			{ '@type': 'ListItem', position: 2, name: 'Docs', item: 'https://s-m-r-t.dev/docs' },
			{
				'@type': 'ListItem',
				position: 3,
				name: 'Reference',
				item: 'https://s-m-r-t.dev/docs/reference'
			},
			{
				'@type': 'ListItem',
				position: 4,
				name: 'Packages',
				item: 'https://s-m-r-t.dev/docs/reference/packages'
			},
			{ '@type': 'ListItem', position: 5, name: 'Core', item: url }
		]);
	});
	it('escapes script injection and HTML delimiters without changing JSON values', () => {
		const title = '</script><script>alert("x")</script> & >';
		const value = structuredData(title, title, 'https://s-m-r-t.dev/docs/reference/security');
		const serialized = serializeJsonLd(value);
		expect(serialized).not.toMatch(/[<>&]/);
		expect(serialized).toContain('\\u003c/script\\u003e');
		expect(JSON.parse(serialized)).toEqual(value);
	});
	it('does not label interactive tools or lookalike paths as articles', () => {
		for (const path of [
			'/',
			'/playground',
			'/build-a-boilerplate',
			'/docs/reference-other',
			// Pre-#365 paths are redirects now, never articles.
			'/reference/security'
		])
			expect(isDocPath(path)).toBe(false);
		for (const path of [
			'/docs/reference',
			'/docs/foundations/models',
			'/docs/guides/first-app',
			'/docs/getting-started/smrt-start'
		])
			expect(isDocPath(path)).toBe(true);
	});
});
