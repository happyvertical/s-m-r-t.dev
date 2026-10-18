<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon-32.png';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';
	import '@happyvertical/smrt-ui/themes/styles/all.css';
	import { Provider } from '@happyvertical/smrt-svelte';
	import SiteShell from '$lib/components/SiteShell.svelte';

	let { children } = $props();
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
