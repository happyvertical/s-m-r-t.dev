import { cleanup, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Starfield from './Starfield.svelte';
import { createStars, drawStars, REST_SPEED, speedFor, STAR_COUNT, WARP_SPEED } from './stars';

function fakeContext() {
	return {
		clearRect: vi.fn(),
		beginPath: vi.fn(),
		arc: vi.fn(),
		fill: vi.fn(),
		moveTo: vi.fn(),
		lineTo: vi.fn(),
		stroke: vi.fn(),
		fillStyle: '',
		strokeStyle: '',
		lineWidth: 0
	};
}

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('star motion', () => {
	it('creates about four hundred stars at random depths', () => {
		const stars = createStars();
		expect(stars).toHaveLength(STAR_COUNT);
		expect(STAR_COUNT).toBeGreaterThanOrEqual(380);
		expect(new Set(stars.map((star) => star.z)).size).toBeGreaterThan(300);
	});

	it('drifts slowly at rest and fast at the end of the warp ramp', () => {
		expect(speedFor(null)).toBe(REST_SPEED);
		expect(speedFor(0)).toBeLessThan(speedFor(0.5));
		expect(speedFor(1)).toBeCloseTo(WARP_SPEED, 9);
		expect(speedFor(5)).toBeCloseTo(WARP_SPEED, 9);
		expect(WARP_SPEED).toBeGreaterThan(REST_SPEED * 50);
	});

	it('moves stars toward the viewer and recycles one that arrives', () => {
		const stars = [
			{ x: 0.3, y: 0.2, z: 0.5 },
			{ x: 0.3, y: 0.2, z: 0.03 }
		];
		drawStars({
			ctx: fakeContext() as never,
			stars,
			width: 800,
			height: 600,
			dpr: 1,
			speed: 0.1,
			dt: 1,
			streak: false,
			random: () => 0.75
		});
		expect(stars[0].z).toBeCloseTo(0.4, 9);
		expect(stars[1]).toEqual({ x: 0.5, y: 0.5, z: 1 });
	});

	it('draws dots at rest, streaks in warp, and nothing moves with dt 0', () => {
		const stars = [{ x: 0.1, y: 0.05, z: 0.3 }];
		const dots = fakeContext();
		drawStars({
			ctx: dots as never,
			stars,
			width: 800,
			height: 600,
			dpr: 1,
			speed: 1,
			dt: 0,
			streak: false
		});
		expect(dots.arc).toHaveBeenCalledTimes(1);
		expect(dots.lineTo).not.toHaveBeenCalled();
		expect(stars[0].z).toBe(0.3);
		const lines = fakeContext();
		drawStars({
			ctx: lines as never,
			stars,
			width: 800,
			height: 600,
			dpr: 1,
			speed: 1,
			dt: 0,
			streak: true
		});
		expect(lines.lineTo).toHaveBeenCalledTimes(1);
		expect(lines.arc).not.toHaveBeenCalled();
	});
});

describe('Starfield', () => {
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

	it('draws one static frame under prefers-reduced-motion', () => {
		const { ctx, raf } = stub(true);
		render(Starfield);
		expect(raf).not.toHaveBeenCalled();
		expect(ctx.clearRect).toHaveBeenCalledTimes(1);
	});

	it('animates on desktop and is hidden from assistive technology', () => {
		const { raf } = stub(false);
		const { container } = render(Starfield);
		expect(raf).toHaveBeenCalled();
		expect(container.querySelector('canvas')?.getAttribute('aria-hidden')).toBe('true');
	});

	it('does nothing at 767px and below', () => {
		const { ctx, raf } = stub(false, false);
		render(Starfield);
		expect(raf).not.toHaveBeenCalled();
		expect(ctx.clearRect).not.toHaveBeenCalled();
	});
});
