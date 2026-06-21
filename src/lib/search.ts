/**
 * Shared types + open-state store for the global ⌘K command palette (issue #99).
 *
 * The static index is generated at build/prepare time by
 * `scripts/build-search-index.mjs` and served from `/search-index.json`.
 * `CommandPalette.svelte` fetches it once and searches it entirely client-side.
 */
import { writable } from 'svelte/store';

export interface SearchHeading {
	text: string;
	id: string;
	level: 2 | 3;
}

export interface SearchEntry {
	title: string;
	route: string;
	section: string;
	description: string;
	headings: SearchHeading[];
}

export interface SearchIndex {
	generatedAt: string;
	count: number;
	entries: SearchEntry[];
}

/**
 * A single flattened, searchable record. Pages and their individual headings
 * are both records, so a query can land directly on a section anchor.
 */
export interface SearchRecord {
	/** Display label (page title, or heading text). */
	label: string;
	/** Page title, shown as context under heading results. */
	pageTitle: string;
	/** Top-level section, e.g. "Docs", "Modules". */
	section: string;
	/** Full destination URL including any #anchor. */
	href: string;
	/** Lowercased haystack used for matching. */
	haystack: string;
	/** True for page-level records (vs. a heading within a page). */
	isPage: boolean;
}

/** Global store: is the command palette open? Toggled by the Header trigger and ⌘K. */
export const paletteOpen = writable(false);

export function openPalette(): void {
	paletteOpen.set(true);
}

export function closePalette(): void {
	paletteOpen.set(false);
}

/** Flatten the raw index into page + heading records for searching. */
export function flattenIndex(index: SearchIndex): SearchRecord[] {
	const records: SearchRecord[] = [];
	for (const entry of index.entries) {
		records.push({
			label: entry.title,
			pageTitle: entry.title,
			section: entry.section,
			href: entry.route,
			haystack: `${entry.title} ${entry.description} ${entry.section}`.toLowerCase(),
			isPage: true
		});
		for (const h of entry.headings) {
			records.push({
				label: h.text,
				pageTitle: entry.title,
				section: entry.section,
				href: h.id ? `${entry.route}#${h.id}` : entry.route,
				haystack: `${h.text} ${entry.title} ${entry.section}`.toLowerCase(),
				isPage: false
			});
		}
	}
	return records;
}

/**
 * Lightweight subsequence-aware scorer. Every whitespace-delimited term in the
 * query must appear in the record's haystack (AND semantics). Records are then
 * ranked: exact-substring of the label beats subsequence; earlier matches and
 * page-level records rank higher. Returns null when the record doesn't match.
 */
export function scoreRecord(record: SearchRecord, terms: string[]): number | null {
	if (terms.length === 0) return record.isPage ? 1 : 0;
	const label = record.label.toLowerCase();
	let score = 0;
	for (const term of terms) {
		const inHaystack = record.haystack.includes(term);
		if (!inHaystack) return null;
		const idxLabel = label.indexOf(term);
		if (idxLabel === 0) score += 12; // prefix match on the label
		else if (idxLabel > 0) score += 6; // substring match on the label
		else score += 1; // only matched description/section
	}
	// Prefer page-level hits and shorter labels on ties.
	if (record.isPage) score += 2;
	score -= Math.min(label.length, 60) / 60;
	return score;
}
