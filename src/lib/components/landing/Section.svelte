<script lang="ts">
	/**
	 * Shared landing-section shell: a centered container with an optional
	 * eyebrow + title + intro, alternating surface tint for rhythm. Themed with
	 * --smrt-color-* so it works in light and dark.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		eyebrow?: string;
		intro?: string;
		/** Subtle alternating background to separate adjacent sections. */
		tinted?: boolean;
		/** Wider content area for grids/panels (default centers narrower). */
		wide?: boolean;
		id?: string;
		children?: Snippet;
	}

	let { title, eyebrow, intro, tinted = false, wide = false, id, children }: Props = $props();
</script>

<section class="lp-section" class:tinted {id}>
	<div class="lp-container" class:wide>
		{#if eyebrow || title || intro}
			<header class="lp-head">
				{#if eyebrow}<p class="lp-eyebrow">{eyebrow}</p>{/if}
				{#if title}<h2 class="lp-title">{title}</h2>{/if}
				{#if intro}<p class="lp-intro">{intro}</p>{/if}
			</header>
		{/if}
		{@render children?.()}
	</div>
</section>

<style>
	.lp-section {
		padding: 72px 24px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.lp-section.tinted {
		background: color-mix(in srgb, var(--smrt-color-surface-container, #f5f5f5) 55%, transparent);
	}

	.lp-container {
		max-width: 920px;
		margin: 0 auto;
	}

	.lp-container.wide {
		max-width: 1120px;
	}

	.lp-head {
		max-width: 720px;
		margin: 0 auto 48px;
		text-align: center;
	}

	.lp-eyebrow {
		margin: 0 0 12px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--smrt-color-primary, #1976d2);
	}

	.lp-title {
		font-size: clamp(1.6rem, 3.5vw, 2.4rem);
		line-height: 1.2;
		font-weight: 700;
		letter-spacing: -0.01em;
		margin: 0 0 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.lp-intro {
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--smrt-color-on-surface-variant, #555);
		margin: 0;
	}

	@media (max-width: 600px) {
		.lp-section {
			padding: 56px 16px;
		}
		.lp-head {
			margin-bottom: 36px;
		}
	}
</style>
