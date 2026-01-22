<script lang="ts">
	import { NumberInput } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	let basicValue = $state<number | null>(null);
	let ageValue = $state<number | null>(25);
	let quantityValue = $state<number | null>(1);
	let decimalValue = $state<number | null>(null);
	let interactiveValue = $state<number | null>(null);

	const numberProps = [
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
			default: "'0'",
			description: 'Placeholder text shown when empty'
		},
		{
			name: 'value',
			type: 'number | null',
			default: 'null',
			description: 'Current numeric value (bindable)'
		},
		{
			name: 'min',
			type: 'number',
			default: 'undefined',
			description: 'Minimum allowed value'
		},
		{
			name: 'max',
			type: 'number',
			default: 'undefined',
			description: 'Maximum allowed value'
		},
		{
			name: 'step',
			type: 'number',
			default: '1',
			description: 'Increment/decrement step value'
		},
		{
			name: 'decimals',
			type: 'number',
			default: '0',
			description: 'Number of decimal places (0 for integers)'
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
			type: '(value: number | null) => void',
			default: 'undefined',
			description: 'Callback when value changes'
		}
	];
</script>

<svelte:head>
	<title>NumberInput | SMRT Forms</title>
	<meta name="description" content="Numeric input component with validation, constraints, and voice input for numbers." />
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>NumberInput</span>
	</nav>

	<h1>NumberInput</h1>
	<p class="lead">
		A numeric input component with constraints, step controls, and voice input support in SMRT mode.
		Handles both integers and decimals with proper validation.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { NumberInput } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>A simple number input for integer values.</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state<number | null>(null);
</script>

<NumberInput
  name="quantity"
  label="Quantity"
  bind:value
/>`}
	>
		<NumberInput
			name="quantity"
			label="Quantity"
			bind:value={basicValue}
		/>
	</ComponentExample>

	<h2>With Default Value</h2>
	<p>Pre-populate with an initial number.</p>

	<ComponentExample
		code={`<NumberInput
  name="age"
  label="Age"
  value={25}
/>`}
	>
		<NumberInput
			name="age"
			label="Age"
			bind:value={ageValue}
		/>
	</ComponentExample>

	<h2>With Constraints</h2>
	<p>Use <code>min</code> and <code>max</code> to limit the value range.</p>

	<ComponentExample
		code={`<NumberInput
  name="items"
  label="Items"
  min={1}
  max={100}
  value={1}
  description="Between 1 and 100"
/>`}
	>
		<NumberInput
			name="items"
			label="Items"
			min={1}
			max={100}
			bind:value={quantityValue}
			description="Between 1 and 100"
		/>
	</ComponentExample>

	<h2>Custom Step</h2>
	<p>Set the <code>step</code> for increment/decrement controls.</p>

	<ComponentExample
		code={`<NumberInput
  name="discount"
  label="Discount (%)"
  min={0}
  max={100}
  step={5}
  placeholder="0"
/>`}
	>
		<NumberInput
			name="discount"
			label="Discount (%)"
			min={0}
			max={100}
			step={5}
			placeholder="0"
		/>
	</ComponentExample>

	<h2>Decimal Numbers</h2>
	<p>Use <code>decimals</code> to allow decimal places (e.g., for prices, weights).</p>

	<ComponentExample
		code={`<NumberInput
  name="weight"
  label="Weight (kg)"
  decimals={2}
  step={0.1}
  min={0}
  placeholder="0.00"
  bind:value
/>`}
	>
		<NumberInput
			name="weight"
			label="Weight (kg)"
			decimals={2}
			step={0.1}
			min={0}
			placeholder="0.00"
			bind:value={decimalValue}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the field as required.</p>

	<ComponentExample
		code={`<NumberInput
  name="participants"
  label="Number of Participants"
  min={1}
  required
/>`}
	>
		<NumberInput
			name="participants"
			label="Number of Participants"
			min={1}
			required
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<NumberInput
  name="total"
  label="Total Score"
  value={87}
  disabled
/>`}
	>
		<NumberInput
			name="total"
			label="Total Score"
			value={87}
			disabled
		/>
	</ComponentExample>

	<h2>With Error</h2>
	<p>Display validation errors using the <code>error</code> prop.</p>

	<ComponentExample
		code={`<NumberInput
  name="invalid"
  label="Age"
  value={150}
  error="Age must be between 0 and 120"
/>`}
	>
		<NumberInput
			name="invalid"
			label="Age"
			value={150}
			error="Age must be between 0 and 120"
		/>
	</ComponentExample>

	<h2>Voice Input (SMRT Mode)</h2>
	<p>
		In SMRT mode, users can speak numbers naturally. The component parses:
	</p>
	<ul>
		<li>"twenty five" → 25</li>
		<li>"one hundred fifty" → 150</li>
		<li>"three point one four" → 3.14 (with decimals enabled)</li>
		<li>"negative ten" → -10</li>
		<li>"zero" → 0</li>
	</ul>

	<CodeBlock
		code={`<!-- Voice example: "twenty five" -->
<NumberInput
  name="voice"
  label="Enter a Number"
  description="A numeric value"
/>`}
		language="svelte"
	/>

	<h2>Interactive Example</h2>
	<p>Enter a number to see validation and value updates:</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state<number | null>(null);
</script>

<NumberInput
  name="interactive"
  label="Enter Value"
  min={0}
  max={1000}
  bind:value
/>
<p>Current value: {value ?? 'null'}</p>
<p>Valid: {value !== null && value >= 0 && value <= 1000 ? 'Yes' : 'No'}</p>`}
	>
		<NumberInput
			name="interactive"
			label="Enter Value"
			min={0}
			max={1000}
			bind:value={interactiveValue}
		/>
		<div style="margin-top: 1rem; color: #666;">
			<p>Current value: {interactiveValue ?? 'null'}</p>
			<p>Valid: {interactiveValue !== null && interactiveValue >= 0 && interactiveValue <= 1000 ? 'Yes' : 'No'}</p>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={numberProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { NumberInput } from '@happyvertical/smrt-svelte';

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  value?: number | null;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onchange?: (value: number | null) => void;
}`}
		language="typescript"
	/>

	<h2>Validation</h2>
	<p>
		The component enforces constraints automatically:
	</p>
	<ul>
		<li>Values outside <code>min</code>/<code>max</code> range are rejected</li>
		<li>Non-numeric input is stripped</li>
		<li>Decimal places are limited by the <code>decimals</code> prop</li>
		<li>Required fields prevent form submission when empty</li>
		<li>Browser native validation provides immediate feedback</li>
	</ul>
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
