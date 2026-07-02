<script lang="ts">
	import { Card, Button, Badge } from '@happyvertical/smrt-ui';
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
			description: 'Content padding size'
		},
		{
			name: 'hoverable',
			type: 'boolean',
			default: 'false',
			description: 'Adds hover effect with elevation'
		},
		{
			name: 'header',
			type: 'Snippet',
			description: 'Content for the card header section'
		},
		{
			name: 'footer',
			type: 'Snippet',
			description: 'Content for the card footer section'
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
		Container for grouping related content with optional header and footer sections. Supports
		multiple visual variants and hover effects.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Card } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>A simple card with default styling.</p>

	<ComponentExample
		code={`<Card>
  <p>This is some card content.</p>
</Card>`}
	>
		<Card>
			<p style="margin: 0;">This is some card content.</p>
		</Card>
	</ComponentExample>

	<h2>Variants</h2>
	<p>Choose from default, outlined, or elevated styles.</p>

	<ComponentExample
		code={`<Card variant="default">Default card</Card>
<Card variant="outlined">Outlined card</Card>
<Card variant="elevated">Elevated card</Card>`}
	>
		<div class="card-grid">
			<Card variant="default">
				<p style="margin: 0;">Default card</p>
			</Card>
			<Card variant="outlined">
				<p style="margin: 0;">Outlined card</p>
			</Card>
			<Card variant="elevated">
				<p style="margin: 0;">Elevated card</p>
			</Card>
		</div>
	</ComponentExample>

	<h2>Padding Sizes</h2>
	<p>Control content padding with the padding prop.</p>

	<ComponentExample
		code={`<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding (default)</Card>
<Card padding="lg">Large padding</Card>`}
	>
		<div class="card-grid">
			<Card padding="none">
				<p style="margin: 0; background: #f5f5f5; padding: 8px;">No padding</p>
			</Card>
			<Card padding="sm">
				<p style="margin: 0;">Small padding</p>
			</Card>
			<Card padding="md">
				<p style="margin: 0;">Medium padding</p>
			</Card>
			<Card padding="lg">
				<p style="margin: 0;">Large padding</p>
			</Card>
		</div>
	</ComponentExample>

	<h2>With Header and Footer</h2>
	<p>Add header and footer sections using snippets.</p>

	<ComponentExample
		code={`<Card>
  {#snippet header()}
    <h3>Card Title</h3>
  {/snippet}

  <p>Main card content goes here.</p>

  {#snippet footer()}
    <Button>Action</Button>
  {/snippet}
</Card>`}
	>
		<Card>
			{#snippet header()}
				<h3 style="margin: 0; font-size: 1.1rem; font-weight: 600;">Card Title</h3>
			{/snippet}

			<p style="margin: 0;">Main card content goes here with supporting text and details.</p>

			{#snippet footer()}
				<Button size="sm">Action</Button>
			{/snippet}
		</Card>
	</ComponentExample>

	<h2>Hoverable</h2>
	<p>Add hover effects for interactive cards.</p>

	<ComponentExample
		code={`<Card hoverable>
  <p>Hover over this card to see the effect.</p>
</Card>`}
	>
		<Card hoverable>
			<p style="margin: 0;">Hover over this card to see the effect.</p>
		</Card>
	</ComponentExample>

	<h2>Real-World Example</h2>
	<p>A product card with header, content, and footer.</p>

	<ComponentExample
		code={`<Card variant="elevated">
  {#snippet header()}
    <div class="product-header">
      <h3>Premium Plan</h3>
      <Badge variant="primary">Popular</Badge>
    </div>
  {/snippet}

  <p>$29/month</p>
  <ul>
    <li>Unlimited users</li>
    <li>Priority support</li>
    <li>Advanced analytics</li>
  </ul>

  {#snippet footer()}
    <Button>Subscribe</Button>
  {/snippet}
</Card>`}
	>
		<Card variant="elevated">
			{#snippet header()}
				<div style="display: flex; justify-content: space-between; align-items: center;">
					<h3 style="margin: 0; font-size: 1.1rem; font-weight: 600;">Premium Plan</h3>
					<Badge variant="primary">Popular</Badge>
				</div>
			{/snippet}

			<p style="font-size: 1.5rem; font-weight: 600; margin: 0 0 16px;">$29/month</p>
			<ul style="margin: 0; padding-left: 20px; color: #666;">
				<li>Unlimited users</li>
				<li>Priority support</li>
				<li>Advanced analytics</li>
			</ul>

			{#snippet footer()}
				<Button>Subscribe</Button>
			{/snippet}
		</Card>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={cardProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Card } from '@happyvertical/smrt-svelte';

type CardVariant = 'default' | 'outlined' | 'elevated';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface Props {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  children?: Snippet;
  header?: Snippet;
  footer?: Snippet;
}`}
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

	.card-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
	}
</style>
