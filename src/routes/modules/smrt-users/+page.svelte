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
				per-user permission overrides, session handling, and SvelteKit integration. Authentication
				identity (OIDC, Nostr, API keys, magic links) lives in
				<a href="/modules/smrt-profiles">smrt-profiles</a>; smrt-users handles authorization and
				session/cookie plumbing.
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
</style>
