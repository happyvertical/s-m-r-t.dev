<script lang="ts">
	import { AdminShell } from '@happyvertical/smrt-svelte/workspace';
	import { createDocsShellState } from '$lib/shell';
	import UILiveShellState from '$lib/ui-showcase/UILiveShellState.svelte';

	const shell = createDocsShellState({ persist: false });
</script>

<AdminShell state={shell} edgeToggles={{ top: true }}>
	<UILiveShellState />
</AdminShell>
