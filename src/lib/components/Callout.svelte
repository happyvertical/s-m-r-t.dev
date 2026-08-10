<script lang="ts">
	/**
	 * Callout — the site's admonition box.
	 *
	 * Guide, reference, and package data can declare a callout inline (see
	 * `GuideCallout` in `$lib/data/callouts`), so content authors do not need to
	 * touch a renderer to add one.
	 *
	 * Styling follows the existing site pattern: a left accent rule over a tinted
	 * surface, with the accent colour supplied by the theme-aware `--site-*`
	 * tokens so light and dark both read correctly.
	 */
	import type { Snippet } from 'svelte';
	import type { CalloutVariant } from '$lib/data/callouts';
	import { calloutVariantLabels } from '$lib/data/callouts';

	interface Props {
		/** Semantic and visual style of the callout. */
		variant?: CalloutVariant;
		/** Optional heading shown beside the variant label. */
		title?: string;
		/** Plain-text body, used when no children snippet is supplied. */
		body?: string;
		children?: Snippet;
	}

	let { variant = 'note', title, body, children }: Props = $props();

	const titleId = $props.id();
</script>

<!-- The variant label is part of the accessible name, so the kind of callout is
     conveyed by more than colour. -->
<aside class="callout callout--{variant}" role="note" aria-labelledby={titleId}>
	<p class="callout-title" id={titleId}>
		<span class="callout-kind">{calloutVariantLabels[variant]}</span>
		{#if title}<span class="callout-heading">{title}</span>{/if}
	</p>
	<div class="callout-body">
		{#if children}{@render children()}{:else if body}<p>{body}</p>{/if}
	</div>
</aside>

<style>
	.callout {
		/* Dedicated note/neutral tokens rather than the site accent and muted ink:
		   the label is small uppercase mono, so it needs the full 4.5:1 against
		   its own tint, which --site-accent-strong does not reach on this tint. */
		--callout-accent: var(--site-note);
		--callout-tint: var(--site-note-soft);

		margin: 20px 0 0;
		padding: 14px 16px;
		border: 1px solid var(--site-line);
		border-left: 4px solid var(--callout-accent);
		border-radius: 0 var(--site-radius-md) var(--site-radius-md) 0;
		background: var(--callout-tint);
	}

	.callout-title {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 9px;
	}

	.callout-kind {
		color: var(--callout-accent);
		font: 750 0.63rem var(--site-font-mono);
		letter-spacing: 0.09em;
		text-transform: uppercase;
	}

	.callout-heading {
		color: var(--site-ink);
		font-size: 0.84rem;
		font-weight: 650;
	}

	.callout-body {
		color: var(--site-ink);
		font-size: 0.83rem;
		line-height: 1.62;
	}

	.callout-title:not(:empty) + .callout-body {
		margin-top: 6px;
	}

	.callout-body :global(p + p) {
		margin-top: 8px;
	}

	.callout-body :global(a) {
		color: var(--callout-accent);
	}

	.callout-body :global(code) {
		padding: 1px 5px;
		border-radius: 4px;
		background: var(--site-surface);
		font-family: var(--site-font-mono);
		font-size: 0.88em;
	}

	.callout--warning {
		--callout-accent: var(--site-warn);
		--callout-tint: var(--site-warn-soft);
	}

	.callout--security {
		--callout-accent: var(--site-danger);
		--callout-tint: var(--site-danger-soft);
	}

	.callout--deprecated {
		--callout-accent: var(--site-neutral);
		--callout-tint: var(--site-neutral-soft);
	}

	.callout--version-added {
		--callout-accent: var(--site-ok);
		--callout-tint: var(--site-ok-soft);
	}
</style>
