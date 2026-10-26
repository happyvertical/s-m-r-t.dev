<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { blockIsPreview } from '$lib/data/block-status';
	import { blockBranches, buildingBlocks } from '$lib/data/blocks';

	/**
	 * `/modules#<cluster-id>` bookmarks cannot redirect by fragment on a static
	 * site, so each old cluster id stays an anchor on the block that replaced
	 * it. Each pairs an old cluster id with its block slug; ids equal to a block slug need
	 * no alias because every entry already carries `id={slug}`.
	 */
	const clusterAliases = [
		{ alias: 'identity-and-access', target: 'people-and-permissions' },
		{ alias: 'agents-and-automation', target: 'agents-included' },
		{ alias: 'commerce-and-operations', target: 'commerce-and-money' },
		{ alias: 'support-and-projects', target: 'operations' },
		{ alias: 'analytics-and-growth', target: 'insight-and-marketing' },
		{ alias: 'domain-knowledge', target: 'facts' }
	];
</script>

<SEO
	title="Agentic building blocks"
	description="Capabilities you won't build from scratch, in four branches: Agents, The Basics, Ready-made pieces and Screens."
	url="https://s-m-r-t.dev/blocks"
/>

<article class="blocks-page">
	<header>
		<p class="eyebrow">Blocks</p>
		<h1>Agentic building blocks</h1>
		<p class="lede">
			Capabilities you won't build from scratch. Each block names what building it yourself
			involves, what comes in the box and what you still decide. Pick them in
			<a href="/build-a-boilerplate">build-a-boilerplate</a>.
		</p>
	</header>

	{#each blockBranches as branch (branch.id)}
		<section
			class="branch"
			id={`branch-${branch.id}`}
			aria-labelledby={`branch-${branch.id}-title`}
		>
			<h2 id={`branch-${branch.id}-title`}>{branch.title}</h2>
			<p class="branch-lede">{branch.lede}</p>
			<ul>
				{#each buildingBlocks.filter((candidate) => candidate.branch === branch.id) as block (block.id)}
					<li id={block.id}>
						{#each clusterAliases as entry (entry.alias)}{#if entry.target === block.id}<span
									class="alias"
									id={entry.alias}
								></span>{/if}{/each}
						<a href={`/blocks/${block.id}`}>{block.title}</a>
						{#if blockIsPreview(block)}<span class="chip">Preview</span>{/if}
						<p>{block.capability}</p>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</article>

<style>
	.blocks-page {
		width: min(60rem, calc(100% - 32px));
		margin: 0 auto;
		padding: clamp(2.5rem, 6vw, 5rem) 0 6rem;
	}
	.eyebrow {
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
	.lede,
	.branch-lede {
		margin-top: 14px;
		max-width: 44rem;
		color: var(--site-muted);
		line-height: 1.65;
	}
	.branch {
		margin-top: 40px;
		padding-top: 28px;
		border-top: 1px solid var(--site-line-strong);
	}
	h2 {
		font-size: 1.4rem;
		letter-spacing: -0.025em;
	}
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
		gap: 14px;
		margin: 18px 0 0;
		padding: 0;
		list-style: none;
	}
	li {
		scroll-margin-top: 86px;
		padding: 14px 16px;
		border: 1px solid var(--site-line);
		border-radius: 6px;
	}
	li > a {
		color: var(--site-ink);
		font-weight: 650;
		text-decoration: none;
	}
	li > a:hover {
		text-decoration: underline;
	}
	li p {
		margin-top: 6px;
		color: var(--site-muted);
		font-size: 0.85rem;
		line-height: 1.55;
	}
	.alias {
		display: block;
		height: 0;
		scroll-margin-top: 86px;
	}
	.chip {
		margin-left: 6px;
		padding: 1px 7px;
		border: 1px solid var(--site-line-strong);
		border-radius: 999px;
		font: 600 0.72rem var(--site-font-mono);
	}
</style>
