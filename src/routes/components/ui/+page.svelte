<script lang="ts">
	const components = [
		{
			name: 'Button',
			href: '/components/ui/button',
			description: 'Interactive button with multiple variants and sizes. Supports links.'
		},
		{
			name: 'Badge',
			href: '/components/ui/badge',
			description: 'Small status indicator with semantic color variants.'
		},
		{
			name: 'Card',
			href: '/components/ui/card',
			description: 'Container for grouping related content with header and footer slots.'
		},
		{
			name: 'Pagination',
			href: '/components/ui/pagination',
			description: 'Page navigation controls with intelligent ellipsis handling.'
		}
	];
</script>

<svelte:head>
	<title>UI Components | s-m-r-t</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>UI</span>
	</nav>

	<h1>UI Components</h1>
	<p class="lead">
		Core UI primitives for building interfaces. These components provide the building blocks for
		buttons, badges, cards, and navigation.
	</p>

	<section class="install">
		<h2>Installation</h2>
		<pre><code>npm install @happyvertical/smrt-svelte</code></pre>
		<pre><code>{`import { Button, Badge, Card, Pagination } from '@happyvertical/smrt-svelte';`}</code></pre>
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

	<section class="design">
		<h2>Design System</h2>
		<p>
			All UI components follow Material Design 3 principles with custom theming support. They use
			CSS custom properties for easy customization.
		</p>

		<div class="design-grid">
			<div class="design-card">
				<h3>Variants</h3>
				<p>Components support multiple visual variants like primary, secondary, and ghost styles.</p>
			</div>
			<div class="design-card">
				<h3>Sizes</h3>
				<p>Consistent sizing scale with small, medium, and large options.</p>
			</div>
			<div class="design-card">
				<h3>States</h3>
				<p>Interactive states including hover, focus, active, and disabled.</p>
			</div>
			<div class="design-card">
				<h3>Accessibility</h3>
				<p>ARIA attributes, keyboard navigation, and focus indicators built-in.</p>
			</div>
		</div>
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
	.design {
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.design {
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

	.design-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.design-card {
		padding: 20px;
		background: #fafafa;
	}

	.design-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.design-card p {
		font-size: 0.85rem;
		color: #666;
		line-height: 1.5;
	}

	@media (max-width: 800px) {
		.component-grid,
		.design-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
