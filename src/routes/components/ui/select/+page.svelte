<script lang="ts">
	import { Select } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let selectedFruit = $state('');
	let selectedSize = $state('md');

	const selectProps = [
		{
			name: 'variant',
			type: "'default' | 'error'",
			default: "'default'",
			description: 'Visual style variant'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Select size'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the select'
		},
		{
			name: 'value',
			type: 'string',
			default: "''",
			description: 'Selected value (bindable)'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Option elements',
			required: true
		},
		{
			name: '...rest',
			type: 'HTMLSelectAttributes',
			description: 'All standard HTML select attributes are supported'
		}
	];
</script>

<svelte:head>
	<title>Select | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ui">UI</a>
		<span>/</span>
		<span>Select</span>
	</nav>

	<h1>Select</h1>
	<p class="lead">
		A styled dropdown select component with custom arrow styling. Supports multiple variants,
		sizes, and all native select attributes.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Select } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Provide options as children elements.</p>

	<ComponentExample
		code={`<Select>
  <option value="">Choose a fruit...</option>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
</Select>`}
	>
		<div class="select-container">
			<Select>
				<option value="">Choose a fruit...</option>
				<option value="apple">Apple</option>
				<option value="banana">Banana</option>
				<option value="orange">Orange</option>
			</Select>
		</div>
	</ComponentExample>

	<h2>Variants</h2>
	<p>The Select component supports two variants: <code>default</code> and <code>error</code>.</p>

	<ComponentExample
		code={`<Select variant="default">
  <option value="">Default select</option>
  <option value="1">Option 1</option>
</Select>
<Select variant="error">
  <option value="">Error select</option>
  <option value="1">Option 1</option>
</Select>`}
	>
		<div class="select-container">
			<Select variant="default">
				<option value="">Default select</option>
				<option value="1">Option 1</option>
			</Select>
		</div>
		<div class="select-container">
			<Select variant="error">
				<option value="">Error select</option>
				<option value="1">Option 1</option>
			</Select>
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</p>

	<ComponentExample
		code={`<Select size="sm">
  <option value="">Small</option>
  <option value="1">Option 1</option>
</Select>
<Select size="md">
  <option value="">Medium</option>
  <option value="1">Option 1</option>
</Select>
<Select size="lg">
  <option value="">Large</option>
  <option value="1">Option 1</option>
</Select>`}
	>
		<div class="select-container">
			<Select size="sm">
				<option value="">Small</option>
				<option value="1">Option 1</option>
			</Select>
		</div>
		<div class="select-container">
			<Select size="md">
				<option value="">Medium</option>
				<option value="1">Option 1</option>
			</Select>
		</div>
		<div class="select-container">
			<Select size="lg">
				<option value="">Large</option>
				<option value="1">Option 1</option>
			</Select>
		</div>
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>Use two-way binding with <code>bind:value</code>:</p>

	<ComponentExample
		code={`<script lang="ts">
  let selectedFruit = $state('');
</script>

<Select bind:value={selectedFruit}>
  <option value="">Choose a fruit...</option>
  <option value="apple">Apple</option>
  <option value="banana">Banana</option>
  <option value="orange">Orange</option>
</Select>

<p>Selected: {selectedFruit || '(none)'}</p>`}
	>
		<div class="stacked">
			<div class="select-container">
				<Select bind:value={selectedFruit}>
					<option value="">Choose a fruit...</option>
					<option value="apple">Apple</option>
					<option value="banana">Banana</option>
					<option value="orange">Orange</option>
				</Select>
			</div>
			<p class="value-display">Selected: {selectedFruit || '(none)'}</p>
		</div>
	</ComponentExample>

	<h2>With Option Groups</h2>
	<p>Use <code>optgroup</code> to organize options.</p>

	<ComponentExample
		code={`<Select>
  <option value="">Select a car...</option>
  <optgroup label="Swedish Cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
  </optgroup>
  <optgroup label="German Cars">
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
  </optgroup>
</Select>`}
	>
		<div class="select-container">
			<Select>
				<option value="">Select a car...</option>
				<optgroup label="Swedish Cars">
					<option value="volvo">Volvo</option>
					<option value="saab">Saab</option>
				</optgroup>
				<optgroup label="German Cars">
					<option value="mercedes">Mercedes</option>
					<option value="audi">Audi</option>
				</optgroup>
			</Select>
		</div>
	</ComponentExample>

	<h2>Disabled State</h2>

	<ComponentExample
		code={`<Select disabled>
  <option value="">Disabled select</option>
  <option value="1">Option 1</option>
</Select>
<Select disabled value="selected">
  <option value="">Disabled select</option>
  <option value="selected">Selected option</option>
</Select>`}
	>
		<div class="select-container">
			<Select disabled>
				<option value="">Disabled select</option>
				<option value="1">Option 1</option>
			</Select>
		</div>
		<div class="select-container">
			<Select disabled value="selected">
				<option value="">Disabled select</option>
				<option value="selected">Selected option</option>
			</Select>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={selectProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Snippet } from 'svelte';
import type { HTMLSelectAttributes } from 'svelte/elements';

type SelectVariant = 'default' | 'error';
type SelectSize = 'sm' | 'md' | 'lg';

interface Props extends Omit<HTMLSelectAttributes, 'class' | 'size'> {
  variant?: SelectVariant;
  size?: SelectSize;
  value?: string;
  children?: Snippet;
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

	.select-container {
		width: 250px;
	}

	.stacked {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		max-width: 300px;
	}

	.value-display {
		font-size: 0.9rem;
		color: #666;
		margin: 0;
	}
</style>
