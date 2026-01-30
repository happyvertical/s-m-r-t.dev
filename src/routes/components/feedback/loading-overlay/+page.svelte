<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'show',
			type: 'boolean',
			default: 'false',
			description: 'Whether to show the overlay'
		},
		{
			name: 'message',
			type: 'string',
			default: "'Loading...'",
			description: 'Loading message to display'
		},
		{
			name: 'progress',
			type: 'number',
			default: '0',
			description: 'Progress percentage (0-100)'
		},
		{
			name: 'items',
			type: 'string[]',
			default: '[]',
			description: 'List of completed items to display'
		},
		{
			name: 'error',
			type: '{ message: string } | null',
			default: 'null',
			description: 'Error object with message'
		},
		{
			name: 'dismissible',
			type: 'boolean',
			default: 'false',
			description: 'Allow users to dismiss the overlay'
		},
		{
			name: 'class',
			type: 'string',
			default: "''",
			description: 'Custom CSS class'
		},
		{
			name: 'ondismiss',
			type: '() => void',
			default: 'undefined',
			description: 'Callback when overlay is dismissed'
		}
	];
</script>

<svelte:head>
	<title>LoadingOverlay | s-m-r-t Feedback</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/feedback">Feedback</a>
		<span>/</span>
		<span>LoadingOverlay</span>
	</nav>

	<h1>LoadingOverlay</h1>
	<p class="lead">
		A full-screen loading overlay for async operations. Shows progress,
		completed items, and error states with a blurred backdrop.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { LoadingOverlay } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Show a simple loading overlay during async operations.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { LoadingOverlay } from '@happyvertical/smrt-svelte';

  let loading = $state(false);

  async function fetchData() {
    loading = true;
    await doSomething();
    loading = false;
  }
</script>

<LoadingOverlay show={loading} message="Loading data..." />
<button onclick={fetchData}>Fetch Data</button>`}
		language="svelte"
	/>

	<h2>With Progress</h2>
	<p>Show progress percentage for longer operations.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { LoadingOverlay } from '@happyvertical/smrt-svelte';

  let progress = $state(0);
  let loading = $state(false);

  async function uploadFiles() {
    loading = true;
    for (let i = 0; i <= 100; i += 10) {
      progress = i;
      await new Promise(r => setTimeout(r, 200));
    }
    loading = false;
  }
</script>

<LoadingOverlay
  show={loading}
  message="Uploading files..."
  progress={progress}
/>`}
		language="svelte"
	/>

	<h2>With Completed Items</h2>
	<p>Show badges for completed steps.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { LoadingOverlay } from '@happyvertical/smrt-svelte';

  let items = $state<string[]>([]);
  let loading = $state(false);

  async function processItems() {
    loading = true;
    items = [];
    for (const step of ['Validated', 'Processed', 'Saved']) {
      await new Promise(r => setTimeout(r, 500));
      items = [...items, step];
    }
    loading = false;
  }
</script>

<LoadingOverlay
  show={loading}
  message="Processing..."
  items={items}
/>`}
		language="svelte"
	/>

	<h2>Error State</h2>
	<p>Display an error message when something goes wrong.</p>

	<CodeBlock
		code={`<LoadingOverlay
  show={true}
  message="Operation failed"
  error={{ message: 'Network connection lost. Please try again.' }}
  dismissible
  ondismiss={() => console.log('Dismissed')}
/>`}
		language="svelte"
	/>

	<h2>Dismissible Overlay</h2>
	<p>Allow users to continue without waiting.</p>

	<CodeBlock
		code={`<LoadingOverlay
  show={loading}
  message="This may take a while..."
  dismissible
  ondismiss={() => {
    // User chose to continue
    loading = false;
  }}
/>`}
		language="svelte"
	/>

	<h2>Props</h2>
	<PropsTable props={props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { LoadingOverlay } from '@happyvertical/smrt-svelte';

interface LoadingOverlayProps {
  show?: boolean;
  message?: string;
  progress?: number;
  items?: string[];
  error?: { message: string } | null;
  dismissible?: boolean;
  class?: string;
  ondismiss?: () => void;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<ul>
		<li>Uses <code>role="dialog"</code> with <code>aria-modal="true"</code></li>
		<li>Loading message is announced via <code>aria-labelledby</code></li>
		<li>Backdrop has blur effect for focus on content</li>
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
