<script lang="ts">
	import { onMount } from 'svelte';
	import { createStars, drawStars, speedFor } from './stars';

	/** Warp progress, 0 to 1, while BUILD is carrying the visitor away; null otherwise. */
	let { warp = null }: { warp?: number | null } = $props();

	let canvas: HTMLCanvasElement;

	// Fills the map it sits in, behind the graph and the sun. Decorative only.
	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const stars = createStars();
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		// FeatureGraph hides the map below this width; draw nothing while hidden.
		const desktop = window.matchMedia('(min-width: 768px)');
		let raf = 0;
		let last: number | undefined;

		const draw = (dt: number) =>
			drawStars({
				ctx,
				stars,
				width: canvas.width,
				height: canvas.height,
				dpr,
				speed: speedFor(warp),
				dt,
				streak: warp !== null
			});
		const loop = (now: number) => {
			const dt = last === undefined ? 0 : Math.min(0.1, Math.max(0, (now - last) / 1000));
			last = now;
			draw(dt);
			raf = requestAnimationFrame(loop);
		};
		const run = () => {
			cancelAnimationFrame(raf);
			raf = 0;
			last = undefined;
			if (!desktop.matches || document.hidden) return;
			// Reduced motion: one still frame, redrawn only when the size changes.
			if (reduced.matches) draw(0);
			else raf = requestAnimationFrame(loop);
		};
		const fit = () => {
			const { clientWidth, clientHeight } = canvas;
			if (clientWidth === 0 || clientHeight === 0) return;
			canvas.width = Math.round(clientWidth * dpr);
			canvas.height = Math.round(clientHeight * dpr);
			if (reduced.matches && desktop.matches) draw(0);
		};
		fit();
		run();

		const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(fit);
		observer?.observe(canvas);
		if (!observer) window.addEventListener('resize', fit);
		reduced.addEventListener('change', run);
		desktop.addEventListener('change', run);
		document.addEventListener('visibilitychange', run);
		return () => {
			cancelAnimationFrame(raf);
			observer?.disconnect();
			window.removeEventListener('resize', fit);
			reduced.removeEventListener('change', run);
			desktop.removeEventListener('change', run);
			document.removeEventListener('visibilitychange', run);
		};
	});
</script>

<canvas bind:this={canvas} class="stars" aria-hidden="true"></canvas>

<style>
	.stars {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
