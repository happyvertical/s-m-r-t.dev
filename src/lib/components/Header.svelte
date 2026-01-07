<script lang="ts">
	import Grid from './Grid.svelte';
</script>

<header>
	<Grid>
		<div class="branding">s-m-r-t</div>
	</Grid>
</header>

<style>
	header {
		padding: 24px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.branding {
		font-family: var(--font-mono);
		font-weight: bold;
		font-size: 1.5rem;
		color: var(--color-text);
		text-decoration: none;
	}
</style>