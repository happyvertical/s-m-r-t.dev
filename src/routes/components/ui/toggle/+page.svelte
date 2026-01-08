<script lang="ts">
	import { Toggle } from '@happyvertical/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let isEnabled = $state(false);
	let notifications = $state(true);
	let darkMode = $state(false);

	const toggleProps = [
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Toggle size'
		},
		{
			name: 'checked',
			type: 'boolean',
			default: 'false',
			description: 'Whether the toggle is checked (bindable)'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables the toggle'
		},
		{
			name: 'label',
			type: 'Snippet',
			default: 'undefined',
			description: 'Label content displayed next to the toggle'
		},
		{
			name: 'description',
			type: 'Snippet',
			default: 'undefined',
			description: 'Description text displayed below the label'
		},
		{
			name: '...rest',
			type: 'HTMLInputAttributes',
			description: 'All standard HTML input attributes are supported'
		}
	];
</script>

<svelte:head>
	<title>Toggle | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/ui">UI</a>
		<span>/</span>
		<span>Toggle</span>
	</nav>

	<h1>Toggle</h1>
	<p class="lead">
		A switch component for toggling between two states. Supports labels, descriptions,
		and multiple sizes. Uses native checkbox behavior with custom styling.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { Toggle } from '@happyvertical/svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>A simple toggle without label.</p>

	<ComponentExample
		code={`<Toggle />
<Toggle checked />`}
	>
		<Toggle />
		<Toggle checked />
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.</p>

	<ComponentExample
		code={`<Toggle size="sm" />
<Toggle size="md" />
<Toggle size="lg" />`}
	>
		<Toggle size="sm" />
		<Toggle size="md" />
		<Toggle size="lg" />
	</ComponentExample>

	<h2>With Label</h2>
	<p>Add a label using a Snippet.</p>

	<ComponentExample
		code={`<Toggle>
  {#snippet label()}
    Enable feature
  {/snippet}
</Toggle>

<Toggle checked>
  {#snippet label()}
    Notifications enabled
  {/snippet}
</Toggle>`}
	>
		<Toggle>
			{#snippet label()}
				Enable feature
			{/snippet}
		</Toggle>
		<Toggle checked>
			{#snippet label()}
				Notifications enabled
			{/snippet}
		</Toggle>
	</ComponentExample>

	<h2>With Label and Description</h2>
	<p>Provide additional context with a description.</p>

	<ComponentExample
		code={`<Toggle>
  {#snippet label()}
    Push notifications
  {/snippet}
  {#snippet description()}
    Receive push notifications when someone mentions you.
  {/snippet}
</Toggle>

<Toggle checked>
  {#snippet label()}
    Email digest
  {/snippet}
  {#snippet description()}
    Get a weekly summary of activity in your inbox.
  {/snippet}
</Toggle>`}
	>
		<div class="stacked">
			<Toggle>
				{#snippet label()}
					Push notifications
				{/snippet}
				{#snippet description()}
					Receive push notifications when someone mentions you.
				{/snippet}
			</Toggle>
			<Toggle checked>
				{#snippet label()}
					Email digest
				{/snippet}
				{#snippet description()}
					Get a weekly summary of activity in your inbox.
				{/snippet}
			</Toggle>
		</div>
	</ComponentExample>

	<h2>Interactive Example</h2>
	<p>Use two-way binding with <code>bind:checked</code>:</p>

	<ComponentExample
		code={`<script lang="ts">
  let isEnabled = $state(false);
</script>

<Toggle bind:checked={isEnabled}>
  {#snippet label()}
    Feature toggle
  {/snippet}
  {#snippet description()}
    Toggle this to enable the feature.
  {/snippet}
</Toggle>

<p>Status: {isEnabled ? 'Enabled' : 'Disabled'}</p>`}
	>
		<div class="stacked">
			<Toggle bind:checked={isEnabled}>
				{#snippet label()}
					Feature toggle
				{/snippet}
				{#snippet description()}
					Toggle this to enable the feature.
				{/snippet}
			</Toggle>
			<p class="value-display">Status: {isEnabled ? 'Enabled' : 'Disabled'}</p>
		</div>
	</ComponentExample>

	<h2>Settings Panel Example</h2>
	<p>Common pattern for settings pages.</p>

	<ComponentExample
		code={`<script lang="ts">
  let notifications = $state(true);
  let darkMode = $state(false);
</script>

<div class="settings-list">
  <Toggle bind:checked={notifications}>
    {#snippet label()}
      Notifications
    {/snippet}
    {#snippet description()}
      Receive notifications about account activity.
    {/snippet}
  </Toggle>

  <Toggle bind:checked={darkMode}>
    {#snippet label()}
      Dark mode
    {/snippet}
    {#snippet description()}
      Use dark theme across the application.
    {/snippet}
  </Toggle>
</div>`}
	>
		<div class="settings-list">
			<Toggle bind:checked={notifications}>
				{#snippet label()}
					Notifications
				{/snippet}
				{#snippet description()}
					Receive notifications about account activity.
				{/snippet}
			</Toggle>
			<Toggle bind:checked={darkMode}>
				{#snippet label()}
					Dark mode
				{/snippet}
				{#snippet description()}
					Use dark theme across the application.
				{/snippet}
			</Toggle>
		</div>
	</ComponentExample>

	<h2>Disabled State</h2>

	<ComponentExample
		code={`<Toggle disabled>
  {#snippet label()}
    Disabled toggle
  {/snippet}
</Toggle>
<Toggle disabled checked>
  {#snippet label()}
    Disabled and checked
  {/snippet}
</Toggle>`}
	>
		<Toggle disabled>
			{#snippet label()}
				Disabled toggle
			{/snippet}
		</Toggle>
		<Toggle disabled checked>
			{#snippet label()}
				Disabled and checked
			{/snippet}
		</Toggle>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={toggleProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Snippet } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

type ToggleSize = 'sm' | 'md' | 'lg';

interface Props extends Omit<HTMLInputAttributes, 'class' | 'type' | 'size'> {
  size?: ToggleSize;
  checked?: boolean;
  label?: Snippet;
  description?: Snippet;
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

	.stacked {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
		max-width: 400px;
	}

	.settings-list {
		display: flex;
		flex-direction: column;
		gap: 24px;
		width: 100%;
		max-width: 400px;
		padding: 16px;
		background: #fafafa;
		border-radius: 8px;
	}

	.value-display {
		font-size: 0.9rem;
		color: #666;
		margin: 0;
	}
</style>
