<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'registry',
			type: 'AgentUIComponentRegistry',
			required: true,
			description: 'Registry for looking up panel components'
		},
		{
			name: 'agents',
			type: 'AgentData[]',
			required: true,
			description: 'List of agents with their UI slot definitions'
		},
		{
			name: 'configs',
			type: 'Record<string, Record<string, unknown>>',
			required: true,
			description: 'Config data for each agent and slot (agentId -> slotId -> config)'
		},
		{
			name: 'onSave',
			type: '(agentId: string, slotId: string, config: unknown) => Promise<void>',
			default: 'undefined',
			description: 'Callback when a configuration is saved'
		},
		{
			name: 'readonly',
			type: 'boolean',
			default: 'false',
			description: 'Make all panels read-only'
		},
		{
			name: 'fileConfigs',
			type: 'Record<string, Record<string, unknown>>',
			default: '{}',
			description: 'File-based configuration defaults per agent/slot'
		},
		{
			name: 'dbConfigs',
			type: 'Record<string, Record<string, unknown>>',
			default: '{}',
			description: 'Database-persisted configuration overrides per agent/slot'
		}
	];
</script>

<svelte:head>
	<title>AgentSettingsShell | s-m-r-t Admin</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/admin">Admin</a>
		<span>/</span>
		<span>AgentSettingsShell</span>
	</nav>

	<h1>AgentSettingsShell</h1>
	<p class="lead">
		A complete settings page layout for managing multiple agents. Includes a sidebar
		for agent selection (when multiple agents exist) and tabbed panels for configuration slots.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { AgentSettingsShell } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display settings for multiple agents with automatic sidebar.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AgentSettingsShell } from '@happyvertical/smrt-svelte';
  import { agentUIRegistry } from './registry';

  // Serialized agent data from server
  const agents = [
    {
      id: 'praeco-1',
      agentClass: 'Praeco',
      name: 'Main Reporter',
      slots: {
        sources: { label: 'Sources', icon: '📰', order: 1 },
        prompts: { label: 'Prompts', icon: '💬', order: 2 },
        schedule: { label: 'Schedule', icon: '📅', order: 3 }
      }
    }
  ];

  const configs = {
    'praeco-1': {
      sources: { feeds: [], calendars: [] },
      prompts: { system: '', user: '' },
      schedule: { cron: '0 6 * * *' }
    }
  };

  async function handleSave(agentId: string, slotId: string, config: unknown) {
    await api.saveConfig(agentId, slotId, config);
  }
</script>

<AgentSettingsShell
  registry={agentUIRegistry}
  {agents}
  {configs}
  onSave={handleSave}
/>`}
		language="svelte"
	/>

	<h2>Single Agent Mode</h2>
	<p>When only one agent exists, the sidebar is hidden automatically.</p>

	<CodeBlock
		code={`<AgentSettingsShell
  registry={agentUIRegistry}
  agents={[singleAgent]}
  {configs}
  onSave={handleSave}
/>`}
		language="svelte"
	/>

	<h2>Read-Only Mode</h2>
	<p>Display configurations without allowing edits.</p>

	<CodeBlock
		code={`<AgentSettingsShell
  registry={agentUIRegistry}
  {agents}
  {configs}
  readonly
/>`}
		language="svelte"
	/>

	<h2>With File and DB Configs</h2>
	<p>Support layered configuration with file defaults and database overrides.</p>

	<CodeBlock
		code={`<AgentSettingsShell
  registry={agentUIRegistry}
  {agents}
  configs={mergedConfigs}
  fileConfigs={fileBasedConfigs}
  dbConfigs={databaseConfigs}
  onSave={handleSave}
/>`}
		language="svelte"
	/>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { AgentSettingsShell } from '@happyvertical/smrt-svelte';
import type {
  AgentUIComponentRegistry,
  AgentUISlots,
  AgentUISlot
} from '@happyvertical/smrt-svelte';

// Serialized agent data (can't pass instances to client)
interface AgentData {
  id: string;
  name?: string;
  agentClass: string;  // e.g., 'Praeco'
  slots: AgentUISlots;
}

interface AgentUISlot {
  label: string;
  description?: string;
  icon?: string;
  order?: number;
}

// AgentUISlots is Record<string, AgentUISlot>`}
		language="typescript"
	/>

	<h2>Layout</h2>
	<ul>
		<li><strong>Sidebar</strong> - Agent list (hidden when single agent)</li>
		<li><strong>Header</strong> - Agent class name and optional name</li>
		<li><strong>Tabs</strong> - Configuration slot tabs</li>
		<li><strong>Panel</strong> - Dynamic panel content from registry</li>
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
