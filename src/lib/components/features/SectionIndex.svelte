<script lang="ts">
	/**
	 * A section index (#364): the section word, its sentence, its features as
	 * big tiles (word, sentence, still), and Reference/Source for the section.
	 */
	import SEO from '$lib/components/SEO.svelte';
	import {
		featurePath,
		featureSectionPath,
		featureSections,
		featuresInSection,
		type FeatureSection
	} from '$lib/data/features';
	import { resolvePlaygroundSlug } from '$lib/data/playgrounds';

	let { section }: { section: FeatureSection } = $props();

	const items = $derived(featuresInSection(section.id));
</script>

<SEO
	title={`${section.word} features`}
	description={section.hint}
	url={`https://s-m-r-t.dev${featureSectionPath(section)}`}
/>

<div class="index">
	<nav class="strip" aria-label="Feature sections">
		<div class="crumb"><a href="/">Features</a> › {section.word}</div>
		<ul>
			{#each featureSections as item (item.id)}
				<li>
					<a
						href={featureSectionPath(item)}
						aria-current={item.id === section.id ? 'page' : undefined}>{item.word}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	<header class="hero">
		<p class="kicker">Features</p>
		<h1>{section.word}</h1>
		<p class="one">{section.hint}</p>
	</header>

	<section class="features" aria-label={`${section.word} features`}>
		<ul class="tiles">
			{#each items as item (item.id)}
				<li class="tile">
					<a href={featurePath(item)}>
						<div class="pic">
							{#if item.example.kind === 'still'}
								<img src={item.example.src} width="640" height="400" alt="" loading="lazy" />
							{:else}
								<div class="live">
									<span class="badge">Live example</span>
									<code
										>{resolvePlaygroundSlug(item.example.entry)?.entryTitle ??
											item.example.entry}</code
									>
								</div>
							{/if}
						</div>
						<div class="meta">
							<h2>{item.word}</h2>
							<p>{item.hint}</p>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>

	<section class="cta">
		<div class="row">
			<a class="big" href={section.reference}>
				<b>Reference</b><span>for developers and agents</span>
			</a>
			<a class="big src" href={section.source} rel="noopener">
				<b>Source</b><span>MIT</span>
			</a>
		</div>
	</section>
</div>

<style>
	.index {
		width: min(1080px, 100% - 32px);
		margin: 0 auto;
		color: var(--site-ink);
	}
	.strip {
		padding-top: 18px;
	}
	.crumb {
		margin-bottom: 10px;
		color: var(--site-muted);
		font-size: 0.8125rem;
	}
	.crumb a {
		color: var(--site-accent-ink);
		font-weight: 600;
		text-decoration: none;
	}
	.crumb a:hover {
		text-decoration: underline;
	}
	.strip ul {
		display: flex;
		gap: 8px;
		margin: 0;
		padding: 0 0 4px;
		overflow-x: auto;
		list-style: none;
		scrollbar-width: none;
	}
	.strip li a {
		display: inline-block;
		padding: 8px 14px;
		border: 1.5px solid var(--site-line-strong);
		border-radius: 999px;
		background: var(--site-surface);
		color: var(--site-ink);
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}
	.strip li a:hover {
		border-color: var(--site-accent);
	}
	.strip li a[aria-current] {
		background: var(--site-accent);
		border-color: transparent;
		color: var(--site-on-accent);
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
		text-wrap: balance;
	}

	.features {
		padding-block: 8px 40px;
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
		height: 100%;
		overflow: hidden;
		border: 1px solid var(--site-line-strong);
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
	.pic {
		display: grid;
		place-items: center;
		min-width: 0;
		aspect-ratio: 16 / 10;
		background: var(--site-paper);
	}
	.pic img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.live {
		display: grid;
		justify-items: center;
		gap: 10px;
		padding: 18px;
		text-align: center;
	}
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: var(--site-ok);
		font: 500 0.75rem var(--site-font-mono);
	}
	.badge::before {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--site-ok);
	}
	.live code {
		padding: 8px 12px;
		border: 1px solid var(--site-line-strong);
		border-radius: 10px;
		background: var(--site-surface);
		color: var(--site-accent-ink);
		font: 500 0.8125rem var(--site-font-mono);
	}
	.meta {
		padding: 14px 18px 18px;
	}
	.meta h2 {
		margin: 0 0 4px;
		font-size: 1.5rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		overflow-wrap: anywhere;
	}
	.meta p {
		margin: 0;
		color: var(--site-muted);
		font-size: 0.9375rem;
	}

	.cta {
		padding-block: 8px 64px;
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.big {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
		padding: 28px 28px 26px;
		border: 1.5px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background: var(--site-surface);
		color: inherit;
		text-decoration: none;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}
	.big:hover {
		transform: translateY(-3px);
		box-shadow: 0 18px 40px rgb(0 0 0 / 8%);
	}
	.big b {
		font-size: 1.875rem;
		font-weight: 800;
		letter-spacing: -0.02em;
		line-height: 1;
	}
	.big span {
		color: var(--site-muted);
		font-size: 0.9375rem;
	}
	.big.src b::after {
		content: ' ↗';
		color: var(--site-muted);
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
		.tiles,
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
