<script lang="ts">
	import PlaygroundEmbed from '$lib/components/PlaygroundEmbed.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { playgroundModules } from '$lib/data/playgrounds';
	import { SMRT_VERSION } from '$lib/version';

	const featuredEntryId = '@happyvertical/smrt-ui:data-table';
</script>

<SEO
	title="s-m-r-t component playground"
	description="Search and try foundation controls and package-owned s-m-r-t working views with mock or live data where supported."
	url="https://s-m-r-t.dev/playground"
/>

<article class="playground-page">
	<header>
		<a class="docs-link" href="/">← Back to docs</a>
		<p>Component playground</p>
		<h1>Try the interface before you import it.</h1>
		<span
			>These previews come from each package’s <code>./playground</code> export. Mock mode is safe for
			browsing; packages can add a clearly labelled live mode when a working backend is available.</span
		>
		<p class="feature-note">
			<strong>New in {SMRT_VERSION}: Data Table</strong> is selected below with the rest of the UI foundation
			previews.
		</p>
	</header>

	<aside>
		<strong>{playgroundModules.length} package modules</strong>
		<p>
			Search by component, package, or tag. Foundation controls appear first, including the
			agent-assisted form flow, followed by domain working views.
		</p>
		<a href="/packages">Browse package reference →</a>
	</aside>

	<PlaygroundEmbed modules={playgroundModules} selectedEntryId={featuredEntryId} />
</article>

<style>
	.playground-page {
		width: min(1180px, calc(100% - 40px));
		margin: 0 auto;
		padding: 48px 0 82px;
	}
	header {
		max-width: 760px;
		padding-bottom: 28px;
	}
	.docs-link {
		display: inline-block;
		margin-bottom: 26px;
		color: var(--site-ink);
		font-size: 0.78rem;
		font-weight: 700;
		text-decoration: none;
	}
	.docs-link:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	header > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		text-transform: uppercase;
	}
	h1 {
		margin-top: 11px;
		font-size: clamp(2.15rem, 5vw, 3.25rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	header > span {
		display: block;
		margin-top: 16px;
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.62;
	}
	.feature-note {
		margin-top: 12px;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.55;
	}
	.feature-note strong {
		color: var(--site-ink);
	}
	header code {
		color: var(--site-ink);
		font-family: var(--site-font-mono);
		font-size: 0.82em;
	}
	aside {
		display: grid;
		grid-template-columns: 150px 1fr auto;
		gap: 20px;
		align-items: center;
		margin-bottom: 20px;
		padding: 13px 15px;
		border: 1px solid var(--site-line);
		background: var(--site-surface);
	}
	aside strong,
	aside a {
		font-size: 0.72rem;
	}
	aside p {
		color: var(--site-muted);
		font-size: 0.75rem;
	}
	aside a {
		color: var(--site-ink);
		font-weight: 650;
	}
	@media (max-width: 760px) {
		.playground-page {
			width: min(100% - 20px, 1180px);
			padding-top: 34px;
		}
		aside {
			grid-template-columns: 1fr;
			gap: 5px;
		}
	}
</style>
