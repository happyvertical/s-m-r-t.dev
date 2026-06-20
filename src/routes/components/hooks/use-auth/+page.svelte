<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	const returnProps = [
		{
			name: 'user',
			type: 'User | null',
			description: 'The authenticated user (reactive)'
		},
		{
			name: 'isAuthenticated',
			type: 'boolean',
			description: 'Whether a user is authenticated (reactive)'
		},
		{
			name: 'permissions',
			type: 'readonly string[]',
			description: "List of user's permissions (reactive)"
		},
		{
			name: 'hasPermission',
			type: '(permission: string) => boolean',
			description: 'Check if user has a specific permission'
		},
		{
			name: 'hasAllPermissions',
			type: '(permissions: string[]) => boolean',
			description: 'Check if user has all specified permissions'
		},
		{
			name: 'hasAnyPermission',
			type: '(permissions: string[]) => boolean',
			description: 'Check if user has any of the specified permissions'
		}
	];
</script>

<svelte:head>
	<title>useAuth | s-m-r-t Hooks</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/hooks">Hooks</a>
		<span>/</span>
		<span>useAuth</span>
	</nav>

	<h1>useAuth</h1>
	<p class="lead">
		Access authentication state and permission checking. Provides a simple interface for building
		protected UI based on user roles.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { useAuth } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>Show different content based on authentication state.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useAuth } from '@happyvertical/smrt-svelte';

  const auth = useAuth();
</script>

{#if auth.isAuthenticated}
  <p>Welcome, {auth.user?.email}</p>
  <a href="/logout">Sign Out</a>
{:else}
  <a href="/login">Sign In</a>
{/if}`}
		language="svelte"
	/>

	<h2>Permission Checking</h2>
	<p>Conditionally render UI based on user permissions.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useAuth } from '@happyvertical/smrt-svelte';

  const auth = useAuth();
</script>

{#if auth.hasPermission('articles.create')}
  <button>Create Article</button>
{/if}

{#if auth.hasAnyPermission(['articles.edit', 'articles.delete'])}
  <button>Manage Articles</button>
{/if}

{#if auth.hasAllPermissions(['admin', 'users.manage'])}
  <a href="/admin/users">User Management</a>
{/if}`}
		language="svelte"
	/>

	<h2>Setting Auth State</h2>
	<p>Set user and permissions via the Provider or useAppState.</p>

	<CodeBlock
		code={`<script lang="ts">
  import { useAppState } from '@happyvertical/smrt-svelte';

  const app = useAppState();

  // After successful login
  app.setUser({ id: '123', email: 'user@example.com' });
  app.setPermissions(['articles.create', 'articles.edit']);

  // After logout
  app.setUser(null);
  app.setPermissions([]);
</script>`}
		language="svelte"
	/>

	<h2>Return Value</h2>
	<PropsTable props={returnProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import { useAuth } from '@happyvertical/smrt-svelte';

interface User {
  id: string;
  email: string;
  // ... other user properties
}

const auth = useAuth();

// TypeScript knows these types
const user: User | null = auth.user;
const isAuth: boolean = auth.isAuthenticated;
const perms: readonly string[] = auth.permissions;`}
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
