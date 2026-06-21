<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { SMRT_VERSION_LABEL } from '$lib/version';
</script>

<svelte:head>
	<title>Stand up a multi-tenant request lifecycle | SMRT Guides</title>
	<meta
		name="description"
		content="A runnable SvelteKit guide: one hooks.server.ts that loads the session, resolves permissions, enters tenant context, and opens a Postgres RLS transaction per request."
	/>
</svelte:head>

<article class="prose">
	<nav class="breadcrumb">
		<a href="/docs">Docs</a>
		<span>/</span>
		<span>Guides</span>
		<span>/</span>
		<span>Multi-tenant request lifecycle</span>
	</nav>

	<h1>Stand up a multi-tenant request lifecycle</h1>
	<p class="lead">
		In a SaaS app every request needs the same four things resolved before your route code runs: who
		is the user, what may they do, which tenant are they in, and is the database enforcing that
		boundary. SMRT wires all four in a single <code>hooks.server.ts</code> — this guide builds it end
		to end.
	</p>

	<Callout variant="note" title="What you'll build">
		One <code>createSessionHandler()</code> hook that, per request: loads the session cookie →
		resolves permissions → enters <code>smrt-tenancy</code> context → opens a request-scoped Postgres
		transaction with the RLS session variables set. Plus login/logout routes and the one-time RLS policy
		setup.
	</Callout>

	<section>
		<h2>Prerequisites</h2>
		<ul>
			<li>
				A SvelteKit app with SMRT configured (see <a href="/docs/getting-started">Getting Started</a
				>).
			</li>
			<li>
				A Postgres database — RLS is a Postgres feature. The session and tenant layers also work on
				SQLite, but the database-enforced layer needs Postgres.
			</li>
			<li>The users and tenancy packages installed.</li>
		</ul>
		<CodeBlock
			code={`pnpm add @happyvertical/smrt-users @happyvertical/smrt-tenancy`}
			language="bash"
		/>
	</section>

	<section>
		<h2>Step 1 — Mark your models tenant-scoped</h2>
		<p>
			Each tenant-owned model needs <code>@TenantScoped()</code> and a <code>@tenantId()</code>
			column. Use <code>mode: 'required'</code> so operations fail closed without a tenant — this is also
			the mode the RLS generator supports.
		</p>
		<CodeBlock
			code={`// src/lib/models/Project.ts
import { smrt, SmrtObject } from '@happyvertical/smrt-core';
import { TenantScoped, tenantId } from '@happyvertical/smrt-tenancy';

@smrt({ api: true })
@TenantScoped({ mode: 'required' })
export class Project extends SmrtObject {
  @tenantId()
  tenantId: string = '';

  name: string = '';
  status: string = 'active';
}`}
			language="typescript"
		/>
		<p>
			See <a href="/docs/concepts/multi-tenancy">Multi-tenancy</a> for the full decorator reference.
		</p>
	</section>

	<section>
		<h2>Step 2 — The one hook</h2>
		<p>
			<code>createSessionHandler()</code> from <code>@happyvertical/smrt-users/sveltekit</code> is
			the whole lifecycle. With <code>enterTenantContext: true</code> and
			<code>postgresRls: true</code>
			it loads the session, resolves permissions, enters tenancy context, and opens a request-scoped Postgres
			transaction with the RLS session variables set — all before your route runs.
		</p>
		<CodeBlock
			code={`// src/hooks.server.ts
import { createSessionHandler } from '@happyvertical/smrt-users/sveltekit';

export const handle = createSessionHandler({
  db: { type: 'postgres', url: process.env.DATABASE_URL! },
  enterTenantContext: true, // scope collection access to the current tenant
  postgresRls: true,        // open a request transaction + set RLS session vars
  ttl: 7 * 24 * 60 * 60,    // 7 days, in seconds
  skipPaths: ['/api/health']
});`}
			language="typescript"
		/>
		<p>After the hook runs, <code>event.locals</code> is populated for every request:</p>
		<table>
			<thead><tr><th>Local</th><th>Type</th><th>Meaning</th></tr></thead>
			<tbody>
				<tr
					><td><code>user</code></td><td><code>User | null</code></td><td
						>The authenticated user, or null.</td
					></tr
				>
				<tr
					><td><code>permissions</code></td><td><code>string[]</code></td><td
						>Resolved permission slugs (<code>resource.action</code>).</td
					></tr
				>
				<tr
					><td><code>tenantId</code></td><td><code>string | null</code></td><td
						>The active tenant.</td
					></tr
				>
				<tr
					><td><code>sessionId</code></td><td><code>string | null</code></td><td
						>The server-side session id.</td
					></tr
				>
			</tbody>
		</table>
		<p>
			Tell TypeScript about that shape by extending the SvelteKit <code>Locals</code> interface:
		</p>
		<CodeBlock
			code={`// src/app.d.ts
import type { SessionLocals } from '@happyvertical/smrt-users/sveltekit';

declare global {
  namespace App {
    interface Locals extends SessionLocals {}
  }
}

export {};`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Step 3 — Use the context in routes</h2>
		<p>
			Now route code reads identity from <code>locals</code> and queries collections normally — the
			tenancy interceptor scopes them to <code>locals.tenantId</code> automatically, so you never hand-write
			a tenant filter.
		</p>
		<CodeBlock
			code={`// src/routes/projects/+page.server.ts
import { error } from '@sveltejs/kit';
import { ProjectCollection } from '$lib/models/ProjectCollection.js';

export async function load({ locals }) {
  if (!locals.user) throw error(401, 'Sign in required');
  if (!locals.permissions.includes('project.read')) throw error(403, 'Forbidden');

  const projects = await ProjectCollection.create({
    db: { type: 'postgres', url: process.env.DATABASE_URL! }
  });

  // Automatically filtered to locals.tenantId — no WHERE tenant_id needed.
  return { projects: await projects.list({ where: { status: 'active' } }) };
}`}
			language="typescript"
		/>
		<Callout variant="security" title="Check permissions explicitly">
			The hook resolves <code>permissions</code> for you, but it does not decide what each route
			requires. Guard sensitive loads and actions with an explicit
			<code>locals.permissions.includes(...)</code> check (or your own helper).
		</Callout>
	</section>

	<section>
		<h2>Step 4 — Login and logout</h2>
		<p>
			Establish the session cookie on login and clear it on logout. <code
				>createSessionCookie()</code
			>
			returns the new session id; both helpers set/clear the <code>sid</code> cookie the hook reads.
		</p>
		<CodeBlock
			code={`// src/routes/login/+page.server.ts
import { redirect } from '@sveltejs/kit';
import { createSessionCookie } from '@happyvertical/smrt-users/sveltekit';

const db = { type: 'postgres' as const, url: process.env.DATABASE_URL! };

export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    // ... verify credentials, look up the user and their tenant ...
    const userId = '...';
    const tenantId = '...';

    await createSessionCookie(event, userId, tenantId, { db });
    throw redirect(303, '/projects');
  }
};`}
			language="typescript"
		/>
		<CodeBlock
			code={`// src/routes/logout/+page.server.ts
import { redirect } from '@sveltejs/kit';
import { destroySessionCookie } from '@happyvertical/smrt-users/sveltekit';

const db = { type: 'postgres' as const, url: process.env.DATABASE_URL! };

export const actions = {
  default: async (event) => {
    await destroySessionCookie(event, { db });
    throw redirect(303, '/login');
  }
};`}
			language="typescript"
		/>
		<Callout variant="note" title="Switching tenants">
			For users who belong to more than one tenant, <code>switchSessionTenant()</code> changes the tenant
			on the current session without forcing a re-login.
		</Callout>
	</section>

	<section>
		<h2>Step 5 — Generate the RLS policies once</h2>
		<p>
			<code>postgresRls: true</code> sets the per-request session variables, but the database still needs
			the policies that read them. Generate and apply them once (in a migration or a one-off script) from
			your permission catalog.
		</p>
		<CodeBlock
			code={`// scripts/apply-rls.ts — run once after schema setup / catalog changes
import {
  syncPermissionCatalog,
  generatePostgresPermissionSql,
  applyPostgresPermissionPolicies
} from '@happyvertical/smrt-users';
import './src/lib/models/index.js'; // register @smrt() classes

const db = { db: { type: 'postgres' as const, url: process.env.DATABASE_URL! } };

await syncPermissionCatalog(db);

// Inspect first: which tables get policies, and which were skipped (and why)
const preview = generatePostgresPermissionSql(db);
console.log('targets:', preview.targets);
console.log('skipped:', preview.skipped);

await applyPostgresPermissionPolicies(db);
console.log('RLS policies applied.');`}
			language="typescript"
		/>
		<p>
			The generated policies check the session variables the hook sets each request —
			<code>smrt.tenant_id</code>, <code>smrt.user_id</code>, <code>smrt.session_id</code>,
			<code>smrt.permissions</code>, <code>smrt.super_admin_bypass</code>,
			<code>smrt.system_context</code> — and map CRUD to permission slugs (<code>SELECT → read</code
			>, <code>INSERT → create</code>, <code>UPDATE → update</code>,
			<code>DELETE → delete</code>).
		</p>
		<Callout variant="security" title="Only required-mode tables are auto-protected">
			Automatic policy generation covers objects that are tenant-scoped with
			<code>mode: 'required'</code>, backed by a real Postgres table, and mapped to a single tenant
			field. Optional-tenancy and global tables appear in <code>preview.skipped</code> instead of receiving
			unsafe policies — review that list.
		</Callout>
	</section>

	<section>
		<h2>The request, end to end</h2>
		<CodeBlock
			code={`Incoming request
   │
   ▼
hooks.server.ts  (createSessionHandler)
   ├─ read 'sid' cookie → load Session
   ├─ resolve permissions (4-level cascade)
   ├─ enterTenantContext  → smrt-tenancy scopes queries
   └─ postgresRls         → BEGIN; set smrt.tenant_id, smrt.permissions, …
   │
   ▼
+page.server.ts / +server.ts
   ├─ read locals.user / locals.permissions
   └─ collection.list()  → interceptor adds WHERE tenant_id = …
                          → RLS policy independently enforces the same boundary
   │
   ▼
Response  (transaction commits/rolls back)`}
			language="text"
		/>
	</section>

	<section>
		<h2>Related</h2>
		<ul>
			<li>
				<a href="/docs/concepts/multi-tenancy">Concept: Multi-tenancy</a> — the two isolation layers in
				depth.
			</li>
			<li>
				<a href="/modules/smrt-users">@happyvertical/smrt-users</a> — sessions, permissions, OIDC, RLS
				generators.
			</li>
			<li>
				<a href="/modules/smrt-tenancy">@happyvertical/smrt-tenancy</a> — decorators and context runners.
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
