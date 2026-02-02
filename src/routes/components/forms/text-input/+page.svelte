<script lang="ts">
	import { TextInput } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';
	let basicValue = $state('');
	let emailValue = $state('');
	let requiredValue = $state('');

	const textInputProps = [
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
			description: 'Description text for LLM field extraction'
		},
		{
			name: 'type',
			type: "'text' | 'email'",
			default: "'text'",
			description: 'Input type - text or email with validation'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: "''",
			description: 'Placeholder text shown when empty'
		},
		{
			name: 'value',
			type: 'string',
			default: "''",
			description: 'Current value (bindable)'
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
			name: 'appendMode',
			type: 'boolean',
			default: 'false',
			description: 'Append to existing value instead of overwriting (for voice input)'
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
	<title>TextInput | s-m-r-t Forms</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>TextInput</span>
	</nav>

	<h1>TextInput</h1>
	<p class="lead">
		A Material Design 3 inspired text input with optional voice input support in smrt mode. Supports
		text and email types with built-in validation.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { TextInput } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>The simplest text input with a label and bindable value.</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');
</script>

<TextInput
  name="username"
  label="Username"
  bind:value
/>`}
	>
		<TextInput name="username" label="Username" bind:value={basicValue} />
	</ComponentExample>

	<h2>Email Type</h2>
	<p>Use <code>type="email"</code> for built-in email validation.</p>

	<ComponentExample
		code={`<TextInput
  name="email"
  label="Email Address"
  type="email"
  placeholder="you@example.com"
  bind:value
/>`}
	>
		<TextInput
			name="email"
			label="Email Address"
			type="email"
			placeholder="you@example.com"
			bind:value={emailValue}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the field as required (shows an asterisk).</p>

	<ComponentExample
		code={`<TextInput
  name="fullName"
  label="Full Name"
  required
  bind:value
/>`}
	>
		<TextInput name="fullName" label="Full Name" required bind:value={requiredValue} />
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<TextInput
  name="disabled"
  label="Disabled Field"
  value="Cannot edit this"
  disabled
/>`}
	>
		<TextInput name="disabled" label="Disabled Field" value="Cannot edit this" disabled />
	</ComponentExample>

	<h2>With Description</h2>
	<p>
		Add a <code>description</code> for context, shown when the field is focused. Also used by AI for voice
		extraction.
	</p>

	<ComponentExample
		code={`<TextInput
  name="bio"
  label="Short Bio"
  description="A brief description about yourself"
  placeholder="Tell us about yourself..."
/>`}
	>
		<TextInput
			name="bio"
			label="Short Bio"
			description="A brief description about yourself"
			placeholder="Tell us about yourself..."
		/>
	</ComponentExample>

	<h2>Voice Input (smrt Mode)</h2>
	<p>
		When the application is in smrt mode, a microphone button appears. Users can hold to speak and
		the input will be processed via speech-to-text. The <code>appendMode</code> prop controls whether
		spoken text replaces or appends to existing content.
	</p>

	<CodeBlock
		code={`<!-- In smrt mode, this input shows a mic button -->
<TextInput
  name="notes"
  label="Notes"
  appendMode
  description="Any additional notes"
/>`}
		language="svelte"
	/>

	<h2>Interactive Example</h2>
	<p>Type in the field to see the bound value update:</p>

	<ComponentExample
		code={`<script lang="ts">
  let value = $state('');
</script>

<TextInput
  name="interactive"
  label="Type something"
  bind:value
/>
<p>Current value: {value || '(empty)'}</p>`}
	>
		<TextInput name="interactive" label="Type something" bind:value={basicValue} />
		<p style="margin-top: 1rem; color: #666;">Current value: {basicValue || '(empty)'}</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={textInputProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { TextInput } from '@happyvertical/smrt-svelte';

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  type?: 'text' | 'email';
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  appendMode?: boolean;
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
