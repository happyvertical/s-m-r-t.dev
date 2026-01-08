<script lang="ts">
	import { EmptyState } from '@happyvertical/smrt-svelte';
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
			description: 'Icon name or custom snippet'
		},
		{
			name: 'actionLabel',
			type: 'string',
			description: 'Label for optional action button'
		},
		{
			name: 'actionHref',
			type: 'string',
			description: 'URL for action button (renders as link)'
		},
		{
			name: 'onaction',
			type: '() => void',
			description: 'Click handler for action button'
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg'",
			default: "'md'",
			description: 'Size variant affecting padding and icon size'
		}
	];

	function handleAction() {
		alert('Action clicked!');
	}
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
		A placeholder component for empty lists or content areas. Provides a consistent display with
		icon, description, and optional call-to-action button. Built with Material 3 design.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { EmptyState } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Display a simple empty state with title and description.</p>

	<ComponentExample
		code={`<EmptyState
  title="No items yet"
  description="Get started by creating your first item."
/>`}
	>
		<EmptyState title="No items yet" description="Get started by creating your first item." />
	</ComponentExample>

	<h2>With Action Button</h2>
	<p>Add a call-to-action with <code>actionLabel</code> and either <code>actionHref</code> or <code>onaction</code>.</p>

	<ComponentExample
		code={`<EmptyState
  title="No documents found"
  description="Start by uploading your first document."
  icon="document"
  actionLabel="Upload Document"
  actionHref="/upload"
/>

<EmptyState
  title="No results"
  description="Try adjusting your search criteria."
  icon="search"
  actionLabel="Clear Filters"
  onaction={() => alert('Action clicked!')}
/>`}
	>
		<div class="empty-demos">
			<EmptyState
				title="No documents found"
				description="Start by uploading your first document."
				icon="document"
				actionLabel="Upload Document"
				actionHref="/upload"
			/>
			<EmptyState
				title="No results"
				description="Try adjusting your search criteria."
				icon="search"
				actionLabel="Clear Filters"
				onaction={handleAction}
			/>
		</div>
	</ComponentExample>

	<h2>Icons</h2>
	<p>
		Choose from built-in icons: <code>document</code>, <code>folder</code>, <code>users</code>,
		<code>search</code>, or <code>inbox</code> (default).
	</p>

	<ComponentExample
		code={`<EmptyState title="No documents" icon="document" />
<EmptyState title="Empty folder" icon="folder" />
<EmptyState title="No users" icon="users" />
<EmptyState title="No results" icon="search" />
<EmptyState title="Inbox empty" icon="inbox" />`}
	>
		<div class="icon-demos">
			<EmptyState title="No documents" icon="document" size="sm" />
			<EmptyState title="Empty folder" icon="folder" size="sm" />
			<EmptyState title="No users" icon="users" size="sm" />
			<EmptyState title="No results" icon="search" size="sm" />
			<EmptyState title="Inbox empty" icon="inbox" size="sm" />
		</div>
	</ComponentExample>

	<h2>Sizes</h2>
	<p>
		Three sizes are available: <code>sm</code>, <code>md</code> (default), and <code>lg</code>.
	</p>

	<ComponentExample
		code={`<EmptyState title="Small" description="Compact layout" size="sm" />
<EmptyState title="Medium" description="Default layout" size="md" />
<EmptyState title="Large" description="Expanded layout" size="lg" />`}
	>
		<div class="size-demos">
			<div class="size-demo">
				<p class="demo-label">size="sm"</p>
				<EmptyState title="Small" description="Compact layout" size="sm" />
			</div>
			<div class="size-demo">
				<p class="demo-label">size="md"</p>
				<EmptyState title="Medium" description="Default layout" size="md" />
			</div>
			<div class="size-demo">
				<p class="demo-label">size="lg"</p>
				<EmptyState title="Large" description="Expanded layout" size="lg" />
			</div>
		</div>
	</ComponentExample>

	<h2>Custom Icon</h2>
	<p>Pass a Snippet for a completely custom icon.</p>

	<ComponentExample
		code={`<EmptyState title="Custom Icon">
  {#snippet icon()}
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  {/snippet}
</EmptyState>`}
	>
		<EmptyState title="Custom Icon" description="Using a custom SVG snippet" size="sm">
			{#snippet icon()}
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
					<path d="M12 2L2 7l10 5 10-5-10-5z" />
					<path d="M2 17l10 5 10-5" />
					<path d="M2 12l10 5 10-5" />
				</svg>
			{/snippet}
		</EmptyState>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={emptyStateProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`// Built-in icon names
type EmptyStateIcon = 'document' | 'folder' | 'users' | 'search' | 'inbox';

// Size variants
type EmptyStateSize = 'sm' | 'md' | 'lg';`}
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

	.empty-demos {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 24px;
	}

	.icon-demos {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 16px;
	}

	.size-demos {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.size-demo {
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		overflow: hidden;
	}

	.demo-label {
		font-size: 0.85rem;
		font-weight: 500;
		color: #666;
		padding: 8px 16px;
		background: #f5f5f5;
		margin: 0 !important;
		border-bottom: 1px solid #e5e5e5;
	}
</style>
