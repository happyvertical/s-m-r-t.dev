<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { initMatomo } from '$lib/analytics/matomo';
	import favicon from '$lib/assets/favicon-32.png';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';
	import '@happyvertical/smrt-ui/themes/styles/all.css';
	import { Provider } from '@happyvertical/smrt-svelte';
	import SiteShell from '$lib/components/SiteShell.svelte';

	let { children } = $props();

	// Cookieless Matomo; null off the production host or until a site ID is set.
	// afterNavigate also fires once on mount (type 'enter'), which is the single
	// first-load page view: the tracker is created lazily on that first call and
	// the page is never reported a second time.
	let matomo: ReturnType<typeof initMatomo> | undefined;
	afterNavigate(async ({ to }) => {
		if (!to) return;
		matomo ??= initMatomo();
		await tick(); // let the new page's <title> land before reading it
		matomo?.pageView(to.url, document.title);
	});
	// The playground and build-a-boilerplate bring their own chrome: the planner
	// runs inside the framework's `AppShell` (see `build-a-boilerplate/+page.svelte`).
	const isStandalone = $derived(
		page.url.pathname === '/playground' ||
			page.url.pathname === '/build-a-boilerplate' ||
			page.url.pathname.startsWith('/build-a-boilerplate/')
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#141812" />
</svelte:head>

<Provider>
	{#if isStandalone}
		{@render children()}
	{:else}
		<SiteShell pathname={page.url.pathname} hash={page.url.hash}>
			{@render children()}
		</SiteShell>
	{/if}
</Provider>
