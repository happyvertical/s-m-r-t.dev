<script lang="ts">
	import { Icon } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const iconProps = [
		{
			name: 'name',
			type: 'string',
			description: 'Preset icon name (menu, search, close, etc.)'
		},
		{
			name: 'path',
			type: 'string',
			description: 'Custom SVG path data (overrides name)'
		},
		{
			name: 'size',
			type: 'string | number',
			default: '24',
			description: 'Icon size in pixels or CSS value'
		},
		{
			name: 'color',
			type: 'string',
			default: "'currentColor'",
			description: 'Icon color'
		},
		{
			name: 'viewBox',
			type: 'string',
			default: "'0 0 24 24'",
			description: 'SVG viewBox attribute'
		}
	];

	const presetIcons = [
		'menu',
		'search',
		'close',
		'chevron-right',
		'chevron-left',
		'chevron-down',
		'check',
		'add'
	];
</script>

<svelte:head>
	<title>Icon | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/display">Display</a>
		<span>/</span>
		<span>Icon</span>
	</nav>

	<h1>Icon</h1>
	<p class="lead">
		Icon component with preset Material Design icons and support for custom SVG paths. Uses
		currentColor for easy theming.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Icon } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Preset Icons</h2>
	<p>Built-in Material Design icons.</p>

	<ComponentExample
		code={`<Icon name="menu" />
<Icon name="search" />
<Icon name="close" />
<Icon name="check" />
<Icon name="add" />`}
	>
		<div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
			{#each presetIcons as icon}
				<div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
					<Icon name={icon} />
					<span style="font-size: 0.75rem; color: #666;">{icon}</span>
				</div>
			{/each}
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Specify size as a number (pixels) or string.</p>

	<ComponentExample
		code={`<Icon name="search" size={16} />
<Icon name="search" size={24} />
<Icon name="search" size={32} />
<Icon name="search" size="48px" />`}
	>
		<div style="display: flex; gap: 16px; align-items: center;">
			<Icon name="search" size={16} />
			<Icon name="search" size={24} />
			<Icon name="search" size={32} />
			<Icon name="search" size="48" />
		</div>
	</ComponentExample>

	<h2>Colors</h2>
	<p>Icons inherit color by default, or specify explicitly.</p>

	<ComponentExample
		code={`<Icon name="check" color="#22c55e" />
<Icon name="close" color="#ef4444" />
<Icon name="add" color="#3b82f6" />`}
	>
		<div style="display: flex; gap: 16px; align-items: center;">
			<Icon name="check" color="#22c55e" />
			<Icon name="close" color="#ef4444" />
			<Icon name="add" color="#3b82f6" />
		</div>
	</ComponentExample>

	<h2>Custom Path</h2>
	<p>Use any SVG path data for custom icons.</p>

	<ComponentExample
		code={`<Icon path="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />`}
	>
		<Icon path="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
	</ComponentExample>

	<h2>In Context</h2>
	<p>Icons work well with buttons and text.</p>

	<ComponentExample
		code={`<button>
  <Icon name="add" size={18} />
  Add Item
</button>`}
	>
		<div style="display: flex; gap: 12px;">
			<button
				style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: #1a1a1a; color: white; border: none; border-radius: 4px; cursor: pointer;"
			>
				<Icon name="add" size={18} />
				Add Item
			</button>
			<button
				style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: white; color: #1a1a1a; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;"
			>
				<Icon name="search" size={18} />
				Search
			</button>
		</div>
	</ComponentExample>

	<h2>Available Presets</h2>
	<div class="icon-grid">
		{#each presetIcons as icon}
			<div class="icon-item">
				<Icon name={icon} />
				<code>{icon}</code>
			</div>
		{/each}
	</div>

	<h2>Props</h2>
	<PropsTable props={iconProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { Icon } from '@happyvertical/smrt-svelte';

interface Props {
  name?: string;
  path?: string;
  size?: string | number;
  color?: string;
  viewBox?: string;
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

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 16px;
		margin-top: 16px;
	}

	.icon-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 16px;
		background: #fafafa;
		border-radius: 8px;
	}

	.icon-item code {
		font-size: 0.75rem;
	}
</style>
