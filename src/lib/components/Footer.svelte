<script lang="ts">
	import { primaryLinks } from '$lib/data/doors';
	import { SMRT_VERSION } from '$lib/version';
</script>

<footer>
	<div class="footer-inner">
		<p class="brand">smrt</p>
		<p>MIT licensed</p>
		<p>
			A <a href="https://happyvertical.com" target="_blank" rel="noreferrer">HappyVertical</a> project
		</p>
		<p>Docs for {SMRT_VERSION}</p>
		<nav aria-label="Footer navigation">
			{#each primaryLinks as link (link.href)}
				<a href={link.href}>{link.label}</a>
			{/each}
			<a href="/docs/reference/faq">FAQ</a>
			<a href="https://github.com/happyvertical/smrt" target="_blank" rel="noreferrer">GitHub ↗</a>
		</nav>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--site-line);
		background: var(--site-paper);
	}

	.footer-inner {
		width: min(1120px, 100% - 32px);
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 12px 28px;
		margin: 0 auto;
		padding: 36px 0 56px;
		color: var(--site-muted);
		font-size: 0.9rem;
	}

	.brand {
		color: var(--site-ink);
		font-family: var(--site-font-wordmark);
		font-size: 1.3rem;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
	}

	footer nav {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
		margin-left: auto;
	}

	footer a {
		color: var(--site-muted);
		text-decoration: none;
	}

	footer p a {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	footer a:hover {
		color: var(--site-ink);
	}

	@media (max-width: 620px) {
		footer nav {
			margin-left: 0;
			flex-basis: 100%;
		}
	}
</style>
