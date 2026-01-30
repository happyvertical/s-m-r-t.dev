<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';

	const components = [
		{
			name: 'AgentSettingsShell',
			href: '/components/admin/agent-settings-shell',
			description: 'Full settings page layout with agent sidebar and tabbed panels'
		},
		{
			name: 'AgentAdminTabs',
			href: '/components/admin/agent-admin-tabs',
			description: 'Tab navigation for agent configuration slots'
		},
		{
			name: 'AgentAdminPanel',
			href: '/components/admin/agent-admin-panel',
			description: 'Dynamic panel renderer using the component registry'
		}
	];
</script>

<svelte:head>
	<title>Admin | s-m-r-t Components</title>
</svelte:head>

<Grid>
	<div class="header">
		<nav class="breadcrumb">
			<a href="/components">Components</a>
			<span>/</span>
			<span>Admin</span>
		</nav>
		<h1>Admin Components</h1>
		<p>Components for building agent administration interfaces.</p>
	</div>

	<div class="components-grid">
		{#each components as component}
			<a href={component.href} class="component-card">
				<h2>{component.name}</h2>
				<p>{component.description}</p>
			</a>
		{/each}
	</div>
</Grid>

<style>
	.header {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

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

	.header h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.header p {
		font-size: 1.1rem;
		color: #666;
	}

	.components-grid {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
		padding: 48px 0;
	}

	.component-card {
		display: block;
		padding: 24px;
		border: 1px solid var(--color-grid);
		text-decoration: none;
		transition: border-color 0.15s;
	}

	.component-card:hover {
		border-color: var(--color-accent);
	}

	.component-card h2 {
		font-family: var(--font-mono);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: 8px;
	}

	.component-card p {
		font-size: 0.9rem;
		color: #666;
		line-height: 1.5;
	}
</style>
