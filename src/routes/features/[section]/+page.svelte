<script lang="ts">
	import SectionIndex from '$lib/components/features/SectionIndex.svelte';
	let { data } = $props();
</script>

<SectionIndex section={data.section} />
