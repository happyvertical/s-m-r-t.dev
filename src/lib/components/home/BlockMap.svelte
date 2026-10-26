<script lang="ts">
	import { blockIsPreview } from '$lib/data/block-status';
	import { blockBranches, buildingBlocks } from '$lib/data/blocks';

	/**
	 * The agentic building blocks mind map (#352, slice D): build-a-boilerplate
	 * at the centre, the four branches around it, one link per block. Pure
	 * render from `blocks.ts`; the Preview label is derived in `block-status.ts`.
	 *
	 * From 768px up it is one inline SVG whose viewBox is sized so the text stays
	 * at 12px or more at the narrowest width it renders (see the size notes on
	 * `.map`). Below that the same data is four plain lists under the centre
	 * link, which needs no horizontal room.
	 */
	let { layout = 'compact' }: { layout?: 'compact' | 'full' } = $props();

	const CENTRE_HREF = '/build-a-boilerplate';
	const CENTRE_LABEL = 'build-a-boilerplate';

	// Geometry, in viewBox units. The map is 720 wide; every font size is 13 or
	// more, and the map renders at 620px or wider from a 768px viewport.
	const WIDTH = 720;
	const LEAF_W = 196;
	const LEAF_LINE = 19;
	const LEAF_PAD = 9;
	const LEAF_GAP = 8;
	const GROUP_GAP = 30;
	const BRANCH_W = 112;
	const BRANCH_LINE = 19;
	const BRANCH_PAD = 12;
	const CENTRE_W = 224;
	const CENTRE_H = 60;
	const LEFT_BRANCH_X = 236; // left edge of the left branch boxes; their right edge is 24 short of the centre line
	const RIGHT_BRANCH_X = 372; // left edge of the right branch boxes
	const WRAP_AT = 22;

	function wrap(text: string, limit: number): string[] {
		const lines: string[] = [];
		for (const word of text.split(' ')) {
			const last = lines[lines.length - 1];
			if (last !== undefined && last.length + 1 + word.length <= limit) {
				lines[lines.length - 1] = `${last} ${word}`;
			} else {
				lines.push(word);
			}
		}
		return lines;
	}

	// Clockwise from the top left, which is also the reading and tab order.
	// Left side: the first and last branches; right side: the two between.
	const sideOf = (index: number): 'left' | 'right' =>
		index === 0 || index === blockBranches.length - 1 ? 'left' : 'right';

	const branches = $derived.by(() => {
		const groups = blockBranches.map((branch, index) => {
			const leaves = buildingBlocks
				.filter((block) => block.branch === branch.id)
				.map((block) => {
					const lines = wrap(block.title, WRAP_AT);
					const preview = blockIsPreview(block);
					const rows = lines.length + (preview ? 1 : 0);
					return {
						block,
						lines,
						preview,
						height: rows * LEAF_LINE + LEAF_PAD * 2,
						y: 0
					};
				});
			const height =
				leaves.reduce((sum, leaf) => sum + leaf.height, 0) + LEAF_GAP * (leaves.length - 1);
			return { branch, side: sideOf(index), leaves, height, top: 0 };
		});

		const sideHeights = { left: 0, right: 0 };
		for (const side of ['left', 'right'] as const) {
			const onSide = groups.filter((group) => group.side === side);
			sideHeights[side] =
				onSide.reduce((sum, group) => sum + group.height, 0) + GROUP_GAP * (onSide.length - 1);
		}
		const height = Math.max(sideHeights.left, sideHeights.right);
		const centreY = height / 2;

		for (const side of ['left', 'right'] as const) {
			let cursor = (height - sideHeights[side]) / 2;
			for (const group of groups.filter((entry) => entry.side === side)) {
				group.top = cursor;
				let y = cursor;
				for (const leaf of group.leaves) {
					leaf.y = y;
					y += leaf.height + LEAF_GAP;
				}
				cursor += group.height + GROUP_GAP;
			}
		}

		return {
			height,
			centreY,
			groups: groups.map((group) => {
				const lines = wrap(group.branch.title, 11);
				const boxHeight = lines.length * BRANCH_LINE + BRANCH_PAD * 2;
				const wanted = group.top + group.height / 2;
				// Keep the branch box clear of the centre node's band.
				const clear = CENTRE_H / 2 + 14 + boxHeight / 2;
				let middle = wanted;
				if (Math.abs(middle - centreY) < clear) {
					middle = centreY + (wanted >= centreY ? clear : -clear);
				}
				const x = group.side === 'left' ? LEFT_BRANCH_X : RIGHT_BRANCH_X;
				return { ...group, lines, boxHeight, middle, x };
			})
		};
	});

	const leafX = (side: 'left' | 'right') => (side === 'left' ? 0 : WIDTH - LEAF_W);

	function centreToBranch(group: (typeof branches.groups)[number]): string {
		const above = group.middle < branches.centreY;
		const startY = branches.centreY + (above ? -CENTRE_H / 2 : CENTRE_H / 2);
		const endX = group.side === 'left' ? group.x + BRANCH_W : group.x;
		// Start 20 off the spine so the two wires on a side do not double it.
		const startX = WIDTH / 2 + (group.side === 'left' ? -20 : 20);
		return `M${startX},${startY} C${startX},${group.middle} ${endX + (group.side === 'left' ? 12 : -12)},${group.middle} ${endX},${group.middle}`;
	}

	function branchToLeaf(group: (typeof branches.groups)[number], leafY: number): string {
		const startX = group.side === 'left' ? group.x : group.x + BRANCH_W;
		const endX = group.side === 'left' ? LEAF_W : WIDTH - LEAF_W;
		const mid = startX + (endX - startX) * 0.35;
		return `M${startX},${group.middle} C${mid},${group.middle} ${mid},${leafY} ${endX},${leafY}`;
	}
</script>

<div class="block-map" data-layout={layout}>
	<a class="centre-link" href={CENTRE_HREF}>
		{CENTRE_LABEL} <span aria-hidden="true">→</span>
	</a>

	<div class="lists">
		{#each blockBranches as branch (branch.id)}
			<div class="list-group">
				<p class="list-label" id={`map-list-${branch.id}`}>{branch.title}</p>
				<ul aria-labelledby={`map-list-${branch.id}`}>
					{#each buildingBlocks.filter((block) => block.branch === branch.id) as block (block.id)}
						<li>
							<a href={`/blocks/${block.id}`}>{block.title}</a>
							{#if blockIsPreview(block)}<span class="list-chip">Preview</span>{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<svg
		class="map"
		viewBox={`-2 -2 ${WIDTH + 4} ${branches.height + 4}`}
		role="group"
		aria-label="Agentic building blocks, grouped in four branches around build-a-boilerplate"
	>
		<g class="wires" aria-hidden="true">
			{#each branches.groups as group (group.branch.id)}
				<path d={centreToBranch(group)} />
				{#each group.leaves as leaf (leaf.block.id)}
					<path d={branchToLeaf(group, leaf.y + leaf.height / 2)} />
				{/each}
			{/each}
		</g>

		{#each branches.groups as group (group.branch.id)}
			<g class="branch">
				<rect
					x={group.x}
					y={group.middle - group.boxHeight / 2}
					width={BRANCH_W}
					height={group.boxHeight}
					rx="10"
				/>
				<text text-anchor="middle" x={group.x + BRANCH_W / 2}>
					{#each group.lines as line, index (line)}
						<tspan
							x={group.x + BRANCH_W / 2}
							y={group.middle - group.boxHeight / 2 + BRANCH_PAD + BRANCH_LINE * (index + 0.75)}
							>{line}</tspan
						>
					{/each}
				</text>
			</g>

			{#each group.leaves as leaf (leaf.block.id)}
				<a class="leaf" class:preview={leaf.preview} href={`/blocks/${leaf.block.id}`}>
					<title>{leaf.block.title}{leaf.preview ? ' (Preview)' : ''}</title>
					<rect x={leafX(group.side)} y={leaf.y} width={LEAF_W} height={leaf.height} rx="8" />
					<text text-anchor="middle">
						{#each leaf.lines as line, index (line)}
							<tspan
								x={leafX(group.side) + LEAF_W / 2}
								y={leaf.y + LEAF_PAD + LEAF_LINE * (index + 0.75)}>{line}</tspan
							>
						{/each}
						{#if leaf.preview}
							<tspan
								class="preview-text"
								x={leafX(group.side) + LEAF_W / 2}
								y={leaf.y + LEAF_PAD + LEAF_LINE * (leaf.lines.length + 0.75)}>Preview</tspan
							>
						{/if}
					</text>
				</a>
			{/each}
		{/each}

		<a class="centre" href={CENTRE_HREF}>
			<title>{CENTRE_LABEL}</title>
			<rect
				x={(WIDTH - CENTRE_W) / 2}
				y={branches.centreY - CENTRE_H / 2}
				width={CENTRE_W}
				height={CENTRE_H}
				rx="14"
			/>
			<text text-anchor="middle" x={WIDTH / 2} y={branches.centreY + 6.5}>{CENTRE_LABEL}</text>
		</a>
	</svg>
</div>

<style>
	.block-map {
		margin: 0 auto;
	}

	/* Narrow: the centre link, then four plain lists. */
	.centre-link {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 2.75rem;
		padding: 0.6rem 1.1rem;
		border-radius: var(--site-radius-md);
		background: var(--site-accent);
		color: var(--site-on-accent);
		font-weight: 700;
		text-decoration: none;
	}

	.lists {
		display: grid;
		gap: 1.25rem;
		margin-top: 1.5rem;
	}

	.list-label {
		color: var(--site-ink);
		font: 700 0.8125rem var(--site-font-mono);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.lists ul {
		display: grid;
		gap: 0.1rem;
		margin: 0.35rem 0 0;
		padding: 0;
		list-style: none;
	}

	.lists li {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
		min-height: 2.5rem;
		border-bottom: 1px solid var(--site-line);
	}

	.lists li a {
		color: var(--site-ink);
		text-decoration: underline;
		text-decoration-color: var(--site-line-strong);
		text-underline-offset: 0.2em;
	}

	.list-chip {
		padding: 0.05rem 0.5rem;
		border: 1px dashed var(--site-muted);
		border-radius: 999px;
		color: var(--site-muted);
		font: 500 0.75rem var(--site-font-mono);
	}

	.map {
		display: none;
	}

	/*
	 * 768px and wider: the SVG. Its 720-unit viewBox scales to the container, and
	 * the smallest font in it is 13 units, so text stays at 12px or more down to
	 * a rendered width of 665px. `compact` (the homepage) stops growing at 46rem
	 * (about 1.02x); `full` (/blocks) at 60rem (1.33x).
	 */
	@media (min-width: 768px) {
		.centre-link,
		.lists {
			display: none;
		}

		.map {
			display: block;
			width: 100%;
			height: auto;
			margin: 0 auto;
			overflow: visible;
		}

		.block-map[data-layout='compact'] .map {
			max-width: 46rem;
		}

		.block-map[data-layout='full'] .map {
			max-width: 60rem;
		}
	}

	.wires path {
		fill: none;
		stroke: var(--site-muted);
		stroke-opacity: 0.3;
		stroke-width: 1.25;
	}

	.map text {
		fill: var(--site-ink);
		font-family: var(--site-font-sans);
		font-size: 15px;
		font-weight: 500;
	}

	.branch rect {
		fill: var(--site-paper-deep);
		stroke: var(--site-accent-strong);
		stroke-width: 2;
	}

	.branch text {
		font-size: 16px;
		font-weight: 700;
	}

	.leaf {
		cursor: pointer;
		outline: none;
		text-decoration: none;
	}

	.leaf rect {
		fill: var(--site-surface);
		stroke: var(--site-line-strong);
		stroke-width: 1.5;
	}

	.leaf.preview rect {
		stroke: var(--site-muted);
		stroke-dasharray: 5 3;
	}

	.leaf .preview-text {
		fill: var(--site-muted);
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0;
		text-transform: none;
	}

	.leaf:hover rect,
	.leaf:focus-visible rect,
	.centre:hover rect,
	.centre:focus-visible rect {
		stroke: var(--site-accent-strong);
		stroke-width: 3;
	}

	.leaf:hover text,
	.leaf:focus-visible text {
		text-decoration: underline;
	}

	.centre {
		cursor: pointer;
		outline: none;
		text-decoration: none;
	}

	.centre rect {
		fill: var(--site-accent);
		stroke: var(--site-accent-ink);
		stroke-width: 2;
	}

	.map .centre text {
		fill: var(--site-on-accent);
		font-size: 18px;
		font-weight: 700;
	}

	.centre:focus-visible rect {
		stroke: var(--site-ink);
	}

	.centre-link:focus-visible,
	.lists a:focus-visible {
		outline: 2px solid var(--site-accent-strong);
		outline-offset: 3px;
	}
</style>
