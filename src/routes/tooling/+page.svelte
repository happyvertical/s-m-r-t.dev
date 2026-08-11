<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { TOOLING_PINNED_VERSION, toolingGuides } from '$lib/data/tooling';

	const planes = [
		{
			tier: 'Tier 2',
			name: 'Development and knowledge',
			body: 'Reads a workspace on disk plus the contracts shipped by installed SMRT and SDK packages. It never touches application data, principals, or tenants. The framework CLI and the development MCP server both live here.'
		},
		{
			tier: 'Tier 1',
			name: 'Application runtime',
			body: 'Generated from the @smrt() objects an application already defines, and served over local stdio or a stateless HTTP endpoint. Every call resolves through the same models, permissions, tenants, and field policy as the rest of the app.'
		}
	];

	const surfaces = [
		{
			surface: 'Framework CLI',
			plane: 'Tier 2',
			runs: 'Your terminal',
			when: 'A person or a script needs the knowledge index, a freshness check, a diff against a base ref, or a prompt bundle.',
			href: '/tooling/knowledge'
		},
		{
			surface: 'smrt-dev-mcp',
			plane: 'Tier 2',
			runs: 'Local stdio, launched by your client',
			when: 'A coding agent needs workspace and installed-package knowledge, plus class generation, introspection, and review or architecture context.',
			href: '/tooling/dev-mcp'
		},
		{
			surface: 'Generated stdio MCP',
			plane: 'Tier 1',
			runs: 'Local stdio, beside the application',
			when: 'An agent on the same machine should perform real data operations. It takes credentials from its environment, so it stays local.',
			href: '/tooling/app-mcp'
		},
		{
			surface: 'App MCP over HTTP',
			plane: 'Tier 1',
			runs: 'One route in your deployed app',
			when: 'A remote agent needs application capabilities, with authorization terminated at the gateway and a principal resolved per request.',
			href: '/tooling/app-mcp'
		},
		{
			surface: 'Packaged Agent Plugin',
			plane: 'Tier 2',
			runs: 'Discovered from the installed package root',
			when: 'Your client supports Agent Plugins and you would rather install the development server than hand-write its configuration.',
			href: '/tooling/agent-plugin'
		}
	];
</script>

<SEO
	title="s-m-r-t developer tooling"
	description="Choose between the s-m-r-t CLI, the smrt-dev-mcp development server, generated stdio MCP, application MCP over HTTP, and packaged Agent Plugins."
	url="https://s-m-r-t.dev/tooling"
/>

<article class="tooling-index">
	<header>
		<p>Developer tooling · {TOOLING_PINNED_VERSION}</p>
		<h1>Choose the surface that matches the job.</h1>
		<span
			>s-m-r-t exposes its work to people and to software agents through several surfaces. They are
			not interchangeable: three of them describe your codebase, and two of them operate your
			running application. Every claim in this section was verified against the released {TOOLING_PINNED_VERSION}
			packages.</span
		>
	</header>

	<section>
		<h2>Two planes</h2>
		<div class="plane-grid">
			{#each planes as plane (plane.tier)}
				<div class="plane">
					<span>{plane.tier}</span>
					<strong>{plane.name}</strong>
					<p>{plane.body}</p>
				</div>
			{/each}
		</div>
		<p class="note">
			The separation is the point. The development server analyses code and cannot read application
			data; the generated and application servers operate on data and know nothing about your
			workspace layout. A framework documentation tier also exists, but it is no longer launched
			from the framework monorepo and is configured separately.
		</p>
	</section>

	<section>
		<h2>Decision path</h2>
		<div class="table-scroll">
			<table>
				<thead>
					<tr>
						<th scope="col">Surface</th>
						<th scope="col">Plane</th>
						<th scope="col">Runs where</th>
						<th scope="col">Reach for it when</th>
					</tr>
				</thead>
				<tbody>
					{#each surfaces as row (row.surface)}
						<tr>
							<th scope="row"><a href={row.href}>{row.surface}</a></th>
							<td class="plane-cell">{row.plane}</td>
							<td>{row.runs}</td>
							<td>{row.when}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section>
		<h2>Pages in this section</h2>
		<div class="page-list">
			{#each toolingGuides as guide (guide.slug)}
				<a href={`/tooling/${guide.slug}`}>
					<strong>{guide.navTitle ?? guide.title}</strong>
					<p>{guide.plainEnglish}</p>
					<span>→</span>
				</a>
			{/each}
		</div>
	</section>

	<aside>
		<strong>Related material</strong>
		<p>
			The <a href="/reference/interfaces">generated interfaces</a> reference explains how REST, MCP,
			WebMCP, and CLI views are produced from one model, and
			<a href="/reference/security">security defaults</a>
			covers how those interfaces fail closed. Package pages for
			<a href="/packages/smrt-app-mcp">smrt-app-mcp</a>
			and <a href="/packages/smrt-dev-mcp">smrt-dev-mcp</a> hold the per-package detail.
		</p>
	</aside>
</article>

<style>
	.tooling-index {
		width: min(940px, calc(100% - 48px));
		margin: 0 auto;
		padding: 54px 0 86px;
	}
	header {
		max-width: 760px;
		padding-bottom: 34px;
	}
	header > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		text-transform: uppercase;
	}
	h1 {
		margin-top: 11px;
		font-size: clamp(2.15rem, 5vw, 3.25rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	header > span {
		display: block;
		margin-top: 17px;
		color: var(--site-muted);
		font-size: 0.94rem;
		line-height: 1.65;
	}
	section {
		padding: 30px 0;
		border-top: 1px solid var(--site-line);
	}
	section > h2 {
		margin-bottom: 18px;
		font-size: 1.1rem;
	}
	.plane-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.plane {
		padding: 18px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		border-radius: 7px;
		background: var(--site-surface);
	}
	.plane span {
		color: var(--site-accent-strong);
		font: 700 0.6rem var(--site-font-mono);
		text-transform: uppercase;
	}
	.plane strong {
		display: block;
		margin-top: 7px;
		font-size: 0.92rem;
	}
	.plane p {
		margin-top: 9px;
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.6;
	}
	.note {
		margin-top: 16px;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.65;
	}
	.table-scroll {
		overflow-x: auto;
	}
	table {
		width: 100%;
		min-width: 640px;
		border-collapse: collapse;
		text-align: left;
	}
	th,
	td {
		padding: 11px 12px 11px 0;
		border-bottom: 1px solid var(--site-line);
		vertical-align: top;
	}
	thead th {
		color: var(--site-muted);
		font: 700 0.63rem var(--site-font-mono);
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	tbody th {
		width: 168px;
		font-size: 0.82rem;
	}
	tbody th a {
		color: var(--site-ink);
		text-decoration: none;
	}
	tbody th a:hover {
		color: var(--site-accent-strong);
	}
	td {
		color: var(--site-muted);
		font-size: 0.79rem;
		line-height: 1.55;
	}
	.plane-cell {
		width: 74px;
		color: var(--site-accent-strong);
		font: 0.68rem var(--site-font-mono);
	}
	.page-list {
		border-top: 1px solid var(--site-line);
	}
	.page-list a {
		display: grid;
		grid-template-columns: 200px 1fr 20px;
		gap: 18px;
		padding: 14px 6px;
		border-bottom: 1px solid var(--site-line);
		color: var(--site-ink);
		text-decoration: none;
	}
	.page-list a:hover {
		background: var(--site-surface);
	}
	.page-list strong {
		font-size: 0.84rem;
	}
	.page-list p {
		color: var(--site-muted);
		font-size: 0.76rem;
		line-height: 1.5;
	}
	.page-list span {
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
	}
	aside {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: 24px;
		margin-top: 32px;
		padding: 20px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		background: var(--site-surface);
	}
	aside strong {
		font-size: 0.8rem;
	}
	aside p {
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.55;
	}
	aside a {
		color: var(--site-ink);
	}
	@media (max-width: 700px) {
		.tooling-index {
			width: min(100% - 28px, 940px);
			padding-top: 36px;
		}
		.plane-grid {
			grid-template-columns: 1fr;
		}
		.page-list a {
			grid-template-columns: 1fr 18px;
		}
		.page-list p {
			grid-column: 1;
		}
		aside {
			grid-template-columns: 1fr;
			gap: 7px;
		}
	}
</style>
