import { describe, expect, it } from 'vitest';
import { MATOMO_SITE_ID, createMatomoTracker, type MatomoEnv } from './matomo';

type Command = [string, ...unknown[]];

const config = { url: 'https://matomo.example/', siteId: '7' };

function env(hostname = 'smrt.happyvertical.com') {
	const scripts: string[] = [];
	const paq: Command[] = [];
	const e: MatomoEnv & { paq: Command[] } = {
		hostname,
		paq,
		push: (c) => paq.push(c),
		loadScript: (s) => scripts.push(s)
	};
	return { e, scripts };
}

describe('matomo tracker', () => {
	it('is a no-op off the production host', () => {
		for (const host of [
			'localhost',
			'staging.smrt.happyvertical.com',
			'www.smrt.happyvertical.com',
			'x.s3.amazonaws.com'
		]) {
			const { e, scripts } = env(host);
			expect(createMatomoTracker(e, config)).toBeNull();
			expect(e.paq).toEqual([]);
			expect(scripts).toEqual([]);
		}
	});

	it('is a no-op while the site ID is unset', () => {
		const { e, scripts } = env();
		expect(createMatomoTracker(e, { url: config.url, siteId: null })).toBeNull();
		expect(e.paq).toEqual([]);
		expect(scripts).toEqual([]);
	});

	it('configures a cookieless tracker and loads matomo.js', () => {
		const { e, scripts } = env();
		expect(createMatomoTracker(e, config)).not.toBeNull();
		expect(e.paq).toEqual([
			['disableCookies'],
			['setTrackerUrl', 'https://matomo.example/matomo.php'],
			['setSiteId', '7'],
			['enableLinkTracking']
		]);
		expect(scripts).toEqual(['https://matomo.example/matomo.js']);
	});

	it('reports one page view per navigation with referrer, url and title', () => {
		const { e } = env();
		const t = createMatomoTracker(e, config)!;
		e.paq.length = 0;
		t.pageView(new URL('https://smrt.happyvertical.com/'), 'Home');
		t.pageView(new URL('https://smrt.happyvertical.com/framework'), 'Framework');
		expect(e.paq).toEqual([
			['setCustomUrl', 'https://smrt.happyvertical.com/'],
			['setDocumentTitle', 'Home'],
			['trackPageView'],
			['setReferrerUrl', 'https://smrt.happyvertical.com/'],
			['setCustomUrl', 'https://smrt.happyvertical.com/framework'],
			['setDocumentTitle', 'Framework'],
			['trackPageView']
		]);
	});

	it('ignores hash-only changes and repeats of the same page', () => {
		const { e } = env();
		const t = createMatomoTracker(e, config)!;
		t.pageView(new URL('https://smrt.happyvertical.com/saadl'), 'SAADL');
		t.pageView(new URL('https://smrt.happyvertical.com/saadl#layers'), 'SAADL');
		t.pageView(new URL('https://smrt.happyvertical.com/saadl'), 'SAADL');
		expect(e.paq.filter((c) => c[0] === 'trackPageView')).toHaveLength(1);
		t.pageView(new URL('https://smrt.happyvertical.com/saadl?view=a'), 'SAADL');
		expect(e.paq.filter((c) => c[0] === 'trackPageView')).toHaveLength(2);
	});
});

describe('matomo queue swap', () => {
	it('keeps reporting after matomo.js replaces the queue', () => {
		// matomo.js swaps window._paq for its own object on load; pushes must follow it.
		let queue: Command[] = [];
		const tracker = createMatomoTracker(
			{ hostname: 'smrt.happyvertical.com', push: (c) => queue.push(c), loadScript: () => {} },
			config
		);
		tracker?.pageView(new URL('https://smrt.happyvertical.com/starters'), 'Getting Started');
		const loaded: Command[] = [];
		queue = loaded; // the script has loaded and taken over the queue
		tracker?.pageView(
			new URL('https://smrt.happyvertical.com/starters/smrt-start'),
			'Clone smrt-start'
		);
		expect(loaded).toContainEqual([
			'setCustomUrl',
			'https://smrt.happyvertical.com/starters/smrt-start'
		]);
		expect(loaded).toContainEqual(['trackPageView']);
	});
});

describe('matomo config', () => {
	it('ships site 31 on matomo.happyvertical.com', () => {
		expect(MATOMO_SITE_ID).toBe('31');
	});
});
