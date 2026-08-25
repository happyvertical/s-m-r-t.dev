<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import FrameworkTopic from '$lib/components/FrameworkTopic.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import {
		frameworkModelExample,
		frameworkModelProjections,
		frameworkTopics
	} from '$lib/data/framework';
</script>

<SEO
	title="s-m-r-t Framework"
	description="Learn how one s-m-r-t application model supplies persistence, collections, identity, permissions, generated interfaces, and stable descriptions for persons and agents."
	url="https://s-m-r-t.dev/framework"
/>

<article class="framework-page">
	<header class="hero">
		<p>Framework</p>
		<h1>One application definition supplies every interface.</h1>
		<div class="hero-copy">
			<p>
				smrt-core supplies the model, collection, registry, persistence, and generation foundation.
				A model describes the fields, relationships, operations, and interface choices for one kind
				of record.
			</p>
			<p>
				The framework uses that shared description for storage, collections, forms, APIs, commands,
				tools, and permission names. Application modules use the same foundation. They do not add
				parallel definitions that can drift.
			</p>
		</div>
	</header>

	<section class="model-example" aria-labelledby="model-example-heading">
		<div class="section-heading">
			<p>Model to surfaces</p>
			<h2 id="model-example-heading">Describe the record once.</h2>
			<span>
				This Article model selects four REST actions and one MCP action. It disables CLI access.
				Field metadata also marks one required value, one read-only value, and one sensitive value.
			</span>
		</div>
		<div class="model-grid">
			<CodeBlock code={frameworkModelExample} filename="src/lib/objects/Article.ts" />
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
			Persons and software agents can reach the same permitted application operations. This is
			<a href="/reference/saadl">Software as Agentic Domain Logic (SAADL)</a>. The shared model
			keeps the human and agent interfaces on one contract. It does not give an agent authority.
		</p>
	</section>

	<section class="families" aria-labelledby="families-heading">
		<div class="section-heading">
			<p>Concept families</p>
			<h2 id="families-heading">Follow the framework from meaning to operation.</h2>
			<span>
				These pages explain concepts and guarantees. The Reference section holds exhaustive
				contracts and API details.
			</span>
		</div>
		<ol>
			{#each frameworkTopics as topic, index (topic.slug)}
				<li>
					<a href={`#${topic.slug}`}>
						<small>{String(index + 1).padStart(2, '0')}</small>
						<div>
							<h3>{topic.navTitle}</h3>
							<p>{topic.plainEnglish}</p>
						</div>
						<b aria-hidden="true">→</b>
					</a>
				</li>
			{/each}
		</ol>
	</section>

	{#each frameworkTopics as topic (topic.slug)}
		<FrameworkTopic section={topic} />
	{/each}

	<section class="boundaries" aria-labelledby="boundaries-heading">
		<div class="section-heading">
			<p>Continue by task</p>
			<h2 id="boundaries-heading">Use the section that owns the next question.</h2>
		</div>
		<div>
			<a href="/reference">
				<strong>Reference</strong>
				<span>Look up complete interface, permission, security, and package contracts.</span>
			</a>
			<a href="/guides">
				<strong>Guides</strong>
				<span>Follow task procedures for setup, integration, migration, and testing.</span>
			</a>
			<a href="/interaction">
				<strong>Interaction</strong>
				<span>Understand how persons and application agents communicate and share control.</span>
			</a>
			<a href="/ui">
				<strong>UI</strong>
				<span>See the controls and shell that make application state and authority visible.</span>
			</a>
			<a href="/modules">
				<strong>Application modules</strong>
				<span>Find prebuilt application parts that use the same framework foundation.</span>
			</a>
			<a href="/tooling">
				<strong>Tooling</strong>
				<span>Use development tools and coding-agent introspection for source work.</span>
			</a>
		</div>
	</section>
</article>

<style>
	.framework-page {
		width: min(70rem, calc(100% - 3rem));
		margin: 0 auto;
		padding: clamp(3rem, 7vw, 5.5rem) 0 6rem;
	}

	.hero {
		max-width: 61rem;
		padding-bottom: clamp(3rem, 7vw, 5rem);
	}

	.hero > p,
	.section-heading > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		max-width: 56rem;
		margin-top: 0.75rem;
		font-size: clamp(2.5rem, 7vw, 5.25rem);
		letter-spacing: -0.06em;
		line-height: 0.98;
	}

	.hero-copy {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem;
		max-width: 58rem;
		margin-top: 1.75rem;
	}

	.hero-copy p,
	.section-heading > span,
	.model-note {
		color: var(--site-muted);
		font-size: 0.92rem;
		line-height: 1.7;
	}

	section {
		padding: clamp(2.8rem, 6vw, 4.75rem) 0;
		border-top: 1px solid var(--site-line-strong);
	}

	.section-heading {
		max-width: 48rem;
		margin-bottom: 1.75rem;
	}

	.section-heading h2 {
		margin-top: 0.6rem;
		font-size: clamp(1.75rem, 4vw, 2.7rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}

	.section-heading > span {
		display: block;
		margin-top: 0.8rem;
	}

	.model-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(17rem, 0.75fr);
		gap: 1rem;
		align-items: start;
	}

	.projection-list,
	.families ol {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}

	.projection-list li,
	.families li {
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

	.projection-list strong,
	.boundaries strong {
		font-size: 0.82rem;
	}

	.projection-list span,
	.boundaries span {
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
		max-width: 55rem;
		margin-top: 1.5rem;
	}

	.model-note a {
		color: var(--site-ink);
	}

	.families ol {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		border-left: 1px solid var(--site-line);
	}

	.families li {
		border-right: 1px solid var(--site-line);
	}

	.families a {
		min-height: 10rem;
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr) auto;
		gap: 1rem;
		padding: 1.25rem;
		color: var(--site-ink);
		text-decoration: none;
	}

	.families a:hover,
	.boundaries a:hover {
		background: var(--site-surface);
	}

	.families small {
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
	}

	.families h3 {
		font-size: 1rem;
	}

	.families p {
		margin-top: 0.45rem;
		color: var(--site-muted);
		font-size: 0.78rem;
		line-height: 1.55;
	}

	.families b {
		font-weight: 500;
	}

	.boundaries > div:last-child {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.boundaries a {
		display: grid;
		gap: 0.35rem;
		padding: 1rem;
		border: 1px solid var(--site-line-strong);
		color: var(--site-ink);
		text-decoration: none;
	}

	@media (max-width: 50rem) {
		.hero-copy,
		.model-grid,
		.families ol,
		.boundaries > div:last-child {
			grid-template-columns: 1fr;
		}

		.families ol {
			border-right: 1px solid var(--site-line);
		}
	}

	@media (max-width: 35rem) {
		.framework-page {
			width: min(100% - 1.75rem, 70rem);
		}

		.families a {
			grid-template-columns: 1.6rem minmax(0, 1fr) auto;
			padding: 1rem 0.75rem;
		}
	}
</style>
