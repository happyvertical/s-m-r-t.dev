<script lang="ts">
	import Grid from './Grid.svelte';
	import { SelectInput } from '@happyvertical/smrt-svelte';
	import { theme, type Theme } from '$lib/stores/theme';

	const themeOptions = [
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' },
		{ value: 'system', label: 'System' }
	];

	function handleThemeChange(value: string) {
		theme.set(value as Theme);
	}
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
				<div class="theme-switcher">
					<SelectInput
						name="theme"
						options={themeOptions}
						value={$theme}
						onchange={handleThemeChange}
					/>
				</div>
			</nav>
		</div>
	</Grid>
</header>

<style>
	header {
		background: var(--smrt-color-surface, white);
		border-bottom: 1px solid var(--color-grid, #e5e5e5);
		padding: 16px 0;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.branding {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--smrt-color-primary, #e63946);
		text-decoration: none;
		letter-spacing: -0.5px;
	}

	.branding:hover {
		opacity: 0.8;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 24px;
	}

	nav a {
		color: var(--color-text, #1a1a1a);
		text-decoration: none;
		font-size: 0.95rem;
		font-weight: 500;
		transition: color 0.2s;
	}

	nav a:hover {
		color: var(--smrt-color-primary, #e63946);
	}

	.theme-switcher {
		width: 120px;
	}

	@media (max-width: 768px) {
		header {
			padding: 12px 0;
		}

		.header-content {
			flex-direction: column;
			gap: 16px;
			align-items: flex-start;
		}

		.branding {
			font-size: 1.25rem;
		}

		nav {
			flex-wrap: wrap;
			gap: 16px;
		}

		.theme-switcher {
			width: 100%;
			margin-top: 8px;
		}
	}
</style>
