<script lang="ts">
	const components = [
		{
			name: 'ProgressBar',
			href: '/components/feedback/progress-bar',
			description: 'Visual progress indicator with status-based coloring.'
		},
		{
			name: 'ConfirmDialog',
			href: '/components/feedback/confirm-dialog',
			description: 'Modal confirmation dialog for destructive actions.'
		},
		{
			name: 'Modal',
			href: '/components/feedback/modal',
			description: 'Accessible dialog component with multiple sizes.'
		}
	];
</script>

<svelte:head>
	<title>Feedback Components | s-m-r-t</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>Feedback</span>
	</nav>

	<h1>Feedback Components</h1>
	<p class="lead">
		User feedback components for progress indication, confirmations, and modal dialogs. Essential
		for interactive applications.
	</p>

	<section class="install">
		<h2>Installation</h2>
		<pre><code>npm install @happyvertical/smrt-ui</code></pre>
		<pre><code
				>{`import { ProgressBar, ConfirmDialog, Modal } from '@happyvertical/smrt-ui';`}</code
			></pre>
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
	.components {
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.components {
		border-bottom: none;
	}

	h2 {
		font-size: 1.1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 16px;
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

	@media (max-width: 800px) {
		.component-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
