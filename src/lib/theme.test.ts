import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { siteThemeDefaults } from '$lib/theme';

describe('shared site theme', () => {
	it('defines one persisted default for the documentation and Playground', () => {
		expect(siteThemeDefaults).toEqual({
			preset: 'smrt',
			colorScheme: 'system',
			persist: true,
			storageKey: 'smrt-docs-theme'
		});

		const siteShell = readFileSync('src/lib/components/SiteShell.svelte', 'utf8');
		const playground = readFileSync('src/routes/playground/+page.svelte', 'utf8');
		expect(siteShell).toContain('<AppTheme>');
		expect(playground).toContain('<AppTheme>');
		expect(`${siteShell}\n${playground}`).not.toMatch(/preset=["']/);
	});
});
