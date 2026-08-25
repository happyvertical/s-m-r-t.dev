<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ReferenceFamilyBar from '$lib/components/ReferenceFamilyBar.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import {
		uiComponentSource,
		type UiComponentMember,
		type UiComponentReference
	} from '$lib/data/ui-components.generated';
	import { SMRT_VERSION } from '$lib/version';

	let { component }: { component: UiComponentReference } = $props();
	const importCode = $derived(`import { ${component.name} } from '${component.importPath}';`);

	function memberDescription(member: UiComponentMember): string {
		return member.description || 'See the canonical source for details.';
	}
</script>

<SEO
	title={`${component.name} · UI component reference`}
	description={`${component.name} props, state, events, import path, examples, and canonical source.`}
	url={`https://s-m-r-t.dev/reference/components/${component.slug}`}
/>

<ReferenceFamilyBar id="components" />

<article class="component-reference">
	<header>
		<a href="/reference/components">← All UI components</a>
		<p>{component.category}</p>
		<h1>{component.name}</h1>
		<span>{component.summary}</span>
	</header>

	<section class="contract-summary">
		<div>
			<h2>Public export</h2>
			<CodeBlock code={importCode} language="typescript" />
		</div>
		<dl>
			<div>
				<dt>Import path</dt>
				<dd><code>{component.importPath}</code></dd>
			</div>
			<div>
				<dt>Props</dt>
				<dd>{component.details.length}</dd>
			</div>
			<div>
				<dt>Bindable state</dt>
				<dd>{component.sections.length}</dd>
			</div>
			<div>
				<dt>Callback events</dt>
				<dd>{component.items.length}</dd>
			</div>
			<div>
				<dt>Verified release</dt>
				<dd>{SMRT_VERSION}</dd>
			</div>
		</dl>
	</section>

	<section>
		<h2>Props</h2>
		{#if component.sources.length}
			<p class="inherits">
				Also accepts <code>{component.sources.join(', ')}</code>. The table lists the
				component-specific contract.
			</p>
		{/if}
		{#if component.details.length}
			<div class="member-table" role="table" aria-label={`${component.name} props`}>
				<div class="member-head" role="row">
					<span role="columnheader">Name</span><span role="columnheader">Type</span><span
						role="columnheader">Required</span
					><span role="columnheader">Description</span>
				</div>
				{#each component.details as prop (prop.name)}
					<div role="row">
						<span role="cell"><code>{prop.name}</code></span><span role="cell"
							><code>{prop.code}</code></span
						><span role="cell">{prop.status ? 'Yes' : 'No'}</span><span role="cell"
							>{memberDescription(prop)}</span
						>
					</div>
				{/each}
			</div>
		{:else}
			<p class="empty-contract">This component declares no public props.</p>
		{/if}
	</section>

	<div class="state-events">
		<section>
			<h2>Bindable state</h2>
			{#if component.sections.length}
				<ul>
					{#each component.sections as member (member.name)}
						<li><code>bind:{member.name}</code><span>{member.code}</span></li>
					{/each}
				</ul>
			{:else}
				<p class="empty-contract">This component has no bindable public state.</p>
			{/if}
		</section>
		<section>
			<h2>Callback events</h2>
			{#if component.items.length}
				<ul>
					{#each component.items as event (event.name)}
						<li><code>{event.name}</code><span>{event.code}</span></li>
					{/each}
				</ul>
			{:else}
				<p class="empty-contract">This component declares no callback event props.</p>
			{/if}
		</section>
	</div>

	<section>
		<h2>Examples and explanation</h2>
		<div class="related-cards">
			{#if component.demo}
				<a href={component.demo.href}>
					<strong>{component.demo.label}</strong>
					<span>Run the canonical package-owned example in the Playground.</span>
				</a>
			{/if}
			<a href={component.related.href}>
				<strong>{component.related.label}</strong>
				<span>Read the curated UI story for mechanism and usage guidance.</span>
			</a>
			<a href="/reference/packages/smrt-ui?tab=components">
				<strong>smrt-ui package reference</strong>
				<span>See package status, version, limitations, and all public subpaths.</span>
			</a>
		</div>
	</section>

	<footer>
		<p>
			Generated from the declaration contract shipped in <code>@happyvertical/smrt-ui</code>.
			<a href={uiComponentSource(component)} target="_blank" rel="noreferrer"
				>Open the canonical source ↗</a
			>
		</p>
	</footer>
</article>

<style>
	.component-reference {
		width: min(1100px, calc(100% - 40px));
		margin: 0 auto;
		padding: 2.75rem 0 6rem;
	}

	header {
		max-width: 48rem;
		padding-bottom: 2.5rem;
	}

	header > a {
		color: var(--site-muted);
		font: 0.68rem var(--site-font-mono);
		text-decoration: none;
	}

	header > p {
		margin-top: 1.5rem;
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h1 {
		margin-top: 0.6rem;
		font: 650 clamp(2.1rem, 6vw, 4rem) var(--site-font-mono);
		letter-spacing: -0.05em;
	}

	header > span {
		display: block;
		margin-top: 1rem;
		color: var(--site-muted);
		line-height: 1.65;
	}

	section,
	footer {
		padding: 2.5rem 0;
		border-top: 1px solid var(--site-line-strong);
	}

	section > h2,
	.contract-summary h2 {
		margin-bottom: 1rem;
		font-size: 1.15rem;
	}

	.contract-summary {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(17rem, 0.75fr);
		gap: clamp(2rem, 7vw, 6rem);
	}

	dl {
		border-top: 1px solid var(--site-line);
	}

	dl div {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--site-line);
	}

	dt,
	dd {
		font-size: 0.7rem;
	}

	dt {
		color: var(--site-muted);
	}

	.inherits,
	.empty-contract,
	footer p {
		color: var(--site-muted);
		font-size: 0.78rem;
		line-height: 1.55;
	}

	.inherits {
		margin-bottom: 1rem;
	}

	.member-table {
		min-width: 0;
		overflow-x: auto;
	}

	.member-table > div {
		min-width: 54rem;
		display: grid;
		grid-template-columns: 0.65fr 1.2fr 0.45fr 1.7fr;
		gap: 1rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--site-line);
	}

	.member-head {
		border-top: 1px solid var(--site-line);
		color: var(--site-muted);
		font: 0.62rem var(--site-font-mono);
		text-transform: uppercase;
	}

	.member-table code,
	.member-table span {
		font-size: 0.7rem;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	.state-events {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 2rem;
		border-top: 1px solid var(--site-line-strong);
	}

	.state-events section {
		border-top: 0;
	}

	ul {
		border-top: 1px solid var(--site-line);
		list-style: none;
	}

	li {
		display: grid;
		gap: 0.3rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--site-line);
	}

	li code {
		font-size: 0.72rem;
		font-weight: 700;
	}

	li span {
		color: var(--site-muted);
		font-size: 0.68rem;
		overflow-wrap: anywhere;
	}

	.related-cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.65rem;
	}

	.related-cards a {
		display: grid;
		gap: 0.45rem;
		padding: 1rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		color: var(--site-ink);
		text-decoration: none;
	}

	.related-cards a:hover {
		border-color: var(--site-accent-strong);
	}

	.related-cards strong {
		font-size: 0.8rem;
	}

	.related-cards span {
		color: var(--site-muted);
		font-size: 0.72rem;
		line-height: 1.45;
	}

	footer a {
		margin-left: 0.35rem;
		color: var(--site-ink);
	}

	@media (max-width: 48rem) {
		.component-reference {
			width: min(100% - 28px, 1100px);
		}

		.contract-summary,
		.state-events,
		.related-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
