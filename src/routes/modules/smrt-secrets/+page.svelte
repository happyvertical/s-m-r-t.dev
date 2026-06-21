<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
</script>

<ModulePage
	name="smrt-secrets"
	description="Per-tenant secret management with envelope encryption (AMK → TDEK → secret), key rotation, and audit logging."
	badges={['v0.29.34', 'Envelope Encryption', 'Key Rotation', 'Audit Trail', 'Tenancy Exception']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-secrets</strong> stores per-tenant secrets using a three-layer envelope
			encryption chain: an Application Master Key (AMK) from the environment wraps per-tenant Data
			Encryption Keys (TDEK), which in turn encrypt individual secret values. Every operation is
			audit-logged. The three models in this package deliberately deviate from the framework's
			default tenancy decorator — see <strong>Known exceptions to monorepo standards</strong> below.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li><strong>Envelope encryption</strong>: AMK wraps TDEK wraps secret value</li>
				<li>Per-tenant TDEKs, auto-created on first secret store</li>
				<li>
					<strong>Two-step key rotation</strong>: <code>rotateKey()</code> +
					<strong>separate</strong> <code>reencryptAll()</code> — the rotation does NOT auto-re-encrypt
				</li>
				<li>
					Audit logging for every action (create / read / update / delete / rotate_key / disable /
					enable / expire)
				</li>
				<li>
					Access counting (<code>retrieve()</code> increments <code>accessCount</code> on every read)
					and expiration tracking
				</li>
				<li>
					Context-free <code>storeForTenant()</code> / <code>retrieveForTenant()</code> for jobs
					running outside an ambient tenant context
				</li>
				<li>
					Non-destructive key-drift <code>diagnose</code> + confirmation-gated
					<code>repair</code> (never decrypts secret values)
				</li>
				<li>
					<strong>No API/MCP exposure</strong> on <code>Secret</code> and <code>TenantKey</code>
					(security by design); CLI is read-only (<code>Secret</code> + <code>SecretAuditLog</code>
					list-only, <code>TenantKey</code> list/get)
				</li>
				<li>
					<strong>Three tenancy exceptions</strong> documented inline on each
					<code>@smrt(...)</code> block
				</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-secrets`} language="bash" />
		<p>
			Requires the <code>SMRT_SECRET_MASTER_KEY</code> environment variable (64 hex characters) as the
			Application Master Key.
		</p>
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { SecretService } from '@happyvertical/smrt-secrets';
import { withTenant } from '@happyvertical/smrt-tenancy';

// Create the service (reads AMK from env by default)
const service = await SecretService.create({ db });

await withTenant({ tenantId: 'tenant-123' }, async () => {
  // Store a secret (upserts if name already exists)
  await service.store('stripe-api-key', 'sk_live_xxx', {
    category: 'api-keys',
    description: 'Stripe production key',
    expiresAt: new Date('2027-01-01'),
  });

  // Retrieve and decrypt (increments accessCount)
  const { value, accessCount } = await service.retrieve('stripe-api-key');

  // List secret names (values never included)
  const secrets = await service.list({ category: 'api-keys' });

  // Disable/enable without deleting
  await service.disable('stripe-api-key');
  await service.enable('stripe-api-key');

  // Rotate the tenant's encryption key
  await service.rotateKey();
  // Re-encrypt all secrets with the new key (separate step)
  await service.reencryptAll();

  // Query audit logs
  const logs = await service.getAuditLogs({ secretName: 'stripe-api-key' });

  // Hard delete
  await service.delete('stripe-api-key');
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Secret</h3>
		<CodeBlock
			code={`// @smrt({ tenantScoped: true, api: { include: [] }, mcp: { include: [] },
//         cli: { include: ['list'], skipApiCheck: true } })
// Uses the inline tenantScoped form — NOT the @TenantScoped decorator.
// SecretService.store() manually sets context = tenantId so the (slug, context)
// upsert key isolates secret names per tenant. See Known Exceptions below.
class Secret extends SmrtObject {
  name: string
  context?: string            // set to tenantId by SecretService.store()
  encryptedValue: string      // JSON envelope (encrypted with TDEK)
  category?: string
  description?: string
  status: 'active' | 'disabled' | 'expired'
  expiresAt?: Date
  accessCount: number
  lastAccessedAt?: Date

  // No API/MCP exposure (security); CLI list-only
}`}
			language="typescript"
		/>

		<h3>TenantKey</h3>
		<CodeBlock
			code={`// @smrt({ api: { include: [] }, mcp: { include: [] },
//         cli: { include: ['list', 'get'], skipApiCheck: true } })
// Deliberately NOT tenant-scoped at all. Carries a tenantId column because each
// TDEK belongs to a tenant, but key-rotation tooling and super-admin audits
// must query across tenants. See Known Exceptions below.
class TenantKey extends SmrtObject {
  tenantId: string
  wrappedKey: string          // TDEK wrapped by AMK
  keyVersion: number
  status: 'active' | 'rotating' | 'retired' | 'compromised'
}`}
			language="typescript"
		/>

		<h3>SecretAuditLog</h3>
		<CodeBlock
			code={`// @smrt({ tenantScoped: true, api: { include: [] }, mcp: { include: [] },
//         cli: { include: ['list'], skipApiCheck: true } })
// Uses the inline tenantScoped form rather than the @TenantScoped decorator.
// Audit reads run in mixed contexts (tenant-scoped reports vs. super-admin
// compliance review). See Known Exceptions below.
class SecretAuditLog extends SmrtObject {
  secretName: string
  action: 'create' | 'read' | 'update' | 'delete' | 'rotate_key' | 'disable' | 'enable' | 'expire'
  result: 'success' | 'failure' | 'denied'
  userId?: string
  ipAddress?: string
  userAgent?: string

  // Immutable: CLI list-only
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Known exceptions to monorepo standards</h2>
		<p>
			Per <code>docs/content/standards.md §7</code>, tenant-aware models should normally apply
			<code>@TenantScoped({'{'} mode: 'optional' {'}'})</code> from
			<a href="/modules/smrt-tenancy">@happyvertical/smrt-tenancy</a>. The three models in this
			package deviate intentionally; each <code>@smrt(...)</code> block carries an inline comment pointing
			back to this rationale.
		</p>

		<article>
			<h3>
				<code>Secret</code> (<code>src/models/Secret.ts</code>) — inline
				<code>tenantScoped: true</code>
			</h3>
			<p>
				Uses the inline <code>tenantScoped: true</code> form on <code>@smrt()</code> instead of the
				<code>@TenantScoped</code> decorator. <code>SecretService.store()</code> performs manual
				scoping by populating <code>context = tenantId</code> on each row, so the
				<code>(slug, context)</code> upsert key from the base <code>SmrtObject</code> is what isolates
				secret names per tenant. Switching to the decorator without rethinking the upsert key would surface
				false-positive name collisions across tenants.
			</p>
		</article>

		<article>
			<h3><code>TenantKey</code> (<code>src/models/TenantKey.ts</code>) — NOT tenant-scoped</h3>
			<p>
				Deliberately not tenant-scoped at all. The row carries a <code>tenantId</code> column
				because each TDEK belongs to a tenant, but
				<strong
					>key-rotation tooling, AMK rewrap jobs, and super-admin audits must query across tenants</strong
				>; the tenancy interceptor would silently filter rows those flows rely on. This is the same
				reasoning that keeps
				<code>Partner</code> / <code>Commission</code> / <code>Payout</code> in
				<a href="/modules/smrt-affiliates">smrt-affiliates</a> out of the tenancy interceptor.
			</p>
		</article>

		<article>
			<h3>
				<code>SecretAuditLog</code> (<code>src/models/SecretAuditLog.ts</code>) — inline
				<code>tenantScoped: true</code>
			</h3>
			<p>
				Uses the inline <code>tenantScoped: true</code> form rather than the decorator. Audit reads
				run in mixed contexts (tenant-scoped reports vs. super-admin compliance review).
				Cross-tenant audit queries should be wrapped in <code>withSuperAdminBypass()</code> from
				<a href="/modules/smrt-tenancy">smrt-tenancy</a> at the call site — there are no such cross-tenant
				call sites in this package today, but consumers building compliance tooling should adopt that
				pattern explicitly rather than relying on decorator-implicit filtering.
			</p>
		</article>
	</section>

	<section>
		<h2>Key Rotation</h2>
		<CodeBlock
			code={`// Encryption chain:
// AMK (env var, 256-bit)
//   -> wraps TDEK (per-tenant, auto-generated)
//        -> encrypts secret value (stored as JSON envelope)

// Key rotation creates a new TDEK and retires the old one
await service.rotateKey();

// IMPORTANT: rotateKey() does NOT auto-re-encrypt secrets
// Retired keys are kept for decryption until re-encryption
await service.reencryptAll();
// Returns: { success: number, failed: number }

// TenantKey statuses:
// active    - current encryption key
// rotating  - transitional during rotation
// retired   - kept for decryption of old secrets
// compromised - should not be used

// Cleanup retired keys after 90 days
// TenantKeyCollection.cleanupRetiredKeys()`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Context-free tenant access</h2>
		<p>
			<code>store()</code> / <code>retrieve()</code> read the ambient tenant from
			<a href="/modules/smrt-tenancy">smrt-tenancy</a> via <code>requireTenantId()</code>, so they
			must run inside a <code>withTenant()</code> block. Integrations that have already resolved
			tenant ownership but run <em>outside</em> the application's tenant context (background jobs,
			webhooks, cross-tenant tooling) can pass the tenant explicitly with the
			<code>*ForTenant</code> variants, which simply wrap the call in <code>withTenant()</code> for
			you.
		</p>
		<CodeBlock
			code={`// No ambient tenant context required — the tenantId is explicit.
await service.storeForTenant('tenant-123', 'stripe-api-key', 'sk_live_xxx', {
  category: 'api-keys',
});

const { value } = await service.retrieveForTenant('tenant-123', 'stripe-api-key');`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Key-drift diagnosis &amp; repair</h2>
		<p>
			Envelope encryption has a failure mode: a secret value can outlive the tenant encryption key
			that wraps it, or the configured Application Master Key can stop being able to unwrap a stored
			key. <code>SecretService</code> exposes a non-destructive diagnosis and an explicit,
			confirmation-gated repair for exactly this drift — <strong>neither ever decrypts or exposes a
			secret value</strong>.
		</p>
		<CodeBlock
			code={`// 1) Diagnose (read-only). Pass the tenant explicitly, or use the
//    current-context variant inside a withTenant() block.
const report = await service.diagnoseTenantSecretKeyDrift('tenant-123');
// const report = await service.diagnoseCurrentTenantSecretKeyDrift();

// report.ok === true when no issues. Otherwise report.issues[] each carry a
// code, severity, message, and a suggested repairAction:
//   'delete-unrecoverable-secret'
//   'delete-unusable-tenant-encryption-key'
//   'store-fresh-secret-value'
//   'none'
// report.summary counts active secrets, tenant encryption keys, usable keys, etc.

// 2) Preview the repair without deleting anything.
const preview = await service.repairTenantSecretKeyDrift('tenant-123', {
  dryRun: true,
});
// preview.wouldDeleteSecrets / preview.wouldDeleteTenantEncryptionKeys

// 3) Execute. Destructive deletes require an explicit confirmation flag.
const repaired = await service.repairTenantSecretKeyDrift('tenant-123', {
  confirmDeleteUnrecoverableData: true,
});
// repaired.deletedSecrets / repaired.deletedTenantEncryptionKeys / remainingIssues`}
			language="typescript"
		/>
		<Callout variant="security" title="Repair only deletes unrecoverable rows">
			<code>repairTenantSecretKeyDrift</code> never attempts to recover or surface a secret value — it
			only removes rows the currently configured AMK can no longer use (and the tenant encryption
			keys that can't be unwrapped). Because that is destructive, a non-dry-run call that would delete
			anything <strong>throws unless you pass <code>confirmDeleteUnrecoverableData: true</code></strong>.
			Always run with <code>dryRun: true</code> first and inspect <code>wouldDeleteSecrets</code> /
			<code>wouldDeleteTenantEncryptionKeys</code>.
		</Callout>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Set <code>SMRT_SECRET_MASTER_KEY</code> as a 64-character hex string</li>
				<li>Call <code>reencryptAll()</code> separately after <code>rotateKey()</code></li>
				<li>Use categories to organize secrets logically</li>
				<li>Set expiration dates on time-sensitive credentials</li>
				<li>Monitor audit logs for unexpected access patterns</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't assume <code>rotateKey()</code> re-encrypts secrets automatically</li>
				<li>Don't expose Secret or TenantKey models via API or MCP</li>
				<li>Don't skip the tenant context when storing/retrieving secrets</li>
				<li>Don't ignore that <code>retrieve()</code> increments accessCount on every read</li>
				<li>Don't hard-delete retired keys before calling <code>reencryptAll()</code></li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-tenancy">
				<h3>smrt-tenancy</h3>
				<p>Tenant context for scoped encryption</p>
			</a>
			<a href="/modules/smrt-config">
				<h3>smrt-config</h3>
				<p>Configuration and secret sanitization</p>
			</a>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>ORM and code generation</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
