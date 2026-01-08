<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
</script>

<Grid>
	<div class="hero">
		<h1>The smarter way to build AI agents.</h1>
		<p>Adaptable through abstraction. Brief by design. Scale from startup to enterprise without refactoring.</p>
		<div class="cta">
			<a href="/docs/bits">Get Started</a>
		</div>
	</div>
</Grid>

<style>
	.hero {
		grid-column: 1 / -1;
		padding: 100px 0;
	}
	
	h1 {
		font-size: 4rem;
		line-height: 1.1;
		margin-bottom: 2rem;
		font-weight: 600;
	}
	
	p {
		font-size: 1.5rem;
		max-width: 600px;
		margin-bottom: 3rem;
	}
	
	.cta a {
		display: inline-block;
		padding: 12px 24px;
		background: var(--color-text);
		color: var(--color-bg);
		text-decoration: none;
		font-weight: 600;
		border-radius: 4px;
	}
</style>