<script lang="ts">
	import { ProgressBar } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'value',
			type: 'number',
			description: 'Current value (0-100 or custom range)',
			required: true
		},
		{
			name: 'max',
			type: 'number',
			default: '100',
			description: 'Maximum value'
		},
		{
			name: 'status',
			type: "'default' | 'healthy' | 'warning' | 'critical' | 'over'",
			default: "'default'",
			description: 'Status determines the color of the progress bar'
		},
		{
			name: 'showLabel',
			type: 'boolean',
			default: 'false',
			description: 'Show percentage label above the bar'
		},
		{
			name: 'label',
			type: 'string',
			description: 'Custom label text (overrides default percentage)'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Size variant for the progress bar height'
		},
		{
			name: 'showValue',
			type: 'boolean',
			default: 'false',
			description: 'Show value over max (e.g., "75/100")'
		}
	];

	const installCode = `npm install @happyvertical/smrt-svelte`;

	const basicCode = `<script lang="ts">
  import { ProgressBar } from '@happyvertical/smrt-svelte';
<\/script>

<ProgressBar value={45} />`;

	const withLabelCode = `<ProgressBar value={75} showLabel />
<ProgressBar value={750} max={1000} showValue />
<ProgressBar value={60} label="Loading assets..." showLabel />`;

	const statusCode = `<ProgressBar value={30} status="healthy" showLabel />
<ProgressBar value={75} status="warning" showLabel />
<ProgressBar value={90} status="critical" showLabel />
<ProgressBar value={110} max={100} status="over" showValue />`;

	const autoStatusCode = `<!-- When status="default", color is determined automatically -->
<ProgressBar value={50} showLabel />   <!-- healthy (< 75%) -->
<ProgressBar value={80} showLabel />   <!-- warning (75-89%) -->
<ProgressBar value={95} showLabel />   <!-- critical (90-100%) -->
<ProgressBar value={120} max={100} showValue /> <!-- over (> 100%) -->`;

	const sizesCode = `<ProgressBar value={60} size="sm" showLabel />
<ProgressBar value={60} size="md" showLabel />
<ProgressBar value={60} size="lg" showLabel />`;
</script>

<svelte:head>
	<title>ProgressBar | Components | s-m-r-t</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<a href="/docs/components">Components</a>
		<span>/</span>
		<span>Feedback</span>
		<span>/</span>
		<span>ProgressBar</span>
	</nav>

	<h1>ProgressBar</h1>
	<p class="lead">
		Visual progress indicator with optional status-based coloring. Useful for budget tracking,
		task completion, loading states, and any scenario where you need to display progress toward
		a goal.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={installCode} language="bash" />

	<h2>Basic Usage</h2>
	<ComponentExample title="Default Progress Bar" code={basicCode}>
		<div style="width: 100%; max-width: 400px;">
			<ProgressBar value={45} />
		</div>
	</ComponentExample>

	<h2>With Labels</h2>
	<p>Display progress information with percentage labels, value/max format, or custom text.</p>
	<ComponentExample title="Label Variants" code={withLabelCode}>
		<div style="width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 24px;">
			<ProgressBar value={75} showLabel />
			<ProgressBar value={750} max={1000} showValue />
			<ProgressBar value={60} label="Loading assets..." showLabel />
		</div>
	</ComponentExample>

	<h2>Status Colors</h2>
	<p>Explicitly set the status to control the progress bar color.</p>
	<ComponentExample title="Explicit Status" code={statusCode}>
		<div style="width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 24px;">
			<ProgressBar value={30} status="healthy" showLabel />
			<ProgressBar value={75} status="warning" showLabel />
			<ProgressBar value={90} status="critical" showLabel />
			<ProgressBar value={110} max={100} status="over" showValue />
		</div>
	</ComponentExample>

	<h2>Auto Status</h2>
	<p>
		When <code>status="default"</code>, the color is automatically determined based on the
		percentage: healthy (&lt;75%), warning (75-89%), critical (90-100%), or over (&gt;100%).
	</p>
	<ComponentExample title="Automatic Status Detection" code={autoStatusCode}>
		<div style="width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 24px;">
			<ProgressBar value={50} showLabel />
			<ProgressBar value={80} showLabel />
			<ProgressBar value={95} showLabel />
			<ProgressBar value={120} max={100} showValue />
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three size variants are available: small, medium (default), and large.</p>
	<ComponentExample title="Size Variants" code={sizesCode}>
		<div style="width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 24px;">
			<div>
				<span style="font-size: 0.75rem; color: #666; display: block; margin-bottom: 4px;">Small</span>
				<ProgressBar value={60} size="sm" showLabel />
			</div>
			<div>
				<span style="font-size: 0.75rem; color: #666; display: block; margin-bottom: 4px;">Medium</span>
				<ProgressBar value={60} size="md" showLabel />
			</div>
			<div>
				<span style="font-size: 0.75rem; color: #666; display: block; margin-bottom: 4px;">Large</span>
				<ProgressBar value={60} size="lg" showLabel />
			</div>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable {props} />
</article>

<style>
	.prose {
		max-width: 100%;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.875rem;
		color: #666;
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.breadcrumb span {
		color: #999;
	}

	.prose h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.2rem;
		line-height: 1.6;
		color: #444;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--color-grid);
	}

	.prose h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
		padding-top: 24px;
		border-top: 1px solid var(--color-grid);
	}

	.prose h2:first-of-type {
		border-top: none;
		padding-top: 0;
		margin-top: 0;
	}

	.prose p {
		font-size: 1rem;
		line-height: 1.7;
		margin-bottom: 16px;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		background: #f5f5f5;
		padding: 2px 6px;
		border-radius: 3px;
	}
</style>
