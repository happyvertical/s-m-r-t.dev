import { packages, type PackageCategory, type SmrtPackage } from '$lib/data/packages';
import sitePackageJson from '../../../package.json';

/**
 * The five-layer application stack. Canonical short names and one-line
 * descriptions for the taxonomy quoted across the homepage hero, the scope
 * map (`#scope`), and anywhere else the stack is named. One source list so
 * the hero mini-map and the full scope map cannot drift apart.
 *
 * Package membership is derived from `packages.ts` categories (never
 * hand-counted): each layer filters the real catalog, so a package added or
 * removed from `packages.ts` moves the counts and chips automatically. Two
 * groups sit outside this stack entirely, and neither is a person- or
 * agent-facing application surface: native mobile (`smrt-mobile`,
 * `smrt-mobile-contract`, `smrt-android`, `smrt-ios` — still `status:
 * 'private'`, unpublished), and coding-agent/CI tooling (`DEV_TOOLING_SLUGS`
 * below — command-line, testing, and project-scaffold packages covered by the
 * Tooling documentation section instead).
 */

const WHO_CAN_DO_WHAT_SLUGS = new Set(['smrt-users', 'smrt-profiles']);

const BUILDING_BLOCK_CATEGORIES = new Set<PackageCategory>([
	'Content & media',
	'Business & operations',
	'Domain models'
]);

/**
 * Coding-agent and CI tooling that happens to sit in the `Agents & runtime` /
 * `Web & UI` categories but isn't a person- or application-agent-facing
 * surface, so it doesn't belong under "Agents with limits" or "Screens and
 * controls" — it's covered by the Tooling documentation section instead
 * (`tooling.ts` groups `smrt-cli`, `smrt-vitest`, and `smrt-template-*` the
 * same way). Kept as an explicit slug carve-out, the same pattern as
 * `WHO_CAN_DO_WHAT_SLUGS` above.
 */
const DEV_TOOLING_SLUGS = new Set([
	'smrt-dev-mcp',
	'smrt-app-cli',
	'smrt-cli',
	'smrt-vitest',
	'smrt-template-sveltekit',
	'smrt-template-site-static-json'
]);

/**
 * Packages actually installed by this site (`package.json` dependencies and
 * devDependencies), as opposed to published-but-not-depended-on packages that
 * are documented in the catalog. Read from the manifest rather than
 * maintained as a second list, so it cannot drift from what `pnpm install`
 * actually resolves.
 */
const installedPackageNames = new Set(
	Object.keys({
		...(sitePackageJson.dependencies ?? {}),
		...(sitePackageJson.devDependencies ?? {})
	})
);

export interface LayerChip {
	slug: string;
	/** Package name without the `smrt-` prefix, e.g. `core`. */
	shortName: string;
	/** True when this site itself depends on the package (rendered solid). */
	installed: boolean;
}

export interface AppLayer {
	id: string;
	index: number;
	/** Canonical short name, quoted wherever the taxonomy appears. */
	name: string;
	/** Tight one-line description for the hero lede bullet. */
	heroLine: string;
	/** Longer role description for the Section 4 (`#scope`) band. */
	scopeCopy: string;
	packages: SmrtPackage[];
	chips: LayerChip[];
}

function chipsFor(layerPackages: SmrtPackage[]): LayerChip[] {
	return layerPackages.map((pkg) => ({
		slug: pkg.slug,
		shortName: pkg.slug.replace(/^smrt-/, ''),
		installed: installedPackageNames.has(pkg.name)
	}));
}

const foundationsPackages = packages.filter(
	(pkg) => pkg.category === 'Foundation' && !WHO_CAN_DO_WHAT_SLUGS.has(pkg.slug)
);
const whoCanDoWhatPackages = packages.filter((pkg) => WHO_CAN_DO_WHAT_SLUGS.has(pkg.slug));
const buildingBlockPackages = packages.filter((pkg) => BUILDING_BLOCK_CATEGORIES.has(pkg.category));
const agentsWithLimitsPackages = packages.filter(
	(pkg) => pkg.category === 'Agents & runtime' && !DEV_TOOLING_SLUGS.has(pkg.slug)
);
const screensAndControlsPackages = packages.filter(
	(pkg) => pkg.category === 'Web & UI' && !DEV_TOOLING_SLUGS.has(pkg.slug)
);

/**
 * Packages the five-layer stack doesn't place anywhere: native mobile (still
 * source-only) plus the coding-agent/CI tooling carved out above. Both are
 * documented elsewhere (Mobile capability page; Tooling section) — this
 * count exists so the scope map can reconcile its own arithmetic instead of
 * leaving a visitor to notice the gap between the five bands and the
 * catalog total unassisted.
 */
export const unlayeredPackageCount =
	packages.length -
	foundationsPackages.length -
	whoCanDoWhatPackages.length -
	buildingBlockPackages.length -
	agentsWithLimitsPackages.length -
	screensAndControlsPackages.length;

/**
 * The "Ready-made building blocks" noun list. Each noun links to its home —
 * a `/modules` cluster anchor, or a package page when a cluster would repeat
 * another noun's target. Rendered identically in the hero lede and in the
 * Section 4 band copy for that layer: one shared constant, not two texts
 * that can drift.
 */
export interface LayerNoun {
	label: string;
	href: string;
}

export const buildingBlockNouns: LayerNoun[] = [
	{ label: 'articles', href: '/modules#content-and-media' },
	{ label: 'files', href: '/packages/smrt-assets' },
	{ label: 'images', href: '/packages/smrt-images' },
	{ label: 'events', href: '/modules#domain-knowledge' },
	{ label: 'invoices', href: '/modules#commerce-and-operations' },
	{ label: 'projects', href: '/modules#support-and-projects' },
	{ label: 'messages', href: '/packages/smrt-messages' },
	{ label: 'reports', href: '/modules#analytics-and-growth' }
];

/**
 * The sentence stem shared by the hero lede and the Section 4 band copy —
 * same words, cased for where each renders: the hero bullet reads "— working
 * parts…" (lowercase, continuing the em dash), the Section 4 band opens the
 * sentence on its own ("Working parts…"). The noun list after it is the one
 * shared constant (`buildingBlockNouns`); only this stem's case differs.
 */
export const buildingBlocksHeroLede = 'working parts for common needs:';
export const buildingBlocksScopeLede = 'Working parts for common needs:';

export const appLayers: AppLayer[] = [
	{
		id: 'foundations',
		index: 1,
		name: 'Foundations',
		heroLine:
			'one description of the application: what it stores, what it can do, and who is allowed to do it. Rules about who can see each record are enforced where the data lives.',
		scopeCopy:
			'One description of the application: what it stores, what it can do, who is allowed. Rules about who can see each record are enforced where the data lives. Runs out of the box with a local database.',
		packages: foundationsPackages,
		chips: chipsFor(foundationsPackages)
	},
	{
		id: 'who-can-do-what',
		index: 2,
		name: 'Who can do what',
		heroLine:
			'accounts, sign-in, roles, and separate workspaces. Every request is checked against the person or agent who asked.',
		scopeCopy:
			'Accounts, roles, and sign-in. What a person may do also caps what their agents may do.',
		packages: whoCanDoWhatPackages,
		chips: chipsFor(whoCanDoWhatPackages)
	},
	{
		id: 'building-blocks',
		index: 3,
		name: 'Ready-made building blocks',
		// Rendered specially at the render site — see `buildingBlockNouns` — but
		// kept here too so any plain-text listing of the five lines still reads
		// sensibly on its own.
		heroLine:
			'working parts for common needs: articles, files, images, events, invoices, projects, messages, and reports.',
		scopeCopy:
			'Working parts for common needs: articles, files, images, events, invoices, projects, messages, and reports.',
		packages: buildingBlockPackages,
		chips: chipsFor(buildingBlockPackages)
	},
	{
		id: 'agents-with-limits',
		index: 4,
		name: 'Agents with limits',
		heroLine:
			'software agents get their own identity and a fixed list of allowed actions. An agent never has more power than the person it works for.',
		scopeCopy:
			'Agents with their own identity and fixed lists of allowed actions; chat; long-running tasks. Making tools visible to outside agents is a choice each application makes, never a default.',
		packages: agentsWithLimitsPackages,
		chips: chipsFor(agentsWithLimitsPackages)
	},
	{
		id: 'screens-and-controls',
		index: 5,
		name: 'Screens and controls',
		heroLine:
			'pages, forms, and tables that people use directly, and that agents can read and describe where the application allows it.',
		scopeCopy:
			'The pages, forms, and tables people use, documented one by one. On pages that allow it, an agent can read and operate the same controls in the browser.',
		packages: screensAndControlsPackages,
		chips: chipsFor(screensAndControlsPackages)
	}
];

export const layerNames: string[] = appLayers.map((entry) => entry.name);
