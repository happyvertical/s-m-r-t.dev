/**
 * Cookieless Matomo page views, mirroring happyvertical.com's tracker config.
 * No cookies are set, so no consent banner is owed.
 *
 * Nothing is sent until `MATOMO_SITE_ID` is set, and then only from the
 * production hostname: staging, PR builds, `vite preview` and local dev all
 * serve the same build artifact and must never report.
 */

export const MATOMO_URL = 'https://matomo.happyvertical.com/';
// TODO(#346): set once the Matomo site exists (a string such as '3'); null disables tracking.
export const MATOMO_SITE_ID: string | null = null;
export const MATOMO_HOSTNAME = 's-m-r-t.dev';

type PaqCommand = [string, ...unknown[]];

export interface MatomoEnv {
	hostname: string;
	paq: PaqCommand[];
	loadScript: (_src: string) => void;
}

export interface MatomoConfig {
	url?: string;
	siteId?: string | null;
}

export interface MatomoTracker {
	/** Report a navigation; hash-only changes and repeats of the same page are ignored. */
	pageView(_url: URL, _title: string): void;
}

declare global {
	interface Window {
		_paq?: PaqCommand[];
	}
}

/** Same page for analytics purposes: hash-only jumps are not new page views. */
const pageKey = (url: URL) => url.origin + url.pathname + url.search;

/** Returns null (and does nothing) off-host or while no site ID is configured. */
export function createMatomoTracker(
	env: MatomoEnv,
	{ url = MATOMO_URL, siteId = MATOMO_SITE_ID }: MatomoConfig = {}
): MatomoTracker | null {
	if (!siteId || env.hostname !== MATOMO_HOSTNAME) return null;

	const base = url.replace(/\/+$/, '') + '/';
	const { paq } = env;
	paq.push(['disableCookies']);
	paq.push(['setTrackerUrl', base + 'matomo.php']);
	paq.push(['setSiteId', siteId]);
	paq.push(['enableLinkTracking']);
	env.loadScript(base + 'matomo.js');

	let last: URL | null = null;
	return {
		pageView(next, title) {
			if (last && pageKey(last) === pageKey(next)) return;
			if (last) paq.push(['setReferrerUrl', last.href]);
			paq.push(['setCustomUrl', next.href]);
			paq.push(['setDocumentTitle', title]);
			paq.push(['trackPageView']);
			last = next;
		}
	};
}

/** Browser wiring; call from onMount only (touches window and document). */
export function initMatomo(): MatomoTracker | null {
	const paq = (window._paq = window._paq || []);
	return createMatomoTracker({
		hostname: location.hostname,
		paq,
		loadScript(src) {
			const s = document.createElement('script');
			s.async = true;
			s.src = src;
			document.head.appendChild(s);
		}
	});
}
