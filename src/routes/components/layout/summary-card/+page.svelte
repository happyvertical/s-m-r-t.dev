<script lang="ts">
	import { SummaryCard, Grid } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const summaryCardProps = [
		{
			name: 'label',
			type: 'string',
			description: 'Card label text',
			required: true
		},
		{
			name: 'value',
			type: 'string | number',
			description: 'Primary value to display',
			required: true
		},
		{
			name: 'count',
			type: 'number',
			description: 'Optional count badge'
		},
		{
			name: 'highlight',
			type: 'boolean',
			default: 'false',
			description: 'Use highlighted style'
		},
		{
			name: 'href',
			type: 'string',
			description: 'Make card clickable with link'
		},
		{
			name: 'icon',
			type: 'string',
			description: 'Icon name or SVG string'
		},
		{
			name: 'variant',
			type: "'default' | 'success' | 'warning' | 'danger'",
			default: "'default'",
			description: 'Value color variant'
		}
	];
</script>

<svelte:head>
	<title>SummaryCard | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/layout">Layout</a>
		<span>/</span>
		<span>SummaryCard</span>
	</nav>

	<h1>SummaryCard</h1>
	<p class="lead">
		Compact info card for dashboards and metrics. Shows a label with a prominent value, optionally
		with count badge, icon, and link functionality.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { SummaryCard } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Simple metric display with label and value.</p>

	<ComponentExample code={`<SummaryCard label="Total Users" value="1,234" />`}>
		<SummaryCard label="Total Users" value="1,234" />
	</ComponentExample>

	<h2>With Icon</h2>
	<p>Add an icon for visual context.</p>

	<ComponentExample
		code={`<SummaryCard label="Revenue" value="$45,678" icon="dollar-sign" />
<SummaryCard label="Orders" value="567" icon="shopping-cart" />`}
	>
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<SummaryCard label="Revenue" value="$45,678" icon="dollar-sign" />
			<SummaryCard label="Orders" value="567" icon="shopping-cart" />
		</div>
	</ComponentExample>

	<h2>With Count Badge</h2>
	<p>Show a count badge next to the label.</p>

	<ComponentExample code={`<SummaryCard label="Pending Tasks" value="12" count={3} />`}>
		<SummaryCard label="Pending Tasks" value="12" count={3} />
	</ComponentExample>

	<h2>Clickable Card</h2>
	<p>Add href to make the card a clickable link.</p>

	<ComponentExample
		code={`<SummaryCard
  label="Active Projects"
  value="8"
  href="/projects"
/>`}
	>
		<SummaryCard label="Active Projects" value="8" href="/projects" />
	</ComponentExample>

	<h2>Highlighted</h2>
	<p>Use highlight for important metrics.</p>

	<ComponentExample code={`<SummaryCard label="Today's Sales" value="$12,345" highlight />`}>
		<SummaryCard label="Today's Sales" value="$12,345" highlight />
	</ComponentExample>

	<h2>Color Variants</h2>
	<p>Use variants for semantic meaning.</p>

	<ComponentExample
		code={`<SummaryCard label="Success Rate" value="98.5%" variant="success" />
<SummaryCard label="Warnings" value="12" variant="warning" />
<SummaryCard label="Errors" value="3" variant="danger" />`}
	>
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<SummaryCard label="Success Rate" value="98.5%" variant="success" />
			<SummaryCard label="Warnings" value="12" variant="warning" />
			<SummaryCard label="Errors" value="3" variant="danger" />
		</div>
	</ComponentExample>

	<h2>Dashboard Example</h2>
	<p>Multiple cards in a grid layout.</p>

	<ComponentExample
		code={`<Grid columns={2}>
  <SummaryCard label="Users" value="1,234" icon="users" href="/users" />
  <SummaryCard label="Revenue" value="$45,678" icon="dollar-sign" href="/revenue" />
  <SummaryCard label="Orders" value="567" icon="shopping-cart" href="/orders" />
  <SummaryCard label="Conversion" value="3.2%" icon="trending-up" variant="success" />
</Grid>`}
	>
		<Grid columns={2}>
			<SummaryCard label="Users" value="1,234" icon="users" href="/users" />
			<SummaryCard label="Revenue" value="$45,678" icon="dollar-sign" href="/revenue" />
			<SummaryCard label="Orders" value="567" icon="shopping-cart" href="/orders" />
			<SummaryCard label="Conversion" value="3.2%" icon="trending-up" variant="success" />
		</Grid>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={summaryCardProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { SummaryCard } from '@happyvertical/smrt-svelte';

interface Props {
  label: string;
  value: string | number;
  count?: number;
  highlight?: boolean;
  href?: string;
  icon?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
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
</style>
