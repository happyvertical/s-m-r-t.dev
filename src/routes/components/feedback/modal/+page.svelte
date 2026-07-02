<script lang="ts">
	import { Modal, Button } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let showBasic = $state(false);
	let showWithFooter = $state(false);
	let showSizes = $state(false);
	let currentSize: 'sm' | 'md' | 'lg' | 'xl' = $state('md');

	const modalProps = [
		{
			name: 'open',
			type: 'boolean',
			default: 'false',
			description: 'Whether the modal is open (bindable)'
		},
		{
			name: 'title',
			type: 'string',
			description: 'Modal title'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
			default: "'md'",
			description: 'Modal size variant'
		},
		{
			name: 'placement',
			type: "'center' | 'end'",
			default: "'center'",
			description: 'Center (default) or end for a right-anchored full-height drawer'
		},
		{
			name: 'closeOnBackdrop',
			type: 'boolean',
			default: 'true',
			description: 'Whether clicking backdrop closes modal'
		},
		{
			name: 'closeOnEscape',
			type: 'boolean',
			default: 'true',
			description: 'Whether pressing Escape closes modal'
		},
		{
			name: 'showClose',
			type: 'boolean',
			default: 'true',
			description: 'Show close button'
		},
		{
			name: 'header',
			type: 'Snippet',
			description: 'Custom header snippet'
		},
		{
			name: 'footer',
			type: 'Snippet',
			description: 'Custom footer snippet'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Main content'
		},
		{
			name: 'onClose',
			type: '() => void',
			description: 'Callback when modal requests to close'
		}
	];
</script>

<svelte:head>
	<title>Modal | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/feedback">Feedback</a>
		<span>/</span>
		<span>Modal</span>
	</nav>

	<h1>Modal</h1>
	<p class="lead">
		Accessible dialog component using native <code>&lt;dialog&gt;</code> element. Supports multiple sizes,
		custom headers/footers, focus trap, and keyboard navigation.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Modal } from '@happyvertical/smrt-ui';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Simple modal with title and content.</p>

	<ComponentExample
		code={`<Button onclick={() => open = true}>Open Modal</Button>

<Modal bind:open title="Welcome">
  <p>This is the modal content.</p>
</Modal>`}
	>
		<Button onclick={() => (showBasic = true)}>Open Modal</Button>
	</ComponentExample>

	<h2>With Footer Actions</h2>
	<p>Add action buttons in the footer.</p>

	<ComponentExample
		code={`<Modal bind:open title="Edit Profile">
  <p>Update your profile information below.</p>

  {#snippet footer()}
    <Button variant="ghost" onclick={() => open = false}>Cancel</Button>
    <Button onclick={() => open = false}>Save Changes</Button>
  {/snippet}
</Modal>`}
	>
		<Button onclick={() => (showWithFooter = true)}>Edit Profile</Button>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Available in small, medium, large, extra large, and full sizes.</p>

	<ComponentExample
		code={`<Modal bind:open title="Modal" size="sm">...</Modal>
<Modal bind:open title="Modal" size="md">...</Modal>
<Modal bind:open title="Modal" size="lg">...</Modal>
<Modal bind:open title="Modal" size="xl">...</Modal>`}
	>
		<div style="display: flex; gap: 8px; flex-wrap: wrap;">
			<Button
				size="sm"
				onclick={() => {
					currentSize = 'sm';
					showSizes = true;
				}}>Small</Button
			>
			<Button
				size="sm"
				onclick={() => {
					currentSize = 'md';
					showSizes = true;
				}}>Medium</Button
			>
			<Button
				size="sm"
				onclick={() => {
					currentSize = 'lg';
					showSizes = true;
				}}>Large</Button
			>
			<Button
				size="sm"
				onclick={() => {
					currentSize = 'xl';
					showSizes = true;
				}}>Extra Large</Button
			>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={modalProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Modal } from '@happyvertical/smrt-ui';
import type { Snippet } from 'svelte';

interface Props {
  open?: boolean;
  onClose?: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  placement?: 'center' | 'end';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showClose?: boolean;
  header?: Snippet;
  footer?: Snippet;
  children?: Snippet;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<ul class="a11y-list">
		<li>Uses native <code>&lt;dialog&gt;</code> element for accessibility</li>
		<li>Automatic focus trap within the modal</li>
		<li>Escape key closes the modal (configurable)</li>
		<li>Backdrop click closes the modal (configurable)</li>
		<li>Supports <code>aria-label</code> and <code>aria-describedby</code></li>
		<li>Returns focus to trigger element on close</li>
	</ul>
</article>

<Modal bind:open={showBasic} title="Welcome">
	<p style="color: #666; line-height: 1.6;">
		This is a basic modal with a title and some content. Click the X button, press Escape, or click
		outside to close.
	</p>
</Modal>

<Modal bind:open={showWithFooter} title="Edit Profile">
	<p style="color: #666; line-height: 1.6; margin-bottom: 16px;">
		Update your profile information below. Changes will be saved when you click "Save Changes".
	</p>
	<div style="display: flex; flex-direction: column; gap: 12px;">
		<input
			type="text"
			placeholder="Name"
			style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;"
		/>
		<input
			type="email"
			placeholder="Email"
			style="padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px;"
		/>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (showWithFooter = false)}>Cancel</Button>
		<Button onclick={() => (showWithFooter = false)}>Save Changes</Button>
	{/snippet}
</Modal>

<Modal bind:open={showSizes} title="Modal - {currentSize.toUpperCase()}" size={currentSize}>
	<p style="color: #666; line-height: 1.6;">
		This modal is using the <strong>{currentSize}</strong> size variant. The modal will adjust its width
		based on the size prop.
	</p>
	<div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 4px;">
		<code>size="{currentSize}"</code>
	</div>
</Modal>

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

	.a11y-list {
		margin-top: 16px;
		padding-left: 24px;
	}

	.a11y-list li {
		color: #666;
		margin-bottom: 8px;
		line-height: 1.6;
	}
</style>
