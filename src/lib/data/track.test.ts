import { describe, it, expect } from 'vitest';
import { describePage, guideHref, guidePages } from '$lib/data/guide-families';
import { docsNavigation } from '$lib/data/navigation';
import { packages } from '$lib/data/packages';
import { docsTrack, packageNeighbors, packageTrack, trackNeighbors } from '$lib/data/track';

describe('documentation track', () => {
	it('follows the sidebar order exactly', () => {
		expect(docsTrack.map((step) => step.href)).toEqual(
			docsNavigation.flatMap((group) => group.items.map((item) => item.href))
		);
	});

	it('covers every guide page rendered by GuidePage', () => {
		// Families are discovered rather than listed, so a new one is on trial
		// here from the moment it exists rather than once someone remembers it.
		expect(guidePages.length).toBeGreaterThan(20);

		for (const page of guidePages) {
			const href = guideHref(page);
			expect(
				href !== undefined && trackNeighbors(href) !== null,
				`${describePage(page)} is not on the track — the track flattens docsNavigation, ` +
					'so a page missing here is a page missing from navigation.ts.'
			).toBe(true);
		}
	});

	it('is linearly navigable end to end', () => {
		let step = docsTrack[0];
		const visited = [step.href];

		for (let guard = 0; guard < docsTrack.length; guard += 1) {
			const next = trackNeighbors(step.href)?.next;
			if (!next) break;
			step = next;
			visited.push(step.href);
		}

		expect(visited).toEqual(docsTrack.map((entry) => entry.href));
	});

	it('has no prev at the start and no next at the end', () => {
		expect(trackNeighbors(docsTrack[0].href)?.prev).toBeUndefined();
		expect(trackNeighbors(docsTrack[docsTrack.length - 1].href)?.next).toBeUndefined();
	});

	it('tolerates a trailing slash or query string', () => {
		const href = docsTrack[1].href;
		expect(trackNeighbors(`${href}/`)?.next).toEqual(trackNeighbors(href)?.next);
		expect(trackNeighbors(`${href}?x=1`)?.next).toEqual(trackNeighbors(href)?.next);
	});

	it('returns null for a page outside the track', () => {
		expect(trackNeighbors('/not-a-real-page')).toBeNull();
	});
});

describe('package track', () => {
	it('includes every package exactly once', () => {
		expect(packageTrack).toHaveLength(packages.length);
		expect(new Set(packageTrack.map((step) => step.href)).size).toBe(packages.length);
	});

	it('walks packages in category order', () => {
		const captions = packageTrack.map((step) => step.caption);
		const firstSeen = [...new Set(captions)];
		// Once a category ends it must not resume later in the track.
		expect(captions).toEqual(
			firstSeen.flatMap((category) => captions.filter((caption) => caption === category))
		);
	});

	it('links neighbouring packages', () => {
		const neighbors = packageNeighbors(packageTrack[1].href.replace('/packages/', ''));
		expect(neighbors?.prev?.href).toBe(packageTrack[0].href);
		expect(neighbors?.next?.href).toBe(packageTrack[2].href);
	});

	it('returns null for an unknown package', () => {
		expect(packageNeighbors('not-a-package')).toBeNull();
	});
});
