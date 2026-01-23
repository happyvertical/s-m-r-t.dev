<script lang="ts">
	const components = [
		{
			name: 'ThemeSwitcher',
			href: '/components/theme/theme-switcher',
			description: 'SelectInput-based theme selector supporting light, dark, and system themes.'
		}
	];
</script>

<svelte:head>
	<title>Theme | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>Theme</span>
	</nav>

	<h1>Theme Components</h1>
	<p class="lead">
		Components for managing application appearance. Support light, dark, and system-preference themes
		with automatic persistence and system theme detection.
	</p>

	<section class="install">
		<h2>Installation</h2>
		<pre><code>npm install @happyvertical/smrt-svelte</code></pre>
		<pre><code>{`import { SelectInput } from '@happyvertical/smrt-svelte';
import { theme, applyTheme } from '$lib/stores/theme';`}</code></pre>
	</section>

	<section class="components">
		<h2>Components</h2>
		<div class="component-grid">
			{#each components as component}
				<a href={component.href} class="component-card">
					<h3>{component.name}</h3>
					<p>{component.description}</p>
				</a>
			{/each}
		</div>
	</section>

	<section class="features">
		<h2>Features</h2>
		<div class="feature-grid">
			<div class="feature-card">
				<h3>System Detection</h3>
				<p>Automatically respects the user's OS-level theme preference via prefers-color-scheme.</p>
			</div>
			<div class="feature-card">
				<h3>Persistent Storage</h3>
				<p>Theme preference is saved to localStorage and restored on page load.</p>
			</div>
			<div class="feature-card">
				<h3>CSS Variables</h3>
				<p>Uses CSS custom properties for seamless integration with any component.</p>
			</div>
			<div class="feature-card">
				<h3>No Flash</h3>
				<p>Theme is applied before render to prevent flash of incorrect theme.</p>
			</div>
		</div>
	</section>

	<section class="usage">
		<h2>Quick Start</h2>
		<p>
			Add the theme store to your root layout to apply the theme on mount:
		</p>
		<pre><code>{`<script>
  import { onMount } from 'svelte';
  import { theme, applyTheme } from '$lib/stores/theme';

  onMount(() => {
    // Apply saved theme on mount
    applyTheme($theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if ($theme === 'system') applyTheme('system');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  });
</script>`}</code></pre>
	</section>
</article>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: #666;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--color-accent);
	}

	.breadcrumb span:not(:last-child) {
		color: #ccc;
	}

	.prose h1 {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--color-grid);
	}

	.install,
	.components,
	.features,
	.usage {
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.usage {
		border-bottom: none;
	}

	h2 {
		font-size: 1.1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 16px;
	}

	.prose p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	pre {
		background: #1a1a1a;
		color: #f0f0f0;
		padding: 16px 20px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		margin-bottom: 16px;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.component-card {
		padding: 20px;
		background: #fafafa;
		text-decoration: none;
		transition: all 0.2s;
	}

	.component-card:hover {
		background: #f0f0f0;
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.component-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 8px;
		color: #1a1a1a;
	}

	.component-card:hover h3 {
		color: var(--color-accent);
	}

	.component-card p {
		font-size: 0.85rem;
		color: #666;
		line-height: 1.5;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.feature-card {
		padding: 20px;
		background: #fafafa;
	}

	.feature-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.feature-card p {
		font-size: 0.85rem;
		color: #666;
		line-height: 1.5;
	}

	@media (max-width: 800px) {
		.component-grid,
		.feature-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
