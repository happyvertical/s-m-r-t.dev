<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'jobs',
			type: 'JobData[]',
			required: true,
			description: 'Array of jobs to display'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading state'
		},
		{
			name: 'filter',
			type: 'JobFilter',
			default: 'undefined',
			description: 'Current filter state'
		},
		{
			name: 'sort',
			type: 'JobSort',
			default: 'undefined',
			description: 'Current sort state'
		},
		{
			name: 'selectable',
			type: 'boolean',
			default: 'false',
			description: 'Enable row selection with checkboxes'
		},
		{
			name: 'selected',
			type: 'Set<string>',
			default: 'new Set()',
			description: 'Set of selected job IDs'
		},
		{
			name: 'onSelectionChange',
			type: '(selected: Set<string>) => void',
			default: 'undefined',
			description: 'Callback when selection changes'
		},
		{
			name: 'onJobClick',
			type: '(job: JobData) => void',
			default: 'undefined',
			description: 'Callback when a row is clicked'
		},
		{
			name: 'onRetry',
			type: '(job: JobData) => void',
			default: 'undefined',
			description: 'Callback when retry is clicked'
		},
		{
			name: 'onCancel',
			type: '(job: JobData) => void',
			default: 'undefined',
			description: 'Callback when cancel is clicked'
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
	<title>JobList | s-m-r-t Jobs</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/jobs">Jobs</a>
		<span>/</span>
		<span>JobList</span>
	</nav>

	<h1>JobList</h1>
	<p class="lead">
		A table component for displaying background jobs with status badges, filtering, sorting,
		selection, and action buttons.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { JobList } from '@happyvertical/smrt-jobs/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display a list of background jobs.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { JobList } from '@happyvertical/smrt-jobs/svelte';
  import type { JobData } from '@happyvertical/smrt-jobs/svelte';

  let jobs: JobData[] = $state([]);
</script>

<JobList
  {jobs}
  onJobClick={(job) => goto(\`/jobs/\${job.id}\`)}
/>`}
		language="svelte"
	/>

	<h2>With Filtering</h2>
	<p>Filter jobs by status, queue, or search term.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { JobList } from '@happyvertical/smrt-jobs/svelte';
  import type { JobFilter } from '@happyvertical/smrt-jobs/svelte';

  let filter: JobFilter = $state({
    status: 'failed',
    queue: 'emails',
    limit: 50
  });
</script>

<JobList
  {jobs}
  {filter}
  onJobClick={(job) => goto(\`/jobs/\${job.id}\`)}
/>`}
		language="svelte"
	/>

	<h2>With Selection</h2>
	<p>Enable multi-select for bulk operations.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { JobList } from '@happyvertical/smrt-jobs/svelte';

  let selected = $state(new Set<string>());

  async function handleBulkRetry() {
    await api.retryJobs([...selected]);
    selected = new Set();
    await refresh();
  }
</script>

{#if selected.size > 0}
  <div class="bulk-actions">
    <span>{selected.size} selected</span>
    <Button onclick={handleBulkRetry}>Retry Selected</Button>
  </div>
{/if}

<JobList
  {jobs}
  selectable
  {selected}
  onSelectionChange={(s) => selected = s}
/>`}
		language="svelte"
	/>

	<h2>With Actions</h2>
	<p>Handle retry and cancel actions on individual jobs.</p>

	<CodeBlock
		code={`<JobList
  {jobs}
  onRetry={async (job) => {
    await api.retryJob(job.id);
    toast.success('Job queued for retry');
    await refresh();
  }}
  onCancel={async (job) => {
    await api.cancelJob(job.id);
    toast.info('Job cancelled');
    await refresh();
  }}
/>`}
		language="svelte"
	/>

	<h2>Columns Displayed</h2>
	<ul>
		<li>
			<strong>Status</strong> - Badge showing pending/ready/running/completed/failed/cancelled
		</li>
		<li><strong>Queue</strong> - Queue name</li>
		<li><strong>Object</strong> - Object type and method</li>
		<li><strong>Priority</strong> - Priority level with color coding</li>
		<li><strong>Scheduled</strong> - When the job is scheduled to run</li>
		<li><strong>Started</strong> - When execution started</li>
		<li><strong>Attempts</strong> - Current/max attempts</li>
		<li><strong>Actions</strong> - Retry/Cancel buttons</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { JobList } from '@happyvertical/smrt-jobs/svelte';
import type {
  JobData,
  JobFilter,
  JobSort,
  JobStatus,
  JobPriority
} from '@happyvertical/smrt-jobs/svelte';

interface JobFilter {
  status?: JobStatus | JobStatus[] | 'all';
  queue?: string;
  objectType?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

interface JobSort {
  field: 'createdAt' | 'runAt' | 'priority' | 'status';
  direction: 'asc' | 'desc';
}

// JobStatus: 'pending' | 'ready' | 'running' | 'completed' | 'failed' | 'cancelled'
// JobPriority: 'low' | 'normal' | 'high' | 'critical'`}
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
