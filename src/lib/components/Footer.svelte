<script lang="ts">
	import Grid from './Grid.svelte';
</script>

<footer role="contentinfo">
	<Grid>
		<div class="footer-content">
			<div class="brand">
				<span class="name" aria-label="SMRT Framework">s-m-r-t</span>
				<span class="tagline">Your agent's favorite typescript framework</span>
			</div>
			<nav role="navigation" aria-label="Footer navigation">
				<a href="/docs">Docs</a>
				<a href="/components">Components</a>
				<a href="/modules">Modules</a>
				<a href="https://github.com/happyvertical/smrt" target="_blank" rel="noopener noreferrer" aria-label="SMRT Framework on GitHub (opens in new tab)">GitHub</a>
			</nav>
		</div>
	</Grid>
</footer>

<style>
	footer {
		margin-top: auto;
		padding: 48px 0;
		border-top: 1px solid var(--color-grid);
		background: #fafafa;
	}

	.footer-content {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.brand {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.name {
		font-family: var(--font-mono);
		font-weight: bold;
		font-size: 1.1rem;
	}

	.tagline {
		font-size: 0.85rem;
		color: #666;
	}

	nav {
		display: flex;
		gap: 24px;
	}

	nav a {
		font-size: 0.9rem;
		color: #666;
		text-decoration: none;
	}

	nav a:hover {
		color: var(--color-text);
	}

	@media (max-width: 600px) {
		.footer-content {
			flex-direction: column;
			gap: 24px;
		}
	}
</style>
