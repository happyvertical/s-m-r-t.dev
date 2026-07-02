<script lang="ts">
	import { PermissionCheck } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mockUserPermissions = ['users.edit', 'users.view', 'articles.create'];

	const checkProps = [
		{
			name: 'permission',
			type: 'string',
			description: 'Single permission to check'
		},
		{
			name: 'permissions',
			type: 'string[]',
			description: 'Multiple permissions to check'
		},
		{
			name: 'userPermissions',
			type: 'string[]',
			description: "User's current permissions array",
			required: true
		},
		{
			name: 'mode',
			type: "'all' | 'any'",
			default: "'all'",
			description: "Require 'all' or 'any' of the listed permissions"
		},
		{
			name: 'children',
			type: 'Snippet',
			description: 'Content shown when permission check passes',
			required: true
		},
		{ name: 'fallback', type: 'Snippet', description: 'Content shown when permission denied' }
	];
</script>

<svelte:head>
	<title>PermissionCheck | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>PermissionCheck</span>
	</nav>

	<h1>PermissionCheck</h1>
	<p class="lead">
		Conditionally render content based on user permissions with fallback messaging.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { PermissionCheck } from '@happyvertical/smrt-ui';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<ComponentExample
		code={`<PermissionCheck permission="users.edit" userPermissions={currentPermissions}>\n  <button>Edit User</button>\n</PermissionCheck>\n\n<PermissionCheck permission="admin.access" userPermissions={currentPermissions}>\n  {#snippet fallback()}Admin access required{/snippet}\n  <a href="/admin">Admin Panel</a>\n</PermissionCheck>`}
	>
		<div style="display: flex; flex-direction: column; gap: 12px;">
			<PermissionCheck permission="users.edit" userPermissions={mockUserPermissions}>
				<button
					style="padding: 8px 16px; border-radius: 4px; background: #0066cc; color: white; border: none;"
					>Edit User</button
				>
			</PermissionCheck>
			<PermissionCheck permission="admin.access" userPermissions={mockUserPermissions}>
				{#snippet fallback()}<span style="color: #999;">Admin access required</span>{/snippet}
				<a href="/admin" style="color: #0066cc;">Admin Panel</a>
			</PermissionCheck>
		</div>
	</ComponentExample>

	<h2>Integration with smrt-users</h2>
	<CodeBlock
		code={`import { PermissionCheck } from '@happyvertical/smrt-ui';\nimport { PermissionResolver } from '@happyvertical/smrt-users';\n\n// Check permissions programmatically\nconst resolver = await PermissionResolver.create({ db });\nconst canEdit = await resolver.hasPermission(\n  currentUser.id,\n  currentTenant.id,\n  'users.edit'\n);\n\nif (canEdit) {\n  // Perform action\n}\n\n// Or use component for UI\n<PermissionCheck permission="users.delete" userPermissions={currentPermissions}>\n  <button onclick={deleteUser}>Delete</button>\n</PermissionCheck>`}
		language="typescript"
	/>

	<h2>Props</h2>
	<PropsTable props={checkProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`interface Props {\n  permission?: string;\n  permissions?: string[];\n  userPermissions: string[];\n  mode?: 'all' | 'any';\n  children: Snippet;\n  fallback?: Snippet;\n}`}
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
