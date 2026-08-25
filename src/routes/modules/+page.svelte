<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import {
		applicationModuleClusters,
		focusedModuleClusters,
		foundationModuleClusters
	} from '$lib/data/modules';
	import { SMRT_VERSION } from '$lib/version';
	import ModuleCluster from './ModuleCluster.svelte';
</script>

<SEO
	title="s-m-r-t application modules"
	description="Explore released s-m-r-t application modules for identity, agents, content, commerce, projects, growth, domain knowledge, and mobile clients."
	url="https://s-m-r-t.dev/modules"
/>

<article class="modules-page">
	<header class="modules-hero">
		<div>
			<p>Application modules</p>
			<h1>Start with the application parts that already exist.</h1>
			<span>
				Choose an outcome. Each cluster connects released models, application behavior, UI, working
				examples, and exact Package Reference pages.
			</span>
		</div>
		<dl aria-label="Module overview">
			<div>
				<dt>Outcome clusters</dt>
				<dd>{applicationModuleClusters.length}</dd>
			</div>
			<div>
				<dt>Evidence release</dt>
				<dd>v{SMRT_VERSION}</dd>
			</div>
			<div>
				<dt>Package status</dt>
				<dd>Visible</dd>
			</div>
		</dl>
	</header>

	<nav class="cluster-index" aria-label="Application module clusters">
		<p>Choose an outcome</p>
		<ol>
			{#each applicationModuleClusters as cluster (cluster.id)}
				<li>
					<a href={`#${cluster.id}`}>
						<span>{cluster.eyebrow}</span>
						<strong>{cluster.title}</strong>
						<b aria-hidden="true">↓</b>
					</a>
				</li>
			{/each}
		</ol>
	</nav>

	<section class="module-group" aria-labelledby="largest-foundations">
		<header class="group-heading">
			<p>Largest time savers</p>
			<h2 id="largest-foundations">Application foundations</h2>
			<span>
				These clusters replace the widest sets of models, workflows, controls, and integration work.
			</span>
		</header>

		<div class="cluster-list cluster-list--foundations">
			{#each foundationModuleClusters as guide (guide.id)}
				<ModuleCluster {guide} />
			{/each}
		</div>
	</section>

	<section class="module-group" aria-labelledby="focused-outcomes">
		<header class="group-heading">
			<p>Focused outcomes</p>
			<h2 id="focused-outcomes">Connected application domains</h2>
			<span>
				Use these clusters when the application needs a specialized workflow or a native client
				foundation.
			</span>
		</header>

		<div class="cluster-list cluster-list--focused">
			{#each focusedModuleClusters as guide (guide.id)}
				<ModuleCluster {guide} />
			{/each}
		</div>
	</section>

	<footer class="modules-boundary">
		<div>
			<p>Know where to go next</p>
			<h2>Modules explain outcomes. Reference keeps the complete inventory.</h2>
		</div>
		<nav aria-label="Related documentation">
			<a href="/packages">Open Package Reference <span>→</span></a>
			<a href="/guides">Browse implementation Guides <span>→</span></a>
			<a href="/ui">Explore the shared UI system <span>→</span></a>
		</nav>
	</footer>
</article>

<style>
	.modules-page {
		width: min(76rem, calc(100% - 3rem));
		margin: 0 auto;
		padding: clamp(3rem, 7vw, 6rem) 0 6rem;
	}

	.modules-hero {
		display: grid;
		grid-template-columns: minmax(0, 1.7fr) minmax(17rem, 0.7fr);
		gap: 3rem;
		align-items: end;
		padding-bottom: 3rem;
		border-bottom: 1px solid var(--site-line-strong);
	}

	.modules-hero > div {
		max-width: 52rem;
	}

	.modules-hero p,
	.group-heading p,
	.modules-boundary p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.modules-hero h1 {
		margin-top: 0.8rem;
		font-size: clamp(2.75rem, 7vw, 5.7rem);
		letter-spacing: -0.06em;
		line-height: 0.95;
	}

	.modules-hero > div > span,
	.group-heading > span {
		display: block;
		max-width: 47rem;
		margin-top: 1.25rem;
		color: var(--site-muted);
		font-size: 1rem;
		line-height: 1.65;
	}

	.modules-hero dl {
		border-top: 1px solid var(--site-line-strong);
	}

	.modules-hero dl div {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 0;
		border-bottom: 1px solid var(--site-line);
	}

	.modules-hero dt {
		color: var(--site-muted);
		font-size: 0.72rem;
	}

	.modules-hero dd {
		font: 700 0.72rem var(--site-font-mono);
	}

	.cluster-index {
		padding: 2rem 0 4.5rem;
	}

	.cluster-index > p {
		margin-bottom: 0.7rem;
		color: var(--site-muted);
		font: 0.63rem var(--site-font-mono);
		text-transform: uppercase;
	}

	.cluster-index ol {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border-top: 1px solid var(--site-line-strong);
		border-left: 1px solid var(--site-line-strong);
		list-style: none;
	}

	.cluster-index li {
		border-right: 1px solid var(--site-line-strong);
		border-bottom: 1px solid var(--site-line-strong);
	}

	.cluster-index a {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		gap: 0.65rem;
		min-height: 5.4rem;
		align-items: start;
		padding: 0.9rem;
		color: var(--site-ink);
		text-decoration: none;
	}

	.cluster-index a:hover {
		background: var(--site-surface);
	}

	.cluster-index a span,
	.cluster-index a b {
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
	}

	.cluster-index a strong {
		font-size: 0.76rem;
		line-height: 1.35;
	}

	.module-group + .module-group {
		margin-top: 5rem;
	}

	.group-heading {
		max-width: 49rem;
		margin-bottom: 1.7rem;
	}

	.group-heading h2 {
		margin-top: 0.55rem;
		font-size: clamp(2rem, 5vw, 3.6rem);
		letter-spacing: -0.045em;
		line-height: 1;
	}

	.cluster-list {
		display: grid;
		gap: 1.25rem;
	}

	.cluster-list--focused {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
	}

	.modules-boundary {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(18rem, 0.75fr);
		gap: 3rem;
		margin-top: 5rem;
		padding: 2rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.modules-boundary h2 {
		max-width: 40rem;
		margin-top: 0.6rem;
		font-size: clamp(1.7rem, 4vw, 2.8rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}

	.modules-boundary nav {
		border-top: 1px solid var(--site-line-strong);
	}

	.modules-boundary a {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.8rem 0;
		border-bottom: 1px solid var(--site-line);
		color: var(--site-ink);
		font-size: 0.74rem;
		font-weight: 700;
		text-decoration: none;
	}

	.modules-boundary a span {
		color: var(--site-accent-strong);
	}

	@media (max-width: 68rem) {
		.cluster-list--focused {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 52rem) {
		.modules-hero,
		.modules-boundary {
			grid-template-columns: 1fr;
		}

		.cluster-index ol {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 38rem) {
		.modules-page {
			width: min(100% - 1.5rem, 76rem);
			padding-top: 2.5rem;
		}

		.cluster-index ol {
			grid-template-columns: 1fr;
		}

		.modules-boundary {
			padding: 1.25rem;
		}
	}
</style>
