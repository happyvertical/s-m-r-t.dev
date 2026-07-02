<script lang="ts">
	/**
	 * Landing hero. Themed with --smrt-color-* (light + dark). The eyebrow chip
	 * reads the canonical version from $lib/version so it never drifts.
	 */
	import { SMRT_VERSION_LABEL } from '$lib/version';
	import mark from '$lib/assets/smrt-mark.png';

	const STARTER_URL = 'https://github.com/happyvertical/smrt-saas-starter';
</script>

<section class="hero" aria-labelledby="hero-title">
	<div class="hero-inner">
		<img src={mark} alt="" class="hero-mark" width="76" height="76" />
		<p class="eyebrow">
			<span class="eyebrow-version">{SMRT_VERSION_LABEL}</span>
			<span class="eyebrow-sep" aria-hidden="true">·</span>
			<span>SAADL framework</span>
		</p>

		<h1 id="hero-title">Built for human users and agent operators.</h1>

		<p class="subhead">
			Define your domain once &mdash; a single <code>@smrt()</code> TypeScript class &mdash; and
			SMRT generates the database schema, REST API, CLI, and MCP server. Swap AI provider or
			database with one field; auth, multi-tenancy, billing, and durable jobs come included.
		</p>

		<div class="cta-row">
			<a class="cta cta-primary" href={STARTER_URL} target="_blank" rel="noopener noreferrer">
				Start from the SaaS starter
				<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<line x1="5" y1="12" x2="19" y2="12" />
					<polyline points="12 5 19 12 12 19" />
				</svg>
			</a>
			<a class="cta cta-secondary" href="/docs">Read the docs</a>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		overflow: hidden;
		padding: 96px 24px 72px;
		background:
			radial-gradient(
				ellipse 80% 60% at 50% -10%,
				color-mix(in srgb, var(--smrt-color-primary, #1976d2) 14%, transparent),
				transparent 70%
			),
			var(--smrt-color-background, #fafafa);
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.hero-inner {
		max-width: 920px;
		margin: 0 auto;
		text-align: center;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		justify-content: center;
		margin: 0 0 28px;
		padding: 6px 16px;
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: 999px;
		background: color-mix(in srgb, var(--smrt-color-surface, #fff) 70%, transparent);
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #555);
	}

	.eyebrow-version {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-weight: 600;
		color: var(--smrt-color-primary, #1976d2);
	}

	.eyebrow-sep {
		color: var(--smrt-color-outline, #ccc);
	}

	.hero-mark {
		width: 76px;
		height: 76px;
		display: block;
		margin: 0 auto 28px;
	}

	h1 {
		font-size: clamp(2.2rem, 5vw, 3.6rem);
		line-height: 1.1;
		font-weight: 700;
		letter-spacing: -0.02em;
		margin: 0 0 24px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.wordmark {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		color: var(--smrt-color-primary, #1976d2);
		white-space: nowrap;
	}

	.subhead {
		font-size: clamp(1.05rem, 2vw, 1.3rem);
		line-height: 1.65;
		color: var(--smrt-color-on-surface-variant, #555);
		max-width: 720px;
		margin: 0 auto 36px;
	}

	.subhead code {
		font-family: var(--smrt-font-family-mono, monospace);
		font-size: 0.9em;
		background: color-mix(in srgb, var(--smrt-color-surface-variant, #f0f0f0) 70%, transparent);
		padding: 1px 6px;
		border-radius: 4px;
	}

	.cta-row {
		display: flex;
		gap: 14px;
		justify-content: center;
		flex-wrap: wrap;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 13px 24px;
		border-radius: var(--smrt-radius-md, 8px);
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease,
			background 0.15s ease;
	}

	.cta-primary {
		background: var(--smrt-color-primary, #1976d2);
		color: var(--smrt-color-on-primary, #fff);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
	}

	.cta-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 18px color-mix(in srgb, var(--smrt-color-primary, #1976d2) 35%, transparent);
	}

	.cta-secondary {
		background: var(--smrt-color-surface, #fff);
		color: var(--smrt-color-on-surface, #1a1a1a);
		border: 1px solid var(--smrt-color-outline, #d5d5d5);
	}

	.cta-secondary:hover {
		transform: translateY(-2px);
		border-color: var(--smrt-color-primary, #1976d2);
		color: var(--smrt-color-primary, #1976d2);
	}

	@media (prefers-reduced-motion: reduce) {
		.cta {
			transition: none;
		}
		.cta:hover {
			transform: none;
		}
	}

	@media (max-width: 600px) {
		.hero {
			padding: 64px 16px 48px;
		}
	}
</style>
