<script lang="ts">
	import Grid from './Grid.svelte';

	interface Props {
		name: string;
		description: string;
		badges?: string[];
		docs: import('svelte').Snippet;
		components: import('svelte').Snippet;
	}

	let { name, description, badges = [], docs, components }: Props = $props();
	let activeTab = $state<'docs' | 'components'>('docs');
</script>

<svelte:head>
	<title>{name} | SMRT Modules</title>
	<meta name="description" content={description} />
</svelte:head>

<Grid>
	<article class="module-page">
		<nav class="breadcrumb">
			<a href="/modules">Modules</a>
			<span>/</span>
			<span>{name}</span>
		</nav>

		<h1>@happyvertical/{name}</h1>
		<p class="lead">{description}</p>

		{#if badges.length > 0}
			<div class="badges">
				{#each badges as badge}
					<span class="badge">{badge}</span>
				{/each}
			</div>
		{/if}

		<div class="tabs">
			<button
				class="tab"
				class:active={activeTab === 'docs'}
				onclick={() => (activeTab = 'docs')}
			>
				Documentation
			</button>
			<button
				class="tab"
				class:active={activeTab === 'components'}
				onclick={() => (activeTab = 'components')}
			>
				Components
			</button>
		</div>

		<div class="tab-content">
			<div class="content" class:hidden={activeTab !== 'docs'}>
				{@render docs()}
			</div>
			<div class="content" class:hidden={activeTab !== 'components'}>
				{@render components()}
			</div>
		</div>
	</article>
</Grid>

<style>
	.module-page {
		grid-column: 1 / -1;
		max-width: 900px;
		margin: 0 auto;
		padding: 48px 24px;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: var(--smrt-color-on-surface-variant, #666);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--smrt-color-primary, #1976d2);
	}

	.breadcrumb span:not(:last-child) {
		color: #ccc;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.lead {
		font-size: 1.2rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
		line-height: 1.6;
	}

	.badges {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-bottom: 32px;
	}

	.badge {
		display: inline-block;
		padding: 4px 12px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.tabs {
		display: flex;
		gap: 0;
		border-bottom: 2px solid var(--smrt-color-outline-variant, #e5e5e5);
		margin-bottom: 48px;
	}

	.tab {
		padding: 16px 24px;
		font-size: 1rem;
		font-weight: 500;
		color: var(--smrt-color-on-surface-variant, #666);
		background: none;
		border: none;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.tab:hover {
		color: var(--smrt-color-on-surface, #1a1a1a);
		background: var(--smrt-color-surface-container-low, #fafafa);
	}

	.tab.active {
		color: var(--smrt-color-primary, #1976d2);
		border-bottom-color: var(--smrt-color-primary, #1976d2);
	}

	.tab-content {
		min-height: 400px;
	}

	.content.hidden {
		display: none;
	}

	.content :global(section) {
		margin-bottom: 64px;
	}

	.content :global(section:last-child) {
		margin-bottom: 0;
	}

	.content :global(h2) {
		font-size: 1.75rem;
		font-weight: 600;
		margin-top: 64px;
		margin-bottom: 24px;
		padding-top: 16px;
		border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.content :global(h2:first-of-type) {
		border-top: none;
		margin-top: 0;
	}

	.content :global(h3) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	.content :global(h4) {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 24px;
		margin-bottom: 12px;
	}

	.content :global(p) {
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		line-height: 1.7;
	}

	.content :global(ul),
	.content :global(ol) {
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		padding-left: 24px;
		line-height: 1.7;
	}

	.content :global(li) {
		margin-bottom: 8px;
	}

	.content :global(code:not(pre code)) {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: var(--smrt-radius-sm, 4px);
		color: var(--smrt-color-primary, #d63384);
	}

	.content :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 16px 0;
	}

	.content :global(th),
	.content :global(td) {
		padding: 12px;
		text-align: left;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.content :global(th) {
		font-weight: 600;
		background: var(--smrt-color-surface-container, #f5f5f5);
	}

	.content :global(.diagram) {
		background: var(--smrt-color-surface-container-low, #f8f8f8);
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: 8px;
		padding: 16px;
		margin: 16px 0;
		overflow-x: auto;
	}

	.content :global(.diagram pre) {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.content :global(.link-grid) {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
		margin-top: 24px;
	}

	.content :global(.link-card) {
		padding: 20px;
		background: var(--smrt-color-surface-container-low, #fafafa);
		text-decoration: none;
		transition: all 0.2s;
		border: 1px solid transparent;
	}

	.content :global(.link-card:hover) {
		background: var(--smrt-color-surface-container, #f0f0f0);
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border-color: var(--smrt-color-primary, #1976d2);
	}

	.content :global(.link-card h3) {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.content :global(.link-card:hover h3) {
		color: var(--smrt-color-primary, #1976d2);
	}

	.content :global(.link-card p) {
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin: 0;
	}

	@media (max-width: 768px) {
		.module-page {
			padding: 24px 16px;
		}

		h1 {
			font-size: 2rem;
		}

		.lead {
			font-size: 1rem;
		}

		.tab {
			padding: 12px 16px;
			font-size: 0.9rem;
		}
	}
</style>
