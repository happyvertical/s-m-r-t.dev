<script lang="ts">
	import { uiStories, uiStoryGroups } from '$lib/data/ui-stories';
	import AgentAwareFormDemo from '$lib/ui-showcase/AgentAwareFormDemo.svelte';
	import UILiveShellState from '$lib/ui-showcase/UILiveShellState.svelte';
	import UIShowcaseDataTable from '$lib/ui-showcase/UIShowcaseDataTable.svelte';
</script>

<svelte:head>
	<title>UI showcase | s-m-r-t</title>
	<meta
		name="description"
		content="Explore the SMRT component system through human and agent interaction stories, released examples, and explicit failure boundaries."
	/>
</svelte:head>

<div class="ui-showcase">
	<header class="hero">
		<p class="hero-kicker">Component system showcase</p>
		<h1>Interfaces for people. Contracts for agents.</h1>
		<p class="hero-lede">
			SMRT components stay ordinary, accessible interface elements. Applications can also expose
			their meaning and operations to a governed agent caller.
		</p>

		<div class="thesis-grid">
			<div>
				<span>01</span>
				<strong>The person operates</strong>
				<p>The rendered control keeps labels, state, feedback, focus, and confirmation visible.</p>
			</div>
			<div>
				<span>02</span>
				<strong>The agent calls</strong>
				<p>An adapter discovers stable identities and requests the same allowed operations.</p>
			</div>
			<div>
				<span>03</span>
				<strong>The application governs</strong>
				<p>Application policy owns authorization, validation, consent, persistence, and refusal.</p>
			</div>
		</div>

		<div class="hero-links">
			<a href="/interaction">Read the interaction contract <span aria-hidden="true">→</span></a>
			<a href="/framework">See the framework architecture <span aria-hidden="true">→</span></a>
		</div>
	</header>

	<section class="orientation" aria-labelledby="orientation-title">
		<div>
			<p class="section-kicker">How to use this page</p>
			<h2 id="orientation-title">Two kinds of story, one boundary</h2>
		</div>
		<p>
			An interaction story names what a person sees, what an agent can discover and operate, where
			confirmation occurs, and how the component refuses unsafe work. A batteries-included story
			names what a consumer gets from the installed package, how the capability is turned on, and
			the boundary it enforces.
		</p>
		<p>
			This page curates the system. Package pages remain the API reference, and the Playground holds
			standalone interactive previews.
		</p>
	</section>

	{#each uiStoryGroups as group (group.id)}
		{@const groupStories = uiStories.filter((story) => story.group === group.id)}
		{@const offset = uiStories.findIndex((story) => story.group === group.id)}
		<section class="story-group" aria-labelledby={`group-${group.id}`}>
			<header class="group-heading">
				<p class="section-kicker">{group.kicker}</p>
				<h2 id={`group-${group.id}`}>{group.title}</h2>
				<p>{group.intro}</p>
			</header>

			<nav class="story-index" aria-label={`${group.kicker} index`}>
				{#each groupStories as story, index (story.id)}
					<a href={`#${story.id}`}>
						<span>{String(offset + index + 1).padStart(2, '0')}</span>
						{story.title}
					</a>
				{/each}
			</nav>

			<div class="stories">
				{#each groupStories as story, index (story.id)}
					<article id={story.id} class:featured={story.id === 'data-table-and-collections'}>
						<div class="story-heading">
							<div class="story-number" aria-hidden="true">
								{String(offset + index + 1).padStart(2, '0')}
							</div>
							<div>
								<p class="section-kicker">{story.eyebrow}</p>
								<h2>{story.title}</h2>
								<p class="story-lede">{story.lede}</p>
							</div>
						</div>

						<div class="story-intro">
							<p>{story.description}</p>
							<div>
								<p class="micro-label">Released surfaces</p>
								<ul class="component-list" aria-label={`${story.title} components`}>
									{#each story.components as component (component)}
										<li><code>{`${component}`}</code></li>
									{/each}
								</ul>
							</div>
						</div>

						{#if story.id === 'agent-addressable-components'}
							<AgentAwareFormDemo />
						{:else if story.id === 'data-table-and-collections'}
							<UIShowcaseDataTable />
						{:else if story.id === 'application-shell'}
							<UILiveShellState />
						{/if}

						<div class="contract-grid" class:compact={story.group === 'battery'}>
							{#each story.points as point (point.kind)}
								<section class:failure={point.kind === 'failure' || point.kind === 'boundary'}>
									<p class="contract-label">
										{#if point.kind === 'person'}
											Person sees
										{:else if point.kind === 'discover'}
											Agent discovers
										{:else if point.kind === 'operate'}
											Agent operates
										{:else if point.kind === 'confirm'}
											Confirmation boundary
										{:else if point.kind === 'gets'}
											What ships
										{:else if point.kind === 'wiring'}
											How it is turned on
										{:else if point.kind === 'boundary'}
											Boundary it enforces
										{:else}
											Failure behavior
										{/if}
									</p>
									<p>{point.body}</p>
								</section>
							{/each}
						</div>

						<div class="story-details">
							<div>
								<p class="micro-label">
									{story.group === 'battery'
										? 'What the package includes'
										: 'What this story proves'}
								</p>
								<ul class="highlight-list">
									{#each story.highlights as highlight (highlight)}
										<li>{highlight}</li>
									{/each}
								</ul>
							</div>

							<div>
								<p class="micro-label">Explore the implementation</p>
								<div class="resource-list">
									{#each story.links as link (`${link.kind}-${link.href}`)}
										<a
											class:gap-link={link.kind === 'gap'}
											href={link.href}
											target={link.external ? '_blank' : undefined}
											rel={link.external ? 'noreferrer' : undefined}
										>
											<span>
												<small>
													{link.kind === 'playground'
														? 'Playground'
														: link.kind === 'reference'
															? 'Reference'
															: 'Missing preview'}
												</small>
												<strong>{link.label}</strong>
												{#if link.note}<span>{link.note}</span>{/if}
											</span>
											<span aria-hidden="true">{link.external ? '↗' : '→'}</span>
										</a>
									{/each}
								</div>
							</div>
						</div>
					</article>
				{/each}
			</div>
		</section>
	{/each}

	<section class="closing" aria-labelledby="closing-title">
		<p class="section-kicker">Implementation rule</p>
		<h2 id="closing-title">Keep intelligence out of the primitive</h2>
		<p>
			A component exposes meaning, state, and operations. The application supplies the model,
			adapter, permissions, confirmation rules, and durable side effects.
		</p>
		<a href="/interaction">Continue to the interaction contract <span aria-hidden="true">→</span></a
		>
	</section>
</div>

<style>
	.ui-showcase {
		--showcase-ink: var(--smrt-color-on-surface, #17202a);
		--showcase-muted: var(--smrt-color-on-surface-muted, #5d6877);
		--showcase-border: var(--smrt-color-border, #d8dee6);
		--showcase-surface: var(--smrt-color-surface, #fff);
		--showcase-soft: var(--smrt-color-surface-variant, #f2f5f8);
		--showcase-accent: var(--smrt-color-primary, #3757d5);
		max-width: 84rem;
		margin: 0 auto;
		padding: clamp(1rem, 3vw, 2.5rem);
		color: var(--showcase-ink);
	}

	.hero {
		position: relative;
		overflow: hidden;
		padding: clamp(2rem, 6vw, 5.5rem) clamp(1.25rem, 5vw, 4.5rem);
		background:
			radial-gradient(
				circle at 90% 10%,
				color-mix(in srgb, var(--showcase-accent) 22%, transparent),
				transparent 34%
			),
			linear-gradient(145deg, var(--showcase-soft), var(--showcase-surface));
		border: 1px solid var(--showcase-border);
		border-radius: clamp(1rem, 3vw, 2rem);
	}

	.hero-kicker,
	.section-kicker,
	.micro-label {
		margin: 0;
		color: var(--showcase-accent);
		font-size: 0.74rem;
		font-weight: 800;
		letter-spacing: 0.13em;
		text-transform: uppercase;
	}

	h1 {
		max-width: 14ch;
		margin: 0.75rem 0 1rem;
		font-size: clamp(2.6rem, 7vw, 6.25rem);
		line-height: 0.95;
		letter-spacing: -0.055em;
	}

	.hero-lede {
		max-width: 52rem;
		margin: 0;
		color: var(--showcase-muted);
		font-size: clamp(1.05rem, 2vw, 1.35rem);
		line-height: 1.55;
	}

	.thesis-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1px;
		margin-top: clamp(2rem, 5vw, 4rem);
		background: var(--showcase-border);
		border: 1px solid var(--showcase-border);
		border-radius: 0.8rem;
	}

	.thesis-grid div {
		display: grid;
		gap: 0.35rem;
		padding: 1rem;
		background: color-mix(in srgb, var(--showcase-surface) 94%, transparent);
	}

	.thesis-grid div:first-child {
		border-radius: 0.75rem 0 0 0.75rem;
	}

	.thesis-grid div:last-child {
		border-radius: 0 0.75rem 0.75rem 0;
	}

	.thesis-grid span,
	.story-number {
		color: var(--showcase-accent);
		font-family: var(--smrt-font-family-mono, monospace);
		font-size: 0.75rem;
	}

	.thesis-grid strong {
		font-size: 0.94rem;
	}

	.thesis-grid p {
		margin: 0;
		color: var(--showcase-muted);
		font-size: 0.87rem;
		line-height: 1.5;
	}

	.hero-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1.5rem;
		margin-top: 1.5rem;
	}

	.hero-links a,
	.closing a {
		color: var(--showcase-accent);
		font-weight: 750;
		text-decoration: none;
	}

	.hero-links a:hover,
	.closing a:hover {
		text-decoration: underline;
		text-underline-offset: 0.25rem;
	}

	.orientation {
		display: grid;
		grid-template-columns: 1.1fr 1fr 1fr;
		gap: clamp(1rem, 4vw, 3rem);
		align-items: start;
		padding: clamp(2.5rem, 6vw, 5rem) clamp(0.25rem, 2vw, 1rem);
		border-bottom: 1px solid var(--showcase-border);
	}

	.orientation h2,
	.story-heading h2,
	.closing h2 {
		margin: 0.35rem 0 0;
		font-size: clamp(1.7rem, 4vw, 3.25rem);
		line-height: 1.05;
		letter-spacing: -0.035em;
	}

	.orientation > p {
		margin: 0;
		color: var(--showcase-muted);
		line-height: 1.65;
	}

	.story-group {
		padding-top: clamp(1.5rem, 4vw, 3rem);
	}

	.group-heading {
		display: grid;
		gap: 0.35rem;
		max-width: 54rem;
		padding-bottom: 0.5rem;
	}

	.group-heading h2 {
		margin: 0.35rem 0 0;
		font-size: clamp(1.35rem, 3vw, 2.1rem);
		line-height: 1.1;
		letter-spacing: -0.03em;
	}

	.group-heading > p:not(.section-kicker) {
		margin: 0.25rem 0 0;
		color: var(--showcase-muted);
		line-height: 1.6;
	}

	.story-index {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.5rem;
		padding: 1rem 0;
	}

	.story-index a {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		padding: 0.7rem 0.8rem;
		color: var(--showcase-ink);
		font-size: 0.84rem;
		font-weight: 650;
		text-decoration: none;
		background: var(--showcase-soft);
		border: 1px solid transparent;
		border-radius: 0.55rem;
	}

	.story-index a:hover,
	.story-index a:focus-visible {
		color: var(--showcase-accent);
		border-color: currentColor;
	}

	.story-index span {
		color: var(--showcase-accent);
		font-family: var(--smrt-font-family-mono, monospace);
		font-size: 0.7rem;
	}

	.stories {
		display: grid;
		gap: clamp(3rem, 8vw, 7rem);
		padding: clamp(3rem, 7vw, 6rem) 0;
	}

	article {
		display: grid;
		gap: clamp(1.5rem, 4vw, 2.75rem);
		scroll-margin-top: 2rem;
	}

	article.featured {
		padding: clamp(1rem, 3vw, 2rem);
		background: color-mix(in srgb, var(--showcase-accent) 4%, var(--showcase-surface));
		border: 1px solid color-mix(in srgb, var(--showcase-accent) 25%, var(--showcase-border));
		border-radius: 1.25rem;
	}

	.story-heading {
		display: grid;
		grid-template-columns: 3rem minmax(0, 1fr);
		gap: 1rem;
	}

	.story-number {
		padding-top: 0.3rem;
	}

	.story-lede {
		max-width: 54rem;
		margin: 0.75rem 0 0;
		color: var(--showcase-muted);
		font-size: clamp(1rem, 2vw, 1.2rem);
		line-height: 1.55;
	}

	.story-intro,
	.story-details {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
		gap: clamp(1.5rem, 4vw, 3rem);
	}

	.story-intro > p {
		margin: 0;
		font-size: 1.03rem;
		line-height: 1.7;
	}

	.component-list,
	.highlight-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		padding: 0;
		margin: 0.65rem 0 0;
		list-style: none;
	}

	.component-list li,
	.highlight-list li {
		padding: 0.35rem 0.55rem;
		color: var(--showcase-muted);
		font-size: 0.78rem;
		background: var(--showcase-soft);
		border: 1px solid var(--showcase-border);
		border-radius: 999px;
	}

	.component-list code {
		color: var(--showcase-ink);
		font-size: inherit;
	}

	.contract-grid {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 1px;
		background: var(--showcase-border);
		border: 1px solid var(--showcase-border);
		border-radius: 0.8rem;
	}

	.contract-grid.compact {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.contract-grid section {
		padding: 1rem;
		background: var(--showcase-surface);
	}

	.contract-grid section:first-child {
		border-radius: 0.75rem 0 0 0.75rem;
	}

	.contract-grid section:last-child {
		border-radius: 0 0.75rem 0.75rem 0;
	}

	.contract-grid section.failure {
		background: color-mix(in srgb, var(--smrt-color-danger, #b3261e) 6%, var(--showcase-surface));
	}

	.contract-label {
		margin: 0 0 0.65rem;
		color: var(--showcase-accent);
		font-size: 0.68rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.contract-grid section > p:last-child {
		margin: 0;
		color: var(--showcase-muted);
		font-size: 0.82rem;
		line-height: 1.55;
	}

	.story-details {
		padding-top: 0.5rem;
	}

	.resource-list {
		display: grid;
		gap: 0.55rem;
		margin-top: 0.65rem;
	}

	.resource-list a {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
		padding: 0.8rem;
		color: var(--showcase-ink);
		text-decoration: none;
		border: 1px solid var(--showcase-border);
		border-radius: 0.6rem;
	}

	.resource-list a:hover,
	.resource-list a:focus-visible {
		border-color: var(--showcase-accent);
		box-shadow: 0 0 0 1px var(--showcase-accent);
	}

	.resource-list a.gap-link {
		border-style: dashed;
	}

	.resource-list a > span:first-child {
		display: grid;
		gap: 0.15rem;
	}

	.resource-list small {
		color: var(--showcase-accent);
		font-size: 0.65rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.resource-list strong {
		font-size: 0.9rem;
	}

	.resource-list strong + span {
		color: var(--showcase-muted);
		font-size: 0.78rem;
		line-height: 1.4;
	}

	.closing {
		padding: clamp(2rem, 6vw, 5rem);
		text-align: center;
		background: var(--showcase-soft);
		border: 1px solid var(--showcase-border);
		border-radius: 1.25rem;
	}

	.closing h2 {
		margin-right: auto;
		margin-left: auto;
	}

	.closing > p:not(.section-kicker) {
		max-width: 48rem;
		margin: 1rem auto 1.25rem;
		color: var(--showcase-muted);
		line-height: 1.65;
	}

	@media (max-width: 960px) {
		.story-index {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.contract-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.contract-grid section:first-child,
		.contract-grid section:last-child {
			border-radius: 0;
		}
	}

	@media (max-width: 760px) {
		.thesis-grid,
		.orientation,
		.story-intro,
		.story-details {
			grid-template-columns: 1fr;
		}

		.thesis-grid div:first-child,
		.thesis-grid div:last-child {
			border-radius: 0;
		}
	}

	@media (max-width: 520px) {
		.story-index,
		.contract-grid {
			grid-template-columns: 1fr;
		}

		.story-heading {
			grid-template-columns: 1fr;
			gap: 0.4rem;
		}
	}
</style>
