/**
 * Where a docs page lives, and where it used to.
 *
 * Every guide page's URL is built here (`foundationPath`, `capabilityPath`,
 * `taskPath`, `toolingPath`, `referencePath`), and `navigation.ts` reads
 * `capabilityHome` for which section lists a capability.
 *
 * To rename or move a page: change the guide's `slug` in `guides.ts` and edit
 * ONE value in `docMoves` below. Never delete a `docMoves` entry — the old URL
 * keeps redirecting to the new one (the frozen inventory in
 * `server/docs-url-inventory.ts` is append-only).
 *
 * `docMoves` is data only for now: no served URL changes in this commit and no
 * route reads it yet (#399, items 3 and 4 apply it).
 *
 * This module imports nothing from `navigation.ts`, so both can use it.
 */

/** The only place that says which section claims a capability page. */
export type CapabilityHome = 'ui' | 'agents-and-interaction';

/**
 * Capability pages that are not plain Framework capabilities. A slug that is
 * not here is a Framework capability.
 *
 * - `ui`: listed in the UI section.
 * - `agents-and-interaction`: Framework, listed with the Agents and Interaction
 *   pages. WebMCP sits here because it is the protocol-level mechanics behind
 *   the tool surfaces the Agents page maps.
 */
const capabilityHomes: ReadonlyMap<string, CapabilityHome> = new Map([
	['application-shell', 'ui'],
	['field-policies', 'ui'],
	['policy-aware-forms', 'ui'],
	['field-policy-operations', 'ui'],
	['webmcp', 'agents-and-interaction'],
	['agent-legible-applications', 'agents-and-interaction'],
	['agent-assisted-forms', 'agents-and-interaction'],
	['learning-agents', 'agents-and-interaction']
]);

type SlugOrGuide = string | { slug: string };

const slugOf = (page: SlugOrGuide): string => (typeof page === 'string' ? page : page.slug);

/** Which non-Framework home claims a capability slug, if any. */
export function capabilityHome(page: SlugOrGuide): CapabilityHome | undefined {
	return capabilityHomes.get(slugOf(page));
}

/** `oldPath → newPath`. Frozen: entries are only ever added. */
export const docMoves: Readonly<Record<string, string>> = Object.freeze({
	'/docs/capabilities/collections': '/docs/capabilities/collection-reads',
	'/docs/foundations/interfaces': '/docs/foundations/connect-interfaces',
	'/docs/capabilities/field-policies': '/docs/ui/field-policy-layers',
	'/docs/capabilities/application-shell': '/docs/ui/application-shell',
	'/docs/capabilities/policy-aware-forms': '/docs/ui/policy-aware-forms',
	'/docs/capabilities/field-policy-operations': '/docs/ui/field-policy-operations'
});

/** Where a moved page now lives, or `undefined` when `oldPath` never moved. */
export function movedPath(oldPath: string): string | undefined {
	return Object.hasOwn(docMoves, oldPath) ? docMoves[oldPath] : undefined;
}

export const foundationPath = (page: SlugOrGuide): string => `/docs/foundations/${slugOf(page)}`;

/**
 * Capability pages are served under `/docs/capabilities` today, including the
 * four listed in UI; #399 item 4 moves those by consulting `capabilityHome`.
 */
export const capabilityPath = (page: SlugOrGuide): string => `/docs/capabilities/${slugOf(page)}`;

export const taskPath = (page: SlugOrGuide): string => `/docs/guides/${slugOf(page)}`;
export const toolingPath = (page: SlugOrGuide): string => `/docs/tooling/${slugOf(page)}`;
export const referencePath = (page: SlugOrGuide): string => `/docs/reference/${slugOf(page)}`;
