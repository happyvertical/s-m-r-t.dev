<script lang="ts">
	import { goto } from '$app/navigation';
	import { searchDocs } from '$lib/data/search';

	let open = $state(false);
	let query = $state('');
	let active = $state(0);
	let input = $state<HTMLInputElement>();
	let list = $state<HTMLDivElement>();
	let closeButton = $state<HTMLButtonElement>();
	let opener: HTMLElement | null = null;

	const results = $derived(searchDocs(query));

	$effect(() => {
		// Reset the highlight whenever the result set changes.
		void results;
		active = 0;
	});

	function show() {
		// Remember where focus came from: the palette also opens from ⌘K, which can
		// be pressed from anywhere on the page, not only from the trigger button.
		opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		open = true;
		setTimeout(() => input?.focus());
	}

	/** `restoreFocus` is false when the palette closes because we are navigating away. */
	function hide(restoreFocus = true) {
		open = false;
		query = '';
		active = 0;
		if (restoreFocus) opener?.focus();
		opener = null;
	}

	async function choose(href: string) {
		hide(false);
		await goto(href);
	}

	function move(delta: number) {
		if (!results.length) return;
		active = (active + delta + results.length) % results.length;
		list?.querySelectorAll('button')[active]?.scrollIntoView({ block: 'nearest' });
	}

	function handleKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			if (open) hide();
			else show();
			return;
		}
		if (!open) return;

		if (event.key === 'Tab') {
			// The dialog is aria-modal, so keep Tab inside it. Results are not tab
			// stops (aria-activedescendant drives selection), leaving two stops.
			const stops: HTMLElement[] = [input, closeButton].filter((el) => el !== undefined);
			const first = stops[0];
			const last = stops[stops.length - 1];
			if (!first || !last) return;

			const current = stops.indexOf(document.activeElement as HTMLElement);
			const next = event.shiftKey ? current - 1 : current + 1;
			if (current === -1 || next < 0 || next >= stops.length) {
				event.preventDefault();
				(event.shiftKey ? last : first).focus();
			}
			return;
		}

		if (event.key === 'Escape') hide();
		else if (event.key === 'ArrowDown') {
			event.preventDefault();
			move(1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			move(-1);
		} else if (event.key === 'Enter' && results[active]) {
			event.preventDefault();
			choose(results[active].href);
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<button class="search-trigger" type="button" onclick={show} aria-label="Search documentation">
	<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
		<circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path>
	</svg>
	<span>Search docs</span><kbd>⌘ K</kbd>
</button>

{#if open}
	<div class="search-backdrop" role="presentation" onclick={() => hide()}></div>
	<div class="search-dialog" role="dialog" aria-modal="true" aria-label="Search documentation">
		<div class="search-input">
			<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
				<circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path>
			</svg>
			<input
				bind:this={input}
				bind:value={query}
				placeholder="Search pages, sections, packages, or components"
				role="combobox"
				aria-label="Search documentation"
				aria-expanded={results.length > 0}
				aria-autocomplete="list"
				aria-controls={results.length ? 'search-results' : undefined}
				aria-activedescendant={results.length ? `search-result-${active}` : undefined}
				autocomplete="off"
			/>
			<button type="button" bind:this={closeButton} onclick={() => hide()}>Esc</button>
		</div>
		<!-- `listbox` may only own `option` children, so the empty state lives
		     outside it and announces itself as a status message instead. -->
		<div class="search-results" bind:this={list}>
			{#if results.length}
				<div id="search-results" role="listbox" aria-label="Search results">
					{#each results as result, index (`${result.kind}:${result.href}:${result.label}`)}
						<button
							type="button"
							id={`search-result-${index}`}
							role="option"
							aria-selected={index === active}
							class:active={index === active}
							tabindex="-1"
							onmouseenter={() => (active = index)}
							onclick={() => choose(result.href)}
						>
							{#if result.breadcrumb}<em>{result.breadcrumb}</em>{/if}
							<strong>{result.label}</strong>
							{#if result.description}<span>{result.description}</span>{/if}
						</button>
					{/each}
				</div>
			{:else}
				<p role="status">No documentation matches “{query}”.</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.search-trigger {
		min-width: 220px;
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 8px 10px;
		border: 1px solid var(--site-line-strong);
		border-radius: 7px;
		background: var(--site-surface);
		color: var(--site-muted);
		font-size: 0.8rem;
		cursor: pointer;
	}

	.search-trigger svg,
	.search-input svg {
		fill: none;
		stroke: currentColor;
		stroke-linecap: round;
		stroke-width: 1.8;
	}

	.search-trigger span {
		flex: 1;
		text-align: left;
	}

	kbd,
	.search-input button {
		padding: 2px 6px;
		border: 1px solid var(--site-line);
		border-radius: 4px;
		background: var(--site-paper);
		color: var(--site-muted);
		font-family: var(--site-font-mono);
		font-size: 0.64rem;
	}

	.search-backdrop {
		position: fixed;
		inset: 0;
		z-index: 300;
		background: rgb(10 12 9 / 54%);
		backdrop-filter: blur(2px);
	}

	.search-dialog {
		position: fixed;
		top: min(15vh, 140px);
		left: 50%;
		z-index: 301;
		width: min(620px, calc(100% - 28px));
		max-height: min(70vh, 620px);
		transform: translateX(-50%);
		border: 1px solid var(--site-line-strong);
		border-radius: 12px;
		background: var(--site-surface);
		box-shadow: 0 24px 80px rgb(10 12 9 / 28%);
		overflow: hidden;
	}

	.search-input {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 14px 16px;
		border-bottom: 1px solid var(--site-line);
		color: var(--site-muted);
	}

	.search-input input {
		min-width: 0;
		flex: 1;
		border: 0;
		outline: 0;
		background: transparent;
		color: var(--site-ink);
		font-size: 0.94rem;
	}

	.search-input button {
		cursor: pointer;
	}

	.search-results {
		max-height: min(58vh, 510px);
		padding: 8px;
		overflow: auto;
	}

	.search-results button {
		width: 100%;
		display: grid;
		gap: 3px;
		padding: 10px 11px;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--site-ink);
		text-align: left;
		cursor: pointer;
	}

	.search-results button.active,
	.search-results button:hover,
	.search-results button:focus-visible {
		background: var(--site-paper-deep);
	}

	.search-results strong {
		font-size: 0.86rem;
	}

	.search-results em {
		color: var(--site-muted);
		font: 0.63rem var(--site-font-mono);
		font-style: normal;
		letter-spacing: 0.02em;
	}

	.search-results span {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		overflow: hidden;
	}

	.search-results span,
	.search-results p {
		color: var(--site-muted);
		font-size: 0.74rem;
		line-height: 1.45;
	}

	.search-results p {
		padding: 24px;
		text-align: center;
	}

	@media (max-width: 740px) {
		.search-trigger {
			min-width: 0;
			width: 38px;
			justify-content: center;
			padding-inline: 0;
		}

		.search-trigger span,
		.search-trigger kbd {
			display: none;
		}
	}
</style>
