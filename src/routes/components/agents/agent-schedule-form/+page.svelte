<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'initialData',
			type: 'Partial<ScheduleFormData>',
			default: '{}',
			description: 'Initial form data for editing'
		},
		{
			name: 'agentTypes',
			type: 'string[]',
			default: '[]',
			description: 'Available agent types for dropdown'
		},
		{
			name: 'onSubmit',
			type: '(data: ScheduleFormData) => void',
			default: 'undefined',
			description: 'Callback when form is submitted'
		},
		{
			name: 'onCancel',
			type: '() => void',
			default: 'undefined',
			description: 'Callback when cancel is clicked'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Show loading state and disable form'
		},
		{
			name: 'editMode',
			type: 'boolean',
			default: 'false',
			description: 'Show edit mode labels and button text'
		}
	];
</script>

<svelte:head>
	<title>AgentScheduleForm | s-m-r-t Agents</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/agents">Agents</a>
		<span>/</span>
		<span>AgentScheduleForm</span>
	</nav>

	<h1>AgentScheduleForm</h1>
	<p class="lead">
		A form component for creating and editing agent schedules. Includes cron presets, timezone
		selection, and validation.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { AgentScheduleForm } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Create Mode</h2>
	<p>Use for creating new agent schedules.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AgentScheduleForm } from '@happyvertical/smrt-svelte';

  let loading = $state(false);

  async function handleSubmit(data) {
    loading = true;
    await api.createSchedule(data);
    goto('/agents');
  }
</script>

<AgentScheduleForm
  {loading}
  onSubmit={handleSubmit}
  onCancel={() => goto('/agents')}
/>`}
		language="svelte"
	/>

	<h2>Edit Mode</h2>
	<p>Pre-populate the form with existing schedule data.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AgentScheduleForm } from '@happyvertical/smrt-svelte';

  const { schedule } = $props();
</script>

<AgentScheduleForm
  editMode
  initialData={{
    agentType: schedule.agentType,
    agentId: schedule.agentId,
    cron: schedule.cron,
    timezone: schedule.timezone,
    enabled: schedule.enabled,
    maxConcurrent: schedule.maxConcurrent,
    timeout: schedule.timeout,
    method: schedule.method
  }}
  onSubmit={handleUpdate}
  onCancel={() => goto('/agents')}
/>`}
		language="svelte"
	/>

	<h2>With Agent Type Dropdown</h2>
	<p>Provide a list of available agent types for selection.</p>

	<CodeBlock
		code={`<AgentScheduleForm
  agentTypes={['Praeco', 'Scraper', 'Indexer', 'Reporter']}
  onSubmit={handleSubmit}
/>`}
		language="svelte"
	/>

	<h2>Form Fields</h2>
	<ul>
		<li><strong>Agent Type</strong> (required) - Dropdown or text input</li>
		<li><strong>Agent ID</strong> (optional) - Specific instance ID</li>
		<li><strong>Method</strong> - Method to call on the agent (default: run)</li>
		<li><strong>Cron Schedule</strong> (required) - 5-field cron expression</li>
		<li><strong>Timezone</strong> - Schedule timezone</li>
		<li><strong>Max Concurrent</strong> - Maximum concurrent runs (1-10)</li>
		<li><strong>Timeout</strong> - Run timeout in milliseconds</li>
		<li><strong>Enabled</strong> - Whether to enable immediately</li>
	</ul>

	<h2>Cron Presets</h2>
	<p>The form includes quick-select presets for common schedules:</p>
	<ul>
		<li>Every hour (<code>0 * * * *</code>)</li>
		<li>Every 15 minutes (<code>*/15 * * * *</code>)</li>
		<li>Daily at midnight (<code>0 0 * * *</code>)</li>
		<li>Daily at 2 AM (<code>0 2 * * *</code>)</li>
		<li>Weekly on Sunday (<code>0 0 * * 0</code>)</li>
		<li>Monthly on 1st (<code>0 0 1 * *</code>)</li>
	</ul>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { AgentScheduleForm } from '@happyvertical/smrt-svelte';
import type { ScheduleFormData } from '@happyvertical/smrt-svelte';

interface ScheduleFormData {
  agentType: string;
  agentId?: string;
  agentConfig?: Record<string, unknown>;
  cron: string;
  timezone?: string;
  enabled?: boolean;
  maxConcurrent?: number;
  timeout?: number;
  method?: string;
  methodArgs?: Record<string, unknown>;
}

interface AgentScheduleFormProps {
  initialData?: Partial<ScheduleFormData>;
  agentTypes?: string[];
  onSubmit?: (data: ScheduleFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
  editMode?: boolean;
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
