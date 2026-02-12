<script lang="ts">
	import { UserMenu } from '@happyvertical/smrt-users/svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock profile data (cast to any for documentation purposes)
	const mockProfile = { name: 'Jane Smith' } as any;
	const mockProfile2 = { name: 'John Doe' } as any;

	const menuProps = [
		{
			name: 'profile',
			type: 'Profile',
			description: 'Profile object containing user name for display',
			required: true
		},
		{
			name: 'signoutUrl',
			type: 'string',
			default: "'/auth/signout'",
			description: 'URL for the sign out action'
		},
		{
			name: 'profileUrl',
			type: 'string',
			default: "'/profile'",
			description: 'URL for the profile link'
		},
		{
			name: 'settingsUrl',
			type: 'string',
			default: "'/settings'",
			description: 'URL for the settings link'
		}
	];
</script>

<svelte:head>
	<title>UserMenu | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/users">Users</a>
		<span>/</span>
		<span>UserMenu</span>
	</nav>

	<h1>UserMenu</h1>
	<p class="lead">
		A dropdown menu component for authenticated users. Shows user avatar, name, and provides quick
		access to profile, settings, and sign out actions. Styled with Material 3 design.
	</p>

	<h2>Installation</h2>
	<CodeBlock
		code={`import { UserMenu } from '@happyvertical/smrt-users/svelte';`}
		language="typescript"
	/>

	<h2>Basic Usage</h2>
	<p>Click the menu trigger to reveal the dropdown with navigation options.</p>

	<ComponentExample code={`<UserMenu profile={currentUser} />`}>
		<UserMenu profile={mockProfile} />
	</ComponentExample>

	<h2>Multiple Users</h2>
	<p>Each user gets a unique avatar color based on their name.</p>

	<ComponentExample
		code={`<UserMenu profile={{ name: 'Jane Smith' }} />
<UserMenu profile={{ name: 'John Doe' }} />`}
	>
		<UserMenu profile={mockProfile} />
		<UserMenu profile={mockProfile2} />
	</ComponentExample>

	<h2>Custom URLs</h2>
	<p>Customize the navigation URLs for your application structure.</p>

	<ComponentExample
		code={`<UserMenu
  profile={profile}
  profileUrl="/account/profile"
  settingsUrl="/account/settings"
  signoutUrl="/api/auth/logout"
/>`}
	>
		<UserMenu
			profile={mockProfile}
			profileUrl="/account/profile"
			settingsUrl="/account/settings"
			signoutUrl="/api/auth/logout"
		/>
	</ComponentExample>

	<h2>Header Integration</h2>
	<p>The UserMenu is designed to be placed in your application header.</p>

	<ComponentExample
		code={`<header>
  <nav>
    <a href="/">Home</a>
    <a href="/docs">Docs</a>
  </nav>
  <UserMenu profile={currentUser} />
</header>`}
	>
		<div class="demo-header">
			<nav class="demo-nav">
				<span class="demo-logo">MyApp</span>
				<div class="demo-links">
					<a href="/">Home</a>
					<a href="/docs">Docs</a>
				</div>
			</nav>
			<UserMenu profile={mockProfile} />
		</div>
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={menuProps} />

	<h2>Menu Items</h2>
	<p>The menu includes three built-in items:</p>
	<ul>
		<li><strong>Profile</strong> - Links to the user's profile page</li>
		<li><strong>Settings</strong> - Links to the settings page</li>
		<li><strong>Sign out</strong> - Links to the sign out action (styled as danger)</li>
	</ul>

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Profile } from '@happyvertical/smrt-profiles';

interface Props {
  profile: Profile;
  signoutUrl?: string;
  profileUrl?: string;
  settingsUrl?: string;
}`}
		language="typescript"
	/>

	<h2>Behavior</h2>
	<ul>
		<li>Click the trigger to toggle the dropdown</li>
		<li>Mouse leave closes the dropdown</li>
		<li>Clicking a menu item closes the dropdown</li>
		<li>Includes ripple effect on interactive elements</li>
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

	.demo-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 12px 20px;
		background: #fafafa;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
	}

	.demo-nav {
		display: flex;
		align-items: center;
		gap: 24px;
	}

	.demo-logo {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.demo-links {
		display: flex;
		gap: 16px;
	}

	.demo-links a {
		color: #666;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.demo-links a:hover {
		color: #111;
	}
</style>
