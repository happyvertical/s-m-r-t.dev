<script lang="ts">
	import { InviteUserModal } from '@happyvertical/smrt-users/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock data (cast to any for documentation purposes)
	const mockTenant = { id: 'tenant_1', name: 'Acme Corporation', slug: 'acme' } as any;

	const mockRoles = [
		{ id: 'role_1', name: 'Admin', slug: 'admin', description: 'Full access to all features' },
		{ id: 'role_2', name: 'Member', slug: 'member', description: 'Standard team member access' },
		{ id: 'role_3', name: 'Viewer', slug: 'viewer', description: 'Read-only access' }
	] as any;

	let isOpen = $state(false);
	let isLoading = $state(false);
	let inviteResult = $state<string>('');

	function handleSubmit(data: { email: string; roleId: string; sendEmail: boolean }) {
		isLoading = true;
		setTimeout(() => {
			inviteResult = JSON.stringify(data, null, 2);
			isLoading = false;
			isOpen = false;
		}, 1500);
	}

	function handleClose() {
		isOpen = false;
		inviteResult = '';
	}

	const modalProps = [
		{
			name: 'open',
			type: 'boolean',
			description: 'Controls whether the modal is visible',
			required: true
		},
		{
			name: 'tenant',
			type: 'Tenant',
			description: 'Tenant object for displaying the organization name',
			required: true
		},
		{
			name: 'roles',
			type: 'Role[]',
			description: 'Available roles for the user to select from',
			required: true
		},
		{
			name: 'onsubmit',
			type: '(data: { email: string; roleId: string; sendEmail: boolean }) => void',
			description: 'Callback when the invite form is submitted',
			required: true
		},
		{
			name: 'onclose',
			type: '() => void',
			description: 'Callback to close the modal',
			required: true
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Disables form and shows loading state on submit button'
		}
	];
</script>

<svelte:head>
	<title>InviteUserModal | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/users">Users</a>
		<span>/</span>
		<span>InviteUserModal</span>
	</nav>

	<h1>InviteUserModal</h1>
	<p class="lead">
		A modal dialog for inviting new users to a tenant/organization. Includes email input, role
		selection, and an option to send an invitation email.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { InviteUserModal } from '@happyvertical/smrt-users/svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>
		Click the button to open the invite modal. The modal includes form validation and keyboard
		support (Escape to close).
	</p>

	<ComponentExample
		code={`<script lang="ts">
  let isOpen = $state(false);

  function handleSubmit(data) {
    console.log('Inviting:', data);
    isOpen = false;
  }
</script>

<button onclick={() => isOpen = true}>Invite User</button>

<InviteUserModal
  open={isOpen}
  tenant={tenant}
  roles={roles}
  onsubmit={handleSubmit}
  onclose={() => isOpen = false}
/>`}
	>
		<button class="open-btn" onclick={() => (isOpen = true)}>Invite User</button>

		<InviteUserModal
			open={isOpen}
			tenant={mockTenant}
			roles={mockRoles}
			onsubmit={handleSubmit}
			onclose={handleClose}
			loading={isLoading}
		/>

		{#if inviteResult}
			<div class="result">
				<strong>Invitation sent:</strong>
				<pre>{inviteResult}</pre>
			</div>
		{/if}
	</ComponentExample>

	<h2>Features</h2>
	<ul>
		<li><strong>Email validation</strong> - Required field with email format validation</li>
		<li><strong>Role selection</strong> - Dropdown with role descriptions using RoleSelector</li>
		<li><strong>Email toggle</strong> - Option to send invitation email or add user manually</li>
		<li><strong>Keyboard support</strong> - Press Escape to close the modal</li>
		<li><strong>Backdrop click</strong> - Click outside to close the modal</li>
		<li><strong>Loading state</strong> - Disables form during submission</li>
	</ul>

	<h2>With Loading State</h2>
	<p>The modal shows a loading indicator when submitting the invitation.</p>

	<ComponentExample
		code={`<InviteUserModal
  open={isOpen}
  tenant={tenant}
  roles={roles}
  onsubmit={handleSubmit}
  onclose={handleClose}
  loading={isSubmitting}
/>`}
	>
		<p class="note">
			The example above demonstrates the loading state when you submit an invitation.
		</p>
	</ComponentExample>

	<h2>Manual Invitation</h2>
	<p>
		When the "Send invitation email" checkbox is unchecked, a hint is shown explaining that the user
		will be added with pending status.
	</p>

	<ComponentExample
		code={`// When sendEmail is false, the user is added with 'pending' status
// and you'll need to share the invite link manually

function handleSubmit(data) {
  if (data.sendEmail) {
    sendInvitationEmail(data.email, data.roleId);
  } else {
    addUserManually(data.email, data.roleId);
    showInviteLink();
  }
}`}
	>
		<p class="note">Uncheck "Send invitation email" in the modal to see the hint message.</p>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={modalProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Tenant, Role } from '@happyvertical/smrt-users';

interface Props {
  open: boolean;
  tenant: Tenant;
  roles: Role[];
  onsubmit: (data: {
    email: string;
    roleId: string;
    sendEmail: boolean;
  }) => void;
  onclose: () => void;
  loading?: boolean;
}`}
		language="typescript"
	/>

	<h2>Related Components</h2>
	<ul>
		<li><a href="/components/users/user-list">UserList</a> - Display invited users</li>
		<li><a href="/components/users/user-card">UserCard</a> - Individual user display</li>
	</ul>
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

	.prose ul {
		color: #666;
		margin-bottom: 16px;
		padding-left: 24px;
	}

	.prose li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: #f5f5f5;
		border-radius: 3px;
	}

	.open-btn {
		padding: 10px 20px;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.open-btn:hover {
		background: #2563eb;
	}

	.result {
		margin-top: 16px;
		padding: 12px;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 4px;
		font-size: 0.875rem;
	}

	.result pre {
		margin: 8px 0 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		white-space: pre-wrap;
	}

	.note {
		font-size: 0.875rem;
		color: #6b7280;
		font-style: italic;
	}
</style>
