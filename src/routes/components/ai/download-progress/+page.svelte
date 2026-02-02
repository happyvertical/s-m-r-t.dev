<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'progress',
			type: 'DownloadProgress | null',
			required: true,
			description: 'Progress data from useSTT, useTTS, or useLLM'
		},
		{
			name: 'label',
			type: 'string',
			default: "'Loading...'",
			description: 'Label shown above the progress bar'
		},
		{
			name: 'showPercent',
			type: 'boolean',
			default: 'true',
			description: 'Show percentage text'
		},
		{
			name: 'showBytes',
			type: 'boolean',
			default: 'false',
			description: 'Show bytes downloaded/total'
		}
	];
</script>

<svelte:head>
	<title>DownloadProgress | s-m-r-t AI</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ai">AI</a>
		<span>/</span>
		<span>DownloadProgress</span>
	</nav>

	<h1>DownloadProgress</h1>
	<p class="lead">
		A progress bar component for AI model downloads. Shows download state, percentage, bytes, and
		current file being downloaded.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { DownloadProgress } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Show download progress from an AI hook.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useSTT, DownloadProgress } from '@happyvertical/smrt-svelte';

  const stt = useSTT();
</script>

{#if stt.isInitializing}
  <DownloadProgress
    progress={{
      state: 'downloading',
      percent: stt.downloadProgress,
      bytesLoaded: 0,
      bytesTotal: 0
    }}
    label="Loading speech recognition..."
  />
{/if}`}
		language="svelte"
	/>

	<h2>With Bytes Display</h2>
	<p>Show bytes loaded and total size.</p>

	<CodeBlock
		code={`<DownloadProgress
  progress={progress}
  showBytes
  label="Downloading AI model..."
/>`}
		language="svelte"
	/>

	<h2>Indeterminate State</h2>
	<p>When progress is null or idle, shows an indeterminate animation.</p>

	<CodeBlock
		code={`<!-- Indeterminate progress -->
<DownloadProgress
  progress={null}
  label="Checking capabilities..."
/>`}
		language="svelte"
	/>

	<h2>Progress States</h2>
	<p>The component handles different states:</p>
	<ul>
		<li><strong>idle</strong> - Indeterminate animation</li>
		<li><strong>downloading</strong> - Shows actual progress</li>
		<li><strong>error</strong> - Displays error message</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { DownloadProgress } from '@happyvertical/smrt-svelte';
import type { DownloadProgress as DownloadProgressType } from '@happyvertical/browser-ai';

interface Props {
  progress: DownloadProgressType | null;
  label?: string;
  showPercent?: boolean;
  showBytes?: boolean;
}

interface DownloadProgressType {
  state: 'idle' | 'downloading' | 'error';
  percent: number;
  bytesLoaded: number;
  bytesTotal: number;
  currentFile?: string;
  error?: string;
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
