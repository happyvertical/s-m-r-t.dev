<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/styles/reset.css';
	import '$lib/styles/variables.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>s-m-r-t — Your agent's favorite typescript framework</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<Header />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
	}
</style>
