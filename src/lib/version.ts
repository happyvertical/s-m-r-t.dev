/**
 * Single source of truth for the SMRT framework version shown across the site.
 *
 * Update this one constant when bumping the `@happyvertical/smrt-*` packages
 * (see CLAUDE.md → "Keeping smrt up to date"). Version badges in
 * `ModulePage.svelte` and the footer line in `Footer.svelte` both read from
 * here, so individual page `badges` arrays never need to be hand-edited.
 */
export const SMRT_VERSION = '0.29.34';

/** Display label, e.g. "v0.29.34". */
export const SMRT_VERSION_LABEL = `v${SMRT_VERSION}`;
