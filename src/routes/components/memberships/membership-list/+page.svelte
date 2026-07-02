<script lang="ts">
	import { MembershipList } from '@happyvertical/smrt-ui';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mockMemberships = [
		{
			membership: { id: 'mem_1', status: 'active', created_at: new Date('2024-01-01') },
			tenant: { id: 't1', name: 'Acme Corp', slug: 'acme' },
			role: { id: 'r1', name: 'Admin', slug: 'admin' }
		},
		{
			membership: { id: 'mem_2', status: 'active', created_at: new Date('2024-02-15') },
			tenant: { id: 't1', name: 'Acme Corp', slug: 'acme' },
			role: { id: 'r2', name: 'Editor', slug: 'member' }
		},
		{
			membership: { id: 'mem_3', status: 'pending', created_at: new Date('2024-03-10') },
			tenant: { id: 't2', name: 'TechStart Inc', slug: 'techstart' },
			role: { id: 'r3', name: 'Viewer', slug: 'member' }
		}
	] as any[];

	const listProps = [
		{
			name: 'memberships',
			type: 'MembershipWithContext[]',
			description: 'Array of { membership, tenant, role } objects',
			required: true
		},
		{
			name: 'onchangerole',
			type: '(membership: Membership) => void',
			description: 'Change role callback'
		},
		{ name: 'onremove', type: '(membership: Membership) => void', description: 'Remove callback' },
		{
			name: 'emptyMessage',
			type: 'string',
			default: "'No memberships found'",
			description: 'Message when list is empty'
		},
		{
			name: 'empty',
			type: 'Snippet',
			description: 'Custom empty-state content (overrides emptyMessage)'
		},
		{ name: 'loading', type: 'boolean', default: 'false', description: 'Show loading state' }
	];
</script>

<svelte:head>
	<title>MembershipList | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>MembershipList</span>
	</nav>

	<h1>MembershipList</h1>
	<p class="lead">Display tenant memberships with filtering, sorting, and actions.</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { MembershipList } from '@happyvertical/smrt-ui';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<ComponentExample code={`<MembershipList {memberships} />`}>
		<MembershipList memberships={mockMemberships} />
	</ComponentExample>

	<h2>With Actions</h2>
	<ComponentExample
		code={`<MembershipList\n  {memberships}\n  onchangerole={handleChangeRole}\n  onremove={handleRemove}\n/>`}
	>
		<MembershipList
			memberships={mockMemberships}
			onchangerole={(m) => console.log(`Change role for ${m.id}`)}
			onremove={(m) => console.log(`Remove ${m.id}`)}
		/>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={listProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`interface MembershipWithContext {\n  membership: Membership;\n  tenant: Tenant;\n  role: Role;\n}\n\ninterface Props {\n  memberships: MembershipWithContext[];\n  onchangerole?: (membership: Membership) => void;\n  onremove?: (membership: Membership) => void;\n  emptyMessage?: string;\n  empty?: Snippet;\n  loading?: boolean;\n}`}
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
