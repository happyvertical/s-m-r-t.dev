import { error } from '@sveltejs/kit';
import { buildingBlocks, getBuildingBlock } from '$lib/data/blocks';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => buildingBlocks.map((block) => ({ slug: block.id }));

export const load: PageLoad = ({ params }) => {
	const block = getBuildingBlock(params.slug);
	if (!block) error(404, 'Building block not found');
	return { block };
};
