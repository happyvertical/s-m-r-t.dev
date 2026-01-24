<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'history',
			type: 'AgentRunHistoryEntry[]',
			required: true,
			description: 'Array of run history entries'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading state'
		},
		{
			name: 'onEntryClick',
			type: '(entry: AgentRunHistoryEntry) => void',
			default: 'undefined',
			description: 'Callback when a row is clicked'
		},
		{
			name: 'empty',
			type: 'Snippet',
			default: 'undefined',
			description: 'Custom empty state content'
		}
	];
</script>

<svelte:head>
	<title>AgentRunHistory | s-m-r-t Agents</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/agents">Agents</a>
		<span>/</span>
		<span>AgentRunHistory</span>
	</nav>

	<h1>AgentRunHistory</h1>
	<p class="lead">
		A table component displaying agent run history with status badges, duration,
		and error messages.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { AgentRunHistory } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display run history for agents.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AgentRunHistory } from '@happyvertical/smrt-svelte';
  import type { AgentRunHistoryEntry } from '@happyvertical/smrt-svelte';

  let history: AgentRunHistoryEntry[] = $state([]);
  let loading = $state(true);

  $effect(() => {
    fetchHistory().then((data) => {
      history = data;
      loading = false;
    });
  });
</script>

<AgentRunHistory {history} {loading} />`}
		language="svelte"
	/>

	<h2>With Click Handler</h2>
	<p>Navigate to run details on row click.</p>

	<CodeBlock
		code={`<AgentRunHistory
  {history}
  onEntryClick={(entry) => goto(\`/agents/runs/\${entry.id}\`)}
/>`}
		language="svelte"
	/>

	<h2>Custom Empty State</h2>
	<p>Provide a custom empty state with a snippet.</p>

	<CodeBlock
		code={`<AgentRunHistory {history}>
  {#snippet empty()}
    <div class="no-history">
      <p>No run history yet</p>
      <small>Run history will appear here after agents execute</small>
    </div>
  {/snippet}
</AgentRunHistory>`}
		language="svelte"
	/>

	<h2>Columns Displayed</h2>
	<ul>
		<li><strong>Status</strong> - Success/Failed badge</li>
		<li><strong>Agent</strong> - Agent type that ran</li>
		<li><strong>Started</strong> - Relative time when run started</li>
		<li><strong>Duration</strong> - How long the run took</li>
		<li><strong>Error</strong> - Error message if failed (truncated with tooltip)</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { AgentRunHistory } from '@happyvertical/smrt-svelte';
import type { AgentRunHistoryEntry, RunStatus } from '@happyvertical/smrt-svelte';

interface AgentRunHistoryEntry {
  id: string;
  scheduleId: string;
  agentType: string;
  status: RunStatus;  // 'success' | 'failed'
  startedAt: Date | string;
  completedAt: Date | string | null;
  duration: number | null;  // milliseconds
  error: string | null;
}

interface AgentRunHistoryProps {
  history: AgentRunHistoryEntry[];
  loading?: boolean;
  onEntryClick?: (entry: AgentRunHistoryEntry) => void;
  empty?: Snippet;
}`}
		language="typescript"
	/>

	<h2>Duration Formatting</h2>
	<p>Duration is automatically formatted based on length:</p>
	<ul>
		<li>Under 1 second: <code>450ms</code></li>
		<li>Under 1 minute: <code>45.0s</code></li>
		<li>Under 1 hour: <code>5.2m</code></li>
		<li>Over 1 hour: <code>2.5h</code></li>
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
