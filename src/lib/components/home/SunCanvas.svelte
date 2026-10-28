<script lang="ts">
	import { onMount } from 'svelte';
	import { HUB_RADIUS } from './graph-layout';
	import { createSun, dayPalette, firePalette, SUN_SIZE } from './sun';

	/** `day` is the light scheme's sun: gold palette and a soft haze, no rays. */
	let { day = false }: { day?: boolean } = $props();

	// Positioned by its parent: the canvas fills a wrapper centred on the hub, so
	// it follows the hub on resize.
	const size = SUN_SIZE;
	const radius = HUB_RADIUS;

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = size * dpr;
		canvas.height = size * dpr;
		ctx.scale(dpr, dpr);

		const sun = createSun(
			day
				? { ctx, size, radius, palette: dayPalette, haze: true }
				: { ctx, size, radius, palette: firePalette }
		);

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		// FeatureGraph hides the sun below this width; draw nothing while hidden.
		const desktop = window.matchMedia('(min-width: 768px)');
		let raf = 0;
		const loop = (now: number) => {
			sun.frame(now);
			raf = requestAnimationFrame(loop);
		};
		const run = () => {
			cancelAnimationFrame(raf);
			raf = 0;
			if (!desktop.matches || document.hidden) return;
			// Reduced motion: one still frame, drawn once.
			if (reduced.matches) sun.frame(performance.now());
			else raf = requestAnimationFrame(loop);
		};
		run();

		reduced.addEventListener('change', run);
		desktop.addEventListener('change', run);
		document.addEventListener('visibilitychange', run);
		return () => {
			cancelAnimationFrame(raf);
			reduced.removeEventListener('change', run);
			desktop.removeEventListener('change', run);
			document.removeEventListener('visibilitychange', run);
		};
	});
</script>

<canvas bind:this={canvas} class="sun" aria-hidden="true"></canvas>

<style>
	.sun {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
