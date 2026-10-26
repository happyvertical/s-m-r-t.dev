#!/usr/bin/env node
/** Check the production artifact without JavaScript; --origin also verifies HTTP MIME/status. */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function checkMetadata(html, pathname) {
	const scripts = [
		...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)
	];
	assert.equal(scripts.length, 1, `${pathname}: expected one JSON-LD graph`);
	assert(!/[<>&]/.test(scripts[0][1]), `${pathname}: unescaped JSON-LD delimiter`);
	const graph = JSON.parse(scripts[0][1])['@graph'];
	for (const type of ['WebSite', 'Organization', 'SoftwareSourceCode']) {
		assert(
			graph.some((node) => node['@type'] === type),
			`${pathname}: missing ${type}`
		);
	}
	if (/^\/(foundations|capabilities|guides|tooling|reference|starters)(\/|$)/.test(pathname)) {
		for (const type of ['TechArticle', 'BreadcrumbList']) {
			assert(
				graph.some((node) => node['@type'] === type),
				`${pathname}: missing ${type}`
			);
		}
	}
	assert(
		/<link\b(?=[^>]*rel="alternate")(?=[^>]*type="text\/plain")(?=[^>]*href="\/llms.txt")[^>]*>/.test(
			html
		),
		`${pathname}: missing discovery link`
	);
	assert(/<h1[\s>]/.test(html), `${pathname}: no server-rendered heading`);
}

async function main() {
	const originIndex = process.argv.indexOf('--origin');
	const origin = originIndex < 0 ? null : process.argv[originIndex + 1];
	if (originIndex >= 0)
		assert(origin && /^https?:\/\//.test(origin), '--origin requires an HTTP(S) URL');
	async function read(path, mime) {
		if (!origin) return readFile(resolve('build', path.slice(1)), 'utf8');
		const response = await fetch(new URL(path, origin), {
			signal: AbortSignal.timeout(30000),
			redirect: 'error'
		});
		assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
		assert(
			response.headers.get('content-type')?.toLowerCase().startsWith(mime),
			`${path}: expected ${mime}, got ${response.headers.get('content-type')}`
		);
		return response.text();
	}
	const sitemap = await read('/sitemap.xml', 'application/xml');
	const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
		(match) => new URL(match[1]).pathname
	);
	assert(paths.length > 0, 'empty sitemap');
	for (const path of ['/llms.txt', '/llms-full.txt']) {
		assert((await read(path, 'text/plain')).length > 100, `${path}: empty text`);
	}
	// Every advertised Markdown URL must work, including on the actual static host.
	for (let offset = 0; offset < paths.length; offset += 12) {
		await Promise.all(
			paths.slice(offset, offset + 12).map(async (path) => {
				const md = path === '/' ? '/index.md' : `${path}.md`;
				assert((await read(md, 'text/markdown')).length > 50, `${md}: empty Markdown`);
			})
		);
	}
	const samples = origin
		? [
				'/',
				'/docs/reference/security',
				'/docs/tooling/app-mcp',
				'/docs/capabilities/agent-legible-applications'
			]
		: paths;
	for (const path of samples) {
		const file = origin ? path : path === '/' ? '/index.html' : `${path}.html`;
		checkMetadata(await read(file, 'text/html'), path);
	}
	console.log(
		`agent metadata: ${paths.length} Markdown files, both text indexes, ${samples.length} no-JS HTML pages passed${origin ? ` at ${origin}` : ''}.`
	);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
	await main();
