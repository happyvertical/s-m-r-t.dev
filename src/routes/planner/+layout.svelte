<script lang="ts">
	import { page } from '$app/state';
	import type { plannerController as PlannerControllerInstance } from '@happyvertical/smrt-planner';
	import type { ComponentProps, Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { buildPlannerCatalog } from '$lib/planner/catalog';
	import { createPlannerHost } from '$lib/planner/host.svelte';
	import { loadInstalledManifests } from '$lib/planner/manifests';

	type CookbookModule = typeof import('@happyvertical/smrt-svelte/cookbook');
	type CookbookAppProps = ComponentProps<CookbookModule['CookbookApp']>;

	// The planner runs inside the framework's own application shell: a
	// `CookbookApp` (an `AppShell` driven by a cookbook) built from the plan the
	// planner controller holds, so adding a recipe grows the navigation around
	// it and the planner's Layout tab (`layout="shell"`) edits this very shell.
	// Everything here reads browser storage and the DOM, so it loads after
	// mount; the prerender ships the page content without the shell.
	let { children }: { children: Snippet } = $props();

	const host = createPlannerHost();

	let cookbookModule = $state.raw<CookbookModule | null>(null);
	let catalog = $state.raw<CookbookAppProps['catalog'] | null>(null);
	let cookbook = $state.raw<CookbookAppProps['cookbook'] | null>(null);
	let controller: typeof PlannerControllerInstance | null = null;

	const currentHref = $derived(page.url.pathname + page.url.search);

	onMount(() => {
		let cancelled = false;
		let unsubscribe: (() => void) | undefined;
		void (async () => {
			try {
				const [shell, planner, core, manifests] = await Promise.all([
					import('@happyvertical/smrt-svelte/cookbook'),
					import('@happyvertical/smrt-planner'),
					import('@happyvertical/smrt-planner/core'),
					loadInstalledManifests()
				]);
				if (cancelled) return;
				catalog = buildPlannerCatalog(core.recipes, manifests, shell);
				controller = planner.plannerController;
				const current = controller;
				unsubscribe = current.subscribe(() => {
					cookbook = current.cookbook();
				});
				cookbookModule = shell;
				host.ready({
					Planner: planner.Planner,
					SectionPage: shell.CookbookSectionPage,
					controller: current
				});
			} catch (error) {
				host.fail(error);
			}
		})();
		return () => {
			cancelled = true;
			unsubscribe?.();
		};
	});

	// A layout edit made in the shell (its pencil toggle, or the planner's
	// Layout tab) is written back into the plan, so the planner saves and
	// exports it with the rest of the cookbook and the shell re-reads it.
	//
	// Known upstream defect (smrt-planner 0.0.2, see AGENTS.md "Active upstream
	// defects"; https://github.com/happyvertical/smrt-planner/issues/53): once a plan with a saved `layout` is reloaded, the planner's
	// `CookbookStore.snapshot()` hands the controller its `$state` proxy for
	// `layout` (it snapshots `theme` but not `layout`), and smrt-core's cookbook
	// engine fails to `structuredClone` it. The controller then reports an
	// empty plan to this layout (no sections in the shell) and refuses every
	// command. Nothing here can unwrap that proxy; the fix is the store's.
	function persistLayout(next: CookbookAppProps['cookbook']) {
		if (!controller) return;
		const result = controller.run({
			name: 'import_cookbook',
			input: { document: next, replace: true }
		});
		if (!result.ok) console.warn('The shell layout could not be saved to the plan:', result.error);
	}

	function sectionHref(sectionId: string) {
		const slug = cookbookModule?.sectionSlug(sectionId) ?? sectionId;
		return `/planner?s=${encodeURIComponent(slug)}`;
	}

	function entryHref(entry: { packageId: string; modelName: string; key?: string }) {
		const path = [entry.packageId, entry.modelName, ...(entry.key ? [entry.key] : [])].join('/');
		return `/planner?m=${encodeURIComponent(path)}`;
	}
</script>

{#snippet docsLink()}
	<a class="docs-link" href="/">Documentation</a>
{/snippet}

{#if cookbookModule && catalog && cookbook}
	<cookbookModule.CookbookApp
		{cookbook}
		{catalog}
		{currentHref}
		homeHref="/planner"
		storageKey="smrt-docs-planner-shell"
		environment="planner"
		layoutEditing={{ slot: 'header.start' }}
		sectionPath={sectionHref}
		entryPath={entryHref}
		slotItems={[{ id: 'docs-link', label: 'Documentation link', slot: 'header.end', render: docsLink }]}
		oncookbookchange={persistLayout}
	>
		{@render children()}
	</cookbookModule.CookbookApp>
{:else}
	<div class="planner-plain">
		<nav class="planner-plain__bar" aria-label="Site">
			<a href="/">← Documentation</a>
		</nav>
		{@render children()}
	</div>
{/if}

<style>
	.docs-link {
		color: inherit;
		font-size: 0.875rem;
		text-decoration: none;
		padding: 0.375rem 0.625rem;
		border-radius: var(--smrt-radius-md, 0.375rem);
	}
	.docs-link:hover,
	.docs-link:focus-visible {
		background: var(--smrt-color-surface-container-high, rgba(0, 0, 0, 0.06));
	}
	.planner-plain {
		min-height: 100svh;
		background: var(--site-paper);
		color: var(--site-ink);
	}
	.planner-plain__bar {
		width: min(70rem, calc(100% - 3rem));
		margin: 0 auto;
		padding-top: 1.25rem;
	}
	.planner-plain__bar a {
		color: var(--site-muted);
		font-size: 0.875rem;
		text-decoration: none;
	}
</style>
