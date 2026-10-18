<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import PlannerScreencast from '$lib/components/PlannerScreencast.svelte';
	import FeatureSections from '$lib/components/home/FeatureSections.svelte';
	import {
		appLayers,
		buildingBlockNouns,
		buildingBlocksScopeLede,
		unlayeredPackageCount
	} from '$lib/data/layers';
	import { frameworkModelProjections, homepageModelExample } from '$lib/data/framework';
	import { packages } from '$lib/data/packages';
	import { uiComponents } from '$lib/data/ui-components.generated';
	import { playgroundModules } from '$lib/data/playgrounds';
	import { whySmrtClaims } from '$lib/data/why-smrt-claims';
	import { SMRT_VERSION } from '$lib/version';

	// Every count below is derived from the same data the rest of the site reads
	// from — never hand-typed — so it cannot drift from the installed catalog.
	// See pinned-versions.test.ts for the rule this satisfies.
	const packageCount = $derived(packages.length);
	const componentCount = $derived(uiComponents.length);
	const playgroundCount = $derived(
		playgroundModules.reduce((total, module) => total + (module.entries?.length ?? 0), 0)
	);

	// The mobile claim (smrt-mobile / smrt-mobile-contract / smrt-android /
	// smrt-ios) stays out of the homepage evidence strip while those packages
	// are still `status: 'private'` in packages.ts (unpublished, source-only).
	// Restore this row once they publish to npm.
	const evidenceClaims = $derived(whySmrtClaims.filter((claim) => claim.id !== 'mobile-kmp'));

	const startPaths = [
		{
			label: 'Try it',
			body: 'build-a-boilerplate, in the browser, nothing installed.',
			href: '/build-a-boilerplate'
		},
		{
			label: 'Build one',
			body: 'A basic SvelteKit application, step by step.',
			href: '/starters/ground-up'
		},
		{
			label: 'Connect an agent',
			body: 'The doors, the defaults and the identity every call runs as.',
			href: '/agents'
		}
	];

	// Locked verbatim, character-for-character (approved landing-page
	// proposal, §3.3) — do not rephrase. Kept as one script-level string
	// (rather than split across template lines) so the rendered text can't
	// pick up incidental source-indentation whitespace.
	const saadlDefinition =
		'SAADL — Software as Agentic Domain Logic: software whose domain logic exposes the same operations to human users (UI, HTTP, CLI) and to software agents (callable tools).';
</script>

<SEO
	title="The s-m-r-t application stack"
	description="s-m-r-t builds business software that people and software agents use through the same screens, rules and permissions. build-a-boilerplate assembles a working mock-up in the browser and exports the plan as a cookbook file."
	url="https://s-m-r-t.dev"
/>

<article class="homepage">
	<header class="hero">
		<div class="hero-intro">
			<h1>The s-m-r-t application stack</h1>
			<p class="lede">
				s-m-r-t builds business software that people and software agents use through the same
				screens, rules and permissions. The fastest way to see it is to build one.
			</p>
			<div class="hero-actions">
				<a class="primary-link primary-link--hero" href="/build-a-boilerplate"
					>build-a-boilerplate <span aria-hidden="true">→</span></a
				>
				<a class="text-link" href="#what-you-get">How it works <span aria-hidden="true">↓</span></a>
			</div>
			<div class="hero-shot">
				<PlannerScreencast />
			</div>
			<p class="outcome-line">
				You leave with a cookbook file, or a prompt that has a coding agent build from it.
				<code>smrt cookbook apply</code> turns the file into a project: an app with an admin shell, an
				assistant inside it, tools for browser and MCP agents, and a local database. Running it still
				needs a terminal or a coding agent.
			</p>
		</div>

		<div class="hero-copy">
			<aside class="saadl-definition">
				<p><strong>{saadlDefinition}</strong> Pronounced "saddle."</p>
				<p>
					In plain terms: people and software agents use the same application, through the same
					doors, under the same rules.
				</p>
				<a class="text-link" href="/reference/saadl"
					>What is a SAADL? <span aria-hidden="true">→</span></a
				>
			</aside>

			<p class="scale-line">
				<span class="mono">{SMRT_VERSION}</span> · <span class="mono">{packageCount}</span>
				packages, released together · <span class="mono">{componentCount}</span> components ·
				<span class="mono">{playgroundCount}</span> working examples
			</p>
		</div>

		<ol class="mini-scope-map" aria-label="The s-m-r-t application stack in five layers">
			{#each appLayers as layer (layer.id)}
				<li>
					<a href="#scope">
						<span class="mini-index">{String(layer.index).padStart(2, '0')}</span>
						<span class="mini-name">{layer.name}</span>
						<span class="mini-count">{layer.packages.length}</span>
					</a>
				</li>
			{/each}
		</ol>
	</header>

	<section class="outcome-section" id="what-you-get" aria-labelledby="outcome-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">What you get</p>
				<h2 id="outcome-heading">A working application, not a template</h2>
			</div>
		</div>
		<p class="section-copy">
			The starting points cover common businesses: a bakery, a repair shop, a salon, a non-profit,
			an agency. Each one is a list of recipes — Customers, Estimates, Invoicing, Bookkeeping — and
			every recipe brings its screens, its rules and its sample data. Change the list and the
			mock-up changes with it. The Export tab writes the plan to a file; the plan is JSON you can
			read.
		</p>
	</section>

	<!--
		Slice B (happyvertical/s-m-r-t.dev#321): the six feature sections — the
		in-app assistant, propose-then-confirm, reports on request, paperwork
		intake, who can see what, and outside agents — render here, between
		"What you get" and "Describe the record once", from
		`src/lib/data/homepage-features.ts` through one component.
	-->
	<div class="feature-sections-slot" data-slot="homepage-features">
		<FeatureSections />
	</div>

	<section class="model-section" id="one-description" aria-labelledby="model-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">One description, every surface</p>
				<h2 id="model-heading">Describe the record once</h2>
			</div>
			<p>
				One class says what a record stores, which actions are available on the web and to agents,
				and which fields are required, read-only or secret. Storage, forms, the API, the command
				line, the agent tools and the permissions are generated from it. Change the description and
				every surface changes with it.
			</p>
		</div>
		<div class="model-grid">
			<CodeBlock code={homepageModelExample} filename="src/lib/objects/Article.ts" />
			<div class="model-aside">
				<p class="projection-label">Generated from it</p>
				<ul class="projection-list" aria-label="Surfaces generated from the record description">
					{#each frameworkModelProjections as projection (projection.label)}
						<li>
							<a href={projection.href}>{projection.label} <b aria-hidden="true">→</b></a>
						</li>
					{/each}
				</ul>
				<a class="text-link" href="/framework"
					>Framework overview <span aria-hidden="true">→</span></a
				>
			</div>
		</div>
	</section>

	<section class="scope-section" id="scope" aria-labelledby="scope-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Scope · The package catalog</p>
				<h2 id="scope-heading">Five layers, one release</h2>
			</div>
			<p>
				This is what each layer contains. Every package releases together, at the same version. Each
				package name below links to its page in the catalog.
			</p>
		</div>

		<div class="layer-diagram">
			{#each appLayers as layer (layer.id)}
				<div class="layer-band">
					<div class="layer-band-head">
						<span class="layer-index">{String(layer.index).padStart(2, '0')}</span>
						<h3>{layer.name}</h3>
						<span class="layer-count">{layer.packages.length}</span>
					</div>
					<p class="layer-role">
						{#if layer.id === 'building-blocks'}
							{buildingBlocksScopeLede}
							{#each buildingBlockNouns as noun, index (noun.label)}{index > 0 ? ', ' : ''}<a
									href={noun.href}>{noun.label}</a
								>{/each}.
						{:else}
							{layer.scopeCopy}
						{/if}
					</p>
					<ul class="layer-chips">
						{#each layer.chips as chip (chip.slug)}
							<li><a href={`/reference/packages/${chip.slug}`}>{chip.shortName}</a></li>
						{/each}
					</ul>
					<a class="layer-catalog-link" href="/reference/packages"
						>Browse in the catalog <span aria-hidden="true">→</span></a
					>
				</div>
			{/each}
		</div>

		<p class="scope-reconciliation">
			These five layers place {packageCount - unlayeredPackageCount} of the catalog's {packageCount}
			packages. The rest is native mobile — source-only and unpublished — plus the command-line, testing,
			and project-scaffold packages: see <a href="/tooling">Tooling</a>, the
			<a href="/capabilities/mobile">Mobile capability page</a>, and the
			<a href="/reference/packages">full catalog</a>.
		</p>
	</section>

	<section class="evidence-section" aria-labelledby="evidence-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Evidence · Release-audited claims</p>
				<h2 id="evidence-heading">Every claim on this page has a source</h2>
			</div>
			<p>
				Each row links a claim to the page that explains it and to the released source it was
				verified against.
			</p>
		</div>
		<div class="evidence-table-wrap">
			<table class="evidence-table">
				<thead>
					<tr>
						<th scope="col">Claim</th>
						<th scope="col">Explained at</th>
						<th scope="col">Verified in</th>
						<th scope="col">Try it</th>
					</tr>
				</thead>
				<tbody>
					{#each evidenceClaims as claim (claim.id)}
						<tr>
							<td data-label="Claim">{claim.display}</td>
							<td data-label="Explained at"
								><a href={claim.canonical.href}>{claim.canonical.label}</a></td
							>
							<td data-label="Verified in"><a href={claim.source.href}>{claim.source.label}</a></td>
							<td data-label={claim.demo ? 'Try it' : undefined}
								>{#if claim.demo}<a href={claim.demo.href}>{claim.demo.label}</a>{/if}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section class="start-section" id="start-here" aria-labelledby="start-heading">
		<div>
			<p class="eyebrow">Start here</p>
			<h2 id="start-heading">Three ways in</h2>
			<p class="start-note">
				Coding agents: every installed package ships instructions written for that exact version,
				and a read-only development server answers questions about the project.
				<a href="/tooling">Tooling <span aria-hidden="true">→</span></a>
			</p>
		</div>
		<nav aria-label="Start paths">
			{#each startPaths as path, index (path.href)}
				<a href={path.href} class:primary-link={index === 0}>
					<strong>{path.label}</strong>
					<span>{path.body}</span>
					<b aria-hidden="true">→</b>
				</a>
			{/each}
		</nav>
	</section>
</article>

<style>
	.homepage {
		width: min(70rem, calc(100% - 3rem));
		margin: 0 auto;
		padding: clamp(2.5rem, 7vw, 5.5rem) 0 6rem;
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 0.9fr);
		gap: clamp(2.5rem, 7vw, 5rem);
		align-items: center;
		padding-bottom: clamp(4rem, 9vw, 7rem);
	}

	.hero-intro {
		grid-column: 1 / -1;
		min-width: 0;
	}

	.hero-intro h1 {
		color: var(--site-accent-strong);
		font: 700 0.78rem var(--site-font-mono);
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.hero-shot {
		min-width: 0;
		margin-top: 1.75rem;
	}

	.hero-intro .lede {
		margin-top: 0.9rem;
		max-width: 34em;
		color: var(--site-ink);
		font-size: clamp(1.45rem, 2.4vw, 1.8rem);
		font-weight: 400;
		letter-spacing: -0.015em;
		line-height: 1.4;
		text-wrap: pretty;
	}

	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem 1.5rem;
		margin-top: 1.6rem;
	}

	.hero-actions .text-link {
		margin-top: 0;
	}

	.primary-link {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 2.75rem;
		padding: 0 1.1rem;
		border-radius: var(--site-radius-md);
		background: var(--site-accent-strong);
		color: var(--smrt-color-on-primary, #ffffff);
		font-size: 0.85rem;
		font-weight: 700;
		text-decoration: none;
	}

	.primary-link span {
		color: inherit;
	}

	.primary-link--hero {
		min-height: 3.25rem;
		padding: 0 1.5rem;
		font-size: 1rem;
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.12);
	}

	.primary-link--hero:hover,
	.primary-link--hero:focus-visible {
		filter: brightness(1.08);
	}

	.outcome-line {
		max-width: 44rem;
		margin-top: 1rem;
		color: var(--site-muted);
		font-size: 0.92rem;
		line-height: 1.65;
	}

	.outcome-line code {
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: var(--site-ink);
	}

	.saadl-definition {
		max-width: 42rem;
		padding: 1.1rem 1.25rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.saadl-definition p {
		color: var(--site-muted);
		font-size: 0.86rem;
		line-height: 1.6;
	}

	.saadl-definition p + p {
		margin-top: 0.6rem;
	}

	.saadl-definition strong {
		color: var(--site-ink);
	}

	.scale-line {
		max-width: 42rem;
		margin-top: 1.4rem;
		color: var(--site-muted);
		font: 0.76rem var(--site-font-mono);
		letter-spacing: 0.01em;
	}

	.scale-line .mono {
		color: var(--site-accent-strong);
		font-weight: 700;
	}

	.text-link {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 2.75rem;
		margin-top: 1.35rem;
		color: var(--site-ink);
		font-size: 0.8rem;
		font-weight: 700;
		text-underline-offset: 0.3rem;
	}

	.text-link span {
		color: var(--site-accent-strong);
	}

	.mini-scope-map {
		align-self: start;
		display: grid;
		gap: 0;
		list-style: none;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		overflow: hidden;
		background: var(--site-surface);
	}

	.mini-scope-map li {
		border-bottom: 1px solid var(--site-line);
	}

	.mini-scope-map li:last-child {
		border-bottom: 0;
	}

	.mini-scope-map a {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		min-height: 3rem;
		padding: 0 1.1rem;
		border-left: 2px solid var(--site-accent-strong);
		color: var(--site-ink);
		text-decoration: none;
	}

	.mini-scope-map a:hover {
		background: var(--site-accent-soft);
	}

	.mini-index {
		color: var(--site-accent-strong);
		font: 700 0.68rem var(--site-font-mono);
	}

	.mini-name {
		flex: 1;
		font-size: 0.86rem;
		font-weight: 700;
	}

	.mini-count {
		color: var(--site-muted);
		font: 0.7rem var(--site-font-mono);
	}

	section {
		padding: clamp(3.5rem, 8vw, 6rem) 0;
		border-top: 1px solid var(--site-line);
		scroll-margin-top: 5.5rem;
	}

	.eyebrow {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	h2 {
		margin-top: 0.65rem;
		font-size: clamp(1.9rem, 4.5vw, 3.4rem);
		letter-spacing: -0.05em;
		line-height: 1.05;
	}

	.section-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.section-heading > p {
		max-width: 29rem;
		color: var(--site-muted);
		font-size: 0.84rem;
		line-height: 1.58;
	}

	.outcome-section .section-heading {
		margin-bottom: 1.25rem;
	}

	.section-copy {
		max-width: 48rem;
		color: var(--site-muted);
		font-size: 0.95rem;
		line-height: 1.65;
	}

	.model-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(16rem, 0.75fr);
		gap: 1.5rem;
		align-items: start;
	}

	.projection-label {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.projection-list {
		margin-top: 0.5rem;
		border-top: 1px solid var(--site-line);
		list-style: none;
	}

	.projection-list li {
		border-bottom: 1px solid var(--site-line);
	}

	.projection-list a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 2.75rem;
		padding: 0.5rem 0.25rem;
		color: var(--site-ink);
		font-size: 0.82rem;
		font-weight: 700;
		text-decoration: none;
	}

	.projection-list a:hover,
	.projection-list a:focus-visible {
		color: var(--site-accent-strong);
	}

	.projection-list b {
		color: var(--site-accent-strong);
		font-weight: 500;
	}

	.layer-diagram {
		display: grid;
		gap: 0;
		border-top: 1px solid var(--site-line-strong);
	}

	.layer-band {
		display: grid;
		grid-template-columns: 14rem minmax(0, 1fr) auto;
		gap: 1rem 1.5rem;
		align-items: start;
		padding: 1.5rem 0;
		border-bottom: 1px solid var(--site-line-strong);
	}

	.layer-band-head {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
	}

	.layer-index {
		color: var(--site-accent-strong);
		font: 700 0.68rem var(--site-font-mono);
	}

	.layer-band-head h3 {
		font-size: 1rem;
	}

	.layer-count {
		margin-left: auto;
		color: var(--site-muted);
		font: 700 0.68rem var(--site-font-mono);
	}

	.layer-role {
		grid-column: 2;
		max-width: 42rem;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.55;
	}

	.layer-role a {
		color: var(--site-ink);
	}

	.layer-chips {
		grid-column: 1 / -1;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 0.4rem;
		list-style: none;
	}

	.layer-chips a {
		display: inline-flex;
		padding: 0.25rem 0.55rem;
		border: 1px solid var(--site-line-strong);
		border-radius: 999px;
		color: var(--site-muted);
		font: 0.63rem var(--site-font-mono);
		text-decoration: none;
	}

	.layer-chips a:hover,
	.layer-chips a:focus-visible {
		border-color: var(--site-accent-strong);
		color: var(--site-ink);
	}

	.layer-catalog-link {
		grid-column: 3;
		grid-row: 1;
		justify-self: end;
		color: var(--site-ink);
		font-size: 0.72rem;
		font-weight: 700;
		text-underline-offset: 0.25rem;
		white-space: nowrap;
	}

	.layer-catalog-link span {
		color: var(--site-accent-strong);
	}

	.scope-reconciliation {
		max-width: 46rem;
		margin-top: 1.5rem;
		color: var(--site-muted);
		font-size: 0.78rem;
		line-height: 1.6;
	}

	.scope-reconciliation a {
		color: var(--site-ink);
	}

	.evidence-table-wrap {
		overflow-x: auto;
	}

	.evidence-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.82rem;
	}

	.evidence-table th {
		padding: 0.6rem 0.75rem;
		border-bottom: 2px solid var(--site-line-strong);
		color: var(--site-muted);
		font: 700 0.64rem var(--site-font-mono);
		letter-spacing: 0.05em;
		text-align: left;
		text-transform: uppercase;
	}

	.evidence-table td {
		padding: 0.85rem 0.75rem;
		border-bottom: 1px solid var(--site-line);
		vertical-align: top;
	}

	.evidence-table td:first-child {
		max-width: 24rem;
		color: var(--site-ink);
	}

	.evidence-table a {
		color: var(--site-ink);
		font-family: var(--site-font-mono);
		font-size: 0.78rem;
	}

	.start-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.72fr);
		gap: clamp(2rem, 7vw, 5rem);
		margin-top: clamp(2rem, 5vw, 4rem);
		padding-inline: clamp(1.5rem, 5vw, 4rem);
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background: var(--site-accent-soft);
	}

	.start-note {
		max-width: 40rem;
		margin-top: 1rem;
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.65;
	}

	.start-note a {
		color: var(--site-ink);
		font-weight: 700;
		text-underline-offset: 0.25rem;
	}

	.start-note a span {
		color: var(--site-accent-strong);
	}

	.start-section nav {
		display: grid;
		align-content: center;
		gap: 0.55rem;
	}

	.start-section nav a {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.2rem 1rem;
		align-items: center;
		min-height: 3rem;
		padding: 0.8rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--site-accent-strong) 35%, var(--site-line));
		border-radius: calc(var(--site-radius-md) - 0.25rem);
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}

	.start-section nav a:hover {
		border-color: var(--site-accent-strong);
	}

	.start-section nav strong {
		grid-column: 1;
		font-size: 0.82rem;
	}

	.start-section nav span {
		grid-column: 1;
		color: var(--site-muted);
		font-size: 0.74rem;
		line-height: 1.5;
	}

	.start-section nav b {
		grid-column: 2;
		grid-row: 1 / span 2;
		color: var(--site-accent-strong);
		font-weight: 500;
	}

	.start-section nav a.primary-link {
		background: var(--site-accent-strong);
		color: var(--smrt-color-on-primary, #fff);
	}

	.start-section nav a.primary-link span,
	.start-section nav a.primary-link b {
		color: inherit;
	}

	@media (max-width: 64rem) {
		.layer-band {
			grid-template-columns: 1fr;
		}

		.layer-catalog-link {
			grid-column: 1;
			grid-row: auto;
			justify-self: start;
		}

		.layer-role {
			grid-column: 1;
		}
	}

	@media (max-width: 58rem) {
		.hero,
		.model-grid,
		.start-section {
			grid-template-columns: 1fr;
		}

		.hero {
			gap: 2.5rem;
		}

		.mini-scope-map {
			max-width: 42rem;
		}

		.start-section {
			gap: 2rem;
		}
	}

	@media (max-width: 42rem) {
		.homepage {
			width: min(100% - 2rem, 70rem);
		}

		.section-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.9rem;
		}

		.evidence-table thead {
			display: none;
		}

		.evidence-table,
		.evidence-table tbody,
		.evidence-table tr,
		.evidence-table td {
			display: block;
			width: 100%;
		}

		.evidence-table tr {
			padding: 0.75rem 0;
			border-bottom: 1px solid var(--site-line-strong);
		}

		.evidence-table td {
			padding: 0.3rem 0;
			border-bottom: 0;
		}

		.evidence-table td:empty {
			display: none;
		}

		.evidence-table td::before {
			content: attr(data-label);
			display: block;
			margin-bottom: 0.2rem;
			color: var(--site-muted);
			font: 700 0.6rem var(--site-font-mono);
			letter-spacing: 0.05em;
			text-transform: uppercase;
		}
	}
</style>
