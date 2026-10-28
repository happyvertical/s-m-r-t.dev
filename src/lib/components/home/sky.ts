/**
 * Layout of the light scheme's sky (#381): one cumulus cloud per feature
 * group, its features as pill chips in rows inside it. Ported from the approved
 * mock (`redesign-mocks/index-sky.html`). The clouds are settled once, offline,
 * by d3-force in a unit frame around the sun (angular slice proportional to
 * feature count, a collide force keeping them apart); `fitSky` then stretches
 * that frame to the map, shrinking the clouds uniformly when the map is small.
 * Pure, so it is testable without a canvas.
 */

import { forceCollide, forceManyBody, forceRadial, forceSimulation } from 'd3-force';
import { featureSections, featuresInSection, type FeatureSectionId } from '$lib/data/features';

export const CHIP_H = 24;
export const CHIP_GAP = 8;
/** A row of chips wraps beyond this width. */
export const ROW_MAX = 250;
/** Advance of one uppercase letter at 12px with .06em tracking, plus a margin. */
const CHIP_CHAR = 8;
const CHIP_PAD = 22;
const TITLE_CHAR = 10.8;
const TITLE_PAD = 40;
export const TITLE_H = 28;
/** The title pill sits up in the puffs; chips start this far below the top. */
const TOP = 30;
const BOTTOM = 10;
const SIDE = 28;

export interface SkyChip {
	id: string;
	word: string;
	everyday: boolean;
	w: number;
	/** Centre, relative to the cloud's centre, in unscaled units. */
	dx: number;
	dy: number;
}

export interface SkyCloud {
	section: FeatureSectionId;
	word: string;
	hint: string;
	index: number;
	chips: SkyChip[];
	/** Title pill width. */
	titleW: number;
	/** Cloud size at scale 1. */
	w: number;
	h: number;
	/** Settled position in the unit frame, relative to the sun. */
	ux: number;
	uy: number;
}

export interface PlacedCloud extends SkyCloud {
	x: number;
	y: number;
}

export interface PlacedSky {
	cx: number;
	cy: number;
	/** Uniform scale of every cloud's content. */
	scale: number;
	clouds: PlacedCloud[];
}

export const chipWidth = (word: string) => word.length * CHIP_CHAR + CHIP_PAD;
export const titleWidth = (word: string) => word.length * TITLE_CHAR + TITLE_PAD;

/** Lay one group's chips in rows centred under its title. */
export function buildCloud(index: number): SkyCloud {
	const section = featureSections[index];
	const members = featuresInSection(section.id);
	const rows: SkyChip[][] = [[]];
	let x = 0;
	for (const feature of members) {
		const w = chipWidth(feature.word);
		if (x + w > ROW_MAX && rows[rows.length - 1].length) {
			rows.push([]);
			x = 0;
		}
		rows[rows.length - 1].push({
			id: feature.id,
			word: feature.word,
			everyday: feature.everyday,
			w,
			dx: 0,
			dy: 0
		});
		x += w + CHIP_GAP;
	}
	const rowWidth = (row: SkyChip[]) =>
		row.reduce((sum, chip) => sum + chip.w, 0) + CHIP_GAP * (row.length - 1);
	const w = Math.max(...rows.map(rowWidth)) + SIDE * 2;
	const h = rows.length * (CHIP_H + CHIP_GAP) + TOP + BOTTOM;
	rows.forEach((row, ri) => {
		let cx = -rowWidth(row) / 2;
		for (const chip of row) {
			chip.dx = cx + chip.w / 2;
			chip.dy = -h / 2 + TOP + ri * (CHIP_H + CHIP_GAP) + CHIP_H / 2;
			cx += chip.w + CHIP_GAP;
		}
	});
	return {
		section: section.id,
		word: section.word,
		hint: section.hint,
		index,
		chips: rows.flat(),
		titleW: titleWidth(section.word),
		w,
		h,
		ux: 0,
		uy: 0
	};
}

const SPREAD = 330;
let settled: { clouds: SkyCloud[]; maxDx: number; maxDy: number } | undefined;

function settle() {
	const clouds = featureSections.map((_, i) => buildCloud(i));
	const total = clouds.reduce((sum, c) => sum + c.chips.length + 2, 0);
	let acc = -100;
	type Node = { c?: SkyCloud; r: number; x: number; y: number; fx?: number; fy?: number };
	const nodes: Node[] = [{ r: 130, x: 0, y: 0, fx: 0, fy: 0 }];
	for (const c of clouds) {
		const span = (360 * (c.chips.length + 2)) / total;
		const a = ((acc + span / 2) * Math.PI) / 180;
		acc += span;
		nodes.push({
			c,
			r: Math.hypot(c.w, c.h) * 0.41 + 14,
			x: SPREAD * Math.cos(a),
			y: SPREAD * Math.sin(a)
		});
	}
	const sim = forceSimulation(nodes)
		.force('radial', forceRadial<Node>(SPREAD, 0, 0).strength(0.5))
		.force('collide', forceCollide<Node>((n) => n.r).iterations(6))
		.force('charge', forceManyBody<Node>().strength(-300))
		.stop();
	for (let i = 0; i < 500; i++) sim.tick();
	for (const n of nodes) {
		if (!n.c) continue;
		n.c.ux = n.x;
		n.c.uy = n.y;
	}
	return {
		clouds,
		maxDx: Math.max(...clouds.map((c) => Math.abs(c.ux) + c.w / 2)),
		maxDy: Math.max(...clouds.map((c) => Math.abs(c.uy) + c.h / 2))
	};
}

/**
 * Stretch the settled sky to a `width` x `height` map. `padTop` leaves room for
 * the controls, `padBottom` for the hint line. Pure; safe on every resize.
 */
export function fitSky(width: number, height: number, padTop = 76, padBottom = 48): PlacedSky {
	settled ??= settle();
	const { clouds, maxDx, maxDy } = settled;
	const cx = width / 2;
	const cy = height / 2;
	const kx = (width / 2 - 24) / maxDx;
	const ky = Math.min((cy - padTop) / maxDy, (height - cy - padBottom) / maxDy);
	// Positions stretch by kx/ky; sizes only shrink, so clouds never overlap more
	// than they do in the settled frame.
	const scale = Math.max(0.5, Math.min(1, kx, ky));
	return {
		cx,
		cy,
		scale,
		clouds: clouds.map((c) => ({ ...c, x: cx + c.ux * kx, y: cy + c.uy * ky }))
	};
}
