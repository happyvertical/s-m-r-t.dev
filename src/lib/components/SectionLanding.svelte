<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { getDocumentationSection, type DocumentationSectionId } from '$lib/data/navigation';

	let { sectionId }: { sectionId: DocumentationSectionId } = $props();
	const section = $derived(getDocumentationSection(sectionId));
</script>

<SEO
	title={`s-m-r-t ${section.label}`}
	description={section.description}
	url={`https://s-m-r-t.dev${section.href}`}
/>

<article class="section-landing">
	<header>
		<p>Documentation section</p>
		<h1>{section.title}</h1>
		<span>{section.description}</span>
	</header>

	<div class="section-groups">
		{#each section.groups as group (group.label)}
			<section>
				<h2>{group.label}</h2>
				<ul>
					{#each group.items as item (item.href)}
						<li>
							<a href={item.href}>
								<strong>{item.label}</strong>
								{#if item.description}<span>{item.description}</span>{/if}
								<b aria-hidden="true">→</b>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</article>

<style>
	.section-landing {
		width: min(68rem, calc(100% - 3rem));
		margin: 0 auto;
		padding: clamp(3rem, 7vw, 5.5rem) 0 6rem;
	}

	header {
		max-width: 48rem;
		padding-bottom: 2.5rem;
	}

	header p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	header h1 {
		margin-top: 0.7rem;
		font-size: clamp(2.4rem, 7vw, 4.75rem);
		letter-spacing: -0.055em;
		line-height: 1;
	}

	header span {
		display: block;
		max-width: 42rem;
		margin-top: 1.1rem;
		color: var(--site-muted);
		font-size: 1rem;
		line-height: 1.65;
	}

	.section-groups {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.1rem;
	}

	section {
		min-width: 0;
		padding: 1.15rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
	}

	section h2 {
		margin-bottom: 0.75rem;
		font-size: 0.78rem;
		letter-spacing: 0.02em;
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
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.25rem 1rem;
		padding: 0.8rem 0.25rem;
		color: var(--site-ink);
		text-decoration: none;
	}

	li a:hover strong {
		text-decoration: underline;
		text-decoration-color: var(--site-accent-strong);
		text-underline-offset: 0.25rem;
	}

	li strong {
		font-size: 0.82rem;
	}

	li span {
		grid-column: 1;
		color: var(--site-muted);
		font-size: 0.72rem;
		line-height: 1.45;
	}

	li b {
		grid-column: 2;
		grid-row: 1 / span 2;
		font-weight: 500;
	}

	@media (max-width: 45rem) {
		.section-landing {
			width: min(100% - 1.75rem, 68rem);
		}

		.section-groups {
			grid-template-columns: 1fr;
		}
	}
</style>
