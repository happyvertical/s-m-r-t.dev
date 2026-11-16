/**
 * The site's doors, written once.
 *
 * Two lists share this module so no page repeats a label or a path by hand:
 *  - `doors`: the three places the demo map leads (BUILD, FEATURES, DOCS), read
 *    by the demo route, its controls and the map's hub.
 *  - `primaryLinks`: the site header, in order: Docs, Features, Tools, Demo.
 */

/** build-a-boilerplate keeps its URL; it is listed under `/tools`. */
export const BUILD_PATH = '/build-a-boilerplate';
export const FEATURES_PATH = '/features';
export const DOCS_PATH = '/docs';
export const TOOLS_PATH = '/tools';
export const DEMO_PATH = '/demo';

export interface Door {
	id: 'build' | 'features' | 'docs';
	label: string;
	note: string;
	href: string;
	/** The one door drawn as the call to action. */
	hot: boolean;
}

export const doors: readonly Door[] = [
	{ id: 'build', label: 'Build', note: 'build-a-boilerplate', href: BUILD_PATH, hot: true },
	{ id: 'features', label: 'Features', note: 'showcases', href: FEATURES_PATH, hot: false },
	{ id: 'docs', label: 'Docs', note: 'for developers and agents', href: DOCS_PATH, hot: false }
];

export function getDoor(id: Door['id']): Door {
	const door = doors.find((candidate) => candidate.id === id);
	if (!door) throw new Error(`Door not found: ${id}`);
	return door;
}

export interface PrimaryLink {
	label: string;
	href: string;
}

/** The header navigation, in order. */
export const primaryLinks: readonly PrimaryLink[] = [
	{ label: 'Docs', href: DOCS_PATH },
	{ label: 'Features', href: FEATURES_PATH },
	{ label: 'Tools', href: TOOLS_PATH },
	{ label: 'Demo', href: DEMO_PATH }
];
