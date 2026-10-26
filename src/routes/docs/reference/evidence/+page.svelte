<script lang="ts">
	/**
	 * /reference/evidence — the release-audit ledger behind the homepage (#321
	 * slice E). Every row in `why-smrt-claims.ts` renders here with its row id as
	 * the anchor, so a "Sources" link elsewhere on the site can point at
	 * `/docs/reference/evidence#<rowId>` and land on the row it cites.
	 */
	import ReferenceFamilyBar from '$lib/components/ReferenceFamilyBar.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { whySmrtClaims } from '$lib/data/why-smrt-claims';
	import { SMRT_VERSION } from '$lib/version';
</script>

<SEO
	title="Evidence"
	description="Each claim the s-m-r-t site makes about the framework, with the page that explains it and the released source it was checked against."
	url="https://s-m-r-t.dev/docs/reference/evidence"
/>

<ReferenceFamilyBar id="evidence" />

<article class="evidence-page">
	<header>
		<p class="eyebrow">Reference</p>
		<h1>Evidence</h1>
		<p class="lede">
			Each claim the site makes about the framework, with the page that explains it and the released
			source it was checked against.
		</p>
		<p class="pinned">
			Package sources are the AGENTS.md contracts shipped in s-m-r-t
			<span class="version">{SMRT_VERSION}</span>; the site row links a commit of this repository.
		</p>
	</header>

	<div class="table-wrap">
		<table>
			<thead>
				<tr>
					<th scope="col">Claim</th>
					<th scope="col">Source</th>
				</tr>
			</thead>
			<tbody>
				{#each whySmrtClaims as claim (claim.id)}
					<tr id={claim.id}>
						<td data-label="Claim">
							<p>{claim.display}</p>
							<p class="where">
								Explained at <a href={claim.canonical.href}>{claim.canonical.label}</a>
								{#if claim.demo}
									· Try it: <a href={claim.demo.href}>{claim.demo.label}</a>
								{/if}
							</p>
						</td>
						<td data-label="Source">
							<a href={claim.source.href} rel="noreferrer" target="_blank">{claim.source.label} ↗</a
							>
							<a class="permalink" href={`#${claim.id}`} aria-label="Link to this row">#</a>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<p class="note">
		The audit wording for each row lives with its id in the site source, <code
			>src/lib/data/why-smrt-claims.ts</code
		>. A row is removed when its source no longer supports it.
	</p>
</article>

<style>
	.evidence-page {
		width: min(1060px, calc(100% - 40px));
		margin: 0 auto;
		padding: 54px 0 86px;
	}
	header {
		max-width: 740px;
		padding-bottom: 34px;
	}
	.eyebrow {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	h1 {
		margin-top: 10px;
		font-size: clamp(2.15rem, 5vw, 3.25rem);
		font-weight: 680;
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	.lede {
		margin-top: 17px;
		color: var(--site-muted);
		font-size: 0.98rem;
		line-height: 1.68;
	}
	.pinned {
		margin-top: 14px;
		color: var(--site-muted);
		font: 0.66rem var(--site-font-mono);
		letter-spacing: 0.03em;
		line-height: 1.5;
	}
	.table-wrap {
		overflow-x: auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.88rem;
	}
	th {
		padding: 0.6rem 0.75rem;
		border-bottom: 2px solid var(--site-line-strong);
		color: var(--site-muted);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.05em;
		text-align: left;
		text-transform: uppercase;
	}
	td {
		padding: 1rem 0.75rem;
		border-bottom: 1px solid var(--site-line);
		vertical-align: top;
		line-height: 1.55;
	}
	td:first-child {
		max-width: 34rem;
		color: var(--site-ink);
	}
	tr {
		scroll-margin-top: calc(var(--site-header-height) + 24px);
	}
	tr:target td {
		background: var(--site-accent-soft);
	}
	.where {
		margin-top: 6px;
		color: var(--site-muted);
		font-size: 0.78rem;
	}
	td a {
		color: var(--site-ink);
	}
	td:last-child a:first-child {
		font-family: var(--site-font-mono);
		font-size: 0.78rem;
	}
	.permalink {
		margin-left: 0.5rem;
		color: var(--site-muted);
		text-decoration: none;
	}
	.permalink:hover {
		color: var(--site-accent-strong);
	}
	.note {
		margin-top: 28px;
		color: var(--site-muted);
		font-size: 0.82rem;
		line-height: 1.6;
	}
	.note code {
		font: 0.78rem var(--site-font-mono);
	}
	@media (max-width: 680px) {
		.evidence-page {
			width: min(100% - 28px, 1060px);
		}
		thead {
			display: none;
		}
		table,
		tbody,
		tr,
		td {
			display: block;
			width: 100%;
		}
		tr {
			padding: 0.75rem 0;
			border-bottom: 1px solid var(--site-line-strong);
		}
		td {
			padding: 0.3rem 0;
			border-bottom: 0;
		}
		td::before {
			content: attr(data-label);
			display: block;
			margin-bottom: 0.2rem;
			color: var(--site-muted);
			font: 700 0.62rem var(--site-font-mono);
			letter-spacing: 0.05em;
			text-transform: uppercase;
		}
	}
</style>
