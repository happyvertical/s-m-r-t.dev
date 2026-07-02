<script lang="ts">
	import { EmptyState } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const emptyStateProps = [
		{
			name: 'title',
			type: 'string',
			description: 'Main title text',
			required: true
		},
		{
			name: 'description',
			type: 'string',
			description: 'Optional description text'
		},
		{
			name: 'icon',
			type: "'document' | 'folder' | 'users' | 'search' | 'inbox' | Snippet",
			default: "'inbox'",
			description: 'Icon to display'
		},
		{
			name: 'actionLabel',
			type: 'string',
			description: 'Label for the action button'
		},
		{
			name: 'actionHref',
			type: 'string',
			description: 'URL for the action button (renders as link)'
		},
		{
			name: 'onaction',
			type: '() => void',
			description: 'Click handler for the action button'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Size variant'
		}
	];
</script>

<svelte:head>
	<title>EmptyState | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/layout">Layout</a>
		<span>/</span>
		<span>EmptyState</span>
	</nav>

	<h1>EmptyState</h1>
	<p class="lead">
		Placeholder for empty lists or content areas. Provides consistent empty state display with icon,
		description, and optional call-to-action button.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { EmptyState } from '@happyvertical/smrt-ui';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Simple empty state with title and description.</p>

	<ComponentExample
		code={`<EmptyState
  title="No items yet"
  description="Get started by creating your first item."
/>`}
	>
		<EmptyState title="No items yet" description="Get started by creating your first item." />
	</ComponentExample>

	<h2>With Action Button</h2>
	<p>Add a call-to-action button using <code>actionLabel</code> and <code>actionHref</code>.</p>

	<ComponentExample
		code={`<EmptyState
  title="No documents"
  description="Upload your first document to get started."
  icon="document"
  actionLabel="Upload Document"
  actionHref="/upload"
/>`}
	>
		<EmptyState
			title="No documents"
			description="Upload your first document to get started."
			icon="document"
			actionLabel="Upload Document"
			actionHref="/upload"
		/>
	</ComponentExample>

	<h2>Icon Variants</h2>
	<p>Built-in icons for common empty states.</p>

	<ComponentExample
		code={`<EmptyState title="No documents" icon="document" />
<EmptyState title="No folders" icon="folder" />
<EmptyState title="No users" icon="users" />
<EmptyState title="No results" icon="search" />
<EmptyState title="Empty inbox" icon="inbox" />`}
	>
		<div class="icon-grid">
			<EmptyState title="No documents" icon="document" size="sm" />
			<EmptyState title="No folders" icon="folder" size="sm" />
			<EmptyState title="No users" icon="users" size="sm" />
			<EmptyState title="No results" icon="search" size="sm" />
			<EmptyState title="Empty inbox" icon="inbox" size="sm" />
		</div>
	</ComponentExample>

	<h2>Size Variants</h2>
	<p>Three sizes for different contexts.</p>

	<ComponentExample
		code={`<EmptyState title="Small" size="sm" />
<EmptyState title="Medium" size="md" />
<EmptyState title="Large" size="lg" />`}
	>
		<div style="display: flex; flex-direction: column; gap: 24px;">
			<div style="background: #fafafa;">
				<EmptyState title="Small empty state" description="Compact size for cards" size="sm" />
			</div>
			<div style="background: #fafafa;">
				<EmptyState title="Medium empty state" description="Default size" size="md" />
			</div>
		</div>
	</ComponentExample>

	<h2>With Click Handler</h2>
	<p>Use <code>onaction</code> for button click handling instead of navigation.</p>

	<ComponentExample
		code={`<EmptyState
  title="No projects"
  description="Create a new project to get started."
  icon="folder"
  actionLabel="Create Project"
  onaction={() => openModal()}
/>`}
	>
		<EmptyState
			title="No projects"
			description="Create a new project to get started."
			icon="folder"
			actionLabel="Create Project"
			onaction={() => alert('Create project clicked!')}
		/>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={emptyStateProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { EmptyState } from '@happyvertical/smrt-ui';

type IconType = 'document' | 'folder' | 'users' | 'search' | 'inbox';

interface Props {
  title: string;
  description?: string;
  icon?: IconType | Snippet;
  actionLabel?: string;
  actionHref?: string;
  onaction?: () => void;
  size?: 'sm' | 'md' | 'lg';
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
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 16px;
		background: #fafafa;
		padding: 16px;
	}
</style>
