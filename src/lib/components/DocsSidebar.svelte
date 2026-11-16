<script lang="ts">
	// The docs sidebar: the six documentation sections, then the pages of the
	// section the reader is in. It is the standing, close-up companion to the
	// docs panel (`DocsPanelSections.svelte`), which maps every section at once.
	// SiteShell owns where it sits and at which width it shows; this component
	// is only the navigation.
	import {
		documentationSectionForPathname,
		documentationSections,
		isNavigationItemActive
	} from '$lib/data/navigation';
	import { SITE_ORIGIN } from '$lib/site';

	let { pathname, hash = '' }: { pathname: string; hash?: string } = $props();
	const currentSection = $derived(documentationSectionForPathname(pathname));
	const sectionHrefs = new Set(documentationSections.map((section) => section.href));
	let nav = $state<HTMLElement>();

	// `isNavigationItemActive` is a prefix match, so an overview and a page
	// under it are both active at once. Only the deepest one is the page.
	const activePageHref = $derived.by(() => {
		let best: string | undefined;
		let bestLength = -1;
		for (const group of currentSection.groups) {
			for (const item of group.items) {
				if (item.href.includes('#')) continue;
				if (!isNavigationItemActive(item.href, pathname, hash)) continue;
				const length = new URL(item.href, SITE_ORIGIN).pathname.length;
				if (length > bestLength) {
					best = item.href;
					bestLength = length;
				}
			}
		}
		return best;
	});

	// Same rule as the docs panel for hash items: an anchor on the current
	// page is a location, a page is a page.
	function currentFor(href: string): 'page' | 'location' | undefined {
		if (href.includes('#')) {
			return isNavigationItemActive(href, pathname, hash) ? 'location' : undefined;
		}
		return href === activePageHref ? 'page' : undefined;
	}

	// Keep the current link in view inside the sidebar's own scroll area. This
	// sets that area's scrollTop directly: no smooth scroll, no page scroll and
	// no focus change (SiteShell moves focus to the content after navigation).
	$effect(() => {
		void pathname;
		void hash;
		if (!nav) return;
		const scroller = nav.closest('aside') ?? nav;
		const link = nav.querySelector<HTMLElement>('.pages a[aria-current]');
		if (!link) return;
		const frame = scroller.getBoundingClientRect();
		const target = link.getBoundingClientRect();
		if (target.top >= frame.top && target.bottom <= frame.bottom) return;
		scroller.scrollTop += target.top - frame.top - (scroller.clientHeight - target.height) / 2;
	});
</script>

<nav class="docs-sidebar" aria-label="Documentation" bind:this={nav}>
	<ol class="sections">
		{#each documentationSections as section, index (section.id)}
			{@const current = section.id === currentSection.id}
			<li>
				<a
					href={section.href}
					data-current={current ? 'true' : undefined}
					aria-current={pathname === section.href ? 'page' : current ? 'true' : undefined}
				>
					<span class="section-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
					{section.label}
				</a>
			</li>
		{/each}
	</ol>

	<!-- Iterated straight from `documentationSections` (not a derived copy) so
	     check:copy can trace the copy to its source. -->
	{#each documentationSections as section (section.id)}
		{#if section.id === currentSection.id}
			<div class="pages">
				<p class="pages-title">{section.label}</p>
				{#each section.groups as group, groupIndex (groupIndex)}
					<!-- A group that only links the section overviews repeats the list
					     above, so it is left out. -->
					{#if !group.items.every((item) => sectionHrefs.has(item.href))}
						<p class="group-label" id="docs-sidebar-group-{groupIndex}">{group.label}</p>
						<ul aria-labelledby="docs-sidebar-group-{groupIndex}">
							{#each group.items as item, itemIndex (itemIndex)}
								<li>
									<a href={item.href} aria-current={currentFor(item.href)}>{item.label}</a>
								</li>
							{/each}
						</ul>
					{/if}
				{/each}
			</div>
		{/if}
	{/each}
</nav>

<style>
	.docs-sidebar {
		display: grid;
		gap: 1.1rem;
		padding: 1.5rem 1rem 2rem 1.25rem;
		color: var(--site-ink);
		font-family: var(--site-font-sans);
	}

	ol,
	ul {
		display: grid;
		gap: 1px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	a {
		display: block;
		padding: 0.32rem 0.6rem;
		border-radius: calc(var(--site-radius-md) - 5px);
		color: var(--site-muted);
		font-size: 0.82rem;
		font-weight: 500;
		line-height: 1.35;
		text-decoration: none;
		overflow-wrap: anywhere;
	}

	a:hover {
		background: var(--site-paper-deep);
		color: var(--site-ink);
	}

	/* The ring sits inside the link so the sidebar's scroll area cannot clip it. */
	a:focus-visible {
		outline: 2px solid var(--site-accent-strong);
		outline-offset: -2px;
	}

	a[aria-current] {
		background: var(--site-paper-deep);
		box-shadow: inset 2px 0 var(--site-accent-strong);
		color: var(--site-ink);
		font-weight: 600;
	}

	.sections a {
		display: flex;
		align-items: baseline;
		gap: 0.6rem;
		color: var(--site-ink);
		font: 600 0.9rem var(--site-font-display);
	}

	.section-index {
		color: var(--site-brass-ink);
		font: 700 0.66rem var(--site-font-mono);
	}

	.pages {
		display: grid;
		gap: 0.3rem;
		padding-top: 1rem;
		border-top: 1px solid var(--site-line-strong);
	}

	.pages-title {
		margin: 0;
		padding: 0 0.6rem;
		color: var(--site-accent-strong);
		font: 700 1.05rem var(--site-font-display);
	}

	.group-label {
		margin: 0.75rem 0 0.1rem;
		padding: 0 0.6rem;
		color: var(--site-ink);
		font: 700 0.76rem var(--site-font-display);
	}

	/* Forced colours drop the background and inset rule; draw the current link as selected. */
	@media (forced-colors: active) {
		a[aria-current] {
			background: Highlight;
			color: HighlightText;
		}
	}
</style>
