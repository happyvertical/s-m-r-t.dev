/**
 * The smrt framework release this site documents.
 *
 * Injected at build time from the installed `@happyvertical/smrt-*` tree — see
 * `scripts/smrt-version.js` and the `define` block in `vite.config.ts` /
 * `vitest.config.ts`. Import it anywhere the version is rendered; never write
 * the number into page copy, or the site starts claiming a release it is not
 * built against.
 */
export const SMRT_VERSION: string = __SMRT_VERSION__;
