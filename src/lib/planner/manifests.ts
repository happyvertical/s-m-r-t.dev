import type { CookbookManifest } from '@happyvertical/smrt-svelte/cookbook';

/**
 * The installed packages that declare recipes, loaded on demand: the planner
 * shell reads their model descriptions and exposure. Literal specifiers keep
 * each manifest a separate chunk that only `/planner` fetches.
 */
export async function loadInstalledManifests(): Promise<CookbookManifest[]> {
	const modules = await Promise.all([
		import('@happyvertical/smrt-analytics/manifest.json'),
		import('@happyvertical/smrt-assets/manifest.json'),
		import('@happyvertical/smrt-chat/manifest.json'),
		import('@happyvertical/smrt-commerce/manifest.json'),
		import('@happyvertical/smrt-events/manifest.json'),
		import('@happyvertical/smrt-fields/manifest.json'),
		import('@happyvertical/smrt-ledgers/manifest.json'),
		import('@happyvertical/smrt-messages/manifest.json'),
		import('@happyvertical/smrt-profiles/manifest.json'),
		import('@happyvertical/smrt-projects/manifest.json'),
		import('@happyvertical/smrt-reports/manifest.json'),
		import('@happyvertical/smrt-users/manifest.json')
	]);
	return modules.map((module) => module.default as CookbookManifest);
}
