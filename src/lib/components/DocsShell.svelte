<script lang="ts">
	import { page } from '$app/state';
	import { docsNavigation } from '$lib/data/navigation';

	let { children } = $props();

	function isActive(href: string) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<div class="docs-shell">
	<aside class="docs-sidebar">
		<p class="sidebar-title">Documentation</p>
		<nav aria-label="Documentation navigation">
			{#each docsNavigation as group (group.label)}
				<section>
					<h2>{group.label}</h2>
					{#each group.items as item (item.href)}
						<a href={item.href} class:active={isActive(item.href)}>{item.label}</a>
					{/each}
				</section>
			{/each}
		</nav>
	</aside>

	<div class="docs-content">{@render children()}</div>
</div>

<style>
	.docs-shell {
		width: min(1540px, 100%);
		display: grid;
		grid-template-columns: 244px minmax(0, 1fr);
		margin: 0 auto;
	}

	.docs-sidebar {
		position: sticky;
		top: var(--site-header-height);
		height: calc(100svh - var(--site-header-height));
		padding: 28px 24px 50px 28px;
		border-right: 1px solid var(--site-line);
		overflow-y: auto;
	}

	.docs-sidebar nav {
		display: grid;
		gap: 26px;
	}

	.sidebar-title {
		margin-bottom: 24px;
		color: var(--site-ink);
		font-size: 0.82rem;
		font-weight: 700;
	}

	.docs-sidebar section {
		display: grid;
		gap: 3px;
	}

	.docs-sidebar h2 {
		margin-bottom: 5px;
		color: var(--site-muted);
		font-size: 0.67rem;
		font-weight: 700;
		letter-spacing: 0.035em;
		text-transform: uppercase;
	}

	.docs-sidebar a {
		padding: 5px 8px;
		border-radius: 5px;
		color: var(--site-muted);
		font-size: 0.79rem;
		line-height: 1.35;
		text-decoration: none;
	}

	.docs-sidebar a:hover {
		background: var(--site-paper-deep);
		color: var(--site-ink);
	}

	.docs-sidebar a.active {
		background: var(--site-accent-soft);
		color: var(--site-ink);
		font-weight: 650;
	}

	.docs-content {
		min-width: 0;
	}

	@media (max-width: 980px) {
		.docs-shell {
			display: block;
		}

		.docs-sidebar {
			display: none;
		}
	}
</style>
