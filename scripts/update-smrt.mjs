#!/usr/bin/env node
/**
 * update-smrt — bump every `@happyvertical/smrt-*` registry dependency in
 * package.json to the latest version published to GitHub Packages, then refresh
 * the pnpm lockfile.
 *
 * Why this exists
 * ---------------
 * The smrt framework ships as ~25 separate packages on
 * `https://npm.pkg.github.com`, all released in lockstep. Renovate is supposed
 * to keep them current, but it authenticates with a `${GH_PACKAGES_TOKEN}`
 * substitution in `~/.npmrc` that is easy to leave unset/expired — when that
 * happens the registry returns 401 and updates silently stop landing. This
 * script sidesteps that by authenticating with `gh auth token`, so a developer
 * can always pull the project forward in one command.
 *
 * Auth resolution order (first that works wins):
 *   1. $GH_TOKEN              (CI / explicit override)
 *   2. $NODE_AUTH_TOKEN       (setup-node convention)
 *   3. `gh auth token`        (local dev — needs `read:packages` scope)
 *
 * Usage:
 *   node scripts/update-smrt.mjs            # bump all to latest, refresh lockfile
 *   node scripts/update-smrt.mjs --dry-run  # show what would change, touch nothing
 *   node scripts/update-smrt.mjs --to 0.29.34   # pin all smrt pkgs to one version
 *   node scripts/update-smrt.mjs --exact    # write exact versions instead of ^
 *   node scripts/update-smrt.mjs --no-install   # update package.json only
 *
 * Skipped automatically: any smrt dep using a `file:`, `link:`, or `workspace:`
 * spec (e.g. `@happyvertical/smrt-docs`), since those are sourced locally.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REGISTRY = 'https://npm.pkg.github.com';
const SCOPE_PREFIX = '@happyvertical/smrt-';
const LOCAL_SPEC = /^(file:|link:|workspace:)/;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
	const i = args.indexOf(name);
	return i !== -1 ? args[i + 1] : undefined;
};

const dryRun = flag('--dry-run');
const noInstall = flag('--no-install') || dryRun;
const useExact = flag('--exact');
const pinTo = opt('--to'); // optional single target version for every package

function getToken() {
	if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
	if (process.env.NODE_AUTH_TOKEN) return process.env.NODE_AUTH_TOKEN;
	try {
		return execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
	} catch {
		throw new Error(
			'No registry token available. Set $GH_TOKEN or run `gh auth login` ' +
				'(token needs the `read:packages` scope).'
		);
	}
}

async function latestVersion(token, pkg) {
	const url = `${REGISTRY}/${pkg.replace('/', '%2f')}`;
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
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

const token = getToken();

console.log(`\nResolving latest versions for ${targets.length} packages...\n`);

const changes = [];
await Promise.all(
	targets.map(async (t) => {
		const version = pinTo ?? (await latestVersion(token, t.name));
		t.next = specFor(version);
		t.nextVersion = version;
	})
);

for (const t of targets) {
	const changed = t.current !== t.next;
	if (changed) changes.push(t);
	const mark = changed ? '→' : '=';
	console.log(`  ${mark} ${t.name.padEnd(34)} ${t.current.padEnd(12)} ${changed ? t.next : ''}`);
}

if (changes.length === 0) {
	console.log('\nAll smrt packages already up to date. Nothing to do.');
	process.exit(0);
}

if (dryRun) {
	console.log(`\n[dry-run] would update ${changes.length} package(s).`);
	process.exit(0);
}

for (const t of changes) {
	pkg[t.field][t.name] = t.next;
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, '\t') + '\n');
console.log(`\nUpdated package.json (${changes.length} package(s)).`);

if (noInstall) {
	console.log('Skipping install (--no-install). Run `pnpm install` to refresh the lockfile.');
	process.exit(0);
}

// Refresh the lockfile with a temporary npmrc that carries a working token,
// overriding the (possibly broken) user-level ~/.npmrc for this command only.
const npmrcDir = mkdtempSync(join(tmpdir(), 'update-smrt-'));
const npmrcPath = join(npmrcDir, '.npmrc');
writeFileSync(
	npmrcPath,
	[
		'@happyvertical:registry=https://npm.pkg.github.com',
		`//npm.pkg.github.com/:_authToken=${token}`,
		'always-auth=true',
		''
	].join('\n')
);

try {
	console.log('\nRefreshing lockfile with `pnpm install`...\n');
	execFileSync('pnpm', ['install'], {
		stdio: 'inherit',
		env: { ...process.env, NPM_CONFIG_USERCONFIG: npmrcPath }
	});
} finally {
	rmSync(npmrcDir, { recursive: true, force: true });
}

console.log('\nDone. Review the diff, run `pnpm check && pnpm build`, then commit.');
