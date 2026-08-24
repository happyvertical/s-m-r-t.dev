<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import {
		packageCategories,
		packageStatusLabels,
		packages,
		packagesInCategory,
		type PackageCategory
	} from '$lib/data/packages';
	import { getPlaygroundEntries } from '$lib/data/playgrounds';
	import { SMRT_VERSION } from '$lib/version';

	let query = $state('');
	let activeCategory = $state<'All' | PackageCategory>('All');
	const normalizedQuery = $derived(query.trim().toLowerCase());
	const visiblePackages = $derived(
		packages.filter((pkg) => {
			const matchesCategory = activeCategory === 'All' || pkg.category === activeCategory;
			const matchesQuery =
				!normalizedQuery ||
				pkg.name.toLowerCase().includes(normalizedQuery) ||
				pkg.summary.toLowerCase().includes(normalizedQuery) ||
				pkg.components.some((component) => component.toLowerCase().includes(normalizedQuery)) ||
				getPlaygroundEntries(pkg.slug).some((entry) =>
					entry.toLowerCase().includes(normalizedQuery)
				);
			return matchesCategory && matchesQuery;
		})
	);
</script>

<SEO
	title="s-m-r-t packages"
	description="Browse every s-m-r-t package in one workbench, with package descriptions, component exports, and REST, MCP, WebMCP, and CLI interface guidance."
	url="https://s-m-r-t.dev/packages"
/>

<article class="packages-page">
	<header>
		<p class="eyebrow">Reference</p>
		<h1>Package reference</h1>
		<div class="intro">
			<p>
				Open a package and read its purpose. Browse its components and playground entries. Check how
				its models appear through REST, MCP, WebMCP, and CLI.
			</p>
			<dl>
				<div>
					<dt>Packages</dt>
					<dd>{packages.length}</dd>
				</div>
				<div>
					<dt>Release</dt>
					<dd>{SMRT_VERSION}</dd>
				</div>
			</dl>
		</div>
	</header>

	<section class="package-tools" aria-label="Filter packages">
		<label
			><span>Search</span><input
				bind:value={query}
				placeholder="Search packages or capabilities…"
			/></label
		>
		<div class="category-filters">
			<button class:active={activeCategory === 'All'} onclick={() => (activeCategory = 'All')}
				>All <span>{packages.length}</span></button
			>
			{#each packageCategories as category (category)}
				<button
					class:active={activeCategory === category}
					onclick={() => (activeCategory = category)}
					>{category} <span>{packagesInCategory(category).length}</span></button
				>
			{/each}
		</div>
	</section>

	<section class="package-results" aria-live="polite">
		<div class="results-meta">
			<span>{visiblePackages.length} results</span><span
				>Overview · Components · Playground · REST · MCP · WebMCP · CLI</span
			>
		</div>
		{#each packageCategories as category (category)}
			{@const categoryPackages = visiblePackages.filter((pkg) => pkg.category === category)}
			{#if categoryPackages.length}
				<div class="category-section">
					<div class="category-title">
						<h2>{category}</h2>
						<span>{categoryPackages.length}</span>
					</div>
					<div class="package-list">
						{#each categoryPackages as pkg (pkg.slug)}
							<a href={`/packages/${pkg.slug}`}>
								<div class="package-name">
									<code>{pkg.name}</code><span>v{pkg.version}</span>{#if pkg.status === 'new'}<em
											>New</em
										>{:else if pkg.status === 'stub'}<em class="stub">{packageStatusLabels.stub}</em
										>{/if}
								</div>
								<p>{pkg.summary}</p>
								<div class="package-shape">
									{#if getPlaygroundEntries(pkg.slug).length}<span
											>{getPlaygroundEntries(pkg.slug).length} playground entries</span
										>{:else if pkg.components.length}<span
											>{pkg.components.length}
											{pkg.components.length === 1 ? 'component' : 'components'}</span
										>{:else}<span>{pkg.kind}</span>{/if}<b>→</b>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
		{#if visiblePackages.length === 0}<div class="no-results">
				<span>0</span>
				<p>No package matches “{query}”. Try a domain noun or clear the category filter.</p>
			</div>{/if}
	</section>
</article>

<style>
	.packages-page {
		width: min(1240px, calc(100% - 40px));
		margin: 0 auto;
		padding: 50px 0 90px;
	}

	header {
		padding: 10px 0 42px;
	}

	.eyebrow {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.68rem;
		font-weight: 750;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	header h1 {
		max-width: 760px;
		margin-top: 12px;
		font-size: clamp(2.15rem, 5vw, 3.25rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}

	.intro {
		display: grid;
		grid-template-columns: minmax(0, 650px) auto;
		justify-content: start;
		gap: 48px;
		margin-top: 18px;
	}

	.intro > p {
		color: var(--site-muted);
		font-size: 0.9rem;
		line-height: 1.75;
	}

	.intro dl {
		display: flex;
		gap: 28px;
	}

	.intro dl div {
		padding-left: 18px;
		border-left: 1px solid var(--site-line-strong);
	}

	.intro dt {
		color: var(--site-muted);
		font-family: var(--site-font-mono);
		font-size: 0.62rem;
		text-transform: uppercase;
	}

	.intro dd {
		margin-top: 4px;
		font-size: 1.2rem;
		font-weight: 700;
	}

	.package-tools {
		position: sticky;
		top: var(--site-header-height);
		z-index: 20;
		padding: 20px 0;
		border-block: 1px solid var(--site-line-strong);
		background: color-mix(in srgb, var(--site-paper) 93%, transparent);
		backdrop-filter: blur(14px);
	}

	.package-tools label {
		display: grid;
		grid-template-columns: 100px 1fr;
		align-items: center;
		gap: 20px;
	}

	.package-tools label span {
		font-family: var(--site-font-mono);
		font-size: 0.66rem;
		font-weight: 750;
		text-transform: uppercase;
	}

	.package-tools input {
		width: 100%;
		padding: 10px 0;
		border: 0;
		border-bottom: 1px solid var(--site-line-strong);
		background: transparent;
		color: var(--site-ink);
		font-size: 1rem;
		outline: none;
	}

	.package-tools input::placeholder {
		color: var(--site-muted);
	}

	.category-filters {
		display: flex;
		gap: 7px;
		margin-top: 18px;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.category-filters button {
		flex: 0 0 auto;
		padding: 8px 11px;
		border: 1px solid var(--site-line-strong);
		border-radius: 999px;
		background: transparent;
		color: var(--site-muted);
		font-family: var(--site-font-mono);
		font-size: 0.62rem;
		cursor: pointer;
	}

	.category-filters button span {
		margin-left: 6px;
		opacity: 0.6;
	}

	.category-filters button:hover,
	.category-filters button.active {
		--site-ink: #11150f;
		--site-paper: #f3efe5;
		border-color: var(--site-ink);
		background: var(--site-ink);
		color: var(--site-paper);
	}

	.package-results {
		padding-top: 46px;
	}

	.results-meta {
		display: flex;
		justify-content: space-between;
		gap: 30px;
		padding-bottom: 18px;
		color: var(--site-muted);
		font-family: var(--site-font-mono);
		font-size: 0.62rem;
	}

	.category-section {
		display: grid;
		grid-template-columns: 190px minmax(0, 1fr);
		gap: clamp(40px, 7vw, 90px);
		padding: 48px 0 72px;
		border-top: 1px solid var(--site-line-strong);
	}

	.category-title {
		position: sticky;
		top: 220px;
		align-self: start;
		display: flex;
		justify-content: space-between;
		gap: 20px;
	}

	.category-title h2 {
		font-size: 1rem;
	}

	.category-title span {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.64rem;
	}

	.package-list {
		border-top: 1px solid var(--site-line);
	}

	.package-list a {
		display: grid;
		grid-template-columns: minmax(220px, 0.8fr) minmax(300px, 1.2fr) 130px;
		gap: 28px;
		align-items: start;
		padding: 22px 0;
		border-bottom: 1px solid var(--site-line);
		color: var(--site-ink);
		text-decoration: none;
	}

	.package-name {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}

	.package-name code {
		font-family: var(--site-font-mono);
		font-size: 0.72rem;
		font-weight: 700;
	}

	.package-name span,
	.package-name em {
		font-family: var(--site-font-mono);
		font-size: 0.57rem;
	}

	.package-name span {
		color: var(--site-muted);
	}

	.package-name em {
		padding: 3px 6px;
		border-radius: 999px;
		background: var(--site-accent-soft);
		color: var(--site-accent-strong);
		font-style: normal;
		font-weight: 750;
	}

	.package-name em.stub {
		background: var(--site-warn-soft);
		box-shadow: inset 0 0 0 1px var(--site-warn);
		color: var(--site-warn);
	}

	.package-list a > p {
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.58;
	}

	.package-shape {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		color: var(--site-muted);
		font-family: var(--site-font-mono);
		font-size: 0.61rem;
	}

	.package-shape b {
		color: var(--site-ink);
		transition: transform 160ms ease;
	}

	.package-list a:hover .package-shape b {
		transform: translateX(5px);
	}

	.no-results {
		min-height: 300px;
		display: grid;
		place-items: center;
		align-content: center;
		gap: 16px;
		border-top: 1px solid var(--site-line-strong);
		text-align: center;
	}

	.no-results span {
		font-family: var(--site-font-mono);
		font-size: 2rem;
	}

	.no-results p {
		max-width: 520px;
		color: var(--site-muted);
	}

	@media (max-width: 900px) {
		.packages-page {
			width: min(100% - 28px, 1240px);
			padding-top: 40px;
		}

		.intro,
		.category-section {
			grid-template-columns: 1fr;
		}

		.category-title {
			position: static;
		}

		.package-list a {
			grid-template-columns: 1fr 1fr;
		}

		.package-shape {
			grid-column: 2;
		}
	}

	@media (max-width: 600px) {
		.package-tools label {
			grid-template-columns: 1fr;
			gap: 5px;
		}

		.package-list a {
			grid-template-columns: 1fr 30px;
		}

		.package-list a > p {
			grid-column: 1;
		}

		.package-shape {
			grid-column: 2;
			grid-row: 1 / 3;
		}

		.package-shape span {
			display: none;
		}
	}
</style>
