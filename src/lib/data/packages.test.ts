import { describe, it, expect } from 'vitest';
import { getPackage, packageStatusLabels, packages } from '$lib/data/packages';

describe('package status', () => {
	it('marks smrt-gnode as an unimplemented stub', () => {
		const gnode = getPackage('smrt-gnode');

		// Upstream README at v0.40.61: "Status: stubs only -- not implemented."
		// If gnode is ever implemented, this expectation is the thing to revisit.
		expect(gnode?.status).toBe('stub');
		expect(gnode?.notice?.variant).toBe('warning');
		expect(gnode?.summary).not.toMatch(/federation building blocks/i);
	});

	it('gives every stub package an up-front notice so the status cannot be missed', () => {
		for (const pkg of packages.filter((entry) => entry.status === 'stub')) {
			expect(pkg.notice, `${pkg.slug} is a stub without a notice`).toBeDefined();
			expect(pkg.notice?.body.length).toBeGreaterThan(0);
		}
	});

	it('has a label for every non-default status in use', () => {
		for (const pkg of packages) {
			if (!pkg.status || pkg.status === 'stable') continue;
			expect(packageStatusLabels[pkg.status]).toBeTruthy();
		}
	});
});

describe('retired MCP tier and plane terminology (#197)', () => {
	it('never reintroduces the Tier 1/2 or development/runtime plane taxonomy Tooling retired', () => {
		const packageText = JSON.stringify(packages);

		expect(packageText).not.toMatch(/\bTier[\s-]?[12]\b/i);
		expect(packageText).not.toMatch(/development plane/i);
		expect(packageText).not.toMatch(/runtime plane/i);
		expect(packageText).not.toMatch(/data-plane/i);
	});
});

describe('packages published without a page (#387)', () => {
	const added = [
		'smrt-app-shell',
		'smrt-bookings',
		'smrt-desktop',
		'smrt-education',
		'smrt-reactions',
		'smrt-spreadsheets',
		'smrt-vault-relay',
		'smrt-workflows'
	];

	it('has a page with a summary, highlights, and details for each', () => {
		for (const slug of added) {
			const pkg = getPackage(slug);
			expect(pkg, `${slug} has no package page`).toBeDefined();
			expect(pkg?.name).toBe(`@happyvertical/${slug}`);
			expect(pkg?.highlights.length, `${slug} has no highlights`).toBeGreaterThan(0);
			expect(pkg?.details.length, `${slug} has no details`).toBeGreaterThan(0);
		}
	});

	it('uses each slug once', () => {
		const slugs = packages.map((pkg) => pkg.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
	});
});

describe('private mobile packages (#387)', () => {
	it('tells readers the source packages are not published to npm', () => {
		for (const slug of ['smrt-android', 'smrt-ios', 'smrt-mobile']) {
			const pkg = getPackage(slug);
			expect(pkg?.status).toBe('private');
			expect(pkg?.notice?.body, `${slug} has no source-only notice`).toMatch(
				/not published to npm/
			);
			expect(pkg?.notice?.body).toContain(`packages/${slug}`);
		}
	});
});

describe('smrt-jobs schedule time zone (#387)', () => {
	it('does not claim that cron matching ignores the schedule time zone', () => {
		const text = JSON.stringify(getPackage('smrt-jobs'));

		expect(text).not.toMatch(/not timezone-aware/i);
		expect(text).toMatch(/IANA timezone/);
	});
});
