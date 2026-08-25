<script lang="ts">
	import type { GuideLibraryItem } from '$lib/data/task-guides';
	import { getTaskGuideFamily, guideLibraryItemsInFamily } from '$lib/data/task-guides';

	let { guide }: { guide: GuideLibraryItem } = $props();
	const family = $derived(getTaskGuideFamily(guide.task.family));
	const siblings = $derived(
		guideLibraryItemsInFamily(guide.task.family).filter(
			(candidate) => candidate.href !== guide.href
		)
	);
</script>

<section class="guide-metadata" aria-labelledby="guide-metadata-title">
	<div class="metadata-heading">
		<p>{family.label}</p>
		<h2 id="guide-metadata-title">Guide details</h2>
	</div>
	<dl>
		<div>
			<dt>Purpose</dt>
			<dd>{guide.task.purpose}</dd>
		</div>
		<div>
			<dt>Starting knowledge</dt>
			<dd>{guide.task.difficulty}</dd>
		</div>
		<div>
			<dt>Framework support</dt>
			<dd>s-m-r-t {guide.task.supportRange}</dd>
		</div>
		<div>
			<dt>Prerequisites</dt>
			<dd>{guide.task.prerequisites.join(' · ')}</dd>
		</div>
		<div>
			<dt>Concepts used</dt>
			<dd>{guide.task.concepts.join(' · ')}</dd>
		</div>
		<div>
			<dt>Expected result</dt>
			<dd>{guide.task.expectedResult}</dd>
		</div>
	</dl>
</section>

<footer class="task-links">
	<strong>Related destinations</strong>
	<div>
		{#each guide.task.relatedUi as link (link.href)}
			<a href={link.href}>{link.label}</a>
		{/each}
		{#each guide.task.relatedModules as link (link.href)}
			<a href={link.href}>{link.label}</a>
		{/each}
		{#each guide.task.relatedReference as link (link.href)}
			<a href={link.href}>{link.label}</a>
		{/each}
	</div>
</footer>

<footer class="family-siblings">
	<strong>More in {family.label}</strong>
	{#if siblings.length}
		<div>
			{#each siblings as sibling (sibling.href)}
				<a href={sibling.href}>{sibling.title}</a>
			{/each}
		</div>
	{:else}
		<p>This is the only guide in this family.</p>
	{/if}
</footer>

<style>
	.guide-metadata {
		margin-top: 18px;
		padding: 20px;
		border: 1px solid var(--site-line-strong);
		border-radius: 8px;
		background: var(--site-surface);
	}
	.metadata-heading p {
		color: var(--site-accent-strong);
		font: 700 0.62rem var(--site-font-mono);
		text-transform: uppercase;
	}
	.metadata-heading h2 {
		margin-top: 5px;
		font-size: 1rem;
	}
	dl {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px 24px;
		margin-top: 18px;
	}
	dt {
		color: var(--site-muted);
		font: 700 0.6rem var(--site-font-mono);
		text-transform: uppercase;
	}
	dd {
		margin-top: 4px;
		font-size: 0.78rem;
		line-height: 1.5;
	}
	footer {
		padding-top: 22px;
		border-top: 1px solid var(--site-line);
	}
	footer > strong {
		font-size: 0.72rem;
	}
	footer div {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		margin-top: 11px;
	}
	footer a {
		padding: 5px 8px;
		border: 1px solid var(--site-line-strong);
		border-radius: 5px;
		color: var(--site-ink);
		font: 0.65rem var(--site-font-mono);
		text-decoration: none;
	}
	.family-siblings p {
		margin-top: 9px;
		color: var(--site-muted);
		font-size: 0.76rem;
	}
	@media (max-width: 680px) {
		dl {
			grid-template-columns: 1fr;
		}
	}
</style>
