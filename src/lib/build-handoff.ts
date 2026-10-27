/**
 * The map's selection and its hand-off to build-a-boilerplate (#367).
 *
 * The planner's own URL selection (`?p=`) names packages, not recipes, and the
 * mounted `Planner` does not read it, so a recipe selection cannot travel in
 * it. The site names features in `?features=` instead and the build page
 * switches their recipes on through the planner's public controller
 * (`add_recipes`). The selection itself lives in sessionStorage so a showcase
 * visit and Back keep it.
 */

import { features, getFeature } from '$lib/data/features';

export const BUILD_PATH = '/build-a-boilerplate';
export const FEATURES_PARAM = 'features';
const STORAGE_KEY = 'smrt-map-selection';

const featureIds = new Set(features.map((feature) => feature.id));

/** Known feature ids only, de-duplicated, in the map's own order. */
export function normalizeSelection(ids: Iterable<string>): string[] {
	const wanted = new Set(ids);
	return features.filter((feature) => wanted.has(feature.id)).map((feature) => feature.id);
}

export function buildHref(ids: Iterable<string>): string {
	const selected = normalizeSelection(ids);
	return selected.length ? `${BUILD_PATH}?${FEATURES_PARAM}=${selected.join(',')}` : BUILD_PATH;
}

export function parseFeatures(search: string): string[] {
	const value = new URLSearchParams(search).get(FEATURES_PARAM) ?? '';
	return normalizeSelection(value.split(',').filter((id) => featureIds.has(id)));
}

/** The recipe ids the selected features switch on, once each. */
export function recipesFor(ids: Iterable<string>): string[] {
	const recipes = new Set<string>();
	for (const id of normalizeSelection(ids)) {
		for (const recipe of getFeature(id)?.recipes ?? []) recipes.add(recipe);
	}
	return [...recipes];
}

export function loadSelection(): string[] {
	try {
		const raw = sessionStorage.getItem(STORAGE_KEY);
		const parsed: unknown = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed)
			? normalizeSelection(parsed.filter((id) => typeof id === 'string'))
			: [];
	} catch {
		return [];
	}
}

export function saveSelection(ids: Iterable<string>): void {
	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSelection(ids)));
	} catch {
		// Storage can be blocked; the selection then lasts for the page only.
	}
}

/** A feature the planner can switch on: it has at least one recipe (smrt#4409). */
export function isMappable(id: string): boolean {
	return (getFeature(id)?.recipes.length ?? 0) > 0;
}

/** The selection split by whether the planner has a recipe for each feature. */
export function splitSelection(ids: Iterable<string>): { mapped: string[]; unmapped: string[] } {
	const selected = normalizeSelection(ids);
	return {
		mapped: selected.filter(isMappable),
		unmapped: selected.filter((id) => !isMappable(id))
	};
}

const wordFor = (id: string) => getFeature(id)?.word ?? id;

/** The sentence the landing notice shows; `null` when nothing was selected. */
export function noticeFor(ids: string[]): { on: string | null; off: string | null } {
	const { mapped, unmapped } = splitSelection(ids);
	return {
		on: mapped.length ? `Switched on: ${mapped.map(wordFor).join(', ')}` : null,
		off: unmapped.length ? `Not in the planner yet: ${unmapped.map(wordFor).join(', ')}` : null
	};
}

/** Plain earlier turns for the planner's assistant; the visitor replies next. */
export function seedFor(ids: string[]): {
	id: string;
	messages: { role: 'user' | 'assistant'; content: string }[];
} {
	const { mapped, unmapped } = splitSelection(ids);
	const picked = [...mapped, ...unmapped].map(wordFor).join(', ');
	const parts: string[] = [];
	if (mapped.length) {
		parts.push(
			`The recipes behind ${mapped.map(wordFor).join(', ')} are switched on in your plan.`
		);
	}
	if (unmapped.length) {
		parts.push(
			`The planner has no recipe yet for ${unmapped.map(wordFor).join(', ')}, so ${unmapped.length === 1 ? 'it is' : 'they are'} not in your plan. Say so if it comes up.`
		);
	}
	const total = mapped.length + unmapped.length;
	return {
		id: `map-selection:${ids.join(',')}`,
		messages: [
			{ role: 'user', content: `I picked these features on the SMRT map: ${picked}.` },
			{
				role: 'assistant',
				content: `${parts.join(' ')} Tell me what your app is for and who uses it, and I will ask what I still need to know about ${total === 1 ? 'it' : 'them'}.`
			}
		]
	};
}
