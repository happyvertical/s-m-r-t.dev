import type { Recipe } from '@happyvertical/smrt-planner/core';
import type {
	CookbookCatalog,
	CookbookManifest,
	CookbookModelInfo,
	CookbookRecipe
} from '@happyvertical/smrt-svelte/cookbook';

/** The pure catalog helpers of `@happyvertical/smrt-svelte/cookbook`, passed in so this module stays free of that barrel (it loads Svelte components and theme CSS). */
export interface CatalogTools {
	catalogFromManifests: (manifests: readonly CookbookManifest[]) => CookbookCatalog;
	packageIdOf: (packageName: string) => string;
}

/**
 * The catalog the planner's shell resolves cookbooks against.
 *
 * Recipes come from the planner's own library (`@happyvertical/smrt-planner/core`),
 * not from the installed manifests: the planner also knows recipes of packages
 * this site does not install (`inventory.stock`, `products.*`, `sales.pipeline`,
 * `comments.records`, `tags.taxonomy`), and a plan that names one must still
 * produce its navigation section here. Model details come from the installed
 * manifests where there is one, and are derived from the recipe's own model
 * names otherwise, so every recipe's entries resolve.
 */
export function buildPlannerCatalog(
	recipes: readonly Recipe[],
	manifests: readonly CookbookManifest[],
	tools: CatalogTools
): CookbookCatalog {
	const installed = tools.catalogFromManifests(manifests);
	const models = new Map<string, CookbookModelInfo>();
	for (const model of installed.models) models.set(model.id, model);

	const catalogRecipes: CookbookRecipe[] = recipes.map((recipe) => ({
		id: recipe.id,
		label: recipe.label,
		nav: recipe.nav,
		models: recipe.models,
		...(recipe.group ? { group: recipe.group } : {}),
		...(recipe.section ? { section: recipe.section } : {}),
		...(recipe.requires ? { requires: recipe.requires } : {}),
		...(recipe.requiresAny ? { requiresAny: recipe.requiresAny } : {})
	}));

	for (const recipe of recipes) {
		const described = new Map(recipe.nav.map((entry) => [entry.model, entry.description]));
		for (const id of recipe.models) {
			if (models.has(id)) continue;
			const separator = id.lastIndexOf(':');
			if (separator < 0) continue;
			const packageName = id.slice(0, separator);
			const name = id.slice(separator + 1);
			const description = described.get(id);
			models.set(id, {
				id,
				name,
				packageId: tools.packageIdOf(packageName),
				...(description ? { description } : {}),
				exposed: true
			});
		}
	}

	return { recipes: catalogRecipes, models: [...models.values()] };
}
