<script lang="ts">
	import GuidePage from '$lib/components/GuidePage.svelte';
	import ReferenceFamilyBar from '$lib/components/ReferenceFamilyBar.svelte';
	import { referenceFamilyForSlug } from '$lib/data/reference-families';
	let { data } = $props();
	const family = $derived(referenceFamilyForSlug(data.guide.slug));
</script>

<ReferenceFamilyBar id={family?.id ?? 'api'} />
<GuidePage guide={data.guide} backHref="/reference" backLabel="Reference" />
