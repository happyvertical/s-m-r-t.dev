<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import SEO from '$lib/components/SEO.svelte';
	import { getPlannerHost } from '$lib/planner/host.svelte';

	// The planner itself (the package, the framework shell around it and the
	// catalog) is loaded by the `/planner` layout after mount: none of it can
	// run during the static prerender, and the planner must mount inside the
	// shell it edits. The page waits for the host to say it is ready.
	const host = getPlannerHost();

	const sectionSlug = $derived(browser ? page.url.searchParams.get('s') : null);
	const entryPath = $derived(browser ? page.url.searchParams.get('m') : null);
	const showingSection = $derived(Boolean(sectionSlug || entryPath));
	const loadError = $derived(host?.error ?? null);
</script>

<SEO
	title="s-m-r-t app planner"
	description="Add recipes or packages and an app mock-up assembles around them: navigation, list views, forms and help per model."
	url="https://s-m-r-t.dev/planner"
/>

{#if sectionSlug && host?.SectionPage}
	<host.SectionPage slug={sectionSlug} />
{:else if entryPath}
	<section class="entry-note" aria-label="Record view">
		<p>
			<code>{`${entryPath}`}</code> is a record view of the planned app: a list with a create and edit
			form over sample rows. This preview builds the shell, its sections and their pages; the
			record views are generated when the app is scaffolded. <a href="/planner">Back to the planner</a>.
		</p>
	</section>
{/if}

<article class="planner-page" class:planner-page--compact={showingSection}>
	<header>
		<p>App planner</p>
		{#if showingSection}
			<h2>Plan</h2>
		{:else}
			<h1>Plan an application from recipes</h1>
		{/if}
		<span>
			Add recipes such as Customers, Sales or Purchases, or whole packages. The application shell
			around this page is the framework's own: a navigation section per recipe appears in it as
			you add one, each with its own page, and the Layout tab edits the shell in place. Package
			selections live in the URL. Recipes, options and layout are kept in this browser.
		</span>
	</header>

	<section class="planner-host" aria-label="Planner">
		{#if host?.status === 'ready' && host.Planner}
			<host.Planner basePath="/planner" layout="shell" persistence="self" themeControls />
		{:else if host?.status === 'failed'}
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
	.planner-page--compact {
		padding-top: 34px;
		border-top: 1px solid var(--smrt-color-outline-variant, var(--site-line));
	}
	.entry-note {
		width: min(70rem, calc(100% - 3rem));
		margin: 0 auto;
		padding-top: 34px;
	}
	.entry-note p {
		margin: 0;
		max-width: 760px;
		line-height: 1.65;
	}
	header {
		max-width: 760px;
		padding-bottom: 34px;
	}
	header > p {
		color: var(--smrt-color-primary, var(--site-accent-strong));
		font: 700 0.66rem var(--site-font-mono);
		text-transform: uppercase;
	}
	h1 {
		margin-top: 11px;
		font-size: clamp(2.15rem, 5vw, 3.25rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	h2 {
		margin-top: 11px;
		font-size: clamp(1.5rem, 3vw, 2rem);
		letter-spacing: -0.03em;
		line-height: 1.15;
	}
	header > span {
		display: block;
		margin-top: 17px;
		color: var(--smrt-color-on-surface-variant, var(--site-muted));
		font-size: 0.94rem;
		line-height: 1.65;
	}
	.planner-host {
		min-height: 60vh;
		padding-top: 30px;
		border-top: 1px solid var(--smrt-color-outline-variant, var(--site-line));
	}
	.planner-status {
		margin: 0;
		color: var(--smrt-color-on-surface-variant, var(--site-muted));
	}
	@media (max-width: 760px) {
		.planner-page,
		.entry-note {
			width: calc(100% - 2rem);
		}
		.planner-page {
			padding-top: 32px;
		}
	}
</style>
