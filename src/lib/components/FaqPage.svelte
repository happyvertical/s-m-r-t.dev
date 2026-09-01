<script lang="ts">
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
					q: 'What is s-m-r-t?',
					a: 'A TypeScript application framework built around useful domain objects. It supplies persistence, manifests, generated REST/MCP/CLI interfaces, users, tenants, agents, web data, native-mobile foundations, and a broad set of domain packages.'
				},
				{
					q: 'What is a SAADL?',
					a: 'Software as Agentic Domain Logic means the same domain operations are available to people through ordinary interfaces and to agents through callable tools. Both resolve through the same models, permissions, tenants, and field policies.'
				},
				{
					q: 'Do I need every package?',
					a: 'No. Start with smrt-core, then add packages by capability or domain. They share conventions, but the stack is intentionally modular.'
				},
				{
					q: 'Which database should I use?',
					a: 'SQLite is excellent for development and local-first tools, Postgres is the normal production choice—especially when using row-level security—and DuckDB fits analytical workloads.'
				}
			]
		},
		{
			title: 'Application foundation',
			items: [
				{
					q: 'Can an agent help someone complete a form?',
					a: 'Yes. Standard controls can publish their identity, meaning, options, constraints, and state to a chat, voice, tutorial, or test adapter. An agent may point to a field or stage a proposed value, but applying, clearing, or undoing is always refused for an agent by default — only a human, through a real local click, can confirm one — and secret controls remain unavailable.'
				},
				{
					q: 'Are users and tenants included?',
					a: 'Yes. smrt-users includes sessions, memberships, hierarchical tenants, roles, permissions, access requests, and SvelteKit integration. smrt-tenancy enforces data scope on decorated models.'
				},
				{
					q: 'How do tenant relationships work?',
					a: 'Parent/child tenants describe organization. Memberships connect a user to a tenant with one role. Profile relationships describe domain links between people, organizations, or agents. They are separate on purpose.'
				},
				{
					q: 'Can permissions differ between REST, MCP, WebMCP, and CLI?',
					a: 'Yes. Each model declares which operations each interface exposes. Manifest-derived permission slugs and runtime principal checks keep interface policy connected to authorization.'
				}
			]
		},
		{
			title: 'Newer capabilities',
			items: [
				{
					q: 'What does it mean that agents learn?',
					a: 'Learning is opt-in. Agents recall confident, scoped memories before work and reinforce or decay them from outcomes afterward. Personas can propose instruction changes, but activating those changes requires a separate permissioned human approval.'
				},
				{
					q: 'Is smrt-mobile a JavaScript wrapper?',
					a: 'No. Shared behavior is Kotlin Multiplatform; Android uses Compose and native adapters, while iOS uses SwiftUI and Apple frameworks. The shared layer covers offline queues, packs, auth, networking, evidence, and presenter state.'
				},
				{
					q: 'What is hydration in smrt-web?',
					a: 'SvelteKit server results seed generated browser collections so the client does not repeat the initial fetch. Live updates, persisted cache versioning, and the offline outbox continue from that initial state.'
				},
				{
					q: 'What does WebMCP expose?',
					a: 's-m-r-t generates browser tool descriptors for exposed collection actions and registers them with document.modelContext. CRUD tools execute through the normal REST client as the signed-in page user, preserving authentication, tenant, permission, and field policy.'
				}
			]
		},
		{
			title: 'Why s-m-r-t',
			items: [
				{
					q: 'Why build one application for both people and agents?',
					a: 'Building two systems — a person-facing application and a separate, reduced set of endpoints or bots for software — means keeping two descriptions of the same operations in sync by hand, and the second one tends to drift and shrink over time. A s-m-r-t application describes each operation once; people reach it through pages, HTTP, or the command line, and software agents reach the identical operation as a callable tool, so there is no second definition to fall behind.'
				},
				{
					q: 'What is SAADL, and how is it pronounced?',
					a: 'SAADL — Software as Agentic Domain Logic: software whose domain logic exposes the same operations to human users (UI, HTTP, CLI) and to software agents (callable tools). Pronounced "saddle."',
					link: { label: 'Read the full SAADL reference', href: '/reference/saadl' }
				},
				{
					q: 'Can an agent do anything a signed-in person cannot?',
					a: 'No. An agent can do only what three lists all allow: what the signed-in person may do, what its kind of agent may ever do, and what its assigned role permits. The check runs from the moment an agent reads a description to the stored record itself — a description does not by itself grant a session, a tenant, or a permission.',
					link: { label: 'Security defaults', href: '/reference/security' }
				},
				{
					q: "Does asking in chat skip the application's rules?",
					a: 'No. However a request arrives — a click, a typed command, or a natural-language chat message — it enters through the same declared control or operation, and the same tenant, permission, and field-policy checks apply.',
					link: { label: 'Human-agent interaction', href: '/interaction' }
				},
				{
					q: 'Is this site itself built with s-m-r-t?',
					a: 'Yes. s-m-r-t.dev runs on the same released @happyvertical/smrt-* packages it documents — the component playground, the agent-aware form demo, and the data table on this site are the actual packages, not mockups.',
					link: { label: 'Component playground', href: '/playground' }
				},
				{
					q: 'Why is it spelled s-m-r-t?',
					a: "I can't help myself. As I was planning a framework for software that develops and runs itself, a certain scene from The Simpsons was prominently in mind."
				}
			]
		}
	];
</script>

<SEO
	title="s-m-r-t FAQ"
	description="Clear answers about s-m-r-t, SAADL applications, users, tenants, generated interfaces, agent-assisted forms, learning agents, mobile, WebMCP, and live data."
	url="https://s-m-r-t.dev/reference/faq"
/>

<ReferenceFamilyBar id="faq" />

<article class="faq-page">
	<header>
		<p>FAQ</p>
		<h1>Get oriented</h1>
		<span
			>Short answers to common questions about the application model and newer framework features.</span
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
		<p>Still looking for a concept?</p>
		<a href="/reference/packages">Search all packages <span>→</span></a>
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
		letter-spacing: -0.04em;
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
