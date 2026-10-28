<script lang="ts">
	import ColorSchemeToggle from '$lib/components/ColorSchemeToggle.svelte';

	// The front page has no site header (#381): BUILD, FEATURES and DOCS at the
	// top left, the colour scheme and the source at the top right. Transparent
	// buttons, readable on the sky and on space; BUILD is the sun's twin.
	let {
		count,
		buildTarget,
		sky,
		onbuild
	}: {
		count: number;
		buildTarget: string;
		/** The light scheme: ink-blue controls instead of cream. */
		sky: boolean;
		onbuild: (_event: MouseEvent) => void;
	} = $props();
</script>

<a class="skip-link" href="#main-content">Skip to content</a>

<nav class="bar left" class:day={sky} aria-label="Primary navigation">
	<a class="btn" href={buildTarget} onclick={onbuild}
		>Build{#if count}<span class="count" aria-hidden="true">{count}</span><span class="sr"
				>, {count} selected</span
			>{/if}</a
	>
	<a class="btn" href="/features">Features</a>
	<a class="btn" href="/docs">Docs</a>
</nav>
<div class="bar right" class:day={sky}>
	<ColorSchemeToggle class="btn icon" />
	<a
		class="btn icon"
		href="https://github.com/happyvertical/smrt"
		target="_blank"
		rel="noreferrer"
		aria-label="Open the s-m-r-t source on GitHub"
	>
		<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
			<circle cx="12" cy="12" r="9"></circle>
			<path
				d="M9 19c-1-2-2-2-3-2M15 19v-3c0-1 0-2-1-2 3 0 5-1 5-4 0-1 0-2-1-3 0-1 0-2 0-2s-1 0-3 1c-2-1-4-1-6 0-2-1-3-1-3-1s0 1 0 2c-1 1-1 2-1 3 0 3 2 4 5 4-1 0-1 1-1 2v3"
			></path>
		</svg>
	</a>
</div>

<style>
	.skip-link {
		position: absolute;
		inset-block-start: 0.4rem;
		inset-inline-start: 0.5rem;
		z-index: 40;
		padding: 0.55rem 0.75rem;
		background: #ffe9c4;
		color: #3a0d00;
		font: 700 0.8rem var(--front-mono);
		transform: translateY(-300%);
	}
	.skip-link:focus {
		transform: translateY(0);
	}
	.bar {
		--btn-ink: var(--front-ink);
		--btn-hover: var(--front-yellow-ink);
		position: absolute;
		top: 16px;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.bar.day {
		--btn-ink: #1d3557;
		--btn-hover: #2558a8;
	}
	.left {
		left: max(16px, env(safe-area-inset-left, 0px));
	}
	.right {
		right: max(16px, env(safe-area-inset-right, 0px));
	}
	/* No background, no blur, no border: the text or icon alone, hover colour only. */
	.bar :global(.btn) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 40px;
		padding: 10px 16px;
		background: none;
		border: 0;
		color: var(--btn-ink);
		font-family: var(--front-mono);
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		text-decoration: none;
		cursor: pointer;
		/* Over a bright sky or a dark one, the text keeps an edge. */
		text-shadow: 0 0 8px var(--btn-halo, transparent);
	}
	.bar.day {
		--btn-halo: rgba(255, 255, 255, 0.7);
	}
	.bar :global(.btn:hover),
	.bar :global(.btn:focus-visible) {
		color: var(--btn-hover);
		outline: none;
	}
	.bar :global(.btn:focus-visible) {
		text-decoration: underline;
		text-underline-offset: 6px;
	}
	.bar :global(.btn.icon) {
		width: 40px;
		padding: 0;
		justify-content: center;
	}
	.bar :global(.btn svg) {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.count {
		min-width: 1.6em;
		padding: 1px 6px;
		border-radius: 999px;
		background: var(--btn-ink);
		color: var(--front-bg);
		font-size: 11px;
		letter-spacing: 0;
		text-align: center;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	@media (max-width: 767px) {
		/* The same five controls, one row across the top. */
		.bar {
			top: 10px;
			gap: 0;
		}
		.left {
			left: max(6px, env(safe-area-inset-left, 0px));
		}
		.right {
			right: max(6px, env(safe-area-inset-right, 0px));
		}
		.bar :global(.btn) {
			padding: 10px 8px;
			font-size: 12px;
			letter-spacing: 0.08em;
		}
		.bar :global(.btn.icon) {
			width: 36px;
			padding: 0;
		}
	}
</style>
