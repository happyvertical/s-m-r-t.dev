import { redirect } from '@sveltejs/kit';

export const prerender = true;

// The #358 /blocks landing became /features in the #361 redesign.
export const load = () => redirect(301, '/features');
