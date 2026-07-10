<script lang="ts">
	import { goto } from '$app/navigation';
	import { searchItems } from '$lib/data/navigation';

	let open = $state(false);
	let query = $state('');
	let input = $state<HTMLInputElement>();

	const results = $derived.by(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return searchItems.slice(0, 8);

		return searchItems
			.filter((item) =>
				[item.label, item.description ?? '', ...(item.keywords ?? [])]
					.join(' ')
					.toLowerCase()
					.includes(normalized)
			)
			.slice(0, 10);
	});

	function show() {
		open = true;
		setTimeout(() => input?.focus());
	}

	function hide() {
		open = false;
		query = '';
	}

	async function choose(href: string) {
		hide();
		await goto(href);
	}

	function handleKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			if (open) hide();
			else show();
		}
		if (event.key === 'Escape' && open) hide();
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
	<div class="search-backdrop" role="presentation" onclick={hide}></div>
	<div class="search-dialog" role="dialog" aria-modal="true" aria-label="Search documentation">
		<div class="search-input">
			<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
				<circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path>
			</svg>
			<input
				bind:this={input}
				bind:value={query}
				placeholder="Search pages, packages, or components"
			/>
			<button type="button" onclick={hide}>Esc</button>
		</div>
		<div class="search-results">
			{#if results.length}
				{#each results as result (result.href)}
					<button type="button" onclick={() => choose(result.href)}>
						<strong>{result.label}</strong>
						{#if result.description}<span>{result.description}</span>{/if}
					</button>
				{/each}
			{:else}
				<p>No documentation matches “{query}”.</p>
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

	.search-results > button {
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

	.search-results > button:hover,
	.search-results > button:focus-visible {
		background: var(--site-paper-deep);
	}

	.search-results strong {
		font-size: 0.86rem;
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
