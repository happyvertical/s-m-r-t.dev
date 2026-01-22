<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { SmrtProvider } from '@happyvertical/smrt-svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>s-m-r-t — Your agent's favorite typescript framework</title>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<html lang="en" />
</svelte:head>

<SmrtProvider>
	<a href="#main-content" class="skip-link">Skip to main content</a>

	<div class="app">
		<Header />
		<main id="main-content" role="main">
			{@render children()}
		</main>
		<Footer />
	</div>
</SmrtProvider>

<style>
	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--color-accent);
		color: white;
		padding: 8px 16px;
		text-decoration: none;
		border-radius: 0 0 4px 0;
		font-weight: 600;
		z-index: 1000;
	}

	.skip-link:focus {
		top: 0;
	}

	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
	}
</style>
