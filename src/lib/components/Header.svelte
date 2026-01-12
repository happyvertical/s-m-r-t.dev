<script lang="ts">
	import Grid from './Grid.svelte';
</script>

<header role="banner">
	<Grid>
		<div class="header-content">
			<a href="/" class="branding" aria-label="s-m-r-t Framework Home">s-m-r-t</a>
			<nav role="navigation" aria-label="Main navigation">
				<a href="/docs">Docs</a>
				<a href="/components">Components</a>
				<a href="/modules">Modules</a>
				<a href="/reference">Reference</a>
				<a href="/faq">FAQ</a>
			</nav>
		</div>
	</Grid>
</header>

<style>
	header {
		padding: 24px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.header-content {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.branding {
		font-family: var(--font-mono);
		font-weight: bold;
		font-size: 1.5rem;
		color: var(--color-text);
		text-decoration: none;
		white-space: nowrap;
	}

	nav {
		display: flex;
		gap: 24px;
	}

	nav a {
		text-decoration: none;
		color: var(--color-text);
		font-family: var(--font-sans);
		font-weight: 500;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	nav a:hover {
		color: var(--color-accent);
	}

	@media (max-width: 700px) {
		.header-content {
			flex-direction: column;
			gap: 16px;
		}

		nav {
			flex-wrap: wrap;
			gap: 16px;
		}
	}
</style>