<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { interactionContent } from '$lib/data/interaction';
</script>

<SEO
	title="Human-Agent Interaction"
	description="Learn how persons and application agents communicate, discover controls, stage changes, preserve input sources, and keep authority explicit."
	url="https://s-m-r-t.dev/interaction"
/>

<article class="interaction-index">
	<header>
		<p>Interaction</p>
		<h1>Human-Agent Interaction</h1>
		<span
			>Persons and application agents use one declared interaction model. The model keeps meaning,
			proposals, consent, and authority explicit.</span
		>
	</header>

	<section class="overview-section boundary">
		<h2>Keep each concern in its section</h2>
		<p>Interaction explains how persons and agents communicate and agree on meaning and control.</p>
		<div>
			<article>
				<h3>UI</h3>
				<p>UI renders the controls, state, confirmation, and feedback for an interaction.</p>
				<a href="/ui">Open UI →</a>
			</article>
			<article>
				<h3>Framework</h3>
				<p>Framework explains manifests, registries, generated operations, and authority.</p>
				<a href="/framework">Open Framework →</a>
			</article>
			<article>
				<h3>Tooling</h3>
				<p>Tooling explains developer and coding-agent workflows around the application.</p>
				<a href="/tooling">Open Tooling →</a>
			</article>
			<article>
				<h3>Reference</h3>
				<p>Reference lists the complete interface, security, and package contracts.</p>
				<a href="/reference">Open Reference →</a>
			</article>
		</div>
	</section>

	<section class="overview-section">
		<h2>Learn the interaction model</h2>
		<div class="concepts">
			{#each interactionContent.guides as guide, index (guide.slug)}
				<a href={`#${guide.slug}`}>
					<small>{String(index + 1).padStart(2, '0')}</small>
					<strong>{guide.navTitle}</strong>
					<p>{guide.plainEnglish}</p>
					<span>Read concept →</span>
				</a>
			{/each}
		</div>
	</section>

	{#each interactionContent.guides as guide, index (guide.slug)}
		<section class="concept-detail" id={guide.slug}>
			<header class="concept-header">
				<p>{guide.eyebrow}</p>
				<small>{String(index + 1).padStart(2, '0')}</small>
				<h2>{guide.title}</h2>
				<span>{guide.lede}</span>
				{#if guide.pinnedVersion}
					<b>Verified against s-m-r-t {guide.pinnedVersion}</b>
				{/if}
			</header>

			<aside class="plain-english">
				<strong>In plain English</strong>
				<p>{guide.plainEnglish}</p>
			</aside>

			<div class="topics">
				{#each guide.sections as topic (topic.title)}
					<section>
						<h3>{topic.title}</h3>
						<p>{topic.intro}</p>
						{#if topic.points}
							<ul>
								{#each topic.points as point (point)}<li>{point}</li>{/each}
							</ul>
						{/if}
					</section>
				{/each}
			</div>

			<footer class="concept-links">
				<div>
					<strong>Connections</strong>
					{#each guide.related ?? [] as link (link.href)}<a href={link.href}>{link.label}</a>{/each}
				</div>
				<div>
					<strong>Canonical sources</strong>
					{#each guide.sources ?? [] as source (source.href)}<a
							href={source.href}
							rel="noreferrer"
							target="_blank">{source.label} ↗</a
						>{/each}
				</div>
			</footer>
		</section>
	{/each}
</article>

<style>
	.interaction-index {
		width: min(980px, calc(100% - 48px));
		margin: 0 auto;
		padding: 54px 0 88px;
	}
	header {
		max-width: 760px;
		padding-bottom: 38px;
	}
	header > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	h1 {
		margin-top: 11px;
		font-size: clamp(2.35rem, 6vw, 4.4rem);
		letter-spacing: -0.055em;
		line-height: 1;
	}
	header > span {
		display: block;
		max-width: 660px;
		margin-top: 18px;
		color: var(--site-muted);
		font-size: 0.96rem;
		line-height: 1.65;
	}
	.overview-section,
	.concept-detail {
		padding: 32px 0;
		border-top: 1px solid var(--site-line);
	}
	.overview-section > h2 {
		font-size: 1.2rem;
		letter-spacing: -0.02em;
	}
	.boundary > p {
		max-width: 680px;
		margin-top: 10px;
		color: var(--site-muted);
		font-size: 0.86rem;
		line-height: 1.6;
	}
	.boundary > div {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		margin-top: 20px;
	}
	.boundary article {
		display: flex;
		min-height: 170px;
		flex-direction: column;
		padding: 16px;
		border: 1px solid var(--site-line-strong);
		border-radius: 7px;
		background: var(--site-surface);
	}
	.boundary h3 {
		font-size: 0.82rem;
	}
	.boundary article p {
		margin-top: 8px;
		color: var(--site-muted);
		font-size: 0.74rem;
		line-height: 1.5;
	}
	.boundary a {
		margin-top: auto;
		padding-top: 16px;
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
		text-decoration: none;
	}
	.concepts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		margin-top: 20px;
	}
	.concepts a {
		display: grid;
		grid-template-columns: 32px minmax(0, 1fr);
		gap: 7px 10px;
		padding: 17px;
		border: 1px solid var(--site-line-strong);
		border-radius: 7px;
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}
	.concepts a:hover {
		border-color: var(--site-accent-strong);
	}
	.concepts small {
		grid-row: 1 / span 3;
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
	}
	.concepts strong {
		font-size: 0.84rem;
	}
	.concepts p {
		color: var(--site-muted);
		font-size: 0.76rem;
		line-height: 1.5;
	}
	.concepts span {
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
	}
	.concept-detail {
		scroll-margin-top: calc(var(--site-header-height) + 20px);
		padding-block: clamp(50px, 8vw, 82px);
	}
	.concept-header {
		position: relative;
		max-width: 760px;
		padding-bottom: 24px;
	}
	.concept-header > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.concept-header > small {
		position: absolute;
		top: 0;
		right: 0;
		color: var(--site-line-strong);
		font: 700 clamp(2.5rem, 8vw, 5.5rem) var(--site-font-mono);
		line-height: 0.8;
	}
	.concept-header h2 {
		max-width: 680px;
		margin-top: 10px;
		font-size: clamp(1.9rem, 4vw, 3rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	.concept-header > span {
		display: block;
		max-width: 680px;
		margin-top: 14px;
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.65;
	}
	.concept-header > b {
		display: block;
		margin-top: 12px;
		color: var(--site-muted);
		font: 0.62rem var(--site-font-mono);
		letter-spacing: 0.03em;
	}
	.plain-english {
		display: grid;
		grid-template-columns: 130px minmax(0, 1fr);
		gap: 20px;
		padding: 17px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		background: var(--site-surface);
	}
	.plain-english strong,
	.concept-links strong {
		font-size: 0.72rem;
	}
	.plain-english p {
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.58;
	}
	.topics {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin-top: 18px;
		border-top: 1px solid var(--site-line);
		border-left: 1px solid var(--site-line);
	}
	.topics section {
		padding: 22px;
		border-right: 1px solid var(--site-line);
		border-bottom: 1px solid var(--site-line);
	}
	.topics h3 {
		font-size: 0.98rem;
		letter-spacing: -0.015em;
	}
	.topics p,
	.topics li {
		color: var(--site-muted);
		font-size: 0.78rem;
		line-height: 1.6;
	}
	.topics p {
		margin-top: 9px;
	}
	.topics ul {
		margin-top: 12px;
		padding-left: 18px;
	}
	.topics li + li {
		margin-top: 5px;
	}
	.concept-links {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px;
		padding-top: 22px;
	}
	.concept-links > div {
		display: flex;
		align-content: flex-start;
		flex-wrap: wrap;
		gap: 7px;
	}
	.concept-links strong {
		width: 100%;
		margin-bottom: 4px;
	}
	.concept-links a {
		padding: 5px 8px;
		border: 1px solid var(--site-line-strong);
		border-radius: 5px;
		color: var(--site-ink);
		font: 0.62rem var(--site-font-mono);
		text-decoration: none;
	}
	.concept-links a:hover {
		border-color: var(--site-accent-strong);
	}
	@media (max-width: 780px) {
		.boundary > div {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 620px) {
		.interaction-index {
			width: min(100% - 28px, 980px);
			padding-top: 36px;
		}
		.boundary > div,
		.concepts,
		.topics,
		.concept-links {
			grid-template-columns: 1fr;
		}
		.boundary article {
			min-height: 0;
		}
		.plain-english {
			grid-template-columns: 1fr;
			gap: 7px;
		}
		.concept-header > small {
			display: none;
		}
	}
</style>
