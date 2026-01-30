<script lang="ts">
	import Grid from './Grid.svelte';
	import { ThemeSwitcher, ColorSchemeToggle } from '@happyvertical/smrt-svelte/themes';
</script>

<header>
	<Grid>
		<div class="header-content">
			<a href="/" class="branding">s-m-r-t</a>
			<nav>
				<a href="/docs">Docs</a>
				<a href="/components">Components</a>
				<a href="/modules">Modules</a>
				<a href="/reference">Reference</a>
				<a href="/faq">FAQ</a>
				<a href="/themes">Themes</a>
			</nav>
			<div class="theme-controls">
				<ColorSchemeToggle variant="buttons" showLabels={false} />
			</div>
		</div>
	</Grid>
</header>

<style>
	header {
		padding: 24px 0;
		border-bottom: 1px solid var(--smrt-color-outline, #e5e5e5);
		background: var(--smrt-color-surface, #ffffff);
	}

	.header-content {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
	}

	.branding {
		font-family: var(--font-mono, monospace);
		font-weight: bold;
		font-size: 1.5rem;
		color: var(--smrt-color-on-surface, #1a1a1a);
		text-decoration: none;
		white-space: nowrap;
	}

	nav {
		display: flex;
		gap: 24px;
		flex: 1;
		justify-content: center;
	}

	nav a {
		text-decoration: none;
		color: var(--smrt-color-on-surface, #1a1a1a);
		font-family: var(--smrt-font-family, sans-serif);
		font-weight: 500;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: color 0.2s;
	}

	nav a:hover {
		color: var(--smrt-color-primary, #e63946);
	}

	.theme-controls {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	@media (max-width: 900px) {
		.header-content {
			flex-wrap: wrap;
		}

		nav {
			order: 3;
			width: 100%;
			justify-content: flex-start;
			border-top: 1px solid var(--smrt-color-outline, #e5e5e5);
			padding-top: 16px;
			margin-top: 16px;
		}
	}

	@media (max-width: 700px) {
		.header-content {
			flex-direction: column;
			align-items: stretch;
			gap: 16px;
		}

		nav {
			order: 0;
			border-top: none;
			padding-top: 0;
			margin-top: 0;
			flex-wrap: wrap;
			gap: 16px;
		}

		.theme-controls {
			justify-content: flex-end;
		}
	}
</style>
