<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import GuideLibraryMetadata from '$lib/components/GuideLibraryMetadata.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { getGuideLibraryItem } from '$lib/data/task-guides';

	const guideMetadata = getGuideLibraryItem('/starters/ground-up');

	const install = `pnpm add -D @happyvertical/smrt-template-sveltekit\nnode --input-type=module -e "import { copyTemplate } from '@happyvertical/smrt-template-sveltekit'; copyTemplate('./my-app', { name: 'my-app' })"\ncd my-app\npnpm install\ncp .env.example .env\npnpm db:migrate\npnpm dev`;

	const item = `@smrt({\n  api: { include: ['list', 'get', 'create', 'update', 'delete'] },\n  mcp: { include: ['list', 'get', 'create', 'update', 'delete'] },\n  cli: { include: ['list', 'get', 'create', 'update', 'delete'] }\n})\n@TenantScoped({ mode: 'optional' })\nexport class Item extends SmrtObject {\n  @tenantId({ nullable: true })\n  tenantId: string | null = null;\n  title = '';\n  status = 'draft';\n}`;
</script>

<SEO
	title="Ground-up SvelteKit starter"
	description="Build a small s-m-r-t application from the current basic SvelteKit template."
	url="https://s-m-r-t.dev/starters/ground-up"
/>

<article class="starter-page">
	<header>
		<a href="/starters">← Starters</a>
		<p>Ground-up path</p>
		<h1>Start small and keep every layer visible.</h1>
		<span
			>The basic template is a working SvelteKit app, not an empty folder. It gives you the safe
			framework setup while leaving product choices open.</span
		>
	</header>

	<aside class="scope-note">
		<div>
			<strong>Included</strong><span
				>One Item object, SQLite, migrations, tenant/session hooks, users package manifests,
				AdminShell, SSR data loading, generated routes and tools.</span
			>
		</div>
		<div>
			<strong>Left to you</strong><span
				>Authentication provider, onboarding, billing, workers, production database, and deployment.</span
			>
		</div>
	</aside>

	{#if guideMetadata}<GuideLibraryMetadata guide={guideMetadata} />{/if}

	<section id="create">
		<h2>1. Create and run the app</h2>
		<p>
			The template package exports a tested copy helper. Generated projects require Node 24.18 or
			newer and use the package manager version declared in the template.
		</p>
		<CodeBlock code={install} language="bash" filename="terminal" />
	</section>

	<section id="object">
		<h2>2. Read the first object</h2>
		<p>
			<code>src/lib/objects/Item.ts</code> shows the main pattern. Its fields become stored data; tenant
			scope says whether a row is shared or tenant-owned; the interface options generate the public surfaces.
		</p>
		<CodeBlock code={item} language="typescript" filename="src/lib/objects/Item.ts" />
	</section>

	<section id="journey">
		<h2>3. Continue through the foundations</h2>
		<ol>
			<li>
				<a href="/foundations/objects-and-collections"
					><strong>Objects and collections</strong><span
						>Rename Item and add the first useful fields and relationships.</span
					></a
				>
			</li>
			<li>
				<a href="/foundations/tenants"
					><strong>Tenants</strong><span
						>Decide whether records are global, tenant-owned, or part of a tenant hierarchy.</span
					></a
				>
			</li>
			<li>
				<a href="/foundations/users-and-profiles"
					><strong>Users and profiles</strong><span
						>Connect your sign-in provider and keep product identity separate.</span
					></a
				>
			</li>
			<li>
				<a href="/foundations/memberships-and-permissions"
					><strong>Memberships and permissions</strong><span
						>Seed roles and protect app-owned mutations.</span
					></a
				>
			</li>
			<li>
				<a href="/foundations/pages-and-data"
					><strong>Pages and live data</strong><span
						>Load on the server, then hydrate browser collections only where needed.</span
					></a
				>
			</li>
			<li>
				<a href="/foundations/interfaces"
					><strong>Generated interfaces</strong><span
						>Choose the REST, MCP, WebMCP, and CLI actions each model should expose.</span
					></a
				>
			</li>
		</ol>
	</section>

	<footer>
		<a
			href="https://github.com/happyvertical/smrt/tree/main/packages/template-sveltekit"
			target="_blank"
			rel="noreferrer">View the template source ↗</a
		><a href="/starters/saas">Compare the SaaS starter →</a>
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
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	header > span {
		display: block;
		max-width: 680px;
		margin-top: 17px;
		color: var(--site-muted);
		line-height: 1.65;
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
	section > p {
		margin-top: 11px;
		color: var(--site-muted);
		font-size: 0.88rem;
		line-height: 1.65;
	}
	section :global(.code-block) {
		margin-top: 20px;
	}
	ol {
		margin-top: 18px;
		border-top: 1px solid var(--site-line);
		list-style: none;
	}
	li {
		border-bottom: 1px solid var(--site-line);
	}
	li a {
		display: grid;
		gap: 3px;
		padding: 13px 7px;
		color: var(--site-ink);
		text-decoration: none;
	}
	li a:hover {
		background: var(--site-surface);
	}
	li strong {
		font-size: 0.84rem;
	}
	li span {
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
