import { describe, it, expect } from 'vitest';
import { capabilityGuides, foundationGuides } from '$lib/data/guides';
import { docsNavigation } from '$lib/data/navigation';
import { packages } from '$lib/data/packages';
import { referenceGuides } from '$lib/data/reference';
import { toolingGuides } from '$lib/data/tooling';
import { docsTrack, packageNeighbors, packageTrack, trackNeighbors } from '$lib/data/track';

describe('documentation track', () => {
	it('follows the sidebar order exactly', () => {
		expect(docsTrack.map((step) => step.href)).toEqual(
			docsNavigation.flatMap((group) => group.items.map((item) => item.href))
		);
	});

	it('covers every guide page rendered by GuidePage', () => {
		const guidePages = [
			...foundationGuides.map((guide) => `/foundations/${guide.slug}`),
			...capabilityGuides.map((guide) => `/capabilities/${guide.slug}`),
			...toolingGuides.map((guide) => `/tooling/${guide.slug}`),
			...referenceGuides.map((guide) => `/reference/${guide.slug}`)
		];

		for (const href of guidePages) {
			expect(trackNeighbors(href), `${href} is not on the track`).not.toBeNull();
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
		const href = `/reference/${referenceGuides[0].slug}`;
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
