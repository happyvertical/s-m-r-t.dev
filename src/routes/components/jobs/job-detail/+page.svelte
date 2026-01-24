<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'job',
			type: 'JobData',
			required: true,
			description: 'The job to display'
		},
		{
			name: 'showResult',
			type: 'boolean',
			default: 'false',
			description: 'Show result data section'
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
			name: 'onDelete',
			type: '(job: JobData) => void',
			default: 'undefined',
			description: 'Callback when delete is clicked'
		}
	];
</script>

<svelte:head>
	<title>JobDetail | s-m-r-t Jobs</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/jobs">Jobs</a>
		<span>/</span>
		<span>JobDetail</span>
	</nav>

	<h1>JobDetail</h1>
	<p class="lead">
		A detailed view of a single background job showing all properties,
		arguments, timing, and error information.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { JobDetail } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display complete job details.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { JobDetail } from '@happyvertical/smrt-svelte';
  import type { JobData } from '@happyvertical/smrt-svelte';

  const { job } = $props<{ job: JobData }>();
</script>

<JobDetail {job} />`}
		language="svelte"
	/>

	<h2>With Actions</h2>
	<p>Handle retry, cancel, and delete actions.</p>

	<CodeBlock
		code={`<JobDetail
  {job}
  onRetry={async (j) => {
    await api.retryJob(j.id);
    toast.success('Job queued for retry');
    await refresh();
  }}
  onCancel={async (j) => {
    await api.cancelJob(j.id);
    toast.info('Job cancelled');
    await refresh();
  }}
  onDelete={async (j) => {
    if (confirm('Delete this job?')) {
      await api.deleteJob(j.id);
      goto('/jobs');
    }
  }}
/>`}
		language="svelte"
	/>

	<h2>With Result Data</h2>
	<p>Show the job result or output data.</p>

	<CodeBlock
		code={`<JobDetail
  {job}
  showResult
/>`}
		language="svelte"
	/>

	<h2>Sections Displayed</h2>
	<ul>
		<li><strong>Status</strong> - Current status badge with timing</li>
		<li><strong>Queue</strong> - Queue name and priority</li>
		<li><strong>Object</strong> - Object type, ID, and method</li>
		<li><strong>Arguments</strong> - JSON display of job arguments</li>
		<li><strong>Timing</strong> - Created, scheduled, started, completed times</li>
		<li><strong>Attempts</strong> - Current/max attempts with timeout</li>
		<li><strong>Error</strong> - Last error message if failed</li>
		<li><strong>Worker</strong> - Worker ID that processed the job</li>
		<li><strong>Result</strong> - Result data or pointer (if showResult)</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { JobDetail } from '@happyvertical/smrt-svelte';
import type { JobData, TimeoutBehavior } from '@happyvertical/smrt-svelte';

interface JobData {
  id: string;
  queue: string;
  objectType: string;
  objectId: string | null;
  method: string;
  args: Record<string, unknown>;
  status: JobStatus;
  priority: number;
  attempts: number;
  maxAttempts: number;
  timeout: number;
  timeoutBehavior: TimeoutBehavior;  // 'fail' | 'kill' | 'warn'
  runAt: Date | string;
  startedAt: Date | string | null;
  completedAt: Date | string | null;
  lastError: string | null;
  resultPointer: string | null;
  workerId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}`}
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
