import { redirect } from '@sveltejs/kit';

// Moved under /docs (#365). Prerendered so the old URL keeps answering on the
// static host; legacy-routes.test.ts holds the inventory.
export const prerender = true;

export const load = () => redirect(301, '/docs/reference/evidence');
