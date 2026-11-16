<script lang="ts">
	import { SITE_HOST, siteUrl } from '$lib/site';
	import ReferenceFamilyBar from '$lib/components/ReferenceFamilyBar.svelte';
	import SEO from '$lib/components/SEO.svelte';

	interface FaqItem {
		q: string;
		a: string;
		/** Optional canonical link for an answer that expands elsewhere on the site. */
		link?: { label: string; href: string };
	}

	interface FaqGroup {
		title: string;
		items: FaqItem[];
	}

	const groups: FaqGroup[] = [
		{
			title: 'Starting out',
			items: [
				{
					q: 'What is smrt?',
					a: 'A TypeScript framework for agentic software, built around useful domain objects. It gives you persistence, manifests, generated REST, MCP and CLI interfaces, users, tenants, agents, web data, native-mobile foundations and a broad set of domain packages.'
				},
				{
					q: 'What is a SAADL?',
					a: 'Software as Agentic Domain Logic means the same domain operations are available to people through ordinary interfaces and to agents through callable tools. Both resolve through the same models, permissions, tenants, and field policies.'
				},
				{
					q: 'Do I need every package?',
					a: 'No. Start with smrt-core, then add packages as you need a capability or a domain. They share conventions, but the stack is modular on purpose.'
				},
				{
					q: 'Which database should I use?',
					a: 'SQLite is a good fit for development and local-first tools. Postgres is the usual choice in production, especially if you use row-level security. DuckDB suits analytical workloads.'
				}
			]
		},
		{
			title: 'Application foundation',
			items: [
				{
					q: 'Can an agent help someone complete a form?',
					a: 'Yes. Standard controls can publish their identity, meaning, options, constraints and state to a chat, voice, tutorial or test adapter. An agent can point to a field or stage a proposed value. By default, an agent is always refused when it tries to apply, clear or undo one: only a person can confirm that, with a real local click. Secret controls stay unavailable.'
				},
				{
					q: 'Are users and tenants included?',
					a: 'Yes. smrt-users covers sessions, memberships, hierarchical tenants, roles, permissions, access requests and SvelteKit integration. smrt-tenancy enforces data scope on the models you decorate.'
				},
				{
					q: 'How do tenant relationships work?',
					a: 'Parent and child tenants describe how an organization is arranged. A membership connects a user to a tenant with one role. Profile relationships describe domain links between people, organizations or agents. The three are kept separate on purpose.'
				},
				{
					q: 'Can permissions differ between REST, MCP, WebMCP, and CLI?',
					a: 'Yes. Each model declares which operations each interface exposes. Permission slugs derived from the manifest, and runtime checks on the principal, keep interface policy tied to authorization.'
				}
			]
		},
		{
			title: 'Newer capabilities',
			items: [
				{
					q: 'What does it mean that agents learn?',
					a: 'Learning is opt-in. Before work, agents recall confident, scoped memories. Afterward, they reinforce or decay those memories based on the outcome. Personas can propose changes to their instructions, but turning those changes on takes a separate, permissioned human approval.'
				},
				{
					q: 'Is smrt-mobile a JavaScript wrapper?',
					a: 'No. The shared behavior is Kotlin Multiplatform. Android uses Compose and native adapters, and iOS uses SwiftUI and Apple frameworks. The shared layer covers offline queues, packs, auth, networking, evidence and presenter state.'
				},
				{
					q: 'What is hydration in smrt-web?',
					a: "SvelteKit server results seed the generated browser collections, so the client doesn't repeat the first fetch. Live updates, persisted cache versioning and the offline outbox carry on from that starting state."
				},
				{
					q: 'What does WebMCP expose?',
					a: 'smrt generates browser tool descriptors for the collection actions you expose and registers them with document.modelContext. CRUD tools run through the normal REST client as the signed-in page user, so authentication, tenant, permission and field policy all still apply.'
				}
			]
		},
		{
			title: 'Why smrt',
			items: [
				{
					q: 'Why build one application for both people and agents?',
					a: "Build two systems, an app for people and a separate, smaller set of endpoints or bots for software, and you keep two descriptions of the same operations in sync by hand. The second one tends to drift and shrink over time. A smrt application describes each operation once. People reach it through pages, HTTP or the command line, and agents reach the identical operation as a callable tool, so there's no second definition to fall behind."
				},
				{
					q: 'What is SAADL, and how is it pronounced?',
					a: 'SAADL — Software as Agentic Domain Logic: software whose domain logic exposes the same operations to human users (UI, HTTP, CLI) and to agents (callable tools). Pronounced "saddle."',
					link: { label: 'Read the full SAADL reference', href: '/docs/reference/saadl' }
				},
				{
					q: 'Can an agent do anything a signed-in person cannot?',
					a: "No. An agent can do only what three lists all allow: what the signed-in person may do, what its kind of agent may ever do, and what its assigned role permits. The check runs from the moment an agent reads a description all the way to the stored record itself. A description doesn't grant a session, a tenant or a permission by itself.",
					link: { label: 'Security defaults', href: '/docs/reference/security' }
				},
				{
					q: "Does asking in chat skip the application's rules?",
					a: 'No. However a request arrives, whether a click, a typed command or a chat message in plain language, it comes in through the same declared control or operation, and the same tenant, permission and field-policy checks apply.',
					link: { label: 'Human-agent interaction', href: '/docs/interaction' }
				},
				{
					q: 'Is this site itself built with smrt?',
					a: `Yes. ${SITE_HOST} runs on the same released @happyvertical/smrt-* packages it documents. The component playground, the agent-aware form demo and the data table on this site are the real packages, not mockups.`,
					link: { label: 'Component playground', href: '/playground' }
				}
			]
		}
	];
</script>

<SEO
	title="FAQ"
	description="Short answers about smrt, SAADL applications, users, tenants, generated interfaces, agent-assisted forms, learning agents, mobile, WebMCP and live data."
	url={siteUrl('/docs/reference/faq')}
/>

<ReferenceFamilyBar id="faq" />

<article class="faq-page">
	<header>
		<p>FAQ</p>
		<h1>Get your bearings.</h1>
		<span
			>Short answers to the questions that come up most, about how a smrt application is put
			together and what the newer features do.</span
		>
	</header>
	<div class="faq-groups">
		{#each groups as group, groupIndex (group.title)}
			<section>
				<div class="group-title">
					<span>{String(groupIndex + 1).padStart(2, '0')}</span>
					<h2>{group.title}</h2>
				</div>
				<div class="questions">
					{#each group.items as item (item.q)}
						<details>
							<summary>{item.q}<span>+</span></summary>
							<p>{item.a}</p>
							{#if item.link}
								<a class="faq-link" href={item.link.href}>{item.link.label} <span>→</span></a>
							{/if}
						</details>
					{/each}
				</div>
			</section>
		{/each}
	</div>
	<footer>
		<p>Didn't find what you were after?</p>
		<a href="/docs/reference/packages">Search all packages <span>→</span></a>
	</footer>
</article>

<style>
	.faq-page {
		width: min(1060px, calc(100% - 40px));
		margin: 0 auto;
		padding: 54px 0 86px;
	}
	header {
		max-width: 740px;
		padding: 0 0 38px;
	}
	header > p {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.68rem;
		font-weight: 750;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	header h1 {
		margin-top: 11px;
		font-size: clamp(2.15rem, 5vw, 3.25rem);
		letter-spacing: -0.03em;
		line-height: 1.08;
	}
	header > span {
		display: block;
		margin-top: 15px;
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.6;
	}
	.faq-groups section {
		display: grid;
		grid-template-columns: 220px minmax(0, 1fr);
		gap: 60px;
		padding: 36px 0;
		border-top: 1px solid var(--site-line-strong);
	}
	.group-title {
		display: flex;
		gap: 18px;
	}
	.group-title span {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.65rem;
	}
	.group-title h2 {
		font-size: 1rem;
	}
	details {
		border-top: 1px solid var(--site-line);
	}
	details:last-child {
		border-bottom: 1px solid var(--site-line);
	}
	summary {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		padding: 20px 0;
		font-weight: 700;
		cursor: pointer;
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	summary span {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		transition: transform 160ms ease;
	}
	details[open] summary span {
		transform: rotate(45deg);
	}
	details p {
		max-width: 680px;
		padding: 0 40px 24px 0;
		color: var(--site-muted);
		line-height: 1.7;
	}
	.faq-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin: -8px 0 24px;
		color: var(--site-ink);
		font-size: 0.82rem;
		font-weight: 700;
		text-underline-offset: 0.25rem;
	}
	.faq-link span {
		color: var(--site-accent-strong);
	}
	footer {
		display: flex;
		justify-content: space-between;
		gap: 30px;
		padding-top: 46px;
		border-top: 2px solid var(--site-ink);
	}
	footer p {
		color: var(--site-muted);
	}
	footer a {
		color: var(--site-ink);
		font-weight: 700;
		text-decoration: none;
	}
	footer a span {
		margin-left: 10px;
	}
	@media (max-width: 700px) {
		.faq-page {
			width: min(100% - 28px, 1060px);
			padding-top: 50px;
		}
		.faq-groups section {
			grid-template-columns: 1fr;
			gap: 30px;
		}
		footer {
			flex-direction: column;
		}
	}
</style>
