import type { Guide } from '$lib/data/guides';

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
export const TASK_GUIDES_PINNED_VERSION = '0.40.61';

/** Canonical upstream tree for the release above. */
const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${TASK_GUIDES_PINNED_VERSION}`;

/**
 * Task guides are the runnable, end-to-end pages: each one walks a single job
 * from an empty file to a verified result. They deliberately cross section
 * boundaries — a task usually touches foundations, a capability, and tooling —
 * and they link to the reference pages instead of restating them.
 */
export const taskGuides: Guide[] = [
	{
		slug: 'multi-tenant-lifecycle',
		navTitle: 'Multi-tenant lifecycle',
		eyebrow: 'Task guide',
		title: 'Run a tenant from creation to a scoped request',
		lede: 'Create tenants and their hierarchy, give a user a membership and a role, scope your own models, switch the active tenant safely, and know exactly which of those rules the database enforces for you.',
		plainEnglish:
			'A tenant is the boundary that separates one customer account from another. This guide follows one tenant from the row that creates it to a request that can only see that tenant’s data.',
		packages: ['smrt-users', 'smrt-tenancy', 'smrt-core'],
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
					'The split between the two packages is the thing that most often sends a first attempt into an import error. smrt-users owns the records — Tenant, User, Role, Membership, Permission, Session — and their collections. smrt-tenancy owns no models at all: it is the context and enforcement layer, providing the decorators, the request context, the collection interceptor, and the test helpers.',
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
					'Two things must exist before a membership can. The tables come from a migration, and the built-in roles come from a seed call that also populates the permission catalogue. Both are ordinary application startup work rather than CLI-only steps, which is what makes them easy to run in a script and in a test.',
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
					'A membership is the join between one user, one tenant, and one role. There is no addMember helper — you create the row like any other, which keeps the role decision explicit at the call site rather than hidden in a convenience method.',
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
					'Marking a model tenant-scoped is what connects it to the interceptor. Either spelling below registers the same configuration; the decorator form keeps the tenant field visible in the class, and the core-option form avoids importing smrt-tenancy in your model file.',
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
					'Nothing is scoped until something establishes the tenant context. In SvelteKit that is two handles in sequence: the tenancy handle opens the async context for the request, and the session handler resolves the signed-in user, their membership, their permission snapshot, and the active tenant. Outside a request — a script, a job, a test — withTenant does the same job around a function.',
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
					'Switching is the operation most worth getting right, because it is reachable from user input. The helper verifies the caller holds an active membership in the target tenant before it writes anything, then mints a new session and revokes the old one so a stolen identifier cannot follow the user into the new tenant.',
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
					'The membership check is fail-closed, so the tenant id may come from untrusted form data — but the boolean result must be honoured.',
					'A successful switch into a tenant rotates the session id; the helper re-sets the cookie for you.',
					'Clearing the tenant by passing null does not rotate.',
					'If you call SessionService.switchTenant directly, persist the returned sessionId yourself.'
				]
			},
			{
				title: 'What the data layer actually enforces',
				intro:
					'Once the interceptor is enabled and a class is registered, list, get, count, save, and delete are all covered. The behaviours below are worth committing to memory because they differ from each other: a read that reaches the wrong tenant comes back empty, while a write that names the wrong tenant raises.',
				points: [
					'list() and count() have the tenant predicate injected, so another tenant’s rows are simply absent.',
					'get() with a bare id becomes a lookup on id and tenant together, and returns null across a boundary rather than throwing.',
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
					'Context does not survive an async boundary such as a timer, an emitter, or a queue consumer unless you wrap the callback with TenantContext.bind or runWithJobContext.'
				]
			},
			{
				title: 'Add row-level security where the database supports it',
				intro:
					'On PostgreSQL the same rules can be pushed into the database, so a query that skips the collection layer is still constrained. The generated policies read request-scoped settings that the session layer publishes inside the transaction; on SQLite the same permission set is still resolved and carried, but the database has no per-operation teeth.',
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
		lede: 'Turn the objects you already have into agent tools: generate a local stdio server, mount the stateless HTTP endpoint, call it with curl, and connect a real client — with the authorization boundary in the right place.',
		plainEnglish:
			'MCP lets an agent call your application’s operations as tools. The tools come from the same models your app already uses, so permissions, tenants, and field rules stay where they are.',
		packages: ['smrt-app-mcp', 'smrt-core', 'smrt-app-cli'],
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
					'The generated stdio server is the Tier 1 surface for an agent running on the same machine as the application. It reads its database credentials from the environment and has no per-request principal, which is exactly why it stays local.',
				callout: {
					variant: 'tip',
					title: 'Choose the output language by extension',
					body: 'The default .js target is transpiled to runnable ESM JavaScript. Ask for a .ts or .mts path when you want to keep the annotated TypeScript for tsx or Node type stripping; CommonJS .cjs and .cts targets are rejected.'
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
					'A stdio server speaks JSON-RPC on stdout, so you can drive it from a shell and see the tool catalogue directly. This is the fastest way to confirm your classes were scanned before a client failure sends you looking in the wrong place.',
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
					'The HTTP surface is a different object with a different job. createMcpAppServer wraps the generated tools with four independent gates: the allow-list decides which classes are reachable at all, public patterns decide what an anonymous caller may see, the tool policy decides per principal, and workflow assertions run before dispatch.',
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
					'The mount serves server/discover, tools/list, and tools/call, and reports only the tools capability.',
					'Tool discovery is sorted by name, so the catalogue is deterministic.',
					'Exporting it as GET returns 405 with code -32000.'
				]
			},
			{
				title: 'Call it with curl',
				intro:
					'A stock client sends more than the JSON-RPC body: the request carries a per-request envelope naming the protocol revision, and headers that must agree with the body. Reproducing that by hand is the quickest way to confirm the endpoint is live and the policy is doing what you meant.',
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
					'The anonymous catalogue above contains only the read-only tools, because the base rule admits nothing else without a principal.'
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
					{ label: 'The development plane: smrt-dev-mcp', href: '/tooling/dev-mcp' }
				]
			},
			{
				title: 'Keep the two planes apart',
				intro:
					'It is worth restating which server does what, because the failure mode of confusing them is an agent with the wrong authority. The development server reads your workspace and cannot touch application data. The generated and application servers operate on data and know nothing about your repository layout.',
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
		lede: 'Declare which fields carry meaning, generate their embeddings, and query a collection with semanticSearch or findSimilar — then read the ranked results honestly, including where the ranking happens relative to your filters.',
		plainEnglish:
			'Semantic search finds records that mean something similar to a query, even when they share no words with it. The vectors that make that possible are stored beside your data and refreshed when the text changes.',
		packages: ['smrt-core', 'smrt-tenancy'],
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
					'The project-level block decides which model produces the numbers. Local embedding runs on your machine through a transformers runtime and needs no API key; the ai provider calls the configured model provider through the SDK adapter. The default is local, at 768 dimensions.',
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
					'Saving a record schedules embedding generation, but that path is deliberate about its conditions: it only runs when a model client is resolvable, and it is not awaited. For a script, a seed, or a test you want the explicit call, because it finishes before the next line runs.',
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
					'semanticSearch embeds the query text and returns hydrated model instances — real objects with their methods — each carrying a _similarity score between zero and one, sorted from most to least similar. findSimilar does the same starting from a record you already have.',
				filename: 'search.ts',
				code: `const hits = await recipes.semanticSearch('baking bread at home', { limit: 3 });

hits.map((hit) => [hit.title, hit._similarity]);
// [ ['Sourdough loaf',  0.7203995814592284],
//   ['Tomato soup',     0.5640168165699766],
//   ['Bicycle repair',  0.5138145283587121] ]

const related = await recipes.findSimilar(hits[0], { limit: 5 });`,
				points: [
					'The threshold option is named minSimilarity and defaults to 0. It is a floor, not a cut-off between clusters: adding minSimilarity: 0.5 to the call above would still return all three rows, because the weakest one scores 0.514.',
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
					'The ranking stage and the filtering stage are separate, and knowing which runs first explains most surprising result sets. Similarity is computed over every stored vector for the class, truncated to limit, and only then are the surviving ids loaded through the collection — where tenant scope and your where clause finally apply.',
				callout: {
					variant: 'warning',
					title: 'limit counts candidates, not results',
					body: 'Truncation happens before tenant scope and the where clause are applied, so a query with limit 10 can return fewer than ten rows even when more matches exist. Over-fetch and trim, rather than treating limit as a page size.'
				},
				points: [
					'Nothing leaks: a tenant-scoped class still filters at the hydration step, so another tenant’s rows never reach the caller.',
					'Field policy is not applied. Results are fully hydrated instances, so sensitive-field rules that live in the generated interfaces are not in this path — project the fields you return, as the route above does.',
					'With json storage, every vector for the class is read and parsed on every query. That is fine for a catalogue and wrong for a corpus.',
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
					'Native storage moves the comparison into the database. On PostgreSQL the extension and column are created for you on first use; on SQLite it requires opting into the native capability, which also means a local file rather than a remote connection.',
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
		lede: 'Install the Vitest plugin, give every test its own rolled-back database, and cover the model, the tenant boundary, the generated surfaces, and the components from one configuration.',
		plainEnglish:
			'Tests run against the real models and the real database rather than mocks. Each test gets a private database inside a transaction, so tests can run in parallel and leave nothing behind.',
		packages: ['smrt-vitest', 'smrt-core', 'smrt-tenancy'],
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
					'The plugin prints what it generated before Vitest starts. Those lines are the fastest check that the manifest actually saw your classes: if the object count is zero, the scan globs are wrong and every model assertion afterwards would be meaningless.',
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
					'The helpers resolve the adapter from the environment rather than from a flag in each test. TEST_DB_ADAPTER wins if it is set; otherwise DATABASE_URL selects PostgreSQL; otherwise the run uses a unique SQLite temp file per worker. The same test file therefore covers both engines without a second copy.',
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
					'The MCP application server is an ordinary object with listTools and callTool, and the SvelteKit mount is an ordinary function from a request to a response. Neither needs a running server to test, so the tool catalogue and the policy that shapes it can be asserted in the same suite as the models.',
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
					'Assert the denied cases as well as the permitted ones; a catalogue that is too large fails silently otherwise.'
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
					'Component tests opt into a DOM per file rather than switching the whole project to jsdom, so database tests keep the faster node environment. The svelte-setup entry adds jest-dom matchers, Testing Library cleanup, and a jsdom dialog polyfill; it checks for a document first, so it stays inert in node-environment files.',
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
					'expectNoA11yViolations runs axe with colour contrast disabled, because jsdom does not paint.'
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
					'A model whose new field is ignored usually means watch mode is still holding the manifest generated at startup; restart Vitest after adding classes or fields.',
					'A module-level singleton cache inside a collection survives between tests and ignores fresh mocks; call vi.resetModules() in beforeEach and await import(...) inside the test instead of importing at the top.',
					'A create() on a tenant-scoped class whose tenant field is declared non-nullable fails validation before the interceptor can populate it. Either pass tenantId explicitly, or declare the field nullable so the context fills it.'
				],
				links: [{ label: 'Reference: testing contracts', href: '/reference/testing' }]
			}
		]
	}
];

export function getTaskGuide(slug: string): Guide | undefined {
	return taskGuides.find((guide) => guide.slug === slug);
}
