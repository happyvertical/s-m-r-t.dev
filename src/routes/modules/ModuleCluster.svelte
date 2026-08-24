<script lang="ts">
	import type { ApplicationModuleCluster } from '$lib/data/modules';
	import { getPlaygroundEntries } from '$lib/data/playgrounds';

	let { guide }: { guide: ApplicationModuleCluster } = $props();
</script>

<section
	class:cluster-card--foundation={guide.status === 'foundation'}
	class="cluster-card"
	id={guide.id}
	aria-labelledby={`${guide.id}-title`}
>
	<header class="cluster-heading">
		<span>{guide.eyebrow}</span>
		<div>
			<p>{guide.status === 'foundation' ? 'Application foundation' : 'Application domain'}</p>
			<h2 id={`${guide.id}-title`}>{guide.title}</h2>
			<strong>{guide.summary}</strong>
		</div>
	</header>

	<div class="cluster-content">
		<div class="cluster-story">
			<section>
				<h3>Models and application behavior</h3>
				{#each guide.highlights as paragraph (paragraph)}<p>{paragraph}</p>{/each}
			</section>
			<section>
				<h3>Frontend components</h3>
				{#each guide.details as paragraph (paragraph)}<p>{paragraph}</p>{/each}
			</section>
			<section>
				<h3>Framework and UI integration</h3>
				{#each guide.foundation as paragraph (paragraph)}<p>{paragraph}</p>{/each}
			</section>
			<section class="time-saved">
				<h3>Time and integration work removed</h3>
				<p>{guide.body}</p>
			</section>
			<section class="limitations">
				<h3>Limits and maturity</h3>
				<ul>
					{#each guide.warning as limitation (limitation)}<li>{limitation}</li>{/each}
				</ul>
			</section>
		</div>

		<aside class="cluster-evidence" aria-label={`${guide.title} evidence and links`}>
			<section>
				<h3>Key packages</h3>
				<ul class="package-list">
					{#each guide.packages as pkg (pkg.slug)}
						<li>
							<a href={`/packages/${pkg.slug}`}>
								<strong>@happyvertical/{pkg.slug}</strong>
								<span>{pkg.status}</span>
							</a>
						</li>
					{/each}
				</ul>
				<a class="reference-link" href="/packages">Complete Package Reference →</a>
			</section>

			<section>
				<h3>Working Playground examples</h3>
				{#if guide.demo.length}
					<ul class="evidence-list">
						{#each guide.demo as slug (slug)}
							<li>
								<a href={`/packages/${slug}?tab=playground`}>
									<strong>@happyvertical/{slug}</strong>
									<span>{getPlaygroundEntries(slug).join(' · ')}</span>
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="gap-note">No browser Playground example is available for this cluster.</p>
				{/if}
			</section>

			<section>
				<h3>Related implementation Guides</h3>
				{#if guide.guides.length}
					<ul class="guide-list">
						{#each guide.guides as link (link.href)}
							<li><a href={link.href}>{link.label} <span>→</span></a></li>
						{/each}
					</ul>
				{:else}
					<p class="gap-note">{guide.note}</p>
				{/if}
			</section>
		</aside>
	</div>
</section>

<style>
	.cluster-card {
		scroll-margin-top: 6rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
		overflow: hidden;
	}

	.cluster-card--foundation {
		border-top: 3px solid var(--site-accent-strong);
	}

	.cluster-heading {
		display: grid;
		grid-template-columns: 3.5rem minmax(0, 1fr);
		gap: 1.1rem;
		padding: 1.5rem;
		border-bottom: 1px solid var(--site-line-strong);
	}

	.cluster-heading > span {
		color: var(--site-accent-strong);
		font: 500 1.45rem var(--site-font-mono);
	}

	.cluster-heading p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.cluster-heading h2 {
		margin-top: 0.35rem;
		font-size: clamp(1.65rem, 4vw, 2.8rem);
		letter-spacing: -0.04em;
		line-height: 1;
	}

	.cluster-heading strong {
		display: block;
		max-width: 46rem;
		margin-top: 0.8rem;
		font-size: 0.88rem;
		font-weight: 500;
		line-height: 1.55;
	}

	.cluster-content {
		display: grid;
		grid-template-columns: minmax(0, 1.45fr) minmax(18rem, 0.75fr);
	}

	.cluster-story,
	.cluster-evidence {
		padding: 1.5rem;
	}

	.cluster-story {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem 2rem;
	}

	.cluster-story section {
		min-width: 0;
	}

	.cluster-story h3,
	.cluster-evidence h3 {
		margin-bottom: 0.65rem;
		font-size: 0.72rem;
		letter-spacing: 0.02em;
	}

	.cluster-story p,
	.cluster-story li,
	.gap-note {
		color: var(--site-muted);
		font-size: 0.74rem;
		line-height: 1.58;
	}

	.cluster-story p + p {
		margin-top: 0.55rem;
	}

	.time-saved {
		padding: 1rem;
		border-left: 3px solid var(--site-accent-strong);
		background: var(--site-surface-high);
	}

	.limitations ul {
		padding-left: 1.1rem;
	}

	.limitations li + li {
		margin-top: 0.4rem;
	}

	.cluster-evidence {
		border-left: 1px solid var(--site-line-strong);
		background: var(--site-surface-high);
	}

	.cluster-evidence > section + section {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--site-line);
	}

	.package-list,
	.evidence-list,
	.guide-list {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}

	.package-list li,
	.evidence-list li,
	.guide-list li {
		border-bottom: 1px solid var(--site-line);
	}

	.package-list a,
	.evidence-list a,
	.guide-list a {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.65rem 0;
		color: var(--site-ink);
		font-size: 0.7rem;
		text-decoration: none;
	}

	.package-list a:hover strong,
	.evidence-list a:hover strong,
	.guide-list a:hover {
		text-decoration: underline;
		text-decoration-color: var(--site-accent-strong);
		text-underline-offset: 0.2rem;
	}

	.package-list a > span {
		color: var(--site-muted);
		font: 0.58rem var(--site-font-mono);
		text-align: right;
	}

	.evidence-list a {
		display: block;
	}

	.evidence-list a span {
		display: block;
		margin-top: 0.3rem;
		color: var(--site-muted);
		font-size: 0.62rem;
		line-height: 1.45;
	}

	.guide-list a span {
		color: var(--site-accent-strong);
	}

	.reference-link {
		display: inline-block;
		margin-top: 0.8rem;
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
		text-decoration: none;
	}

	@media (max-width: 52rem) {
		.cluster-content {
			grid-template-columns: 1fr;
		}

		.cluster-evidence {
			border-top: 1px solid var(--site-line-strong);
			border-left: 0;
		}
	}

	@media (max-width: 38rem) {
		.cluster-story {
			grid-template-columns: 1fr;
		}

		.cluster-heading {
			grid-template-columns: 2.5rem minmax(0, 1fr);
			padding: 1.1rem;
		}

		.cluster-story,
		.cluster-evidence {
			padding: 1.1rem;
		}
	}
</style>
