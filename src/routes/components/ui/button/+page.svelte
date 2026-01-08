<script lang="ts">
	import { Button } from '@happyvertical/svelte';
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
			default: 'undefined',
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
			description: 'Button type attribute'
		},
		{
			name: 'onclick',
			type: 'function',
			default: 'undefined',
			description: 'Click handler'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Button content',
			required: true
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
		A versatile button component that supports multiple variants, sizes, and can render as either a
		button or a link.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Button } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Variants</h2>
	<p>The Button component supports four variants: <code>primary</code>, <code>secondary</code>, <code>ghost</code>, and <code>danger</code>.</p>

	<ComponentExample
		code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`}
	>
		<Button variant="primary">Primary</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="danger">Danger</Button>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</p>

	<ComponentExample
		code={`<Button variant="primary" size="sm">Small</Button>
<Button variant="primary" size="md">Medium</Button>
<Button variant="primary" size="lg">Large</Button>`}
	>
		<Button variant="primary" size="sm">Small</Button>
		<Button variant="primary" size="md">Medium</Button>
		<Button variant="primary" size="lg">Large</Button>
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>Click the button to see it in action:</p>

	<ComponentExample
		code={`<script lang="ts">
  let clickCount = $state(0);
</script>

<Button variant="primary" onclick={() => clickCount++}>
  Clicked {clickCount} times
</Button>
<Button variant="secondary" onclick={() => clickCount = 0}>
  Reset
</Button>`}
	>
		<Button variant="primary" onclick={() => clickCount++}>
			Clicked {clickCount} times
		</Button>
		<Button variant="secondary" onclick={() => (clickCount = 0)}>Reset</Button>
	</ComponentExample>

	<h2>As Link</h2>
	<p>Use the <code>href</code> prop to render as an anchor element:</p>

	<ComponentExample
		code={`<Button variant="primary" href="/">Go Home</Button>
<Button variant="secondary" href="https://github.com/happyvertical/svelte">
  GitHub
</Button>`}
	>
		<Button variant="primary" href="/">Go Home</Button>
		<Button variant="secondary" href="https://github.com/happyvertical/svelte">GitHub</Button>
	</ComponentExample>

	<h2>Disabled State</h2>

	<ComponentExample
		code={`<Button variant="primary" disabled>Disabled Primary</Button>
<Button variant="secondary" disabled>Disabled Secondary</Button>`}
	>
		<Button variant="primary" disabled>Disabled Primary</Button>
		<Button variant="secondary" disabled>Disabled Secondary</Button>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={buttonProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { ButtonVariant, ButtonSize } from '@happyvertical/svelte';

// ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
// ButtonSize = 'sm' | 'md' | 'lg'`}
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
