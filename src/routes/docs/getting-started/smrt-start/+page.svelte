<script lang="ts">
	import { siteUrl } from '$lib/site';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import GuideLibraryMetadata from '$lib/components/GuideLibraryMetadata.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { getGuideLibraryItem } from '$lib/data/task-guides';
	import { SMRT_VERSION } from '$lib/version';

	const guideMetadata = getGuideLibraryItem('/docs/getting-started/smrt-start');

	const install = `git clone https://github.com/happyvertical/smrt-start.git my-app
cd my-app
pnpm install
cp .env.example .env        # ANTHROPIC_API_KEY, for the assistant only
pnpm app:setup
pnpm dev                    # http://127.0.0.1:5173
pnpm app:open               # in a second terminal: the one-time owner setup page`;

	// src/lib/models/Note.ts in happyvertical/smrt-start, verbatim.
	const note = `import { SmrtObject, smrt } from '@happyvertical/smrt-core';
import { TenantScoped, tenantId } from '@happyvertical/smrt-tenancy';

@smrt({
  api: { include: ['list', 'get', 'create'], writable: ['title', 'body'] },
  mcp: { include: ['list', 'get', 'create'] },
})
@TenantScoped({ mode: 'required' })
export class Note extends SmrtObject {
  @tenantId()
  tenantId: string = '';

  title: string = '';

  body: string = '';
}`;
</script>

<SEO
	title="Clone smrt-start"
	description="Clone smrt-start, the public MIT template that smrt cookbook apply copies by default, and you get a small working app with one owner, local SQLite, a Note model, an assistant and read-only MCP."
	url={siteUrl('/docs/getting-started/smrt-start')}
/>

<article class="starter-page">
	<header>
		<a href="/docs/getting-started">← Getting Started</a>
		<p>Clone smrt-start</p>
		<h1>Start from the template itself.</h1>
		<span
			>smrt-start is the public, MIT-licensed template that <code>smrt cookbook apply</code> copies by
			default. Clone it on its own and you get a small working app, not an empty folder.</span
		>
	</header>

	<aside class="scope-note">
		<div>
			<strong>Included</strong><span
				>One owner. Local SQLite, kept in your operating system's application-data directory, not in
				the checkout. A Note model and a Notes page. An assistant that can read and create notes.
				Read-only WebMCP tools for browser agents, and a read-only <code>POST /mcp</code> endpoint with
				local tokens.</span
			>
		</div>
		<div>
			<strong>Left to you</strong><span
				>The template runs on your machine, for one person. Hosting, sign-in for anyone else and
				deployment are yours to add. The assistant needs an Anthropic or OpenAI key; nothing else
				does.</span
			>
		</div>
	</aside>

	{#if guideMetadata}<GuideLibraryMetadata guide={guideMetadata} />{/if}

	<section id="create">
		<h2>1. Clone and run it</h2>
		<p>
			You'll need Node 26 or newer, git and pnpm 11.25, the version the template's <code
				>packageManager</code
			>
			pins. <code>app:setup</code> builds, creates the local database and issues a one-time owner
			invitation;
			<code>app:open</code> opens the page where your name and email make you the owner. If you're
			ever unsure, <code>pnpm app:doctor</code> prints where the data lives and anything it finds wrong.
		</p>
		<CodeBlock code={install} language="bash" filename="terminal" />
		<p>
			A clone keeps the template's own package pins, lockfile, git history and remote. <a
				href="/docs/getting-started#cookbook">smrt cookbook apply</a
			>
			gives you the same template with every smrt package pinned to the current release ({SMRT_VERSION}).
			A clone stays on the version the template last moved to until you bump it. The older
			<code>@happyvertical/smrt-template-sveltekit</code> package is still published, but it isn't the
			place to start.
		</p>
	</section>

	<section id="model">
		<h2>2. Read the first model</h2>
		<p>
			<code>src/lib/models/Note.ts</code> is the app's data model. Every time you run
			<code>pnpm dev</code> or <code>pnpm build</code>, the <code>smrt()</code> Vite plugin turns
			this one class into the schema and the REST routes under <code>/api/notes</code>. The same
			class supplies the WebMCP read tools, the assistant's tools and the remote MCP read tools.
			When the schema changes, <code>pnpm db:migrate</code> applies it.
		</p>
		<CodeBlock code={note} language="typescript" filename="src/lib/models/Note.ts" />
		<ul>
			<li>
				<code>writable</code> is the allowlist for REST writes; <code>include</code> picks which generated
				operations exist at all.
			</li>
			<li>
				<code>@TenantScoped</code> with <code>mode: 'required'</code> means every note belongs to one
				organization and is never read from another one.
			</li>
			<li>
				The generated files under <code>.smrt/</code> and <code>src/routes/api/</code> are gitignored.
				Edit the model and leave them be.
			</li>
		</ul>
	</section>

	<section id="journey">
		<h2>3. Keep going with the foundations</h2>
		<ol>
			<li>
				<a href="/docs/foundations/objects-and-collections"
					><strong>Objects and collections</strong><span
						>Rename Note, then add your first useful fields and relationships.</span
					></a
				>
			</li>
			<li>
				<a href="/docs/foundations/tenants"
					><strong>Tenants</strong><span
						>Decide whether records are global, tenant-owned, or part of a tenant hierarchy.</span
					></a
				>
			</li>
			<li>
				<a href="/docs/foundations/users-and-profiles"
					><strong>Users and profiles</strong><span
						>Connect your sign-in provider and keep product identity separate.</span
					></a
				>
			</li>
			<li>
				<a href="/docs/foundations/memberships-and-permissions"
					><strong>Memberships and permissions</strong><span
						>Seed roles and protect app-owned mutations.</span
					></a
				>
			</li>
			<li>
				<a href="/docs/foundations/pages-and-data"
					><strong>Pages and live data</strong><span
						>Load on the server, then hydrate browser collections only where you need them.</span
					></a
				>
			</li>
			<li>
				<a href="/docs/foundations/connect-interfaces"
					><strong>Generated interfaces</strong><span
						>Choose which REST, MCP, WebMCP and CLI actions each model exposes.</span
					></a
				>
			</li>
		</ol>
	</section>

	<footer>
		<a href="https://github.com/happyvertical/smrt-start" target="_blank" rel="noreferrer"
			>Open smrt-start on GitHub ↗</a
		><a href="/docs/getting-started#cookbook">Start from a cookbook →</a>
	</footer>
</article>

<style>
	.starter-page {
		width: min(780px, calc(100% - 48px));
		margin: 0 auto;
		padding: 50px 0 86px;
	}
	header {
		padding-bottom: 34px;
	}
	header > a {
		color: var(--site-muted);
		font-size: 0.75rem;
		text-decoration: none;
	}
	header > p {
		margin-top: 30px;
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		text-transform: uppercase;
	}
	h1 {
		margin-top: 11px;
		font-size: clamp(2.1rem, 5vw, 3.25rem);
		letter-spacing: -0.03em;
		line-height: 1.08;
	}
	header > span {
		display: block;
		max-width: 680px;
		margin-top: 17px;
		color: var(--site-muted);
		line-height: 1.65;
	}
	code {
		font-family: var(--site-font-mono);
		font-size: 0.92em;
	}
	.scope-note {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		margin-bottom: 34px;
		border: 1px solid var(--site-line-strong);
		background: var(--site-line);
	}
	.scope-note div {
		display: grid;
		gap: 8px;
		padding: 17px;
		background: var(--site-surface);
	}
	.scope-note strong {
		font-size: 0.76rem;
	}
	.scope-note span {
		color: var(--site-muted);
		font-size: 0.75rem;
		line-height: 1.5;
	}
	section {
		padding: 34px 0;
		border-top: 1px solid var(--site-line);
	}
	section h2 {
		font-size: 1.35rem;
		letter-spacing: -0.025em;
	}
	section > p,
	section > ul li {
		color: var(--site-muted);
		font-size: 0.88rem;
		line-height: 1.65;
	}
	section > p {
		margin-top: 11px;
	}
	section > p a {
		color: var(--site-ink);
	}
	section :global(.code-block) {
		margin-top: 20px;
	}
	section > ul {
		margin: 18px 0 0;
		padding-left: 20px;
	}
	section > ul li + li {
		margin-top: 6px;
	}
	ol {
		margin-top: 18px;
		border-top: 1px solid var(--site-line);
		list-style: none;
	}
	ol li {
		border-bottom: 1px solid var(--site-line);
	}
	ol li a {
		display: grid;
		gap: 3px;
		padding: 13px 7px;
		color: var(--site-ink);
		text-decoration: none;
	}
	ol li a:hover {
		background: var(--site-surface);
	}
	ol li strong {
		font-size: 0.84rem;
	}
	ol li span {
		color: var(--site-muted);
		font-size: 0.75rem;
	}
	footer {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		padding-top: 26px;
		border-top: 1px solid var(--site-line);
	}
	footer a {
		color: var(--site-ink);
		font-size: 0.76rem;
		font-weight: 650;
	}
	@media (max-width: 660px) {
		.starter-page {
			width: min(100% - 28px, 780px);
			padding-top: 34px;
		}
		.scope-note {
			grid-template-columns: 1fr;
		}
		footer {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
