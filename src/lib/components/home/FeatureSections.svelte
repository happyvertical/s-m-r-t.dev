<script lang="ts">
	/**
	 * FeatureSections — the homepage's six feature sections (#321 slice B).
	 *
	 * Renders `homepageFeatures` in order, one `<section>` each: eyebrow, a
	 * sentence heading, one or two short paragraphs, an optional list of named
	 * instances, a static token-styled sketch, the links to the pages that hold
	 * the technical detail, and a "Sources" link to the section's evidence row.
	 * The money model follows as one sentence. No demos, no embeds.
	 */
	import type { HomepageFeature } from '$lib/data/homepage-features';
	import { homepageFeatures, homepageMoneyNote } from '$lib/data/homepage-features';
	import { whySmrtClaims } from '$lib/data/why-smrt-claims';

	const claimsById = new Map(whySmrtClaims.map((claim) => [claim.id, claim]));

	/**
	 * Where a section's "Sources" link goes: the section's row on
	 * /reference/evidence (#321 slice E), whose anchors are the row ids. The
	 * lookup stays so a feature naming a row that does not exist fails at
	 * render time instead of shipping a link to nothing.
	 */
	function sourcesHref(feature: HomepageFeature): string {
		if (!claimsById.has(feature.evidenceId)) {
			throw new Error(`No evidence row "${feature.evidenceId}" for /#${feature.id}`);
		}
		return `/reference/evidence#${feature.evidenceId}`;
	}
</script>

{#each homepageFeatures as feature (feature.id)}
	<section class="feature" id={feature.id} aria-labelledby={`${feature.id}-heading`}>
		<div class="feature-heading">
			<p class="eyebrow">
				{feature.eyebrow}
				{#if feature.label}<span class="status">{feature.label}</span>{/if}
			</p>
			<h2 id={`${feature.id}-heading`}>{feature.title}</h2>
		</div>

		<div class="feature-body">
			<div class="feature-copy">
				{#each feature.body as paragraph (paragraph)}
					<p>{paragraph}</p>
				{/each}
				{#if feature.points}
					<ul class="feature-points">
						{#each feature.points as point (point.label)}
							<li>
								<strong>{point.label}.</strong>
								<span>{point.body}</span>
							</li>
						{/each}
					</ul>
				{/if}
				<p class="feature-links">
					{#each feature.links as link (link.href)}
						<a href={link.href}>{link.label} <span aria-hidden="true">→</span></a>
					{/each}
					<a class="sources" href={sourcesHref(feature)}
						>Sources <span aria-hidden="true">→</span></a
					>
				</p>
			</div>

			{#if feature.sketch.kind === 'rows'}
				<div class="sketch sketch-rows" aria-hidden="true">
					{#each feature.sketch.items as item (item)}
						<span>{item}</span>
					{/each}
				</div>
			{:else if feature.sketch.kind === 'tree'}
				<div class="sketch sketch-tree" aria-hidden="true">
					{#each feature.sketch.items as item, index (item)}
						<span style:--depth={index}>{item}</span>
					{/each}
				</div>
			{:else}
				<div class="sketch sketch-doors" aria-hidden="true">
					{#each feature.sketch.items as item (item)}
						<span>{item}<small>read</small></span>
					{/each}
				</div>
			{/if}
		</div>
	</section>
{/each}

<p class="money-note">
	{homepageMoneyNote.body}
	<a href={homepageMoneyNote.href}
		>{homepageMoneyNote.linkLabel} <span aria-hidden="true">→</span></a
	>
</p>

<style>
	.feature {
		padding: clamp(3rem, 7vw, 5rem) 0;
		border-top: 1px solid var(--site-line);
		scroll-margin-top: 5.5rem;
	}

	.feature-heading {
		margin-bottom: 1.75rem;
	}

	.eyebrow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem;
		color: var(--site-accent-strong);
		font: 700 0.75rem var(--site-font-mono);
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.status {
		padding: 0.15rem 0.5rem;
		border: 1px solid var(--site-accent-strong);
		border-radius: 999px;
		font-size: 0.68rem;
		letter-spacing: 0.05em;
	}

	h2 {
		max-width: 22ch;
		margin-top: 0.65rem;
		font-size: clamp(1.75rem, 4vw, 3rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}

	.feature-body {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(14rem, 0.6fr);
		gap: 2rem 3rem;
		align-items: start;
	}

	.feature-copy p {
		max-width: 46rem;
		color: var(--site-muted);
		font-size: 0.98rem;
		line-height: 1.7;
	}

	.feature-copy p + p,
	.feature-points {
		margin-top: 0.9rem;
	}

	.feature-points {
		max-width: 46rem;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--site-line);
	}

	.feature-points li {
		padding: 0.8rem 0;
		border-bottom: 1px solid var(--site-line);
		color: var(--site-muted);
		font-size: 0.95rem;
		line-height: 1.65;
	}

	.feature-points strong {
		color: var(--site-ink);
	}

	.feature-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.4rem;
		margin-top: 1.25rem;
		font-size: 0.85rem;
		font-weight: 700;
	}

	.feature-links a {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		min-height: 2.5rem;
		color: var(--site-ink);
		text-decoration: none;
	}

	.feature-links a:hover,
	.feature-links a:focus-visible {
		color: var(--site-accent-strong);
	}

	.feature-links .sources {
		color: var(--site-muted);
		font-weight: 500;
	}

	.sketch {
		display: grid;
		gap: 0.5rem;
		padding: 1rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background: var(--site-surface);
		color: var(--site-ink);
		font: 0.78rem/1.4 var(--site-font-mono);
	}

	.sketch-rows span {
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--site-line);
		border-radius: var(--site-radius-md);
		background: var(--site-paper);
	}

	.sketch-rows span:nth-child(2) {
		border-left: 2px solid var(--site-accent-strong);
	}

	.sketch-rows span:last-child {
		color: var(--site-accent-strong);
		font-weight: 700;
	}

	.sketch-tree span {
		margin-left: calc(var(--depth) * 1.25rem);
		padding: 0.5rem 0.7rem;
		border: 1px solid var(--site-line);
		border-left: 2px solid var(--site-accent-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-paper);
	}

	.sketch-doors {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.sketch-doors span {
		display: grid;
		gap: 0.3rem;
		padding: 0.7rem 0.6rem;
		border: 1px solid var(--site-line);
		border-top: 2px solid var(--site-accent-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-paper);
		font-weight: 700;
		text-align: center;
	}

	.sketch-doors small {
		color: var(--site-muted);
		font-size: 0.7rem;
		font-weight: 500;
		text-transform: uppercase;
	}

	.money-note {
		max-width: 46rem;
		padding: 1.5rem 0 0;
		border-top: 1px solid var(--site-line);
		color: var(--site-muted);
		font-size: 0.95rem;
		line-height: 1.7;
	}

	.money-note a {
		color: var(--site-ink);
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
	}

	.money-note a:hover,
	.money-note a:focus-visible {
		color: var(--site-accent-strong);
	}

	@media (max-width: 58rem) {
		.feature-body {
			grid-template-columns: minmax(0, 1fr);
		}

		.sketch {
			max-width: 24rem;
		}
	}

	@media (max-width: 42rem) {
		.feature {
			padding: 2.5rem 0;
		}

		h2 {
			max-width: none;
		}

		.sketch-doors {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
