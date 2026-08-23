<script lang="ts">
	import { PlaygroundHost } from '@happyvertical/smrt-playground/svelte';
	import type { SmrtPlaygroundModule } from '@happyvertical/smrt-playground';

	interface Props {
		modules: SmrtPlaygroundModule[];
		compact?: boolean;
		selectedEntryId?: string | null;
	}
	let { modules, compact = false, selectedEntryId = null }: Props = $props();
</script>

<div class:compact class="playground-embed">
	<PlaygroundHost
		{modules}
		{selectedEntryId}
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
	.playground-embed :global(.playground-shell) {
		min-height: inherit;
	}
</style>
