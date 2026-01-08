<script lang="ts">
	import { Card, Button } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const cardProps = [
		{
			name: 'variant',
			type: "'default' | 'outlined' | 'elevated'",
			default: "'default'",
			description: 'Visual style variant'
		},
		{
			name: 'padding',
			type: "'none' | 'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Content padding'
		},
		{
			name: 'hoverable',
			type: 'boolean',
			default: 'false',
			description: 'Add hover effect with shadow and lift'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Main card content',
			required: true
		},
		{
			name: 'header',
			type: 'Snippet',
			description: 'Optional header slot'
		},
		{
			name: 'footer',
			type: 'Snippet',
			description: 'Optional footer slot'
		}
	];
</script>

<svelte:head>
	<title>Card | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ui">UI</a>
		<span>/</span>
		<span>Card</span>
	</nav>

	<h1>Card</h1>
	<p class="lead">
		A flexible container component with optional header and footer slots, supporting multiple
		variants and hover effects.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Card } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>

	<ComponentExample
		code={`<Card>
  <p>This is a basic card with default styling.</p>
</Card>`}
	>
		<Card>
			<p>This is a basic card with default styling.</p>
		</Card>
	</ComponentExample>

	<h2>Variants</h2>
	<p>
		Cards support three variants: <code>default</code>, <code>outlined</code>, and
		<code>elevated</code>.
	</p>

	<ComponentExample
		code={`<Card variant="default">Default Card</Card>
<Card variant="outlined">Outlined Card</Card>
<Card variant="elevated">Elevated Card</Card>`}
	>
		<div class="card-row">
			<Card variant="default">
				<strong>Default</strong>
				<p>Standard border</p>
			</Card>
			<Card variant="outlined">
				<strong>Outlined</strong>
				<p>Thicker border</p>
			</Card>
			<Card variant="elevated">
				<strong>Elevated</strong>
				<p>With shadow</p>
			</Card>
		</div>
	</ComponentExample>

	<h2>With Header and Footer</h2>
	<p>Use snippet props to add header and footer sections.</p>

	<ComponentExample
		code={`<Card>
  {#snippet header()}
    <h3>Card Title</h3>
  {/snippet}

  <p>Card content goes here.</p>

  {#snippet footer()}
    <Button variant="primary">Action</Button>
  {/snippet}
</Card>`}
	>
		<Card>
			{#snippet header()}
				<h3>Card Title</h3>
			{/snippet}

			<p>Card content goes here. This demonstrates the header and footer slots.</p>

			{#snippet footer()}
				<Button variant="primary" size="sm">Action</Button>
			{/snippet}
		</Card>
	</ComponentExample>

	<h2>Padding</h2>
	<p>Adjust content padding with the <code>padding</code> prop.</p>

	<ComponentExample
		code={`<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>`}
	>
		<div class="card-row">
			<Card padding="sm">
				<strong>Small</strong>
			</Card>
			<Card padding="md">
				<strong>Medium</strong>
			</Card>
			<Card padding="lg">
				<strong>Large</strong>
			</Card>
		</div>
	</ComponentExample>

	<h2>Hoverable</h2>
	<p>Add a hover effect that lifts the card and adds shadow.</p>

	<ComponentExample
		code={`<Card hoverable>
  <p>Hover over me!</p>
</Card>`}
	>
		<Card hoverable>
			<p>Hover over this card to see the lift effect.</p>
		</Card>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={cardProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { CardVariant, CardPadding } from '@happyvertical/svelte';

// CardVariant = 'default' | 'outlined' | 'elevated'
// CardPadding = 'none' | 'sm' | 'md' | 'lg'`}
		language="typescript"
	/>
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

	.prose h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
	}

	.prose p {
		color: #666;
		margin-bottom: 16px;
		line-height: 1.6;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}

	.card-row {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
	}

	.card-row :global(.card) {
		flex: 1;
		min-width: 150px;
	}

	:global(.card) h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}

	:global(.card) p {
		margin: 8px 0 0;
		font-size: 0.9rem;
		color: #666;
	}

	:global(.card) strong {
		font-weight: 600;
	}
</style>
