import { redirect } from '@sveltejs/kit';

// The ground-up SvelteKit page became the smrt-start page (#338). Prerendered
// so the old URL keeps answering on the static host.
export const prerender = true;

export const load = () => redirect(301, '/starters/smrt-start');
