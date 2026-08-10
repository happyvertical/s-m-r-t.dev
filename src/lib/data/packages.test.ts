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
