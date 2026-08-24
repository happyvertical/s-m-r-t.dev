<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ThemeProvider } from '@happyvertical/smrt-ui/themes';
	import { siteThemeDefaults } from '$lib/theme';

	let { children }: { children: Snippet } = $props();
</script>

<ThemeProvider
	preset={siteThemeDefaults.preset}
	colorScheme={siteThemeDefaults.colorScheme}
	persist={siteThemeDefaults.persist}
	storageKey={siteThemeDefaults.storageKey}
>
	{@render children()}
</ThemeProvider>
