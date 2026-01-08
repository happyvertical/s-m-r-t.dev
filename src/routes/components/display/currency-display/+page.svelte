<script lang="ts">
	import { CurrencyDisplay } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const currencyDisplayProps = [
		{
			name: 'amount',
			type: 'number',
			description: 'Amount in cents (e.g., 12500 = $125.00)',
			required: true
		},
		{
			name: 'currency',
			type: "'CAD' | 'USD'",
			default: "'CAD'",
			description: 'Currency code'
		},
		{
			name: 'showSign',
			type: 'boolean',
			default: 'false',
			description: 'Show +/- sign for non-zero values'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Display size'
		},
		{
			name: 'highlightNegative',
			type: 'boolean',
			default: 'false',
			description: 'Highlight negative values in red'
		},
		{
			name: 'highlightPositive',
			type: 'boolean',
			default: 'false',
			description: 'Highlight positive values in green'
		}
	];
</script>

<svelte:head>
	<title>CurrencyDisplay | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/display">Display</a>
		<span>/</span>
		<span>CurrencyDisplay</span>
	</nav>

	<h1>CurrencyDisplay</h1>
	<p class="lead">
		Formats and displays monetary values with proper currency symbols and locale formatting. Takes
		amounts in cents for precision and supports CAD/USD currencies.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { CurrencyDisplay } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>
		Pass the amount in cents. The component handles conversion to dollars and proper formatting.
	</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={12500} />
<CurrencyDisplay amount={9999} />
<CurrencyDisplay amount={50} />
<CurrencyDisplay amount={0} />`}
	>
		<CurrencyDisplay amount={12500} />
		<CurrencyDisplay amount={9999} />
		<CurrencyDisplay amount={50} />
		<CurrencyDisplay amount={0} />
	</ComponentExample>

	<h2>Currency Types</h2>
	<p>Supports both CAD (default) and USD currencies.</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={12500} currency="CAD" />
<CurrencyDisplay amount={12500} currency="USD" />`}
	>
		<CurrencyDisplay amount={12500} currency="CAD" />
		<CurrencyDisplay amount={12500} currency="USD" />
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={12500} size="sm" />
<CurrencyDisplay amount={12500} size="md" />
<CurrencyDisplay amount={12500} size="lg" />`}
	>
		<CurrencyDisplay amount={12500} size="sm" />
		<CurrencyDisplay amount={12500} size="md" />
		<CurrencyDisplay amount={12500} size="lg" />
	</ComponentExample>

	<h2>Negative Values</h2>
	<p>Negative amounts are displayed with a minus sign by default.</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={-12500} />
<CurrencyDisplay amount={-5000} />
<CurrencyDisplay amount={-99} />`}
	>
		<CurrencyDisplay amount={-12500} />
		<CurrencyDisplay amount={-5000} />
		<CurrencyDisplay amount={-99} />
	</ComponentExample>

	<h2>Show Sign</h2>
	<p>
		Use <code>showSign</code> to explicitly show + or - signs for non-zero values.
	</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={12500} showSign />
<CurrencyDisplay amount={-12500} showSign />
<CurrencyDisplay amount={0} showSign />`}
	>
		<CurrencyDisplay amount={12500} showSign />
		<CurrencyDisplay amount={-12500} showSign />
		<CurrencyDisplay amount={0} showSign />
	</ComponentExample>

	<h2>Highlight Negative Values</h2>
	<p>
		Use <code>highlightNegative</code> to display negative amounts in red.
	</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={12500} highlightNegative />
<CurrencyDisplay amount={-12500} highlightNegative />
<CurrencyDisplay amount={-5000} highlightNegative size="lg" />`}
	>
		<CurrencyDisplay amount={12500} highlightNegative />
		<CurrencyDisplay amount={-12500} highlightNegative />
		<CurrencyDisplay amount={-5000} highlightNegative size="lg" />
	</ComponentExample>

	<h2>Highlight Positive Values</h2>
	<p>
		Use <code>highlightPositive</code> to display positive amounts in green.
	</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={12500} highlightPositive />
<CurrencyDisplay amount={-12500} highlightPositive />
<CurrencyDisplay amount={5000} highlightPositive size="lg" />`}
	>
		<CurrencyDisplay amount={12500} highlightPositive />
		<CurrencyDisplay amount={-12500} highlightPositive />
		<CurrencyDisplay amount={5000} highlightPositive size="lg" />
	</ComponentExample>

	<h2>Combined Highlighting</h2>
	<p>Use both highlight props for profit/loss displays.</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={25000} highlightPositive highlightNegative showSign />
<CurrencyDisplay amount={-15000} highlightPositive highlightNegative showSign />
<CurrencyDisplay amount={0} highlightPositive highlightNegative showSign />`}
	>
		<CurrencyDisplay amount={25000} highlightPositive highlightNegative showSign />
		<CurrencyDisplay amount={-15000} highlightPositive highlightNegative showSign />
		<CurrencyDisplay amount={0} highlightPositive highlightNegative showSign />
	</ComponentExample>

	<h2>Use Cases</h2>

	<h3>Invoice Totals</h3>
	<ComponentExample
		code={`<CurrencyDisplay amount={125000} size="lg" />
<CurrencyDisplay amount={999900} size="lg" />`}
	>
		<div class="use-case-grid">
			<div class="use-case-item">
				<span class="use-case-label">Subtotal</span>
				<CurrencyDisplay amount={125000} size="lg" />
			</div>
			<div class="use-case-item">
				<span class="use-case-label">Grand Total</span>
				<CurrencyDisplay amount={999900} size="lg" />
			</div>
		</div>
	</ComponentExample>

	<h3>Account Balance</h3>
	<ComponentExample
		code={`<CurrencyDisplay amount={50000} highlightPositive highlightNegative size="lg" />
<CurrencyDisplay amount={-12500} highlightPositive highlightNegative size="lg" />`}
	>
		<div class="use-case-grid">
			<div class="use-case-item">
				<span class="use-case-label">Available</span>
				<CurrencyDisplay amount={50000} highlightPositive highlightNegative size="lg" />
			</div>
			<div class="use-case-item">
				<span class="use-case-label">Overdue</span>
				<CurrencyDisplay amount={-12500} highlightPositive highlightNegative size="lg" />
			</div>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={currencyDisplayProps} />

	<h2>Notes</h2>
	<CodeBlock
		code={`// Amounts are in cents for precision
// 12500 cents = $125.00
// Uses Intl.NumberFormat with en-CA locale
// Tabular nums font feature for aligned digits`}
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
		justify-content: space-between;
		gap: 24px;
		padding: 8px 0;
	}

	.use-case-label {
		font-size: 0.875rem;
		color: #666;
	}
</style>
