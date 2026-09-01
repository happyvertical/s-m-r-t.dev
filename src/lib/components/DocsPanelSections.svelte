<script lang="ts">
	// All eight documentation sections at once, each with its key pages and a
	// link to the section landing. Borrows the homepage scope map's band grammar
	// (mono index, name, mono count, hairline rules — see `+page.svelte` #scope
	// and `layers.ts`) so the panel reads as the same site, zoomed out. The
	// current section keeps its place in the map — a stable site map is the
	// point — and instead gets the accent "you are here" treatment plus a longer
	// page list.
	import { useAdminShell } from '@happyvertical/smrt-svelte/workspace';
	import { docsPanelSections } from '$lib/data/docs-panel';
	import { documentationSectionForPathname, isNavigationItemActive } from '$lib/data/navigation';

	let { pathname, hash = '' }: { pathname: string; hash?: string } = $props();
	const shell = useAdminShell();
	const currentSectionId = $derived(documentationSectionForPathname(pathname).id);

	const KEY_PAGES = 4;
	const KEY_PAGES_CURRENT = 9;

	function closePanel() {
		shell.collapsePanel('top');
	}
</script>

<nav class="docs-map" aria-label="Documentation section map">
	{#each docsPanelSections as section, index (section.id)}
		{@const current = section.id === currentSectionId}
		{@const keyPageLimit = current ? KEY_PAGES_CURRENT : KEY_PAGES}
		<section class="map-band" data-current={current ? 'true' : undefined}>
			<h3 class="band-head">
				<span class="band-index">{String(index + 1).padStart(2, '0')}</span>
				<a
					class="band-name"
					href={section.href}
					aria-current={pathname === section.href ? 'page' : undefined}
					onclick={closePanel}>{section.label}</a
				>
				{#if current}<span class="band-here">you are here</span>{/if}
				<span class="band-count">{section.items.length}</span>
			</h3>
			<p class="band-role">{section.description}</p>
			{#if section.items.length > 1}
				<ul class="band-pages">
					<!-- The first item is the section landing the band head already links
					     to, so key pages start at position 1. Filtered inline (not via a
					     sliced @const) so check:copy can trace the copy to `section`. -->
					{#each section.items.filter((entry, position) => position > 0 && position <= keyPageLimit) as item (item.href)}
						<li>
							<a
								href={item.href}
								aria-current={isNavigationItemActive(item.href, pathname, hash)
									? item.href.includes('#')
										? 'location'
										: 'page'
									: undefined}
								onclick={closePanel}>{item.label}</a
							>
						</li>
					{/each}
				</ul>
			{/if}
			<a class="band-all" href={section.href} onclick={closePanel}>
				{#if section.items.length - 1 > keyPageLimit}
					See all {section.items.length} pages <span aria-hidden="true">→</span>
				{:else if section.id === 'why'}
					Open the homepage <span aria-hidden="true">→</span>
				{:else}
					Section overview <span aria-hidden="true">→</span>
				{/if}
			</a>
		</section>
	{/each}
</nav>

<style>
	.docs-map {
		width: min(76rem, 100%);
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0 2rem;
		align-items: start;
		margin: 0 auto;
	}

	.map-band {
		min-width: 0;
		display: grid;
		align-content: start;
		gap: 0.45rem;
		padding: 0.85rem 0 1.1rem;
		border-top: 1px solid var(--site-line-strong);
	}

	.map-band[data-current='true'] {
		border-top: 2px solid var(--site-accent-strong);
		/* Keep band heads level with the 1px rules beside this 2px one. */
		padding-top: calc(0.85rem - 1px);
	}

	.band-head {
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
		font-size: 0.88rem;
	}

	.band-index {
		color: var(--site-accent-strong);
		font: 700 0.68rem var(--site-font-mono);
	}

	.band-name {
		color: var(--site-ink);
		text-decoration: none;
	}

	.band-name:hover {
		text-decoration: underline;
		text-decoration-color: var(--site-accent-strong);
		text-underline-offset: 0.25rem;
	}

	.band-here {
		overflow: hidden;
		color: var(--site-accent-strong);
		font: 700 0.58rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.band-count {
		margin-left: auto;
		color: var(--site-muted);
		font: 700 0.68rem var(--site-font-mono);
	}

	.band-role {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		color: var(--site-muted);
		font-size: 0.7rem;
		line-height: 1.45;
		overflow: hidden;
	}

	.band-pages {
		display: grid;
		gap: 1px;
		margin: 0.15rem 0 0;
		padding: 0;
		list-style: none;
	}

	.band-pages a {
		display: block;
		padding: 0.28rem 0.5rem;
		border-radius: calc(var(--site-radius-md) - 5px);
		color: var(--site-muted);
		font-size: 0.74rem;
		font-weight: 600;
		line-height: 1.35;
		text-decoration: none;
	}

	.band-pages a:hover {
		background: var(--site-paper-deep);
		color: var(--site-ink);
	}

	.band-pages a[aria-current] {
		background: var(--site-paper-deep);
		box-shadow: inset 2px 0 var(--site-accent-strong);
		color: var(--site-ink);
	}

	.band-all {
		justify-self: start;
		margin-top: 0.2rem;
		color: var(--site-ink);
		font-size: 0.7rem;
		font-weight: 700;
		text-underline-offset: 0.25rem;
	}

	.band-all span {
		color: var(--site-accent-strong);
	}

	@media (max-width: 66rem) {
		.docs-map {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 42rem) {
		.docs-map {
			grid-template-columns: 1fr;
			gap: 0;
		}

		/*
		 * Hoist the current section to the top of the list on mobile only.
		 * Desktop/tablet keep the map's stable canonical order — spatial
		 * stability is the point of a site map — but on a single narrow
		 * column the current section can otherwise sit up to 7 bands deep.
		 *
		 * `order` (not DOM reordering) so the accessibility tree, and with it
		 * screen-reader and sequential-keyboard reading order, stays in the
		 * map's canonical order while only the *visual* position moves. This
		 * intentionally trades one thing away: a sighted keyboard user
		 * tabbing through the panel will reach the visually-first (current)
		 * band's links after several off-screen bands, because focus order
		 * follows DOM/reading order, not `order`. That is judged the better
		 * tradeoff here — the current band still keeps its accent rule and
		 * "you are here" tag so it is unambiguous once reached, and a
		 * mismatched focus/visual order for one section is less harmful than
		 * a screen-reader user landing on "you are here" before hearing what
		 * section they were already in.
		 */
		.map-band {
			order: 1;
			padding-block: 1rem 1.2rem;
		}

		.map-band[data-current='true'] {
			order: 0;
		}

		.band-pages a {
			display: flex;
			align-items: center;
			min-height: 44px;
			padding-block: 0.45rem;
			font-size: 0.8rem;
		}

		.band-all {
			min-height: 44px;
			display: inline-flex;
			align-items: center;
		}
	}
</style>
