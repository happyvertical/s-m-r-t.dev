<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import type { TaskGuideFamilyId } from '$lib/data/guides';
	import {
		TASK_GUIDES_PINNED_VERSION,
		getTaskGuideFamily,
		guideLibrary,
		guideLibraryItemsInFamily,
		guideLibrarySearchTerms,
		taskGuideFamilies
	} from '$lib/data/task-guides';

	let selectedFamily = $state<TaskGuideFamilyId | 'all'>('all');
	let query = $state('');

	const visibleGuides = $derived(
		guideLibrary.filter((guide) => {
			if (selectedFamily !== 'all' && guide.task.family !== selectedFamily) return false;
			const normalizedQuery = query.trim().toLowerCase();
			if (!normalizedQuery) return true;
			const text = guideLibrarySearchTerms(guide).join(' ').toLowerCase();
			return normalizedQuery.split(/\s+/).every((term) => text.includes(term));
		})
	);
</script>

<SEO
	title="s-m-r-t guides"
	description="Task-oriented s-m-r-t guides organized into six scalable guide families."
	url="https://s-m-r-t.dev/guides"
/>

<article class="guide-index">
	<header>
		<p>Guides · {TASK_GUIDES_PINNED_VERSION}</p>
		<h1>Complete one application task at a time.</h1>
		<span>
			Choose a guide family. Each guide states its starting point, packages, concepts, and expected
			result.
		</span>
	</header>

	<section class="family-list" aria-labelledby="family-title">
		<div class="section-heading">
			<h2 id="family-title">Guide families</h2>
			<p>Use a family to narrow the library.</p>
		</div>
		<div class="family-grid">
			{#each taskGuideFamilies as family, index (family.id)}
				{@const guideCount = guideLibraryItemsInFamily(family.id).length}
				<button
					type="button"
					class:active={selectedFamily === family.id}
					onclick={() => (selectedFamily = selectedFamily === family.id ? 'all' : family.id)}
					aria-pressed={selectedFamily === family.id}
				>
					<span>{String(index + 1).padStart(2, '0')}</span>
					<strong>{family.label}</strong>
					<p>{family.description}</p>
					<small>{guideCount} {guideCount === 1 ? 'guide' : 'guides'}</small>
				</button>
			{/each}
		</div>
	</section>

	<section class="library" aria-labelledby="library-title">
		<div class="section-heading library-heading">
			<div>
				<h2 id="library-title">Guide library</h2>
				<p>{visibleGuides.length} matching {visibleGuides.length === 1 ? 'guide' : 'guides'}</p>
			</div>
			<label>
				<span>Filter guides</span>
				<input bind:value={query} type="search" placeholder="Search tasks, concepts, or packages" />
			</label>
		</div>

		{#if visibleGuides.length}
			<div class="guide-list">
				{#each visibleGuides as guide (guide.href)}
					<a href={guide.href}>
						<div>
							<small>{getTaskGuideFamily(guide.task.family).label}</small>
							<span>{guide.task.difficulty}</span>
						</div>
						<h3>{guide.title}</h3>
						<p>{guide.task.purpose}</p>
						<dl>
							<div>
								<dt>Steps</dt>
								<dd>{guide.stepCount}</dd>
							</div>
							<div>
								<dt>Support</dt>
								<dd>{guide.task.supportRange}</dd>
							</div>
						</dl>
						<strong>{guide.packages.slice(0, 3).join(' · ')}</strong>
					</a>
				{/each}
			</div>
		{:else}
			<p class="empty">No guide matches this filter. Clear the family or search text.</p>
		{/if}
	</section>

	<aside>
		<strong>Use concepts and reference pages for background.</strong>
		<p>
			Guides give procedures. Framework pages explain concepts. Reference pages define complete
			contracts.
		</p>
	</aside>
</article>

<style>
	.guide-index {
		width: min(1040px, calc(100% - 48px));
		margin: 0 auto;
		padding: 54px 0 86px;
	}
	header {
		max-width: 760px;
		padding-bottom: 38px;
	}
	header > p,
	.family-grid button > span,
	.family-grid small,
	.guide-list small,
	.guide-list > a > div > span,
	.guide-list dt {
		color: var(--site-accent-strong);
		font: 700 0.62rem var(--site-font-mono);
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
		font-size: 0.94rem;
		line-height: 1.65;
	}
	.family-list,
	.library {
		padding: 32px 0;
		border-top: 1px solid var(--site-line);
	}
	.section-heading h2 {
		font-size: 1.3rem;
	}
	.section-heading p {
		margin-top: 5px;
		color: var(--site-muted);
		font-size: 0.78rem;
	}
	.family-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
		margin-top: 18px;
	}
	.family-grid button {
		min-height: 168px;
		display: grid;
		grid-template-rows: auto auto 1fr auto;
		gap: 8px;
		padding: 17px;
		border: 1px solid var(--site-line-strong);
		border-radius: 8px;
		background: var(--site-surface);
		color: var(--site-ink);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
	.family-grid button:hover,
	.family-grid button.active {
		border-color: var(--site-accent-strong);
	}
	.family-grid button.active {
		box-shadow: inset 0 0 0 1px var(--site-accent-strong);
	}
	.family-grid strong {
		font-size: 0.91rem;
	}
	.family-grid p {
		color: var(--site-muted);
		font-size: 0.75rem;
		line-height: 1.5;
	}
	.library-heading {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
	}
	.library-heading label {
		width: min(360px, 100%);
		display: grid;
		gap: 6px;
	}
	.library-heading label span {
		font-size: 0.7rem;
		font-weight: 700;
	}
	.library-heading input {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--site-line-strong);
		border-radius: 6px;
		background: var(--site-paper);
		color: var(--site-ink);
		font: inherit;
		font-size: 0.8rem;
	}
	.guide-list {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12px;
		margin-top: 20px;
	}
	.guide-list > a {
		min-height: 220px;
		display: flex;
		flex-direction: column;
		padding: 19px;
		border: 1px solid var(--site-line-strong);
		border-radius: 8px;
		background: var(--site-surface);
		color: var(--site-ink);
		text-decoration: none;
	}
	.guide-list > a:hover {
		border-color: var(--site-accent-strong);
	}
	.guide-list > a > div {
		display: flex;
		justify-content: space-between;
		gap: 18px;
	}
	.guide-list h3 {
		margin-top: 15px;
		font-size: 1.02rem;
	}
	.guide-list > a > p {
		margin-top: 9px;
		color: var(--site-muted);
		font-size: 0.78rem;
		line-height: 1.55;
	}
	.guide-list dl {
		display: flex;
		gap: 22px;
		margin-top: 18px;
	}
	.guide-list dl div {
		display: flex;
		gap: 6px;
	}
	.guide-list dd {
		font: 0.65rem var(--site-font-mono);
	}
	.guide-list > a > strong {
		margin-top: auto;
		padding-top: 19px;
		color: var(--site-muted);
		font: 0.58rem var(--site-font-mono);
	}
	.empty {
		margin-top: 20px;
		padding: 18px;
		border: 1px solid var(--site-line-strong);
		color: var(--site-muted);
		font-size: 0.8rem;
	}
	aside {
		display: grid;
		grid-template-columns: 230px 1fr;
		gap: 24px;
		margin-top: 4px;
		padding: 20px;
		border: 1px solid var(--site-line-strong);
		border-left: 4px solid var(--site-accent);
		background: var(--site-surface);
	}
	aside strong {
		font-size: 0.8rem;
	}
	aside p {
		color: var(--site-muted);
		font-size: 0.8rem;
		line-height: 1.55;
	}
	@media (max-width: 800px) {
		.family-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 700px) {
		.guide-index {
			width: min(100% - 28px, 1040px);
			padding-top: 36px;
		}
		.library-heading {
			align-items: stretch;
			flex-direction: column;
		}
		.guide-list,
		aside {
			grid-template-columns: 1fr;
		}
		.guide-list > a {
			min-height: 0;
		}
	}
	@media (max-width: 500px) {
		.family-grid {
			grid-template-columns: 1fr;
		}
		.family-grid button {
			min-height: 0;
		}
	}
</style>
