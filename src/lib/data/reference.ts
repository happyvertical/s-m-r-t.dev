import type { Guide } from '$lib/data/guides';

/**
 * Released s-m-r-t version the pinned reference pages were verified against. It
 * is a deliberate audit anchor rather than the built version: when it moves,
 * re-read the canonical sources listed on each page and re-run the checks
 * behind them.
 */
const REFERENCE_PINNED_VERSION = '0.40.61';

const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${REFERENCE_PINNED_VERSION}`;

export const referenceGuides: Guide[] = [
	{
		slug: 'saadl',
		navTitle: 'What is a SAADL?',
		eyebrow: 'Framework concept',
		title: 'Software as Agentic Domain Logic',
		lede: 'A SAADL application exposes the same domain operations to people and software agents instead of maintaining a separate, reduced bot interface.',
		plainEnglish:
			'Define the work once. People can reach it through pages, HTTP, or the command line, while agents receive callable tools that resolve to the same models, permissions, and field policies.',
		packages: ['smrt-core', 'smrt-app-mcp', 'smrt-app-cli', 'smrt-web'],
		visual: 'surfaces',
		sections: [
			{
				title: 'One definition, several ways to operate it',
				intro:
					'The domain model is the source of truth. REST routes, CLI commands, MCP and WebMCP tools, and human interfaces are projections of that same model rather than independent implementations that drift apart.'
			},
			{
				title: 'Useful to operators and builders',
				intro:
					'An operating agent receives the same permitted capabilities as a person. A coding agent receives a manifest of the objects, fields, relationships, and generated tools, so it can understand and change one definition instead of rediscovering every interface.'
			},
			{
				title: 'What does not count',
				intro:
					'A chatbot beside an application is not automatically SAADL. Neither is an agent-only tool or a generated UI. The defining property is parity: human and agent operations resolve through the same domain logic and security boundaries.'
			},
			{
				title: 'Why s-m-r-t uses this shape',
				intro:
					'One model reduces duplicated code and review, keeps the codebase map current, makes infrastructure replaceable, and lets hardening flow from shared framework packages into each application.'
			}
		],
		related: [
			{
				label: 'Agent-legible applications',
				href: '/capabilities/agent-legible-applications'
			},
			{ label: 'Connect APIs, tools, and agents', href: '/foundations/interfaces' },
			{ label: 'The development MCP server', href: '/tooling/dev-mcp' }
		]
	},
	{
		slug: 'security',
		navTitle: 'Security defaults',
		eyebrow: 'Reference',
		title: 'Generated interfaces fail closed',
		lede: 'Generated routes require an authenticated principal unless public access is explicitly declared, and field policy is applied before data leaves or enters the application.',
		plainEnglish:
			'Private is the default. Secret fields stay out of responses and filters, while read-only and server-managed fields are removed from client writes.',
		packages: ['smrt-core', 'smrt-users', 'smrt-tenancy'],
		sections: [
			{
				title: 'Authentication is the default',
				intro:
					'When api.public is not set, generated reads and writes require a resolved principal. Use public: "read" to open only reads or public: true when every generated action is intentionally public.',
				filename: 'Invoice.ts',
				code: `@smrt({\n  api: { include: ['list', 'get', 'create', 'update'] }\n})\nclass Invoice extends SmrtObject {\n  amount = 0;\n}\n\n// No api.public declaration: generated routes require authentication.`
			},
			{
				title: 'Sensitive fields close both read paths',
				intro:
					'A sensitive field is removed from public serialization and rejected in collection filters. Both protections matter: hiding output alone would still allow a caller to probe a secret value through repeated where clauses.'
			},
			{
				title: 'Write policy blocks mass assignment',
				intro:
					'Generated create and update handlers strip read-only fields, IDs, timestamps, tenant IDs, underscore-prefixed keys, and anything outside an optional writable allowlist before the model sees the request body.'
			},
			{
				title: 'Application code still owns its boundary',
				intro:
					'Generated routes enforce these defaults. Custom actions, jobs, direct collection calls, external callbacks, and product-specific threat models still need deliberate principal, tenant, permission, and input checks.',
				callout: {
					variant: 'security',
					title: 'The defaults do not extend to hand-written paths',
					body: 'A generated route resolves the principal, applies the tenant scope, and filters fields for you. Code you write yourself does none of that automatically: a custom endpoint, background job, webhook receiver, or direct collection call runs with whatever authority you hand it. Treat every hand-written entry point as unauthenticated until it proves otherwise.'
				}
			},
			{
				title: 'Authentication is not authorization',
				intro:
					'These defaults answer whether a caller is known. Whether that caller may perform this operation on this tenant is a separate decision, made against the permission catalog by an application guard and, on Postgres, optionally by row-level security policies you generate and apply yourself.'
			},
			{
				title: 'Field policy is presentation, not enforcement',
				intro:
					'A field hidden by field policy is still writable through the generated API unless the model says otherwise. A policy cannot store a default on a sensitive, transient, or read-permission-gated field, and the batch resolve response omits those fields for every caller.',
				callout: {
					variant: 'warning',
					title: 'Hiding a field does not protect it',
					body: 'Field policy decides what an interface shows, not what the API accepts. A field you hide is still writable unless the model marks it read-only, server-managed, or outside the writable allowlist. Put the guarantee on the model and treat the policy as presentation.'
				}
			}
		],
		related: [
			{ label: 'Authorization model', href: '/reference/authorization' },
			{ label: 'Field policies', href: '/capabilities/field-policies' },
			{ label: 'Field policy API', href: '/reference/field-policies' }
		]
	},
	{
		slug: 'authorization',
		navTitle: 'Authorization model',
		eyebrow: 'Reference',
		title: 'The permission catalog, the guard, and row-level security',
		lede: 'Every public model operation contributes a named permission. An application guard checks that catalog before it acts, and on Postgres your tenant-scoped models can generate row-level security policies that check the same names on each row.',
		plainEnglish:
			'Your models produce a list of permission names. Application code checks that list before it acts, and Postgres can check it again on every row it returns or writes.',
		packages: ['smrt-users', 'smrt-core', 'smrt-tenancy'],
		pinnedVersion: REFERENCE_PINNED_VERSION,
		sources: [
			{ label: 'smrt-users README', href: `${SMRT_TREE}/packages/users/README.md` },
			{ label: 'smrt-users AGENTS.md', href: `${SMRT_TREE}/packages/users/AGENTS.md` },
			{
				label: 'PostgresPermissionPolicies.ts',
				href: `${SMRT_TREE}/packages/users/src/services/PostgresPermissionPolicies.ts`
			},
			{
				label: 'SessionPermissionContext.ts',
				href: `${SMRT_TREE}/packages/users/src/services/SessionPermissionContext.ts`
			},
			{
				label: 'Postgres row security policies',
				href: 'https://www.postgresql.org/docs/current/ddl-rowsecurity.html'
			}
		],
		sections: [
			{
				title: 'Three parts, derived from one list',
				intro:
					'The catalog is the list of permission names the application recognizes. The guard is a function application code calls before it acts. Row-level security is a set of Postgres policies generated from the same list. Each part is optional, and each answers a different question.',
				points: [
					'The catalog names operations. It grants nothing on its own: syncing it creates Permission rows and never assigns them to a role.',
					'The guard decides. It resolves the principal permissions for a tenant and refuses an operation whose slug is missing from the catalog.',
					'Row-level security re-checks. Policies sit on the table, so a query that never called the guard is still evaluated against the session tenant and permission list. They are generated from your tenant-scoped models rather than read out of the catalog, and they use the same slug scheme.',
					'Roles connect the two ends. A permission reaches a person through a membership role, a group role, a tenant-level override, or a per-user override — never from the catalog alone.'
				]
			},
			{
				title: 'The catalog is derived from the manifest',
				intro:
					'Every operation exposed through the generated API, CLI, or MCP surface contributes a slug of the form collection.action, including custom methods. Methods that are not exposed on any surface are not added. syncPermissionCatalog writes the discovered set into the Permission table.',
				points: [
					'list and get both normalize to collection.read; create, update, and delete stay separate.',
					'A surface you do not configure counts as enabled. A CRUD slug is left out only when every surface — api, cli, and mcp — excludes or disables that action.',
					'A custom action such as publish becomes articles.publish, as long as some surface exposes it.',
					'A field that declares a readPermission contributes that slug as well.',
					'Sync is additive: it creates missing rows and updates name, description, and category by slug.',
					'Sync does not grant anything to a role and does not delete stale permissions.'
				],
				filename: 'src/lib/server/permissions.ts',
				code: `import { SmrtObject, smrt } from '@happyvertical/smrt-core';\nimport { syncPermissionCatalog } from '@happyvertical/smrt-users';\nimport { getSmrtConfig } from '$lib/server/smrt';\n\n@smrt({\n  api: { include: ['list', 'get', 'create', 'update'] },\n  collection: 'articles',\n  mcp: { include: ['publish'] },\n  tenantScoped: { mode: 'required' }\n})\nclass Article extends SmrtObject {\n  tenantId = '';\n  title = '';\n  async publish() { return true; }\n}\n\n// articles.read, articles.create, articles.update, articles.publish\n// — and articles.delete, because no cli config was declared and an\n// unconfigured surface counts as enabled.\nconst result = await syncPermissionCatalog(getSmrtConfig('Permission'));\nresult.created; // slugs written on this run`
			},
			{
				title: 'Packages and configuration add to the same list',
				intro:
					'A catalog entry can come from three sources: the manifest, the users block of smrt.config.ts, and a runtime registration. Runtime registration is how a framework package contributes its own capabilities, and the merged catalog records which source an entry came from.',
				points: [
					'registerPermissionDefinitions returns an unregister function, so a definition can be scoped to a bootstrap or a test.',
					'Field policy uses the runtime path, not the manifest: importing @happyvertical/smrt-fields calls ensureFieldPolicyPermissionsRegistered, which adds fields.policy.manage and fields.policy.personalize with source runtime.',
					'Those two entries declare no Postgres bindings, and FieldPolicy is deliberately not tenant-scoped, so its table is skipped by policy generation and both permissions are enforced by the guard alone.',
					'Custom entries in smrt.config.ts may declare explicit Postgres bindings; conflicting metadata for one slug throws rather than silently winning.'
				],
				filename: 'src/lib/server/register-permissions.ts',
				code: `import { registerPermissionDefinitions } from '@happyvertical/smrt-users';\n\nconst unregister = registerPermissionDefinitions([\n  {\n    slug: 'invoices.export',\n    category: 'billing',\n    name: 'Export Invoices',\n    description: 'Allows exporting invoices'\n  }\n]);\n\n// The slug is now in catalog.permissions with source 'runtime'\n// and is eligible for syncPermissionCatalog() and the guard.\n// Call unregister() to remove it again.`,
				links: [{ label: 'Field policy operations', href: '/capabilities/field-policy-operations' }]
			},
			{
				title: 'The guard is for the code you write yourself',
				intro:
					'assertOperationPermission derives the same slug the catalog uses, requires that slug to exist, and then resolves the principal permissions in the ordinary order: membership role, group role, tenant override, then user override. Call it in form actions, custom endpoints, jobs, and CLI scripts — anywhere a generated route is not doing the work.',
				points: [
					'It throws OperationPermissionError, which carries status: 403, unless the decision is allowed or you passed onDeny: "return". Mapping that to an HTTP response is the application’s job outside the ready-made handlers.',
					'A slug that is not in the catalog is refused with reason unknown_permission, so a typo denies rather than passes.',
					'A call missing either a resolvable user or a resolvable tenant is refused with reason missing_principal.',
					'checkOperationPermission, hasOperationPermission, and onDeny: "return" give a decision or a boolean instead of an exception.',
					'For resource-anchored authorization pass the resource tenant id, and omit membership so the resolver looks it up; a membership from a different tenant is refused by design.',
					'Both bypasses default to allowed and system context is checked first, so an operation that must require an explicit grant needs allowSuperAdminBypass: false and allowSystemContextBypass: false.',
					'Neither bypass comes from a user record. They are set by the code that wrapped the call — withSystemContext, withSuperAdminBypass, or the matching context options — so passing superAdminBypass: true to the session handler publishes it on every request.'
				],
				filename: 'src/routes/articles/+page.server.ts',
				code: `import { assertOperationPermission } from '@happyvertical/smrt-users';\nimport { getSmrtConfig } from '$lib/server/smrt';\n\nexport const actions = {\n  publish: async ({ locals, params }) => {\n    const article = await loadArticle(params.id);\n\n    // Throws OperationPermissionError (status 403) when denied.\n    await assertOperationPermission({\n      ...getSmrtConfig('Permission'),\n      collection: 'articles',\n      action: 'publish',\n      userId: locals.user.id,\n      // The resource tenant, not the session tenant.\n      tenantId: article.tenantId\n    });\n\n    await article.publish();\n  }\n};`
			},
			{
				title: 'One context publishes the principal to the database session',
				intro:
					'withSessionPermissionContext loads the session, resolves its permissions, opens a transaction, and writes the principal onto that transaction with set_config. Generated SvelteKit routes pick that transaction up through the generated getCollection helper, and getRequestScopedDatabase hands it to code you write. The policies then apply to every query on that connection, whichever entry point issued it.',
				points: [
					'Six transaction-local settings are published: smrt.tenant_id, smrt.user_id, smrt.session_id, smrt.permissions, smrt.super_admin_bypass, and smrt.system_context.',
					'smrt.permissions is the resolved slug list as a JSON array; the policies read it as jsonb.',
					'One request is one transaction. It is opened before the route runs and committed after, an unhandled error rolls back everything the request wrote, and work that outlives the handler runs after the commit and outside the policies.',
					'The wrapper needs a database adapter that supports beginTransaction. It throws on the first request that enters the context, not at boot, and inside the session handler that throw is caught.',
					'Pass postgresRls to createSessionHandler explicitly. The handler reads its own option, not the config flag, for the two behaviors below.',
					'With the handler option set, an anonymous request still enters the context and runs with an empty permission list rather than outside the policies, and a failure to establish the context returns a bare 500. That catch wraps the whole request, so an error thrown later in the route becomes the same 500. With only permissions.postgres.enabled in smrt.config.ts, anonymous requests skip the context and a context failure is logged and the request served.',
					'getCollection only reaches for the request transaction when neither the call site nor objectOverrides supplies a db. An object pinned to its own connection runs outside the published variables, where the policies match nothing.',
					'skipPaths is checked first, so a skipped route never enters the context. On a policy-covered table it will therefore read no rows at all.'
				],
				filename: 'src/hooks.server.ts',
				code: `import { createSessionHandler } from '@happyvertical/smrt-users/sveltekit';\n\nexport const handle = createSessionHandler({\n  db: { type: 'postgres', url: process.env.DATABASE_URL! },\n  ttl: 604800,\n  enterTenantContext: true,\n  postgresRls: true\n});\n\n// event.locals now carries { user, membership, permissions, tenantId, sessionId }\n// and the request runs inside a transaction whose session variables the\n// generated policies read.`,
				callout: {
					variant: 'security',
					title: 'The config flag alone does not harden the handler',
					body: 'The session handler reads its own postgresRls option when it decides whether to enter the context for an anonymous request and whether a context failure becomes a 500. Setting only permissions.postgres.enabled in smrt.config.ts still opens the transaction for a request that carries a session cookie, but anonymous requests skip the context and a context failure is logged and the request served anyway. Pass postgresRls: true to createSessionHandler as well.'
				}
			},
			{
				title: 'What the generated policies check',
				intro:
					'generatePostgresPermissionSql emits three helper functions and, for each covered table, ENABLE and FORCE ROW LEVEL SECURITY plus a drop-and-create policy pair for every action that has at least one permission bound to it. Apart from the bypass, a policy requires both the tenant match and the permission, so neither one alone opens a row. Because current_setting is read with the missing_ok flag, a connection that never entered the context resolves to no tenant and an empty permission list, and matches nothing.',
				lang: 'sql',
				filename: 'generated-policies.sql',
				code: `CREATE OR REPLACE FUNCTION smrt_has_permission(required_permission text)\nRETURNS boolean\nLANGUAGE sql\nSTABLE\nAS $$\n  SELECT smrt_rls_bypass()\n      OR jsonb_exists(COALESCE(NULLIF(current_setting('smrt.permissions', true), ''), '[]')::jsonb, required_permission)\n$$;\n\nALTER TABLE "public"."articles" ENABLE ROW LEVEL SECURITY;\nALTER TABLE "public"."articles" FORCE ROW LEVEL SECURITY;\n\nDROP POLICY IF EXISTS "smrt_articles_select_44e06f89" ON "public"."articles";\n\nCREATE POLICY "smrt_articles_select_44e06f89" ON "public"."articles"\n  FOR SELECT USING (\n    smrt_rls_bypass()\n    OR (("tenant_id"::text = smrt_current_tenant_id())\n        AND (smrt_has_permission('articles.read')))\n  );`,
				points: [
					'smrt_rls_bypass reads smrt.system_context and smrt.super_admin_bypass, mirroring the two bypasses the guard honors.',
					'smrt_current_tenant_id reads smrt.tenant_id and returns null when it is unset or empty.',
					'FORCE ROW LEVEL SECURITY is applied as well as ENABLE, so the table owner is also subject to the policies.',
					'Postgres still exempts superusers and any role holding BYPASSRLS. Connect the application as an ordinary role, or the policies are inert.',
					'SELECT and DELETE use USING; INSERT uses WITH CHECK; UPDATE uses both with the same condition.'
				]
			},
			{
				title: 'Enable row-level security in order',
				intro:
					'Installing the policies and publishing the principal are two separate switches, and neither enforces anything alone. applyPostgresPermissionPolicies installs the policies; permissions.postgres.enabled or a postgresRls option makes requests publish the session variables those policies read. Generation reads the in-process object registry rather than the database, so the script has to import the module that registers your models first.',
				points: [
					'Import your model registration before generating. A script that loads only smrt-users produces zero targets and zero skips, applies the three helper functions, and exits cleanly without covering anything.',
					'Seed the grants between syncing and applying. Sync creates permission rows and assigns none, so policies applied before any role holds the new slugs take every covered table to zero rows. The default matrix gives owner and admin every catalog permission.',
					'Preview and read result.skipped. A table is skipped when the object is not tenant-scoped, when tenantScoped.mode is not "required", when no schema table name is available, or when several objects share one table.',
					'applyPostgresPermissionPolicies refuses a connection it does not detect as Postgres. It is not transactional: statements run one at a time, so a failure part way through leaves partial state — fix the cause and re-run.',
					'Re-running is safe for tables still in the target set, because each policy is dropped and recreated. A table that leaves the set keeps its old policies and its forced RLS; drop those by hand.',
					'The automatic action mapping is fixed at SELECT/INSERT/UPDATE/DELETE to read/create/update/delete. A custom permission takes part only through an explicit Postgres binding — and a binding also forces RLS on that table, so bind every action you need or the unbound ones become deny-only.',
					"Verify rather than assume: select tablename, policyname from pg_policies where policyname like 'smrt_%', and confirm the application role is neither a superuser nor a BYPASSRLS role."
				],
				filename: 'scripts/apply-rls.ts',
				code: `import {\n  applyPostgresPermissionPolicies,\n  generatePostgresPermissionSql,\n  RoleCollection,\n  syncPermissionCatalog\n} from '@happyvertical/smrt-users';\n\n// Registers your models in the object registry. Without this the\n// generator sees no tables and applies nothing.\nimport '$lib/server/smrt-register';\n\nconst db = { db: { type: 'postgres' as const, url: process.env.DATABASE_URL! } };\n\nawait syncPermissionCatalog(db);\n\nconst roles = await RoleCollection.create(db);\nawait roles.seedSystemRoles({ seedPermissions: true });\n\nconst preview = generatePostgresPermissionSql(db);\nconsole.log(preview.targets); // tables that will be covered\nconsole.log(preview.skipped); // and why the rest were not\n\nawait applyPostgresPermissionPolicies(db);`,
				callout: {
					variant: 'warning',
					title: 'A clean run is not proof of coverage',
					body: 'Generation reads the in-process object registry, not the database. A script that never imports your model registration finds no tables, applies only the three helper functions, and exits successfully — leaving nothing enforced. Check preview.targets before trusting the run, then confirm in the database with pg_policies.'
				}
			},
			{
				title: 'Where the two layers see different things',
				intro:
					'The guard and the policies read the same permission list but scope it differently. Which layer answers a given request determines what is actually enforced.',
				points: [
					'Row filtering follows the session tenant. A root-tenant session acting on a child tenant row is authorized by the guard when you pass the resource tenant id, not by row-level security. On a covered table the operation is therefore permitted but the row stays invisible: the session has to switch to the child tenant, which rotates the session id.',
					'A session whose tenant is the child tenant does get inherited authority in the policies, because the permission list is resolved before it is published.',
					'A skipped table has no policies at all. For those tables the guard is the only check, so treat result.skipped as a list of places application code has to carry.',
					'The bypass helpers are shared, so an operation that must resist a super-admin needs allowSuperAdminBypass: false in the guard and an explicit design decision at the data layer as well.'
				]
			},
			{
				title: 'Applications that do not run Postgres',
				intro:
					'Row-level security is a Postgres feature and there is no SQLite equivalent here. On SQLite the catalog and the guard work unchanged, permissions still resolve, and the context still carries the principal — but nothing is enforced at the data layer, so the guard is the whole boundary.',
				points: [
					'applyPostgresPermissionPolicies throws on a non-Postgres connection.',
					'Setting postgresRls on a connection that is not Postgres runs the request without the transaction and without the session variables instead of failing, so the flag alone is not evidence that policies are in force.',
					'Pass the published set as permissionSet so a guard check authorizes against the same snapshot the policies would have read, rather than re-resolving mid-request.',
					'A development database on SQLite and a production database on Postgres therefore differ in enforcement, not only in performance. Cover permission behavior with tests that exercise the guard directly.'
				],
				filename: 'src/lib/server/tool-guard.ts',
				code: `import {\n  assertOperationPermission,\n  getCurrentSessionPermissionContext\n} from '@happyvertical/smrt-users';\n\nexport async function guardToolCall(action: string) {\n  const context = getCurrentSessionPermissionContext();\n\n  await assertOperationPermission({\n    collection: 'articles',\n    action,\n    userId: context?.userId,\n    tenantId: context?.tenantId,\n    // Authorize against the set this context published rather than\n    // re-resolving, so SQLite and Postgres agree on the answer.\n    permissionSet: context?.permissionSet\n  });\n}`,
				callout: {
					variant: 'security',
					title: 'postgresRls degrades silently off Postgres',
					body: 'When the connection is not detected as Postgres the option is ignored: no transaction opens, no session variables are published, and no error is raised. The request simply runs with the guard as its only check. Do not read the flag as evidence that anything is enforced at the data layer.'
				}
			}
		],
		related: [
			{ label: 'Grant access', href: '/foundations/memberships-and-permissions' },
			{ label: 'Security defaults', href: '/reference/security' },
			{ label: 'Field policy operations', href: '/capabilities/field-policy-operations' },
			{ label: 'smrt-users package', href: '/packages/smrt-users' }
		]
	},
	{
		slug: 'have-sdk',
		navTitle: 'HAVE SDK',
		eyebrow: 'Underlying SDK',
		title: 'The adapter layer beneath s-m-r-t',
		lede: 'The HAppy VErtical SDK provides stable getX() interfaces for infrastructure such as AI, databases, caches, secrets, and files.',
		plainEnglish:
			's-m-r-t uses small adapter packages so changing a database, model provider, cache, or file store is primarily a configuration decision instead of an application rewrite.',
		packages: [],
		sections: [
			{
				title: 'Ask for a capability, then choose a provider',
				intro:
					'getAI(), getDatabase(), getCache(), getSecretStore(), and getFilesystem() return stable interfaces. Applications can pass explicit typed configuration or let the package read its documented HAVE_* environment values.',
				filename: 'adapters.ts',
				code: `import { getAI } from '@happyvertical/ai';\nimport { getDatabase } from '@happyvertical/sql';\n\nconst ai = await getAI({ type: 'anthropic' });\nconst db = await getDatabase({ type: 'postgres' });\n\nconst reply = await ai.message('Summarize this record');\nawait db.insert('summaries', { content: reply.content });`
			},
			{
				title: 'Install only the providers you use',
				intro:
					'Vendor SDKs remain optional peer dependencies where possible. The application depends on the adapter contract and adds the concrete database, model, cache, secret, or file provider it actually deploys.'
			},
			{
				title: 'The SDK also works without s-m-r-t',
				intro:
					'The adapter packages are independently useful. s-m-r-t composes them into its model, agent, persistence, and web runtimes, but ordinary TypeScript applications can call them directly.'
			}
		]
	},
	{
		slug: 'ai-and-retrieval',
		navTitle: 'AI and retrieval',
		eyebrow: 'Reference',
		title: 'AI methods, object memory, and semantic search',
		lede: 'Every SmrtObject inherits three model-backed methods and a context-memory store. Every SmrtCollection inherits similarity search over the fields you declare for embedding.',
		plainEnglish:
			'Three AI methods ask a model a question about one record. Semantic search finds records whose meaning is close to a query, even when the words do not match. Context memory keeps durable notes, such as a strategy that worked, beside the record that learned it.',
		packages: ['smrt-core', 'smrt-config', 'smrt-agents'],
		pinnedVersion: REFERENCE_PINNED_VERSION,
		sources: [
			{ label: 'smrt-core AGENTS.md', href: `${SMRT_TREE}/packages/core/AGENTS.md` },
			{ label: 'smrt-core README', href: `${SMRT_TREE}/packages/core/README.md` },
			{
				label: 'core/src/object.ts',
				href: `${SMRT_TREE}/packages/core/src/object.ts`
			},
			{
				label: 'core/src/collection.ts',
				href: `${SMRT_TREE}/packages/core/src/collection.ts`
			}
		],
		sections: [
			{
				title: 'Three model-backed methods on every object',
				intro:
					'is(criteria), do(instructions), and describe() each resolve the AI client configured for the object, build a prompt from the record, and call it once. is() constrains the reply to a JSON object with a boolean result property and returns that boolean. do() returns the raw text reply. describe() asks for a short description of the record. All three raise when no AI client is configured.',
				points: [
					'Methods listed in @smrt({ ai: { callable } }) are offered to the model as tools during all three calls.',
					'is() throws when the reply is not parseable JSON, and resolves to undefined when the parsed result is not a boolean. Treat a malformed reply as an error path.',
					'Each call reaches the model for one record. The framework neither batches nor caches the results.'
				],
				filename: 'src/lib/objects/Article.ts',
				code: `import { smrt, SmrtObject } from '@happyvertical/smrt-core';

@smrt({ ai: { callable: ['flagForReview'] } })
export class Article extends SmrtObject {
  title = '';
  body = '';
  status = 'draft';
  reviewReason = '';

  /** Offered to the model as a tool during is(), do(), and describe(). */
  async flagForReview(reason: string) {
    this.status = 'review';
    this.reviewReason = reason;
    await this.save();
  }
}

const article = await articles.get('article-uuid');

const readable = await article.is('written for a general audience');
const summary = await article.do('summarize this in three bullet points');
const blurb = await article.describe({ maxTokens: 50 });`
			},
			{
				title: 'What the model actually receives',
				intro:
					'All three methods serialize the instance through toPublicJSON() and place it ahead of your criteria or instructions as a delimited content body, so the model reasons over the record rather than the instruction string alone. Fields marked @field({ sensitive: true }) are excluded by that serialization and never reach the provider.',
				points: [
					'includeData: false omits the content body, for callers that already curate the relevant fields into the instruction text.',
					'maxDataLength overrides the 100,000-character truncation budget; truncation appends a visible marker so the model knows the data was cut.',
					'Those two keys are consumed by the method, and model, temperature, maxTokens, and the rest are forwarded to the AI client. The method sets responseFormat and tools itself, so a caller cannot override them.'
				]
			},
			{
				title: 'Declare which fields get embedded',
				intro:
					'Semantic search reads vectors generated from the fields named in the @smrt() decorator. Project-wide defaults live in the smrt section of the configuration tree, and a class can override the provider or turn automatic generation off.',
				points: [
					'Defaults: 768 dimensions, provider "local", local model Xenova/bge-base-en-v1.5, AI model text-embedding-3-small, storage "json".',
					'"local" requires @huggingface/transformers or @xenova/transformers to be installed, and is a deliberate choice for server workloads because pipeline initialization is CPU and memory intensive.',
					'"ai" requires an AI client that exposes embed() and spends embedding tokens per field per change. "auto" uses that client when one is configured and falls back to the local model otherwise.',
					'combinedField adds one more vector built from a template over the declared fields. Its name is searchable through semanticSearch, findSimilar, and findSimilarToEmbedding just like an individually embedded field.'
				],
				filename: 'smrt.config.ts',
				code: `// smrt.config.ts — project-wide defaults
import { defineConfig } from '@happyvertical/smrt-config';

export default defineConfig({
  smrt: {
    embeddings: {
      dimensions: 768,
      provider: 'local',
      storage: 'json'
    }
  }
});

// Article.ts — per-class declaration
@smrt({
  embeddings: {
    fields: ['title', 'body'],
    autoGenerate: true
  }
})
export class Article extends SmrtObject {
  title = '';
  body = '';
}`
			},
			{
				title: 'When embeddings are written',
				intro:
					'save() starts generation only when the class declares embeddings, autoGenerate is not false, the object resolved an AI client, and hasStaleEmbeddings() reports drift. That work is started but not awaited, so a save never blocks on the embedding model and a failure is logged rather than thrown. Call generateEmbeddings() directly when the write has to be part of your control flow.',
				points: [
					'The save-time path needs a configured AI client even when the provider is "local", because it is gated on the object resolving one.',
					'Only string field values are embedded; empty and non-string values are skipped.',
					'A SHA-256 content hash skips fields whose text has not changed. force: true regenerates regardless.',
					'collection.generateMissingEmbeddings({ batchSize, onProgress }) backfills existing rows and returns { generated, skipped }.'
				],
				filename: 'embedding-lifecycle.ts',
				// `number[] | null` below is correct and deliberate. The framework's own
				// docs/content/core.md says getEmbedding returns a Float32Array, and
				// documents an embeddings `model` key that ClassEmbeddingConfig does not
				// have; this page was written against the shipped types instead. Upstream
				// happyvertical/smrt#2280 — do not "correct" this to match those docs.
				code: `// Explicit generation, when you need to await the result.
await article.generateEmbeddings();                    // all configured fields
await article.generateEmbeddings({ fields: ['title'] });
await article.generateEmbeddings({ force: true });      // ignore the content hash

// Inspection and reset.
if (await article.hasStaleEmbeddings()) {
  await article.generateEmbeddings();
}
const vector = await article.getEmbedding('title');     // number[] | null
await article.clearEmbeddings();

// Backfill a collection.
const stats = await articles.generateMissingEmbeddings({
  batchSize: 100,
  onProgress: ({ completed, total }) => console.log(completed, '/', total)
});`
			},
			{
				title: 'Searching by meaning',
				intro:
					'semanticSearch(query) embeds the query text and ranks stored vectors by cosine similarity. findSimilar(objectOrId) starts from the stored vector of an existing record. findSimilarToEmbedding(vector) takes a vector you already hold. Each resolves to hydrated objects carrying a _similarity number, sorted highest first.',
				points: [
					'semanticSearch defaults to limit 10, minSimilarity 0, and the first field declared for embeddings; pass field to target another declared field or combinedField name.',
					'findSimilar defaults to limit 5 and excludeSelf true, and raises when the source record has no stored vector for that field.',
					'semanticSearch validates the field against the individually embedded fields plus combinedField and lists every available name when it rejects an unknown one. findSimilarToEmbedding does not perform that declaration check and returns an empty array when no vectors exist under the requested name.'
				],
				filename: 'search.ts',
				code: `const results = await articles.semanticSearch('machine learning trends', {
  limit: 10,
  minSimilarity: 0.7,
  where: { status: 'published' }
});

for (const hit of results) {
  console.log(hit.title, hit._similarity);
}

const seed = await articles.get('article-uuid');
const similar = await articles.findSimilar(seed, { limit: 5 });`
			},
			{
				title: 'Retrieval is not authority',
				intro:
					'All three search methods score vectors first, then hydrate the winning IDs through list({ where: { "id in": ids, ... } }). Tenant interceptors and any where clause you passed are applied on that read, and a sensitive field can be neither filtered on nor projected there, so a close vector is not a way around those boundaries. Sensitive values are stripped when the object is serialized for a client, not on the read itself. Ranking before the read also means the returned array can be shorter than limit.',
				callout: {
					variant: 'security',
					title: 'Never treat retrieved text as an instruction',
					body: 'Context memory and semantic search return application data, including text that users or external systems supplied. Passing it to a model does not make it trustworthy. Keep retrieved content on the data side of the prompt and let permissions, not relevance, decide what a caller may act on.'
				}
			},
			{
				title: 'Where the vectors are stored',
				intro:
					'Embeddings live in the _smrt_embeddings system table: one row per object class, object ID, field name, and model, holding the vector, its dimension count, the provider, and the SHA-256 content hash used for staleness checks. The table is created with the rest of the system schema, so no extra infrastructure is required to start.',
				points: [
					'The default storage: "json" keeps each vector as text and ranks in process, loading every stored vector for that class, field, and model first.',
					'storage: "native" adds a vector column and an approximate cosine index and pushes ranking into the database: an HNSW index on pgvector, a quantized index through the optional @sqliteai/sqlite-vector extension on SQLite.',
					'Native search falls back to the in-process path and logs a warning if the database query fails.',
					'The model name is part of the row key and of every lookup, so changing model or provider hides the existing rows instead of rewriting them.'
				]
			},
			{
				title: 'Object memory: remember, recall, forget',
				intro:
					'remember() upserts a JSON value into the _smrt_contexts system table, keyed by owner class, owner ID, scope, key, and version, with a confidence score that defaults to 1. recall() returns the highest-confidence, highest-version match for one scope and key, or null. recallAll() returns a Map of key to value. forget() removes one entry and forgetScope() removes a scope, returning the number deleted. Objects and collections both inherit the full set, but a collection stores under its item class rather than one record, so those entries are class-wide.',
				points: [
					'recall({ includeAncestors: true }) walks the scope upward — "a/b/c" to "a/b" to "a" to "global" — until something matches. It is off by default.',
					'minConfidence sets a floor for recall and recallAll; includeDescendants widens recallAll and forgetScope to child scopes.',
					'initialize() has to have run first: these methods write through the system database.'
				],
				filename: 'memory.ts',
				code: `await parser.remember({
  scope: 'parser/example.com',
  key: normalizedUrl,
  value: { selector: 'article .body' },
  confidence: 0.9
});

const strategy = await parser.recall({
  scope: 'parser/example.com/article',
  key: normalizedUrl,
  includeAncestors: true,
  minConfidence: 0.6
});

const all = await parser.recallAll({ scope: 'parser', includeDescendants: true });
const cleared = await parser.forgetScope({ scope: 'parser/example.com' });`
			},
			{
				title: 'Limits of the memory primitives',
				intro:
					'remember() and recall() are the thin layer over the table, and several columns they write are inert at that level. LearningMemory, the agent-facing layer in the same package, is what activates them.',
				points: [
					'expiresAt is stored on the row, but recall() and recallAll() do not filter on it. LearningMemory does drop expired records, so at the primitive level expiry is the caller to enforce.',
					'success_count and failure_count are written as zero and never move through remember(). LearningMemory increments them from reported outcomes and decays confidence with them.',
					'Entries are keyed to their owner, not to a tenant column, so tenant separation of memory comes from the owning record rather than from the table.',
					'describe() is unrelated to the embedding pipeline: vectors come from stored field text, never from generated prose.'
				]
			}
		],
		related: [
			{ label: 'Learning agents', href: '/capabilities/learning-agents' },
			{ label: 'Collections and list()', href: '/reference/collections' },
			{ label: 'Model your application', href: '/foundations/objects-and-collections' }
		]
	},
	{
		slug: 'testing',
		navTitle: 'Testing',
		eyebrow: 'Reference',
		title: 'Test through the same contracts applications use',
		lede: 'Use package test helpers, temporary databases, generated manifests, and focused component tests instead of replacing framework behavior with unrelated mocks.',
		plainEnglish:
			'Tests should exercise the real model, collection, permission, tenant, and component contracts at the narrowest useful level.',
		packages: ['smrt-vitest', 'smrt-core', 'smrt-ui'],
		sections: [
			{
				title: 'Start with the smallest real boundary',
				intro:
					'Unit-test pure model behavior directly, use the collection and temporary database helpers for persistence, and add route or browser tests only when the behavior crosses those interfaces.'
			},
			{
				title: 'Generate the manifest in tests',
				intro:
					'Test setup should scan the objects under test and load consumed package manifests so decorators, inheritance, interfaces, and migrations behave as they do in the application build.'
			},
			{
				title: 'Test security decisions explicitly',
				intro:
					'Cover anonymous, permitted, denied, cross-tenant, sensitive-field, read-only-field, and agent-confirmation cases. A passing happy path is not evidence that the boundary fails closed.'
			}
		]
	},
	{
		slug: 'configuration',
		navTitle: 'Configuration',
		eyebrow: 'Reference',
		title: 'Configuration',
		lede: 'Keep framework and package settings in one typed configuration tree, then pass the relevant branch to collections, services, and generated runtimes.',
		plainEnglish:
			'Configuration tells each package how your application connects to databases, services, models, and runtime options. Secrets should remain references or environment values, not committed strings.',
		packages: ['smrt-config', 'smrt-core'],
		sections: [
			{
				title: 'Application configuration',
				intro:
					'Define the application defaults once. Package configuration can extend or override that tree without requiring each call site to interpret environment variables.'
			},
			{
				title: 'Build configuration',
				intro:
					'The Vite plugin scans local objects, merges consumed package manifests, writes generated types and routes, and makes the virtual web module available.'
			},
			{
				title: 'Safe configuration boundaries',
				intro:
					'Keep browser-safe values separate from server-only values. Resolve secrets through the secret provider at the boundary that uses them.',
				callout: {
					variant: 'warning',
					title: 'Anything the client bundle can read is public',
					body: 'A value that reaches browser configuration ships to every visitor, however it was named. Keep API keys, database URLs, and signing material in server-only configuration and read them through the secret provider where they are used.'
				}
			}
		]
	},
	{
		slug: 'decorators',
		navTitle: 'Decorators',
		eyebrow: 'Reference',
		title: 'Decorators',
		lede: 'Decorators add metadata that cannot be inferred safely from field defaults: interfaces, relationships, tenant scope, sensitive fields, reports, and other package behavior.',
		plainEnglish:
			'A decorator is a short note attached to a class or field. The scanner records that note in the manifest so migrations and runtimes make the same decision.',
		packages: ['smrt-core', 'smrt-tenancy', 'smrt-reports'],
		sections: [
			{
				title: '@smrt()',
				intro:
					'Marks a model for scanning and declares which actions appear in REST, MCP, WebMCP definitions, and CLI. Use include, exclude, and writable lists instead of exposing every method by accident.'
			},
			{
				title: 'Relationships',
				intro:
					'Use foreignKey for a same-package relationship and crossPackageRef when the target comes from another package. The manifest records the target and the collection can batch-load named relationships.'
			},
			{
				title: 'Tenant scope',
				intro:
					'TenantScoped selects required, optional, or global behavior. The tenantId field decorator records the storage field used by automatic query interceptors.'
			},
			{
				title: 'Report fields',
				intro:
					'smrt-reports adds group, time bucket, and measure decorators so aggregate specifications remain beside the report model.'
			}
		]
	},
	{
		slug: 'collections',
		navTitle: 'Collections',
		eyebrow: 'Reference',
		title: 'Collections and list()',
		lede: 'Collections are the typed entry point for creating, finding, listing, counting, and relating objects.',
		plainEnglish:
			'Use a normal list when you need real objects and their methods. Use select when a page or report only needs a few plain fields.',
		packages: ['smrt-core', 'smrt-tenancy'],
		visual: 'collections',
		pinnedVersion: REFERENCE_PINNED_VERSION,
		sources: [
			{ label: 'collection.ts', href: `${SMRT_TREE}/packages/core/src/collection.ts` },
			{ label: 'smrt-core AGENTS.md', href: `${SMRT_TREE}/packages/core/AGENTS.md` }
		],
		sections: [
			{
				title: 'Hydrated objects',
				intro:
					'list(), get(), and related reads normally turn rows into the correct object or STI subclass. Use include to batch-load named relationships without N+1 queries.'
			},
			{
				title: 'Projected rows',
				intro:
					'list({ select }) validates logical field names and returns precisely typed plain rows. Projection and relationship inclusion are intentionally separate modes.',
				code: `const rows = await items.list({\n  select: ['id', 'title', 'status'] as const,\n  where: { status: 'open' },\n  orderBy: 'created_at DESC',\n  limit: 50\n});`,
				filename: 'list-items.ts'
			},
			{
				title: 'A filter key carries its operator',
				intro:
					'Each where key is a field name, optionally followed by a space and an operator. Equality is the default. Field names are the ones declared on the model; the collection converts them to database columns before the statement is built, and validates them against the model so a typo reports the valid names instead of a SQL error.',
				filename: 'list-invoices.ts',
				code: `const overdue = await invoices.list({\n  where: {\n    status: 'open',                 // status = ?\n    'total >=': 100,                // total >= ?\n    'currency in': ['CAD', 'USD'],  // currency IN (?, ?)\n    'reference like': 'INV-2026-%', // reference LIKE ?\n    voidedAt: null                  // voided_at IS NULL\n  },\n  orderBy: 'created_at DESC',\n  limit: 50\n});`
			},
			{
				title: 'The operator set',
				intro:
					'Nine operators reach SQL: =, >, <, >=, <=, !=, in, not in, and like. A null value turns = into IS NULL and != into IS NOT NULL. An array value with no explicit operator is read as in.',
				points: [
					'in and not in require a non-empty array. An empty one is rejected rather than compiled into invalid SQL; listByIds([]) returns an empty list instead.',
					'like requires a string value, and you supply the % wildcards yourself.',
					'contains and dot-notation JSON paths such as metadata.userId are rejected at the API boundary because the SQL query builder cannot execute them. Use like for text matching.',
					'Fields marked @field({ sensitive: true }) are rejected as filter keys, so a where clause cannot be used to read a secret value back one character at a time.',
					'Generated REST routes expose the same filters as field[op] query parameters — gt, gte, lt, lte, ne, in, and like, with in taking a comma-separated list. not in has no query-parameter spelling.'
				]
			},
			{
				title: 'What a where clause cannot express',
				intro:
					'Conditions in one where object are joined with AND. There is no OR, no negated group, no nested condition, no subquery, and no join. orderBy accepts a field name and a direction, not an expression.',
				points: [
					'The underlying query builder can emit OR from a two-dimensional condition array, but the collection validates where as a flat object of identifier keys and rejects that shape.',
					'Keys must be identifiers followed only by an optional supported operator. Expression text and dot-separated JSON paths are rejected, which keeps request-supplied filter names from reaching the SQL field position.'
				]
			},
			{
				title: 'collection.query() is the escape hatch',
				intro:
					'query(sql, params) runs SQL you wrote and hydrates the rows into the same objects list() returns, including STI subclass resolution. Use it for OR, NOT EXISTS, joins, CTEs, and aggregates, and keep list() for everything it can already express.',
				filename: 'unbilled-orders.ts',
				code: `const unbilled = await orders.query(\n  \`SELECT o.* FROM orders o\n   WHERE o.status = ?\n     AND NOT EXISTS (\n       SELECT 1 FROM invoices i WHERE i.order_id = o.id\n     )\n   ORDER BY o.created_at DESC\n   LIMIT ?\`,\n  ['fulfilled', 100]\n);`,
				points: [
					'Names inside the SQL string are database columns. Returned rows are converted back to the model field names during hydration.',
					'Bind values as parameters; the placeholder style follows your database adapter. The collection does not parse the statement, so anything interpolated into the text is your own injection risk.',
					'Tenant scope is not added for you. A beforeQuery interceptor guards tenant-scoped models, and allowRawOnTenantScoped opts out of it deliberately — then the tenant predicate is yours to write.',
					'query() is documented for reads. It will run a write, and a statement that looks like a mutation invalidates this table in the read cache, but model hooks and save-time interceptors do not run.'
				]
			},
			{
				title: 'Reading many records at once',
				intro:
					'listByIds(ids) issues a single IN query and returns hydrated objects. An empty array returns an empty list without touching the database, which is the graceful path an empty in filter refuses to take.',
				filename: 'batch-read.ts',
				code: `const items = await products.listByIds(ids);\nconst byId = new Map(items.map((item) => [item.id, item]));\n\n// Long id lists need splitting; listByIds does not do it for you.\nconst all = [];\nfor (let i = 0; i < ids.length; i += 900) {\n  all.push(...(await products.listByIds(ids.slice(i, i + 900))));\n}`,
				points: [
					'Result order is not guaranteed. Index the result by id when the caller needs its own ordering back.',
					'listByIds does not chunk. Databases cap the number of bound parameters in one statement, and the relationship batch loaders inside the framework split their own IN lists at 900 values for that reason — use a similar size for long id lists.',
					'count() runs the same where conversion as list() and is never served from the read cache, so a cached page and a fresh count can briefly disagree inside the TTL window.'
				]
			},
			{
				title: 'Writes happen one statement at a time',
				intro:
					'create() and save() persist a single object per call; there is no bulk create on the collection. A loop of saves is a loop of round trips, and on a durable single-connection database each one commits on its own. Wrapping the loop in a transaction turns that into one commit.',
				filename: 'bulk-import.ts',
				code: `const db = await getDatabase({ type: 'sqlite', url: 'app.db' });\nif (!db.transaction) throw new Error('This adapter does not support transactions.');\n\nawait db.transaction(async (tx) => {\n  const products = await ProductCollection.create({ db: tx });\n  for (const row of rows) {\n    await products.create(row);\n  }\n});`,
				points: [
					'A collection accepts an already-initialized database instance as its db option, which is how a batch of collection writes joins one transaction instead of opening its own.',
					'transaction() is an optional member of the adapter interface, so narrow it before calling; a bare call does not type-check under strict TypeScript.',
					'The callback result is the transaction result, and a thrown error rolls the whole batch back rather than leaving it half-applied.',
					'Nesting transaction() is adapter-specific: SQLite and PostgreSQL re-enter under a savepoint, while DuckDB and the JSON adapter throw. Pass the handle down instead of nesting.',
					'On single-connection adapters, a concurrent transaction waits its turn and rejects after transactionQueueTimeout — 30 seconds by default. Keep the batch bounded rather than holding one transaction open for a whole import.'
				]
			},
			{
				title: 'When raw SQL is the right batch tool',
				intro:
					'A set-based UPDATE or DELETE does in one statement what a read-modify-write loop does in several round trips per row. collection.query() runs it under the same caveats as any raw statement: model hooks, save-time interceptors, and embedding regeneration do not run.',
				points: [
					'Keep the loop when per-object hooks, embeddings, auditing, or change-feed entries have to run for each record.',
					'Reach for one statement when the change is purely columnar and none of that per-object work applies.',
					'Measure on your own adapter before choosing. The gap between the two depends on durability settings, latency to the database, and how much work each hook does.'
				],
				callout: {
					variant: 'note',
					title: 'No benchmark is published here on purpose',
					body: 'Transaction wrapping is a large win on a durable file-backed database and close to no change on an in-memory one, because what it removes is a commit per row rather than work. Any single figure would be true of one adapter and one machine, so measure the shape you actually deploy.'
				}
			},
			{
				title: 'Tenant and cache behavior',
				intro:
					'Tenant interceptors run for list, get, count, and related reads. Read caching is opt-in; writes invalidate affected entries, while count always checks the database.'
			}
		],
		related: [
			{ label: 'Relationship loading', href: '/reference/relationships' },
			{ label: 'Field naming', href: '/reference/field-naming' }
		]
	},
	{
		slug: 'relationships',
		navTitle: 'Relationship loading',
		eyebrow: 'Reference',
		title: 'Loading related objects without N+1 queries',
		lede: 'Declared relationships load lazily one object at a time, or in batches for a whole page. Both paths fill the same per-object cache.',
		plainEnglish:
			'Reading a list and then reading the parent of each row inside a loop issues one query per row. Ask for the relationship when you list, and the collection fetches them together.',
		packages: ['smrt-core', 'smrt-tenancy'],
		pinnedVersion: REFERENCE_PINNED_VERSION,
		sources: [
			{ label: 'object.ts', href: `${SMRT_TREE}/packages/core/src/object.ts` },
			{ label: 'collection.ts', href: `${SMRT_TREE}/packages/core/src/collection.ts` }
		],
		sections: [
			{
				title: 'Where the extra queries come from',
				intro:
					'Listing 100 orders and then resolving the customer for each order inside the loop is 101 queries: one for the page and one per row. The count scales with the page size, so a small fixture hides it.',
				filename: 'n-plus-one.ts',
				code: `// One query for the page.\nconst page = await orders.list({ where: { status: 'open' }, limit: 100 });\n\n// One more for every row.\nfor (const order of page) {\n  const customer = await order.loadRelated('customerId');\n}`
			},
			{
				title: 'include batches the relationship rather than joining',
				intro:
					'list({ include }) hydrates the page first, then queries each named relationship in bulk and primes the cache on each object with the result. 100 orders and their customer become 2 queries rather than 101 — but there is no JOIN and no single-statement fetch, so read it as N+1 collapsing to 1+K.',
				filename: 'eager-load.ts',
				code: `const page = await orders.list({\n  where: { status: 'open' },\n  include: ['customerId', 'lines'],\n  limit: 100\n});\n\nfor (const order of page) {\n  // Served from the primed cache; no further queries.\n  const customer = await order.getRelated('customerId');\n}`,
				points: [
					'A @foreignKey, @crossPackageRef, or @oneToMany relationship costs one query. A @manyToMany costs two: it scans the junction table, then hydrates the targets.',
					'Foreign-key values are de-duplicated before the batch query, so repeated parents cost one row, not one per child.',
					'IN lists are chunked at 900 values, so a very wide page issues a few queries per relationship instead of one oversized statement.',
					'include is available on list() and findAll(). get() has no include option — call a loader on the object it returns.',
					'include cannot be combined with select. A projection returns plain rows with nothing to attach a relationship to, and asking for both throws.'
				],
				callout: {
					variant: 'note',
					title: 'Fewer queries, not one query',
					body: 'include is a batch loader, not a JOIN. The page is fetched, then each named relationship costs one more query — two for a manyToMany. That is the difference between a request that scales with page size and one that does not, but a page asking for several relationships still issues several queries.'
				}
			},
			{
				title: 'Three loaders, one cache',
				intro:
					'The loaders live on the object, take a relationship field name, and store what they resolve on that instance. A second call for the same field returns the cached value without querying.',
				points: [
					'loadRelated(fieldName) resolves one @foreignKey or @crossPackageRef and returns the object, or null when the key is empty.',
					'loadRelatedMany(fieldName) resolves a @oneToMany through the inverse foreign key on the target, or a @manyToMany through its junction table, and returns an array.',
					'getRelated(fieldName) reads the relationship metadata and dispatches to whichever of the two applies. Use it when the call site does not need to know which kind the field is.',
					'The cache is per instance. A freshly listed object starts empty unless include primed it, so re-listing does not carry loaded relationships forward.'
				]
			},
			{
				title: 'Loading stops at the tenant boundary',
				intro:
					'When a tenant-scoped object resolves a relationship into a different, non-null tenant, the loaders throw rather than returning the row. The check is a no-op for global objects and same-tenant reads, so it only fires on a genuine crossing.',
				points: [
					'Pass { allowCrossTenant: true } for deliberate cross-tenant work such as admin tooling or migrations.',
					'A cache primed by include is re-checked on a later guarded call, so eager loading cannot be used to slip a cross-tenant object past the guard.'
				]
			},
			{
				title: 'Where relationship declarations go wrong',
				intro:
					'Most relationship-loading surprises come from the declaration rather than the call site.',
				points: [
					'A @oneToMany needs an inverse @foreignKey on the target. When the target declares more than one, name it — @oneToMany(Target, { foreignKey: "ownerId" }) — and a stale name throws instead of quietly returning empty arrays.',
					'A @manyToMany needs its junction table named in through; a missing one throws.',
					'include takes relationship field names, not target class or table names.',
					'Loading inside a component that renders per row puts the loop back. Prime the relationship where the query is issued, then read it during render.'
				],
				links: [{ label: 'Collections and list()', href: '/reference/collections' }]
			}
		],
		related: [{ label: 'Collections and list()', href: '/reference/collections' }]
	},
	{
		slug: 'field-naming',
		navTitle: 'Field naming',
		eyebrow: 'Reference',
		title: 'camelCase in TypeScript, snake_case in the database',
		lede: 'Field names are converted to columns when a statement is built and converted back when a row is hydrated. Knowing which side of that boundary you are on removes most naming surprises.',
		plainEnglish:
			'Write the model in camelCase. The database stores snake_case. Everything generated from the model — REST, MCP, CLI — uses the TypeScript spelling, and only hand-written SQL uses column names.',
		packages: ['smrt-core'],
		pinnedVersion: REFERENCE_PINNED_VERSION,
		sources: [
			{ label: 'utils/naming.ts', href: `${SMRT_TREE}/packages/core/src/utils/naming.ts` },
			{ label: 'utils.ts', href: `${SMRT_TREE}/packages/core/src/utils.ts` },
			{ label: 'collection.ts', href: `${SMRT_TREE}/packages/core/src/collection.ts` }
		],
		sections: [
			{
				title: 'One rule, applied at the database boundary',
				intro:
					'Converting to a column inserts an underscore before each capital and lowercases the result. Converting back uppercases the letter after each underscore. The conversion runs where a query is built and where a row is hydrated; nothing else in the stack re-cases keys.',
				filename: 'Invoice.ts',
				code: `@smrt({ api: true })\nexport class Invoice extends SmrtObject {\n  customerId = '';  // column: customer_id\n  apiKey = '';      // column: api_key\n  totalCents = 0;   // column: total_cents\n}\n\n// Table name comes from the class: invoices`
			},
			{
				title: 'Where each spelling appears',
				intro:
					'There is one place to use column names and one place to use field names, and the split follows whether the framework generated the surface or you wrote the SQL by hand.',
				points: [
					'Model properties, where keys, orderBy fields, and select entries: the name declared on the class.',
					'Database columns, indexes, and constraints: snake_case.',
					'Generated REST request bodies, responses, and filter query parameters: the declared field name, as in ?status=open&total[gte]=100.',
					'Generated MCP tool input schemas: the declared field name.',
					'Generated CLI flags: --declaredFieldName, taken verbatim as a payload key, so a kebab-case spelling will not resolve to a field.',
					'SQL text passed to collection.query(): column names. The returned rows are hydrated back to field names.'
				]
			},
			{
				title: 'Table names follow a different rule',
				intro:
					'A class name becomes a table name through a separate conversion that only splits where a lowercase letter meets a capital, then pluralizes the last word. Item becomes items, JournalEntry becomes journal_entries, and Currency becomes currencies.',
				points: [
					'An all-caps prefix has no lowercase-to-uppercase boundary, so the class APIKey becomes apikeys even though its apiKey field becomes api_key. The two conversions are not the same function.',
					'Set tableName on @smrt() when the derived name is not the one you want. There is no per-field column-name override — a column name always follows from the field name.'
				]
			},
			{
				title: 'Edge cases in the conversion',
				intro:
					'The conversion is a pair of small regular expressions, not a dictionary, so a few shapes behave in ways that are easy to misremember.',
				points: [
					'Consecutive capitals are split individually: pdfURL becomes pdf_u_r_l. The round trip back to pdfURL is exact, but the column is harder to read and to type in hand-written SQL — prefer pdfUrl.',
					'A field the model declares in snake_case stays that way through hydration: a declared publish_date is returned as publish_date rather than being renamed to publishDate.',
					'The inherited system fields are literally snake_case in TypeScript too: created_at and updated_at, alongside id, slug, and context. Reading object.created_at and sorting by created_at DESC are both correct.',
					'Framework fields that start with an underscore keep the prefix through the column mapping, so _metaType addresses the _meta_type column.'
				],
				callout: {
					variant: 'note',
					title: 'Digits do not split a name',
					body: 'The conversion only reacts to capitals, so version2 stays version2 rather than becoming version_2, and a column genuinely named version_2 converts back to version_2 rather than version2. Let a capital do the splitting — version2Payload rather than version2 — if you want the underscore.'
				}
			},
			{
				title: 'Filtering across the conversion',
				intro:
					'Query options take field names and are converted for you, which is also where a misspelling is caught.',
				points: [
					'where keys are validated against the model fields after conversion, so a typo reports the valid field names rather than failing as a SQL error.',
					'orderBy is converted as well, so createdAt DESC and created_at DESC both resolve to the same column.',
					'Fields marked sensitive are rejected as filter keys regardless of which spelling is used.',
					'list({ select }) takes field names and returns rows keyed by those same names, so a projection never leaks column spellings into page code.'
				],
				links: [{ label: 'Collections and list()', href: '/reference/collections' }]
			}
		],
		related: [
			{ label: 'Collections and list()', href: '/reference/collections' },
			{ label: 'Relationship loading', href: '/reference/relationships' }
		]
	},
	{
		slug: 'interfaces',
		navTitle: 'Generated interfaces',
		eyebrow: 'Reference',
		title: 'REST, MCP, WebMCP, and CLI',
		lede: 'Each generated interface is a view over the capabilities declared on your object. They share metadata but can expose different action sets.',
		plainEnglish:
			'REST serves application clients, MCP serves connected agents, WebMCP serves agents in the browser page, and CLI serves people or scripts in a terminal.',
		packages: ['smrt-core', 'smrt-app-mcp', 'smrt-app-cli', 'smrt-web'],
		visual: 'surfaces',
		sections: [
			{
				title: 'REST',
				intro:
					'Generated SvelteKit routes use manifest schemas, writable-field policy, authentication, tenant scope, and operation permissions. Package pages show the representative route shape.'
			},
			{
				title: 'MCP',
				intro:
					'Tool names, descriptions, and JSON Schema inputs are generated from explicitly included model actions. Agent and persona tool ceilings can narrow what a principal may call.'
			},
			{
				title: 'WebMCP',
				intro:
					'The browser registers selected generated descriptors with document.modelContext. Calls use the signed-in page session and generated REST fetchers; the server remains the security boundary.'
			},
			{
				title: 'CLI',
				intro:
					'Application CLIs turn manifest resources into predictable commands and can add model-specific operations. The framework CLI also owns migration, scanning, generation, and introspection workflows.'
			}
		]
	},
	{
		slug: 'field-policies',
		navTitle: 'Field policy API',
		eyebrow: 'Reference',
		title: 'Field policy exports and semantics',
		lede: 'What @happyvertical/smrt-fields exports, how an object is named, how a default is encoded on the wire, what a write is checked against, and where results are cached.',
		plainEnglish:
			'A policy row names one field of one object at one scope. These are the exact names, formats, and rules that row is checked against.',
		packages: ['smrt-fields', 'smrt-core', 'smrt-users'],
		sections: [
			{
				title: 'Entry points',
				intro:
					'The package root holds the model, the collection, the resolver, and the helpers. The /svelte subpath holds the eleven components and the browser-side helpers. /manifest exposes the generated manifest and /playground the shared playground module.',
				points: [
					'Models and collection: FieldPolicy, FieldPolicyCollection.',
					'Resolution: resolveFieldPolicy, resolveFieldPolicyExplained, resolveSurvivingTenantChainIds.',
					'Cache control: clearFieldPolicyCache, invalidateFieldPolicyCache, getFieldPolicyCacheTtlMs.',
					'Permissions: MANAGE_FIELD_POLICY_PERMISSION, PERSONALIZE_FIELD_POLICY_PERMISSION, FIELD_POLICY_PERMISSION_DEFINITIONS, ensureFieldPolicyPermissionsRegistered.',
					'Field helpers: isPolicyAddressableField, isRequiredField, isSensitiveField, isTransientField, getCodeDefault, buildCodeSeedDelta, buildCodeSeedVisibility, sanitizeFieldUIHints, assertDefaultValueMatchesFieldType.',
					'Control panel: buildFieldPolicySettingsCatalog, parseFieldPolicyCatalogQuery, fieldPolicyCatalogItemId.'
				],
				filename: 'src/lib/field-policy.ts',
				code: `import {\n  FieldPolicy,\n  FieldPolicyCollection,\n  MANAGE_FIELD_POLICY_PERMISSION,\n  resolveFieldPolicy,\n  resolveFieldPolicyExplained\n} from '@happyvertical/smrt-fields';\n\nimport {\n  createFieldInputRegistry,\n  FieldPolicyControlPanel,\n  FieldPolicyGearProvider,\n  ObjectForm,\n  policyToVisibleColumnIds\n} from '@happyvertical/smrt-fields/svelte';`
			},
			{
				title: 'Components in the /svelte subpath',
				intro:
					'Eleven components ship in the /svelte subpath, each with a matching Props type. They are layout-neutral: they contribute behavior and leave markup decisions to the application.',
				points: [
					'Form primitives: FieldPolicyProvider, PolicyField, ModeSwitch, AdvancedFields, FormHelp.',
					'Generated forms: ObjectForm, ObjectFormSourceProvider.',
					'Administration: FieldPolicyGearProvider, FieldPolicyGearButton, FieldPolicyEditor, FieldPolicyControlPanel.'
				]
			},
			{
				title: 'Naming an object',
				intro:
					'Every policy row and every resolve call names its object with the canonical qualified class name: the package name, a colon, then the class name. It is the same identifier the manifest uses, so it survives renames of tables and routes.',
				filename: 'object-refs.ts',
				code: `'@happyvertical/smrt-content:Article'\n'@happyvertical/smrt-commerce:Invoice'\n'@acme/app-objects:StarterAppSetting'`
			},
			{
				title: 'Two channels for a default value',
				intro:
					'defaultValue is the encoded channel: already JSON, exactly as the column stores it. defaultValueRaw is the plain channel: any value, always serialized. They are mutually exclusive and passing both throws, because one option cannot distinguish the string TBD from the encoded JSON string that contains it.',
				points: [
					'Generated write routes hand the request body straight to the constructor, so the wire contract has to stay encoded.',
					'setDefaultValue is the method-level plain channel.',
					'The sort column is displayOrder; the resolved output exposes it as order.'
				],
				filename: 'default-values.ts',
				code: `// Encoded channel — what a generated route or the gear posts\nnew FieldPolicy({ defaultValue: JSON.stringify('Net 30') });\n\n// Plain channel — what application code usually wants\nnew FieldPolicy({ defaultValueRaw: 'Net 30' });\n\n// Passing both throws; { defaultValue: 'Net 30' } is a parse error\n// whose message names defaultValueRaw.`
			},
			{
				title: 'What a write is validated against',
				intro:
					'Writes validate against the live object registry rather than a checked-in manifest file. An unknown object or field is rejected, a default is type-checked against the field type, and defaults are refused on transient, sensitive, and read-permission-gated fields.',
				points: [
					'System fields, relationship pseudo-fields, and single-table-inheritance meta storage fields are not policy-addressable.',
					'Required fields may only leave the basic tier when a usable default resolves, checked at write time and re-checked at resolution.',
					'locked may be written on app and tenant rows only.'
				]
			},
			{
				title: 'Generated surface',
				intro:
					'FieldPolicy generates create, update, and delete routes. Generated list and get are deliberately closed: the model is not tenant-scoped, so a browsable read would enumerate every tenant and user row. Reads happen through three collection actions or through the server-side resolver.',
				points: [
					'POST <collection>/resolve — resolveBatch, the context-scoped policy read used to bootstrap forms.',
					'POST <collection>/editor-state — getEditorState, the gear bootstrap.',
					'POST <collection>/policy-audit — policyAudit, the manage-gated organization roll-up.',
					'MCP is closed entirely. The generated CLI is writes-only — create, update, and delete — because a CLI command needs an API route behind it and the read routes do not exist; the collection config closes the runtime CLI surface as well.'
				]
			},
			{
				title: 'Caching and invalidation',
				intro:
					'Resolved results are cached for a short TTL per database namespace, object reference, tenant, user, and hierarchy loader. The loader is part of the key because an injected loader yields a different ancestor chain and therefore different defaults and locks.',
				points: [
					'Saving or deleting a row invalidates every entry for that object, because a parent-tenant row affects each descendant.',
					'Policy rows do not ride the client change feed, so a browser learns about a change on its next resolve.',
					'Write-time validation resolves projected state outside the shared cache so a hypothetical result can never poison a real read.'
				]
			},
			{
				title: 'Version prerequisite',
				intro:
					'@happyvertical/smrt-fields first appeared in the 0.40.5x line and is not part of 0.39.x. It pins smrt-core, smrt-tenancy, smrt-ui, and smrt-users to its own exact version, so install it at the same version as the rest of your s-m-r-t packages; a mismatch installs a second object registry and policy resolution stops recognizing your objects.',
				points: [
					'smrt-users is a required runtime dependency, not an optional one: the permission catalog and operation guard back every write and gear action.',
					'The usage-learning loop is not in any published release yet.'
				]
			}
		],
		related: [
			{ label: 'How resolution works', href: '/capabilities/field-policies' },
			{ label: 'Build a policy-aware form', href: '/capabilities/policy-aware-forms' },
			{ label: 'Operate field policies', href: '/capabilities/field-policy-operations' },
			{ label: 'smrt-fields package', href: '/packages/smrt-fields' },
			{ label: 'Security defaults', href: '/reference/security' }
		]
	},
	{
		slug: 'terminology',
		navTitle: 'Terminology',
		eyebrow: 'Reference',
		title: 'Terminology',
		lede: 'A short map of the words used throughout the framework and these docs.',
		plainEnglish:
			'These names describe different jobs. Keeping them distinct makes data, identity, and authority easier to discuss.',
		packages: [],
		sections: [
			{
				title: 'Object, collection, and manifest',
				intro:
					'An object is one typed record with behavior. A collection works with many objects. The manifest is the scanned description used by build tools and runtimes.'
			},
			{
				title: 'Tenant, user, profile, and membership',
				intro:
					'A tenant is a data and authority boundary. A user authenticates. A profile represents a person, organization, or agent in the product. A membership connects a user to a tenant.'
			},
			{
				title: 'Role, permission, and principal',
				intro:
					'A role groups permissions inside a tenant. A permission names an operation. A principal is the resolved identity and authority carried into a request, job, or agent call.'
			},
			{
				title: 'Agent, persona, and learning memory',
				intro:
					'An agent is executable behavior. A persona is one durable tenant-owned instance with its own instructions and tool ceiling. Learning memory stores outcome-scored experience for later recall.'
			},
			{
				title: 'SSR, hydration, and live collection',
				intro:
					'Server-side rendering supplies the first HTML and data. Hydration hands those rows to browser state. A live collection can then receive changes and replay offline writes.'
			}
		]
	}
];

export function getReferenceGuide(slug: string) {
	return referenceGuides.find((guide) => guide.slug === slug);
}
