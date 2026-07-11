<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
	title="Choose a s-m-r-t starter"
	description="Choose the basic SvelteKit template or the production-shaped s-m-r-t SaaS starter."
	url="https://s-m-r-t.dev/starters"
/>

<article class="starter-index">
	<header>
		<p>Getting started</p>
		<h1>Choose how much application you want on day one.</h1>
		<span
			>Both paths use the same object model, tenant rules, users, permissions, and generated
			interfaces.</span
		>
	</header>

	<section class="choice-list">
		<a href="/starters/ground-up">
			<div><span>01</span><small>Learn each layer</small></div>
			<h2>Basic SvelteKit template</h2>
			<p>
				One example object, SQLite, current tenant/session boundaries, an AdminShell, and generated
				REST, MCP, WebMCP, and CLI wiring.
			</p>
			<ul>
				<li>Small enough to read in one sitting</li>
				<li>Good for a focused app or framework evaluation</li>
				<li>You choose authentication and production services</li>
			</ul>
			<strong>Open the ground-up guide →</strong>
		</a>

		<a href="/starters/saas">
			<div><span>02</span><small>Begin production-shaped</small></div>
			<h2>s-m-r-t SaaS starter</h2>
			<p>
				A reference monorepo with onboarding, tenant administration, subscriptions, jobs, MCP,
				mobile clients, and deployment manifests already connected.
			</p>
			<ul>
				<li>Good for a multi-tenant product</li>
				<li>Shows complete operational patterns</li>
				<li>More code to understand before changing the shape</li>
			</ul>
			<strong>Tour the SaaS starter →</strong>
		</a>
	</section>

	<aside>
		<h2>Not sure?</h2>
		<p>
			Use the basic template when you are still deciding what the app is. Use the SaaS starter when
			the product clearly needs accounts, organizations, plans, workers, and deployment from the
			start.
		</p>
	</aside>
</article>

<style>
	.starter-index {
		width: min(920px, calc(100% - 48px));
		margin: 0 auto;
		padding: 58px 0 88px;
	}

	header {
		max-width: 750px;
		padding-bottom: 44px;
	}

	header > p,
	.choice-list small,
	.choice-list > a > div span {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	h1 {
		margin-top: 13px;
		font-size: clamp(2.15rem, 5vw, 3.2rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}

	header > span {
		display: block;
		max-width: 680px;
		margin-top: 18px;
		color: var(--site-muted);
		font-size: 0.95rem;
		line-height: 1.65;
	}

	.choice-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.choice-list > a {
		display: flex;
		flex-direction: column;
		padding: 25px;
		border: 1px solid var(--site-line-strong);
		border-radius: 10px;
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}

	.choice-list > a:hover {
		border-color: var(--site-accent-strong);
	}

	.choice-list > a > div {
		display: flex;
		justify-content: space-between;
		gap: 20px;
	}

	.choice-list h2 {
		margin-top: 25px;
		font-size: 1.3rem;
	}

	.choice-list p,
	.choice-list li,
	aside p {
		color: var(--site-muted);
		font-size: 0.81rem;
		line-height: 1.58;
	}

	.choice-list p {
		margin-top: 11px;
	}

	.choice-list ul {
		margin: 20px 0 0;
		padding: 16px 0 0 18px;
		border-top: 1px solid var(--site-line);
	}

	.choice-list li + li {
		margin-top: 6px;
	}

	.choice-list strong {
		margin-top: auto;
		padding-top: 26px;
		font-size: 0.78rem;
	}

	aside {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: 28px;
		margin-top: 30px;
		padding: 22px 0;
		border-top: 1px solid var(--site-line);
	}

	aside h2 {
		font-size: 0.9rem;
	}

	@media (max-width: 720px) {
		.starter-index {
			width: min(100% - 28px, 920px);
			padding-top: 38px;
		}

		.choice-list,
		aside {
			grid-template-columns: 1fr;
		}
	}
</style>
