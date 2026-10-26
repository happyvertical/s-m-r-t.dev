import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const origin = 'https://s-m-r-t.dev';
const sourcePath = fileURLToPath(new URL('./agent-docs/source.txt', import.meta.url));
const escape = (value) => value.replace(/([\\`*_[\]<>|])/g, '\\$1');
const clean = (value) => value.replace(/\s+/g, ' ').trim();

export function markdown(element, baseUrl = origin) {
	const blocks = [];
	let token = 'AGENTCODEBLOCK';
	while (element.textContent.includes(token)) token += 'X';
	function render(node) {
		if (node.nodeType === 3) return escape(node.textContent.replace(/\s+/g, ' '));
		if (node.nodeType !== 1) return '';
		const tag = node.tagName.toLowerCase();
		if (
			['script', 'style', 'nav', 'noscript', 'button'].includes(tag) ||
			node.getAttribute('aria-hidden') === 'true'
		)
			return '';
		const children = () => [...node.childNodes].map(render).join('');
		if (tag === 'pre') {
			const code = node.querySelector('code');
			const text = (code || node).textContent.replace(/\n$/, '');
			const fence = '`'.repeat(
				Math.max(3, ...[...text.matchAll(/`+/g)].map((match) => match[0].length + 1))
			);
			const language = code?.className.match(/language-([\w-]+)/)?.[1] || '';
			blocks.push(`${fence}${language}\n${text}\n${fence}`);
			return `\n\n${token}${blocks.length - 1}END\n\n`;
		}
		if (tag === 'code') {
			const text = node.textContent;
			const fence = '`'.repeat(
				Math.max(1, ...[...text.matchAll(/`+/g)].map((match) => match[0].length + 1))
			);
			return `${fence} ${text} ${fence}`;
		}
		if (/^h[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${children().trim()}\n\n`;
		if (tag === 'a') {
			const href = node.getAttribute('href');
			return href ? `[${children().trim()}](<${new URL(href, baseUrl).href}>)` : children();
		}
		if (tag === 'img') return node.alt ? escape(node.alt) : '';
		if (tag === 'br') return '\n';
		if (tag === 'li') {
			const prefix =
				node.parentElement?.tagName === 'OL'
					? `${[...node.parentElement.children].indexOf(node) + Number(node.parentElement.getAttribute('start') || 1)}.`
					: '-';
			return `\n${prefix} ${children().trim()}\n`;
		}
		if (tag === 'table') {
			const rows = [...node.querySelectorAll('tr')].map((row) =>
				[...row.children].map((cell) => render(cell).trim().replace(/\n+/g, ' '))
			);
			if (!rows.length) return '';
			return `\n\n| ${rows[0].join(' | ')} |\n| ${rows[0].map(() => '---').join(' | ')} |\n${rows
				.slice(1)
				.map((row) => `| ${row.join(' | ')} |`)
				.join('\n')}\n\n`;
		}
		if (tag === 'strong' || tag === 'b') return `**${children()}**`;
		if (tag === 'em' || tag === 'i') return `*${children()}*`;
		const text = children();
		return [
			'p',
			'div',
			'section',
			'article',
			'ul',
			'ol',
			'dl',
			'dt',
			'dd',
			'blockquote',
			'details',
			'summary'
		].includes(tag)
			? `\n\n${text.trim()}\n\n`
			: text;
	}
	return render(element)
		.replace(/\n[ \t]+/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
		.replace(new RegExp(`${token}(\\d+)END`, 'g'), (_, index) => blocks[Number(index)]);
}

async function files(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	return (
		await Promise.all(
			entries.map((entry) =>
				entry.isDirectory()
					? files(path.join(directory, entry.name))
					: path.join(directory, entry.name)
			)
		)
	).flat();
}

export async function collectPages(directory) {
	const pages = [];
	for (const file of (await files(directory)).filter((file) => file.endsWith('.html')).sort()) {
		const dom = new JSDOM(await readFile(file, 'utf8'));
		const document = dom.window.document;
		if (document.querySelector('meta[http-equiv="refresh" i]')) {
			dom.window.close();
			continue;
		}
		const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
		const title = clean(document.title);
		const description = clean(
			document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
		);
		if (!canonical || !title || !description)
			throw new Error(`Missing canonical/title/description: ${file}`);
		const url = new URL(canonical);
		const route = url.pathname === '/' ? '/' : url.pathname.replace(/\/$/, '');
		if (url.origin !== origin || url.search || url.hash)
			throw new Error(`Invalid canonical: ${canonical}`);
		const relative = path.relative(directory, file).replaceAll(path.sep, '/');
		const builtRoute = '/' + relative.replace(/(?:\/index)?\.html$/, '').replace(/^index$/, '');
		if (route !== builtRoute)
			throw new Error(`Canonical does not match built route: ${file}: ${route}`);
		if (pages.some((page) => page.route === route))
			throw new Error(`Duplicate canonical: ${route}`);
		const content = document.querySelector('#main-content') || document.querySelector('main');
		if (!content) throw new Error(`Missing main content: ${route}`);
		const body = markdown(content, canonical);
		if (!body) throw new Error(`Empty main content: ${route}`);
		pages.push({ route, title, description, body });
		dom.window.close();
	}
	const sitemap = new JSDOM(await readFile(path.join(directory, 'sitemap.xml'), 'utf8'), {
		contentType: 'application/xml'
	});
	const routes = [...sitemap.window.document.querySelectorAll('loc')].map((loc) => {
		const url = new URL(loc.textContent);
		if (url.origin !== origin) throw new Error(`Foreign sitemap URL: ${url.href}`);
		return url.pathname.replace(/\/$/, '') || '/';
	});
	sitemap.window.close();
	if (routes.length !== new Set(routes).size) throw new Error('Duplicate sitemap URL');
	const built = new Set(pages.map((page) => page.route));
	const listed = new Set(routes);
	const missing = routes.filter((route) => !built.has(route));
	const unlisted = pages.filter((page) => !listed.has(page.route)).map((page) => page.route);
	if (missing.length || unlisted.length)
		throw new Error(
			`Sitemap coverage mismatch: missing HTML [${missing}], unlisted HTML [${unlisted}]`
		);
	return pages;
}

export async function generate(directory = 'build', check = false, source = sourcePath) {
	const pages = await collectPages(directory);
	const prose = await readFile(source, 'utf8');
	const start = prose.indexOf('## Canonical technical documentation');
	const end = prose.indexOf('## Released boundaries');
	if (start < 0 || end < 0) throw new Error('Missing source prose boundaries');
	const curated = [...prose.slice(start, end).matchAll(/https:\/\/s-m-r-t\.dev([^\s]*)/g)].map(
		(match) => match[1] || '/'
	);
	curated.push('/reference/api', '/reference/packages', '/reference/components', '/reference/faq');
	const selected = [...new Set(curated)].map((route) => {
		const page = pages.find((page) => page.route === route);
		if (!page) throw new Error(`Missing curated page: ${route}`);
		return page;
	});
	const sections = new Map(
		[
			'Stack overview',
			'Blocks',
			'Foundations',
			'Capabilities',
			'Guides',
			'Tooling',
			'Reference',
			'Packages',
			'Components'
		].map((section) => [section, []])
	);
	for (const page of pages) {
		const family = page.route.split('/')[1];
		const section = page.route.startsWith('/reference/packages/')
			? 'Packages'
			: page.route.startsWith('/reference/components/')
				? 'Components'
				: ['blocks', 'foundations', 'capabilities', 'guides', 'tooling', 'reference'].includes(
							family
					  )
					? family[0].toUpperCase() + family.slice(1)
					: 'Stack overview';
		if (!sections.has(section)) sections.set(section, []);
		sections.get(section).push(page);
	}
	const directoryText = [...sections]
		.filter(([, entries]) => entries.length)
		.map(
			([section, entries]) =>
				`## ${section[0].toUpperCase() + section.slice(1)}\n\n${entries.map((page) => `- [${escape(page.title)}](${origin}${page.route}): ${page.description}`).join('\n')}`
		)
		.join('\n\n');
	const context = prose.slice(0, start) + prose.slice(end);
	const artifacts = new Map([
		[
			'llms.txt',
			prose.slice(0, start) +
				'## Reading this documentation\n\nUse [llms-full.txt](https://s-m-r-t.dev/llms-full.txt) for curated full-page context. Every canonical page has a Markdown copy at its path plus `.md` (for example `/reference/api.md`); the homepage is `/index.md`. Project inquiries: [HappyVertical](https://happyvertical.com/llms.txt).\n\n' +
				directoryText +
				'\n\n' +
				prose.slice(end)
		],
		[
			'llms-full.txt',
			context +
				'\n' +
				selected
					.map((page) => `<!-- Source: ${origin}${page.route} -->\n\n${page.body}`)
					.join('\n\n---\n\n') +
				'\n'
		]
	]);
	for (const page of pages)
		artifacts.set(
			page.route === '/' ? 'index.md' : page.route.slice(1) + '.md',
			`<!-- Source: ${origin}${page.route} -->\n\n${page.body}\n`
		);
	for (const [relative, text] of artifacts) {
		const file = path.join(directory, relative);
		if (check) {
			if ((await readFile(file, 'utf8').catch(() => null)) !== text)
				throw new Error(`Missing or stale agent artifact: ${relative}`);
		} else {
			await mkdir(path.dirname(file), { recursive: true });
			await writeFile(file, text);
		}
	}
	return { pages: pages.length, artifacts: artifacts.size };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const result = await generate('build', process.argv.includes('--check'));
	console.log(
		`Agent documentation: ${result.pages} canonical pages, ${result.artifacts} artifacts verified${process.argv.includes('--check') ? '' : ' and generated'}.`
	);
}
