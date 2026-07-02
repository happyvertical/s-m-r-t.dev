<script lang="ts">
	import { ProgressBar } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const progressBarProps = [
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
			description: 'Status determines color (auto-detected if default)'
		},
		{
			name: 'showLabel',
			type: 'boolean',
			default: 'false',
			description: 'Show percentage label'
		},
		{
			name: 'label',
			type: 'string',
			description: 'Custom label text'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Size variant'
		},
		{
			name: 'showValue',
			type: 'boolean',
			default: 'false',
			description: 'Show value over max (e.g., "75/100")'
		}
	];
</script>

<svelte:head>
	<title>ProgressBar | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/feedback">Feedback</a>
		<span>/</span>
		<span>ProgressBar</span>
	</nav>

	<h1>ProgressBar</h1>
	<p class="lead">
		Visual progress indicator with automatic status-based coloring. Useful for budget tracking, task
		completion, and loading states.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { ProgressBar } from '@happyvertical/smrt-ui';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Simple progress bar with automatic color based on percentage.</p>

	<ComponentExample code={`<ProgressBar value={45} />`}>
		<ProgressBar value={45} />
	</ComponentExample>

	<h2>With Label</h2>
	<p>Show the percentage above the bar.</p>

	<ComponentExample code={`<ProgressBar value={65} showLabel />`}>
		<ProgressBar value={65} showLabel />
	</ComponentExample>

	<h2>Auto Status Colors</h2>
	<p>Colors change automatically based on percentage thresholds.</p>

	<ComponentExample
		code={`<ProgressBar value={50} showLabel />  <!-- Healthy (under 75%) -->
<ProgressBar value={80} showLabel />  <!-- Warning (75-89%) -->
<ProgressBar value={95} showLabel />  <!-- Critical (90%+) -->`}
	>
		<div style="display: flex; flex-direction: column; gap: 16px;">
			<div>
				<span style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 4px;"
					>Healthy (under 75%)</span
				>
				<ProgressBar value={50} showLabel />
			</div>
			<div>
				<span style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 4px;"
					>Warning (75-89%)</span
				>
				<ProgressBar value={80} showLabel />
			</div>
			<div>
				<span style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 4px;"
					>Critical (90%+)</span
				>
				<ProgressBar value={95} showLabel />
			</div>
		</div>
	</ComponentExample>

	<h2>Over Budget</h2>
	<p>When value exceeds max, shows "over" indicator.</p>

	<ComponentExample code={`<ProgressBar value={120} max={100} showLabel />`}>
		<ProgressBar value={120} max={100} showLabel />
	</ComponentExample>

	<h2>Custom Range</h2>
	<p>Use any max value, not just 100.</p>

	<ComponentExample code={`<ProgressBar value={750} max={1000} showValue />`}>
		<ProgressBar value={750} max={1000} showValue />
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Available in small, medium, and large sizes.</p>

	<ComponentExample
		code={`<ProgressBar value={60} size="sm" showLabel />
<ProgressBar value={60} size="md" showLabel />
<ProgressBar value={60} size="lg" showLabel />`}
	>
		<div style="display: flex; flex-direction: column; gap: 24px;">
			<div>
				<span style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 4px;"
					>Small</span
				>
				<ProgressBar value={60} size="sm" showLabel />
			</div>
			<div>
				<span style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 4px;"
					>Medium</span
				>
				<ProgressBar value={60} size="md" showLabel />
			</div>
			<div>
				<span style="display: block; font-size: 0.75rem; color: #666; margin-bottom: 4px;"
					>Large</span
				>
				<ProgressBar value={60} size="lg" showLabel />
			</div>
		</div>
	</ComponentExample>

	<h2>Custom Label</h2>
	<p>Override the label text.</p>

	<ComponentExample code={`<ProgressBar value={75} showLabel label="$7,500 of $10,000" />`}>
		<ProgressBar value={75} showLabel label="$7,500 of $10,000" />
	</ComponentExample>

	<h2>Forced Status</h2>
	<p>Override auto status with a specific color.</p>

	<ComponentExample
		code={`<ProgressBar value={30} status="healthy" showLabel />
<ProgressBar value={30} status="warning" showLabel />
<ProgressBar value={30} status="critical" showLabel />`}
	>
		<div style="display: flex; flex-direction: column; gap: 16px;">
			<ProgressBar value={30} status="healthy" showLabel />
			<ProgressBar value={30} status="warning" showLabel />
			<ProgressBar value={30} status="critical" showLabel />
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={progressBarProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { ProgressBar } from '@happyvertical/smrt-ui';

interface Props {
  value: number;
  max?: number;
  status?: 'default' | 'healthy' | 'warning' | 'critical' | 'over';
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
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
