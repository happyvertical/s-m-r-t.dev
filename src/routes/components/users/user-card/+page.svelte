<script lang="ts">
	import { UserCard } from '@happyvertical/smrt-users/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock data (cast to any for documentation purposes)
	const mockUser = { id: 'user_1', email: 'jane.smith@example.com', status: 'active' } as any;
	const mockProfile = { name: 'Jane Smith' } as any;

	const mockUserPending = { id: 'user_2', email: 'john.doe@example.com', status: 'pending' } as any;
	const mockProfilePending = { name: 'John Doe' } as any;

	const mockUserSuspended = {
		id: 'user_3',
		email: 'alice.j@example.com',
		status: 'suspended'
	} as any;
	const mockProfileSuspended = { name: 'Alice Johnson' } as any;

	let selectedUser = $state<string | null>(null);

	const cardProps = [
		{
			name: 'user',
			type: 'User',
			description: 'User object containing email and status',
			required: true
		},
		{
			name: 'profile',
			type: 'Profile',
			description: 'Profile object containing user name',
			required: true
		},
		{
			name: 'role',
			type: 'string',
			description: 'Optional role label to display'
		},
		{
			name: 'status',
			type: 'string',
			description: 'Status badge text (active, pending, suspended, deactivated)'
		},
		{
			name: 'onclick',
			type: '() => void',
			description: 'Click handler - makes the card interactive when provided'
		},
		{
			name: 'selected',
			type: 'boolean',
			default: 'false',
			description: 'Whether the card is in a selected state'
		}
	];
</script>

<svelte:head>
	<title>UserCard | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/users">Users</a>
		<span>/</span>
		<span>UserCard</span>
	</nav>

	<h1>UserCard</h1>
	<p class="lead">
		A compact card component for displaying user information including avatar, name, email, role,
		and status. Supports selection and click interactions with Material 3 styling.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { UserCard } from '@happyvertical/smrt-users/svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display user information in a clean, compact card format.</p>

	<ComponentExample code={`<UserCard user={user} profile={profile} />`}>
		<UserCard user={mockUser} profile={mockProfile} />
	</ComponentExample>

	<h2>With Role and Status</h2>
	<p>Add role and status badges to provide more context about the user.</p>

	<ComponentExample
		code={`<UserCard user={user} profile={profile} role="Admin" status="active" />
<UserCard user={user} profile={profile} role="Member" status="pending" />
<UserCard user={user} profile={profile} role="Guest" status="suspended" />`}
	>
		<div class="card-stack">
			<UserCard user={mockUser} profile={mockProfile} role="Admin" status="active" />
			<UserCard
				user={mockUserPending}
				profile={mockProfilePending}
				role="Member"
				status="pending"
			/>
			<UserCard
				user={mockUserSuspended}
				profile={mockProfileSuspended}
				role="Guest"
				status="suspended"
			/>
		</div>
	</ComponentExample>

	<h2>Interactive Cards</h2>
	<p>Provide an <code>onclick</code> handler to make cards clickable with hover effects.</p>

	<ComponentExample
		code={`<script lang="ts">
  let selectedUser = $state<string | null>(null);
</script>

<UserCard
  user={user}
  profile={profile}
  onclick={() => selectedUser = user.id}
  selected={selectedUser === user.id}
/>`}
	>
		<div class="card-stack">
			<UserCard
				user={mockUser}
				profile={mockProfile}
				role="Admin"
				onclick={() => (selectedUser = mockUser.id)}
				selected={selectedUser === mockUser.id}
			/>
			<UserCard
				user={mockUserPending}
				profile={mockProfilePending}
				role="Member"
				onclick={() => (selectedUser = mockUserPending.id)}
				selected={selectedUser === mockUserPending.id}
			/>
			<UserCard
				user={mockUserSuspended}
				profile={mockProfileSuspended}
				role="Guest"
				onclick={() => (selectedUser = mockUserSuspended.id)}
				selected={selectedUser === mockUserSuspended.id}
			/>
		</div>
		<p class="selection-info">Selected: {selectedUser ?? 'None'}</p>
	</ComponentExample>

	<h2>Status Variants</h2>
	<p>The status badge automatically styles based on the status value.</p>

	<ComponentExample
		code={`<UserCard user={activeUser} profile={profile} status="active" />
<UserCard user={pendingUser} profile={profile} status="pending" />
<UserCard user={suspendedUser} profile={profile} status="suspended" />
<UserCard user={deactivatedUser} profile={profile} status="deactivated" />`}
	>
		<div class="card-stack">
			<UserCard user={{ ...mockUser, status: 'active' }} profile={mockProfile} status="active" />
			<UserCard user={{ ...mockUser, status: 'pending' }} profile={mockProfile} status="pending" />
			<UserCard
				user={{ ...mockUser, status: 'suspended' }}
				profile={mockProfile}
				status="suspended"
			/>
			<UserCard
				user={{ ...mockUser, status: 'deactivated' }}
				profile={mockProfile}
				status="deactivated"
			/>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={cardProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { User } from '@happyvertical/smrt-users';
import type { Profile } from '@happyvertical/smrt-profiles';

interface Props {
  user: User;
  profile: Profile;
  role?: string;
  status?: string;
  onclick?: () => void;
  selected?: boolean;
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

	.card-stack {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		max-width: 400px;
	}

	.selection-info {
		margin-top: 16px;
		font-size: 0.875rem;
		color: #666;
	}
</style>
