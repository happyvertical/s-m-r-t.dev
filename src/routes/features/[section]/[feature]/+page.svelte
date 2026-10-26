<script lang="ts">
	import Showcase from '$lib/components/features/Showcase.svelte';
	let { data } = $props();
</script>

<Showcase feature={data.feature} section={data.section} />
