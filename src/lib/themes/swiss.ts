/**
 * Swiss Design Theme
 *
 * A custom theme for s-m-r-t.dev based on Swiss/International Typographic Style.
 * Clean, grid-based, with strong typography and minimal embellishment.
 */

import { createTheme } from '@happyvertical/smrt-svelte/themes';
import type { Theme } from '@happyvertical/smrt-svelte/themes';

export const swissTheme: Theme = createTheme({
	id: 'swiss',
	name: 'Swiss',
	extend: 'studio', // Start from Studio as base (clean, minimal)

	light: {
		// Swiss Red accent (inspired by Svelte orange but more Swiss)
		primary: '#e63946',
		onPrimary: '#ffffff',
		primaryContainer: '#ffe5e7',
		onPrimaryContainer: '#9d1c26',

		// Neutral grays (Swiss design uses black, white, and grays)
		secondary: '#457b9d',
		onSecondary: '#ffffff',
		secondaryContainer: '#e8f1f5',
		onSecondaryContainer: '#1d3a4c',

		// Tertiary - muted blue
		tertiary: '#1d3557',
		onTertiary: '#ffffff',
		tertiaryContainer: '#d4e0f0',
		onTertiaryContainer: '#0f1f33',

		// Background - off-white for easier reading
		background: '#fafafa',
		onBackground: '#1a1a1a',

		// Surface - pure white for cards
		surface: '#ffffff',
		onSurface: '#1a1a1a',
		surfaceVariant: '#f0f0f0',
		onSurfaceVariant: '#4a4a4a',
		surfaceContainer: '#f5f5f5',
		surfaceContainerLow: '#fafafa',
		surfaceContainerHigh: '#e8e8e8',
		surfaceContainerHighest: '#dddddd',
		surfaceContainerLowest: '#ffffff',
		surfaceDim: '#e0e0e0',
		surfaceBright: '#ffffff',

		// Error - clear red
		error: '#dc2626',
		onError: '#ffffff',
		errorContainer: '#fee2e2',
		onErrorContainer: '#991b1b',

		// Success - Swiss green
		success: '#059669',
		onSuccess: '#ffffff',
		successContainer: '#d1fae5',
		onSuccessContainer: '#065f46',

		// Warning - amber
		warning: '#d97706',
		onWarning: '#ffffff',
		warningContainer: '#fef3c7',
		onWarningContainer: '#92400e',

		// Borders - subtle gray
		outline: '#e5e5e5',
		outlineVariant: '#f0f0f0',

		// Inverse
		inverseSurface: '#1a1a1a',
		inverseOnSurface: '#fafafa',
		inversePrimary: '#ff6b75',

		// Shadows
		shadow: '#000000',
		scrim: 'rgba(0, 0, 0, 0.5)'
	},

	dark: {
		primary: '#ff6b75',
		onPrimary: '#4a0510',
		primaryContainer: '#9d1c26',
		onPrimaryContainer: '#ffe5e7',

		secondary: '#7fb3d5',
		onSecondary: '#0a1f2e',
		secondaryContainer: '#1d3a4c',
		onSecondaryContainer: '#e8f1f5',

		tertiary: '#a8b8d8',
		onTertiary: '#050f1f',
		tertiaryContainer: '#0f1f33',
		onTertiaryContainer: '#d4e0f0',

		background: '#0a0a0a',
		onBackground: '#f0f0f0',

		surface: '#141414',
		onSurface: '#f0f0f0',
		surfaceVariant: '#1f1f1f',
		onSurfaceVariant: '#a0a0a0',
		surfaceContainer: '#1a1a1a',
		surfaceContainerLow: '#0f0f0f',
		surfaceContainerHigh: '#2a2a2a',
		surfaceContainerHighest: '#333333',
		surfaceContainerLowest: '#050505',
		surfaceDim: '#1f1f1f',
		surfaceBright: '#2a2a2a',

		error: '#f87171',
		onError: '#450a0a',
		errorContainer: '#991b1b',
		onErrorContainer: '#fee2e2',

		success: '#34d399',
		onSuccess: '#064e3b',
		successContainer: '#065f46',
		onSuccessContainer: '#d1fae5',

		warning: '#fbbf24',
		onWarning: '#451a03',
		warningContainer: '#92400e',
		onWarningContainer: '#fef3c7',

		outline: '#333333',
		outlineVariant: '#1f1f1f',

		inverseSurface: '#f0f0f0',
		inverseOnSurface: '#0a0a0a',
		inversePrimary: '#e63946',

		shadow: '#000000',
		scrim: 'rgba(0, 0, 0, 0.7)'
	},

	// Swiss typography - clean, geometric, highly legible
	typography: {
		displayLarge: {
			size: '4rem',
			lineHeight: '1.0',
			weight: '700',
			tracking: '-0.03em'
		},
		displayMedium: {
			size: '3rem',
			lineHeight: '1.1',
			weight: '700',
			tracking: '-0.02em'
		},
		displaySmall: {
			size: '2.5rem',
			lineHeight: '1.1',
			weight: '600',
			tracking: '-0.02em'
		},
		headlineLarge: {
			size: '2rem',
			lineHeight: '1.2',
			weight: '600',
			tracking: '-0.01em'
		},
		headlineMedium: {
			size: '1.75rem',
			lineHeight: '1.2',
			weight: '600',
			tracking: '-0.01em'
		},
		headlineSmall: {
			size: '1.5rem',
			lineHeight: '1.2',
			weight: '600',
			tracking: '0'
		},
		titleLarge: {
			size: '1.25rem',
			lineHeight: '1.3',
			weight: '600',
			tracking: '0'
		},
		titleMedium: {
			size: '1rem',
			lineHeight: '1.4',
			weight: '600',
			tracking: '0.01em'
		},
		titleSmall: {
			size: '0.875rem',
			lineHeight: '1.4',
			weight: '600',
			tracking: '0.02em'
		},
		bodyLarge: {
			size: '1.125rem',
			lineHeight: '1.6',
			weight: '400',
			tracking: '0'
		},
		bodyMedium: {
			size: '1rem',
			lineHeight: '1.6',
			weight: '400',
			tracking: '0'
		},
		bodySmall: {
			size: '0.875rem',
			lineHeight: '1.5',
			weight: '400',
			tracking: '0'
		},
		labelLarge: {
			size: '0.875rem',
			lineHeight: '1.4',
			weight: '600',
			tracking: '0.05em'
		},
		labelMedium: {
			size: '0.75rem',
			lineHeight: '1.4',
			weight: '600',
			tracking: '0.1em'
		},
		labelSmall: {
			size: '0.6875rem',
			lineHeight: '1.4',
			weight: '600',
			tracking: '0.1em'
		}
	},

	// Swiss elevation - very minimal, clean shadows
	elevation: {
		0: 'none',
		1: '0 1px 0 0 rgba(0, 0, 0, 0.05)',
		2: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
		3: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
		4: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
		5: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
	},

	// Swiss uses clean geometric fonts
	fontFamily: '"Inter", "Helvetica Neue", "Arial", system-ui, sans-serif'
});

// Note: Theme is registered by the consumer (see +layout.svelte)

export { swissTheme as default };
