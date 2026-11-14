<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head><title>{page.status} | smrt</title></svelte:head>

<main class="error-page">
	<p>{page.status}</p>
	<h1>
		{page.status === 404 ? "We couldn't find that page." : 'Something went wrong on our side.'}
	</h1>
	<span>
		{page.status === 404
			? 'The link may be out of date, or the page may have moved. The features map and the docs are good places to pick things back up.'
			: (page.error?.message ?? 'Try again in a moment, or head back to the home page.')}
	</span>
	<div>
		<a href="/">Home</a><a href="/features">Features</a><a href="/docs">Docs</a><a
			href="/docs/reference/packages">Packages →</a
		>
	</div>
</main>

<style>
	.error-page {
		width: min(900px, calc(100% - 40px));
		min-height: calc(100svh - var(--site-header-height));
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 auto;
		padding: 80px 0;
	}
	.error-page > p {
		color: var(--site-accent-strong);
		font-family: var(--site-font-mono);
		font-size: 0.72rem;
		font-weight: 750;
	}
	h1 {
		max-width: 720px;
		margin-top: 14px;
		font-size: clamp(2.1rem, 5vw, 3.25rem);
		letter-spacing: -0.04em;
		line-height: 1.08;
	}
	.error-page > span {
		max-width: 620px;
		margin-top: 30px;
		color: var(--site-muted);
		line-height: 1.7;
	}
	.error-page div {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		margin-top: 38px;
	}
	.error-page a {
		padding-bottom: 5px;
		border-bottom: 1px solid var(--site-ink);
		color: var(--site-ink);
		font-family: var(--site-font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		text-decoration: none;
	}
</style>
