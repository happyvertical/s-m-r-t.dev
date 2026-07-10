<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="grid-container">
	{@render children?.()}
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-columns: repeat(var(--grid-columns, 12), 1fr);
		gap: var(--grid-gap, 24px);
		width: 100%;
		max-width: var(--container-width, 1200px);
		margin: 0 auto;
		padding: 0 20px;
	}

	@media (max-width: 768px) {
		.grid-container {
			padding: 0 14px;
		}
	}
</style>
