<script lang="ts">
	import { PageHeader, Button } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const pageHeaderProps = [
		{
			name: 'title',
			type: 'string',
			description: 'Page title',
			required: true
		},
		{
			name: 'subtitle',
			type: 'string',
			description: 'Optional subtitle/description'
		},
		{
			name: 'backHref',
			type: 'string',
			description: 'URL for back navigation'
		},
		{
			name: 'backLabel',
			type: 'string',
			default: "'Back'",
			description: 'Label for back link'
		},
		{
			name: 'actions',
			type: 'Snippet',
			description: 'Slot for action buttons'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Additional content below title'
		}
	];
</script>

<svelte:head>
	<title>PageHeader | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/layout">Layout</a>
		<span>/</span>
		<span>PageHeader</span>
	</nav>

	<h1>PageHeader</h1>
	<p class="lead">
		Standard page header with title, optional back navigation, subtitle, and action buttons slot.
		Provides consistent page header layout.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { PageHeader } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Simple page header with just a title.</p>

	<ComponentExample code={`<PageHeader title="Dashboard" />`}>
		<PageHeader title="Dashboard" />
	</ComponentExample>

	<h2>With Subtitle</h2>
	<p>Add a subtitle for additional context.</p>

	<ComponentExample
		code={`<PageHeader
  title="User Settings"
  subtitle="Manage your account preferences and security settings"
/>`}
	>
		<PageHeader
			title="User Settings"
			subtitle="Manage your account preferences and security settings"
		/>
	</ComponentExample>

	<h2>With Back Navigation</h2>
	<p>Add a back link for navigation hierarchy.</p>

	<ComponentExample
		code={`<PageHeader
  title="Edit Profile"
  backHref="/settings"
  backLabel="Settings"
/>`}
	>
		<PageHeader title="Edit Profile" backHref="/settings" backLabel="Settings" />
	</ComponentExample>

	<h2>With Action Buttons</h2>
	<p>Add action buttons using the actions slot.</p>

	<ComponentExample
		code={`<PageHeader title="Projects">
  {#snippet actions()}
    <Button variant="secondary" size="sm">Export</Button>
    <Button size="sm">New Project</Button>
  {/snippet}
</PageHeader>`}
	>
		<PageHeader title="Projects">
			{#snippet actions()}
				<Button variant="secondary" size="sm">Export</Button>
				<Button size="sm">New Project</Button>
			{/snippet}
		</PageHeader>
	</ComponentExample>

	<h2>Full Example</h2>
	<p>Combining all features.</p>

	<ComponentExample
		code={`<PageHeader
  title="Invoice #INV-2025-001"
  subtitle="Created on January 15, 2025"
  backHref="/invoices"
  backLabel="All Invoices"
>
  {#snippet actions()}
    <Button variant="ghost" size="sm">Download PDF</Button>
    <Button variant="secondary" size="sm">Edit</Button>
    <Button size="sm">Send</Button>
  {/snippet}
</PageHeader>`}
	>
		<PageHeader
			title="Invoice #INV-2025-001"
			subtitle="Created on January 15, 2025"
			backHref="/invoices"
			backLabel="All Invoices"
		>
			{#snippet actions()}
				<Button variant="ghost" size="sm">Download PDF</Button>
				<Button variant="secondary" size="sm">Edit</Button>
				<Button size="sm">Send</Button>
			{/snippet}
		</PageHeader>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={pageHeaderProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { PageHeader } from '@happyvertical/smrt-svelte';

interface Props {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: Snippet;
  children?: Snippet;
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
</style>
