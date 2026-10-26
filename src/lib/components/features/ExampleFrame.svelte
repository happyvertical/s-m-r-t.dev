<script lang="ts">
	/**
	 * The live example frame of a feature showcase (#364): the real package
	 * playground entry for `kind: 'playground'`, a labelled illustration for
	 * `kind: 'still'`. Never a local stand-in for a missing entry (Golden Rule).
	 */
	import { onMount } from 'svelte';
	import { PlaygroundHost } from '@happyvertical/smrt-playground/svelte';
	import type { Feature } from '$lib/data/features';
	import { playgroundModules, resolvePlaygroundSlug } from '$lib/data/playgrounds';

	let { feature }: { feature: Feature } = $props();

	const example = $derived(feature.example);
	const resolved = $derived(
		example.kind === 'playground' ? resolvePlaygroundSlug(example.entry) : null
	);
	const modules = $derived(
		resolved
			? playgroundModules.filter((module) => module.packageName === resolved.packageName)
			: []
	);

	// The host loads its component after mount; the prerendered page holds a
	// quiet placeholder instead of the host's "Preview unavailable" server state.
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
</script>

<div class="frame" data-example-kind={example.kind}>
	<div class="chrome">
		<i aria-hidden="true"></i><i aria-hidden="true"></i><i aria-hidden="true"></i>
		<span>{example.kind === 'still' ? `Acme Corp · ${feature.word}` : feature.word}</span>
		<span class="tag" class:live={example.kind === 'playground'}>
			{example.kind === 'playground' ? 'live example' : 'illustration'}
		</span>
	</div>
	{#if example.kind === 'playground'}
		<div class="live-stage" data-testid="live-example">
			{#if mounted && resolved}
				<PlaygroundHost
					{modules}
					embedded
					hideEntryList
					selectedEntryId={resolved.qualifiedId}
					title="s-m-r-t playground"
				/>
			{:else}
				<p class="placeholder" role="status">Loading the live example…</p>
			{/if}
		</div>
	{:else}
		<figure class="still">
			<img
				src={example.src}
				width="640"
				height="400"
				alt={`Illustration of ${feature.word} with Acme Corp example data`}
				loading="lazy"
			/>
		</figure>
	{/if}
</div>
<p class="caption">
	{#if example.kind === 'playground' && resolved}
		<span
			>Real <code>{resolved.entryTitle}</code> preview from
			<code>{resolved.packageName.replace('@happyvertical/', '')}</code>, example data. Try it.</span
		>
	{:else}
		<span>An illustration with example data. This package has no live example yet.</span>
	{/if}
</p>

<style>
	.frame {
		background: var(--site-surface);
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-lg);
		overflow: hidden;
		box-shadow: 0 30px 60px rgb(0 0 0 / 8%);
	}
	.chrome {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--site-line-strong);
		color: var(--site-muted);
		font: 500 0.75rem var(--site-font-mono);
	}
	.chrome i {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--site-line-strong);
		display: inline-block;
	}
	.chrome i:first-child {
		background: var(--site-accent);
	}
	.chrome span:first-of-type {
		margin-left: 4px;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.tag {
		margin-left: auto;
		display: flex;
		align-items: center;
		gap: 6px;
		white-space: nowrap;
	}
	.tag.live {
		color: var(--site-ok);
	}
	.tag.live::before {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--site-ok);
	}
	/* Tall entries (dashboards, long forms) scroll inside the frame instead of
	   pushing "Also in the box" off the first screens. */
	.live-stage {
		min-height: 360px;
		max-height: 680px;
		min-width: 0;
		overflow: auto;
	}
	/* The frame already names the package and entry; keep the host's mode switch only. */
	.live-stage :global(.breadcrumbs),
	.live-stage :global([data-testid='playground-selected-package']),
	.live-stage :global(.workspace-header:not(:has(.mode-control))) {
		display: none;
	}
	.live-stage :global(.playground-shell) {
		min-height: 0;
	}
	/* A one-card entry should not sit in 480px of white space. */
	.live-stage :global(.preview-stage) {
		min-height: 280px;
	}
	.placeholder {
		margin: 0;
		padding: 60px 24px;
		color: var(--site-muted);
		text-align: center;
	}
	.still {
		margin: 0;
		background: var(--site-paper);
		padding: 18px;
		display: grid;
		place-items: center;
	}
	.still img {
		display: block;
		width: 100%;
		max-width: 640px;
		height: auto;
		border-radius: var(--site-radius-md);
	}
	.caption {
		margin: 12px 0 0;
		color: var(--site-muted);
		font-size: 0.875rem;
	}
	.caption code {
		font: 0.75rem var(--site-font-mono);
		background: var(--site-surface);
		border: 1px solid var(--site-line-strong);
		padding: 1px 6px;
		border-radius: 4px;
	}
</style>
