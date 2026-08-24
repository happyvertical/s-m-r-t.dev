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

	it('uses the static light theme as the pre-hydration token fallback', () => {
		const variables = readFileSync('src/lib/styles/variables.css', 'utf8');

		expect(variables).toContain('--site-paper: var(--smrt-color-background, #edeff2)');
		expect(variables).toContain('--site-ink: var(--smrt-color-on-background, #14171c)');
		expect(variables).toContain('--site-accent: var(--smrt-color-primary, #e35d12)');
		expect(variables).not.toContain('--site-paper: var(--smrt-color-background, #11150f)');
	});
});
