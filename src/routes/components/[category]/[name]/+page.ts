import type { EntryGenerator } from './$types';
import { categories } from '$lib/data/components';

export const prerender = true;

export const entries: EntryGenerator = () => {
	const entries: Array<{ category: string; name: string }> = [];

	for (const category of categories) {
		for (const component of category.components) {
			entries.push({
				category: category.slug,
				name: component.slug
			});
		}
	}

	return entries;
};
