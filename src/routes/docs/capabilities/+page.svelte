<script lang="ts">
	import { siteUrl } from '$lib/site';
	import SEO from '$lib/components/SEO.svelte';
	import { capabilityGuides } from '$lib/data/guides';
	import { SMRT_VERSION } from '$lib/version';
</script>

<SEO
	title="Capabilities"
	description="How smrt makes an app legible to agents, through manifests, runtime registries, semantic controls, generated tools and permission-aware capabilities."
	url={siteUrl('/docs/capabilities')}
/>

<article class="capability-index">
	<header>
		<p>Capabilities · {SMRT_VERSION}</p>
		<h1>Add the parts your app needs.</h1>
		<span
			>Start with the application foundations. These guides cover the newer or more specialized
			systems, and they all connect to the same models, tenants, permissions and manifests.</span
		>
	</header>

	<section class="capability-list">
		{#each capabilityGuides as guide (guide.slug)}
			<a href={`/docs/capabilities/${guide.slug}`}>
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
		<strong>You can browse the components too.</strong>
		<p>
			Open the <a href="/playground">playground</a> to try the foundation controls and the package working
			views. Each package page keeps those previews next to its reference material.
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
		letter-spacing: -0.03em;
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
