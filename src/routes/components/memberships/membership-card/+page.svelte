<script lang="ts">
	import { MembershipCard } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const mockMembership = {
		id: 'mem_1',
		user: { id: 'user_1', email: 'jane@example.com' } as any,
		profile: { name: 'Jane Smith' } as any,
		role: 'Editor',
		status: 'active',
		joinedAt: new Date('2024-01-15')
	} as any;

	const cardProps = [
		{ name: 'membership', type: 'Membership', description: 'Membership object with user, role, status', required: true },
		{ name: 'showActions', type: 'boolean', default: 'false', description: 'Show edit/remove actions' },
		{ name: 'onedit', type: '() => void', description: 'Callback for edit action' },
		{ name: 'onremove', type: '() => void', description: 'Callback for remove action' }
	];
</script>

<svelte:head>
	<title>MembershipCard | SMRT Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<span>MembershipCard</span>
	</nav>

	<h1>MembershipCard</h1>
	<p class="lead">Display tenant membership information with user details, role, and status.</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { MembershipCard } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<ComponentExample code={`<MembershipCard membership={membership} />`}>
		<MembershipCard membership={mockMembership} />
	</ComponentExample>

	<h2>With Actions</h2>
	<ComponentExample code={`<MembershipCard\n  membership={membership}\n  showActions={true}\n  onedit={() => {}}\n  onremove={() => {}}\n/>`}>
		<MembershipCard
			membership={mockMembership}
			showActions={true}
			onedit={() => alert('Edit clicked')}
			onremove={() => alert('Remove clicked')}
		/>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={cardProps} />

	<h2>TypeScript</h2>
	<CodeBlock code={`interface Membership {\n  id: string;\n  user: User;\n  profile: Profile;\n  role: string;\n  status: string;\n  joinedAt: Date;\n}\n\ninterface Props {\n  membership: Membership;\n  showActions?: boolean;\n  onedit?: () => void;\n  onremove?: () => void;\n}`} language="typescript" />
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
