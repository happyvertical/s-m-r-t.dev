<script lang="ts">
	import { siteUrl } from '$lib/site';
	import SEO from '$lib/components/SEO.svelte';
	import { KITCHEN_COMMAND } from '$lib/commands';
	import { BUILD_PATH, DEMO_PATH } from '$lib/data/doors';
	import { toolingGuides } from '$lib/data/tooling';

	// The tools index (#397). build-a-boilerplate is the one tool today and keeps
	// its own URL; the command line and agent tooling are documentation, so the
	// list below is generated from the tooling guides.
</script>

<SEO
	title="Tools"
	description="Tools that plan and start a smrt application: build-a-boilerplate in the browser, and the command line and agent tooling in the docs."
	url={siteUrl('/tools')}
/>

<div class="tools">
	<header class="wrap hero">
		<p class="kicker">Tools</p>
		<h1>Plan it, then get it running.</h1>
		<p class="sub">
			One tool lives here on the site. The docs cover the command line and the agent tooling.
		</p>
	</header>

	<section class="wrap" aria-labelledby="planner">
		<div class="tool">
			<div class="tool-copy">
				<span class="tag">in the browser</span>
				<h2 id="planner">build-a-boilerplate</h2>
				<p>
					Pick the features you want and a working mock-up assembles around them. When it looks
					right, export the cookbook and start a project from it. Nothing to install.
				</p>
				<p class="cta">
					<a class="btn" href={BUILD_PATH}>Open build-a-boilerplate</a>
					<a class="btn quiet" href={DEMO_PATH}>Pick features on the map first</a>
				</p>
			</div>
			<div class="tool-side">
				<p class="side-label">Or run it on your own machine</p>
				<p class="cmd"><code>{`${KITCHEN_COMMAND}`}</code></p>
				<p class="fine">
					Opens the planner in your browser. Pick your features, then send them to the kitchen.
				</p>
			</div>
		</div>
	</section>

	<section class="wrap docs" aria-labelledby="tooling-docs">
		<div class="head">
			<h2 id="tooling-docs">For the terminal and for your agent.</h2>
			<p>
				The command line, the scanner and the MCP servers are documented under
				<a href="/docs/tooling">Tooling</a>.
			</p>
		</div>
		<ul class="list">
			{#each toolingGuides as guide (guide.slug)}
				<li>
					<a href={`/docs/tooling/${guide.slug}`}>{guide.navTitle}</a>
					<span>{guide.title}</span>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.tools {
		padding-bottom: 80px;
		color: var(--site-ink);
		font-family: var(--site-font-sans);
		line-height: 1.6;
	}
	.wrap {
		width: min(1120px, 100% - 32px);
		margin-inline: auto;
	}
	.hero {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-block: 64px 40px;
	}
	.kicker,
	.tag {
		color: var(--site-accent);
		font-family: var(--site-font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.02em;
	}
	h1 {
		font-size: clamp(2.1rem, 4.6vw, 3.2rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.04;
		text-wrap: balance;
	}
	.sub {
		max-width: 34em;
		color: var(--site-muted);
		font-size: 1.1rem;
	}

	.tool {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		gap: 0;
		overflow: hidden;
		border: 1px solid var(--site-line);
		border-radius: 16px;
		background: var(--site-surface);
	}
	.tool-copy,
	.tool-side {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 28px;
	}
	.tool-side {
		justify-content: center;
		background: var(--site-fill);
		color: var(--site-on-fill);
	}
	h2 {
		font-size: clamp(1.5rem, 3vw, 2rem);
		font-weight: 700;
		letter-spacing: -0.025em;
		line-height: 1.1;
	}
	.tool-copy p {
		color: var(--site-muted);
	}
	.cta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 8px;
	}
	.btn {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 20px;
		border: 1px solid var(--site-fill);
		border-radius: 10px;
		background: var(--site-fill);
		color: var(--site-on-fill);
		font-size: 0.98rem;
		font-weight: 600;
		text-decoration: none;
	}
	.btn.quiet {
		border-color: var(--site-line);
		background: transparent;
		color: var(--site-ink);
	}
	.btn:hover {
		filter: brightness(1.08);
	}
	.btn.quiet:hover {
		border-color: var(--site-ink);
		filter: none;
	}
	.side-label {
		font-family: var(--site-font-display);
		font-size: 1.15rem;
		font-weight: 700;
	}
	.side-label::before {
		content: '';
		display: block;
		width: 56px;
		height: 6px;
		margin-bottom: 14px;
		border-radius: 3px;
		background: var(--site-brass);
	}
	.cmd {
		padding: 10px 14px;
		border-radius: 10px;
		background: var(--site-code-bg);
		color: var(--site-code-ink);
		font-family: var(--site-font-mono);
		font-size: 0.86rem;
		overflow-wrap: anywhere;
	}
	.cmd::before {
		content: '$ ';
		color: var(--site-code-dim);
	}
	.cmd code {
		font: inherit;
	}
	.fine {
		font-size: 0.88rem;
	}

	.docs {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
		gap: 48px;
		align-items: start;
		margin-top: 72px;
		padding-top: 72px;
		border-top: 1px solid var(--site-line);
	}
	.head {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.head p {
		color: var(--site-muted);
		font-size: 1.05rem;
	}
	.head a,
	.list a {
		color: var(--site-accent);
	}
	.list {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}
	.list li {
		display: grid;
		grid-template-columns: minmax(0, 11em) minmax(0, 1fr);
		gap: 16px;
		padding: 14px 0;
		border-bottom: 1px solid var(--site-line);
		font-size: 0.95rem;
	}
	.list a {
		font-weight: 600;
		text-decoration: none;
	}
	.list a:hover {
		text-decoration: underline;
	}
	.list span {
		color: var(--site-muted);
	}

	@media (max-width: 860px) {
		.hero {
			padding-block: 40px 28px;
		}
		.tool,
		.docs {
			grid-template-columns: minmax(0, 1fr);
		}
		.docs {
			gap: 28px;
			margin-top: 52px;
			padding-top: 52px;
		}
	}
	@media (max-width: 560px) {
		.list li {
			grid-template-columns: minmax(0, 1fr);
			gap: 4px;
		}
	}
</style>
