<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	let { data } = $props();
</script>

<Grid>
	<article class="doc-content">
		{#if data.doc.metadata.title}
			<h1>{data.doc.metadata.title}</h1>
		{/if}

		<div class="prose">
			{@html data.doc.html}
		</div>
	</article>
</Grid>

<style>
	.doc-content {
		grid-column: 3 / 11; /* Center column for sparse Swiss look */
		padding: 48px 0;
	}

	.prose :global(h1) {
		font-size: 2.5rem;
		margin-bottom: 2rem;
		font-weight: 600;
	}

	.prose :global(h2) {
		font-size: 1.8rem;
		margin-top: 2.5rem;
		margin-bottom: 1.2rem;
		border-bottom: 1px solid var(--color-grid);
		padding-bottom: 0.5rem;
		font-weight: 600;
	}

	.prose :global(p) {
		margin-bottom: 1.2rem;
		font-size: 1.1rem;
		line-height: 1.6;
	}

	.prose :global(pre) {
		background: #f8f8f8;
		padding: 1.5rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 2rem 0;
		font-family: var(--font-mono);
		border: 1px solid var(--color-grid);
	}

	.prose :global(code) {
		font-family: var(--font-mono);
		background: #f0f0f0;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.9em;
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}

	.prose :global(li) {
		margin-bottom: 0.5rem;
	}
</style>
