<script lang="ts">
	/**
	 * Global ⌘K / Ctrl-K command palette (issue #99).
	 *
	 * Fetches the static `/search-index.json` (built by
	 * scripts/build-search-index.mjs) the first time it opens, flattens it into
	 * page + heading records, and filters them client-side. Fully keyboard
	 * driven: ⌘K/Ctrl-K toggles, ↑/↓ move, Enter navigates, Esc closes.
	 */
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import {
		paletteOpen,
		openPalette,
		closePalette,
		flattenIndex,
		scoreRecord,
		type SearchRecord
	} from '$lib/search';

	let records = $state<SearchRecord[]>([]);
	let loaded = $state(false);
	let loadError = $state(false);
	let query = $state('');
	let activeIndex = $state(0);

	let inputEl = $state<HTMLInputElement | null>(null);
	let listEl = $state<HTMLUListElement | null>(null);
	let previouslyFocused: HTMLElement | null = null;

	const MAX_RESULTS = 40;

	// Filtered + ranked results derived from the query.
	let results = $derived.by(() => {
		const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
		if (terms.length === 0) {
			// Empty query: show a useful starting set (page-level entries first).
			return records.filter((r) => r.isPage).slice(0, MAX_RESULTS);
		}
		const scored: { record: SearchRecord; score: number }[] = [];
		for (const record of records) {
			const score = scoreRecord(record, terms);
			if (score !== null) scored.push({ record, score });
		}
		scored.sort((a, b) => b.score - a.score);
		return scored.slice(0, MAX_RESULTS).map((s) => s.record);
	});

	// Keep the active row in range whenever results change.
	$effect(() => {
		// touch results.length so this re-runs when the list changes
		const len = results.length;
		if (activeIndex >= len) activeIndex = Math.max(0, len - 1);
	});

	async function loadIndex() {
		if (loaded || loadError) return;
		try {
			const res = await fetch(`${base}/search-index.json`);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const index = await res.json();
			records = flattenIndex(index);
			loaded = true;
		} catch (err) {
			console.error('Command palette: failed to load search index', err);
			loadError = true;
		}
	}

	function close() {
		// Restore focus to whatever was focused before opening (usually the header
		// search button) — do this before flipping the store so it's still valid.
		previouslyFocused?.focus?.();
		closePalette();
		query = '';
		activeIndex = 0;
	}

	function selectAt(index: number) {
		const record = results[index];
		if (!record) return;
		close();
		goto(`${base}${record.href}`);
	}

	function scrollActiveIntoView() {
		const node = listEl?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
		node?.scrollIntoView({ block: 'nearest' });
	}

	function onInputKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (results.length > 0) activeIndex = (activeIndex + 1) % results.length;
			scrollActiveIntoView();
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (results.length > 0)
				activeIndex = (activeIndex - 1 + results.length) % results.length;
			scrollActiveIntoView();
		} else if (event.key === 'Enter') {
			event.preventDefault();
			selectAt(activeIndex);
		} else if (event.key === 'Home') {
			event.preventDefault();
			activeIndex = 0;
			scrollActiveIntoView();
		} else if (event.key === 'End') {
			event.preventDefault();
			activeIndex = Math.max(0, results.length - 1);
			scrollActiveIntoView();
		} else if (event.key === 'Tab') {
			// The input is the only tabbable control in the modal; keep focus here
			// so Tab can't escape behind the dialog.
			event.preventDefault();
		}
	}

	// Global ⌘K / Ctrl-K toggle + Esc to close.
	function onWindowKeydown(event: KeyboardEvent) {
		const isToggle = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
		if (isToggle) {
			event.preventDefault();
			if ($paletteOpen) close();
			else openPalette();
			return;
		}
		if (event.key === 'Escape' && $paletteOpen) {
			event.preventDefault();
			close();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', onWindowKeydown);
		return () => window.removeEventListener('keydown', onWindowKeydown);
	});

	// Drive load + focus off the open state so every trigger (header button,
	// ⌘K, or any future caller) behaves identically.
	$effect(() => {
		if (!$paletteOpen) return;
		previouslyFocused = document.activeElement as HTMLElement | null;
		loadIndex();
		tick().then(() => inputEl?.focus());
	});

	// Lock body scroll while open.
	$effect(() => {
		if (typeof document === 'undefined') return;
		document.body.style.overflow = $paletteOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	function onBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) close();
	}
</script>

{#if $paletteOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="palette-backdrop" onclick={onBackdropClick}>
		<div
			class="palette"
			role="dialog"
			aria-modal="true"
			aria-label="Search the site"
		>
			<div class="search-row">
				<svg
					class="search-icon"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8"></circle>
					<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
				</svg>
				<input
					bind:this={inputEl}
					bind:value={query}
					onkeydown={onInputKeydown}
					type="text"
					class="search-input"
					placeholder="Search docs, modules, components…"
					role="combobox"
					aria-expanded="true"
					aria-controls="palette-results"
					aria-autocomplete="list"
					aria-activedescendant={results.length ? `palette-opt-${activeIndex}` : undefined}
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
				/>
				<kbd class="esc-hint">Esc</kbd>
			</div>

			<ul
				bind:this={listEl}
				class="results"
				id="palette-results"
				role="listbox"
				aria-label="Search results"
			>
				{#if loadError}
					<li class="empty">Search index unavailable.</li>
				{:else if !loaded}
					<li class="empty">Loading…</li>
				{:else if results.length === 0}
					<li class="empty">No results for “{query}”.</li>
				{:else}
					{#each results as record, i (record.href + i)}
						<li
							id="palette-opt-{i}"
							data-index={i}
							role="option"
							aria-selected={i === activeIndex}
						>
							<button
								type="button"
								class="result"
								class:active={i === activeIndex}
								onmousemove={() => (activeIndex = i)}
								onclick={() => selectAt(i)}
								tabindex="-1"
							>
								<span class="result-main">
									<span class="result-label">{record.label}</span>
									{#if !record.isPage}
										<span class="result-context">{record.pageTitle}</span>
									{/if}
								</span>
								<span class="result-section">{record.section}</span>
							</button>
						</li>
					{/each}
				{/if}
			</ul>

			<div class="palette-footer">
				<span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
				<span><kbd>↵</kbd> open</span>
				<span><kbd>Esc</kbd> close</span>
			</div>
		</div>
	</div>
{/if}

<style>
	.palette-backdrop {
		position: fixed;
		inset: 0;
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding: 12vh 16px 16px;
		background: color-mix(in srgb, var(--smrt-color-scrim, #000) 45%, transparent);
		backdrop-filter: blur(2px);
	}

	.palette {
		width: 100%;
		max-width: 560px;
		background: var(--smrt-color-surface, #fff);
		color: var(--smrt-color-on-surface, #1a1a1a);
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: var(--smrt-radius-lg, 12px);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.28);
		overflow: hidden;
		display: flex;
		flex-direction: column;
		max-height: 70vh;
	}

	.search-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 16px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.search-icon {
		flex-shrink: 0;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	.search-input {
		flex: 1;
		border: none;
		background: transparent;
		font-size: 1rem;
		color: var(--smrt-color-on-surface, #1a1a1a);
		outline: none;
		font-family: inherit;
	}

	.search-input::placeholder {
		color: var(--smrt-color-on-surface-variant, #999);
	}

	.esc-hint,
	.palette-footer kbd {
		flex-shrink: 0;
		font-family: var(--smrt-font-family-mono, monospace);
		font-size: 0.7rem;
		padding: 2px 6px;
		border: 1px solid var(--smrt-color-outline, #d5d5d5);
		border-radius: var(--smrt-radius-sm, 4px);
		color: var(--smrt-color-on-surface-variant, #888);
		background: var(--smrt-color-surface-container, #f5f5f5);
		line-height: 1.2;
	}

	.results {
		list-style: none;
		margin: 0;
		padding: 6px;
		overflow-y: auto;
		flex: 1;
	}

	.results li {
		margin: 0;
	}

	.empty {
		padding: 24px 12px;
		text-align: center;
		color: var(--smrt-color-on-surface-variant, #888);
		font-size: 0.9rem;
	}

	.result {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		width: 100%;
		padding: 10px 12px;
		border: none;
		background: transparent;
		border-radius: var(--smrt-radius-md, 8px);
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		color: inherit;
	}

	.result.active {
		background: var(--smrt-color-primary-container, #e3f2fd);
		color: var(--smrt-color-on-primary-container, #0d47a1);
	}

	.result-main {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.result-label {
		font-size: 0.92rem;
		font-weight: 500;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.result-context {
		font-size: 0.75rem;
		color: var(--smrt-color-on-surface-variant, #888);
	}

	.result.active .result-context {
		color: inherit;
		opacity: 0.8;
	}

	.result-section {
		flex-shrink: 0;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--smrt-color-on-surface-variant, #999);
		padding: 2px 8px;
		border-radius: 10px;
		background: var(--smrt-color-surface-container, #f0f0f0);
	}

	.result.active .result-section {
		background: color-mix(in srgb, var(--smrt-color-on-primary-container, #0d47a1) 12%, transparent);
		color: inherit;
	}

	.palette-footer {
		display: flex;
		gap: 16px;
		padding: 10px 16px;
		border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		font-size: 0.75rem;
		color: var(--smrt-color-on-surface-variant, #888);
		background: var(--smrt-color-surface-container-low, #fafafa);
	}

	.palette-footer span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	@media (max-width: 600px) {
		.palette-backdrop {
			padding: 8vh 12px 12px;
		}

		.palette-footer {
			display: none;
		}
	}
</style>
