<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { buildHref, loadSelection, saveSelection } from '$lib/build-handoff';
	import { featureSections, featuresInSection } from '$lib/data/features';
	import { fitGraph, HUB_RADIUS, type PlacedNode } from './graph-layout';
	import SunCanvas from './SunCanvas.svelte';
	import { SUN_SIZE } from './sun';

	/** Full-screen map: the BUILD sun, nine sections, forty-nine features. */
	let size = $state({ width: 1400, height: 800 });
	const graph = $derived(fitGraph(size.width, size.height));
	const nodes = $derived(graph.nodes.filter((node) => node.depth > 0));
	const hub = $derived(graph.nodes[0]);

	let map: HTMLElement;
	let hintEl: HTMLElement;
	let focused = $state<PlacedNode | null>(null);

	// Features picked for build-a-boilerplate (#367). Read after mount so the
	// prerendered page is the empty selection; kept in sessionStorage so a
	// showcase visit and Back return to it.
	const selected = new SvelteSet<string>();
	const count = $derived(selected.size);
	const buildTarget = $derived(buildHref(selected));
	const isFeature = (node: PlacedNode) => node.depth === 2;
	const featureId = (node: PlacedNode) => node.id.replace(/^feature:/, '');
	const isSelected = (node: PlacedNode) => isFeature(node) && selected.has(featureId(node));

	function toggle(node: PlacedNode) {
		const id = featureId(node);
		if (!selected.delete(id)) selected.add(id);
		saveSelection(selected);
	}

	// The focused node, its section and, for a section, all of its features.
	const lit = $derived.by(() => {
		if (!focused) return null;
		const ids = new SvelteSet<string>(['hub', focused.id]);
		for (const node of nodes) {
			if (node.section !== focused.section) continue;
			if (node.depth === 1 || node.id === focused.id || focused.depth === 1) ids.add(node.id);
		}
		return ids;
	});

	onMount(() => {
		for (const id of loadSelection()) selected.add(id);
		const measure = () => {
			const { clientWidth, clientHeight } = map;
			if (clientWidth > 0 && clientHeight > 0) size = { width: clientWidth, height: clientHeight };
		};
		measure();
		if (typeof ResizeObserver === 'undefined') {
			window.addEventListener('resize', measure);
			return () => window.removeEventListener('resize', measure);
		}
		const observer = new ResizeObserver(measure);
		observer.observe(map);
		return () => observer.disconnect();
	});

	// Place the hover sentence beside the node, inside the map.
	$effect(() => {
		if (!focused || !hintEl) return;
		const { x, y, r } = focused;
		const left = x < graph.cx ? x - hintEl.offsetWidth - (r + 14) : x + r + 14;
		hintEl.style.left = `${Math.max(8, Math.min(size.width - hintEl.offsetWidth - 8, left))}px`;
		hintEl.style.top = `${y + 14}px`;
	});

	// Circle and label keep their own handlers: the circle of a feature selects
	// it, everything else (and every label) opens the page.
	function onCircleClick(event: MouseEvent, node: PlacedNode) {
		event.preventDefault();
		if (isFeature(node)) toggle(node);
		else void goto(node.href);
	}
	// Space selects; Enter is the link's own click and opens.
	function onNodeKeydown(event: KeyboardEvent, node: PlacedNode) {
		if (event.key !== ' ' || !isFeature(node)) return;
		event.preventDefault();
		toggle(node);
	}
	function onLabelClick(event: MouseEvent, node: PlacedNode) {
		event.preventDefault();
		void goto(node.href);
	}
	function onHubClick(event: MouseEvent) {
		event.preventDefault();
		void goto(buildTarget);
	}
</script>

<section class="map" class:focus={lit !== null} id="map" aria-label="Features" bind:this={map}>
	<div
		class="sun-slot"
		style:left="{graph.cx - SUN_SIZE / 2}px"
		style:top="{graph.cy - SUN_SIZE / 2}px"
	>
		<SunCanvas />
	</div>
	<svg viewBox="0 0 {size.width} {size.height}" aria-label="Features around BUILD" role="group">
		<g>
			{#each graph.links as link (link.target.id)}
				<line
					class="link l{link.depth}"
					class:on={lit?.has(link.source.id) && lit.has(link.target.id)}
					x1={link.x1}
					y1={link.y1}
					x2={link.target.x}
					y2={link.target.y}
				/>
			{/each}
		</g>
		<g>
			{#each nodes as node (node.id)}
				{@const right = node.x >= graph.cx}
				<g transform="translate({node.x},{node.y})">
					<a
						class="n d{node.depth}"
						class:on={lit?.has(node.id)}
						class:sel={isSelected(node)}
						href={node.href}
						aria-label="{node.word}{node.depth === 1 ? ' section' : ''}{isSelected(node)
							? ', selected'
							: ''}: {node.hint}"
						onkeydown={(event) => onNodeKeydown(event, node)}
						onmouseenter={() => (focused = node)}
						onfocus={() => (focused = node)}
						onmouseleave={() => (focused = null)}
						onblur={() => (focused = null)}
					>
						{#if isSelected(node)}
							<circle class="ring" r={node.r + 5} />
						{/if}
						<circle
							class="dot"
							r={node.r}
							onclick={(event) => onCircleClick(event, node)}
							role="presentation"
						/>
						<text
							x={right ? node.r + 8 : -(node.r + 8)}
							y={node.depth === 1 ? 5 : 4}
							text-anchor={right ? 'start' : 'end'}
							onclick={(event) => onLabelClick(event, node)}
							role="presentation">{node.word}</text
						>
					</a>
				</g>
			{/each}
		</g>
		<g transform="translate({hub.x},{hub.y})">
			<a
				class="hub"
				href={buildTarget}
				aria-label={count
					? `BUILD · ${count}: build-a-boilerplate with ${count} selected`
					: 'BUILD: build-a-boilerplate'}
				onclick={onHubClick}
			>
				<circle r={HUB_RADIUS} />
				<text y="7" text-anchor="middle">{count ? `BUILD · ${count}` : 'BUILD'}</text>
			</a>
		</g>
	</svg>
	<div
		class="hint"
		class:show={focused !== null}
		bind:this={hintEl}
		role="status"
		aria-live="polite"
	>
		{focused?.hint ?? ''}
	</div>
	<p class="lede">Hover a node</p>

	<div class="stacks">
		<div class="hubbtn"><a href={buildTarget}>{count ? `BUILD · ${count}` : 'BUILD'}</a></div>
		{#each featureSections as section (section.id)}
			<div class="stack">
				<h2><a href="/features/{section.id}">{section.word}</a></h2>
				<ul>
					{#each featuresInSection(section.id) as feature (feature.id)}
						<li><a href="/features/{section.id}/{feature.id}">{feature.word}</a></li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<style>
	.map {
		position: relative;
		/* The shell's app bar sits above; the map fills the rest of the screen. */
		height: calc(100svh - var(--site-header-height, 3.5rem));
		min-height: 560px;
		overflow: hidden;
	}
	.sun-slot {
		position: absolute;
		width: 320px;
		height: 320px;
		pointer-events: none;
	}
	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.link {
		stroke: var(--front-line);
		stroke-width: 1.2;
	}
	.link.l1 {
		stroke-width: 2;
		stroke: var(--front-line-1);
	}
	.link.l1.on {
		stroke: var(--front-orange);
	}
	.link.l2.on {
		stroke: var(--front-yellow);
	}
	.n {
		cursor: pointer;
		outline: none;
	}
	.n circle {
		fill: var(--front-bg);
		stroke: var(--front-yellow);
		stroke-width: 1.5;
		opacity: 0.85;
	}
	.n.d1 circle {
		stroke: var(--front-orange);
		stroke-width: 2;
		opacity: 1;
	}
	.n text {
		font-family: var(--front-mono);
		font-size: 13px;
		font-weight: 500;
		fill: var(--front-ink);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		pointer-events: all;
		cursor: pointer;
		paint-order: stroke;
		stroke: var(--front-bg);
		stroke-width: 4px;
		stroke-linejoin: round;
	}
	.n.d1 text {
		font-size: 15px;
		font-weight: 700;
		fill: var(--front-orange-ink);
		letter-spacing: 0.14em;
	}
	.n circle.ring,
	.n:hover circle.ring,
	.n.on circle.ring,
	.n:focus-visible circle.ring {
		fill: none;
		stroke: var(--front-ink);
		stroke-width: 2.5;
		opacity: 1;
		pointer-events: none;
	}
	.n.sel .dot {
		fill: var(--front-yellow);
		opacity: 1;
	}
	.n:hover circle,
	.n.on circle,
	.n:focus-visible circle {
		fill: var(--front-yellow);
		opacity: 1;
	}
	.n.d1:hover circle,
	.n.d1.on circle,
	.n.d1:focus-visible circle {
		fill: var(--front-orange);
	}
	.n:hover text,
	.n.on text,
	.n:focus-visible text {
		fill: var(--front-yellow-ink);
	}
	.n.d1:hover text,
	.n.d1.on text,
	.n.d1:focus-visible text {
		fill: var(--front-orange-ink);
	}
	.n:focus-visible circle {
		stroke: var(--front-ink);
		stroke-width: 3;
	}
	.hub {
		cursor: pointer;
		outline: none;
	}
	.hub circle {
		fill: transparent;
	}
	.hub:focus-visible circle {
		stroke: var(--front-ink);
		stroke-width: 3;
		stroke-dasharray: 4 3;
	}
	.hub text {
		font-family: var(--front-mono);
		font-weight: 700;
		font-size: 20px;
		fill: var(--front-hub-ink);
		letter-spacing: 0.18em;
		pointer-events: none;
	}
	.map.focus .n:not(.on),
	.map.focus .link:not(.on) {
		opacity: 0.22;
	}
	.n,
	.link {
		transition: opacity 0.15s;
	}
	.hint {
		position: absolute;
		z-index: 5;
		background: var(--front-yellow);
		color: var(--front-hint-ink);
		padding: 8px 12px;
		font-family: var(--front-mono);
		font-size: 13px;
		font-weight: 500;
		letter-spacing: 0.04em;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.12s;
		max-width: 300px;
	}
	.hint.show {
		opacity: 1;
	}
	.lede {
		position: absolute;
		left: 0;
		right: 0;
		bottom: max(12px, env(safe-area-inset-bottom, 0px));
		text-align: center;
		color: var(--front-dim-text);
		font-family: var(--front-mono);
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin: 0;
		pointer-events: none;
	}

	.stacks {
		display: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.n,
		.link,
		.hint {
			transition: none;
		}
	}

	@media (max-width: 767px) {
		.map {
			height: auto;
			min-height: 0;
			overflow: visible;
			padding: 16px max(16px, env(safe-area-inset-right, 0px)) 24px
				max(16px, env(safe-area-inset-left, 0px));
		}
		svg,
		.sun-slot,
		.lede,
		.hint {
			display: none;
		}
		.stacks {
			display: grid;
			gap: 10px;
			font-family: var(--front-mono);
		}
		.hubbtn a {
			display: block;
			text-align: center;
			text-decoration: none;
			background: var(--front-red);
			color: var(--front-door-hot-ink);
			font-weight: 700;
			letter-spacing: 0.18em;
			padding: 22px;
			font-size: 20px;
		}
		.stack {
			border: 1px solid var(--front-line);
			padding: 14px 16px;
		}
		.stack h2 {
			font-size: 14px;
			letter-spacing: 0.14em;
			text-transform: uppercase;
			margin: 0 0 10px;
			font-weight: 700;
		}
		.stack h2 a {
			color: var(--front-orange-ink);
			text-decoration: none;
		}
		.stack ul {
			list-style: none;
			margin: 0;
			padding: 0;
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}
		.stack li a {
			display: inline-block;
			color: var(--front-ink);
			text-decoration: none;
			font-size: 13px;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			padding: 8px 12px;
			border: 1px solid var(--front-line);
		}
	}
</style>
