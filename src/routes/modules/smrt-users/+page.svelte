<script lang="ts">
	import ModuleTabs from '$lib/components/ModuleTabs.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModuleTabs
	name="smrt-users"
	description="Multi-tenant user management with RBAC, hierarchical tenants, session handling, and SvelteKit integration."
	badges={['v0.20.44', 'Multi-tenant RBAC', '12 Models']}
>
	{#snippet docs()}
		<section id="overview">
			<h2>Overview</h2>
			<p>
				The smrt-users package provides a complete multi-tenant user management system with role-based
				access control (RBAC), hierarchical tenants, group-based permission inheritance, per-user
				permission overrides, session handling, and SvelteKit integration.
			</p>

			<h3>Key Features</h3>
			<ul>
				<li>
					<strong>4-level permission cascade</strong> - Tenant hierarchy, membership role, group roles, membership overrides
				</li>
				<li><strong>Hierarchical tenants</strong> - Parent-child trees (max depth 10) with cascading permissions</li>
				<li><strong>Group-based teams</strong> - Flexible team structure within tenants via GroupRole</li>
				<li><strong>DENY-takes-precedence</strong> - Security-first override system at both membership and tenant levels</li>
				<li>
					<strong>System & tenant roles</strong> - System roles (owner/admin/member/viewer) available to all tenants, plus tenant-specific custom roles
				</li>
				<li><strong>Session management</strong> - Server-side sessions with secure UUID, TTL in seconds, automatic expiry</li>
				<li><strong>SvelteKit integration</strong> - Session hooks, cookie management, tenant context switching</li>
				<li><strong>Tenant policies</strong> - Flexible, personal, or required tenant modes via TenantService</li>
			</ul>
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
					<strong>SQLite</strong> (development): <code>{"{ type: 'sqlite', url: 'app.db' }"}</code>
				</li>
				<li>
					<strong>PostgreSQL</strong> (production):
					<code>{"{ type: 'postgres', url: 'postgresql://...' }"}</code>
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

			<h3>Step 2: Seed System Roles</h3>
			<CodeBlock
				code={`// Creates: owner, admin, member, viewer (idempotent)
await roles.seedSystemRoles();`}
			/>

			<h3>Step 3: Create User & Tenant</h3>
			<CodeBlock
				code={`const user = await users.create({
  email: 'user@example.com',
  profileId: 'profile-123'
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

		<section id="architecture">
			<h2>Architecture</h2>

			<h3>Multi-Tenancy Model</h3>
			<CodeBlock
				code={`User (authenticated identity, email auto-lowercased)
  ↓
Membership (user + tenant + role, UNIQUE userId+tenantId)
  ├─→ Tenant (organizational boundary, STI, hierarchical)
  │    └─→ TenantPermissionOverride (INHERIT/GRANT/DENY)
  ├─→ Role (permission template, tenantId=null → system role)
  │    ├─→ RolePermission
  │    └─→ Permission (slug: resource.action)
  ├─→ MembershipOverride (per-user grant/deny, DENY wins)
  └─→ Group (teams within tenant)
       ├─→ GroupMember (user → group)
       └─→ GroupRole (group → role)`}
			/>

			<h3>The Four Permission Layers (Cascade Order)</h3>
			<ol>
				<li>
					<strong>Tenant hierarchy</strong> - Walk ancestors, apply TenantPermissionOverride at each level
				</li>
				<li>
					<strong>Membership role</strong> - Base permissions from user's role in the tenant
				</li>
				<li>
					<strong>Group roles</strong> - Permissions from all groups user belongs to in that tenant
				</li>
				<li><strong>Membership overrides</strong> - Per-user GRANT/DENY (DENY always wins)</li>
			</ol>

			<h3>System vs Tenant Roles</h3>
			<table>
				<thead>
					<tr>
						<th>Type</th>
						<th>Scope</th>
						<th>Protected</th>
						<th>Use Case</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>System</td>
						<td>All tenants</td>
						<td>Yes</td>
						<td>Owner, Admin, Member, Viewer</td>
					</tr>
					<tr>
						<td>Tenant</td>
						<td>Single tenant</td>
						<td>No</td>
						<td>Custom roles (Editor, Moderator, etc.)</td>
					</tr>
				</tbody>
			</table>

			<h3>Tenant Policies</h3>
			<table>
				<thead>
					<tr>
						<th>Mode</th>
						<th>Auto-create</th>
						<th>Min Tenants</th>
						<th>Use Case</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><strong>flexible</strong></td>
						<td>No</td>
						<td>0</td>
						<td>Multi-org SaaS</td>
					</tr>
					<tr>
						<td><strong>personal</strong></td>
						<td>Yes</td>
						<td>0</td>
						<td>Personal workspace apps</td>
					</tr>
					<tr>
						<td><strong>required</strong></td>
						<td>Yes</td>
						<td>1</td>
						<td>Single tenant per user</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section id="permission-resolver">
			<h2>Permission Resolution</h2>

			<h3>Resolution Algorithm</h3>
			<ol>
				<li><strong>Tenant hierarchy</strong> - Walk tenant ancestors, apply TenantPermissionOverride (INHERIT/GRANT/DENY) at each level</li>
				<li><strong>Membership role</strong> - Query RolePermission for user's membership role in the tenant</li>
				<li>
					<strong>Group roles</strong> - For each group the user belongs to in that tenant, get all group roles and their permissions (union)
				</li>
				<li>
					<strong>Membership overrides</strong> - Apply per-user GRANT/DENY overrides (DENY takes absolute precedence)
				</li>
			</ol>

			<h3>PermissionResolver Methods</h3>
			<CodeBlock
				code={`const resolver = await PermissionResolver.create({ db: dbConfig });

// Full resolution with metadata
const result = await resolver.resolvePermissions(userId, tenantId);
// Returns: { permissions: Set<string>, membershipId, roleId, groupIds, deniedPermissionIds }

// Single permission check
const canManage = await resolver.hasPermission(userId, tenantId, 'users.manage');

// Check multiple (AND logic)
const hasAll = await resolver.hasAllPermissions(userId, tenantId, [
  'articles.create',
  'articles.publish'
]);

// Check multiple (OR logic)
const hasAny = await resolver.hasAnyPermission(userId, tenantId, [
  'articles.update',
  'articles.delete'
]);`}
			/>
		</section>

		<section id="tutorials">
			<h2>Tutorials</h2>

			<h3>Tutorial 1: Multi-Tenant Setup from Scratch</h3>

			<h4>Initialize System</h4>
			<CodeBlock
				code={`import {
  UserCollection,
  TenantCollection,
  RoleCollection,
  MembershipCollection,
  PermissionCollection
} from '@happyvertical/smrt-users';

// Initialize all collections
const db = { type: 'sqlite', url: 'app.db' };
const users = await UserCollection.create({ db });
const tenants = await TenantCollection.create({ db });
const roles = await RoleCollection.create({ db });
const memberships = await MembershipCollection.create({ db });
const permissions = await PermissionCollection.create({ db });

// Seed system roles (idempotent)
await roles.seedSystemRoles();`}
			/>

			<h4>Create Tenant Owner</h4>
			<CodeBlock
				code={`// Create user
const owner = await users.create({
  email: 'owner@company.com',
  profileId: 'profile-owner-123'
});
await owner.save();

// Create tenant
const company = await tenants.create({
  name: 'Acme Corporation',
  description: 'Our main tenant'
});
await company.save();

// Make user the owner
const ownerRole = await roles.findBySlug('owner');
const ownerMembership = await memberships.create({
  userId: owner.id,
  tenantId: company.id,
  roleId: ownerRole.id
});
await ownerMembership.save();`}
			/>

			<h4>Invite Team Members</h4>
			<CodeBlock
				code={`// Create team member
const member = await users.create({
  email: 'member@company.com',
  profileId: 'profile-member-456'
});
await member.save();

// Assign member role
const memberRole = await roles.findBySlug('member');
const memberMembership = await memberships.create({
  userId: member.id,
  tenantId: company.id,
  roleId: memberRole.id,
  status: 'PENDING' // Awaiting acceptance
});
await memberMembership.save();

// Later: accept invitation
memberMembership.status = 'ACTIVE';
await memberMembership.save();`}
			/>

			<h3>Tutorial 2: Group-Based Team Access</h3>

			<h4>Create Teams (Groups)</h4>
			<CodeBlock
				code={`import { GroupCollection, GroupMemberCollection, GroupRoleCollection } from '@happyvertical/smrt-users';

const groups = await GroupCollection.create({ db });
const groupMembers = await GroupMemberCollection.create({ db });
const groupRoles = await GroupRoleCollection.create({ db });

// Create editorial team
const editorial = await groups.create({
  tenantId: company.id,
  name: 'Editorial Team',
  description: 'Content creators and editors'
});
await editorial.save();

// Create engineering team
const engineering = await groups.create({
  tenantId: company.id,
  name: 'Engineering Team',
  description: 'Developers and technical staff'
});
await engineering.save();`}
			/>

			<h4>Assign Roles to Groups</h4>
			<CodeBlock
				code={`// Create custom editor role
const editorRole = await roles.create({
  tenantId: company.id,
  name: 'Content Editor',
  description: 'Can create and edit content'
});
await editorRole.save();

// Add permissions to editor role
const createArticle = await permissions.findOrCreate('articles.create', {
  name: 'Create Articles',
  category: 'articles'
});
const editArticle = await permissions.findOrCreate('articles.update', {
  name: 'Edit Articles',
  category: 'articles'
});

await rolePermissions.addPermission(editorRole.id, createArticle.id);
await rolePermissions.addPermission(editorRole.id, editArticle.id);

// Assign role to editorial group
await groupRoles.addRole(editorial.id, editorRole.id);`}
			/>

			<h4>Add Users to Groups</h4>
			<CodeBlock
				code={`// Add users to editorial team
await groupMembers.addMember(editorial.id, user1.id);
await groupMembers.addMember(editorial.id, user2.id);
await groupMembers.addMember(editorial.id, user3.id);

// Users now have editor permissions through group membership
// No need to update individual memberships`}
			/>

			<h3>Tutorial 3: Permission Overrides</h3>

			<h4>Grant Extra Permission</h4>
			<CodeBlock
				code={`import { MembershipOverrideCollection } from '@happyvertical/smrt-users';

const overrides = await MembershipOverrideCollection.create({ db });

// User is a viewer but needs to publish articles
const publishPerm = await permissions.findOrCreate('articles.publish', {
  name: 'Publish Articles',
  category: 'articles'
});

await overrides.grantPermission(membership.id, publishPerm.id);

// Verify permission granted
const resolver = await PermissionResolver.create({ db });
const canPublish = await resolver.hasPermission(
  user.id,
  tenant.id,
  'articles.publish'
);
// true`}
			/>

			<h4>Deny Dangerous Permission</h4>
			<CodeBlock
				code={`// User is an admin but shouldn't delete users
const deleteUserPerm = await permissions.findOrCreate('users.delete', {
  name: 'Delete Users',
  category: 'users'
});

await overrides.denyPermission(membership.id, deleteUserPerm.id);

// Permission resolution now excludes this permission
const canDelete = await resolver.hasPermission(
  user.id,
  tenant.id,
  'users.delete'
);
// false (DENY takes precedence)`}
			/>

			<h3>Tutorial 4: SvelteKit Integration</h3>

			<h4>Session Hooks</h4>
			<CodeBlock
				code={`// hooks.server.ts
import { createSessionHandler } from '@happyvertical/smrt-users/sveltekit';

export const handle = createSessionHandler({
  db: { type: 'postgres', url: process.env.DATABASE_URL },
  ttl: 7 * 24 * 60 * 60, // 7 days in seconds
  skipPaths: ['/api/health'],
});
// Populates event.locals: { user, permissions, tenantId, sessionId }`}
			/>

			<h4>Login / Logout</h4>
			<CodeBlock
				code={`// +page.server.ts
import {
  createSessionCookie,
  destroySessionCookie,
  switchSessionTenant
} from '@happyvertical/smrt-users/sveltekit';

// Login
await createSessionCookie(event, userId, tenantId, { db });

// Logout
await destroySessionCookie(event, { db });

// Switch tenant context
await switchSessionTenant(event, newTenantId, { db });`}
			/>

			<h4>Tenant Policy</h4>
			<CodeBlock
				code={`import { TenantService } from '@happyvertical/smrt-users';

// TenantService supports three modes:
// - flexible: no auto-create (multi-org SaaS)
// - personal: auto-create on first login, deletable
// - required: auto-create, must keep at least one

const tenantService = await TenantService.create(db, {
  mode: 'personal',
  maxTenants: 5,
  defaultName: 'My Workspace'
});

// Ensure user has a tenant
const { tenant, membership, created } =
  await tenantService.ensureTenantForUser(user.id, {
    email: user.email,
    name: profile.name
  });`}
			/>
		</section>

		<section id="best-practices">
			<h2>Best Practices</h2>

			<h3>✅ DO</h3>
			<ul>
				<li>Use <code>resource.action</code> format for permission slugs</li>
				<li>Create minimal system roles, extend with tenant roles as needed</li>
				<li>Use groups for team-based access instead of many tenant roles</li>
				<li>Apply GRANT overrides sparingly, document why granted</li>
				<li>Use DENY overrides for exceptions and security restrictions</li>
				<li>Always filter queries by tenantId for data isolation</li>
				<li>Normalize emails to lowercase automatically</li>
				<li>Set appropriate session TTL based on security requirements</li>
			</ul>

			<h3>❌ DON'T</h3>
			<ul>
				<li>Don't create too many tenant-specific roles (use groups instead)</li>
				<li>Don't forget to check membership status is ACTIVE</li>
				<li>Don't rely on user input for tenantId (verify membership)</li>
				<li>Don't expose permission IDs to client-side code</li>
				<li>Don't mix uppercase/lowercase in email comparisons</li>
				<li>Don't allow cross-tenant data access without verification</li>
			</ul>
		</section>

		<section id="troubleshooting">
			<h2>Troubleshooting</h2>

			<h3>Permission denied for allowed user</h3>
			<p><strong>Cause:</strong> Membership status is not ACTIVE.</p>
			<p><strong>Solution:</strong> Check membership status and update if needed.</p>

			<h3>User can't see tenant</h3>
			<p><strong>Cause:</strong> No membership exists.</p>
			<p><strong>Solution:</strong> Create membership with appropriate role.</p>

			<h3>Group permissions not working</h3>
			<p><strong>Cause:</strong> User not in group.</p>
			<p><strong>Solution:</strong> Verify GroupMember relationship exists.</p>

			<h3>DENY override not working</h3>
			<p><strong>Cause:</strong> GRANT applied after DENY in code logic.</p>
			<p>
				<strong>Solution:</strong> DENY is always applied last in PermissionResolver (should work automatically).
			</p>

			<h3>Debug Permission Resolution</h3>
			<CodeBlock
				code={`// Get full resolution details
const result = await resolver.resolvePermissions(userId, tenantId);

console.log('Membership:', result.membershipId);
console.log('Base role:', result.roleId);
console.log('Groups:', result.groupIds);
console.log('Permissions:', Array.from(result.permissions));
console.log('Denied:', result.deniedPermissionIds);`}
			/>
		</section>

		<section id="related">
			<h2>Related Modules</h2>
			<div class="link-grid">
				<a href="/modules/smrt-profiles" class="link-card">
					<strong>smrt-profiles</strong>
					<span>OIDC authentication integration</span>
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
				smrt-users integrates with <code>@happyvertical/smrt-svelte</code> to provide a complete set of
				pre-built UI components for user management, tenant switching, role display, and permission-based
				conditional rendering.
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
			</div>

			<h3>Tenant Components</h3>
			<div class="link-grid">
				<a href="/components/tenants/tenant-card" class="link-card">
					<h3>TenantCard</h3>
					<p>Tenant information card</p>
				</a>
				<a href="/components/tenants/tenant-switcher" class="link-card">
					<h3>TenantSwitcher</h3>
					<p>Dropdown for switching between tenants</p>
				</a>
			</div>

			<h2>Installation</h2>
			<CodeBlock
				code={`npm install @happyvertical/smrt-users

import {
  UserCard,
  UserAvatar,
  UserList,
  TenantSwitcher
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
