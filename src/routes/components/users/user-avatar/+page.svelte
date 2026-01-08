<script lang="ts">
	import { UserAvatar } from '@happyvertical/smrt-svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import PropsTable from '$lib/components/PropsTable.svelte';

	// Mock profile data (cast to any for documentation purposes)
	const mockProfile = { name: 'Jane Smith' } as any;
	const mockProfile2 = { name: 'John Doe' } as any;
	const mockProfile3 = { name: 'Alice Johnson' } as any;

	const avatarProps = [
		{
			name: 'profile',
			type: 'Profile',
			description: 'Profile object containing user name for initials and color generation',
			required: true
		},
		{
			name: 'size',
			type: "'sm' | 'md' | 'lg' | 'xl'",
			default: "'md'",
			description: 'Avatar size variant'
		},
		{
			name: 'showName',
			type: 'boolean',
			default: 'false',
			description: 'Whether to display the user name next to the avatar'
		}
	];
</script>

<svelte:head>
	<title>UserAvatar | s-m-r-t Components</title>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/components">Components</a>
		<span>/</span>
		<a href="/components/users">Users</a>
		<span>/</span>
		<span>UserAvatar</span>
	</nav>

	<h1>UserAvatar</h1>
	<p class="lead">
		Displays a circular avatar with user initials and a consistent color based on the user's name.
		Supports multiple sizes and optional name display.
	</p>

	<h2>Installation</h2>
	<CodeBlock code={`import { UserAvatar } from '@happyvertical/smrt-svelte';`} language="typescript" />

	<h2>Basic Usage</h2>
	<p>The avatar displays initials derived from the user's name with a color consistently generated from the name.</p>

	<ComponentExample
		code={`<UserAvatar profile={{ name: 'Jane Smith' }} />`}
	>
		<UserAvatar profile={mockProfile} />
	</ComponentExample>

	<h2>Sizes</h2>
	<p>Four sizes are available: <code>sm</code>, <code>md</code> (default), <code>lg</code>, and <code>xl</code>.</p>

	<ComponentExample
		code={`<UserAvatar profile={profile} size="sm" />
<UserAvatar profile={profile} size="md" />
<UserAvatar profile={profile} size="lg" />
<UserAvatar profile={profile} size="xl" />`}
	>
		<UserAvatar profile={mockProfile} size="sm" />
		<UserAvatar profile={mockProfile} size="md" />
		<UserAvatar profile={mockProfile} size="lg" />
		<UserAvatar profile={mockProfile} size="xl" />
	</ComponentExample>

	<h2>With Name</h2>
	<p>Set <code>showName</code> to display the user's name alongside the avatar.</p>

	<ComponentExample
		code={`<UserAvatar profile={profile} showName />
<UserAvatar profile={profile} size="lg" showName />`}
	>
		<UserAvatar profile={mockProfile} showName />
		<UserAvatar profile={mockProfile} size="lg" showName />
	</ComponentExample>

	<h2>Consistent Colors</h2>
	<p>Each user gets a consistent color based on their name, making it easy to identify users across the application.</p>

	<ComponentExample
		code={`<UserAvatar profile={{ name: 'Jane Smith' }} showName />
<UserAvatar profile={{ name: 'John Doe' }} showName />
<UserAvatar profile={{ name: 'Alice Johnson' }} showName />`}
	>
		<UserAvatar profile={mockProfile} showName />
		<UserAvatar profile={mockProfile2} showName />
		<UserAvatar profile={mockProfile3} showName />
	</ComponentExample>

	<h2>Props</h2>
	<PropsTable props={avatarProps} />

	<h2>TypeScript</h2>
	<CodeBlock
		code={`import type { Profile } from '@happyvertical/smrt-profiles';

interface Props {
  profile: Profile;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
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
</style>
