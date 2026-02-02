<script lang="ts">
	import { UserList } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock data (cast to any for documentation purposes)
	const mockUsers = [
		{
			user: { id: 'user_1', email: 'jane.smith@example.com', status: 'active' },
			profile: { name: 'Jane Smith' },
			role: 'Admin'
		},
		{
			user: { id: 'user_2', email: 'john.doe@example.com', status: 'pending' },
			profile: { name: 'John Doe' },
			role: 'Member'
		},
		{
			user: { id: 'user_3', email: 'alice.j@example.com', status: 'active' },
			profile: { name: 'Alice Johnson' },
			role: 'Member'
		}
	] as any;

	let selectedId = $state<string | null>(null);
	let selectedUser = $state<string>('');
	let isLoading = $state(false);

	function handleSelect(user: { id: string; email: string }) {
		selectedId = user.id;
		selectedUser = user.email;
	}

	function simulateLoading() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 2000);
	}

	const listProps = [
		{
			name: 'users',
			type: 'UserWithProfile[]',
			description: 'Array of user objects with their profiles and optional roles',
			required: true
		},
		{
			name: 'selectedId',
			type: 'string | null',
			default: 'null',
			description: 'ID of the currently selected user'
		},
		{
			name: 'onselect',
			type: '(user: User) => void',
			description: 'Callback when a user card is clicked'
		},
		{
			name: 'emptyMessage',
			type: 'string',
			default: "'No users found'",
			description: 'Message shown when the list is empty'
		},
		{
			name: 'empty',
			type: 'Snippet',
			description: 'Custom snippet to render when the list is empty'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Shows loading spinner instead of user list'
		}
	];
</script>

<svelte:head>
	<title>UserList | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/users">Users</a>
		<span>/</span>
		<span>UserList</span>
	</nav>

	<h1>UserList</h1>
	<p class="lead">
		A list component that displays multiple users using UserCard components. Supports selection,
		loading states, and custom empty states.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { UserList } from '@happyvertical/smrt-svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Display a list of users with their roles and status badges.</p>

	<ComponentExample code={`<UserList users={users} />`}>
		<div class="list-container">
			<UserList users={mockUsers} />
		</div>
	</ComponentExample>

	<h2>With Selection</h2>
	<p>Enable selection by providing <code>onselect</code> and <code>selectedId</code> props.</p>

	<ComponentExample
		code={`<script lang="ts">
  let selectedId = $state<string | null>(null);
</script>

<UserList
  users={users}
  selectedId={selectedId}
  onselect={(user) => selectedId = user.id}
/>`}
	>
		<div class="list-container">
			<UserList users={mockUsers} {selectedId} onselect={handleSelect} />
			<p class="selection-info">
				Selected: {selectedUser || 'None'}
			</p>
		</div>
	</ComponentExample>

	<h2>Loading State</h2>
	<p>Show a loading spinner while fetching users.</p>

	<ComponentExample code={`<UserList users={users} loading={true} />`}>
		<div class="list-container">
			<UserList users={mockUsers} loading={isLoading} />
			<button class="simulate-btn" onclick={simulateLoading} disabled={isLoading}>
				{isLoading ? 'Loading...' : 'Simulate Loading'}
			</button>
		</div>
	</ComponentExample>

	<h2>Empty State</h2>
	<p>Show a message when the list has no users.</p>

	<ComponentExample code={`<UserList users={[]} emptyMessage="No team members found" />`}>
		<div class="list-container">
			<UserList users={[]} emptyMessage="No team members found" />
		</div>
	</ComponentExample>

	<h2>Custom Empty State</h2>
	<p>Use a snippet for a custom empty state with action buttons.</p>

	<ComponentExample
		code={`<UserList users={[]}>
  {#snippet empty()}
    <div class="custom-empty">
      <p>No users yet</p>
      <button>Invite Users</button>
    </div>
  {/snippet}
</UserList>`}
	>
		<div class="list-container">
			<UserList users={[]}>
				{#snippet empty()}
					<div class="custom-empty">
						<svg
							width="48"
							height="48"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
						>
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M19 8v6M22 11h-6" />
						</svg>
						<p>No users in this team yet</p>
						<button class="invite-btn">Invite Members</button>
					</div>
				{/snippet}
			</UserList>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={listProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { User } from '@happyvertical/smrt-users';
import type { Profile } from '@happyvertical/smrt-profiles';
import type { Snippet } from 'svelte';

interface UserWithProfile {
  user: User;
  profile: Profile;
  role?: string;
}

interface Props {
  users: UserWithProfile[];
  selectedId?: string | null;
  onselect?: (user: User) => void;
  emptyMessage?: string;
  empty?: Snippet;
  loading?: boolean;
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

	.list-container {
		width: 100%;
		max-width: 450px;
	}

	.selection-info {
		margin-top: 16px;
		font-size: 0.875rem;
		color: #666;
		padding: 8px 12px;
		background: #f9fafb;
		border-radius: 4px;
	}

	.simulate-btn {
		margin-top: 16px;
		padding: 8px 16px;
		background: #f3f4f6;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.simulate-btn:hover:not(:disabled) {
		background: #e5e7eb;
	}

	.simulate-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.custom-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 32px;
		background: #f9fafb;
		border: 1px dashed #d1d5db;
		border-radius: 8px;
		color: #6b7280;
	}

	.custom-empty svg {
		opacity: 0.5;
	}

	.custom-empty p {
		margin: 0;
		font-size: 0.9rem;
	}

	.invite-btn {
		padding: 8px 16px;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.875rem;
		cursor: pointer;
	}

	.invite-btn:hover {
		background: #2563eb;
	}
</style>
