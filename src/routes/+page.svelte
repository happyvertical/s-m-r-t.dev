<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import FeatureGraph from '$lib/components/home/FeatureGraph.svelte';
	import { BUILD_HREF } from '$lib/components/home/graph-layout';

	// The three doors below the map (#361): build-a-boilerplate, the feature
	// showcases, and the technical documentation.
	const doors = [
		{ label: 'Build', note: 'build-a-boilerplate', href: BUILD_HREF, hot: true },
		{ label: 'Features', note: 'showcases', href: '/features', hot: false },
		{ label: 'Docs', note: 'for developers and agents', href: '/docs', hot: false }
	];
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap"
	/>
</svelte:head>

<SEO
	title="The s-m-r-t application stack"
	description="s-m-r-t is an MIT-licensed TypeScript stack for agentic software that people and agents use through the same screens, rules and permissions. Describe a record once and the storage, forms, API, command line and agent tools are generated from it. The stack includes an in-app assistant, scheduled agents, approvals, reports on request and row-level data rules. Outside agents connect over MCP or in the browser as a signed-in identity. build-a-boilerplate assembles a working mock-up for a kind of business in the browser and exports the plan as a file."
	url="https://s-m-r-t.dev"
/>

<div class="front">
	<h1 class="visually-hidden">The s-m-r-t application stack</h1>
	<FeatureGraph />

	<section class="doors" id="doors" aria-label="Where to go next">
		<div class="in">
			{#each doors as door (door.href)}
				<a class="door" class:hot={door.hot} href={door.href}>
					<b>{door.label}</b><span>{door.note}</span>
				</a>
			{/each}
		</div>
	</section>
	<p class="foot">MIT · one version</p>
</div>

<style>
	/*
	 * The front page keeps its own palette, apart from the site's friendly UI.
	 * Dark is fire; light is blue flame. The map follows the viewer's
	 * preference and the site toggle (<html data-color-scheme>).
	 * `*-ink` tokens are the same hues darkened or lightened until small text
	 * on the page background passes AA (4.5:1); the plain tokens colour fills
	 * and strokes only.
	 */
	.front {
		--front-mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
		--front-bg: #eef1f5;
		--front-ink: #14171c;
		--front-dim: #5b6470;
		--front-dim-text: #5b6470;
		--front-line: #c9d1dc;
		--front-line-1: #b7c6de;
		--front-red: #1848c8;
		--front-orange: #1f8fe6;
		--front-yellow: #38c6ff;
		--front-orange-ink: #0b62ad;
		--front-yellow-ink: #0b62ad;
		--front-hub-ink: #0a2a7a;
		--front-door-hot-ink: #ffffff;
		--front-hint-ink: #14171c;
		background: var(--front-bg);
		color: var(--front-ink);
		font-family: var(--front-mono);
		line-height: 1.4;
	}
	@media (prefers-color-scheme: dark) {
		:global(html:not([data-color-scheme]):not([data-theme='light'])) .front {
			--front-bg: #0a0604;
			--front-ink: #ffe9c4;
			--front-dim: #8a5a2a;
			--front-dim-text: #c28a4f;
			--front-line: #3a2412;
			--front-line-1: #4a1e10;
			--front-red: #ff3b1f;
			--front-orange: #ff8c1a;
			--front-yellow: #ffd21f;
			--front-orange-ink: #ff8c1a;
			--front-yellow-ink: #ffd21f;
			--front-hub-ink: #3a0d00;
			--front-door-hot-ink: #3a0d00;
			--front-hint-ink: #0a0604;
		}
	}
	:global(html[data-color-scheme='dark']) .front,
	:global(html[data-theme='dark']) .front {
		--front-bg: #0a0604;
		--front-ink: #ffe9c4;
		--front-dim: #8a5a2a;
		--front-dim-text: #c28a4f;
		--front-line: #3a2412;
		--front-line-1: #4a1e10;
		--front-red: #ff3b1f;
		--front-orange: #ff8c1a;
		--front-yellow: #ffd21f;
		--front-orange-ink: #ff8c1a;
		--front-yellow-ink: #ffd21f;
		--front-hub-ink: #3a0d00;
		--front-door-hot-ink: #3a0d00;
		--front-hint-ink: #0a0604;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
		border: 0;
	}

	.doors {
		padding: 0 max(16px, env(safe-area-inset-right, 0px)) 64px
			max(16px, env(safe-area-inset-left, 0px));
	}
	.in {
		max-width: 1080px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
	}
	.door {
		min-width: 0;
		color: var(--front-ink);
		text-decoration: none;
		border: 1.5px solid var(--front-line);
		padding: 40px 24px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		transition:
			border-color 0.15s,
			background 0.15s;
	}
	.door b {
		font-size: 28px;
		font-weight: 700;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--front-orange-ink);
	}
	.door span {
		color: var(--front-dim-text);
		font-size: 13px;
		letter-spacing: 0.06em;
	}
	.door:hover {
		border-color: var(--front-orange);
		background: color-mix(in srgb, var(--front-orange) 8%, transparent);
	}
	.door:focus-visible {
		outline: 2px solid var(--front-orange-ink);
		outline-offset: 4px;
	}
	.door.hot {
		background: var(--front-red);
		border-color: var(--front-red);
	}
	.door.hot b,
	.door.hot span {
		color: var(--front-door-hot-ink);
	}
	.foot {
		margin: 0;
		text-align: center;
		color: var(--front-dim-text);
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding-block: 0 32px;
	}

	@media (prefers-reduced-motion: reduce) {
		.door {
			transition: none;
		}
	}
	@media (max-width: 767px) {
		.in {
			grid-template-columns: 1fr;
		}
	}
</style>
