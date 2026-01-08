<script lang="ts">
	import { page } from '$app/stores';
	import { categories } from '$lib/data/components';

	let { children } = $props();

	function isActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}

	function isCategoryActive(slug: string): boolean {
		return $page.url.pathname.startsWith(`/components/${slug}`);
	}
</script>

<div class="components-layout">
	<aside class="sidebar">
		<nav>
			<div class="nav-section">
				<a href="/components" class:active={$page.url.pathname === '/components'}>Overview</a>
			</div>

			{#each categories as category}
				<div class="nav-section">
					<h3>{category.name}</h3>
					<ul>
						{#each category.components as component}
							<li>
								<a
									href="/components/{category.slug}/{component.slug}"
									class:active={isActive(`/components/${category.slug}/${component.slug}`)}
								>
									{component.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</aside>
	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.components-layout {
		display: grid;
		grid-template-columns: 240px 1fr;
		max-width: var(--container-width);
		margin: 0 auto;
		padding: 0 var(--grid-gap);
		gap: 48px;
	}

	.sidebar {
		padding: 48px 0;
		border-right: 1px solid var(--color-grid);
		max-height: calc(100vh - 80px);
		overflow-y: auto;
		position: sticky;
		top: 80px;
		z-index: 10;
	}

	.nav-section {
		margin-bottom: 24px;
	}

	.nav-section > a {
		display: block;
		padding: 8px 0;
		font-weight: 600;
		color: var(--color-text);
		text-decoration: none;
		font-size: 0.9rem;
	}

	.nav-section > a:hover {
		color: var(--color-accent);
	}

	.nav-section > a.active {
		color: var(--color-accent);
	}

	.nav-section h3 {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #999;
		margin-bottom: 8px;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		margin-bottom: 2px;
	}

	li a {
		display: block;
		padding: 4px 0;
		color: var(--color-text);
		text-decoration: none;
		font-size: 0.85rem;
		cursor: pointer;
	}

	li a:hover {
		color: var(--color-accent);
	}

	li a.active {
		color: var(--color-accent);
		font-weight: 600;
	}

	.content {
		padding: 48px 0;
		min-width: 0;
	}

	@media (max-width: 800px) {
		.components-layout {
			grid-template-columns: 1fr;
		}

		.sidebar {
			position: static;
			max-height: none;
			border-right: none;
			border-bottom: 1px solid var(--color-grid);
			padding: 24px 0;
		}

		.nav-section {
			margin-bottom: 16px;
		}

		ul {
			display: flex;
			flex-wrap: wrap;
			gap: 8px 16px;
		}

		li {
			margin: 0;
		}
	}
</style>
