<script lang="ts">
	import ErrorPage from '$lib/components/ErrorPage.svelte';
</script>

<!-- Prerendered to build/404.html: CloudFront serves it, with status 404, for a
     path that has no object (infra/modules/havesmrt/main.tf). -->
<svelte:head><meta name="robots" content="noindex" /></svelte:head>

<ErrorPage status={404} />
