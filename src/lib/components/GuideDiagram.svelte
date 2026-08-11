<script lang="ts">
	import type { Guide } from '$lib/data/guides';

	interface Props {
		visual: NonNullable<Guide['visual']>;
	}
	let { visual }: Props = $props();

	const diagrams = {
		'app-model': {
			core: 'Your class',
			caption: 'One object description supports the rest of the application.',
			nodes: ['Database', 'Manifest', 'REST', 'MCP', 'CLI']
		},
		identity: {
			core: 'Membership',
			caption: 'Authentication, product identity, organization, and access remain separate.',
			nodes: ['User', 'Profile', 'Tenant', 'Role', 'Permission']
		},
		tenants: {
			core: 'Tenant',
			caption: 'Organization, user access, and business relationships use different links.',
			nodes: ['Parent / child', 'Membership', 'Role inheritance', 'Profile relationship']
		},
		surfaces: {
			core: 'Manifest',
			caption: 'Each interface reads the same declared model capabilities.',
			nodes: ['REST', 'MCP', 'WebMCP', 'CLI', 'Browser']
		},
		learning: {
			core: 'Agent run',
			caption: 'Useful experience can be reinforced while instruction changes remain reviewable.',
			nodes: ['Recall', 'Strategy', 'Outcome', 'Memory', 'Human approval']
		},
		mobile: {
			core: 'Shared mobile logic',
			caption: 'Shared state and offline behavior sit behind native Android and iOS interfaces.',
			nodes: ['Compose', 'SwiftUI', 'Offline queue', 'Auth', 'Evidence']
		},
		live: {
			core: 'Web collection',
			caption: 'Server rows become a live browser collection without another first fetch.',
			nodes: ['Server load', 'Hydration', 'SSE', 'IndexedDB', 'Sync']
		},
		webmcp: {
			core: 'Page tools',
			caption: 'Browser agents discover model actions that still use the signed-in server session.',
			nodes: ['Manifest', 'JSON Schema', 'WebMCP', 'REST policy']
		},
		'agent-controls': {
			core: 'Form controls',
			caption:
				'An adapter can guide the user or stage a change; confirmed application stays explicit.',
			nodes: ['Describe', 'Highlight', 'Validate', 'Stage', 'Confirm']
		},
		'agent-legibility': {
			core: 'Agent understanding',
			caption:
				'Explicit registries describe the application from source through the active interface.',
			nodes: ['Domain manifest', 'Optional runtime bridge', 'Form controls', 'MCP tools']
		},
		reports: {
			core: 'Report model',
			caption: 'Aggregate questions become stored models with an observable refresh lifecycle.',
			nodes: ['Source rows', 'Compiler', 'Refresh', 'Watermark', 'Schedule']
		},
		shell: {
			core: 'AdminShell',
			caption: 'One responsive workspace separates application, tenant, focus, and system scope.',
			nodes: ['Top', 'Tenant nav', 'Focus tools', 'Activity', 'Settings']
		},
		collections: {
			core: 'list()',
			caption: 'Choose compact projected rows or fully hydrated objects intentionally.',
			nodes: ['Where', 'Order', 'Select', 'Include', 'Cache']
		}
	} as const;

	const diagram = $derived(diagrams[visual]);
</script>

<figure>
	<div class="flow" aria-label={diagram.caption}>
		<strong>{diagram.core}</strong>
		<span class="arrow" aria-hidden="true">→</span>
		<div>
			{#each diagram.nodes as node (node)}<span>{node}</span>{/each}
		</div>
	</div>
	<figcaption>{diagram.caption}</figcaption>
</figure>

<style>
	figure {
		margin: 26px 0 4px;
		padding: 20px;
		border: 1px solid var(--site-line-strong);
		border-radius: 8px;
		background: var(--site-surface);
	}
	.flow {
		display: grid;
		grid-template-columns: 150px 24px 1fr;
		gap: 12px;
		align-items: center;
	}
	.flow > strong {
		padding: 12px;
		border: 1px solid var(--site-accent-strong);
		border-radius: 6px;
		background: var(--site-accent-soft);
		font-size: 0.78rem;
		text-align: center;
	}
	.arrow {
		color: var(--site-accent-strong);
		text-align: center;
	}
	.flow > div {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}
	.flow > div span {
		padding: 7px 9px;
		border: 1px solid var(--site-line-strong);
		border-radius: 5px;
		background: var(--site-paper);
		font: 0.66rem var(--site-font-mono);
	}
	figcaption {
		margin-top: 14px;
		color: var(--site-muted);
		font-size: 0.74rem;
		line-height: 1.5;
	}
	@media (max-width: 600px) {
		.flow {
			grid-template-columns: 1fr;
		}
		.arrow {
			transform: rotate(90deg);
		}
	}
</style>
