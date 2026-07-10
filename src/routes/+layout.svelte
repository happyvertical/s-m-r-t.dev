<script lang="ts">
	import favicon from '$lib/assets/favicon-32.png';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';
	import { ThemeProvider } from '@happyvertical/smrt-ui/themes';
	import '@happyvertical/smrt-ui/themes/styles/all.css';
	import { Provider } from '@happyvertical/smrt-svelte';
	import Header from '$lib/components/Header.svelte';
	import DocsShell from '$lib/components/DocsShell.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#141812" />
</svelte:head>

<Provider>
	<ThemeProvider preset="smrt" colorScheme="system" persist={true}>
		<div class="app">
			<Header />
			<main><DocsShell>{@render children()}</DocsShell></main>
			<Footer />
		</div>
	</ThemeProvider>
</Provider>

<style>
	.app {
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		background: var(--site-paper);
		color: var(--site-ink);
	}

	main {
		flex: 1;
	}
</style>
