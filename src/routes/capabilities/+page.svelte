<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { capabilityGuides } from '$lib/data/guides';
</script>

<SEO
	title="s-m-r-t capabilities"
	description="Learn about s-m-r-t agent-assisted forms, learning agents, native mobile, hydration and live data, WebMCP, reports, AdminShell, and collection improvements."
	url="https://s-m-r-t.dev/capabilities"
/>

<article class="capability-index">
	<header>
		<p>Capabilities · 0.38.26</p>
		<h1>Add the parts your application needs.</h1>
		<span
			>The application foundations come first. These guides cover newer or more specialized systems
			that connect to the same models, tenants, permissions, and manifests.</span
		>
	</header>

	<section class="capability-list">
		{#each capabilityGuides as guide (guide.slug)}
			<a href={`/capabilities/${guide.slug}`}>
				<div>
					<h2>{guide.navTitle ?? guide.title}</h2>
					<span>{guide.eyebrow}</span>
				</div>
				<p>{guide.plainEnglish}</p>
				<small>{guide.packages.slice(0, 3).join(' · ')}</small>
			</a>
		{/each}
	</section>

	<aside>
		<strong>Components are browsable too.</strong>
		<p>
			Open the <a href="/playground">playground</a> to try foundation controls and package working views.
			Package pages keep those previews beside their reference material.
		</p>
	</aside>
</article>

<style>
	.capability-index {
		width: min(940px, calc(100% - 48px));
		margin: 0 auto;
		padding: 54px 0 86px;
	}
	header {
		max-width: 760px;
		padding-bottom: 38px;
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
		margin-top: 17px;
		color: var(--site-muted);
		font-size: 0.94rem;
		line-height: 1.65;
	}
	.capability-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.capability-list a {
		min-height: 190px;
		display: flex;
		flex-direction: column;
		padding: 19px;
		border: 1px solid var(--site-line-strong);
		border-radius: 8px;
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}
	.capability-list a:hover {
		border-color: var(--site-accent-strong);
	}
	.capability-list a > div {
		display: flex;
		justify-content: space-between;
		gap: 18px;
	}
	.capability-list h2 {
		font-size: 1rem;
	}
	.capability-list div span {
		flex: 0 0 auto;
		color: var(--site-accent-strong);
		font: 700 0.58rem var(--site-font-mono);
		text-transform: uppercase;
	}
	.capability-list p {
		margin-top: 11px;
		color: var(--site-muted);
		font-size: 0.79rem;
		line-height: 1.55;
	}
	.capability-list small {
		margin-top: auto;
		padding-top: 20px;
		color: var(--site-muted);
		font: 0.58rem var(--site-font-mono);
	}
	aside {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: 24px;
		margin-top: 32px;
		padding: 20px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		background: var(--site-surface);
	}
	aside strong {
		font-size: 0.8rem;
	}
	aside p {
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.55;
	}
	aside a {
		color: var(--site-ink);
	}
	@media (max-width: 700px) {
		.capability-index {
			width: min(100% - 28px, 940px);
			padding-top: 36px;
		}
		.capability-list {
			grid-template-columns: 1fr;
		}
		.capability-list a {
			min-height: 0;
		}
		aside {
			grid-template-columns: 1fr;
			gap: 7px;
		}
	}
</style>
