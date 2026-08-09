<script lang="ts">
	import brandMark from '$lib/assets/smrt-mark.svg';
	import { SMRT_VERSION } from '$lib/version';
</script>

<footer>
	<div class="footer-inner">
		<p class="brand"><img src={brandMark} alt="" width="28" height="28" /><span>s-m-r-t</span></p>
		<p>Framework documentation · {SMRT_VERSION}</p>
		<nav aria-label="Footer navigation">
			<a href="/faq">FAQ</a>
			<a href="https://github.com/happyvertical/smrt" target="_blank" rel="noreferrer">GitHub ↗</a>
		</nav>
	</div>
</footer>

<style>
	footer {
		border-top: 1px solid var(--site-line);
		background: var(--site-surface);
	}

	.footer-inner {
		width: min(1060px, calc(100% - 36px));
		display: flex;
		align-items: center;
		gap: 24px;
		margin: 0 auto;
		padding: 24px 0;
		color: var(--site-muted);
		font-size: 0.72rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--site-ink);
		font-family: var(--site-font-mono);
		font-weight: 800;
	}

	.brand img {
		width: 28px;
		height: 28px;
		object-fit: contain;
	}

	footer nav {
		display: flex;
		gap: 18px;
		margin-left: auto;
	}

	footer a {
		color: var(--site-muted);
		text-decoration: none;
	}

	footer a:hover {
		color: var(--site-ink);
	}

	@media (max-width: 620px) {
		.footer-inner {
			align-items: flex-start;
			flex-direction: column;
		}

		footer nav {
			margin-left: 0;
		}
	}
</style>
