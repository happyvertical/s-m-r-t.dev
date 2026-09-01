<script lang="ts">
	import { AdminShell, type ShellState } from '@happyvertical/smrt-svelte/workspace';
	import AppTheme from '$lib/components/AppTheme.svelte';
	import DocsPanelSections from '$lib/components/DocsPanelSections.svelte';

	let {
		pathname = '/',
		hash = '',
		shell
	}: { pathname?: string; hash?: string; shell: ShellState } = $props();
</script>

<AppTheme>
	<AdminShell state={shell}>
		{#snippet appBar()}
			<p>App bar</p>
		{/snippet}
		{#snippet appPanel()}
			<DocsPanelSections {pathname} {hash} />
		{/snippet}
		<p>Content</p>
	</AdminShell>
</AppTheme>
