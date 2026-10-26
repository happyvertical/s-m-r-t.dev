/**
 * The BUILD sun (#363): a churning surface, a thin limb, a tight smoulder at
 * the rim and one flare every 20 to 45 seconds. Ported from the approved mock
 * (`design/mocks/index.html`). No glow, no rays.
 *
 * `createSun` holds the animation state and `frame` draws one frame, so the
 * frame logic is testable without a canvas loop: `SunCanvas.svelte` decides
 * whether to call it once (prefers-reduced-motion) or every animation frame.
 */

export interface SunPalette {
	core: string;
	mid: string;
	rim: string;
	/** `r,g,b` triplets, used inside rgba(). */
	hot: string;
	warm: string;
	dark: string;
	limb: string;
	sparkHot: string;
	sparkCool: string;
	fade: string;
	flare: [string, string, string];
}

/** Dark scheme: fire. Light scheme: blue flame (white-hot, cyan, blue). */
export const sunPalettes = {
	fire: {
		core: '#ffe27a',
		mid: '#ff9a1f',
		rim: '#d8341a',
		hot: '255,240,170',
		warm: '255,120,40',
		dark: '140,40,10',
		limb: '255,190,80',
		sparkHot: '255,200,90',
		sparkCool: '255,110,30',
		fade: '255,60,20',
		flare: ['255,80,20', '255,150,40', '255,235,160']
	},
	blue: {
		core: '#f4fbff',
		mid: '#4fd2ff',
		rim: '#1848c8',
		hot: '230,250,255',
		warm: '80,170,255',
		dark: '20,50,140',
		limb: '170,230,255',
		sparkHot: '200,240,255',
		sparkCool: '60,140,255',
		fade: '30,80,220',
		flare: ['40,90,230', '90,190,255', '235,250,255']
	}
} satisfies Record<string, SunPalette>;

/** Side of the square sun canvas, in CSS pixels; room for the tallest flare. */
export const SUN_SIZE = 320;
/** Surface drift per frame. */
export const DRIFT = 0.005;
/** At most this many rim sparks are alive at once. */
export const MAX_SPARKS = 140;
/** A flare starts every 20 to 45 seconds and lasts 4 to 6 seconds. */
export const FLARE_GAP_MS = [20_000, 45_000] as const;
export const FLARE_DURATION_S = [4, 6] as const;
/** The first flare waits this long after the first frame. */
export const FIRST_FLARE_MS = 6000;

type Ctx = Pick<
	CanvasRenderingContext2D,
	| 'clearRect'
	| 'save'
	| 'restore'
	| 'beginPath'
	| 'arc'
	| 'clip'
	| 'fillRect'
	| 'fill'
	| 'stroke'
	| 'moveTo'
	| 'bezierCurveTo'
	| 'createRadialGradient'
> & {
	fillStyle: unknown;
	strokeStyle: unknown;
	lineWidth: number;
	lineCap: CanvasRenderingContext2D['lineCap'];
	globalCompositeOperation: CanvasRenderingContext2D['globalCompositeOperation'];
};

export interface SunOptions {
	ctx: Ctx;
	/** Side of the square canvas, in CSS pixels. */
	size: number;
	/** Disc radius, in CSS pixels. */
	radius: number;
	/** Read on every frame, so a scheme change shows on the next one. */
	palette: () => SunPalette;
	random?: () => number;
}

export interface Sun {
	/** Draw one frame; `now` is a `requestAnimationFrame` timestamp. */
	frame(_now: number): void;
	readonly state: { T: number; sparks: number; flares: number; frames: number };
}

interface Cell {
	a: number;
	r: number;
	w: number;
	ph: number;
	sz: number;
	hot: boolean;
}
interface Spark {
	a: number;
	r: number;
	v: number;
	life: number;
	dec: number;
	sz: number;
}
interface Flare {
	a: number;
	span: number;
	h: number;
	t: number;
	dur: number;
}

export function createSun({
	ctx: fx,
	size,
	radius: R,
	palette,
	random = Math.random
}: SunOptions): Sun {
	const C = size / 2;
	// Surface granules: slow-moving soft blobs, clipped to the disc.
	const cells: Cell[] = Array.from({ length: 34 }, () => ({
		a: random() * Math.PI * 2,
		r: random() * R * 0.95,
		w: 0.15 + random() * 0.35,
		ph: random() * 6,
		sz: 9 + random() * 13,
		hot: random() < 0.5
	}));
	const sparks: Spark[] = [];
	const flares: Flare[] = [];
	const state = { T: 0, sparks: 0, flares: 0, frames: 0 };
	let nextFlare: number | undefined;
	let last: number | undefined;

	const pt = (a: number, r: number): [number, number] => [C + Math.cos(a) * r, C + Math.sin(a) * r];

	function spark() {
		sparks.push({
			a: random() * Math.PI * 2,
			r: R - 2,
			v: 0.04 + random() * 0.07,
			life: 1,
			dec: 0.008 + random() * 0.008,
			sz: 5 + random() * 6
		});
	}

	function flare() {
		flares.push({
			a: random() * Math.PI * 2,
			span: 0.35 + random() * 0.35,
			h: R * (0.45 + random() * 0.5),
			t: 0,
			dur: FLARE_DURATION_S[0] + random() * (FLARE_DURATION_S[1] - FLARE_DURATION_S[0])
		});
	}

	function frame(now: number) {
		const pal = palette();
		nextFlare ??= now + FIRST_FLARE_MS;
		// Flares run on the clock, not on the frame count, so 120 Hz screens
		// do not shorten them.
		const dt = last === undefined ? 0 : Math.min(0.1, Math.max(0, (now - last) / 1000));
		last = now;
		state.T += DRIFT;
		state.frames += 1;
		fx.clearRect(0, 0, size, size);

		// 1. surface
		fx.save();
		fx.beginPath();
		fx.arc(C, C, R, 0, Math.PI * 2);
		fx.clip();
		const base = fx.createRadialGradient(C - R * 0.25, C - R * 0.25, R * 0.1, C, C, R);
		base.addColorStop(0, pal.core);
		base.addColorStop(0.55, pal.mid);
		base.addColorStop(1, pal.rim);
		fx.fillStyle = base;
		fx.fillRect(0, 0, size, size);
		fx.globalCompositeOperation = 'lighter';
		for (const c of cells) {
			const a = c.a + state.T * c.w * 0.25;
			const r = c.r * (0.9 + 0.1 * Math.sin(state.T * c.w + c.ph));
			const [x, y] = pt(a, r);
			const g = fx.createRadialGradient(x, y, 0, x, y, c.sz);
			g.addColorStop(0, c.hot ? `rgba(${pal.hot},.28)` : `rgba(${pal.warm},.22)`);
			g.addColorStop(1, `rgba(${pal.fade},0)`);
			fx.fillStyle = g;
			fx.beginPath();
			fx.arc(x, y, c.sz, 0, Math.PI * 2);
			fx.fill();
		}
		fx.globalCompositeOperation = 'multiply';
		cells.forEach((c, i) => {
			if (i % 3) return;
			const a = c.a - state.T * c.w * 0.2;
			const [x, y] = pt(a, c.r);
			const g = fx.createRadialGradient(x, y, 0, x, y, c.sz * 0.8);
			g.addColorStop(0, `rgba(${pal.dark},.2)`);
			g.addColorStop(1, `rgba(${pal.dark},0)`);
			fx.fillStyle = g;
			fx.beginPath();
			fx.arc(x, y, c.sz * 0.8, 0, Math.PI * 2);
			fx.fill();
		});
		fx.restore();

		// 2. limb: a thin bright rim so the edge reads as a sphere
		fx.globalCompositeOperation = 'lighter';
		fx.lineWidth = 2.5;
		fx.strokeStyle = `rgba(${pal.limb},.55)`;
		fx.beginPath();
		fx.arc(C, C, R - 1, 0, Math.PI * 2);
		fx.stroke();

		// 3. smoulder at the rim
		if (sparks.length < MAX_SPARKS) spark();
		for (let i = sparks.length - 1; i >= 0; i--) {
			const p = sparks[i];
			p.life -= p.dec;
			if (p.life <= 0) {
				sparks.splice(i, 1);
				continue;
			}
			p.r += p.v;
			const [x, y] = pt(p.a, p.r);
			const sz = p.sz * (0.6 + 0.4 * p.life);
			const g = fx.createRadialGradient(x, y, 0, x, y, sz);
			g.addColorStop(0, `rgba(${p.life > 0.5 ? pal.sparkHot : pal.sparkCool},${0.5 * p.life})`);
			g.addColorStop(1, `rgba(${pal.fade},0)`);
			fx.fillStyle = g;
			fx.beginPath();
			fx.arc(x, y, sz, 0, Math.PI * 2);
			fx.fill();
		}

		// 4. flares: a loop from the rim that rises, then collapses
		if (now > nextFlare) {
			flare();
			nextFlare = now + FLARE_GAP_MS[0] + random() * (FLARE_GAP_MS[1] - FLARE_GAP_MS[0]);
		}
		for (let i = flares.length - 1; i >= 0; i--) {
			const f = flares[i];
			f.t += dt / f.dur;
			if (f.t >= 1) {
				flares.splice(i, 1);
				continue;
			}
			const rise = Math.sin(f.t * Math.PI);
			const h = f.h * rise;
			const [x0, y0] = pt(f.a, R - 2);
			const [x1, y1] = pt(f.a + f.span, R - 2);
			const [cx1, cy1] = pt(f.a + f.span * 0.3, R + h);
			const [cx2, cy2] = pt(f.a + f.span * 0.7, R + h);
			fx.lineCap = 'round';
			(
				[
					[9, `rgba(${pal.flare[0]},${0.25 * rise})`],
					[5, `rgba(${pal.flare[1]},${0.5 * rise})`],
					[2, `rgba(${pal.flare[2]},${0.9 * rise})`]
				] as const
			).forEach(([w, col]) => {
				fx.lineWidth = w;
				fx.strokeStyle = col;
				fx.beginPath();
				fx.moveTo(x0, y0);
				fx.bezierCurveTo(cx1, cy1, cx2, cy2, x1, y1);
				fx.stroke();
			});
		}
		fx.globalCompositeOperation = 'source-over';
		state.sparks = sparks.length;
		state.flares = flares.length;
	}

	return { frame, state };
}
