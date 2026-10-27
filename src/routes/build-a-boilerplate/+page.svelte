<script lang="ts">
	import { onMount } from 'svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { noticeFor, parseFeatures, recipesFor, seedFor } from '$lib/build-handoff';

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

	type PlannerHandle = import('@happyvertical/smrt-planner').PlannerHandle;
	type PlannerConversationSeed = import('@happyvertical/smrt-planner').PlannerConversationSeed;

	// A selection from the front-page map (`?features=`, #367), read after
	// mount so the prerender never depends on the query. The planner's own
	// `?p=` names packages, so the recipes go in through its controller.
	let selected = $state.raw<string[]>([]);
	const initialConversation = $derived<PlannerConversationSeed | undefined>(
		selected.length ? seedFor(selected) : undefined
	);

	// The one-line landing notice: what the selection switched on, no model
	// needed. The visitor can dismiss it.
	let noticeOpen = $state(true);
	const notice = $derived(noticeFor(selected));

	async function onready({ controller, openAssistant }: PlannerHandle) {
		const ids = recipesFor(selected);
		if (ids.length) await controller.run({ name: 'add_recipes', input: { ids } });
		// Opens only once an inference mode is ready; until then the planner's
		// own AI setup page is where the visitor starts.
		await openAssistant?.();
	}

	// The way back to the map, rendered by the planner at the start of its own
	// header beside the brand; the site header above it holds the rest.
	const backLink = { href: '/', label: 'Back to the map' };

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
		selected = parseFeatures(window.location.search);
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

<div class="planner-page">
	<h1 class="planner-page__title">build-a-boilerplate</h1>
	<section class="planner-host" aria-label="build-a-boilerplate">
		{#if selected.length && noticeOpen && (notice.on || notice.off)}
			<div class="planner-notice" role="status">
				<p>
					{#if notice.on}<span>{notice.on}</span>{/if}
					{#if notice.off}<span>{notice.off}</span>{/if}
				</p>
				<button type="button" aria-label="Dismiss" onclick={() => (noticeOpen = false)}>
					<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
						<path d="M6 6l12 12M18 6L6 18" />
					</svg>
				</button>
			</div>
		{/if}
		<div class="planner-frame">
			{#if Planner}
				<Planner
					basePath="/build-a-boilerplate"
					persistence="self"
					themeControls
					defaultTitle="build-a-boilerplate"
					{inference}
					{backLink}
					{initialConversation}
					{onready}
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
					><p class="planner-status">
						Enable JavaScript to use this interactive mock-up.
					</p></noscript
				>
			{/if}
		</div>
	</section>
</div>

<style>
	/* The planner fills the screen below the site header and only its own
	   regions scroll, so the page never does. */
	.planner-page {
		height: calc(100svh - var(--site-header-height));
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
		display: flex;
		flex-direction: column;
	}
	.planner-frame {
		flex: 1;
		min-height: 0;
	}
	/* The framework's AdminShell sizes itself to the whole viewport (100svh,
	   100dvh on phones), which would run under the site header and the notice.
	   Sized to the frame instead. Upstream ask: a height prop or variable on the
	   shell (smrt#TBD, see issue #371). */
	.planner-frame > :global(.smrt-theme-root),
	.planner-frame :global(.smrt-admin-shell) {
		height: 100%;
		block-size: 100%;
		min-block-size: 0;
	}
	.planner-notice {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 1rem;
		background: var(--site-paper);
		color: var(--site-ink);
		border-bottom: 1px solid var(--site-line, currentColor);
		font-size: 0.9rem;
	}
	.planner-notice p {
		flex: 1;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1.25rem;
	}
	.planner-notice span:last-child:not(:first-child) {
		color: var(--site-muted);
	}
	.planner-notice button {
		display: grid;
		place-items: center;
		min-width: 44px;
		min-height: 44px;
		margin: -0.5rem -0.5rem -0.5rem 0;
		background: none;
		border: 0;
		color: inherit;
		cursor: pointer;
	}
	.planner-notice svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.planner-status {
		padding: 1.5rem 1rem;
		color: var(--site-muted);
	}
</style>
