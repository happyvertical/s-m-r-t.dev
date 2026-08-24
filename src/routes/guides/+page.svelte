<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { TASK_GUIDES_PINNED_VERSION, taskGuides } from '$lib/data/task-guides';
</script>

<SEO
	title="s-m-r-t task guides"
	description="Runnable end-to-end guides for s-m-r-t: multi-tenant lifecycle, exposing an application over MCP, semantic search, and testing."
	url="https://s-m-r-t.dev/guides"
/>

<article class="guide-index">
	<header>
		<p>Task guides · {TASK_GUIDES_PINNED_VERSION}</p>
		<h1>Follow one job from start to finish.</h1>
		<span
			>The other sections describe what the framework is and what each package does. These pages do
			one thing each, in order, with the commands and the expected output written down. Every step
			was run against the released {TASK_GUIDES_PINNED_VERSION} packages.</span
		>
	</header>

	<section class="guide-list">
		{#each taskGuides as guide (guide.slug)}
			<a href={`/guides/${guide.slug}`}>
				<div>
					<h2>{guide.navTitle ?? guide.title}</h2>
					<span>{guide.sections.length} steps</span>
				</div>
				<p>{guide.plainEnglish}</p>
				<small>{guide.packages.slice(0, 3).join(' · ')}</small>
			</a>
		{/each}
	</section>

	<aside>
		<strong>How these differ from the rest of the site.</strong>
		<p>
			A task guide assumes you want a working result today, so it repeats only as much background as
			the next command needs. Follow links to <a href="/foundations">foundations</a>,
			<a href="/tooling">developer tooling</a>, or the <a href="/reference">reference</a> for the underlying
			rules. A task guide does not repeat those details.
		</p>
	</aside>
</article>

<style>
	.guide-index {
		width: min(940px, calc(100% - 48px));
		margin: 0 auto;
		padding: 54px 0 86px;
	}
	header {
		max-width: 760px;
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
	.guide-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
	}
	.guide-list a {
		min-height: 178px;
		display: flex;
		flex-direction: column;
		padding: 19px;
		border: 1px solid var(--site-line-strong);
		border-radius: 8px;
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}
	.guide-list a:hover {
		border-color: var(--site-accent-strong);
	}
	.guide-list a > div {
		display: flex;
		justify-content: space-between;
		gap: 18px;
	}
	.guide-list h2 {
		font-size: 1rem;
	}
	.guide-list div span {
		flex: 0 0 auto;
		color: var(--site-accent-strong);
		font: 700 0.58rem var(--site-font-mono);
		text-transform: uppercase;
	}
	.guide-list p {
		margin-top: 11px;
		color: var(--site-muted);
		font-size: 0.79rem;
		line-height: 1.55;
	}
	.guide-list small {
		margin-top: auto;
		padding-top: 20px;
		color: var(--site-muted);
		font: 0.58rem var(--site-font-mono);
	}
	aside {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: 24px;
		margin-top: 32px;
		padding: 20px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
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
		.guide-index {
			width: min(100% - 28px, 940px);
			padding-top: 36px;
		}
		.guide-list {
			grid-template-columns: 1fr;
		}
		.guide-list a {
			min-height: 0;
		}
		aside {
			grid-template-columns: 1fr;
			gap: 7px;
		}
	}
</style>
