<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setAdminShell } from '@happyvertical/smrt-svelte/workspace';
	import AppTheme from '$lib/components/AppTheme.svelte';
	import Header from '$lib/components/Header.svelte';
	import { createDocsShellState } from '$lib/shell';

	let { pathname, children }: { pathname: string; children: Snippet } = $props();

	// The site header above the planner. The planner brings its own
	// `AdminShell`, so the site's is not mounted around it: two shells would
	// give the page more than one `main` landmark. The header only needs the
	// shell's context.
	setAdminShell(createDocsShellState());
</script>

<AppTheme>
	<div class="planner-chrome">
		<header class="planner-chrome__bar">
			<Header {pathname} />
		</header>
		<div class="planner-chrome__body" id="main-content" tabindex="-1">
			{@render children()}
		</div>
	</div>
</AppTheme>

<style>
	.planner-chrome {
		height: 100svh;
		display: flex;
		flex-direction: column;
		background: var(--site-paper);
		color: var(--site-ink);
	}
	.planner-chrome__bar {
		flex: none;
		display: flex;
		align-items: center;
		height: var(--site-header-height);
		padding-inline: max(0.75rem, env(safe-area-inset-left, 0px));
		border-bottom: 1px solid var(--site-line);
	}
	.planner-chrome__body {
		flex: 1;
		min-height: 0;
	}
</style>
