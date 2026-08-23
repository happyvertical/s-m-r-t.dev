<script lang="ts">
	import { PlaygroundHost } from '@happyvertical/smrt-playground/svelte';
	import type { SmrtPlaygroundModule } from '@happyvertical/smrt-playground';

	interface Props {
		modules: SmrtPlaygroundModule[];
		compact?: boolean;
		standalone?: boolean;
	}
	let { modules, compact = false, standalone = false }: Props = $props();
</script>

<div class:compact class:standalone class="playground-embed">
	<PlaygroundHost
		{modules}
		title="s-m-r-t playground"
		subtitle="Package-owned components and working views"
	/>
</div>

<style>
	.playground-embed {
		min-height: 720px;
		border: 1px solid var(--site-line-strong);
		border-radius: 9px;
		background: var(--site-surface);
		overflow: hidden;
	}
	.playground-embed.compact {
		min-height: 620px;
	}
	.playground-embed.standalone {
		min-height: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
	}
	.playground-embed :global(.playground-shell) {
		min-height: inherit;
	}
</style>
