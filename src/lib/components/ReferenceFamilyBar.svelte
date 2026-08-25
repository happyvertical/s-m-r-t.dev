<script lang="ts">
	import { getReferenceFamily, referenceFamilies } from '$lib/data/reference-families';

	let { id }: { id: string } = $props();
	const current = $derived(getReferenceFamily(id));
</script>

<nav class="family-bar" aria-label="Reference family">
	<a class="reference-home" href="/reference">Reference</a>
	<span aria-hidden="true">/</span>
	<strong>{current?.label ?? 'Reference'}</strong>
	<details>
		<summary>Change family</summary>
		<div>
			{#each referenceFamilies as family (family.id)}
				<a href={family.href} aria-current={family.id === id ? 'page' : undefined}>
					<span>{family.label}</span>
					<small>{family.description}</small>
				</a>
			{/each}
		</div>
	</details>
</nav>

<style>
	.family-bar {
		position: relative;
		width: min(1180px, calc(100% - 40px));
		display: flex;
		align-items: center;
		gap: 0.65rem;
		margin: 1rem auto 0;
		padding: 0.7rem 0;
		border-bottom: 1px solid var(--site-line);
		font: 0.68rem var(--site-font-mono);
	}

	.reference-home,
	summary {
		color: var(--site-muted);
	}

	.reference-home {
		text-decoration: none;
	}

	strong {
		font-size: inherit;
	}

	details {
		margin-left: auto;
	}

	summary {
		padding: 0.45rem 0.65rem;
		border: 1px solid var(--site-line-strong);
		border-radius: 999px;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	details > div {
		position: absolute;
		top: calc(100% + 0.35rem);
		right: 0;
		z-index: 40;
		width: min(32rem, 100%);
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		padding: 0.45rem;
		border: 1px solid var(--site-line-strong);
		border-radius: var(--site-radius-md);
		background: var(--site-surface);
		box-shadow: 0 1rem 3rem rgb(0 0 0 / 16%);
	}

	details a {
		display: grid;
		gap: 0.25rem;
		padding: 0.65rem;
		border-radius: calc(var(--site-radius-md) - 3px);
		color: var(--site-ink);
		text-decoration: none;
	}

	details a:hover,
	details a[aria-current] {
		background: var(--site-paper-deep);
	}

	details small {
		color: var(--site-muted);
		font: 0.65rem/1.4 var(--site-font-sans);
	}

	@media (max-width: 42rem) {
		.family-bar {
			width: min(100% - 28px, 1180px);
		}

		details > div {
			grid-template-columns: 1fr;
		}
	}
</style>
