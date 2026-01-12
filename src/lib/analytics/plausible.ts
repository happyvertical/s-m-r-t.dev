/**
 * Plausible Analytics Integration
 *
 * To enable:
 * 1. Sign up at https://plausible.io
 * 2. Add your domain
 * 3. Set VITE_PLAUSIBLE_DOMAIN in .env
 * 4. Uncomment the script tag in +layout.svelte
 */

interface PlausibleOptions {
	props?: Record<string, string | number | boolean>;
	callback?: () => void;
}

/**
 * Track a custom event in Plausible
 * @param eventName - Name of the event (e.g., "Download", "Signup")
 * @param options - Optional event properties and callback
 */
export function trackEvent(eventName: string, options?: PlausibleOptions): void {
	if (typeof window === 'undefined') return;

	const plausible = (window as any).plausible;
	if (!plausible) {
		console.warn('Plausible not loaded. Install script tag in layout.');
		return;
	}

	plausible(eventName, options);
}

/**
 * Track outbound link click
 * @param url - The destination URL
 */
export function trackOutboundLink(url: string): void {
	trackEvent('Outbound Link: Click', { props: { url } });
}

/**
 * Track file download
 * @param filename - Name of the downloaded file
 */
export function trackDownload(filename: string): void {
	trackEvent('File: Download', { props: { filename } });
}

/**
 * Track component view (for documentation pages)
 * @param componentName - Name of the component being viewed
 */
export function trackComponentView(componentName: string): void {
	trackEvent('Component: View', { props: { component: componentName } });
}

/**
 * Track module view (for module documentation pages)
 * @param moduleName - Name of the module being viewed
 */
export function trackModuleView(moduleName: string): void {
	trackEvent('Module: View', { props: { module: moduleName } });
}
