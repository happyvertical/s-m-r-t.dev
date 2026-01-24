<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'label',
			type: 'string',
			required: true,
			description: 'Label text for the form field'
		},
		{
			name: 'id',
			type: 'string',
			default: 'undefined',
			description: 'ID to associate label with input (for accessibility)'
		},
		{
			name: 'error',
			type: 'string',
			default: 'undefined',
			description: 'Error message to display'
		},
		{
			name: 'hint',
			type: 'string',
			default: 'undefined',
			description: 'Hint text shown below input (hidden when error is shown)'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Show required indicator (*) next to label'
		},
		{
			name: 'children',
			type: 'Snippet',
			required: true,
			description: 'Form input element(s)'
		}
	];
</script>

<svelte:head>
	<title>FormGroup | s-m-r-t Forms</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>FormGroup</span>
	</nav>

	<h1>FormGroup</h1>
	<p class="lead">
		A layout wrapper for form fields that provides consistent label, hint text,
		and error message styling. Use when building custom inputs or when you need
		more control than the built-in labeled inputs.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { FormGroup } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Wrap any input element with a label and optional hint.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { FormGroup } from '@happyvertical/smrt-svelte';
</script>

<FormGroup label="Username" id="username" hint="Choose a unique username">
  <input type="text" id="username" name="username" />
</FormGroup>`}
		language="svelte"
	/>

	<h2>Required Fields</h2>
	<p>Show a required indicator next to the label.</p>

	<CodeBlock
		code={`<FormGroup label="Email" id="email" required>
  <input type="email" id="email" name="email" required />
</FormGroup>`}
		language="svelte"
	/>

	<h2>With Error</h2>
	<p>Display an error message (hides hint when shown).</p>

	<CodeBlock
		code={`<script lang="ts">
  let error = $state<string | undefined>(undefined);

  function validate(value: string) {
    if (!value.includes('@')) {
      error = 'Please enter a valid email address';
    } else {
      error = undefined;
    }
  }
</script>

<FormGroup
  label="Email"
  id="email"
  hint="We'll never share your email"
  {error}
>
  <input
    type="email"
    id="email"
    oninput={(e) => validate(e.currentTarget.value)}
  />
</FormGroup>`}
		language="svelte"
	/>

	<h2>With Custom Input</h2>
	<p>Works with any input type or custom component.</p>

	<CodeBlock
		code={`<FormGroup label="Quantity" id="qty">
  <input type="range" id="qty" min="1" max="10" />
</FormGroup>

<FormGroup label="Color" id="color">
  <input type="color" id="color" />
</FormGroup>

<FormGroup label="Notes" id="notes">
  <textarea id="notes" rows="4"></textarea>
</FormGroup>`}
		language="svelte"
	/>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { FormGroup } from '@happyvertical/smrt-svelte';
import type { Snippet } from 'svelte';

interface FormGroupProps {
  label: string;
  id?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: Snippet;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<ul>
		<li><code>for</code> attribute links label to input</li>
		<li>Required indicator uses visible text (*)</li>
		<li>Error messages have distinct styling for visibility</li>
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
