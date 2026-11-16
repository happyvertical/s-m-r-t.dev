<script lang="ts">
	import SiteShell from '$lib/components/SiteShell.svelte';

	let { pathname = '/', hash = '' }: { pathname?: string; hash?: string } = $props();
</script>

<SiteShell {pathname} {hash}>
	<h1>Route content</h1>
</SiteShell>
