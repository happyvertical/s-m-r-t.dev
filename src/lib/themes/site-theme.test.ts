import { describe, expect, it } from 'vitest';
import {
	generateThemeCSS,
	generateThemeVariables,
	getTheme,
	isValidPreset,
	smrtTheme
} from '@happyvertical/smrt-ui/themes';
import {
	BRASS,
	BRASS_INK,
	PINE,
	PINE_BRIGHT,
	SITE_THEME_ID,
	siteTheme
} from '$lib/themes/site-theme';

/** WCAG 2 relative luminance of a `#rrggbb` colour. */
function luminance(hex: string): number {
	const [r, g, b] = [1, 3, 5].map((at) => {
		const channel = Number.parseInt(hex.slice(at, at + 2), 16) / 255;
		return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

const schemes = [
	['light', siteTheme.light],
	['dark', siteTheme.dark]
] as const;

describe('site theme', () => {
	it('is registered under its own id, beside the untouched smrt preset', () => {
		expect(isValidPreset(SITE_THEME_ID)).toBe(true);
		expect(getTheme(siteTheme.id)).toBe(siteTheme);
		expect(getTheme('smrt')).toBe(smrtTheme);
	});

	it('carries the approved tokens (#394)', () => {
		const { light, dark } = siteTheme;
		expect([light.background, dark.background]).toEqual(['#fafaf7', '#0d1312']);
		expect([light.surface, dark.surface]).toEqual(['#ffffff', '#141c1b']);
		expect([light.surfaceContainer, dark.surfaceContainer]).toEqual(['#f1f2ee', '#1a2422']);
		expect([light.onBackground, dark.onBackground]).toEqual(['#17201f', '#e9efed']);
		expect([light.onSurfaceVariant, dark.onSurfaceVariant]).toEqual(['#5b6664', '#9aa8a5']);
		expect([light.outlineVariant, dark.outlineVariant]).toEqual(['#dfe3de', '#27332f']);
		expect([light.primary, dark.primary]).toEqual([PINE, PINE_BRIGHT]);
		expect([PINE, PINE_BRIGHT, BRASS]).toEqual(['#1d6a3c', '#22b35e', '#d4a017']);
		expect(dark.secondary).toBe(BRASS);
		expect(light.secondary).toBe(BRASS_INK);
	});

	it('writes every palette key for both schemes', () => {
		// createTheme() builds dark as { ...light, ...dark }: a key missing from
		// the dark palette would silently carry its light value.
		const { light, dark } = siteTheme;
		expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
		const carried = Object.keys(light).filter(
			(key) => light[key as keyof typeof light] === dark[key as keyof typeof dark]
		);
		expect(carried).toEqual([]);
	});

	it('takes nothing from the smrt preset or the createTheme() defaults', () => {
		const leaked = ['#e35d12', '#ff7a1a', '#64748b', '#8b5cf6', '#22c55e', '#dc2626', '#f59e0b'];
		for (const [, palette] of schemes) {
			for (const value of Object.values(palette)) expect(leaked).not.toContain(value);
		}
	});

	it.each(schemes)('%s: text on each fill clears AA', (_scheme, p) => {
		const pairs: [string, string][] = [
			[p.onPrimary, p.primary],
			[p.onPrimaryContainer, p.primaryContainer],
			[p.onSecondary, p.secondary],
			[p.onSecondaryContainer, p.secondaryContainer],
			[p.onTertiary, p.tertiary],
			[p.onTertiaryContainer, p.tertiaryContainer],
			[p.onError, p.error],
			[p.onErrorContainer, p.errorContainer],
			[p.onWarning, p.warning],
			[p.onWarningContainer, p.warningContainer],
			[p.onSuccess, p.success],
			[p.onSuccessContainer, p.successContainer],
			[p.inverseOnSurface, p.inverseSurface],
			// The site's own fill pair: white on pine, in both schemes.
			['#ffffff', PINE]
		];
		for (const [text, fill] of pairs) {
			expect(contrast(text, fill), `${text} on ${fill}`).toBeGreaterThanOrEqual(4.5);
		}
	});

	it.each(schemes)('%s: text and accent colours clear AA on every surface', (_scheme, p) => {
		const surfaces = [
			p.background,
			p.surface,
			p.surfaceVariant,
			p.surfaceContainer,
			p.surfaceContainerLow,
			p.surfaceContainerHigh,
			p.surfaceContainerHighest,
			p.primaryContainer,
			p.secondaryContainer
		];
		const texts = [
			p.onSurface,
			p.onSurfaceVariant,
			p.primary,
			p.secondary,
			p.tertiary,
			p.error,
			p.warning,
			p.success
		];
		for (const surface of surfaces) {
			for (const text of texts) {
				expect(contrast(text, surface), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
			}
			// A control boundary is non-text: 3:1 (WCAG 1.4.11).
			expect(contrast(p.outline, surface), `outline on ${surface}`).toBeGreaterThanOrEqual(3);
		}
	});

	it('keeps brass off light surfaces as text', () => {
		expect(contrast(BRASS, siteTheme.light.background)).toBeLessThan(4.5);
		expect(contrast(BRASS_INK, siteTheme.light.background)).toBeGreaterThanOrEqual(4.5);
		expect(contrast(BRASS, siteTheme.dark.background)).toBeGreaterThanOrEqual(4.5);
	});

	it('sets Gabarito for display, Inter for body and JetBrains Mono for code', () => {
		const vars = generateThemeVariables(siteTheme, false);
		expect(vars['--smrt-font-family']).toMatch(/^Inter,/);
		expect(vars['--smrt-font-family-mono']).toMatch(/^"JetBrains Mono",/);
		expect(vars['--smrt-typography-headline-large-font-family']).toMatch(/^Gabarito,/);
		expect(vars['--smrt-typography-display-large-font-family']).toMatch(/^Gabarito,/);
		expect(vars['--smrt-typography-body-medium-font-family']).toBe('var(--smrt-font-family)');
	});

	it('matches the static stylesheet the site ships', async () => {
		// Regenerate after editing the theme: pnpm exec vitest run -u src/lib/themes
		const css = [
			'/* Generated from src/lib/themes/site-theme.ts by site-theme.test.ts. Do not edit. */',
			generateThemeCSS(siteTheme, false),
			generateThemeCSS(siteTheme, true),
			''
		].join('\n\n');
		await expect(css).toMatchFileSnapshot('../styles/site-theme.css');
	});
});
