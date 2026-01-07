<script lang="ts">
	let { children } = $props();
</script>

<div class="grid-container">
	{@render children?.()}
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-columns: repeat(var(--grid-columns), 1fr);
		gap: var(--grid-gap);
		max-width: var(--container-width);
		margin: 0 auto;
		padding: 0 var(--grid-gap);
	}
</style>