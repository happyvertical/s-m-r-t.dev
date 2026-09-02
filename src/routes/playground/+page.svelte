<script lang="ts">
	import AppTheme from '$lib/components/AppTheme.svelte';
	import PlaygroundEmbed from '$lib/components/PlaygroundEmbed.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { playgroundModules, resolvePlaygroundSlug } from '$lib/data/playgrounds';
	import { browser } from '$app/environment';
	import { page } from '$app/state';

	const requestedSlug = $derived(browser ? page.url.searchParams.get('entry') : null);
	const resolvedEntry = $derived(requestedSlug ? resolvePlaygroundSlug(requestedSlug) : null);
	const selectedEntryId = $derived(resolvedEntry ? resolvedEntry.qualifiedId : null);
	const unknownSlug = $derived(requestedSlug !== null && resolvedEntry === null);
</script>

<SEO
	title="s-m-r-t component playground"
	description="Search and try foundation controls and package-owned s-m-r-t working views with mock or live data where supported."
	url="https://s-m-r-t.dev/playground"
/>

<AppTheme>
	<div class="playground-page">
		<a class="docs-link" href="/">← Docs</a>
		{#if unknownSlug}
			<p class="unknown-slug-notice" role="status">
				No playground entry named <code>{`${requestedSlug}`}</code>. Browse the
				<a href="/playground">full entry list</a> for valid deep links.
			</p>
		{/if}
		<PlaygroundEmbed modules={playgroundModules} {selectedEntryId} standalone />
	</div>
</AppTheme>

<style>
	.playground-page {
		display: contents;
	}
	.docs-link {
		position: fixed;
		top: 0.8rem;
		right: clamp(1.25rem, 3vw, 3rem);
		z-index: 1;
		border: 1px solid var(--smrt-color-outline-variant, #59616e);
		border-radius: 999px;
		background: var(--smrt-color-surface-container, #1b2028);
		color: var(--smrt-color-on-surface, #f0f2f7);
		font-family: var(--smrt-font-family, system-ui, sans-serif);
		font-size: 0.75rem;
		font-weight: 700;
		line-height: 1;
		padding: 0.55rem 0.75rem;
		text-decoration: none;
	}
	.docs-link:hover {
		background: var(--smrt-color-surface-container-high, #252b35);
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	@media (max-width: 760px) {
		.docs-link {
			top: 0.65rem;
			right: 0.75rem;
		}
	}
	.unknown-slug-notice {
		position: fixed;
		top: 0.8rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1;
		max-width: min(90vw, 34rem);
		margin: 0;
		border: 1px solid var(--smrt-color-outline-variant, #59616e);
		border-radius: 8px;
		background: var(--smrt-color-surface-container, #1b2028);
		color: var(--smrt-color-on-surface, #f0f2f7);
		font-family: var(--smrt-font-family, system-ui, sans-serif);
		font-size: 0.8rem;
		line-height: 1.4;
		padding: 0.55rem 0.85rem;
		text-align: center;
	}
	.unknown-slug-notice code {
		font-family: var(--smrt-font-family-mono, ui-monospace, monospace);
	}
	.unknown-slug-notice a {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	@media (max-width: 760px) {
		.unknown-slug-notice {
			top: 3rem;
			max-width: calc(100vw - 1.5rem);
		}
	}
</style>
