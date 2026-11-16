import type { ColorScheme, ThemePreset } from '@happyvertical/smrt-ui/themes';
// Importing the theme registers it, so every `AppTheme` mount can resolve it.
import { siteTheme } from '$lib/themes/site-theme';

export interface SiteThemeDefaults {
	preset: ThemePreset;
	colorScheme: ColorScheme;
	persist: boolean;
	storageKey: string;
}

export const siteThemeDefaults: SiteThemeDefaults = {
	preset: siteTheme.id,
	colorScheme: 'system',
	persist: true,
	// Not the pre-#401 `smrt-docs-theme`: that key holds `preset: 'smrt'`, still a
	// valid preset, so a returning visitor would have kept the old theme.
	storageKey: 'smrt-site-theme'
};
