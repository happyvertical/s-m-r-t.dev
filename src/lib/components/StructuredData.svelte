<script lang="ts">
	interface StructuredDataProps {
		type: 'Organization' | 'SoftwareApplication' | 'Article' | 'WebPage' | 'BreadcrumbList' | 'FAQPage';
		data: Record<string, any>;
	}

	let { type, data }: StructuredDataProps = $props();

	const schema = {
		'@context': 'https://schema.org',
		'@type': type,
		...data
	};
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>
