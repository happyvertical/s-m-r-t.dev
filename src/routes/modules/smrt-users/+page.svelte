<script lang="ts">
	import ModuleTabs from '$lib/components/ModuleTabs.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModuleTabs
	name="smrt-users"
	description="Multi-tenant user management with RBAC, hierarchical tenants, session handling, and SvelteKit integration."
	badges={['v0.29.34', 'Multi-tenant RBAC', '13 Models']}
>
	{#snippet docs()}
		<section id="overview">
			<h2>Overview</h2>
			<p>
				The smrt-users package provides a complete multi-tenant user management system with
				role-based access control (RBAC), hierarchical tenants, group-based permission inheritance,
				per-user permission overrides, session handling, and SvelteKit integration. It also ships the
				server-side login flows — <strong>OIDC</strong> (OAuth2 authorization-code + PKCE), magic
				links, and <strong>terminal device-code</strong> auth — while the stored identity records
				(OIDC/Nostr/API-key) live in <a href="/modules/smrt-profiles">smrt-profiles</a>. In short:
				smrt-users handles authentication flows plus authorization and session/cookie plumbing;
				smrt-profiles stores the resolved identity.
			</p>

			<h3>Key Features</h3>
			<ul>
				<li>
					<strong>4-level permission cascade</strong> — tenant hierarchy → membership role → group roles
					→ membership overrides
				</li>
				<li>
					<strong>Hierarchical tenants</strong> — STI, materialized <code>hierarchyPath</code>, max
					depth 10
				</li>
				<li>
					<strong>Group-based teams</strong> — flexible team structure within tenants via GroupRole
				</li>
				<li>
					<strong>DENY always wins</strong> — <code>MembershipOverride.DENY</code> beats any GRANT;
					<code>TenantPermissionOverride</code> supports <code>INHERIT</code>/<code>GRANT</code
					>/<code>DENY</code> at each ancestor level
				</li>
				<li>
					<strong>System & tenant roles</strong> — system roles (owner/admin/member/viewer,
					<code>tenantId=null</code>) are available to all tenants
				</li>
				<li>
					<strong>Session management</strong> — server-side sessions with secure UUID, TTL in
					<strong>seconds</strong>, auto-expiry on access
				</li>
				<li>
					<strong>SvelteKit integration</strong> — <code>createSessionHandler</code>, cookie
					helpers, tenant context switching
				</li>
				<li>
					<strong>Tenant policies</strong> — flexible, personal, or required tenant modes via TenantService
				</li>
			</ul>
		</section>

		<section id="models">
			<h2>Models (13)</h2>
			<table>
				<thead>
					<tr><th>Model</th><th>Key Pattern</th></tr>
				</thead>
				<tbody>
					<tr
						><td>User</td><td
							>Auth identity. <code>profileId</code> is a plain string (not FK) to smrt-profiles. Email
							auto-lowercased.</td
						></tr
					>
					<tr
						><td>Tenant</td><td
							><strong>STI</strong> + hierarchical parent-child. Materialized
							<code>hierarchyPath</code>
							and <code>hierarchyLevel</code>. Max depth 10.</td
						></tr
					>
					<tr
						><td>Session</td><td
							>Server-side. Secure UUID. TTL in <strong>seconds</strong>. Status auto-updates to
							<code>EXPIRED</code> on access.</td
						></tr
					>
					<tr
						><td>MagicLinkToken</td><td
							>Single-use email login token. Backed by <code>MagicLinkService</code>.</td
						></tr
					>
					<tr
						><td>Role</td><td
							><code>tenantId = null</code> → system role (available to all tenants).
							<code>isSystem: true</code> blocks deletion.</td
						></tr
					>
					<tr
						><td>Permission</td><td
							>Slug format: <code>resource.action</code>. Parsed by PermissionResolver.</td
						></tr
					>
					<tr
						><td>Membership</td><td
							>User + Tenant + Role junction. <code>UNIQUE(userId, tenantId)</code>.</td
						></tr
					>
					<tr><td>Group</td><td>Team within a tenant. Multiple roles via GroupRole.</td></tr>
					<tr><td>GroupMember, GroupRole, RolePermission</td><td>Join tables.</td></tr>
					<tr
						><td>MembershipOverride</td><td
							>Per-user permission grant/deny. <strong>DENY always wins.</strong></td
						></tr
					>
					<tr
						><td>TenantPermissionOverride</td><td
							>Tenant-level cascade overrides. Effect: <code>INHERIT</code> / <code>GRANT</code> /
							<code>DENY</code>.</td
						></tr
					>
				</tbody>
			</table>
		</section>

		<section id="tenancy">
			<h2>Tenancy</h2>
			<p>
				<code>User</code> is intentionally <strong>not</strong> tenant-scoped — emails are globally
				unique and a single user participates in many tenants via <code>Membership</code>.
				<code>Tenant</code>, <code>Role</code>, <code>Permission</code>, and the join tables use
				<code>@TenantScoped({'{'} mode: 'optional' {'}'})</code>: a row with
				<code>tenantId = null</code> is a system-wide row (e.g. the built-in <code>owner</code>
				role), while a row with an explicit <code>tenantId</code> belongs to that tenant only.
				Sessions are scoped to a specific tenant context via <code>switchSessionTenant()</code>.
			</p>
		</section>

		<section id="installation">
			<h2>Installation</h2>
			<CodeBlock
				code={`pnpm add @happyvertical/smrt-users
# or
npm install @happyvertical/smrt-users`}
			/>

			<h3>Database Requirements</h3>
			<ul>
				<li>
					<strong>SQLite</strong> (development):
					<code>{'{'} type: 'sqlite', url: 'app.db' {'}'}</code>
				</li>
				<li>
					<strong>PostgreSQL</strong> (production):
					<code>{'{'} type: 'postgres', url: 'postgresql://...' {'}'}</code>
				</li>
			</ul>
		</section>

		<section id="quick-start">
			<h2>Quick Start (5 Minutes)</h2>

			<h3>Step 1: Initialize Collections</h3>
			<CodeBlock
				code={`import { UserCollection, TenantCollection, RoleCollection, MembershipCollection } from '@happyvertical/smrt-users';

const users = await UserCollection.create({ db: dbConfig });
const tenants = await TenantCollection.create({ db: dbConfig });
const roles = await RoleCollection.create({ db: dbConfig });
const memberships = await MembershipCollection.create({ db: dbConfig });`}
			/>

			<h3>Step 2: Seed System Roles (Required)</h3>
			<CodeBlock
				code={`// Creates: owner, admin, member, viewer (idempotent)
// Skipping this leads to "no role found" errors during PermissionResolver runs.
await roles.seedSystemRoles();`}
			/>

			<h3>Step 3: Create User & Tenant</h3>
			<CodeBlock
				code={`const user = await users.create({
  email: 'user@example.com',
  profileId: 'profile-123' // plain string FK to smrt-profiles
});
await user.save();

const tenant = await tenants.create({ name: 'My Company' });
await tenant.save();`}
			/>

			<h3>Step 4: Create Membership</h3>
			<CodeBlock
				code={`const adminRole = await roles.findBySlug('admin');
const membership = await memberships.create({
  userId: user.id,
  tenantId: tenant.id,
  roleId: adminRole.id
});
await membership.save();`}
			/>

			<h3>Step 5: Check Permissions</h3>
			<CodeBlock
				code={`import { PermissionResolver } from '@happyvertical/smrt-users';

const resolver = await PermissionResolver.create({ db: dbConfig });
const hasAccess = await resolver.hasPermission(
  user.id,
  tenant.id,
  'users.manage'
);
console.log('Can manage users:', hasAccess);`}
			/>
		</section>

		<section id="permission-resolver">
			<h2>Permission Resolution -- 4-Level Cascade</h2>
			<p>
				<code>PermissionResolver</code> evaluates these levels in order. Each level can add or
				remove permissions; <strong>DENY always wins</strong> on the membership-override level.
			</p>
			<ol>
				<li>
					<strong>Tenant hierarchy</strong> — walk ancestors, applying
					<code>TenantPermissionOverride</code> at each level (<code>INHERIT</code>/<code
						>GRANT</code
					>/<code>DENY</code>)
				</li>
				<li>
					<strong>Membership role</strong> — base permissions from the user's role in the tenant
				</li>
				<li>
					<strong>Group roles</strong> — permissions from all groups the user belongs to
					<em>in that tenant</em> (union)
				</li>
				<li>
					<strong>Membership overrides</strong> — final per-user GRANT/DENY.
					<code>MembershipOverride.DENY</code> takes absolute precedence over every earlier GRANT.
				</li>
			</ol>
			<p>
				<strong>Critical:</strong> use <code>getGroupIdsForTenant(userId, tenantId)</code> — it
				joins against the <code>groups</code> table to scope by tenant. Never use the cross-tenant
				<code>getGroupIds()</code> in resolution code.
			</p>

			<h3>PermissionResolver Methods</h3>
			<CodeBlock
				code={`const resolver = await PermissionResolver.create({ db: dbConfig });

// Full resolution with metadata
const result = await resolver.resolvePermissions(userId, tenantId);
// { permissions: Set<string>, membershipId, roleId, groupIds, deniedPermissionIds }

// Single permission check
const canManage = await resolver.hasPermission(userId, tenantId, 'users.manage');

// Multiple (AND logic)
const hasAll = await resolver.hasAllPermissions(userId, tenantId, [
  'articles.create',
  'articles.publish'
]);

// Multiple (OR logic)
const hasAny = await resolver.hasAnyPermission(userId, tenantId, [
  'articles.update',
  'articles.delete'
]);`}
			/>
		</section>

		<section id="permission-catalog">
			<h2>Permission Catalog &amp; syncPermissionCatalog</h2>
			<p>
				The <code>Permission</code> rows the resolver checks don't have to be hand-maintained.
				<code>PermissionCatalogService</code> derives a catalog of <code>resource.action</code> slugs
				from three layers and reconciles them into the database:
			</p>
			<ol>
				<li>
					<strong>Manifest</strong> — every <code>@smrt()</code> object that exposes a REST/CLI/MCP
					operation contributes slugs: <code>{'{'}collection{'}'}.read</code> (when
					list/get is exposed) plus <code>.create</code> / <code>.update</code> / <code>.delete</code>,
					and one slug per exposed public custom method. Collection classes are skipped.
				</li>
				<li>
					<strong>Config</strong> — extra slugs under
					<code>packages.users.permissions.custom</code> in <code>smrt.config.ts</code>.
				</li>
				<li>
					<strong>Runtime</strong> — slugs registered programmatically via
					<code>registerPermissionDefinitions()</code>.
				</li>
			</ol>
			<p>
				<code>syncPermissionCatalog(options)</code> (also a method on the service) merges all three,
				creates missing <code>Permission</code> rows, updates changed name/description/category, and
				returns a <code>PermissionCatalogSyncResult</code> — <code>{'{'} catalog, created, unchanged,
				updated {'}'}</code>, where the last three are arrays of slugs. It is idempotent; run it at
				deploy/boot.
			</p>
			<CodeBlock
				code={`import { syncPermissionCatalog } from '@happyvertical/smrt-users';

const result = await syncPermissionCatalog({ db: dbConfig });
console.log(result.created);   // slugs inserted this run
console.log(result.updated);   // slugs whose metadata changed
console.log(result.unchanged); // slugs already in sync
// result.catalog.permissions is the full merged, sorted slug list`}
				language="typescript"
			/>
		</section>

		<section id="postgres-rls">
			<h2>Postgres Row-Level Security (RLS)</h2>
			<p>
				On Postgres, smrt-users can push tenant isolation and permission checks down into the database
				as native Row-Level Security policies, so a query can't leak another tenant's rows even if app
				code forgets a <code>WHERE tenantId = …</code> clause. This is <strong>opt-in</strong> and
				Postgres-only.
			</p>

			<h3>1. Generate &amp; apply policies</h3>
			<p>
				<code>applyPostgresPermissionPolicies(options)</code> (or
				<code>generatePostgresPermissionSql()</code> to inspect the SQL first) installs three
				<code>STABLE</code> helper functions and per-table policies. Policies are generated
				automatically for objects with <code>@TenantScoped({'{'} mode: 'required' {'}'})</code>
				(mapping SELECT→<code>{'{'}collection{'}'}.read</code>, INSERT→<code>.create</code>,
				UPDATE→<code>.update</code>, DELETE→<code>.delete</code>), and for any explicit
				<code>postgres.bindings</code> you declare. Tables shared by multiple objects, or non-required
				tenant modes, are skipped and listed in the result's <code>skipped</code> report.
			</p>
			<CodeBlock
				code={`import { applyPostgresPermissionPolicies } from '@happyvertical/smrt-users';

// Idempotent: drops + recreates the smrt_* policies and helper functions.
const { targets, skipped, statements } = await applyPostgresPermissionPolicies({
  db: { type: 'postgres', url: process.env.DATABASE_URL },
});
// Each target lists its per-action permission slugs; ALTER TABLE ... ENABLE +
// FORCE ROW LEVEL SECURITY is emitted for every covered table.`}
				language="typescript"
			/>

			<h3>2. Enforce per request</h3>
			<p>
				Turn on <code>postgresRls</code> in the session handler. For every request it opens a
				transaction and sets Postgres session variables (<code>smrt.tenant_id</code>,
				<code>smrt.permissions</code>, <code>smrt.user_id</code>, …) from the loaded session via
				<code>set_config(..., true)</code> (transaction-local). The generated policies read those
				variables, so the database itself enforces the tenant + permission predicate. The transaction
				commits on success and rolls back on error.
			</p>
			<CodeBlock
				code={`// hooks.server.ts
import { createSessionHandler } from '@happyvertical/smrt-users/sveltekit';

export const handle = createSessionHandler({
  db: { type: 'postgres', url: process.env.DATABASE_URL },
  postgresRls: true,            // request-scoped RLS transaction
  enterTenantContext: true,     // also enter smrt-tenancy AsyncLocalStorage
});`}
				language="typescript"
			/>

			<h3>How the policy predicate works</h3>
			<p>Each policy USING/WITH CHECK clause is, in effect:</p>
			<CodeBlock
				code={`smrt_rls_bypass()
  OR (
    tenant_id::text = smrt_current_tenant_id()
    AND smrt_has_permission('articles.read')
  )`}
				language="sql"
			/>
			<ul>
				<li>
					<code>smrt_current_tenant_id()</code> reads <code>smrt.tenant_id</code>;
					<code>smrt_has_permission(slug)</code> tests membership in the JSON
					<code>smrt.permissions</code> array.
				</li>
				<li>
					<code>smrt_rls_bypass()</code> short-circuits to <code>true</code> when
					<code>smrt.system_context</code> or <code>smrt.super_admin_bypass</code> is set — used for
					system jobs and break-glass admin paths.
				</li>
				<li>
					Tables are set <code>FORCE ROW LEVEL SECURITY</code>, so even the table owner is subject to
					the policies.
				</li>
			</ul>
			<aside class="callout callout-note">
				RLS requires a Postgres adapter that supports <code>beginTransaction()</code>; the handler
				throws if it doesn't. It is complementary to — not a replacement for — the application-level
				<code>PermissionResolver</code> cascade above.
			</aside>
		</section>

		<section id="hierarchical-tenants">
			<h2>Hierarchical Tenants</h2>
			<ul>
				<li>
					<code>TenantCollection.createChild()</code> auto-calculates <code>hierarchyPath</code> and
					<code>hierarchyLevel</code>, enforcing the max depth of 10
				</li>
				<li>
					<code>moveToParent()</code> updates the tenant <strong>and all descendants'</strong> paths and
					levels
				</li>
				<li>
					<code>cascadePermissions</code> (parent pushes down) + <code>inheritPermissions</code>
					(child accepts) — both must be true for permission cascade
				</li>
				<li><code>getTree(rootId?)</code> returns a nested structure for UI rendering</li>
			</ul>
			<CodeBlock
				code={`const parent = await tenants.create({ name: 'Acme Corp' });
await parent.save();

const child = await tenants.createChild(parent.id, {
  name: 'Acme East',
  cascadePermissions: true,
  inheritPermissions: true,
});

// Materialized path -- O(1) ancestor checks
console.log(child.hierarchyPath);  // 'acme-corp.acme-east'
console.log(child.hierarchyLevel); // 1`}
			/>
		</section>

		<section id="sveltekit">
			<h2>SvelteKit Integration</h2>

			<h3>Session Hooks</h3>
			<CodeBlock
				code={`// hooks.server.ts
import { createSessionHandler } from '@happyvertical/smrt-users/sveltekit';

export const handle = createSessionHandler({
  db: { type: 'postgres', url: process.env.DATABASE_URL },
  ttl: 7 * 24 * 60 * 60, // 7 days in SECONDS (not ms)
  skipPaths: ['/api/health'],
});
// Populates event.locals: { user, permissions: string[], tenantId, sessionId }`}
			/>

			<h3>Login / Logout / Tenant Switch</h3>
			<CodeBlock
				code={`import {
  createSessionCookie,
  destroySessionCookie,
  switchSessionTenant
} from '@happyvertical/smrt-users/sveltekit';

await createSessionCookie(event, userId, tenantId, { db });
await destroySessionCookie(event, { db });
await switchSessionTenant(event, newTenantId, { db });`}
			/>
		</section>

		<section id="oidc">
			<h2>OIDC Login (OAuth2 Authorization Code + PKCE)</h2>
			<p>
				<code>OidcLoginService</code> implements standards-compliant OAuth2/OIDC authorization-code
				login with PKCE. It is provider-generic — it works against any compliant IdP (Kanidm, Dex,
				Keycloak, Authentik, Google, …) via discovery
				(<code>/.well-known/openid-configuration</code>), so the optional <code>kind</code> preset is
				just a documentation label and does not change protocol behaviour. On a successful callback it
				verifies the ID token and creates/links the SMRT User and the
				<a href="/modules/smrt-profiles">Profile</a> identity.
			</p>

			<h3>Configure providers</h3>
			<p>
				Providers live under <code>packages.users.auth.oidc</code> in your SMRT config
				(<code>defaultProvider</code> + a <code>providers</code> map), or can be passed inline to the
				handlers. Each <code>OidcProviderConfig</code> needs an <code>issuer</code> and a
				<code>clientId</code>; confidential clients add a <code>clientSecret</code>. The token-endpoint
				auth method defaults to <code>client_secret_basic</code> when a secret is present, otherwise
				<code>none</code> (public client).
			</p>
			<CodeBlock
				code={`// smrt.config.ts (excerpt)
export default {
  packages: {
    users: {
      auth: {
        oidc: {
          defaultProvider: 'kanidm',
          providers: {
            kanidm: {
              kind: 'kanidm',              // optional preset label only
              issuer: 'https://id.example.com',
              clientId: process.env.OIDC_CLIENT_ID,
              clientSecret: process.env.OIDC_CLIENT_SECRET, // omit for public clients
              scopes: ['openid', 'profile', 'email'],       // the default
              // redirectUri is derived from the request when omitted
            },
          },
        },
      },
    },
  },
};`}
				language="typescript"
			/>

			<h3>Login + callback handlers</h3>
			<p>
				Mount the two ready-made SvelteKit handlers. <code>createOidcLoginHandler</code> begins the
				flow: it generates a transaction holding <code>state</code>, <code>nonce</code>, and the PKCE
				<code>code_verifier</code>, stores it in a short-lived, HTTP-only, HMAC-signed cookie, and
				303-redirects to the provider's authorization URL (with
				<code>code_challenge_method=S256</code>). <code>createOidcCallbackHandler</code> validates
				<code>state</code>, exchanges the code with the PKCE verifier, verifies the ID token
				signature, issuer, audience, and <code>nonce</code>, then mints the session cookie.
			</p>
			<CodeBlock
				code={`// src/routes/auth/[provider]/login/+server.ts
import { createOidcLoginHandler } from '@happyvertical/smrt-users/sveltekit';

export const GET = createOidcLoginHandler({
  db: { type: 'postgres', url: process.env.DATABASE_URL! },
});

// src/routes/auth/[provider]/callback/+server.ts
import { createOidcCallbackHandler } from '@happyvertical/smrt-users/sveltekit';

export const GET = createOidcCallbackHandler({
  db: { type: 'postgres', url: process.env.DATABASE_URL! },
  successRedirect: '/dashboard',
  // failureRedirect: '/login?error=oidc' (omit to return HTTP 401)
});`}
				language="typescript"
			/>
			<p>
				Need finer control? <code>beginOidcLogin(event, options)</code> and
				<code>completeOidcLogin(event, options)</code> expose the same steps for custom routes, and
				<code>OidcLoginService.completeLogin()</code> returns the verified claims, tokens, and the
				resolved user when you want to drive everything yourself.
			</p>

			<h3>Security properties (verified against source)</h3>
			<ul>
				<li>
					<strong>PKCE S256</strong> — a 256-bit random <code>code_verifier</code> per transaction;
					the SHA-256 <code>code_challenge</code> goes on the authorization request.
				</li>
				<li>
					<strong>state</strong> — random per-transaction value compared on callback; a mismatch is
					rejected.
				</li>
				<li>
					<strong>nonce</strong> — random per-transaction value embedded in the request and checked
					against the ID token's <code>nonce</code> claim.
				</li>
				<li>
					<strong>Signed transaction cookie</strong> — the verifier/state/nonce cookie is
					HMAC-SHA-256 signed (secret defaults to <code>clientSecret</code>) and verified with a
					constant-time compare; it expires (default 10 minutes) and is deleted after the callback.
				</li>
				<li>
					<strong>Issuer + audience + azp</strong> — the ID token is verified against the discovered
					issuer and the configured <code>clientId</code>, with authorized-party (<code>azp</code>)
					validation for multi-audience tokens.
				</li>
				<li>
					<strong>Open-redirect safe</strong> — post-login <code>returnTo</code> targets are kept
					local (must start with a single <code>/</code>).
				</li>
			</ul>
		</section>

		<section id="terminal-auth">
			<h2>Terminal Device-Code Auth (CLI login)</h2>
			<p>
				<code>TerminalAuthService</code> implements an OAuth-style device-code grant for terminal /
				CLI logins, where the device that starts the flow can't host a redirect URI. It is
				framework-agnostic (sets no cookies, parses no Request objects); the SvelteKit glue lives on
				the <code>/sveltekit</code> subpath.
			</p>
			<h3>The flow</h3>
			<ol>
				<li>
					The CLI POSTs to the start handler → gets a short <strong>user code</strong> (shown to the
					human), a long secret <strong>device code</strong> (kept by the CLI), and a verification
					URL.
				</li>
				<li>
					The user opens the verification URL in a browser, signs in normally, and approves the user
					code from a page wired up with <code>mountTerminalLoginPage()</code>.
				</li>
				<li>
					The CLI polls the token handler with its device code; once approved it receives an opaque
					bearer token (a session id) usable as <code>Authorization: Bearer …</code>.
				</li>
				<li>
					<code>hooks.server.ts</code> resolves those bearer tokens via
					<code>loadBearerSessionContext()</code> alongside cookie sessions; logout revokes the token.
				</li>
			</ol>
			<CodeBlock
				code={`// src/routes/api/cli/auth/start/+server.ts
import { createTerminalAuthStartHandler } from '@happyvertical/smrt-users/sveltekit';
export const POST = createTerminalAuthStartHandler({
  db: { type: 'postgres', url: process.env.DATABASE_URL! },
  userCodePrefix: 'WG', // human-recognizable codes, e.g. WG-1A2B3C4D
});

// src/routes/api/cli/auth/token/+server.ts
import { createTerminalAuthTokenHandler } from '@happyvertical/smrt-users/sveltekit';
export const POST = createTerminalAuthTokenHandler({
  db: { type: 'postgres', url: process.env.DATABASE_URL! },
});

// src/routes/terminal-login/+page.server.ts -- the approval page
import { mountTerminalLoginPage } from '@happyvertical/smrt-users/sveltekit';
const handlers = mountTerminalLoginPage({
  db: { type: 'postgres', url: process.env.DATABASE_URL! },
  resolveUser: (event) => event.locals.user,
  resolveTenantId: (event) => event.locals.tenantId,
});
export const load = handlers.load;
export const actions = { approve: handlers.approve };`}
				language="typescript"
			/>
			<aside class="callout callout-security">
				<strong>Brute-force throttle on approval.</strong> User codes carry only 32 bits of entropy, so
				an authenticated attacker could otherwise guess pending codes and approve someone else's CLI
				session. <code>approveRequest()</code> rate-limits failed approve attempts per user (default 5
				within a 5-minute sliding window) and throws <code>TerminalAuthRateLimitError</code> (surface
				it as HTTP 429 with <code>Retry-After</code>). Device codes are stored only as a SHA-256 hash;
				pending requests expire (default 10 minutes) while approved sessions keep their own longer TTL
				(default 30 days).
			</aside>
		</section>

		<section id="best-practices">
			<h2>Best Practices</h2>

			<h3>DO</h3>
			<ul>
				<li>Use <code>resource.action</code> format for permission slugs</li>
				<li>Call <code>seedSystemRoles()</code> at app init — it's idempotent</li>
				<li>Use groups for team-based access instead of many tenant roles</li>
				<li>Apply GRANT overrides sparingly and document why</li>
				<li>Use DENY overrides for exceptions and security restrictions (DENY always wins)</li>
				<li>Always filter queries by <code>tenantId</code> for data isolation</li>
				<li>
					Set session TTL based on security requirements — remember it's <strong>seconds</strong>
				</li>
			</ul>

			<h3>DON'T</h3>
			<ul>
				<li>
					Don't use <code>getGroupIds()</code> — it's cross-tenant; use
					<code>getGroupIdsForTenant()</code>
				</li>
				<li>Don't forget to check membership status is ACTIVE</li>
				<li>Don't trust user-supplied <code>tenantId</code> without verifying membership</li>
				<li>
					Don't mix uppercase/lowercase in email comparisons (User collection auto-lowercases)
				</li>
			</ul>
		</section>

		<section id="related">
			<h2>Related Modules</h2>
			<div class="link-grid">
				<a href="/modules/smrt-profiles" class="link-card">
					<strong>smrt-profiles</strong>
					<span>OIDC/Nostr/API key identity resolution</span>
				</a>
				<a href="/modules/smrt-tenancy" class="link-card">
					<strong>smrt-tenancy</strong>
					<span>AsyncLocalStorage tenant context + auto-filter interceptors</span>
				</a>
				<a href="/modules/smrt-svelte" class="link-card">
					<strong>smrt-svelte</strong>
					<span>UI component library</span>
				</a>
			</div>
		</section>
	{/snippet}

	{#snippet components()}
		<section id="components">
			<h2>User Management Components</h2>
			<p>
				smrt-users ships its own pre-built Svelte UI components for user management from the
				<code>@happyvertical/smrt-users/svelte</code> subpath (built on the generic primitives in
				<code>@happyvertical/smrt-svelte</code>). They auto-register with the
				<code>ModuleUIRegistry</code> on import.
			</p>

			<h3>User Components</h3>
			<div class="link-grid">
				<a href="/components/users/user-card" class="link-card">
					<h3>UserCard</h3>
					<p>Display user information with avatar, name, and role</p>
				</a>
				<a href="/components/users/user-avatar" class="link-card">
					<h3>UserAvatar</h3>
					<p>User avatar with fallback initials</p>
				</a>
				<a href="/components/users/user-list" class="link-card">
					<h3>UserList</h3>
					<p>List of users with roles and actions</p>
				</a>
				<a href="/components/users/user-form" class="link-card">
					<h3>UserForm</h3>
					<p>Form for creating and editing users</p>
				</a>
				<a href="/components/users/user-menu" class="link-card">
					<h3>UserMenu</h3>
					<p>Authenticated account menu for profile, settings, and sign-out actions</p>
				</a>
				<a href="/components/users/invite-user-modal" class="link-card">
					<h3>InviteUserModal</h3>
					<p>Invitation flow for adding a tenant member with a role assignment</p>
				</a>
			</div>

			<p>
				These components auto-register with the <code>ModuleUIRegistry</code> on import. As of
				v0.29, smrt-users ships its own Svelte components from the
				<code>@happyvertical/smrt-users/svelte</code> subpath (smrt-svelte now ships only generic UI primitives).
			</p>

			<h2>Installation</h2>
			<CodeBlock
				code={`npm install @happyvertical/smrt-users

import {
  UserCard,
  UserAvatar,
  UserList,
  UserForm,
  UserMenu,
  InviteUserModal
} from '@happyvertical/smrt-users/svelte';`}
				language="bash"
			/>

			<p>
				<a href="/components/users">View detailed component docs →</a>
			</p>
		</section>
	{/snippet}
</ModuleTabs>

<style>
	section {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	section:last-child {
		border-bottom: none;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 24px;
	}

	h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	h4 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 24px;
		margin-bottom: 12px;
		font-family: var(--font-mono);
	}

	p {
		margin-bottom: 16px;
		line-height: 1.7;
		color: var(--smrt-color-on-background, #333);
	}

	ul,
	ol {
		margin-bottom: 16px;
		padding-left: 24px;
	}

	li {
		margin-bottom: 8px;
		line-height: 1.6;
	}

	code {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 2px 6px;
		border-radius: var(--smrt-radius-sm, 4px);
		font-family: var(--smrt-font-family-mono, ui-monospace, monospace);
		font-size: 0.9em;
		color: var(--smrt-color-on-surface, #333);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 24px 0;
	}

	th,
	td {
		text-align: left;
		padding: 12px;
		border-bottom: 1px solid #e0e0e0;
	}

	th {
		font-weight: 600;
		background: #f9f9f9;
	}

	.callout {
		margin: 24px 0;
		padding: 16px 20px;
		border-radius: var(--smrt-radius-md, 8px);
		border-left: 4px solid var(--smrt-color-outline, #999);
		background: var(--smrt-color-surface-container, #f5f5f5);
		line-height: 1.6;
		color: var(--smrt-color-on-surface, #333);
	}

	.callout :global(code) {
		background: var(--smrt-color-surface-container-high, rgba(0, 0, 0, 0.06));
	}

	.callout-note {
		border-left-color: var(--smrt-color-primary, #1976d2);
	}

	.callout-security {
		border-left-color: var(--smrt-color-error, #c62828);
		background: color-mix(in srgb, var(--smrt-color-error, #c62828) 8%, var(--smrt-color-surface, transparent));
	}
</style>
