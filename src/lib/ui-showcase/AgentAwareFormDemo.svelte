<script lang="ts">
	import {
		Form,
		FormGroup,
		Input,
		createControlInteractionRegistry,
		type ControlCommandResult,
		type ControlSnapshot
	} from '@happyvertical/smrt-ui/forms';
	import { Button } from '@happyvertical/smrt-ui/ui';
	import { onMount, tick } from 'svelte';

	type Phase = 'ready' | 'discovered' | 'validated' | 'staged' | 'reviewed' | 'applied' | 'undone';

	const FORM_ID = 'profile-demo';
	const DISPLAY_NAME_ID = 'displayName';
	const RECOVERY_KEY_ID = 'recoveryKey';
	const PROPOSED_NAME = 'Willow Griffin';
	const MIN_NAME_LENGTH = 3;
	const MAX_NAME_LENGTH = 30;
	const DISPLAY_NAME_PATTERN = /^[A-Za-z][A-Za-z .'-]*$/;
	const SUBJECT = { type: 'Profile', id: '42', label: 'Example profile' };
	const registry = createControlInteractionRegistry();

	let phase = $state<Phase>('ready');
	let displayName = $state('Willow Reed');
	let discoveredControl = $state<ControlSnapshot | null>(null);
	let proposalValidation = $state('Not checked');
	let stagedValue = $state<string | null>(null);
	let status = $state('Choose the first step to run the permitted proposal.');
	let refusal = $state<ControlCommandResult | null>(null);
	let controlsReady = $state(false);
	let demoElement: HTMLElement;
	let statusElement: HTMLParagraphElement;

	const displayIdentity = { formId: FORM_ID, controlId: DISPLAY_NAME_ID, subject: SUBJECT };
	const recoveryIdentity = { formId: FORM_ID, controlId: RECOVERY_KEY_ID, subject: SUBJECT };

	function displayNameRule(value: string): string {
		const length = value.trim().length;
		if (length < MIN_NAME_LENGTH) return 'Use at least 3 characters.';
		if (length > MAX_NAME_LENGTH) return 'Use no more than 30 characters.';
		if (!DISPLAY_NAME_PATTERN.test(value)) {
			return 'Start with a letter and use letters, spaces, periods, apostrophes, or hyphens.';
		}
		return '';
	}

	function describeConstraints(snapshot: ControlSnapshot): string {
		const constraints = snapshot.metadata.constraints;
		const descriptions: string[] = [];
		if (constraints?.required) descriptions.push('required');
		if (constraints?.minLength !== undefined && constraints.maxLength !== undefined) {
			descriptions.push(`${constraints.minLength}–${constraints.maxLength} characters`);
		} else if (constraints?.minLength !== undefined) {
			descriptions.push(`at least ${constraints.minLength} characters`);
		} else if (constraints?.maxLength !== undefined) {
			descriptions.push(`at most ${constraints.maxLength} characters`);
		}
		return descriptions.join(', ') || 'no declared constraints';
	}

	async function focusStep(step: string) {
		await tick();
		demoElement.querySelector<HTMLButtonElement>(`[data-demo-step="${step}"]`)?.focus();
	}

	function refreshRegistryState() {
		controlsReady = Boolean(registry.get(displayIdentity) && registry.get(recoveryIdentity));
		if (controlsReady && phase === 'ready') {
			status = 'The registered controls are ready. Choose the first permitted-proposal step.';
		}
	}

	onMount(() => {
		const unsubscribe = registry.subscribe((event) => {
			if (event.type === 'registered' || event.type === 'unregistered') refreshRegistryState();
		});
		void tick().then(refreshRegistryState);
		return unsubscribe;
	});

	async function findAndExplain() {
		const found = registry.get(displayIdentity);
		const explained = await registry.execute(
			{ action: 'explain', identity: displayIdentity },
			{ source: 'agent' }
		);
		if (!found || !explained.ok || !explained.snapshot) {
			status = `The registry could not explain the control: ${explained.reason ?? 'not_found'}.`;
			return;
		}

		discoveredControl = explained.snapshot;
		phase = 'discovered';
		status = 'The adapter found profile-demo.displayName and read its public contract.';
		await focusStep('validate');
	}

	async function validateProposal() {
		const visibleRuleResult = displayNameRule(PROPOSED_NAME);
		if (visibleRuleResult) {
			proposalValidation = visibleRuleResult;
			status = `The proposal failed validation: ${proposalValidation}`;
			return;
		}

		proposalValidation = 'Passes the visible display-name rule';
		phase = 'validated';
		status = 'The proposed name passes the same rule used by the visible input.';
		await focusStep('stage');
	}

	async function stageProposal() {
		const result = await registry.execute(
			{ action: 'stage', identity: displayIdentity, value: PROPOSED_NAME },
			{ source: 'agent' }
		);
		if (!result.ok) {
			status = `The registry refused staging: ${result.reason ?? 'denied'}.`;
			return;
		}

		stagedValue = String(result.snapshot?.state.stagedValue ?? '');
		phase = 'staged';
		status = 'The proposal is staged. The live form value is unchanged.';
		await focusStep('review');
	}

	async function reviewProposal() {
		phase = 'reviewed';
		status = 'Review is complete. The live value still has not changed.';
		await focusStep('apply');
	}

	async function confirmAndApply() {
		const result = await registry.execute(
			{ action: 'apply', identity: displayIdentity },
			{ source: 'agent', confirmed: true }
		);
		if (!result.ok) {
			status = `The registry refused apply: ${result.reason ?? 'denied'}.`;
			return;
		}

		await tick();
		stagedValue = null;
		phase = 'applied';
		status = 'Confirmation applied the staged value through the registered control writer.';
		await focusStep('undo');
	}

	async function undoAppliedValue() {
		const result = await registry.execute(
			{ action: 'undo', identity: displayIdentity },
			{ source: 'agent', confirmed: true }
		);
		if (!result.ok) {
			status = `The registry refused undo: ${result.reason ?? 'denied'}.`;
			return;
		}

		await tick();
		phase = 'undone';
		status = 'Undo restored the previous in-memory form value.';
		await tick();
		statusElement.focus();
	}

	async function attemptProtectedChange() {
		refusal = await registry.execute(
			{ action: 'stage', identity: recoveryIdentity, value: null },
			{ source: 'agent' }
		);
		status = refusal.ok
			? 'Unexpected result: the protected proposal was staged.'
			: `The registry refused the protected proposal: ${refusal.reason ?? 'denied'}.`;
	}

	function phaseReached(target: Phase): boolean {
		const order: Phase[] = [
			'ready',
			'discovered',
			'validated',
			'staged',
			'reviewed',
			'applied',
			'undone'
		];
		return order.indexOf(phase) >= order.indexOf(target);
	}
</script>

<section bind:this={demoElement} class="agent-form-demo" aria-labelledby="agent-form-demo-title">
	<header class="demo-header">
		<div>
			<p class="demo-kicker">Scripted demonstration · released registry</p>
			<h3 id="agent-form-demo-title">A proposal succeeds. A protected change fails.</h3>
		</div>
		<p class="honest-label">
			This scripted adapter uses real controls, validation, classification, staging, and
			confirmation policies. No language model runs in this demo.
		</p>
	</header>

	<div class="demo-layout">
		<div class="form-panel">
			<p class="panel-label">Small example object</p>
			<dl class="identity-card">
				<div>
					<dt>Subject</dt>
					<dd>Profile · 42</dd>
				</div>
				<div>
					<dt>Form ID</dt>
					<dd><code>{`${FORM_ID}`}</code></dd>
				</div>
			</dl>

			<Form formId={FORM_ID} interactionRegistry={registry} aria-label="Profile demonstration form">
				<FormGroup
					label="Display name"
					hint="3–30 characters. Start with a letter."
					required
					interaction={{
						id: DISPLAY_NAME_ID,
						description: 'Public name shown with this profile.',
						sensitivity: 'public',
						subject: SUBJECT
					}}
				>
					<Input
						name={DISPLAY_NAME_ID}
						bind:value={displayName}
						required
						minlength={MIN_NAME_LENGTH}
						maxlength={MAX_NAME_LENGTH}
						pattern={DISPLAY_NAME_PATTERN.source}
					/>
				</FormGroup>

				<FormGroup
					label="Recovery key"
					hint="A stored secret exists. The form and adapter do not receive its value."
					interaction={{
						id: RECOVERY_KEY_ID,
						description: 'Protected recovery material.',
						sensitivity: 'secret',
						readable: false,
						writable: false,
						subject: SUBJECT
					}}
				>
					<Input
						name={RECOVERY_KEY_ID}
						type="password"
						readonly
						autocomplete="off"
						placeholder="Value withheld"
						data-protected-control="true"
					/>
				</FormGroup>
			</Form>
		</div>

		<div class="adapter-panel">
			<p class="panel-label">Permitted proposal</p>
			<ol class="storyboard">
				<li
					class:complete={phaseReached('discovered')}
					aria-current={phase === 'ready' ? 'step' : undefined}
				>
					<div>
						<strong>Find and explain</strong><span
							>Read stable identity, label, constraints, and policy.</span
						>
					</div>
					<Button
						size="sm"
						variant="secondary"
						data-demo-step="inspect"
						onclick={findAndExplain}
						disabled={!controlsReady || phase !== 'ready'}>Inspect control</Button
					>
				</li>
				<li
					class:complete={phaseReached('validated')}
					aria-current={phase === 'discovered' ? 'step' : undefined}
				>
					<div>
						<strong>Validate the proposal</strong><span>Use the same rule as the visible form.</span
						>
					</div>
					<Button
						size="sm"
						variant="secondary"
						data-demo-step="validate"
						onclick={validateProposal}
						disabled={phase !== 'discovered'}>Check “{PROPOSED_NAME}”</Button
					>
				</li>
				<li
					class:complete={phaseReached('staged')}
					aria-current={phase === 'validated' ? 'step' : undefined}
				>
					<div>
						<strong>Stage separately</strong><span
							>Keep the proposal apart from the live value.</span
						>
					</div>
					<Button
						size="sm"
						variant="secondary"
						data-demo-step="stage"
						onclick={stageProposal}
						disabled={phase !== 'validated'}>Stage proposal</Button
					>
				</li>
				<li
					class:complete={phaseReached('reviewed')}
					aria-current={phase === 'staged' ? 'step' : undefined}
				>
					<div><strong>Review</strong><span>Compare the live and proposed values.</span></div>
					<Button
						size="sm"
						variant="secondary"
						data-demo-step="review"
						onclick={reviewProposal}
						disabled={phase !== 'staged'}>Mark reviewed</Button
					>
				</li>
				<li
					class:complete={phaseReached('applied')}
					aria-current={phase === 'reviewed' ? 'step' : undefined}
				>
					<div>
						<strong>Confirm and apply</strong><span>Send the explicit confirmation signal.</span>
					</div>
					<Button
						size="sm"
						data-demo-step="apply"
						onclick={confirmAndApply}
						disabled={phase !== 'reviewed'}>Confirm change</Button
					>
				</li>
				<li
					class:complete={phase === 'undone'}
					aria-current={phase === 'applied' ? 'step' : undefined}
				>
					<div><strong>Undo</strong><span>Restore the previous registry-held value.</span></div>
					<Button
						size="sm"
						variant="secondary"
						data-demo-step="undo"
						onclick={undoAppliedValue}
						disabled={phase !== 'applied'}>Undo applied value</Button
					>
				</li>
			</ol>

			<div class="value-review" aria-label="Live and proposed values">
				<div><span>Live value</span><strong>{displayName}</strong></div>
				<div><span>Proposed value</span><strong>{stagedValue ?? 'Not staged'}</strong></div>
				<div><span>Proposal check</span><strong>{proposalValidation}</strong></div>
			</div>

			{#if discoveredControl}
				<p class="discovery-result">
					Found <code
						>{`${discoveredControl.identity.formId}.${discoveredControl.identity.controlId}`}</code
					>:
					{discoveredControl.metadata.label}, {discoveredControl.metadata.sensitivity}, {describeConstraints(
						discoveredControl
					)}.
				</p>
			{/if}
		</div>
	</div>

	<section class="refusal-panel" aria-labelledby="refusal-title">
		<div>
			<p class="panel-label">Policy refusal</p>
			<h4 id="refusal-title">Awareness is not authority</h4>
			<p>
				The registry can identify the recovery-key control. Its secret classification removes read
				and mutation authority.
			</p>
		</div>
		<Button variant="danger" onclick={attemptProtectedChange} disabled={!controlsReady}
			>Attempt protected change</Button
		>
		<div class:denied={refusal && !refusal.ok} class="refusal-result">
			{#if refusal}
				<strong>{refusal.ok ? 'Unexpected success' : 'Refused by the released policy'}</strong>
				<span
					>Result: <code>{`${refusal.reason ?? 'none'}`}</code>. No protected value was read,
					staged, or shown.</span
				>
			{:else}
				<strong>No request sent</strong>
				<span>The adapter supplies no protected value to this attempt.</span>
			{/if}
		</div>
	</section>

	<p bind:this={statusElement} class="demo-status" role="status" tabindex="-1">{status}</p>

	<nav class="demo-links" aria-label="Agent-aware form demonstration resources">
		<a href="/interaction#commands-and-lifecycle">Interaction lifecycle</a>
		<a href="/capabilities/agent-assisted-forms">Implementation guide</a>
		<a href="/reference/control-interaction">Reference contract</a>
	</nav>

	<noscript>
		<div class="no-script-storyboard">
			<strong>Static storyboard</strong>
			<p>
				The scripted flow finds and explains the public control, validates a proposal, stages it,
				reviews it, and applies it only after confirmation.
			</p>
			<p>
				The refusal flow asks the released policy to stage a secret control. The policy returns
				<code>sensitive_control</code> without reading or showing the protected value.
			</p>
		</div>
	</noscript>
</section>

<style>
	.agent-form-demo {
		margin: 1.5rem 0;
		border: 1px solid var(--smrt-color-outline-variant, var(--site-line-strong));
		border-radius: 0.8rem;
		background: var(--smrt-color-surface-container-lowest, var(--site-surface));
		color: var(--smrt-color-on-surface, var(--site-ink));
		overflow: hidden;
	}

	.demo-header,
	.demo-layout,
	.refusal-panel {
		padding: clamp(1rem, 3vw, 1.5rem);
	}

	.demo-header {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.8fr);
		gap: 1.5rem;
		align-items: start;
		border-bottom: 1px solid var(--smrt-color-outline-variant, var(--site-line));
	}

	.demo-kicker,
	.panel-label {
		margin: 0 0 0.45rem;
		color: var(--smrt-color-primary, var(--site-accent-strong));
		font: 700 0.66rem var(--smrt-font-family-mono, var(--site-font-mono));
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	h3,
	h4,
	p {
		margin: 0;
	}

	h3 {
		font-size: clamp(1.25rem, 3vw, 1.8rem);
		line-height: 1.15;
	}

	.honest-label {
		padding: 0.8rem;
		border-inline-start: 3px solid var(--smrt-color-tertiary, var(--site-accent));
		background: var(--smrt-color-surface-container, var(--site-paper));
		color: var(--smrt-color-on-surface-variant, var(--site-muted));
		font-size: 0.78rem;
		line-height: 1.55;
	}

	.demo-layout {
		display: grid;
		grid-template-columns: minmax(15rem, 0.7fr) minmax(24rem, 1.3fr);
		gap: 1.5rem;
	}

	.form-panel,
	.adapter-panel {
		min-width: 0;
	}

	.identity-card {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		margin: 0 0 1rem;
		border-block: 1px solid var(--smrt-color-outline-variant, var(--site-line));
	}

	.identity-card div {
		padding: 0.65rem 0;
	}

	.identity-card dt,
	.value-review span {
		color: var(--smrt-color-on-surface-variant, var(--site-muted));
		font-size: 0.65rem;
	}

	.identity-card dd {
		margin: 0.2rem 0 0;
		font-size: 0.76rem;
	}

	.form-panel :global(form) {
		display: grid;
		gap: 1rem;
	}

	.storyboard {
		display: grid;
		gap: 0;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--smrt-color-outline-variant, var(--site-line));
		list-style: none;
	}

	.storyboard li {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 1rem;
		align-items: center;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, var(--site-line));
	}

	.storyboard li::before {
		content: '';
		width: 0.5rem;
		height: 0.5rem;
		grid-column: 1;
		grid-row: 1;
		border: 1px solid var(--smrt-color-outline, var(--site-line-strong));
		border-radius: 50%;
	}

	.storyboard li > div {
		grid-column: 1;
		grid-row: 1;
		margin-left: 1rem;
	}

	.storyboard li.complete::before {
		border-color: var(--smrt-color-primary, var(--site-accent));
		background: var(--smrt-color-primary, var(--site-accent));
	}

	.storyboard strong,
	.storyboard span {
		display: block;
	}

	.storyboard strong {
		font-size: 0.76rem;
	}

	.storyboard span {
		margin-top: 0.18rem;
		color: var(--smrt-color-on-surface-variant, var(--site-muted));
		font-size: 0.68rem;
	}

	.value-review {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.6rem;
		margin-top: 1rem;
	}

	.value-review div {
		min-width: 0;
		padding: 0.7rem;
		background: var(--smrt-color-surface-container-low, var(--site-paper));
	}

	.value-review strong {
		display: block;
		margin-top: 0.25rem;
		font-size: 0.72rem;
		overflow-wrap: anywhere;
	}

	.discovery-result,
	.demo-status {
		color: var(--smrt-color-on-surface-variant, var(--site-muted));
		font-size: 0.72rem;
		line-height: 1.55;
	}

	.discovery-result {
		margin-top: 0.8rem;
	}

	.refusal-panel {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(15rem, 0.8fr);
		gap: 1rem;
		align-items: center;
		border-block: 1px solid var(--smrt-color-outline-variant, var(--site-line));
		background: color-mix(in srgb, var(--smrt-color-error, #ba1a1a) 5%, transparent);
	}

	.refusal-panel h4 {
		font-size: 0.95rem;
	}

	.refusal-panel p:not(.panel-label) {
		max-width: 38rem;
		margin-top: 0.35rem;
		color: var(--smrt-color-on-surface-variant, var(--site-muted));
		font-size: 0.72rem;
		line-height: 1.5;
	}

	.refusal-result {
		padding: 0.75rem;
		border: 1px solid var(--smrt-color-outline-variant, var(--site-line));
		background: var(--smrt-color-surface, var(--site-surface));
	}

	.refusal-result.denied {
		border-color: var(--smrt-color-error, #ba1a1a);
	}

	.refusal-result strong,
	.refusal-result span {
		display: block;
	}

	.refusal-result strong {
		font-size: 0.72rem;
	}

	.refusal-result span {
		margin-top: 0.25rem;
		color: var(--smrt-color-on-surface-variant, var(--site-muted));
		font-size: 0.68rem;
		line-height: 1.45;
	}

	.demo-status {
		padding: 0.85rem 1.5rem;
		background: var(--smrt-color-inverse-surface, var(--site-ink));
		color: var(--smrt-color-inverse-on-surface, var(--site-paper));
	}

	.demo-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 0.85rem 1.5rem;
	}

	.demo-links a {
		padding: 0.4rem 0.6rem;
		border: 1px solid var(--smrt-color-outline-variant, var(--site-line));
		border-radius: 999px;
		color: inherit;
		font-size: 0.68rem;
		text-decoration: none;
	}

	.demo-links a:hover,
	.demo-links a:focus-visible {
		border-color: var(--smrt-color-primary, var(--site-accent));
		text-decoration: underline;
		text-underline-offset: 0.2rem;
	}

	.no-script-storyboard {
		margin: 0 1.5rem 1.5rem;
		padding: 1rem;
		border: 2px solid var(--smrt-color-primary, var(--site-accent));
	}

	.no-script-storyboard p {
		margin-top: 0.5rem;
		font-size: 0.75rem;
		line-height: 1.5;
	}

	@media (max-width: 58rem) {
		.demo-header,
		.demo-layout,
		.refusal-panel {
			grid-template-columns: 1fr;
		}

		.refusal-panel :global(button) {
			justify-self: start;
		}
	}

	@media (max-width: 36rem) {
		.storyboard li,
		.value-review {
			grid-template-columns: 1fr;
		}

		.storyboard li::before,
		.storyboard li > div {
			grid-column: 1;
			grid-row: auto;
		}

		.storyboard li > div {
			margin-left: 0;
		}

		.storyboard li :global(button) {
			justify-self: start;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.agent-form-demo *,
		.agent-form-demo *::before,
		.agent-form-demo *::after {
			scroll-behavior: auto !important;
			transition-duration: 0.01ms !important;
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
		}
	}
</style>
