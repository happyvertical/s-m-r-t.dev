<script lang="ts">
	import { ThemeSwitcher, ColorSchemeToggle } from '@happyvertical/smrt-svelte/themes';
</script>

<header>
	<div class="header-content">
		<a href="/" class="branding">s-m-r-t</a>
		<nav>
			<a href="/docs">Docs</a>
			<a href="/components">Components</a>
			<a href="/modules">Modules</a>
			<a href="/themes">Themes</a>
			<a href="/reference">Reference</a>
			<a href="/faq">FAQ</a>
			<a href="https://github.com/happyvertical/smrt" target="_blank" rel="noopener noreferrer" class="github-link" aria-label="GitHub">
				<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
					<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
				</svg>
			</a>
		</nav>
		<div class="theme-controls">
			<ThemeSwitcher variant="select" showIcons={true} label="" />
			<ColorSchemeToggle variant="switch" showLabels={false} />
		</div>
	</div>
</header>

<style>
	header {
		padding: 16px 24px;
		border-bottom: 1px solid var(--smrt-color-outline, #e5e5e5);
		background: var(--smrt-color-surface, #ffffff);
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.branding {
		font-family: var(--smrt-font-family-mono, monospace);
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
		font-weight: 500;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		transition: color 0.2s;
	}

	nav a:hover {
		color: var(--smrt-color-primary, #1976d2);
	}

	.github-link {
		display: flex;
		align-items: center;
	}

	.theme-controls {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	/* Style overrides for SMRT components */
	:global(.smrt-theme-switcher.select) {
		display: flex;
		align-items: center;
	}

	:global(.smrt-theme-switcher__select) {
		padding: 6px 12px;
		border: 1px solid var(--smrt-color-outline, #e5e5e5);
		border-radius: var(--smrt-shape-small, 6px);
		background: var(--smrt-color-surface, #ffffff);
		color: var(--smrt-color-on-surface, #1a1a1a);
		font-size: 0.875rem;
		cursor: pointer;
	}

	:global(.smrt-theme-switcher__select:hover) {
		border-color: var(--smrt-color-primary, #1976d2);
	}

	@media (max-width: 900px) {
		.header-content {
			flex-wrap: wrap;
		}

		nav {
			order: 3;
			width: 100%;
			justify-content: center;
			padding-top: 16px;
			border-top: 1px solid var(--smrt-color-outline, #e5e5e5);
		}
	}

	@media (max-width: 600px) {
		.header-content {
			flex-direction: column;
			gap: 16px;
		}

		nav {
			order: 0;
			flex-wrap: wrap;
			border-top: none;
			padding-top: 0;
		}

		.theme-controls {
			width: 100%;
			justify-content: center;
		}
	}
</style>
