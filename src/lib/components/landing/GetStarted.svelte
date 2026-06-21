<script lang="ts">
	/**
	 * "Get started": a featured SaaS-starter block (primary, badged "public
	 * soon") plus two paths — add to an existing app (smrt init) and just the
	 * library (pnpm add @happyvertical/smrt-core). Command snippets are plain
	 * strings rendered in <pre> (no Svelte brace escaping needed).
	 */
	const STARTER_URL = 'https://github.com/happyvertical/smrt-saas-starter';

	// Grouped on an object so the in-template reference is `cmds.init` (a member
	// expression), not a bare `{init}` identifier — the latter trips the
	// repo's <code> brace checker; the former is exactly how the rest of the
	// page renders code strings.
	const cmds = {
		init: '$ npx smrt init',
		lib: '$ pnpm add @happyvertical/smrt-core'
	};
</script>

<div class="gs">
	<a class="starter" href={STARTER_URL} target="_blank" rel="noopener noreferrer">
		<div class="starter-main">
			<div class="starter-head">
				<span class="starter-kicker">Recommended</span>
				<span class="starter-badge">public soon</span>
			</div>
			<h3 class="starter-title">Start from the SaaS starter</h3>
			<p class="starter-desc">
				A working multi-tenant app &mdash; auth, billing, agents, and UI already wired up.
				Clone it and start shipping features instead of plumbing.
			</p>
			<span class="starter-cta">
				happyvertical/smrt-saas-starter
				<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<line x1="5" y1="12" x2="19" y2="12" />
					<polyline points="12 5 19 12 12 19" />
				</svg>
			</span>
		</div>
	</a>

	<div class="paths">
		<article class="path">
			<h4 class="path-title">Add to an existing app</h4>
			<p class="path-desc">
				Already have a SvelteKit project? Scaffold SMRT into it and start decorating models.
			</p>
			<pre class="path-cmd"><code>{cmds.init}</code></pre>
		</article>

		<article class="path">
			<h4 class="path-title">Just the library</h4>
			<p class="path-desc">
				Want only the core object + AI + database layer? Install the one package and import what
				you need.
			</p>
			<pre class="path-cmd"><code>{cmds.lib}</code></pre>
		</article>
	</div>
</div>

<style>
	.gs {
		display: grid;
		gap: 18px;
	}

	/* --- featured starter --- */
	.starter {
		display: block;
		text-decoration: none;
		border-radius: var(--smrt-radius-md, 10px);
		padding: 32px;
		color: var(--smrt-color-on-primary, #fff);
		background:
			linear-gradient(
				135deg,
				var(--smrt-color-primary, #1976d2),
				color-mix(in srgb, var(--smrt-color-primary, #1976d2) 70%, #000 18%)
			);
		box-shadow: 0 6px 24px color-mix(in srgb, var(--smrt-color-primary, #1976d2) 30%, transparent);
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
	}

	.starter:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 32px color-mix(in srgb, var(--smrt-color-primary, #1976d2) 42%, transparent);
	}

	.starter-head {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 14px;
	}

	.starter-kicker {
		font-size: 0.78rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		opacity: 0.85;
	}

	.starter-badge {
		font-size: 0.72rem;
		font-weight: 600;
		padding: 3px 10px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.22);
		color: #fff;
		border: 1px solid rgba(255, 255, 255, 0.35);
	}

	.starter-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 10px;
		color: #fff;
	}

	.starter-desc {
		font-size: 1rem;
		line-height: 1.6;
		margin: 0 0 18px;
		max-width: 640px;
		color: rgba(255, 255, 255, 0.92);
	}

	.starter-cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 0.9rem;
		font-weight: 600;
		padding: 9px 16px;
		border-radius: var(--smrt-radius-sm, 6px);
		background: rgba(255, 255, 255, 0.16);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	/* --- two paths --- */
	.paths {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 18px;
	}

	.path {
		padding: 24px;
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: var(--smrt-radius-md, 8px);
		background: var(--smrt-color-surface, #fff);
		display: flex;
		flex-direction: column;
	}

	.path-title {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 8px;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.path-desc {
		font-size: 0.92rem;
		line-height: 1.55;
		color: var(--smrt-color-on-surface-variant, #666);
		margin: 0 0 16px;
		flex: 1;
	}

	.path-cmd {
		margin: 0;
		padding: 12px 14px;
		border-radius: var(--smrt-radius-sm, 6px);
		background: var(--smrt-color-surface-container-highest, #1a1a1a);
		overflow-x: auto;
	}

	.path-cmd code {
		font-family: var(--smrt-font-family-mono, var(--font-mono, monospace));
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface, #f0f0f0);
		white-space: pre;
	}

	@media (prefers-reduced-motion: reduce) {
		.starter {
			transition: none;
		}
		.starter:hover {
			transform: none;
		}
	}

	@media (max-width: 640px) {
		.starter {
			padding: 24px;
		}
		.paths {
			grid-template-columns: 1fr;
		}
	}
</style>
