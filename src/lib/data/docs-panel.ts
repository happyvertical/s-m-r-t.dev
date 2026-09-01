/**
 * Derives the whole-site section map that the docs application panel
 * (`DocsPanelSections.svelte`) renders, from the canonical registrations in
 * `navigation.ts`. Nothing here is hand-authored: `documentationSections`
 * supplies each section's identity, landing href, and description;
 * `docsNavigation` supplies every page.
 */
import {
	docsNavigation,
	documentationSections,
	type DocumentationSectionId,
	type NavigationItem
} from '$lib/data/navigation';

export interface DocsPanelSection {
	id: DocumentationSectionId;
	label: string;
	/** Section landing page. */
	href: string;
	description: string;
	/** Every registered page in the section, overview first. */
	items: NavigationItem[];
}

/**
 * `docsNavigation` group labels do not always match section ids or labels
 * (`Home` vs `why`, `Application modules` vs `modules`), so the join is by
 * explicit tuple map rather than by parallel array order. Tuples, not an
 * object literal, so `check:copy` has no property names to classify — these
 * strings are selectors into already-audited data, not new prose.
 */
const groupLabelBySectionId = new Map<DocumentationSectionId, string>([
	['why', 'Home'],
	['framework', 'Framework'],
	['agents', 'Agents'],
	['interaction', 'Interaction'],
	['ui', 'UI'],
	['modules', 'Application modules'],
	['tooling', 'Tooling'],
	['guides', 'Guides'],
	['reference', 'Reference']
]);

function itemsForSection(id: DocumentationSectionId): NavigationItem[] {
	const label = groupLabelBySectionId.get(id);
	const group = docsNavigation.find((candidate) => candidate.label === label);
	if (!group) {
		throw new Error(`Docs panel: no docsNavigation group for section "${id}"`);
	}
	return group.items;
}

export const docsPanelSections: DocsPanelSection[] = documentationSections.map((section) => ({
	id: section.id,
	label: section.label,
	href: section.href,
	description: section.description,
	items: itemsForSection(section.id)
}));

// A docsNavigation group the tuple map above does not know would silently
// drop its pages from the panel; fail the build loudly instead.
const mappedGroupLabels = new Set(groupLabelBySectionId.values());
for (const group of docsNavigation) {
	if (!mappedGroupLabels.has(group.label)) {
		throw new Error(`Docs panel: docsNavigation group "${group.label}" is not mapped to a section`);
	}
}
