<script lang="ts">
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';

	// `Planner` is the complete planner: the framework's own cookbook-driven
	// `AppShell` built from the plan, with a navigation section per recipe, a
	// record workspace (list, create and edit form over sample rows) per model
	// and a Help page per recipe, routed by URL fragment so it needs nothing
	// from this host's router. It reads browser storage and the DOM, so it
	// loads after mount; the prerender ships this intro without it.
	type PlannerModule = typeof import('@happyvertical/smrt-planner');

	let Planner = $state.raw<PlannerModule['Planner'] | null>(null);
	let loadError = $state<string | null>(null);

	onMount(() => {
		let cancelled = false;
		import('@happyvertical/smrt-planner').then(
			(planner) => {
				if (!cancelled) Planner = planner.Planner;
			},
			(error: unknown) => {
				if (!cancelled) loadError = error instanceof Error ? error.message : String(error);
			}
		);
		return () => {
			cancelled = true;
		};
	});
</script>

<SEO
	title="s-m-r-t app planner"
	description="Add recipes or packages and an app mock-up assembles around them: navigation, list views, forms and help per model."
	url="https://s-m-r-t.dev/planner"
/>

<div class="planner-page">
	<nav class="planner-page__bar" aria-label="Site">
		<a href="/">← Documentation</a>
	</nav>
	<header>
		<p>App planner</p>
		<h1>Plan an application from recipes</h1>
		<span>
			Add recipes such as Customers, Sales or Purchases, or whole packages. The application shell
			below is the framework's own. A navigation section per recipe appears in it as you add one,
			each with its own page, list view, form and help. The Layout tab edits the shell in place.
			Recipes, options and layout are kept in this browser.
		</span>
	</header>

	<section class="planner-host" aria-label="Planner">
		{#if Planner}
			<!--
				Known upstream defect (smrt-planner main, unreleased; see AGENTS.md
				"Active upstream defects"; https://github.com/happyvertical/smrt-planner/issues/53):
				once a plan with a saved `layout` is reloaded from this browser, the
				planner's `CookbookStore.snapshot()` hands the controller its `$state`
				proxy for `layout` (it snapshots `theme` but not `layout`) and smrt-core's
				cookbook engine fails to `structuredClone` it. Nothing here can unwrap
				that proxy; the fix is the store's.
			-->
			<Planner basePath="/planner" persistence="self" themeControls />
		{:else if loadError}
			<p class="planner-status" role="alert">The planner could not load: {loadError}</p>
		{:else}
			<p class="planner-status" role="status">Loading the planner…</p>
		{/if}
	</section>
</div>

<style>
	.planner-page {
		min-height: 100svh;
		background: var(--site-paper);
		color: var(--site-ink);
	}
	.planner-page__bar,
	header {
		width: min(70rem, calc(100% - 3rem));
		margin: 0 auto;
	}
	.planner-page__bar {
		padding-top: 1.25rem;
	}
	.planner-page__bar a {
		color: var(--site-muted);
		font-size: 0.875rem;
		text-decoration: none;
	}
	header {
		padding: 54px 0 34px;
	}
	header > * {
		max-width: 760px;
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
		min-height: 100svh;
		border-top: 1px solid var(--site-line);
	}
	.planner-status {
		width: min(70rem, calc(100% - 3rem));
		margin: 0 auto;
		padding-top: 30px;
		color: var(--site-muted);
	}
	@media (max-width: 760px) {
		.planner-page__bar,
		header,
		.planner-status {
			width: calc(100% - 2rem);
		}
		header {
			padding-top: 32px;
		}
	}
</style>
