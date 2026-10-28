<script lang="ts">
	import { onMount } from 'svelte';
	import { getFeature, type FeatureSectionId } from '$lib/data/features';
	import { isMappable } from '$lib/build-handoff';
	import { isSetOn } from '$lib/group-selection';
	import { HUB_RADIUS, RIM_RADIUS } from './graph-layout';
	import { CHIP_H, fitSky, TITLE_H, type PlacedCloud } from './sky';
	import { drawClouds, drawSky, makeDeck, makePuffs, type CloudDraw } from './sky-clouds';
	import SunCanvas from './SunCanvas.svelte';
	import { SUN_SIZE } from './sun';

	/**
	 * The light scheme's map (#381): a daytime sky, one cumulus cloud per group
	 * with its features as pill chips inside it, the BUILD sun in the middle.
	 * The selection lives in FeatureGraph; this only draws it and reports clicks.
	 */
	let {
		size,
		selected,
		count,
		buildTarget,
		flight,
		ontogglefeature,
		ontogglegroup,
		onbuild,
		onclear
	}: {
		size: { width: number; height: number };
		selected: { has(_id: string): boolean; size: number };
		count: number;
		buildTarget: string;
		/** 0 at rest, then 0 to 1 over the BUILD flight. */
		flight: number;
		ontogglefeature: (_id: string) => void;
		ontogglegroup: (_section: FeatureSectionId) => void;
		onbuild: (_event: MouseEvent) => void;
		onclear: () => void;
	} = $props();

	const placed = $derived(fitSky(size.width, size.height));
	const scale = $derived(placed.scale);
	// Puffs depend on a cloud's size only, which does not change on resize.
	const puffs = fitSky(1400, 800).clouds.map((cloud) => makePuffs(cloud.w, cloud.h));

	let skyCanvas: HTMLCanvasElement;
	let cloudCanvas: HTMLCanvasElement;
	let hintEl: HTMLElement;
	let hint = $state<{ text: string; left: number; top: number } | null>(null);
	let hover = $state(-1);

	const niche = ' · niche';
	const notYet = ' · not in the planner yet';
	const suffixFor = (id: string) =>
		`${getFeature(id)?.everyday === false ? niche : ''}${isMappable(id) ? '' : notYet}`;
	const hintFor = (id: string) => `${getFeature(id)?.hint ?? ''}${suffixFor(id)}`;

	function showHint(cloud: PlacedCloud, chip: PlacedCloud['chips'][number]) {
		hover = cloud.index;
		const text = hintFor(chip.id);
		hint = { text, left: 0, top: 0 };
		// Measured after the text lands, then placed under the chip inside the map.
		queueMicrotask(() => {
			if (!hintEl || !hint) return;
			const left = cloud.x + chip.dx * scale - hintEl.offsetWidth / 2;
			hint = {
				text,
				left: Math.max(8, Math.min(size.width - hintEl.offsetWidth - 8, left)),
				top: cloud.y + (chip.dy + CHIP_H / 2) * scale + 8
			};
		});
	}
	function hideHint() {
		hover = -1;
		hint = null;
	}
	// A mouse click must not leave the browser's default focus ring (amber in
	// WebKit) on the pill or chip; keyboard focus keeps the explicit ring below.
	const blurAfterClick = (event: MouseEvent) => (event.currentTarget as SVGElement).blur();
	const onKey = (event: KeyboardEvent, action: () => void) => {
		if (event.key !== ' ' && event.key !== 'Enter') return;
		event.preventDefault();
		action();
	};

	// ---- canvases
	const deck = makeDeck();
	let mouseX = 0;
	let mouseY = 0;
	let flightNow = 0;
	$effect(() => {
		flightNow = flight;
	});

	// Set by onMount: draws one frame when the loop is not running (reduced motion).
	let redrawStill: (() => void) | undefined;

	onMount(() => {
		const skyCtx = skyCanvas.getContext('2d');
		const cloudCtx = cloudCanvas.getContext('2d');
		if (!skyCtx || !cloudCtx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		const desktop = window.matchMedia('(min-width: 768px)');
		let width = 0;
		let height = 0;
		let t = 0;
		let last = 0;
		let raf = 0;

		function resize() {
			width = Math.round(size.width * dpr);
			height = Math.round(size.height * dpr);
			skyCanvas.width = cloudCanvas.width = width;
			skyCanvas.height = cloudCanvas.height = height;
		}
		function draw(now: number) {
			const step = last ? Math.min(3, (now - last) / 16.667) : 1;
			last = now;
			t += 0.006 * step;
			if (width !== Math.round(size.width * dpr) || height !== Math.round(size.height * dpr))
				resize();
			drawSky(skyCtx!, width, height, deck, flightNow, step);
			const clouds: CloudDraw[] = placed.clouds.map((cloud) => ({
				x: cloud.x * dpr,
				y: cloud.y * dpr,
				w: cloud.w,
				h: cloud.h,
				puffs: puffs[cloud.index],
				lit: hover === cloud.index
			}));
			drawClouds(cloudCtx!, width, height, clouds, scale * dpr, t, mouseX, mouseY);
		}
		const loop = (now: number) => {
			draw(now);
			raf = requestAnimationFrame(loop);
		};
		const run = () => {
			cancelAnimationFrame(raf);
			raf = 0;
			resize();
			// Nothing to draw while the map is hidden (phones) or the tab is.
			if (!desktop.matches || document.hidden) return;
			if (reduced.matches) draw(performance.now());
			else raf = requestAnimationFrame(loop);
		};
		redrawStill = () => {
			// Under reduced motion no loop runs, so a resize must repaint by hand.
			if (reduced.matches && desktop.matches && !document.hidden) draw(performance.now());
		};
		const onMove = (event: MouseEvent) => {
			mouseX = event.clientX / window.innerWidth - 0.5;
			mouseY = event.clientY / window.innerHeight - 0.5;
		};
		run();
		window.addEventListener('mousemove', onMove);
		reduced.addEventListener('change', run);
		desktop.addEventListener('change', run);
		document.addEventListener('visibilitychange', run);
		return () => {
			redrawStill = undefined;
			cancelAnimationFrame(raf);
			window.removeEventListener('mousemove', onMove);
			reduced.removeEventListener('change', run);
			desktop.removeEventListener('change', run);
			document.removeEventListener('visibilitychange', run);
		};
	});

	$effect(() => {
		void size.width;
		void size.height;
		void scale;
		redrawStill?.();
	});
	// A still frame when the map resizes under reduced motion is drawn by `run`
	// on the media change only; a resize re-measures on the next frame otherwise.
	const flying = $derived(flight > 0);
	const mapOpacity = $derived(flying ? Math.max(0, 1 - flight * 1.5) : 1);
	const sunOpacity = $derived(flying ? Math.max(0, 1 - flight * 1.8) : 1);
	const whiteOpacity = $derived(
		flying ? Math.pow(Math.min(1, Math.max(0, (flight - 0.15) / 0.85)), 1.5) : 0
	);
	const sunLeft = $derived(placed.cx - SUN_SIZE / 2);
	const sunTop = $derived(placed.cy - SUN_SIZE / 2);

	function edge(cloud: PlacedCloud): [number, number] {
		const dx = cloud.x - placed.cx;
		const dy = cloud.y - placed.cy;
		const k = RIM_RADIUS / Math.hypot(dx, dy);
		return [placed.cx + dx * k, placed.cy + dy * k];
	}
</script>

<div class="sky" class:flying>
	<canvas bind:this={skyCanvas} class="layer" aria-hidden="true"></canvas>
	<svg
		class="layer links"
		viewBox="0 0 {size.width} {size.height}"
		aria-hidden="true"
		style:opacity={mapOpacity}
	>
		{#each placed.clouds as cloud (cloud.section)}
			{@const [x1, y1] = edge(cloud)}
			<line class="link" class:on={hover === cloud.index} {x1} {y1} x2={cloud.x} y2={cloud.y} />
		{/each}
	</svg>
	<canvas
		bind:this={cloudCanvas}
		class="layer clouds"
		aria-hidden="true"
		style:opacity={mapOpacity}
		style:transform={flying ? `scale(${1 + flight * 1.4})` : undefined}
	></canvas>
	<div class="sun-slot" style:left="{sunLeft}px" style:top="{sunTop}px" style:opacity={sunOpacity}>
		<SunCanvas day />
	</div>
	<svg
		class="layer chips"
		viewBox="0 0 {size.width} {size.height}"
		aria-label="Features around BUILD"
		role="group"
		style:opacity={mapOpacity}
		style:pointer-events={flying ? 'none' : undefined}
	>
		{#each placed.clouds as cloud (cloud.section)}
			{@const on = isSetOn(selected, cloud.section)}
			<g transform="translate({cloud.x},{cloud.y}) scale({scale})">
				<g class="cloud" style:animation-delay="{cloud.index * 60}ms">
					<g
						class="title"
						class:all={on}
						transform="translate(0,{-cloud.h / 2 - 2})"
						tabindex="0"
						role="button"
						aria-pressed={on}
						aria-label="{cloud.word}: toggle its everyday set. {cloud.hint}"
						onclick={(event) => {
							blurAfterClick(event);
							ontogglegroup(cloud.section);
						}}
						onkeydown={(event) => onKey(event, () => ontogglegroup(cloud.section))}
						onmouseenter={() => (hover = cloud.index)}
						onmouseleave={() => (hover = -1)}
						onfocus={() => (hover = cloud.index)}
						onblur={() => (hover = -1)}
					>
						<rect
							x={-cloud.titleW / 2}
							y={-TITLE_H / 2}
							width={cloud.titleW}
							height={TITLE_H}
							rx="14"
						/>
						<text y="5">{cloud.word}</text>
					</g>
					{#each cloud.chips as chip (chip.id)}
						{@const sel = selected.has(chip.id)}
						<g
							class="chip"
							class:niche={!chip.everyday}
							class:sel
							class:unmapped={!isMappable(chip.id)}
							transform="translate({chip.dx},{chip.dy})"
							tabindex="0"
							role="checkbox"
							aria-checked={sel}
							aria-label="{chip.word}: {hintFor(chip.id)}"
							onclick={(event) => {
								blurAfterClick(event);
								ontogglefeature(chip.id);
							}}
							onkeydown={(event) => onKey(event, () => ontogglefeature(chip.id))}
							onmouseenter={() => showHint(cloud, chip)}
							onfocus={() => showHint(cloud, chip)}
							onmouseleave={hideHint}
							onblur={hideHint}
						>
							<rect x={-chip.w / 2} y={-CHIP_H / 2} width={chip.w} height={CHIP_H} rx="11" />
							<text y="4">{chip.word}</text>
						</g>
					{/each}
				</g>
			</g>
		{/each}
		<g transform="translate({placed.cx},{placed.cy})">
			<a
				class="hub"
				href={buildTarget}
				aria-label={count
					? `BUILD · ${count}: build-a-boilerplate with ${count} selected`
					: 'BUILD: build-a-boilerplate'}
				onclick={onbuild}
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
		class:show={hint !== null}
		bind:this={hintEl}
		role="status"
		aria-live="polite"
		style:left="{hint?.left ?? 0}px"
		style:top="{hint?.top ?? 0}px"
		style:opacity={flying ? 0 : undefined}
	>
		{hint?.text ?? ''}
	</div>
	<p class="lede" style:opacity={mapOpacity}>
		Click a group for its everyday set · click a feature to add or drop it
		{#if selected.size}
			<button type="button" class="clear" onclick={onclear}>Clear</button>
		{/if}
	</p>
	<div class="white" style:opacity={whiteOpacity} aria-hidden="true"></div>
</div>

<style>
	/* The daytime tokens: sky blues, and the sun the only orange. Separate from
	   the fire palette the dark map uses; nothing here reads --front-*. */
	.sky {
		--sk-ink: #1d3557;
		--sk-dim: #4d6785;
		--sk-pill: #3aa0e8;
		--sk-pill-hover: #2384cc;
		--sk-pill-on: #2384cc;
		--sk-accent: #3aa0e8;
		position: absolute;
		inset: 0;
		font-family: var(--front-mono, ui-monospace, Menlo, monospace);
		color: var(--sk-ink);
	}
	.layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	canvas.layer {
		pointer-events: none;
	}
	.links {
		pointer-events: none;
	}
	.clouds {
		transform-origin: 50% 50%;
	}
	.sun-slot {
		position: absolute;
		width: 320px;
		height: 320px;
		pointer-events: none;
	}
	.link {
		stroke: rgba(255, 255, 255, 0.85);
		stroke-width: 2.5;
		transition: stroke 0.15s;
	}
	.link.on {
		stroke: var(--sk-accent);
	}

	.cloud {
		animation: rise 0.7s ease-out backwards;
	}
	@keyframes rise {
		from {
			opacity: 0;
		}
	}

	.title {
		cursor: pointer;
		outline: none;
	}
	/* Simple buttons: one border and one text colour, the same active or not.
	   Selection shows only as fill opacity and a touch of brightness. */
	.title rect {
		fill: rgba(255, 255, 255, 0.3);
		stroke: var(--sk-pill);
		stroke-width: 1.5;
		transition: fill 0.15s;
	}
	.title:hover rect,
	.title:focus-visible rect {
		fill: rgba(255, 255, 255, 0.45);
	}
	.title.all rect {
		fill: rgba(255, 255, 255, 0.92);
		filter: brightness(1.06) drop-shadow(0 4px 6px rgba(29, 53, 87, 0.4));
	}
	.title:focus,
	.chip:focus {
		outline: none;
	}
	.title:focus-visible,
	.chip:focus-visible,
	.hub:focus-visible {
		outline: 2px solid var(--sk-pill-on);
		outline-offset: 3px;
	}
	.title text {
		font-weight: 700;
		font-size: 14px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		fill: var(--sk-pill);
		text-anchor: middle;
		pointer-events: none;
	}

	.chip {
		cursor: pointer;
		outline: none;
	}
	.chip rect {
		fill: rgba(255, 255, 255, 0.4);
		stroke: rgba(29, 53, 87, 0.35);
		transition: fill 0.15s;
	}
	.chip text {
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--sk-ink);
		text-anchor: middle;
		pointer-events: none;
	}
	.chip.niche text {
		fill: var(--sk-dim);
	}
	.chip:hover rect,
	.chip:focus-visible rect {
		fill: rgba(255, 255, 255, 0.55);
	}
	.chip.sel rect {
		fill: rgba(255, 255, 255, 0.95);
		filter: brightness(1.06) drop-shadow(0 3px 5px rgba(29, 53, 87, 0.4));
	}

	.hub {
		cursor: pointer;
		outline: none;
	}
	.hub circle {
		fill: transparent;
	}
	.hub:focus-visible circle {
		stroke: var(--sk-ink);
		stroke-width: 3;
		stroke-dasharray: 4 3;
	}
	.hub text {
		font-weight: 700;
		font-size: 20px;
		fill: #3a0d00;
		letter-spacing: 0.18em;
		pointer-events: none;
	}
	.hub .badge circle {
		fill: var(--sk-ink);
		stroke: #fff;
		stroke-width: 2;
	}
	.hub .badge text {
		font-size: 13px;
		letter-spacing: 0;
		fill: #fff;
	}

	.hint {
		position: absolute;
		z-index: 5;
		background: var(--sk-ink);
		color: #fff;
		padding: 8px 12px;
		border-radius: 8px;
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
		color: var(--sk-dim);
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
		background: rgba(255, 255, 255, 0.6);
		border: 1px solid var(--sk-pill);
		border-radius: 999px;
		color: var(--sk-pill-on);
		font: inherit;
		font-weight: 700;
		letter-spacing: inherit;
		text-transform: inherit;
		cursor: pointer;
	}
	.clear:hover,
	.clear:focus-visible {
		background: var(--sk-pill);
		color: #fff;
		outline: none;
	}
	.white {
		position: absolute;
		inset: 0;
		background: #fff;
		pointer-events: none;
		z-index: 6;
	}

	@media (prefers-reduced-motion: reduce) {
		.cloud {
			animation: none;
		}
		.link,
		.hint {
			transition: none;
		}
	}
</style>
