<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import {
		TOOLING_PINNED_VERSION,
		toolingGuides,
		toolingSurfaceBoundaries
	} from '$lib/data/tooling';

	const audiences = [
		{
			name: 'Developers',
			body: 'Developers create projects, change models, generate artifacts, run tests, and apply migrations. CI runs the same project checks and generation commands. These actions can write files or change the configured development database.'
		},
		{
			name: 'Coding agents',
			body: 'Coding agents inspect source, manifests, package contracts, and generated knowledge. Development MCP is read-only. Any separate permission to edit the repository comes from the coding-agent client.'
		},
		{
			name: 'Application agents',
			body: 'Application agents use generated local MCP, hosted application MCP, or WebMCP. Their calls can operate live data and remain inside the application authentication, tenant, permission, and field-policy boundaries.'
		}
	];
</script>

<SEO
	title="s-m-r-t developer tooling"
	description="Use s-m-r-t tools to build, inspect, test, and operate applications. Keep development MCP, generated MCP, hosted application MCP, and WebMCP separate."
	url="https://s-m-r-t.dev/tooling"
/>

<article class="tooling-index">
	<header>
		<p>Tooling · {TOOLING_PINNED_VERSION}</p>
		<h1>Build the application. Inspect the workspace. Operate the correct surface.</h1>
		<span
			>This section covers systems for developers and coding agents. It also explains the runtime
			surfaces that application agents use. These surfaces are not interchangeable. Every claim in
			this section was verified against the released {TOOLING_PINNED_VERSION} packages.</span
		>
	</header>

	<section>
		<h2>Three audiences</h2>
		<div class="audience-grid">
			{#each audiences as audience (audience.name)}
				<div class="audience">
					<strong>{audience.name}</strong>
					<p>{audience.body}</p>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2>Separate surfaces</h2>
		<div class="table-scroll">
			<table>
				<thead>
					<tr>
						<th scope="col">Surface</th>
						<th scope="col">Primary audience</th>
						<th scope="col">Boundary</th>
						<th scope="col">Reach for it when</th>
					</tr>
				</thead>
				<tbody>
					{#each toolingSurfaceBoundaries as row (row.label)}
						<tr>
							<th scope="row"><a href={row.href}>{row.label}</a></th>
							<td class="audience-cell">{row.eyebrow}</td>
							<td>{row.description}</td>
							<td>{row.plainEnglish}</td>
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
			The <a href="/framework">Framework section</a> explains the shared application model. The
			<a href="/reference/interfaces">generated interfaces</a> reference defines how that model
			produces REST, MCP, WebMCP, and CLI views. The
			<a href="/reference/security">security defaults</a>
			reference defines how those interfaces fail closed. Use the
			<a href="/guides/testing-your-app">testing guide</a> or the
			<a href="/guides/expose-your-app-over-mcp">application MCP guide</a> for a complete procedure.
			Package pages for
			<a href="/packages/smrt-app-mcp">smrt-app-mcp</a>
			and <a href="/packages/smrt-dev-mcp">smrt-dev-mcp</a> hold the per-package detail.
		</p>
	</aside>
</article>

<style>
	.tooling-index {
		width: min(70rem, calc(100% - 3rem));
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
	.audience-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.audience {
		padding: 18px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		border-radius: 7px;
		background: var(--site-surface);
	}
	.audience strong {
		display: block;
		font-size: 0.92rem;
	}
	.audience p {
		margin-top: 9px;
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.6;
	}
	.table-scroll {
		overflow-x: auto;
	}
	table {
		width: 100%;
		min-width: 760px;
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
		width: 150px;
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
	.audience-cell {
		width: 122px;
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
			width: min(100% - 1.75rem, 70rem);
			padding-top: 36px;
		}
		.audience-grid {
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
