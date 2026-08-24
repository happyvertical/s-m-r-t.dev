<script lang="ts">
	import { AdminShell } from '@happyvertical/smrt-svelte/workspace';
	import { createDocsShellState } from '$lib/shell';
	import UILiveShellState from '$lib/ui-showcase/UILiveShellState.svelte';

	const shell = createDocsShellState();
</script>

<AdminShell state={shell}>
	<UILiveShellState />
</AdminShell>
