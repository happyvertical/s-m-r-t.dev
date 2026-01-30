<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';

	const components = [
		{
			name: 'AgentDashboard',
			href: '/components/agents/agent-dashboard',
			description: 'Overview panel displaying scheduled agents, stats, and run history'
		},
		{
			name: 'AgentScheduleList',
			href: '/components/agents/agent-schedule-list',
			description: 'Table display of scheduled agents with status and actions'
		},
		{
			name: 'AgentScheduleForm',
			href: '/components/agents/agent-schedule-form',
			description: 'Form for creating and editing agent schedules'
		},
		{
			name: 'AgentRunHistory',
			href: '/components/agents/agent-run-history',
			description: 'Table display of agent run history with status and errors'
		}
	];
</script>

<svelte:head>
	<title>Agents | s-m-r-t Components</title>
</svelte:head>

<Grid>
	<div class="header">
		<nav class="breadcrumb">
			<a href="/components">Components</a>
			<span>/</span>
			<span>Agents</span>
		</nav>
		<h1>Agent Components</h1>
		<p>Components for managing and monitoring SMRT agent schedules.</p>
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
