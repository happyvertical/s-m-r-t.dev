#!/usr/bin/env node
/**
 * update-smrt — pin every `@happyvertical/smrt-*` registry dependency in
 * package.json to the latest published version, then refresh the pnpm lockfile.
 *
 * Why this exists
 * ---------------
 * The smrt framework ships as ~25 separate packages, all released in lockstep,
 * and they are pinned to *exact* versions here on purpose: `@happyvertical/smrt-fields`
 * pins its own smrt siblings exactly, so a mix of exact and caret ranges lets
 * pnpm install two copies of `smrt-core` — and therefore two `ObjectRegistry`
 * singletons — in the same tree. Exact pins across the board remove that class
 * of failure, at the cost of needing this script (or Renovate) to move forward.
 *
 * Registry: resolved from npm config for the `@happyvertical` scope, which the
 * project `.npmrc` points at public npmjs. No authentication is required; the
 * packages are public. Pass nothing and it does the right thing.
 *
 * Run with `--help` for flags; `USAGE` below is the one copy.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SCOPE = '@happyvertical';
const SCOPE_PREFIX = `${SCOPE}/smrt-`;
const DEFAULT_REGISTRY = 'https://registry.npmjs.org';
const LOCAL_SPEC = /^(file:|link:|workspace:)/;

const USAGE = `update-smrt — pin every @happyvertical/smrt-* dependency and refresh the lockfile.

  pnpm run update:smrt                     pin all to latest, refresh the lockfile
  pnpm run update:smrt -- --check          verify exact, lockstep package specs
  pnpm run update:smrt -- --dry-run        show what would change, touch nothing
  pnpm run update:smrt -- --to <version>   pin every smrt package to one version
  pnpm run update:smrt -- --caret          write ^x.y.z ranges instead of exact pins
  pnpm run update:smrt -- --exact          explicit form of the default
  pnpm run update:smrt -- --no-install     update package.json only

Exact pins are the policy, not a preference: smrt-fields pins its own smrt
siblings exactly, so mixing exact and caret ranges lets pnpm install two
smrt-core copies — and two ObjectRegistry singletons — in one tree. Keep every
smrt dependency on the same exact version.

The registry comes from npm config for the @happyvertical scope, so this
follows the project .npmrc rather than hardcoding a host. Deps on a file:,
link:, or workspace: spec are skipped during updates; --check rejects them.

After a bump, verify with pnpm run lint && pnpm test && pnpm run check &&
pnpm run build, then commit package.json plus pnpm-lock.yaml.`;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
	const i = args.indexOf(name);
	return i !== -1 ? args[i + 1] : undefined;
};

if (flag('--help') || flag('-h')) {
	console.log(USAGE);
	process.exit(0);
}

const dryRun = flag('--dry-run');
const checkOnly = flag('--check');
const noInstall = flag('--no-install') || dryRun;
// Exact pins are the policy; `--caret` is the opt-out.
const useExact = !flag('--caret');
const pinTo = opt('--to'); // optional single target version for every package
if (flag('--to') && !pinTo) {
	console.error('--to requires a version argument, e.g. --to 0.40.61');
	process.exit(1);
}
if (pinTo && !/^\d+\.\d+\.\d+([-+].+)?$/.test(pinTo)) {
	console.error(`--to expects a semver version (e.g. 0.40.61), got: ${pinTo}`);
	process.exit(1);
}
if (flag('--exact') && flag('--caret')) {
	console.error('--exact and --caret are mutually exclusive.');
	process.exit(1);
}
if (
	checkOnly &&
	(dryRun || flag('--caret') || flag('--exact') || flag('--to') || flag('--no-install'))
) {
	console.error('--check cannot be combined with update flags.');
	process.exit(1);
}

/**
 * Resolve the registry npm/pnpm would use for the `@happyvertical` scope, so
 * this script follows the project `.npmrc` instead of hardcoding a host that
 * can go stale (it previously hardcoded GitHub Packages, frozen at 0.29.x).
 */
function resolveRegistry() {
	try {
		const value = execFileSync('npm', ['config', 'get', `${SCOPE}:registry`], {
			encoding: 'utf8'
		}).trim();
		if (value && value !== 'undefined' && value !== 'null') {
			return value.replace(/\/+$/, '');
		}
	} catch {
		// npm not on PATH, or no scoped registry configured — use the public default.
	}
	return DEFAULT_REGISTRY;
}

async function latestVersion(registry, pkg) {
	const url = `${registry}/${pkg.replaceAll('/', '%2f')}`;
	const res = await fetch(url, {
		// Abbreviated packument: much smaller, still carries dist-tags.
		headers: { Accept: 'application/vnd.npm.install-v1+json' }
	});
	if (!res.ok) {
		throw new Error(`registry returned ${res.status} for ${pkg}`);
	}
	const data = await res.json();
	const latest = data['dist-tags']?.latest;
	if (!latest) throw new Error(`no dist-tags.latest for ${pkg}`);
	return latest;
}

function specFor(version) {
	return useExact ? version : `^${version}`;
}

const root = process.cwd();
const pkgPath = join(root, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

const targets = [];
for (const field of ['dependencies', 'devDependencies']) {
	const deps = pkg[field];
	if (!deps) continue;
	for (const [name, spec] of Object.entries(deps)) {
		if (!name.startsWith(SCOPE_PREFIX)) continue;
		if (LOCAL_SPEC.test(spec)) {
			if (checkOnly) {
				targets.push({ name, field, current: spec });
				continue;
			}
			console.log(`  skip   ${name} (${spec}) — local spec`);
			continue;
		}
		targets.push({ name, field, current: spec });
	}
}

if (targets.length === 0) {
	console.log('No registry-sourced @happyvertical/smrt-* dependencies found.');
	process.exit(0);
}

if (checkOnly) {
	const invalid = targets.filter((target) => !/^\d+\.\d+\.\d+(?:[-+].+)?$/.test(target.current));
	if (invalid.length > 0) {
		console.error('SMRT dependencies must use exact versions:');
		for (const target of invalid) console.error(`  - ${target.name}: ${target.current}`);
		process.exit(1);
	}

	const versions = [...new Set(targets.map((target) => target.current))];
	if (versions.length !== 1) {
		console.error(`SMRT dependencies must move in lockstep; found: ${versions.join(', ')}`);
		process.exit(1);
	}

	console.log(
		`SMRT dependency contract is coherent at ${versions[0]} (${targets.length} packages).`
	);
	process.exit(0);
}

const registry = resolveRegistry();

console.log(`\nResolving latest versions for ${targets.length} packages from ${registry}...\n`);

const changes = [];
const resolved = await Promise.allSettled(
	targets.map(async (t) => {
		const version = pinTo ?? (await latestVersion(registry, t.name));
		t.next = specFor(version);
		t.nextVersion = version;
	})
);
const failures = resolved.filter((r) => r.status === 'rejected');
if (failures.length > 0) {
	console.error(`\nFailed to resolve ${failures.length} package(s):`);
	for (const f of failures) console.error(`  - ${f.reason.message}`);
	process.exit(1);
}

for (const t of targets) {
	const changed = t.current !== t.next;
	if (changed) changes.push(t);
	const mark = changed ? '→' : '=';
	console.log(`  ${mark} ${t.name.padEnd(34)} ${t.current.padEnd(12)} ${changed ? t.next : ''}`);
}

// Each package's `dist-tags.latest` is resolved independently, so a partial or
// interrupted lockstep release can hand back a mixed set. Writing that would
// reintroduce the exact duplicate-smrt-core hazard the exact pins exist to
// prevent, and nothing downstream fails loudly on it — so refuse here. This runs
// after the table above so the operator can see which packages lag.
const distinctVersions = [...new Set(targets.map((t) => t.nextVersion))];
if (distinctVersions.length > 1) {
	console.error(`\nRefusing to write a mixed version set: ${distinctVersions.join(', ')}`);
	console.error(
		'smrt packages release in lockstep. Wait for the release to finish, or force one\n' +
			'version deliberately with --to <version>.'
	);
	process.exit(1);
}

if (dryRun) {
	console.log(
		changes.length > 0
			? `\n[dry-run] would update ${changes.length} package(s).`
			: '\n[dry-run] all smrt packages already at the target version.'
	);
	process.exit(0);
}

if (changes.length > 0) {
	for (const t of changes) {
		pkg[t.field][t.name] = t.next;
	}
	writeFileSync(pkgPath, JSON.stringify(pkg, null, '\t') + '\n');
	console.log(`\nUpdated package.json (${changes.length} package(s)).`);
} else {
	// package.json already current — still refresh the lockfile, which may be
	// stale or missing even when the specs match.
	console.log('\nAll smrt specs already current; refreshing the lockfile to be safe.');
}

if (noInstall) {
	console.log('Skipping install (--no-install). Run `pnpm install` to refresh the lockfile.');
	process.exit(0);
}

console.log('\nRefreshing lockfile with `pnpm install`...\n');
execFileSync('pnpm', ['install'], { stdio: 'inherit' });

console.log('\nDone. Review the diff, run `pnpm test && pnpm run build`, then commit.');
