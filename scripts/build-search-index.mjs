#!/usr/bin/env node
/**
 * Build a static search index for the global ⌘K command palette (issue #99).
 *
 * Scans every `src/routes/**\/+page.svelte`, derives its route URL, and pulls
 * out the page title plus its H2/H3 headings (with their `id` anchors so the
 * palette can deep-link to a section). The result is written to
 * `static/search-index.json`, which `CommandPalette.svelte` fetches once and
 * filters entirely client-side.
 *
 * This runs as part of `npm run build` (and `prepare`) so the index is always
 * in lockstep with the pages on disk — no hand-maintained list to drift.
 *
 * Dynamic routes (`[...slug]`, `[category]`) are skipped: their concrete URLs
 * aren't knowable from the `.svelte` source alone. The static pages that back
 * the docs/modules/components/reference sections are all real files, so the
 * index still covers every section named in the acceptance criteria.
 */

import { glob } from 'glob';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const OUTPUT = join(projectRoot, 'static', 'search-index.json');

/** Strip HTML tags and collapse whitespace/entities into a clean label. */
function cleanText(raw) {
	return raw
		.replace(/<[^>]+>/g, '') // drop nested tags (<code>, <strong>, …)
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\{'\{'\}/g, '{') // un-escape the Svelte brace guard
		.replace(/\{'\}'\}/g, '}')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Map a `+page.svelte` file path to its public route URL. */
function fileToRoute(file) {
	// file is e.g. "src/routes/docs/objects/+page.svelte"
	let route = file
		.replace(/^src\/routes/, '')
		.replace(/\/\+page\.svelte$/, '');
	// Drop SvelteKit group folders like (marketing).
	route = route.replace(/\/\([^)]+\)/g, '');
	if (route === '') route = '/';
	return route;
}

/** Top-level section label used for grouping/filtering in the palette. */
function sectionFor(route) {
	if (route === '/') return 'Home';
	const top = route.split('/')[1];
	switch (top) {
		case 'docs':
			return 'Docs';
		case 'modules':
			return 'Modules';
		case 'components':
			return 'Components';
		case 'reference':
			return 'Reference';
		case 'themes':
			return 'Themes';
		case 'faq':
			return 'FAQ';
		default:
			return 'Pages';
	}
}

/**
 * Extract the page title. Priority:
 *   1. <ModulePage name="..."> → "@happyvertical/<name>"
 *   2. <svelte:head><title>...</title>
 *   3. first <h1>...</h1>
 */
function extractTitle(content, route) {
	const modName = content.match(/<ModulePage[^>]*\bname=["']([^"']+)["']/s);
	if (modName) return `@happyvertical/${modName[1]}`;

	const head = content.match(/<title>([\s\S]*?)<\/title>/);
	if (head) {
		// Titles are often "Foo | s-m-r-t" — keep the meaningful left side.
		const t = cleanText(head[1]).split('|')[0].trim();
		if (t) return t;
	}

	const h1 = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
	if (h1) {
		const t = cleanText(h1[1]);
		if (t) return t;
	}

	// Fallback: last path segment, title-cased.
	const seg = route.split('/').filter(Boolean).pop() || 'Home';
	return seg.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Extract a short description from <ModulePage description> or <meta description>. */
function extractDescription(content) {
	const modDesc = content.match(/<ModulePage[^>]*\bdescription=["']([^"']+)["']/s);
	if (modDesc) return cleanText(modDesc[1]);
	const meta = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/);
	if (meta) return cleanText(meta[1]);
	return '';
}

/**
 * Extract H2/H3 headings as { text, id } pairs. The `id` is taken from an
 * explicit `id="..."` attribute when present (so we can build a #anchor),
 * otherwise it's slugified from the heading text — matching what most static
 * site generators do, and harmless when the page has no matching anchor.
 */
function extractHeadings(content) {
	const headings = [];
	const re = /<(h2|h3)\b([^>]*)>([\s\S]*?)<\/\1>/g;
	let m;
	while ((m = re.exec(content)) !== null) {
		const attrs = m[2];
		const text = cleanText(m[3]);
		if (!text) continue;
		const idMatch = attrs.match(/\bid=["']([^"']+)["']/);
		const id = idMatch
			? idMatch[1]
			: text
					.toLowerCase()
					.replace(/[^a-z0-9]+/g, '-')
					.replace(/^-+|-+$/g, '');
		headings.push({ text, id, level: m[1] === 'h2' ? 2 : 3 });
	}
	return headings;
}

async function build() {
	const files = (await glob('src/routes/**/+page.svelte', { cwd: projectRoot })).sort();
	const entries = [];

	for (const file of files) {
		// Skip dynamic routes — their concrete URLs aren't derivable here.
		if (file.includes('[') && file.includes(']')) continue;

		const content = readFileSync(join(projectRoot, file), 'utf-8');
		const route = fileToRoute(file);

		// Skip content-less redirect stubs (e.g. `/` just redirects to /docs):
		// no title source and no headings means nothing useful to surface.
		const hasTitleSource =
			/<ModulePage[^>]*\bname=/.test(content) ||
			/<title>/.test(content) ||
			/<h1\b/.test(content);
		const headings = extractHeadings(content);
		if (!hasTitleSource && headings.length === 0) continue;

		const title = extractTitle(content, route);
		const description = extractDescription(content);

		entries.push({
			title,
			route,
			section: sectionFor(route),
			description,
			headings
		});
	}

	mkdirSync(dirname(OUTPUT), { recursive: true });
	const payload = {
		generatedAt: new Date().toISOString(),
		count: entries.length,
		entries
	};
	writeFileSync(OUTPUT, JSON.stringify(payload));

	const headingCount = entries.reduce((n, e) => n + e.headings.length, 0);
	console.log(
		`✅ search index: ${entries.length} pages, ${headingCount} headings → static/search-index.json`
	);
}

build().catch((err) => {
	console.error('❌ Failed to build search index:', err);
	process.exit(1);
});
