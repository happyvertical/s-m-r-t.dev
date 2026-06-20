<script lang="ts">
	import { Button } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let clickCount = $state(0);

	const buttonProps = [
		{
			name: 'variant',
			type: "'primary' | 'secondary' | 'ghost' | 'danger'",
			default: "'primary'",
			description: 'Visual style variant'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Button size'
		},
		{
			name: 'href',
			type: 'string',
			description: 'If provided, renders as an anchor element'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the button'
		},
		{
			name: 'type',
			type: "'button' | 'submit' | 'reset'",
			default: "'button'",
			description: 'Button type for form submission'
		},
		{
			name: 'fullWidth',
			type: 'boolean',
			default: 'false',
			description: 'Stretches the button to fill its container width'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Shows a loading state'
		},
		{
			name: 'onclick',
			type: '() => void',
			description: 'Click handler'
		}
	];
</script>

<svelte:head>
	<title>Button | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ui">UI</a>
		<span>/</span>
		<span>Button</span>
	</nav>

	<h1>Button</h1>
	<p class="lead">
		Interactive button component with multiple variants and sizes. Supports rendering as a link when
		href is provided.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Button } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The default button with primary styling.</p>

	<ComponentExample code={`<Button>Click me</Button>`}>
		<Button>Click me</Button>
	</ComponentExample>

	<h2>Variants</h2>
	<p>Choose from primary, secondary, ghost, or danger styles.</p>

	<ComponentExample
		code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`}
	>
		<div class="button-row">
			<Button variant="primary">Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="danger">Danger</Button>
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three size options: small, medium (default), and large.</p>

	<ComponentExample
		code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
	>
		<div class="button-row">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	</ComponentExample>

	<h2>Disabled State</h2>
	<p>Use <code>disabled</code> to prevent user interaction.</p>

	<ComponentExample
		code={`<Button disabled>Disabled</Button>
<Button variant="secondary" disabled>Disabled</Button>`}
	>
		<div class="button-row">
			<Button disabled>Disabled</Button>
			<Button variant="secondary" disabled>Disabled</Button>
		</div>
	</ComponentExample>

	<h2>As Link</h2>
	<p>Provide <code>href</code> to render as an anchor element with button styling.</p>

	<ComponentExample
		code={`<Button href="/components">Go to Components</Button>
<Button href="https://github.com" variant="secondary">GitHub</Button>`}
	>
		<div class="button-row">
			<Button href="/components">Go to Components</Button>
			<Button href="https://github.com" variant="secondary">GitHub</Button>
		</div>
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>Click the button to see the counter update.</p>

	<ComponentExample
		code={`<script lang="ts">
  let clickCount = $state(0);
</script>

<Button onclick={() => clickCount++}>
  Clicked {clickCount} times
</Button>`}
	>
		<Button onclick={() => clickCount++}>
			Clicked {clickCount} times
		</Button>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={buttonProps} />

	<h2>HTML Attributes</h2>
	<p>
		Button extends <code>HTMLButtonAttributes</code>, so you can pass any standard HTML button
		attribute like <code>id</code>, <code>name</code>, <code>form</code>, <code>formaction</code>,
		<code>aria-*</code>, and more.
	</p>

	<ComponentExample
		code={`<Button
  id="submit-btn"
  name="action"
  form="my-form"
  aria-label="Submit the form"
>
  Submit
</Button>`}
	>
		<Button id="submit-btn" name="action" aria-label="Submit the form">Submit</Button>
	</ComponentExample>

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Button } from '@happyvertical/smrt-svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// Button extends HTMLButtonAttributes, supporting all standard button attributes
interface Props extends Omit<HTMLButtonAttributes, 'class' | 'href'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;  // If provided, renders as <a> instead of <button>
  children?: Snippet;
  fullWidth?: boolean;
  loading?: boolean;
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

	.button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
	}
</style>
