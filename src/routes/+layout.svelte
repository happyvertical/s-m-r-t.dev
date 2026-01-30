<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';

	// Import theme system
	import { ThemeProvider, type ThemePreset, registerTheme } from '@happyvertical/smrt-svelte/themes';
	import '@happyvertical/smrt-svelte/themes/styles/all.css';

	// Import custom theme
	import { swissTheme } from '$lib/themes';
	import { browser } from '$app/environment';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();

	// Register custom theme
	let themeRegistered = $state(false);
	
	$effect(() => {
		if (browser) {
			// Register the custom theme (fire and forget, it will be available shortly)
			registerTheme(swissTheme);
			// Small delay to ensure registration completes
			setTimeout(() => {
				themeRegistered = true;
			}, 100);
		} else {
			// SSR - don't wait
			themeRegistered = true;
		}
	});
</script>

<svelte:head>
	<title>s-m-r-t — Your agent's favorite typescript framework</title>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if themeRegistered}
	<ThemeProvider preset={("swiss" as ThemePreset)} colorScheme="system" persist={true}>
		<div class="app">
			<Header />
			<main>
				{@render children()}
			</main>
			<Footer />
		</div>
	</ThemeProvider>
{:else}
	<div class="loading">
		<div class="spinner"></div>
		<p>Loading theme...</p>
	</div>
{/if}

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

	.loading {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		background: #fafafa;
		color: #1a1a1a;
		font-family: system-ui, sans-serif;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid #e5e5e5;
		border-top-color: #e63946;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
