<script lang="ts">
	/**
	 * Shared documentation shell (issue #101): a three-column layout with the
	 * unified left sidebar, the page content, and a right-rail "On this page"
	 * TOC. Prev/next track navigation is appended below the content.
	 *
	 * Used by the docs / modules / components / reference section layouts so all
	 * four share one consistent, keyboard-accessible navigation chrome.
	 */
	import { page } from '$app/stores';
	import Sidebar from './Sidebar.svelte';
	import OnThisPage from './OnThisPage.svelte';
	import PrevNext from './PrevNext.svelte';
	import type { NavSection } from '$lib/site-nav';

	let {
		sectionId,
		children
	}: {
		sectionId?: NavSection['id'];
		children: import('svelte').Snippet;
	} = $props();

	let mobileNavOpen = $state(false);

	// Close the mobile sidebar drawer whenever the route changes.
	$effect(() => {
		void $page.url.pathname;
		mobileNavOpen = false;
	});
</script>

<div class="docs-shell">
	<button
		type="button"
		class="mobile-nav-toggle"
		aria-expanded={mobileNavOpen}
		onclick={() => (mobileNavOpen = !mobileNavOpen)}
	>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<line x1="3" y1="6" x2="21" y2="6"></line>
			<line x1="3" y1="12" x2="21" y2="12"></line>
			<line x1="3" y1="18" x2="21" y2="18"></line>
		</svg>
		Menu
	</button>

	<aside class="sidebar" class:open={mobileNavOpen}>
		<Sidebar {sectionId} />
	</aside>

	<div class="content">
		{@render children()}
		<PrevNext pathname={$page.url.pathname} />
	</div>

	<aside class="toc-rail">
		<OnThisPage pathname={$page.url.pathname} containerSelector=".docs-shell .content" />
	</aside>
</div>

<style>
	.docs-shell {
		display: grid;
		grid-template-columns: 210px minmax(0, 1fr) 200px;
		gap: 40px;
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 var(--grid-gap, 24px);
		align-items: start;
	}

	.sidebar {
		padding: 40px 0;
		position: sticky;
		top: 72px;
		max-height: calc(100vh - 72px);
		overflow-y: auto;
		border-right: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		padding-right: 16px;
	}

	.content {
		padding: 24px 0;
		min-width: 0;
	}

	/* Module/reference pages render their own <Grid> (a centered 1200px
	   container with side padding). Inside this column that padding/centering is
	   redundant, so let those pages fill the content column edge-to-edge. */
	.content :global(.grid-container) {
		max-width: none;
		padding: 0;
	}

	.toc-rail {
		padding: 40px 0;
		min-width: 0;
	}

	.mobile-nav-toggle {
		display: none;
		align-items: center;
		gap: 8px;
		margin: 16px 0 0;
		padding: 8px 14px;
		border: 1px solid var(--smrt-color-outline, #e5e5e5);
		border-radius: var(--smrt-radius-md, 8px);
		background: var(--smrt-color-surface-container-low, #fafafa);
		color: var(--smrt-color-on-surface, #1a1a1a);
		font-family: inherit;
		font-size: 0.9rem;
		cursor: pointer;
	}

	/* No room for the right TOC rail: drop it, keep sidebar + content. */
	@media (max-width: 1100px) {
		.docs-shell {
			grid-template-columns: 220px minmax(0, 1fr);
			gap: 40px;
		}

		.toc-rail {
			display: none;
		}
	}

	/* Narrow: sidebar becomes a collapsible drawer above the content. */
	@media (max-width: 820px) {
		.docs-shell {
			grid-template-columns: 1fr;
			gap: 0;
		}

		.mobile-nav-toggle {
			display: flex;
		}

		.sidebar {
			position: static;
			max-height: none;
			overflow: visible;
			border-right: none;
			border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
			padding: 16px 0;
		}

		.sidebar:not(.open) {
			display: none;
		}
	}
</style>
