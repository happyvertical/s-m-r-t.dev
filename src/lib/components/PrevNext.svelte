<script lang="ts">
	/**
	 * Prev/next step through a reading track.
	 *
	 * Presentational on purpose: the caller resolves the neighbours from
	 * `$lib/data/track`, which keeps the order in the data layer where the
	 * sidebar defines it.
	 */
	import type { TrackNeighbors } from '$lib/data/track';

	let { neighbors }: { neighbors: TrackNeighbors | null } = $props();
</script>

{#if neighbors && (neighbors.prev || neighbors.next)}
	<nav class="prev-next" aria-label={`${neighbors.track} — previous and next`}>
		{#if neighbors.prev}
			<a class="step prev" href={neighbors.prev.href} rel="prev">
				<span class="direction">← Previous</span>
				<span class="label">{neighbors.prev.label}</span>
				<span class="caption">{neighbors.prev.caption}</span>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if neighbors.next}
			<a class="step next" href={neighbors.next.href} rel="next">
				<span class="direction">Next →</span>
				<span class="label">{neighbors.next.label}</span>
				<span class="caption">{neighbors.next.caption}</span>
			</a>
		{/if}
	</nav>
{/if}

<style>
	.prev-next {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
		margin-top: 40px;
		padding-top: 30px;
		border-top: 1px solid var(--site-line);
	}

	.step {
		display: grid;
		gap: 4px;
		padding: 14px 16px;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
		text-decoration: none;
	}

	.step.next {
		text-align: right;
	}

	.step:hover {
		border-color: var(--site-accent-strong);
	}

	.direction {
		color: var(--site-accent-strong);
		font: 700 0.62rem var(--site-font-mono);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.label {
		color: var(--site-ink);
		font-size: 0.88rem;
		font-weight: 650;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.caption {
		color: var(--site-muted);
		font-size: 0.68rem;
	}

	@media (max-width: 680px) {
		.prev-next {
			grid-template-columns: 1fr;
		}

		.step.next {
			text-align: left;
		}
	}
</style>
