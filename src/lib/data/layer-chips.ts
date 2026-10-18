import type { AppLayer } from '$lib/data/layers';

/**
 * The example chips each homepage `#scope` band shows, chosen by hand.
 *
 * `layers.ts` derives every layer's full membership from `packages.ts`, and
 * that stays the source of the counts. But a band that lists every building
 * block as a `smrt-` short name is a wall of internals, so the band shows a
 * curated handful instead and an "all {N} →" link carries the generated count
 * into the catalog.
 *
 * Selection rule: pick the packages a non-technical reader would recognise as
 * something an application *has* — customers, invoices, projects, reports, an
 * assistant — and label each with that plain word rather than its package
 * name. Prefer breadth across what the layer covers over the packages most
 * central to the framework. Six to eight per layer; a layer with fewer than
 * six packages lists every one of them. Infrastructure that only a developer
 * would name (types, scanner, the MCP transport bridges) stays out.
 *
 * `layer-chips.test.ts` holds every slug here to a real package in its layer
 * and keeps the counts inside that rule.
 */

export interface CuratedChip {
	slug: string;
	/** Plain-language label, e.g. "Customers & invoices" for `smrt-commerce`. */
	label: string;
}

export interface CuratedLayer {
	/** Matches `AppLayer.id` in `layers.ts`. */
	id: AppLayer['id'];
	chips: CuratedChip[];
}

export const curatedLayerChips: CuratedLayer[] = [
	{
		id: 'foundations',
		chips: [
			{ slug: 'smrt-core', label: 'Records' },
			{ slug: 'smrt-approvals', label: 'Approvals' },
			{ slug: 'smrt-secrets', label: 'Secrets' },
			{ slug: 'smrt-tenancy', label: 'Tenants' },
			{ slug: 'smrt-languages', label: 'Translations' },
			{ slug: 'smrt-features', label: 'Feature flags' },
			{ slug: 'smrt-preferences', label: 'Preferences' },
			{ slug: 'smrt-webhooks', label: 'Webhooks' }
		]
	},
	// Two packages in this layer; both listed.
	{
		id: 'who-can-do-what',
		chips: [
			{ slug: 'smrt-users', label: 'Accounts & roles' },
			{ slug: 'smrt-profiles', label: 'People & organizations' }
		]
	},
	// The band's sentence already names articles, files, images, events,
	// invoices, projects, messages and reports, so the chips lean toward the
	// operations side of the layer rather than repeating that list.
	{
		id: 'building-blocks',
		chips: [
			{ slug: 'smrt-commerce', label: 'Customers & invoices' },
			{ slug: 'smrt-products', label: 'Products' },
			{ slug: 'smrt-inventory', label: 'Inventory' },
			{ slug: 'smrt-ledgers', label: 'Accounting' },
			{ slug: 'smrt-projects', label: 'Projects' },
			{ slug: 'smrt-support', label: 'Support cases' },
			{ slug: 'smrt-expenses', label: 'Expenses' },
			{ slug: 'smrt-reports', label: 'Reports' }
		]
	},
	{
		id: 'agents-included',
		chips: [
			{ slug: 'smrt-agents', label: 'Agents' },
			{ slug: 'smrt-personas', label: 'Personas' },
			{ slug: 'smrt-playbooks', label: 'Playbooks' },
			{ slug: 'smrt-jobs', label: 'Schedules' },
			{ slug: 'smrt-chat', label: 'Assistant' },
			{ slug: 'smrt-app-mcp', label: 'MCP server' }
		]
	},
	// Four packages in this layer; all listed.
	{
		id: 'screens-and-controls',
		chips: [
			{ slug: 'smrt-svelte', label: 'App shell & forms' },
			{ slug: 'smrt-ui', label: 'Controls' },
			{ slug: 'smrt-web', label: 'Browser data' },
			{ slug: 'smrt-playground', label: 'Playground' }
		]
	}
];

/** Lower bound of the 6–8 rule for one layer: six, or the whole layer if it is smaller. */
export function minimumChipCount(layer: AppLayer): number {
	return Math.min(6, layer.packages.length);
}

export const maximumChipCount = 8;

/** The curated chips for a layer, in display order. */
export function curatedChipsFor(layer: AppLayer): CuratedChip[] {
	return curatedLayerChips.find((entry) => entry.id === layer.id)?.chips ?? [];
}
