import type { ColorScheme, ThemePreset } from '@happyvertical/smrt-ui/themes';

export interface SiteThemeDefaults {
	preset: ThemePreset;
	colorScheme: ColorScheme;
	persist: boolean;
	storageKey: string;
}

export const siteThemeDefaults: SiteThemeDefaults = {
	preset: 'smrt',
	colorScheme: 'system',
	persist: true,
	storageKey: 'smrt-docs-theme'
};
