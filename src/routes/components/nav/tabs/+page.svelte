<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const props = [
		{
			name: 'tabs',
			type: 'Tab[]',
			required: true,
			description: 'Array of tab definitions'
		},
		{
			name: 'active',
			type: 'string',
			required: true,
			description: 'ID of the currently active tab'
		},
		{
			name: 'onchange',
			type: '(id: string) => void',
			default: 'undefined',
			description: 'Callback when tab changes'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Tab size variant'
		},
		{
			name: 'variant',
			type: "'primary' | 'secondary'",
			default: "'primary'",
			description: 'Visual style variant'
		},
		{
			name: 'children',
			type: 'Snippet',
			default: 'undefined',
			description: 'Content slot for tab panels'
		}
	];
</script>

<svelte:head>
	<title>Tabs | s-m-r-t Navigation</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/nav">Navigation</a>
		<span>/</span>
		<span>Tabs</span>
	</nav>

	<h1>Tabs</h1>
	<p class="lead">
		Material 3 styled tab navigation with optional counts, content slots,
		and animated active indicators.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Tabs } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Simple tab navigation with controlled active state.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { Tabs } from '@happyvertical/smrt-svelte';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'settings', label: 'Settings' }
  ];

  let active = $state('overview');
</script>

<Tabs
  tabs={tabs}
  active={active}
  onchange={(id) => active = id}
/>`}
		language="svelte"
	/>

	<h2>With Counts</h2>
	<p>Display counts next to tab labels.</p>

	<CodeBlock
		code={`const tabs = [
  { id: 'all', label: 'All', count: 42 },
  { id: 'active', label: 'Active', count: 28 },
  { id: 'pending', label: 'Pending', count: 14 }
];`}
		language="typescript"
	/>

	<h2>With Content Slot</h2>
	<p>Render tab content using the children snippet.</p>

	<CodeBlock
		code={`<Tabs tabs={tabs} {active} onchange={(id) => active = id}>
  {#if active === 'overview'}
    <p>Overview content</p>
  {:else if active === 'details'}
    <p>Details content</p>
  {:else}
    <p>Settings content</p>
  {/if}
</Tabs>`}
		language="svelte"
	/>

	<h2>Size Variants</h2>
	<p>Three sizes available: small, medium (default), and large.</p>

	<CodeBlock
		code={`<Tabs tabs={tabs} {active} size="sm" />
<Tabs tabs={tabs} {active} size="md" />
<Tabs tabs={tabs} {active} size="lg" />`}
		language="svelte"
	/>

	<h2>Variants</h2>
	<p>Primary (centered indicator) or secondary (full-width indicator).</p>

	<CodeBlock
		code={`<Tabs tabs={tabs} {active} variant="primary" />
<Tabs tabs={tabs} {active} variant="secondary" />`}
		language="svelte"
	/>

	<h2>Disabled Tabs</h2>
	<p>Mark individual tabs as disabled.</p>

	<CodeBlock
		code={`const tabs = [
  { id: 'active', label: 'Active' },
  { id: 'disabled', label: 'Disabled', disabled: true }
];`}
		language="typescript"
	/>

	<h2>Props</h2>
	<PropsTable props={props} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Tabs } from '@happyvertical/smrt-svelte';

interface Tab {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

interface Props {
  tabs: Tab[];
  active: string;
  onchange?: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  children?: Snippet;
}`}
		language="typescript"
	/>

	<h2>Accessibility</h2>
	<ul>
		<li>Uses <code>role="tablist"</code> and <code>role="tab"</code></li>
		<li>Supports <code>aria-selected</code> for active state</li>
		<li>Tab panels linked via <code>aria-controls</code></li>
		<li>Keyboard navigation supported</li>
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
