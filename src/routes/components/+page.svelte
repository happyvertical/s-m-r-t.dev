<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';

	interface Component {
		name: string;
		description: string;
		href?: string;
	}

	interface Category {
		name: string;
		description: string;
		href?: string;
		components: Component[];
	}

	const categories: Category[] = [
		{
			name: 'Forms',
			description: 'SMRT form components with voice input support',
			href: '/components/forms',
			components: [
				{ name: 'SMRTTextInput', href: '/components/forms/text-input', description: 'Text input with voice support' },
				{ name: 'SMRTSelect', href: '/components/forms/smrt-select', description: 'Dropdown with voice selection' },
				{ name: 'SMRTCheckbox', href: '/components/forms/checkbox', description: 'Checkbox with voice control' },
				{ name: 'SMRTDateTime', href: '/components/forms/datetime', description: 'Date/time with natural language' },
				{ name: 'SMRTAddress', href: '/components/forms/address', description: 'Address input with parsing' },
				{ name: 'SMRTMoney', href: '/components/forms/money', description: 'Currency input in cents' },
				{ name: 'SMRTPhone', description: 'Phone number input with formatting' },
				{ name: 'SMRTTextarea', description: 'Multiline text with voice support' },
				{ name: 'SMRTNumber', description: 'Numeric input with constraints' },
				{ name: 'SMRTDateRange', description: 'Date range picker' },
				{ name: 'SMRTMeasurement', description: 'Measurement with units' }
			]
		},
		{
			name: 'Users',
			description: 'User management and authentication components',
			href: '/components/users',
			components: [
				{ name: 'UserCard', href: '/components/users/user-card', description: 'User profile card display' },
				{ name: 'UserAvatar', href: '/components/users/user-avatar', description: 'User avatar with fallback' },
				{ name: 'UserList', href: '/components/users/user-list', description: 'List of user cards' },
				{ name: 'UserForm', href: '/components/users/user-form', description: 'User profile edit form' },
				{ name: 'UserMenu', href: '/components/users/user-menu', description: 'User dropdown menu' },
				{ name: 'InviteUserModal', href: '/components/users/invite-user', description: 'User invitation modal' }
			]
		},
		{
			name: 'Tenants & Roles',
			description: 'Multi-tenancy and role-based access',
			components: [
				{ name: 'TenantCard', description: 'Tenant organization card' },
				{ name: 'TenantSwitcher', description: 'Switch between tenants' },
				{ name: 'RoleBadge', description: 'Role indicator badge' },
				{ name: 'RoleSelector', description: 'Role selection component' },
				{ name: 'PermissionCheck', description: 'Permission-based rendering' }
			]
		},
		{
			name: 'Memberships',
			description: 'Membership management components',
			components: [
				{ name: 'MembershipCard', description: 'Membership details card' },
				{ name: 'MembershipList', description: 'List of memberships' }
			]
		}
	];
</script>

<svelte:head>
	<title>Components | s-m-r-t</title>
</svelte:head>

<Grid>
	<div class="header">
		<h1>Components</h1>
		<p>Svelte 5 component library with design tokens. Built for the SMRT ecosystem.</p>
	</div>

	<section class="install">
		<h2>Installation</h2>
		<pre><code>npm install @happyvertical/smrt-svelte</code></pre>
		<pre><code>{`// SMRT form components with voice input
import { SMRTTextInput, SMRTSelect, SMRTCheckbox } from '@happyvertical/smrt-svelte';

// User management components
import { UserCard, UserAvatar, UserList } from '@happyvertical/smrt-svelte';`}</code></pre>
	</section>

	<section class="preview">
		<h2>Quick Preview</h2>
		<pre><code>{`<script>
  import { SMRTTextInput, UserAvatar } from '@happyvertical/smrt-svelte';

  let name = $state('');
</script>

<SMRTTextInput bind:value={name} label="Name" placeholder="Enter your name" />
<UserAvatar user={{ name: "John Doe", email: "john@example.com" }} />`}</code></pre>
	</section>

	{#each categories as category}
		<section class="category">
			<h2>{category.name}</h2>
			<p class="category-desc">{category.description}</p>
			<div class="component-grid">
				{#each category.components as component}
					{#if component.href}
						<a href={component.href} class="component-card component-link">
							<h3>{component.name}</h3>
							<p>{component.description}</p>
						</a>
					{:else}
						<div class="component-card">
							<h3>{component.name}</h3>
							<p>{component.description}</p>
						</div>
					{/if}
				{/each}
			</div>
		</section>
	{/each}

	<section class="tokens">
		<h2>Design Tokens</h2>
		<p>Customize components with CSS custom properties:</p>
		<pre><code>{`:root {
  /* Colors */
  --color-primary: #ff3e00;
  --color-primary-light: #ff6b3d;
  --color-primary-dark: #cc3200;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
}`}</code></pre>
	</section>
</Grid>

<style>
	.header {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.header p {
		font-size: 1.1rem;
		color: #666;
	}

	.install,
	.preview,
	.category,
	.tokens {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.tokens {
		border-bottom: none;
	}

	h2 {
		font-size: 1.1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: 16px;
	}

	.category-desc {
		color: #666;
		margin-bottom: 24px;
	}

	pre {
		background: #1a1a1a;
		color: #f0f0f0;
		padding: 16px 20px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		margin-bottom: 16px;
	}

	.component-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
	}

	.component-card {
		padding: 20px;
		background: #fafafa;
	}

	.component-link {
		text-decoration: none;
		transition: all 0.2s;
	}

	.component-link:hover {
		background: #f0f0f0;
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.component-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 4px;
		color: #1a1a1a;
	}

	.component-link:hover h3 {
		color: var(--color-accent);
	}

	.component-card p {
		font-size: 0.85rem;
		color: #666;
	}

	@media (max-width: 800px) {
		.component-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
