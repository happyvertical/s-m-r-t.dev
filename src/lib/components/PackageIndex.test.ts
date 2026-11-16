import { cleanup, render } from '@testing-library/svelte';
import { afterEach, expect, it } from 'vitest';
import { packages } from '$lib/data/packages';
import PackageIndex from './PackageIndex.svelte';

afterEach(cleanup);

it('lists a version for published packages and none for private ones', () => {
	const { container } = render(PackageIndex);
	const cards = [...container.querySelectorAll<HTMLElement>('.package-list a')];
	for (const pkg of packages) {
		const card = cards.find((c) => c.querySelector('code')?.textContent === pkg.name);
		expect(card, pkg.name).toBeTruthy();
		const label = card!.querySelector('.package-name span')?.textContent;
		if (pkg.status === 'private') expect(label).toBeUndefined();
		else expect(label).toBe(`v${pkg.version}`);
	}
});
