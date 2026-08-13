<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { docsNavigation, isSidebarItemActive, sidebarAriaCurrent } from '$lib/data/navigation';

	let { children } = $props();
	let activeHomepageHref = $state('/');
	let frame: number | undefined;

	const homepageHrefs = docsNavigation
		.flatMap((group) => group.items)
		.filter((item) => item.href.startsWith('/#'))
		.map((item) => item.href);

	function isActive(href: string) {
		return isSidebarItemActive(href, page.url.pathname, activeHomepageHref);
	}

	function updateActiveHomepageSection() {
		frame = undefined;
		if (window.location.pathname !== '/') return;

		const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
		const readingLine = headerHeight + 24;
		activeHomepageHref = '/';

		for (const href of homepageHrefs) {
			const section = document.getElementById(href.slice(2));
			if (!section || section.getBoundingClientRect().top > readingLine) break;
			activeHomepageHref = href;
		}
	}

	function scheduleActiveHomepageSection() {
		if (frame === undefined) frame = requestAnimationFrame(updateActiveHomepageSection);
	}

	$effect(() => {
		if (page.url.pathname === '/') scheduleActiveHomepageSection();
	});

	onMount(() => {
		window.addEventListener('scroll', scheduleActiveHomepageSection, { passive: true });
		window.addEventListener('resize', scheduleActiveHomepageSection);
		window.addEventListener('hashchange', scheduleActiveHomepageSection);
		scheduleActiveHomepageSection();

		return () => {
			window.removeEventListener('scroll', scheduleActiveHomepageSection);
			window.removeEventListener('resize', scheduleActiveHomepageSection);
			window.removeEventListener('hashchange', scheduleActiveHomepageSection);
			if (frame !== undefined) cancelAnimationFrame(frame);
		};
	});
</script>

<div class="docs-shell">
	<aside class="docs-sidebar">
		<p class="sidebar-title">Documentation</p>
		<nav aria-label="Documentation navigation">
			{#each docsNavigation as group (group.label)}
				<section>
					<h2>{group.label}</h2>
					{#each group.items as item (item.href)}
						<a
							href={item.href}
							class:active={isActive(item.href)}
							aria-current={isActive(item.href) ? sidebarAriaCurrent(item.href) : undefined}
							>{item.label}</a
						>
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
		box-shadow: inset 2px 0 var(--site-accent-strong);
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
