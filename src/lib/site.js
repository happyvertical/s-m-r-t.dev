/**
 * The site's public origin: the one place the hostname is written.
 *
 * Plain JavaScript on purpose. The build scripts (`scripts/*.mjs`) run under
 * bare Node and read the same value the app does; `$lib/site` resolves here
 * for TypeScript and Svelte. `site.test.ts` fails when the hostname
 * appears anywhere else, so a domain move is a one-line change here.
 */

/** Origin with scheme and no trailing slash, e.g. `https://example.com`. */
export const SITE_ORIGIN = 'https://s-m-r-t.dev';

/** The hostname alone, derived from {@link SITE_ORIGIN}. */
export const SITE_HOST = new URL(SITE_ORIGIN).hostname;

/**
 * Absolute URL for a site path. `siteUrl('/')` is the bare origin, matching the
 * canonical form the site has always emitted for the front page.
 *
 * @param {string} [path] root-relative path, e.g. `/docs`
 * @returns {string}
 */
export function siteUrl(path = '') {
	return path === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;
}
