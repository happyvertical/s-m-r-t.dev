import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { checkMetadata } from './check-agent-metadata.mjs';
import { serializeJsonLd, structuredData } from '../src/lib/seo/structured-data';

describe('agent static hosting', () => {
	// The viewer-request function tofu deploys to both distributions.
	const rewrite = (request: object) =>
		runInNewContext(
			`${readFileSync('infra/modules/havesmrt/url-rewrite.js', 'utf8')}\nhandler(${JSON.stringify({ request })})`
		);

	it('loads the CloudFront rewrite from the file main.tf deploys', () => {
		const terraform = readFileSync('infra/modules/havesmrt/main.tf', 'utf8');
		expect(terraform).toContain('code    = file("${path.module}/url-rewrite.js")');
	});
	it('preserves text and Markdown paths through the deployed CloudFront rewrite', () => {
		for (const path of [
			'/llms.txt',
			'/llms-full.txt',
			'/index.md',
			'/docs/reference/security.md'
		]) {
			expect(rewrite({ uri: path, querystring: {} }).uri).toBe(path);
		}
	});
	it('serves pages as <path>.html and the root as index.html', () => {
		expect(rewrite({ uri: '/', querystring: {} }).uri).toBe('/index.html');
		expect(rewrite({ uri: '/build-a-boilerplate', querystring: {} }).uri).toBe(
			'/build-a-boilerplate.html'
		);
	});
	it('301s a trailing slash to the page, keeping the query string (#339)', () => {
		const response = rewrite({
			uri: '/docs/getting-started/',
			querystring: {
				features: { value: 'chat,email' },
				x: { value: '', multiValue: [{ value: '1' }, { value: '2' }] },
				flag: { value: '' }
			}
		});
		expect(response.statusCode).toBe(301);
		expect(response.headers.location.value).toBe(
			'/docs/getting-started?features=chat,email&x=1&x=2&flag'
		);
		expect(rewrite({ uri: '//', querystring: {} }).headers.location.value).toBe('/');
		// Never a protocol-relative Location: //evil.com/ would leave the site.
		for (const uri of ['//evil.com/', '///evil.com//']) {
			expect(rewrite({ uri, querystring: {} }).headers.location.value).toBe('/evil.com');
		}
	});
	it('sets explicit text MIME types for both deployment buckets', () => {
		const workflow = readFileSync('.github/workflows/build-deploy.yaml', 'utf8');
		for (const bucket of ['havesmrt-staging', 'havesmrt-production']) {
			for (const [extension, mime] of [
				['txt', 'text/plain'],
				['md', 'text/markdown']
			]) {
				const line = workflow
					.split('\n')
					.find(
						(line) =>
							line.includes(`s3://${bucket}/`) && line.includes(`--include "*.${extension}"`)
					);
				expect(line).toContain(`--content-type "${mime}; charset=utf-8"`);
			}
		}
	});
	it('rejects missing, malformed and unsafe metadata in the real-output checker', () => {
		const graph = serializeJsonLd(
			structuredData('Security', 'Rules', 'https://s-m-r-t.dev/docs/reference/security')
		);
		const html = `<h1>Security</h1><link rel="alternate" type="text/plain" href="/llms.txt"><script type="application/ld+json">${graph}</script>`;
		expect(() => checkMetadata(html, '/docs/reference/security')).not.toThrow();
		expect(() =>
			checkMetadata(html.replace('application/ld+json', 'text/plain'), '/docs/reference/security')
		).toThrow();
		expect(() =>
			checkMetadata(html.replace(graph, '{oops}'), '/docs/reference/security')
		).toThrow();
		expect(() =>
			checkMetadata(html.replace('Rules', '<unsafe>'), '/docs/reference/security')
		).toThrow();
		expect(() =>
			checkMetadata(html.replace('rel="alternate"', 'rel="other"'), '/docs/reference/security')
		).toThrow();
	});
});
