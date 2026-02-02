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
			name: 'agentClass',
			type: 'string',
			required: true,
			description: 'Agent class name (e.g., "Praeco")'
		},
		{
			name: 'slots',
			type: 'AgentUISlots',
			required: true,
			description: 'UI slot definitions for this agent'
		},
		{
			name: 'configs',
			type: 'Record<string, unknown>',
			required: true,
			description: 'Config data keyed by slot ID'
		},
		{
			name: 'onSave',
			type: '(slotId: string, config: unknown) => Promise<void>',
			default: 'undefined',
			description: 'Callback when a slot config is saved'
		},
		{
			name: 'readonly',
			type: 'boolean',
			default: 'false',
			description: 'Make all panels read-only'
		},
		{
			name: 'fileConfigs',
			type: 'Record<string, unknown>',
			default: '{}',
			description: 'File-based config defaults per slot'
		},
		{
			name: 'dbConfigs',
			type: 'Record<string, unknown>',
			default: '{}',
			description: 'Database config overrides per slot'
		}
	];
</script>

<svelte:head>
	<title>AgentAdminTabs | s-m-r-t Admin</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/admin">Admin</a>
		<span>/</span>
		<span>AgentAdminTabs</span>
	</nav>

	<h1>AgentAdminTabs</h1>
	<p class="lead">
		Tab navigation component for displaying agent configuration slots. Renders the appropriate admin
		panel for each tab from the component registry.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { AgentAdminTabs } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display tabbed configuration panels for an agent.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AgentAdminTabs } from '@happyvertical/smrt-svelte';
  import { agentUIRegistry } from './registry';

  const slots = {
    sources: { label: 'Sources', icon: '📰', order: 1 },
    prompts: { label: 'Prompts', icon: '💬', order: 2 },
    schedule: { label: 'Schedule', icon: '📅', order: 3 }
  };

  const configs = {
    sources: { feeds: [], calendars: [] },
    prompts: { system: '', user: '' },
    schedule: { cron: '0 6 * * *' }
  };

  async function handleSave(slotId: string, config: unknown) {
    await api.saveSlotConfig(agentId, slotId, config);
  }
</script>

<AgentAdminTabs
  registry={agentUIRegistry}
  agentClass="Praeco"
  {slots}
  {configs}
  onSave={handleSave}
/>`}
		language="svelte"
	/>

	<h2>Slot Ordering</h2>
	<p>Tabs are sorted by order property, then alphabetically by label.</p>

	<CodeBlock
		code={`const slots = {
  // Will appear third
  schedule: { label: 'Schedule', order: 3 },
  // Will appear first
  sources: { label: 'Sources', order: 1 },
  // Will appear second
  prompts: { label: 'Prompts', order: 2 }
};`}
		language="typescript"
	/>

	<h2>Slot Descriptions</h2>
	<p>Optional descriptions appear above each panel.</p>

	<CodeBlock
		code={`const slots = {
  sources: {
    label: 'Sources',
    icon: '📰',
    description: 'Configure RSS feeds and calendar sources for this agent.'
  }
};`}
		language="typescript"
	/>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { AgentAdminTabs } from '@happyvertical/smrt-svelte';
import type {
  AgentUIComponentRegistry,
  AgentUISlots,
  AgentUISlot
} from '@happyvertical/smrt-svelte';

interface AgentUISlot {
  label: string;
  description?: string;
  icon?: string;       // Emoji or icon
  order?: number;      // Sort order (lower = first)
}

// AgentUISlots is Record<string, AgentUISlot>`}
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
