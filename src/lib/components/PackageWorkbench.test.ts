import { cleanup, fireEvent, render } from '@testing-library/svelte';
import { afterEach, expect, it, vi } from 'vitest';
import { packages } from '$lib/data/packages';
import PackageWorkbench from './PackageWorkbench.svelte';

vi.mock('$app/navigation', () => ({ afterNavigate: () => {} }));
afterEach(cleanup);

it('keeps every static documentation tab in the DOM and displays only the selected panel', async () => {
	const pkg = packages.find((pkg) => pkg.exampleResource)!;
	const { container } = render(PackageWorkbench, { pkg });
	const panels = [...container.querySelectorAll<HTMLElement>('[role="tabpanel"]')];
	expect(panels).toHaveLength(7);
	for (const panel of panels) {
		expect(panel.textContent?.trim().length).toBeGreaterThan(20);
		expect(panel.hidden).toBe(panel.id !== 'panel-overview');
	}
	expect(container.querySelector('.playground-shell')).toBeNull();
	const rest = container.querySelector<HTMLButtonElement>('[aria-controls="panel-rest"]')!;
	await fireEvent.click(rest);
	expect(rest.getAttribute('aria-selected')).toBe('true');
	expect(panels.filter((panel) => !panel.hidden).map((panel) => panel.id)).toEqual(['panel-rest']);
	expect(new URL(window.location.href).searchParams.get('tab')).toBe('rest');
	expect(container.querySelector('.playground-shell')).toBeNull();
});
