<script lang="ts">
	import favicon from '$lib/assets/favicon-32.png';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';

	// Vendored SMRT theme tokens (smrt-svelte 0.37 removed its theme system).
	import '$lib/themes/smrt-theme.css';

	// SMRT Provider for form-component context.
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
	<div class="app">
		<Header />
		<main>
			{@render children()}
		</main>
		<Footer />
	</div>
	<CommandPalette />
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
