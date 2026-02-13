<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-tenancy"
	description="Production-ready multi-tenancy framework with automatic tenant isolation, AsyncLocalStorage context propagation, and framework adapters."
	badges={['v0.19.0', 'Multi-Tenancy', 'ESM']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			The <code>@happyvertical/smrt-tenancy</code> package (NEW in v0.19.0) provides automatic tenant
			isolation for SaaS applications built on SMRT-core.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li>
				<strong>Automatic Query Filtering</strong>: WHERE tenantId = current added automatically
			</li>
			<li>
				<strong>AsyncLocalStorage Context</strong>: Propagates tenant through async operations
			</li>
			<li><strong>Decorator-Based</strong>: @TenantScoped marks classes for isolation</li>
			<li><strong>Framework Adapters</strong>: SvelteKit, Express, CLI support</li>
			<li><strong>Super-Admin Bypass</strong>: Controlled cross-tenant access</li>
			<li><strong>Raw SQL Policy</strong>: Prevents accidental data leaks</li>
			<li><strong>Testing Utilities</strong>: Complete test suite helpers</li>
		</ul>

		<h3>Architecture</h3>
		<div class="diagram">
			<pre>
Request Flow
├─ Framework Adapter (SvelteKit/Express)
│  └─ Resolve tenant ID from source
│     └─ enterTenantContext()
│        └─ AsyncLocalStorage.run(context)
│           └─ SMRT Operation (list/get/save)
│              └─ TenantInterceptor
│                 ├─ Check: Class tenant-scoped?
│                 ├─ Check: Context available?
│                 ├─ Auto-filter: Add tenantId
│                 ├─ Auto-populate: Set tenantId
│                 └─ Validate: Isolation rules
			</pre>
		</div>
	</section>

	<section id="installation">
		<h2>Installation</h2>

		<CodeBlock code={`npm install @happyvertical/smrt-tenancy`} language="bash" />

		<h3>Setup (3 Steps)</h3>

		<h4>1. Enable Tenancy Globally</h4>
		<CodeBlock
			code={`import { enableTenancy } from '@happyvertical/smrt-tenancy';

enableTenancy({
  rawQueryPolicy: 'throw',  // Prevent raw SQL
  onMissingContext: (className, operation) => {
    console.error('Missing context: ' + className + ' ' + operation);
  }
});`}
			language="typescript"
		/>

		<h4>2. Mark Classes as Tenant-Scoped</h4>
		<CodeBlock
			code={`import { smrt, SmrtObject } from '@happyvertical/smrt-core';
import { TenantScoped, tenantId } from '@happyvertical/smrt-tenancy';

@smrt()
@TenantScoped()
class Document extends SmrtObject {
  tenantId = tenantId();  // Framework manages this
  title: string = '';
  content: string = '';
}`}
			language="typescript"
		/>

		<h4>3. Setup Framework Middleware</h4>
		<CodeBlock
			code={`// SvelteKit (hooks.server.ts)
import { createSvelteKitHandle } from '@happyvertical/smrt-tenancy/adapters';

export const handle = createSvelteKitHandle({
  resolveTenantId: async (event) => {
    const host = event.request.headers.get('host');
    return host?.split('.')[0];  // tenant.example.com
  }
});

// Express
import { createExpressMiddleware } from '@happyvertical/smrt-tenancy/adapters';

app.use(createExpressMiddleware({
  resolveTenantId: (req) => req.headers['x-tenant-id'] as string
}));`}
			language="typescript"
		/>
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>

		<h3>1. Define Tenant-Scoped Model</h3>
		<CodeBlock
			code={`@smrt()
@TenantScoped()
class Project extends SmrtObject {
  tenantId = tenantId();
  name: string = '';
  owner: string = '';
}`}
			language="typescript"
		/>

		<h3>2. Automatic Filtering</h3>
		<CodeBlock
			code={`// In route handler (context established by middleware)
app.get('/api/projects', async (req, res) => {
  // Query automatically filtered by tenant
  const projects = await projectCollection.list({
    where: { status: 'active' }
  });
  // Actual SQL: WHERE tenantId = 'current' AND status = 'active'

  res.json(projects);
});`}
			language="typescript"
		/>

		<h3>3. Automatic Population</h3>
		<CodeBlock
			code={`// Create new project
app.post('/api/projects', async (req, res) => {
  const project = await projectCollection.create({
    name: req.body.name,
    // tenantId auto-populated from context
  });

  res.json(project);
});`}
			language="typescript"
		/>

		<h3>4. Isolation Validation</h3>
		<CodeBlock
			code={`// Delete validates tenant ownership
app.delete('/api/projects/:id', async (req, res) => {
  const project = await projectCollection.get(req.params.id);
  // Throws TenantIsolationError if wrong tenant
  await project.delete();

  res.json({ deleted: true });
});`}
			language="typescript"
		/>
	</section>

	<section id="core-concepts">
		<h2>Core Concepts</h2>

		<h3>1. Tenant Context</h3>
		<p>AsyncLocalStorage-based context flows through async operations:</p>

		<CodeBlock
			code={`import { getTenantId, requireTenantId, withTenant } from '@happyvertical/smrt-tenancy';

// Non-throwing getter
const tenantId = getTenantId();  // string | undefined

// Throwing getter (for required cases)
const tenantId = requireTenantId();  // throws if undefined

// Manual context setting
await withTenant({ tenantId: 'tenant-123' }, async () => {
  const projects = await projectCollection.list({});
});`}
			language="typescript"
		/>

		<h3>2. Isolation Modes</h3>

		<h4>Required Mode (default)</h4>
		<CodeBlock
			code={`@TenantScoped({ mode: 'required' })
class SecretData extends SmrtObject {
  tenantId = tenantId();
}

// This throws TenantContextError
await secretDataCollection.list({});  // No context!`}
			language="typescript"
		/>

		<h4>Optional Mode</h4>
		<CodeBlock
			code={`@TenantScoped({ mode: 'optional' })
class PublicConfig extends SmrtObject {
  tenantId = tenantId({ nullable: true });
}

// Both work
await configCollection.list({});  // All records
await withTenant({ tenantId: 't1' }, () =>
  configCollection.list({})
);  // Filtered`}
			language="typescript"
		/>

		<h3>3. Super-Admin Bypass</h3>
		<p>Controlled cross-tenant access for privileged operations:</p>

		<CodeBlock
			code={`@TenantScoped({ allowSuperAdminBypass: true })
class AuditLog extends SmrtObject {
  tenantId = tenantId();
}

// Admin viewing all logs
await withSuperAdminBypass(async () => {
  const allLogs = await auditLogCollection.list({});
  // No tenant filtering
});`}
			language="typescript"
		/>

		<h3>4. Raw SQL Policy</h3>
		<p>Prevents accidental data leaks via raw queries:</p>

		<CodeBlock
			code={`enableTenancy({
  rawQueryPolicy: 'throw'  // Default
});

// This throws TenantIsolationError
await projectCollection.query({
  sql: 'SELECT * FROM projects',
  params: []
});

// Explicitly allowed
await projectCollection.query({
  sql: 'SELECT * FROM projects WHERE status = ?',
  params: ['active'],
  allowRawOnTenantScoped: true  // Override
});`}
			language="typescript"
		/>
	</section>

	<section id="testing">
		<h2>Testing</h2>

		<CodeBlock
			code={`import {
  createTestTenantContext,
  setupTestTenancy,
  assertTenantContextRequired
} from '@happyvertical/smrt-tenancy/testing';

describe('Project isolation', () => {
  beforeAll(() => {
    setupTestTenancy({ enableInterceptors: true });
  });

  it('should isolate projects by tenant', async () => {
    // Create in tenant A
    const projectA = await createTestTenantContext(
      { tenantId: 'tenant-a' },
      async () => {
        return projectCollection.create({ name: 'Project A' });
      }
    );

    // Verify not visible in tenant B
    await createTestTenantContext(
      { tenantId: 'tenant-b' },
      async () => {
        const found = await projectCollection.get(projectA.id);
        expect(found).toBeNull(); // Isolated!
      }
    );
  });

  it('should require context', async () => {
    await assertTenantContextRequired(() =>
      projectCollection.list({})
    );
  });
});`}
			language="typescript"
		/>
	</section>

	<section id="integration">
		<h2>Integration with Other Modules</h2>

		<h3>smrt-users (RBAC)</h3>
		<CodeBlock
			code={`const handle = createSvelteKitHandle({
  resolveTenantId: async (event) => {
    const auth = await getAuth(event);
    return auth?.tenantId;
  },

  resolvePermissions: async (event, tenantId, userId) => {
    const perms = await getPermissions(userId, tenantId);
    return new Set(perms);
  },

  isSuperAdmin: async (event, tenantId, userId) => {
    const user = await getUser(userId);
    return user?.roles?.includes('admin') ?? false;
  }
});

// Use in business logic
import { getCurrentTenant } from '@happyvertical/smrt-tenancy';

function requirePermission(permission: string): boolean {
  const context = getCurrentTenant();
  return context?.permissions?.has(permission) ?? false;
}`}
			language="typescript"
		/>

		<h3>Message Queues</h3>
		<CodeBlock
			code={`// Capture context when queueing
export async function scheduleJob(data: unknown) {
  const tenantId = requireTenantId();

  await queue.enqueue({
    type: 'process_data',
    data,
    metadata: { tenantId }  // Capture!
  });
}

// Restore context in worker
async function processJob(job: Job) {
  await withTenant(
    { tenantId: job.metadata.tenantId },
    async () => {
      await handleJob(job);
    }
  );
}`}
			language="typescript"
		/>
	</section>

	<section id="best-practices">
		<h2>Best Practices</h2>

		<h3>1. Always Use Auto-Filtering</h3>
		<CodeBlock
			code={`// Good
@TenantScoped()
class Document extends SmrtObject {
  tenantId = tenantId();  // Auto-filters
}

// Risky
@TenantScoped({ autoFilter: false })
class Document extends SmrtObject {
  tenantId = tenantId();  // Manual filtering error-prone
}`}
			language="typescript"
		/>

		<h3>2. Block Raw SQL by Default</h3>
		<CodeBlock
			code={`enableTenancy({
  rawQueryPolicy: 'throw'  // Prevent leaks
});`}
			language="typescript"
		/>

		<h3>3. Validate at Middleware Entry</h3>
		<CodeBlock
			code={`createExpressMiddleware({
  resolveTenantId: async (req) => {
    const tenantId = req.headers['x-tenant-id'];

    // Verify tenant exists
    const tenant = await getTenant(tenantId as string);
    if (!tenant) {
      throw new Error('Invalid tenant');
    }

    return tenantId;
  }
});`}
			language="typescript"
		/>

		<h3>4. Index tenantId Field</h3>
		<CodeBlock
			code={`CREATE INDEX idx_documents_tenant_id
ON documents(tenant_id);

CREATE INDEX idx_documents_tenant_status
ON documents(tenant_id, status);`}
			language="sql"
		/>

		<h3>5. Audit Cross-Tenant Access</h3>
		<CodeBlock
			code={`enableTenancy({
  onIsolationViolation: (className, expected, actual) => {
    logger.warn('ISOLATION_VIOLATION', {
      className,
      expectedTenant: expected,
      attemptedTenant: actual,
      timestamp: new Date()
    });
  }
});`}
			language="typescript"
		/>
	</section>

	<section id="troubleshooting">
		<h2>Troubleshooting</h2>

		<h3>TenantContextError: No context available</h3>
		<p><strong>Solution:</strong> Ensure middleware is registered before routes</p>
		<CodeBlock
			code={`// Verify middleware registered
app.use(createExpressMiddleware({...}));  // BEFORE routes

// Verify in handler
console.log(getTenantId());  // Should not be undefined`}
			language="typescript"
		/>

		<h3>TenantIsolationError: Cross-tenant access</h3>
		<p><strong>Solution:</strong> Enable bypass if needed for admins</p>
		<CodeBlock
			code={`@TenantScoped({ allowSuperAdminBypass: true })
class AuditLog extends SmrtObject {
  tenantId = tenantId();
}

// Verify bypass is active
isSuperAdmin: async (event) => {
  return user?.isAdmin ?? false;
}`}
			language="typescript"
		/>

		<h3>Raw SQL query failed</h3>
		<p><strong>Solution:</strong> Use list()/get() or explicit bypass</p>
		<CodeBlock
			code={`// Instead of raw SQL
await collection.query({ sql: 'SELECT...' });

// Use collection methods
await collection.list({ where: {...} });

// Or explicit bypass
await collection.query({
  sql: 'SELECT...',
  allowRawOnTenantScoped: true
});`}
			language="typescript"
		/>

		<h3>Context lost in background jobs</h3>
		<p><strong>Solution:</strong> Capture tenantId in job metadata</p>
		<CodeBlock
			code={`// When queueing
const job = {
  type: 'process',
  metadata: {
    tenantId: requireTenantId()  // Capture!
  }
};

// When processing
await withTenant(
  { tenantId: job.metadata.tenantId },
  async () => {
    // Context restored
  }
);`}
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
					<td>Get tenant ID, throw if undefined</td>
				</tr>
				<tr>
					<td><code>getCurrentTenant()</code></td>
					<td><code>TenantContextData | undefined</code></td>
					<td>Get full context</td>
				</tr>
				<tr>
					<td><code>withTenant(ctx, fn)</code></td>
					<td><code>Promise&lt;T&gt;</code></td>
					<td>Run fn in tenant context</td>
				</tr>
				<tr>
					<td><code>withSuperAdminBypass(fn)</code></td>
					<td><code>Promise&lt;T&gt;</code></td>
					<td>Run fn with bypass enabled</td>
				</tr>
				<tr>
					<td><code>withSystemContext(fn)</code></td>
					<td><code>Promise&lt;T&gt;</code></td>
					<td>Run fn without tenant context</td>
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
			<li><code>createSvelteKitHandle(options)</code> - SvelteKit middleware</li>
			<li><code>createExpressMiddleware(options)</code> - Express middleware</li>
			<li><code>createCliContext(options)</code> - CLI context manager</li>
		</ul>

		<h3>Testing Utilities</h3>
		<ul>
			<li><code>setupTestTenancy(options?)</code> - Enable tenancy for tests</li>
			<li><code>createTestTenantContext(ctx, fn)</code> - Run fn in test context</li>
			<li><code>assertTenantContextRequired(fn)</code> - Assert error thrown</li>
			<li><code>resetTenancy()</code> - Clear tenancy state</li>
		</ul>
	</section>

	<section id="ui-components">
		<h2>UI Components</h2>
		<p>
			The <code>smrt-tenancy</code> module provides the backend framework for multi-tenancy.
			While it doesn't have dedicated UI components, tenant-related UI components are
			available through the <a href="/modules/smrt-users">smrt-users</a> module and
			<a href="/modules/smrt-svelte">smrt-svelte</a> integration.
		</p>

		<h3>Available Components</h3>
		<div class="link-grid">
			<a href="/components/tenants/tenant-card" class="link-card">
				<strong>TenantCard</strong>
				<span>Tenant info card</span>
			</a>
			<a href="/components/tenants/tenant-switcher" class="link-card">
				<strong>TenantSwitcher</strong>
				<span>Tenant switcher dropdown</span>
			</a>
		</div>

		<h3>Usage Example</h3>
		<CodeBlock
			code={`import { TenantCard, TenantSwitcher } from '@happyvertical/smrt-users/components';

<!-- Display tenant information -->
<TenantCard tenant={currentTenant} />

<!-- Switch between tenants -->
<TenantSwitcher
	tenants={availableTenants}
	currentTenant={currentTenant}
	on:switch={(e) => switchTenant(e.detail.tenantId)}
/>`}
			language="svelte"
		/>

		<p>
			<a href="/components/tenants">View tenant components →</a>
		</p>

		<p class="note">
			<strong>Note:</strong> These components are part of the smrt-users integration and require
			the smrt-users module to be installed and configured.
		</p>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<ul>
			<li><a href="/modules/smrt-core">smrt-core</a> - SmrtObject, interceptors</li>
			<li><a href="/modules/smrt-users">smrt-users</a> - RBAC integration</li>
		</ul>
	</section>
</ModulePage>

<style>
	/* All direct children span full grid width */
	section {
		grid-column: 1 / -1;
		min-width: 0;
	}

	section {
		margin-bottom: 3rem;
		color: var(--smrt-color-on-background, #1a1a1a);
		max-width: 100%;
		overflow-x: hidden;
	}

	/* Prevent horizontal page scroll - contain overflow in sections */
	section {
		min-width: 0;
	}

	/* Ensure code blocks can scroll horizontally */
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

	.diagram {
		background-color: var(--smrt-color-surface-container, #f5f5f5);
		padding: 1rem;
		border-radius: var(--smrt-radius-md, 8px);
		overflow-x: auto;
		margin: 1rem 0;
		max-width: 100%;
	}

	.diagram pre {
		white-space: pre-wrap;
		word-wrap: break-word;
	}

	.diagram pre {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
		color: var(--smrt-color-on-surface, #1a1a1a);
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

	h4 {
		margin-top: 1rem;
		font-size: 1rem;
		color: var(--smrt-color-on-background, #1a1a1a);
	}
</style>
