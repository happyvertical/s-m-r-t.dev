<script lang="ts">
	import { Badge } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const badgeProps = [
		{
			name: 'variant',
			type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'",
			default: "'default'",
			description: 'Color variant for semantic meaning'
		},
		{
			name: 'size',
			type: "'sm' | 'md'",
			default: "'md'",
			description: 'Badge size'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Badge content',
			required: true
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
		A small status indicator component with semantic color variants for highlighting information.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Badge } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Variants</h2>
	<p>
		Badges support six variants: <code>default</code>, <code>primary</code>, <code>success</code>,
		<code>warning</code>, <code>error</code>, and <code>info</code>.
	</p>

	<ComponentExample
		code={`<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>`}
	>
		<Badge variant="default">Default</Badge>
		<Badge variant="primary">Primary</Badge>
		<Badge variant="success">Success</Badge>
		<Badge variant="warning">Warning</Badge>
		<Badge variant="error">Error</Badge>
		<Badge variant="info">Info</Badge>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Two sizes are available: <code>sm</code> and <code>md</code> (default).</p>

	<ComponentExample
		code={`<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>`}
	>
		<Badge size="sm">Small</Badge>
		<Badge size="md">Medium</Badge>
	</ComponentExample>

	<h2>Status Examples</h2>
	<p>Common use cases for status indicators.</p>

	<ComponentExample
		code={`<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="default">Draft</Badge>`}
	>
		<Badge variant="success">Active</Badge>
		<Badge variant="warning">Pending</Badge>
		<Badge variant="error">Failed</Badge>
		<Badge variant="default">Draft</Badge>
	</ComponentExample>

	<h2>With Text</h2>
	<p>Badges work well inline with text content.</p>

	<ComponentExample
		code={`<p>
  Order Status: <Badge variant="success">Completed</Badge>
</p>
<p>
  Review Status: <Badge variant="warning">In Progress</Badge>
</p>`}
	>
		<div class="text-examples">
			<p>
				Order Status: <Badge variant="success">Completed</Badge>
			</p>
			<p>
				Review Status: <Badge variant="warning">In Progress</Badge>
			</p>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={badgeProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { BadgeVariant, BadgeSize } from '@happyvertical/svelte';

// BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
// BadgeSize = 'sm' | 'md'`}
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

	.text-examples p {
		margin: 8px 0;
		font-size: 0.95rem;
	}
</style>
