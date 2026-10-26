<script lang="ts">
	import UiComponentReference from '$lib/components/UiComponentReference.svelte';
	let { data } = $props();
</script>

<UiComponentReference component={data.component} />
