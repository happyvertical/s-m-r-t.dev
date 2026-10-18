<script lang="ts">
	/**
	 * FeatureSections — the homepage's six feature sections (#321 slice B).
	 *
	 * Renders `homepageFeatures` in order, one `<section>` each: a sentence
	 * heading (with the release-status chip when the feature carries one), one
	 * or two short paragraphs, an optional list of named instances, the links to
	 * the pages that hold the technical detail, and a "Sources" link to the
	 * section's evidence row. The money model follows as one sentence. No demos,
	 * no embeds. Slice D dropped the eyebrows (the H2s stand alone) and the
	 * decorative sketches, for the page's word budget.
	 */
	import type { HomepageFeature } from '$lib/data/homepage-features';
	import { homepageFeatures, homepageMoneyNote } from '$lib/data/homepage-features';
	import { whySmrtClaims } from '$lib/data/why-smrt-claims';

	const claimsById = new Map(whySmrtClaims.map((claim) => [claim.id, claim]));

	/**
	 * Where a section's "Sources" link goes.
	 *
	 * TODO(#321 slice E): once `/reference/evidence` exists, return
	 * `/reference/evidence#${feature.evidenceId}` — the row ids are the anchor
	 * ids. Until that page ships, a link to it would be a hard 404 on this
	 * static site (and `check:links` would fail the build), so the link goes
	 * straight to the row's release-verified source instead.
	 */
	function sourcesHref(feature: HomepageFeature): string {
		const claim = claimsById.get(feature.evidenceId);
		if (!claim) throw new Error(`No evidence row "${feature.evidenceId}" for /#${feature.id}`);
		return claim.source.href;
	}
</script>

{#each homepageFeatures as feature (feature.id)}
	<section class="feature" id={feature.id} aria-labelledby={`${feature.id}-heading`}>
		<div class="feature-heading">
			{#if feature.label}<p class="status">{feature.label}</p>{/if}
			<h2 id={`${feature.id}-heading`}>{feature.title}</h2>
		</div>

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
				<a class="sources" href={sourcesHref(feature)}>Sources <span aria-hidden="true">→</span></a>
			</p>
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
		margin-bottom: 1.5rem;
	}

	/* Release-status chip ("Preview"). Accent ink, not the accent fill colour:
	   the fill orange is 3.1:1 on the light paper and fails AA for small text. */
	.status {
		display: inline-block;
		margin-bottom: 0.75rem;
		padding: 0.2rem 0.6rem;
		border: 1px solid var(--site-accent-strong);
		border-radius: 999px;
		color: var(--site-accent-ink);
		font: 700 0.75rem/1.3 var(--site-font-mono);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	h2 {
		max-width: 22ch;
		font-size: clamp(1.75rem, 4vw, 3rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
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
		font-size: 0.875rem;
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
		color: var(--site-accent-ink);
	}

	.feature-links .sources {
		color: var(--site-muted);
		font-weight: 500;
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
		color: var(--site-accent-ink);
	}

	@media (max-width: 42rem) {
		.feature {
			padding: 2.5rem 0;
		}

		h2 {
			max-width: none;
		}
	}
</style>
