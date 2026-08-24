<script lang="ts">
	import { tryUseAdminShell } from '@happyvertical/smrt-svelte/workspace';

	const shell = tryUseAdminShell();
	const applicationPanel = $derived(shell?.panels.top ?? 'unavailable');

	function toggleApplicationPanel() {
		shell?.togglePanel('top');
	}
</script>

<div class="shell-state">
	<div>
		<p class="eyebrow">Live site contract</p>
		<h3>Active ShellState</h3>
		<p>
			This readout uses the documentation shell context. It does not create a nested shell or copy
			its navigation.
		</p>
	</div>

	<div class="panel-operation">
		<div aria-live="polite">
			<span>Application panel</span>
			<strong>{applicationPanel}</strong>
		</div>
		<button type="button" disabled={!shell} onclick={toggleApplicationPanel}>
			{applicationPanel === 'expanded'
				? 'Collapse documentation panel'
				: 'Open documentation panel'}
		</button>
	</div>

	<dl>
		<div>
			<dt>Application</dt>
			<dd>App bar, documentation panel, and route content</dd>
		</div>
		<div>
			<dt>Tenant</dt>
			<dd>Hidden because this site has no tenant workspace</dd>
		</div>
		<div>
			<dt>Focus</dt>
			<dd>Available to routes that register focused tools</dd>
		</div>
		<div>
			<dt>System</dt>
			<dd>Hidden because this site has no system panel</dd>
		</div>
	</dl>
</div>

<style>
	.shell-state {
		display: grid;
		gap: 1.25rem;
		padding: clamp(1rem, 3vw, 1.75rem);
		color: var(--smrt-color-on-surface, #18202b);
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--smrt-color-primary, #3757d5) 8%, transparent),
				transparent 55%
			),
			var(--smrt-color-surface, #fff);
		border: 1px solid var(--smrt-color-border, #d7dde5);
		border-radius: var(--smrt-radius-xl, 1rem);
	}

	.eyebrow {
		margin: 0 0 0.35rem;
		color: var(--smrt-color-primary, #3757d5);
		font-size: 0.75rem;
		font-weight: 750;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	h3,
	p {
		margin: 0;
	}

	.shell-state > div:first-child p:last-child {
		max-width: 48rem;
		margin-top: 0.45rem;
		color: var(--smrt-color-on-surface-muted, #596474);
	}

	.panel-operation {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
		padding: 0.9rem;
		background: var(--smrt-color-surface-variant, #f1f4f8);
		border-radius: var(--smrt-radius-lg, 0.75rem);
	}

	.panel-operation div {
		display: grid;
		gap: 0.15rem;
	}

	.panel-operation span {
		color: var(--smrt-color-on-surface-muted, #596474);
		font-size: 0.75rem;
	}

	.panel-operation strong {
		font-family: var(--smrt-font-family-mono, monospace);
		text-transform: capitalize;
	}

	button {
		min-height: 2.65rem;
		padding: 0.6rem 0.85rem;
		color: var(--smrt-color-on-primary, #fff);
		font: inherit;
		font-weight: 650;
		background: var(--smrt-color-primary, #3757d5);
		border: 1px solid transparent;
		border-radius: var(--smrt-radius-md, 0.55rem);
		cursor: pointer;
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	button:focus-visible {
		outline: 3px solid var(--smrt-color-focus, #86a4ff);
		outline-offset: 2px;
	}

	dl {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.75rem;
		margin: 0;
	}

	dl div {
		padding: 0.85rem;
		border-left: 3px solid var(--smrt-color-primary, #3757d5);
	}

	dt {
		font-weight: 750;
	}

	dd {
		margin: 0.25rem 0 0;
		color: var(--smrt-color-on-surface-muted, #596474);
		font-size: 0.86rem;
		line-height: 1.45;
	}

	@media (max-width: 760px) {
		dl {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 440px) {
		dl {
			grid-template-columns: 1fr;
		}
	}
</style>
