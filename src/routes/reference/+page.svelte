<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import SEO from '$lib/components/SEO.svelte';
	import { packages } from '$lib/data/packages';
	import { referenceFamilies } from '$lib/data/reference-families';
	import { referenceGuides } from '$lib/data/reference';
	import { uiComponents } from '$lib/data/ui-components.generated';

	interface ReferenceResult {
		label: string;
		description: string;
		href: string;
		kind: 'Family' | 'Package' | 'Component' | 'Contract';
		keywords: string[];
	}

	const results: ReferenceResult[] = [
		...referenceFamilies.map((family) => ({
			label: family.label,
			description: family.description,
			href: family.href,
			kind: 'Family' as const,
			keywords: family.keywords
		})),
		...packages.map((pkg) => ({
			label: pkg.name,
			description: pkg.summary,
			href: `/reference/packages/${pkg.slug}`,
			kind: 'Package' as const,
			keywords: [pkg.category, pkg.kind, pkg.status ?? 'stable', ...pkg.components]
		})),
		...uiComponents.map((component) => ({
			label: component.name,
			description: `${component.category} · ${component.importPath}`,
			href: `/reference/components/${component.slug}`,
			kind: 'Component' as const,
			keywords: [
				component.category,
				component.importPath,
				...component.details.map((prop) => prop.name)
			]
		})),
		...referenceGuides.map((guide) => ({
			label: guide.navTitle ?? guide.title,
			description: guide.plainEnglish,
			href: `/reference/${guide.slug}`,
			kind: 'Contract' as const,
			keywords: guide.packages
		}))
	];

	let query = $state('');
	const normalizedQuery = $derived(query.trim().toLowerCase());
	const searchResults = $derived.by(() => {
		if (!normalizedQuery) return [];
		const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
		const matches = results.filter((result) => {
			const haystack = [result.label, result.description, ...result.keywords]
				.join(' ')
				.toLowerCase();
			return tokens.every((token) => haystack.includes(token));
		});
		const seen = new SvelteSet<string>();
		return matches
			.sort((a, b) => {
				const aExact = a.label.toLowerCase() === normalizedQuery ? 0 : 1;
				const bExact = b.label.toLowerCase() === normalizedQuery ? 0 : 1;
				return aExact - bExact || a.label.localeCompare(b.label);
			})
			.filter((result) => {
				if (seen.has(result.href)) return false;
				seen.add(result.href);
				return true;
			})
			.slice(0, 24);
	});
</script>

<SEO
	title="s-m-r-t reference"
	description="Search s-m-r-t API contracts, packages, UI components, configuration, decorators, collections, generated interfaces, security, field policies, terminology, versions, and FAQ content."
	url="https://s-m-r-t.dev/reference"
/>

<article class="reference-index">
	<header>
		<p>Reference</p>
		<h1>Look up the exact contract.</h1>
		<span>
			Search packages, UI components, props, generated surfaces, and framework terms. Use a section
			story or a guide when you need an explanation or a procedure.
		</span>
		<div class="reference-search" role="search">
			<label for="reference-query">Search Reference</label>
			<input
				id="reference-query"
				bind:value={query}
				placeholder="Try DataTable, authorization, smrt-users, or REST…"
				autocomplete="off"
			/>
			<span>{packages.length} packages · {uiComponents.length} component exports</span>
		</div>
	</header>

	{#if normalizedQuery}
		<section class="search-results" aria-live="polite">
			<div class="section-heading">
				<h2>Search results</h2>
				<span>{searchResults.length}</span>
			</div>
			{#if searchResults.length}
				<ul>
					{#each searchResults as result (`${result.kind}:${result.href}`)}
						<li>
							<a href={result.href}>
								<small>{result.kind}</small>
								<strong>{result.label}</strong>
								<span>{result.description}</span>
								<b aria-hidden="true">→</b>
							</a>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="empty-search">
					No Reference entry matches “{query}”. Try a package, export, prop, or contract name.
				</p>
			{/if}
		</section>
	{/if}

	<section>
		<div class="section-heading">
			<h2>Reference families</h2>
			<span>{referenceFamilies.length}</span>
		</div>
		<div class="family-grid">
			{#each referenceFamilies as family (family.id)}
				<a href={family.href}>
					<strong>{family.label}</strong>
					<p>{family.description}</p>
					<span>Open →</span>
				</a>
			{/each}
		</div>
	</section>
</article>

<style>
	.reference-index {
		width: min(1100px, calc(100% - 48px));
		margin: 0 auto;
		padding: 3.4rem 0 6rem;
	}

	header {
		max-width: 52rem;
		padding-bottom: 3rem;
	}

	header > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		margin-top: 0.7rem;
		font-size: clamp(2.35rem, 7vw, 4.7rem);
		letter-spacing: -0.055em;
		line-height: 0.98;
	}

	header > span {
		display: block;
		max-width: 46rem;
		margin-top: 1.1rem;
		color: var(--site-muted);
		line-height: 1.65;
	}

	.reference-search {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.65rem 1.25rem;
		align-items: center;
		margin-top: 2rem;
		padding: 1rem 1.15rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	.reference-search label {
		font: 700 0.65rem var(--site-font-mono);
		text-transform: uppercase;
	}

	.reference-search input {
		min-width: 0;
		padding: 0.7rem 0;
		border: 0;
		border-bottom: 1px solid var(--site-line-strong);
		outline: 0;
		background: transparent;
		color: var(--site-ink);
		font-size: 1rem;
	}

	.reference-search span {
		grid-column: 2;
		color: var(--site-muted);
		font: 0.62rem var(--site-font-mono);
	}

	section {
		padding: 2rem 0 2.75rem;
		border-top: 1px solid var(--site-line-strong);
	}

	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.section-heading h2 {
		font-size: 1.1rem;
	}

	.section-heading span {
		color: var(--site-accent-strong);
		font: 0.65rem var(--site-font-mono);
	}

	.family-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.family-grid a {
		min-height: 10rem;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}

	.family-grid a:hover {
		border-color: var(--site-accent-strong);
	}

	.family-grid strong,
	.search-results strong {
		font-size: 0.82rem;
	}

	.family-grid p {
		margin-top: 0.4rem;
		color: var(--site-muted);
		font-size: 0.74rem;
		line-height: 1.5;
	}

	.family-grid a > span {
		margin-top: auto;
		padding-top: 1rem;
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
	}

	.search-results ul {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}

	.search-results li {
		border-bottom: 1px solid var(--site-line);
	}

	.search-results a {
		display: grid;
		grid-template-columns: 6rem 13rem minmax(0, 1fr) 1rem;
		gap: 1rem;
		align-items: center;
		padding: 0.8rem 0;
		color: var(--site-ink);
		text-decoration: none;
	}

	.search-results small {
		color: var(--site-accent-strong);
		font: 0.6rem var(--site-font-mono);
		text-transform: uppercase;
	}

	.search-results a > span,
	.empty-search {
		color: var(--site-muted);
		font-size: 0.74rem;
		line-height: 1.45;
	}

	.empty-search {
		padding: 2rem 0;
	}

	@media (max-width: 48rem) {
		.reference-index {
			width: min(100% - 28px, 1100px);
		}

		.family-grid {
			grid-template-columns: 1fr;
		}

		.family-grid a {
			min-height: 0;
		}

		.reference-search,
		.search-results a {
			grid-template-columns: 1fr auto;
		}

		.reference-search input,
		.reference-search span,
		.search-results small,
		.search-results a > span {
			grid-column: 1;
		}

		.search-results b {
			grid-column: 2;
			grid-row: 1 / span 3;
		}
	}
</style>
