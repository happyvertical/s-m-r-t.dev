import { describe, expect, it } from 'vitest';
import { rockPath, seeded, shards } from './asteroid';

const points = (d: string) =>
	d
		.slice(1, -1)
		.split('L')
		.map((pair) => pair.split(',').map(Number));

describe('asteroid', () => {
	it('seeds the same sequence for the same string', () => {
		const a = seeded('feature:quotes');
		const b = seeded('feature:quotes');
		expect([a(), a(), a()]).toEqual([b(), b(), b()]);
		expect(seeded('feature:invoices')()).not.toBe(seeded('feature:quotes')());
	});

	it('draws a stable closed rock that stays inside its radius', () => {
		const d = rockPath('feature:quotes', 9);
		expect(d).toBe(rockPath('feature:quotes', 9));
		expect(d).not.toBe(rockPath('feature:invoices', 9));
		expect(d).toMatch(/^M[-\d.,L]+Z$/);
		const outline = points(d);
		expect(outline.length).toBeGreaterThanOrEqual(8);
		for (const [x, y] of outline) {
			const reach = Math.hypot(x, y);
			expect(reach).toBeLessThanOrEqual(9.1);
			expect(reach).toBeGreaterThanOrEqual(9 * 0.68 - 0.1);
		}
	});

	it('throws the shards clear of the rock, all the way round', () => {
		const pieces = shards('feature:quotes', 9);
		expect(pieces).toEqual(shards('feature:quotes', 9));
		expect(pieces.length).toBeGreaterThanOrEqual(7);
		const quadrants = new Set<string>();
		for (const piece of pieces) {
			expect(Math.hypot(piece.dx, piece.dy)).toBeGreaterThan(9 * 2);
			expect(piece.d).toMatch(/^M[-\d.,L]+Z$/);
			quadrants.add(`${piece.dx >= 0}${piece.dy >= 0}`);
		}
		expect(quadrants.size).toBe(4);
	});
});
