<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	// @ts-ignore - Types might not be picked up immediately
	import { StatusBadge } from '@happyvertical/smrt-svelte';
</script>

<Grid>
	<h1>Components</h1>
	
	<section>
		<h2>Status Badge</h2>
		<div class="examples">
			<StatusBadge status="active" label="Active" />
			<StatusBadge status="inactive" label="Inactive" />
			<StatusBadge status="warning" label="Warning" />
		</div>
	</section>
</Grid>

<style>
	h1 {
		grid-column: 1 / -1;
		font-family: var(--font-mono);
		font-size: 2rem;
		margin-bottom: 2rem;
	}
	
	section {
		grid-column: 1 / -1;
		margin-bottom: 2rem;
	}
	
	h2 {
		font-family: var(--font-sans);
		font-size: 1.5rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--color-grid);
	}
	
	.examples {
		display: flex;
		gap: 1rem;
	}
</style>