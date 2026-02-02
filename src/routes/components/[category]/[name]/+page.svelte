<script lang="ts">
	import { page } from '$app/stores';
	import { getCategoryBySlug, getComponentBySlug } from '$lib/data/components';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const category = $derived(getCategoryBySlug($page.params.category));
	const component = $derived(getComponentBySlug($page.params.category, $page.params.name));
</script>

<svelte:head>
	<title>{component?.name ?? 'Component'} | s-m-r-t Components</title>
</svelte:head>

{#if component && category}
	<article class="prose">
		<nav class="breadcrumb">
			<a href="/components">Components</a>
			<span>/</span>
			<a href="/components/{category.slug}">{category.name}</a>
			<span>/</span>
			<span>{component.name}</span>
		</nav>

		<h1>{component.name}</h1>
		<p class="lead">{component.description}</p>

		<h2>Installation</h2>
		<CodeBlock
			code={`import { ${component.name} } from '@happyvertical/smrt-svelte';`}
			language="typescript"
		/>

		<h2>Example</h2>
		<div class="example-placeholder">
			<p>Live example coming soon.</p>
			<p class="hint">
				See the <a href="https://github.com/happyvertical/svelte" target="_blank" rel="noopener">
					smrt-svelte repository
				</a> for usage examples.
			</p>
		</div>

		<h2>Props</h2>
		<p class="props-note">
			Props documentation is generated from TypeScript types. See the component source for full type
			definitions.
		</p>
	</article>
{:else}
	<article class="prose">
		<h1>Component Not Found</h1>
		<p>The requested component could not be found.</p>
		<a href="/components">Back to Components</a>
	</article>
{/if}

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: #666;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--color-accent);
	}

	.breadcrumb span:not(:last-child) {
		color: #ccc;
	}

	.prose h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--color-grid);
	}

	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}

	.example-placeholder {
		padding: 48px;
		background: #fafafa;
		border: 1px solid var(--color-grid);
		border-radius: 4px;
		text-align: center;
	}

	.example-placeholder p {
		margin: 0 0 8px;
		color: #666;
	}

	.example-placeholder .hint {
		font-size: 0.85rem;
	}

	.example-placeholder a {
		color: var(--color-accent);
	}

	.props-note {
		color: #666;
		font-size: 0.9rem;
	}
</style>
