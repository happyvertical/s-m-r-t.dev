<script lang="ts">
	import { Tooltip } from '@happyvertical/smrt-ui/ui';
	import { getThemeContext } from '@happyvertical/smrt-ui/themes';
	import { useAdminShell } from '@happyvertical/smrt-svelte/workspace';
	import brandMark from '$lib/assets/smrt-mark.svg';
	import DocsSearch from '$lib/components/DocsSearch.svelte';
	import { isPrimaryNavigationActive, primaryNavigation } from '$lib/data/navigation';

	let { pathname }: { pathname: string } = $props();
	let menuOpen = $state(false);
	const shell = useAdminShell();
	const theme = getThemeContext();
	const panelOpen = $derived(shell.panels.top === 'expanded');
	const nextScheme = $derived(theme.state.isDark ? 'light' : 'dark');
	const schemeActionLabel = $derived(`Switch to ${nextScheme} color scheme`);

	$effect(() => {
		void pathname;
		menuOpen = false;
	});

	function toggleDocumentationPanel() {
		menuOpen = false;
		shell.togglePanel('top');
	}

	function togglePrimaryNavigation() {
		if (panelOpen) shell.collapsePanel('top');
		menuOpen = !menuOpen;
	}
</script>

<a class="skip-link" href="#main-content">Skip to content</a>

<div class="app-bar">
	<a href="/" class="brand" aria-label="s-m-r-t documentation home">
		<img src={brandMark} alt="" width="30" height="30" />
		<span>s-m-r-t</span>
	</a>

	<button
		class="panel-toggle"
		type="button"
		aria-label={`${panelOpen ? 'Close' : 'Open'} documentation navigation`}
		aria-expanded={panelOpen}
		aria-controls="smrt-admin-shell-top-panel"
		onclick={toggleDocumentationPanel}
	>
		<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
			<path d="M4 5.5h16M4 12h16M4 18.5h10"></path>
		</svg>
		<span>Docs</span>
	</button>

	<nav class="desktop-navigation" aria-label="Primary navigation">
		{#each primaryNavigation as item (item.href)}
			<a
				href={item.href}
				aria-current={isPrimaryNavigationActive(item, pathname) ? 'page' : undefined}
				>{item.label}</a
			>
		{/each}
	</nav>

	<div class="search"><DocsSearch /></div>

	<div class="actions">
		<Tooltip text="Open the s-m-r-t source on GitHub" placement="bottom">
			<a
				class="icon-action"
				href="https://github.com/happyvertical/smrt"
				target="_blank"
				rel="noreferrer"
				aria-label="Open the s-m-r-t source on GitHub"
			>
				<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
					<circle cx="12" cy="12" r="9"></circle>
					<path
						d="M9 19c-1-2-2-2-3-2M15 19v-3c0-1 0-2-1-2 3 0 5-1 5-4 0-1 0-2-1-3 0-1 0-2 0-2s-1 0-3 1c-2-1-4-1-6 0-2-1-3-1-3-1s0 1 0 2c-1 1-1 2-1 3 0 3 2 4 5 4-1 0-1 1-1 2v3"
					></path>
				</svg>
			</a>
		</Tooltip>

		<Tooltip text={schemeActionLabel} placement="bottom">
			<button
				class="icon-action"
				type="button"
				aria-label={schemeActionLabel}
				data-next-color-scheme={nextScheme}
				onclick={() => theme.toggleColorScheme()}
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
		</Tooltip>
	</div>

	<button
		class="menu-toggle"
		type="button"
		aria-label={`${menuOpen ? 'Close' : 'Open'} primary navigation`}
		aria-expanded={menuOpen}
		aria-controls="mobile-primary-navigation"
		onclick={togglePrimaryNavigation}
	>
		<svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
			{#if menuOpen}<path d="m5 5 14 14M19 5 5 19"></path>{:else}<path d="M4 7h16M4 12h16M4 17h16"
				></path>{/if}
		</svg>
	</button>
</div>

{#if menuOpen}
	<nav id="mobile-primary-navigation" class="mobile-navigation" aria-label="Primary navigation">
		{#each primaryNavigation as item (item.href)}
			<a
				href={item.href}
				aria-current={isPrimaryNavigationActive(item, pathname) ? 'page' : undefined}
				onclick={() => (menuOpen = false)}>{item.label}</a
			>
		{/each}
	</nav>
{/if}

<style>
	.skip-link {
		position: fixed;
		inset-block-start: 0.4rem;
		inset-inline-start: 0.5rem;
		z-index: 1000;
		padding: 0.55rem 0.75rem;
		border-radius: var(--site-radius-md);
		background: var(--smrt-color-primary);
		color: var(--smrt-color-on-primary);
		font-size: 0.8rem;
		font-weight: 700;
		transform: translateY(-150%);
	}

	.skip-link:focus {
		transform: translateY(0);
	}

	.app-bar {
		width: 100%;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: clamp(0.55rem, 1.25vw, 1.15rem);
	}

	.brand {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 0.45rem;
		color: var(--site-ink);
		text-decoration: none;
	}

	.brand img {
		width: 30px;
		height: 30px;
		object-fit: contain;
		/* Static ember glow: the resting state, and the reduced-motion fallback. */
		filter: drop-shadow(0 0 2px rgba(255, 211, 61, 0.28))
			drop-shadow(0 0 5px rgba(240, 91, 43, 0.3)) drop-shadow(0 1px 8px rgba(201, 56, 30, 0.22));
	}

	@media (prefers-reduced-motion: no-preference) {
		.brand img {
			animation: brand-ember 3.6s ease-in-out infinite;
		}
	}

	/*
	 * Ember flicker for the brand mark. Three drop-shadow layers in the mark's
	 * own palette — yellow core (#ffd33d), orange body (#f05b2b), deep-red
	 * falloff (#c9381e) — drift through irregular keyframe stops so each layer
	 * peaks out of phase. Radii stay under 10px and opacities under 0.4 to keep
	 * it at "ember" volume; the 0% and 100% frames match the static filter above
	 * so the loop has no seam and reduced-motion users see the same resting glow.
	 */
	@keyframes brand-ember {
		0%,
		100% {
			filter: drop-shadow(0 0 2px rgba(255, 211, 61, 0.28))
				drop-shadow(0 0 5px rgba(240, 91, 43, 0.3)) drop-shadow(0 1px 8px rgba(201, 56, 30, 0.22));
		}
		26% {
			filter: drop-shadow(0 0 3px rgba(255, 211, 61, 0.34))
				drop-shadow(0 0 6px rgba(240, 91, 43, 0.24)) drop-shadow(0 1px 9px rgba(201, 56, 30, 0.26));
		}
		43% {
			filter: drop-shadow(0 0 2px rgba(255, 211, 61, 0.22))
				drop-shadow(0 0 4px rgba(240, 91, 43, 0.34)) drop-shadow(0 1px 7px rgba(201, 56, 30, 0.18));
		}
		62% {
			filter: drop-shadow(0 0 3px rgba(255, 211, 61, 0.38))
				drop-shadow(0 0 7px rgba(240, 91, 43, 0.28)) drop-shadow(0 2px 9px rgba(201, 56, 30, 0.3));
		}
		81% {
			filter: drop-shadow(0 0 2px rgba(255, 211, 61, 0.25))
				drop-shadow(0 0 5px rgba(240, 91, 43, 0.22)) drop-shadow(0 1px 7px rgba(201, 56, 30, 0.2));
		}
	}

	/*
	 * VARIANT B — steady warm breathe. A genuinely different direction: no
	 * flicker, just one slow inhale/exhale of the same palette, for tastes that
	 * find any flicker too busy in a persistent header. To try it, replace
	 * `brand-ember 3.6s` with `brand-breathe 5.5s` in the animation shorthand
	 * above and uncomment this keyframes block.
	 *
	 * @keyframes brand-breathe {
	 * 	0%,
	 * 	100% {
	 * 		filter: drop-shadow(0 0 2px rgba(255, 211, 61, 0.24))
	 * 			drop-shadow(0 0 4px rgba(240, 91, 43, 0.26))
	 * 			drop-shadow(0 1px 7px rgba(201, 56, 30, 0.18));
	 * 	}
	 * 	50% {
	 * 		filter: drop-shadow(0 0 3px rgba(255, 211, 61, 0.34))
	 * 			drop-shadow(0 0 6px rgba(240, 91, 43, 0.32))
	 * 			drop-shadow(0 1px 9px rgba(201, 56, 30, 0.26));
	 * 	}
	 * }
	 */

	.brand span {
		font-family: var(--site-font-mono);
		font-size: 0.86rem;
		font-weight: 800;
		letter-spacing: -0.045em;
	}

	.panel-toggle,
	.menu-toggle,
	.icon-action {
		min-width: 44px;
		min-height: 44px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 0;
		background: transparent;
		color: var(--site-muted);
		cursor: pointer;
		text-decoration: none;
	}

	.panel-toggle {
		gap: 0.35rem;
		padding-inline: 0.4rem;
		font-size: 0.72rem;
		font-weight: 700;
	}

	.panel-toggle[aria-expanded='true'],
	.panel-toggle:hover,
	.icon-action:hover,
	.menu-toggle:hover {
		color: var(--site-ink);
	}

	.panel-toggle svg,
	.icon-action svg,
	.menu-toggle svg {
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-linejoin: round;
		stroke-width: 1.8;
	}

	.icon-action svg path:first-child {
		fill: currentColor;
		stroke: none;
	}

	.desktop-navigation {
		min-width: 0;
		display: flex;
		align-items: center;
		gap: clamp(0.65rem, 1.15vw, 1.1rem);
		white-space: nowrap;
	}

	.desktop-navigation a,
	.mobile-navigation a {
		color: var(--site-muted);
		font-size: 0.72rem;
		font-weight: 650;
		text-decoration: none;
	}

	.desktop-navigation a:hover,
	.desktop-navigation a[aria-current='page'],
	.mobile-navigation a:hover,
	.mobile-navigation a[aria-current='page'] {
		color: var(--site-ink);
	}

	.desktop-navigation a[aria-current='page'] {
		text-decoration: underline;
		text-decoration-color: var(--site-accent-strong);
		text-underline-offset: 0.45rem;
		text-decoration-thickness: 2px;
	}

	.search {
		min-width: 180px;
		margin-inline-start: auto;
	}

	.actions {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 0.1rem;
	}

	.menu-toggle,
	.mobile-navigation {
		display: none;
	}

	@media (max-width: 74rem) {
		.desktop-navigation {
			display: none;
		}

		.search {
			margin-inline-start: auto;
		}

		.menu-toggle {
			display: inline-flex;
		}

		.mobile-navigation {
			position: fixed;
			inset-block-start: 3.5rem;
			inset-inline: 0;
			z-index: 80;
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 1px;
			padding: 0.75rem max(1rem, calc((100vw - 72rem) / 2));
			border-block-end: 1px solid var(--site-line-strong);
			background: var(--smrt-color-surface-container);
			box-shadow: var(--smrt-elevation-3);
		}

		.mobile-navigation a {
			min-height: 44px;
			display: flex;
			align-items: center;
			padding-inline: 0.75rem;
			border-radius: var(--site-radius-md);
			background: var(--smrt-color-surface-container-low);
		}
	}

	@media (max-width: 42rem) {
		.app-bar {
			gap: 0.15rem;
		}

		.panel-toggle span {
			display: none;
		}

		.search {
			min-width: 44px;
		}

		.mobile-navigation {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 24rem) {
		.brand span {
			display: none;
		}
	}
</style>
