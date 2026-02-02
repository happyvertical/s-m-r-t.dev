<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'onTranscription',
			type: '(text: string) => void',
			default: 'undefined',
			description: 'Callback when transcription is complete'
		},
		{
			name: 'language',
			type: 'string',
			default: "'en-US'",
			description: 'Language code (BCP-47 format)'
		},
		{
			name: 'continuous',
			type: 'boolean',
			default: 'false',
			description: 'Enable continuous listening mode'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Button size'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disable the button'
		}
	];
</script>

<svelte:head>
	<title>VoiceInput | s-m-r-t AI</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ai">AI</a>
		<span>/</span>
		<span>VoiceInput</span>
	</nav>

	<h1>VoiceInput</h1>
	<p class="lead">
		A microphone button component for voice transcription. Handles model initialization, listening
		states, and error display automatically.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { VoiceInput } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Capture voice input and handle the transcription.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { VoiceInput } from '@happyvertical/smrt-svelte';

  let transcription = $state('');

  function handleTranscription(text: string) {
    transcription = text;
  }
</script>

<VoiceInput onTranscription={handleTranscription} />

{#if transcription}
  <p>You said: {transcription}</p>
{/if}`}
		language="svelte"
	/>

	<h2>Size Variants</h2>
	<p>Three sizes available: small, medium (default), and large.</p>

	<CodeBlock
		code={`<VoiceInput size="sm" />
<VoiceInput size="md" />
<VoiceInput size="lg" />`}
		language="svelte"
	/>

	<h2>Continuous Mode</h2>
	<p>Enable continuous listening for longer dictation.</p>

	<CodeBlock
		code={`<VoiceInput
  continuous
  onTranscription={(text) => {
    // Called for each complete sentence/phrase
    console.log('Transcribed:', text);
  }}
/>`}
		language="svelte"
	/>

	<h2>Language Selection</h2>
	<p>Specify the language for transcription accuracy.</p>

	<CodeBlock
		code={`<!-- Spanish -->
<VoiceInput language="es-ES" />

<!-- French -->
<VoiceInput language="fr-FR" />

<!-- German -->
<VoiceInput language="de-DE" />`}
		language="svelte"
	/>

	<h2>States</h2>
	<p>The component automatically handles:</p>
	<ul>
		<li><strong>Initializing</strong> - Shows download progress while loading model</li>
		<li><strong>Ready</strong> - Blue microphone button, ready to listen</li>
		<li><strong>Listening</strong> - Red pulsing button, actively transcribing</li>
		<li><strong>Error</strong> - Shows error message with retry option</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { VoiceInput } from '@happyvertical/smrt-svelte';

interface Props {
  onTranscription?: (text: string) => void;
  language?: string;
  continuous?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}`}
		language="typescript"
	/>

	<h2>Requirements</h2>
	<p>
		Must be used within a <code>&lt;Smrt&gt;</code> provider. The component uses the
		<code>useSTT</code> hook internally.
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
