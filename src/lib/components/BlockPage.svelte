<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { blockIsPreview, packageStatusChip } from '$lib/data/block-status';
	import { blockBranches, type BuildingBlock } from '$lib/data/blocks';
	import { getPackage } from '$lib/data/packages';

	let { block }: { block: BuildingBlock } = $props();

	const branch = $derived(blockBranches.find((candidate) => candidate.id === block.branch));
	const preview = $derived(blockIsPreview(block));
	const chips = $derived(
		block.packages.map((slug) => ({
			slug,
			name: getPackage(slug)?.name ?? slug,
			status: packageStatusChip(slug)
		}))
	);
</script>

<SEO
	title={block.title}
	description={block.capability}
	url={`https://s-m-r-t.dev/blocks/${block.id}`}
/>

<article class="block-page">
	<header>
		<a class="back-link" href="/blocks">← Blocks</a>
		<p class="eyebrow">{branch?.title ?? block.branch}</p>
		<h1>
			{block.title}
			{#if preview}<span class="chip preview-chip">Preview</span>{/if}
		</h1>
		<p class="capability">{block.capability}</p>
	</header>

	<section aria-labelledby="from-scratch">
		<h2 id="from-scratch">Building this yourself</h2>
		<ul>
			{#each block.fromScratch as item (item)}<li>{item}</li>{/each}
		</ul>
	</section>

	<section aria-labelledby="supplied">
		<h2 id="supplied">What comes in the box</h2>
		<ul>
			{#each block.supplied as item (item)}<li>{item}</li>{/each}
		</ul>
	</section>

	<section aria-labelledby="you-decide">
		<h2 id="you-decide">What you still decide</h2>
		<ul>
			{#each block.youDecide as item (item)}<li>{item}</li>{/each}
		</ul>
	</section>

	<section aria-labelledby="packages">
		<h2 id="packages">Packages</h2>
		<ul class="chips">
			{#each chips as chip (chip.slug)}
				<li>
					<a href={`/docs/reference/packages/${chip.slug}`}>
						<code>{chip.name}</code>
						{#if chip.status}<span class="chip">{chip.status}</span>{/if}
					</a>
				</li>
			{/each}
		</ul>
		{#if block.guides.length}
			<h3>Guides</h3>
			<ul class="guides">
				{#each block.guides as guide (guide.href)}
					<li><a href={guide.href}>{guide.label}</a></li>
				{/each}
			</ul>
		{/if}
		{#if block.evidence?.length}
			<p class="sources"><a href="/docs/reference/evidence">Sources</a></p>
		{/if}
	</section>
</article>

<style>
	.block-page {
		width: min(760px, calc(100% - 32px));
		margin: 0 auto;
		padding: 50px 0 90px;
	}
	.back-link {
		color: var(--site-muted);
		font-size: 0.74rem;
		text-decoration: none;
	}
	.eyebrow {
		margin-top: 30px;
		color: var(--site-accent-ink, var(--site-accent-strong));
		font: 700 0.75rem var(--site-font-mono);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	h1 {
		margin-top: 10px;
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 680;
		letter-spacing: -0.04em;
		line-height: 1.1;
	}
	.capability {
		margin-top: 17px;
		color: var(--site-muted);
		font-size: 1.05rem;
		line-height: 1.65;
	}
	section {
		margin-top: 8px;
		padding: 30px 0 4px;
		border-top: 1px solid var(--site-line);
	}
	h2 {
		font-size: 1.3rem;
		letter-spacing: -0.025em;
	}
	h3 {
		margin-top: 22px;
		font-size: 0.95rem;
	}
	ul {
		margin: 14px 0 0;
		padding-left: 20px;
	}
	li {
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.65;
	}
	li + li {
		margin-top: 6px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding: 0;
		list-style: none;
	}
	.chips li + li {
		margin-top: 0;
	}
	.chips a {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		padding: 5px 10px;
		border: 1px solid var(--site-line-strong);
		border-radius: 5px;
		color: var(--site-ink);
		font-size: 0.8rem;
		text-decoration: none;
	}
	.chips a:hover {
		border-color: var(--site-accent-strong);
	}
	.chip {
		padding: 1px 7px;
		border: 1px solid var(--site-line-strong);
		border-radius: 999px;
		color: var(--site-ink);
		font: 600 0.72rem var(--site-font-mono);
		letter-spacing: 0.02em;
		vertical-align: middle;
	}
	h1 .chip {
		margin-left: 8px;
		font-size: 0.75rem;
		letter-spacing: 0;
	}
	.sources {
		margin-top: 22px;
		font-size: 0.85rem;
	}
</style>
