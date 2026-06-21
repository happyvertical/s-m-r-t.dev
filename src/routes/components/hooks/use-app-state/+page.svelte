<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const returnProps = [
		{
			name: 'state',
			type: 'Readonly<SmrtAppState>',
			description: 'The reactive app state object'
		},
		{
			name: 'setMode',
			type: '(mode: AppMode, source?: ModeSource) => void',
			description: "Set the app mode ('default' | 'smrt')"
		},
		{
			name: 'setUser',
			type: '(user: User | null, permissions?: string[]) => void',
			description: 'Set the authenticated user (and optionally permissions)'
		},
		{
			name: 'setPermissions',
			type: '(permissions: string[]) => void',
			description: 'Set user permissions'
		},
		{
			name: 'hasPermission',
			type: '(permission: string) => boolean',
			description: 'Check if user has a permission'
		},
		{
			name: 'initializeSTT',
			type: '(options?) => Promise<void>',
			description: 'Initialize speech-to-text'
		},
		{
			name: 'initializeTTS',
			type: '() => Promise<void>',
			description: 'Initialize text-to-speech'
		},
		{
			name: 'initializeLLM',
			type: '(modelId?) => Promise<void>',
			description: 'Initialize LLM model'
		}
	];
</script>

<svelte:head>
	<title>useAppState | s-m-r-t Hooks</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/hooks">Hooks</a>
		<span>/</span>
		<span>useAppState</span>
	</nav>

	<h1>useAppState</h1>
	<p class="lead">
		Access the global app state manager from context. This is the core hook for interacting with the
		SMRT framework state.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { useAppState } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Access the app state manager to read and modify state.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useAppState } from '@happyvertical/smrt-svelte';

  const app = useAppState();

  // Access reactive state
  const mode = $derived(app.state.mode);
  const isSmrt = $derived(mode === 'smrt');
</script>

<p>Current mode: {mode}</p>
<button onclick={() => app.setMode(isSmrt ? 'default' : 'smrt')}>
  Toggle Mode
</button>`}
		language="svelte"
	/>

	<h2>Helper Hooks</h2>
	<p>For common use cases, prefer these simpler helpers:</p>

	<CodeBlock
		code={`import { useIsSmrt, useMode, usePermissions } from '@happyvertical/smrt-svelte';

// Check if in smrt mode
const isSmrt = useIsSmrt();

// Get current mode
const mode = useMode();

// Permission helpers
const permissions = usePermissions();
if (permissions.has('articles.create')) {
  // ...
}`}
		language="typescript"
	/>

	<h2>State Structure</h2>
	<p>The <code>app.state</code> object contains:</p>

	<CodeBlock
		code={`interface SmrtAppState {
  // App mode ('default' | 'smrt')
  mode: AppMode;

  // Session info
  session: {
    user: User | null;
    isAuthenticated: boolean;
    permissions: string[];
    preferences: UserPreferences;
  };

  // AI state
  ai: {
    stt: STTState;
    tts: TTSState;
    llm: LLMState;
  };

  // WebSocket state
  socket: SocketState;
}`}
		language="typescript"
	/>

	<h2>Return Value</h2>
	<PropsTable props={returnProps} />

	<h2>Requirements</h2>
	<p>
		Must be called within a <code>&lt;Provider&gt;</code>. Throws an error if called outside the
		provider context.
	</p>

	<CodeBlock
		code={`<script lang="ts">
  import { Provider } from '@happyvertical/smrt-svelte';

  let { children } = $props();
</script>

<!-- In your root layout -->
<Provider>
  {@render children()}  <!-- useAppState works here -->
</Provider>`}
		language="svelte"
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
</style>
