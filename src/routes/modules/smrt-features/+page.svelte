<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-features"
	description="Code-first feature flag registry with 4-layer resolution: user scope, tenant hierarchy, global scope, and the definition default."
	badges={['v0.24.12', 'Feature Flags', '4-Layer Resolution', 'Tenant Hierarchy']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-features</strong> is a code-first feature-flag system. Features are defined in
			code with default state, then optionally overridden at global, tenant (hierarchically), or
			user scopes at runtime. A boot-time sync service mirrors code definitions into the database
			so admin tooling can list and configure them.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>4-layer resolution: user, tenant hierarchy, global, definition default</li>
				<li><code>_smrt_feature_definitions</code> mirrors code-owned definitions</li>
				<li><code>_smrt_feature_overrides</code> stores runtime overrides keyed by <code>(featureKey, scopeType, scopeId)</code></li>
				<li><code>FeatureSyncService</code> reconciles DB with code at boot</li>
				<li>Walks tenant hierarchy via optional <code>smrt-users</code> peer</li>
				<li>Write-time validation against <code>allowedScopes</code> on the definition</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-features`} language="bash" />
		<p>
			Optional peer: <code>@happyvertical/smrt-users</code> enables tenant-hierarchy walking. Without
			it, tenant resolution is single-level.
		</p>
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  FeatureDefinition,
  FeatureOverride,
  FeatureResolver,
  FeatureSyncService,
  GLOBAL_FEATURE_SCOPE_ID,
} from '@happyvertical/smrt-features';

// 1. Define feature flags in code (typically in a manifest module)
const features = [
  {
    key: 'commerce.invoice.draft-mode',
    description: 'Allow saving invoices as drafts before finalization',
    defaultEffect: 'disabled',
    allowedScopes: ['global', 'tenant', 'user'],
  },
  {
    key: 'content.editor.ai-suggestions',
    description: 'Inline AI suggestion bar in the content editor',
    defaultEffect: 'enabled',
    allowedScopes: ['global', 'tenant'],
  },
];

// 2. Sync definitions to DB at boot
const sync = new FeatureSyncService({ db });
await sync.syncDefinitions(features);

// 3. Resolve a feature for the current context
const resolver = new FeatureResolver({ db });
const effect = await resolver.resolve('commerce.invoice.draft-mode', {
  userId: 'user-42',
  tenantId: 'tenant-123',
});
// effect: 'enabled' | 'disabled' | <custom>

// 4. Write a tenant-level override
await resolver.setOverride({
  featureKey: 'commerce.invoice.draft-mode',
  scopeType: 'tenant',
  scopeId: 'tenant-123',
  effect: 'enabled',
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>4-Layer Resolution Chain</h2>
		<p>Resolution walks from highest priority to lowest, returning the first match:</p>
		<CodeBlock
			code={`Priority (high to low)
  1. User scope        scopeType: 'user',   scopeId: userId
  2. Tenant scope      scopeType: 'tenant', scopeId: tenantId
                       (walks parent -> grandparent -> root via smrt-users)
  3. Global scope      scopeType: 'global', scopeId: GLOBAL_FEATURE_SCOPE_ID
  4. Definition default (from code-registered FeatureDefinition)

Tenant-hierarchy walk requires the @happyvertical/smrt-users peer.
Without it, tenant resolution stops at the immediate tenantId.`}
			language="text"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>FeatureDefinition</h3>
		<CodeBlock
			code={`class FeatureDefinition extends SmrtObject {
  key: string                  // namespaced, e.g. 'commerce.invoice.draft-mode'
  description: string
  defaultEffect: string        // 'enabled' | 'disabled' | <custom>
  allowedScopes: string        // JSON array: ['global','tenant','user']

  // System table: _smrt_feature_definitions
  // Owned by code via FeatureSyncService — do not write directly
}`}
			language="typescript"
		/>

		<h3>FeatureOverride</h3>
		<CodeBlock
			code={`class FeatureOverride extends SmrtObject {
  featureKey: string
  scopeType: 'global' | 'tenant' | 'user'
  scopeId: string              // userId, tenantId, or GLOBAL_FEATURE_SCOPE_ID
  effect: string               // must be a known FeatureOverrideEffect
  reason?: string              // audit trail

  // System table: _smrt_feature_overrides
  // conflictColumns: ['feature_key', 'scope_type', 'scope_id']
  // Write-time validation: effect must match definition, scope must be allowed
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>FeatureSyncService</h2>
		<p>
			Keeps <code>_smrt_feature_definitions</code> in sync with the code-registered manifest at
			boot. Call <code>syncDefinitions()</code> with the full expected feature list. Definitions
			missing from the manifest are flagged (not silently deleted).
		</p>
		<CodeBlock
			code={`const sync = new FeatureSyncService({ db });

await sync.syncDefinitions([
  { key: 'a.b.c', defaultEffect: 'enabled', allowedScopes: ['global'] },
  // ...
]);
// - Inserts new keys
// - Updates description / defaultEffect / allowedScopes for existing keys
// - Marks orphaned definitions (in DB but not in code) for review`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Integration with smrt-users</h2>
		<p>
			When <code>@happyvertical/smrt-users</code> is present, <code>FeatureResolver</code> walks the
			tenant hierarchy (parent then grandparent then root) so a feature can be turned on for a
			parent tenant and inherited by children. Configure with <code>FeatureTenantHierarchyProvider</code>.
		</p>
	</section>

	<section>
		<h2>Gotchas</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Namespace feature keys by package or domain</li>
				<li>Always sync the full manifest at boot — partial syncs leave drift</li>
				<li>Set <code>allowedScopes</code> conservatively (e.g. don't allow user scope for ops-only features)</li>
				<li>Use <code>reason</code> on overrides for an audit trail</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't write <code>FeatureDefinition</code> rows directly — use <code>FeatureSyncService</code></li>
				<li>Don't assume tenant-hierarchy walking works without the <code>smrt-users</code> peer</li>
				<li>Don't store sensitive override reasons — they may be visible in admin UI</li>
				<li>Don't use feature flags as long-term config — promote stable flags to <code>smrt-config</code></li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-prompts">
				<h3>smrt-prompts</h3>
				<p>Parallel registry pattern for prompt templates</p>
			</a>
			<a href="/modules/smrt-languages">
				<h3>smrt-languages</h3>
				<p>Parallel registry pattern for i18n strings</p>
			</a>
			<a href="/modules/smrt-users">
				<h3>smrt-users</h3>
				<p>Optional peer for tenant-hierarchy walking</p>
			</a>
			<a href="/modules/smrt-tenancy">
				<h3>smrt-tenancy</h3>
				<p>Tenant context resolver</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
