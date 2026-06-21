/**
 * Shared types for the landing-page section components.
 *
 * Kept in a plain .ts module (rather than exported from a `.svelte` instance
 * script) so both the section components and `+page.svelte` can import the
 * type cleanly without `<script module>` export gymnastics.
 */

/** A single card in a {@link CardRow}: icon + title + body, optional tags. */
export type LandingCard = {
	title: string;
	body: string;
	/** Inline SVG path data for a 24x24 stroked icon. */
	iconPath?: string;
	/** Optional monospace tags shown under the body (e.g. provider names). */
	tags?: string[];
};
