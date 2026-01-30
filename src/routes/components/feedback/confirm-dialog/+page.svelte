<script lang="ts">
	import { ConfirmDialog, Button } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let showBasic = $state(false);
	let showDestructive = $state(false);
	let showCustom = $state(false);
	let showLoading = $state(false);
	let isLoading = $state(false);

	function handleConfirmLoading() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
			showLoading = false;
		}, 2000);
	}

	const confirmDialogProps = [
		{
			name: 'open',
			type: 'boolean',
			description: 'Whether the dialog is open',
			required: true
		},
		{
			name: 'title',
			type: 'string',
			description: 'Dialog title',
			required: true
		},
		{
			name: 'message',
			type: 'string',
			description: 'Dialog message',
			required: true
		},
		{
			name: 'confirmLabel',
			type: 'string',
			default: "'Confirm'",
			description: 'Confirm button label'
		},
		{
			name: 'cancelLabel',
			type: 'string',
			default: "'Cancel'",
			description: 'Cancel button label'
		},
		{
			name: 'destructive',
			type: 'boolean',
			default: 'false',
			description: 'Use destructive (red) styling for confirm'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading state on confirm'
		},
		{
			name: 'onconfirm',
			type: '() => void',
			description: 'Called when confirm is clicked'
		},
		{
			name: 'oncancel',
			type: '() => void',
			description: 'Called when cancel is clicked or dialog closed'
		}
	];
</script>

<svelte:head>
	<title>ConfirmDialog | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/feedback">Feedback</a>
		<span>/</span>
		<span>ConfirmDialog</span>
	</nav>

	<h1>ConfirmDialog</h1>
	<p class="lead">
		Modal confirmation dialog for important decisions and destructive actions. Features backdrop
		click to close, escape key support, and loading states.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { ConfirmDialog } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Simple confirmation dialog with title and message.</p>

	<ComponentExample
		code={`<Button onclick={() => showDialog = true}>Open Dialog</Button>

<ConfirmDialog
  open={showDialog}
  title="Confirm Action"
  message="Are you sure you want to proceed?"
  onconfirm={() => { showDialog = false; }}
  oncancel={() => showDialog = false}
/>`}
	>
		<Button onclick={() => (showBasic = true)}>Open Basic Dialog</Button>
	</ComponentExample>

	<h2>Destructive Action</h2>
	<p>Red styling for dangerous or irreversible actions.</p>

	<ComponentExample
		code={`<ConfirmDialog
  open={showDialog}
  title="Delete Item"
  message="This action cannot be undone. Are you sure?"
  confirmLabel="Delete"
  destructive
  onconfirm={handleDelete}
  oncancel={() => showDialog = false}
/>`}
	>
		<Button variant="secondary" onclick={() => (showDestructive = true)}>Delete Item</Button>
	</ComponentExample>

	<h2>Custom Labels</h2>
	<p>Customize button labels for context.</p>

	<ComponentExample
		code={`<ConfirmDialog
  open={showDialog}
  title="Publish Article"
  message="This will make your article visible to all users."
  confirmLabel="Publish Now"
  cancelLabel="Keep as Draft"
  onconfirm={handlePublish}
  oncancel={() => showDialog = false}
/>`}
	>
		<Button onclick={() => (showCustom = true)}>Publish Article</Button>
	</ComponentExample>

	<h2>Loading State</h2>
	<p>Show loading indicator while processing.</p>

	<ComponentExample
		code={`<ConfirmDialog
  open={showDialog}
  title="Sending..."
  message="Please wait while we process your request."
  loading={isLoading}
  onconfirm={handleConfirm}
  oncancel={() => showDialog = false}
/>`}
	>
		<Button onclick={() => (showLoading = true)}>Submit (with loading)</Button>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={confirmDialogProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { ConfirmDialog } from '@happyvertical/smrt-svelte';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onconfirm?: () => void;
  oncancel?: () => void;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<ul class="a11y-list">
		<li>Uses <code>role="dialog"</code> and <code>aria-modal="true"</code></li>
		<li>Title connected via <code>aria-labelledby</code></li>
		<li>Escape key closes the dialog</li>
		<li>Clicking backdrop closes the dialog</li>
		<li>Buttons disabled during loading state</li>
	</ul>
</article>

<ConfirmDialog
	open={showBasic}
	title="Confirm Action"
	message="Are you sure you want to proceed with this action?"
	onconfirm={() => (showBasic = false)}
	oncancel={() => (showBasic = false)}
/>

<ConfirmDialog
	open={showDestructive}
	title="Delete Item"
	message="This action cannot be undone. The item will be permanently removed."
	confirmLabel="Delete"
	destructive
	onconfirm={() => (showDestructive = false)}
	oncancel={() => (showDestructive = false)}
/>

<ConfirmDialog
	open={showCustom}
	title="Publish Article"
	message="This will make your article visible to all users."
	confirmLabel="Publish Now"
	cancelLabel="Keep as Draft"
	onconfirm={() => (showCustom = false)}
	oncancel={() => (showCustom = false)}
/>

<ConfirmDialog
	open={showLoading}
	title="Processing Request"
	message="Please wait while we process your request."
	loading={isLoading}
	onconfirm={handleConfirmLoading}
	oncancel={() => (showLoading = false)}
/>

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
