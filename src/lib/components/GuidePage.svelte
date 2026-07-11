<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import GuideDiagram from '$lib/components/GuideDiagram.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { Guide } from '$lib/data/guides';

	interface Props {
		guide: Guide;
		backHref: string;
		backLabel: string;
	}
	let { guide, backHref, backLabel }: Props = $props();

	function sectionId(title: string) {
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}
</script>

<SEO
	title={guide.title}
	description={guide.lede}
	url={`https://s-m-r-t.dev${backHref}/${guide.slug}`}
/>

<article class="guide-page">
	<div class="guide-main">
		<header>
			<a class="back-link" href={backHref}>← {backLabel}</a>
			<p class="eyebrow">{guide.eyebrow}</p>
			<h1>{guide.title}</h1>
			<p class="lede">{guide.lede}</p>
		</header>

		<aside class="plain-english">
			<strong>In plain English</strong>
			<p>{guide.plainEnglish}</p>
		</aside>

		{#if guide.visual}<GuideDiagram visual={guide.visual} />{/if}

		<div class="sections">
			{#each guide.sections as section (section.title)}
				<section id={sectionId(section.title)}>
					<h2>{section.title}</h2>
					<p>{section.intro}</p>
					{#if section.points}
						<ul>
							{#each section.points as point (point)}<li>{point}</li>{/each}
						</ul>
					{/if}
					{#if section.code}<CodeBlock code={section.code} filename={section.filename} />{/if}
				</section>
			{/each}
		</div>

		{#if guide.packages.length}
			<footer>
				<strong>Packages used in this guide</strong>
				<div>
					{#each guide.packages as pkg (pkg)}<a href={`/packages/${pkg}`}>@happyvertical/{pkg}</a
						>{/each}
				</div>
			</footer>
		{/if}
	</div>

	<aside class="page-toc">
		<strong>On this page</strong>
		<nav aria-label="On this page">
			{#each guide.sections as section (section.title)}<a href={`#${sectionId(section.title)}`}
					>{section.title}</a
				>{/each}
		</nav>
	</aside>
</article>

<style>
	.guide-page {
		width: min(1020px, calc(100% - 48px));
		display: grid;
		grid-template-columns: minmax(0, 760px) 180px;
		gap: 64px;
		margin: 0 auto;
		padding: 50px 0 90px;
	}
	.guide-main {
		min-width: 0;
	}
	header {
		padding-bottom: 28px;
	}
	.back-link {
		color: var(--site-muted);
		font-size: 0.74rem;
		text-decoration: none;
	}
	.eyebrow {
		margin-top: 30px;
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	h1 {
		max-width: 720px;
		margin-top: 10px;
		font-size: clamp(2.15rem, 5vw, 3.25rem);
		font-weight: 680;
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	.lede {
		max-width: 700px;
		margin-top: 17px;
		color: var(--site-muted);
		font-size: 0.98rem;
		line-height: 1.68;
	}
	.plain-english {
		display: grid;
		grid-template-columns: 130px 1fr;
		gap: 20px;
		padding: 17px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		background: var(--site-surface);
	}
	.plain-english strong,
	.page-toc strong,
	footer > strong {
		font-size: 0.72rem;
	}
	.plain-english p {
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.58;
	}
	.sections {
		margin-top: 18px;
	}
	.sections section {
		scroll-margin-top: 86px;
		padding: 34px 0;
		border-top: 1px solid var(--site-line);
	}
	.sections h2 {
		font-size: 1.35rem;
		letter-spacing: -0.025em;
	}
	.sections section > p {
		margin-top: 11px;
		color: var(--site-muted);
		font-size: 0.88rem;
		line-height: 1.7;
	}
	.sections ul {
		margin: 17px 0 0;
		padding-left: 20px;
	}
	.sections li {
		color: var(--site-muted);
		font-size: 0.84rem;
		line-height: 1.6;
	}
	.sections li + li {
		margin-top: 6px;
	}
	.sections :global(.code-block) {
		margin-top: 21px;
	}
	.guide-main > footer {
		padding-top: 22px;
		border-top: 1px solid var(--site-line);
	}
	.guide-main > footer div {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		margin-top: 11px;
	}
	.guide-main > footer a {
		padding: 5px 8px;
		border: 1px solid var(--site-line-strong);
		border-radius: 5px;
		color: var(--site-ink);
		font: 0.65rem var(--site-font-mono);
		text-decoration: none;
	}
	.page-toc {
		position: sticky;
		top: calc(var(--site-header-height) + 28px);
		align-self: start;
		padding-left: 17px;
		border-left: 1px solid var(--site-line);
	}
	.page-toc nav {
		display: grid;
		gap: 9px;
		margin-top: 12px;
	}
	.page-toc a {
		color: var(--site-muted);
		font-size: 0.7rem;
		line-height: 1.4;
		text-decoration: none;
	}
	.page-toc a:hover {
		color: var(--site-ink);
	}
	@media (max-width: 1180px) {
		.guide-page {
			grid-template-columns: minmax(0, 760px);
		}
		.page-toc {
			display: none;
		}
	}
	@media (max-width: 680px) {
		.guide-page {
			width: min(100% - 28px, 760px);
			padding-top: 34px;
		}
		.plain-english {
			grid-template-columns: 1fr;
			gap: 7px;
		}
	}
</style>
