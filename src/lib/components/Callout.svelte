<script lang="ts">
	/**
	 * Callout — a reusable admonition box for docs/module pages.
	 *
	 * Themed with the site's `--smrt-color-*` tokens so it works in light AND
	 * dark. Each variant uses a left-border accent + a subtly tinted background.
	 *
	 * Usage:
	 *   <script>
	 *     import Callout from '$lib/components/Callout.svelte';
	 *   <\/script>
	 *
	 *   <Callout variant="warning" title="Heads up">
	 *     This API changed in the latest release.
	 *   </Callout>
	 *
	 *   <Callout variant="version-added">Added in v0.29.34.</Callout>
	 */
	import type { Snippet } from 'svelte';

	type Variant = 'note' | 'warning' | 'security' | 'deprecated' | 'version-added';

	interface Props {
		/** Visual + semantic style of the callout. */
		variant?: Variant;
		/** Optional heading shown above the body. Falls back to a per-variant label. */
		title?: string;
		children?: Snippet;
	}

	let { variant = 'note', title, children }: Props = $props();

	const DEFAULT_LABEL: Record<Variant, string> = {
		note: 'Note',
		warning: 'Warning',
		security: 'Security',
		deprecated: 'Deprecated',
		'version-added': 'Version added'
	};

	let label = $derived(title ?? DEFAULT_LABEL[variant]);
</script>

<aside class="callout callout--{variant}" role="note">
	<p class="callout-title">{label}</p>
	<div class="callout-body">
		{@render children?.()}
	</div>
</aside>

<style>
	.callout {
		/* Per-variant accent + tint are set on each modifier below; these are the
		   defaults (note) so the base class is usable on its own. */
		--callout-accent: var(--smrt-color-primary, #1976d2);
		--callout-tint: var(--smrt-color-surface-container, #f5f5f5);
		--callout-title: var(--smrt-color-on-surface, #1a1a1a);

		margin: 16px 0 24px;
		padding: 12px 16px;
		border-left: 4px solid var(--callout-accent);
		border-radius: var(--smrt-radius-sm, 4px);
		background: color-mix(in srgb, var(--callout-tint) 60%, transparent);
	}

	.callout-title {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 6px;
		font-size: 0.8rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--callout-accent);
	}

	.callout-body {
		color: var(--smrt-color-on-surface-variant, #4a4a4a);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	/* Body children (paragraphs, lists, inline code) should sit flush in the box. */
	.callout-body :global(p) {
		margin: 0 0 8px;
	}

	.callout-body :global(p:last-child) {
		margin-bottom: 0;
	}

	.callout-body :global(a) {
		color: var(--callout-accent);
	}

	.callout-body :global(code) {
		font-family: var(--font-mono, monospace);
		font-size: 0.875em;
		padding: 1px 5px;
		border-radius: 3px;
		background: color-mix(in srgb, var(--callout-accent) 12%, transparent);
	}

	/* note → primary */
	.callout--note {
		--callout-accent: var(--smrt-color-primary, #1976d2);
		--callout-tint: var(--smrt-color-primary-container, #e3f0ff);
	}

	/* warning → warning tokens (amber) */
	.callout--warning {
		--callout-accent: var(--smrt-color-warning, #d97706);
		--callout-tint: var(--smrt-color-warning-container, #fef3c7);
	}

	/* security → error tokens (red — treat as high-attention) */
	.callout--security {
		--callout-accent: var(--smrt-color-error, #dc2626);
		--callout-tint: var(--smrt-color-error-container, #fee2e2);
	}

	/* deprecated → muted/neutral (outline + surface) */
	.callout--deprecated {
		--callout-accent: var(--smrt-color-on-surface-variant, #6b7280);
		--callout-tint: var(--smrt-color-surface-variant, #f0f0f0);
	}

	/* version-added → success tokens (green) */
	.callout--version-added {
		--callout-accent: var(--smrt-color-success, #059669);
		--callout-tint: var(--smrt-color-success-container, #d1fae5);
	}
</style>
