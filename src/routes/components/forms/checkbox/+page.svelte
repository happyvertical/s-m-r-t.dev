<script lang="ts">
	import { CheckboxInput } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let termsAccepted = $state(false);
	let newsletterOptIn = $state(true);
	let interactiveChecked = $state(false);

	const checkboxProps = [
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
			description: 'Label text displayed next to the checkbox'
		},
		{
			name: 'description',
			type: 'string',
			default: 'undefined',
			description: 'Description text for voice extraction context'
		},
		{
			name: 'checked',
			type: 'boolean',
			default: 'false',
			description: 'Current checked state (bindable)'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the checkbox'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Marks field as required'
		},
		{
			name: 'onchange',
			type: '(checked: boolean) => void',
			default: 'undefined',
			description: 'Callback when checked state changes'
		}
	];
</script>

<svelte:head>
	<title>CheckboxInput | SMRT Forms</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>CheckboxInput</span>
	</nav>

	<h1>CheckboxInput</h1>
	<p class="lead">
		A Material Design 3 styled checkbox with ripple effect and voice control support in SMRT mode.
		Perfect for boolean options, terms acceptance, and feature toggles.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { CheckboxInput } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>A simple checkbox with a label and bindable checked state.</p>

	<ComponentExample
		code={`<script lang="ts">
  let checked = $state(false);
</script>

<CheckboxInput
  name="terms"
  label="I accept the terms and conditions"
  bind:checked
/>`}
	>
		<CheckboxInput
			name="terms"
			label="I accept the terms and conditions"
			bind:checked={termsAccepted}
		/>
	</ComponentExample>

	<h2>Default Checked</h2>
	<p>Set <code>checked</code> to <code>true</code> for an initially checked state.</p>

	<ComponentExample
		code={`<CheckboxInput
  name="newsletter"
  label="Subscribe to newsletter"
  checked={true}
/>`}
	>
		<CheckboxInput
			name="newsletter"
			label="Subscribe to newsletter"
			bind:checked={newsletterOptIn}
		/>
	</ComponentExample>

	<h2>Required Field</h2>
	<p>Add <code>required</code> to mark the checkbox as required (shows an asterisk).</p>

	<ComponentExample
		code={`<CheckboxInput
  name="privacy"
  label="I have read and agree to the Privacy Policy"
  required
/>`}
	>
		<CheckboxInput
			name="privacy"
			label="I have read and agree to the Privacy Policy"
			required
		/>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<CheckboxInput
  name="disabled-unchecked"
  label="Disabled unchecked"
  disabled
/>
<CheckboxInput
  name="disabled-checked"
  label="Disabled checked"
  checked={true}
  disabled
/>`}
	>
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<CheckboxInput
				name="disabled-unchecked"
				label="Disabled unchecked"
				disabled
			/>
			<CheckboxInput
				name="disabled-checked"
				label="Disabled checked"
				checked={true}
				disabled
			/>
		</div>
	</ComponentExample>

	<h2>With Description</h2>
	<p>Add a <code>description</code> for voice extraction context in SMRT mode.</p>

	<ComponentExample
		code={`<CheckboxInput
  name="marketing"
  label="Enable marketing emails"
  description="Yes or no for receiving marketing communications"
/>`}
	>
		<CheckboxInput
			name="marketing"
			label="Enable marketing emails"
			description="Yes or no for receiving marketing communications"
		/>
	</ComponentExample>

	<h2>Multiple Checkboxes</h2>
	<p>Group related checkboxes together for multi-select options.</p>

	<ComponentExample
		code={`<script lang="ts">
  let features = $state({
    darkMode: true,
    notifications: false,
    autoSave: true
  });
</script>

<CheckboxInput name="darkMode" label="Dark Mode" bind:checked={features.darkMode} />
<CheckboxInput name="notifications" label="Push Notifications" bind:checked={features.notifications} />
<CheckboxInput name="autoSave" label="Auto-save" bind:checked={features.autoSave} />`}
	>
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<CheckboxInput name="darkMode" label="Dark Mode" checked={true} />
			<CheckboxInput name="notifications" label="Push Notifications" />
			<CheckboxInput name="autoSave" label="Auto-save" checked={true} />
		</div>
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>Toggle the checkbox to see the bound value update:</p>

	<ComponentExample
		code={`<script lang="ts">
  let checked = $state(false);
</script>

<CheckboxInput
  name="interactive"
  label="Toggle me"
  bind:checked
/>
<p>Checked: {checked ? 'Yes' : 'No'}</p>`}
	>
		<CheckboxInput
			name="interactive"
			label="Toggle me"
			bind:checked={interactiveChecked}
		/>
		<p style="margin-top: 1rem; color: #666;">Checked: {interactiveChecked ? 'Yes' : 'No'}</p>
	</ComponentExample>

	<h2>Voice Control (SMRT Mode)</h2>
	<p>
		In SMRT mode, checkboxes can be controlled via voice commands. The component understands
		natural language like "yes", "no", "true", "false", "check", "uncheck", etc.
	</p>

	<CodeBlock
		code={`<!-- Voice commands: "yes", "no", "true", "false", "check", "uncheck" -->
<CheckboxInput
  name="voiceControl"
  label="Voice controlled checkbox"
  description="Say yes or no to toggle"
/>`}
		language="svelte"
	/>

	<h2>Props</h2>
	<PropsTable props={checkboxProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { CheckboxInput } from '@happyvertical/smrt-svelte';

// Props interface
interface Props {
  name: string;
  label?: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  required?: boolean;
  onchange?: (checked: boolean) => void;
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
