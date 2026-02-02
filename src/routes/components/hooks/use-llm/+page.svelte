<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const optionsProps = [
		{
			name: 'autoInit',
			type: 'boolean',
			default: 'false',
			description: 'Auto-initialize LLM when component mounts'
		},
		{
			name: 'model',
			type: 'string',
			default: 'undefined',
			description: 'Model ID to load (e.g., "Llama-3.2-1B-Instruct-q4f16_1-MLC")'
		},
		{
			name: 'systemPrompt',
			type: 'string',
			default: 'undefined',
			description: 'Default system prompt for all chat calls'
		}
	];

	const returnProps = [
		{
			name: 'chat',
			type: '(text: string, options?) => Promise<string>',
			description: 'Send a message and get response'
		},
		{
			name: 'initialize',
			type: '(modelId?: string) => Promise<void>',
			description: 'Initialize the LLM with specified model'
		},
		{
			name: 'unload',
			type: '() => Promise<void>',
			description: 'Unload model to free memory'
		},
		{
			name: 'isReady',
			type: 'boolean',
			description: 'Whether model is loaded and ready (reactive)'
		},
		{
			name: 'isInitializing',
			type: 'boolean',
			description: 'Whether model is currently loading (reactive)'
		},
		{
			name: 'isGenerating',
			type: 'boolean',
			description: 'Whether currently generating a response (reactive)'
		},
		{
			name: 'currentModel',
			type: 'string | null',
			description: 'Currently loaded model ID (reactive)'
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
		}
	];
</script>

<svelte:head>
	<title>useLLM | s-m-r-t Hooks</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/hooks">Hooks</a>
		<span>/</span>
		<span>useLLM</span>
	</nav>

	<h1>useLLM</h1>
	<p class="lead">
		A Svelte 5 hook for in-browser LLM chat. Run language models locally using WebLLM with reactive
		state for loading progress and generation status.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { useLLM } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Create a simple chat interface with streaming responses.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useLLM } from '@happyvertical/smrt-svelte';

  const llm = useLLM({ systemPrompt: 'You are a helpful assistant.' });

  let input = $state('');
  let response = $state('');

  async function handleSubmit() {
    response = '';
    response = await llm.chat(input, {
      onToken: (token) => { response += token; }
    });
  }
</script>

{#if llm.isInitializing}
  <p>Loading model... {llm.downloadProgress}%</p>
{:else}
  <form onsubmit={handleSubmit}>
    <input bind:value={input} placeholder="Ask something..." />
    <button disabled={llm.isGenerating}>Send</button>
  </form>
  <p>{response}</p>
{/if}`}
		language="svelte"
	/>

	<h2>Manual Initialization</h2>
	<p>Load a specific model on user action to save bandwidth.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useLLM } from '@happyvertical/smrt-svelte';

  const llm = useLLM();

  async function loadModel() {
    await llm.initialize('Llama-3.2-1B-Instruct-q4f16_1-MLC');
  }
</script>

{#if !llm.isReady}
  <button onclick={loadModel} disabled={llm.isInitializing}>
    {llm.isInitializing ? \`Loading \${llm.downloadProgress}%\` : 'Load AI Model'}
  </button>
{:else}
  <p>Model ready: {llm.currentModel}</p>
{/if}`}
		language="svelte"
	/>

	<h2>Streaming Tokens</h2>
	<p>Display tokens as they're generated for a responsive UX.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useLLM } from '@happyvertical/smrt-svelte';

  const llm = useLLM({ autoInit: true });
  let response = $state('');

  async function ask(question: string) {
    response = '';
    await llm.chat(question, {
      onToken: (token) => {
        response += token;
      }
    });
  }
</script>

<button onclick={() => ask('Explain quantum computing in simple terms')}>
  Ask Question
</button>

{#if llm.isGenerating}
  <p class="typing">{response}<span class="cursor">|</span></p>
{:else if response}
  <p>{response}</p>
{/if}`}
		language="svelte"
	/>

	<h2>Memory Management</h2>
	<p>Unload the model when not needed to free GPU memory.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useLLM } from '@happyvertical/smrt-svelte';

  const llm = useLLM();

  async function cleanup() {
    await llm.unload();
  }
</script>

<button onclick={cleanup} disabled={!llm.isReady}>
  Unload Model
</button>`}
		language="svelte"
	/>

	<h2>Available Models</h2>
	<p>WebLLM supports various models. Smaller models load faster:</p>
	<ul>
		<li><code>Llama-3.2-1B-Instruct-q4f16_1-MLC</code> - Fast, 1B params</li>
		<li><code>Llama-3.2-3B-Instruct-q4f16_1-MLC</code> - Balanced, 3B params</li>
		<li><code>Phi-3.5-mini-instruct-q4f16_1-MLC</code> - Microsoft Phi-3.5</li>
		<li><code>Qwen2.5-1.5B-Instruct-q4f16_1-MLC</code> - Alibaba Qwen</li>
	</ul>

	<h2>Options</h2>
	<PropsTable props={optionsProps} />

	<h2>Return Value</h2>
	<PropsTable props={returnProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { useLLM, type UseLLMOptions, type UseLLMReturn } from '@happyvertical/smrt-svelte';

// Options interface
interface UseLLMOptions {
  autoInit?: boolean;
  model?: string;
  systemPrompt?: string;
}

// Chat options
interface ChatOptions {
  systemPrompt?: string;
  onToken?: (token: string) => void;
}

// Return interface
interface UseLLMReturn {
  chat: (text: string, options?: ChatOptions) => Promise<string>;
  initialize: (modelId?: string) => Promise<void>;
  unload: () => Promise<void>;
  readonly isReady: boolean;
  readonly isInitializing: boolean;
  readonly isGenerating: boolean;
  readonly currentModel: string | null;
  readonly error: Error | null;
  readonly downloadProgress: number;
}`}
		language="typescript"
	/>

	<h2>Notes</h2>
	<ul>
		<li>Models are cached in IndexedDB after first download</li>
		<li>Requires WebGPU support (Chrome 113+, Edge 113+)</li>
		<li>Model download is expensive; consider lazy loading</li>
		<li>The hook does not auto-unload on destroy to preserve cached state</li>
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
