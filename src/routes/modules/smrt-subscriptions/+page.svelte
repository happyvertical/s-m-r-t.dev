<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const installCode = `pnpm add @happyvertical/smrt-subscriptions`;

	const meterCode = `import { TenantUsageMeter } from '@happyvertical/smrt-subscriptions';

const meter = await TenantUsageMeter.create({ db });

// Record one usage row. Defaults to a 'tenant'-kind row keyed off
// tenantId; pass subscriberKind: 'external' + subscriberExternalId for
// per-buyer / per-agent metering.
await meter.record({
  tenantId: 'tenant-123',
  metricKey: 'documents.processed',
  quantity: 1,
  windowStart: monthStart,
  windowEnd: monthEnd,
  source: 'pipeline',
});

// Summarize usage over a window for a subscriber.
const summary = await meter.summarize({
  tenantId: 'tenant-123',
  metricKey: 'documents.processed',
  window: { start: monthStart, end: monthEnd },
});
console.log(summary.quantity);`;

	const aiCode = `// metricKey values starting with 'ai.' short-circuit to the tenant's
// _smrt_ai_usage system table (populated by the smrt-core AI layer), so
// you meter token usage without recording rows yourself.
const promptTokens = await meter.summarize({
  tenantId: 'tenant-123',
  metricKey: 'ai.tokens.prompt',
  window: { start: monthStart, end: monthEnd },
});

// Or pull the full AI rollup for the tenant in one call:
const ai = await meter.summarizeAiUsage({
  tenantId: 'tenant-123',
  window: { start: monthStart, end: monthEnd },
});
// ai => { promptTokens, completionTokens, totalTokens,
//         estimatedCost, requestCount, windowStart, windowEnd }`;

	const aiKeysCode = `// Recognized ai.* metric keys (each maps onto the AI usage rollup):
//   ai.tokens.prompt      -> promptTokens
//   ai.tokens.completion  -> completionTokens
//   ai.tokens.total       -> totalTokens
//   ai.cost.estimated     -> estimatedCost
//   ai.requests           -> requestCount
//
// The ai.* short-circuit only fires for 'tenant'-kind subscribers, since
// _smrt_ai_usage is tenant-scoped. External subscribers fall through to
// the normal _smrt_tenant_usage_metrics aggregation.`;

	const resolverCode = `import {
  SubscriptionResolver,
  SubscriptionPlanCollection,
  TenantSubscriptionCollection,
  TenantUsageMeter,
} from '@happyvertical/smrt-subscriptions';

const plans = await SubscriptionPlanCollection.create({ db });
const subscriptions = await TenantSubscriptionCollection.create({ db });
const usage = await TenantUsageMeter.create({ db });

// Wire the three readers the resolver needs.
const resolver = new SubscriptionResolver({ plans, subscriptions, usage });

// Resolve everything a subscriber is entitled to right now.
const ent = await resolver.resolveTenantEntitlements('tenant-123');
// ent => { planKey, status, featureKeys, thresholds,
//          thresholdEvaluations, allowed, ... }

// Feature gate.
if (await resolver.isFeatureEnabled('tenant-123', 'bulk-export')) {
  // ...
}

// Throw if any 'block' threshold is exceeded (e.g. before an AI call).
await resolver.assertWithinThresholds('tenant-123');`;

	const thresholdCode = `import { evaluateThreshold } from '@happyvertical/smrt-subscriptions';

// A plan threshold caps an AI-token budget per month and blocks once hit.
const evaluation = evaluateThreshold(
  {
    metricKey: 'ai.tokens.total',
    limit: 1_000_000,
    window: 'month',
    enforcement: 'block',   // 'observe' | 'warn' | 'block'
    warningRatio: 0.8,       // warn state at 80% (default)
  },
  aiTokenUsageSummary,        // a UsageSummary for this metric/window
);
// evaluation => { ratio, state: 'ok' | 'warn' | 'blocked',
//                 allowed, remaining, threshold, usage }`;

	const svelteCode = `<script lang="ts">
  import {
    PlanPicker,
    SubscriptionSummary,
    UsageThresholds,
  } from '@happyvertical/smrt-subscriptions/svelte';

  let { plans, resolution } = $props();
<\/script>

<PlanPicker {plans} selectedPlanKey={resolution.planKey}
  onSelect={(plan) => choose(plan)} />

<SubscriptionSummary {resolution} />

<UsageThresholds evaluations={resolution.thresholdEvaluations} />`;
</script>

<ModulePage
	name="smrt-subscriptions"
	description="Tenant subscription plans, feature grants, usage thresholds, and entitlement resolution — including AI-token-quota metering off the framework's built-in AI usage table."
	badges={['Domain', 'Billing', 'Entitlements', 'Multi-tenant']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>@happyvertical/smrt-subscriptions</strong> answers "what is this subscriber allowed to
			do, and have they used it up?" It pairs subscription plans (feature grants + usage thresholds)
			with a usage meter and an entitlement resolver, and ships provider-neutral Svelte UI for plan
			selection and usage display.
		</p>
		<p>Three models back it:</p>
		<ul>
			<li><code>SubscriptionPlan</code> — a plan with feature grants and usage thresholds.</li>
			<li><code>TenantSubscription</code> — a subscriber's current plan and status.</li>
			<li><code>TenantUsageMetric</code> — recorded usage rows aggregated per window.</li>
		</ul>
		<Callout variant="note" title="Subscribers are polymorphic">
			Every usage row and subscription is scoped to a <code>Subscriber</code>: either
			<code>{'{ kind: \'tenant\', tenantId }'}</code> (the subscriber <em>is</em> the tenant — the
			classic single-tenant SaaS shape) or
			<code>{'{ kind: \'external\', tenantId, externalId }'}</code> for B2C buyers, anonymous
			subscribers, or agent identities scoped under an issuing tenant. Omitting the kind defaults to
			<code>'tenant'</code>, so existing callers are unaffected.
		</Callout>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={installCode} lang="bash" />
	</section>

	<section>
		<h2>Meter usage</h2>
		<p>
			<code>TenantUsageMeter</code> records and summarizes usage rows. The collection layer enforces
			the subscriber XOR invariant — passing <code>subscriberKind: 'external'</code> without a
			non-empty <code>subscriberExternalId</code> throws:
		</p>
		<CodeBlock code={meterCode} lang="typescript" />
	</section>

	<section>
		<h2>AI-token-quota metering</h2>
		<p>
			This is the headline integration. The SMRT framework's AI layer records every model call into a
			tenant-scoped <code>_smrt_ai_usage</code> system table. <code>TenantUsageMeter.summarize()</code>
			recognizes <code>ai.*</code> metric keys and short-circuits straight to that table — so you meter
			real token consumption without recording a single usage row yourself:
		</p>
		<CodeBlock code={aiCode} lang="typescript" />
		<CodeBlock code={aiKeysCode} lang="typescript" />
		<Callout variant="note" title="Tenant-scoped only">
			Because <code>_smrt_ai_usage</code> is tenant-scoped, the <code>ai.*</code> short-circuit only
			fires for <code>'tenant'</code>-kind subscribers. External subscribers fall through to the normal
			usage-metric aggregation, so meter their AI usage with explicit <code>record()</code> calls if
			you need per-external quotas.
		</Callout>
	</section>

	<section>
		<h2>Resolve entitlements</h2>
		<p>
			<code>SubscriptionResolver</code> ties plans, subscriptions, and usage together. Construct it
			with three readers (the collections above satisfy them) and ask what a subscriber is entitled
			to. For each of the plan's thresholds it pulls the matching usage summary for the right window
			and evaluates it, returning an <code>allowed</code> verdict plus per-threshold detail:
		</p>
		<CodeBlock code={resolverCode} lang="typescript" />
		<p>
			<code>resolveEntitlements(subscriber)</code> is the polymorphic surface (works for tenant and
			external subscribers); <code>resolveTenantEntitlements(tenantId)</code> is the thin single-tenant
			wrapper. <code>assertWithinThresholds(...)</code> throws when any threshold's evaluation is not
			<code>allowed</code> — a natural pre-flight check before an expensive operation.
		</p>
	</section>

	<section>
		<h2>Thresholds &amp; enforcement</h2>
		<p>
			A <code>PlanThreshold</code> caps a <code>metricKey</code> at a <code>limit</code> over a
			<code>window</code> with an <code>enforcement</code> mode of <code>observe</code>,
			<code>warn</code>, or <code>block</code>. <code>evaluateThreshold(threshold, usage)</code>
			(exported standalone) computes the verdict:
		</p>
		<CodeBlock code={thresholdCode} lang="typescript" />
		<table>
			<thead>
				<tr>
					<th>Enforcement</th>
					<th>Behavior</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>observe</code></td>
					<td>Tracks usage; never blocks. Always <code>allowed</code>.</td>
				</tr>
				<tr>
					<td><code>warn</code></td>
					<td>Surfaces a <code>warn</code> state past <code>warningRatio</code> (default 0.8); still allowed.</td>
				</tr>
				<tr>
					<td><code>block</code></td>
					<td>Flips to <code>blocked</code> / <code>allowed: false</code> once usage reaches the limit.</td>
				</tr>
			</tbody>
		</table>
		<p>
			Each <code>ThresholdEvaluation</code> carries <code>ratio</code>, <code>state</code>,
			<code>allowed</code>, and <code>remaining</code> so a UI can render a progress bar and an
			upgrade nudge. Windows are <code>day</code>, <code>week</code>, <code>month</code>,
			<code>year</code>, or <code>rolling</code>.
		</p>
	</section>

	<section>
		<h2>Svelte UI</h2>
		<p>
			The <code>/svelte</code> subpath ships three provider-neutral components. They render state and
			emit actions back to the host app — they do not call any billing provider themselves:
		</p>
		<CodeBlock code={svelteCode} lang="svelte" />
		<table>
			<thead>
				<tr>
					<th>Component</th>
					<th>Props</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>PlanPicker</code></td>
					<td>
						<code>plans: SubscriptionPlan[]</code>, <code>selectedPlanKey?: string | null</code>,
						<code>onSelect?: (plan) =&gt; void</code>
					</td>
				</tr>
				<tr>
					<td><code>SubscriptionSummary</code></td>
					<td><code>resolution?: EntitlementResolution | null</code></td>
				</tr>
				<tr>
					<td><code>UsageThresholds</code></td>
					<td><code>evaluations?: ThresholdEvaluation[]</code></td>
				</tr>
			</tbody>
		</table>
		<Callout variant="note" title="Provider-neutral by design">
			Keep Stripe (or any provider) specifics as binding metadata on the plan/subscription. Runtime
			provider API calls belong in your app or the HAVE SDK accounting provider, not in these models
			or components.
		</Callout>
	</section>

	<section>
		<h2>API surface</h2>
		<table>
			<thead>
				<tr>
					<th>Export</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>SubscriptionPlan</code> / <code>TenantSubscription</code> / <code>TenantUsageMetric</code></td>
					<td>Models, each with a matching <code>*Collection</code>.</td>
				</tr>
				<tr>
					<td><code>TenantUsageMeter</code></td>
					<td><code>record</code>, <code>summarize</code> (with <code>ai.*</code> short-circuit), <code>summarizeAiUsage</code>.</td>
				</tr>
				<tr>
					<td><code>SubscriptionResolver</code></td>
					<td><code>resolveEntitlements</code>, <code>resolveTenantEntitlements</code>, <code>isFeatureEnabled</code>, <code>assertWithinThresholds</code>.</td>
				</tr>
				<tr>
					<td><code>evaluateThreshold</code> / <code>evaluateThresholds</code></td>
					<td>Standalone threshold evaluation helpers.</td>
				</tr>
				<tr>
					<td><code>PlanPicker</code>, <code>SubscriptionSummary</code>, <code>UsageThresholds</code></td>
					<td>From <code>@happyvertical/smrt-subscriptions/svelte</code>.</td>
				</tr>
				<tr>
					<td>
						<code>Subscriber</code>, <code>PlanThreshold</code>, <code>ThresholdEvaluation</code>,
						<code>EntitlementResolution</code>, <code>AiUsageSummary</code>, <code>UsageSummary</code>,
						<code>ThresholdEnforcement</code>, <code>SubscriptionStatus</code>
					</td>
					<td>Key exported types (plus utilities like <code>normalizeSubscriber</code>, <code>getWindowForThreshold</code>).</td>
				</tr>
			</tbody>
		</table>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div class="link-grid">
			<a href="/modules/smrt-tenancy" class="link-card">
				<h3>smrt-tenancy</h3>
				<p>The tenant context every subscription and usage row is scoped to.</p>
			</a>
			<a href="/modules/smrt-users" class="link-card">
				<h3>smrt-users</h3>
				<p>Identities that map to tenants and external subscribers.</p>
			</a>
			<a href="/modules/smrt-core" class="link-card">
				<h3>smrt-core</h3>
				<p>Its AI layer fills the <code>_smrt_ai_usage</code> table the meter reads.</p>
			</a>
		</div>
	</section>

	<section>
		<div
			style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);"
		>
			<a href="/modules" style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;"
				>&larr; Back to Modules</a
			>
			<a href="/sdk" style="color: var(--smrt-color-primary, #1976d2); text-decoration: none;"
				>Next: the HAVE SDK &rarr;</a
			>
		</div>
	</section>
</ModulePage>
