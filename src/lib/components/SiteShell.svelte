<script lang="ts">
	import type { Snippet } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { AdminShell } from '@happyvertical/smrt-svelte/workspace';
	import { onMount } from 'svelte';
	import AppTheme from '$lib/components/AppTheme.svelte';
	import ContextualNavigation from '$lib/components/ContextualNavigation.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import { createDocsShellState } from '$lib/shell';

	let {
		pathname,
		hash = '',
		children
	}: { pathname: string; hash?: string; children: Snippet } = $props();
	const shell = createDocsShellState();

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

	afterNavigate(({ from, to }) => {
		if (to?.url.hash && from?.url.pathname !== to.url.pathname) {
			requestAnimationFrame(() => focusHashTarget(to.url.hash));
		}
	});

	onMount(() => {
		function handleHashChange() {
			requestAnimationFrame(() => {
				if (window.location.hash) {
					focusHashTarget(window.location.hash);
					return;
				}
				const main = document.querySelector<HTMLElement>('.smrt-admin-shell__main');
				main?.scrollTo({ top: 0 });
				document.getElementById('main-content')?.focus({ preventScroll: true });
			});
		}

		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	});
</script>

<AppTheme>
	<AdminShell state={shell}>
		{#snippet appBar()}
			<Header {pathname} />
		{/snippet}

		{#snippet appPanel()}
			<ContextualNavigation {pathname} {hash} />
		{/snippet}

		<div class="site-content">
			<div class="route-content" id="main-content" tabindex="-1">
				{@render children()}
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

	.route-content {
		min-width: 0;
		flex: 1;
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
