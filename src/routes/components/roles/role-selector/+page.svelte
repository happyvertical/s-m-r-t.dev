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

	const selectorProps = [
		{ name: 'roles', type: 'Role[]', description: 'Available roles', required: true },
		{ name: 'value', type: 'string', description: 'Selected role ID (bindable)', required: true },
		{ name: 'onchange', type: '(roleId: string) => void', description: 'Callback when role changes' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disable selection' }
	];
</script>

<svelte:head>
	<title>RoleSelector | SMRT Components</title>
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
	<CodeBlock code={`import { RoleSelector } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<ComponentExample code={`<script lang="ts">\n  let selectedRole = $state('');\n  const roles = [\n    { id: 'admin', name: 'Administrator', description: 'Full system access' },\n    { id: 'editor', name: 'Editor', description: 'Can edit content' },\n    { id: 'viewer', name: 'Viewer', description: 'Read-only access' }\n  ];\n</script>\n\n<RoleSelector {roles} bind:value={selectedRole} />`}>
		<RoleSelector {roles} bind:value={selectedRole} />
		<p style="margin-top: 1rem; color: #666;">Selected: {selectedRole || '(none)'}</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={selectorProps} />

	<h2>TypeScript</h2>
	<CodeBlock code={`interface Role {\n  id: string;\n  name: string;\n  description?: string;\n}\n\ninterface Props {\n  roles: Role[];\n  value: string;\n  onchange?: (roleId: string) => void;\n  disabled?: boolean;\n}`} language="typescript" />
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
