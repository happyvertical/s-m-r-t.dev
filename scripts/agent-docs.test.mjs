// @vitest-environment node
import { test, onTestFinished } from 'vitest';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { markdown, collectPages, generate } from './generate-agent-docs.mjs';

const html = (route, content = '<h1>Title</h1><p>Actual content.</p>') =>
	`<title>Exact &amp; title</title><meta name="description" content="Exact &amp; description"><link rel="canonical" href="https://s-m-r-t.dev${route}"><nav>Site navigation</nav><main id="main-content">${content}</main>`;
async function fixture(routes = ['/']) {
	const directory = await mkdtemp(path.join(os.tmpdir(), 'agent-docs-'));
	onTestFinished(() => rm(directory, { recursive: true, force: true }));
	for (const route of routes) {
		const file = path.join(directory, route === '/' ? 'index.html' : route.slice(1) + '.html');
		await mkdir(path.dirname(file), { recursive: true });
		await writeFile(file, html(route));
	}
	await writeFile(
		path.join(directory, 'sitemap.xml'),
		`<urlset>${routes.map((route) => `<url><loc>https://s-m-r-t.dev${route}</loc></url>`).join('')}</urlset>`
	);
	return directory;
}

test('semantic Markdown preserves code, tables, links, escaping and excludes executable/chrome content', () => {
	const document = new JSDOM(
		`<main><h1>A * title</h1><nav>Excluded nav</nav><script>excluded()</script><style>excluded{}</style><p>A [literal] <a href="child">link</a> and <code>{ x: 1 }</code></p><pre><code class="language-ts">const x = { value: &#96;ok&#96; };\n\nnext();</code></pre><table><tr><th>Key</th><th>Value</th></tr><tr><td>a|b</td><td>c</td></tr></table></main>`
	).window.document;
	const result = markdown(document.querySelector('main'), 'https://s-m-r-t.dev/reference/parent');
	assert.match(result, /# A \\\* title/);
	assert.match(result, /A \\\[literal\\\]/);
	assert.match(result, /\[link\]\(<https:\/\/s-m-r-t.dev\/reference\/child>\)/);
	assert.match(result, /` \{ x: 1 \} `/);
	assert.match(result, /```ts\nconst x = \{ value: `ok` \};\n\nnext\(\);\n```/);
	assert.match(result, /\| a\\\|b \| c \|/);
	assert.doesNotMatch(result, /Excluded|excluded/);
});

test('all canonical pages match sitemap and exact decoded metadata', async () => {
	const directory = await fixture(['/', '/reference/api']);
	await writeFile(
		path.join(directory, 'old.html'),
		'<meta http-equiv="refresh" content="0;url=/">'
	);
	const pages = await collectPages(directory);
	assert.equal(pages.length, 2);
	assert.equal(pages[0].title, 'Exact & title');
	assert.equal(pages[0].description, 'Exact & description');
});

for (const [name, mutate, error] of [
	[
		'missing rendered route',
		(directory) => rm(path.join(directory, 'index.html')),
		/coverage mismatch/
	],
	[
		'missing metadata',
		(directory) =>
			writeFile(
				path.join(directory, 'index.html'),
				html('/').replace('<meta name="description" content="Exact &amp; description">', '')
			),
		/Missing canonical\/title\/description/
	],
	[
		'unlisted rendered route',
		(directory) => writeFile(path.join(directory, 'extra.html'), html('/extra')),
		/unlisted HTML \[\/extra\]/
	],
	[
		'wrong canonical',
		(directory) => writeFile(path.join(directory, 'index.html'), html('/wrong')),
		/does not match built route/
	],
	[
		'missing main',
		(directory) =>
			writeFile(path.join(directory, 'index.html'), html('/').replace(/<main.*<\/main>/, '')),
		/Missing main/
	]
])
	test(`rejects ${name}`, async () => {
		const directory = await fixture();
		await mutate(directory);
		await assert.rejects(collectPages(directory), error);
	});

test('generates complete artifacts, preserves prose, includes full curated text and rejects stale output', async () => {
	const routes = [
		'/',
		'/reference/api',
		'/reference/packages',
		'/reference/components',
		'/reference/faq',
		'/reference/packages/example',
		'/reference/components/example'
	];
	const directory = await fixture(routes);
	const source = path.join(directory, 'source.txt');
	const prefix = '# Site\n\n> Summary verbatim.\n\n';
	const suffix =
		'## Released boundaries\n\nPolicy verbatim.\n\n## Runtime provenance\n\nProvenance verbatim.\n';
	await writeFile(
		source,
		`${prefix}## Canonical technical documentation\n\n- https://s-m-r-t.dev/ — old\n\n${suffix}`
	);
	assert.deepEqual(await generate(directory, false, source), { pages: 7, artifacts: 9 });
	await generate(directory, true, source);
	const index = await readFile(path.join(directory, 'llms.txt'), 'utf8');
	assert.ok(index.startsWith(prefix));
	assert.ok(index.endsWith(suffix));
	assert.match(index, /## Packages/);
	assert.match(index, /## Components/);
	assert.match(index, /https:\/\/happyvertical.com\/llms.txt/);
	assert.match(index, /`\/index.md`/);
	for (const route of routes) assert.ok(index.includes(`https://s-m-r-t.dev${route}`));
	const full = await readFile(path.join(directory, 'llms-full.txt'), 'utf8');
	assert.equal((full.match(/Actual content\./g) || []).length, 5);
	await writeFile(path.join(directory, 'index.md'), 'stale');
	await assert.rejects(generate(directory, true, source), /stale agent artifact: index.md/);
});

test('hidden documentation is retained and literal code placeholder names cannot collide', () => {
	const document = new JSDOM(
		'<main><p>AGENTCODEBLOCK0END</p><section hidden><h2>REST</h2><p>Hidden static documentation.</p></section><pre><code>  {\n    nested: true\n  }\n\n\nnext();</code></pre></main>'
	).window.document;
	const result = markdown(document.querySelector('main'));
	assert.match(result, /AGENTCODEBLOCK0END/);
	assert.match(result, /## REST\n\nHidden static documentation\./);
	assert.match(result, /```\n {2}\{\n {4}nested: true\n {2}\}\n\n\nnext\(\);\n```/);
});
