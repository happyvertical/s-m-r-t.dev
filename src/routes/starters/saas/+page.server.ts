import { redirect } from '@sveltejs/kit';

// The SaaS starter page was retired with smrt-saas-starter (#338). Prerendered
// so the old URL keeps answering on the static host.
export const prerender = true;

export const load = () => redirect(301, '/docs/getting-started');
