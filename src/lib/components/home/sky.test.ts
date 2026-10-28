import { describe, expect, it } from 'vitest';
import { featureSections, features } from '$lib/data/features';
import { buildCloud, CHIP_H, fitSky } from './sky';
import { DECK_ALPHA_MAX, drawSky, makeDeck, makePuffs, type Ctx } from './sky-clouds';

describe('sky layout (#381)', () => {
	it('builds one cloud per group with every feature as a chip', () => {
		const clouds = fitSky(1440, 860).clouds;

		expect(clouds.map((c) => c.section)).toEqual(featureSections.map((s) => s.id));
		expect(clouds.flatMap((c) => c.chips.map((chip) => chip.id)).sort()).toEqual(
			features.map((f) => f.id).sort()
		);
	});

	it('keeps chips inside their cloud and in rows that do not overlap', () => {
		for (let i = 0; i < featureSections.length; i++) {
			const cloud = buildCloud(i);
			for (const chip of cloud.chips) {
				expect(Math.abs(chip.dx) + chip.w / 2).toBeLessThanOrEqual(cloud.w / 2);
				expect(Math.abs(chip.dy) + CHIP_H / 2).toBeLessThanOrEqual(cloud.h / 2);
			}
			// The title pill sits above the first row.
			expect(Math.min(...cloud.chips.map((c) => c.dy)) - CHIP_H / 2).toBeGreaterThan(-cloud.h / 2);
		}
	});

	it('fits the map and shrinks the clouds, never grows them, on a small screen', () => {
		const roomy = fitSky(1920, 1080);
		const small = fitSky(1024, 640);

		expect(roomy.scale).toBe(1);
		expect(small.scale).toBeLessThan(1);
		for (const cloud of small.clouds) {
			expect(cloud.x).toBeGreaterThan(0);
			expect(cloud.x).toBeLessThan(1024);
			expect(cloud.y).toBeGreaterThan(0);
			expect(cloud.y).toBeLessThan(640);
		}
	});

	it('gives every cloud a full head of puffs, even a one-row cloud', () => {
		const one = buildCloud(featureSections.findIndex((s) => s.id === 'assistant'));
		const puffs = makePuffs(one.w, one.h, () => 0.5);

		expect(puffs.length).toBeGreaterThanOrEqual(20);
		// 100 is the minimum mass height: radii follow it, not the short cloud.
		expect(Math.max(...puffs.map((p) => p.r))).toBeGreaterThan(one.h * 0.4);
	});

	it('caps the far deck alpha so chips stay readable', () => {
		const alphas: number[] = [];
		const gradient = {
			addColorStop: (_o: number, color: string) => {
				const a = /rgba\(255,255,255,([\d.]+)\)/.exec(color);
				if (a) alphas.push(Number(a[1]));
			}
		};
		const ctx = {
			clearRect() {},
			save() {},
			restore() {},
			beginPath() {},
			arc() {},
			ellipse() {},
			fill() {},
			fillRect() {},
			createRadialGradient: () => gradient,
			createLinearGradient: () => gradient,
			fillStyle: '',
			globalCompositeOperation: 'source-over'
		} as unknown as Ctx;

		drawSky(
			ctx,
			1400,
			800,
			makeDeck(22, () => 0.5),
			0,
			1
		);
		expect(alphas.length).toBeGreaterThan(0);
		expect(Math.max(...alphas)).toBeLessThanOrEqual(DECK_ALPHA_MAX);
	});
});
