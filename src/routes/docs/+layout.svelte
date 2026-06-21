<script lang="ts">
	import DocsShell from '$lib/components/DocsShell.svelte';
	import '$lib/styles/prose.css';

	let { children } = $props();
</script>

<DocsShell sectionId="docs">
	{@render children()}
</DocsShell>
