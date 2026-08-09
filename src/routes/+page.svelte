<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { foundationGuides } from '$lib/data/guides';
	import { SMRT_VERSION } from '$lib/version';

	const updates = [
		{
			title: 'Agent-assisted forms',
			body: 'Let chat, voice, tutorials, or tests find and explain controls, then stage changes behind explicit confirmation.',
			href: '/capabilities/agent-assisted-forms'
		},
		{
			title: 'Learning agents',
			body: 'Agents can recall useful experience, track outcomes, and propose instruction changes behind a human approval step.',
			href: '/capabilities/learning-agents'
		},
		{
			title: 'Mobile foundation',
			body: 'Shared offline, authentication, networking, and evidence-capture behavior for native Android and iOS apps.',
			href: '/capabilities/mobile'
		},
		{
			title: 'Hydration and live data',
			body: 'Start with server-rendered rows, seed the browser collection, then keep it current without a duplicate first fetch.',
			href: '/capabilities/live-data'
		},
		{
			title: 'WebMCP',
			body: 'A page can offer selected application tools to a browser agent through the signed-in user session.',
			href: '/capabilities/webmcp'
		},
		{
			title: 'Reports',
			body: 'Define durable aggregate models with full and incremental refresh, schedules, watermarks, and tenant scope.',
			href: '/capabilities/reports'
		},
		{
			title: 'Standard UI foundation',
			body: 'Build with one accessible component contract for forms, collections, tables, feedback, overlays, layouts, and themes.',
			href: '/packages/smrt-ui'
		}
	];
</script>

<SEO
	title="s-m-r-t documentation"
	description="Learn s-m-r-t in the order an application is built, then browse packages, components, generated interfaces, and the playground."
	url="https://s-m-r-t.dev"
/>

<article class="docs-home">
	<header class="page-intro">
		<p class="eyebrow">s-m-r-t documentation · {SMRT_VERSION}</p>
		<h1>Build an application from the model outward.</h1>
		<p>
			s-m-r-t starts with TypeScript objects and connects the common application pieces around them:
			storage, tenants, users, permissions, web pages, APIs, agent tools, and operator commands.
		</p>
	</header>

	<section class="start-options" aria-labelledby="start-heading">
		<div class="section-heading">
			<h2 id="start-heading">Choose where to start</h2>
			<p>Both paths use the same foundations and package reference.</p>
		</div>
		<div class="start-grid">
			<a href="/starters/ground-up">
				<span>Ground up</span>
				<h3>Basic SvelteKit template</h3>
				<p>Best when you want to see each piece arrive and keep the application small.</p>
				<strong>Start with one object →</strong>
			</a>
			<a href="/starters/saas">
				<span>Production-shaped</span>
				<h3>s-m-r-t SaaS starter</h3>
				<p>
					Best when users, tenant administration, billing, and deployment should already be in
					place.
				</p>
				<strong>Tour the starter →</strong>
			</a>
		</div>
	</section>

	<section class="journey" aria-labelledby="journey-heading">
		<div class="section-heading">
			<h2 id="journey-heading">How an application comes together</h2>
			<p>
				These guides move from describing the product to deciding ownership, identity, access, and
				interfaces. Read across them or enter at the part you need.
			</p>
		</div>
		<ol>
			{#each foundationGuides as guide, index (guide.slug)}
				<li>
					<a href={`/foundations/${guide.slug}`}>
						<span>{String(index + 1).padStart(2, '0')}</span>
						<div>
							<h3>{guide.navTitle}</h3>
							<p>{guide.plainEnglish}</p>
						</div>
						<b>→</b>
					</a>
				</li>
			{/each}
		</ol>
	</section>

	<section class="updates" aria-labelledby="updates-heading">
		<div class="section-heading">
			<h2 id="updates-heading">Newer parts of the framework</h2>
			<p>Use these when the basic application path reaches the problem they solve.</p>
		</div>
		<div class="update-grid">
			{#each updates as update (update.href)}
				<a href={update.href}>
					<h3>{update.title}</h3>
					<p>{update.body}</p>
					<span>Read more →</span>
				</a>
			{/each}
		</div>
	</section>

	<aside class="browse-callout">
		<div>
			<h2>Looking for a package or component?</h2>
			<p>
				The package browser keeps the overview, components, playground, REST, MCP, WebMCP, and CLI
				notes together.
			</p>
		</div>
		<a href="/packages">Browse all packages →</a>
	</aside>
</article>

<style>
	.docs-home {
		width: min(980px, calc(100% - 48px));
		margin: 0 auto;
		padding: 58px 0 88px;
	}

	.page-intro {
		max-width: 760px;
		padding-bottom: 54px;
	}

	.eyebrow {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.055em;
		text-transform: uppercase;
	}

	h1 {
		max-width: 720px;
		margin-top: 14px;
		font-size: clamp(2.35rem, 5vw, 3.45rem);
		font-weight: 680;
		letter-spacing: -0.045em;
		line-height: 1.06;
	}

	.page-intro > p:last-child {
		max-width: 720px;
		margin-top: 20px;
		color: var(--site-muted);
		font-size: 1rem;
		line-height: 1.7;
	}

	section {
		padding: 42px 0 52px;
		border-top: 1px solid var(--site-line);
	}

	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 28px;
		align-items: baseline;
		margin-bottom: 24px;
	}

	.section-heading h2,
	.browse-callout h2 {
		font-size: 1.35rem;
		letter-spacing: -0.025em;
	}

	.section-heading p,
	.browse-callout p {
		max-width: 480px;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.55;
	}

	.start-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	.start-grid a,
	.update-grid a {
		border: 1px solid var(--site-line-strong);
		border-radius: 9px;
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}

	.start-grid a {
		min-height: 220px;
		display: flex;
		flex-direction: column;
		padding: 24px;
	}

	.start-grid a:hover,
	.update-grid a:hover {
		border-color: var(--site-accent-strong);
	}

	.start-grid span,
	.update-grid span {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.start-grid h3 {
		margin-top: 20px;
		font-size: 1.22rem;
	}

	.start-grid p,
	.update-grid p {
		margin-top: 10px;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.55;
	}

	.start-grid strong {
		margin-top: auto;
		padding-top: 22px;
		font-size: 0.78rem;
	}

	.journey ol {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}

	.journey li {
		border-bottom: 1px solid var(--site-line);
	}

	.journey a {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) 20px;
		gap: 14px;
		align-items: start;
		padding: 15px 8px;
		color: var(--site-ink);
		text-decoration: none;
	}

	.journey a:hover {
		background: var(--site-surface);
	}

	.journey a > span {
		padding-top: 2px;
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.66rem;
	}

	.journey h3 {
		font-size: 0.92rem;
	}

	.journey p {
		margin-top: 3px;
		color: var(--site-muted);
		font-size: 0.77rem;
		line-height: 1.5;
	}

	.journey b {
		font-weight: 500;
	}

	.update-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}

	.update-grid a {
		min-height: 190px;
		display: flex;
		flex-direction: column;
		padding: 18px;
	}

	.update-grid h3 {
		font-size: 0.98rem;
	}

	.update-grid span {
		margin-top: auto;
		padding-top: 18px;
		font-size: 0.6rem;
	}

	.browse-callout {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 30px;
		margin-top: 12px;
		padding: 26px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		background: var(--site-surface);
	}

	.browse-callout p {
		margin-top: 7px;
	}

	.browse-callout a {
		flex: 0 0 auto;
		color: var(--site-ink);
		font-size: 0.8rem;
		font-weight: 700;
	}

	@media (max-width: 760px) {
		.docs-home {
			width: min(100% - 28px, 980px);
			padding-top: 38px;
		}

		.section-heading,
		.browse-callout {
			align-items: flex-start;
			flex-direction: column;
		}

		.start-grid,
		.update-grid {
			grid-template-columns: 1fr;
		}

		.start-grid a,
		.update-grid a {
			min-height: 0;
		}
	}
</style>
