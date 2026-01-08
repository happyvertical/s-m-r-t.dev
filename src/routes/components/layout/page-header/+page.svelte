<script lang="ts">
	import { PageHeader } from '@happyvertical/smrt-svelte';
	import { Button } from '@happyvertical/svelte';
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
			description: 'Optional subtitle or description'
		},
		{
			name: 'backHref',
			type: 'string',
			description: 'URL for back navigation link'
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
			description: 'Slot for action buttons on the right'
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Slot for additional content below the title'
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
		A standard page header component with optional back navigation and action buttons. Provides
		consistent page header layout built with Material 3 design.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { PageHeader } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display a simple page header with title.</p>

	<ComponentExample
		code={`<PageHeader title="Dashboard" />`}
	>
		<div class="header-demo">
			<PageHeader title="Dashboard" />
		</div>
	</ComponentExample>

	<h2>With Subtitle</h2>
	<p>Add context with a subtitle.</p>

	<ComponentExample
		code={`<PageHeader
  title="User Settings"
  subtitle="Manage your account preferences and security settings"
/>`}
	>
		<div class="header-demo">
			<PageHeader
				title="User Settings"
				subtitle="Manage your account preferences and security settings"
			/>
		</div>
	</ComponentExample>

	<h2>With Back Navigation</h2>
	<p>
		Add a back link with the <code>backHref</code> prop. Customize the label with <code>backLabel</code>.
	</p>

	<ComponentExample
		code={`<PageHeader
  title="Edit Profile"
  subtitle="Update your personal information"
  backHref="/settings"
  backLabel="Settings"
/>`}
	>
		<div class="header-demo">
			<PageHeader
				title="Edit Profile"
				subtitle="Update your personal information"
				backHref="/settings"
				backLabel="Settings"
			/>
		</div>
	</ComponentExample>

	<h2>With Actions</h2>
	<p>Add action buttons using the <code>actions</code> slot.</p>

	<ComponentExample
		code={`<PageHeader title="Team Members" subtitle="Manage your team">
  {#snippet actions()}
    <Button variant="secondary" size="sm">Export</Button>
    <Button variant="primary" size="sm">Add Member</Button>
  {/snippet}
</PageHeader>`}
	>
		<div class="header-demo">
			<PageHeader title="Team Members" subtitle="Manage your team">
				{#snippet actions()}
					<Button variant="secondary" size="sm">Export</Button>
					<Button variant="primary" size="sm">Add Member</Button>
				{/snippet}
			</PageHeader>
		</div>
	</ComponentExample>

	<h2>Complete Example</h2>
	<p>Combining back navigation, subtitle, and actions.</p>

	<ComponentExample
		code={`<PageHeader
  title="Project Details"
  subtitle="View and edit project information"
  backHref="/projects"
  backLabel="All Projects"
>
  {#snippet actions()}
    <Button variant="ghost" size="sm">Archive</Button>
    <Button variant="primary" size="sm">Save Changes</Button>
  {/snippet}
</PageHeader>`}
	>
		<div class="header-demo">
			<PageHeader
				title="Project Details"
				subtitle="View and edit project information"
				backHref="/projects"
				backLabel="All Projects"
			>
				{#snippet actions()}
					<Button variant="ghost" size="sm">Archive</Button>
					<Button variant="primary" size="sm">Save Changes</Button>
				{/snippet}
			</PageHeader>
		</div>
	</ComponentExample>

	<h2>With Extra Content</h2>
	<p>
		Use the default slot (<code>children</code>) to add content below the header.
	</p>

	<ComponentExample
		code={`<PageHeader title="Analytics" subtitle="Track your performance">
  {#snippet actions()}
    <Button variant="secondary" size="sm">Export Report</Button>
  {/snippet}

  <div class="tabs">
    <a href="/analytics/overview">Overview</a>
    <a href="/analytics/traffic">Traffic</a>
    <a href="/analytics/conversions">Conversions</a>
  </div>
</PageHeader>`}
	>
		<div class="header-demo">
			<PageHeader title="Analytics" subtitle="Track your performance">
				{#snippet actions()}
					<Button variant="secondary" size="sm">Export Report</Button>
				{/snippet}

				<div class="example-tabs">
					<a href="/analytics/overview" class="tab active">Overview</a>
					<a href="/analytics/traffic" class="tab">Traffic</a>
					<a href="/analytics/conversions" class="tab">Conversions</a>
				</div>
			</PageHeader>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={pageHeaderProps} />
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

	.header-demo {
		background: #fafafa;
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		padding: 16px;
	}

	.header-demo :global(.page-header) {
		margin-bottom: 0;
	}

	.example-tabs {
		display: flex;
		gap: 24px;
		border-bottom: 1px solid #e5e5e5;
		padding-bottom: 8px;
	}

	.tab {
		color: #666;
		text-decoration: none;
		font-size: 0.9rem;
		padding-bottom: 8px;
		border-bottom: 2px solid transparent;
		margin-bottom: -9px;
	}

	.tab:hover {
		color: #333;
	}

	.tab.active {
		color: var(--color-accent);
		border-bottom-color: var(--color-accent);
	}
</style>
