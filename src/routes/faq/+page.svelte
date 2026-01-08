<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
</script>

<Grid>
	<h1>Frequently Asked Questions</h1>
	
	<div class="faq-item">
		<h2>What does s-m-r-t stand for?</h2>
		<div class="answer">
			<a href="https://www.youtube.com/watch?v=ls5BFzuxGw4" target="_blank" rel="noopener noreferrer">https://www.youtube.com/watch?v=ls5BFzuxGw4</a>
		</div>
	</div>
</Grid>

<style>
	h1 {
		grid-column: 1 / -1;
		font-family: var(--font-mono);
		font-size: 2rem;
		margin-bottom: 2rem;
	}
	
	.faq-item {
		grid-column: 1 / -1;
		margin-bottom: 2rem;
	}
	
	h2 {
		font-family: var(--font-sans);
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}
	
	.answer a {
		font-family: var(--font-mono);
		color: var(--color-accent);
		text-decoration: none;
	}
</style>