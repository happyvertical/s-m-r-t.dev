<script lang="ts">
	/**
	 * Unified left sidebar (issue #101), shared across docs / modules /
	 * components / reference. The section tree comes from `$lib/site-nav`, so a
	 * single source drives every section's navigation.
	 */
	import { page } from '$app/stores';
	import { sectionForPath, type NavSection } from '$lib/site-nav';

	// Allow callers to force a section; otherwise derive it from the URL.
	let { sectionId }: { sectionId?: NavSection['id'] } = $props();

	let section = $derived(
		sectionId
			? sectionForPath(`/${sectionId}`)
			: sectionForPath($page.url.pathname)
	);

	function isActive(href: string): boolean {
		const here = $page.url.pathname.replace(/\/$/, '') || '/';
		const there = href.replace(/\/$/, '') || '/';
		return here === there;
	}
</script>

{#if section}
	<nav class="sidebar-nav" aria-label="Section navigation">
		{#each section.groups as group}
			<div class="nav-group">
				{#if group.href}
					<a class="group-title link" href={group.href} class:active={isActive(group.href)}>
						{group.title}
					</a>
				{:else}
					<h3 class="group-title">{group.title}</h3>
				{/if}
				<ul>
					{#each group.items as item}
						<li>
							<a href={item.href} class:active={isActive(item.href)} aria-current={isActive(item.href) ? 'page' : undefined}>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>
{/if}

<style>
	.sidebar-nav {
		font-size: 0.9rem;
	}

	.nav-group {
		margin-bottom: 28px;
	}

	.group-title {
		display: block;
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--smrt-color-on-surface-variant, #999);
		margin: 0 0 10px;
	}

	a.group-title {
		text-decoration: none;
		transition: color 0.15s;
	}

	a.group-title:hover {
		color: var(--smrt-color-primary, #1976d2);
	}

	a.group-title.active {
		color: var(--smrt-color-primary, #1976d2);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		margin: 0;
	}

	li a {
		display: block;
		padding: 5px 10px;
		margin-left: -10px;
		color: var(--smrt-color-on-surface, #1a1a1a);
		text-decoration: none;
		border-radius: var(--smrt-radius-sm, 4px);
		border-left: 2px solid transparent;
		transition:
			color 0.15s,
			background 0.15s;
	}

	li a:hover {
		color: var(--smrt-color-primary, #1976d2);
		background: var(--smrt-color-surface-container-low, #f5f5f5);
	}

	li a.active {
		color: var(--smrt-color-primary, #1976d2);
		font-weight: 600;
		border-left-color: var(--smrt-color-primary, #1976d2);
		background: var(--smrt-color-primary-container, #e3f2fd);
	}
</style>
