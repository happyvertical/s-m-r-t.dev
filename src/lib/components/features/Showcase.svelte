<script lang="ts">
	/**
	 * One feature showcase (#364). The order is locked by the redesign and
	 * pinned by `Showcase.test.ts`: section strip, kicker, name, one sentence,
	 * In the box, live example, Also in the box, Reference/Source, the tick bar,
	 * previous/next. No package list, guide list, counts or extra prose.
	 */
	import SEO from '$lib/components/SEO.svelte';
	import {
		featurePath,
		featureSectionPath,
		features,
		featuresInSection,
		type Feature,
		type FeatureSection
	} from '$lib/data/features';
	import { alsoInTheBox } from './also-in-the-box';
	import ExampleFrame from './ExampleFrame.svelte';

	let { feature, section }: { feature: Feature; section: FeatureSection } = $props();

	const siblings = $derived(featuresInSection(section.id));
	const position = $derived(features.findIndex((item) => item.id === feature.id));
	const previous = $derived(position > 0 ? features[position - 1] : null);
	const next = $derived(position < features.length - 1 ? features[position + 1] : null);
	const tiles = $derived(alsoInTheBox[feature.id] ?? []);
</script>

<SEO
	title={`${feature.word} · ${section.word} features`}
	description={feature.hint}
	url={`https://s-m-r-t.dev${featurePath(feature)}`}
/>

<div class="showcase">
	<nav class="strip" aria-label={`${section.word} features`}>
		<div class="crumb">
			<a href="/">Features</a> › <a href={featureSectionPath(section)}>{section.word}</a> › {feature.word}
		</div>
		<ul>
			{#each siblings as item (item.id)}
				<li>
					<a href={featurePath(item)} aria-current={item.id === feature.id ? 'page' : undefined}
						>{item.word}</a
					>
				</li>
			{/each}
		</ul>
	</nav>

	<section class="hero">
		<div>
			<p class="kicker">{section.word}</p>
			<h1>{feature.word}</h1>
			<p class="one">{feature.hint}</p>
		</div>
		<div class="saves" role="group" aria-labelledby="in-the-box">
			<h2 id="in-the-box">In the box</h2>
			<ul>
				{#each feature.inTheBox as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	</section>

	<section class="demo" aria-label="Working example">
		<ExampleFrame {feature} />
	</section>

	{#if tiles.length}
		<section class="box" aria-labelledby="also-in-the-box">
			<h2 id="also-in-the-box">Also in the box</h2>
			<ul class="tiles">
				{#each tiles as tile (tile.name)}
					<li class="tile">
						<div class="pic"><code>&lt;{tile.name} /&gt;</code></div>
						<div class="meta">
							<h3>{tile.name}</h3>
							<p>{tile.line}</p>
							<code class="from">{tile.from}</code>
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section class="cta">
		<div class="row">
			<a class="big" href={feature.reference}>
				<b>Reference</b><span>for developers and agents</span>
			</a>
			<a class="big src" href={feature.source} rel="noopener">
				<b>Source</b><span>MIT</span>
			</a>
		</div>
		<div class="use">
			<p>Tick <strong>{feature.word}</strong> when you build-a-boilerplate.</p>
			<a href="/build-a-boilerplate">build-a-boilerplate</a>
		</div>
	</section>

	<nav class="pn" aria-label="Neighbouring features">
		{#if previous}
			<a href={featurePath(previous)} rel="prev"><span>Previous</span><b>{previous.word}</b></a>
		{:else}
			<span></span>
		{/if}
		{#if next}
			<a class="next" href={featurePath(next)} rel="next"><span>Next</span><b>{next.word}</b></a>
		{/if}
	</nav>
</div>

<style>
	.showcase {
		width: min(1080px, 100% - 32px);
		margin: 0 auto;
		padding-bottom: 8px;
		color: var(--site-ink);
	}

	/* Section strip */
	.strip {
		padding-top: 18px;
	}
	.crumb {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
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

	/* Name, sentence, In the box */
	.hero {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 40px;
		align-items: end;
		padding-block: 56px 32px;
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
		overflow-wrap: anywhere;
	}
	.one {
		max-width: 26ch;
		margin: 0;
		font-size: clamp(1.19rem, 2.2vw, 1.5rem);
		line-height: 1.35;
		text-wrap: balance;
	}
	.saves {
		min-width: 0;
		padding: 22px 24px;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background: var(--site-surface);
	}
	.saves h2 {
		margin: 0 0 10px;
		font-size: 1rem;
		letter-spacing: -0.01em;
	}
	.saves ul {
		margin: 0;
		padding-left: 18px;
		color: var(--site-muted);
		font-size: 0.9375rem;
	}
	.saves li::first-letter {
		text-transform: uppercase;
	}
	.saves li + li {
		margin-top: 4px;
	}

	/* Live example */
	.demo {
		padding-block: 16px 40px;
	}

	/* Also in the box */
	.box {
		padding-block: 8px 48px;
	}
	.box h2 {
		margin: 0 0 18px;
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 800;
		letter-spacing: -0.02em;
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
		display: flex;
		flex-direction: column;
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background: var(--site-surface);
	}
	.pic {
		display: grid;
		place-items: center;
		min-width: 0;
		aspect-ratio: 16 / 10;
		padding: 18px;
		background: var(--site-paper);
	}
	.pic code {
		max-width: 100%;
		padding: 12px 14px;
		border: 1px solid var(--site-line-strong);
		border-radius: 10px;
		background: var(--site-surface);
		color: var(--site-accent-ink);
		font: 500 0.8125rem/1.5 var(--site-font-mono);
		overflow-wrap: anywhere;
	}
	.meta {
		padding: 14px 18px 18px;
	}
	.meta h3 {
		margin: 0 0 2px;
		font-size: 1.0625rem;
		overflow-wrap: anywhere;
	}
	.meta p {
		margin: 0;
		color: var(--site-muted);
		font-size: 0.875rem;
	}
	.meta .from {
		display: block;
		margin-top: 10px;
		color: var(--site-muted);
		font: 0.6875rem var(--site-font-mono);
		overflow-wrap: anywhere;
	}

	/* Reference / Source, then the tick bar */
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
	.use {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-top: 16px;
		padding: 20px 24px;
		border-radius: var(--site-radius-lg);
		background: var(--site-accent);
		color: var(--site-on-accent);
	}
	.use p {
		margin: 0;
	}
	.use a {
		padding: 12px 20px;
		border-radius: 999px;
		background: var(--site-on-accent);
		color: var(--site-accent);
		font: 500 0.9375rem var(--site-font-mono);
		text-decoration: none;
		white-space: nowrap;
	}
	.use a:hover {
		text-decoration: underline;
	}
	.use a:focus-visible {
		outline-color: var(--site-on-accent);
	}

	/* Previous / next */
	.pn {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding-bottom: 48px;
		font-size: 0.875rem;
	}
	.pn a {
		color: var(--site-muted);
		text-decoration: none;
	}
	.pn a b {
		display: block;
		color: var(--site-ink);
		font-size: 1.125rem;
	}
	.pn a:hover b {
		text-decoration: underline;
	}
	.pn a.next {
		margin-left: auto;
		text-align: right;
	}

	@media (max-width: 767px) {
		.hero {
			grid-template-columns: 1fr;
			gap: 24px;
			padding-block: 36px 24px;
		}
		.tiles,
		.row {
			grid-template-columns: 1fr;
		}
		.pic {
			aspect-ratio: 16 / 7;
		}
	}
</style>
