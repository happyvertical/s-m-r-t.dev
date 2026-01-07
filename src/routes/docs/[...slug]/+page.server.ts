import { getDoc } from '$lib/server/docs';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const MAPPINGS: Record<string, string> = {
	'objects': 'api/core/classes/SmrtObject',
	'collection': 'api/core/classes/SmrtCollection',
	'agent': 'api/agents/classes/Agent',
	'smrt-cli': 'cli',
	'smrt-auth': 'api/accounts/index',
	'smrt-db': 'core',
	'smrt-ai': 'api/core/interfaces/AiConfig'
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
