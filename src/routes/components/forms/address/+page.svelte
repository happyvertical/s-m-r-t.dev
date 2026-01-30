<script lang="ts">
	import { AddressInput } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	let fullAddress = $state({});
	let canadianAddress = $state({
		street: '123 Main Street',
		city: 'Toronto',
		province: 'ON',
		postalCode: 'M5V 1A1',
		country: 'CA'
	});
	let minimalAddress = $state({});

	const addressProps = [
		{
			name: 'name',
			type: 'string',
			description: 'Field name prefix for form submission',
			required: true
		},
		{
			name: 'label',
			type: 'string',
			default: 'undefined',
			description: 'Field label displayed above the address group'
		},
		{
			name: 'description',
			type: 'string',
			default: 'undefined',
			description: 'Description text for voice extraction context'
		},
		{
			name: 'value',
			type: 'Partial<AddressValue>',
			default: '{}',
			description: 'Current address value (bindable)'
		},
		{
			name: 'fields',
			type: 'AddressField[]',
			default: "['street', 'city', 'province', 'postalCode', 'country']",
			description: 'Which address fields to display'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables all inputs'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Marks all visible fields as required'
		},
		{
			name: 'error',
			type: 'string',
			default: 'undefined',
			description: 'Error message to display'
		},
		{
			name: 'countries',
			type: 'Array<{value: string, label: string}>',
			default: "Canada, United States",
			description: 'Country options for dropdown'
		},
		{
			name: 'provinces',
			type: 'Array<{value: string, label: string}>',
			default: "Canadian provinces + US states",
			description: 'Province/state options for dropdown'
		},
		{
			name: 'onchange',
			type: '(value: Partial<AddressValue>) => void',
			default: 'undefined',
			description: 'Callback when any field changes'
		}
	];
</script>

<svelte:head>
	<title>AddressInput | s-m-r-t Forms</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>AddressInput</span>
	</nav>

	<h1>AddressInput</h1>
	<p class="lead">
		A comprehensive address input component with street, city, province/state, postal code,
		and country fields. Supports voice input in smrt mode with intelligent address parsing.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { AddressInput } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>A complete address form with all fields.</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state({});
</script>

<AddressInput
  name="shipping"
  label="Shipping Address"
  bind:value
/>`}
	>
		<AddressInput
			name="shipping"
			label="Shipping Address"
			bind:value={fullAddress}
		/>
	</ComponentExample>

	<h2>With Default Values</h2>
	<p>Pre-populate the address with existing data.</p>

	<ComponentExample
		code={`<AddressInput
  name="billing"
  label="Billing Address"
  value={{
    street: '123 Main Street',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5V 1A1',
    country: 'CA'
  }}
/>`}
	>
		<AddressInput
			name="billing"
			label="Billing Address"
			bind:value={canadianAddress}
		/>
	</ComponentExample>

	<h2>Custom Fields</h2>
	<p>Show only specific fields using the <code>fields</code> prop.</p>

	<ComponentExample
		code={`<AddressInput
  name="simple"
  label="Location"
  fields={['city', 'province', 'country']}
  bind:value
/>`}
	>
		<AddressInput
			name="simple"
			label="Location"
			fields={['city', 'province', 'country']}
			bind:value={minimalAddress}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark all visible fields as required.</p>

	<ComponentExample
		code={`<AddressInput
  name="required"
  label="Delivery Address"
  required
/>`}
	>
		<AddressInput
			name="required"
			label="Delivery Address"
			required
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<AddressInput
  name="disabled"
  label="Confirmed Address"
  value={{
    street: '456 Oak Avenue',
    city: 'Vancouver',
    province: 'BC',
    postalCode: 'V6B 2K1',
    country: 'CA'
  }}
  disabled
/>`}
	>
		<AddressInput
			name="disabled"
			label="Confirmed Address"
			value={{
				street: '456 Oak Avenue',
				city: 'Vancouver',
				province: 'BC',
				postalCode: 'V6B 2K1',
				country: 'CA'
			}}
			disabled
		/>
	</ComponentExample>

	<h2>With Error</h2>
	<p>Display validation errors using the <code>error</code> prop.</p>

	<ComponentExample
		code={`<AddressInput
  name="error"
  label="Address"
  error="Please enter a valid postal code"
/>`}
	>
		<AddressInput
			name="error"
			label="Address"
			error="Please enter a valid postal code"
		/>
	</ComponentExample>

	<h2>Custom Countries and Provinces</h2>
	<p>Provide custom options for countries and provinces.</p>

	<ComponentExample
		code={`<AddressInput
  name="custom"
  label="UK Address"
  countries={[
    { value: 'GB', label: 'United Kingdom' },
    { value: 'IE', label: 'Ireland' }
  ]}
  provinces={[
    { value: 'ENG', label: 'England' },
    { value: 'SCT', label: 'Scotland' },
    { value: 'WLS', label: 'Wales' },
    { value: 'NIR', label: 'Northern Ireland' }
  ]}
/>`}
	>
		<AddressInput
			name="custom"
			label="UK Address"
			countries={[
				{ value: 'GB', label: 'United Kingdom' },
				{ value: 'IE', label: 'Ireland' }
			]}
			provinces={[
				{ value: 'ENG', label: 'England' },
				{ value: 'SCT', label: 'Scotland' },
				{ value: 'WLS', label: 'Wales' },
				{ value: 'NIR', label: 'Northern Ireland' }
			]}
		/>
	</ComponentExample>

	<h2>Voice Input (smrt Mode)</h2>
	<p>
		In smrt mode, users can speak their address naturally. The component parses spoken text
		to extract:
	</p>
	<ul>
		<li>Street addresses (e.g., "123 Main Street")</li>
		<li>Cities</li>
		<li>Provinces/states by name or abbreviation</li>
		<li>Postal/ZIP codes (Canadian and US formats)</li>
		<li>Countries</li>
	</ul>

	<CodeBlock
		code={`<!-- Voice example: "123 Main Street, Toronto, Ontario, M5V 1A1, Canada" -->
<AddressInput
  name="voice"
  label="Address"
  description="A mailing address including street, city, and postal code"
/>`}
		language="svelte"
	/>

	<h2>Interactive Example</h2>
	<p>Fill out the address to see the bound value:</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state({});
</script>

<AddressInput
  name="interactive"
  label="Your Address"
  bind:value
/>
<pre>{JSON.stringify(value, null, 2)}</pre>`}
	>
		<AddressInput
			name="interactive"
			label="Your Address"
			bind:value={fullAddress}
		/>
		<pre style="margin-top: 1rem; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 0.85rem; overflow-x: auto;">{JSON.stringify(fullAddress, null, 2)}</pre>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={addressProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { AddressInput } from '@happyvertical/smrt-svelte';

// AddressValue interface
interface AddressValue {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

// AddressField type
type AddressField = 'street' | 'city' | 'province' | 'postalCode' | 'country';

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  value?: Partial<AddressValue>;
  fields?: AddressField[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  countries?: Array<{ value: string; label: string }>;
  provinces?: Array<{ value: string; label: string }>;
  onchange?: (value: Partial<AddressValue>) => void;
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
