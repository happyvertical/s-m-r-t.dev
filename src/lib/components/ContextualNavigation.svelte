<script lang="ts">
	import { useAdminShell } from '@happyvertical/smrt-svelte/workspace';
	import {
		documentationSectionForPathname,
		isNavigationGroupActive,
		isNavigationItemActive
	} from '$lib/data/navigation';

	let { pathname, hash = '' }: { pathname: string; hash?: string } = $props();
	const shell = useAdminShell();
	const section = $derived(documentationSectionForPathname(pathname));

	function closePanel() {
		shell.collapsePanel('top');
	}
</script>

<div class="context-navigation">
	<header>
		<p>{section.label}</p>
		<h2>{section.title}</h2>
		<span>{section.description}</span>
		<a
			href={section.href}
			aria-current={pathname === section.href ? 'page' : undefined}
			onclick={closePanel}>Open the section overview →</a
		>
	</header>

	<nav aria-label={`${section.label} navigation`}>
		{#each section.groups as group, index (group.label)}
			<details
				open={isNavigationGroupActive(group, pathname, hash) ||
					(pathname === section.href && index === 0)}
			>
				<summary>{group.label}<span>{group.items.length}</span></summary>
				<div>
					{#each group.items as item (item.href)}
						<a
							href={item.href}
							aria-current={isNavigationItemActive(item.href, pathname, hash)
								? item.href.includes('#')
									? 'location'
									: 'page'
								: undefined}
							onclick={closePanel}
						>
							<strong>{item.label}</strong>
							{#if item.description}<span>{item.description}</span>{/if}
						</a>
					{/each}
				</div>
			</details>
		{/each}
	</nav>
</div>

<style>
	.context-navigation {
		width: min(76rem, 100%);
		display: grid;
		grid-template-columns: minmax(14rem, 0.7fr) minmax(0, 2fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		margin: 0 auto;
	}

	header {
		align-self: start;
	}

	header > p {
		color: var(--site-accent-strong);
		font: 700 0.65rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	header h2 {
		margin-top: 0.4rem;
		font-size: clamp(1.55rem, 3vw, 2.35rem);
		letter-spacing: -0.035em;
		line-height: 1.1;
	}

	header > span {
		display: block;
		margin-top: 0.75rem;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.55;
	}

	header > a {
		display: inline-block;
		margin-top: 1rem;
		color: var(--site-ink);
		font-size: 0.76rem;
		font-weight: 700;
	}

	nav {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-content: start;
		gap: 0.65rem;
	}

	details {
		min-width: 0;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
		overflow: clip;
	}

	details[open] {
		grid-row: span 2;
	}

	summary {
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.7rem 0.85rem;
		color: var(--site-ink);
		font-size: 0.75rem;
		font-weight: 750;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary span {
		color: var(--site-muted);
		font: 0.62rem var(--site-font-mono);
	}

	details > div {
		max-height: 16rem;
		display: grid;
		gap: 1px;
		padding: 0 0.35rem 0.35rem;
		overflow: auto;
	}

	details a {
		display: grid;
		gap: 0.2rem;
		padding: 0.55rem 0.6rem;
		border-radius: calc(var(--site-radius-md) - 3px);
		color: var(--site-muted);
		text-decoration: none;
	}

	details a:hover,
	details a[aria-current] {
		background: var(--site-paper-deep);
		color: var(--site-ink);
	}

	details a[aria-current] {
		box-shadow: inset 2px 0 var(--site-accent-strong);
	}

	details strong {
		font-size: 0.75rem;
	}

	details a span {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		color: var(--site-muted);
		font-size: 0.68rem;
		line-height: 1.4;
		overflow: hidden;
	}

	@media (max-width: 50rem) {
		.context-navigation {
			grid-template-columns: 1fr;
			gap: 1.25rem;
		}

		header > span {
			max-width: 34rem;
		}
	}

	@media (max-width: 38rem) {
		nav {
			grid-template-columns: 1fr;
		}

		details[open] {
			grid-row: auto;
		}
	}
</style>
