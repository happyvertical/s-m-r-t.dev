<script lang="ts">
	import { SummaryCard } from '@happyvertical/smrt-svelte';
	import { Grid } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const summaryCardProps = [
		{
			name: 'label',
			type: 'string',
			description: 'Card label/title',
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
			description: 'Apply highlighted/featured styling'
		},
		{
			name: 'href',
			type: 'string',
			description: 'Make card clickable with link'
		},
		{
			name: 'icon',
			type: 'string',
			description: 'Icon name (Icon) or SVG string'
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
		A statistic or summary display card showing a label with a prominent value. Supports icons,
		count badges, click functionality, and value color variants. Built with Material 3 design.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { SummaryCard } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display a simple statistic with label and value.</p>

	<ComponentExample
		code={`<SummaryCard label="Total Users" value="1,234" />
<SummaryCard label="Revenue" value="$45,678" />
<SummaryCard label="Conversion Rate" value="3.2%" />`}
	>
		<Grid columns={3} gap="md">
			<SummaryCard label="Total Users" value="1,234" />
			<SummaryCard label="Revenue" value="$45,678" />
			<SummaryCard label="Conversion Rate" value="3.2%" />
		</Grid>
	</ComponentExample>

	<h2>With Icons</h2>
	<p>Add visual context with an icon. Use an Icon name or pass an SVG string.</p>

	<ComponentExample
		code={`<SummaryCard label="Documents" value="156" icon="file" />
<SummaryCard label="Team Members" value="24" icon="users" />
<SummaryCard label="Messages" value="89" icon="mail" />`}
	>
		<Grid columns={3} gap="md">
			<SummaryCard label="Documents" value="156" icon="file" />
			<SummaryCard label="Team Members" value="24" icon="users" />
			<SummaryCard label="Messages" value="89" icon="mail" />
		</Grid>
	</ComponentExample>

	<h2>With Count Badge</h2>
	<p>Display a count badge next to the label using the <code>count</code> prop.</p>

	<ComponentExample
		code={`<SummaryCard label="Active Tasks" value="12" count={5} />
<SummaryCard label="Notifications" value="New" count={23} icon="bell" />`}
	>
		<Grid columns={2} gap="md">
			<SummaryCard label="Active Tasks" value="12" count={5} />
			<SummaryCard label="Notifications" value="New" count={23} icon="bell" />
		</Grid>
	</ComponentExample>

	<h2>Clickable Cards</h2>
	<p>Make cards clickable by adding an <code>href</code> prop. Clickable cards show a chevron indicator.</p>

	<ComponentExample
		code={`<SummaryCard
  label="View All Orders"
  value="1,456"
  href="/orders"
  icon="shopping-cart"
/>
<SummaryCard
  label="Analytics Dashboard"
  value="View"
  href="/analytics"
  icon="bar-chart"
/>`}
	>
		<Grid columns={2} gap="md">
			<SummaryCard label="View All Orders" value="1,456" href="/orders" icon="shopping-cart" />
			<SummaryCard label="Analytics Dashboard" value="View" href="/analytics" icon="bar-chart" />
		</Grid>
	</ComponentExample>

	<h2>Highlighted</h2>
	<p>Emphasize important cards with the <code>highlight</code> prop.</p>

	<ComponentExample
		code={`<SummaryCard label="Total Revenue" value="$125,000" highlight />
<SummaryCard
  label="This Month"
  value="$32,450"
  highlight
  href="/revenue/monthly"
  icon="trending-up"
/>`}
	>
		<Grid columns={2} gap="md">
			<SummaryCard label="Total Revenue" value="$125,000" highlight />
			<SummaryCard
				label="This Month"
				value="$32,450"
				highlight
				href="/revenue/monthly"
				icon="trending-up"
			/>
		</Grid>
	</ComponentExample>

	<h2>Value Variants</h2>
	<p>
		Use color variants to add semantic meaning to values: <code>success</code>,
		<code>warning</code>, and <code>danger</code>.
	</p>

	<ComponentExample
		code={`<SummaryCard label="Status" value="Active" variant="success" />
<SummaryCard label="Items" value="Low Stock" variant="warning" />
<SummaryCard label="Errors" value="3 Critical" variant="danger" />
<SummaryCard label="Default" value="Normal" variant="default" />`}
	>
		<Grid columns={4} gap="md">
			<SummaryCard label="Status" value="Active" variant="success" />
			<SummaryCard label="Items" value="Low Stock" variant="warning" />
			<SummaryCard label="Errors" value="3 Critical" variant="danger" />
			<SummaryCard label="Default" value="Normal" variant="default" />
		</Grid>
	</ComponentExample>

	<h2>Dashboard Example</h2>
	<p>Combining multiple SummaryCards for a dashboard overview.</p>

	<ComponentExample
		code={`<Grid columns={4} gap="md">
  <SummaryCard
    label="Total Sales"
    value="$84,254"
    icon="dollar-sign"
    variant="success"
    highlight
  />
  <SummaryCard
    label="Orders"
    value="1,429"
    count={12}
    icon="shopping-bag"
    href="/orders"
  />
  <SummaryCard
    label="Customers"
    value="3,842"
    icon="users"
    href="/customers"
  />
  <SummaryCard
    label="Pending"
    value="23"
    variant="warning"
    icon="clock"
    href="/orders?status=pending"
  />
</Grid>`}
	>
		<Grid columns={2} gap="md">
			<SummaryCard
				label="Total Sales"
				value="$84,254"
				icon="dollar-sign"
				variant="success"
				highlight
			/>
			<SummaryCard
				label="Orders"
				value="1,429"
				count={12}
				icon="shopping-bag"
				href="/orders"
			/>
			<SummaryCard label="Customers" value="3,842" icon="users" href="/customers" />
			<SummaryCard
				label="Pending"
				value="23"
				variant="warning"
				icon="clock"
				href="/orders?status=pending"
			/>
		</Grid>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={summaryCardProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`// Value color variants
type SummaryCardVariant = 'default' | 'success' | 'warning' | 'danger';`}
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
