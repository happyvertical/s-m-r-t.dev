import { describe, expect, it } from 'vitest';
import { entries as componentEntries } from '../../routes/components/[...legacy]/+page.server';
import { entries as docsEntries } from '../../routes/docs/[...legacy]/+page.server';

describe('legacy static routes', () => {
	it('prerenders every removed component page', async () => {
		const paths = (await componentEntries()).map(({ legacy }) => legacy);

		expect(paths).toHaveLength(110);
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

		expect(paths).toHaveLength(18);
		expect(new Set(paths).size).toBe(paths.length);
		expect(paths).toEqual(
			expect.arrayContaining([
				'components/feedback/confirm-dialog',
				'components/feedback/progress-bar'
			])
		);
	});
});
