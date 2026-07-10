<script lang="ts">
	import GuidePage from '$lib/components/GuidePage.svelte';
	let { data } = $props();
</script>

<GuidePage guide={data.guide} backHref="/foundations" backLabel="Foundations" />
