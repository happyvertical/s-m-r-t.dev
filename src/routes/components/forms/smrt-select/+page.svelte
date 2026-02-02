<script lang="ts">
	import { SelectInput } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	let selectedCountry = $state('');
	let selectedSize = $state('');
	let selectedPriority = $state('medium');

	const countryOptions = [
		{ value: 'ca', label: 'Canada' },
		{ value: 'us', label: 'United States' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'au', label: 'Australia' }
	];

	const sizeOptions = [
		{ value: 'xs', label: 'Extra Small' },
		{ value: 'sm', label: 'Small' },
		{ value: 'md', label: 'Medium' },
		{ value: 'lg', label: 'Large' },
		{ value: 'xl', label: 'Extra Large' }
	];

	const priorityOptions = [
		{ value: 'low', label: 'Low Priority' },
		{ value: 'medium', label: 'Medium Priority' },
		{ value: 'high', label: 'High Priority' },
		{ value: 'urgent', label: 'Urgent' }
	];

	const selectProps = [
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
			description: 'Field label displayed above the select'
		},
		{
			name: 'description',
			type: 'string',
			default: 'undefined',
			description: 'Description text for voice extraction context'
		},
		{
			name: 'options',
			type: 'SelectOption[]',
			description: 'Array of options with value and label properties',
			required: true
		},
		{
			name: 'placeholder',
			type: 'string',
			default: "'Select an option...'",
			description: 'Placeholder text shown when no option is selected'
		},
		{
			name: 'value',
			type: 'string',
			default: "''",
			description: 'Currently selected value (bindable)'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the select'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Marks field as required'
		},
		{
			name: 'onchange',
			type: '(value: string) => void',
			default: 'undefined',
			description: 'Callback when selection changes'
		}
	];
</script>

<svelte:head>
	<title>SelectInput | s-m-r-t Forms</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>SelectInput</span>
	</nav>

	<h1>SelectInput</h1>
	<p class="lead">
		A Material Design 3 styled select dropdown with support for voice selection in smrt mode.
		Provides consistent styling and integrates with the SMRT form context.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { SelectInput } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Pass an array of options with <code>value</code> and <code>label</code> properties.</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');

  const options = [
    { value: 'ca', label: 'Canada' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' }
  ];
</script>

<SelectInput
  name="country"
  label="Country"
  {options}
  bind:value
/>`}
	>
		<SelectInput
			name="country"
			label="Country"
			options={countryOptions}
			bind:value={selectedCountry}
		/>
	</ComponentExample>

	<h2>With Default Value</h2>
	<p>Set an initial value to pre-select an option.</p>

	<ComponentExample
		code={`<SelectInput
  name="priority"
  label="Priority Level"
  options={priorityOptions}
  value="medium"
/>`}
	>
		<SelectInput
			name="priority"
			label="Priority Level"
			options={priorityOptions}
			bind:value={selectedPriority}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the field as required.</p>

	<ComponentExample
		code={`<SelectInput
  name="size"
  label="Size"
  options={sizeOptions}
  required
  bind:value
/>`}
	>
		<SelectInput
			name="size"
			label="Size"
			options={sizeOptions}
			required
			bind:value={selectedSize}
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<SelectInput
  name="disabled"
  label="Disabled Select"
  options={sizeOptions}
  value="md"
  disabled
/>`}
	>
		<SelectInput
			name="disabled"
			label="Disabled Select"
			options={sizeOptions}
			value="md"
			disabled
		/>
	</ComponentExample>

	<h2>Custom Placeholder</h2>
	<p>Customize the placeholder text shown when no option is selected.</p>

	<ComponentExample
		code={`<SelectInput
  name="country"
  label="Select Your Country"
  options={countryOptions}
  placeholder="Choose a country..."
/>`}
	>
		<SelectInput
			name="country2"
			label="Select Your Country"
			options={countryOptions}
			placeholder="Choose a country..."
		/>
	</ComponentExample>

	<h2>With Description</h2>
	<p>Add a <code>description</code> for additional context, shown when focused.</p>

	<ComponentExample
		code={`<SelectInput
  name="country"
  label="Country of Residence"
  description="Select where you currently live"
  options={countryOptions}
/>`}
	>
		<SelectInput
			name="country3"
			label="Country of Residence"
			description="Select where you currently live"
			options={countryOptions}
		/>
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>Select an option to see the bound value update:</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');
</script>

<SelectInput
  name="interactive"
  label="Pick a size"
  options={sizeOptions}
  bind:value
/>
<p>Selected: {value || '(none)'}</p>`}
	>
		<SelectInput
			name="interactive"
			label="Pick a size"
			options={sizeOptions}
			bind:value={selectedSize}
		/>
		<p style="margin-top: 1rem; color: #666;">Selected: {selectedSize || '(none)'}</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={selectProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { SelectInput } from '@happyvertical/smrt-svelte';
import type { SelectOption } from '@happyvertical/smrt-svelte';

// SelectOption interface
interface SelectOption {
  value: string;
  label: string;
}

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  onchange?: (value: string) => void;
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
