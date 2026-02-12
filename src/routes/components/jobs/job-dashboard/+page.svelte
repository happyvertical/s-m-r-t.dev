<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'stats',
			type: 'JobStats',
			required: true,
			description: 'Overall job statistics'
		},
		{
			name: 'queues',
			type: 'QueueStats[]',
			default: '[]',
			description: 'Per-queue statistics breakdown'
		},
		{
			name: 'recentJobs',
			type: 'JobData[]',
			default: '[]',
			description: 'Recent jobs to display'
		},
		{
			name: 'failedJobs',
			type: 'JobData[]',
			default: '[]',
			description: 'Failed jobs requiring attention'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading state'
		},
		{
			name: 'onJobClick',
			type: '(job: JobData) => void',
			default: 'undefined',
			description: 'Callback when a job is clicked'
		},
		{
			name: 'onRetry',
			type: '(job: JobData) => void',
			default: 'undefined',
			description: 'Callback when retry is clicked'
		}
	];
</script>

<svelte:head>
	<title>JobDashboard | s-m-r-t Jobs</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/jobs">Jobs</a>
		<span>/</span>
		<span>JobDashboard</span>
	</nav>

	<h1>JobDashboard</h1>
	<p class="lead">
		A comprehensive overview panel for monitoring background jobs. Displays statistics, queue
		breakdown, recent jobs, and failed jobs requiring attention.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { JobDashboard } from '@happyvertical/smrt-jobs/svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display job statistics and recent activity.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { JobDashboard } from '@happyvertical/smrt-jobs/svelte';
  import type { JobStats, JobData, QueueStats } from '@happyvertical/smrt-jobs/svelte';

  let stats: JobStats = $state({
    total: 0,
    pending: 0,
    ready: 0,
    running: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    avgDuration: null,
    successRate: null
  });
  let queues: QueueStats[] = $state([]);
  let recentJobs: JobData[] = $state([]);
  let failedJobs: JobData[] = $state([]);
  let loading = $state(true);

  $effect(() => {
    Promise.all([
      fetchStats(),
      fetchQueues(),
      fetchRecentJobs(),
      fetchFailedJobs()
    ]).then(([s, q, r, f]) => {
      stats = s;
      queues = q;
      recentJobs = r;
      failedJobs = f;
      loading = false;
    });
  });
</script>

<JobDashboard
  {stats}
  {queues}
  {recentJobs}
  {failedJobs}
  {loading}
  onJobClick={(job) => goto(\`/jobs/\${job.id}\`)}
  onRetry={async (job) => {
    await api.retryJob(job.id);
    await refresh();
  }}
/>`}
		language="svelte"
	/>

	<h2>Stats Only</h2>
	<p>Display just the statistics without job lists.</p>

	<CodeBlock
		code={`<JobDashboard
  {stats}
  {queues}
/>`}
		language="svelte"
	/>

	<h2>Dashboard Sections</h2>
	<ul>
		<li><strong>Stats Overview</strong> - Cards showing counts by status</li>
		<li><strong>Queue Breakdown</strong> - Per-queue statistics table</li>
		<li><strong>Recent Jobs</strong> - Latest jobs across all queues</li>
		<li><strong>Failed Jobs</strong> - Jobs that need retry or attention</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { JobDashboard } from '@happyvertical/smrt-jobs/svelte';
import type {
  JobStats,
  QueueStats,
  JobData,
  JobStatus
} from '@happyvertical/smrt-jobs/svelte';

interface JobStats {
  total: number;
  pending: number;
  ready: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  avgDuration: number | null;
  successRate: number | null;
}

interface QueueStats {
  name: string;
  pending: number;
  running: number;
  completed24h: number;
  failed24h: number;
  avgDuration: number | null;
}

// JobStatus: 'pending' | 'ready' | 'running' | 'completed' | 'failed' | 'cancelled'`}
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
