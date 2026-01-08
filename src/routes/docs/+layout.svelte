<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();

	const nav = [
		{
			title: 'Documentation',
			items: [
				{
					label: 'Objects',
					href: '/docs/objects',
					children: [
						{ label: 'Decorator', href: '/docs/objects#decorator' },
						{ label: 'Field Types', href: '/docs/objects#field-types' },
						{ label: 'Inheritance', href: '/docs/objects#inheritance' },
						{ label: 'AI Methods', href: '/docs/objects#ai-methods' },
						{ label: 'Migrations', href: '/docs/objects#migrations' },
						{ label: 'Auto-Generated', href: '/docs/objects#auto-generated' },
						{ label: 'Context Memory', href: '/docs/objects#context-memory' },
						{ label: 'Semantic Search', href: '/docs/objects#semantic-search' },
						{ label: 'Lifecycle Hooks', href: '/docs/objects#lifecycle-hooks' },
						{ label: 'Relationships', href: '/docs/objects#relationships' }
					]
				},
				{ label: 'Collections', href: '/docs/collections' },
				{
					label: 'Agents',
					href: '/docs/agents',
					children: [
						{ label: 'Dispatch', href: '/docs/agents/dispatch' }
					]
				}
			]
		},
		{
			title: 'Components',
			items: [
				{ label: 'Overview', href: '/components' },
				{ label: 'UI', href: '/components/ui' },
				{ label: 'Layout', href: '/components/layout' },
				{ label: 'Content', href: '/components/content' }
			]
		},
		{
			title: 'Modules',
			items: [
				{ label: 'Overview', href: '/modules' }
			]
		},
		{
			title: 'Reference',
			items: [
				{ label: 'API Reference', href: '/reference' }
			]
		}
	];

	function isActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}
</script>

<div class="docs-layout">
	<aside class="sidebar">
		<nav>
			{#each nav as section}
				<div class="nav-section">
					<h3>{section.title}</h3>
					<ul>
						{#each section.items as item}
							<li>
								<a href={item.href} class:active={isActive(item.href)}>{item.label}</a>
								{#if item.children}
									<ul class="subnav">
										{#each item.children as child}
											<li>
												<a href={child.href} class:active={isActive(child.href)}>{child.label}</a>
											</li>
										{/each}
									</ul>
								{/if}
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
	.docs-layout {
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
	}

	.nav-section {
		margin-bottom: 32px;
	}

	.nav-section h3 {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #999;
		margin-bottom: 12px;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		margin-bottom: 4px;
	}

	a {
		display: block;
		padding: 6px 0;
		color: var(--color-text);
		text-decoration: none;
		font-size: 0.9rem;
	}

	a:hover {
		color: var(--color-accent);
	}

	a.active {
		color: var(--color-accent);
		font-weight: 600;
	}

	.subnav {
		padding-left: 16px;
		margin-top: 4px;
	}

	.subnav a {
		font-size: 0.85rem;
	}

	.content {
		padding: 48px 0;
		min-width: 0;
	}

	@media (max-width: 800px) {
		.docs-layout {
			grid-template-columns: 1fr;
		}

		.sidebar {
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

		.subnav {
			display: none;
		}
	}
</style>
