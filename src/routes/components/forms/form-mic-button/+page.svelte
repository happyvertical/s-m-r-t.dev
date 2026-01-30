<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'size',
			type: 'number',
			default: '16',
			description: 'Size of the microphone icon in pixels'
		},
		{
			name: 'class',
			type: 'string',
			default: "''",
			description: 'Additional CSS class to apply'
		}
	];
</script>

<svelte:head>
	<title>FormMicButton | s-m-r-t Forms</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/forms">Forms</a>
		<span>/</span>
		<span>FormMicButton</span>
	</nav>

	<h1>FormMicButton</h1>
	<p class="lead">
		A microphone icon button that appears in SMRT mode to trigger form-level voice filling.
		Only visible when inside a Form component and when SMRT mode is active.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { FormMicButton } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Add a mic button next to a form title or label.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { Form, FormMicButton, TextInput } from '@happyvertical/smrt-svelte';
</script>

<Form>
  <h2>Contact Form <FormMicButton /></h2>
  <TextInput name="name" label="Name" />
  <TextInput name="email" label="Email" type="email" />
</Form>`}
		language="svelte"
	/>

	<h2>With Custom Size</h2>
	<p>Adjust the icon size to match your design.</p>

	<CodeBlock
		code={`<h2>
  Contact Form
  <FormMicButton size={20} />
</h2>`}
		language="svelte"
	/>

	<h2>Visual States</h2>
	<ul>
		<li><strong>Default</strong> - Gray microphone icon, hover reveals darker color</li>
		<li><strong>Listening</strong> - Green, pulsing animation, shows tooltip</li>
		<li><strong>Extracting</strong> - Green spinner while processing speech</li>
		<li><strong>Hidden</strong> - Not rendered when not in SMRT mode or outside Form</li>
	</ul>

	<h2>Interaction</h2>
	<ul>
		<li>Click to start listening (same as clicking "Speak all fields")</li>
		<li>Click again to stop listening</li>
		<li>Press Enter when focused for keyboard accessibility</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { FormMicButton } from '@happyvertical/smrt-svelte';

interface FormMicButtonProps {
  size?: number;
  class?: string;
}`}
		language="typescript"
	/>

	<h2>Context Requirement</h2>
	<p>
		FormMicButton requires being inside a <code>Form</code> component. It uses
		the form context to toggle listening state. If used outside a Form, it renders nothing.
	</p>

	<CodeBlock
		code={`// Works - inside Form
<Form>
  <h2>Title <FormMicButton /></h2>
</Form>

// Renders nothing - outside Form
<div>
  <FormMicButton /> <!-- invisible -->
</div>`}
		language="svelte"
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
