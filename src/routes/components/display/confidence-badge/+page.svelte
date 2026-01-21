<script lang="ts">
	import { ConfidenceBadge } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const confidenceBadgeProps = [
		{
			name: 'confidence',
			type: 'number',
			description: 'Confidence value (0-100)',
			required: true
		},
		{
			name: 'showPercent',
			type: 'boolean',
			default: 'true',
			description: 'Show percentage value'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Size variant'
		}
	];
</script>

<svelte:head>
	<title>ConfidenceBadge | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/display">Display</a>
		<span>/</span>
		<span>ConfidenceBadge</span>
	</nav>

	<h1>ConfidenceBadge</h1>
	<p class="lead">
		Display AI confidence scores with visual indicators. Automatically colors based on confidence
		level (high, medium, low).
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { ConfidenceBadge } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display confidence scores with automatic color coding.</p>

	<ComponentExample
		code={`<ConfidenceBadge confidence={95} />
<ConfidenceBadge confidence={65} />
<ConfidenceBadge confidence={30} />`}
	>
		<div style="display: flex; gap: 12px; flex-wrap: wrap;">
			<ConfidenceBadge confidence={95} />
			<ConfidenceBadge confidence={65} />
			<ConfidenceBadge confidence={30} />
		</div>
	</ComponentExample>

	<h2>Confidence Levels</h2>
	<p>Colors change automatically based on confidence thresholds.</p>

	<ComponentExample
		code={`<!-- High (80-100): Green -->
<ConfidenceBadge confidence={90} />
<!-- Medium (50-79): Yellow -->
<ConfidenceBadge confidence={60} />
<!-- Low (0-49): Red -->
<ConfidenceBadge confidence={25} />`}
	>
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<div style="display: flex; align-items: center; gap: 12px;">
				<ConfidenceBadge confidence={90} />
				<span style="color: #666; font-size: 0.875rem;">High confidence (80-100%)</span>
			</div>
			<div style="display: flex; align-items: center; gap: 12px;">
				<ConfidenceBadge confidence={60} />
				<span style="color: #666; font-size: 0.875rem;">Medium confidence (50-79%)</span>
			</div>
			<div style="display: flex; align-items: center; gap: 12px;">
				<ConfidenceBadge confidence={25} />
				<span style="color: #666; font-size: 0.875rem;">Low confidence (0-49%)</span>
			</div>
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Available in small, medium, and large sizes.</p>

	<ComponentExample
		code={`<ConfidenceBadge confidence={85} size="sm" />
<ConfidenceBadge confidence={85} size="md" />
<ConfidenceBadge confidence={85} size="lg" />`}
	>
		<div style="display: flex; gap: 12px; align-items: center;">
			<ConfidenceBadge confidence={85} size="sm" />
			<ConfidenceBadge confidence={85} size="md" />
			<ConfidenceBadge confidence={85} size="lg" />
		</div>
	</ComponentExample>

	<h2>Without Percentage</h2>
	<p>Hide the percentage text for a minimal bar-only display.</p>

	<ComponentExample
		code={`<ConfidenceBadge confidence={75} showPercent={false} />`}
	>
		<ConfidenceBadge confidence={75} showPercent={false} />
	</ComponentExample>

	<h2>Use Cases</h2>
	<p>Common applications for confidence badges.</p>

	<ComponentExample
		code={`<!-- OCR Results -->
<div>OCR Accuracy: <ConfidenceBadge confidence={92} /></div>

<!-- AI Predictions -->
<div>Match Score: <ConfidenceBadge confidence={78} /></div>

<!-- Data Quality -->
<div>Data Quality: <ConfidenceBadge confidence={45} /></div>`}
	>
		<div style="display: flex; flex-direction: column; gap: 16px;">
			<div style="display: flex; align-items: center; gap: 8px;">
				<span style="min-width: 120px;">OCR Accuracy:</span>
				<ConfidenceBadge confidence={92} />
			</div>
			<div style="display: flex; align-items: center; gap: 8px;">
				<span style="min-width: 120px;">Match Score:</span>
				<ConfidenceBadge confidence={78} />
			</div>
			<div style="display: flex; align-items: center; gap: 8px;">
				<span style="min-width: 120px;">Data Quality:</span>
				<ConfidenceBadge confidence={45} />
			</div>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={confidenceBadgeProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { ConfidenceBadge } from '@happyvertical/smrt-svelte';

interface Props {
  confidence: number;  // 0-100
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
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
