<script lang="ts">
	import { MembershipList } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mockMemberships = [
		{ id: 'mem_1', user: { id: 'u1', email: 'alice@example.com' } as any, profile: { name: 'Alice' } as any, role: 'Admin', status: 'active', joinedAt: new Date('2024-01-01') },
		{ id: 'mem_2', user: { id: 'u2', email: 'bob@example.com' } as any, profile: { name: 'Bob' } as any, role: 'Editor', status: 'active', joinedAt: new Date('2024-02-15') },
		{ id: 'mem_3', user: { id: 'u3', email: 'charlie@example.com' } as any, profile: { name: 'Charlie' } as any, role: 'Viewer', status: 'pending', joinedAt: new Date('2024-03-10') }
	] as any[];

	const listProps = [
		{ name: 'memberships', type: 'Membership[]', description: 'Array of memberships', required: true },
		{ name: 'showActions', type: 'boolean', default: 'false', description: 'Show edit/remove actions' },
		{ name: 'onedit', type: '(membership: Membership) => void', description: 'Edit callback' },
		{ name: 'onremove', type: '(membership: Membership) => void', description: 'Remove callback' },
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
	<CodeBlock code={`import { MembershipList } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<ComponentExample code={`<MembershipList memberships={memberships} />`}>
		<MembershipList memberships={mockMemberships} />
	</ComponentExample>

	<h2>With Actions</h2>
	<ComponentExample code={`<MembershipList\n  memberships={memberships}\n  showActions={true}\n  onedit={handleEdit}\n  onremove={handleRemove}\n/>`}>
		<MembershipList
			memberships={mockMemberships}
			showActions={true}
			onedit={(m) => alert(`Edit ${m.profile.name}`)}
			onremove={(m) => alert(`Remove ${m.profile.name}`)}
		/>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={listProps} />

	<h2>TypeScript</h2>
	<CodeBlock code={`interface Props {\n  memberships: Membership[];\n  showActions?: boolean;\n  onedit?: (membership: Membership) => void;\n  onremove?: (membership: Membership) => void;\n  loading?: boolean;\n}`} language="typescript" />
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
