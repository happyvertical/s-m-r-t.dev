<script lang="ts">
	import PackageWorkbench from '$lib/components/PackageWorkbench.svelte';
	let { data } = $props();
</script>

<PackageWorkbench pkg={data.pkg} backHref="/reference/packages" />
