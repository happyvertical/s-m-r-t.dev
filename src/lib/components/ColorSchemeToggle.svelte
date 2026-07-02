<script lang="ts">
	/**
	 * Local light/dark toggle. Replaces the ColorSchemeToggle that shipped in
	 * smrt-svelte's (0.37-removed) theme system. Sets `data-color-scheme` on
	 * <html>, which the vendored token CSS (src/lib/themes/smrt-theme.css) reads,
	 * and persists the choice to localStorage. Until it mounts, the CSS falls
	 * back to `prefers-color-scheme`, so there's no wrong-mode flash for the
	 * common case.
	 */
	import { onMount } from 'svelte';

	let scheme = $state<'light' | 'dark'>('light');

	onMount(() => {
		const stored = localStorage.getItem('color-scheme');
		if (stored === 'light' || stored === 'dark') {
			scheme = stored;
		} else {
			scheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		document.documentElement.setAttribute('data-color-scheme', scheme);
	});

	function toggle() {
		scheme = scheme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('color-scheme', scheme);
		document.documentElement.setAttribute('data-color-scheme', scheme);
	}
</script>

<button
	type="button"
	class="cs-toggle"
	onclick={toggle}
	aria-label="Switch to {scheme === 'dark' ? 'light' : 'dark'} mode"
	title="Switch to {scheme === 'dark' ? 'light' : 'dark'} mode"
>
	{#if scheme === 'dark'}
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<circle cx="12" cy="12" r="5" />
			<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
		</svg>
	{/if}
</button>

<style>
	.cs-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		padding: 0;
		border: 1px solid var(--smrt-color-outline, #e5e5e5);
		border-radius: var(--smrt-shape-small, 6px);
		background: var(--smrt-color-surface, #ffffff);
		color: var(--smrt-color-on-surface-variant, #666);
		cursor: pointer;
		transition:
			border-color 0.2s,
			color 0.2s;
	}

	.cs-toggle:hover {
		border-color: var(--smrt-color-primary, #1976d2);
		color: var(--smrt-color-primary, #1976d2);
	}
</style>
