import type { PageServerLoad } from './$types';

/**
 * The landing page renders directly. It previously 301'd to /docs; that
 * redirect was removed so `/` shows the ecosystem-overview front page.
 */
export const load: PageServerLoad = () => {
	return {};
};
