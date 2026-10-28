<script lang="ts">
	import { tryGetThemeContext } from '@happyvertical/smrt-ui/themes';

	// The site's one colour-scheme toggle: a moon in light (switches to dark), a
	// sun in dark (switches to light). The theme provider persists the choice.
	let { class: className = '' }: { class?: string } = $props();
	// Without a provider (a bare render in a test) there is nothing to toggle.
	const theme = tryGetThemeContext();
	const nextScheme = $derived(theme?.state.isDark ? 'light' : 'dark');
	const label = $derived(`Switch to ${nextScheme} color scheme`);
</script>

{#if theme}
	<button
		class={className}
		type="button"
		aria-label={label}
		data-next-color-scheme={nextScheme}
		onclick={() => theme?.toggleColorScheme()}
	>
		{#if nextScheme === 'light'}
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<circle cx="12" cy="12" r="3.5"></circle>
				<path
					d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
				></path>
			</svg>
		{:else}
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<path d="M20 15.5A8.4 8.4 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z"></path>
			</svg>
		{/if}
	</button>
{/if}
