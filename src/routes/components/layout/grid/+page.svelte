<script lang="ts">
	import { Grid, Card } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const gridProps = [
		{
			name: 'columns',
			type: "number | 'auto' | ResponsiveColumns",
			default: "'auto'",
			description:
				'Number of columns, auto-fill with minmax, or responsive object ({ sm, md, lg, xl })'
		},
		{
			name: 'gap',
			type: 'GapSize | { row?: GapSize; column?: GapSize }',
			default: "'md'",
			description: 'Gap between grid items (single size, or separate row/column gaps)'
		},
		{
			name: 'header',
			type: 'Snippet',
			description: 'Header snippet rendered above the grid'
		},
		{
			name: 'alignItems',
			type: "'start' | 'center' | 'end' | 'stretch'",
			description: 'Vertical alignment of grid items'
		},
		{
			name: 'justifyItems',
			type: "'start' | 'center' | 'end' | 'stretch'",
			description: 'Horizontal alignment of grid items'
		},
		{
			name: 'autoFlow',
			type: "'row' | 'column' | 'row dense' | 'column dense'",
			description: 'Grid auto-flow direction'
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
		Responsive grid layout with configurable columns and gaps. Uses CSS Grid with smart auto-fill
		behavior by default.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Grid } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Auto Columns (Default)</h2>
	<p>By default, columns auto-fill with a minimum width of 300px.</p>

	<ComponentExample
		code={`<Grid>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>`}
	>
		<Grid>
			<Card><p style="margin: 0;">Item 1</p></Card>
			<Card><p style="margin: 0;">Item 2</p></Card>
			<Card><p style="margin: 0;">Item 3</p></Card>
			<Card><p style="margin: 0;">Item 4</p></Card>
		</Grid>
	</ComponentExample>

	<h2>Fixed Columns</h2>
	<p>Specify exact number of columns.</p>

	<ComponentExample
		code={`<Grid columns={2}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>

<Grid columns={3}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>`}
	>
		<div style="margin-bottom: 24px;">
			<Grid columns={2}>
				<Card><p style="margin: 0;">Item 1</p></Card>
				<Card><p style="margin: 0;">Item 2</p></Card>
				<Card><p style="margin: 0;">Item 3</p></Card>
				<Card><p style="margin: 0;">Item 4</p></Card>
			</Grid>
		</div>
		<Grid columns={3}>
			<Card><p style="margin: 0;">Item 1</p></Card>
			<Card><p style="margin: 0;">Item 2</p></Card>
			<Card><p style="margin: 0;">Item 3</p></Card>
		</Grid>
	</ComponentExample>

	<h2>Gap Sizes</h2>
	<p>Control spacing between grid items.</p>

	<ComponentExample
		code={`<Grid columns={3} gap="sm">Small gap</Grid>
<Grid columns={3} gap="md">Medium gap (default)</Grid>
<Grid columns={3} gap="lg">Large gap</Grid>
<Grid columns={3} gap="xl">Extra large gap</Grid>`}
	>
		<div style="display: flex; flex-direction: column; gap: 24px;">
			<div>
				<p style="font-size: 0.875rem; color: #666; margin-bottom: 8px;">Small gap:</p>
				<Grid columns={3} gap="sm">
					<Card padding="sm"><p style="margin: 0; font-size: 0.875rem;">A</p></Card>
					<Card padding="sm"><p style="margin: 0; font-size: 0.875rem;">B</p></Card>
					<Card padding="sm"><p style="margin: 0; font-size: 0.875rem;">C</p></Card>
				</Grid>
			</div>
			<div>
				<p style="font-size: 0.875rem; color: #666; margin-bottom: 8px;">Large gap:</p>
				<Grid columns={3} gap="lg">
					<Card padding="sm"><p style="margin: 0; font-size: 0.875rem;">A</p></Card>
					<Card padding="sm"><p style="margin: 0; font-size: 0.875rem;">B</p></Card>
					<Card padding="sm"><p style="margin: 0; font-size: 0.875rem;">C</p></Card>
				</Grid>
			</div>
		</div>
	</ComponentExample>

	<h2>Dashboard Example</h2>
	<p>Common pattern for metric cards.</p>

	<ComponentExample
		code={`<Grid columns={4}>
  <Card>
    <h3>Users</h3>
    <p class="metric">1,234</p>
  </Card>
  <Card>
    <h3>Revenue</h3>
    <p class="metric">$45,678</p>
  </Card>
  <Card>
    <h3>Orders</h3>
    <p class="metric">567</p>
  </Card>
  <Card>
    <h3>Conversion</h3>
    <p class="metric">3.2%</p>
  </Card>
</Grid>`}
	>
		<Grid columns={4}>
			<Card>
				<p style="margin: 0 0 8px; font-size: 0.875rem; color: #666;">Users</p>
				<p style="margin: 0; font-size: 1.5rem; font-weight: 600;">1,234</p>
			</Card>
			<Card>
				<p style="margin: 0 0 8px; font-size: 0.875rem; color: #666;">Revenue</p>
				<p style="margin: 0; font-size: 1.5rem; font-weight: 600;">$45,678</p>
			</Card>
			<Card>
				<p style="margin: 0 0 8px; font-size: 0.875rem; color: #666;">Orders</p>
				<p style="margin: 0; font-size: 1.5rem; font-weight: 600;">567</p>
			</Card>
			<Card>
				<p style="margin: 0 0 8px; font-size: 0.875rem; color: #666;">Conversion</p>
				<p style="margin: 0; font-size: 1.5rem; font-weight: 600;">3.2%</p>
			</Card>
		</Grid>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={gridProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Grid } from '@happyvertical/smrt-svelte';

type GapSize = 'sm' | 'md' | 'lg' | 'xl';
type GapConfig = GapSize | { row?: GapSize; column?: GapSize };
type AlignItems = 'start' | 'center' | 'end' | 'stretch';
type JustifyItems = 'start' | 'center' | 'end' | 'stretch';
type AutoFlow = 'row' | 'column' | 'row dense' | 'column dense';

interface ResponsiveColumns {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
  columns?: number | 'auto' | ResponsiveColumns;
  gap?: GapConfig;
  header?: Snippet;
  children?: Snippet;
  alignItems?: AlignItems;
  justifyItems?: JustifyItems;
  autoFlow?: AutoFlow;
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
