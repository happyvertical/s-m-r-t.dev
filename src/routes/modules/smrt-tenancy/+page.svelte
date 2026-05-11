<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-tenancy"
	description="Multi-tenancy via AsyncLocalStorage context propagation. Auto-filters every SmrtCollection query by tenant, auto-populates tenantId on save, and ships adapters for SvelteKit, Express, and CLI."
	badges={['v0.24.12', 'Multi-Tenancy', 'ESM']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<code>@happyvertical/smrt-tenancy</code> provides automatic tenant isolation for SaaS
			applications built on <code>smrt-core</code>. It uses Node's <code>AsyncLocalStorage</code> to
			propagate a tenant context through async operations, and a <code>GlobalInterceptors</code>
			hook (priority 100, runs first) to inject <code>tenantId</code> into queries, auto-populate it
			on save, and validate isolation on every read/write/delete.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li>
				<strong>Automatic query filtering</strong>: <code>WHERE tenant_id = '&lt;current&gt;'</code>
				added to every <code>list()</code> / <code>get()</code>
			</li>
			<li>
				<strong>AsyncLocalStorage context</strong>: context flows through async/await without manual
				plumbing
			</li>
			<li>
				<strong>Decorator-based</strong>: <code>@TenantScoped()</code> -- or
				<code>@smrt({'{'} tenantScoped: ... {'}'})</code> -- marks a class for isolation
			</li>
			<li>
				<strong>Framework adapters</strong>: SvelteKit, Express, CLI
			</li>
			<li>
				<strong>Super-admin bypass</strong>: keep context but disable auto-filtering
			</li>
			<li>
				<strong>Raw SQL policy</strong>: <code>throw</code>/<code>warn</code>/<code>allow</code> to
				prevent accidental leaks
			</li>
			<li>
				<strong><code>directoryClasses</code> dispatch</strong>: <code>afterSave</code> and
				<code>afterDelete</code> emit <code>directory.&lt;class&gt;.created|updated|deleted</code>
				signals through the DispatchBus for configured classes
			</li>
		</ul>

		<aside>
			<p>
				<strong>Critical distinction</strong>: <code>withSystemContext()</code> sets a
				<code>SYSTEM_CONTEXT_MARKER</code> sentinel -- it is <em>not</em> the same as "no context"
				(<code>undefined</code>). The interceptor uses this marker to tell intentional bypass apart
				from missing context.
			</p>
		</aside>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`pnpm add @happyvertical/smrt-tenancy`} language="bash" />
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>

		<h3>1. Mark Classes as Tenant-Scoped</h3>
		<p>Two equivalent patterns; the tenancy package reads both:</p>
		<CodeBlock
			code={`// Pattern 1: @TenantScoped() decorator (preferred)
import { smrt, SmrtObject } from '@happyvertical/smrt-core';
import { TenantScoped, tenantId } from '@happyvertical/smrt-tenancy';

@smrt()
@TenantScoped({ mode: 'optional' })
class Document extends SmrtObject {
  @tenantId({ nullable: true })
  tenantId: string | null = null;
  title: string = '';
}

// Pattern 2: via @smrt() decorator -- tenancy reads this too
@smrt({ tenantScoped: { mode: 'optional' } })
class Document extends SmrtObject {
  tenantId: string | null = null;
  title: string = '';
}`}
			language="typescript"
		/>

		<p>
			<strong>Modes:</strong>
		</p>
		<ul>
			<li>
				<code>'required'</code> (default) -- throws <code>TenantContextError</code> when there's no
				active context
			</li>
			<li>
				<code>'optional'</code> -- passes through if no context (used by most domain models so
				system-level scripts still work)
			</li>
		</ul>

		<h3>2. Wrap Operations in Context</h3>
		<CodeBlock
			code={`import {
  withTenant,
  withSystemContext,
  withSuperAdminBypass,
  getTenantId,
} from '@happyvertical/smrt-tenancy';

// Normal request -- everything inside is auto-scoped
await withTenant({ tenantId: 'tenant-123' }, async () => {
  const docs = await documentCollection.list({});
  // Actual SQL: WHERE tenant_id = 'tenant-123'
});

// Bypass tenant checks (admin tools, migrations)
await withSystemContext(async () => {
  /* all tenant checks disabled */
});

// Keep context but disable auto-filtering (super-admin reading cross-tenant data)
await withSuperAdminBypass(async () => {
  const allLogs = await auditLogCollection.list({});
});`}
			language="typescript"
		/>

		<h3>3. Wire up a Framework Adapter</h3>
		<CodeBlock
			code={`// SvelteKit (hooks.server.ts)
import { createSvelteKitHandle } from '@happyvertical/smrt-tenancy';

export const handle = createSvelteKitHandle({
  resolveTenantId: async (event) => {
    const host = event.request.headers.get('host');
    return host?.split('.')[0]; // tenant.example.com
  },
});

// Express -- uses enterTenantContext() (middleware returns before handlers run)
import { createExpressMiddleware } from '@happyvertical/smrt-tenancy';

app.use(createExpressMiddleware({
  resolveTenantId: (req) => req.headers['x-tenant-id'] as string,
}));

// CLI -- exposes run(), runWithTenant(), runAsSystem(), runAsSuperAdmin()
import { createCliContext } from '@happyvertical/smrt-tenancy';

const cli = createCliContext({ resolveTenantId: () => argv.tenant });
await cli.runWithTenant('tenant-123', async () => { /* ... */ });`}
			language="typescript"
		/>
	</section>

	<section id="interceptor-system">
		<h2>Interceptor System</h2>
		<p>
			Tenancy hooks <code>GlobalInterceptors</code> (priority 100, runs first). The interceptor sees
			every collection / save operation:
		</p>
		<table>
			<thead>
				<tr>
					<th>Hook</th>
					<th>Behavior</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>beforeList</code></td>
					<td>
						Injects <code>tenantId</code> into the WHERE clause; validates that any explicit filter
						matches the context
					</td>
				</tr>
				<tr>
					<td><code>beforeGet</code></td>
					<td>Same -- rewrites an ID lookup to <code>{'{ id, tenantId }'}</code></td>
				</tr>
				<tr>
					<td><code>beforeSave</code></td>
					<td>
						Auto-populates <code>tenantId</code> if empty and <code>autoPopulate: true</code>;
						validates if already set
					</td>
				</tr>
				<tr>
					<td><code>beforeDelete</code></td>
					<td>Validates that <code>instance.tenantId</code> matches the current context</td>
				</tr>
				<tr>
					<td><code>beforeQuery</code></td>
					<td>
						Enforces the raw-SQL policy on tenant-scoped classes
						(<code>throw</code> / <code>warn</code> / <code>allow</code>)
					</td>
				</tr>
				<tr>
					<td><code>afterSave</code></td>
					<td>
						Emits <code>directory.&lt;class&gt;.created</code> /
						<code>directory.&lt;class&gt;.updated</code> via <code>dispatchBus</code> for any class
						in <code>directoryClasses</code>
					</td>
				</tr>
				<tr>
					<td><code>afterDelete</code></td>
					<td>
						Emits <code>directory.&lt;class&gt;.deleted</code> via <code>dispatchBus</code> for
						<code>directoryClasses</code>
					</td>
				</tr>
			</tbody>
		</table>
		<p>
			Mismatches throw <code>TenantIsolationError</code>. Missing required context throws
			<code>TenantContextError</code>.
		</p>
	</section>

	<section id="context-accessors">
		<h2>Context Accessors</h2>
		<CodeBlock
			code={`import {
  getTenantId, requireTenantId, getCurrentTenant,
  hasTenantContext, isSystemContext, isSuperAdminBypass,
} from '@happyvertical/smrt-tenancy';

const id = getTenantId();           // string | undefined
const must = requireTenantId();     // throws TenantContextError if undefined
const ctx = getCurrentTenant();     // TenantContextData | undefined
const inCtx = hasTenantContext();   // boolean
const sys = isSystemContext();      // boolean
const bypass = isSuperAdminBypass(); // boolean`}
			language="typescript"
		/>
	</section>

	<section id="raw-sql">
		<h2>Raw SQL Policy</h2>
		<p>Prevents accidental cross-tenant leaks via hand-written queries:</p>
		<CodeBlock
			code={`enableTenancy({ rawQueryPolicy: 'throw' }); // default

// This throws TenantIsolationError
await projectCollection.query({
  sql: 'SELECT * FROM projects',
  params: [],
});

// Explicit opt-out for a specific call
await projectCollection.query({
  sql: 'SELECT * FROM projects WHERE status = ?',
  params: ['active'],
  allowRawOnTenantScoped: true,
});`}
			language="typescript"
		/>
	</section>

	<section id="documented-exceptions">
		<h2>The Documented-Exception Pattern</h2>
		<p>
			Per
			<a href="https://github.com/happyvertical/smrt/blob/main/docs/content/standards.md">
				<code>docs/content/standards.md §7</code>
			</a>, tenant-aware models should apply <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code>.
			Packages that deviate must document why in their own <code>CLAUDE.md</code> under a
			<strong>"Known exceptions to monorepo standards"</strong> heading.
		</p>
		<p>The canonical example lives in <code>packages/secrets/CLAUDE.md</code>:</p>
		<ul>
			<li>
				<code>Secret</code> uses the inline <code>tenantScoped: true</code> form because
				<code>SecretService.store()</code> performs manual scoping via the
				<code>(slug, context)</code> upsert key. Switching to <code>@TenantScoped</code> without
				rethinking the upsert key would surface false-positive name collisions across tenants.
			</li>
			<li>
				<code>TenantKey</code> is deliberately not tenant-scoped at all: key-rotation tooling, AMK
				rewrap jobs, and super-admin audits must query across tenants.
			</li>
		</ul>
		<p>
			A second exception lives <em>inside this package</em>:
			<code>serializeInstance()</code> in <code>src/interceptor.ts</code> calls
			<code>instance.toJSON()</code> directly. Section 7 of <code>standards.md</code> normally forbids
			this in favor of <code>transformJSON()</code>, but the interceptor has to serialize arbitrary
			instances -- workspace stubs and plain-object test doubles whose classes may not extend
			<code>SmrtObject</code> and therefore have no <code>transformJSON()</code> hook. The call is
			duck-typed and falls back to manual key iteration when <code>toJSON</code> is absent. See the
			inline comment at the call site for the full rationale.
		</p>
	</section>

	<section id="testing">
		<h2>Testing</h2>
		<CodeBlock
			code={`import {
  setupTestTenancy, resetTenancy,
  createTestTenantContext,
  testTenantIsolation,
  assertTenantContextRequired,
} from '@happyvertical/smrt-tenancy/testing';

describe('Project isolation', () => {
  beforeEach(() => { setupTestTenancy({ enableInterceptors: true }); });
  afterEach(() => { resetTenancy(); });

  it('isolates projects by tenant', async () => {
    const projectA = await createTestTenantContext(
      { tenantId: 'tenant-a' },
      async () => projectCollection.create({ name: 'Project A' }),
    );

    await createTestTenantContext(
      { tenantId: 'tenant-b' },
      async () => {
        const found = await projectCollection.get(projectA.id);
        expect(found).toBeNull(); // isolated!
      },
    );
  });

  it('requires context for required-mode classes', async () => {
    await assertTenantContextRequired(() => projectCollection.list({}));
  });
});`}
			language="typescript"
		/>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>Context Functions</h3>
		<table>
			<thead>
				<tr>
					<th>Function</th>
					<th>Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>getTenantId()</code></td>
					<td><code>string | undefined</code></td>
					<td>Get current tenant ID</td>
				</tr>
				<tr>
					<td><code>requireTenantId()</code></td>
					<td><code>string</code></td>
					<td>Get tenant ID; throw if undefined</td>
				</tr>
				<tr>
					<td><code>getCurrentTenant()</code></td>
					<td><code>TenantContextData | undefined</code></td>
					<td>Get the full context</td>
				</tr>
				<tr>
					<td><code>hasTenantContext()</code></td>
					<td><code>boolean</code></td>
					<td>Check if in a tenant context</td>
				</tr>
				<tr>
					<td><code>isSystemContext()</code></td>
					<td><code>boolean</code></td>
					<td>Check for the SYSTEM_CONTEXT_MARKER sentinel</td>
				</tr>
				<tr>
					<td><code>isSuperAdminBypass()</code></td>
					<td><code>boolean</code></td>
					<td>Check if super-admin bypass is active</td>
				</tr>
				<tr>
					<td><code>withTenant(ctx, fn)</code></td>
					<td><code>Promise&lt;T&gt;</code></td>
					<td>Run <code>fn</code> in a tenant context</td>
				</tr>
				<tr>
					<td><code>withSuperAdminBypass(fn)</code></td>
					<td><code>Promise&lt;T&gt;</code></td>
					<td>Keep context but disable auto-filtering</td>
				</tr>
				<tr>
					<td><code>withSystemContext(fn)</code></td>
					<td><code>Promise&lt;T&gt;</code></td>
					<td>Bypass all tenant checks (admin/migrations)</td>
				</tr>
				<tr>
					<td><code>enterTenantContext(ctx)</code></td>
					<td><code>void</code></td>
					<td>Enter context without a callback (for middleware)</td>
				</tr>
			</tbody>
		</table>

		<h3>Decorator Options</h3>
		<table>
			<thead>
				<tr>
					<th>Option</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>mode</code></td>
					<td><code>'required' | 'optional'</code></td>
					<td><code>'required'</code></td>
					<td>Context requirement</td>
				</tr>
				<tr>
					<td><code>field</code></td>
					<td><code>string</code></td>
					<td><code>'tenantId'</code></td>
					<td>Tenant ID field name</td>
				</tr>
				<tr>
					<td><code>autoFilter</code></td>
					<td><code>boolean</code></td>
					<td><code>true</code></td>
					<td>Auto-add tenant to queries</td>
				</tr>
				<tr>
					<td><code>autoPopulate</code></td>
					<td><code>boolean</code></td>
					<td><code>true</code></td>
					<td>Auto-set tenant on save</td>
				</tr>
				<tr>
					<td><code>allowSuperAdminBypass</code></td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Enable bypass for this class</td>
				</tr>
			</tbody>
		</table>

		<h3>Framework Adapters</h3>
		<ul>
			<li><code>createSvelteKitHandle(options)</code> -- SvelteKit middleware</li>
			<li><code>createExpressMiddleware(options)</code> -- Express middleware</li>
			<li><code>createCliContext(options)</code> -- CLI context manager</li>
		</ul>

		<h3>Testing Utilities</h3>
		<ul>
			<li><code>setupTestTenancy(options?)</code> -- enable tenancy for tests</li>
			<li><code>resetTenancy()</code> -- clean up tenancy state between tests</li>
			<li><code>createTestTenantContext(ctx, fn)</code> -- run test code in a tenant context</li>
			<li><code>testTenantIsolation(tenantIds, fn)</code> -- verify isolation between tenants</li>
			<li><code>assertTenantContextRequired(fn)</code> -- assert operation requires context</li>
			<li><code>assertTenantIsolationViolation(fn)</code> -- assert operation violates isolation</li>
		</ul>
	</section>

	<section id="gotchas">
		<h2>Gotchas</h2>
		<ul>
			<li>
				<strong>Context lost in callbacks</strong>:
				<code>setTimeout(() =&gt; getTenantId(), 100)</code> returns
				<code>undefined</code>. Fix: <code>TenantContext.bind(fn)</code>, or capture the tenantId on the
				outside and re-enter context with <code>withTenant()</code>.
			</li>
			<li>
				<strong>Nested contexts override</strong>: an inner <code>withTenant()</code> overrides the
				outer one and restores on exit.
			</li>
			<li>
				<strong>Auto-populate only if empty</strong>: if <code>tenantId</code> is already set, the
				interceptor validates it -- it does <em>not</em> overwrite.
			</li>
			<li>
				<strong>Isolation checked at query time</strong>:
				<code>list({'{'} where: {'{ tenantId: \'other\' }'} {'}'})</code> throws immediately if the
				value doesn't match the current context.
			</li>
		</ul>
	</section>

	<section id="used-by">
		<h2>Used By</h2>
		<p>
			Effectively every <code>@happyvertical/smrt-*</code> domain package consumes
			<code>smrt-tenancy</code>:
		</p>
		<ul>
			<li>
				<a href="/modules/smrt-content">smrt-content</a>,
				<a href="/modules/smrt-commerce">smrt-commerce</a>,
				<a href="/modules/smrt-assets">smrt-assets</a>,
				<a href="/modules/smrt-events">smrt-events</a> -- standard
				<code>@TenantScoped({'{'} mode: 'optional' {'}'})</code> consumers
			</li>
			<li>
				<a href="/modules/smrt-secrets">smrt-secrets</a> -- documented exception (inline
				<code>tenantScoped: true</code> form)
			</li>
			<li>
				<a href="/modules/smrt-users">smrt-users</a> -- hierarchical tenants, super-admin bypass
			</li>
		</ul>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<ul>
			<li><a href="/modules/smrt-core">smrt-core</a> -- SmrtObject, interceptors</li>
			<li><a href="/modules/smrt-users">smrt-users</a> -- RBAC and permission integration</li>
		</ul>
	</section>
</ModulePage>

<style>
	section {
		grid-column: 1 / -1;
		min-width: 0;
		margin-bottom: 3rem;
		color: var(--smrt-color-on-background, #1a1a1a);
		max-width: 100%;
		overflow-x: hidden;
	}

	:global(pre) {
		overflow-x: auto;
		max-width: 100%;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	th {
		font-weight: 600;
		background-color: var(--smrt-color-surface-container, #f5f5f5);
	}

	code {
		background-color: var(--smrt-color-surface-container, #f5f5f5);
		padding: 0.2rem 0.4rem;
		border-radius: var(--smrt-radius-sm, 4px);
		font-size: 0.9em;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	aside {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 16px;
		border-radius: 8px;
		margin: 16px 0;
		border-left: 4px solid var(--smrt-color-primary, #1976d2);
	}

	aside p {
		margin: 0;
	}

	h2 {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	h3 {
		margin-top: 1.5rem;
		color: var(--smrt-color-on-background, #1a1a1a);
	}
</style>
