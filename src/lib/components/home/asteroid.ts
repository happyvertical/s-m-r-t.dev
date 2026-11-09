/**
 * The space map's asteroids (#392): an unselected feature is a small rock, and
 * selecting it blows the rock apart. Shapes are seeded by the feature id, so a
 * rock looks the same on every render and the prerendered page matches.
 */

/** How long a burst stays in the DOM; the CSS animation runs inside it. */
export const BURST_MS = 720;

/** A deterministic 0..1 generator seeded by a string (FNV-1a into mulberry32). */
export function seeded(seed: string): () => number {
	let h = 0x811c9dc5;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	let a = h >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const round = (value: number) => Math.round(value * 10) / 10;

function polygon(next: () => number, points: number, radius: number, low: number): string {
	const turn = next() * Math.PI * 2;
	const parts: string[] = [];
	for (let i = 0; i < points; i++) {
		const angle = turn + ((i + (next() - 0.5) * 0.5) / points) * Math.PI * 2;
		const reach = radius * (low + next() * (1 - low));
		parts.push(`${round(Math.cos(angle) * reach)},${round(Math.sin(angle) * reach)}`);
	}
	return `M${parts.join('L')}Z`;
}

/** A closed, lumpy outline around the origin, at most `radius` from it. */
export function rockPath(id: string, radius: number): string {
	const next = seeded(id);
	return polygon(next, 8 + Math.floor(next() * 3), radius, 0.68);
}

export interface Shard {
	/** Outline around the shard's own origin. */
	d: string;
	/** Where the shard ends up, relative to the rock's centre. */
	dx: number;
	dy: number;
	/** Degrees turned on the way. */
	spin: number;
}

/** The pieces a rock breaks into, thrown outward in every direction. */
export function shards(id: string, radius: number): Shard[] {
	const next = seeded(`${id}:shards`);
	const count = 7 + Math.floor(next() * 3);
	const turn = next() * Math.PI * 2;
	return Array.from({ length: count }, (_, i) => {
		const angle = turn + ((i + (next() - 0.5) * 0.6) / count) * Math.PI * 2;
		const reach = radius * (2.2 + next() * 2.4);
		return {
			d: polygon(next, 3 + Math.floor(next() * 2), radius * (0.28 + next() * 0.26), 0.6),
			dx: round(Math.cos(angle) * reach),
			dy: round(Math.sin(angle) * reach),
			spin: Math.round((next() - 0.5) * 540)
		};
	});
}
