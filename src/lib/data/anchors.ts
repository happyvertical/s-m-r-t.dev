/**
 * Anchor ids for in-page headings.
 *
 * `GuidePage` renders section headings with these ids and `search.ts` builds
 * deep links from the same function, so a palette result can never point at an
 * anchor the page does not render.
 */
export function toAnchorId(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}
