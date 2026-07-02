<script lang="ts">
	import { Badge } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const badgeProps = [
		{
			name: 'variant',
			type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'",
			default: "'default'",
			description: 'Visual style variant'
		},
		{
			name: 'size',
			type: "'sm' | 'md'",
			default: "'md'",
			description: 'Badge size'
		}
	];
</script>

<svelte:head>
	<title>Badge | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ui">UI</a>
		<span>/</span>
		<span>Badge</span>
	</nav>

	<h1>Badge</h1>
	<p class="lead">
		Small status indicator with color variants. Perfect for labeling, categorizing, or showing
		status information.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Badge } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The default badge style with neutral colors.</p>

	<ComponentExample code={`<Badge>Default</Badge>`}>
		<Badge>Default</Badge>
	</ComponentExample>

	<h2>Variants</h2>
	<p>Choose from semantic color variants for different contexts.</p>

	<ComponentExample
		code={`<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>`}
	>
		<div class="badge-row">
			<Badge variant="default">Default</Badge>
			<Badge variant="primary">Primary</Badge>
			<Badge variant="success">Success</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="error">Error</Badge>
			<Badge variant="info">Info</Badge>
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Two size options: small and medium (default).</p>

	<ComponentExample
		code={`<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>`}
	>
		<div class="badge-row">
			<Badge size="sm">Small</Badge>
			<Badge size="md">Medium</Badge>
		</div>
	</ComponentExample>

	<h2>Use Cases</h2>
	<p>Common patterns for using badges in your application.</p>

	<ComponentExample
		code={`<!-- Status indicators -->
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Expired</Badge>

<!-- Labels and tags -->
<Badge variant="primary">New</Badge>
<Badge variant="info">Featured</Badge>`}
	>
		<div class="badge-row">
			<Badge variant="success">Active</Badge>
			<Badge variant="warning">Pending</Badge>
			<Badge variant="error">Expired</Badge>
			<Badge variant="primary">New</Badge>
			<Badge variant="info">Featured</Badge>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={badgeProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Badge } from '@happyvertical/smrt-svelte';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface Props {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: Snippet;
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

	.badge-row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}
</style>
