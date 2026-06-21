<script lang="ts">
	/**
	 * Generic equal-width card row used by several landing sections
	 * (AI-is-built-in, runs-anywhere). Each card: icon + title + body, with an
	 * optional monospace list and an optional footnote. Themed with
	 * --smrt-color-*.
	 */
	import type { LandingCard } from './types';

	interface Props {
		cards: LandingCard[];
		/** A small honest footnote shown under the whole row. */
		note?: string;
		columns?: 2 | 3;
	}

	let { cards, note, columns = 2 }: Props = $props();
</script>

<div class="row" data-cols={columns}>
	{#each cards as card (card.title)}
		<article class="card">
			{#if card.iconPath}
				<span class="card-icon" aria-hidden="true">
					<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
						<path d={card.iconPath} />
					</svg>
				</span>
			{/if}
			<h3 class="card-title">{card.title}</h3>
			<p class="card-body">{card.body}</p>
			{#if card.tags && card.tags.length > 0}
				<ul class="card-tags">
					{#each card.tags as tag}
						<li>{tag}</li>
					{/each}
				</ul>
			{/if}
		</article>
	{/each}
</div>

{#if note}
	<p class="row-note">{note}</p>
{/if}

<style>
	.row {
		display: grid;
		gap: 18px;
	}

	.row[data-cols='2'] {
		grid-template-columns: repeat(2, 1fr);
	}

	.row[data-cols='3'] {
		grid-template-columns: repeat(3, 1fr);
	}

	.card {
		padding: 26px;
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: var(--smrt-radius-md, 8px);
		background: var(--smrt-color-surface, #fff);
	}

	.card-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: var(--smrt-radius-sm, 6px);
		margin-bottom: 16px;
		background: color-mix(in srgb, var(--smrt-color-primary, #1976d2) 12%, transparent);
		color: var(--smrt-color-primary, #1976d2);
	}

	.card-title {
		font-size: 1.15rem;
		font-weight: 600;
		margin: 0 0 8px;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.card-body {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--smrt-color-on-surface-variant, #666);
		margin: 0;
	}

	.card-tags {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		margin: 16px 0 0;
		padding: 0;
	}

	.card-tags li {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 0.74rem;
		padding: 3px 9px;
		border-radius: 4px;
		background: var(--smrt-color-surface-container, #f1f1f1);
		color: var(--smrt-color-on-surface-variant, #555);
	}

	.row-note {
		margin: 22px 0 0;
		text-align: center;
		font-size: 0.9rem;
		line-height: 1.55;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	@media (max-width: 640px) {
		.row[data-cols='2'],
		.row[data-cols='3'] {
			grid-template-columns: 1fr;
		}
	}
</style>
