<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'schedules',
			type: 'AgentScheduleData[]',
			required: true,
			description: 'Array of all agent schedules'
		},
		{
			name: 'recentHistory',
			type: 'AgentRunHistoryEntry[]',
			default: '[]',
			description: 'Recent run history entries to display'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading state'
		},
		{
			name: 'onScheduleClick',
			type: '(schedule: AgentScheduleData) => void',
			default: 'undefined',
			description: 'Callback when a schedule is clicked'
		},
		{
			name: 'onEnable',
			type: '(schedule: AgentScheduleData) => void',
			default: 'undefined',
			description: 'Callback when enable is clicked'
		},
		{
			name: 'onDisable',
			type: '(schedule: AgentScheduleData) => void',
			default: 'undefined',
			description: 'Callback when disable is clicked'
		},
		{
			name: 'onDelete',
			type: '(schedule: AgentScheduleData) => void',
			default: 'undefined',
			description: 'Callback when delete is clicked'
		},
		{
			name: 'onRunNow',
			type: '(schedule: AgentScheduleData) => void',
			default: 'undefined',
			description: 'Callback when run now is clicked'
		},
		{
			name: 'onCreateSchedule',
			type: '() => void',
			default: 'undefined',
			description: 'Callback when create button is clicked'
		},
		{
			name: 'onHistoryEntryClick',
			type: '(entry: AgentRunHistoryEntry) => void',
			default: 'undefined',
			description: 'Callback when a history entry is clicked'
		}
	];
</script>

<svelte:head>
	<title>AgentDashboard | s-m-r-t Agents</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/agents">Agents</a>
		<span>/</span>
		<span>AgentDashboard</span>
	</nav>

	<h1>AgentDashboard</h1>
	<p class="lead">
		A combined overview panel for managing SMRT agent schedules. Displays stats,
		schedule list, and recent run history in a unified interface.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { AgentDashboard } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display agent schedules with stats overview.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AgentDashboard } from '@happyvertical/smrt-svelte';
  import type { AgentScheduleData } from '@happyvertical/smrt-svelte';

  let schedules: AgentScheduleData[] = $state([]);
  let loading = $state(true);

  // Fetch schedules from your API
  $effect(() => {
    fetchSchedules().then((data) => {
      schedules = data;
      loading = false;
    });
  });
</script>

<AgentDashboard
  {schedules}
  {loading}
  onScheduleClick={(schedule) => goto(\`/agents/\${schedule.id}\`)}
  onCreateSchedule={() => goto('/agents/new')}
/>`}
		language="svelte"
	/>

	<h2>With Run History</h2>
	<p>Include recent run history for a complete overview.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AgentDashboard } from '@happyvertical/smrt-svelte';
  import type { AgentScheduleData, AgentRunHistoryEntry } from '@happyvertical/smrt-svelte';

  let schedules: AgentScheduleData[] = $state([]);
  let recentHistory: AgentRunHistoryEntry[] = $state([]);
</script>

<AgentDashboard
  {schedules}
  {recentHistory}
  onHistoryEntryClick={(entry) => console.log('View run:', entry.id)}
/>`}
		language="svelte"
	/>

	<h2>With All Callbacks</h2>
	<p>Handle all user interactions for complete control.</p>

	<CodeBlock
		code={`<AgentDashboard
  {schedules}
  {recentHistory}
  onScheduleClick={(schedule) => goto(\`/agents/\${schedule.id}\`)}
  onEnable={async (schedule) => {
    await api.enableSchedule(schedule.id);
    await refreshSchedules();
  }}
  onDisable={async (schedule) => {
    await api.disableSchedule(schedule.id);
    await refreshSchedules();
  }}
  onDelete={async (schedule) => {
    if (confirm('Delete this schedule?')) {
      await api.deleteSchedule(schedule.id);
      await refreshSchedules();
    }
  }}
  onRunNow={async (schedule) => {
    await api.triggerRun(schedule.id);
    toast.success('Agent run triggered');
  }}
  onCreateSchedule={() => goto('/agents/new')}
/>`}
		language="svelte"
	/>

	<h2>Stats Displayed</h2>
	<p>The dashboard automatically calculates and displays:</p>
	<ul>
		<li><strong>Total Schedules</strong> - Count of all schedules</li>
		<li><strong>Active</strong> - Schedules with active status (green)</li>
		<li><strong>Running Now</strong> - Currently executing runs (blue)</li>
		<li><strong>Total Runs</strong> - Sum of all runs across schedules</li>
		<li><strong>Success Rate</strong> - Overall success percentage</li>
		<li><strong>Errors</strong> - Schedules with error status (red, shown if > 0)</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { AgentDashboard } from '@happyvertical/smrt-svelte';
import type {
  AgentScheduleData,
  AgentRunHistoryEntry,
  ScheduleStatus,
  RunStatus
} from '@happyvertical/smrt-svelte';

interface AgentScheduleData {
  id: string;
  agentType: string;
  agentId: string | null;
  agentConfig: Record<string, unknown>;
  cron: string;
  timezone: string;
  enabled: boolean;
  status: ScheduleStatus;  // 'active' | 'paused' | 'disabled' | 'error'
  lastRun: Date | string | null;
  nextRun: Date | string | null;
  lastStatus: RunStatus | null;  // 'success' | 'failed'
  lastError: string | null;
  runCount: number;
  successCount: number;
  failureCount: number;
  maxConcurrent: number;
  runningCount: number;
  timeout: number;
  method: string;
  methodArgs: Record<string, unknown>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface AgentRunHistoryEntry {
  id: string;
  scheduleId: string;
  agentType: string;
  status: RunStatus;
  startedAt: Date | string;
  completedAt: Date | string | null;
  duration: number | null;
  error: string | null;
}`}
		language="typescript"
	/>

	<h2>Helper Functions</h2>
	<p>The module exports several helper functions for formatting.</p>

	<CodeBlock
		code={`import {
  formatCronExpression,
  formatRelativeTime,
  formatDuration,
  calculateSuccessRate,
  getScheduleStatusVariant,
  getRunStatusVariant
} from '@happyvertical/smrt-svelte';

// Convert cron to human-readable
formatCronExpression('0 2 * * *');  // "Daily at 2:00"

// Format relative time
formatRelativeTime(new Date());  // "just now"
formatRelativeTime(schedule.nextRun);  // "in 2h"

// Format duration
formatDuration(45000);  // "45.0s"

// Get success rate as number
calculateSuccessRate(schedule);  // 0.95

// Get badge variant
getScheduleStatusVariant('active');  // 'success'
getRunStatusVariant('failed');  // 'error'`}
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
