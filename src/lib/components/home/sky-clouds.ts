/**
 * Canvas painters for the light scheme's sky (#381), ported from the approved
 * mock: the far deck of small drifting clouds behind the map, and the cumulus
 * bodies under each group's chips. Plain functions over a 2D context so the
 * Svelte components only own the loop.
 */

export type Ctx = Pick<
	CanvasRenderingContext2D,
	| 'clearRect'
	| 'save'
	| 'restore'
	| 'beginPath'
	| 'arc'
	| 'ellipse'
	| 'fill'
	| 'fillRect'
	| 'createRadialGradient'
	| 'createLinearGradient'
> & {
	fillStyle: unknown;
	globalCompositeOperation: CanvasRenderingContext2D['globalCompositeOperation'];
};

/** Far-deck clouds never get more opaque than this at rest, so chips stay readable. */
export const DECK_ALPHA_MAX = 0.45;

interface DeckPuff {
	dx: number;
	dy: number;
	r: number;
}
export interface DeckCloud {
	x: number;
	y: number;
	z: number;
	w: number;
	puffs: DeckPuff[];
}

export function makeDeckCloud(z: number, random: () => number = Math.random): DeckCloud {
	return {
		x: (random() - 0.5) * 2.4,
		y: (random() - 0.5) * 1.6,
		z,
		w: 0.9 + random() * 1.3,
		puffs: Array.from({ length: 4 + Math.floor(random() * 4) }, () => ({
			dx: (random() - 0.5) * 1.2,
			dy: (random() - 0.5) * 0.5,
			r: 0.35 + random() * 0.45
		}))
	};
}

export function makeDeck(count = 22, random: () => number = Math.random): DeckCloud[] {
	return Array.from({ length: count }, () => makeDeckCloud(0.25 + random() * 0.75, random));
}

/**
 * One frame of the sky. `flight` is 0 at rest and runs to 1 over the BUILD
 * flight: the deck accelerates toward the viewer and thickens. `step` is the
 * elapsed time in 60 Hz frames.
 */
export function drawSky(
	ctx: Ctx,
	w: number,
	h: number,
	deck: DeckCloud[],
	flight: number,
	step: number,
	random: () => number = Math.random
) {
	const cx = w / 2;
	const cy = h / 2;
	ctx.clearRect(0, 0, w, h);
	const g = ctx.createLinearGradient(0, 0, 0, h);
	g.addColorStop(0, '#8ec8ff');
	g.addColorStop(0.6, '#cfe8ff');
	g.addColorStop(1, '#eaf5ff');
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
	const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.5);
	halo.addColorStop(0, 'rgba(255,236,190,.35)');
	halo.addColorStop(1, 'rgba(255,236,190,0)');
	ctx.fillStyle = halo;
	ctx.fillRect(0, 0, w, h);

	const flying = flight > 0;
	const speed = (flying ? 0.003 + flight * 0.05 : 0.00035) * step;
	const drift = 0.00025 * step;
	deck.sort((a, b) => b.z - a.z);
	for (const c of deck) {
		c.z -= speed;
		c.x += drift;
		if (c.z <= 0.22 || c.x > 1.6) {
			const x = c.x;
			Object.assign(c, makeDeckCloud(1, random));
			c.x = flying ? x : -1.5;
		}
		const k = 1 / c.z;
		const x = cx + c.x * k * w * 0.5;
		const y = cy + c.y * k * h * 0.5;
		const s = k * w * 0.03 * c.w;
		if (x < -s * 3 || x > w + s * 3 || y < -s * 2 || y > h + s * 2) continue;
		const a = flying
			? Math.min(0.95, (1 - c.z) * 1.2 + 0.3)
			: Math.min(DECK_ALPHA_MAX, (1 - c.z) * 0.5 + 0.1);
		for (const p of c.puffs) {
			const px = x + p.dx * s;
			const py = y + p.dy * s;
			const pr = p.r * s * (flying ? 1 + flight * 0.6 : 1);
			const pg = ctx.createRadialGradient(px, py, pr * 0.2, px, py, pr);
			pg.addColorStop(0, `rgba(255,255,255,${a})`);
			pg.addColorStop(0.7, `rgba(255,255,255,${a * 0.7})`);
			pg.addColorStop(1, 'rgba(255,255,255,0)');
			ctx.fillStyle = pg;
			ctx.beginPath();
			ctx.arc(px, py, pr, 0, Math.PI * 2);
			ctx.fill();
		}
	}
}

export interface CloudPuff {
	layer: 0 | 1;
	x: number;
	y: number;
	r: number;
	ph: number;
	sp: number;
}

/** The puffs of one cumulus of size `w` x `h` (unscaled): bigger in the middle, random sizes. */
export function makePuffs(w: number, h: number, random: () => number = Math.random): CloudPuff[] {
	const n = Math.max(5, Math.round(w / 48));
	// A minimum mass height: a one-row cloud still gets a full head of puffs.
	const H = Math.max(h, 100);
	const lift = (H - h) / 2;
	const puffs: CloudPuff[] = [];
	for (const layer of [0, 1] as const) {
		for (let i = 0; i < n; i++) {
			const t = (i + 0.5) / n;
			const x = (t - 0.5) * w * 0.92;
			const mid = 1 - Math.abs(t - 0.5) * 1.4;
			puffs.push({
				layer,
				x: x + (random() - 0.5) * 18,
				y: -h * 0.22 - lift - mid * H * 0.16 - (layer ? 0 : H * 0.05) - random() * H * 0.06,
				r: H * (0.3 + mid * 0.2) * (layer ? 1.08 : 1) * (0.8 + random() * 0.4),
				ph: random() * 6,
				sp: 0.3 + random() * 0.4
			});
			puffs.push({
				layer,
				x: x + (random() - 0.5) * 30,
				y: h * 0.1 + (random() - 0.5) * 10,
				r: H * 0.46 * (layer ? 1.08 : 1),
				ph: random() * 6,
				sp: 0.3 + random() * 0.4
			});
		}
	}
	return puffs;
}

export interface CloudDraw {
	/** Centre in canvas pixels. */
	x: number;
	y: number;
	w: number;
	h: number;
	puffs: CloudPuff[];
	lit: boolean;
}

/**
 * One frame of every cloud body. `t` is the billow clock, `px`/`py` the mouse
 * offset (-.5 to .5) that shifts the two layers by different amounts.
 */
export function drawClouds(
	ctx: Ctx,
	w: number,
	h: number,
	clouds: CloudDraw[],
	scale: number,
	t: number,
	px: number,
	py: number
) {
	ctx.clearRect(0, 0, w, h);
	for (const c of clouds) {
		for (const layer of [0, 1] as const) {
			const par = layer ? 10 : 22;
			const ddx = px * par * scale;
			const ddy = py * par * scale;
			for (const p of c.puffs) {
				if (p.layer !== layer) continue;
				const br = 1 + 0.04 * Math.sin(t * p.sp + p.ph);
				const x = c.x + (p.x + 3 * Math.sin(t * p.sp * 0.7 + p.ph)) * scale + ddx;
				const y = c.y + p.y * scale + ddy;
				const r = p.r * br * scale;
				const gr = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
				if (layer === 0) {
					gr.addColorStop(0, `rgba(255,255,255,${c.lit ? 1 : 0.98})`);
					gr.addColorStop(0.55, 'rgba(250,253,255,.95)');
					gr.addColorStop(0.85, 'rgba(214,230,246,.85)');
					gr.addColorStop(1, 'rgba(190,212,236,0)');
				} else {
					gr.addColorStop(0, 'rgba(226,238,250,.95)');
					gr.addColorStop(0.7, 'rgba(196,216,238,.8)');
					gr.addColorStop(1, 'rgba(170,196,226,0)');
				}
				ctx.fillStyle = gr;
				ctx.beginPath();
				ctx.arc(x, y, r, 0, Math.PI * 2);
				ctx.fill();
			}
		}
		// The flat shaded base: the cumulus signature.
		const bx = c.x;
		const by = c.y + c.h * 0.52 * scale;
		const bw = c.w * 0.52 * scale;
		const gr = ctx.createLinearGradient(0, by - 14 * scale, 0, by + 10 * scale);
		gr.addColorStop(0, 'rgba(160,188,222,0)');
		gr.addColorStop(0.6, 'rgba(150,180,216,.55)');
		gr.addColorStop(1, 'rgba(150,180,216,0)');
		ctx.fillStyle = gr;
		ctx.beginPath();
		ctx.ellipse(bx, by, bw, 12 * scale, 0, 0, Math.PI * 2);
		ctx.fill();
	}
}
