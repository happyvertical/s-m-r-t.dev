<script lang="ts">
	import { SMRTMoney } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let basicValue = $state<number | null>(null);
	let usdValue = $state<number | null>(15000);
	let constrainedValue = $state<number | null>(null);

	const moneyProps = [
		{
			name: 'name',
			type: 'string',
			description: 'Field name for form submission',
			required: true
		},
		{
			name: 'label',
			type: 'string',
			default: 'undefined',
			description: 'Field label displayed above the input'
		},
		{
			name: 'description',
			type: 'string',
			default: 'undefined',
			description: 'Description text for voice extraction context'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: "'0.00'",
			description: 'Placeholder text shown when empty'
		},
		{
			name: 'value',
			type: 'number | null',
			default: 'null',
			description: 'Current value in cents (bindable)'
		},
		{
			name: 'currency',
			type: "'CAD' | 'USD'",
			default: "'CAD'",
			description: 'Currency code for display'
		},
		{
			name: 'min',
			type: 'number',
			default: 'undefined',
			description: 'Minimum value in cents'
		},
		{
			name: 'max',
			type: 'number',
			default: 'undefined',
			description: 'Maximum value in cents'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the input'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Marks field as required'
		},
		{
			name: 'error',
			type: 'string',
			default: 'undefined',
			description: 'Error message to display'
		},
		{
			name: 'onchange',
			type: '(cents: number | null) => void',
			default: 'undefined',
			description: 'Callback when value changes'
		}
	];
</script>

<svelte:head>
	<title>SMRTMoney | SMRT Forms</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>SMRTMoney</span>
	</nav>

	<h1>SMRTMoney</h1>
	<p class="lead">
		A monetary input component that stores values in cents for precision. Supports CAD and USD
		currencies with voice input for natural language amounts in SMRT mode.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { SMRTMoney } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>
		A simple money input. The <code>value</code> is stored in cents (e.g., 15000 = $150.00).
	</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state<number | null>(null);
</script>

<SMRTMoney
  name="amount"
  label="Amount"
  bind:value
/>`}
	>
		<SMRTMoney
			name="amount"
			label="Amount"
			bind:value={basicValue}
		/>
	</ComponentExample>

	<h2>Currency Selection</h2>
	<p>Use <code>currency</code> to switch between CAD (default) and USD.</p>

	<ComponentExample
		code={`<SMRTMoney
  name="usd-amount"
  label="Price (USD)"
  currency="USD"
  value={15000}
/>`}
	>
		<SMRTMoney
			name="usd-amount"
			label="Price (USD)"
			currency="USD"
			bind:value={usdValue}
		/>
	</ComponentExample>

	<h2>With Constraints</h2>
	<p>Use <code>min</code> and <code>max</code> to constrain the value range (in cents).</p>

	<ComponentExample
		code={`<SMRTMoney
  name="donation"
  label="Donation Amount"
  min={500}
  max={100000}
  description="Between $5.00 and $1,000.00"
/>`}
	>
		<SMRTMoney
			name="donation"
			label="Donation Amount"
			min={500}
			max={100000}
			description="Between $5.00 and $1,000.00"
			bind:value={constrainedValue}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the field as required.</p>

	<ComponentExample
		code={`<SMRTMoney
  name="payment"
  label="Payment Amount"
  required
/>`}
	>
		<SMRTMoney
			name="payment"
			label="Payment Amount"
			required
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<SMRTMoney
  name="total"
  label="Order Total"
  value={24999}
  disabled
/>`}
	>
		<SMRTMoney
			name="total"
			label="Order Total"
			value={24999}
			disabled
		/>
	</ComponentExample>

	<h2>With Error</h2>
	<p>Display validation errors using the <code>error</code> prop.</p>

	<ComponentExample
		code={`<SMRTMoney
  name="budget"
  label="Budget"
  error="Budget exceeds available funds"
  value={500000}
/>`}
	>
		<SMRTMoney
			name="budget"
			label="Budget"
			error="Budget exceeds available funds"
			value={500000}
		/>
	</ComponentExample>

	<h2>Voice Input (SMRT Mode)</h2>
	<p>
		In SMRT mode, users can speak monetary amounts naturally. The component parses phrases like:
	</p>
	<ul>
		<li>"one hundred fifty dollars" = 15000 cents</li>
		<li>"twenty five fifty" = 2550 cents ($25.50)</li>
		<li>"fifty cents" = 50 cents</li>
		<li>"a thousand bucks" = 100000 cents</li>
	</ul>

	<CodeBlock
		code={`<!-- Voice example: "one hundred fifty dollars" -->
<SMRTMoney
  name="voice"
  label="Enter Amount"
  description="A monetary amount in dollars"
/>`}
		language="svelte"
	/>

	<h2>Interactive Example</h2>
	<p>Enter an amount to see the cents value:</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state<number | null>(null);
</script>

<SMRTMoney
  name="interactive"
  label="Enter Price"
  bind:value
/>
<p>Value in cents: {value ?? 'null'}</p>
<p>Display: {value ? '$' + (value / 100).toFixed(2) : '(empty)'}</p>`}
	>
		<SMRTMoney
			name="interactive"
			label="Enter Price"
			bind:value={basicValue}
		/>
		<div style="margin-top: 1rem; color: #666;">
			<p>Value in cents: {basicValue ?? 'null'}</p>
			<p>Display: {basicValue ? 'CA$' + (basicValue / 100).toFixed(2) : '(empty)'}</p>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={moneyProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { SMRTMoney } from '@happyvertical/smrt-svelte';

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  value?: number | null; // Value in cents
  currency?: 'CAD' | 'USD';
  min?: number; // In cents
  max?: number; // In cents
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onchange?: (cents: number | null) => void;
}`}
		language="typescript"
	/>

	<h2>Value Format</h2>
	<p>
		The component stores values in <strong>cents</strong> to avoid floating-point precision issues
		common with monetary calculations:
	</p>
	<ul>
		<li><code>$150.00</code> is stored as <code>15000</code></li>
		<li><code>$25.50</code> is stored as <code>2550</code></li>
		<li><code>$0.99</code> is stored as <code>99</code></li>
	</ul>
	<p>
		A hidden input <code>{`{name}_cents`}</code> is included for form submission with the cents value.
	</p>
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

	.prose ul {
		color: #666;
		margin-bottom: 16px;
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 8px;
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
