import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const legacyEntries = [
	'ui',
	'layout',
	'forms',
	'data',
	'display',
	'feedback',
	'nav',
	'theme',
	'calendar',
	'ai',
	'agents',
	'admin',
	'content',
	'commerce',
	'events',
	'jobs',
	'projects',
	'users'
];

const packageBySection: Record<string, string> = {
	agents: 'smrt-agents',
	admin: 'smrt-svelte',
	content: 'smrt-content',
	commerce: 'smrt-commerce',
	events: 'smrt-events',
	jobs: 'smrt-jobs',
	projects: 'smrt-projects',
	users: 'smrt-users',
	ui: 'smrt-ui',
	theme: 'smrt-ui'
};

export const prerender = true;

export const entries = () => legacyEntries.map((legacy) => ({ legacy }));

export const load: PageServerLoad = ({ params }) => {
	const section = params.legacy?.split('/')[0] ?? '';
	const pkg = packageBySection[section] ?? 'smrt-svelte';
	redirect(301, `/packages/${pkg}`);
};
