<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import GuideLibraryMetadata from '$lib/components/GuideLibraryMetadata.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { getGuideLibraryItem } from '$lib/data/task-guides';

	const guideMetadata = getGuideLibraryItem('/starters/saas');

	const install = `git clone https://github.com/happyvertical/smrt-saas-starter.git my-app\ncd my-app\npnpm install\ncp .env.example .env\npnpm services:up\npnpm db:migrate\npnpm db:seed\npnpm --filter @happyvertical/smrt-saas-web dev`;

	const areas = [
		[
			'apps/web',
			'SvelteKit public site, onboarding, account area, tenant admin, billing, and MCP routes.'
		],
		['apps/worker', 'Queued and scheduled jobs for subscription reconciliation and usage checks.'],
		['apps/mobile', 'Android and iOS shells using the shared s-m-r-t mobile foundation.'],
		['packages/app-objects', 'The starter’s objects and subscription or usage services.'],
		['packages/app-ui', 'Reusable SaaS interface components built on s-m-r-t UI.'],
		['manifests', 'Kubernetes base and environment overlays for deployment.']
	];
</script>

<SEO
	title="s-m-r-t SaaS starter"
	description="Tour the production-shaped s-m-r-t SaaS starter and understand which application concerns it already connects."
	url="https://s-m-r-t.dev/starters/saas"
/>

<article class="starter-page">
	<header>
		<a href="/starters">← Starters</a>
		<p>Production-shaped path</p>
		<h1>Begin with the common parts of a SaaS product connected.</h1>
		<span
			>The SaaS starter is a reference monorepo for teams that already know they need accounts,
			tenant administration, subscriptions, workers, mobile clients, and deployment.</span
		>
	</header>

	<aside class="decision-note">
		<strong>Use this when</strong>
		<p>
			You would otherwise spend the first part of the project connecting auth, onboarding, tenant
			switching, billing, usage, jobs, app chrome, and infrastructure.
		</p>
	</aside>

	{#if guideMetadata}<GuideLibraryMetadata guide={guideMetadata} />{/if}

	<section>
		<h2>1. Run the local reference app</h2>
		<p>
			Local development uses PostgreSQL in Docker and a development sign-in path. Replace that
			shortcut with your identity provider before deployment.
		</p>
		<CodeBlock code={install} language="bash" filename="terminal" />
	</section>

	<section>
		<h2>2. Learn the repository by responsibility</h2>
		<div class="area-list">
			{#each areas as area (area[0])}
				<div>
					<code>{area[0]}</code>
					<p>{area[1]}</p>
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2>3. Replace the example domain, not the foundations</h2>
		<p>
			Start in <code>packages/app-objects</code>. Keep the tenant, membership, permission, session,
			and generated-interface patterns while replacing the sample product objects and services with
			your own.
		</p>
		<ul>
			<li>
				Choose which onboarding mode the product needs: public, invite-only, or request access.
			</li>
			<li>Replace example plans, entitlements, and usage measures.</li>
			<li>Add domain navigation to the manifest-driven AdminShell.</li>
			<li>Keep reusable improvements upstream in s-m-r-t rather than inside the starter.</li>
		</ul>
	</section>

	<section>
		<h2>4. Use the same foundation guides</h2>
		<p>
			The starter has more finished surfaces, but its data and access model is the same. Read <a
				href="/foundations/objects-and-collections">objects and collections</a
			>, then continue through tenants, users, memberships, pages, and interfaces in the left
			navigation.
		</p>
	</section>

	<footer>
		<a href="https://demo.s-m-r-t.dev" target="_blank" rel="noreferrer">Open the live demo ↗</a><a
			href="https://github.com/happyvertical/smrt-saas-starter"
			target="_blank"
			rel="noreferrer">Open the SaaS starter on GitHub ↗</a
		><a href="/starters/ground-up">Compare the basic template →</a>
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
	.decision-note {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 22px;
		margin-bottom: 34px;
		padding: 17px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		background: var(--site-surface);
	}
	.decision-note strong {
		font-size: 0.78rem;
	}
	.decision-note p {
		color: var(--site-muted);
		font-size: 0.78rem;
		line-height: 1.55;
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
	section li,
	.area-list p {
		color: var(--site-muted);
		font-size: 0.86rem;
		line-height: 1.65;
	}
	section > p {
		margin-top: 11px;
	}
	section :global(.code-block) {
		margin-top: 20px;
	}
	section a {
		color: var(--site-ink);
	}
	.area-list {
		margin-top: 18px;
		border-top: 1px solid var(--site-line);
	}
	.area-list div {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: 24px;
		padding: 13px 6px;
		border-bottom: 1px solid var(--site-line);
	}
	.area-list code {
		font: 0.72rem var(--site-font-mono);
	}
	section ul {
		margin: 17px 0 0;
		padding-left: 20px;
	}
	section li + li {
		margin-top: 6px;
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
		.decision-note,
		.area-list div {
			grid-template-columns: 1fr;
			gap: 6px;
		}
		footer {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
