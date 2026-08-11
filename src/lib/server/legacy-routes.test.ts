import { describe, expect, it } from 'vitest';
import { packages } from '$lib/data/packages';
import { entries as componentEntries } from '../../routes/components/[...legacy]/+page.server';
import { entries as docsEntries } from '../../routes/docs/[...legacy]/+page.server';
import { entries as moduleEntries } from '../../routes/modules/[slug]/+page.server';

const RESTORE_DONT_RENUMBER =
	'A prerendered redirect is a live URL. If this count dropped, restore the removed ' +
	'entry rather than updating the number — the site is static, so the path it covered ' +
	'is a hard 404 in production the moment it stops being generated.';

describe('legacy static routes', () => {
	it('prerenders every removed component page', async () => {
		const paths = (await componentEntries()).map(({ legacy }) => legacy);

		expect(paths, RESTORE_DONT_RENUMBER).toHaveLength(110);
		expect(new Set(paths).size).toBe(paths.length);
		expect(paths).toEqual(
			expect.arrayContaining([
				'forms/text-input',
				'ui/button',
				'hooks',
				'hooks/use-app-state',
				'memberships/membership-card',
				'permissions/permission-check',
				'roles/role-badge',
				'tenants/tenant-switcher'
			])
		);
	});

	it('prerenders every removed documentation page', async () => {
		const paths = (await docsEntries()).map(({ legacy }) => legacy);

		expect(paths, RESTORE_DONT_RENUMBER).toHaveLength(18);
		expect(new Set(paths).size).toBe(paths.length);
		expect(paths).toEqual(
			expect.arrayContaining([
				'components/feedback/confirm-dialog',
				'components/feedback/progress-bar'
			])
		);
	});

	it('prerenders the module slugs that never became packages', async () => {
		const paths = (await moduleEntries()).map(({ slug }) => slug);

		// Every package redirects from /modules/<slug> automatically. These three
		// do not correspond to a package, so they exist only as hand-written
		// entries and are the ones a cleanup would quietly drop.
		expect(paths.filter((slug) => !packages.some((pkg) => pkg.slug === slug))).toEqual([
			'browser-ai',
			'template-sveltekit',
			'template-site-static-json'
		]);
		expect(paths, RESTORE_DONT_RENUMBER).toHaveLength(packages.length + 3);
		expect(new Set(paths).size).toBe(paths.length);
	});
});
