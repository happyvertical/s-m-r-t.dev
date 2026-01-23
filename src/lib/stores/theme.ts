import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'smrt-theme';

function getStoredTheme(): Theme {
	if (!browser) return 'system';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark' || stored === 'system') {
		return stored;
	}
	return 'system';
}

function getSystemTheme(): 'light' | 'dark' {
	if (!browser) return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
	return theme === 'system' ? getSystemTheme() : theme;
}

function createThemeStore() {
	// Initialize with 'system' for SSR, will be hydrated on client
	const { subscribe, set, update } = writable<Theme>('system');

	return {
		subscribe,
		set: (value: Theme) => {
			if (browser) {
				localStorage.setItem(STORAGE_KEY, value);
				applyTheme(value);
			}
			set(value);
		},
		toggle: () => {
			update((current) => {
				const effective = getEffectiveTheme(current);
				const next = effective === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem(STORAGE_KEY, next);
					applyTheme(next);
				}
				return next;
			});
		},
		// Initialize from localStorage on client
		init: () => {
			if (browser) {
				const stored = getStoredTheme();
				set(stored);
				applyTheme(stored);
			}
		}
	};
}

export function applyTheme(theme: Theme) {
	if (!browser) return;
	const effective = getEffectiveTheme(theme);
	document.documentElement.setAttribute('data-theme', effective);
}

export const theme = createThemeStore();
