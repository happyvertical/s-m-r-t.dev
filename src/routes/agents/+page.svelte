<script lang="ts">
	import FrameworkTopic from '$lib/components/FrameworkTopic.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import AgentAwareFormDemo from '$lib/ui-showcase/AgentAwareFormDemo.svelte';
	import {
		agentsDefaultsLadder,
		agentsDoors,
		agentsDoorsReconciliation,
		agentsTopics,
		agentsTwoPlanes
	} from '$lib/data/agents';
</script>

<SEO
	title="Agents and the s-m-r-t application"
	description="What a software agent can do with a s-m-r-t application: the four tool surfaces, the read-only exposure default, and the identity every call runs as."
	url="https://s-m-r-t.dev/agents"
/>

<article class="agents-page">
	<header class="hero">
		<div class="hero-copy">
			<p class="eyebrow">Agents</p>
			<h1>Agents work with borrowed authority.</h1>
			<div class="hero-lede">
				<p>
					A s-m-r-t application can offer its operations to software agents: an agent in the browser
					page, an agent connected over MCP, or one of the application's own scheduled and chat
					agents. Each connects through a defined door, and every door is a choice the application
					makes.
				</p>
				<p>
					Whichever door it uses, an agent acts as someone — the signed-in person on the page, or a
					user account bound to it on the server — and the server checks every request against that
					identity. The front page says an agent never has more power than the person it works for.
					This section is the mechanism behind that sentence.
				</p>
			</div>
			<p class="scale-line">
				About agents that use a running application. Coding agents, which help build one, are
				covered in <a href="/tooling">Tooling</a>.
			</p>
		</div>

		<ol class="mini-scope-map" aria-label="The four tool surfaces">
			{#each agentsDoors as door (door.index)}
				<li>
					<a href="#where-agents-connect">
						<span class="mini-index">{door.index}</span>
						<span class="mini-name">{door.door}</span>
						<span class="mini-plane">{door.plane === 'browser' ? 'page' : 'server'}</span>
					</a>
				</li>
			{/each}
		</ol>
	</header>

	{#each agentsTopics as topic (topic.slug)}
		<FrameworkTopic section={topic} />

		{#if topic.slug === 'where-agents-connect'}
			<div class="doors-table-wrap">
				<div class="doors-table" aria-label="The four tool surfaces">
					<div class="doors-head" aria-hidden="true">
						<span></span>
						<span>Door</span>
						<span>One line</span>
						<span>Plane</span>
					</div>
					{#each agentsDoors as door (door.index)}
						<div class="doors-row">
							<span class="doors-index">{door.index}</span>
							<span class="doors-name">{door.door}</span>
							<span class="doors-desc">{door.description}</span>
							<span class="doors-chip" data-plane={door.plane}>{door.planeChip}</span>
						</div>
					{/each}
				</div>
				<p class="scope-reconciliation">{agentsDoorsReconciliation}</p>
			</div>
		{:else if topic.slug === 'two-planes'}
			<div class="two-plane-wrap">
				<div class="two-plane-diagram" aria-label={agentsTwoPlanes.ariaLabel}>
					<div class="plane-top">
						<div class="plane-card">
							<span class="plane-chip">{agentsTwoPlanes.browser.chip}</span>
							<p class="plane-rows">{agentsTwoPlanes.browser.rows.join(' → ')}</p>
							<p class="plane-acts-as">{agentsTwoPlanes.browser.actsAs}</p>
						</div>
						<div class="plane-card">
							<span class="plane-chip">{agentsTwoPlanes.server.chip}</span>
							<p class="plane-rows">{agentsTwoPlanes.server.rows.join(' → ')}</p>
							<p class="plane-acts-as">{agentsTwoPlanes.server.actsAs}</p>
						</div>
					</div>
					<div class="plane-connectors" aria-hidden="true">
						<span></span>
						<span></span>
					</div>
					<div class="plane-boundary">
						<strong>{agentsTwoPlanes.boundary.title}</strong>
						<span>{agentsTwoPlanes.boundary.subline}</span>
					</div>
					<div class="plane-connector-single" aria-hidden="true"></div>
					<div class="plane-records">
						<span>{agentsTwoPlanes.records.label}</span>
					</div>
				</div>
			</div>
		{:else if topic.slug === 'state-not-screen'}
			<div class="agent-demo-embed">
				<AgentAwareFormDemo />
			</div>
			<p class="demo-pointer">
				The same demo, with its technical notes, is on the <a href="/ui">UI overview</a> and in the
				<a href="/playground?entry=agent-aware-form">Playground</a>.
			</p>
		{:else if topic.slug === 'what-you-turn-on'}
			<div class="evidence-table-wrap agents-ladder">
				<table class="evidence-table">
					<thead>
						<tr>
							<th scope="col">Layer</th>
							<th scope="col">Default</th>
							<th scope="col">What changes it</th>
						</tr>
					</thead>
					<tbody>
						{#each agentsDefaultsLadder as row (row.layer)}
							<tr>
								<td data-label="Layer">{row.layer}</td>
								<td data-label="Default">{row.defaultValue}</td>
								<td data-label="What changes it">{row.changedBy}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/each}

	<section class="boundaries" aria-labelledby="boundaries-heading">
		<div class="section-heading">
			<p>Continue by task</p>
			<h2 id="boundaries-heading">Use the section that owns the next question.</h2>
		</div>
		<div>
			<a href="/interaction">
				<strong>Interaction</strong>
				<span>How persons and agents propose, confirm, and refuse — moment to moment.</span>
			</a>
			<a href="/framework">
				<strong>Framework</strong>
				<span>The one declaration everything on this page projects from.</span>
			</a>
			<a href="/tooling">
				<strong>Tooling</strong>
				<span
					>The hosted and local MCP surfaces, and the coding-agent tools — a different audience.
					This page is about agents that use a running application. The tools that help agents build
					one live in Tooling.</span
				>
			</a>
			<a href="/reference">
				<strong>Reference</strong>
				<span>The exhaustive interface, authorization, and security contracts.</span>
			</a>
			<a href="/playground">
				<strong>Playground</strong>
				<span>The released controls these tools address, standalone.</span>
			</a>
		</div>
	</section>
</article>

<style>
	.agents-page {
		width: min(70rem, calc(100% - 3rem));
		margin: 0 auto;
		padding: clamp(3rem, 7vw, 5.5rem) 0 6rem;
	}

	.hero {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.85fr);
		gap: clamp(2rem, 6vw, 4rem);
		align-items: center;
		padding-bottom: clamp(3rem, 7vw, 5.5rem);
	}

	.eyebrow {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		max-width: 38rem;
		margin-top: 0.75rem;
		font-size: clamp(2.3rem, 5.5vw, 3.9rem);
		letter-spacing: -0.05em;
		line-height: 1.02;
	}

	.hero-lede {
		display: grid;
		gap: 1rem;
		max-width: 42rem;
		margin-top: 1.5rem;
	}

	.hero-lede p,
	.scale-line {
		color: var(--site-muted);
		font-size: 0.92rem;
		line-height: 1.68;
	}

	.scale-line {
		max-width: 42rem;
		margin-top: 1.4rem;
		padding-top: 1.2rem;
		border-top: 1px solid var(--site-line);
	}

	.scale-line a {
		color: var(--site-ink);
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

	.mini-plane {
		color: var(--site-muted);
		font: 0.66rem var(--site-font-mono);
		text-transform: uppercase;
	}

	.doors-table-wrap,
	.two-plane-wrap {
		max-width: 62rem;
		margin-top: 1.5rem;
	}

	.doors-table {
		border-top: 1px solid var(--site-line-strong);
	}

	.doors-head,
	.doors-row {
		display: grid;
		grid-template-columns: 2.5rem 13rem minmax(0, 1fr) auto;
		gap: 0.75rem 1.25rem;
		align-items: center;
		padding: 0.65rem 0;
	}

	.doors-head {
		color: var(--site-muted);
		font: 700 0.62rem var(--site-font-mono);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.doors-row {
		border-bottom: 1px solid var(--site-line-strong);
	}

	.doors-index {
		color: var(--site-accent-strong);
		font: 700 0.68rem var(--site-font-mono);
	}

	.doors-name {
		font-size: 0.86rem;
		font-weight: 700;
	}

	.doors-desc {
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.55;
	}

	.doors-chip {
		justify-self: start;
		padding: 0.3rem 0.65rem;
		border-radius: 999px;
		background: var(--site-accent-soft);
		color: var(--site-ink);
		font: 0.63rem var(--site-font-mono);
		white-space: nowrap;
	}

	.doors-chip[data-plane='server'] {
		border: 1px solid var(--site-line-strong);
		background: var(--site-paper-deep);
	}

	.scope-reconciliation {
		max-width: 46rem;
		margin-top: 1.25rem;
		color: var(--site-muted);
		font-size: 0.78rem;
		line-height: 1.6;
	}

	.two-plane-diagram {
		padding: 1.25rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		background: var(--site-surface);
	}

	.plane-top {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.plane-card {
		padding: 1rem;
		border: 1px solid var(--site-line);
		border-radius: var(--site-radius-md);
		background: var(--site-paper-deep);
	}

	.plane-chip {
		color: var(--site-accent-strong);
		font: 700 0.62rem var(--site-font-mono);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.plane-rows {
		margin-top: 0.6rem;
		font-size: 0.84rem;
		font-weight: 700;
	}

	.plane-acts-as {
		margin-top: 0.5rem;
		color: var(--site-muted);
		font-size: 0.76rem;
		line-height: 1.5;
	}

	.plane-connectors {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}

	.plane-connectors span {
		justify-self: center;
		width: 2px;
		height: 1.25rem;
		background: var(--site-accent-strong);
	}

	.plane-boundary {
		display: grid;
		gap: 0.35rem;
		padding: 1rem 1.25rem;
		border: 1px solid color-mix(in srgb, var(--site-accent-strong) 60%, var(--site-line));
		border-radius: var(--site-radius-md);
		background: var(--site-accent-soft);
		text-align: center;
	}

	.plane-boundary strong {
		font-size: 0.94rem;
	}

	.plane-boundary span {
		color: var(--site-muted);
		font-size: 0.74rem;
	}

	.plane-connector-single {
		justify-self: center;
		width: 2px;
		height: 1.25rem;
		margin: 0 auto;
		background: var(--site-accent-strong);
	}

	.plane-records {
		display: grid;
		justify-items: center;
		padding: 0.75rem;
		border: 1px solid var(--site-line);
		border-radius: var(--site-radius-md);
		background: var(--site-paper);
	}

	.plane-records span {
		color: var(--site-ink);
		font: 700 0.72rem var(--site-font-mono);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.agent-demo-embed {
		max-width: 62rem;
		margin-top: 1.5rem;
	}

	.demo-pointer {
		max-width: 52rem;
		margin-top: 1rem;
		color: var(--site-muted);
		font-size: 0.85rem;
		line-height: 1.6;
	}

	.demo-pointer a {
		color: var(--site-ink);
	}

	.evidence-table-wrap.agents-ladder {
		max-width: 62rem;
		margin-top: 1.5rem;
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
		max-width: 18rem;
		color: var(--site-ink);
		font-weight: 700;
	}

	.boundaries {
		padding: clamp(2.8rem, 6vw, 4.75rem) 0;
		border-top: 1px solid var(--site-line-strong);
	}

	.section-heading {
		max-width: 48rem;
		margin-bottom: 1.75rem;
	}

	.section-heading > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.section-heading h2 {
		margin-top: 0.6rem;
		font-size: clamp(1.75rem, 4vw, 2.7rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}

	.boundaries > div:last-child {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
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

	.boundaries a:hover {
		background: var(--site-surface);
	}

	.boundaries strong {
		font-size: 0.82rem;
	}

	.boundaries span {
		color: var(--site-muted);
		font-size: 0.72rem;
		line-height: 1.5;
	}

	@media (max-width: 64rem) {
		.boundaries > div:last-child {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 58rem) {
		.hero {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 48rem) {
		.plane-top {
			grid-template-columns: 1fr;
		}

		.plane-connectors {
			display: none;
		}
	}

	@media (max-width: 42rem) {
		.agents-page {
			width: min(100% - 1.75rem, 70rem);
		}

		.doors-head {
			display: none;
		}

		.doors-row {
			grid-template-columns: 1fr;
			gap: 0.3rem;
			padding: 1rem 0;
		}

		.doors-chip {
			justify-self: start;
		}

		.boundaries > div:last-child {
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
