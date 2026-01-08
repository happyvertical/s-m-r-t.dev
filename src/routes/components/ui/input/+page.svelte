<script lang="ts">
	import { Input } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let textValue = $state('');
	let numberValue = $state(0);

	const inputProps = [
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
			description: 'Input size'
		},
		{
			name: 'type',
			type: 'string',
			default: "'text'",
			description: 'HTML input type (text, email, password, number, etc.)'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the input'
		},
		{
			name: 'value',
			type: 'string | number',
			default: "''",
			description: 'Input value (bindable)'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: 'undefined',
			description: 'Placeholder text'
		},
		{
			name: '...rest',
			type: 'HTMLInputAttributes',
			description: 'All standard HTML input attributes are supported'
		}
	];
</script>

<svelte:head>
	<title>Input | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ui">UI</a>
		<span>/</span>
		<span>Input</span>
	</nav>

	<h1>Input</h1>
	<p class="lead">
		A styled text input component with support for multiple variants, sizes, and input types.
		Automatically handles focus states and validation styling.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Input } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The default input with placeholder text.</p>

	<ComponentExample
		code={`<Input placeholder="Enter your name" />`}
	>
		<div class="input-container">
			<Input placeholder="Enter your name" />
		</div>
	</ComponentExample>

	<h2>Variants</h2>
	<p>The Input component supports two variants: <code>default</code> and <code>error</code>.</p>

	<ComponentExample
		code={`<Input variant="default" placeholder="Default input" />
<Input variant="error" placeholder="Error input" />`}
	>
		<div class="input-container">
			<Input variant="default" placeholder="Default input" />
		</div>
		<div class="input-container">
			<Input variant="error" placeholder="Error input" />
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</p>

	<ComponentExample
		code={`<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`}
	>
		<div class="input-container">
			<Input size="sm" placeholder="Small" />
		</div>
		<div class="input-container">
			<Input size="md" placeholder="Medium" />
		</div>
		<div class="input-container">
			<Input size="lg" placeholder="Large" />
		</div>
	</ComponentExample>

	<h2>Input Types</h2>
	<p>Support for various HTML input types.</p>

	<ComponentExample
		code={`<Input type="text" placeholder="Text input" />
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="0" />
<Input type="date" />
<Input type="color" />`}
	>
		<div class="input-container">
			<Input type="text" placeholder="Text input" />
		</div>
		<div class="input-container">
			<Input type="email" placeholder="email@example.com" />
		</div>
		<div class="input-container">
			<Input type="password" placeholder="Password" />
		</div>
		<div class="input-container">
			<Input type="number" placeholder="0" />
		</div>
		<div class="input-container">
			<Input type="date" />
		</div>
		<Input type="color" />
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>Use two-way binding with <code>bind:value</code>:</p>

	<ComponentExample
		code={`<script lang="ts">
  let textValue = $state('');
  let numberValue = $state(0);
</script>

<Input bind:value={textValue} placeholder="Type here..." />
<p>Value: {textValue}</p>

<Input type="number" bind:value={numberValue} />
<p>Number: {numberValue}</p>`}
	>
		<div class="stacked">
			<div class="input-container">
				<Input bind:value={textValue} placeholder="Type here..." />
			</div>
			<p class="value-display">Value: {textValue || '(empty)'}</p>
			<div class="input-container">
				<Input type="number" bind:value={numberValue} />
			</div>
			<p class="value-display">Number: {numberValue}</p>
		</div>
	</ComponentExample>

	<h2>Disabled State</h2>

	<ComponentExample
		code={`<Input disabled placeholder="Disabled input" />
<Input disabled value="Disabled with value" />`}
	>
		<div class="input-container">
			<Input disabled placeholder="Disabled input" />
		</div>
		<div class="input-container">
			<Input disabled value="Disabled with value" />
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={inputProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { HTMLInputAttributes } from 'svelte/elements';

type InputVariant = 'default' | 'error';
type InputSize = 'sm' | 'md' | 'lg';

interface Props extends Omit<HTMLInputAttributes, 'class' | 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  value?: string | number;
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

	.input-container {
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
