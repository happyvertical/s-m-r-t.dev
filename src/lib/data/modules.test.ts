import { describe, expect, it } from 'vitest';
import { getPlaygroundEntries } from '$lib/data/playgrounds';
import { applicationModuleClusters } from './modules';

const expectedClusters = [
	'Identity and access',
	'Agents and automation',
	'Content and media',
	'Commerce and operations',
	'Support and projects',
	'Analytics and growth',
	'Domain knowledge',
	'Mobile'
];

describe('application module clusters', () => {
	it('defines the eight approved outcome clusters in editorial order', () => {
		expect(applicationModuleClusters.map((cluster) => cluster.title)).toEqual(expectedClusters);
		expect(
			applicationModuleClusters.filter((cluster) => cluster.status === 'foundation')
		).toHaveLength(4);
	});

	it('gives every cluster the complete editorial template', () => {
		for (const cluster of applicationModuleClusters) {
			expect(cluster.summary, `${cluster.title} needs a problem statement`).toBeTruthy();
			expect(cluster.highlights, `${cluster.title} needs models and behavior`).not.toHaveLength(0);
			expect(cluster.details, `${cluster.title} needs frontend details`).not.toHaveLength(0);
			expect(cluster.foundation, `${cluster.title} needs integration details`).not.toHaveLength(0);
			expect(cluster.body, `${cluster.title} needs a time-saved statement`).toBeTruthy();
			expect(cluster.warning, `${cluster.title} needs visible limitations`).not.toHaveLength(0);
			expect(cluster.packages, `${cluster.title} needs package references`).not.toHaveLength(0);
			expect(
				cluster.guides.length > 0 || Boolean(cluster.note),
				`${cluster.title} needs a related Guide or a recorded guide gap`
			).toBe(true);
		}
	});

	it('uses unique package assignments with explicit released status', () => {
		const packages = applicationModuleClusters.flatMap((cluster) => cluster.packages);
		const slugs = packages.map((pkg) => pkg.slug);

		expect(new Set(slugs).size).toBe(slugs.length);
		expect(packages.every((pkg) => pkg.status.length > 0)).toBe(true);
		expect(packages.find((pkg) => pkg.slug === 'smrt-affiliates')?.status).toBe(
			'Deprecated · compatibility only'
		);
		expect(packages.find((pkg) => pkg.slug === 'smrt-gnode')?.status).toBe('Not implemented');
		expect(packages.find((pkg) => pkg.slug === 'smrt-mobile')?.status).toBe('Source distribution');
	});

	it('links only verified, working Playground entries', () => {
		for (const cluster of applicationModuleClusters) {
			const packageSlugs = new Set(cluster.packages.map((pkg) => pkg.slug));
			for (const slug of cluster.demo) {
				expect(packageSlugs.has(slug), `${slug} is not a key package in ${cluster.title}`).toBe(
					true
				);
				expect(
					getPlaygroundEntries(slug).length,
					`${slug} has no verified Playground entries`
				).toBeGreaterThan(0);
			}
		}
	});

	it('does not use plugins as the general name for application modules', () => {
		expect(JSON.stringify(applicationModuleClusters)).not.toMatch(/\bplugins\b/i);
	});
});
