/**
 * What the site served before #365 moved every technical family under
 * `/docs`, frozen so the redirect contract can be checked against it.
 *
 * Frozen rather than read from git at test time: CI checks out one commit,
 * and the point is to remember the URLs a cleanup would forget. Test-only.
 */
import { entries as capabilityEntries } from '../../routes/capabilities/[slug]/+page.server';
import { entries as foundationEntries } from '../../routes/foundations/[slug]/+page.server';
import { entries as guideEntries } from '../../routes/guides/[slug]/+page.server';
import { entries as referenceComponentEntries } from '../../routes/reference/components/[slug]/+page.server';
import { entries as referencePackageEntries } from '../../routes/reference/packages/[slug]/+page.server';
import { entries as referenceEntries } from '../../routes/reference/[slug]/+page.server';
import { entries as toolingEntries } from '../../routes/tooling/[slug]/+page.server';

/**
 * Every page route directory under `src/routes` immediately before the move:
 * `git ls-tree -r --name-only b65bf25 src/routes`, `+page.*` files only.
 */
export const preMoveRouteDirs = [
	'/',
	'/agents',
	'/blocks',
	'/blocks/[slug]',
	'/build-a-boilerplate',
	'/capabilities',
	'/capabilities/[slug]',
	'/components',
	'/components/[...legacy]',
	'/docs',
	'/docs/[...legacy]',
	'/faq',
	'/foundations',
	'/foundations/[slug]',
	'/framework',
	'/guides',
	'/guides/[slug]',
	'/interaction',
	'/modules',
	'/modules/[slug]',
	'/packages',
	'/packages/[slug]',
	'/playground',
	'/reference',
	'/reference/[slug]',
	'/reference/api',
	'/reference/components',
	'/reference/components/[slug]',
	'/reference/evidence',
	'/reference/faq',
	'/reference/packages',
	'/reference/packages/[slug]',
	'/saadl',
	'/sdk',
	'/starters',
	'/starters/ground-up',
	'/starters/saas',
	'/starters/smrt-start',
	'/themes',
	'/tooling',
	'/tooling/[slug]',
	'/ui'
] as const;

/** The `/docs/[...legacy]` table's 18 keys before the move. */
export const preMoveDocsLegacyKeys = [
	'getting-started',
	'how-it-works',
	'objects',
	'collections',
	'agents',
	'agents/dispatch',
	'components/feedback/confirm-dialog',
	'components/feedback/progress-bar',
	'migration',
	'security',
	'concepts/configuration',
	'concepts/multi-tenancy',
	'concepts/context-memory',
	'concepts/semantic-search',
	'concepts/testing',
	'guides/multi-tenant-lifecycle',
	'guides/expose-app-via-mcp',
	'guides/add-semantic-search'
] as const;

/**
 * The single-page routes #365 moved, now one-line 301 stubs at their old path.
 * `/docs` itself was a 308 to `/` before the move and is now the Docs landing.
 */
export const movedStaticPaths = [
	'/agents',
	'/capabilities',
	'/foundations',
	'/framework',
	'/guides',
	'/interaction',
	'/reference',
	'/reference/api',
	'/reference/components',
	'/reference/evidence',
	'/reference/faq',
	'/reference/packages',
	'/starters',
	'/starters/smrt-start',
	'/tooling',
	'/ui'
] as const;

type SlugEntries = () => { slug: string }[];

/**
 * The `[slug]` families #365 moved, keyed by their pre-move base. Each
 * `entries()` is synchronous; the cast narrows SvelteKit's generated
 * `EntryGenerator` type, which also allows a promise.
 */
export const movedSlugFamilies: Record<
	| '/capabilities'
	| '/foundations'
	| '/guides'
	| '/reference'
	| '/reference/components'
	| '/reference/packages'
	| '/tooling',
	SlugEntries
> = {
	'/capabilities': capabilityEntries,
	'/foundations': foundationEntries,
	'/guides': guideEntries,
	'/reference': referenceEntries,
	'/reference/components': referenceComponentEntries,
	'/reference/packages': referencePackageEntries,
	'/tooling': toolingEntries
} as Record<string, unknown> as typeof movedSlugFamilies;

/** Every pre-move URL the #365 stubs answer: static pages plus every slug. */
export function docsMoveRedirectPaths(): string[] {
	return [
		...movedStaticPaths,
		...Object.entries(movedSlugFamilies).flatMap(([base, entries]) =>
			entries().map(({ slug }) => `${base}/${slug}`)
		)
	];
}

export function docsMoveRedirectCount(): number {
	return docsMoveRedirectPaths().length;
}
