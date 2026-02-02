<script lang="ts">
	import { CurrencyDisplay } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const currencyDisplayProps = [
		{
			name: 'amount',
			type: 'number',
			description: 'Amount in cents',
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
		Formatted currency values with locale support. Takes amounts in cents and displays formatted
		currency with proper symbols.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { CurrencyDisplay } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display currency values (amounts are in cents).</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={12345} />
<CurrencyDisplay amount={9900} />
<CurrencyDisplay amount={50} />`}
	>
		<div style="display: flex; gap: 16px; flex-wrap: wrap;">
			<CurrencyDisplay amount={12345} />
			<CurrencyDisplay amount={9900} />
			<CurrencyDisplay amount={50} />
		</div>
	</ComponentExample>

	<h2>Currency Types</h2>
	<p>Support for CAD and USD currencies.</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={9999} currency="CAD" />
<CurrencyDisplay amount={9999} currency="USD" />`}
	>
		<div style="display: flex; gap: 16px;">
			<div>
				<div style="font-size: 0.75rem; color: #666; margin-bottom: 4px;">CAD</div>
				<CurrencyDisplay amount={9999} currency="CAD" />
			</div>
			<div>
				<div style="font-size: 0.75rem; color: #666; margin-bottom: 4px;">USD</div>
				<CurrencyDisplay amount={9999} currency="USD" />
			</div>
		</div>
	</ComponentExample>

	<h2>Negative Values</h2>
	<p>Display negative amounts with optional highlighting.</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={-5000} />
<CurrencyDisplay amount={-5000} highlightNegative />`}
	>
		<div style="display: flex; gap: 16px;">
			<div>
				<div style="font-size: 0.75rem; color: #666; margin-bottom: 4px;">Default</div>
				<CurrencyDisplay amount={-5000} />
			</div>
			<div>
				<div style="font-size: 0.75rem; color: #666; margin-bottom: 4px;">Highlighted</div>
				<CurrencyDisplay amount={-5000} highlightNegative />
			</div>
		</div>
	</ComponentExample>

	<h2>With Sign</h2>
	<p>Show explicit +/- signs for all non-zero values.</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={2500} showSign />
<CurrencyDisplay amount={-1500} showSign />`}
	>
		<div style="display: flex; gap: 16px;">
			<CurrencyDisplay amount={2500} showSign />
			<CurrencyDisplay amount={-1500} showSign />
		</div>
	</ComponentExample>

	<h2>Highlighted Values</h2>
	<p>Color-code positive and negative values.</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={15000} highlightPositive />
<CurrencyDisplay amount={-8000} highlightNegative />`}
	>
		<div style="display: flex; gap: 16px;">
			<div>
				<div style="font-size: 0.75rem; color: #666; margin-bottom: 4px;">Profit</div>
				<CurrencyDisplay amount={15000} highlightPositive />
			</div>
			<div>
				<div style="font-size: 0.75rem; color: #666; margin-bottom: 4px;">Loss</div>
				<CurrencyDisplay amount={-8000} highlightNegative />
			</div>
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Available in small, medium, and large sizes.</p>

	<ComponentExample
		code={`<CurrencyDisplay amount={9999} size="sm" />
<CurrencyDisplay amount={9999} size="md" />
<CurrencyDisplay amount={9999} size="lg" />`}
	>
		<div style="display: flex; gap: 16px; align-items: center;">
			<CurrencyDisplay amount={9999} size="sm" />
			<CurrencyDisplay amount={9999} size="md" />
			<CurrencyDisplay amount={9999} size="lg" />
		</div>
	</ComponentExample>

	<h2>Table Example</h2>
	<p>Using CurrencyDisplay in a data table.</p>

	<ComponentExample
		code={`<table>
  <tr><td>Revenue</td><td><CurrencyDisplay amount={125000} highlightPositive /></td></tr>
  <tr><td>Expenses</td><td><CurrencyDisplay amount={-45000} highlightNegative /></td></tr>
  <tr><td>Profit</td><td><CurrencyDisplay amount={80000} highlightPositive size="lg" /></td></tr>
</table>`}
	>
		<table style="width: 100%; border-collapse: collapse;">
			<tbody>
				<tr style="border-bottom: 1px solid #eee;">
					<td style="padding: 12px 0;">Revenue</td>
					<td style="padding: 12px 0; text-align: right;">
						<CurrencyDisplay amount={125000} highlightPositive />
					</td>
				</tr>
				<tr style="border-bottom: 1px solid #eee;">
					<td style="padding: 12px 0;">Expenses</td>
					<td style="padding: 12px 0; text-align: right;">
						<CurrencyDisplay amount={-45000} highlightNegative />
					</td>
				</tr>
				<tr>
					<td style="padding: 12px 0; font-weight: 600;">Profit</td>
					<td style="padding: 12px 0; text-align: right;">
						<CurrencyDisplay amount={80000} highlightPositive size="lg" />
					</td>
				</tr>
			</tbody>
		</table>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={currencyDisplayProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { CurrencyDisplay } from '@happyvertical/smrt-svelte';

interface Props {
  amount: number;  // In cents
  currency?: 'CAD' | 'USD';
  showSign?: boolean;
  size?: 'sm' | 'md' | 'lg';
  highlightNegative?: boolean;
  highlightPositive?: boolean;
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
