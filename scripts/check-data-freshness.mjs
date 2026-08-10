#!/usr/bin/env node
/**
 * check-data-freshness — report when the site's `src/lib/data/*.ts` content has
 * fallen behind the `@happyvertical/smrt-*` packages it describes.
 *
 * Why this exists
 * ---------------
 * The site is data-driven: every package, guide, and reference page is an entry
 * in `src/lib/data/`, written by hand against the installed packages' own
 * `AGENTS.md` (see the repository guide, "Framework documentation"). Nothing
 * regenerates those entries, so when the framework moves the prose silently
 * stops being true. That is the failure this reports.
 *
 * It answers one question: **which packages have changed since a human last
 * verified the copy?** It records, per installed `@happyvertical/smrt-*`
 * package, the version and a hash of the `AGENTS.md` that ships inside it, and
 * compares that to a committed baseline. A changed hash means the authority for
 * that package's documentation was rewritten upstream; the site entries that
 * mention it are the ones worth re-reading.
 *
 * It deliberately does NOT judge the prose. There is no upstream tool that can:
 * `smrt dev:knowledge-check` indexes an smrt *workspace*, and pointed at this
 * consumer app it exhausts the Node heap — happyvertical/smrt#2275. Delete this
 * script when that lands. Until then, this is the deterministic subset that
 * works today.
 *
 * Usage:
 *   node scripts/check-data-freshness.mjs             # report drift (exit 1 if any)
 *   node scripts/check-data-freshness.mjs --update    # rewrite the baseline
 *   node scripts/check-data-freshness.mjs --quiet     # summary only, no report body
 *
 * Exit codes: 0 = no drift, 1 = drift found, 2 = the check could not run.
 */

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/** Committed record of what the data files were last verified against. */
export const BASELINE_PATH = join(ROOT, 'scripts', 'smrt-docs-baseline.json');

/** The hand-written content this check guards. */
const DATA_DIR = join(ROOT, 'src', 'lib', 'data');

const SCOPE = '@happyvertical';
const PREFIX = 'smrt-';

/**
 * The per-package file the site's prose is written against. Hashing it is what
 * makes "this package's documentation changed" a deterministic fact rather than
 * a version-number guess: a patch release that rewrites the guidance is caught,
 * and a version bump that does not touch it is not reported as content drift.
 */
const DOC_FILE = 'AGENTS.md';

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

/**
 * Read one candidate package directory.
 *
 * @param {string} dir directory holding a package.json
 * @returns {{ name: string, version: string, doc: string | null } | null}
 */
function readPackage(dir) {
	let manifest;
	try {
		manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
	} catch {
		return null;
	}
	if (typeof manifest.name !== 'string' || typeof manifest.version !== 'string') return null;
	const docPath = join(dir, DOC_FILE);
	return {
		name: manifest.name,
		version: manifest.version,
		doc: existsSync(docPath) ? sha256(readFileSync(docPath)) : null
	};
}

/**
 * Every `@happyvertical/smrt-*` package present in the installed tree, keyed by
 * package name.
 *
 * Both the hoisted links (`node_modules/@happyvertical/*`, direct dependencies
 * only) and the pnpm store (`node_modules/.pnpm/<id>/node_modules/@happyvertical/*`)
 * are walked, because the site documents packages it depends on transitively —
 * `smrt-core` and `smrt-scanner` have pages but are not listed in package.json.
 *
 * @param {string} root repository root
 * @returns {Record<string, { version: string, agentsMd: string | null }>}
 */
export function collectInstalled(root) {
	/** @type {Map<string, { version: string, agentsMd: string | null }>} */
	const packages = new Map();

	const scan = (scopeDir) => {
		if (!existsSync(scopeDir)) return;
		for (const entry of readdirSync(scopeDir)) {
			if (!entry.startsWith(PREFIX)) continue;
			const info = readPackage(join(scopeDir, entry));
			if (!info || info.name !== `${SCOPE}/${entry}`) continue;
			// pnpm materializes one copy per resolution id; identical copies are
			// expected, so first write wins and a genuine duplicate surfaces as a
			// version mismatch in the report rather than silently overwriting.
			const seen = packages.get(info.name);
			if (seen && seen.version !== info.version) {
				throw new Error(
					`${info.name} is installed at both ${seen.version} and ${info.version}. ` +
						'The dependency policy is that every smrt package sits on the same exact ' +
						'version; a split tree means duplicate ObjectRegistry singletons.'
				);
			}
			if (!seen) packages.set(info.name, { version: info.version, agentsMd: info.doc });
		}
	};

	scan(join(root, 'node_modules', SCOPE));
	const store = join(root, 'node_modules', '.pnpm');
	if (existsSync(store)) {
		for (const id of readdirSync(store)) scan(join(store, id, 'node_modules', SCOPE));
	}

	return Object.fromEntries([...packages].sort(([a], [b]) => a.localeCompare(b)));
}

/**
 * A package name at the start of a string literal — `'smrt-users'` as a
 * `definePackage` slug or a `packages: [...]` entry, and the code-example forms
 * `'@happyvertical/smrt-ui'`, `'@happyvertical/smrt-ui/forms'`, and
 * `'@happyvertical/smrt-content:Article'`.
 *
 * The opening quote is what keeps prose out. `smrt-knowledge.json` and
 * `no-smrt-objects-in-sources` sit mid-sentence inside longer strings in
 * tooling.ts, so neither can match. The trailing lookahead then rejects a slug
 * that is merely a prefix of a longer word.
 */
const PACKAGE_LITERAL = /(?:['"`])(?:@happyvertical\/)?(smrt-[a-z0-9]+(?:-[a-z0-9]+)*)(?=['"`/:])/g;

/**
 * Which data files name each package.
 *
 * This is the whole point of the report: a changed package is only actionable
 * if you know which entries describe it.
 *
 * @param {string} dataDir
 * @returns {Map<string, string[]>} slug (e.g. `smrt-users`) to sorted filenames
 */
export function collectReferences(dataDir) {
	/** @type {Map<string, Set<string>>} */
	const references = new Map();
	if (!existsSync(dataDir)) return new Map();

	for (const file of readdirSync(dataDir).sort()) {
		if (!file.endsWith('.ts') || file.endsWith('.test.ts')) continue;
		const source = readFileSync(join(dataDir, file), 'utf8');
		for (const [, slug] of source.matchAll(PACKAGE_LITERAL)) {
			if (!references.has(slug)) references.set(slug, new Set());
			references.get(slug).add(file);
		}
	}

	return new Map([...references].map(([slug, files]) => [slug, [...files].sort()]));
}

/**
 * Compare a baseline against the installed tree.
 *
 * Only a rewritten `AGENTS.md` counts as drift. The smrt packages release in
 * lockstep every few days and most releases do not touch a package's documented
 * surface, so treating a version bump as stale content would flag all 35 of them
 * every time and the report would be ignored within a month. Version moves are
 * still returned, for context next to a real change and for the summary line —
 * they just do not raise the alarm on their own.
 *
 * @param {Record<string, { version: string, agentsMd: string | null }>} baseline
 * @param {Record<string, { version: string, agentsMd: string | null }>} current
 */
export function diffPackages(baseline, current) {
	const added = [];
	const removed = [];
	const changed = [];

	for (const [name, now] of Object.entries(current)) {
		const before = baseline[name];
		if (!before) {
			added.push({ name, version: now.version });
			continue;
		}
		const versionChanged = before.version !== now.version;
		const docChanged = before.agentsMd !== now.agentsMd;
		if (versionChanged || docChanged) {
			changed.push({
				name,
				from: before.version,
				to: now.version,
				versionChanged,
				docChanged
			});
		}
	}

	for (const [name, before] of Object.entries(baseline)) {
		if (!current[name]) removed.push({ name, version: before.version });
	}

	const documented = changed.filter((entry) => entry.docChanged);
	return {
		added,
		removed,
		changed,
		documented,
		drifted: added.length + removed.length + documented.length > 0
	};
}

/** Packages the data files describe that are not installed here at all. */
export function undocumentableSlugs(references, current) {
	const installed = new Set(Object.keys(current).map((name) => name.slice(SCOPE.length + 1)));
	return [...references.keys()].filter((slug) => !installed.has(slug)).sort();
}

const dataFilesFor = (references, name) => references.get(name.slice(SCOPE.length + 1)) ?? [];

const asCode = (files) => files.map((file) => `\`${file}\``).join(', ');

/**
 * A version string reaches a markdown table and, from there, a GitHub issue
 * body. It comes from a third-party package.json, so it is neither trusted nor
 * bounded: a pipe would forge table cells and a newline would forge rows.
 *
 * @param {string} version
 */
function safeVersion(version) {
	return /^[\w][\w.+-]{0,63}$/.test(version) ? version : '(unprintable version)';
}

/**
 * Render the drift report as GitHub-flavoured markdown.
 *
 * @param {ReturnType<typeof diffPackages>} diff
 * @param {Map<string, string[]>} references
 * @param {Record<string, { version: string }>} current
 */
export function formatReport(diff, references, current) {
	const lines = [];

	if (!diff.drifted) {
		lines.push(
			`No installed \`${SCOPE}/${PREFIX}*\` package has rewritten its \`${DOC_FILE}\` since the`,
			'baseline, so nothing in `src/lib/data/` is known to be stale.',
			''
		);
	}

	if (diff.documented.length > 0) {
		lines.push('### Packages whose documentation changed', '');
		lines.push('| Package | Version | Data files to re-read |');
		lines.push('| --- | --- | --- |');
		for (const entry of diff.documented) {
			const version = entry.versionChanged
				? `${safeVersion(entry.from)} → ${safeVersion(entry.to)}`
				: `${safeVersion(entry.to)} (unchanged)`;
			const files = dataFilesFor(references, entry.name);
			const where = files.length > 0 ? asCode(files) : '_none_';
			lines.push(`| \`${entry.name}\` | ${version} | ${where} |`);
		}
		lines.push('');
	}

	if (diff.added.length > 0) {
		lines.push('### Newly installed packages', '');
		for (const entry of diff.added) {
			const files = dataFilesFor(references, entry.name);
			const where = files.length > 0 ? ` — described in ${asCode(files)}` : ' — not documented yet';
			lines.push(`- \`${entry.name}\` ${safeVersion(entry.version)}${where}`);
		}
		lines.push('');
	}

	if (diff.removed.length > 0) {
		lines.push('### Packages no longer installed', '');
		for (const entry of diff.removed) {
			const files = dataFilesFor(references, entry.name);
			const where = files.length > 0 ? ` — still described in ${asCode(files)}` : '';
			lines.push(`- \`${entry.name}\` (was ${safeVersion(entry.version)})${where}`);
		}
		lines.push('');
	}

	const unresolved = undocumentableSlugs(references, current);
	const versionOnly = diff.changed.length - diff.documented.length;
	lines.push('### Coverage', '');
	lines.push(
		`${Object.keys(current).length} \`${SCOPE}/${PREFIX}*\` packages are installed and were` +
			' checked.'
	);
	if (versionOnly > 0) {
		lines.push(
			'',
			`${versionOnly} of them moved version without touching \`${DOC_FILE}\`. That is the normal` +
				' lockstep release and is not reported as drift — there is nothing new to read.'
		);
	}
	if (unresolved.length > 0) {
		lines.push(
			'',
			`${unresolved.length} package${unresolved.length === 1 ? '' : 's'} named in` +
				' `src/lib/data/` are not dependencies of this site, so their documentation cannot be' +
				' audited from `node_modules` and this report says nothing about them:',
			'',
			unresolved.map((slug) => `\`${slug}\``).join(', ')
		);
	}
	if (diff.drifted) {
		lines.push(
			'',
			"Re-read those entries against each package's own `AGENTS.md` in `node_modules`, then run",
			'`pnpm run audit:data -- --update` and commit the refreshed baseline to close this out.'
		);
	}

	return lines.join('\n');
}

/** Serialize the baseline exactly as prettier would, so `pnpm run lint` stays green. */
function serializeBaseline(packages) {
	return `${JSON.stringify(
		{
			description:
				'What src/lib/data/*.ts was last verified against. Regenerate with ' +
				'`pnpm run audit:data -- --update` after re-reading the changed packages.',
			packages
		},
		null,
		'\t'
	)}\n`;
}

function main(argv) {
	const update = argv.includes('--update');
	const quiet = argv.includes('--quiet');

	const current = collectInstalled(ROOT);
	if (Object.keys(current).length === 0) {
		process.stderr.write(
			`No ${SCOPE}/${PREFIX}* packages found under node_modules. Run \`pnpm install\` first.\n`
		);
		return 2;
	}

	if (update) {
		writeFileSync(BASELINE_PATH, serializeBaseline(current));
		process.stderr.write(
			`Baseline updated: ${Object.keys(current).length} packages recorded in ` +
				'scripts/smrt-docs-baseline.json\n'
		);
		return 0;
	}

	if (!existsSync(BASELINE_PATH)) {
		process.stderr.write(
			`Missing ${BASELINE_PATH}. Create it with \`pnpm run audit:data -- --update\`.\n`
		);
		return 2;
	}

	let baseline;
	try {
		baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).packages ?? {};
	} catch (cause) {
		process.stderr.write(`Cannot parse ${BASELINE_PATH}: ${cause.message}\n`);
		return 2;
	}

	const diff = diffPackages(baseline, current);
	if (!quiet) {
		process.stdout.write(`${formatReport(diff, collectReferences(DATA_DIR), current)}\n`);
	}
	process.stderr.write(
		diff.drifted
			? `Data freshness: ${diff.documented.length} documentation change(s), ` +
					`${diff.added.length} added, ${diff.removed.length} removed.\n`
			: 'Data freshness: no drift.\n'
	);
	return diff.drifted ? 1 : 0;
}

// Only act as a CLI when invoked directly; the tests import the helpers above.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
	try {
		process.exitCode = main(process.argv.slice(2));
	} catch (error) {
		process.stderr.write(`${error.message}\n`);
		process.exitCode = 2;
	}
}
