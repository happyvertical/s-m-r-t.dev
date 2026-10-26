/**
 * The route families that moved under `/docs` (#365), old prefix → new prefix.
 *
 * Every pre-move URL in these families keeps a prerendered 301 at its old
 * path (`src/routes/<family>/…/+page.server.ts`); `legacy-routes.test.ts`
 * holds the inventory. This map is what the internal-link test and the
 * redirect stubs agree on, so a family is moved in exactly one place.
 *
 * `/starters` is the one rename: Getting Started is the developer entry into
 * Docs, so it lives at `/docs/getting-started` — the path the older
 * `/docs/[...legacy]` table already sent `getting-started` to.
 */
export const docsMoves: ReadonlyArray<readonly [string, string]> = [
	['/starters', '/docs/getting-started'],
	['/framework', '/docs/framework'],
	['/foundations', '/docs/foundations'],
	['/capabilities', '/docs/capabilities'],
	['/agents', '/docs/agents'],
	['/interaction', '/docs/interaction'],
	['/ui', '/docs/ui'],
	['/tooling', '/docs/tooling'],
	['/guides', '/docs/guides'],
	['/reference', '/docs/reference']
];

/**
 * The `/docs` path for a pre-move internal href, hash and query kept, or the
 * href unchanged when it is not in a moved family.
 */
export function docsPath(href: string): string {
	const match = /^([^?#]*)(.*)$/.exec(href);
	const pathname = match?.[1] ?? href;
	const rest = match?.[2] ?? '';
	for (const [from, to] of docsMoves) {
		if (pathname === from || pathname.startsWith(`${from}/`)) {
			return `${to}${pathname.slice(from.length)}${rest}`;
		}
	}
	return href;
}

/** True when an href points into a family that moved under `/docs`. */
export function isPreMoveHref(href: string): boolean {
	return docsPath(href) !== href;
}
