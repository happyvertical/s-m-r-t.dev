<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import AgentAwareFormDemo from '$lib/ui-showcase/AgentAwareFormDemo.svelte';
	import UIShowcaseDataTable from '$lib/ui-showcase/UIShowcaseDataTable.svelte';
	import {
		appLayers,
		buildingBlockNouns,
		buildingBlocksHeroLede,
		buildingBlocksScopeLede,
		unlayeredPackageCount
	} from '$lib/data/layers';
	import { frameworkModelProjections, homepageModelExample } from '$lib/data/framework';
	import { packages } from '$lib/data/packages';
	import { uiComponents } from '$lib/data/ui-components.generated';
	import { playgroundModules } from '$lib/data/playgrounds';
	import { applicationModuleClusters } from '$lib/data/modules';
	import { whySmrtClaims } from '$lib/data/why-smrt-claims';
	import { SMRT_VERSION } from '$lib/version';

	const participants = [
		{
			label: 'Persons',
			body: 'Use visible controls, natural language, chat, and voice.'
		},
		{
			label: 'Application agents',
			body: 'Discover declared controls and operations within assigned authority.'
		},
		{
			label: 'Developers',
			body: 'Define application behavior once and maintain fewer parallel interfaces.'
		},
		{
			label: 'Coding agents',
			body: 'Read deterministic project knowledge and version-matched instructions.'
		}
	];

	const modelParts = ['Fields', 'Relationships', 'Operations', 'Permissions'];

	const featureSections = [
		{
			label: 'Framework',
			body: 'Models, persistence, identity, security, and generated interfaces.',
			href: '/framework'
		},
		{
			label: 'Interaction',
			body: 'Natural language, shared control, proposals, confirmations, and refusals.',
			href: '/interaction'
		},
		{
			label: 'UI',
			body: 'Accessible controls, forms, data views, feedback, and application structure.',
			href: '/ui'
		},
		{
			label: 'Modules',
			body: 'Prebuilt application outcomes that use the same framework contracts.',
			href: '/modules'
		},
		{
			label: 'Tooling',
			body: 'Deterministic workspace knowledge for developers and coding agents.',
			href: '/tooling'
		},
		{
			label: 'Playground',
			body: 'Released controls and package views in a standalone workbench.',
			href: '/playground'
		},
		{
			label: 'Reference',
			body: 'Exhaustive interface, security, configuration, and package contracts.',
			href: '/reference'
		}
	];

	// Every count below is derived from the same data the rest of the site reads
	// from — never hand-typed — so it cannot drift from the installed catalog.
	// See pinned-versions.test.ts for the rule this satisfies.
	const packageCount = $derived(packages.length);
	const componentCount = $derived(uiComponents.length);
	const playgroundCount = $derived(
		playgroundModules.reduce((total, module) => total + (module.entries?.length ?? 0), 0)
	);
	const moduleGroupCount = $derived(applicationModuleClusters.length);

	// The mobile claim (smrt-mobile / smrt-mobile-contract / smrt-android /
	// smrt-ios) stays out of the homepage evidence strip while those packages
	// are still `status: 'private'` in packages.ts (unpublished, source-only).
	// Restore this row once they publish to npm.
	const evidenceClaims = $derived(whySmrtClaims.filter((claim) => claim.id !== 'mobile-kmp'));

	interface SolutionLink {
		label: string;
		href: string;
	}

	interface SolutionGroup {
		title: string;
		body: string;
		includes: string;
		includesLinks: SolutionLink[];
	}

	const solutionGroups: SolutionGroup[] = [
		{
			title: 'Working with records',
			body: 'Tables and forms for finding, reading, and changing records: search, filters, sorting, saved views, and changes a person reviews before they apply. The table below is one of these tools, running here — everything about its current view fits in a link that can be saved or shared.',
			includes: 'DataTable, forms with staged review',
			includesLinks: [{ label: 'smrt-ui components', href: '/packages/smrt-ui?tab=components' }]
		},
		{
			title: 'Content management',
			body: 'Writing, reviewing, and publishing: drafts, versions, review policies, corrections, and held submissions from outside contributors.',
			includes: 'the content list with saved views, the governance screens',
			includesLinks: [
				{ label: 'smrt-content components', href: '/packages/smrt-content?tab=components' }
			]
		},
		{
			title: 'Reports and analytics',
			body: 'Numbers kept current: reports declared once and refreshed on a schedule, with saved views and exports; visitor analytics from common providers alongside.',
			includes: 'report tables and saved views',
			includesLinks: [
				{ label: 'smrt-reports', href: '/packages/smrt-reports' },
				{ label: 'smrt-analytics', href: '/packages/smrt-analytics?tab=components' }
			]
		},
		{
			title: 'Conversation',
			body: "Chat rooms and threads where people and agents talk, with each agent's allowed tools set by the application. Voice input where the device supports it.",
			includes: 'chat layouts, agent sessions, voice input',
			includesLinks: [
				{ label: 'smrt-chat', href: '/packages/smrt-chat?tab=components' },
				{ label: 'smrt-svelte', href: '/packages/smrt-svelte?tab=components' }
			]
		}
	];

	const recordsGroup = $derived(solutionGroups[0]);
	const linkOnlyGroups = $derived(solutionGroups.slice(1));

	// Locked verbatim, character-for-character (approved landing-page
	// proposal, §3.3) — do not rephrase. Kept as one script-level string
	// (rather than split across template lines) so the rendered text can't
	// pick up incidental source-indentation whitespace.
	const saadlDefinition =
		'SAADL — Software as Agentic Domain Logic: software whose domain logic exposes the same operations to human users (UI, HTTP, CLI) and to software agents (callable tools).';
</script>

<SEO
	title="The s-m-r-t application stack"
	description="A TypeScript stack in five layers, released together at one version: foundations, identity and roles, ready-made building blocks, agents included, and screens and controls — for people and software agents."
	url="https://s-m-r-t.dev"
/>

<article class="homepage">
	<header class="hero">
		<div class="hero-copy">
			<h1>The s-m-r-t application stack</h1>
			<p class="lede">
				A TypeScript stack in five layers. Every layer releases together, at the same version.
			</p>
			<ul class="layer-lede-list">
				{#each appLayers as layer (layer.id)}
					<li>
						<strong>{layer.name}</strong>
						{#if layer.id === 'building-blocks'}
							— {buildingBlocksHeroLede}
							{#each buildingBlockNouns as noun, index (noun.label)}{index > 0 ? ', ' : ''}<a
									href={noun.href}>{noun.label}</a
								>{/each}.
						{:else}
							— {layer.heroLine}
						{/if}
					</li>
				{/each}
			</ul>

			<aside class="saadl-definition">
				<p><strong>{saadlDefinition}</strong> Pronounced "saddle."</p>
				<p>
					In plain terms: people and software agents use the same application, through the same
					doors, under the same rules.
				</p>
				<a class="text-link" href="/reference/saadl">What is a SAADL? <span>→</span></a>
			</aside>

			<p class="scale-line">
				<span class="mono">{SMRT_VERSION}</span> · <span class="mono">{packageCount}</span>
				documented packages · <span class="mono">{componentCount}</span> components ·
				<span class="mono">{playgroundCount}</span> playground entries
			</p>

			<a class="text-link" href="#what-you-get">See how the interfaces connect <span>↓</span></a>
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

	<section class="model-section" id="what-you-get" aria-labelledby="model-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">What you get · One description, every surface</p>
				<h2 id="model-heading">Describe the record once</h2>
			</div>
			<p>
				This is one record type, described once. The description says what the record stores, which
				actions are available on the web and to agents, and which fields are required, read-only, or
				secret. The surfaces it selects are generated from it: the storage, the forms, the web API,
				the agent tools, and the permissions.
			</p>
		</div>
		<div class="model-grid">
			<CodeBlock code={homepageModelExample} filename="src/lib/objects/Article.ts" />
			<ul class="projection-list">
				{#each frameworkModelProjections as projection (projection.label)}
					<li>
						<a href={projection.href}>
							<strong>{projection.label}</strong>
							<span>{projection.body}</span>
							<b aria-hidden="true">→</b>
						</a>
					</li>
				{/each}
			</ul>
		</div>
		<p class="model-note">
			Change the description and every surface changes with it. There are no separate copies to keep
			in sync.
		</p>
		<a class="text-link" href="/framework">Read the Framework overview <span>→</span></a>
	</section>

	<section class="interaction-section" id="how-it-works" aria-labelledby="interaction-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">How it works · People and agents, same rules</p>
				<h2 id="interaction-heading">An agent can propose a change. A person applies it.</h2>
			</div>
		</div>

		<div class="interaction-copy">
			<p>
				Every button and field in a s-m-r-t application carries a description an agent can read:
				what it is, what values it accepts, and who may use it. In the demo below, an agent finds a
				field, checks a new value against the same rule a person sees, and sets its proposal beside
				the current value. Nothing changes until a person clicks confirm — and that click is
				something an agent cannot send. The red panel at the end is not an error: the agent asks for
				a protected field, and the application refuses.
			</p>
			<p>
				An agent never acts on its own authority. It can do only what three lists all allow: what
				the signed-in person may do, what its kind of agent may ever do, and what its assigned role
				permits. The check runs everywhere — when the agent looks, when it offers, when it acts, and
				at the stored record itself.
			</p>
			<p class="run-steps">
				Run each step below. The same demo, with its technical notes, is on the
				<a href="/ui">UI overview</a> and in the
				<a href="/playground?entry=agent-aware-form">Playground</a>.
			</p>
		</div>

		<div class="participant-map" aria-label="Four participants use one application model">
			<div class="model-core">
				<span>Shared definition</span>
				<strong>One application model</strong>
				<ul>
					{#each modelParts as part (part)}
						<li>{part}</li>
					{/each}
				</ul>
			</div>
			<ul class="participant-list">
				{#each participants as participant (participant.label)}
					<li>
						<strong>{participant.label}</strong>
						<span>{participant.body}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div class="agent-demo-embed">
			<AgentAwareFormDemo />
		</div>

		<p class="interaction-closing">
			The propose-then-confirm pattern ships with the toolkit as a released component (<code
				>StagedControlReview</code
			>) — not something each application builds for itself. This demo drives the same registry
			directly, one storyboard step at a time, so each stage keeps its own button.
		</p>
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
							<li><a href={`/packages/${chip.slug}`}>{chip.shortName}</a></li>
						{/each}
					</ul>
					<a class="layer-catalog-link" href="/packages"
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
			<a href="/packages">full catalog</a>.
		</p>

		<nav class="scope-feature-links" aria-label="Documentation destinations">
			{#each featureSections as feature, index (feature.href)}
				<a href={feature.href}>
					<span class="feature-index">{String(index + 1).padStart(2, '0')}</span>
					<span class="feature-label">{feature.label}</span>
				</a>
			{/each}
		</nav>

		<div class="inventory-strip">
			<a href="/packages">
				<strong>{packageCount}</strong>
				<span>documented packages</span>
			</a>
			<a href="/reference/components">
				<strong>{componentCount}</strong>
				<span>documented components</span>
			</a>
			<a href="/playground">
				<strong>{playgroundCount}</strong>
				<span>working examples</span>
			</a>
			<a href="/modules">
				<strong>{moduleGroupCount}</strong>
				<span>building-block groups</span>
			</a>
		</div>
	</section>

	<section class="solutions-section" aria-labelledby="solutions-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">UI · Tools people operate</p>
				<h2 id="solutions-heading">What you can build</h2>
			</div>
			<p>
				The building blocks come with their screens. These are the kinds of tools an application
				assembles from the released parts. This site is built from the same packages, and the
				Playground holds working examples from each group.
			</p>
		</div>

		<div class="solution-groups">
			<article class="solution-group solution-group-live">
				<h3>{recordsGroup.title}</h3>
				<p>{recordsGroup.body}</p>
				<div class="live-table-embed">
					<UIShowcaseDataTable variant="compact" />
				</div>
				<p class="includes">
					<em
						>Includes: {recordsGroup.includes} →
						{#each recordsGroup.includesLinks as link, index (link.href)}{index > 0 ? ' · ' : ''}<a
								href={link.href}>{link.label}</a
							>{/each}</em
					>
				</p>
			</article>

			{#each linkOnlyGroups as group (group.title)}
				<article class="solution-group">
					<h3>{group.title}</h3>
					<p>{group.body}</p>
					<p class="includes">
						<em
							>Includes: {group.includes} →
							{#each group.includesLinks as link, index (link.href)}{index > 0 ? ' · ' : ''}<a
									href={link.href}>{link.label}</a
								>{/each}</em
						>
					</p>
				</article>
			{/each}
		</div>

		<div class="solutions-links">
			<a href="/ui">Browse the UI overview <span>→</span></a>
			<a href="/playground">Open the Playground <span>→</span></a>
		</div>
	</section>

	<section class="builder-section" id="what-you-lose" aria-labelledby="builder-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">What you lose · Separate copies to keep in sync</p>
				<h2 id="builder-heading">Built for the people who build it</h2>
			</div>
		</div>
		<div class="builder-grid">
			<article>
				<span>Developers</span>
				<p>
					Describe the application once instead of keeping several copies in sync. A new application
					runs immediately, storing data locally, before any database is set up.
				</p>
			</article>
			<article>
				<span>Coding agents</span>
				<p>
					Read the same description of the project the application runs on, plus instructions
					written for the exact installed version rather than for some other release.
				</p>
			</article>
		</div>
		<a class="text-link" href="/tooling"
			>Explore developer and coding-agent Tooling <span>→</span></a
		>
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

	<section class="guide-section" aria-labelledby="guide-heading">
		<div>
			<p class="eyebrow">Guides and start paths</p>
			<h2 id="guide-heading">Follow one supported job from start to finish</h2>
			<p>
				Guides give tested procedures and expected results. Start with a basic application or
				inspect released behavior before installation.
			</p>
		</div>
		<nav aria-label="Guide and start paths">
			<a class="primary-link" href="/guides">Browse Guides <span>→</span></a>
			<a href="/starters/ground-up">Build a basic SvelteKit application <span>→</span></a>
			<a href="/playground">Inspect the Playground <span>→</span></a>
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

	h1 {
		max-width: 38rem;
		font-size: clamp(2.2rem, 4.5vw, 3.4rem);
		font-weight: 680;
		letter-spacing: -0.045em;
		line-height: 1.05;
	}

	.hero-copy .lede {
		margin-top: 1.1rem;
		max-width: 40rem;
		color: var(--site-ink);
		font-size: 1.02rem;
		line-height: 1.6;
	}

	.layer-lede-list {
		display: grid;
		gap: 0.6rem;
		max-width: 42rem;
		margin-top: 1.4rem;
		padding-top: 1.2rem;
		border-top: 1px solid var(--site-line);
		list-style: none;
	}

	.layer-lede-list li {
		color: var(--site-muted);
		font-size: 0.87rem;
		line-height: 1.6;
	}

	.layer-lede-list strong {
		color: var(--site-ink);
	}

	.layer-lede-list a {
		color: var(--site-ink);
		text-underline-offset: 0.2rem;
	}

	.saadl-definition {
		max-width: 42rem;
		margin-top: 1.6rem;
		padding: 1.1rem 1.25rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.saadl-definition p {
		color: var(--site-muted);
		font-size: 0.83rem;
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
		font: 0.72rem var(--site-font-mono);
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

	.model-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(17rem, 0.75fr);
		gap: 1rem;
		align-items: start;
	}

	.projection-list {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}

	.projection-list li {
		border-bottom: 1px solid var(--site-line);
	}

	.projection-list a {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.35rem 1rem;
		padding: 0.85rem 0.25rem;
		color: var(--site-ink);
		text-decoration: none;
	}

	.projection-list strong {
		grid-column: 1;
		font-size: 0.82rem;
	}

	.projection-list span {
		grid-column: 1;
		color: var(--site-muted);
		font-size: 0.72rem;
		line-height: 1.5;
	}

	.projection-list b {
		grid-column: 2;
		grid-row: 1 / span 2;
		font-weight: 500;
	}

	.model-note {
		max-width: 48rem;
		margin-top: 1.25rem;
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.65;
	}

	.interaction-copy p {
		max-width: 52rem;
		color: var(--site-muted);
		font-size: 0.92rem;
		line-height: 1.68;
	}

	.interaction-copy p + p {
		margin-top: 0.9rem;
	}

	.run-steps {
		color: var(--site-ink) !important;
	}

	.run-steps a {
		color: var(--site-ink);
	}

	.participant-map {
		position: relative;
		max-width: 46rem;
		margin-top: 2.25rem;
		padding: 1.15rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background:
			radial-gradient(circle at 50% 30%, var(--site-accent-soft), transparent 46%),
			var(--site-surface);
	}

	.model-core {
		padding: 1.25rem;
		border: 1px solid color-mix(in srgb, var(--site-accent-strong) 60%, var(--site-line));
		border-radius: var(--site-radius-md);
		background: var(--site-paper-deep);
		text-align: center;
	}

	.model-core > span {
		color: var(--site-accent-strong);
		font: 700 0.62rem var(--site-font-mono);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.model-core > strong {
		display: block;
		margin-top: 0.4rem;
		font-size: 1.08rem;
	}

	.model-core ul {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.35rem;
		margin-top: 0.8rem;
		list-style: none;
	}

	.model-core li {
		padding: 0.25rem 0.45rem;
		border: 1px solid var(--site-line-strong);
		border-radius: 999px;
		background: var(--site-surface);
		color: var(--site-muted);
		font: 0.59rem var(--site-font-mono);
	}

	.participant-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
		margin-top: 0.75rem;
		list-style: none;
	}

	.participant-list li {
		min-height: 7.5rem;
		padding: 0.9rem;
		border: 1px solid var(--site-line);
		border-radius: var(--site-radius-md);
		background: color-mix(in srgb, var(--site-surface) 88%, transparent);
	}

	.participant-list strong,
	.participant-list span {
		display: block;
	}

	.participant-list strong {
		font-size: 0.78rem;
	}

	.participant-list span {
		margin-top: 0.4rem;
		color: var(--site-muted);
		font-size: 0.71rem;
		line-height: 1.5;
	}

	.agent-demo-embed {
		margin-top: 2rem;
	}

	.interaction-closing {
		max-width: 52rem;
		margin-top: 1.5rem;
		color: var(--site-muted);
		font-size: 0.88rem;
		line-height: 1.65;
	}

	.interaction-closing code {
		padding: 0.1rem 0.35rem;
		border-radius: 0.3rem;
		background: var(--site-paper);
		font-size: 0.85em;
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

	.scope-feature-links {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.5rem;
		margin-top: 2.5rem;
	}

	.scope-feature-links a {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.75rem 0.6rem;
		border: 1px solid var(--site-line);
		border-radius: calc(var(--site-radius-md) - 0.25rem);
		color: var(--site-ink);
		font-size: 0.78rem;
		font-weight: 700;
		text-decoration: none;
	}

	.scope-feature-links a:hover {
		border-color: var(--site-accent-strong);
	}

	.feature-index {
		color: var(--site-accent-strong);
		font: 700 0.62rem var(--site-font-mono);
	}

	.inventory-strip {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.inventory-strip a {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 1.1rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}

	.inventory-strip a:hover {
		border-color: var(--site-accent-strong);
	}

	.inventory-strip strong {
		font: 700 1.6rem var(--site-font-mono);
	}

	.inventory-strip span {
		color: var(--site-muted);
		font-size: 0.72rem;
	}

	.solution-groups {
		display: grid;
		gap: 1rem;
	}

	.solution-group {
		padding: 1.5rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.solution-group h3 {
		font-size: 1.05rem;
	}

	.solution-group > p:not(.includes) {
		max-width: 52rem;
		margin-top: 0.6rem;
		color: var(--site-muted);
		font-size: 0.87rem;
		line-height: 1.6;
	}

	.includes {
		margin-top: 1rem;
		color: var(--site-muted);
		font-size: 0.76rem;
		line-height: 1.5;
	}

	.includes a {
		color: var(--site-ink);
	}

	.live-table-embed {
		margin-top: 1.25rem;
	}

	.solutions-links {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.solutions-links a {
		color: var(--site-ink);
		font-size: 0.8rem;
		font-weight: 700;
		text-underline-offset: 0.25rem;
	}

	.solutions-links a span {
		color: var(--site-accent-strong);
	}

	.builder-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.builder-grid article {
		padding: 1.5rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.builder-grid span {
		color: var(--site-accent-strong);
		font: 700 0.62rem var(--site-font-mono);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.builder-grid p {
		margin-top: 0.9rem;
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.65;
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

	.guide-section {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(20rem, 0.72fr);
		gap: clamp(2rem, 7vw, 5rem);
		margin-top: clamp(2rem, 5vw, 4rem);
		padding-inline: clamp(1.5rem, 5vw, 4rem);
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background: var(--site-accent-soft);
	}

	.guide-section > div > p:last-child {
		max-width: 40rem;
		margin-top: 1rem;
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.65;
	}

	.guide-section nav {
		display: grid;
		align-content: center;
		gap: 0.55rem;
	}

	.guide-section nav a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 3rem;
		padding: 0.75rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--site-accent-strong) 35%, var(--site-line));
		border-radius: calc(var(--site-radius-md) - 0.25rem);
		background: var(--site-surface);
		color: var(--site-ink);
		font-size: 0.76rem;
		font-weight: 700;
		text-decoration: none;
	}

	.guide-section nav a:hover {
		border-color: var(--site-accent-strong);
	}

	.guide-section nav .primary-link {
		background: var(--site-accent-strong);
		color: var(--smrt-color-on-primary, #fff);
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

		.scope-feature-links {
			grid-template-columns: repeat(2, 1fr);
		}

		.inventory-strip {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 58rem) {
		.hero,
		.model-grid,
		.builder-grid,
		.guide-section {
			grid-template-columns: 1fr;
		}

		.hero {
			gap: 2.5rem;
		}

		.mini-scope-map {
			max-width: 42rem;
		}

		.guide-section {
			gap: 2rem;
		}
	}

	@media (max-width: 42rem) {
		.homepage {
			width: min(100% - 1.75rem, 70rem);
		}

		.section-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.9rem;
		}

		.builder-grid,
		.scope-feature-links,
		.inventory-strip {
			grid-template-columns: 1fr;
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
