/**
 * Linear reading order for the documentation.
 *
 * The sidebar already expresses the intended path through the site — Getting
 * started, Application foundations, Capabilities, Packages and tools, then
 * Reference. Flattening `docsNavigation` in place turns that into a track, so
 * prev/next can never disagree with the sidebar it is derived from.
 *
 * Package pages are not sidebar entries, so they get their own track over the
 * package catalog, in the category order `/packages` displays.
 */
import { docsNavigation } from '$lib/data/navigation';
import { packageCategories, packages } from '$lib/data/packages';

export interface TrackStep {
	label: string;
	href: string;
	/** Group or category the step belongs to, shown as a caption. */
	caption: string;
}

export interface TrackNeighbors {
	/** Accessible name for the prev/next navigation landmark. */
	track: string;
	prev?: TrackStep;
	next?: TrackStep;
}

/** Trailing slashes and query strings must not break a lookup. */
function normalize(pathname: string): string {
	const [path] = pathname.split(/[?#]/);
	if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
	return path;
}

/**
 * Sidebar items with a `#` fragment are in-page sections of a page that is
 * already on the track, not pages of their own — walking them would send
 * prev/next in circles, so the track keeps only whole pages.
 */
export const docsTrack: TrackStep[] = docsNavigation.flatMap((group) =>
	group.items
		.filter((item) => !item.href.includes('#'))
		.map((item) => ({ label: item.label, href: item.href, caption: group.label }))
);

export const packageTrack: TrackStep[] = packageCategories.flatMap((category) =>
	packages
		.filter((pkg) => pkg.category === category)
		.map((pkg) => ({ label: pkg.name, href: `/packages/${pkg.slug}`, caption: category }))
);

function neighborsIn(track: TrackStep[], href: string, label: string): TrackNeighbors | null {
	const normalizedHref = normalize(href);
	const index = track.findIndex((step) => normalize(step.href) === normalizedHref);
	if (index === -1) return null;
	return { track: label, prev: track[index - 1], next: track[index + 1] };
}

/** Neighbours for a page that appears in the documentation sidebar. */
export function trackNeighbors(pathname: string): TrackNeighbors | null {
	return neighborsIn(docsTrack, normalize(pathname), 'Documentation');
}

/** Neighbours for a package page, walking the catalog in category order. */
export function packageNeighbors(slug: string): TrackNeighbors | null {
	return neighborsIn(packageTrack, `/packages/${slug}`, 'Package catalog');
}
