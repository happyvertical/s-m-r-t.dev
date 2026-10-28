<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, untrack } from 'svelte';
	import { tryGetThemeContext } from '@happyvertical/smrt-ui/themes';
	import { SvelteSet } from 'svelte/reactivity';
	import {
		buildHref,
		isMappable,
		loadSelection,
		markWarp,
		saveSelection,
		splitSelection
	} from '$lib/build-handoff';
	import { featureSections, featuresInSection, getFeature } from '$lib/data/features';
	import { isSetOn, toggleSet } from '$lib/group-selection';
	import type { FeatureSectionId } from '$lib/data/features';
	import FrontControls from './FrontControls.svelte';
	import { fitGraph, HUB_RADIUS, type PlacedNode } from './graph-layout';
	import SkyMap from './SkyMap.svelte';
	import { WARP_RAMP_MS } from './stars';
	import Starfield from './Starfield.svelte';
	import SunCanvas from './SunCanvas.svelte';
	import { SUN_SIZE } from './sun';

	/**
	 * Full-screen map: the BUILD sun, nine groups, forty-one features. Space in
	 * the dark scheme (circles around the sun), a daytime sky with one cumulus
	 * cloud per group in the light scheme (#381); one selection behind both.
	 */
	// The theme provider settles the scheme in an effect after hydration, so the
	// renderer is chosen one frame after mount: nothing flashes the wrong scheme.
	// Without a provider (a bare render) the map is space.
	const theme = tryGetThemeContext();
	let ready = $state(false);
	const sky = $derived(ready && theme !== null && !theme.state.isDark);
	let size = $state({ width: 1400, height: 800 });
	const graph = $derived(fitGraph(size.width, size.height));
	const nodes = $derived(graph.nodes.filter((node) => node.depth > 0));
	const hub = $derived(graph.nodes[0]);

	let map: HTMLElement;
	let hintEl = $state<HTMLElement>();
	let focused = $state<PlacedNode | null>(null);

	// Features picked for build-a-boilerplate (#367). Read after mount so the
	// prerendered page is the empty selection; kept in sessionStorage so a
	// showcase visit and Back return to it.
	const selected = new SvelteSet<string>();
	// Only features the planner has a recipe for count toward BUILD (smrt#4409).
	const count = $derived(splitSelection(selected).mapped.length);
	const buildTarget = $derived(buildHref(selected));
	const isFeature = (node: PlacedNode) => node.depth === 2;
	const featureId = (node: PlacedNode) => node.id.replace(/^feature:/, '');
	const isUnmapped = (node: PlacedNode) => isFeature(node) && !isMappable(featureId(node));
	const notYet = ' · not in the planner yet';
	const niche = ' · niche';
	const isSelected = (node: PlacedNode) => isFeature(node) && selected.has(featureId(node));
	const sectionOf = (node: PlacedNode) =>
		(isFeature(node)
			? getFeature(featureId(node))?.section
			: node.id.replace(/^section:/, '')) as FeatureSectionId;
	const isNiche = (node: PlacedNode) =>
		isFeature(node) && getFeature(featureId(node))?.everyday === false;
	// Sentence added to the hover text and the accessible name of a feature.
	const suffix = (node: PlacedNode) =>
		`${isNiche(node) ? niche : ''}${isUnmapped(node) ? notYet : ''}`;
	// A section circle is lit while its whole everyday set is selected.
	const isSectionOn = (node: PlacedNode) => node.depth === 1 && isSetOn(selected, sectionOf(node));

	function toggleSection(section: FeatureSectionId) {
		const next = toggleSet(selected, section);
		selected.clear();
		for (const id of next) selected.add(id);
		saveSelection(selected);
	}

	function clear() {
		selected.clear();
		saveSelection(selected);
	}
	function onWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && selected.size && !event.defaultPrevented) clear();
	}

	function toggleId(id: string) {
		if (!selected.delete(id)) selected.add(id);
		saveSelection(selected);
	}
	const toggle = (node: PlacedNode) => toggleId(featureId(node));

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
		const frame = requestAnimationFrame(() => (ready = true));
		const measure = () => {
			const { clientWidth, clientHeight } = map;
			if (clientWidth > 0 && clientHeight > 0) size = { width: clientWidth, height: clientHeight };
		};
		measure();
		if (typeof ResizeObserver === 'undefined') {
			window.addEventListener('resize', measure);
			return () => {
				cancelAnimationFrame(frame);
				window.removeEventListener('resize', measure);
			};
		}
		const observer = new ResizeObserver(measure);
		observer.observe(map);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	});

	// Place the hover sentence beside the node, inside the map.
	$effect(() => {
		if (!focused || !hintEl) return;
		const { x, y, r } = focused;
		const left = x < graph.cx ? x - hintEl.offsetWidth - (r + 14) : x + r + 14;
		hintEl.style.left = `${Math.max(8, Math.min(size.width - hintEl.offsetWidth - 8, left))}px`;
		hintEl.style.top = `${y + 14}px`;
	});

	// Circle and label keep their own handlers: a feature's circle selects it, a
	// section's circle toggles its everyday set, and every label opens the page.
	function onCircleClick(event: MouseEvent, node: PlacedNode) {
		event.preventDefault();
		if (isFeature(node)) toggle(node);
		else toggleSection(sectionOf(node));
	}
	// Space selects; Enter is the link's own click and opens.
	function onNodeKeydown(event: KeyboardEvent, node: PlacedNode) {
		if (event.key !== ' ') return;
		event.preventDefault();
		if (isFeature(node)) toggle(node);
		else toggleSection(sectionOf(node));
	}
	function onLabelClick(event: MouseEvent, node: PlacedNode) {
		event.preventDefault();
		void goto(node.href);
	}
	// BUILD with the desktop map showing: the stars streak outward (speed ramps
	// over WARP_RAMP_MS) while the graph and the sun fade, then the planner
	// opens. Phones and reduced motion navigate directly.
	let warp = $state<number | null>(null);
	// The light scheme's flight (#381): the map fades, the clouds rush past and
	// a white-out takes the screen; the planner grows in from it. 0 at rest.
	let flight = $state(0);
	const FLIGHT_MS = 1500;
	// One animation at a time: its frame handle is kept so it can be stopped when
	// the map is destroyed or the scheme swaps under it; a stopped run never
	// navigates.
	let raf = 0;
	function stopRun() {
		cancelAnimationFrame(raf);
		raf = 0;
		flight = 0;
		warp = null;
	}
	function run(duration: number, set: (_progress: number) => void, target: string) {
		const start = performance.now();
		const step = (now: number) => {
			const progress = Math.min(1, (now - start) / duration);
			set(progress);
			if (progress < 1) {
				raf = requestAnimationFrame(step);
				return;
			}
			raf = 0;
			markWarp();
			goto(target).catch(stopRun);
		};
		raf = requestAnimationFrame(step);
	}
	onMount(() => stopRun);
	// Swapping renderers mid-run ends the run: the other one has nothing to draw.
	$effect(() => {
		void sky;
		untrack(stopRun);
	});
	function onHubClick(event: MouseEvent) {
		event.preventDefault();
		if (warp !== null || flight > 0) return;
		const target = buildTarget;
		const animate =
			window.matchMedia('(min-width: 768px)').matches &&
			!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!animate) {
			void goto(target);
			return;
		}
		if (sky) {
			flight = 0.0001;
			run(FLIGHT_MS, (progress) => (flight = Math.max(0.0001, progress)), target);
			return;
		}
		warp = 0;
		run(WARP_RAMP_MS, (progress) => (warp = progress), target);
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

<section
	class="map"
	class:focus={lit !== null}
	class:warping={warp !== null}
	class:sky
	class:pending={!ready}
	id="map"
	aria-label="Features"
	bind:this={map}
>
	<FrontControls
		{count}
		{buildTarget}
		{sky}
		busy={flight > 0 || warp !== null}
		onbuild={onHubClick}
	/>
	{#if sky}
		<SkyMap
			{size}
			{selected}
			{count}
			{buildTarget}
			{flight}
			ontogglefeature={toggleId}
			ontogglegroup={toggleSection}
			onbuild={onHubClick}
			onclear={clear}
		/>
	{:else}
		<Starfield {warp} />
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
							class:unmapped={isUnmapped(node)}
							class:niche={isNiche(node)}
							class:set={isSectionOn(node)}
							href={node.href}
							aria-label="{node.word}{node.depth === 1 ? ' group' : ''}{isSelected(node) ||
							isSectionOn(node)
								? ', selected'
								: ''}: {node.hint}{suffix(node)}"
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
					<text y="7" text-anchor="middle">BUILD</text>
					{#if count}
						<g class="badge" transform="translate({HUB_RADIUS * 0.74},{HUB_RADIUS * 0.74})">
							<circle r="13" />
							<text y="4.5" text-anchor="middle">{count}</text>
						</g>
					{/if}
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
			{focused
				? `${focused.hint}${isNiche(focused) ? niche : ''}${isUnmapped(focused) ? notYet : ''}`
				: ''}
		</div>
		<p class="lede">
			Click a group for its everyday set · click a feature to add or drop it
			{#if selected.size}
				<button type="button" class="clear" onclick={clear}>Clear</button>
			{/if}
		</p>
	{/if}

	<div class="stacks">
		<div class="hubbtn">
			<a href={buildTarget}
				>BUILD{#if count}<span class="badge" aria-hidden="true">{count}</span><span class="sr"
						>, {count} selected</span
					>{/if}</a
			>
			{#if selected.size}
				<button type="button" class="clear" onclick={clear}>Clear selection</button>
			{/if}
		</div>
		{#each featureSections as section (section.id)}
			<div class="stack">
				<h2><a href="/features/{section.id}">{section.word}</a></h2>
				<label class="set">
					<input
						type="checkbox"
						checked={isSetOn(selected, section.id)}
						aria-label="Everyday set for {section.word}"
						onchange={() => toggleSection(section.id)}
					/>
					Everyday set
				</label>
				<ul>
					{#each featuresInSection(section.id) as feature (feature.id)}
						<li class:sel={selected.has(feature.id)} class:unmapped={!isMappable(feature.id)}>
							<input
								type="checkbox"
								checked={selected.has(feature.id)}
								aria-label="Select {feature.word} for BUILD{isMappable(feature.id)
									? ''
									: ', not in the planner yet'}"
								onchange={() => toggleId(feature.id)}
							/>
							<a href="/features/{section.id}/{feature.id}">{feature.word}</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<style>
	.map {
		position: relative;
		/* No site header on the front page (#381): the map is the whole screen. */
		height: 100svh;
		min-height: 560px;
		overflow: hidden;
	}
	/* Until the theme has settled the renderer is not chosen; show nothing rather
	   than the wrong scheme. Without script the prerendered space map shows. */
	.map.pending {
		opacity: 0;
	}
	@media (scripting: none) {
		.map.pending {
			opacity: 1;
		}
	}
	/* BUILD pressed: the graph and the sun fade while the stars streak. */
	.map.warping svg,
	.map.warping .sun-slot,
	.map.warping .lede,
	.map.warping .hint {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.9s ease-in;
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
	/* A selected niche feature: a dashed ring around the filled dot. */
	.n.sel.niche:not(.unmapped) circle.ring {
		stroke-dasharray: 4 3;
	}
	/* A section whose whole everyday set is selected is lit. */
	.n.d1.set .dot {
		fill: var(--front-orange);
		opacity: 1;
	}
	.n.d1.set text {
		fill: var(--front-orange-ink);
	}
	.n.sel .dot {
		fill: var(--front-yellow);
		opacity: 1;
	}
	/* Selected but not in the planner yet: a hollow ring, nothing filled. */
	.n.sel.unmapped .dot {
		fill: var(--front-bg);
		stroke-dasharray: 3 3;
	}
	.n.sel.unmapped:hover .dot,
	.n.sel.unmapped.on .dot,
	.n.sel.unmapped:focus-visible .dot {
		fill: var(--front-yellow);
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
	.hub .badge circle {
		fill: var(--front-ink);
		stroke: var(--front-bg);
		stroke-width: 2;
	}
	.hub .badge text {
		font-size: 13px;
		letter-spacing: 0;
		fill: var(--front-bg);
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
	.clear {
		pointer-events: auto;
		margin-left: 1rem;
		padding: 4px 10px;
		background: none;
		border: 1px solid var(--front-line);
		color: var(--front-ink);
		font: inherit;
		letter-spacing: inherit;
		text-transform: inherit;
		cursor: pointer;
	}
	.clear:hover,
	.clear:focus-visible {
		background: var(--front-yellow);
		color: var(--front-hint-ink);
		outline: none;
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
			/* The top controls sit in the first 56px. */
			padding: 64px max(16px, env(safe-area-inset-right, 0px)) 24px
				max(16px, env(safe-area-inset-left, 0px));
		}
		.map > :global(.sky) {
			display: none;
		}
		svg,
		.sun-slot,
		.map :global(.stars),
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
		.hubbtn .sr {
			position: absolute;
			width: 1px;
			height: 1px;
			overflow: hidden;
			clip-path: inset(50%);
			white-space: nowrap;
		}
		.hubbtn .clear {
			display: block;
			margin: 8px 0 0 auto;
			padding: 10px 14px;
			min-height: 44px;
			font-size: 13px;
			letter-spacing: 0.06em;
			text-transform: uppercase;
		}
		.hubbtn .badge {
			display: inline-block;
			min-width: 1.6em;
			margin-left: 0.8em;
			padding: 2px 6px;
			border-radius: 999px;
			background: var(--front-ink);
			color: var(--front-bg);
			font-size: 14px;
			letter-spacing: 0;
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
		.stack .set {
			display: flex;
			align-items: center;
			gap: 8px;
			min-height: 44px;
			margin: -4px 0 6px;
			font-size: 13px;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--front-ink);
		}
		.stack .set input {
			width: 20px;
			height: 20px;
			margin: 0;
			accent-color: var(--front-orange);
		}
		.stack ul {
			list-style: none;
			margin: 0;
			padding: 0;
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
		}
		.stack li {
			display: flex;
			align-items: center;
			border: 1px solid var(--front-line);
		}
		.stack li.sel {
			border-color: var(--front-yellow);
			background: color-mix(in srgb, var(--front-yellow) 18%, transparent);
		}
		.stack li.sel.unmapped {
			border-style: dashed;
			background: none;
		}
		.stack li input {
			width: 20px;
			height: 20px;
			margin: 0 0 0 12px;
			accent-color: var(--front-orange);
		}
		.stack li a {
			display: inline-block;
			color: var(--front-ink);
			text-decoration: none;
			font-size: 13px;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			padding: 12px 12px 12px 8px;
		}
	}
</style>
