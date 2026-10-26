<script lang="ts">
	import BlockPage from '$lib/components/BlockPage.svelte';
	let { data } = $props();
</script>

<BlockPage block={data.block} />
