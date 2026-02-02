<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const returnProps = [
		{
			name: 'status',
			type: 'SocketStatus',
			description:
				"Current connection status (reactive): 'disconnected' | 'connecting' | 'connected' | 'reconnecting'"
		},
		{
			name: 'isConnected',
			type: 'boolean',
			description: 'Whether the socket is connected (reactive)'
		},
		{
			name: 'isReconnecting',
			type: 'boolean',
			description: 'Whether currently attempting to reconnect (reactive)'
		},
		{
			name: 'reconnectAttempts',
			type: 'number',
			description: 'Number of reconnection attempts (reactive)'
		},
		{
			name: 'lastError',
			type: 'Event | null',
			description: 'Last connection error (reactive)'
		},
		{
			name: 'send',
			type: '(data: unknown) => void',
			description: 'Send a message through the socket'
		},
		{
			name: 'reconnect',
			type: '() => void',
			description: 'Manually trigger reconnection'
		},
		{
			name: 'disconnect',
			type: '() => void',
			description: 'Disconnect from the server'
		}
	];
</script>

<svelte:head>
	<title>useSocket | s-m-r-t Hooks</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/hooks">Hooks</a>
		<span>/</span>
		<span>useSocket</span>
	</nav>

	<h1>useSocket</h1>
	<p class="lead">
		Access WebSocket state and methods for real-time communication. Provides connection status,
		message sending, and reconnection handling.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { useSocket } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display connection status and send messages.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useSocket } from '@happyvertical/smrt-svelte';

  const socket = useSocket();

  function sendPing() {
    socket.send({ type: 'ping' });
  }
</script>

<p>Status: {socket.status}</p>
<p>Connected: {socket.isConnected}</p>
<button onclick={sendPing} disabled={!socket.isConnected}>
  Ping
</button>`}
		language="svelte"
	/>

	<h2>Connection Status</h2>
	<p>Show appropriate UI based on connection state.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useSocket } from '@happyvertical/smrt-svelte';

  const socket = useSocket();
</script>

{#if socket.status === 'connecting'}
  <p>Connecting...</p>
{:else if socket.status === 'connected'}
  <p class="connected">Connected</p>
{:else if socket.status === 'reconnecting'}
  <p>Reconnecting... (attempt {socket.reconnectAttempts})</p>
{:else}
  <p class="disconnected">Disconnected</p>
  <button onclick={() => socket.reconnect()}>Reconnect</button>
{/if}`}
		language="svelte"
	/>

	<h2>Configuring the Socket</h2>
	<p>Configure WebSocket connection in the Smrt provider.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { Provider as Smrt } from '@happyvertical/smrt-svelte';
</script>

<Smrt
  socket={{
    url: 'wss://api.example.com/ws',
    reconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
    onMessage: (data) => console.log('Received:', data),
    onError: (event) => console.error('Socket error:', event)
  }}
>
  <slot />
</Smrt>`}
		language="svelte"
	/>

	<h2>Error Handling</h2>
	<p>Handle connection errors gracefully.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useSocket } from '@happyvertical/smrt-svelte';

  const socket = useSocket();
</script>

{#if socket.lastError}
  <div class="error">
    <p>Connection error occurred</p>
    <button onclick={() => socket.reconnect()}>
      Try Again
    </button>
  </div>
{/if}`}
		language="svelte"
	/>

	<h2>Return Value</h2>
	<PropsTable props={returnProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { useSocket } from '@happyvertical/smrt-svelte';

type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

const socket = useSocket();

// Send typed messages
interface ChatMessage {
  type: 'chat';
  content: string;
}

socket.send({ type: 'chat', content: 'Hello!' } satisfies ChatMessage);`}
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
</style>
