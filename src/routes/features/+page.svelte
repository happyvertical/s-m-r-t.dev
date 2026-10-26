<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { featureSectionPath, featureSections, featuresInSection } from '$lib/data/features';
</script>

<SEO
	title="Features"
	description="Nine sections of capabilities you do not build from scratch."
	url="https://s-m-r-t.dev/features"
/>

<div class="landing">
	<header class="hero">
		<p class="kicker">Build</p>
		<h1>Features</h1>
		<p class="one">Nine sections of what you do not build from scratch.</p>
	</header>

	<ul class="tiles">
		{#each featureSections as section (section.id)}
			<li class="tile">
				<a href={featureSectionPath(section)}>
					<h2>{section.word}</h2>
					<p>{section.hint}</p>
					<span class="words">
						{#each featuresInSection(section.id) as item (item.id)}<span>{item.word}</span>{/each}
					</span>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.landing {
		width: min(1080px, 100% - 32px);
		margin: 0 auto;
		padding-bottom: 64px;
		color: var(--site-ink);
	}
	.hero {
		padding-block: 56px 36px;
	}
	.kicker {
		margin: 0 0 10px;
		color: var(--site-accent-ink);
		font: 500 0.75rem var(--site-font-mono);
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	h1 {
		margin: 0 0 18px;
		font-size: clamp(2.75rem, 7vw, 5.5rem);
		font-weight: 800;
		letter-spacing: -0.03em;
		line-height: 0.95;
	}
	.one {
		max-width: 30ch;
		margin: 0;
		font-size: clamp(1.19rem, 2.2vw, 1.5rem);
		line-height: 1.35;
	}
	.tiles {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.tile {
		min-width: 0;
	}
	.tile a {
		display: flex;
		flex-direction: column;
		gap: 8px;
		height: 100%;
		padding: 24px;
		border: 1.5px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background: var(--site-surface);
		color: inherit;
		text-decoration: none;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}
	.tile a:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 40px rgb(0 0 0 / 8%);
	}
	h2 {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.tile p {
		margin: 0;
		color: var(--site-muted);
		font-size: 0.9375rem;
	}
	.words {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: auto;
		padding-top: 8px;
	}
	.words span {
		padding: 3px 10px;
		border-radius: 999px;
		background: var(--site-paper);
		font-size: 0.8125rem;
		font-weight: 600;
	}
	@media (max-width: 960px) {
		.tiles {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 767px) {
		.hero {
			padding-block: 36px 24px;
		}
		.tiles {
			grid-template-columns: 1fr;
		}
	}
</style>
