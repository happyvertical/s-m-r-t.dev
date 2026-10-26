<script lang="ts">
	import { onMount } from 'svelte';
	import { currentScheme, watchScheme, type Scheme } from './scheme';
	import { HUB_RADIUS } from './graph-layout';
	import { createSun, SUN_SIZE, sunPalettes } from './sun';

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

		let scheme: Scheme = currentScheme();
		const sun = createSun({
			ctx,
			size,
			radius,
			palette: () => (scheme === 'dark' ? sunPalettes.fire : sunPalettes.blue)
		});

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		let raf = 0;
		const loop = (now: number) => {
			sun.frame(now);
			raf = requestAnimationFrame(loop);
		};
		const run = () => {
			cancelAnimationFrame(raf);
			// Reduced motion: one still frame, redrawn only when the palette changes.
			if (reduced.matches) sun.frame(performance.now());
			else raf = requestAnimationFrame(loop);
		};
		run();

		reduced.addEventListener('change', run);
		const stopWatching = watchScheme((next) => {
			scheme = next;
			if (reduced.matches) sun.frame(performance.now());
		});
		return () => {
			cancelAnimationFrame(raf);
			reduced.removeEventListener('change', run);
			stopWatching();
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
