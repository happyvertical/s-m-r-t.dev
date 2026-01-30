<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';

	const aiHooks = [
		{
			name: 'useSTT',
			href: '/components/hooks/use-stt',
			description: 'Speech-to-Text hook for voice transcription'
		},
		{
			name: 'useTTS',
			href: '/components/hooks/use-tts',
			description: 'Text-to-Speech hook for voice synthesis'
		},
		{
			name: 'useLLM',
			href: '/components/hooks/use-llm',
			description: 'LLM hook for in-browser AI chat'
		}
	];

	const utilityHooks = [
		{
			name: 'useAppState',
			href: '/components/hooks/use-app-state',
			description: 'Access the global app state manager'
		},
		{
			name: 'useAuth',
			href: '/components/hooks/use-auth',
			description: 'Authentication state and permission checking'
		},
		{
			name: 'useSocket',
			href: '/components/hooks/use-socket',
			description: 'WebSocket state and real-time messaging'
		}
	];
</script>

<svelte:head>
	<title>Hooks | s-m-r-t Components</title>
</svelte:head>

<Grid>
	<div class="header">
		<nav class="breadcrumb">
			<a href="/components">Components</a>
			<span>/</span>
			<span>Hooks</span>
		</nav>
		<h1>Hooks</h1>
		<p>Svelte 5 hooks for AI capabilities in smrt mode.</p>
	</div>

	<section class="hooks-section">
		<h2>AI Hooks</h2>
		<div class="hooks-grid">
			{#each aiHooks as hook}
				<a href={hook.href} class="hook-card">
					<h3>{hook.name}</h3>
					<p>{hook.description}</p>
				</a>
			{/each}
		</div>
	</section>

	<section class="hooks-section">
		<h2>Utility Hooks</h2>
		<div class="hooks-grid">
			{#each utilityHooks as hook}
				<a href={hook.href} class="hook-card">
					<h3>{hook.name}</h3>
					<p>{hook.description}</p>
				</a>
			{/each}
		</div>
	</section>
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

	.hooks-section {
		grid-column: 1 / -1;
		padding: 32px 0;
	}

	.hooks-section h2 {
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #666;
		margin-bottom: 16px;
	}

	.hooks-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
	}

	.hook-card {
		display: block;
		padding: 24px;
		border: 1px solid var(--color-grid);
		text-decoration: none;
		transition: border-color 0.15s;
	}

	.hook-card:hover {
		border-color: var(--color-accent);
	}

	.hook-card h3 {
		font-family: var(--font-mono);
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: 8px;
	}

	.hook-card p {
		font-size: 0.9rem;
		color: #666;
		line-height: 1.5;
	}
</style>
