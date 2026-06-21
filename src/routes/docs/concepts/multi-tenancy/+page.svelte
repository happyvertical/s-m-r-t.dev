<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { SMRT_VERSION_LABEL } from '$lib/version';
</script>

<svelte:head>
	<title>Multi-tenancy | SMRT Concepts</title>
	<meta
		name="description"
		content="Isolate tenant data in SMRT with @TenantScoped, withTenant(), and an automatic query interceptor — backed by optional Postgres row-level security generated from your permission catalog."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<span>Concepts</span>
		<span>/</span>
		<span>Multi-tenancy</span>
	</nav>

	<h1>Multi-tenancy</h1>
	<p class="lead">
		<code>@happyvertical/smrt-tenancy</code> isolates each tenant's data without threading a tenant
		ID through every query. You mark a class as tenant-scoped, run your request inside a tenant
		context, and a query interceptor adds the <code>WHERE tenant_id = …</code> filter automatically. For
		Postgres, you can add row-level security as a database-enforced second layer.
	</p>

	<section>
		<h2>Two layers of isolation</h2>
		<p>SMRT separates application-level scoping from database-level enforcement:</p>
		<table>
			<thead><tr><th>Layer</th><th>Provided by</th><th>What it does</th></tr></thead>
			<tbody>
				<tr>
					<td>Query interceptor</td>
					<td><code>smrt-tenancy</code></td>
					<td
						>Rewrites every list/get/save/delete for a tenant-scoped class to filter and
						auto-populate <code>tenantId</code> from the active context.</td
					>
				</tr>
				<tr>
					<td>Postgres RLS</td>
					<td><code>smrt-users</code></td>
					<td
						>Generates <code>CREATE POLICY</code> statements from your permission catalog so the database
						rejects cross-tenant rows even if app code has a bug.</td
					>
				</tr>
			</tbody>
		</table>
		<Callout variant="note" title="Defense in depth, not either/or">
			The interceptor is enough for SQLite and for most apps. RLS is an additional,
			database-enforced guarantee for Postgres deployments — the two work together.
		</Callout>
	</section>

	<section>
		<h2>1. Mark a class as tenant-scoped</h2>
		<p>
			Enable tenancy once at startup with <code>enableTenancy()</code>. Then annotate each
			tenant-owned class with <code>@TenantScoped()</code> and its tenant column with the
			<code>@tenantId()</code> property decorator.
		</p>
		<CodeBlock
			code={`import { enableTenancy, TenantScoped, tenantId } from '@happyvertical/smrt-tenancy';
import { smrt, SmrtObject } from '@happyvertical/smrt-core';

// Once, at app startup
enableTenancy();

@smrt()
@TenantScoped({ mode: 'required' })
class Document extends SmrtObject {
  @tenantId()
  tenantId: string = '';

  title: string = '';
  body: string = '';
}`}
			language="typescript"
		/>
		<p><code>@TenantScoped</code> takes one option, <code>mode</code>:</p>
		<table>
			<thead><tr><th>Mode</th><th>Behavior</th></tr></thead>
			<tbody>
				<tr
					><td><code>'required'</code> (default)</td><td
						>Every operation must run inside a tenant context. Missing context throws — fail-closed.</td
					></tr
				>
				<tr
					><td><code>'optional'</code></td><td
						>Works with or without a context. With no tenant, rows with a null tenant ID act as
						global records.</td
					></tr
				>
			</tbody>
		</table>
		<p>For an optional-tenancy class, make the field nullable so global rows are representable:</p>
		<CodeBlock
			code={`@smrt()
@TenantScoped({ mode: 'optional' })
class Template extends SmrtObject {
  @tenantId({ nullable: true })
  tenantId: string | null = null; // null = shared/global template

  name: string = '';
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>2. Run inside a tenant context</h2>
		<p>
			Wrap a unit of work in <code>withTenant()</code>. Inside the callback, every query against a
			tenant-scoped collection is automatically filtered, and creates auto-populate the tenant ID.
		</p>
		<CodeBlock
			code={`import { withTenant } from '@happyvertical/smrt-tenancy';

await withTenant({ tenantId: 'tenant-123' }, async () => {
  // Auto-filtered: WHERE tenant_id = 'tenant-123' AND status = 'active'
  const docs = await documents.list({ where: { status: 'active' } });

  // tenantId is set for you — no need to pass it
  const doc = await documents.create({ title: 'Q3 report' });
  console.log(doc.tenantId); // 'tenant-123'
});`}
			language="typescript"
		/>
		<p>Read the active context, or assert it, anywhere inside the callback:</p>
		<CodeBlock
			code={`import { getTenantId, requireTenantId } from '@happyvertical/smrt-tenancy';

const maybe = getTenantId();      // string | null
const id = requireTenantId();     // string, or throws if no context`}
			language="typescript"
		/>
		<Callout variant="warning" title="Cross-tenant reads need an explicit bypass">
			Because <code>'required'</code> classes fail closed, system jobs that legitimately span
			tenants must opt in explicitly with <code>withSystemContext()</code> or
			<code>withSuperAdminBypass()</code>. There is no silent way to read another tenant's rows.
		</Callout>
	</section>

	<section>
		<h2>3. Enforce with Postgres RLS (optional)</h2>
		<p>
			On Postgres, <code>@happyvertical/smrt-users</code> can generate and apply row-level security policies
			directly from your permission catalog, so the database itself rejects cross-tenant access.
		</p>
		<CodeBlock
			code={`import {
  syncPermissionCatalog,
  generatePostgresPermissionSql,
  applyPostgresPermissionPolicies
} from '@happyvertical/smrt-users';

const db = { db: { type: 'postgres' as const, url: process.env.DATABASE_URL! } };

await syncPermissionCatalog(db);

// Preview the policy SQL (targets that will get policies, and skips)
const preview = generatePostgresPermissionSql(db);
console.log(preview.targets, preview.skipped);

// Apply: ALTER TABLE … ENABLE ROW LEVEL SECURITY + CREATE POLICY …
await applyPostgresPermissionPolicies(db);`}
			language="typescript"
		/>
		<p>Automatic policy generation applies only to objects that are:</p>
		<ul>
			<li>tenant-scoped with <code>mode: 'required'</code>,</li>
			<li>backed by a real Postgres table, and</li>
			<li>mapped to a single tenant field.</li>
		</ul>
		<p>
			Optional-tenancy and global tables are skipped (returned in <code>result.skipped</code>)
			rather than getting unsafe policies. The generated CRUD policies map to permission slugs:
			<code>SELECT → read</code>, <code>INSERT → create</code>, <code>UPDATE → update</code>,
			<code>DELETE → delete</code>.
		</p>
		<Callout variant="security" title="RLS reads request-scoped session variables">
			The generated policies check Postgres session settings — <code>smrt.tenant_id</code>,
			<code>smrt.permissions</code>, <code>smrt.super_admin_bypass</code>,
			<code>smrt.system_context</code> — that the SvelteKit session handler sets per request. See
			the
			<a href="/docs/guides/multi-tenant-lifecycle">multi-tenant request lifecycle guide</a> for the end-to-end
			wiring.
		</Callout>
	</section>

	<section>
		<h2>Testing tenant-scoped code</h2>
		<p>
			The tenancy package ships test helpers so isolation behaves the same under Vitest. Enable the
			interceptors in a setup file, then drive tests inside <code>withTenant()</code>.
		</p>
		<CodeBlock
			code={`import { setupTestTenancy, resetTenancy, withTenant } from '@happyvertical/smrt-tenancy';

// In your test setup file
setupTestTenancy({ enableInterceptors: true });

// In a test
afterEach(() => resetTenancy());

it('auto-populates tenantId', async () => {
  await withTenant({ tenantId: 'test-tenant' }, async () => {
    const doc = await documents.create({ title: 'Widget' });
    expect(doc.tenantId).toBe('test-tenant');
  });
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Related</h2>
		<ul>
			<li>
				<a href="/modules/smrt-tenancy">@happyvertical/smrt-tenancy</a> — decorators, context runners,
				adapters.
			</li>
			<li>
				<a href="/modules/smrt-users">@happyvertical/smrt-users</a> — sessions, permissions, and the Postgres
				RLS generators.
			</li>
			<li>
				<a href="/docs/guides/multi-tenant-lifecycle">Guide: multi-tenant request lifecycle</a> —
				one <code>hooks.server.ts</code> that ties it together.
			</li>
		</ul>
		<p class="version-note">Verified against SMRT {SMRT_VERSION_LABEL}.</p>
	</section>
</article>

<style>
	.prose {
		max-width: 100%;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: var(--smrt-color-on-surface-variant, #666);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--smrt-color-primary, #1976d2);
	}

	.version-note {
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #888);
		font-style: italic;
		margin-top: 32px;
	}
</style>
