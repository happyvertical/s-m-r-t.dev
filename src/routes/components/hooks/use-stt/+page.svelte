<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const optionsProps = [
		{
			name: 'autoInit',
			type: 'boolean',
			default: 'false',
			description: 'Auto-initialize STT adapter on mount'
		},
		{
			name: 'defaultOptions',
			type: 'STTOptions',
			default: 'undefined',
			description: 'Default options passed to start()'
		}
	];

	const returnProps = [
		{
			name: 'start',
			type: '(options?: STTOptions) => Promise<void>',
			description: 'Start listening for speech'
		},
		{
			name: 'stop',
			type: '() => Promise<void>',
			description: 'Stop listening'
		},
		{
			name: 'initialize',
			type: '(options?: GetSTTOptions) => Promise<void>',
			description: 'Initialize the STT adapter manually'
		},
		{
			name: 'isListening',
			type: 'boolean',
			description: 'Whether currently listening (reactive)'
		},
		{
			name: 'isReady',
			type: 'boolean',
			description: 'Whether adapter is initialized and ready (reactive)'
		},
		{
			name: 'isInitializing',
			type: 'boolean',
			description: 'Whether adapter is currently initializing (reactive)'
		},
		{
			name: 'lastResult',
			type: 'string',
			description: 'Final transcribed text from last speech (reactive)'
		},
		{
			name: 'interimResult',
			type: 'string',
			description: 'Live interim text during speech (reactive)'
		},
		{
			name: 'currentResult',
			type: 'string',
			description: 'Interim while listening, lastResult otherwise (reactive)'
		},
		{
			name: 'error',
			type: 'Error | null',
			description: 'Current error state (reactive)'
		},
		{
			name: 'downloadProgress',
			type: 'number',
			description: 'Model download progress 0-100 (reactive)'
		},
		{
			name: 'adapterType',
			type: 'string | null',
			description: 'Current adapter type (reactive)'
		}
	];
</script>

<svelte:head>
	<title>useSTT | s-m-r-t Hooks</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/hooks">Hooks</a>
		<span>/</span>
		<span>useSTT</span>
	</nav>

	<h1>useSTT</h1>
	<p class="lead">
		A Svelte 5 hook for Speech-to-Text functionality. Provides reactive state for voice
		transcription with support for browser speech recognition and local Whisper models.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { useSTT } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Create a simple voice input with start/stop control.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useSTT } from '@happyvertical/smrt-svelte';

  const stt = useSTT();

  async function handleClick() {
    if (stt.isListening) {
      await stt.stop();
    } else {
      await stt.start();
    }
  }
</script>

<button onclick={handleClick}>
  {stt.isListening ? 'Stop' : 'Start'} Listening
</button>

{#if stt.currentResult}
  <p>You said: {stt.currentResult}</p>
{/if}`}
		language="svelte"
	/>

	<h2>Auto-Initialize</h2>
	<p>Use <code>autoInit</code> to initialize the adapter when the component mounts.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useSTT } from '@happyvertical/smrt-svelte';

  // Initialize Whisper model on mount
  const stt = useSTT({ autoInit: true });
</script>

{#if stt.isInitializing}
  <p>Loading model... {stt.downloadProgress}%</p>
{:else if stt.isReady}
  <p>Ready to listen!</p>
{/if}`}
		language="svelte"
	/>

	<h2>Live Transcription</h2>
	<p>Show interim results while the user is speaking.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useSTT } from '@happyvertical/smrt-svelte';

  const stt = useSTT();
</script>

{#if stt.isListening}
  <p class="interim">{stt.interimResult}</p>
{/if}

<p class="final">{stt.lastResult}</p>`}
		language="svelte"
	/>

	<h2>STT Adapters</h2>
	<p>The hook supports multiple STT backends:</p>
	<ul>
		<li><strong>browser-speech</strong> - Browser's native Web Speech API (online, fast)</li>
		<li><strong>whisper-wasm</strong> - Local Whisper model via WebAssembly (offline capable)</li>
		<li><strong>whisper-cpp</strong> - Local Whisper via native bindings (highest quality)</li>
	</ul>

	<CodeBlock
		code={`// Initialize with specific adapter
await stt.initialize({ type: 'whisper-wasm' });

// Or configure in the Provider
<Provider ai={{ stt: { type: 'whisper-wasm' } }}>
  ...
</Provider>`}
		language="typescript"
	/>

	<h2>Options</h2>
	<PropsTable props={optionsProps} />

	<h2>Return Value</h2>
	<PropsTable props={returnProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { useSTT, type UseSTTOptions, type UseSTTReturn } from '@happyvertical/smrt-svelte';

// Options interface
interface UseSTTOptions {
  autoInit?: boolean;
  defaultOptions?: STTOptions;
}

// Return interface
interface UseSTTReturn {
  start: (options?: STTOptions) => Promise<void>;
  stop: () => Promise<void>;
  initialize: (options?: GetSTTOptions) => Promise<void>;
  readonly isListening: boolean;
  readonly isReady: boolean;
  readonly isInitializing: boolean;
  readonly lastResult: string;
  readonly interimResult: string;
  readonly currentResult: string;
  readonly error: Error | null;
  readonly downloadProgress: number;
  readonly adapterType: string | null;
}`}
		language="typescript"
	/>

	<h2>Cleanup</h2>
	<p>
		The hook automatically stops listening when the component is destroyed. No manual cleanup is
		required.
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
