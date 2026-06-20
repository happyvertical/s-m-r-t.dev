<script lang="ts">
	import { RoleSelector } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	let selectedRole = $state('');
	const roles = [
		{ id: 'admin', name: 'Administrator', description: 'Full system access' },
		{ id: 'editor', name: 'Editor', description: 'Can edit content' },
		{ id: 'viewer', name: 'Viewer', description: 'Read-only access' }
	];

	function handleRoleChange(roleId: string) {
		selectedRole = roleId;
	}

	const selectorProps = [
		{ name: 'roles', type: 'Role[]', description: 'Available roles', required: true },
		{
			name: 'onchange',
			type: '(roleId: string) => void',
			description: 'Callback when role changes',
			required: true
		},
		{ name: 'value', type: 'string | null', description: 'Selected role ID (bindable)' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable selection' },
		{ name: 'placeholder', type: 'string', description: 'Placeholder text when no role selected' },
		{
			name: 'showDescription',
			type: 'boolean',
			description: 'Show each role description in the list'
		}
	];
</script>

<svelte:head>
	<title>RoleSelector | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>RoleSelector</span>
	</nav>

	<h1>RoleSelector</h1>
	<p class="lead">Select user roles with descriptions for assignment and permission management.</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { RoleSelector } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<ComponentExample
		code={`<script lang="ts">
  let selectedRole = $state('');
  const roles = [
    { id: 'admin', name: 'Administrator', description: 'Full system access' },
    { id: 'editor', name: 'Editor', description: 'Can edit content' },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access' }
  ];
</script>

<RoleSelector
  {roles}
  bind:value={selectedRole}
  onchange={(roleId) => (selectedRole = roleId)}
/>`}
	>
		<RoleSelector {roles} bind:value={selectedRole} onchange={handleRoleChange} />
		<p style="margin-top: 1rem; color: #666;">Selected: {selectedRole || '(none)'}</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={selectorProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Role } from '@happyvertical/smrt-users';

interface Props {
  roles: Role[];
  onchange: (roleId: string) => void;
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
  showDescription?: boolean;
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
