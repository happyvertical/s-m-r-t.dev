<script lang="ts">
	import { ProgressBar } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const progressBarProps = [
		{
			name: 'value',
			type: 'number',
			description: 'Current progress value',
			required: true
		},
		{
			name: 'max',
			type: 'number',
			default: '100',
			description: 'Maximum value for the progress bar'
		},
		{
			name: 'status',
			type: "'default' | 'healthy' | 'warning' | 'critical' | 'over'",
			default: "'default'",
			description: 'Status determines the color (auto-calculated if default)'
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
			description: 'Custom label text (overrides percentage)'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Size variant for the progress bar'
		},
		{
			name: 'showValue',
			type: 'boolean',
			default: 'false',
			description: 'Show value/max format (e.g., "75/100")'
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
		A visual progress indicator with status-based coloring. Useful for budget tracking, task
		completion, file uploads, and more.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { ProgressBar } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>
		The progress bar automatically calculates color based on the percentage. Under 75% shows primary
		(healthy), 75-90% shows warning, and 90%+ shows critical.
	</p>

	<ComponentExample
		code={`<ProgressBar value={25} />
<ProgressBar value={50} />
<ProgressBar value={75} />
<ProgressBar value={95} />`}
	>
		<div class="progress-stack">
			<ProgressBar value={25} />
			<ProgressBar value={50} />
			<ProgressBar value={75} />
			<ProgressBar value={95} />
		</div>
	</ComponentExample>

	<h2>With Labels</h2>
	<p>Display the percentage or a custom label above the progress bar.</p>

	<ComponentExample
		code={`<ProgressBar value={65} showLabel />
<ProgressBar value={42} showLabel label="Budget Used" />`}
	>
		<div class="progress-stack">
			<ProgressBar value={65} showLabel />
			<ProgressBar value={42} showLabel label="Budget Used" />
		</div>
	</ComponentExample>

	<h2>Value Display</h2>
	<p>Show the actual value versus maximum instead of a percentage.</p>

	<ComponentExample
		code={`<ProgressBar value={750} max={1000} showValue />
<ProgressBar value={8} max={10} showValue label="Tasks Completed" />`}
	>
		<div class="progress-stack">
			<ProgressBar value={750} max={1000} showValue />
			<ProgressBar value={8} max={10} showValue label="Tasks Completed" />
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three size variants are available: small, medium (default), and large.</p>

	<ComponentExample
		code={`<ProgressBar value={60} size="sm" showLabel />
<ProgressBar value={60} size="md" showLabel />
<ProgressBar value={60} size="lg" showLabel />`}
	>
		<div class="progress-stack">
			<div>
				<span class="size-label">Small</span>
				<ProgressBar value={60} size="sm" showLabel />
			</div>
			<div>
				<span class="size-label">Medium</span>
				<ProgressBar value={60} size="md" showLabel />
			</div>
			<div>
				<span class="size-label">Large</span>
				<ProgressBar value={60} size="lg" showLabel />
			</div>
		</div>
	</ComponentExample>

	<h2>Manual Status</h2>
	<p>Override the automatic status calculation with an explicit status.</p>

	<ComponentExample
		code={`<ProgressBar value={30} status="healthy" showLabel />
<ProgressBar value={30} status="warning" showLabel />
<ProgressBar value={30} status="critical" showLabel />`}
	>
		<div class="progress-stack">
			<ProgressBar value={30} status="healthy" showLabel />
			<ProgressBar value={30} status="warning" showLabel />
			<ProgressBar value={30} status="critical" showLabel />
		</div>
	</ComponentExample>

	<h2>Over Budget</h2>
	<p>When value exceeds max, an "over" indicator is shown.</p>

	<ComponentExample
		code={`<ProgressBar value={1250} max={1000} showValue />`}
	>
		<ProgressBar value={1250} max={1000} showValue />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={progressBarProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { ProgressBar } from '@happyvertical/smrt-svelte';

// Status type
type ProgressStatus = 'default' | 'healthy' | 'warning' | 'critical' | 'over';

// Size type
type ProgressSize = 'sm' | 'md' | 'lg';`}
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

	.progress-stack {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.size-label {
		display: block;
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 8px;
	}
</style>
