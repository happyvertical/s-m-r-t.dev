import { describe, expect, it } from 'vitest';
import { packages } from '$lib/data/packages';
import { foundationGuides } from '$lib/data/guides';
import { entries as componentEntries } from '../../routes/components/[...legacy]/+page.server';
import { entries as docsEntries } from '../../routes/docs/[...legacy]/+page.server';
import { entries as moduleEntries } from '../../routes/modules/[slug]/+page.server';
import { entries as foundationEntries } from '../../routes/foundations/[slug]/+page';
import { entries as packageEntries } from '../../routes/packages/[slug]/+page.server';

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

	it('prerenders every /foundations alias redirect', async () => {
		const slugs = (await foundationEntries())
			.map(({ slug }) => slug)
			.filter((slug) => !foundationGuides.some((guide) => guide.slug === slug));

		// These three slugs are old foundation-guide names that were renamed. They
		// exist only as hand-written aliases in foundations/[slug]/+page.ts, so a
		// cleanup there would silently 404 a live URL rather than fail a build.
		expect(slugs, RESTORE_DONT_RENUMBER).toHaveLength(3);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect(slugs).toEqual(
			expect.arrayContaining(['app-model', 'identity-access', 'generated-surfaces'])
		);
	});

	it('prerenders every legacy /packages/<slug> page as a redirect to Reference (62 pages: 61 slugs + the index)', async () => {
		const paths = (await packageEntries()).map(({ slug }) => slug);

		// /packages/[slug] mirrors packages.ts exactly, with no hand-written
		// extras — /packages itself (the +62nd page in this family) is a
		// separate, non-parametrized redirect route with nothing to enumerate.
		expect(paths, RESTORE_DONT_RENUMBER).toHaveLength(61);
		expect(paths).toHaveLength(packages.length);
		expect(new Set(paths).size).toBe(paths.length);
	});

	it('redirects the legacy /packages and /faq singular pages to Reference', async () => {
		const { load: packagesLoad } = await import('../../routes/packages/+page.server');
		const { load: faqLoad } = await import('../../routes/faq/+page.server');

		const redirectTarget = (load: () => never) => {
			try {
				load();
			} catch (response) {
				return response as { status: number; location: string };
			}
			throw new Error('expected a redirect');
		};

		expect(redirectTarget(packagesLoad as () => never)).toMatchObject({
			status: 301,
			location: '/reference/packages'
		});
		expect(redirectTarget(faqLoad as () => never)).toMatchObject({
			status: 301,
			location: '/reference/faq'
		});
	});
});
