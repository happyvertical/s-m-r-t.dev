<script lang="ts">
	import type { Snippet } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { AdminShell } from '@happyvertical/smrt-svelte/workspace';
	import { onMount } from 'svelte';
	import AppTheme from '$lib/components/AppTheme.svelte';
	import DocsPanelSections from '$lib/components/DocsPanelSections.svelte';
	import DocsSidebar from '$lib/components/DocsSidebar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { DEMO_PATH } from '$lib/data/doors';
	import { isDocsPathname } from '$lib/data/navigation';
	import { createShellScrollMemory } from '$lib/scroll';
	import { createDocsShellState } from '$lib/shell';

	let {
		pathname,
		hash = '',
		children
	}: { pathname: string; hash?: string; children: Snippet } = $props();
	const shell = createDocsShellState();
	const scrollMemory = createShellScrollMemory();
	// The docs panel (the section map) lives only inside Docs (#365). Leaving
	// Docs with it open closes it, so it never hangs over a feature page.
	const inDocs = $derived(isDocsPathname(pathname));
	const onDemo = $derived(pathname === DEMO_PATH);
	$effect(() => {
		if (!inDocs && shell.panels.top === 'expanded') shell.collapsePanel('top');
	});

	function shellMain() {
		return document.querySelector<HTMLElement>('.smrt-admin-shell__main');
	}

	function focusHashTarget(activeHash: string) {
		if (!activeHash) return;
		const target = document.getElementById(decodeURIComponent(activeHash.slice(1)));
		if (!target) return;
		const hadTabindex = target.hasAttribute('tabindex');
		if (!hadTabindex) target.setAttribute('tabindex', '-1');
		target.focus({ preventScroll: true });
		target.scrollIntoView();
		if (!hadTabindex) {
			target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
		}
	}

	beforeNavigate(({ from }) => {
		const main = shellMain();
		if (from?.url && main) scrollMemory.capture(from.url, main.scrollTop);
	});

	afterNavigate(({ to, type }) => {
		if (!to) return;
		requestAnimationFrame(() => {
			if (to.url.hash) {
				focusHashTarget(to.url.hash);
				return;
			}
			const top = scrollMemory.destination(to.url, type);
			if (top === null) return;
			shellMain()?.scrollTo({ top });
			document.getElementById('main-content')?.focus({ preventScroll: true });
		});
	});

	onMount(() => {
		function handleHashChange() {
			requestAnimationFrame(() => {
				if (window.location.hash) {
					focusHashTarget(window.location.hash);
					return;
				}
				shellMain()?.scrollTo({ top: 0 });
				document.getElementById('main-content')?.focus({ preventScroll: true });
			});
		}

		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	});
</script>

{#snippet appBar()}
	<Header {pathname} />
{/snippet}

{#snippet docsPanel()}
	<DocsPanelSections {pathname} {hash} />
{/snippet}

<AppTheme>
	<!-- The demo has no site header (#381): without an appBar snippet and
	     with the brand slot claimed, the shell renders no top band at all. -->
	<AdminShell
		state={shell}
		edgeToggles={{ top: inDocs }}
		appPanel={inDocs ? docsPanel : undefined}
		appBar={onDemo ? undefined : appBar}
		brandInSlot={onDemo}
	>
		<div class="site-content">
			<!-- The frame is always mounted so route content never remounts on the
			     way into or out of Docs. The sidebar is a sibling of #main-content,
			     never inside it: the skip link and the generated agent docs both
			     take #main-content as the page. -->
			<div class="route-frame" data-docs={inDocs ? 'true' : undefined}>
				{#if inDocs}
					<aside class="docs-aside">
						<DocsSidebar {pathname} {hash} />
					</aside>
				{/if}
				<div class="route-content" id="main-content" tabindex="-1">
					{@render children()}
				</div>
			</div>
			<Footer />
		</div>
	</AdminShell>
</AppTheme>

<style>
	.site-content {
		min-height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--site-paper);
		color: var(--site-ink);
	}

	.route-frame {
		min-width: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.route-content {
		min-width: 0;
		flex: 1;
	}

	/* Below the breakpoint the sidebar is not displayed, which also takes it
	   out of the accessibility tree; the docs panel covers those widths. */
	.docs-aside {
		display: none;
	}

	@media (min-width: 72rem) {
		.route-frame[data-docs='true'] {
			display: grid;
			grid-template-columns: 15rem minmax(0, 1fr);
		}

		/* The shell's main area is the scroller and sits under the header, so
		   the sidebar sticks to its top and scrolls on its own. */
		.docs-aside {
			display: block;
			position: sticky;
			top: 0;
			align-self: start;
			max-height: calc(100svh - var(--site-header-height));
			overflow-y: auto;
			overscroll-behavior: contain;
		}

		/* The rule is on the content so it runs the full height of the page,
		   not only as far as a short sidebar. */
		.route-frame[data-docs='true'] > .route-content {
			border-left: 1px solid var(--site-line);
		}

		/* #main-content takes focus after navigation only so the next Tab starts
		   in the page. Its ring used to fall outside the viewport; beside the
		   sidebar its left edge would show as a stray rule. */
		.route-frame[data-docs='true'] > .route-content:focus-visible {
			outline: none;
		}
	}

	@media print {
		.docs-aside {
			display: none;
		}

		.route-frame[data-docs='true'] {
			display: block;
		}
	}

	:global(.smrt-admin-shell__main) {
		scroll-padding-block-start: 1.25rem;
		scroll-behavior: smooth;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.smrt-admin-shell__main) {
			scroll-behavior: auto;
		}
	}
</style>
