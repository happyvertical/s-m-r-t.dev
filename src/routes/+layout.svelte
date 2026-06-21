<script lang="ts">
	import favicon from '$lib/assets/favicon-32.png';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';

	// Import theme system
	import { ThemeProvider } from '@happyvertical/smrt-svelte/themes';
	import '@happyvertical/smrt-svelte/themes/styles/all.css';

	// Import SMRT Provider for form components
	import { Provider } from '@happyvertical/smrt-svelte';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>s-m-r-t</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<Provider>
	<ThemeProvider preset="material" colorScheme="system" persist={true}>
		<div class="app">
			<Header />
			<main>
				{@render children()}
			</main>
			<Footer />
		</div>
		<CommandPalette />
	</ThemeProvider>
</Provider>

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
		padding-bottom: 48px;
	}
</style>
