import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Every `@happyvertical/smrt-*` package is released in lockstep, so any one of
 * them reports the framework version. Probe a direct dependency: pnpm only
 * hoists those into the top-level `node_modules`, and reading a manifest by
 * path sidesteps the packages' `exports` maps, which do not expose
 * `./package.json`.
 */
const PROBE = '@happyvertical/smrt-svelte';

/**
 * Read the installed smrt framework version.
 *
 * This is the site's single source of truth for the version it renders. It
 * comes from the installed tree rather than a string checked into source so the
 * badge cannot drift away from the release the site actually documents — the
 * failure #100 was filed about.
 *
 * @returns {string} the installed version, e.g. `0.40.61`
 */
export function readSmrtVersion() {
	const manifest = fileURLToPath(new URL(`../node_modules/${PROBE}/package.json`, import.meta.url));
	let version;
	try {
		version = JSON.parse(readFileSync(manifest, 'utf8')).version;
	} catch (cause) {
		throw new Error(`Cannot read ${PROBE} at ${manifest}. Run \`pnpm install\` first.`, { cause });
	}
	if (typeof version !== 'string' || version.length === 0) {
		throw new Error(`${PROBE} package.json has no usable "version" field.`);
	}
	return version;
}
