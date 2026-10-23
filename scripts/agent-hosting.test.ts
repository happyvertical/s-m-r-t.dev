import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { checkMetadata } from './check-agent-metadata.mjs';
import { serializeJsonLd, structuredData } from '../src/lib/seo/structured-data';

describe('agent static hosting', () => {
	it('preserves text and Markdown paths through the deployed CloudFront rewrite', () => {
		const terraform = readFileSync('infra/modules/havesmrt/main.tf', 'utf8');
		const source = terraform.match(/code\s*=\s*<<-EOF\n([\s\S]*?)\n\s*EOF/)![1];
		for (const path of ['/llms.txt', '/llms-full.txt', '/index.md', '/reference/security.md']) {
			expect(
				runInNewContext(`${source}\nhandler({request: {uri: ${JSON.stringify(path)}}}).uri`)
			).toBe(path);
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
			structuredData('Security', 'Rules', 'https://s-m-r-t.dev/reference/security')
		);
		const html = `<h1>Security</h1><link rel="alternate" type="text/plain" href="/llms.txt"><script type="application/ld+json">${graph}</script>`;
		expect(() => checkMetadata(html, '/reference/security')).not.toThrow();
		expect(() =>
			checkMetadata(html.replace('application/ld+json', 'text/plain'), '/reference/security')
		).toThrow();
		expect(() => checkMetadata(html.replace(graph, '{oops}'), '/reference/security')).toThrow();
		expect(() => checkMetadata(html.replace('Rules', '<unsafe>'), '/reference/security')).toThrow();
		expect(() =>
			checkMetadata(html.replace('rel="alternate"', 'rel="other"'), '/reference/security')
		).toThrow();
	});
});
