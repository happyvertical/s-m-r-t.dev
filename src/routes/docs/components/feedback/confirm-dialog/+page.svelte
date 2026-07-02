<script lang="ts">
	import { ConfirmDialog } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let basicDialogOpen = $state(false);
	let destructiveDialogOpen = $state(false);
	let loadingDialogOpen = $state(false);
	let isLoading = $state(false);
	let customDialogOpen = $state(false);

	async function handleLoadingConfirm() {
		isLoading = true;
		await new Promise((resolve) => setTimeout(resolve, 2000));
		isLoading = false;
		loadingDialogOpen = false;
	}

	const props = [
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
			description: 'Dialog message/body content',
			required: true
		},
		{
			name: 'confirmLabel',
			type: 'string',
			default: "'Confirm'",
			description: 'Label for the confirm button'
		},
		{
			name: 'cancelLabel',
			type: 'string',
			default: "'Cancel'",
			description: 'Label for the cancel button'
		},
		{
			name: 'destructive',
			type: 'boolean',
			default: 'false',
			description: 'Use destructive (red) styling for the confirm button'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading spinner on confirm button and disable actions'
		},
		{
			name: 'onconfirm',
			type: '() => void',
			description: 'Callback when confirm button is clicked'
		},
		{
			name: 'oncancel',
			type: '() => void',
			description: 'Callback when cancel button is clicked or dialog is dismissed'
		}
	];

	const installCode = `npm install @happyvertical/smrt-svelte`;

	const basicCode = `<script lang="ts">
  import { ConfirmDialog } from '@happyvertical/smrt-svelte';

  let dialogOpen = $state(false);
<\/script>

<button onclick={() => (dialogOpen = true)}>
  Open Dialog
</button>

<ConfirmDialog
  open={dialogOpen}
  title="Confirm Action"
  message="Are you sure you want to proceed with this action?"
  onconfirm={() => {
    console.log('Confirmed!');
    dialogOpen = false;
  }}
  oncancel={() => (dialogOpen = false)}
/>`;

	const destructiveCode = `<ConfirmDialog
  open={dialogOpen}
  title="Delete Item"
  message="This action cannot be undone. Are you sure you want to delete this item?"
  confirmLabel="Delete"
  destructive
  onconfirm={() => handleDelete()}
  oncancel={() => (dialogOpen = false)}
/>`;

	const loadingCode = `<script lang="ts">
  let dialogOpen = $state(false);
  let isLoading = $state(false);

  async function handleConfirm() {
    isLoading = true;
    await saveData(); // Your async operation
    isLoading = false;
    dialogOpen = false;
  }
<\/script>

<ConfirmDialog
  open={dialogOpen}
  title="Save Changes"
  message="Do you want to save your changes?"
  confirmLabel="Save"
  loading={isLoading}
  onconfirm={handleConfirm}
  oncancel={() => (dialogOpen = false)}
/>`;

	const customLabelsCode = `<ConfirmDialog
  open={dialogOpen}
  title="Publish Article"
  message="Your article will be visible to all users once published."
  confirmLabel="Publish Now"
  cancelLabel="Keep as Draft"
  onconfirm={() => publish()}
  oncancel={() => (dialogOpen = false)}
/>`;
</script>

<svelte:head>
	<title>ConfirmDialog | Components | s-m-r-t</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<a href="/docs/components">Components</a>
		<span>/</span>
		<span>Feedback</span>
		<span>/</span>
		<span>ConfirmDialog</span>
	</nav>

	<h1>ConfirmDialog</h1>
	<p class="lead">
		Modal confirmation dialog for destructive actions or important decisions. Provides a consistent
		UX pattern with backdrop blur, keyboard support (Escape to close), and optional loading states.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={installCode} language="bash" />

	<h2>Basic Usage</h2>
	<ComponentExample title="Default Confirm Dialog" code={basicCode}>
		<button class="demo-button" onclick={() => (basicDialogOpen = true)}> Open Dialog </button>
		<ConfirmDialog
			open={basicDialogOpen}
			title="Confirm Action"
			message="Are you sure you want to proceed with this action?"
			onconfirm={() => {
				console.log('Confirmed!');
				basicDialogOpen = false;
			}}
			oncancel={() => (basicDialogOpen = false)}
		/>
	</ComponentExample>

	<h2>Destructive Actions</h2>
	<p>
		Use the <code>destructive</code> prop for actions like delete, remove, or any irreversible operation.
		This displays the confirm button in red to indicate danger.
	</p>
	<ComponentExample title="Destructive Dialog" code={destructiveCode}>
		<button class="demo-button demo-button-danger" onclick={() => (destructiveDialogOpen = true)}>
			Delete Item
		</button>
		<ConfirmDialog
			open={destructiveDialogOpen}
			title="Delete Item"
			message="This action cannot be undone. Are you sure you want to delete this item?"
			confirmLabel="Delete"
			destructive
			onconfirm={() => {
				console.log('Deleted!');
				destructiveDialogOpen = false;
			}}
			oncancel={() => (destructiveDialogOpen = false)}
		/>
	</ComponentExample>

	<h2>Loading State</h2>
	<p>
		Show a loading spinner while performing async operations. The <code>loading</code> prop disables both
		buttons and shows a spinner on the confirm button.
	</p>
	<ComponentExample title="With Loading State" code={loadingCode}>
		<button class="demo-button" onclick={() => (loadingDialogOpen = true)}> Save Changes </button>
		<ConfirmDialog
			open={loadingDialogOpen}
			title="Save Changes"
			message="Do you want to save your changes?"
			confirmLabel="Save"
			loading={isLoading}
			onconfirm={handleLoadingConfirm}
			oncancel={() => (loadingDialogOpen = false)}
		/>
	</ComponentExample>

	<h2>Custom Labels</h2>
	<p>Customize the button labels to better describe the action context.</p>
	<ComponentExample title="Custom Button Labels" code={customLabelsCode}>
		<button class="demo-button" onclick={() => (customDialogOpen = true)}> Publish Article </button>
		<ConfirmDialog
			open={customDialogOpen}
			title="Publish Article"
			message="Your article will be visible to all users once published."
			confirmLabel="Publish Now"
			cancelLabel="Keep as Draft"
			onconfirm={() => {
				console.log('Published!');
				customDialogOpen = false;
			}}
			oncancel={() => (customDialogOpen = false)}
		/>
	</ComponentExample>

	<h2>Keyboard Support</h2>
	<p>The dialog supports keyboard navigation:</p>
	<ul>
		<li><code>Escape</code> - Closes the dialog (triggers <code>oncancel</code>)</li>
		<li>Clicking the backdrop also closes the dialog</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />
</article>

<style>
	.prose {
		max-width: 100%;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.875rem;
		color: #666;
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: var(--color-accent);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.breadcrumb span {
		color: #999;
	}

	.prose h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.2rem;
		line-height: 1.6;
		color: #444;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--color-grid);
	}

	.prose h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
		padding-top: 24px;
		border-top: 1px solid var(--color-grid);
	}

	.prose h2:first-of-type {
		border-top: none;
		padding-top: 0;
		margin-top: 0;
	}

	.prose p {
		font-size: 1rem;
		line-height: 1.7;
		margin-bottom: 16px;
	}

	.prose ul {
		margin: 0 0 16px 24px;
	}

	.prose li {
		line-height: 1.7;
		margin-bottom: 8px;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		background: #f5f5f5;
		padding: 2px 6px;
		border-radius: 3px;
	}

	.demo-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		height: 40px;
		padding: 0 24px;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 20px;
		cursor: pointer;
		transition: all 200ms;
		border: none;
		background-color: var(--color-accent, #1a1a1a);
		color: #fff;
	}

	.demo-button:hover {
		opacity: 0.9;
	}

	.demo-button-danger {
		background-color: #dc2626;
	}
</style>
