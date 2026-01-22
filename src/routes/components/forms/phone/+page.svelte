<script lang="ts">
	import { PhoneInput } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	let basicPhone = $state('');
	let canadianPhone = $state('+1 (416) 555-0123');
	let usPhone = $state('');
	let interactivePhone = $state('');

	const phoneProps = [
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
			default: "'+1 (555) 555-5555'",
			description: 'Placeholder text shown when empty'
		},
		{
			name: 'value',
			type: 'string',
			default: "''",
			description: 'Current phone number value (bindable)'
		},
		{
			name: 'country',
			type: "'CA' | 'US'",
			default: "'CA'",
			description: 'Country code for format validation'
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
			type: '(value: string) => void',
			default: 'undefined',
			description: 'Callback when value changes'
		}
	];
</script>

<svelte:head>
	<title>PhoneInput | SMRT Forms</title>
	<meta name="description" content="Phone number input component with formatting and validation for CA and US numbers." />
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>PhoneInput</span>
	</nav>

	<h1>PhoneInput</h1>
	<p class="lead">
		A phone number input with automatic formatting for Canadian and US numbers. Supports voice
		input in SMRT mode with natural language number parsing.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { PhoneInput } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>A simple phone input with automatic formatting as you type.</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');
</script>

<PhoneInput
  name="phone"
  label="Phone Number"
  bind:value
/>`}
	>
		<PhoneInput
			name="phone"
			label="Phone Number"
			bind:value={basicPhone}
		/>
	</ComponentExample>

	<h2>With Default Value</h2>
	<p>Pre-populate with a formatted phone number.</p>

	<ComponentExample
		code={`<PhoneInput
  name="contact"
  label="Contact Phone"
  value="+1 (416) 555-0123"
/>`}
	>
		<PhoneInput
			name="contact"
			label="Contact Phone"
			bind:value={canadianPhone}
		/>
	</ComponentExample>

	<h2>US Phone Number</h2>
	<p>Set <code>country="US"</code> for US-specific formatting.</p>

	<ComponentExample
		code={`<PhoneInput
  name="us-phone"
  label="US Phone Number"
  country="US"
  placeholder="+1 (555) 555-5555"
  bind:value
/>`}
	>
		<PhoneInput
			name="us-phone"
			label="US Phone Number"
			country="US"
			placeholder="+1 (555) 555-5555"
			bind:value={usPhone}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the field as required.</p>

	<ComponentExample
		code={`<PhoneInput
  name="required-phone"
  label="Mobile Number"
  required
/>`}
	>
		<PhoneInput
			name="required-phone"
			label="Mobile Number"
			required
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<PhoneInput
  name="verified"
  label="Verified Phone"
  value="+1 (416) 555-0199"
  disabled
/>`}
	>
		<PhoneInput
			name="verified"
			label="Verified Phone"
			value="+1 (416) 555-0199"
			disabled
		/>
	</ComponentExample>

	<h2>With Error</h2>
	<p>Display validation errors using the <code>error</code> prop.</p>

	<ComponentExample
		code={`<PhoneInput
  name="error-phone"
  label="Phone Number"
  value="123"
  error="Please enter a valid phone number"
/>`}
	>
		<PhoneInput
			name="error-phone"
			label="Phone Number"
			value="123"
			error="Please enter a valid phone number"
		/>
	</ComponentExample>

	<h2>With Description</h2>
	<p>Add a <code>description</code> for additional context in SMRT mode.</p>

	<ComponentExample
		code={`<PhoneInput
  name="business"
  label="Business Phone"
  description="Your company's main phone number"
/>`}
	>
		<PhoneInput
			name="business"
			label="Business Phone"
			description="Your company's main phone number"
		/>
	</ComponentExample>

	<h2>Voice Input (SMRT Mode)</h2>
	<p>
		In SMRT mode, users can speak phone numbers naturally. The component parses spoken digits:
	</p>
	<ul>
		<li>"four one six five five five zero one two three" → +1 (416) 555-0123</li>
		<li>"four one six, five five five, zero one two three" → +1 (416) 555-0123</li>
		<li>"area code four one six, five five five, zero one two three" → +1 (416) 555-0123</li>
	</ul>

	<CodeBlock
		code={`<!-- Voice example: "four one six five five five zero one two three" -->
<PhoneInput
  name="voice"
  label="Phone Number"
  description="A ten digit phone number"
/>`}
		language="svelte"
	/>

	<h2>Interactive Example</h2>
	<p>Enter a phone number to see automatic formatting:</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');
</script>

<PhoneInput
  name="interactive"
  label="Enter Phone"
  bind:value
/>
<p>Raw value: {value || '(empty)'}</p>`}
	>
		<PhoneInput
			name="interactive"
			label="Enter Phone"
			bind:value={interactivePhone}
		/>
		<p style="margin-top: 1rem; color: #666;">Raw value: {interactivePhone || '(empty)'}</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={phoneProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { PhoneInput } from '@happyvertical/smrt-svelte';

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  value?: string;
  country?: 'CA' | 'US';
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onchange?: (value: string) => void;
}`}
		language="typescript"
	/>

	<h2>Format Details</h2>
	<p>
		The component automatically formats numbers as you type:
	</p>
	<ul>
		<li>Canadian format: <code>+1 (416) 555-0123</code></li>
		<li>US format: <code>+1 (555) 555-5555</code></li>
		<li>Removes non-digit characters during input</li>
		<li>Validates 10-digit format (excluding country code)</li>
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
