<script lang="ts">
	import { Textarea } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let textValue = $state('');

	const textareaProps = [
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
			description: 'Textarea size (affects padding and font size)'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the textarea'
		},
		{
			name: 'value',
			type: 'string',
			default: "''",
			description: 'Textarea value (bindable)'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: 'undefined',
			description: 'Placeholder text'
		},
		{
			name: 'rows',
			type: 'number',
			default: '4',
			description: 'Number of visible text rows'
		},
		{
			name: '...rest',
			type: 'HTMLTextareaAttributes',
			description: 'All standard HTML textarea attributes are supported'
		}
	];
</script>

<svelte:head>
	<title>Textarea | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ui">UI</a>
		<span>/</span>
		<span>Textarea</span>
	</nav>

	<h1>Textarea</h1>
	<p class="lead">
		A styled multi-line text input component with support for variants, sizes, and resizing.
		Ideal for longer text content like comments, descriptions, or messages.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Textarea } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The default textarea with placeholder text.</p>

	<ComponentExample
		code={`<Textarea placeholder="Enter your message..." />`}
	>
		<div class="textarea-container">
			<Textarea placeholder="Enter your message..." />
		</div>
	</ComponentExample>

	<h2>Variants</h2>
	<p>The Textarea component supports two variants: <code>default</code> and <code>error</code>.</p>

	<ComponentExample
		code={`<Textarea variant="default" placeholder="Default textarea" />
<Textarea variant="error" placeholder="Error textarea" />`}
	>
		<div class="textarea-container">
			<Textarea variant="default" placeholder="Default textarea" />
		</div>
		<div class="textarea-container">
			<Textarea variant="error" placeholder="Error textarea" />
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</p>

	<ComponentExample
		code={`<Textarea size="sm" placeholder="Small textarea" rows={3} />
<Textarea size="md" placeholder="Medium textarea" rows={3} />
<Textarea size="lg" placeholder="Large textarea" rows={3} />`}
	>
		<div class="textarea-container">
			<Textarea size="sm" placeholder="Small textarea" rows={3} />
		</div>
		<div class="textarea-container">
			<Textarea size="md" placeholder="Medium textarea" rows={3} />
		</div>
		<div class="textarea-container">
			<Textarea size="lg" placeholder="Large textarea" rows={3} />
		</div>
	</ComponentExample>

	<h2>Custom Rows</h2>
	<p>Control the visible height with the <code>rows</code> prop.</p>

	<ComponentExample
		code={`<Textarea rows={2} placeholder="2 rows" />
<Textarea rows={4} placeholder="4 rows (default)" />
<Textarea rows={8} placeholder="8 rows" />`}
	>
		<div class="textarea-container">
			<Textarea rows={2} placeholder="2 rows" />
		</div>
		<div class="textarea-container">
			<Textarea rows={4} placeholder="4 rows (default)" />
		</div>
		<div class="textarea-container">
			<Textarea rows={8} placeholder="8 rows" />
		</div>
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>Use two-way binding with <code>bind:value</code>:</p>

	<ComponentExample
		code={`<script lang="ts">
  let textValue = $state('');
</script>

<Textarea
  bind:value={textValue}
  placeholder="Write something..."
/>
<p>Character count: {textValue.length}</p>`}
	>
		<div class="stacked">
			<div class="textarea-container">
				<Textarea bind:value={textValue} placeholder="Write something..." />
			</div>
			<p class="value-display">Character count: {textValue.length}</p>
		</div>
	</ComponentExample>

	<h2>Disabled State</h2>

	<ComponentExample
		code={`<Textarea disabled placeholder="Disabled textarea" />
<Textarea disabled value="This textarea is disabled and has content." />`}
	>
		<div class="textarea-container">
			<Textarea disabled placeholder="Disabled textarea" />
		</div>
		<div class="textarea-container">
			<Textarea disabled value="This textarea is disabled and has content." />
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={textareaProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { HTMLTextareaAttributes } from 'svelte/elements';

type TextareaVariant = 'default' | 'error';
type TextareaSize = 'sm' | 'md' | 'lg';

interface Props extends Omit<HTMLTextareaAttributes, 'class'> {
  variant?: TextareaVariant;
  size?: TextareaSize;
  value?: string;
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

	.textarea-container {
		width: 300px;
	}

	.stacked {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		max-width: 400px;
	}

	.value-display {
		font-size: 0.9rem;
		color: #666;
		margin: 0;
	}
</style>
