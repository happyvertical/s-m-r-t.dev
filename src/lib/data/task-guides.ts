import type { GuideDifficulty, TaskGuide, TaskGuideFamilyId } from '$lib/data/guides';

/**
 * Released s-m-r-t version every step in this section was executed against.
 *
 * Deliberately a literal, and deliberately not `SMRT_VERSION`. These pages
 * claim their commands were run and their output observed, so the badge has to
 * mean "a person checked this release" rather than "this is whatever is
 * installed today". A framework bump therefore leaves this behind on purpose:
 * the disagreement between the pin and the rendered version is the signal to
 * re-run the guides and move it.
 */
export const TASK_GUIDES_PINNED_VERSION = '0.42.4';

/** Canonical upstream tree for the release above. */
const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${TASK_GUIDES_PINNED_VERSION}`;

export interface TaskGuideFamily {
	id: TaskGuideFamilyId;
	label: string;
	description: string;
}

export const taskGuideFamilies: TaskGuideFamily[] = [
	{
		id: 'getting-started',
		label: 'Getting started',
		description: 'Choose a starter and run your first s-m-r-t application.'
	},
	{
		id: 'build-foundation',
		label: 'Build the foundation',
		description: 'Set up the data, identity, and access boundaries for an application.'
	},
	{
		id: 'add-interfaces',
		label: 'Add interfaces',
		description: 'Publish selected model operations through generated application interfaces.'
	},
	{
		id: 'add-modules',
		label: 'Add application modules',
		description: 'Connect prebuilt application parts to the shared application model.'
	},
	{
		id: 'connect-agents',
		label: 'Connect agents',
		description: 'Give agents a narrow application surface with explicit authority.'
	},
	{
		id: 'operate-and-ship',
		label: 'Operate and ship',
		description: 'Validate, deploy, and maintain a completed application.'
	}
];

export const guideDifficulties: GuideDifficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export type GuideMigrationDecision = 'keep' | 'move' | 'merge' | 'split' | 'retire';

export interface GuideMigrationRecord {
	source: string;
	decision: GuideMigrationDecision;
	family: TaskGuideFamilyId;
}

/** Content decisions for the guide sources that this issue reorganizes. */
export const guideMigrationDecisions: GuideMigrationRecord[] = [
	{
		source: '/guides/multi-tenant-lifecycle',
		decision: 'keep',
		family: 'build-foundation'
	},
	{
		source: '/guides/expose-your-app-over-mcp',
		decision: 'keep',
		family: 'connect-agents'
	},
	{
		source: '/guides/semantic-search',
		decision: 'keep',
		family: 'add-modules'
	},
	{
		source: '/guides/testing-your-app',
		decision: 'keep',
		family: 'operate-and-ship'
	},
	{ source: '/starters', decision: 'merge', family: 'getting-started' },
	{
		source: '/starters/ground-up',
		decision: 'move',
		family: 'getting-started'
	},
	{
		source: '/starters/saas',
		decision: 'move',
		family: 'getting-started'
	},
	{
		source: '/foundations/interfaces',
		decision: 'split',
		family: 'add-interfaces'
	},
	{
		source: '/capabilities/agent-legible-applications',
		decision: 'split',
		family: 'connect-agents'
	}
];

export function getTaskGuideFamily(id: TaskGuideFamilyId): TaskGuideFamily {
	const family = taskGuideFamilies.find((candidate) => candidate.id === id);
	if (!family) throw new Error(`Task guide family not found: ${id}`);
	return family;
}

export function taskGuideSearchTerms(guide: TaskGuide): string[] {
	const family = getTaskGuideFamily(guide.task.family);
	return [
		family.label,
		family.description,
		guide.task.purpose,
		guide.task.difficulty,
		guide.task.supportRange,
		...guide.task.prerequisites,
		...guide.task.concepts,
		...guide.packages,
		...guide.task.relatedUi.map((link) => link.label),
		...guide.task.relatedModules.map((link) => link.label),
		...guide.task.relatedReference.map((link) => link.label),
		guide.task.expectedResult
	];
}

/**
 * Task guides are the runnable, end-to-end pages: each one walks a single job
 * from an empty file to a verified result. They deliberately cross section
 * boundaries — a task usually touches foundations, a capability, and tooling —
 * and they link to the reference pages instead of restating them.
 */
const guideMigrationDrafts: TaskGuide[] = [
	{
		slug: 'start-with-basic-sveltekit',
		navTitle: 'Start with basic SvelteKit',
		eyebrow: 'Getting started',
		title: 'Start a basic s-m-r-t SvelteKit application',
		lede: 'Copy the basic template. Run the application. Review the first model and its generated interfaces.',
		plainEnglish:
			'Use this path when you want a small application that keeps each framework layer visible.',
		packages: ['smrt-template-sveltekit', 'smrt-core', 'smrt-svelte', 'smrt-ui'],
		task: {
			family: 'getting-started',
			purpose: 'Create a small SvelteKit application from the basic template.',
			prerequisites: ['Node 24.18 or newer', 'pnpm', 'A terminal'],
			difficulty: 'Beginner',
			supportRange: TASK_GUIDES_PINNED_VERSION,
			concepts: ['Application model', 'Tenant scope', 'Generated interfaces', 'Application shell'],
			relatedUi: [{ label: 'UI overview', href: '/ui' }],
			relatedModules: [{ label: 'Application modules', href: '/modules' }],
			relatedReference: [
				{ label: 'Decorator reference', href: '/reference/decorators' },
				{ label: 'Generated interfaces reference', href: '/reference/interfaces' }
			],
			expectedResult: 'The development server shows a working application with one example object.'
		},
		pinnedVersion: TASK_GUIDES_PINNED_VERSION,
		visual: 'app-model',
		sections: [
			{
				title: 'Create the application',
				intro: 'Run these commands in a directory that can contain the new project.',
				filename: 'terminal',
				lang: 'bash',
				code: `pnpm add -D @happyvertical/smrt-template-sveltekit
node --input-type=module -e "import { copyTemplate } from '@happyvertical/smrt-template-sveltekit'; copyTemplate('./my-app', { name: 'my-app' })"
cd my-app
pnpm install
cp .env.example .env
pnpm db:migrate
pnpm dev`
			},
			{
				title: 'Review the first model',
				intro:
					'Open the Item model. Its declaration supplies stored fields, tenant scope, and generated interfaces.',
				filename: 'src/lib/objects/Item.ts',
				code: `@smrt({
  api: { include: ['list', 'get', 'create', 'update', 'delete'] },
  mcp: { include: ['list', 'get', 'create', 'update', 'delete'] },
  cli: { include: ['list', 'get', 'create', 'update', 'delete'] }
})
@TenantScoped({ mode: 'optional' })
export class Item extends SmrtObject {
  @tenantId({ nullable: true })
  tenantId: string | null = null;
  title = '';
  status = 'draft';
}`
			},
			{
				title: 'Validate the template',
				intro:
					'Stop the development server. Run the project checks before you change the example model.',
				filename: 'terminal',
				lang: 'bash',
				code: `pnpm test
pnpm run check
pnpm run build`
			}
		],
		related: [
			{ label: 'Build a tenant foundation', href: '/guides/multi-tenant-lifecycle' },
			{
				label: 'Basic template source',
				href: `${SMRT_TREE}/packages/template-sveltekit`,
				external: true
			}
		]
	},
	{
		slug: 'start-with-saas-starter',
		navTitle: 'Start with the SaaS starter',
		eyebrow: 'Getting started',
		title: 'Start with the s-m-r-t SaaS application',
		lede: 'Run the reference application. Find each application area. Replace the example model while you keep the framework foundations.',
		plainEnglish:
			'Use this path when your application needs accounts, tenants, subscriptions, jobs, mobile clients, and deployment.',
		packages: ['smrt-core', 'smrt-svelte', 'smrt-users', 'smrt-tenancy'],
		task: {
			family: 'getting-started',
			purpose: 'Run the SaaS starter and find the correct place for application logic.',
			prerequisites: ['Node 24.18 or newer', 'pnpm', 'Docker', 'Git'],
			difficulty: 'Intermediate',
			supportRange: TASK_GUIDES_PINNED_VERSION,
			concepts: ['Monorepo', 'Tenant administration', 'Jobs', 'Mobile clients', 'Deployment'],
			relatedUi: [{ label: 'UI overview', href: '/ui' }],
			relatedModules: [{ label: 'Application modules', href: '/modules' }],
			relatedReference: [
				{ label: 'Configuration reference', href: '/reference/configuration' },
				{ label: 'Authorization reference', href: '/reference/authorization' }
			],
			expectedResult:
				'The local reference application starts with its database and development services.'
		},
		pinnedVersion: TASK_GUIDES_PINNED_VERSION,
		visual: 'shell',
		sections: [
			{
				title: 'Run the reference application',
				intro: 'Clone the starter. Then start its services and web application.',
				filename: 'terminal',
				lang: 'bash',
				code: `git clone https://github.com/happyvertical/smrt-saas-starter.git my-app
cd my-app
pnpm install
cp .env.example .env
pnpm services:up
pnpm db:migrate
pnpm db:seed
pnpm --filter @happyvertical/smrt-saas-web dev`
			},
			{
				title: 'Find each responsibility',
				intro:
					'Use the repository areas to find web, worker, mobile, model, UI, and deployment code.',
				points: [
					'apps/web contains the public site, onboarding, accounts, tenant administration, billing, and MCP routes.',
					'apps/worker contains queued and scheduled jobs.',
					'apps/mobile contains the Android and iOS application shells.',
					'packages/app-objects contains the starter models and services.',
					'packages/app-ui contains reusable application components.',
					'manifests contains deployment configuration.'
				]
			},
			{
				title: 'Replace the example model',
				intro:
					'Start in packages/app-objects. Keep the tenant, permission, session, and generated-interface patterns.',
				points: [
					'Choose public, invite-only, or request-access onboarding.',
					'Replace the example plans, entitlements, and usage measures.',
					'Add application navigation to the shared shell.',
					'Contribute reusable framework improvements to s-m-r-t.'
				]
			}
		],
		related: [
			{ label: 'Build a tenant foundation', href: '/guides/multi-tenant-lifecycle' },
			{
				label: 'SaaS starter source',
				href: 'https://github.com/happyvertical/smrt-saas-starter',
				external: true
			}
		]
	},
	{
		slug: 'add-generated-interfaces',
		navTitle: 'Add generated interfaces',
		eyebrow: 'Add interfaces',
		title: 'Add generated interfaces to a model',
		lede: 'Select operations for REST, MCP, and CLI. Regenerate the application manifest. Verify each interface at its authorization boundary.',
		plainEnglish:
			'One model declaration can supply routes, tools, and commands without separate copies of the application logic.',
		packages: ['smrt-core', 'smrt-app-mcp', 'smrt-app-cli', 'smrt-web'],
		task: {
			family: 'add-interfaces',
			purpose: 'Publish selected model operations through generated application interfaces.',
			prerequisites: ['A scanned SmrtObject model', 'A migrated application database'],
			difficulty: 'Intermediate',
			supportRange: TASK_GUIDES_PINNED_VERSION,
			concepts: ['Model manifest', 'REST', 'MCP', 'CLI', 'Authorization'],
			relatedUi: [{ label: 'UI overview', href: '/ui' }],
			relatedModules: [],
			relatedReference: [
				{ label: 'Generated interfaces reference', href: '/reference/interfaces' },
				{ label: 'Authorization reference', href: '/reference/authorization' }
			],
			expectedResult:
				'The generated manifest contains only the selected operations for each interface.'
		},
		pinnedVersion: TASK_GUIDES_PINNED_VERSION,
		visual: 'surfaces',
		sections: [
			{
				title: 'Select the operations',
				intro: 'Declare an explicit operation list for each generated interface.',
				filename: 'src/lib/objects/Article.ts',
				code: `import { SmrtObject, smrt } from '@happyvertical/smrt-core';

@smrt({
  api: { include: ['list', 'get', 'create', 'update'] },
  mcp: { include: ['list', 'get'] },
  cli: { include: ['list', 'get', 'create', 'update'] }
})
export class Article extends SmrtObject {
  title = '';
  status = 'draft';
}`
			},
			{
				title: 'Regenerate the manifest',
				intro:
					'Restart the development process after you change model decorators. The scanner then refreshes the application manifest.',
				points: [
					'Inspect the manifest before you publish a generated interface.',
					'Confirm that sensitive and transient fields do not appear.',
					'Confirm that each interface contains only its selected operations.'
				]
			},
			{
				title: 'Verify the boundary',
				intro:
					'Call one permitted operation and one omitted operation through each enabled interface.',
				points: [
					'Authenticate the caller at the transport boundary.',
					'Authorize the operation with the application principal and tenant context.',
					'Keep application MCP separate from development MCP.'
				]
			}
		],
		related: [
			{ label: 'Connect an agent through MCP', href: '/guides/expose-your-app-over-mcp' },
			{ label: 'Generated interfaces reference', href: '/reference/interfaces' }
		]
	}
];

export const taskGuides: TaskGuide[] = [
	{
		slug: 'multi-tenant-lifecycle',
		navTitle: 'Multi-tenant lifecycle',
		eyebrow: 'Task guide',
		title: 'Run a tenant from creation to a scoped request',
		lede: 'Create tenants and their hierarchy. Give a user a membership and a role. Scope your models. Switch the active tenant safely. Identify the rules that the database enforces.',
		plainEnglish:
			'A tenant is the boundary that separates one customer account from another. This guide follows one tenant from the row that creates it to a request that can only see that tenant’s data.',
		packages: ['smrt-users', 'smrt-tenancy', 'smrt-core'],
		task: {
			family: 'build-foundation',
			purpose: 'Create a tenant boundary and prove that scoped data stays isolated.',
			prerequisites: ['A s-m-r-t application', 'A configured SQLite or PostgreSQL database'],
			difficulty: 'Intermediate',
			supportRange: TASK_GUIDES_PINNED_VERSION,
			concepts: ['Tenant hierarchy', 'Membership', 'Role', 'Tenant context', 'Row isolation'],
			relatedUi: [],
			relatedModules: [{ label: 'Application modules', href: '/modules' }],
			relatedReference: [
				{ label: 'Authorization reference', href: '/reference/authorization' },
				{ label: 'Security reference', href: '/reference/security' }
			],
			expectedResult: 'Tests prove that each tenant can read and change only its permitted records.'
		},
		pinnedVersion: TASK_GUIDES_PINNED_VERSION,
		visual: 'tenants',
		sources: [
			{ label: 'smrt-tenancy README', href: `${SMRT_TREE}/packages/tenancy/README.md` },
			{ label: 'smrt-tenancy AGENTS.md', href: `${SMRT_TREE}/packages/tenancy/AGENTS.md` },
			{ label: 'smrt-users README', href: `${SMRT_TREE}/packages/users/README.md` },
			{
				label: 'smrt-saas-starter',
				href: 'https://github.com/happyvertical/smrt-saas-starter'
			}
		],
		sections: [
			{
				title: 'Know which package holds what',
				intro:
					'The split between the two packages can cause an import error during a first attempt. smrt-users owns Tenant, User, Role, Membership, Permission, Session, and their collections. smrt-tenancy owns no models. smrt-tenancy is the context and enforcement layer. The package provides decorators, request context, the collection interceptor, and test helpers.',
				points: [
					'Tenant, TenantCollection, Membership, and MembershipCollection import from @happyvertical/smrt-users.',
					'TenantScoped, tenantId, withTenant, and enableTenancy import from @happyvertical/smrt-tenancy.',
					'The SvelteKit session handler lives at @happyvertical/smrt-users/sveltekit.',
					'The SvelteKit tenant-context handle lives at @happyvertical/smrt-tenancy/adapters.'
				],
				links: [{ label: 'Foundation: where data belongs', href: '/foundations/tenants' }]
			},
			{
				title: 'Create the schema and the system roles',
				intro:
					'Two things must exist before a membership can. A migration creates the tables. A seed call creates the built-in roles and populates the permission catalog. Both are ordinary application startup operations instead of CLI-only steps. Thus, scripts and tests can run them.',
				filename: 'scripts/bootstrap.ts',
				code: `import { ObjectRegistry, resolveDatabase } from '@happyvertical/smrt-core';
import { migrateSmrtSchemas } from '@happyvertical/smrt-core/migrations';
import { RoleCollection, syncPermissionCatalog } from '@happyvertical/smrt-users';

const dbConfig = { type: 'postgres', url: process.env.DATABASE_URL! } as const;
const db = await resolveDatabase(dbConfig, {
  schemas: ObjectRegistry.getAllSchemasAsDefinitions()
});

await migrateSmrtSchemas({ db, packageName: 'my-app' });

const roles = await RoleCollection.create({ db: dbConfig });
await roles.seedSystemRoles({ seedPermissions: true });

await syncPermissionCatalog({ db: dbConfig });`,
				points: [
					'seedSystemRoles creates the owner, admin, member, and viewer roles.',
					'syncPermissionCatalog is additive: it creates and updates permission rows, and never grants them to a role or deletes a stale one.',
					'smrt db:migrate exists as a CLI equivalent; the programmatic call is used here because it works without CLI project discovery.'
				]
			},
			{
				title: 'Create a tenant, then a child tenant',
				intro:
					'A tenant collection is created through the inherited static factory, and create() already writes the row — there is no separate save() step. createChild derives the hierarchy fields for you: the child receives the parent id, a hierarchy level one deeper, and its materialized path.',
				filename: 'src/lib/server/tenants.ts',
				code: `import { TenantCollection, TenantStatus } from '@happyvertical/smrt-users';

const tenants = await TenantCollection.create({ db: dbConfig });

const network = await tenants.create({
  name: 'Northern Network',
  slug: 'northern-network',
  status: TenantStatus.ACTIVE,
  cascadePermissions: true
});
// hierarchyLevel 0, parentTenantId null

const chapter = await tenants.createChild(network.id, {
  name: 'Edmonton Chapter',
  slug: 'edmonton-chapter',
  inheritPermissions: true
});
// hierarchyLevel 1, parentTenantId === network.id

await tenants.findChildren(network.id); // [ Edmonton Chapter ]`,
				points: [
					'The parent field is parentTenantId, and the hierarchy is capped at ten levels.',
					'cascadePermissions is the parent offering authority downward; inheritPermissions is the child accepting it. Both must be true for inheritance to happen.',
					'findRoots, getAncestors, getDescendants, moveToParent, and getTree cover the rest of the hierarchy; a cycle raises TenantHierarchyError with code CIRCULAR_REFERENCE.'
				]
			},
			{
				title: 'Give a user access through a membership',
				intro:
					'A membership joins one user, one tenant, and one role. There is no addMember helper. Create the row like any other row. This operation keeps the role decision explicit at the call site instead of hiding it in a convenience method.',
				filename: 'src/lib/server/invite.ts',
				code: `import {
  MembershipCollection, MembershipStatus, RoleCollection
} from '@happyvertical/smrt-users';

const roles = await RoleCollection.create({ db: dbConfig });
const memberships = await MembershipCollection.create({ db: dbConfig });

const admin = await roles.findBySlug('admin');

await memberships.create({
  userId: user.id,
  tenantId: chapter.id,
  roleId: admin.id,
  status: MembershipStatus.ACTIVE
});

await memberships.findByUserAndTenant(user.id, chapter.id);`,
				points: [
					'TenantService.createTenantWithOwnership(userId, name) does the tenant and the owner membership together, and requires seedSystemRoles to have run.',
					'Membership status is active, inactive, or pending; only an active membership authorizes a tenant switch.',
					'PermissionResolver.hasPermission(userId, tenantId, slug) answers the authorization question these records exist to support.'
				]
			},
			{
				title: 'Put your own models inside the boundary',
				intro:
					'Marking a model tenant-scoped connects it to the interceptor. Either spelling below registers the same configuration. The decorator form keeps the tenant field visible in the class. The core-option form avoids a smrt-tenancy import in the model file.',
				filename: 'src/lib/objects/Document.ts',
				code: `import { smrt, SmrtObject } from '@happyvertical/smrt-core';
import { TenantScoped, tenantId } from '@happyvertical/smrt-tenancy';

@smrt({ api: true })
@TenantScoped()
export class Document extends SmrtObject {
  @tenantId()
  tenantId = '';

  title = '';
}

// Equivalent, without importing smrt-tenancy here:
// @smrt({ api: true, tenantScoped: { mode: 'required' } })`,
				points: [
					'mode is required or optional. There is no global mode: a shared row is optional mode with a nullable tenant field holding null.',
					'autoFilter and autoPopulate default to true; allowSuperAdminBypass defaults to false and must be opted into per class.',
					'A required-mode class whose tenant field is non-nullable rejects a create that omits it, because model validation runs before the interceptor can populate the value. Declare the field nullable, or pass tenantId explicitly.'
				]
			},
			{
				title: 'Establish the context a request runs in',
				intro:
					'Nothing is scoped until something establishes the tenant context. In SvelteKit, two handles run in sequence. The tenancy handle opens the asynchronous request context. The session handler resolves the signed-in user, membership, permission snapshot, and active tenant. Outside a request, withTenant supplies the same context around a script, job, or test function.',
				filename: 'src/hooks.server.ts',
				code: `import { sequence } from '@sveltejs/kit/hooks';
import { createSvelteKitHandle } from '@happyvertical/smrt-tenancy/adapters';
import { enableTenancy } from '@happyvertical/smrt-tenancy';
import { createSessionHandler } from '@happyvertical/smrt-users/sveltekit';

enableTenancy();

const tenancyHandle = createSvelteKitHandle({
  resolveTenantId: async (event) => resolveTenantFromHost(event)
}) as unknown as Handle;

const sessionHandle = createSessionHandler({
  ...getSmrtConfig('Session'),
  enterTenantContext: true,
  postgresRls: true
}) as unknown as Handle;

export const handle = sequence(tenancyHandle, sessionHandle);`,
				points: [
					'The session handler populates locals.user, locals.membership, locals.permissions, locals.tenantId, and locals.sessionId — the SessionLocals interface your app.d.ts should extend.',
					'The tenancy handle populates locals.tenantContext and locals.tenantId. Type that local as TenantContextData; TenantContext itself is a value, not a type.',
					'Both packages describe the event structurally to avoid depending on @sveltejs/kit, so the casts are expected rather than a smell.',
					'For a job or a CLI entry point, use createCliContext or runTenantScopedEntryPoint so an unscoped run fails instead of quietly reading everything.'
				]
			},
			{
				title: 'Switch the active tenant',
				intro:
					'Tenant switching is reachable from user input, so its controls are important. The helper verifies the caller has an active membership in the target tenant before it writes. Then, it creates a new session and revokes the old one. Thus, a stolen identifier cannot follow the user into the new tenant.',
				filename: 'src/routes/api/tenant/switch/+server.ts',
				code: `import { error, json } from '@sveltejs/kit';
import { switchSessionTenant } from '@happyvertical/smrt-users/sveltekit';

export const POST = async (event) => {
  const { tenantId } = await event.request.json();

  const switched = await switchSessionTenant(event, tenantId, {
    ...getSmrtConfig('Session'),
    cookieName: 'sid',
    cookieSecure: true,
    cookieSameSite: 'lax'
  });

  if (!switched) error(409, 'No active membership in that tenant');
  return json({ ok: true });
};`,
				points: [
					'The membership check is fail-closed, so the tenant id may come from untrusted form data — but the Boolean result must be honored.',
					'A successful switch into a tenant rotates the session id; the helper re-sets the cookie for you.',
					'Clearing the tenant by passing null does not rotate.',
					'If you call SessionService.switchTenant directly, persist the returned sessionId yourself.'
				]
			},
			{
				title: 'What the data layer actually enforces',
				intro:
					'After interceptor enablement and class registration, list, get, count, save, and delete are covered. Reads and writes have different cross-tenant behavior. A read for the wrong tenant returns no result. A write that names the wrong tenant throws an error.',
				points: [
					'list() and count() receive the tenant predicate, so rows from another tenant are absent.',
					'get() with a bare id becomes a lookup on id and tenant together. It returns null across a boundary instead of throwing an error.',
					'An explicit filter naming a different tenant throws TenantIsolationError, code TENANT_ISOLATION_VIOLATION.',
					'A save whose tenant field disagrees with the context throws the same error; an empty field is populated from the context instead.',
					'Any covered operation with no context at all, on a required-mode class, throws TenantContextError, code TENANT_CONTEXT_REQUIRED.'
				],
				filename: 'boundary.ts',
				code: `await withTenant({ tenantId: 'acme' }, async () => {
  await documents.create({ title: 'Acme plan', tenantId: 'acme' });
});

await withTenant({ tenantId: 'globex' }, async () => {
  await documents.list();          // only globex rows
  await documents.get(acmeDocId);  // null

  await documents.create({ title: 'x', tenantId: 'acme' });
  // TenantIsolationError: cannot save Document with tenantId 'acme'
  // in context of tenant 'globex'
});

await documents.list();
// TenantContextError: Tenant context required for listing Document.
// Use withTenant() or configure TenantContext middleware.`
			},
			{
				title: 'What it does not enforce',
				intro:
					'Isolation is a property of the paths that go through a scoped collection. Four gaps are deliberate, and an application that assumes otherwise will have holes that no test on the happy path will find.',
				callout: {
					variant: 'security',
					title: 'Identity records are outside the boundary',
					body: 'Membership, Role, Session, User, and Tenant carry tenant columns but are not registered with the interceptor. Every query against them is unfiltered, so authorization code must supply the tenant condition itself.'
				},
				points: [
					'Optional-mode reads with no context pass through unfiltered at the interceptor. Generated REST routes compensate by asking for global rows only; a hand-written route does not.',
					'Raw SQL is gated, not filtered. The policy can throw, warn, or allow, but no tenant predicate is ever added, and a database handle obtained outside a collection bypasses interceptors entirely.',
					'Context does not survive an asynchronous boundary, such as a timer, emitter, or queue consumer. Wrap the callback with TenantContext.bind or runWithJobContext.'
				]
			},
			{
				title: 'Add row-level security where the database supports it',
				intro:
					'On PostgreSQL, the database can enforce the same rules. Thus, a query that skips the collection layer is still constrained. Generated policies read request-scoped settings that the session layer publishes inside the transaction. On SQLite, the same permission set is resolved and carried. However, the database does not enforce each operation.',
				filename: 'scripts/apply-rls.ts',
				code: `import { applyPostgresPermissionPolicies } from '@happyvertical/smrt-users';

const { statements, targets, skipped } =
  await applyPostgresPermissionPolicies({ db: dbConfig });

// ALTER TABLE "public"."documents" ENABLE ROW LEVEL SECURITY
// ALTER TABLE "public"."documents" FORCE ROW LEVEL SECURITY`,
				points: [
					'Policies are generated only for required-mode tenant-scoped objects backed by a table no other object shares; anything else is reported in skipped, with the reason.',
					'The read and write policies map to the collection’s read, create, update, and delete permissions.',
					'generatePostgresPermissionSql returns the same statements without executing them, which is what you want in a reviewed migration.',
					'Set postgresRls on the session handler so each request runs in a transaction carrying its own tenant and permission settings.'
				],
				links: [
					{ label: 'Reference: security defaults', href: '/reference/security' },
					{
						label: 'Tenant isolation hardening (#126)',
						href: 'https://github.com/happyvertical/s-m-r-t.dev/issues/126',
						external: true
					}
				]
			},
			{
				title: 'Prove it with a test',
				intro:
					'The boundary is worth a test that fails loudly when it regresses, and the tenancy package ships assertions for exactly the two error codes above. The testing guide covers the database harness these tests run on.',
				filename: 'src/lib/objects/__tests__/isolation.test.ts',
				code: `import { assertTenantContextRequired, assertTenantIsolationViolation, withTenant }
  from '@happyvertical/smrt-tenancy';

it('requires a context', async () => {
  await assertTenantContextRequired(() => documents.list());
});

it('refuses a foreign filter', async () => {
  await withTenant({ tenantId: 'acme' }, async () => {
    await assertTenantIsolationViolation(() =>
      documents.list({ where: { tenantId: 'globex' } }));
  });
});`,
				links: [{ label: 'Task guide: test your application', href: '/guides/testing-your-app' }]
			}
		]
	},
	{
		slug: 'expose-your-app-over-mcp',
		navTitle: 'Expose your app over MCP',
		eyebrow: 'Task guide',
		title: 'Expose a running application over MCP',
		lede: 'Turn existing objects into agent tools. Generate a local stdio server. Mount the stateless HTTP endpoint. Call it with curl. Connect a real client. Keep the authorization boundary in the correct location.',
		plainEnglish:
			'MCP lets an agent call your application’s operations as tools. The tools come from the same models your app already uses, so permissions, tenants, and field rules stay where they are.',
		packages: ['smrt-app-mcp', 'smrt-core', 'smrt-app-cli'],
		task: {
			family: 'connect-agents',
			purpose: 'Expose selected application operations to an MCP client.',
			prerequisites: [
				'A scanned s-m-r-t model',
				'An MCP client',
				'An application authentication plan'
			],
			difficulty: 'Advanced',
			supportRange: TASK_GUIDES_PINNED_VERSION,
			concepts: ['Application agent', 'MCP tool', 'Principal', 'Tenant scope', 'Authorization'],
			relatedUi: [],
			relatedModules: [{ label: 'Application modules', href: '/modules' }],
			relatedReference: [
				{ label: 'Generated interfaces reference', href: '/reference/interfaces' },
				{ label: 'Security reference', href: '/reference/security' }
			],
			expectedResult: 'A client lists and calls only the MCP tools that the application exposes.'
		},
		pinnedVersion: TASK_GUIDES_PINNED_VERSION,
		visual: 'surfaces',
		sources: [
			{ label: 'smrt-app-mcp README', href: `${SMRT_TREE}/packages/smrt-app-mcp/README.md` },
			{ label: 'smrt-app-mcp AGENTS.md', href: `${SMRT_TREE}/packages/smrt-app-mcp/AGENTS.md` },
			{
				label: 'Remote MCP authorization contract',
				href: `${SMRT_TREE}/docs/content/architecture/remote-mcp-authorization.md`
			}
		],
		sections: [
			{
				title: 'Decide what each object exposes',
				intro:
					'The decorator that already describes your model is where MCP is turned on. mcp: true exposes the generated CRUD actions; the object form narrows that to a deliberate set. Tool names are the lowercased class name, an underscore, and the action, so the vocabulary is predictable from the model alone.',
				filename: 'src/lib/objects/Article.ts',
				code: `import { smrt, SmrtObject } from '@happyvertical/smrt-core';

@smrt({
  api: true,
  mcp: { include: ['list', 'get', 'update'] }
})
export class Article extends SmrtObject {
  title = '';
  body = '';
  status = 'draft';
}

// Generates article_list, article_get, article_update.`,
				points: [
					'mcp accepts true, or an object with include and exclude lists covering CRUD actions and custom methods.',
					'A tool is treated as read-only when its name ends in _list or _get. That suffix rule decides what an unauthenticated caller can ever see.',
					'Collection classes are scanned too, so a plain build also produces articlecollection_* tools. The application allow-list below is where you drop them.'
				],
				links: [{ label: 'Reference: generated interfaces', href: '/reference/interfaces' }]
			},
			{
				title: 'Generate the local stdio server',
				intro:
					'The generated stdio server is the generated local MCP surface for an application agent running on the same machine as the application. It reads its database credentials from the environment and has no per-request principal, which is exactly why it stays local.',
				callout: {
					variant: 'note',
					title: 'Choose the output language by extension',
					body: 'The default .js target is transpiled to runnable ESM JavaScript. Use a .ts or .mts path to keep the annotated TypeScript for tsx or Node type stripping. CommonJS .cjs and .cts targets are rejected.'
				},
				filename: 'generate.sh',
				lang: 'bash',
				code: `# Generation commands are hyphenated; generate-mcp also answers to
# generate-mcp-server and mcp. The default output is runnable JavaScript.
npx smrt generate-mcp --name my-app --version 0.1.0

# Three files, each reported by absolute path:
# ✅ Generated MCP server: .../.smrt/mcp-server/index.js
# ✅ Generated Claude config example: .../.smrt/mcp-server/claude-config.example.json
# ✅ Generated MCP documentation: .../.smrt/mcp-server/MCP-README.md`,
				points: [
					'--version after the subcommand sets the generated server version; a global --version before the subcommand still prints the CLI version.',
					'The server reads DATABASE_TYPE, DATABASE_URL, and SMRT_MCP_PERMISSIONS. When the build contains tenant-scoped classes it also reads SMRT_MCP_TENANT_ID and SMRT_MCP_ALLOW_CROSS_TENANT.',
					'The generated server imports its runtime dependencies from the consuming project, so strict package-manager layouts require them to be declared there.',
					'Its trust boundary is the process that launched it. Never expose it remotely.'
				]
			},
			{
				title: 'Check it before wiring a client',
				intro:
					'A stdio server speaks JSON-RPC on stdout, so you can drive it from a shell and see the tool catalog directly. This is the fastest way to confirm your classes were scanned before a client failure sends you looking in the wrong place.',
				filename: 'smoke-test.sh',
				lang: 'bash',
				code: `echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{"_meta":{
  "io.modelcontextprotocol/protocolVersion":"2026-07-28",
  "io.modelcontextprotocol/clientCapabilities":{}}}}' \\
  | node .smrt/mcp-server/index.js

# {"result":{"tools":[{"name":"article_create",...},
#                     {"name":"article_get",...}],
#   "resultType":"complete","cacheScope":"private"},"jsonrpc":"2.0","id":1}`,
				points: [
					'The default .js output runs directly with Node. A .ts target needs a type-stripping runtime or tsx.',
					'Anything written to stdout that is not JSON-RPC corrupts the channel, so keep diagnostics on stderr.',
					'An empty tool list means the scan found no classes, not that MCP is off.'
				]
			},
			{
				title: 'Point a local client at it',
				intro:
					'With the server running from a file, the client configuration is small. Use an absolute path: a client launched from elsewhere has neither your working directory nor your package manager.',
				filename: '.mcp.json',
				lang: 'json',
				code: `{
  "mcpServers": {
    "my-app": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/.smrt/mcp-server/index.js"],
      "env": {
        "DATABASE_TYPE": "sqlite",
        "DATABASE_URL": "file:./data/app.db"
      }
    }
  }
}`,
				points: [
					'The generated claude-config.example.json mirrors the resolved output path, including a custom --output-path when you provide one.',
					'Claude Code can take the same thing as: claude mcp add my-app -- node /absolute/path/.smrt/mcp-server/index.js'
				]
			},
			{
				title: 'Describe the application server',
				intro:
					'The HTTP surface is a different object with a different job. createMcpAppServer wraps generated tools with four independent gates. The allow-list sets the reachable classes. Public patterns set what an anonymous caller can see. Tool policy makes a decision for each principal. Workflow assertions run before dispatch.',
				filename: 'src/lib/server/mcp.ts',
				code: `import { createMcpAppServer, McpAccessError } from '@happyvertical/smrt-app-mcp';
import { getDbConfig } from './db';

export const mcpServer = createMcpAppServer({
  smrtOptions: () => ({ db: getDbConfig() }),
  serverInfo: { name: 'my-app', version: '0.1.0' },

  // Only these classes exist as far as this surface is concerned.
  allowedClassNames: ['Article'],

  // Empty by default: nothing is anonymous until an operator opts in,
  // and even then only _list and _get tools pass the base rule.
  publicToolPatterns: () => ['article_*'],

  toolPolicy: ({ tool, principal }) => {
    if (!principal) return tool.name === 'article_get';
    return principal.roles?.includes('editor') ?? false;
  },

  workflowAssertions: {
    article_update: (args, user) => {
      if (!user?.id) throw new McpAccessError(401, 'sign in first');
      args.reviewedByUserId = user.id;
    }
  }
});`,
				points: [
					'A tool outside the allow-list gets the safe not-found response rather than a denial that confirms it exists.',
					'A policy that throws is treated as a denial, so failures close rather than open.',
					'Denials carry the non-retryable mcp_tool_access_denied code and deliberately reveal nothing about the tool, principal, or policy.'
				],
				links: [{ label: 'Tooling reference: app MCP', href: '/tooling/app-mcp' }]
			},
			{
				title: 'Mount one route',
				intro:
					'This route is not generated for you — the Vite plugin writes REST routes, not this one. Export the handler as POST only, and let the session layer put the principal on locals before it runs.',
				filename: 'src/routes/api/mcp/+server.ts',
				code: `import { mountMcpRoute } from '@happyvertical/smrt-app-mcp/sveltekit';
import { mcpServer } from '$lib/server/mcp';

export const POST = mountMcpRoute(mcpServer);

// resolvePrincipal defaults to event.locals.user. Override it when your
// application stores the principal somewhere else:
// export const POST = mountMcpRoute(mcpServer, {
//   resolvePrincipal: (event) => event.locals.apiClient ?? null
// });`,
				points: [
					'A fresh protocol server is built per request, so no session id, sticky routing, or held stream is involved.',
					'The mount serves server/discover, tools/list, and tools/call. It always reports tools and adds the optional tasks extension only when an allowed object enables a task action.',
					'Tool discovery is sorted by name, so the catalog is deterministic.',
					'Exporting it as GET returns 405 with code -32000.'
				]
			},
			{
				title: 'Call it with curl',
				intro:
					'A stock client sends more than the JSON-RPC body. The request has an envelope that names the protocol revision. Its headers must agree with the body. Send the request manually to confirm that the endpoint is live and the policy has the intended result.',
				filename: 'tools-list.sh',
				lang: 'bash',
				code: `curl -sS -X POST 'https://app.example.com/api/mcp' \\
  -H 'content-type: application/json' \\
  -H 'mcp-protocol-version: 2026-07-28' \\
  -H 'mcp-method: tools/list' \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {
      "_meta": {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientCapabilities": {}
      }
    }
  }'

# HTTP 200, content-type: application/json
# {"jsonrpc":"2.0","id":1,"result":{
#   "resultType":"complete",
#   "tools":[{"name":"article_get",...},{"name":"article_list",...}],
#   "ttlMs":86400000,"cacheScope":"private"}}`,
				points: [
					'The _meta envelope is required. Both the protocol version and the client capabilities keys must be present; capabilities may be an empty object.',
					'2026-07-28 is the only revision this release accepts.',
					'The MCP-Protocol-Version header is optional, but if you send it, it must match the envelope.',
					'The anonymous catalog above contains only the read-only tools, because the base rule admits nothing else without a principal.'
				]
			},
			{
				title: 'Call a tool',
				intro:
					'A tool call adds one more header. Mcp-Name must byte-match the name in the body, which is what lets a proxy route or audit a call without parsing the payload.',
				filename: 'tools-call.sh',
				lang: 'bash',
				code: `curl -sS -X POST 'https://app.example.com/api/mcp' \\
  -H 'content-type: application/json' \\
  -H 'mcp-protocol-version: 2026-07-28' \\
  -H 'mcp-method: tools/call' \\
  -H 'mcp-name: article_list' \\
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "article_list",
      "arguments": { "limit": 5 },
      "_meta": {
        "io.modelcontextprotocol/protocolVersion": "2026-07-28",
        "io.modelcontextprotocol/clientCapabilities": {}
      }
    }
  }'`,
				points: [
					'Mcp-Name is required for tools/call, prompts/get, and resources/read, and for nothing else.',
					'A generated tool on a non-public model still requires the application’s own authentication. Without a principal the call returns HTTP 200 carrying an error result — "Authentication required" — rather than a protocol error.'
				]
			},
			{
				title: 'Read the refusals',
				intro:
					'Four rejections account for nearly every failed request against this endpoint, and they are distinguishable at a glance. Knowing which is which tells you whether to look at your client, your gateway, or your policy.',
				points: [
					'HTTP 400 with code -32020 means the headers and body disagree — a missing or mismatched Mcp-Method or Mcp-Name. The message names exactly which.',
					'HTTP 400 with code -32022 means the request did not name a protocol version: the _meta envelope is missing or names something other than 2026-07-28. The response lists what is supported.',
					'HTTP 415 means the content type was not application/json.',
					'HTTP 405 with code -32000 means the request reached the route on the wrong HTTP method.'
				],
				filename: 'header-mismatch.json',
				lang: 'json',
				code: `{
  "jsonrpc": "2.0",
  "error": {
    "code": -32020,
    "message": "Bad Request: the request headers and body disagree: the body names method tools/list but the required Mcp-Method header is absent",
    "data": {
      "mismatch": {
        "header": "(missing)",
        "body": "the body names method tools/list but the required Mcp-Method header is absent"
      }
    }
  },
  "id": 1
}`,
				links: [{ label: 'Protocol and conformance detail', href: '/tooling/compatibility' }]
			},
			{
				title: 'Terminate authorization in front of the route',
				intro:
					'This package validates the request envelope, not the caller. It does not implement an authorization server and does not check bearer tokens; it trusts the principal your application put on the request. For anything reachable from the internet, that principal must be the output of a validated token, not of a header.',
				callout: {
					variant: 'security',
					title: 'The mount authenticates nothing',
					body: 'resolvePrincipal defaults to whatever the session layer left on locals. Deployed without a gateway that validates tokens first, every request to this route is anonymous.'
				},
				points: [
					'Validate the token signature, issuer, audience or resource, expiry, and scopes at the gateway, then populate the principal.',
					'Compare issuer values as exact strings; a trailing-slash difference is a different issuer.',
					'Leave public tool patterns empty unless anonymous read access is a decision someone made on purpose.',
					'Header presence is not authentication. The required headers exist to keep the envelope honest, nothing more.'
				],
				links: [{ label: 'Reference: security defaults', href: '/reference/security' }]
			},
			{
				title: 'Connect a deployed application to a local client',
				intro:
					'A local MCP client speaks stdio, and the generated stdio server must not leave the machine. The bridge closes that gap: it runs locally, authenticates through the first-party terminal device flow, and forwards to your deployment. It talks to the REST-shaped aliases rather than the modern mount, so mount those alongside it.',
				filename: 'bridge.json',
				lang: 'json',
				code: `{
  "mcpServers": {
    "acme": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y", "-p", "@happyvertical/smrt-app-cli",
        "smrt-mcp-bridge", "--env-prefix=ACME", "--name=acme-mcp"
      ],
      "env": {
        "ACME_SERVER_URL": "https://app.acme.example",
        "ACME_TOKEN": "<token from the device-code login>"
      }
    }
  }
}`,
				points: [
					'The bridge requests /api/mcp/tools and /api/mcp/call, which are mountMcpToolsRoute and mountMcpCallRoute — deprecated, but the only shape it speaks today.',
					'--env-prefix is required, or SMRT_MCP_ENV_PREFIX in its place; the prefix names the SERVER_URL and TOKEN variables it reads.',
					'A stored token is only sent when its server URL exactly matches the request target, so a token cannot follow you to another host.',
					'smrt-mcp-bridge is the only binary the package publishes. The device flow — /api/cli/auth/start, then polling /api/cli/auth/token — reaches you through an application CLI you assemble with its exported createAppCli.'
				],
				links: [
					{ label: 'Tooling reference: app MCP', href: '/tooling/app-mcp' },
					{ label: 'Development MCP: smrt-dev-mcp', href: '/tooling/dev-mcp' }
				]
			},
			{
				title: 'Keep the surfaces apart',
				intro:
					'It is worth restating which surface does what, because the failure mode of confusing them is an agent with the wrong authority. The Development MCP server reads your workspace and cannot touch application data. Generated local MCP and hosted application MCP are servers that operate on data. WebMCP is not a separate server; it registers tools in the browser page and calls the generated REST surface as the signed-in user. None of the three application-facing surfaces know anything about your repository layout.',
				links: [
					{ label: 'Choose a surface', href: '/tooling' },
					{ label: 'Capability: WebMCP in the browser', href: '/capabilities/webmcp' },
					{ label: 'Task guide: test your application', href: '/guides/testing-your-app' }
				]
			}
		]
	},
	{
		slug: 'semantic-search',
		navTitle: 'Semantic search',
		eyebrow: 'Task guide',
		title: 'Search records by meaning',
		lede: 'Declare the fields that carry meaning. Generate their embeddings. Query a collection with semanticSearch or findSimilar. Review where ranking occurs relative to the filters.',
		plainEnglish:
			'Semantic search finds records that mean something similar to a query, even when they share no words with it. The vectors that make that possible are stored beside your data and refreshed when the text changes.',
		packages: ['smrt-core', 'smrt-tenancy'],
		task: {
			family: 'add-modules',
			purpose: 'Add semantic search to records that contain meaningful text.',
			prerequisites: ['A s-m-r-t collection', 'Records with text fields', 'An embedding provider'],
			difficulty: 'Intermediate',
			supportRange: TASK_GUIDES_PINNED_VERSION,
			concepts: ['Embedding', 'Semantic search', 'Candidate limit', 'Tenant filter'],
			relatedUi: [],
			relatedModules: [{ label: 'Application modules', href: '/modules' }],
			relatedReference: [
				{ label: 'AI and retrieval reference', href: '/reference/ai-and-retrieval' },
				{ label: 'Collections reference', href: '/reference/collections' }
			],
			expectedResult:
				'A collection query returns relevant records without crossing the active tenant boundary.'
		},
		pinnedVersion: TASK_GUIDES_PINNED_VERSION,
		sources: [
			{ label: 'smrt-core AGENTS.md', href: `${SMRT_TREE}/packages/core/AGENTS.md` },
			{ label: 'smrt-core README', href: `${SMRT_TREE}/packages/core/README.md` }
		],
		sections: [
			{
				title: 'Declare the fields on the class',
				intro:
					'Embedding configuration is an option on the @smrt() decorator rather than a per-field decorator. fields names the properties whose text carries the meaning you want to search; everything else about the model is unchanged.',
				filename: 'src/lib/objects/Recipe.ts',
				code: `import { ObjectRegistry, SmrtCollection, SmrtObject, smrt }
  from '@happyvertical/smrt-core';

@smrt({
  api: true,
  embeddings: { fields: ['summary'], provider: 'local' }
})
export class Recipe extends SmrtObject {
  title = '';
  summary = '';
}

export class RecipeCollection extends SmrtCollection<Recipe> {
  static readonly _itemClass = Recipe;
}

ObjectRegistry.registerCollection('Recipe', RecipeCollection);`,
				points: [
					'provider is local, ai, or auto. Only provider can be overridden per class; the model names and dimensions come from project configuration.',
					'autoGenerate and regenerateOnChange both default to true.',
					'combinedField builds one extra vector from a template across several fields.'
				]
			},
			{
				title: 'Choose where the vectors come from',
				intro:
					'The project-level block selects the model that produces the numbers. Local embedding uses a transformers runtime on your machine and needs no API key. The ai provider calls the configured model provider through the SDK adapter. The default is local with 768 dimensions.',
				filename: 'smrt.config.js',
				code: `export default defineConfig({
  smrt: {
    embeddings: {
      provider: 'local',
      localModel: 'Xenova/bge-base-en-v1.5',
      aiModel: 'text-embedding-3-small',
      dimensions: 768,
      storage: 'json'
    }
  }
});`,
				points: [
					'Local embedding requires @huggingface/transformers (or the older @xenova/transformers) to be installed; without it the provider raises a clear error naming both packages.',
					'The model name is part of the identity of a stored vector. Changing provider or model makes existing embeddings invisible rather than stale, and they must be regenerated.',
					'storage json keeps vectors as text and compares them in the application; storage native uses pgvector on PostgreSQL, or the SQLite vector extension.'
				]
			},
			{
				title: 'Generate the vectors',
				intro:
					'Saving a record schedules embedding generation only when a model client can resolve. The save does not wait for generation. Use the explicit call in a script, seed, or test. The explicit call finishes before the next line runs.',
				filename: 'seed.ts',
				code: `const recipes = await RecipeCollection.create({ db: dbConfig });

await recipes.create({
  title: 'Sourdough loaf',
  summary: 'A slow-fermented bread with a crisp crust.'
});

// Deterministic: generate now rather than waiting on the save-time path.
const stats = await recipes.generateMissingEmbeddings();
// { generated: 3, skipped: 0 }`,
				points: [
					'generateMissingEmbeddings pages through the collection in batches of fifty and accepts an onProgress callback.',
					'Its skipped count means "already current" and also absorbs per-object failures, which are only logged.',
					'object.generateEmbeddings({ force: true }) regenerates one record; content is hashed, so an unchanged field is not re-embedded.',
					'There is no CLI command for backfill at this release; this collection method is the supported path.'
				]
			},
			{
				title: 'Query it',
				intro:
					'semanticSearch embeds the query text and returns hydrated model instances with their methods. Each instance has a _similarity score between zero and one. Results are sorted from the highest similarity to the lowest. findSimilar starts the same operation from an existing record.',
				filename: 'search.ts',
				code: `const hits = await recipes.semanticSearch('baking bread at home', { limit: 3 });

hits.map((hit) => [hit.title, hit._similarity]);
// [ ['Sourdough loaf',  0.7203995814592284],
//   ['Tomato soup',     0.5640168165699766],
//   ['Bicycle repair',  0.5138145283587121] ]

const related = await recipes.findSimilar(hits[0], { limit: 5 });`,
				points: [
					'The threshold option is named minSimilarity and defaults to 0. It is a minimum score and not a boundary between clusters. A value of 0.5 in the example still returns all three rows because the lowest score is 0.514.',
					'limit defaults to 10 on semanticSearch and 5 on findSimilar.',
					'findSimilar excludes the source record by default and reads its stored vector, so it raises if that record was never embedded.',
					'field selects which configured field to search when a class declares more than one.'
				],
				links: [{ label: 'Reference: AI and retrieval', href: '/reference/ai-and-retrieval' }]
			},
			{
				title: 'Serve it from a route',
				intro:
					'There is no generated REST or MCP surface for semantic search at this release, so the endpoint is yours to write. That is also where the permission check belongs, because the collection call itself does not apply one.',
				filename: 'src/routes/api/search/+server.ts',
				code: `import { json } from '@sveltejs/kit';

export const GET = async ({ url, locals }) => {
  if (!locals.permissions.includes('recipes.read')) return json([], { status: 403 });

  const query = url.searchParams.get('q') ?? '';
  if (!query) return json([]);

  const recipes = await RecipeCollection.create({ db: getDbConfig() });
  const hits = await recipes.semanticSearch(query, { limit: 10, minSimilarity: 0.4 });

  return json(hits.map(({ id, title, _similarity }) => ({ id, title, _similarity })));
};`
			},
			{
				title: 'Read the ranking honestly',
				intro:
					'The ranking and filtering stages are separate, and their order explains most unexpected result sets. Similarity is calculated for each stored class vector. The result is shortened to limit. Then, the collection loads the remaining ids and applies tenant scope and the where clause.',
				callout: {
					variant: 'warning',
					title: 'limit counts candidates, not results',
					body: 'Truncation occurs before tenant scope and the where clause apply. Thus, limit 10 can return fewer than ten rows when more matches exist. Request extra candidates and shorten the result. Do not use limit as a page size.'
				},
				points: [
					'Nothing leaks: a tenant-scoped class still filters at the hydration step, so another tenant’s rows never reach the caller.',
					'Field policy is not applied. Results are fully hydrated instances. Sensitive-field rules in the generated interfaces are not in this path. Project the fields that you return, as the route above does.',
					'With json storage, every vector for the class is read and parsed on every query. That is sufficient for a catalog and not for a corpus.',
					'Native vector search falls back to the in-application scan when the database call fails. Results stay correct and get much slower, and the only trace is a logged warning.'
				],
				links: [
					{ label: 'Foundation: collections and reads', href: '/capabilities/collections' },
					{ label: 'Reference: security defaults', href: '/reference/security' }
				]
			},
			{
				title: 'Turn on native vectors when the dataset outgrows the scan',
				intro:
					'Native storage moves the comparison into the database. On PostgreSQL, first use creates the extension and column. On SQLite, enable the native capability. SQLite native storage also requires a local file instead of a remote connection.',
				filename: 'native-vectors.ts',
				code: `// smrt.config.js
embeddings: { provider: 'local', storage: 'native' }

// PostgreSQL: CREATE EXTENSION vector, then an embedding_vector column
// and an HNSW index, created on first use.

// SQLite: opt in explicitly, and stay on a local file.
const db = await getDatabase({
  type: 'sqlite',
  url: 'file:./dev.db',
  capabilities: { vector: { quantization: 'turbo4', preload: true } }
});`,
				points: [
					'Setting native on an adapter without vector support logs a warning and silently uses json storage.',
					'The SQLite path needs @sqliteai/sqlite-vector installed and rejects remote libsql or http URLs.',
					'Vectors live in the shared _smrt_embeddings table, keyed by class, object, field, and model — never as a column on your own table.'
				]
			}
		]
	},
	{
		slug: 'testing-your-app',
		navTitle: 'Test your application',
		eyebrow: 'Task guide',
		title: 'Test a s-m-r-t application',
		lede: 'Install the Vitest plugin. Give each test its own rolled-back database. Use one configuration to cover the model, tenant boundary, generated surfaces, and components.',
		plainEnglish:
			'Tests run against the real models and the real database rather than mocks. Each test gets a private database inside a transaction, so tests can run in parallel and leave nothing behind.',
		packages: ['smrt-vitest', 'smrt-core', 'smrt-tenancy'],
		task: {
			family: 'operate-and-ship',
			purpose: 'Test models, tenant boundaries, generated interfaces, and Svelte components.',
			prerequisites: ['A s-m-r-t application', 'Vitest', 'A generated model manifest'],
			difficulty: 'Intermediate',
			supportRange: TASK_GUIDES_PINNED_VERSION,
			concepts: ['Isolated database', 'Tenant boundary', 'Generated interface', 'Component test'],
			relatedUi: [{ label: 'UI overview', href: '/ui' }],
			relatedModules: [],
			relatedReference: [
				{ label: 'Testing reference', href: '/reference/testing' },
				{ label: 'Security reference', href: '/reference/security' }
			],
			expectedResult:
				'The test suite validates model behavior, isolation, interfaces, and components in one run.'
		},
		pinnedVersion: TASK_GUIDES_PINNED_VERSION,
		sources: [
			{ label: 'smrt-vitest README', href: `${SMRT_TREE}/packages/vitest/README.md` },
			{ label: 'smrt-vitest AGENTS.md', href: `${SMRT_TREE}/packages/vitest/AGENTS.md` },
			{
				label: 'smrt-tenancy testing helpers',
				href: `${SMRT_TREE}/packages/tenancy/src/testing.ts`
			}
		],
		sections: [
			{
				title: 'Install the plugin and write the config',
				intro:
					'@happyvertical/smrt-vitest is the required entry point for testing a s-m-r-t project. Its Vite plugin scans your sources, builds the manifest the models need, and registers classes from every @happyvertical/smrt-* dependency. Without it, tests fail with "No field metadata found" or an unregistered-class error, because the decorators never produced field metadata for the test run.',
				points: [
					'The plugin regenerates the manifest once, at Vitest startup.',
					'It also discovers the manifests of your installed s-m-r-t packages.',
					'On Vite 8 it restores legacy decorator transformation, which rolldown otherwise skips.',
					'It sets test.retry to 2 under CI and 0 locally; override with SMRT_VITEST_RETRY.'
				],
				filename: 'vitest.config.ts',
				code: `import { smrtVitestPlugin } from '@happyvertical/smrt-vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [smrtVitestPlugin()],
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['@happyvertical/smrt-vitest/setup']
  }
});`
			},
			{
				title: 'Add the dependency',
				intro:
					'The plugin is a development dependency. It carries smrt-core and the SQL adapter it needs, so nothing else has to be installed for database tests.',
				filename: 'install.sh',
				lang: 'bash',
				code: `pnpm add -D @happyvertical/smrt-vitest

# Every s-m-r-t package ships in lockstep. Match the version your app already
# depends on rather than taking whatever "latest" resolves to today.`
			},
			{
				title: 'Write the object you are going to test',
				intro:
					'Nothing about the model changes for tests. The same class the application uses is the class under test, and the plugin scans it from src by default.',
				filename: 'src/lib/objects/Article.ts',
				code: `import { ObjectRegistry, SmrtCollection, SmrtObject, smrt }
  from '@happyvertical/smrt-core';

@smrt({ api: true, mcp: true })
export class Article extends SmrtObject {
  title = '';
  body = '';
  status = 'draft';
}

export class ArticleCollection extends SmrtCollection<Article> {
  static readonly _itemClass = Article;
}

ObjectRegistry.registerCollection('Article', ArticleCollection);`
			},
			{
				title: 'Give every test its own rolled-back database',
				intro:
					'createIsolatedTestDbFromManifest reads the manifest the plugin just generated, creates the tables in foreign-key order, opens a transaction, and hands back a transaction-scoped handle. cleanup() rolls that transaction back, so the next test starts empty without dropping or recreating anything. Pass the handle to the collection as db and the collection works exactly as it does in the application.',
				points: [
					'includeObjects narrows schema creation to the classes this file needs.',
					'Classes that share a table through single-table inheritance are merged into one CREATE TABLE.',
					'createIsolatedTestDb({ schema }) is the same thing with raw DDL when you would rather write it yourself.',
					'createTestDb() exists for the rare test that must observe committed state; it has no transaction isolation.'
				],
				filename: 'src/lib/objects/__tests__/article.test.ts',
				code: `import {
  createIsolatedTestDbFromManifest,
  getAdapterDisplayName,
  type IsolatedTestDbResult
} from '@happyvertical/smrt-vitest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Article, ArticleCollection } from '../Article';

describe(\`Article (\${getAdapterDisplayName()})\`, () => {
  let ctx: IsolatedTestDbResult;
  let articles: ArticleCollection;

  beforeEach(async () => {
    ctx = await createIsolatedTestDbFromManifest({ includeObjects: ['Article'] });
    articles = await ArticleCollection.create({ db: ctx.db });
  });

  afterEach(async () => {
    await ctx.cleanup();
  });

  it('creates and reads back an article', async () => {
    const created = await articles.create({ title: 'First post', body: 'Hello' });
    expect(created).toBeInstanceOf(Article);

    const found = await articles.get(created.id as string);
    expect(found?.title).toBe('First post');
    expect(found?.status).toBe('draft');
  });

  it('starts from a clean transaction each test', async () => {
    expect(await articles.list()).toHaveLength(0);
  });
});`
			},
			{
				title: 'Run it',
				intro:
					'The plugin prints its generated result before Vitest starts. Use these lines to confirm that the manifest found the classes. An object count of zero means the scan globs are wrong. Model assertions after that result have no meaning.',
				filename: 'run.sh',
				lang: 'bash',
				code: `pnpm vitest run

# [smrt-vitest] Generating test manifest...
# [smrt-vitest] ✓ Generated manifest with 2 object(s)
# [smrt-vitest] Loaded manifests from 1/1 packages
# [smrt-vitest] ✓ Local manifest: 2 objects
#
#  Test Files  1 passed (1)
#       Tests  2 passed (2)`
			},
			{
				title: 'Pick the adapter with an environment variable',
				intro:
					'The helpers resolve the adapter from the environment instead of a flag in each test. Use TEST_DB_ADAPTER to set the adapter explicitly. Otherwise, DATABASE_URL selects PostgreSQL. Without either value, each worker uses a unique temporary SQLite file. Thus, one test file covers both engines.',
				points: [
					'getTestAdapter() returns the resolved sqlite or postgres identifier.',
					'getAdapterDisplayName() gives a label for the describe block, so failures say which engine ran.',
					'isPostgresAvailable() is a direct check on DATABASE_URL for tests you want to skip locally.',
					'Local file-backed SQLite runs without durability settings, because the databases are thrown away.'
				],
				filename: 'adapters.sh',
				lang: 'bash',
				code: `# Default: one SQLite temp file per worker.
pnpm vitest run

# Same suite against PostgreSQL.
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app_test pnpm vitest run

# Force SQLite even when DATABASE_URL is present.
TEST_DB_ADAPTER=sqlite pnpm vitest run`
			},
			{
				title: 'Test the tenant boundary, not just the happy path',
				intro:
					'A multi-tenant application should have tests that fail when isolation regresses. enableTenancy() registers the collection interceptor that filters reads and validates writes; run the body inside withTenant() to establish the context a request would normally carry. The three assertions below are the ones worth owning, because each corresponds to a different way isolation can break.',
				points: [
					'A read from another tenant returns nothing rather than raising.',
					'A cross-tenant get() resolves to null.',
					'A write whose tenantId disagrees with the context throws TenantIsolationError.',
					'An operation with no context at all throws TenantContextError.'
				],
				filename: 'src/lib/objects/__tests__/tenant.test.ts',
				code: `import { createIsolatedTestDbFromManifest } from '@happyvertical/smrt-vitest';
import { disableTenancy, enableTenancy, withTenant }
  from '@happyvertical/smrt-tenancy';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DocumentCollection } from '../Document';

describe('tenant isolation', () => {
  let ctx, documents;

  beforeEach(async () => {
    enableTenancy({ rawQueryPolicy: 'allow' });
    ctx = await createIsolatedTestDbFromManifest({ includeObjects: ['Document'] });
    documents = await DocumentCollection.create({ db: ctx.db });
  });

  afterEach(async () => {
    disableTenancy();
    await ctx.cleanup();
  });

  it('hides another tenant from list()', async () => {
    await withTenant({ tenantId: 'acme' }, () =>
      documents.create({ title: 'Acme plan', tenantId: 'acme' }));

    await withTenant({ tenantId: 'globex' }, async () => {
      await documents.create({ title: 'Globex plan', tenantId: 'globex' });
      const rows = await documents.list();
      expect(rows.map((r) => r.title)).toEqual(['Globex plan']);
    });
  });

  it('refuses a cross-tenant get()', async () => {
    const acme = await withTenant({ tenantId: 'acme' }, () =>
      documents.create({ title: 'Acme plan', tenantId: 'acme' }));

    await withTenant({ tenantId: 'globex' }, async () => {
      expect(await documents.get(acme.id)).toBeNull();
    });
  });

  it('rejects a write aimed at another tenant', async () => {
    await withTenant({ tenantId: 'acme' }, async () => {
      await expect(
        documents.create({ title: 'Smuggled', tenantId: 'globex' })
      ).rejects.toThrow(/Tenant isolation violation/);
    });
  });
});`,
				links: [
					{ label: 'The lifecycle these rules come from', href: '/guides/multi-tenant-lifecycle' },
					{ label: 'Reference: security defaults', href: '/reference/security' }
				]
			},
			{
				title: 'Test the generated surfaces in process',
				intro:
					'The MCP application server is an ordinary object with listTools and callTool. The SvelteKit mount is an ordinary request handler. Neither needs a running server during tests. Thus, the model test suite can also check the tool catalog and its policy.',
				filename: 'src/lib/server/__tests__/mcp.test.ts',
				code: `import { createMcpAppServer } from '@happyvertical/smrt-app-mcp';
import { mountMcpRoute } from '@happyvertical/smrt-app-mcp/sveltekit';
import { createIsolatedTestDbFromManifest } from '@happyvertical/smrt-vitest';
import { describe, expect, it } from 'vitest';
import '../../objects/Article';

const META = {
  'io.modelcontextprotocol/protocolVersion': '2026-07-28',
  'io.modelcontextprotocol/clientCapabilities': {}
};

it('offers only read-only tools to an anonymous caller', async () => {
  const ctx = await createIsolatedTestDbFromManifest({ includeObjects: ['Article'] });

  const POST = mountMcpRoute(
    createMcpAppServer({
      smrtOptions: () => ({ db: ctx.db }),
      serverInfo: { name: 'my-app', version: '0.1.0' },
      allowedClassNames: ['Article'],
      publicToolPatterns: () => ['article_*']
    })
  );

  const response = await POST({
    locals: {},
    url: new URL('https://app.test/api/mcp'),
    request: new Request('https://app.test/api/mcp', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'mcp-method': 'tools/list' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'tools/list', params: { _meta: META }
      })
    })
  });

  const body = await response.json();
  expect(response.status).toBe(200);
  expect(body.result.tools.map((t) => t.name)).toEqual(['article_get', 'article_list']);

  await ctx.cleanup();
});`,
				points: [
					'The same shape covers the refusals: drop the Mcp-Method header and assert a 400 with code -32020.',
					'Generated REST routes are also plain request handlers, so import the +server module and call its exported method directly.',
					'Assert the denied cases and the permitted cases. Otherwise, a tool catalog with too many entries can fail without a visible error.'
				],
				links: [
					{
						label: 'Task guide: expose your app over MCP',
						href: '/guides/expose-your-app-over-mcp'
					}
				]
			},
			{
				title: 'Test components in the same run',
				intro:
					'Component tests enable a DOM for each file instead of changing the complete project to jsdom. Thus, database tests keep the faster node environment. The svelte-setup entry adds jest-dom matchers, Testing Library cleanup, and a jsdom dialog polyfill. It first checks for a document, so it stays inactive in node-environment files.',
				filename: 'src/lib/components/ArticleCard.test.ts',
				code: `// @vitest-environment jsdom
import { render, screen, userEvent, expectNoA11yViolations }
  from '@happyvertical/smrt-vitest/svelte';
import { describe, it } from 'vitest';
import ArticleCard from './ArticleCard.svelte';

describe('ArticleCard', () => {
  it('publishes from the card', async () => {
    const { container } = render(ArticleCard, {
      props: { title: 'First post', status: 'draft' }
    });

    await userEvent.click(screen.getByRole('button', { name: 'Publish' }));
    await expectNoA11yViolations(container);
  });
});`,
				points: [
					'Add the setup entry alongside your existing one: setupFiles: [..., "@happyvertical/smrt-vitest/svelte-setup"].',
					'The /svelte subpath re-exports render, screen, fireEvent, within, and userEvent from one import.',
					'expectNoA11yViolations runs axe with color contrast disabled, because jsdom does not paint.'
				]
			},
			{
				title: 'Run the whole thing in CI',
				intro:
					'A single job covers both engines if you run the suite twice, or one engine if that matches your deployment. The PostgreSQL service below is what makes DATABASE_URL meaningful; without it the same workflow silently tests SQLite only.',
				filename: '.github/workflows/test.yml',
				lang: 'yaml',
				code: `name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: app_test
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v5
      - uses: pnpm/action-setup@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile

      - name: Tests (SQLite)
        run: pnpm vitest run

      - name: Tests (PostgreSQL)
        run: pnpm vitest run
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/app_test`
			},
			{
				title: 'The failures that are worth recognising',
				intro:
					'Most confusing test failures in a s-m-r-t project come from the manifest or from module state rather than from the assertion that reported them. These four account for nearly all of it.',
				points: [
					'"No field metadata found" or an unregistered class means the plugin is missing from this config, or the scan globs never reached your sources.',
					'Watch mode can keep the manifest generated at startup. A new field can then appear to be ignored. Restart Vitest after you add classes or fields.',
					'A module-level singleton cache inside a collection survives between tests and ignores fresh mocks; call vi.resetModules() in beforeEach and await import(...) inside the test instead of importing at the top.',
					'A create() on a tenant-scoped class whose tenant field is declared non-nullable fails validation before the interceptor can populate it. Either pass tenantId explicitly, or declare the field nullable so the context fills it.'
				],
				links: [{ label: 'Reference: testing contracts', href: '/reference/testing' }]
			}
		]
	}
];

export interface GuideLibraryItem {
	href: string;
	title: string;
	summary: string;
	packages: string[];
	task: TaskGuide['task'];
	stepCount: number;
}

interface MigrationGuideDestination {
	href: string;
	stepCount: number;
}

const migrationGuideDestinations = new Map<string, MigrationGuideDestination>([
	['start-with-basic-sveltekit', { href: '/starters/ground-up', stepCount: 3 }],
	['start-with-saas-starter', { href: '/starters/saas', stepCount: 4 }],
	['add-generated-interfaces', { href: '/foundations/interfaces', stepCount: 3 }]
]);

function guideLibraryItem(
	guide: TaskGuide,
	href: string,
	stepCount = guide.sections.length
): GuideLibraryItem {
	return {
		href,
		title: guide.navTitle ?? guide.title,
		summary: guide.plainEnglish,
		packages: guide.packages,
		task: guide.task,
		stepCount
	};
}

/**
 * Section-owned guide catalog. Existing route paths stay in place until #187
 * performs the coordinated route and integration migration.
 */
export const guideLibrary: GuideLibraryItem[] = [
	...guideMigrationDrafts.map((guide) => {
		const destination = migrationGuideDestinations.get(guide.slug);
		return guideLibraryItem(
			guide,
			destination?.href ?? `/guides/${guide.slug}`,
			destination?.stepCount
		);
	}),
	...taskGuides.map((guide) => guideLibraryItem(guide, `/guides/${guide.slug}`))
];

export function guideLibraryItemsInFamily(family: TaskGuideFamilyId): GuideLibraryItem[] {
	return guideLibrary.filter((guide) => guide.task.family === family);
}

export function getGuideLibraryItem(href: string): GuideLibraryItem | undefined {
	return guideLibrary.find((guide) => guide.href === href);
}

export function guideLibrarySearchTerms(guide: GuideLibraryItem): string[] {
	const family = getTaskGuideFamily(guide.task.family);
	return [
		family.label,
		family.description,
		guide.title,
		guide.summary,
		guide.task.purpose,
		guide.task.difficulty,
		guide.task.supportRange,
		...guide.task.prerequisites,
		...guide.task.concepts,
		...guide.packages,
		...guide.task.relatedUi.map((link) => link.label),
		...guide.task.relatedModules.map((link) => link.label),
		...guide.task.relatedReference.map((link) => link.label),
		guide.task.expectedResult
	];
}

export function guidesInTaskFamily(family: TaskGuideFamilyId): TaskGuide[] {
	return taskGuides.filter((guide) => guide.task.family === family);
}

export function taskGuideSiblings(guide: TaskGuide): TaskGuide[] {
	return guidesInTaskFamily(guide.task.family).filter((candidate) => candidate.slug !== guide.slug);
}

export function getTaskGuide(slug: string): TaskGuide | undefined {
	return taskGuides.find((guide) => guide.slug === slug);
}
