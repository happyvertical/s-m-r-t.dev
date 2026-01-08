<script lang="ts">
	import { Grid, Card } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const gridProps = [
		{
			name: 'columns',
			type: "number | 'auto'",
			default: "'auto'",
			description: 'Number of columns or auto-fill with min 300px'
		},
		{
			name: 'gap',
			type: "'sm' | 'md' | 'lg' | 'xl'",
			default: "'md'",
			description: 'Gap between grid items'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Grid items',
			required: true
		}
	];
</script>

<svelte:head>
	<title>Grid | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/layout">Layout</a>
		<span>/</span>
		<span>Grid</span>
	</nav>

	<h1>Grid</h1>
	<p class="lead">
		A responsive CSS grid layout component with configurable columns and gap sizes. Automatically
		adapts to available space.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Grid } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>
		By default, the Grid uses <code>auto</code> columns which creates a responsive layout with items
		that are at least 300px wide.
	</p>

	<ComponentExample
		code={`<Grid>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>`}
	>
		<Grid>
			<Card>Item 1</Card>
			<Card>Item 2</Card>
			<Card>Item 3</Card>
			<Card>Item 4</Card>
		</Grid>
	</ComponentExample>

	<h2>Fixed Columns</h2>
	<p>Specify a fixed number of columns using the <code>columns</code> prop.</p>

	<ComponentExample
		code={`<Grid columns={2}>
  <Card>Column 1</Card>
  <Card>Column 2</Card>
</Grid>

<Grid columns={3}>
  <Card>Column 1</Card>
  <Card>Column 2</Card>
  <Card>Column 3</Card>
</Grid>

<Grid columns={4}>
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
  <Card>4</Card>
</Grid>`}
	>
		<div class="grid-demos">
			<div>
				<p class="demo-label">2 columns:</p>
				<Grid columns={2}>
					<Card>Column 1</Card>
					<Card>Column 2</Card>
				</Grid>
			</div>
			<div>
				<p class="demo-label">3 columns:</p>
				<Grid columns={3}>
					<Card>Column 1</Card>
					<Card>Column 2</Card>
					<Card>Column 3</Card>
				</Grid>
			</div>
			<div>
				<p class="demo-label">4 columns:</p>
				<Grid columns={4}>
					<Card>1</Card>
					<Card>2</Card>
					<Card>3</Card>
					<Card>4</Card>
				</Grid>
			</div>
		</div>
	</ComponentExample>

	<h2>Gap Sizes</h2>
	<p>
		Control spacing between items with the <code>gap</code> prop. Options are: <code>sm</code>,
		<code>md</code> (default), <code>lg</code>, and <code>xl</code>.
	</p>

	<ComponentExample
		code={`<Grid columns={3} gap="sm">Small gap</Grid>
<Grid columns={3} gap="md">Medium gap</Grid>
<Grid columns={3} gap="lg">Large gap</Grid>
<Grid columns={3} gap="xl">Extra large gap</Grid>`}
	>
		<div class="grid-demos">
			<div>
				<p class="demo-label">gap="sm":</p>
				<Grid columns={3} gap="sm">
					<Card>1</Card>
					<Card>2</Card>
					<Card>3</Card>
				</Grid>
			</div>
			<div>
				<p class="demo-label">gap="md":</p>
				<Grid columns={3} gap="md">
					<Card>1</Card>
					<Card>2</Card>
					<Card>3</Card>
				</Grid>
			</div>
			<div>
				<p class="demo-label">gap="lg":</p>
				<Grid columns={3} gap="lg">
					<Card>1</Card>
					<Card>2</Card>
					<Card>3</Card>
				</Grid>
			</div>
			<div>
				<p class="demo-label">gap="xl":</p>
				<Grid columns={3} gap="xl">
					<Card>1</Card>
					<Card>2</Card>
					<Card>3</Card>
				</Grid>
			</div>
		</div>
	</ComponentExample>

	<h2>Auto-Fill Responsive</h2>
	<p>
		The default <code>auto</code> setting uses CSS <code>auto-fill</code> with a minimum of 300px per
		item, creating a naturally responsive grid.
	</p>

	<ComponentExample
		code={`<Grid columns="auto">
  <Card>Responsive Item 1</Card>
  <Card>Responsive Item 2</Card>
  <Card>Responsive Item 3</Card>
  <Card>Responsive Item 4</Card>
  <Card>Responsive Item 5</Card>
  <Card>Responsive Item 6</Card>
</Grid>`}
	>
		<Grid columns="auto">
			<Card>Responsive Item 1</Card>
			<Card>Responsive Item 2</Card>
			<Card>Responsive Item 3</Card>
			<Card>Responsive Item 4</Card>
			<Card>Responsive Item 5</Card>
			<Card>Responsive Item 6</Card>
		</Grid>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={gridProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { GapSize } from '@happyvertical/svelte';

// GapSize = 'sm' | 'md' | 'lg' | 'xl'`}
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

	.grid-demos {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.demo-label {
		font-size: 0.85rem;
		font-weight: 500;
		color: #666;
		margin-bottom: 8px !important;
	}

	:global(.grid .card) {
		text-align: center;
	}
</style>
