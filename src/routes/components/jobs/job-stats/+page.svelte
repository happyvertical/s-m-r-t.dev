<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'stats',
			type: 'JobStats',
			required: true,
			description: 'Statistics data to display'
		},
		{
			name: 'queues',
			type: 'QueueStats[]',
			default: '[]',
			description: 'Per-queue statistics for breakdown table'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading state'
		},
		{
			name: 'refreshInterval',
			type: 'number',
			default: '0',
			description: 'Auto-refresh interval in ms (0 = disabled)'
		}
	];
</script>

<svelte:head>
	<title>JobStats | s-m-r-t Jobs</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/jobs">Jobs</a>
		<span>/</span>
		<span>JobStats</span>
	</nav>

	<h1>JobStats</h1>
	<p class="lead">
		A statistics display component showing job counts by status,
		success rate, average duration, and optional queue breakdown.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { JobStats } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display overall job statistics.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { JobStats } from '@happyvertical/smrt-svelte';
  import type { JobStats as Stats } from '@happyvertical/smrt-svelte';

  let stats: Stats = $state({
    total: 1250,
    pending: 45,
    ready: 12,
    running: 8,
    completed: 1150,
    failed: 25,
    cancelled: 10,
    avgDuration: 3400,
    successRate: 0.978
  });
</script>

<JobStats {stats} />`}
		language="svelte"
	/>

	<h2>With Queue Breakdown</h2>
	<p>Include per-queue statistics table.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { JobStats } from '@happyvertical/smrt-svelte';
  import type { QueueStats } from '@happyvertical/smrt-svelte';

  let queues: QueueStats[] = $state([
    {
      name: 'emails',
      pending: 25,
      running: 3,
      completed24h: 450,
      failed24h: 5,
      avgDuration: 1200
    },
    {
      name: 'reports',
      pending: 10,
      running: 2,
      completed24h: 85,
      failed24h: 2,
      avgDuration: 45000
    }
  ]);
</script>

<JobStats {stats} {queues} />`}
		language="svelte"
	/>

	<h2>With Auto-Refresh</h2>
	<p>Automatically refresh stats at an interval.</p>

	<CodeBlock
		code={`<JobStats
  {stats}
  {queues}
  refreshInterval={5000}
/>`}
		language="svelte"
	/>

	<h2>Stats Cards</h2>
	<ul>
		<li><strong>Total</strong> - Total job count</li>
		<li><strong>Pending</strong> - Jobs waiting to be scheduled</li>
		<li><strong>Ready</strong> - Jobs ready to run (info)</li>
		<li><strong>Running</strong> - Currently executing (primary)</li>
		<li><strong>Completed</strong> - Successfully finished (success)</li>
		<li><strong>Failed</strong> - Failed jobs (error)</li>
		<li><strong>Success Rate</strong> - Percentage with color coding</li>
		<li><strong>Avg Duration</strong> - Formatted average execution time</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { JobStats } from '@happyvertical/smrt-svelte';
import type {
  JobStats as JobStatsData,
  QueueStats
} from '@happyvertical/smrt-svelte';

interface JobStats {
  total: number;
  pending: number;
  ready: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  avgDuration: number | null;  // milliseconds
  successRate: number | null;  // 0-1
}

interface QueueStats {
  name: string;
  pending: number;
  running: number;
  completed24h: number;
  failed24h: number;
  avgDuration: number | null;  // milliseconds
}`}
		language="typescript"
	/>

	<h2>Helper Functions</h2>
	<CodeBlock
		code={`import {
  formatDuration,
  formatRelativeTime,
  getPriorityLabel,
  getPriorityClass,
  getStatusVariant
} from '@happyvertical/smrt-svelte';

// Format duration
formatDuration(3400);  // "3.4s"
formatDuration(125000);  // "2.1m"

// Get priority label from numeric value
getPriorityLabel(50);  // "Normal"
getPriorityLabel(90);  // "Critical"

// Get status badge variant
getStatusVariant('running');  // 'primary'
getStatusVariant('failed');  // 'error'`}
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
