<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const optionsProps = [
		{
			name: 'autoInit',
			type: 'boolean',
			default: 'false',
			description: 'Auto-initialize TTS adapter on mount'
		},
		{
			name: 'defaultOptions',
			type: 'TTSOptions',
			default: 'undefined',
			description: 'Default options passed to speak()'
		}
	];

	const returnProps = [
		{
			name: 'speak',
			type: '(text: string, options?: TTSOptions) => Promise<void>',
			description: 'Speak the given text'
		},
		{
			name: 'stop',
			type: '() => void',
			description: 'Stop speaking immediately'
		},
		{
			name: 'pause',
			type: '() => void',
			description: 'Pause speech'
		},
		{
			name: 'resume',
			type: '() => void',
			description: 'Resume paused speech'
		},
		{
			name: 'initialize',
			type: '() => Promise<void>',
			description: 'Initialize the TTS adapter manually'
		},
		{
			name: 'getVoices',
			type: '() => TTSVoice[]',
			description: 'Get available voices'
		},
		{
			name: 'isSpeaking',
			type: 'boolean',
			description: 'Whether currently speaking (reactive)'
		},
		{
			name: 'isPaused',
			type: 'boolean',
			description: 'Whether speech is paused (reactive)'
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
	<title>useTTS | s-m-r-t Hooks</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/hooks">Hooks</a>
		<span>/</span>
		<span>useTTS</span>
	</nav>

	<h1>useTTS</h1>
	<p class="lead">
		A Svelte 5 hook for Text-to-Speech functionality. Provides reactive state for voice synthesis
		with support for browser speech synthesis and local voice models.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { useTTS } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Speak text with a simple button.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useTTS } from '@happyvertical/smrt-svelte';

  const tts = useTTS();
  let text = $state('Hello, world!');

  async function handleSpeak() {
    if (tts.isSpeaking) {
      tts.stop();
    } else {
      await tts.speak(text);
    }
  }
</script>

<input bind:value={text} />
<button onclick={handleSpeak}>
  {tts.isSpeaking ? 'Stop' : 'Speak'}
</button>`}
		language="svelte"
	/>

	<h2>Pause and Resume</h2>
	<p>Control speech playback with pause/resume functionality.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useTTS } from '@happyvertical/smrt-svelte';

  const tts = useTTS();
</script>

<button onclick={() => tts.speak('A long piece of text...')}>
  Play
</button>
<button onclick={() => tts.pause()} disabled={!tts.isSpeaking || tts.isPaused}>
  Pause
</button>
<button onclick={() => tts.resume()} disabled={!tts.isPaused}>
  Resume
</button>
<button onclick={() => tts.stop()} disabled={!tts.isSpeaking}>
  Stop
</button>`}
		language="svelte"
	/>

	<h2>Voice Selection</h2>
	<p>Let users choose from available voices.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useTTS } from '@happyvertical/smrt-svelte';

  const tts = useTTS({ autoInit: true });
  let selectedVoice = $state('');

  const voices = $derived(tts.getVoices());
</script>

{#if tts.isReady}
  <select bind:value={selectedVoice}>
    {#each voices as voice}
      <option value={voice.id}>{voice.name}</option>
    {/each}
  </select>

  <button onclick={() => tts.speak('Hello!', { voice: selectedVoice })}>
    Speak
  </button>
{/if}`}
		language="svelte"
	/>

	<h2>Auto-Initialize</h2>
	<p>Initialize the adapter when the component mounts.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useTTS } from '@happyvertical/smrt-svelte';

  const tts = useTTS({ autoInit: true });
</script>

{#if tts.isInitializing}
  <p>Loading voice model...</p>
{:else if tts.isReady}
  <p>Ready to speak!</p>
{/if}`}
		language="svelte"
	/>

	<h2>Options</h2>
	<PropsTable props={optionsProps} />

	<h2>Return Value</h2>
	<PropsTable props={returnProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { useTTS, type UseTTSOptions, type UseTTSReturn } from '@happyvertical/smrt-svelte';

// Options interface
interface UseTTSOptions {
  autoInit?: boolean;
  defaultOptions?: TTSOptions;
}

// Return interface
interface UseTTSReturn {
  speak: (text: string, options?: TTSOptions) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  initialize: () => Promise<void>;
  getVoices: () => TTSVoice[];
  readonly isSpeaking: boolean;
  readonly isPaused: boolean;
  readonly isReady: boolean;
  readonly isInitializing: boolean;
  readonly error: Error | null;
  readonly downloadProgress: number;
}`}
		language="typescript"
	/>

	<h2>Cleanup</h2>
	<p>
		The hook automatically stops speaking when the component is destroyed. No manual cleanup is
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

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}
</style>
