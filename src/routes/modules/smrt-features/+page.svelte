<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-features"
	description="Code-first feature flag registry with layered resolution: tenant hierarchy, global scope, and the definition default."
	badges={['v0.29.34', 'Feature Flags', 'Boolean Resolution', 'Tenant Hierarchy']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-features</strong> is a code-first feature-flag system. Features are declared on
			<code>@smrt()</code>-decorated classes (their default state lives in code), then optionally
			overridden at the global or tenant (hierarchical) scope at runtime. A boot-time sync service
			mirrors the registered definitions into the database so admin tooling can list and configure
			them. Resolution returns a boolean.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Layered resolution: tenant hierarchy, then global, then the definition default</li>
				<li>
					Override scopes are <code>'global'</code> and <code>'tenant'</code> only (no per-user scope)
				</li>
				<li>
					<code>_smrt_feature_definitions</code> mirrors code-owned definitions (keyed by
					<code>featureKey</code>)
				</li>
				<li>
					<code>_smrt_feature_overrides</code> stores runtime overrides keyed by
					<code>(featureKey, scopeType, scopeId)</code>
				</li>
				<li><code>FeatureSyncService</code> reconciles DB with the registry at boot</li>
				<li>Walks tenant hierarchy via optional <code>smrt-users</code> peer</li>
				<li>
					Override effects are <code>enable</code> / <code>disable</code> / <code>inherit</code>
					(the <code>FeatureOverrideEffect</code> enum)
				</li>
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
  FeatureResolver,
  FeatureSyncService,
  FeatureOverrideCollection,
  FeatureOverrideEffect,
  createFeatureKey,
} from '@happyvertical/smrt-features';

// 1. Sync definitions to DB at boot.
// Definitions are read from the SMRT ObjectRegistry (features declared on
// @smrt()-decorated classes), not from a literal array. With no filter,
// syncDefinitions() reconciles every registered feature.
const sync = new FeatureSyncService({ db });
const result = await sync.syncDefinitions();
// result: { total, created, updated, unchanged, deleted, featureKeys }

// 2. Resolve a feature for the current context (returns a boolean).
// Feature keys are "<qualifiedClassName>#<localId>".
const resolver = new FeatureResolver({ db });
const featureKey = createFeatureKey('@acme/commerce:Invoice', 'draftMode');
const enabled = await resolver.isEnabled(featureKey, {
  tenantId: 'tenant-123',
});

// Or resolve directly from a class/instance + localId:
// await resolver.isEnabledFor(Invoice, 'draftMode', { tenantId });

// 3. Write a tenant-level override via FeatureOverrideCollection.
const overrides = await FeatureOverrideCollection.create({ db });
await overrides.setOverride(
  featureKey,
  'tenant',
  'tenant-123',
  FeatureOverrideEffect.ENABLE,
);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Resolution Chain</h2>
		<p>
			<code>isEnabled()</code> starts from the definition default and applies overrides from least to
			most specific, returning the resulting boolean:
		</p>
		<CodeBlock
			code={`Resolution order
  1. Definition default (defaultEnabled on the code-registered FeatureDefinition)
  2. Global override   scopeType: 'global', scopeId: GLOBAL_FEATURE_SCOPE_ID ('*')
  3. Tenant override   scopeType: 'tenant', scopeId: tenantId
                       (walks root -> ... -> tenantId via smrt-users, applying
                        each override down the chain)

Override effects: 'enable' | 'disable' | 'inherit' (FeatureOverrideEffect).
'inherit' leaves the inherited state unchanged.

There is no per-user scope: scopeType is 'global' or 'tenant' only.
The tenant-hierarchy walk requires the @happyvertical/smrt-users peer.
Without it (or without a tenantId), tenant resolution uses the single
direct tenant override.`}
			language="text"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>FeatureDefinition</h3>
		<CodeBlock
			code={`class FeatureDefinition extends SmrtObject {
  featureKey: string           // '<qualifiedClassName>#<localId>'
  packageName: string          // owning package
  qualifiedClassName: string   // e.g. '@acme/commerce:Invoice'
  className: string
  localId: string              // the feature id within the class
  defaultEnabled: boolean      // default state when no override matches
  label: string
  description: string
  metadata: string             // JSON metadata stored as text (get/setMetadata)
  visibility: string           // default 'public'

  // System table: _smrt_feature_definitions (conflictColumns: ['feature_key'])
  // Owned by code via FeatureSyncService — do not write directly
}`}
			language="typescript"
		/>

		<h3>FeatureOverride</h3>
		<CodeBlock
			code={`enum FeatureOverrideEffect {
  INHERIT = 'inherit',
  ENABLE = 'enable',
  DISABLE = 'disable',
}

class FeatureOverride extends SmrtObject {
  featureKey: string
  scopeType: 'global' | 'tenant'         // no 'user' scope
  scopeId: string                        // tenantId, or GLOBAL_FEATURE_SCOPE_ID ('*')
  effect: FeatureOverrideEffect          // default INHERIT

  // Helpers: isInherit(), isEnabled(), isDisabled()
  // System table: _smrt_feature_overrides
  // conflictColumns: ['feature_key', 'scope_type', 'scope_id']
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>FeatureSyncService</h2>
		<p>
			Keeps <code>_smrt_feature_definitions</code> in sync with the features declared on
			<code>@smrt()</code>-decorated classes (read from the SMRT <code>ObjectRegistry</code>) at
			boot. Calling <code>syncDefinitions()</code> with no options reconciles every registered
			feature; pass <code>classNames</code> or <code>constructors</code> to scope the sync to
			specific classes. A full (unfiltered) sync prunes stale definitions by default (<code
				>pruneStale</code
			>, on for full syncs, off for filtered ones).
		</p>
		<CodeBlock
			code={`const sync = new FeatureSyncService({ db });

// Full reconcile of every registered feature
const result = await sync.syncDefinitions();

// Or scope to specific classes (pruneStale defaults to false here)
await sync.syncDefinitions({ classNames: ['Invoice', 'Order'] });

// result: { total, created, updated, unchanged, deleted, featureKeys }
// - Upserts definitions for registered features (created / updated / unchanged)
// - On a full sync, deletes definitions whose feature keys are no longer registered

// You can also sync directly from a manifest:
// await sync.syncManifest(manifest, { pruneStale: true });`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Integration with smrt-users</h2>
		<p>
			When <code>@happyvertical/smrt-users</code> is present, <code>FeatureResolver</code> walks the
			tenant hierarchy (root down to the target tenant) so a feature can be turned on for a parent
			tenant and inherited by descendants. The default loader pulls the chain from
			<code>smrt-users</code> automatically; pass a custom <code>tenantHierarchyLoader</code> via
			the resolver's second constructor argument (<code>FeatureResolverOptions</code>) to supply
			your own
			<code>FeatureTenantHierarchyProvider</code>.
		</p>
	</section>

	<section>
		<h2>Gotchas</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>
					Declare features on <code>@smrt()</code>-decorated classes so they register automatically
				</li>
				<li>
					Run a full <code>syncDefinitions()</code> at boot — filtered syncs skip stale-pruning and can
					leave drift
				</li>
				<li>
					Build feature keys with <code>createFeatureKey(qualifiedClassName, localId)</code> rather than
					hand-writing them
				</li>
				<li>
					Use <code>FeatureOverrideEffect.INHERIT</code> to clear an override without deleting the row
				</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>
					Don't write <code>FeatureDefinition</code> rows directly — use
					<code>FeatureSyncService</code>
				</li>
				<li>
					Don't assume tenant-hierarchy walking works without the <code>smrt-users</code> peer
				</li>
				<li>
					Don't expect a per-user scope — overrides are <code>'global'</code> or
					<code>'tenant'</code> only
				</li>
				<li>
					Don't use feature flags as long-term config — promote stable flags to <code
						>smrt-config</code
					>
				</li>
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
