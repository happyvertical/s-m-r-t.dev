/**
 * Group selection on the map (#373). A section's everyday set is the features
 * flagged `everyday`; clicking the section toggles that set, and clicking it
 * again with the whole set on clears every feature of the section, niche ones
 * included. Unmapped features take part like any other: they are selected but
 * `splitSelection` keeps them out of the BUILD count.
 */

import { featuresInSection, type FeatureSectionId } from '$lib/data/features';

export function everydayIds(section: FeatureSectionId): string[] {
	return featuresInSection(section)
		.filter((feature) => feature.everyday)
		.map((feature) => feature.id);
}

/** True when every everyday feature of the section is selected. */
export function isSetOn(
	selected: { has(_id: string): boolean },
	section: FeatureSectionId
): boolean {
	const ids = everydayIds(section);
	return ids.length > 0 && ids.every((id) => selected.has(id));
}

/** The selection after toggling the section's everyday set. */
export function toggleSet(selected: Iterable<string>, section: FeatureSectionId): string[] {
	const next = new Set(selected);
	if (isSetOn(next, section)) {
		for (const feature of featuresInSection(section)) next.delete(feature.id);
	} else {
		for (const id of everydayIds(section)) next.add(id);
	}
	return [...next];
}
