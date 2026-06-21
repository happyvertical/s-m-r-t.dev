<script lang="ts">
	/**
	 * Prev/next navigation within the Concepts and Guides tracks (issue #101).
	 *
	 * Only renders when the current page is a member of one of the ordered
	 * tracks defined in `$lib/site-nav`. Pages outside a track render nothing.
	 */
	import { trackNeighbors } from '$lib/site-nav';

	let { pathname }: { pathname: string } = $props();

	let neighbors = $derived(trackNeighbors(pathname));
</script>

{#if neighbors && (neighbors.prev || neighbors.next)}
	<nav class="prev-next" aria-label="{neighbors.track.title} track">
		{#if neighbors.prev}
			<a class="pn-link prev" href={neighbors.prev.href} rel="prev">
				<span class="pn-dir">← Previous</span>
				<span class="pn-label">{neighbors.prev.label}</span>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if neighbors.next}
			<a class="pn-link next" href={neighbors.next.href} rel="next">
				<span class="pn-dir">Next →</span>
				<span class="pn-label">{neighbors.next.label}</span>
			</a>
		{/if}
	</nav>
{/if}

<style>
	.prev-next {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		margin-top: 64px;
		padding-top: 32px;
		border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.pn-link {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
		max-width: 48%;
		padding: 16px 20px;
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: var(--smrt-radius-md, 8px);
		text-decoration: none;
		transition:
			border-color 0.15s,
			background 0.15s;
	}

	.pn-link:hover {
		border-color: var(--smrt-color-primary, #1976d2);
		background: var(--smrt-color-surface-container-low, #fafafa);
	}

	.pn-link.next {
		text-align: right;
		margin-left: auto;
	}

	.pn-dir {
		font-size: 0.78rem;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	.pn-label {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.pn-link:hover .pn-label {
		color: var(--smrt-color-primary, #1976d2);
	}

	@media (max-width: 600px) {
		.prev-next {
			flex-direction: column;
		}

		.pn-link,
		.pn-link.next {
			max-width: 100%;
			text-align: left;
		}
	}
</style>
