/**
 * The emitted-route set, built the way SvelteKit's prerenderer builds it:
 * walk `src/routes/**` and call each dynamic route's `entries()`.
 *
 * Test-only (vitest resolves the globs); shared by `integrity.test.ts` and
 * `legacy-routes.test.ts` so both judge a URL against the same inventory.
 */
import { isRedirect } from '@sveltejs/kit';

type LoadFn = (_event: { params: Record<string, string> }) => unknown;
type EntriesFn = () => Array<Record<string, string>> | Promise<Array<Record<string, string>>>;
type RouteModule = { load?: LoadFn; entries?: EntriesFn };

export interface RouteInfo {
	/** The final URL path, e.g. `/docs/reference/packages/smrt-ui`. */
	path: string;
	/** Whether visiting `path` throws a redirect rather than rendering. */
	isRedirect: boolean;
	/** The redirect location, when `isRedirect` is true. */
	target?: string;
	/** The redirect status, when `isRedirect` is true. */
	status?: number;
}

const svelteFiles = import.meta.glob('/src/routes/**/+page.svelte');
const tsLoaders = import.meta.glob<RouteModule>('/src/routes/**/+page.ts', { eager: true });
const serverLoaders = import.meta.glob<RouteModule>('/src/routes/**/+page.server.ts', {
	eager: true
});

function toDir(filePath: string): string {
	return filePath.replace(/^\/src\/routes/, '').replace(/\/\+page\.(svelte|ts|server\.ts)$/, '');
}

function toBase(dir: string, dynamic: boolean): string {
	if (!dynamic) return dir === '' ? '/' : dir;
	const segments = dir.split('/');
	const base = segments.slice(0, -1).join('/');
	return base === '' ? '/' : base;
}

function joinPath(base: string, slug: string): string {
	return base === '/' ? `/${slug}` : `${base}/${slug}`;
}

function tryLoad(
	load: LoadFn | undefined,
	params: Record<string, string>
): { location: string; status: number } | undefined {
	if (!load) return undefined;
	try {
		load({ params });
		return undefined;
	} catch (e) {
		if (isRedirect(e)) return e as { location: string; status: number };
		// A thrown 404 (error()) for a bad slug shouldn't happen for entries()-derived
		// params; surface it rather than swallowing it as "not a redirect".
		throw e;
	}
}

/** Every directory that renders or redirects a `+page.svelte`/`+page.(server.)ts`. */
const allDirs = new Set<string>([
	...Object.keys(svelteFiles).map(toDir),
	...Object.keys(tsLoaders).map(toDir),
	...Object.keys(serverLoaders).map(toDir)
]);

export const routes: RouteInfo[] = [];

for (const dir of allDirs) {
	const segments = dir.split('/').filter(Boolean);
	const lastSegment = segments.at(-1) ?? '';
	const isCatchAll = lastSegment.startsWith('[...');
	const isSlug = lastSegment.startsWith('[') && !isCatchAll;
	const dynamic = isCatchAll || isSlug;
	// A parameter above the last segment (`/features/[section]/[feature]`) is
	// enumerated through the leaf route's entries(), which carry every param.
	const parentDynamic = segments.slice(0, -1).some((segment) => segment.startsWith('['));
	const base = toBase(dir, dynamic);

	const tsKey = `/src/routes${dir}/+page.ts`;
	const serverKey = `/src/routes${dir}/+page.server.ts`;
	const mod = serverLoaders[serverKey] ?? tsLoaders[tsKey];

	if (!dynamic && !parentDynamic) {
		const result = tryLoad(mod?.load, {});
		routes.push({
			path: base,
			isRedirect: result !== undefined,
			target: result?.location,
			status: result?.status
		});
		continue;
	}

	if (!mod?.entries) {
		throw new Error(`${dir} is a dynamic route with no entries() — nothing would prerender.`);
	}
	const entries = mod.entries();
	for (const entry of Array.isArray(entries) ? entries : []) {
		const path = segments
			.map((segment) => {
				if (!segment.startsWith('[')) return segment;
				const name = segment.replace(/^\[(\.\.\.)?/, '').replace(/\]$/, '');
				return entry[name];
			})
			.join('/');
		const result = tryLoad(mod.load, entry);
		routes.push({
			path: joinPath('/', path),
			isRedirect: result !== undefined,
			target: result?.location,
			status: result?.status
		});
	}
}

export const routesByPath = new Map(routes.map((route) => [route.path, route]));
export const contentRoutes = routes.filter((route) => !route.isRedirect);
export const redirectRoutes = routes.filter((route) => route.isRedirect);

export function stripQueryAndHash(path: string): string {
	return path.split('#')[0].split('?')[0];
}
