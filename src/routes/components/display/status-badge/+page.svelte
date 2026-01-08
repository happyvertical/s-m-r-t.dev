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
			description: 'Pre-defined color scheme type for the status domain'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Badge size'
		},
		{
			name: 'variant',
			type: "'filled' | 'outline'",
			default: "'filled'",
			description: 'Visual variant style'
		},
		{
			name: 'label',
			type: 'string',
			default: 'undefined',
			description: 'Optional custom label (defaults to status value)'
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
		A generic status indicator badge with pre-defined color schemes for common status domains like
		invoices, projects, expenses, and more.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { StatusBadge } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Default Status Types</h2>
	<p>
		The default type includes common status values: <code>active</code>, <code>inactive</code>,
		<code>pending</code>, <code>error</code>, <code>success</code>, and <code>warning</code>.
	</p>

	<ComponentExample
		code={`<StatusBadge status="active" />
<StatusBadge status="inactive" />
<StatusBadge status="pending" />
<StatusBadge status="error" />
<StatusBadge status="success" />
<StatusBadge status="warning" />`}
	>
		<StatusBadge status="active" />
		<StatusBadge status="inactive" />
		<StatusBadge status="pending" />
		<StatusBadge status="error" />
		<StatusBadge status="success" />
		<StatusBadge status="warning" />
	</ComponentExample>

	<h2>Invoice Status</h2>
	<p>Use <code>type="invoice"</code> for invoice-specific status colors.</p>

	<ComponentExample
		code={`<StatusBadge status="draft" type="invoice" />
<StatusBadge status="sent" type="invoice" />
<StatusBadge status="viewed" type="invoice" />
<StatusBadge status="paid" type="invoice" />
<StatusBadge status="overdue" type="invoice" />
<StatusBadge status="cancelled" type="invoice" />`}
	>
		<StatusBadge status="draft" type="invoice" />
		<StatusBadge status="sent" type="invoice" />
		<StatusBadge status="viewed" type="invoice" />
		<StatusBadge status="paid" type="invoice" />
		<StatusBadge status="overdue" type="invoice" />
		<StatusBadge status="cancelled" type="invoice" />
	</ComponentExample>

	<h2>Project Status</h2>
	<p>Use <code>type="project"</code> for project workflow status colors.</p>

	<ComponentExample
		code={`<StatusBadge status="lead" type="project" />
<StatusBadge status="quoted" type="project" />
<StatusBadge status="active" type="project" />
<StatusBadge status="on_hold" type="project" />
<StatusBadge status="completed" type="project" />
<StatusBadge status="archived" type="project" />`}
	>
		<StatusBadge status="lead" type="project" />
		<StatusBadge status="quoted" type="project" />
		<StatusBadge status="active" type="project" />
		<StatusBadge status="on_hold" type="project" />
		<StatusBadge status="completed" type="project" />
		<StatusBadge status="archived" type="project" />
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</p>

	<ComponentExample
		code={`<StatusBadge status="active" size="sm" />
<StatusBadge status="active" size="md" />
<StatusBadge status="active" size="lg" />`}
	>
		<StatusBadge status="active" size="sm" />
		<StatusBadge status="active" size="md" />
		<StatusBadge status="active" size="lg" />
	</ComponentExample>

	<h2>Variants</h2>
	<p>
		Use the <code>variant</code> prop to switch between <code>filled</code> (default) and
		<code>outline</code> styles.
	</p>

	<ComponentExample
		code={`<StatusBadge status="active" variant="filled" />
<StatusBadge status="active" variant="outline" />
<StatusBadge status="error" variant="filled" />
<StatusBadge status="error" variant="outline" />`}
	>
		<StatusBadge status="active" variant="filled" />
		<StatusBadge status="active" variant="outline" />
		<StatusBadge status="error" variant="filled" />
		<StatusBadge status="error" variant="outline" />
	</ComponentExample>

	<h2>Custom Labels</h2>
	<p>Use the <code>label</code> prop to override the displayed text.</p>

	<ComponentExample
		code={`<StatusBadge status="active" label="Live" />
<StatusBadge status="pending" label="Awaiting Review" />
<StatusBadge status="error" label="Action Required" />`}
	>
		<StatusBadge status="active" label="Live" />
		<StatusBadge status="pending" label="Awaiting Review" />
		<StatusBadge status="error" label="Action Required" />
	</ComponentExample>

	<h2>Other Domain Types</h2>
	<p>Additional domain-specific color schemes are available.</p>

	<h3>Expense Status</h3>
	<ComponentExample
		code={`<StatusBadge status="unbilled" type="expense" />
<StatusBadge status="billed" type="expense" />
<StatusBadge status="reimbursed" type="expense" />
<StatusBadge status="rejected" type="expense" />`}
	>
		<StatusBadge status="unbilled" type="expense" />
		<StatusBadge status="billed" type="expense" />
		<StatusBadge status="reimbursed" type="expense" />
		<StatusBadge status="rejected" type="expense" />
	</ComponentExample>

	<h3>Time Entry Status</h3>
	<ComponentExample
		code={`<StatusBadge status="draft" type="time" />
<StatusBadge status="submitted" type="time" />
<StatusBadge status="approved" type="time" />
<StatusBadge status="rejected" type="time" />
<StatusBadge status="billed" type="time" />`}
	>
		<StatusBadge status="draft" type="time" />
		<StatusBadge status="submitted" type="time" />
		<StatusBadge status="approved" type="time" />
		<StatusBadge status="rejected" type="time" />
		<StatusBadge status="billed" type="time" />
	</ComponentExample>

	<h3>Compliance Status</h3>
	<ComponentExample
		code={`<StatusBadge status="valid" type="compliance" />
<StatusBadge status="expiring" type="compliance" />
<StatusBadge status="expired" type="compliance" />
<StatusBadge status="pending" type="compliance" />`}
	>
		<StatusBadge status="valid" type="compliance" />
		<StatusBadge status="expiring" type="compliance" />
		<StatusBadge status="expired" type="compliance" />
		<StatusBadge status="pending" type="compliance" />
	</ComponentExample>

	<h3>Estimate Status</h3>
	<ComponentExample
		code={`<StatusBadge status="draft" type="estimate" />
<StatusBadge status="presented" type="estimate" />
<StatusBadge status="accepted" type="estimate" />
<StatusBadge status="declined" type="estimate" />
<StatusBadge status="expired" type="estimate" />`}
	>
		<StatusBadge status="draft" type="estimate" />
		<StatusBadge status="presented" type="estimate" />
		<StatusBadge status="accepted" type="estimate" />
		<StatusBadge status="declined" type="estimate" />
		<StatusBadge status="expired" type="estimate" />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={statusBadgeProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { StatusType } from '@happyvertical/smrt-svelte';

// StatusType = 'default' | 'invoice' | 'project' | 'expense' | 'time' | 'compliance' | 'estimate'`}
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

	.prose h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 12px;
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
