<script lang="ts">
	interface SEOProps {
		title: string;
		description: string;
		url?: string;
		image?: string;
		type?: 'website' | 'article';
		article?: {
			publishedTime?: string;
			modifiedTime?: string;
			author?: string;
			section?: string;
			tags?: string[];
		};
	}

	let {
		title,
		description,
		url = 'https://s-m-r-t.dev',
		image = 'https://s-m-r-t.dev/og-image.png',
		type = 'website',
		article
	}: SEOProps = $props();

	const fullTitle = title === 's-m-r-t Framework' ? title : `${title} | s-m-r-t Framework`;
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>{fullTitle}</title>
	<meta name="title" content={fullTitle} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:site_name" content="s-m-r-t Framework" />

	{#if article}
		{#if article.publishedTime}
			<meta property="article:published_time" content={article.publishedTime} />
		{/if}
		{#if article.modifiedTime}
			<meta property="article:modified_time" content={article.modifiedTime} />
		{/if}
		{#if article.author}
			<meta property="article:author" content={article.author} />
		{/if}
		{#if article.section}
			<meta property="article:section" content={article.section} />
		{/if}
		{#if article.tags}
			{#each article.tags as tag}
				<meta property="article:tag" content={tag} />
			{/each}
		{/if}
	{/if}

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={fullTitle} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={image} />

	<!-- Additional SEO -->
	<link rel="canonical" href={url} />
</svelte:head>
