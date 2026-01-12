<script lang="ts">
	import { page } from '$app/stores';
	import Grid from '$lib/components/Grid.svelte';
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
	title="Page Not Found"
	description="The page you're looking for doesn't exist. Return to the SMRT Framework documentation homepage."
	url="https://havesmrt.com/404"
	type="website"
/>

<Grid>
	<div class="error-page">
		<h1>{$page.status}</h1>
		<h2>{$page.status === 404 ? 'Page Not Found' : 'Something Went Wrong'}</h2>
		<p class="message">
			{#if $page.status === 404}
				The page you're looking for doesn't exist. It may have been moved or deleted.
			{:else}
				An unexpected error occurred. Please try again later.
			{/if}
		</p>
		<div class="actions">
			<a href="/" class="button primary">Go Home</a>
			<a href="/docs" class="button secondary">Browse Docs</a>
		</div>
	</div>
</Grid>

<style>
	.error-page {
		grid-column: 1 / -1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		text-align: center;
		padding: 48px 24px;
	}

	h1 {
		font-size: 6rem;
		font-weight: 700;
		color: var(--color-accent);
		margin: 0;
		line-height: 1;
	}

	h2 {
		font-size: 2rem;
		font-weight: 600;
		margin: 24px 0 16px;
		color: var(--color-text);
	}

	.message {
		font-size: 1.1rem;
		color: #666;
		max-width: 500px;
		margin: 0 0 32px;
		line-height: 1.6;
	}

	.actions {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.button {
		padding: 12px 24px;
		border-radius: var(--radius-md);
		text-decoration: none;
		font-weight: 600;
		font-size: 1rem;
		transition: all var(--transition-base);
		display: inline-block;
	}

	.button.primary {
		background: var(--color-accent);
		color: white;
	}

	.button.primary:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.button.secondary {
		background: transparent;
		color: var(--color-text);
		border: 2px solid var(--color-grid);
	}

	.button.secondary:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 4rem;
		}

		h2 {
			font-size: 1.5rem;
		}

		.message {
			font-size: 1rem;
		}
	}
</style>
