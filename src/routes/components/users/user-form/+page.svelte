<script lang="ts">
	import { UserForm } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock data (cast to any for documentation purposes)
	const mockUser = { id: 'user_1', email: 'jane.smith@example.com', status: 'active' } as any;
	const mockProfile = { name: 'Jane Smith' } as any;

	let createFormResult = $state<string>('');
	let editFormResult = $state<string>('');
	let loading = $state(false);

	function handleCreate(data: { name: string; email: string; status: string }) {
		createFormResult = JSON.stringify(data, null, 2);
	}

	function handleEdit(data: { name: string; email: string; status: string }) {
		editFormResult = JSON.stringify(data, null, 2);
	}

	function simulateLoading() {
		loading = true;
		setTimeout(() => {
			loading = false;
		}, 2000);
	}

	const formProps = [
		{
			name: 'user',
			type: 'User | null',
			default: 'null',
			description: 'Existing user object for edit mode. When null, form is in create mode'
		},
		{
			name: 'profile',
			type: 'Profile | null',
			default: 'null',
			description: 'Existing profile object to pre-fill the name field'
		},
		{
			name: 'onsubmit',
			type: '(data: { name: string; email: string; status: UserStatus }) => void',
			description: 'Callback when the form is submitted',
			required: true
		},
		{
			name: 'oncancel',
			type: '() => void',
			description: 'Callback for cancel button. Button is hidden if not provided'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Disables form inputs and shows loading state'
		}
	];
</script>

<svelte:head>
	<title>UserForm | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/users">Users</a>
		<span>/</span>
		<span>UserForm</span>
	</nav>

	<h1>UserForm</h1>
	<p class="lead">
		A form component for creating and editing users. Handles name, email, and status fields with
		validation. Automatically detects create vs edit mode based on provided user prop.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { UserForm } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Create Mode</h2>
	<p>When no user is provided, the form operates in create mode with empty fields.</p>

	<ComponentExample
		code={`<script lang="ts">
  function handleSubmit(data) {
    console.log('Creating user:', data);
  }
</script>

<UserForm onsubmit={handleSubmit} />`}
	>
		<div class="form-container">
			<UserForm onsubmit={handleCreate} />
			{#if createFormResult}
				<div class="result">
					<strong>Submitted data:</strong>
					<pre>{createFormResult}</pre>
				</div>
			{/if}
		</div>
	</ComponentExample>

	<h2>Edit Mode</h2>
	<p>Provide existing user and profile data to pre-fill the form. Note that email cannot be changed after creation.</p>

	<ComponentExample
		code={`<UserForm
  user={existingUser}
  profile={existingProfile}
  onsubmit={handleUpdate}
  oncancel={() => console.log('Cancelled')}
/>`}
	>
		<div class="form-container">
			<UserForm
				user={mockUser}
				profile={mockProfile}
				onsubmit={handleEdit}
				oncancel={() => editFormResult = 'Cancelled'}
			/>
			{#if editFormResult}
				<div class="result">
					<strong>Result:</strong>
					<pre>{editFormResult}</pre>
				</div>
			{/if}
		</div>
	</ComponentExample>

	<h2>Loading State</h2>
	<p>Set <code>loading</code> to true to disable the form during submission.</p>

	<ComponentExample
		code={`<UserForm
  onsubmit={handleSubmit}
  loading={isLoading}
/>`}
	>
		<div class="form-container">
			<UserForm
				onsubmit={simulateLoading}
				{loading}
			/>
			<button class="simulate-btn" onclick={simulateLoading} disabled={loading}>
				{loading ? 'Loading...' : 'Simulate Loading State'}
			</button>
		</div>
	</ComponentExample>

	<h2>With Cancel Button</h2>
	<p>The cancel button only appears when an <code>oncancel</code> handler is provided.</p>

	<ComponentExample
		code={`<UserForm
  onsubmit={handleSubmit}
  oncancel={() => console.log('Form cancelled')}
/>`}
	>
		<div class="form-container">
			<UserForm
				onsubmit={(data) => alert('Submitted: ' + data.name)}
				oncancel={() => alert('Cancelled')}
			/>
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={formProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { User, UserStatus } from '@happyvertical/smrt-users';
import type { Profile } from '@happyvertical/smrt-profiles';

interface Props {
  user?: User | null;
  profile?: Profile | null;
  onsubmit: (data: { name: string; email: string; status: UserStatus }) => void;
  oncancel?: () => void;
  loading?: boolean;
}

// UserStatus = 'active' | 'pending' | 'suspended' | 'deactivated'`}
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

	.form-container {
		width: 100%;
		max-width: 400px;
	}

	.result {
		margin-top: 16px;
		padding: 12px;
		background: #f9fafb;
		border-radius: 4px;
		font-size: 0.875rem;
	}

	.result pre {
		margin: 8px 0 0;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		white-space: pre-wrap;
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
</style>
