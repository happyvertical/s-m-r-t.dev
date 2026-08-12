<script lang="ts">
	import { page } from '$app/state';
	import { ColorSchemeToggle } from '@happyvertical/smrt-ui/themes';
	import brandMark from '$lib/assets/smrt-mark.svg';
	import DocsSearch from '$lib/components/DocsSearch.svelte';

	let menuOpen = $state(false);
	const nav = [
		{ label: 'Why s-m-r-t?', href: '/' },
		{ label: 'Guides', href: '/guides' },
		{ label: 'Packages', href: '/packages' },
		{ label: 'Playground', href: '/playground' },
		{ label: 'Tooling', href: '/tooling' },
		{ label: 'Reference', href: '/reference' }
	];

	function isActive(href: string) {
		if (href === '/')
			return (
				page.url.pathname === '/' ||
				page.url.pathname.startsWith('/starters') ||
				page.url.pathname.startsWith('/foundations') ||
				page.url.pathname.startsWith('/capabilities')
			);
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<header class="site-header">
	<div class="header-inner">
		<a
			href="/"
			class="brand"
			aria-label="s-m-r-t documentation home"
			onclick={() => (menuOpen = false)}
		>
			<img src={brandMark} alt="" width="34" height="34" />
			<span>s-m-r-t</span>
			<small>docs</small>
		</a>

		<div class="desktop-search"><DocsSearch /></div>

		<button
			class="menu-toggle"
			type="button"
			aria-expanded={menuOpen}
			aria-controls="site-nav"
			onclick={() => (menuOpen = !menuOpen)}
		>
			{menuOpen ? 'Close' : 'Menu'}
		</button>

		<div class="nav-shell" class:open={menuOpen} id="site-nav">
			<nav aria-label="Primary navigation">
				{#each nav as item (item.href)}
					<a href={item.href} class:active={isActive(item.href)} onclick={() => (menuOpen = false)}
						>{item.label}</a
					>
				{/each}
			</nav>
			<div class="actions">
				<a href="https://github.com/happyvertical/smrt" target="_blank" rel="noreferrer">GitHub</a>
				<ColorSchemeToggle variant="switch" showLabels={false} ariaLabel="Toggle color scheme" />
			</div>
		</div>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 200;
		height: var(--site-header-height);
		border-bottom: 1px solid var(--site-line);
		background: color-mix(in srgb, var(--site-paper) 94%, transparent);
		backdrop-filter: blur(14px);
	}

	.header-inner {
		width: min(1540px, calc(100% - 32px));
		height: 100%;
		display: flex;
		align-items: center;
		gap: 24px;
		margin: 0 auto;
	}

	.brand {
		width: 212px;
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 9px;
		color: var(--site-ink);
		text-decoration: none;
	}

	.brand img {
		width: 34px;
		height: 34px;
		object-fit: contain;
	}

	.brand span {
		font-family: var(--site-font-mono);
		font-size: 0.94rem;
		font-weight: 800;
		letter-spacing: -0.045em;
	}

	.brand small {
		padding-left: 8px;
		border-left: 1px solid var(--site-line-strong);
		color: var(--site-muted);
		font-size: 0.7rem;
	}

	.desktop-search {
		margin-right: auto;
	}

	.nav-shell,
	nav,
	.actions {
		display: flex;
		align-items: center;
	}

	.nav-shell {
		gap: 26px;
	}

	nav {
		gap: 20px;
	}

	nav a,
	.actions > a {
		color: var(--site-muted);
		font-size: 0.75rem;
		font-weight: 600;
		text-decoration: none;
	}

	nav a:hover,
	nav a.active,
	.actions > a:hover {
		color: var(--site-ink);
	}

	nav a.active {
		text-decoration: underline;
		text-decoration-color: var(--site-accent-strong);
		text-underline-offset: 6px;
	}

	.actions {
		gap: 13px;
		padding-left: 18px;
		border-left: 1px solid var(--site-line);
	}

	.menu-toggle {
		display: none;
	}

	:global(.smrt-color-scheme-toggle) {
		--smrt-color-surface: transparent;
	}

	@media (max-width: 1120px) {
		.desktop-search {
			margin-left: auto;
		}

		.menu-toggle {
			display: block;
			padding: 7px;
			border: 0;
			background: transparent;
			color: var(--site-ink);
			font-size: 0.74rem;
			font-weight: 650;
			cursor: pointer;
		}

		.nav-shell {
			position: fixed;
			top: var(--site-header-height);
			left: 0;
			right: 0;
			display: none;
			align-items: stretch;
			padding: 16px;
			border-bottom: 1px solid var(--site-line);
			background: var(--site-paper);
			box-shadow: 0 20px 50px rgb(10 12 9 / 12%);
		}

		.nav-shell.open {
			display: grid;
		}

		.nav-shell nav {
			display: grid;
			gap: 0;
		}

		.nav-shell nav a {
			padding: 10px 4px;
			border-bottom: 1px solid var(--site-line);
		}

		.actions {
			justify-content: space-between;
			padding: 5px 4px 0;
			border: 0;
		}
	}

	@media (max-width: 560px) {
		.header-inner {
			width: calc(100% - 22px);
			gap: 10px;
		}

		.brand {
			width: auto;
			margin-right: auto;
		}

		.brand small {
			display: none;
		}

		.desktop-search {
			margin: 0;
		}
	}
</style>
