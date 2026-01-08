<script lang="ts">
	import { FormGroup, Input, Select, Textarea } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let email = $state('');
	let emailError = $state('');

	function validateEmail() {
		if (!email) {
			emailError = 'Email is required';
		} else if (!email.includes('@')) {
			emailError = 'Please enter a valid email address';
		} else {
			emailError = '';
		}
	}

	const formGroupProps = [
		{
			name: 'label',
			type: 'string',
			default: 'undefined',
			description: 'Label text displayed above the input'
		},
		{
			name: 'id',
			type: 'string',
			default: 'undefined',
			description: 'Associates the label with the input via for/id attributes'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Shows a required indicator (*) after the label'
		},
		{
			name: 'hint',
			type: 'string',
			default: 'undefined',
			description: 'Helper text displayed below the input'
		},
		{
			name: 'error',
			type: 'string',
			default: 'undefined',
			description: 'Error message (replaces hint when present, styles input as error)'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'The form control (Input, Select, Textarea, etc.)',
			required: true
		}
	];
</script>

<svelte:head>
	<title>FormGroup | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ui">UI</a>
		<span>/</span>
		<span>FormGroup</span>
	</nav>

	<h1>FormGroup</h1>
	<p class="lead">
		A wrapper component for form controls that provides labels, hints, and error messages.
		Automatically applies error styling to child inputs when an error is present.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { FormGroup, Input, Select, Textarea } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Wrap any form control with FormGroup to add a label.</p>

	<ComponentExample
		code={`<FormGroup label="Username" id="username">
  <Input id="username" placeholder="Enter username" />
</FormGroup>`}
	>
		<div class="form-container">
			<FormGroup label="Username" id="username">
				<Input id="username" placeholder="Enter username" />
			</FormGroup>
		</div>
	</ComponentExample>

	<h2>With Hint Text</h2>
	<p>Add helper text to guide users.</p>

	<ComponentExample
		code={`<FormGroup
  label="Password"
  id="password"
  hint="Must be at least 8 characters"
>
  <Input id="password" type="password" placeholder="Enter password" />
</FormGroup>`}
	>
		<div class="form-container">
			<FormGroup label="Password" id="password" hint="Must be at least 8 characters">
				<Input id="password" type="password" placeholder="Enter password" />
			</FormGroup>
		</div>
	</ComponentExample>

	<h2>Required Fields</h2>
	<p>Mark fields as required with a visual indicator.</p>

	<ComponentExample
		code={`<FormGroup label="Email" id="email" required>
  <Input id="email" type="email" placeholder="you@example.com" />
</FormGroup>

<FormGroup label="Company" id="company" hint="Optional">
  <Input id="company" placeholder="Company name" />
</FormGroup>`}
	>
		<div class="form-container">
			<FormGroup label="Email" id="email" required>
				<Input id="email" type="email" placeholder="you@example.com" />
			</FormGroup>
			<FormGroup label="Company" id="company" hint="Optional">
				<Input id="company" placeholder="Company name" />
			</FormGroup>
		</div>
	</ComponentExample>

	<h2>Error State</h2>
	<p>Show validation errors with automatic input styling.</p>

	<ComponentExample
		code={`<FormGroup
  label="Email"
  id="email-error"
  required
  error="Please enter a valid email address"
>
  <Input id="email-error" type="email" value="invalid-email" />
</FormGroup>`}
	>
		<div class="form-container">
			<FormGroup label="Email" id="email-error" required error="Please enter a valid email address">
				<Input id="email-error" type="email" value="invalid-email" />
			</FormGroup>
		</div>
	</ComponentExample>

	<h2>Interactive Validation</h2>
	<p>Combine with state for dynamic validation.</p>

	<ComponentExample
		code={`<script lang="ts">
  let email = $state('');
  let emailError = $state('');

  function validateEmail() {
    if (!email) {
      emailError = 'Email is required';
    } else if (!email.includes('@')) {
      emailError = 'Please enter a valid email address';
    } else {
      emailError = '';
    }
  }
</script>

<FormGroup
  label="Email"
  id="email-validate"
  required
  error={emailError}
  hint={!emailError ? "We'll never share your email" : undefined}
>
  <Input
    id="email-validate"
    type="email"
    bind:value={email}
    onblur={validateEmail}
    placeholder="you@example.com"
  />
</FormGroup>`}
	>
		<div class="form-container">
			<FormGroup
				label="Email"
				id="email-validate"
				required
				error={emailError}
				hint={!emailError ? "We'll never share your email" : undefined}
			>
				<Input
					id="email-validate"
					type="email"
					bind:value={email}
					onblur={validateEmail}
					placeholder="you@example.com"
				/>
			</FormGroup>
		</div>
	</ComponentExample>

	<h2>With Select</h2>
	<p>Works with any form control.</p>

	<ComponentExample
		code={`<FormGroup label="Country" id="country" required>
  <Select id="country">
    <option value="">Select a country...</option>
    <option value="us">United States</option>
    <option value="ca">Canada</option>
    <option value="uk">United Kingdom</option>
  </Select>
</FormGroup>`}
	>
		<div class="form-container">
			<FormGroup label="Country" id="country" required>
				<Select id="country">
					<option value="">Select a country...</option>
					<option value="us">United States</option>
					<option value="ca">Canada</option>
					<option value="uk">United Kingdom</option>
				</Select>
			</FormGroup>
		</div>
	</ComponentExample>

	<h2>With Textarea</h2>

	<ComponentExample
		code={`<FormGroup
  label="Bio"
  id="bio"
  hint="Tell us about yourself (max 500 characters)"
>
  <Textarea id="bio" placeholder="Write a short bio..." rows={4} />
</FormGroup>`}
	>
		<div class="form-container">
			<FormGroup label="Bio" id="bio" hint="Tell us about yourself (max 500 characters)">
				<Textarea id="bio" placeholder="Write a short bio..." rows={4} />
			</FormGroup>
		</div>
	</ComponentExample>

	<h2>Complete Form Example</h2>
	<p>A typical form layout with multiple FormGroup components.</p>

	<ComponentExample
		code={`<form class="form-layout">
  <FormGroup label="Full name" id="name" required>
    <Input id="name" placeholder="John Doe" />
  </FormGroup>

  <FormGroup label="Email" id="form-email" required hint="We'll never share your email">
    <Input id="form-email" type="email" placeholder="john@example.com" />
  </FormGroup>

  <FormGroup label="Role" id="role">
    <Select id="role">
      <option value="">Select a role...</option>
      <option value="developer">Developer</option>
      <option value="designer">Designer</option>
      <option value="manager">Manager</option>
    </Select>
  </FormGroup>

  <FormGroup label="Message" id="message" hint="Optional">
    <Textarea id="message" placeholder="Any additional notes..." rows={3} />
  </FormGroup>
</form>`}
	>
		<form class="form-layout">
			<FormGroup label="Full name" id="name" required>
				<Input id="name" placeholder="John Doe" />
			</FormGroup>

			<FormGroup label="Email" id="form-email" required hint="We'll never share your email">
				<Input id="form-email" type="email" placeholder="john@example.com" />
			</FormGroup>

			<FormGroup label="Role" id="role">
				<Select id="role">
					<option value="">Select a role...</option>
					<option value="developer">Developer</option>
					<option value="designer">Designer</option>
					<option value="manager">Manager</option>
				</Select>
			</FormGroup>

			<FormGroup label="Message" id="message" hint="Optional">
				<Textarea id="message" placeholder="Any additional notes..." rows={3} />
			</FormGroup>
		</form>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={formGroupProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Snippet } from 'svelte';

interface Props {
  label?: string;
  id?: string;
  required?: boolean;
  hint?: string;
  error?: string;
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

	.form-container {
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.form-layout {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
