<script lang="ts">
	import type { Component } from 'svelte';
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { PlannerProps } from '@happyvertical/smrt-planner';

	// The planner reads and writes browser storage and, when its assistant is
	// used, loads an in-browser model. None of that can run during the static
	// prerender, so the package is imported only after the page has mounted.
	let Planner = $state<Component<PlannerProps> | null>(null);
	let loadError = $state<string | null>(null);

	onMount(async () => {
		try {
			({ Planner } = await import('@happyvertical/smrt-planner'));
		} catch (error) {
			loadError = error instanceof Error ? error.message : String(error);
		}
	});
</script>

<SEO
	title="s-m-r-t app planner"
	description="Add recipes or packages and an app mock-up assembles around them: navigation, list views, forms and help per model."
	url="https://s-m-r-t.dev/planner"
/>

<article class="planner-page">
	<header>
		<p>App planner</p>
		<h1>Plan an application from recipes</h1>
		<span>
			Add recipes such as Customers, Sales or Purchases, or whole packages. An app mock-up assembles
			around them: a navigation group per recipe, a list view and form per model, and help pages
			that follow your options. Package selections live in the URL. Recipes, options and layout are
			kept in this browser.
		</span>
	</header>

	<section class="planner-host" aria-label="Planner">
		{#if Planner}
			<Planner basePath="/planner" />
		{:else if loadError}
			<p class="planner-status" role="alert">The planner could not load: {loadError}</p>
		{:else}
			<p class="planner-status" role="status">Loading the planner…</p>
		{/if}
	</section>
</article>

<style>
	.planner-page {
		width: min(70rem, calc(100% - 3rem));
		margin: 0 auto;
		padding: 54px 0 86px;
	}
	header {
		max-width: 760px;
		padding-bottom: 34px;
	}
	header > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		text-transform: uppercase;
	}
	h1 {
		margin-top: 11px;
		font-size: clamp(2.15rem, 5vw, 3.25rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	header > span {
		display: block;
		margin-top: 17px;
		color: var(--site-muted);
		font-size: 0.94rem;
		line-height: 1.65;
	}
	.planner-host {
		min-height: 60vh;
		padding-top: 30px;
		border-top: 1px solid var(--site-line);
	}
	.planner-status {
		margin: 0;
		color: var(--site-muted);
	}
	@media (max-width: 760px) {
		.planner-page {
			width: calc(100% - 2rem);
			padding-top: 32px;
		}
	}
</style>
