<script lang="ts">
	import { StatusBadge } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const statusBadgeProps = [
		{
			name: 'status',
			type: 'string',
			description: 'The status value to display',
			required: true
		},
		{
			name: 'type',
			type: "'default' | 'invoice' | 'project' | 'expense' | 'time' | 'compliance' | 'estimate'",
			default: "'default'",
			description: 'Pre-defined color scheme type'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Badge size variant'
		},
		{
			name: 'variant',
			type: "'filled' | 'outline'",
			default: "'filled'",
			description: 'Visual variant'
		},
		{
			name: 'label',
			type: 'string',
			description: 'Custom display label (defaults to status value)'
		}
	];
</script>

<svelte:head>
	<title>StatusBadge | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/display">Display</a>
		<span>/</span>
		<span>StatusBadge</span>
	</nav>

	<h1>StatusBadge</h1>
	<p class="lead">
		Status indicator with pre-defined color schemes for common business domains like invoices,
		projects, and expenses.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { StatusBadge } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Default status badges with automatic coloring.</p>

	<ComponentExample
		code={`<StatusBadge status="active" />
<StatusBadge status="pending" />
<StatusBadge status="error" />`}
	>
		<div style="display: flex; gap: 8px; flex-wrap: wrap;">
			<StatusBadge status="active" />
			<StatusBadge status="pending" />
			<StatusBadge status="error" />
		</div>
	</ComponentExample>

	<h2>Invoice Status</h2>
	<p>Pre-defined colors for invoice workflows.</p>

	<ComponentExample
		code={`<StatusBadge status="draft" type="invoice" />
<StatusBadge status="sent" type="invoice" />
<StatusBadge status="viewed" type="invoice" />
<StatusBadge status="paid" type="invoice" />
<StatusBadge status="overdue" type="invoice" />`}
	>
		<div style="display: flex; gap: 8px; flex-wrap: wrap;">
			<StatusBadge status="draft" type="invoice" />
			<StatusBadge status="sent" type="invoice" />
			<StatusBadge status="viewed" type="invoice" />
			<StatusBadge status="paid" type="invoice" />
			<StatusBadge status="overdue" type="invoice" />
		</div>
	</ComponentExample>

	<h2>Project Status</h2>
	<p>Colors for project management workflows.</p>

	<ComponentExample
		code={`<StatusBadge status="lead" type="project" />
<StatusBadge status="quoted" type="project" />
<StatusBadge status="active" type="project" />
<StatusBadge status="on_hold" type="project" />
<StatusBadge status="completed" type="project" />`}
	>
		<div style="display: flex; gap: 8px; flex-wrap: wrap;">
			<StatusBadge status="lead" type="project" />
			<StatusBadge status="quoted" type="project" />
			<StatusBadge status="active" type="project" />
			<StatusBadge status="on_hold" type="project" />
			<StatusBadge status="completed" type="project" />
		</div>
	</ComponentExample>

	<h2>Expense Status</h2>
	<p>Colors for expense tracking.</p>

	<ComponentExample
		code={`<StatusBadge status="unbilled" type="expense" />
<StatusBadge status="billed" type="expense" />
<StatusBadge status="reimbursed" type="expense" />
<StatusBadge status="rejected" type="expense" />`}
	>
		<div style="display: flex; gap: 8px; flex-wrap: wrap;">
			<StatusBadge status="unbilled" type="expense" />
			<StatusBadge status="billed" type="expense" />
			<StatusBadge status="reimbursed" type="expense" />
			<StatusBadge status="rejected" type="expense" />
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Available in small, medium, and large sizes.</p>

	<ComponentExample
		code={`<StatusBadge status="active" size="sm" />
<StatusBadge status="active" size="md" />
<StatusBadge status="active" size="lg" />`}
	>
		<div style="display: flex; gap: 8px; align-items: center;">
			<StatusBadge status="active" size="sm" />
			<StatusBadge status="active" size="md" />
			<StatusBadge status="active" size="lg" />
		</div>
	</ComponentExample>

	<h2>Outline Variant</h2>
	<p>Use outline for a lighter appearance.</p>

	<ComponentExample
		code={`<StatusBadge status="active" variant="outline" />
<StatusBadge status="pending" variant="outline" />
<StatusBadge status="error" variant="outline" />`}
	>
		<div style="display: flex; gap: 8px; flex-wrap: wrap;">
			<StatusBadge status="active" variant="outline" />
			<StatusBadge status="pending" variant="outline" />
			<StatusBadge status="error" variant="outline" />
		</div>
	</ComponentExample>

	<h2>Custom Label</h2>
	<p>Override the displayed text while keeping the color scheme.</p>

	<ComponentExample
		code={`<StatusBadge status="paid" type="invoice" label="Complete" />`}
	>
		<StatusBadge status="paid" type="invoice" label="Complete" />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={statusBadgeProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { StatusBadge } from '@happyvertical/smrt-svelte';

type StatusType = 'default' | 'invoice' | 'project' | 'expense' | 'time' | 'compliance' | 'estimate';

interface Props {
  status: string;
  type?: StatusType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline';
  label?: string;
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
