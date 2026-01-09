import type { EntryGenerator } from './$types';
import { categories } from '$lib/data/components';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return categories.map((category) => ({
		category: category.slug
	}));
};
