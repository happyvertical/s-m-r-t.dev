<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-secrets"
	description="Per-tenant secret management with envelope encryption (AMK to TDEK to secret), key rotation, and audit logging."
	badges={['v0.20.44', 'Envelope Encryption', 'Key Rotation', 'Audit Trail']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-secrets</strong> provides per-tenant secret storage using a three-layer envelope
			encryption chain. An Application Master Key (AMK) from the environment wraps per-tenant Data
			Encryption Keys (TDEK), which encrypt individual secret values. Every operation is audit-logged.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Three-layer encryption: AMK wraps TDEK wraps secret value</li>
				<li>Per-tenant data encryption keys (auto-created on first secret)</li>
				<li>Key rotation with separate re-encryption step</li>
				<li>Audit logging for all operations (create, read, update, delete, rotate)</li>
				<li>Access counting and expiration tracking</li>
				<li>No API/MCP exposure (security by design)</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-secrets`} language="bash" />
		<p>
			Requires the <code>SMRT_SECRET_MASTER_KEY</code> environment variable (64 hex characters) as
			the Application Master Key.
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
			code={`class Secret extends SmrtObject {
  name: string
  encryptedValue: string      // JSON envelope (encrypted)
  category?: string
  description?: string
  status: 'active' | 'disabled' | 'expired'
  expiresAt?: Date
  accessCount: number
  lastAccessedAt?: Date

  // No API/MCP exposure (security)
  // CLI: list-only
}`}
			language="typescript"
		/>

		<h3>TenantKey</h3>
		<CodeBlock
			code={`class TenantKey extends SmrtObject {
  tenantId: string
  wrappedKey: string          // TDEK wrapped by AMK
  keyVersion: number
  status: 'active' | 'rotating' | 'retired' | 'compromised'

  // NOT tenant-scoped (tracks keys FOR tenants)
}`}
			language="typescript"
		/>

		<h3>SecretAuditLog</h3>
		<CodeBlock
			code={`class SecretAuditLog extends SmrtObject {
  secretName: string
  action: 'create' | 'read' | 'update' | 'delete' | 'rotate_key' | 'disable' | 'enable'
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
