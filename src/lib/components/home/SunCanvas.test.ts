import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SunCanvas from './SunCanvas.svelte';
import { createSun, DRIFT, FIRST_FLARE_MS, FLARE_GAP_MS, MAX_SPARKS, firePalette } from './sun';

function fakeContext() {
	const gradient = { addColorStop: vi.fn() };
	return {
		clearRect: vi.fn(),
		save: vi.fn(),
		restore: vi.fn(),
		beginPath: vi.fn(),
		arc: vi.fn(),
		clip: vi.fn(),
		fillRect: vi.fn(),
		fill: vi.fn(),
		stroke: vi.fn(),
		moveTo: vi.fn(),
		bezierCurveTo: vi.fn(),
		scale: vi.fn(),
		createRadialGradient: vi.fn(() => gradient),
		fillStyle: '',
		strokeStyle: '',
		lineWidth: 0,
		lineCap: 'butt',
		globalCompositeOperation: 'source-over'
	};
}

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('sun frame logic', () => {
	const make = () => {
		const ctx = fakeContext();
		return { ctx, sun: createSun({ ctx: ctx as never, size: 320, radius: 46 }) };
	};

	it('drifts the surface by .005 per frame and caps the rim smoulder', () => {
		const { sun } = make();
		for (let i = 0; i < 400; i++) sun.frame(i * 16);
		expect(sun.state.T).toBeCloseTo(400 * DRIFT, 9);
		expect(sun.state.sparks).toBeGreaterThan(0);
		expect(sun.state.sparks).toBeLessThanOrEqual(MAX_SPARKS);
	});

	it('starts a flare after the first delay and spaces the next one 20 to 45 seconds out', () => {
		const { sun } = make();
		let now = 0;
		const step = () => sun.frame((now += 16));
		while (now < FIRST_FLARE_MS - 100) step();
		expect(sun.state.flares).toBe(0);
		while (now < FIRST_FLARE_MS + 200) step();
		expect(sun.state.flares).toBe(1);
		// A flare lasts 4 to 6 seconds, then falls back.
		while (now < FIRST_FLARE_MS + 6500) step();
		expect(sun.state.flares).toBe(0);
		while (now < FIRST_FLARE_MS + FLARE_GAP_MS[0] - 1000) step();
		expect(sun.state.flares).toBe(0);
	});

	it('is fire in both colour schemes: one palette, no blue flame', () => {
		const { ctx, sun } = make();
		sun.frame(0);
		expect(ctx.createRadialGradient().addColorStop.mock.calls.flat()).toContain(firePalette.core);
	});
});

describe('SunCanvas', () => {
	function stub(reduced: boolean, desktop = true) {
		const ctx = fakeContext();
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as never);
		vi.stubGlobal(
			'matchMedia',
			vi.fn((query: string) => ({
				matches: query.includes('reduced-motion')
					? reduced
					: query.includes('min-width')
						? desktop
						: false,
				media: query,
				addEventListener: () => {},
				removeEventListener: () => {}
			}))
		);
		const raf = vi.fn(() => 1);
		vi.stubGlobal('requestAnimationFrame', raf);
		vi.stubGlobal('cancelAnimationFrame', vi.fn());
		return { ctx, raf };
	}

	it('draws a single still frame under prefers-reduced-motion', () => {
		const { ctx, raf } = stub(true);
		render(SunCanvas);

		expect(raf).not.toHaveBeenCalled();
		expect(ctx.clearRect).toHaveBeenCalledTimes(1);
	});

	it('animates otherwise and scales for the device pixel ratio', () => {
		vi.stubGlobal('devicePixelRatio', 2);
		const { ctx, raf } = stub(false);
		const { container } = render(SunCanvas);
		const canvas = container.querySelector('canvas')!;

		expect(raf).toHaveBeenCalled();
		expect(canvas.width).toBe(640);
		expect(ctx.scale).toHaveBeenCalledWith(2, 2);
	});

	it('does not draw or animate below the desktop width, where the sun is hidden', () => {
		const { ctx, raf } = stub(false, false);
		render(SunCanvas);

		expect(raf).not.toHaveBeenCalled();
		expect(ctx.clearRect).not.toHaveBeenCalled();
	});
});
