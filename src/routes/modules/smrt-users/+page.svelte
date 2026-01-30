<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-users | s-m-r-t</title>
</svelte:head>

<Grid>
	<div class="header">
		<div class="breadcrumb">
			<a href="/modules">Modules</a>
			<span class="separator">/</span>
			<span>smrt-users</span>
		</div>
		<h1>@happyvertical/smrt-users</h1>
		<p class="lead">
			Multi-tenant user management with hierarchical RBAC, group-based permissions, and flexible
			tenant policies. Built for SaaS applications requiring sophisticated access control.
		</p>
		<div class="badges">
			<span class="badge">v0.19.0</span>
			<span class="badge">Multi-tenant RBAC</span>
			<span class="badge">ESM</span>
		</div>
	</div>

	<section id="overview">
		<h2>Overview</h2>
		<p>
			The smrt-users package provides a complete multi-tenant user management system with role-based
			access control (RBAC), group-based permission inheritance, and per-user permission overrides.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li><strong>Multi-tenant architecture</strong> - Users belong to multiple tenants with different roles</li>
			<li><strong>Hierarchical RBAC</strong> - Base role → group roles → permission overrides</li>
			<li><strong>Group-based teams</strong> - Flexible team structure within tenants</li>
			<li><strong>DENY-takes-precedence</strong> - Security-first override system</li>
			<li><strong>System & tenant roles</strong> - Reusable roles across tenants or tenant-specific</li>
			<li><strong>Session management</strong> - Tenant context switching and session lifecycle</li>
			<li><strong>OIDC integration</strong> - Seamless authentication via smrt-profiles</li>
			<li><strong>Tenant policies</strong> - Flexible, personal, or required tenant modes</li>
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
			<li><strong>SQLite</strong> (development): <code>{'{ type: \'sqlite\', url: \'app.db\' }'}</code></li>
			<li><strong>PostgreSQL</strong> (production): <code>{'{ type: \'postgres\', url: \'postgresql://...\' }'}</code></li>
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
			code={`User (authenticated identity)
  ↓
Membership (user + tenant + role)
  ├─→ Tenant (organizational boundary)
  ├─→ Role (permission template)
  │    ├─→ RolePermission
  │    └─→ Permission (named capabilities)
  ├─→ MembershipOverride (per-user grant/deny)
  └─→ Group (teams within tenant)
       ├─→ GroupMember (user → group)
       └─→ GroupRole (group → role)`}
		/>

		<h3>The Four Permission Layers</h3>
		<ol>
			<li><strong>Base Role Permissions</strong> - User's membership role defines base capabilities</li>
			<li><strong>Group Role Permissions</strong> - Additional roles from group membership (union)</li>
			<li>
				<strong>Permission Overrides</strong> - Grant adds permissions, Deny removes them
			</li>
			<li><strong>Effective Permissions</strong> - Final resolved set (DENY takes precedence)</li>
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
			<li><strong>Find Membership</strong> - Get user's ACTIVE membership in tenant</li>
			<li><strong>Base Permissions</strong> - Query RolePermission for membership's role</li>
			<li><strong>Group Permissions</strong> - For each group, get all group roles and their permissions (union)</li>
			<li><strong>Apply Overrides</strong> - Add GRANT overrides, remove DENY overrides (DENY wins)</li>
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

		<h3>Tutorial 4: OIDC Integration</h3>

		<h4>Login with OIDC</h4>
		<CodeBlock
			code={`import { UserCollection, TenantService } from '@happyvertical/smrt-users';

// In your OIDC callback handler
const users = await UserCollection.create({ db });
const { user, profile, created } = await users.getOrCreateFromOidc(
  {
    sub: tokenClaims.sub,
    iss: tokenClaims.iss,
    email: tokenClaims.email,
    name: tokenClaims.name,
    picture: tokenClaims.picture
  },
  'google' // or 'kanidm', 'okta', etc.
);

console.log('User logged in:', user.email);
console.log('First login?', created);`}
		/>

		<h4>Apply Tenant Policy</h4>
		<CodeBlock
			code={`// Create tenant service with personal policy
const tenantService = await TenantService.create(db, {
  mode: 'personal',
  maxTenants: 5,
  defaultName: 'My Workspace'
});

// Ensure user has a tenant
const { tenant, membership, created: tenantCreated } =
  await tenantService.ensureTenantForUser(user.id, {
    email: user.email,
    name: profile.name
  });

if (tenantCreated) {
  console.log('Created personal workspace:', tenant.name);
}

// Create session with tenant context
const sessions = await SessionCollection.create({ db });
const session = await sessions.createSession({
  userId: user.id,
  tenantId: tenant.id,
  ttl: 7 * 24 * 60 * 60, // 7 days
  userAgent: req.headers['user-agent'],
  ipAddress: req.ip
});

// Store session ID in cookie
res.cookie('session', session.id, { httpOnly: true });`}
		/>
	</section>

	<section id="components">
		<h2>UI Components</h2>
		<p>
			smrt-users integrates with <code>@happyvertical/smrt-svelte</code> for UI components:
		</p>

		<h3>Available Components</h3>
		<ul>
			<li><strong>User Components</strong>: UserCard, UserAvatar, UserList, UserForm, UserMenu, InviteUserModal</li>
			<li><strong>Tenant Components</strong>: TenantCard, TenantSwitcher</li>
			<li><strong>Role Components</strong>: RoleBadge, RoleSelector</li>
			<li><strong>Permission Components</strong>: PermissionCheck (conditional rendering)</li>
			<li><strong>Membership Components</strong>: MembershipCard, MembershipList</li>
		</ul>

		<p>
			<a href="/components/users">View component documentation →</a>
		</p>
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
		<p><strong>Solution:</strong> DENY is always applied last in PermissionResolver (should work automatically).</p>

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
</Grid>

<style>
	.header {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.breadcrumb {
		font-size: 0.875rem;
		margin-top: 8px;
		margin-bottom: 16px;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.breadcrumb a {
		color: var(--smrt-color-primary, #1976d2);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.separator {
		margin: 0 8px;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
		font-family: var(--font-mono);
	}

	.lead {
		font-size: 1.125rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		line-height: 1.6;
	}

	.badges {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.badge {
		display: inline-block;
		padding: 4px 12px;
		background: var(--smrt-color-surface-container, #f0f0f0);
		border-radius: var(--smrt-radius-md, 8px);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--smrt-color-on-surface, #333);
	}

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
