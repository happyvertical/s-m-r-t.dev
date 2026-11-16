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
 * Routes, stubs, the sitemap and the tests read `docMoves` through
 * `movedPath`, `movedSlugs` and `currentPath`; nothing builds an old or new
 * moved path by hand.
 *
 * This module imports nothing from `navigation.ts`, so both can use it.
 */

/** The only place that says which section claims a capability page. */
export type CapabilityHome = 'ui' | 'agents-and-interaction';

/**
 * Capability pages that are not plain Framework capabilities. A slug that is
 * not here and not a `docMoves` target under `/docs/ui/` is a Framework
 * capability.
 *
 * - `ui`: listed in the UI section and served under `/docs/ui`. Not stored
 *   here: a capability is `ui` when `docMoves` sends a page to
 *   `/docs/ui/<its slug>`, so renaming one is a `docMoves` value plus the
 *   guide's `slug`.
 * - `agents-and-interaction`: Framework, listed with the Agents and Interaction
 *   pages. WebMCP sits here because it is the protocol-level mechanics behind
 *   the tool surfaces the Agents page maps.
 */
const capabilityHomes: ReadonlyMap<string, CapabilityHome> = new Map([
	['webmcp', 'agents-and-interaction'],
	['agent-legible-applications', 'agents-and-interaction'],
	['agent-assisted-forms', 'agents-and-interaction'],
	['learning-agents', 'agents-and-interaction']
]);

type SlugOrGuide = string | { slug: string };

const slugOf = (page: SlugOrGuide): string => (typeof page === 'string' ? page : page.slug);

/** `oldPath → newPath`. Frozen: entries are only ever added. */
export const docMoves: Readonly<Record<string, string>> = Object.freeze({
	'/docs/capabilities/collections': '/docs/capabilities/collection-reads',
	'/docs/foundations/interfaces': '/docs/foundations/connect-interfaces',
	'/docs/capabilities/field-policies': '/docs/ui/field-policy-layers',
	'/docs/capabilities/application-shell': '/docs/ui/application-shell',
	'/docs/capabilities/policy-aware-forms': '/docs/ui/policy-aware-forms',
	'/docs/capabilities/field-policy-operations': '/docs/ui/field-policy-operations'
});

/**
 * URL families that have a route serving moved pages. A move whose target is
 * in another family waits until that route exists, and until then its old URL
 * keeps serving the page.
 */
const landedFamilies: readonly string[] = [
	'/docs/capabilities/',
	'/docs/foundations/',
	'/docs/ui/'
];

const isLanded = (newPath: string): boolean =>
	landedFamilies.some((family) => newPath.startsWith(family));

/**
 * Stable ids for the moved pages, each naming the page by its frozen OLD
 * address (a `docMoves` key). Prose links ask for a page by id through
 * `movedHref`, so renaming a page never touches a link: change the page's
 * `docMoves` value and its guide's `slug`.
 */
export const movedPages = {
	collectionReads: '/docs/capabilities/collections',
	connectInterfaces: '/docs/foundations/interfaces',
	fieldPolicyLayers: '/docs/capabilities/field-policies',
	applicationShell: '/docs/capabilities/application-shell',
	policyAwareForms: '/docs/capabilities/policy-aware-forms',
	fieldPolicyOperations: '/docs/capabilities/field-policy-operations'
} as const;

export type MovedPageKey = keyof typeof movedPages;

/** The current address of a moved page, with an optional `#fragment`. */
export function movedHref(key: MovedPageKey, hash = ''): string {
	const target = docMoves[movedPages[key]];
	if (target === undefined) throw new Error(`movedPages-missing:${key}`);
	return hash === '' ? target : `${target}#${hash.replace(/^#/, '')}`;
}

/** Where a moved page now lives, or `undefined` when `oldPath` never moved. */
export function movedPath(oldPath: string): string | undefined {
	if (!Object.hasOwn(docMoves, oldPath)) return undefined;
	const newPath = docMoves[oldPath];
	return isLanded(newPath) ? newPath : undefined;
}

/**
 * `slugs` without the names a move introduced (a slug that is the last segment
 * of a `docMoves` target but of no `docMoves` key). The pre-#365 stubs use this
 * so they cover only URLs that existed before #399.
 */
export function withoutRenamedSlugs(slugs: readonly string[]): string[] {
	const last = (path: string) => path.split('/').at(-1);
	const oldNames = new Set(Object.keys(docMoves).map(last));
	const newNames = new Set(
		Object.values(docMoves)
			.map(last)
			.filter((name) => !oldNames.has(name))
	);
	return slugs.filter((slug) => !newNames.has(slug));
}

/** The address a docs path answers at now: its move target, else itself. */
export function currentPath(path: string): string {
	return movedPath(path) ?? path;
}

/**
 * Old slugs of moved pages that lived under `base` (for example
 * `/docs/capabilities`). A `[slug]` route adds these to its `entries()` so each
 * old URL is prerendered as a 301.
 */
export function movedSlugs(base: string): string[] {
	const prefix = `${base}/`;
	return Object.keys(docMoves)
		.filter((oldPath) => oldPath.startsWith(prefix) && movedPath(oldPath) !== undefined)
		.map((oldPath) => oldPath.slice(prefix.length));
}

export const foundationPath = (page: SlugOrGuide): string => `/docs/foundations/${slugOf(page)}`;

/** The UI section's address for a page (`/docs/ui/<slug>`). */
export const uiPath = (page: SlugOrGuide): string => `/docs/ui/${slugOf(page)}`;

/** Which non-Framework home claims a capability slug, if any. */
export function capabilityHome(page: SlugOrGuide): CapabilityHome | undefined {
	const slug = slugOf(page);
	if (Object.values(docMoves).includes(uiPath(slug))) return 'ui';
	return capabilityHomes.get(slug);
}

/** The capabilities route's own address for a slug, whatever its home. */
export const capabilityRoutePath = (page: SlugOrGuide): string =>
	`/docs/capabilities/${slugOf(page)}`;

/** Where a capability page is served: its home's address, UI or Framework. */
export const capabilityPath = (page: SlugOrGuide): string =>
	capabilityHome(page) === 'ui' ? uiPath(page) : capabilityRoutePath(page);

/**
 * Where a capability slug answers now, for the stubs that kept an older URL: a
 * moved page's final address (one hop), else the page's own address.
 */
export function capabilityTarget(slug: string): string {
	return movedPath(capabilityRoutePath(slug)) ?? capabilityPath(slug);
}

export const taskPath = (page: SlugOrGuide): string => `/docs/guides/${slugOf(page)}`;
export const toolingPath = (page: SlugOrGuide): string => `/docs/tooling/${slugOf(page)}`;
export const referencePath = (page: SlugOrGuide): string => `/docs/reference/${slugOf(page)}`;
