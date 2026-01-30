<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';

	// Import and register custom themes
	import '$lib/themes';

	// Import theme system
	import { ThemeProvider, type ThemePreset } from '@happyvertical/smrt-svelte/themes';
	import '@happyvertical/smrt-svelte/themes/styles/all.css';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>s-m-r-t — Your agent's favorite typescript framework</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<ThemeProvider preset={("swiss" as ThemePreset)} colorScheme="system" persist={true}>
	<div class="app">
		<Header />
		<main>
			{@render children()}
		</main>
		<Footer />
	</div>
</ThemeProvider>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--smrt-color-background, #fafafa);
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	main {
		flex: 1;
	}
</style>
