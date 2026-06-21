<script lang="ts">
	/**
	 * Right-rail "On this page" table of contents (issue #101).
	 *
	 * Reads the H2/H3 headings out of the rendered page DOM (so it works for
	 * every page — Svelte components, ModulePage, or markdown — without changing
	 * the pages themselves) and highlights the section currently in view.
	 *
	 * Rendered at the layout level. Pass the pathname so it re-scans on
	 * navigation, and a `containerSelector` for where to look for headings.
	 */
	import { tick } from 'svelte';

	let {
		pathname,
		containerSelector = 'main',
		minHeadings = 3
	}: {
		pathname: string;
		containerSelector?: string;
		minHeadings?: number;
	} = $props();

	interface Item {
		id: string;
		text: string;
		level: 2 | 3;
	}

	let items = $state<Item[]>([]);
	let activeId = $state('');
	let observer: IntersectionObserver | null = null;

	function slugify(text: string): string {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function teardown() {
		observer?.disconnect();
		observer = null;
	}

	async function scan() {
		teardown();
		items = [];
		activeId = '';
		if (typeof document === 'undefined') return;
		await tick();

		const container = document.querySelector(containerSelector);
		if (!container) return;

		const headingEls = Array.from(
			container.querySelectorAll<HTMLHeadingElement>('h2, h3')
		).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

		const collected: Item[] = [];
		for (const el of headingEls) {
			const text = (el.textContent || '').trim();
			if (!text) continue;
			// Ensure every heading has an id so the TOC link can target it.
			if (!el.id) el.id = slugify(text);
			collected.push({
				id: el.id,
				text,
				level: el.tagName === 'H2' ? 2 : 3
			});
		}

		if (collected.length < minHeadings) {
			items = [];
			return;
		}
		items = collected;

		// Scrollspy: mark the heading nearest the top of the viewport as active.
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) activeId = entry.target.id;
				}
			},
			{ rootMargin: '0px 0px -75% 0px', threshold: 0 }
		);
		for (const el of headingEls) observer.observe(el);
	}

	// Re-scan whenever the route changes.
	$effect(() => {
		// reference pathname so this re-runs on navigation
		void pathname;
		scan();
		return teardown;
	});

	function onClick(event: MouseEvent, id: string) {
		const target = document.getElementById(id);
		if (!target) return;
		event.preventDefault();
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		activeId = id;
		// Update the URL hash without a jump.
		history.replaceState(history.state, '', `#${id}`);
		// Move focus for keyboard users without forcing another scroll.
		target.setAttribute('tabindex', '-1');
		(target as HTMLElement).focus({ preventScroll: true });
	}
</script>

{#if items.length > 0}
	<nav class="toc" aria-label="On this page">
		<p class="toc-title">On this page</p>
		<ul>
			{#each items as item (item.id)}
				<li class:level-3={item.level === 3}>
					<a
						href={`#${item.id}`}
						class:active={activeId === item.id}
						aria-current={activeId === item.id ? 'location' : undefined}
						onclick={(e) => onClick(e, item.id)}
					>
						{item.text}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	.toc {
		position: sticky;
		top: 96px;
		font-size: 0.82rem;
		max-height: calc(100vh - 120px);
		overflow-y: auto;
	}

	.toc-title {
		font-size: 0.72rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--smrt-color-on-surface-variant, #999);
		margin: 0 0 12px;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border-left: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	li {
		margin: 0;
	}

	li.level-3 a {
		padding-left: 28px;
		font-size: 0.78rem;
	}

	a {
		display: block;
		padding: 4px 0 4px 16px;
		margin-left: -1px;
		border-left: 2px solid transparent;
		color: var(--smrt-color-on-surface-variant, #666);
		text-decoration: none;
		line-height: 1.4;
		transition:
			color 0.15s,
			border-color 0.15s;
	}

	a:hover {
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	a.active {
		color: var(--smrt-color-primary, #1976d2);
		border-left-color: var(--smrt-color-primary, #1976d2);
		font-weight: 500;
	}
</style>
