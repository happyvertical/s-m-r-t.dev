<script lang="ts">
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';

	// This page is called build-a-boilerplate; the package keeps its name.
	// `Planner` is the complete planner: the framework's own cookbook-driven
	// `AppShell` built from the plan, with a navigation section per recipe, a
	// record workspace (list, create and edit form over sample rows) per model
	// and a Help page per recipe, routed by URL fragment so it needs nothing
	// from this host's router. It reads browser storage and the DOM, so it
	// loads after mount; the prerender ships the status line.
	type PlannerModule = typeof import('@happyvertical/smrt-planner');
	type PlannerInference = NonNullable<
		import('@happyvertical/smrt-planner').PlannerProps['inference']
	>;

	let Planner = $state.raw<PlannerModule['Planner'] | null>(null);
	let loadError = $state<string | null>(null);

	// The way back to the documentation, rendered by the planner at the start
	// of its own header beside the brand.
	const backLink = { href: '/', label: 'Back to documentation' };

	// On-device inference first: the AI page offers to download a small model
	// (WebLLM) into the visitor's browser, so nothing leaves their device and
	// no key is needed. Bringing their own OpenAI-compatible endpoint stays as
	// the deliberate alternative, narrowed to a local Ollama or an address they
	// type; any key is held in memory for the tab only, the policy the planner
	// documents for a public host. The site runs no model and has no server
	// endpoint, so no `host` mode. The browser model list is the package's.
	// Nothing here is a secret or an address.
	const inference: PlannerInference = {
		mode: 'browser',
		alternatives: ['byo'],
		byo: { presets: ['ollama', 'custom'] },
		credentialPersistence: 'memory'
	};

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
	title="build-a-boilerplate"
	description="Add recipes or packages and an app mock-up assembles around them: navigation, list views, forms and help per model. Its Export tab gives you two ways out: download the cookbook and run smrt cookbook apply on the file to create a project, or copy a prompt that has your coding agent build the app from it."
	url="https://s-m-r-t.dev/build-a-boilerplate"
/>

<div class="planner-page" id="main-content">
	<h1 class="planner-page__title">build-a-boilerplate</h1>
	<section class="planner-host" aria-label="build-a-boilerplate">
		{#if Planner}
			<Planner
				basePath="/build-a-boilerplate"
				persistence="self"
				themeControls
				defaultTitle="build-a-boilerplate"
				{inference}
				{backLink}
			/>
		{:else if loadError}
			<p class="planner-status" role="alert">build-a-boilerplate could not load: {loadError}</p>
		{:else}
			<p class="planner-status" role="status">Loading build-a-boilerplate…</p>
			<p class="planner-status">
				Add recipes or packages and an app mock-up assembles around them: navigation, list views,
				forms and help per model. Its Export tab gives you two ways out: download the cookbook and
				run smrt cookbook apply on the file to create a project, or copy a prompt that has your
				coding agent build the app from it.
			</p>
			<noscript
				><p class="planner-status">Enable JavaScript to use this interactive mock-up.</p></noscript
			>
		{/if}
	</section>
</div>

<style>
	/* The planner is the page: its shell sizes itself to the viewport and
	   only its own regions scroll, so the page never does. */
	.planner-page {
		height: 100svh;
		overflow: hidden;
		background: var(--site-paper);
		color: var(--site-ink);
	}
	.planner-page__title {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.planner-host {
		height: 100%;
		overflow: hidden;
	}
	.planner-status {
		padding: 1.5rem 1rem;
		color: var(--site-muted);
	}
</style>
