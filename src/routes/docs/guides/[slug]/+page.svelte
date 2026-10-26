<script lang="ts">
	import GuidePage from '$lib/components/GuidePage.svelte';
	let { data } = $props();
</script>

<GuidePage guide={data.guide} backHref="/docs/guides" backLabel="Task guides" />
