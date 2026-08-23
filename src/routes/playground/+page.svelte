<script lang="ts">
	import PlaygroundEmbed from '$lib/components/PlaygroundEmbed.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { playgroundModules } from '$lib/data/playgrounds';
</script>

<SEO
	title="s-m-r-t component playground"
	description="Search and try foundation controls and package-owned s-m-r-t working views with mock or live data where supported."
	url="https://s-m-r-t.dev/playground"
/>

<div class="playground-page">
	<a class="docs-link" href="/">← Docs</a>
	<PlaygroundEmbed modules={playgroundModules} standalone />
</div>

<style>
	.playground-page {
		min-height: 100svh;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: 16px;
		padding: 16px;
	}
	.docs-link {
		justify-self: start;
		color: var(--site-ink);
		font-size: 0.72rem;
		font-weight: 700;
		text-decoration: none;
	}
	.docs-link:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	@media (max-width: 760px) {
		.playground-page {
			padding: 10px;
		}
	}
</style>
