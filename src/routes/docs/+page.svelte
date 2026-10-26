<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { documentationSections } from '$lib/data/navigation';

	const developerLinks = [
		{
			label: 'Getting Started',
			href: '/docs/getting-started',
			description: 'Pick a starting point: a cookbook, smrt-start, or an existing project.'
		},
		{
			label: 'smrt-start',
			href: '/docs/getting-started/smrt-start',
			description: 'Scaffold a SvelteKit application with the framework already wired in.'
		},
		{
			label: 'build-a-boilerplate',
			href: '/build-a-boilerplate',
			description: 'Assemble a working mock-up in the browser and export it as a cookbook.'
		},
		{
			label: 'Task guides',
			href: '/docs/guides',
			description: 'Follow one procedure to one complete result.'
		}
	];

	const agentLinks = [
		{
			label: 'llms.txt',
			href: '/llms.txt',
			description: 'The site directory for language models, one line per page.'
		},
		{
			label: 'Agent docs',
			href: '/llms-full.txt',
			description:
				'Curated full-page context. Every page also has a Markdown copy at its path plus .md.'
		},
		{
			label: 'Application MCP',
			href: '/docs/tooling/app-mcp',
			description: 'Generated and hosted MCP for permitted runtime data operations.'
		},
		{
			label: 'Development MCP',
			href: '/docs/tooling/dev-mcp',
			description: 'Read-only workspace and installed-package knowledge for coding agents.'
		},
		{
			label: 'Evidence',
			href: '/docs/reference/evidence',
			description: 'Each site claim beside the released source it was verified in.'
		}
	];
</script>

<SEO
	title="s-m-r-t docs"
	description="Documentation for developers and agents: getting started, the machine-readable entry points, and every technical section of the s-m-r-t framework."
	url="https://s-m-r-t.dev/docs"
/>

<article class="docs-landing">
	<header>
		<p class="kicker">Docs</p>
		<h1>Documentation for developers and agents</h1>
		<span class="lede"
			>Start building on the left. Point an agent at the entry points on the right. Every technical
			section follows below.</span
		>
	</header>

	<div class="audiences">
		<section class="audience" aria-labelledby="for-developers">
			<h2 id="for-developers">For developers</h2>
			<ul>
				{#each developerLinks as link (link.href)}
					<li>
						<a href={link.href}>
							<strong>{link.label}</strong>
							<span>{link.description}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<section class="audience" aria-labelledby="for-agents">
			<h2 id="for-agents">For agents</h2>
			<ul>
				{#each agentLinks as link (link.href)}
					<li>
						<a href={link.href}>
							<strong>{link.label}</strong>
							<span>{link.description}</span>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</div>

	<section class="sections" aria-labelledby="docs-sections">
		<h2 id="docs-sections">Sections</h2>
		<ul class="section-grid">
			<!-- The technical sections in docs-panel order; filtered inline so
			     check:copy can trace the copy to documentationSections. -->
			{#each documentationSections.filter((section) => section.id !== 'docs') as section (section.id)}
				<li>
					<a href={section.href}>
						<strong>{section.label}</strong>
						<span>{section.description}</span>
						<b aria-hidden="true">→</b>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</article>

<style>
	.docs-landing {
		width: min(68rem, calc(100% - 2rem));
		margin: 0 auto;
		padding: clamp(2.5rem, 6vw, 4.5rem) 0 5rem;
	}

	header {
		max-width: 46rem;
		padding-bottom: 2.25rem;
	}

	.kicker {
		color: var(--site-accent-ink);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		margin-top: 0.7rem;
		font-size: clamp(2.2rem, 6vw, 3.9rem);
		letter-spacing: -0.045em;
		line-height: 1.02;
	}

	.lede {
		display: block;
		max-width: 40rem;
		margin-top: 1rem;
		color: var(--site-muted);
		font-size: 1rem;
		line-height: 1.65;
	}

	h2 {
		margin-bottom: 0.9rem;
		font-size: 1.15rem;
		letter-spacing: -0.02em;
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.audiences {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.1rem;
	}

	.audience {
		padding: 1.4rem;
		border: 1px solid var(--site-line);
		border-radius: var(--site-radius-lg);
		background: var(--site-surface);
	}

	.audience li + li {
		border-top: 1px solid var(--site-line);
	}

	.audience a,
	.section-grid a {
		display: grid;
		gap: 0.25rem;
		color: var(--site-ink);
		text-decoration: none;
	}

	.audience a {
		padding: 0.8rem 0;
	}

	.audience strong,
	.section-grid strong {
		font-size: 0.95rem;
	}

	.audience span,
	.section-grid span {
		color: var(--site-muted);
		font-size: 0.86rem;
		line-height: 1.5;
	}

	.audience a:hover strong,
	.section-grid a:hover strong {
		color: var(--site-accent-ink);
	}

	.sections {
		margin-top: 2.75rem;
	}

	.section-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
		gap: 0.9rem;
	}

	.section-grid a {
		position: relative;
		height: 100%;
		padding: 1.1rem 2.4rem 1.1rem 1.2rem;
		border: 1px solid var(--site-line);
		border-radius: var(--site-radius-lg);
		background: var(--site-surface);
	}

	.section-grid b {
		position: absolute;
		inset-block-start: 1.05rem;
		inset-inline-end: 1.1rem;
		color: var(--site-accent-ink);
	}

	.audience a:focus-visible,
	.section-grid a:focus-visible {
		outline: 2px solid var(--site-accent-ink);
		outline-offset: 3px;
	}

	@media (max-width: 48rem) {
		.audiences {
			grid-template-columns: 1fr;
		}
	}
</style>
