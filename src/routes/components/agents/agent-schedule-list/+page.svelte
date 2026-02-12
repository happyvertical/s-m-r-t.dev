<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'schedules',
			type: 'AgentScheduleData[]',
			required: true,
			description: 'Array of schedules to display'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading state'
		},
		{
			name: 'showActions',
			type: 'boolean',
			default: 'true',
			description: 'Show actions column'
		},
		{
			name: 'onScheduleClick',
			type: '(schedule: AgentScheduleData) => void',
			default: 'undefined',
			description: 'Callback when a row is clicked'
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
			name: 'onRunNow',
			type: '(schedule: AgentScheduleData) => void',
			default: 'undefined',
			description: 'Callback when run now is clicked'
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
	<title>AgentScheduleList | s-m-r-t Agents</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/agents">Agents</a>
		<span>/</span>
		<span>AgentScheduleList</span>
	</nav>

	<h1>AgentScheduleList</h1>
	<p class="lead">
		A table display of scheduled agents showing status, cron schedule, last/next run times, success
		rate, and action buttons.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { AgentScheduleList } from '@happyvertical/smrt-agents/svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display a list of agent schedules.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AgentScheduleList } from '@happyvertical/smrt-agents/svelte';
  import type { AgentScheduleData } from '@happyvertical/smrt-agents/svelte';

  let schedules: AgentScheduleData[] = $state([]);
</script>

<AgentScheduleList
  {schedules}
  onScheduleClick={(schedule) => goto(\`/agents/\${schedule.id}\`)}
/>`}
		language="svelte"
	/>

	<h2>With Action Handlers</h2>
	<p>Handle enable/disable and run now actions.</p>

	<CodeBlock
		code={`<AgentScheduleList
  {schedules}
  onEnable={async (schedule) => {
    await api.enableSchedule(schedule.id);
    await refreshSchedules();
  }}
  onDisable={async (schedule) => {
    await api.disableSchedule(schedule.id);
    await refreshSchedules();
  }}
  onRunNow={async (schedule) => {
    await api.triggerRun(schedule.id);
    toast.success('Agent run triggered');
  }}
/>`}
		language="svelte"
	/>

	<h2>Read-Only Mode</h2>
	<p>Hide the actions column for display-only use.</p>

	<CodeBlock
		code={`<AgentScheduleList
  {schedules}
  showActions={false}
  onScheduleClick={(schedule) => goto(\`/agents/\${schedule.id}\`)}
/>`}
		language="svelte"
	/>

	<h2>Custom Empty State</h2>
	<p>Provide a custom empty state with a snippet.</p>

	<CodeBlock
		code={`<AgentScheduleList {schedules}>
  {#snippet empty()}
    <div class="custom-empty">
      <p>No scheduled agents yet</p>
      <Button onclick={() => goto('/agents/new')}>
        Create Your First Schedule
      </Button>
    </div>
  {/snippet}
</AgentScheduleList>`}
		language="svelte"
	/>

	<h2>Columns Displayed</h2>
	<ul>
		<li><strong>Status</strong> - Badge showing active/paused/disabled/error</li>
		<li><strong>Agent</strong> - Agent type, ID (truncated), and method</li>
		<li><strong>Schedule</strong> - Human-readable and raw cron expression</li>
		<li><strong>Last Run</strong> - Relative time with success/failed color</li>
		<li><strong>Next Run</strong> - Relative time until next execution</li>
		<li><strong>Success Rate</strong> - Percentage with color coding</li>
		<li><strong>Runs</strong> - Total count with running indicator</li>
		<li><strong>Actions</strong> - Enable/Disable and Run Now buttons</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { AgentScheduleList } from '@happyvertical/smrt-agents/svelte';
import type { AgentScheduleData } from '@happyvertical/smrt-agents/svelte';

interface AgentScheduleListProps {
  schedules: AgentScheduleData[];
  loading?: boolean;
  showActions?: boolean;
  onScheduleClick?: (schedule: AgentScheduleData) => void;
  onEnable?: (schedule: AgentScheduleData) => void;
  onDisable?: (schedule: AgentScheduleData) => void;
  onRunNow?: (schedule: AgentScheduleData) => void;
  empty?: Snippet;
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
