<script lang="ts">
	const categories = [
		{
			title: 'Layout',
			description: 'Structure and layout components for building page layouts',
			href: '/components/layout',
			components: [
				{ name: 'Grid', href: '/components/layout/grid', description: 'Responsive grid system' },
				{
					name: 'SummaryCard',
					href: '/components/layout/summary-card',
					description: 'Metric display card'
				}
			]
		},
		{
			title: 'Display',
			description: 'Visual components for displaying information',
			href: '/components/display',
			components: [
				{ name: 'Icon', href: '/components/display/icon', description: 'SVG icon component' },
				{ name: 'Badge', href: '/components/display/badge', description: 'Status and label badges' }
			]
		},
		{
			title: 'Forms',
			description: 'Form components with voice input support',
			href: '/components/forms',
			components: [
				{
					name: 'TextInput',
					href: '/components/forms/text-input',
					description: 'Text input with voice support'
				},
				{
					name: 'SelectInput',
					href: '/components/forms/smrt-select',
					description: 'Dropdown with voice selection'
				},
				{
					name: 'CheckboxInput',
					href: '/components/forms/checkbox',
					description: 'Checkbox with voice control'
				},
				{
					name: 'DateTimeInput',
					href: '/components/forms/datetime',
					description: 'Date/time with natural language'
				},
				{
					name: 'AddressInput',
					href: '/components/forms/address',
					description: 'Address input with parsing'
				},
				{
					name: 'MoneyInput',
					href: '/components/forms/money',
					description: 'Monetary input with cents'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>Components | s-m-r-t Framework</title>
</svelte:head>

<div class="page">
	<header class="page-header">
		<h1>Components</h1>
		<p class="subtitle">UI components for building smrt applications</p>
	</header>

	<div class="categories">
		{#each categories as category}
			<section class="category">
				<div class="category-header">
					<h2>
						<a href={category.href}>{category.title}</a>
					</h2>
					<p>{category.description}</p>
				</div>
				<div class="component-list">
					{#each category.components as component}
						<a href={component.href} class="component-card">
							<h3>{component.name}</h3>
							<p>{component.description}</p>
						</a>
					{/each}
				</div>
			</section>
		{/each}
	</div>

	<section class="installation">
		<h2>Installation</h2>
		<p>All components are available from the smrt-svelte package:</p>
		<pre><code>npm install @happyvertical/smrt-svelte</code></pre>
	</section>

	<section class="usage">
		<h2>Basic Usage</h2>
		<pre><code
				>{`// Generic UI components
import { Button, Card, Badge } from '@happyvertical/smrt-ui';

// smrt-specific components
import { TextInput } from '@happyvertical/smrt-svelte';
import { StatusBadge } from '@happyvertical/smrt-ui';`}</code
			></pre>
	</section>

	<section class="voice">
		<h2>Voice Input</h2>
		<p>
			Form components support voice input in <strong>smrt mode</strong>. Users can speak naturally
			to fill out forms. See individual component pages for voice command examples.
		</p>
	</section>
</div>

<style>
	.page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 48px 24px;
	}

	.page-header {
		margin-bottom: 48px;
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.subtitle {
		color: #666;
		font-size: 1.1rem;
	}

	.categories {
		display: flex;
		flex-direction: column;
		gap: 48px;
		margin-bottom: 64px;
	}

	.category-header {
		margin-bottom: 24px;
	}

	.category-header h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 4px;
	}

	.category-header h2 a {
		color: inherit;
		text-decoration: none;
	}

	.category-header h2 a:hover {
		color: var(--color-accent);
	}

	.category-header p {
		color: #666;
	}

	.component-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;
	}

	.component-card {
		display: block;
		padding: 20px;
		border: 1px solid var(--color-grid, #e5e5e5);
		border-radius: 8px;
		text-decoration: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.component-card:hover {
		border-color: var(--color-accent);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.component-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 4px;
		color: var(--color-text);
	}

	.component-card p {
		font-size: 0.9rem;
		color: #666;
	}

	section {
		margin-bottom: 48px;
	}

	section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	section p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	pre {
		background: #f5f5f5;
		padding: 16px;
		border-radius: 8px;
		overflow-x: auto;
	}

	code {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 0.9em;
	}

	.voice strong {
		color: var(--color-text);
	}
</style>
