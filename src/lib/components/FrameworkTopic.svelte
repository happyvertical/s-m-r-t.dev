<script lang="ts">
	import Callout from '$lib/components/Callout.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import GuideDiagram from '$lib/components/GuideDiagram.svelte';
	import { toAnchorId } from '$lib/data/anchors';
	import type { FrameworkTopic } from '$lib/data/framework';
	import type { Snippet } from 'svelte';

	let { section, extra }: { section: FrameworkTopic; extra?: Snippet } = $props();
	const topic = $derived(section);
</script>

<section class="framework-topic" id={topic.slug} aria-labelledby={`${topic.slug}-heading`}>
	<header>
		<p>{topic.eyebrow}</p>
		<h2 id={`${topic.slug}-heading`}>{topic.title}</h2>
		<span>{topic.summary}</span>
	</header>

	<aside class="plain-english">
		<strong>In plain English</strong>
		<p>{topic.plainEnglish}</p>
	</aside>

	{#if topic.visual}<GuideDiagram visual={topic.visual} />{/if}

	<div class="topic-content">
		{#each topic.content as item (item.title)}
			<section id={`${topic.slug}-${toAnchorId(item.title)}`}>
				<h3>{item.title}</h3>
				<p>{item.intro}</p>
				{#if item.points}
					<ul>
						{#each item.points as point (point)}<li>{point}</li>{/each}
					</ul>
				{/if}
				{#if item.code}
					<CodeBlock code={item.code} filename={item.filename} lang={item.lang} />
				{/if}
				{#if item.callout}
					<Callout
						variant={item.callout.variant}
						title={item.callout.title}
						body={item.callout.body}
					/>
				{/if}
				{#if item.links}
					<div class="links">
						{#each item.links as link (link.href)}
							<a
								href={link.href}
								rel={link.external ? 'noreferrer' : undefined}
								target={link.external ? '_blank' : undefined}
								>{link.label}{link.external ? ' ↗' : ' →'}</a
							>
						{/each}
					</div>
				{/if}
			</section>
		{/each}
	</div>

	{#if extra}{@render extra()}{/if}

	<div class="topic-footer">
		{#if topic.related?.length}
			<div>
				<strong>Related pages</strong>
				<nav aria-label={`${topic.navTitle} related pages`}>
					{#each topic.related as link (link.href)}
						<a href={link.href}>{link.label}</a>
					{/each}
				</nav>
			</div>
		{/if}
		{#if topic.packages.length}
			<div>
				<strong>Packages</strong>
				<nav aria-label={`${topic.navTitle} packages`}>
					{#each topic.packages as pkg (pkg)}
						<a href={`/packages/${pkg}`}>@happyvertical/{pkg}</a>
					{/each}
				</nav>
			</div>
		{/if}
		{#if topic.sources?.length}
			<div>
				<strong>Canonical sources</strong>
				<nav aria-label={`${topic.navTitle} canonical sources`}>
					{#each topic.sources as source (source.href)}
						<a href={source.href} rel="noreferrer" target="_blank">{source.label}</a>
					{/each}
				</nav>
			</div>
		{/if}
	</div>
</section>

<style>
	.framework-topic {
		scroll-margin-top: 5rem;
		padding: clamp(3.5rem, 7vw, 6rem) 0;
		border-top: 1px solid var(--site-line-strong);
	}

	header {
		max-width: 50rem;
		margin-bottom: 1.5rem;
	}

	header > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h2 {
		margin-top: 0.65rem;
		font-size: clamp(2rem, 5vw, 3.35rem);
		letter-spacing: -0.045em;
		line-height: 1.05;
		text-wrap: balance;
	}

	header > span {
		display: block;
		margin-top: 0.9rem;
		color: var(--site-muted);
		font-size: 0.94rem;
		line-height: 1.7;
	}

	.plain-english {
		display: grid;
		grid-template-columns: 9rem 1fr;
		gap: 1rem;
		max-width: 50rem;
		padding: 1rem;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		background: var(--site-surface);
	}

	.plain-english strong,
	.topic-footer strong {
		font-size: 0.74rem;
	}

	.plain-english p {
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.6;
	}

	.topic-content {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 1rem;
	}

	.topic-content > section {
		padding: 1.2rem;
		border: 1px solid var(--site-line-strong);
		background: var(--site-surface);
	}

	h3 {
		font-size: 1rem;
	}

	.topic-content p,
	.topic-content li {
		color: var(--site-muted);
		font-size: 0.79rem;
		line-height: 1.6;
	}

	.topic-content p,
	.topic-content ul,
	.links {
		margin-top: 0.65rem;
	}

	.topic-content ul {
		padding-left: 1.1rem;
	}

	.topic-content li + li {
		margin-top: 0.35rem;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.links a {
		padding: 0.35rem 0.5rem;
		border: 1px solid var(--site-line-strong);
		color: var(--site-ink);
		font-size: 0.7rem;
		text-decoration: none;
	}

	.topic-footer {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--site-line);
	}

	.topic-footer nav {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
		margin-top: 0.5rem;
	}

	.topic-footer a {
		color: var(--site-muted);
		font-size: 0.7rem;
		line-height: 1.4;
	}

	@media (max-width: 48rem) {
		.topic-content,
		.topic-footer {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 34rem) {
		.plain-english {
			grid-template-columns: 1fr;
			gap: 0.35rem;
		}
	}
</style>
