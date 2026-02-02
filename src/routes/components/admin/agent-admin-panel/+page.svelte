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
			name: 'slotId',
			type: 'string',
			required: true,
			description: 'The slot ID to render'
		},
		{
			name: 'slot',
			type: 'AgentUISlot',
			required: true,
			description: 'The slot definition'
		},
		{
			name: 'config',
			type: 'unknown',
			required: true,
			description: 'Current configuration for this slot'
		},
		{
			name: 'onSave',
			type: '(config: unknown) => Promise<void>',
			default: 'undefined',
			description: 'Callback when config is saved'
		},
		{
			name: 'readonly',
			type: 'boolean',
			default: 'false',
			description: 'Make the panel read-only'
		},
		{
			name: 'fileConfig',
			type: 'unknown',
			default: 'undefined',
			description: 'File-based config defaults'
		},
		{
			name: 'dbConfig',
			type: 'unknown',
			default: 'undefined',
			description: 'Database config overrides'
		}
	];
</script>

<svelte:head>
	<title>AgentAdminPanel | s-m-r-t Admin</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/admin">Admin</a>
		<span>/</span>
		<span>AgentAdminPanel</span>
	</nav>

	<h1>AgentAdminPanel</h1>
	<p class="lead">
		A dynamic component renderer that looks up and displays the appropriate admin panel from the
		component registry based on agent class and slot ID.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { AgentAdminPanel } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Render a single configuration panel.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { AgentAdminPanel } from '@happyvertical/smrt-svelte';
  import { agentUIRegistry } from './registry';

  const slot = { label: 'Sources', icon: '📰' };
  let config = { feeds: [], calendars: [] };

  async function handleSave(newConfig: unknown) {
    config = newConfig;
    await api.saveConfig('praeco-1', 'sources', newConfig);
  }
</script>

<AgentAdminPanel
  registry={agentUIRegistry}
  agentClass="Praeco"
  slotId="sources"
  {slot}
  {config}
  onSave={handleSave}
/>`}
		language="svelte"
	/>

	<h2>Missing Panel Handling</h2>
	<p>When no panel is registered, a helpful fallback is displayed.</p>

	<CodeBlock
		code={`// If registry.get('Praeco', 'sources') returns undefined,
// the component shows:
//
// ⚙️
// No admin panel registered for Praeco.sources
// Import the agent's admin package to register its panels.`}
		language="text"
	/>

	<h2>Registry Pattern</h2>
	<p>Components are registered in the agent's admin package.</p>

	<CodeBlock
		code={`// praeco-admin/src/registry.ts
import { AgentUIRegistry } from '@happyvertical/smrt-agents/ui';
import SourcesPanel from './panels/SourcesPanel.svelte';
import PromptsPanel from './panels/PromptsPanel.svelte';

export const praecoRegistry = new AgentUIRegistry();

praecoRegistry.register('Praeco', 'sources', SourcesPanel);
praecoRegistry.register('Praeco', 'prompts', PromptsPanel);

// In your app, merge registries
import { praecoRegistry } from '@happyvertical/praeco-admin';
import { baseRegistry } from './registry';

export const agentUIRegistry = baseRegistry.merge(praecoRegistry);`}
		language="typescript"
	/>

	<h2>Panel Component Props</h2>
	<p>Registered panel components receive these standard props.</p>

	<CodeBlock
		code={`// AdminPanelBaseProps - all panels receive these
interface AdminPanelBaseProps {
  config: unknown;
  onSave?: (config: unknown) => Promise<void>;
  readonly?: boolean;
  fileConfig?: unknown;
  dbConfig?: unknown;
}`}
		language="typescript"
	/>

	<h2>Props</h2>
	<PropsTable {props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { AgentAdminPanel } from '@happyvertical/smrt-svelte';
import type {
  AgentUIComponentRegistry,
  AgentUISlot,
  AdminPanelBaseProps
} from '@happyvertical/smrt-svelte';

// Re-exported from @happyvertical/smrt-agents/ui
interface AgentUISlot {
  label: string;
  description?: string;
  icon?: string;
  order?: number;
}

// Your panel components should implement AdminPanelBaseProps`}
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
