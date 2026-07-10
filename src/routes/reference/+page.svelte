<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { referenceGuides } from '$lib/data/reference';

	const browsers = [
		[
			'Packages',
			'Descriptions, components, playground entries, and generated interfaces.',
			'/packages'
		],
		[
			'Components',
			'Foundation controls first, with domain components grouped by package.',
			'/packages/smrt-ui?tab=components'
		],
		['Playground', 'Interactive foundation controls and package working views.', '/playground']
	];
</script>

<SEO
	title="s-m-r-t reference"
	description="Browse s-m-r-t packages, components, configuration, decorators, collections, generated interfaces, and terminology."
	url="https://s-m-r-t.dev/reference"
/>

<article class="reference-index">
	<header>
		<p>Reference</p>
		<h1>Look up the part you need.</h1>
		<span
			>Use the learning path when building something new. Use these pages when you already know the
			concept, package, or component you are looking for.</span
		>
	</header>

	<section>
		<h2>Browse the framework</h2>
		<div class="browse-grid">
			{#each browsers as item (item[0])}<a href={item[2]}
					><strong>{item[0]}</strong>
					<p>{item[1]}</p>
					<span>Open →</span></a
				>{/each}
		</div>
	</section>

	<section>
		<h2>Core reference</h2>
		<div class="reference-list">
			{#each referenceGuides as guide (guide.slug)}<a href={`/reference/${guide.slug}`}
					><strong>{guide.navTitle}</strong>
					<p>{guide.plainEnglish}</p>
					<span>→</span></a
				>{/each}
		</div>
	</section>
</article>

<style>
	.reference-index {
		width: min(900px, calc(100% - 48px));
		margin: 0 auto;
		padding: 54px 0 86px;
	}
	header {
		max-width: 740px;
		padding-bottom: 36px;
	}
	header > p {
		color: var(--site-accent-strong);
		font: 700 0.66rem var(--site-font-mono);
		text-transform: uppercase;
	}
	h1 {
		margin-top: 11px;
		font-size: clamp(2.15rem, 5vw, 3.25rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	header > span {
		display: block;
		margin-top: 17px;
		color: var(--site-muted);
		font-size: 0.92rem;
		line-height: 1.65;
	}
	section {
		padding: 30px 0;
		border-top: 1px solid var(--site-line);
	}
	section > h2 {
		margin-bottom: 18px;
		font-size: 1.1rem;
	}
	.browse-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
	}
	.browse-grid a {
		min-height: 160px;
		display: flex;
		flex-direction: column;
		padding: 17px;
		border: 1px solid var(--site-line-strong);
		border-radius: 7px;
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}
	.browse-grid a:hover {
		border-color: var(--site-accent-strong);
	}
	.browse-grid strong,
	.reference-list strong {
		font-size: 0.84rem;
	}
	.browse-grid p,
	.reference-list p {
		margin-top: 6px;
		color: var(--site-muted);
		font-size: 0.76rem;
		line-height: 1.5;
	}
	.browse-grid span {
		margin-top: auto;
		padding-top: 16px;
		color: var(--site-accent-strong);
		font: 0.62rem var(--site-font-mono);
	}
	.reference-list {
		border-top: 1px solid var(--site-line);
	}
	.reference-list a {
		display: grid;
		grid-template-columns: 170px 1fr 20px;
		gap: 18px;
		padding: 14px 6px;
		border-bottom: 1px solid var(--site-line);
		color: var(--site-ink);
		text-decoration: none;
	}
	.reference-list a:hover {
		background: var(--site-surface);
	}
	.reference-list p {
		margin-top: 0;
	}
	@media (max-width: 700px) {
		.reference-index {
			width: min(100% - 28px, 900px);
			padding-top: 36px;
		}
		.browse-grid {
			grid-template-columns: 1fr;
		}
		.browse-grid a {
			min-height: 0;
		}
		.reference-list a {
			grid-template-columns: 1fr 18px;
		}
		.reference-list p {
			grid-column: 1;
		}
	}
</style>
