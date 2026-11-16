<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { asset } from '$app/paths';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { initMatomo } from '$lib/analytics/matomo';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';
	import '@happyvertical/smrt-ui/themes/styles/all.css';
	import { Provider } from '@happyvertical/smrt-svelte';
	import PlannerShell from '$lib/components/PlannerShell.svelte';
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
	// The playground brings its own chrome. build-a-boilerplate keeps the site
	// header and drops the footer: the planner fills the screen below it.
	const isStandalone = $derived(page.url.pathname === '/playground');
	const isPlanner = $derived(
		page.url.pathname === '/build-a-boilerplate' ||
			page.url.pathname.startsWith('/build-a-boilerplate/')
	);
</script>

<svelte:head>
	<link rel="alternate" type="text/plain" href="/llms.txt" />
	<!-- Files in static/. The "s" is outlined Gabarito 800 (#396), so no icon waits on a webfont. -->
	<link rel="icon" type="image/svg+xml" href={asset('/favicon.svg')} />
	<link rel="icon" type="image/png" sizes="32x32" href={asset('/favicon-32.png')} />
	<link rel="icon" type="image/png" sizes="16x16" href={asset('/favicon-16.png')} />
	<link rel="apple-touch-icon" href={asset('/apple-touch-icon.png')} />
	<link rel="manifest" href={asset('/manifest.webmanifest')} />
	<meta name="theme-color" content="#141812" />
</svelte:head>

<Provider>
	{#if isStandalone}
		{@render children()}
	{:else if isPlanner}
		<PlannerShell pathname={page.url.pathname}>
			{@render children()}
		</PlannerShell>
	{:else}
		<SiteShell pathname={page.url.pathname} hash={page.url.hash}>
			{@render children()}
		</SiteShell>
	{/if}
</Provider>
