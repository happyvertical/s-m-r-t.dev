<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { foundationGuides } from '$lib/data/guides';
</script>

<SEO
	title="s-m-r-t application foundations"
	description="Learn how s-m-r-t objects, tenants, users, profiles, memberships, permissions, pages, data, and generated interfaces fit together."
	url="https://s-m-r-t.dev/foundations"
/>

<article class="index-page">
	<header>
		<p>Application foundations</p>
		<h1>Understand how the common parts fit together.</h1>
		<span
			>These guides explain the connected parts already present in a s-m-r-t app. The narrative
			moves from your product model through ownership, identity, access, pages, and external
			interfaces.</span
		>
	</header>

	<ol>
		{#each foundationGuides as guide, index (guide.slug)}
			<li>
				<a href={`/foundations/${guide.slug}`}>
					<span>{String(index + 1).padStart(2, '0')}</span>
					<div>
						<h2>{guide.navTitle}</h2>
						<p>{guide.plainEnglish}</p>
					</div>
					<small>{guide.packages.slice(0, 2).join(' · ')}</small>
					<b>→</b>
				</a>
			</li>
		{/each}
	</ol>

	<aside>
		<strong>Starting a project?</strong>
		<p>
			The <a href="/starters/ground-up">basic template</a> walks through these foundations in a
			small app. The <a href="/starters/saas">SaaS starter</a> shows the same model in a production-shaped
			monorepo.
		</p>
	</aside>
</article>

<style>
	.index-page {
		width: min(900px, calc(100% - 48px));
		margin: 0 auto;
		padding: 54px 0 86px;
	}
	header {
		max-width: 740px;
		padding-bottom: 38px;
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
	ol {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}
	li {
		border-bottom: 1px solid var(--site-line);
	}
	li a {
		display: grid;
		grid-template-columns: 42px minmax(0, 1fr) 160px 20px;
		gap: 16px;
		align-items: start;
		padding: 17px 8px;
		color: var(--site-ink);
		text-decoration: none;
	}
	li a:hover {
		background: var(--site-surface);
	}
	li a > span {
		color: var(--site-accent-strong);
		font: 0.66rem var(--site-font-mono);
	}
	li h2 {
		font-size: 0.96rem;
	}
	li p {
		margin-top: 4px;
		color: var(--site-muted);
		font-size: 0.78rem;
		line-height: 1.5;
	}
	li small {
		color: var(--site-muted);
		font: 0.61rem var(--site-font-mono);
		line-height: 1.5;
	}
	li b {
		font-weight: 500;
	}
	aside {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 24px;
		margin-top: 32px;
		padding: 20px;
		border: 1px solid var(--site-line-strong);
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
		.index-page {
			width: min(100% - 28px, 900px);
			padding-top: 36px;
		}
		li a {
			grid-template-columns: 34px 1fr 18px;
		}
		li small {
			display: none;
		}
		aside {
			grid-template-columns: 1fr;
			gap: 7px;
		}
	}
</style>
