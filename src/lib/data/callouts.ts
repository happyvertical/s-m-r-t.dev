/**
 * Callout data contract.
 *
 * Content in `$lib/data/*` declares callouts as plain data; `Callout.svelte`
 * renders them. Keeping the type and the labels here means the guide, reference,
 * and package data files never import a component.
 */

export type CalloutVariant = 'note' | 'warning' | 'security' | 'deprecated' | 'version-added';

export interface GuideCallout {
	variant: CalloutVariant;
	/** Optional heading shown beside the variant label. */
	title?: string;
	body: string;
}

export const calloutVariantLabels: Record<CalloutVariant, string> = {
	note: 'Note',
	warning: 'Warning',
	security: 'Security',
	deprecated: 'Deprecated',
	'version-added': 'Version added'
};
