<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'message',
			type: 'string',
			default: 'auto-detected',
			description: 'Custom loading message (overrides auto-detected phase)'
		},
		{
			name: 'show',
			type: 'boolean',
			default: 'auto-detected',
			description: 'Whether to show the overlay (auto-detects from AI state)'
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
	<title>AILoadingOverlay | s-m-r-t AI</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ai">AI</a>
		<span>/</span>
		<span>AILoadingOverlay</span>
	</nav>

	<h1>AILoadingOverlay</h1>
	<p class="lead">
		A full-screen overlay that displays during AI model initialization.
		Automatically tracks AI loading state and shows appropriate messages.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { AILoadingOverlay } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Add to your layout to show during AI initialization.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { smrt as Smrt, AILoadingOverlay } from '@happyvertical/smrt-svelte';
</script>

<Smrt>
  <AILoadingOverlay />
  <slot />
</Smrt>`}
		language="svelte"
	/>

	<h2>Custom Message</h2>
	<p>Override the auto-detected phase message.</p>

	<CodeBlock
		code={`<AILoadingOverlay
  message="Please wait while we prepare AI features..."
/>`}
		language="svelte"
	/>

	<h2>Dismissible Overlay</h2>
	<p>Allow users to continue without waiting for AI.</p>

	<CodeBlock
		code={`<AILoadingOverlay
  dismissible
  ondismiss={() => {
    console.log('User dismissed AI loading');
  }}
/>`}
		language="svelte"
	/>

	<h2>Manual Control</h2>
	<p>Control visibility manually instead of auto-detecting.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AILoadingOverlay } from '@happyvertical/smrt-svelte';

  let showLoading = $state(true);
</script>

<AILoadingOverlay
  show={showLoading}
  message="Custom loading state..."
/>`}
		language="svelte"
	/>

	<h2>Loading Phases</h2>
	<p>The overlay automatically shows messages for each phase:</p>
	<ul>
		<li><strong>checking</strong> - "Checking AI capabilities..."</li>
		<li><strong>downloading</strong> - "Downloading AI models..."</li>
		<li><strong>initializing</strong> - "Initializing AI..."</li>
		<li><strong>ready</strong> - "AI Ready"</li>
		<li><strong>error</strong> - "Error loading AI"</li>
	</ul>

	<h2>Props</h2>
	<PropsTable props={props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { AILoadingOverlay } from '@happyvertical/smrt-svelte';

interface Props {
  message?: string;
  show?: boolean;
  dismissible?: boolean;
  class?: string;
  ondismiss?: () => void;
}`}
		language="typescript"
	/>

	<h2>Requirements</h2>
	<p>
		Must be used within a <code>&lt;Smrt&gt;</code> provider. Uses app state
		context to track AI loading progress.
	</p>
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
