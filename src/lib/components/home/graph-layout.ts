/**
 * Layout of the front-page feature graph (#363). The hub (BUILD), nine section
 * nodes and forty-nine feature nodes are settled once, offline, by d3-force in
 * a unit frame centred on the hub. `fitGraph` then stretches the settled frame
 * to whatever size the map has, so the graph fills the screen and refits on
 * resize without running the simulation again. Constants follow the approved
 * mock (`design/mocks/index.html`).
 */

import {
	forceCollide,
	forceLink,
	forceManyBody,
	forceRadial,
	forceSimulation,
	type SimulationLinkDatum,
	type SimulationNodeDatum
} from 'd3-force';
import {
	featurePath,
	featureSectionPath,
	featureSections,
	featuresInSection
} from '$lib/data/features';

export const HUB_RADIUS = 46;
/** Links from the hub start this far from its centre: just outside the sun's rim. */
export const RIM_RADIUS = HUB_RADIUS + 6;
export const BUILD_HREF = '/build-a-boilerplate';

export type Depth = 0 | 1 | 2;

export interface GraphNode extends SimulationNodeDatum {
	id: string;
	depth: Depth;
	word: string;
	/** The hover sentence; absent on the hub. */
	hint?: string;
	href: string;
	/** Index into `featureSections`; -1 on the hub. */
	section: number;
	r: number;
	/** Settled position in the unit frame, relative to the hub. */
	ux: number;
	uy: number;
}

export interface GraphLink {
	source: GraphNode;
	target: GraphNode;
	depth: 1 | 2;
}

export interface PlacedNode extends GraphNode {
	x: number;
	y: number;
}

export interface PlacedLink {
	source: PlacedNode;
	target: PlacedNode;
	depth: 1 | 2;
	/** Where the line starts: the hub's rim for depth 1, the section's centre otherwise. */
	x1: number;
	y1: number;
}

export interface Placed {
	width: number;
	height: number;
	cx: number;
	cy: number;
	nodes: PlacedNode[];
	links: PlacedLink[];
}

interface Settled {
	nodes: GraphNode[];
	links: GraphLink[];
	maxDx: number;
	maxDy: number;
}

const LEVEL = {
	linkDistance: { 1: 200, 2: 130 },
	linkStrength: { 1: 1, 2: 0.5 },
	charge: { 0: -1500, 1: -900, 2: -140 },
	radial: { 0: 0, 1: 200, 2: 350 },
	radialStrength: { 0: 1, 1: 0.95, 2: 0.6 },
	collidePad: { 0: 30, 1: 56 }
} as const;

let settled: Settled | undefined;

function settle(): Settled {
	const hub: GraphNode = {
		id: 'hub',
		depth: 0,
		word: 'BUILD',
		href: BUILD_HREF,
		section: -1,
		r: HUB_RADIUS,
		ux: 0,
		uy: 0,
		fx: 0,
		fy: 0,
		x: 0,
		y: 0
	};
	const nodes: GraphNode[] = [hub];
	const links: GraphLink[] = [];

	// Each section gets a slice of the circle proportional to its feature count
	// (plus the section node itself), so big sections are not squeezed.
	const total = featureSections.reduce(
		(sum, section) => sum + featuresInSection(section.id).length + 2,
		0
	);
	let acc = -100;
	const slices = featureSections.map((section) => {
		const span = (360 * (featuresInSection(section.id).length + 2)) / total;
		const mid = acc + span / 2;
		acc += span;
		return { mid, span };
	});

	featureSections.forEach((section, si) => {
		const sectionNode: GraphNode = {
			id: `section:${section.id}`,
			depth: 1,
			word: section.word,
			hint: section.hint,
			href: featureSectionPath(section),
			section: si,
			r: 16,
			ux: 0,
			uy: 0
		};
		const angle = (slices[si].mid * Math.PI) / 180;
		sectionNode.x = 200 * Math.cos(angle);
		sectionNode.y = 200 * Math.sin(angle);
		nodes.push(sectionNode);
		links.push({ source: hub, target: sectionNode, depth: 1 });

		const members = featuresInSection(section.id);
		members.forEach((feature, fi) => {
			const featureNode: GraphNode = {
				id: `feature:${feature.id}`,
				depth: 2,
				word: feature.word,
				hint: feature.hint,
				href: featurePath(feature),
				section: si,
				r: 6,
				ux: 0,
				uy: 0
			};
			const { mid, span } = slices[si];
			const t = members.length === 1 ? 0.5 : fi / (members.length - 1);
			const a = ((mid - span * 0.42 + span * 0.84 * t) * Math.PI) / 180;
			const radius = 330 + (fi % 2) * 40;
			featureNode.x = radius * Math.cos(a);
			featureNode.y = radius * Math.sin(a);
			nodes.push(featureNode);
			links.push({ source: sectionNode, target: featureNode, depth: 2 });
		});
	});

	const simulation = forceSimulation(nodes)
		.force(
			'link',
			forceLink<GraphNode, SimulationLinkDatum<GraphNode> & { depth: 1 | 2 }>(links)
				.id((node) => node.id)
				.distance((link) => LEVEL.linkDistance[link.depth])
				.strength((link) => LEVEL.linkStrength[link.depth])
		)
		.force(
			'charge',
			forceManyBody<GraphNode>().strength((node) => LEVEL.charge[node.depth])
		)
		.force(
			'radial',
			forceRadial<GraphNode>((node) => LEVEL.radial[node.depth], 0, 0).strength(
				(node) => LEVEL.radialStrength[node.depth]
			)
		)
		// Label-aware: a feature's collision radius grows with its word.
		.force(
			'collide',
			forceCollide<GraphNode>((node) =>
				node.depth === 2 ? 16 + node.word.length * 3.6 : node.r + LEVEL.collidePad[node.depth]
			).iterations(4)
		)
		.stop();
	for (let i = 0; i < 400; i++) simulation.tick();

	for (const node of nodes) {
		node.ux = node.x ?? 0;
		node.uy = node.y ?? 0;
	}
	return {
		nodes,
		links,
		maxDx: Math.max(...nodes.map((node) => Math.abs(node.ux))),
		maxDy: Math.max(...nodes.map((node) => Math.abs(node.uy)))
	};
}

/** Stretch the settled graph to a `width` x `height` map. Pure; safe to call on every resize. */
export function fitGraph(width: number, height: number): Placed {
	settled ??= settle();
	const { nodes, links, maxDx, maxDy } = settled;
	const cx = width / 2;
	const cy = height / 2;
	const padX = Math.min(120, width * 0.09);
	const padTop = 36;
	const padBottom = 52;
	const kx = (width / 2 - padX) / maxDx;
	const ky = Math.min((cy - padTop) / maxDy, (height - cy - padBottom) / maxDy);

	const placed = new Map<string, PlacedNode>();
	const placedNodes = nodes.map((node) => {
		const next: PlacedNode = { ...node, x: cx + node.ux * kx, y: cy + node.uy * ky };
		placed.set(node.id, next);
		return next;
	});
	const placedLinks = links.map((link): PlacedLink => {
		const source = placed.get(link.source.id)!;
		const target = placed.get(link.target.id)!;
		let x1 = source.x;
		let y1 = source.y;
		if (link.depth === 1) {
			const dx = target.x - source.x;
			const dy = target.y - source.y;
			const k = RIM_RADIUS / Math.hypot(dx, dy);
			x1 = source.x + dx * k;
			y1 = source.y + dy * k;
		}
		return { source, target, depth: link.depth, x1, y1 };
	});
	return { width, height, cx, cy, nodes: placedNodes, links: placedLinks };
}
