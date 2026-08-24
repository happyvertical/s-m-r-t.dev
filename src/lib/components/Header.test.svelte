<script lang="ts">
	import { AdminShell } from '@happyvertical/smrt-svelte/workspace';
	import AppTheme from '$lib/components/AppTheme.svelte';
	import Header from '$lib/components/Header.svelte';
	import { createDocsShellState } from '$lib/shell';

	let { pathname = '/' }: { pathname?: string } = $props();
	const shell = createDocsShellState();
</script>

<AppTheme>
	<AdminShell state={shell}>
		{#snippet appBar()}
			<Header {pathname} />
		{/snippet}
		<p>Content</p>
	</AdminShell>
</AppTheme>
