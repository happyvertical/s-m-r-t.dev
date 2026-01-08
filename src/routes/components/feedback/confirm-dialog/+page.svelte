<script lang="ts">
	import { ConfirmDialog } from '@happyvertical/smrt-svelte';
	import { Button } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let basicOpen = $state(false);
	let destructiveOpen = $state(false);
	let loadingOpen = $state(false);
	let customOpen = $state(false);
	let isLoading = $state(false);

	const confirmDialogProps = [
		{
			name: 'open',
			type: 'boolean',
			description: 'Whether the dialog is visible',
			required: true
		},
		{
			name: 'title',
			type: 'string',
			description: 'Dialog title displayed at the top',
			required: true
		},
		{
			name: 'message',
			type: 'string',
			description: 'Descriptive message explaining the action',
			required: true
		},
		{
			name: 'confirmLabel',
			type: 'string',
			default: "'Confirm'",
			description: 'Text for the confirm button'
		},
		{
			name: 'cancelLabel',
			type: 'string',
			default: "'Cancel'",
			description: 'Text for the cancel button'
		},
		{
			name: 'destructive',
			type: 'boolean',
			default: 'false',
			description: 'Use red/error styling for confirm button'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading spinner on confirm button'
		},
		{
			name: 'onconfirm',
			type: '() => void',
			description: 'Callback when confirm button is clicked'
		},
		{
			name: 'oncancel',
			type: '() => void',
			description: 'Callback when cancel is clicked or dialog dismissed'
		}
	];

	function handleLoadingConfirm() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
			loadingOpen = false;
		}, 2000);
	}
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
		A modal confirmation dialog for destructive actions or important decisions. Provides consistent
		UX for confirmations with support for loading states and destructive styling.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { ConfirmDialog } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>
		The dialog requires <code>open</code>, <code>title</code>, and <code>message</code> props. Use
		<code>onconfirm</code> and <code>oncancel</code> callbacks to handle user actions.
	</p>

	<ComponentExample
		code={`<script>
  let open = $state(false);
</script>

<Button onclick={() => open = true}>Open Dialog</Button>

<ConfirmDialog
  {open}
  title="Confirm Action"
  message="Are you sure you want to proceed with this action?"
  onconfirm={() => { open = false; /* do action */ }}
  oncancel={() => open = false}
/>`}
	>
		<Button onclick={() => (basicOpen = true)}>Open Dialog</Button>
	</ComponentExample>

	<ConfirmDialog
		open={basicOpen}
		title="Confirm Action"
		message="Are you sure you want to proceed with this action?"
		onconfirm={() => (basicOpen = false)}
		oncancel={() => (basicOpen = false)}
	/>

	<h2>Destructive Actions</h2>
	<p>Use the <code>destructive</code> prop for delete or irreversible actions to show red styling.</p>

	<ComponentExample
		code={`<ConfirmDialog
  {open}
  title="Delete Item"
  message="This action cannot be undone. Are you sure you want to delete this item permanently?"
  confirmLabel="Delete"
  destructive
  onconfirm={() => { /* delete */ }}
  oncancel={() => open = false}
/>`}
	>
		<Button variant="secondary" onclick={() => (destructiveOpen = true)}>Delete Item</Button>
	</ComponentExample>

	<ConfirmDialog
		open={destructiveOpen}
		title="Delete Item"
		message="This action cannot be undone. Are you sure you want to delete this item permanently?"
		confirmLabel="Delete"
		destructive
		onconfirm={() => (destructiveOpen = false)}
		oncancel={() => (destructiveOpen = false)}
	/>

	<h2>Loading State</h2>
	<p>Show a loading spinner on the confirm button while the action is processing.</p>

	<ComponentExample
		code={`<script>
  let isLoading = $state(false);

  function handleConfirm() {
    isLoading = true;
    // Simulate async operation
    setTimeout(() => {
      isLoading = false;
      open = false;
    }, 2000);
  }
</script>

<ConfirmDialog
  {open}
  title="Submit Form"
  message="Your data will be submitted to the server."
  confirmLabel="Submit"
  loading={isLoading}
  onconfirm={handleConfirm}
  oncancel={() => open = false}
/>`}
	>
		<Button onclick={() => (loadingOpen = true)}>Submit with Loading</Button>
	</ComponentExample>

	<ConfirmDialog
		open={loadingOpen}
		title="Submit Form"
		message="Your data will be submitted to the server."
		confirmLabel="Submit"
		loading={isLoading}
		onconfirm={handleLoadingConfirm}
		oncancel={() => (loadingOpen = false)}
	/>

	<h2>Custom Labels</h2>
	<p>Customize the button labels to match the specific action.</p>

	<ComponentExample
		code={`<ConfirmDialog
  {open}
  title="Publish Article"
  message="This will make your article visible to all users."
  confirmLabel="Publish Now"
  cancelLabel="Keep as Draft"
  onconfirm={() => { /* publish */ }}
  oncancel={() => open = false}
/>`}
	>
		<Button variant="primary" onclick={() => (customOpen = true)}>Publish Article</Button>
	</ComponentExample>

	<ConfirmDialog
		open={customOpen}
		title="Publish Article"
		message="This will make your article visible to all users."
		confirmLabel="Publish Now"
		cancelLabel="Keep as Draft"
		onconfirm={() => (customOpen = false)}
		oncancel={() => (customOpen = false)}
	/>

	<h2>Accessibility</h2>
	<p>The dialog follows accessibility best practices:</p>
	<ul class="feature-list">
		<li>Uses <code>role="dialog"</code> and <code>aria-modal="true"</code></li>
		<li>Title is linked via <code>aria-labelledby</code></li>
		<li>Pressing <code>Escape</code> closes the dialog</li>
		<li>Clicking the backdrop closes the dialog</li>
		<li>Focus is trapped within the dialog when open</li>
	</ul>

	<h2>Props</h2>
	<PropsTable props={confirmDialogProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { ConfirmDialog } from '@happyvertical/smrt-svelte';

// Props interface
interface ConfirmDialogProps {
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

	.feature-list {
		color: #666;
		line-height: 1.8;
		margin-bottom: 16px;
		padding-left: 24px;
	}

	.feature-list li {
		margin-bottom: 8px;
	}
</style>
