<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ThemeProvider } from '@happyvertical/smrt-ui/themes';
	import { siteThemeDefaults } from '$lib/theme';
	// The site theme's tokens as static CSS, keyed on the `data-theme` and
	// `data-color-scheme` the provider stamps on <html>. A custom theme
	// otherwise puts them inline on the provider's wrapper, below <html> and
	// <body>, where the `--site-*` tokens on :root could not read them.
	import '$lib/styles/site-theme.css';

	let { children }: { children: Snippet } = $props();
</script>

<ThemeProvider
	preset={siteThemeDefaults.preset}
	colorScheme={siteThemeDefaults.colorScheme}
	persist={siteThemeDefaults.persist}
	storageKey={siteThemeDefaults.storageKey}
	inlineVariables={false}
>
	{@render children()}
</ThemeProvider>
