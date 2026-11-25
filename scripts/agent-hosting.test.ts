import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { checkMetadata, checkNotFound } from './check-agent-metadata.mjs';
import { serializeJsonLd, structuredData } from '../src/lib/seo/structured-data';

describe('agent static hosting', () => {
	// The viewer-request function tofu deploys to both distributions.
	const rewrite = (request: object) =>
		runInNewContext(
			`${readFileSync('infra/modules/havesmrt/url-rewrite.js', 'utf8')}\nhandler(${JSON.stringify({ request })})`
		);

	it('loads the CloudFront rewrite from the file main.tf deploys', () => {
		const terraform = readFileSync('infra/modules/havesmrt/main.tf', 'utf8');
		expect(terraform).toContain('code    = local.url_rewrite_code');
		// Redirect off: the published function is the source file, unchanged.
		expect(terraform).toContain(') : file("${path.module}/url-rewrite.js")');
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
		// Backslashes read as slashes in a browser, so /\evil.com/ is no safer.
		for (const uri of ['/\\evil.com/', '\\\\evil.com/', '/\\/\\evil.com//']) {
			expect(rewrite({ uri, querystring: {} }).headers.location.value).toBe('/evil.com');
		}
		expect(rewrite({ uri: '/\\/', querystring: {} }).headers.location.value).toBe('/');
		expect(rewrite({ uri: '/a\\b/', querystring: {} }).headers.location.value).toBe('/a\\b');
	});
	// The published function when redirect_to_new_domain is on: url-rewrite.js
	// renamed to rewriteRequest, then moved-redirect.js with its placeholders
	// filled, composed the way main.tf's url_rewrite_code does.
	const rewriteSource = readFileSync('infra/modules/havesmrt/url-rewrite.js', 'utf8');
	const composed = (oldHost = 's-m-r-t.dev') =>
		[
			rewriteSource.replace('function handler(', 'function rewriteRequest('),
			readFileSync('infra/modules/havesmrt/moved-redirect.js', 'utf8')
				.replace('__OLD_HOST__', oldHost)
				.replace('__NEW_HOST__', 'smrt.happyvertical.com')
		].join('\n');
	const run = (uri: string, querystring: object = {}, host: string | null = 's-m-r-t.dev') =>
		runInNewContext(
			`${composed()}\nhandler(${JSON.stringify({
				request: { uri, querystring, headers: host === null ? {} : { host: { value: host } } }
			})})`
		);
	const moved = (uri: string, querystring?: object) => run(uri, querystring);
	const locationOf = (uri: string, querystring?: object) =>
		moved(uri, querystring).headers.location.value;

	it('wires the redirect from its source file with the hosts filled in', () => {
		const terraform = readFileSync('infra/modules/havesmrt/main.tf', 'utf8');
		expect(terraform).toContain('file("${path.module}/moved-redirect.js")');
		expect(terraform).toContain('"__OLD_HOST__", lower(local.site_domain)');
		expect(terraform).toContain('"__NEW_HOST__", lower(local.new_site_domain)');
		expect(terraform).toContain('"function handler(", "function rewriteRequest("');
		expect(rewriteSource.match(/function handler\(/g)).toHaveLength(1);
	});
	it('301s the old host to the same path on the new host in one hop', () => {
		const response = moved('/docs/getting-started');
		expect(response.statusCode).toBe(301);
		expect(response.headers.location.value).toBe(
			'https://smrt.happyvertical.com/docs/getting-started'
		);
		expect(response.headers['cache-control'].value).toBe('public, max-age=3600');
		expect(locationOf('/')).toBe('https://smrt.happyvertical.com/');
		expect(locationOf('/llms.txt')).toBe('https://smrt.happyvertical.com/llms.txt');
	});
	it('matches the old host exactly and case-insensitively, otherwise rewrites as before', () => {
		for (const host of ['S-M-R-T.DEV', 's-m-r-t.dev:443', 's-m-r-t.dev.', 's-m-r-t.dev.:443']) {
			expect(run('/docs/', {}, host).statusCode).toBe(301);
		}
		for (const host of [
			's-m-r-t.dev.evil.com',
			's-m-r-t.dev..',
			'evil.s-m-r-t.dev',
			'xs-m-r-t.dev',
			'smrt.happyvertical.com',
			'd111.cloudfront.net',
			's-m-r-t.dev@evil.com',
			's-m-r-t.dev:443@evil.com',
			''
		]) {
			expect(run('/docs', {}, host).uri).toBe('/docs.html');
			expect(run('/', {}, host).uri).toBe('/index.html');
		}
		expect(run('/docs', {}, null).uri).toBe('/docs.html');
		// The new host keeps today's trailing-slash behaviour.
		expect(run('/docs/', {}, 'smrt.happyvertical.com').headers.location.value).toBe('/docs');
	});
	it('keeps the staging twin separate from production', () => {
		const source = composed('staging.s-m-r-t.dev');
		const call = (host: string) =>
			runInNewContext(
				`${source}\nhandler(${JSON.stringify({ request: { uri: '/a', querystring: {}, headers: { host: { value: host } } } })})`
			);
		expect(call('staging.s-m-r-t.dev').statusCode).toBe(301);
		expect(call('s-m-r-t.dev').uri).toBe('/a.html');
	});
	it('strips a trailing slash so the new host does not 301 again', () => {
		expect(locationOf('/docs/')).toBe('https://smrt.happyvertical.com/docs');
		expect(locationOf('/docs/a/b//')).toBe('https://smrt.happyvertical.com/docs/a/b');
		expect(locationOf('//')).toBe('https://smrt.happyvertical.com/');
	});
	it('cannot be turned into an off-host redirect', () => {
		for (const uri of [
			'//evil.com/',
			'///evil.com//',
			'/\\evil.com',
			'\\\\evil.com/x',
			'/\\/evil.com',
			'/@evil.com',
			'@evil.com',
			'/.@evil.com/',
			'/%0d%0aLocation:%20https://evil.com'
		]) {
			const location = locationOf(uri);
			expect(location.startsWith('https://smrt.happyvertical.com/')).toBe(true);
			expect(new URL(location).host).toBe('smrt.happyvertical.com');
			expect(location).not.toMatch(/[\r\n]/);
		}
		expect(locationOf('//evil.com/')).toBe('https://smrt.happyvertical.com/evil.com');
		// Encoded slashes and CR/LF stay encoded, inside the path.
		expect(locationOf('/%2F%2Fevil.com')).toBe('https://smrt.happyvertical.com/%2F%2Fevil.com');
		expect(locationOf('/docs%2F')).toBe('https://smrt.happyvertical.com/docs%2F');
		expect(locationOf('/a%0d%0ab')).toBe('https://smrt.happyvertical.com/a%0d%0ab');
	});
	it('keeps the query string as received, including repeated and valueless keys', () => {
		expect(
			locationOf('/docs/', {
				features: { value: 'chat%2Cemail' },
				x: { value: '', multiValue: [{ value: '1' }, { value: '2' }] },
				flag: { value: '' },
				q: { value: 'a%20b%26c%0d%0a' }
			})
		).toBe(
			'https://smrt.happyvertical.com/docs?features=chat%2Cemail&x=1&x=2&flag&q=a%20b%26c%0d%0a'
		);
		// ?a=1&b=2&a=3: CloudFront groups the repeated key, so it is emitted together.
		expect(
			locationOf('/', {
				a: { value: '1', multiValue: [{ value: '1' }, { value: '3' }] },
				b: { value: '2' }
			})
		).toBe('https://smrt.happyvertical.com/?a=1&a=3&b=2');
		expect(locationOf('/', {})).toBe('https://smrt.happyvertical.com/');
	});
	it('handles very long paths', () => {
		const path = `/${'segment/'.repeat(500)}end/`;
		expect(locationOf(path)).toBe(`https://smrt.happyvertical.com${path.slice(0, -1)}`);
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
	it('checks the built 404 page and that the build emits it', () => {
		const page = `<meta name="robots" content="noindex"><h1>We couldn't find that page.</h1>`;
		expect(() => checkNotFound(page)).not.toThrow();
		expect(() => checkNotFound('<h1>Home</h1>')).toThrow();
		expect(() => checkNotFound(page.replace('noindex', 'index'))).toThrow();
		// The checker reads build/404.html in CI (local mode) and /404.html after deploy.
		expect(readFileSync('scripts/check-agent-metadata.mjs', 'utf8')).toContain(
			"checkNotFound(await read('/404.html', 'text/html'))"
		);
		expect(readFileSync('src/routes/404/+page.svelte', 'utf8')).toContain(
			'<ErrorPage status={404}'
		);
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
