/**
 * The starfield behind the map (#373): stars drift toward the viewer with
 * depth. `z` runs from 1 (far, at the vanishing point) to 0 (at the viewer);
 * a star that reaches the viewer is replaced by a new one far away. Ported
 * from the approved mock (`index-galaxy.html`). Pure functions so the motion is
 * testable without a canvas loop; `Starfield.svelte` owns the loop.
 */

export const STAR_COUNT = 400;
/** Depth travelled per second at rest: slow. */
export const REST_SPEED = 0.054;
/** Depth travelled per second at the end of the warp ramp. */
export const WARP_SPEED = (0.004 + 0.09) * 60;
/** The warp speed ramps over this long, in milliseconds. */
export const WARP_RAMP_MS = 1200;
/** A star this close to the viewer is recycled. */
const NEAR = 0.02;

export interface Star {
	x: number;
	y: number;
	z: number;
}

type Ctx = Pick<
	CanvasRenderingContext2D,
	'clearRect' | 'beginPath' | 'arc' | 'fill' | 'moveTo' | 'lineTo' | 'stroke'
> & { fillStyle: unknown; strokeStyle: unknown; lineWidth: number };

export function createStars(count = STAR_COUNT, random: () => number = Math.random): Star[] {
	return Array.from({ length: count }, () => ({
		x: (random() - 0.5) * 2,
		y: (random() - 0.5) * 2,
		z: random()
	}));
}

/** Speed, in depth per second, for a warp progress of 0 (rest) to 1 (full). */
export function speedFor(progress: number | null): number {
	if (progress === null) return REST_SPEED;
	const p = Math.min(1, Math.max(0, progress));
	return (0.004 + p * 0.09) * 60;
}

export interface StarFrame {
	ctx: Ctx;
	stars: Star[];
	/** Canvas size in device pixels. */
	width: number;
	height: number;
	dpr: number;
	/** Depth per second. */
	speed: number;
	/** Seconds since the previous frame; 0 draws without moving. */
	dt: number;
	/** Streaks instead of dots. */
	streak: boolean;
	random?: () => number;
}

/** Move every star by `speed * dt` and draw one frame. */
export function drawStars({
	ctx,
	stars,
	width,
	height,
	dpr,
	speed,
	dt,
	streak,
	random = Math.random
}: StarFrame): void {
	ctx.clearRect(0, 0, width, height);
	const cx = width / 2;
	const cy = height / 2;
	const step = speed * dt;
	for (const star of stars) {
		star.z -= step;
		if (star.z <= NEAR) {
			star.x = (random() - 0.5) * 2;
			star.y = (random() - 0.5) * 2;
			star.z = 1;
		}
		const k = 1 / star.z;
		const x = cx + star.x * k * width * 0.5;
		const y = cy + star.y * k * height * 0.5;
		if (x < 0 || x > width || y < 0 || y > height) continue;
		const size = (1 - star.z) * 2.2 * dpr;
		const alpha = Math.min(1, (1 - star.z) * 1.4);
		if (streak) {
			// The tail is where the star was a few frames ago.
			const k2 = 1 / (star.z + (speed / 60) * 6);
			ctx.strokeStyle = `rgba(255,230,190,${alpha * 0.9})`;
			ctx.lineWidth = size;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(cx + star.x * k2 * width * 0.5, cy + star.y * k2 * height * 0.5);
			ctx.stroke();
		} else {
			ctx.fillStyle = `rgba(255,240,220,${alpha * 0.7})`;
			ctx.beginPath();
			ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}
