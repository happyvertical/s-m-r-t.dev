import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { siteThemeDefaults } from '$lib/theme';
import { siteTheme } from '$lib/themes/site-theme';

const read = (path: string) => readFileSync(path, 'utf8');

describe('shared site theme', () => {
	it('defines one persisted default for the documentation and Playground', () => {
		expect(siteThemeDefaults).toEqual({
			preset: 'smrt-site',
			colorScheme: 'system',
			persist: true,
			storageKey: 'smrt-site-theme'
		});

		const siteShell = read('src/lib/components/SiteShell.svelte');
		const plannerShell = read('src/lib/components/PlannerShell.svelte');
		const playground = read('src/routes/playground/+page.svelte');
		expect(siteShell).toContain('<AppTheme>');
		expect(plannerShell).toContain('<AppTheme>');
		expect(playground).toContain('<AppTheme>');
		expect(`${siteShell}\n${plannerShell}\n${playground}`).not.toMatch(/preset=["']/);
	});

	it('delivers the theme as static CSS on <html>, not inline on the provider', () => {
		// The --site-* tokens live on :root; inline variables on the provider's
		// wrapper would be out of their reach, and of <body>'s.
		const appTheme = read('src/lib/components/AppTheme.svelte');
		expect(appTheme).toContain("import '$lib/styles/site-theme.css'");
		expect(appTheme).toContain('inlineVariables={false}');
		expect(read('src/lib/styles/site-theme.css')).toContain(
			'[data-theme="smrt-site"][data-color-scheme="dark"]'
		);
	});

	it("falls back to the theme's light values before the attributes are stamped", () => {
		const variables = read('src/lib/styles/variables.css');
		const { light } = siteTheme;

		expect(variables).toContain(`--site-paper: var(--smrt-color-background, ${light.background})`);
		expect(variables).toContain(
			`--site-ink: var(--smrt-color-on-background, ${light.onBackground})`
		);
		expect(variables).toContain(`--site-accent: var(--smrt-color-primary, ${light.primary})`);
		expect(variables).toContain(
			`--site-sunken: var(--smrt-color-surface-container, ${light.surfaceContainer})`
		);
		expect(variables).toContain(
			`--site-muted: var(--smrt-color-on-surface-variant, ${light.onSurfaceVariant})`
		);
		expect(variables).toContain(
			`--site-line: var(--smrt-color-outline-variant, ${light.outlineVariant})`
		);
		expect(variables).toContain(
			`--site-brass-ink: var(--smrt-color-secondary, ${light.secondary})`
		);
	});

	it('has one pine fill and one code panel pair, and no stand-in accent tokens', () => {
		const variables = read('src/lib/styles/variables.css');
		expect(variables).toContain('--site-fill: #1d6a3c;');
		expect(variables).toContain('--site-on-fill: #ffffff;');
		expect(variables).toContain('--site-brass: #d4a017;');
		expect(variables).toMatch(/:root \{[^}]*--site-code-bg: #101817;/);
		expect(variables).toMatch(/html\[data-color-scheme='dark'\] \{[^}]*--site-code-bg: #080d0c;/);
		// Retired with the smrt preset's 3.6:1 pair (#332, smrt#2071).
		expect(variables).not.toMatch(/--site-accent-ink|--site-on-accent/);
	});

	it('loads the faces the font tokens name', () => {
		const fonts = read('src/app.html');
		expect(fonts).toContain('family=Gabarito:wght@700;800');
		expect(fonts).toContain('family=Inter:');
		expect(fonts).toContain('family=JetBrains+Mono');

		const variables = read('src/lib/styles/variables.css');
		expect(variables).toMatch(/--site-font-sans: var\(--smrt-font-family, Inter,/);
		expect(variables).toMatch(/--site-font-display: var\([^)]*Gabarito,/);
		expect(variables).toMatch(/--site-font-mono: var\([^)]*'JetBrains Mono',/);
		expect(variables).not.toContain("Avenir Next', Avenir");
		expect(siteTheme.fontFamily).toMatch(/^Inter,/);
	});

	it('names one browser theme colour in the manifest and the page', () => {
		const manifest = JSON.parse(read('static/manifest.webmanifest')) as {
			theme_color: string;
			background_color: string;
		};
		const meta = /<meta name="theme-color" content="(#[0-9a-f]{6})"/.exec(
			read('src/routes/+layout.svelte')
		);
		expect(meta?.[1]).toBe(manifest.theme_color);
		expect(manifest.theme_color).toBe(siteTheme.light.primary);
		expect(manifest.background_color).toBe(siteTheme.light.background);
	});
});
