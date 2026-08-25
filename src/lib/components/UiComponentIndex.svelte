<script lang="ts">
	import ReferenceFamilyBar from '$lib/components/ReferenceFamilyBar.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { uiComponentGroups, uiComponents } from '$lib/data/ui-components.generated';
	import { SMRT_VERSION } from '$lib/version';

	let query = $state('');
	let activeGroup = $state('all');
	const normalizedQuery = $derived(query.trim().toLowerCase());
	const visibleComponents = $derived(
		uiComponents.filter((component) => {
			const matchesGroup = activeGroup === 'all' || component.family === activeGroup;
			const matchesQuery =
				!normalizedQuery ||
				component.name.toLowerCase().includes(normalizedQuery) ||
				component.summary.toLowerCase().includes(normalizedQuery) ||
				component.importPath.toLowerCase().includes(normalizedQuery) ||
				component.details.some((prop) => prop.name.toLowerCase().includes(normalizedQuery));
			return matchesGroup && matchesQuery;
		})
	);
</script>

<SEO
	title="s-m-r-t UI component reference"
	description="Search every public smrt-ui component export and inspect its props, bindable state, callback events, import path, examples, and canonical source."
	url="https://s-m-r-t.dev/reference/components"
/>

<ReferenceFamilyBar id="components" />

<article class="component-index-page">
	<header>
		<p>Generated Reference</p>
		<h1>UI component reference</h1>
		<span>
			Search the public component exports in <code>@happyvertical/smrt-ui</code>. Each contract is
			read from the declaration files in release {SMRT_VERSION}.
		</span>
	</header>

	<section class="component-tools" aria-label="Filter UI components">
		<label>
			<span>Search components, props, or import paths</span>
			<input bind:value={query} placeholder="Try DataTable, onchange, or forms…" />
		</label>
		<div class="group-filters">
			<button class:active={activeGroup === 'all'} onclick={() => (activeGroup = 'all')}>
				All <span>{uiComponents.length}</span>
			</button>
			{#each uiComponentGroups as group (group.id)}
				<button class:active={activeGroup === group.id} onclick={() => (activeGroup = group.id)}>
					{group.title}
					<span>{uiComponents.filter((component) => component.family === group.id).length}</span>
				</button>
			{/each}
		</div>
	</section>

	<section class="component-results" aria-live="polite">
		<p class="result-count">{visibleComponents.length} public exports</p>
		{#each uiComponentGroups as group (group.id)}
			{@const entries = visibleComponents.filter((component) => component.family === group.id)}
			{#if entries.length}
				<div class="component-group">
					<div>
						<h2>{group.title}</h2>
						<span>{entries.length}</span>
					</div>
					<ul>
						{#each entries as component (component.slug)}
							<li>
								<a href={`/reference/components/${component.slug}`}>
									<strong>{component.name}</strong>
									<code>{component.importPath}</code>
									<span>
										{component.details.length} props · {component.sections.length} bindable ·
										{component.items.length} callbacks
									</span>
									<b aria-hidden="true">→</b>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		{/each}
		{#if visibleComponents.length === 0}
			<div class="empty-result">
				<strong>No component matches “{query}”.</strong>
				<span>Try an export name, a prop name, or an import subpath.</span>
			</div>
		{/if}
	</section>
</article>

<style>
	.component-index-page {
		width: min(1180px, calc(100% - 40px));
		margin: 0 auto;
		padding: 2.75rem 0 6rem;
	}

	header {
		max-width: 48rem;
		padding-bottom: 2.5rem;
	}

	header > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.09em;
		text-transform: uppercase;
	}

	h1 {
		margin-top: 0.7rem;
		font-size: clamp(2.2rem, 6vw, 4rem);
		letter-spacing: -0.05em;
		line-height: 1;
	}

	header > span {
		display: block;
		margin-top: 1rem;
		color: var(--site-muted);
		line-height: 1.65;
	}

	.component-tools {
		position: sticky;
		top: var(--site-header-height);
		z-index: 20;
		padding: 1rem 0;
		border-block: 1px solid var(--site-line-strong);
		background: color-mix(in srgb, var(--site-paper) 94%, transparent);
		backdrop-filter: blur(14px);
	}

	label {
		display: grid;
		grid-template-columns: minmax(12rem, 18rem) minmax(0, 1fr);
		align-items: center;
		gap: 1rem;
		font: 0.66rem var(--site-font-mono);
	}

	input {
		width: 100%;
		padding: 0.7rem 0;
		border: 0;
		border-bottom: 1px solid var(--site-line-strong);
		outline: 0;
		background: transparent;
		color: var(--site-ink);
		font-size: 0.95rem;
	}

	.group-filters {
		display: flex;
		gap: 0.4rem;
		margin-top: 0.85rem;
		overflow-x: auto;
	}

	button {
		flex: 0 0 auto;
		padding: 0.45rem 0.65rem;
		border: 1px solid var(--site-line-strong);
		border-radius: 999px;
		background: transparent;
		color: var(--site-muted);
		font: 0.62rem var(--site-font-mono);
		cursor: pointer;
	}

	button span {
		margin-left: 0.35rem;
		opacity: 0.65;
	}

	button:hover,
	button.active {
		background: var(--site-ink);
		color: var(--site-paper);
	}

	.component-results {
		padding-top: 2rem;
	}

	.result-count {
		padding-bottom: 1rem;
		color: var(--site-muted);
		font: 0.64rem var(--site-font-mono);
	}

	.component-group {
		display: grid;
		grid-template-columns: minmax(12rem, 0.45fr) minmax(0, 1.55fr);
		gap: clamp(2rem, 6vw, 6rem);
		padding: 2.25rem 0;
		border-top: 1px solid var(--site-line-strong);
	}

	.component-group > div:first-child {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.component-group h2 {
		font-size: 0.95rem;
	}

	.component-group > div span {
		color: var(--site-accent-strong);
		font: 0.65rem var(--site-font-mono);
	}

	ul {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}

	li {
		border-bottom: 1px solid var(--site-line);
	}

	li a {
		display: grid;
		grid-template-columns: minmax(8rem, 0.6fr) minmax(12rem, 1fr) auto 1rem;
		gap: 1rem;
		align-items: center;
		padding: 0.85rem 0;
		color: var(--site-ink);
		text-decoration: none;
	}

	li a:hover strong {
		text-decoration: underline;
		text-decoration-color: var(--site-accent-strong);
		text-underline-offset: 0.2rem;
	}

	li strong,
	li code,
	li span {
		font-size: 0.7rem;
	}

	li code,
	li span {
		color: var(--site-muted);
	}

	.empty-result {
		display: grid;
		gap: 0.5rem;
		padding: 4rem 0;
		border-top: 1px solid var(--site-line-strong);
		text-align: center;
	}

	.empty-result span {
		color: var(--site-muted);
	}

	@media (max-width: 48rem) {
		.component-index-page {
			width: min(100% - 28px, 1180px);
		}

		label,
		.component-group {
			grid-template-columns: 1fr;
		}

		li a {
			grid-template-columns: minmax(0, 1fr) auto;
		}

		li code,
		li span {
			grid-column: 1;
		}

		li b {
			grid-column: 2;
			grid-row: 1 / span 3;
		}
	}
</style>
