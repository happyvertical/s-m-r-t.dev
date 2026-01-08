<script lang="ts">
	import { getCategory } from '$lib/data/components';

	const category = getCategory('users');
</script>

<svelte:head>
	<title>Users Components | s-m-r-t</title>
</svelte:head>

{#if category}
	<article class="prose">
		<h1>{category.name}</h1>
		<p class="lead">{category.description}</p>

		<div class="component-grid">
			{#each category.components as component}
				<a href="/components/users/{component.slug}" class="component-card">
					<h3>{component.name}</h3>
					<p>{component.description}</p>
				</a>
			{/each}
		</div>
	</article>
{/if}

<style>
	.prose h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 48px;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
	}

	.component-card {
		display: block;
		padding: 24px;
		border: 1px solid var(--color-grid);
		border-radius: 4px;
		text-decoration: none;
		color: var(--color-text);
		transition: all 0.15s ease;
	}

	.component-card:hover {
		border-color: var(--color-accent);
		transform: translateY(-2px);
	}

	.component-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 8px;
	}

	.component-card p {
		font-size: 0.9rem;
		color: #666;
		margin: 0;
		line-height: 1.5;
	}
</style>
