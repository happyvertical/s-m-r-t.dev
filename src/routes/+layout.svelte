<script lang="ts">
	import { onMount } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Smrt } from '@happyvertical/smrt-svelte';
	import { theme } from '$lib/stores/theme';

	let { children } = $props();

	onMount(() => {
		theme.init();

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			if ($theme === 'system') theme.set('system');
		};
		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	});
</script>

<svelte:head>
	<title>s-m-r-t — Your agent's favorite typescript framework</title>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<html lang="en" />
</svelte:head>

<Smrt>
	<a href="#main-content" class="skip-link">Skip to main content</a>

	<div class="app">
		<Header />
		<main id="main-content" role="main">
			{@render children()}
		</main>
		<Footer />
	</div>
</Smrt>

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
