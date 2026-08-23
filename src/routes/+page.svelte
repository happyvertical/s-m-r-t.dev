<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { foundationGuides } from '$lib/data/guides';
	import { SMRT_VERSION } from '$lib/version';
	import { DataTable, type DataTableColumn } from '@happyvertical/smrt-ui/data';
	import { whySmrtClaims } from '$lib/data/why-smrt-claims';

	const articleModel = `import {
  field, smrt, SmrtObject
} from '@happyvertical/smrt-core';

@smrt({
  api: {
    include: ['list', 'get', 'create', 'update']
  },
  mcp: { include: ['publish'] },
  cli: false,
  ui: {
    label: 'Articles',
    description: 'Stories your team publishes.'
  }
})
export class Article extends SmrtObject {
  title = '';       // becomes a text column
  body = '';        // text
  featured = false; // boolean

  @field({ required: true })
  author = '';

  @field({
    readonly: true,
    description: 'Server-set; writes cannot touch it.'
  })
  viewCount = 0;

  @field({
    sensitive: true,
    exported: false,
    description: 'Editorial notes for the team.',
    ui: { group: 'Editorial', order: 10 }
  })
  authorNotes = '';

  async publish() {
    return true;
  }
}`;

	const projections = [
		{
			label: 'Storage',
			body: 'A database table and a typed collection for saving and querying articles.',
			href: '/reference/collections'
		},
		{
			label: 'REST API',
			body: 'Endpoints and clients for application code, limited to the actions declared on the model.',
			href: '/reference/interfaces'
		},
		{
			label: 'Forms',
			body: 'Form controls that share the model’s fields, validation, and field-level rules — and describe themselves, so an application agent can find, explain, and check them.',
			href: '/capabilities/agent-assisted-forms'
		},
		{
			label: 'CLI',
			body: 'The same operations as commands for operators and scripts, when a model enables them — this one declares them off.',
			href: '/reference/interfaces'
		},
		{
			label: 'Agent tools',
			body: 'publish() becomes a structured tool an AI assistant can call — through the same checks.',
			href: '/tooling/app-mcp'
		},
		{
			label: 'Permissions',
			body: 'Named permissions such as articles.read and articles.publish, enforced on every surface.',
			href: '/reference/authorization'
		}
	];

	const powers = [
		{
			title: 'Less code to write and maintain.',
			body: 'The repetitive route, schema, command, and tool wiring is generated from the models. What is left to write, test, and review is the part that is actually your product.'
		},
		{
			title: 'Most of the pieces, already built.',
			body: 'Users, tenants, jobs, reports, content, commerce, messages, ledgers, images, and analytics ship as packages sharing the same model contract — frontend components and backend behavior together, made to wire into each other. Much of what many products need exists before you write anything; the package browser shows what is already there.'
		},
		{
			title: 'Change it once. It changes everywhere.',
			body: 'Add a field to a model and the database, forms, API, and agent tools pick it up together. There is no second schema, route file, or tool description to update — the interfaces cannot drift, because they are not written separately.'
		},
		{
			title: 'You decide what agents can do.',
			body: 'Agent access is declared per action, and the permissions that limit people limit agents. An agent can know a field exists without being able to read it, and can propose a change without being able to apply it until a person approves — awareness is not authority.'
		},
		{
			title: 'Any agent, without a second integration.',
			body: 'Most applications special-case AI behind a separate integration that re-describes the product and goes stale as the product changes. Here, the operations people use are the operations agents use — your own, your customer’s assistant, whatever comes next. A capability you choose to expose is available to all of them the day it exists: an include entry, not a new integration.'
		},
		{
			title: 'A component library wired to the models.',
			body: 'Accessible forms, collections, tables, feedback, overlays, layouts, and themes — the components this site itself is built from. They share the application’s session, permissions, and theme, and the form and collection pieces work from your models. Try them in the playground first.'
		}
	];

	const losses = [
		{
			title: 'The glue between systems.',
			body: 'A form library, an admin panel, an API framework, a job runner, an auth system, and an AI SDK each hold their own copy of your domain — and you write the wiring between them. Here they are one set of packages sharing one model, so that glue is not your code to write, test, or debug.'
		},
		{
			title: 'The version matrix.',
			body: 'The s-m-r-t packages release in lockstep: one framework version that moves together — no dependency hell, no compatibility matrix to resolve at every upgrade.'
		},
		{
			title: 'The lock-in bet.',
			body: 'Committing to a framework should not mean losing the exits. The license is MIT, models are TypeScript classes in your own repository, data lives in SQLite or Postgres, and agents connect over open protocols such as MCP.'
		}
	];

	interface ApplicationSurface {
		id: string;
		surface: string;
		entry: string;
		sharedRule: string;
		for: string;
	}

	const applicationSurfaces: ApplicationSurface[] = [
		{
			id: 'browser',
			surface: 'Browser UI',
			entry: 'SvelteKit page',
			sharedRule: 'Field policies and permissions',
			for: 'People'
		},
		{
			id: 'api',
			surface: 'REST API',
			entry: 'Generated route',
			sharedRule: 'Model schema and tenant scope',
			for: 'Integrations'
		},
		{
			id: 'agent',
			surface: 'Agent tool',
			entry: 'MCP or WebMCP',
			sharedRule: 'Operation permissions',
			for: 'Agents'
		},
		{
			id: 'operator',
			surface: 'Operator command',
			entry: 'Generated CLI',
			sharedRule: 'Validated model action',
			for: 'Operators'
		},
		{
			id: 'table',
			surface: 'Data table',
			entry: 'DataTable',
			sharedRule: 'Stable rows and view state',
			for: 'Working teams'
		},
		{
			id: 'report',
			surface: 'Report view',
			entry: 'Aggregate model',
			sharedRule: 'Tenant-aware projection',
			for: 'Decision makers'
		}
	];

	const applicationSurfaceColumns: DataTableColumn<ApplicationSurface>[] = [
		{ id: 'surface', label: 'Surface', accessor: 'surface', sortable: true, minWidth: '10rem' },
		{ id: 'entry', label: 'Entry point', accessor: 'entry', sortable: true, minWidth: '10rem' },
		{
			id: 'sharedRule',
			label: 'Shared application rule',
			accessor: 'sharedRule',
			sortable: true,
			minWidth: '14rem'
		},
		{ id: 'for', label: 'For', accessor: 'for', sortable: true, minWidth: '9rem' }
	];

	const updates = [
		{
			title: 'Agent-legible applications',
			body: 'Give agents bounded descriptions of the model, visible controls, and permitted operations.',
			href: '/capabilities/agent-legible-applications'
		},
		{
			title: 'Learning agents',
			body: 'Recall useful experience and propose instruction changes behind a human approval step.',
			href: '/capabilities/learning-agents'
		},
		{
			title: 'Reports',
			body: 'Define durable aggregate models with refreshes, schedules, watermarks, and tenant scope.',
			href: '/capabilities/reports'
		}
	];
</script>

<SEO
	title="Why s-m-r-t? Applications built from domain models"
	description="s-m-r-t is a TypeScript framework that generates storage, forms, APIs, CLI commands, permissions, and AI-agent tools from one set of domain models, so every interface shares the same definition and the same limits."
	url="https://s-m-r-t.dev"
/>

<article class="why-smrt">
	<header class="hero">
		<h1>Why s-m-r-t?</h1>
		<p class="hero-copy">
			One source of truth for your application logic. You describe the records your product manages
			— an article, an order, a customer — as models, and s-m-r-t generates what surrounds them:
			storage, forms, APIs, operator commands, permissions, and AI-agent tools, all working from the
			same definition with the same limits. Change a model and every surface updates with it. Give
			an agent access and it gets the operations you chose, nothing more.
		</p>
		<a class="hero-link" href="#how-it-works">How it works ↓</a>
	</header>

	<section class="data-table-feature" aria-labelledby="data-table-heading">
		<div class="data-table-summary">
			<div>
				<p class="release-label">New in {SMRT_VERSION}</p>
				<h2 id="data-table-heading">Data tables for application logic</h2>
			</div>
			<p>
				Sort, select, and page typed rows without separating the table from the rules that govern
				the rest of the application.
			</p>
		</div>
		<div class="data-table-showcase">
			<div class="data-table-intro">
				<h3>One model, many working surfaces</h3>
				<p>
					The same model can support people, integrations, agents, and operators. This interactive
					table uses stable row identities, local sorting, selection, and paging from <code
						>@happyvertical/smrt-ui/data</code
					>.
				</p>
			</div>
			<div class="data-table-frame">
				<DataTable
					data={applicationSurfaces}
					columns={applicationSurfaceColumns}
					rowKey="id"
					selectable
					sortable
					striped
					hoverable
					pageSize={5}
					caption="Application surfaces sharing one model"
				/>
			</div>
			<div class="data-table-footer">
				<p>Try a column header or row checkbox, then open the complete component example.</p>
				<a href="/playground">Open the data table playground →</a>
			</div>
		</div>
	</section>

	<section class="pattern" id="how-it-works" aria-labelledby="pattern-heading">
		<div class="section-heading">
			<div>
				<h2 id="pattern-heading">How it works</h2>
				<p>
					A model names the fields and actions of one business record; decorators fine-tune the
					object and its fields where the defaults are not enough. The framework derives the rest.
				</p>
			</div>
		</div>
		<div class="pattern-grid">
			<CodeBlock code={articleModel} filename="src/lib/objects/Article.ts" />
			<ul class="projection-list">
				{#each projections as projection (projection.label)}
					<li>
						<a href={projection.href}
							><strong>{projection.label}</strong><span>{projection.body}</span><b
								aria-hidden="true">→</b
							></a
						>
					</li>
				{/each}
			</ul>
		</div>
		<p class="pattern-copy">
			People and software agents reaching the same permitted operations through one model is the
			core idea — we call it <a href="/reference/saadl">Software as Agentic Domain Logic (SAADL)</a
			>. There is no separate, reduced “bot API” to build or keep honest.
		</p>
	</section>

	<section class="powers" id="what-you-get" aria-labelledby="powers-heading">
		<div class="section-heading">
			<div>
				<h2 id="powers-heading">What you get</h2>
			</div>
		</div>
		<div class="power-grid">
			{#each powers as power (power.title)}
				<div class="power">
					<h3>{power.title}</h3>
					<p>{power.body}</p>
				</div>
			{/each}
		</div>
		<div class="subsection">
			<h3 class="subsection-title">
				Built for agents that operate the product — and agents that build it.
			</h3>
			<div class="machinery-grid">
				<div>
					<h4>Operating the product</h4>
					<ul>
						<li>
							<strong>Semantic control discovery</strong><span
								>Every form control publishes a stable identity and description an agent can look up
								— no guessing from the page structure, labels, or pixels.</span
							>
						</li>
						<li>
							<strong>Explain, highlight, validate</strong><span
								>An agent can point at a field, say what it means and allows, and run the form’s own
								checks without changing anything.</span
							>
						</li>
						<li>
							<strong>Staged changes and confirmation</strong><span
								>An agent’s edit is a proposal held apart from the live value; applying it is a
								separate, confirmed step.</span
							>
						</li>
						<li>
							<strong>Secret and read-only protection</strong><span
								>Secret values cannot be read or written through the control registry, and read-only
								controls reject changes — by contract, not convention.</span
							>
						</li>
						<li>
							<strong>Adapter wiring</strong><span
								>Chat, voice, tutorials, and tests all drive the same small command vocabulary, and
								connecting one to your product is an explicit choice — never automatic.</span
							>
						</li>
					</ul>
					<a href="/capabilities/agent-assisted-forms">How agent-assisted forms work →</a>
				</div>
				<div>
					<h4>Building the product</h4>
					<ul>
						<li>
							<strong>Version-true agent docs</strong><span
								>Every installed s-m-r-t package ships agent documentation written against the exact
								release you have, not a website’s latest.</span
							>
						</li>
						<li>
							<strong>Project knowledge over MCP</strong><span
								>A coding agent can ask the development server which objects, fields, relationships,
								and interfaces this project actually declares.</span
							>
						</li>
						<li>
							<strong>One edit surface</strong><span
								>Interfaces are generated, so an agent changes a model once instead of keeping
								routes, schemas, tools, and commands consistent by hand.</span
							>
						</li>
						<li>
							<strong>Runtime awareness — tracked, not shipped</strong><span
								>The goal: let development tooling compare what a project declares with what a live
								environment actually loaded. Conditional until released, and labeled that way here.</span
							>
						</li>
					</ul>
					<a href="/tooling/dev-mcp">The development MCP →</a>
				</div>
			</div>
		</div>

		<div class="subsection" id="built-in-agents">
			<h3 class="subsection-title">Built-in agents that learn, with boundaries.</h3>
			<ul class="builtin-grid">
				<li>
					<strong>Outcome-weighted memory</strong><span
						>Before a run, an agent recalls strategies that worked before; success strengthens a
						memory, and a validated failure drops it below the reuse floor, so what stops working
						stops being used.</span
					>
				</li>
				<li>
					<strong>Tenant-owned personas</strong><span
						>One agent class can serve many tenants as durable instances — each with its own
						instructions, tool ceiling, identity, schedule, and memory that never crosses tenants.</span
					>
				</li>
				<li>
					<strong>Authority that only narrows</strong><span
						>Every action resolves as the intersection of the user’s permissions, the agent’s
						ceiling, and the persona’s tool list — and delegation between agents can never widen it.</span
					>
				</li>
				<li>
					<strong>Proposals, not self-authorization</strong><span
						>Reflection can draft better instructions for the agent itself, but activating a rewrite
						is a separate human permission. An agent never silently rewrites its own authority.</span
					>
				</li>
				<li>
					<strong>Off by default</strong><span
						>Learning is opt-in per agent class; an agent that has not opted in behaves exactly as
						it always did.</span
					>
				</li>
			</ul>
			<a class="builtin-link" href="/capabilities/learning-agents">How learning agents work →</a>
		</div>
	</section>

	<section class="losses" id="what-you-lose" aria-labelledby="losses-heading">
		<div class="section-heading">
			<div>
				<h2 id="losses-heading">What you lose</h2>
			</div>
		</div>
		<div class="power-grid">
			{#each losses as loss (loss.title)}
				<div class="power">
					<h3>{loss.title}</h3>
					<p>{loss.body}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="qualification" aria-labelledby="qualification-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Fit</p>
				<h2 id="qualification-heading">Where it stands today</h2>
			</div>
		</div>
		<div class="qualification-grid">
			<p>
				<strong>Web stack</strong><span>TypeScript models and SvelteKit application surfaces.</span>
			</p>
			<p>
				<strong>Mobile</strong><span
					>Native Kotlin Multiplatform foundation with Compose and SwiftUI adapters; source
					distribution only, not published to npm or Maven.</span
				>
			</p>
			<p>
				<strong>Data &amp; deploy</strong><span
					>SQLite suits a small start; Postgres is the normal production path. Starters show both
					ends.</span
				>
			</p>
			<p>
				<strong>License &amp; maturity</strong><span
					>MIT-licensed and pre-1.0: evaluate the released contracts against your product.</span
				>
			</p>
			<p>
				<strong>Proof in use</strong><span
					>This public documentation site is the framework’s primary test bed and renders against
					the released UI and playground packages.</span
				>
			</p>
		</div>
		<p class="qualification-links">
			<a href="/starters/ground-up">Basic SvelteKit starter</a><span aria-hidden="true">·</span>
			<a href="/starters/saas">production-shaped starter</a><span aria-hidden="true">·</span>
			<a href="/capabilities/mobile">mobile foundation</a><span aria-hidden="true">·</span>
			<a href="https://github.com/happyvertical/s-m-r-t.dev">inspect this site’s source ↗</a>
		</p>
	</section>

	<section class="start-options" aria-labelledby="start-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Start here</p>
				<h2 id="start-heading">Choose a starting path</h2>
			</div>
			<p>
				Both paths keep the same model-first foundations; choose the amount of application shape you
				need.
			</p>
		</div>
		<div class="start-grid">
			<a href="/starters/ground-up">
				<span>Ground up</span>
				<h3>Basic SvelteKit template</h3>
				<p>
					Start small with one object, SQLite, current tenant and session boundaries, and generated
					interfaces.
				</p>
				<strong>Start with one object →</strong>
			</a>
			<a href="/starters/saas">
				<span>Production-shaped</span>
				<h3>s-m-r-t SaaS starter</h3>
				<p>
					Begin with accounts, tenant administration, billing, workers, mobile clients, and
					deployment manifests connected.
				</p>
				<strong>Tour the starter →</strong>
			</a>
		</div>
	</section>

	<section class="journey" aria-labelledby="journey-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Foundations</p>
				<h2 id="journey-heading">How an application comes together</h2>
			</div>
			<p>Enter at the foundation you need, or follow the path from product model to interfaces.</p>
		</div>
		<ol>
			{#each foundationGuides as guide, index (guide.slug)}
				<li>
					<a href={`/foundations/${guide.slug}`}
						><span>{String(index + 1).padStart(2, '0')}</span>
						<div>
							<h3>{guide.navTitle}</h3>
							<p>{guide.plainEnglish}</p>
						</div>
						<b>→</b></a
					>
				</li>
			{/each}
		</ol>
	</section>

	<section class="updates" aria-labelledby="updates-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Explore further</p>
				<h2 id="updates-heading">Focused capabilities</h2>
			</div>
			<p>Use these when the basic application path reaches the problem they solve.</p>
		</div>
		<div class="update-grid">
			{#each updates as update (update.href)}
				<a href={update.href}
					><h3>{update.title}</h3>
					<p>{update.body}</p>
					<span>Read more →</span></a
				>
			{/each}
		</div>
	</section>

	<section class="claims" aria-labelledby="claims-heading">
		<div class="section-heading">
			<div>
				<p class="eyebrow">Verification</p>
				<h2 id="claims-heading">Check the claims yourself.</h2>
			</div>
			<p>
				Every claim on this page traces to a canonical documentation page and released source,
				rechecked at each release.
			</p>
		</div>
		<div class="claims-list">
			{#each whySmrtClaims as item (item.claim)}
				<article>
					<h3>{item.claim}</h3>
					<p>
						<a href={item.canonical.href}>{item.canonical.label}</a><span aria-hidden="true">
							·
						</span><a href={item.source.href}>{item.source.label}</a>{#if item.demo}<span
								aria-hidden="true"
							>
								·
							</span><a href={item.demo.href}>{item.demo.label}</a>{/if}
					</p>
				</article>
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
	.why-smrt {
		width: min(1040px, calc(100% - 48px));
		margin: 0 auto;
		padding: 58px 0 88px;
	}
	.hero {
		max-width: 810px;
		padding: 0 0 44px;
	}
	.eyebrow {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.055em;
		text-transform: uppercase;
	}
	h1 {
		max-width: 790px;
		margin-top: 14px;
		font-size: clamp(2.45rem, 5.6vw, 4rem);
		font-weight: 680;
		letter-spacing: -0.052em;
		line-height: 1.03;
	}
	.hero-copy {
		max-width: 730px;
		margin-top: 21px;
		color: var(--site-muted);
		font-size: 1.04rem;
		line-height: 1.7;
	}
	.hero-link,
	.machinery-grid > div > a,
	.builtin-link {
		display: inline-block;
		margin-top: 22px;
		color: var(--site-ink);
		font-size: 0.8rem;
		font-weight: 700;
	}
	section {
		padding: 44px 0 54px;
		border-top: 1px solid var(--site-line);
		scroll-margin-top: 86px;
	}
	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 36px;
		align-items: end;
		margin-bottom: 26px;
	}
	.section-heading h2,
	.browse-callout h2 {
		font-size: clamp(1.45rem, 3vw, 1.85rem);
		letter-spacing: -0.035em;
		line-height: 1.13;
	}
	.section-heading p:last-child {
		max-width: 430px;
		color: var(--site-muted);
		font-size: 0.84rem;
		line-height: 1.58;
	}
	.pattern .section-heading p {
		max-width: 680px;
		margin-top: 10px;
	}
	.pattern-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
		gap: 26px;
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
		grid-template-columns: 104px minmax(0, 1fr) 16px;
		gap: 12px;
		align-items: baseline;
		padding: 12px 6px;
		color: var(--site-ink);
		text-decoration: none;
	}
	.projection-list a:hover {
		background: var(--site-surface);
	}
	.projection-list strong {
		font-size: 0.8rem;
	}
	.projection-list span {
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.5;
	}
	.projection-list b {
		font-weight: 500;
	}
	.pattern-copy {
		max-width: 740px;
		margin-top: 22px;
		color: var(--site-muted);
		font-size: 0.92rem;
		line-height: 1.65;
	}
	.pattern-copy a {
		color: var(--site-ink);
	}
	.power-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 34px 38px;
	}
	.power h3 {
		font-size: 1.08rem;
		letter-spacing: -0.02em;
	}
	.power p {
		margin-top: 9px;
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.65;
	}
	.subsection {
		margin-top: 46px;
	}
	.subsection-title {
		max-width: 640px;
		font-size: 1.18rem;
		letter-spacing: -0.025em;
		line-height: 1.25;
	}
	.machinery-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 34px 38px;
		margin-top: 20px;
	}
	.machinery-grid h4 {
		font-size: 0.98rem;
		letter-spacing: -0.02em;
	}
	.machinery-grid ul {
		margin-top: 12px;
		border-top: 1px solid var(--site-line);
		list-style: none;
	}
	.machinery-grid li {
		padding: 11px 2px;
		border-bottom: 1px solid var(--site-line);
	}
	.machinery-grid li strong {
		display: block;
		font-size: 0.82rem;
	}
	.machinery-grid li span {
		display: block;
		margin-top: 4px;
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.55;
	}
	.builtin-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0 38px;
		margin-top: 20px;
		border-top: 1px solid var(--site-line);
		list-style: none;
	}
	.builtin-grid li {
		padding: 11px 2px;
		border-bottom: 1px solid var(--site-line);
	}
	.builtin-grid strong {
		display: block;
		font-size: 0.82rem;
	}
	.builtin-grid span {
		display: block;
		margin-top: 4px;
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.55;
	}

	.data-table-summary {
		display: flex;
		justify-content: space-between;
		gap: 28px;
		align-items: end;
		margin-bottom: 24px;
	}

	.release-label {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.055em;
		text-transform: uppercase;
	}

	.data-table-summary h2 {
		margin-top: 8px;
		font-size: clamp(1.55rem, 3vw, 2.1rem);
		letter-spacing: -0.035em;
	}

	.data-table-summary > p {
		max-width: 400px;
		color: var(--site-muted);
		font-size: 0.86rem;
		line-height: 1.6;
	}

	.data-table-showcase {
		border: 1px solid var(--site-line-strong);
		border-radius: 12px;
		background: var(--site-surface);
		overflow: hidden;
	}

	.data-table-intro {
		display: flex;
		justify-content: space-between;
		gap: 28px;
		align-items: baseline;
		padding: 20px 22px;
		border-bottom: 1px solid var(--site-line);
	}

	.data-table-intro h3 {
		font-size: 1rem;
	}

	.data-table-intro p {
		max-width: 530px;
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.55;
	}
	.qualification-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		border: 1px solid var(--site-line-strong);
		background: var(--site-surface);
	}
	.qualification-grid p {
		padding: 15px;
		border-right: 1px solid var(--site-line);
	}
	.qualification-grid p:last-child {
		border-right: 0;
	}
	.qualification-grid strong {
		display: block;
		font-size: 0.78rem;
	}
	.qualification-grid span {
		display: block;
		margin-top: 7px;
		color: var(--site-muted);
		font-size: 0.76rem;
		line-height: 1.5;
	}
	.qualification-links {
		margin-top: 12px;
		color: var(--site-muted);
		font-size: 0.76rem;
	}
	.qualification-links a {
		color: var(--site-ink);
	}
	.qualification-links span {
		padding: 0 8px;
	}

	.data-table-intro code {
		color: var(--site-ink);
		font-family: var(--site-font-mono);
		font-size: 0.9em;
	}

	.data-table-frame {
		padding: 0 4px;
		background: var(--site-paper);
	}

	.data-table-footer {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		align-items: center;
		padding: 14px 22px;
		border-top: 1px solid var(--site-line);
	}

	.data-table-footer p,
	.data-table-footer a {
		font-size: 0.75rem;
	}

	.data-table-footer p {
		color: var(--site-muted);
	}

	.data-table-footer a {
		flex: 0 0 auto;
		color: var(--site-ink);
		font-weight: 700;
	}

	.start-grid,
	.update-grid {
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
		min-height: 210px;
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
		font: 700 0.65rem var(--site-font-mono);
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
		font: 0.66rem var(--site-font-mono);
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
		grid-template-columns: repeat(3, 1fr);
	}
	.update-grid a {
		min-height: 180px;
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
	.claims-list {
		border-top: 1px solid var(--site-line);
	}
	.claims-list article {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(250px, 0.9fr);
		gap: 24px;
		padding: 16px 8px;
		border-bottom: 1px solid var(--site-line);
	}
	.claims-list h3 {
		font-size: 0.86rem;
		line-height: 1.45;
	}
	.claims-list p {
		color: var(--site-muted);
		font-size: 0.76rem;
		line-height: 1.5;
	}
	.claims-list a {
		color: var(--site-ink);
		font-weight: 650;
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
		max-width: 480px;
		margin-top: 7px;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.55;
	}
	.browse-callout a {
		flex: 0 0 auto;
		color: var(--site-ink);
		font-size: 0.8rem;
		font-weight: 700;
	}
	@media (max-width: 820px) {
		.pattern-grid {
			grid-template-columns: 1fr;
		}
		.qualification-grid {
			grid-template-columns: 1fr 1fr;
		}
		.qualification-grid p {
			border-bottom: 1px solid var(--site-line);
		}
		.qualification-grid p:nth-child(2n) {
			border-right: 0;
		}
		.qualification-grid p:last-child {
			grid-column: 1 / -1;
			border-right: 0;
			border-bottom: 0;
		}
	}
	@media (max-width: 680px) {
		.why-smrt {
			width: min(100% - 28px, 1040px);
			padding-top: 38px;
		}
		.section-heading,
		.data-table-summary,
		.data-table-intro,
		.data-table-footer,
		.browse-callout {
			align-items: flex-start;
			flex-direction: column;
			gap: 14px;
		}
		.start-grid,
		.update-grid,
		.power-grid,
		.machinery-grid,
		.builtin-grid {
			grid-template-columns: 1fr;
		}
		.claims-list article {
			grid-template-columns: 1fr;
			gap: 7px;
		}
	}
	@media (max-width: 430px) {
		.qualification-grid {
			grid-template-columns: 1fr;
		}
		.qualification-grid p {
			border-right: 0;
			border-bottom: 1px solid var(--site-line);
		}
		.qualification-grid p:last-child {
			grid-column: auto;
			border-bottom: 0;
		}
		.projection-list a {
			grid-template-columns: 90px minmax(0, 1fr) 14px;
			gap: 8px;
		}
	}
</style>
