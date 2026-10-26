import { getBuildingBlock, type BuildingBlock } from '$lib/data/blocks';
import { getPackage, type PackageStatus } from '$lib/data/packages';

/**
 * Status shown beside a block or one of its packages. Derived from
 * `packages.ts`, never typed on a block: a package that is `new` there is
 * Preview here, and a block is Preview when any package behind it is.
 */
export function packageStatusChip(slug: string): string | undefined {
	const status: PackageStatus | undefined = getPackage(slug)?.status;
	return status === 'new' ? 'Preview' : undefined;
}

export function blockIsPreview(block: BuildingBlock): boolean {
	return block.packages.some((slug) => getPackage(slug)?.status === 'new');
}

export function blockIdIsPreview(id: string): boolean {
	const block = getBuildingBlock(id);
	return block ? blockIsPreview(block) : false;
}
