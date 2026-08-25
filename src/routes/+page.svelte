<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';

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
	const surfaces = ['Storage', 'UI', 'APIs', 'Commands', 'Tools', 'Permissions'];

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

	const uiHighlights = [
		{
			title: 'Agent-addressable controls',
			body: 'Stable control identities support explanation, validation, staging, confirmation, and refusal.',
			storyHref: '/capabilities/agent-assisted-forms',
			playgroundHref: '/playground'
		},
		{
			title: 'DataTable',
			body: 'Search, selection, filtering, sorting, paging, expansion, and serializable view state.',
			storyHref: '/packages/smrt-ui?tab=components',
			playgroundHref: '/playground'
		},
		{
			title: 'Chat and tool visibility',
			body: 'Chat layouts keep messages, agent activity, and available actions visible.',
			storyHref: '/packages/smrt-chat?tab=components',
			playgroundHref: '/playground'
		},
		{
			title: 'Forms',
			body: 'Form controls share model fields, validation, permissions, and field policy.',
			storyHref: '/packages/smrt-ui?tab=components',
			playgroundHref: '/playground'
		},
		{
			title: 'Application shell',
			body: 'A shared shell coordinates navigation, panels, route content, and application state.',
			storyHref: '/capabilities/application-shell',
			playgroundHref: null
		},
		{
			title: 'Voice',
			body: 'Speech input uses capability checks and reports model download state.',
			storyHref: '/packages/smrt-svelte?tab=components',
			playgroundHref: null
		}
	];

	const moduleOutcomes = [
		{
			title: 'Identity and tenancy',
			body: 'Users, memberships, roles, permissions, sessions, profiles, and tenant scope.'
		},
		{
			title: 'Content and communication',
			body: 'Articles, assets, images, messages, events, and contribution workflows.'
		},
		{
			title: 'Durable operations',
			body: 'Jobs, projects, reports, schedules, approvals, and operational status.'
		},
		{
			title: 'Commerce and records',
			body: 'Invoices, commerce workflows, ledgers, analytics, and durable history.'
		}
	];
</script>

<SEO
	title="Why s-m-r-t? One application model for persons and agents"
	description="s-m-r-t gives persons, application agents, developers, and coding agents one model for application data, operations, permissions, and interfaces."
	url="https://s-m-r-t.dev"
/>

<article class="why-smrt">
	<header class="introduction">
		<div class="introduction-copy">
			<h1>s-m-r-t gives every participant one application model.</h1>
			<p class="lede">
				s-m-r-t is a TypeScript framework for applications that persons and agents operate together.
				One application model defines data, operations, permissions, and interface exposure.
			</p>
			<p>
				Persons use visible controls and natural language. Application agents discover declared
				controls and operations. Developers and coding agents use the same model, manifests,
				documentation, and tools.
			</p>
			<a class="text-link" href="#how-it-works">See how the interfaces connect <span>↓</span></a>
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
	</header>

	<section
		class="split-section language-section"
		id="how-it-works"
		aria-labelledby="language-heading"
	>
		<div>
			<p class="eyebrow">How it works · Interaction</p>
			<h2 id="language-heading">Natural language is an interface</h2>
		</div>
		<div class="section-copy">
			<p>
				Persons communicate through typed requests, chat, voice, and agent-assisted controls. Each
				request enters the application through a declared control or operation.
			</p>
			<p>
				The interface shows staged changes, required confirmations, and refusals. Application policy
				stays active when a request starts in natural language.
			</p>
			<a class="text-link" href="/interaction">Explore Human-Agent Interaction <span>→</span></a>
		</div>
	</section>

	<section class="split-section" aria-labelledby="description-heading">
		<div>
			<p class="eyebrow">Framework</p>
			<h2 id="description-heading">The application describes itself</h2>
		</div>
		<div class="description-stack">
			<dl>
				<div>
					<dt>Models</dt>
					<dd>Describe application objects.</dd>
				</div>
				<div>
					<dt>Fields</dt>
					<dd>Describe values and constraints.</dd>
				</div>
				<div>
					<dt>Operations</dt>
					<dd>Describe available work.</dd>
				</div>
				<div>
					<dt>Permissions</dt>
					<dd>Describe assigned authority.</dd>
				</div>
				<div>
					<dt>Controls</dt>
					<dd>Describe visible interaction.</dd>
				</div>
				<div>
					<dt>Runtime</dt>
					<dd>Reports loaded capabilities when an application exposes them.</dd>
				</div>
			</dl>
			<p>
				These descriptions help a person or agent understand the application before an operation
				starts.
			</p>
			<a class="text-link" href="/framework">Read the Framework overview <span>→</span></a>
		</div>
	</section>

	<section class="definition-section" id="what-you-get" aria-labelledby="definition-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">What you get · Shared application logic</p>
				<h2 id="definition-heading">One definition, every surface</h2>
			</div>
			<p>
				One framework supplies storage, UI, APIs, commands, tools, and permissions from the same
				model.
			</p>
		</div>
		<div class="surface-flow">
			<div class="surface-source">
				<span>Source</span>
				<strong>Application model</strong>
			</div>
			<ul>
				{#each surfaces as surface (surface)}
					<li>{surface}</li>
				{/each}
			</ul>
		</div>
		<p class="definition-copy">
			Each generated interface uses the same operations and policy. A model change updates the
			shared source instead of several parallel definitions.
		</p>
		<a class="text-link" href="/reference/interfaces"
			>Read the generated interfaces Reference <span>→</span></a
		>
	</section>

	<section class="builder-section" id="what-you-lose" aria-labelledby="builder-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">What you lose · Parallel definitions</p>
				<h2 id="builder-heading">Built for the persons who build it</h2>
			</div>
			<p>
				Developers and coding agents use the same declared application structure as the running
				application.
			</p>
		</div>
		<div class="builder-grid">
			<article>
				<span>Developers</span>
				<h3>Maintain fewer parallel definitions.</h3>
				<p>
					Models keep storage, interfaces, operations, and permissions connected. Developers spend
					less time reconciling separate schemas and adapters.
				</p>
			</article>
			<article>
				<span>Coding agents</span>
				<h3>Read deterministic project knowledge.</h3>
				<p>
					Project manifests describe objects, fields, relationships, and interfaces. Installed
					packages include instructions for the version in the workspace.
				</p>
			</article>
		</div>
		<a class="text-link" href="/tooling"
			>Explore developer and coding-agent Tooling <span>→</span></a
		>
	</section>

	<section class="feature-section" aria-labelledby="feature-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Documentation</p>
				<h2 id="feature-heading">Choose the next level of detail</h2>
			</div>
			<p>Each section explains one part of the shared application model.</p>
		</div>
		<div class="feature-map">
			{#each featureSections as feature, index (feature.href)}
				<a href={feature.href}>
					<span>{String(index + 1).padStart(2, '0')}</span>
					<h3>{feature.label}</h3>
					<p>{feature.body}</p>
					<b aria-hidden="true">→</b>
				</a>
			{/each}
		</div>
	</section>

	<section class="ui-section" aria-labelledby="ui-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">High-impact UI</p>
				<h2 id="ui-heading">Visible controls expose application meaning</h2>
			</div>
			<p>
				Read the <a href="/ui">UI stories</a> or operate released examples in the
				<a href="/playground">Playground</a>.
			</p>
		</div>
		<div class="ui-grid">
			{#each uiHighlights as highlight (highlight.title)}
				<article>
					<h3>{highlight.title}</h3>
					<p>{highlight.body}</p>
					<div>
						<a href={highlight.storyHref}>Read the story</a>
						{#if highlight.playgroundHref}
							<a href={highlight.playgroundHref}>Open the example</a>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="module-section" aria-labelledby="module-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Application modules</p>
				<h2 id="module-heading">Start from a released application outcome</h2>
			</div>
			<p>Modules combine models, operations, policy, and UI for common application work.</p>
		</div>
		<div class="module-grid">
			{#each moduleOutcomes as outcome (outcome.title)}
				<a href="/modules">
					<h3>{outcome.title}</h3>
					<p>{outcome.body}</p>
					<span>Explore Modules →</span>
				</a>
			{/each}
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
	.why-smrt {
		width: min(70rem, calc(100% - 3rem));
		margin: 0 auto;
		padding: clamp(2.5rem, 7vw, 5.5rem) 0 6rem;
	}

	.introduction {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(24rem, 0.95fr);
		gap: clamp(2.5rem, 7vw, 5rem);
		align-items: center;
		padding-bottom: clamp(4rem, 9vw, 7rem);
	}

	h1 {
		max-width: 44rem;
		font-size: clamp(2.7rem, 6.8vw, 5.4rem);
		font-weight: 680;
		letter-spacing: -0.062em;
		line-height: 0.98;
	}

	.introduction-copy > p {
		max-width: 42rem;
		color: var(--site-muted);
		font-size: 0.96rem;
		line-height: 1.68;
	}

	.introduction-copy .lede {
		margin-top: 1.6rem;
		color: var(--site-ink);
		font-size: 1.08rem;
	}

	.introduction-copy .lede + p {
		margin-top: 0.9rem;
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

	.participant-map {
		position: relative;
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

	.model-core > span,
	.builder-grid article > span {
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

	.split-section {
		display: grid;
		grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
		gap: clamp(2rem, 7vw, 6rem);
	}

	.language-section {
		border: 0;
		border-radius: var(--site-radius-lg);
		background: var(--site-accent-soft);
		padding-inline: clamp(1.5rem, 5vw, 4rem);
	}

	.section-copy p,
	.description-stack > p,
	.definition-copy,
	.builder-grid p,
	.ui-grid p,
	.module-grid p,
	.guide-section > div > p:last-child {
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.65;
	}

	.section-copy p + p {
		margin-top: 0.9rem;
	}

	.description-stack dl {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-top: 1px solid var(--site-line);
	}

	.description-stack dl > div {
		padding: 0.75rem 0.4rem;
		border-bottom: 1px solid var(--site-line);
	}

	.description-stack dl > div:nth-child(odd) {
		padding-right: 1rem;
	}

	.description-stack dt {
		font-size: 0.78rem;
		font-weight: 700;
	}

	.description-stack dd {
		margin-top: 0.2rem;
		color: var(--site-muted);
		font-size: 0.72rem;
		line-height: 1.45;
	}

	.description-stack > p {
		margin-top: 1.25rem;
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

	.section-heading > p a {
		color: var(--site-ink);
	}

	.surface-flow {
		display: grid;
		grid-template-columns: 12rem minmax(0, 1fr);
		gap: 1rem;
		padding: 1rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.surface-source {
		padding: 1rem;
		border-radius: calc(var(--site-radius-md) - 0.25rem);
		background: var(--site-accent-soft);
	}

	.surface-source span,
	.surface-source strong {
		display: block;
	}

	.surface-source span {
		font: 0.6rem var(--site-font-mono);
		text-transform: uppercase;
	}

	.surface-source strong {
		margin-top: 0.4rem;
		font-size: 0.86rem;
	}

	.surface-flow ul {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.6rem;
		list-style: none;
	}

	.surface-flow li {
		display: grid;
		place-items: center;
		min-height: 3.7rem;
		border: 1px solid var(--site-line);
		border-radius: calc(var(--site-radius-md) - 0.25rem);
		color: var(--site-muted);
		font: 700 0.67rem var(--site-font-mono);
	}

	.definition-copy {
		max-width: 48rem;
		margin-top: 1.25rem;
	}

	.builder-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.builder-grid article {
		min-height: 13rem;
		padding: 1.5rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.builder-grid h3 {
		margin-top: 1.4rem;
		font-size: 1.2rem;
		letter-spacing: -0.025em;
	}

	.builder-grid p {
		margin-top: 0.7rem;
	}

	.feature-map {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		border-top: 1px solid var(--site-line);
	}

	.feature-map a {
		display: grid;
		grid-template-columns: 2.2rem minmax(0, 1fr) 1rem;
		gap: 0.2rem 1rem;
		padding: 1.25rem 0.75rem;
		border-bottom: 1px solid var(--site-line);
		color: var(--site-ink);
		text-decoration: none;
	}

	.feature-map a:nth-child(odd) {
		border-right: 1px solid var(--site-line);
	}

	.feature-map a:hover {
		background: var(--site-surface);
	}

	.feature-map a > span {
		grid-row: 1 / span 2;
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
	}

	.feature-map h3 {
		font-size: 0.98rem;
	}

	.feature-map p {
		grid-column: 2;
		color: var(--site-muted);
		font-size: 0.74rem;
		line-height: 1.5;
	}

	.feature-map b {
		grid-column: 3;
		grid-row: 1 / span 2;
		font-weight: 500;
	}

	.ui-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
	}

	.ui-grid article {
		display: flex;
		min-height: 13rem;
		flex-direction: column;
		padding: 1.1rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.ui-grid h3,
	.module-grid h3 {
		font-size: 0.92rem;
	}

	.ui-grid p,
	.module-grid p {
		margin-top: 0.6rem;
		font-size: 0.77rem;
	}

	.ui-grid article > div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem 0.9rem;
		margin-top: auto;
		padding-top: 1.25rem;
	}

	.ui-grid a {
		color: var(--site-ink);
		font-size: 0.69rem;
		font-weight: 700;
		text-underline-offset: 0.25rem;
	}

	.module-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.75rem;
	}

	.module-grid a {
		display: flex;
		min-height: 13rem;
		flex-direction: column;
		padding: 1.1rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}

	.module-grid a:hover {
		border-color: var(--site-accent-strong);
	}

	.module-grid span {
		margin-top: auto;
		padding-top: 1.25rem;
		color: var(--site-accent-strong);
		font: 700 0.62rem var(--site-font-mono);
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

	@media (max-width: 58rem) {
		.introduction,
		.split-section,
		.guide-section {
			grid-template-columns: 1fr;
		}

		.introduction {
			gap: 2.5rem;
		}

		.participant-map {
			max-width: 42rem;
		}

		.ui-grid,
		.module-grid {
			grid-template-columns: 1fr 1fr;
		}

		.guide-section {
			gap: 2rem;
		}
	}

	@media (max-width: 42rem) {
		.why-smrt {
			width: min(100% - 1.75rem, 70rem);
		}

		.section-heading {
			align-items: flex-start;
			flex-direction: column;
			gap: 0.9rem;
		}

		.participant-list,
		.description-stack dl,
		.builder-grid,
		.feature-map,
		.ui-grid,
		.module-grid {
			grid-template-columns: 1fr;
		}

		.participant-list li {
			min-height: 0;
		}

		.description-stack dl > div:nth-child(odd) {
			padding-right: 0.4rem;
		}

		.surface-flow {
			grid-template-columns: 1fr;
		}

		.surface-flow ul {
			grid-template-columns: 1fr 1fr;
		}

		.feature-map a:nth-child(odd) {
			border-right: 0;
		}

		.builder-grid article,
		.ui-grid article,
		.module-grid a {
			min-height: 0;
		}

		.ui-grid article > div,
		.module-grid span {
			margin-top: 1.25rem;
		}
	}
</style>
