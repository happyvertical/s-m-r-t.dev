import { redirect } from '@sveltejs/kit';

// Folded into Framework (#399). Prerendered so the old URL keeps answering on
// the static host; docs-url-inventory.test.ts holds the frozen list.
export const prerender = true;

export const load = () => redirect(301, '/docs/framework/interaction');
