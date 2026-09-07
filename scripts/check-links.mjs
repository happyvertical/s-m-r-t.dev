#!/usr/bin/env node
/**
 * Build-output link sweep for the site's information architecture (#187 S4).
 *
 * Runs after `vite build` against the emitted `build/**\/*.html` files (not
 * source), so it sees exactly what ships: it parses every `<a href>`,
 * `<link rel="canonical">`, and `<meta http-equiv="refresh">` in the built
 * HTML, resolves them against the set of files the build actually emitted,
 * and reports:
 *
 *   1. broken internal links (an `<a href>` that resolves to nothing built)
 *   2. redirect chains (a redirect page whose target is itself a redirect)
 *   3. pages whose canonical URL is not their own URL, including a missing
 *      `<link rel="canonical">` altogether (reported as "no canonical")
 *   4. sitemap.xml URLs that don't resolve to a built, non-redirect page
 *   5. non-redirect pages missing from sitemap.xml
 *
 * Wired as `pnpm run check:links` and into the `build` job in
 * `.github/workflows/build-deploy.yaml`, right after `vite build`.
 *
 * --- Allowlists (#187) ---
 *
 * Both allowlists below are empty (match nothing) rather than removed
 * outright, keeping checks 3 and 5's allowlisted-count reporting intact at
 * zero.
 *
 * CANONICAL_ALLOWLIST previously carved out `/packages`, every
 * `/packages/<slug>` (61), and `/faq` (63 paths) pending Agent B's S3 (PR 2,
 * #187) turning them into prerendered redirects to `/reference/...`. S3 has
 * now done that, so those paths are redirects, not content pages, and no
 * longer match check 3 (a redirect page has no canonical tag of its own to
 * disagree with) — the allowlist is emptied.
 *
 * SITEMAP_ALLOWLIST previously carved out `/reference/*` (350 paths) pending
 * Agent B's S2 (PR 1, #187) adding them to the sitemap. S2 has now added
 * them, so the allowlist is emptied.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DIR = path.join(PROJECT_ROOT, 'build');
const SITE_ORIGIN = 'https://s-m-r-t.dev';

// See the allowlist note above. Both are empty: no allowlists remain.
const CANONICAL_ALLOWLIST = /(?!)/; // #187 S3: /packages* and /faq are now redirects; nothing to allow.
const SITEMAP_ALLOWLIST = /(?!)/; // #187 S2: /reference/* is now in the sitemap; nothing to allow.

function htmlFileToPath(file) {
	const relative = path.relative(BUILD_DIR, file).split(path.sep).join('/');
	if (relative === 'index.html') return '/';
	return `/${relative.replace(/\.html$/, '')}`;
}

function stripQueryAndHash(href) {
	return href.split('#')[0].split('?')[0];
}

function isInternalPath(href) {
	return href.startsWith('/') && !href.startsWith('//');
}

async function main() {
	const htmlFiles = (await glob('**/*.html', { cwd: BUILD_DIR, absolute: true })).sort();
	if (htmlFiles.length === 0) {
		console.error('check-links: no build/**/*.html found — run `vite build` first.');
		process.exit(1);
	}

	/** @type {Map<string, { file: string, html: string, isRedirect: boolean, target?: string }>} */
	const pages = new Map();

	for (const file of htmlFiles) {
		const ownPath = htmlFileToPath(file);
		const html = await readFile(file, 'utf-8');
		const refreshMatch = html.match(/<meta http-equiv="refresh" content="0;url=([^"]+)"/);
		pages.set(ownPath, {
			file,
			html,
			isRedirect: !!refreshMatch,
			target: refreshMatch ? refreshMatch[1] : undefined
		});
	}

	const brokenLinks = [];
	const chains = [];
	const canonicalMismatches = [];
	const canonicalAllowlisted = [];

	for (const [ownPath, page] of pages) {
		// 1. <a href="...">
		for (const match of page.html.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
			const href = stripQueryAndHash(match[1]);
			if (!isInternalPath(href) || href.startsWith('/#')) continue;
			if (href === '/' || href.startsWith('/#')) continue;
			const target = href.replace(/\/$/, '') || '/';
			if (!pages.has(target)) {
				brokenLinks.push({ from: ownPath, href: match[1] });
			}
		}

		// 2. redirect chains
		if (page.isRedirect) {
			const target = stripQueryAndHash(page.target ?? '');
			const destination = pages.get(target);
			if (!destination) {
				brokenLinks.push({ from: ownPath, href: page.target ?? '(missing target)' });
			} else if (destination.isRedirect) {
				chains.push({ from: ownPath, to: target, thenTo: destination.target });
			}
		}

		// 3. canonical == own URL (and every content page must emit one at all)
		if (!page.isRedirect) {
			const canonicalMatch = page.html.match(/<link rel="canonical" href="([^"]+)"/);
			const expected = `${SITE_ORIGIN}${ownPath === '/' ? '' : ownPath}`;
			if (!canonicalMatch) {
				if (CANONICAL_ALLOWLIST.test(ownPath)) {
					canonicalAllowlisted.push(ownPath);
				} else {
					canonicalMismatches.push({ path: ownPath, canonical: 'no canonical', expected });
				}
			} else if (canonicalMatch[1] !== expected) {
				if (CANONICAL_ALLOWLIST.test(ownPath)) {
					canonicalAllowlisted.push(ownPath);
				} else {
					canonicalMismatches.push({ path: ownPath, canonical: canonicalMatch[1], expected });
				}
			}
		}
	}

	// 4 & 5. sitemap coverage
	const sitemapXml = await readFile(path.join(BUILD_DIR, 'sitemap.xml'), 'utf-8');
	const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
		(m) => m[1].replace(SITE_ORIGIN, '') || '/'
	);
	const sitemapSet = new Set(sitemapPaths);

	const sitemapUnresolvable = sitemapPaths.filter((p) => {
		const page = pages.get(p);
		return !page || page.isRedirect;
	});

	const missingFromSitemap = [];
	const sitemapAllowlisted = [];
	for (const [ownPath, page] of pages) {
		if (page.isRedirect) continue;
		if (sitemapSet.has(ownPath)) continue;
		if (SITEMAP_ALLOWLIST.test(ownPath)) {
			sitemapAllowlisted.push(ownPath);
		} else {
			missingFromSitemap.push(ownPath);
		}
	}

	console.log(`check-links: swept ${pages.size} built pages.`);
	console.log(`  broken links:            ${brokenLinks.length}`);
	console.log(`  redirect chains:         ${chains.length}`);
	console.log(
		`  canonical != own URL:    ${canonicalMismatches.length} (+ ${canonicalAllowlisted.length} allowlisted)`
	);
	console.log(`  sitemap URLs unresolvable: ${sitemapUnresolvable.length}`);
	console.log(
		`  non-redirect pages missing from sitemap: ${missingFromSitemap.length} (+ ${sitemapAllowlisted.length} allowlisted)`
	);

	let failed = false;
	const report = (label, items, render) => {
		if (items.length === 0) return;
		failed = true;
		console.error(`\n${label} (${items.length}):`);
		for (const item of items.slice(0, 50)) console.error(`  ${render(item)}`);
		if (items.length > 50) console.error(`  ... and ${items.length - 50} more`);
	};

	report('Broken internal links', brokenLinks, (i) => `${i.from} -> ${i.href}`);
	report('Redirect chains', chains, (i) => `${i.from} -> ${i.to} -> ${i.thenTo}`);
	report(
		'Canonical != own URL',
		canonicalMismatches,
		(i) => `${i.path}: canonical="${i.canonical}" expected="${i.expected}"`
	);
	report(
		'Sitemap URLs that do not resolve to a built, non-redirect page',
		sitemapUnresolvable,
		(i) => i
	);
	report('Non-redirect pages missing from sitemap.xml', missingFromSitemap, (i) => i);

	if (failed) {
		console.error('\ncheck-links: FAILED');
		process.exit(1);
	}
	console.log('\ncheck-links: OK');
}

await main();
