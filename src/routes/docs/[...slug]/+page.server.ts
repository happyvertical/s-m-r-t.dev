import { getDoc, listDocs } from '$lib/server/docs';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, EntryGenerator } from './$types';

const MAPPINGS: Record<string, string> = {
	objects: 'api/core/classes/SmrtObject',
	collection: 'api/core/classes/SmrtCollection',
	agent: 'api/agents/classes/Agent',
	'smrt-cli': 'cli',
	'smrt-db': 'core',
	'smrt-ai': 'api/core/interfaces/AiConfig',
	foundations: 'core'
};

export const prerender = true;

const STATIC_PAGES = ['agents', 'collections', 'components', 'objects'];

export const entries: EntryGenerator = () => {
	const docs = listDocs();
	return docs
		.filter((slug) => !STATIC_PAGES.includes(slug.split('/')[0]))
		.map((slug) => ({ slug }));
};

export const load: PageServerLoad = async ({ params }) => {
	const slug = MAPPINGS[params.slug] || params.slug || 'index';
	const doc = await getDoc(slug);

	if (!doc) {
		throw error(404, 'Documentation not found');
	}

	return {
		doc
	};
};
