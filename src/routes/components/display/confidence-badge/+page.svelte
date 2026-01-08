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
			description: 'Whether to show the percentage value'
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
		Displays an AI confidence level indicator with a visual progress bar. Useful for showing OCR
		results, AI predictions, match scores, and other confidence metrics.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { ConfidenceBadge } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Confidence Levels</h2>
	<p>
		The badge automatically adjusts its color based on the confidence level: high (80-100) is green,
		medium (50-79) is amber, and low (0-49) is red.
	</p>

	<ComponentExample
		code={`<ConfidenceBadge confidence={95} />
<ConfidenceBadge confidence={72} />
<ConfidenceBadge confidence={35} />`}
	>
		<ConfidenceBadge confidence={95} />
		<ConfidenceBadge confidence={72} />
		<ConfidenceBadge confidence={35} />
	</ComponentExample>

	<h2>Full Range Examples</h2>
	<p>See how the badge transitions across different confidence values.</p>

	<ComponentExample
		code={`<ConfidenceBadge confidence={100} />
<ConfidenceBadge confidence={85} />
<ConfidenceBadge confidence={80} />
<ConfidenceBadge confidence={65} />
<ConfidenceBadge confidence={50} />
<ConfidenceBadge confidence={40} />
<ConfidenceBadge confidence={20} />
<ConfidenceBadge confidence={5} />`}
	>
		<ConfidenceBadge confidence={100} />
		<ConfidenceBadge confidence={85} />
		<ConfidenceBadge confidence={80} />
		<ConfidenceBadge confidence={65} />
		<ConfidenceBadge confidence={50} />
		<ConfidenceBadge confidence={40} />
		<ConfidenceBadge confidence={20} />
		<ConfidenceBadge confidence={5} />
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</p>

	<ComponentExample
		code={`<ConfidenceBadge confidence={85} size="sm" />
<ConfidenceBadge confidence={85} size="md" />
<ConfidenceBadge confidence={85} size="lg" />`}
	>
		<ConfidenceBadge confidence={85} size="sm" />
		<ConfidenceBadge confidence={85} size="md" />
		<ConfidenceBadge confidence={85} size="lg" />
	</ComponentExample>

	<h2>Hide Percentage</h2>
	<p>
		Use <code>showPercent={'{'}false{'}'}</code> to hide the percentage text and show only the visual
		bar.
	</p>

	<ComponentExample
		code={`<ConfidenceBadge confidence={90} showPercent={false} />
<ConfidenceBadge confidence={60} showPercent={false} />
<ConfidenceBadge confidence={30} showPercent={false} />`}
	>
		<ConfidenceBadge confidence={90} showPercent={false} />
		<ConfidenceBadge confidence={60} showPercent={false} />
		<ConfidenceBadge confidence={30} showPercent={false} />
	</ComponentExample>

	<h2>Edge Cases</h2>
	<p>Values are clamped to the 0-100 range. Values outside this range are automatically adjusted.</p>

	<ComponentExample
		code={`<ConfidenceBadge confidence={0} />
<ConfidenceBadge confidence={-10} />
<ConfidenceBadge confidence={150} />`}
	>
		<ConfidenceBadge confidence={0} />
		<ConfidenceBadge confidence={-10} />
		<ConfidenceBadge confidence={150} />
	</ComponentExample>

	<h2>Use Cases</h2>
	<p>Common scenarios where ConfidenceBadge is useful:</p>

	<h3>OCR Results</h3>
	<ComponentExample
		code={`<!-- High confidence OCR extraction -->
<ConfidenceBadge confidence={97} />

<!-- Medium confidence - may need review -->
<ConfidenceBadge confidence={68} />

<!-- Low confidence - manual verification needed -->
<ConfidenceBadge confidence={32} />`}
	>
		<div class="use-case-grid">
			<div class="use-case-item">
				<span class="use-case-label">High confidence</span>
				<ConfidenceBadge confidence={97} />
			</div>
			<div class="use-case-item">
				<span class="use-case-label">Needs review</span>
				<ConfidenceBadge confidence={68} />
			</div>
			<div class="use-case-item">
				<span class="use-case-label">Manual check</span>
				<ConfidenceBadge confidence={32} />
			</div>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={confidenceBadgeProps} />

	<h2>Color Thresholds</h2>
	<CodeBlock
		code={`// Confidence level thresholds:
// High (green):   80-100
// Medium (amber): 50-79
// Low (red):      0-49`}
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

	.use-case-grid {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.use-case-item {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.use-case-label {
		font-size: 0.875rem;
		color: #666;
		min-width: 120px;
	}
</style>
