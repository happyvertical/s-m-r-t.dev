export interface GuideLink {
	label: string;
	href: string;
	/** Set for links that leave the documentation site. */
	external?: boolean;
}

export interface GuideSection {
	title: string;
	intro: string;
	points?: string[];
	code?: string;
	filename?: string;
	/** Language label shown on the code block. Defaults to TypeScript. */
	lang?: string;
	links?: GuideLink[];
}

export interface Guide {
	slug: string;
	navTitle?: string;
	eyebrow: string;
	title: string;
	lede: string;
	plainEnglish: string;
	packages: string[];
	/** Released framework version every claim on the page was checked against. */
	pinnedVersion?: string;
	/** Canonical upstream documents an audit should re-read when this page ages. */
	sources?: GuideLink[];
	visual?:
		| 'app-model'
		| 'identity'
		| 'tenants'
		| 'surfaces'
		| 'learning'
		| 'mobile'
		| 'live'
		| 'webmcp'
		| 'agent-controls'
		| 'reports'
		| 'shell'
		| 'collections';
	sections: GuideSection[];
	/**
	 * Pages and source files a reader of this guide should be able to reach
	 * from the guide itself. Internal hrefs are ordinary site links; entries
	 * marked external open in a new tab.
	 */
	related?: { label: string; href: string; external?: boolean }[];
}

export const foundationGuides: Guide[] = [
	{
		slug: 'objects-and-collections',
		navTitle: 'Model your application',
		eyebrow: 'Foundation 01',
		title: 'Start with an object and its collection',
		lede: 'Write a TypeScript class for something your app needs to keep. Its collection handles finding, listing, counting, and creating those records.',
		plainEnglish:
			'An object is one record, such as an Item or Invoice. Its collection is the place you work with many of those records.',
		packages: ['smrt-core', 'smrt-config', 'smrt-scanner'],
		visual: 'app-model',
		sections: [
			{
				title: 'Define the thing your app is about',
				intro:
					'Name the class after the thing people recognize: Item, Article, Place, Invoice, or Agent. Fields and useful behavior stay together.',
				points: [
					'Field defaults tell s-m-r-t what to store.',
					'Decorators add relationships, tenant scope, and public interfaces.',
					'The collection provides list, get, count, create, and related queries.'
				],
				filename: 'src/lib/objects/Item.ts',
				code: `import { ObjectRegistry, SmrtCollection, SmrtObject, smrt }\n  from '@happyvertical/smrt-core';\n\n@smrt({ api: true, mcp: true, cli: true })\nexport class Item extends SmrtObject {\n  title = '';\n  status = 'draft';\n}\n\nexport class ItemCollection extends SmrtCollection<Item> {\n  static readonly _itemClass = Item;\n}\n\nObjectRegistry.registerCollection('Item', ItemCollection);`
			},
			{
				title: 'Let the manifest carry the description',
				intro:
					'The scanner records the fields, relationships, methods, permissions, and package identity. Migrations and public interfaces all read that shared description.',
				points: [
					'Change the TypeScript object, regenerate the manifest, then migrate.',
					'Normal lists return objects; list({ select }) returns smaller plain rows.',
					'Use include for named relationships when you need full objects without N+1 queries.'
				]
			}
		]
	},
	{
		slug: 'tenants',
		navTitle: 'Decide where data belongs',
		eyebrow: 'Foundation 02',
		title: 'Choose where data and authority belong',
		lede: 'A tenant is an organization or account boundary. It tells the app which data, members, and permissions belong together.',
		plainEnglish:
			'A tenant can be one customer account, a branch inside a larger organization, or a member of a network. You decide which shape matches the business.',
		packages: ['smrt-tenancy', 'smrt-users', 'smrt-profiles'],
		visual: 'tenants',
		sections: [
			{
				title: 'Use the relationship that matches the job',
				intro:
					'Tenant hierarchy, membership, and profile relationships answer different questions. Keeping them separate makes access rules easier to reason about.',
				points: [
					'Parent and child tenants describe organization: company, division, branch, or network member.',
					'A membership gives one user access to one tenant through one role.',
					'A profile relationship describes business meaning: supplier, client, partner, or representative.'
				]
			},
			{
				title: 'Make inheritance a choice',
				intro:
					'A parent must allow permission cascading and the child must accept it. A role can separately allow descendant authority. Nothing widens access just because two tenants are related.',
				filename: 'tenant-setup.ts',
				code: `const network = await tenants.create({\n  name: 'Northern Network',\n  cascadePermissions: true\n});\n\nconst chapter = await tenants.createChild(network.id, {\n  name: 'Edmonton Chapter',\n  inheritPermissions: true\n});`
			},
			{
				title: 'Put tenant scope on the model',
				intro:
					'Required scope means every row belongs to a tenant. Optional scope allows shared rows as well as tenant rows. Global models remain outside tenant filtering. The request session establishes the authorized tenant context.'
			}
		]
	},
	{
		slug: 'users-and-profiles',
		navTitle: 'Add people and accounts',
		eyebrow: 'Foundation 03',
		title: 'Keep login records separate from people',
		lede: 'Users handle sign-in and sessions. Profiles represent the person, organization, or agent your product knows about.',
		plainEnglish:
			'A user answers “who signed in?” A profile answers “who or what is this in the product?” They are related, but they are not the same record.',
		packages: ['smrt-users', 'smrt-profiles'],
		visual: 'identity',
		sections: [
			{
				title: 'Use User for authentication',
				intro:
					'User owns authentication identity, account state, sessions, and the link to a profile. The session records the active tenant and the resolved permissions for each request.',
				points: [
					'One user can belong to more than one tenant.',
					'Switching tenants checks active membership and rotates the session.',
					'Access requests can become users, memberships, and tenants after approval.'
				]
			},
			{
				title: 'Use Profile for product identity',
				intro:
					'Profiles can represent people, organizations, bots, or public identities. They can exist before an account is created and can participate in typed, directional relationships.'
			},
			{
				title: 'Let the starter wire the common flow',
				intro:
					'Both starter paths include current session handling. The SaaS starter adds the finished onboarding, account, and tenant-management surfaces; the ground-up template keeps them visible as small examples you can change.'
			}
		]
	},
	{
		slug: 'memberships-and-permissions',
		navTitle: 'Grant access',
		eyebrow: 'Foundation 04',
		title: 'Connect each user to a tenant and a role',
		lede: 'Memberships answer where someone has access. Roles collect the exact operations they may perform in that tenant.',
		plainEnglish:
			'A membership connects a user, a tenant, and a role. Permissions are named actions such as items.read or articles.publish.',
		packages: ['smrt-users', 'smrt-tenancy'],
		visual: 'identity',
		sections: [
			{
				title: 'Derive common permissions from the model',
				intro:
					'Public model operations contribute permission names. Sync the catalogue after migration, then seed or assign roles with the permissions your app needs.',
				points: [
					'items.read covers list and get.',
					'items.create, items.update, and items.delete stay separate.',
					'Custom methods can add names such as articles.publish.'
				],
				filename: 'seed-access.ts',
				code: `await syncPermissionCatalog(getSmrtConfig('Permission'));\n\nconst roles = await RoleCollection.create(getSmrtConfig('Role'));\nawait roles.seedSystemRoles({ seedPermissions: true });`
			},
			{
				title: 'Enforce the same decision at every entry point',
				intro:
					'Generated routes are authentication-gated and tenant-scoped. Custom SvelteKit actions, jobs, and in-process writes must also check the principal permission snapshot. Postgres applications can add row-level security as another enforcement layer.'
			},
			{
				title: 'Some packages contribute their own permissions',
				intro:
					'A framework package can add named permissions to the same catalogue. Field policy contributes two: fields.policy.manage for organization-wide administration and fields.policy.personalize for a principal maintaining only their own preferences.'
			}
		],
		related: [{ label: 'Field policy operations', href: '/capabilities/field-policy-operations' }]
	},
	{
		slug: 'pages-and-data',
		navTitle: 'Build pages and live data',
		eyebrow: 'Foundation 05',
		title: 'Load the first page on the server',
		lede: 'Use the active session and tenant context in a SvelteKit server load, return serializable rows, and let the browser take over only when the page needs to stay live.',
		plainEnglish:
			'SvelteKit can send useful HTML with the first response. Hydration gives those same rows to the browser store, so it does not immediately fetch them again.',
		packages: ['smrt-svelte', 'smrt-web'],
		visual: 'live',
		sections: [
			{
				title: 'Keep initial reads in server load',
				intro:
					'The server can use the database, signed session, tenant, and permission snapshot directly. Return only the fields the page needs.',
				filename: 'src/routes/+page.server.ts',
				code: `export const load = async ({ depends, locals }) => {\n  depends('smrt:items');\n  if (!locals.permissions.includes('items.read')) return { items: [] };\n\n  const items = await getCollection<Item>('Item');\n  const rows = await items.list({ limit: 50 });\n  return { items: rows.map(({ id, title, status }) => ({ id, title, status })) };\n};`
			},
			{
				title: 'Add a browser collection when the page needs it',
				intro:
					'Pass the server rows as initialData. The collection can then handle live invalidation, ETags, persistence, or offline writes without delaying the first render.'
			},
			{
				title: 'Use the shared application shell',
				intro:
					'AdminShell supplies responsive application chrome, tenant navigation, settings, focus tools, and activity surfaces. Domain packages can stay focused on their own working views.'
			}
		]
	},
	{
		slug: 'interfaces',
		navTitle: 'Connect APIs, tools, and agents',
		eyebrow: 'Foundation 06',
		title: 'Choose which interfaces each object should have',
		lede: 'REST, MCP, WebMCP, and CLI can share one model description while exposing different operations to different audiences.',
		plainEnglish:
			'You choose what people, agents, browsers, and operators can do. s-m-r-t generates the repetitive route, tool, schema, and command wiring.',
		packages: ['smrt-core', 'smrt-app-mcp', 'smrt-app-cli', 'smrt-web'],
		visual: 'surfaces',
		sections: [
			{
				title: 'Expose only what each surface needs',
				intro:
					'A public HTTP API can be read-only while an internal CLI includes maintenance actions and an MCP server offers a narrow tool set.',
				points: [
					'REST routes and generated TypeScript clients.',
					'MCP and WebMCP tools with shared names and JSON Schema inputs.',
					'App-specific CLI resources and commands.',
					'Browser collections backed by the generated REST client.'
				]
			},
			{
				title: 'Treat WebMCP as a page surface',
				intro:
					'Register only the tools that make sense on the current page. They run through the signed-in browser session, so the server remains responsible for authentication, tenant scope, writable fields, and permissions.'
			},
			{
				title: 'Find every surface on the package page',
				intro:
					'Each package page keeps its description, components, playground entries, REST surface, MCP and WebMCP tools, and CLI notes together.'
			}
		]
	}
];

export const capabilityGuides: Guide[] = [
	{
		slug: 'agent-assisted-forms',
		navTitle: 'Agent-assisted forms',
		eyebrow: 'New UI capability',
		title: 'Let an agent help with a form',
		lede: 's-m-r-t controls can tell a chat, voice, tutorial, or test adapter what they are, what they allow, and how to point to them without giving that adapter unchecked access to the page.',
		plainEnglish:
			'An agent can find a field, explain it, highlight it, check it, or propose a value. The user still confirms changes, and secret or read-only fields remain protected.',
		packages: ['smrt-ui', 'smrt-svelte', 'smrt-chat'],
		visual: 'agent-controls',
		sections: [
			{
				title: 'Give every control a stable address',
				intro:
					'A form has a formId and each control has a controlId, usually taken from its name. That lets an adapter refer to profile.displayName or settings.notifications without guessing from DOM position or visible wording.',
				points: [
					'Controls publish their label, description, kind, options, constraints, and current validation state.',
					'A subject can connect a control to the record being edited.',
					'Public, personal, sensitive, and secret classifications travel with the control description.'
				]
			},
			{
				title: 'Help without changing anything',
				intro:
					'An adapter can list the controls in a form and use safe commands to focus, reveal, highlight, explain, or validate one of them. These commands help someone navigate the interface but do not change its values.',
				points: [
					'Highlight can point to the field being discussed in chat.',
					'Explain returns the control description, choices, and constraints to the adapter.',
					'Validate runs the same rule the visible form uses.'
				]
			},
			{
				title: 'Propose first, then ask',
				intro:
					'Staging records a proposed value separately from the live form. Applying, clearing, or undoing an agent change requires an explicit confirmed command by default, so the UI has a natural place for a review step.',
				points: [
					'Secret values are redacted and cannot be read or changed through the registry.',
					'Read-only, disabled, and non-writable controls reject mutation commands.',
					'Applications can supply a stricter policy for their own risk and permission rules.'
				]
			},
			{
				title: 'Connect the adapter your product uses',
				intro:
					'The registry deliberately does not know about a particular chat model, voice service, WebMCP transport, or DOM implementation. Your adapter translates a trusted tool call or tutorial step into the small command vocabulary.',
				filename: 'AgentAssistedProfile.svelte',
				code: `<script lang="ts">\n  import {\n    Form, FormGroup, Input,\n    createControlInteractionRegistry\n  } from '@happyvertical/smrt-ui/forms';\n\n  const controls = createControlInteractionRegistry();\n\n  async function proposeDisplayName(value: string) {\n    await controls.execute({\n      action: 'stage',\n      identity: { formId: 'profile', controlId: 'displayName' },\n      value\n    }, { source: 'agent' });\n  }\n\n  async function confirmDisplayName() {\n    await controls.execute({\n      action: 'apply',\n      identity: { formId: 'profile', controlId: 'displayName' }\n    }, { source: 'agent', confirmed: true });\n  }\n</script>\n\n<Form formId="profile" interactionRegistry={controls}>\n  <FormGroup label="Display name">\n    <Input name="displayName" />\n  </FormGroup>\n</Form>`
			},
			{
				title: 'Know where the boundary is today',
				intro:
					'The standardized controls, registry, safety policy, s-m-r-t Svelte form bridge, and interactive playground example are included. A product still chooses and wires the chat or voice adapter that exposes these commands; smrt-chat does not silently control every form just because both packages are installed.'
			}
		]
	},
	{
		slug: 'learning-agents',
		navTitle: 'Learning agents',
		eyebrow: 'New capability',
		title: 'Agents learn—with boundaries',
		lede: 's-m-r-t agents can recall useful strategies, measure outcomes, develop tenant-specific personas, and propose better instructions without silently rewriting their own authority.',
		plainEnglish:
			'Learning is opt-in. Before a run, an agent recalls confident memories. After the run, success strengthens them and failure weakens them. Human feedback can become a proposed persona update, but approval is a separate permissioned action.',
		packages: ['smrt-agents', 'smrt-personas', 'smrt-prompts', 'smrt-chat'],
		visual: 'learning',
		sections: [
			{
				title: 'Recall before, capture after',
				intro:
					'LearningMemory stores scoped episodes with confidence, success and failure counts, expiry, and optional time decay. Memory is isolated by agent type, durable instance, and tenant.',
				filename: 'InvoiceAgent.ts',
				code: `class InvoiceAgent extends Agent {\n  static override learning = {\n    minConfidence: 0.8,\n    scope: 'invoice-extraction'\n  };\n\n  async run() {\n    const strategy = this.recalledMemories[0]?.value\n      ?? await this.discoverStrategy();\n\n    this.stageLearning({ key: this.documentId, value: strategy });\n    if (!this.validated) this.reportLearningOutcome({ success: false });\n  }\n}`
			},
			{
				title: 'Personas make one agent class many durable workers',
				intro:
					'A tenant can create several AgentPersona records for one class. Each can have its own instructions, tool ceiling, principal, schedule, dispatch subscriber, and memory scope. The default persona preserves the old singleton identity for a non-destructive upgrade.'
			},
			{
				title: 'Adaptation stops at a human gate',
				intro:
					'Feedback reinforces memory automatically. A reflection runner may draft a DirectiveProposal, but it cannot activate the rewrite. A principal with personas.activate-directive must approve it, and the accepted text becomes a scoped prompt override.'
			},
			{
				title: 'Agents can delegate without widening authority',
				intro:
					'The invoke-agent tool carries an immutable principal through worker calls, intersects RBAC with agent and persona tool ceilings, limits delegation depth to three, and surfaces correlated completion events back to the conversation.'
			}
		]
	},
	{
		slug: 'mobile',
		navTitle: 'Mobile',
		eyebrow: 'New capability',
		title: 'A real mobile foundation, not a webview',
		lede: 's-m-r-t now shares offline behavior, authentication, network contracts, evidence capture, and presentation state across native Android and iOS apps.',
		plainEnglish:
			'smrt-mobile is Kotlin Multiplatform shared logic. smrt-android supplies Compose UI and Android adapters; smrt-ios supplies SwiftUI and Apple adapters. Your product keeps native UI while the hard stateful behavior stays consistent.',
		packages: ['smrt-mobile', 'smrt-mobile-contract', 'smrt-android', 'smrt-ios', 'smrt-users'],
		visual: 'mobile',
		sections: [
			{
				title: 'Offline is designed into the write path',
				intro:
					'A SQLDelight queue stores durable requests, replays them through a shared authenticated client, and uses idempotency keys so retrying a capture does not duplicate it. Offline packs are integrity-checked immutable snapshots with localized text resolution.'
			},
			{
				title: 'Native capabilities sit behind small seams',
				intro:
					'Barcode scanning, speech, on-device models, secure credential storage, location, evidence bytes, and auth launchers remain platform implementations of shared contracts.',
				points: [
					'Android: Compose, ML Kit, speech, Gemini Nano, Keystore, Custom Tabs.',
					'iOS: SwiftUI, VisionKit, Speech, Foundation Models, Keychain, ASWebAuthenticationSession.',
					'Shared: StateFlow presenters, session bootstrap, packs, evidence, networking, and queue policy.'
				]
			},
			{
				title: 'The server contract is part of the framework',
				intro:
					'smrt-users provides reusable /api/mobile handlers for brokered PKCE login, session bootstrap, device registration, and multipart upload. App-specific bootstrap data belongs in an explicit extras object.'
			}
		]
	},
	{
		slug: 'live-data',
		navTitle: 'Hydration and live data',
		eyebrow: 'New capability',
		title: 'Hydrate once, then stay current',
		lede: 'SvelteKit can render server data immediately, seed the same rows into browser collections, and keep them live without a duplicate loading pass.',
		plainEnglish:
			'Server rendering gives the first page. Hydration teaches the browser store what it already has. Change signals and a durable outbox handle what happens next—online or off.',
		packages: ['smrt-web', 'smrt-svelte', 'smrt-core'],
		visual: 'live',
		sections: [
			{
				title: 'Hydration is a handoff, not another fetch',
				intro:
					'Generated web collections are seeded from SvelteKit load data with a manifest hash and dependency key. The client can render immediately, preserve type information, and invalidate along normal SvelteKit conventions.'
			},
			{
				title: 'Live reads have a durable spine',
				intro:
					'Server writes append to _smrt_changes and emit an _events SSE stream. The browser subscriber resumes from a cursor, falls back to polling, and invalidates affected collections and relationships.',
				points: [
					'ETags avoid unchanged response bodies.',
					'Manifest hashes isolate incompatible persisted data.',
					'updateAvailable tells the app when code and stored client data disagree.'
				]
			},
			{
				title: 'Offline writes replay safely',
				intro:
					'The IndexedDB outbox coordinates across tabs with Web Locks and replays through the same idempotent sync-apply endpoint used by mobile. Conflict semantics and last-write-wins rules are explicit at the server boundary.'
			},
			{
				title: 'ORM hydration still matters too',
				intro:
					'On the server, normal list() calls hydrate database rows into the correct STI subclass with inherited fields and relationships. Use list({ select }) when you intentionally want plain projected rows and no object construction.'
			}
		]
	},
	{
		slug: 'webmcp',
		navTitle: 'WebMCP',
		eyebrow: 'New capability',
		title: 'Your web app becomes an agent tool surface',
		lede: 's-m-r-t generates WebMCP tools from the same model actions and field metadata as MCP, then registers them with the browser for in-page agents to discover and invoke.',
		plainEnglish:
			'In a browser with WebMCP support, your page can advertise useful application actions to an AI agent. Those actions still run as the signed-in page user through the generated REST API, so existing authentication, tenant, permission, and field policies remain in charge.',
		packages: ['smrt-web', 'smrt-core', 'smrt-app-mcp'],
		visual: 'webmcp',
		sections: [
			{
				title: 'One tool vocabulary, in the server and the page',
				intro:
					'The core descriptor builder emits the same stable tool names, descriptions, and JSON Schema inputs for Node MCP and browser WebMCP. A product_list tool means the same thing on both surfaces; list and get are marked with the WebMCP read-only hint.',
				points: [
					'One generated descriptor per exposed collection action.',
					'CRUD tools cover list, get by ID or slug, create, update, and delete.',
					'Unsupported browsers and server rendering safely receive a no-op disposer.'
				]
			},
			{
				title: 'Register only the tools this page should offer',
				intro:
					'Pass the generated web collection definitions to registerWebMcpTools. A filter can narrow the page to read-only tools or any other deliberate subset, and the returned disposer removes every registration together.',
				filename: 'webmcp.client.ts',
				code: `import { collectionDefinitions } from '@happyvertical/smrt-virt-web';
import { registerWebMcpTools } from '@happyvertical/smrt-web';

const dispose = registerWebMcpTools(
  Object.values(collectionDefinitions),
  { filter: (_definition, tool) => tool.readOnly }
);

// Remove this page's tools when the surface unmounts.
dispose();`
			},
			{
				title: 'The page session is the security boundary',
				intro:
					'WebMCP execution reuses the generated REST fetchers as the authenticated page user. REST authentication, tenant gates, writable-field rules, sensitive-field policy, and operation permissions are enforced in their existing server boundary rather than copied into browser tool code.'
			},
			{
				title: 'The first slice is deliberately honest',
				intro:
					'Generated CRUD actions are wired today. Custom model actions already receive descriptors, but their browser execution currently returns a clear not-wired response until they join the shared client collection path.'
			}
		]
	},
	{
		slug: 'reports',
		navTitle: 'Reports',
		eyebrow: 'New package',
		title: 'Reports are durable read models',
		lede: 'smrt-reports turns repeated aggregate questions into materialized, tenant-aware s-m-r-t models that can rebuild, refresh incrementally, and run on a schedule.',
		plainEnglish:
			'Define how rows group and which measures to calculate. s-m-r-t compiles the aggregate, stores the result in an ordinary report table, and tracks refresh runs, watermarks, locks, and schedules.',
		packages: ['smrt-reports', 'smrt-jobs', 'smrt-tenancy'],
		visual: 'reports',
		sections: [
			{
				title: 'Declare the question beside the model',
				intro:
					'Report decorators describe dimensions, time buckets, and measures. The compiler produces a portable aggregate spec; the SDK query builder owns SQL generation.',
				filename: 'DailySalesReport.ts',
				code: `@report({ source: Sale, refresh: 'incremental' })\nclass DailySalesReport extends SmrtReport {\n  @timeBucket({ source: 'soldAt', unit: 'day' })\n  day = new Date();\n\n  @groupBy({ source: 'tenantId' })\n  tenantId = '';\n\n  @sum({ source: 'total' })\n  revenue = 0.0;\n}`
			},
			{
				title: 'Incremental refresh recomputes affected groups',
				intro:
					'A source watermark finds changed rows. s-m-r-t recomputes the groups those rows belong to and removes empty groups, avoiding the correctness traps of applying aggregate deltas blindly.'
			},
			{
				title: 'Operations are visible and recoverable',
				intro:
					'Runs, watermarks, locks, refresh tasks, and schedules are schema-managed system models. Cron and on-change refreshes use the existing jobs runtime rather than inventing a second queue.'
			}
		]
	},
	{
		slug: 'application-shell',
		navTitle: 'AdminShell',
		eyebrow: 'New capability',
		title: 'The admin app shell is already designed',
		lede: 'AdminShell gives s-m-r-t applications a responsive four-edge workspace with tenant navigation, settings, focus tools, status, and live activity feeds.',
		plainEnglish:
			'The shell owns application chrome so each domain package can focus on its working surface. A manifest can build tenant navigation on the server; live jobs and changes can feed activity without coupling the shell to a transport.',
		packages: ['smrt-svelte', 'smrt-ui', 'smrt-template-sveltekit'],
		visual: 'shell',
		sections: [
			{
				title: 'Four edges, four scopes',
				intro:
					'Top, left, right, and bottom panels have explicit geometry and responsive presentation. App, tenant, focus, and system scopes make ownership legible instead of accumulating one giant sidebar.'
			},
			{
				title: 'Navigation comes from the manifest',
				intro:
					'tenantNavFromManifest groups resources by package and filters them by permitted resources. Build it in +layout.server.ts and the first render arrives with the correct navigation—no client fetch required.'
			},
			{
				title: 'Activities accept any transport',
				intro:
					'Jobs, polling, SSE, WebSockets, and application events all adapt into one activity registry. The shell itself stays transport-agnostic and SSR-safe.'
			}
		]
	},
	{
		slug: 'collections',
		navTitle: 'Collection reads',
		eyebrow: 'Core improvement',
		title: 'Lists can be smaller, faster, and safer',
		lede: 'Collection reads now cover projections, eager relationships, caching, tenant-safe counts, and polymorphic hydration with clearer contracts.',
		plainEnglish:
			'Use a normal list when you want real objects and their methods. Use select when you only need a few columns. The type system tells you which shape comes back.',
		packages: ['smrt-core', 'smrt-tenancy'],
		visual: 'collections',
		sections: [
			{
				title: 'Projection avoids unnecessary hydration',
				intro:
					'list({ select }) validates logical s-m-r-t field names, maps them to database columns, blocks sensitive and permission-gated fields, and returns precisely typed plain rows.',
				filename: 'list-open-tasks.ts',
				code: `const rows = await tasks.list({\n  select: ['id', 'title', 'accountId'] as const,\n  where: { status: 'open' },\n  orderBy: 'created_at DESC',\n  limit: 50\n});\n\n// Array<{ id; title; accountId }>, not Task[]`
			},
			{
				title: 'Hydrated lists keep object behavior',
				intro:
					'Without select, rows become the correct model or STI subtype. include eagerly loads named relationships in batches to avoid N+1 work. Projection and include are intentionally mutually exclusive.'
			},
			{
				title: 'Read caching is explicit',
				intro:
					'Models or individual list/get calls can opt into TTL caching, including cross-process storage. Writes invalidate affected entries. count always goes to the database and now runs the same tenant interceptors as list.'
			}
		]
	},
	{
		slug: 'field-policies',
		navTitle: 'Field policies',
		eyebrow: 'Field policies 01',
		title: 'Defaults and visibility resolve in layers',
		lede: 'A field policy decides what a field is called, whether it appears before the advanced disclosure, what it starts out as, and what its help text says. The code states a starting arrangement, an organization adapts it, and a person can adapt it again for themselves.',
		plainEnglish:
			'The form your code ships is a starting point, not a final answer. An organization can move a field out of the way or give it a house default for everyone, and an individual can do the same for their own account, without anyone editing the code.',
		packages: ['smrt-fields', 'smrt-core', 'smrt-users', 'smrt-tenancy'],
		sections: [
			{
				title: 'Seed the arrangement next to the model',
				intro:
					'@field({ ui }) records presentation hints beside the field they describe. They ride the manifest under the field’s _meta.ui, reach the browser in generated collection definitions, and have no schema, persistence, or security effect. The field description becomes the starting help text. The class-level ui.description round-trips through the manifest as the seed for form-level help, but nothing reads it for you — a host passes it to FormHelp.',
				points: [
					'basic seeds the field into the tier shown before the advanced disclosure.',
					'group, order, and locked carry the grouping key, sort order, and an initial organization lock.',
					'Cold-start rule: an object with no basic markers renders every field basic; once any field is marked, unmarked fields start advanced.'
				],
				filename: 'src/lib/objects/Invoice.ts',
				code: `import { field, smrt, SmrtObject } from '@happyvertical/smrt-core';\n\n@smrt({\n  api: { include: ['list', 'get', 'create', 'update'] },\n  ui: { label: 'Invoices', description: 'Bills you send to a customer.' }\n})\nexport class Invoice extends SmrtObject {\n  @field({\n    required: true,\n    description: 'Who the invoice is addressed to.',\n    ui: { basic: true, order: 1 }\n  })\n  customerName = '';\n\n  @field({\n    description: 'Payment terms printed on the invoice.',\n    ui: { basic: true, order: 2 }\n  })\n  terms = 'Net 30';\n\n  @field({\n    description: 'Internal note for the accounts team.',\n    ui: { group: 'Accounting', order: 10 }\n  })\n  internalNote = '';\n}`
			},
			{
				title: 'Four layers merge into one answer',
				intro:
					'Resolution runs low to high: the code seed, then app rows, then the tenant chain, then the signed-in user. Each stored row is sparse — a column left NULL inherits from the layer below it, so an organization that only wants to change a default never has to restate the label, help, or visibility.',
				points: [
					'resolveFieldPolicy returns the merged policy for one object.',
					'resolveFieldPolicyExplained returns the same result plus the ordered per-layer contributions, so a gear or admin view never re-derives precedence itself.',
					'Without a db the resolver returns the code seed alone, which is the correct answer for a page that has no policy store yet.'
				],
				filename: 'src/lib/server/article-policy.ts',
				code: `import {\n  resolveFieldPolicy,\n  resolveFieldPolicyExplained\n} from '@happyvertical/smrt-fields';\n\nconst policy = await resolveFieldPolicy(\n  '@happyvertical/smrt-content:Article',\n  { tenantId, userId, db }\n);\n\npolicy.fields.summary.visibility;   // 'basic' | 'advanced' | 'hidden'\npolicy.fields.summary.hasDefault;   // true when any layer resolved one\npolicy.fields.summary.defaultValue; // the parsed value\npolicy.fields.summary.locked;\n\n// Per-layer contributions for a gear or control panel\nconst explained = await resolveFieldPolicyExplained(\n  '@happyvertical/smrt-content:Article',\n  { tenantId, userId, db }\n);\n\nexplained.layers.summary;\n// [{ layer: 'code', delta }, { layer: 'tenant', tenantId, delta }, ...]`
			},
			{
				title: 'Resetting deletes the row',
				intro:
					'There is no “reset” flag. Removing a customization deletes the override row, which means the layer below it applies again — including later changes to that lower layer. Rows are keyed by object reference, field name, scope type, and scope key, so a reset is always precise.',
				points: [
					'To return one property to the layer below while keeping the rest of the row, set that column to null. Deleting the row resets every property at that scope.',
					'App rows carry no tenant or user; tenant rows carry only a tenant; user rows carry only a user.',
					'A user row follows the person rather than the membership, so a personal preference persists across the tenants they belong to.',
					'Writes inside a request derive the missing tenant or user from the ambient context and stamp who changed the row.'
				],
				filename: 'src/lib/server/set-house-default.ts',
				code: `import { FieldPolicyCollection } from '@happyvertical/smrt-fields';\n\nconst policies = await FieldPolicyCollection.create({ db });\n\n// The organization sets a house default and moves the field back a step\nawait policies.create({\n  objectRef: '@happyvertical/smrt-content:Article',\n  fieldName: 'summary',\n  scopeType: 'tenant',\n  tenantId,\n  visibility: 'advanced',\n  defaultValueRaw: 'TBD'\n});\n\n// Undoing the whole customization is an ordinary delete\nconst row = await policies.get({ id: rowId });\nawait row?.delete();`
			},
			{
				title: 'A tenant chain contributes from the root down',
				intro:
					'When tenants form a hierarchy, the chain is walked root to leaf so a parent organization can set a default that its branches inherit and a branch can still override it. A node that breaks permission inheritance discards every earlier contribution in the chain, so only the run of tenants beginning at the last break participates — in the merged result and in the explained layers alike.',
				points: [
					'The default hierarchy loader reads the tenant tree from smrt-users.',
					'When no hierarchy is available the resolver falls back to a flat, single-tenant chain.',
					'That fallback concerns tenant ancestry only. It is never a fallback around authorization.'
				]
			},
			{
				title: 'Locks are how an organization says no',
				intro:
					'locked may be set on an app or tenant row only. While the code, app, or tenant tiers resolve to locked, user-scope writes for that field are rejected and any existing user row is skipped during resolution — so a lock applied later does not silently leave old personal overrides in force.',
				points: [
					'A lock can be seeded in code with ui: { locked: true } and lifted by an organization administrator.',
					'Locks cascade with the tenant chain, so an ancestor tenant can lock a field for every branch beneath it.',
					'Unlocking restores the personal row that was being skipped rather than recreating it.'
				]
			},
			{
				title: 'A required field cannot quietly disappear',
				intro:
					'Demoting a required field out of the basic tier is only allowed when a usable default resolves for it. The rule is enforced when the row is written and enforced again when the policy is read, so deleting the row that carried the default cannot leave a form that silently cannot be submitted.',
				points: [
					'At read time a required field with no usable default always resolves basic and is flagged visibilityForced.',
					'On an update the row being replaced is excluded from the projected lower-layer lookup, so clearing its only default while demoting the field is rejected before anything is written.',
					'“Usable” excludes null and empty values, not false or zero.'
				]
			},
			{
				title: 'Policy is presentation, not permission',
				intro:
					'A field policy changes how a field is presented and pre-filled. It is not a security boundary and cannot be used as one. Two separate rails keep it in its lane: stored defaults are refused on the fields that carry risk, and the batch resolve endpoint omits those fields from its response for every caller.',
				points: [
					'Defaults are refused outright on transient, sensitive, and read-permission-gated fields. A policy may still set their visibility, label, help, or order — it just cannot put a value in them.',
					'System fields, relationship pseudo-fields, and single-table-inheritance meta storage fields are the only ones entirely outside what a policy row can address, so a row targeting them would never apply.',
					'Reference-field defaults must be UUID strings unless the field declares a text id type, because those columns are native UUIDs on PostgreSQL and DuckDB.'
				]
			}
		],
		related: [
			{ label: 'Build a policy-aware form', href: '/capabilities/policy-aware-forms' },
			{ label: 'Operate field policies', href: '/capabilities/field-policy-operations' },
			{ label: 'Field policy API', href: '/reference/field-policies' },
			{ label: 'Security defaults', href: '/reference/security' }
		]
	},
	{
		slug: 'policy-aware-forms',
		navTitle: 'Policy-aware forms',
		eyebrow: 'Field policies 02',
		title: 'Build a form that reads its own policy',
		lede: 'The Svelte primitives take a resolved policy as a prop and contribute visibility, ordering, labels, help, and default pre-fill. A hand-written form can adopt them one field at a time, or a whole form can be generated from the manifest.',
		plainEnglish:
			'You can keep the form you already have and let policy decide which fields show up first, or you can hand the object reference to one component and let it build the form.',
		packages: ['smrt-fields', 'smrt-ui', 'smrt-web'],
		sections: [
			{
				title: 'Adopt policy one field at a time',
				intro:
					'FieldPolicyProvider owns the basic/advanced mode and publishes the resolved policy. PolicyField wraps any input and contributes the label, the help hint, the required marker, visibility for the current mode, and default pre-fill on new records only. Outside a provider PolicyField renders its children verbatim, so adoption never has to be all at once.',
				points: [
					'ModeSwitch toggles between basic and advanced; AdvancedFields is the disclosure the advanced tier lives in.',
					'FormHelp collects the resolved per-field help into one panel. Pass the object-level description to its objectDescription prop; the package does not read it from the manifest for you.',
					'Set isNewRecord={false} on an edit form so a resolved default never overwrites a loaded value.'
				],
				filename: 'ArticleForm.svelte',
				code: `<script lang="ts">\n  import {\n    AdvancedFields,\n    FieldPolicyProvider,\n    ModeSwitch,\n    PolicyField\n  } from '@happyvertical/smrt-fields/svelte';\n  import { Input, Textarea } from '@happyvertical/smrt-ui/forms';\n\n  let { policy, record, isNew = true } = $props();\n</script>\n\n<FieldPolicyProvider {policy} mode="basic">\n  <ModeSwitch />\n\n  <PolicyField name="title" isNewRecord={isNew}>\n    <Input id="title" bind:value={record.title} />\n  </PolicyField>\n\n  <AdvancedFields>\n    <PolicyField name="summary" isNewRecord={isNew}>\n      <Textarea id="summary" bind:value={record.summary} />\n    </PolicyField>\n  </AdvancedFields>\n</FieldPolicyProvider>`
			},
			{
				title: 'Render a whole object from its manifest',
				intro:
					'ObjectForm renders the fields that appear in both the generated browser definitions and the resolved policy, ordered by policy. Sensitive and transient fields are never emitted into the generated definitions, so they cannot reach the form. Read-permission-gated fields are a different case: the batch resolve endpoint omits them, but a policy resolved server-side with resolveFieldPolicy still carries them — the overlap is not a permission filter, so keep enforcing read permission where you always did. ObjectForm itself is provider-free: the host decides where both inputs come from, which keeps server rendering and client fetching equally straightforward.',
				points: [
					'Pass generated browser definitions, never raw server registry fields.',
					'The actions snippet renders inside the native form ObjectForm owns, so a plain submit button keeps native submission along with the form’s own validation.',
					'To reuse a mounted create form for another new record, replace the bound record with an empty object or change createSessionKey.'
				],
				filename: 'ArticleWorkbench.svelte',
				code: `<script lang="ts">\n  import { ObjectForm } from '@happyvertical/smrt-fields/svelte';\n  import { articles } from '$lib/generated-clients';\n\n  let { definition, policy } = $props();\n  let record = $state({});\n\n  async function save(event: SubmitEvent) {\n    event.preventDefault();\n    await articles.create(record);\n  }\n</script>\n\n<ObjectForm\n  objectRef="@happyvertical/smrt-content:Article"\n  fields={definition.fields}\n  {policy}\n  bind:value={record}\n  isNewRecord\n  showModeSwitch\n  onsubmit={save}\n>\n  {#snippet actions()}\n    <button type="submit">Save</button>\n  {/snippet}\n</ObjectForm>`
			},
			{
				title: 'Register the generated collections once',
				intro:
					'An application can register every generated collection definition in one place and put the batch resolve client behind ObjectFormSourceProvider. Forms beneath it need only their canonical object reference. The registry validates both the generated definition and the untyped custom-action response, and fails closed with an accessible error state rather than rendering a partial form.',
				points: [
					'The registry takes a policy client: anything with resolveBatch({ objectRefs }), normally the generated FieldPolicy collection client.',
					'Generated custom-action clients are typed as any; the registry is where that boundary is checked.',
					'assertObjectFormCollectionDefinition validates a definition before it enters the registry.',
					'The canonical reference is @package/name:ClassName, for example @happyvertical/smrt-content:Article.'
				],
				filename: 'src/lib/object-form-source.ts',
				code: `import { collectionDefinitions } from '@happyvertical/smrt-virt-web';\nimport {\n  assertObjectFormCollectionDefinition,\n  ObjectFormSourceRegistry\n} from '@happyvertical/smrt-fields/svelte';\nimport { fieldPolicies } from '$lib/generated-clients';\n\n// fieldPolicies only has to satisfy { resolveBatch({ objectRefs }) }.\nexport const objectFormSource = new ObjectFormSourceRegistry(fieldPolicies);\n\nfor (const definition of Object.values(collectionDefinitions)) {\n  assertObjectFormCollectionDefinition(definition);\n  objectFormSource.register(definition);\n}\n\n// <ObjectFormSourceProvider source={objectFormSource}>\n//   <ObjectForm objectRef="@happyvertical/smrt-content:Article" bind:value={record} />\n// </ObjectFormSourceProvider>`
			},
			{
				title: 'Open the generated routes the form needs',
				intro:
					'ObjectForm renders and binds a record; saving it is still the application’s generated API. Objects that were declared api: false have no routes to save through, so adopting a form usually means opening a deliberately narrow include list on that one object rather than opening the whole model.',
				points: [
					'Keep delete out of the include list when the interface never deletes.',
					'writable narrows which fields a generated write will accept, independently of what the form displays.',
					'Field policy never widens this. A field hidden by policy is still writable by the API unless the model says otherwise.',
					'The example below is the SaaS starter’s own settings object; the operations guide walks the rest of its integration.'
				],
				filename: 'packages/app-objects/src/models/StarterAppSetting.ts',
				code: `@smrt({\n  tableName: 'starter_app_settings',\n  conflictColumns: ['key'],\n  api: {\n    include: ['list', 'get', 'create', 'update'],\n    principalContext: true,\n    writable: ['key', 'value', 'metadata']\n  },\n  mcp: false,\n  cli: false\n})\nexport class StarterAppSetting extends SmrtObject {\n  // ...\n}`
			},
			{
				title: 'Replace an input without inventing a wire type',
				intro:
					'The built-in inputs cover text, integer, decimal, boolean, datetime, JSON, and reference identifiers. There is no select wire type in s-m-r-t: a field with a fixed set of choices keeps its persisted type, normally text, and the application registers a select-like renderer for that one field. A field-specific registration wins over a wire-type registration.',
				points: [
					'createFieldInputRegistry returns a registry scoped to one application root rather than a global.',
					'Reference fields stay identifier inputs on purpose until an application supplies a chooser.',
					'policyToVisibleColumnIds adapts the same resolved policy to a smrt-ui DataTable; it never reveals a column that is statically hidden and never hides unmapped action or computed columns.'
				],
				filename: 'src/lib/field-inputs.ts',
				code: `import { createFieldInputRegistry } from '@happyvertical/smrt-fields/svelte';\nimport StatusSelect from '$lib/components/StatusSelect.svelte';\n\nexport const inputRegistry = createFieldInputRegistry();\n\n// The column stays text; only the rendering changes.\ninputRegistry.registerField(\n  '@happyvertical/smrt-content:Article',\n  'status',\n  StatusSelect\n);`
			}
		],
		related: [
			{ label: 'How resolution works', href: '/capabilities/field-policies' },
			{ label: 'Operate field policies', href: '/capabilities/field-policy-operations' },
			{ label: 'Field policy API', href: '/reference/field-policies' },
			{ label: 'smrt-fields package', href: '/packages/smrt-fields' }
		]
	},
	{
		slug: 'field-policy-operations',
		navTitle: 'Field policy operations',
		eyebrow: 'Field policies 03',
		title: 'Run field policies in production',
		lede: 'Two permissions divide organization rules from personal preferences. A gear edits the form in front of you, a control panel shows the whole organization, and identity always comes from the request rather than the request body.',
		plainEnglish:
			'Administrators set the arrangement everyone starts from. Everyone else can adjust their own view unless a field is locked. A personal preference belongs to the person who set it: the server takes the identity from the request, never from the request body.',
		packages: ['smrt-fields', 'smrt-users', 'smrt-svelte'],
		sections: [
			{
				title: 'Two permissions, two audiences',
				intro:
					'fields.policy.manage authorizes app- and tenant-scope administration. fields.policy.personalize authorizes a principal to maintain their own user tier and nothing else. Both are ordinary entries in the smrt-users permission catalog, so they are granted through roles like any other permission.',
				points: [
					'ensureFieldPolicyPermissionsRegistered registers both definitions when the package is loaded.',
					'FIELD_POLICY_PERMISSION_DEFINITIONS is the catalog entry list, and the two slugs are exported as MANAGE_FIELD_POLICY_PERMISSION and PERSONALIZE_FIELD_POLICY_PERMISSION.',
					'App-scope writes from inside a tenant context additionally require a super-admin bypass.'
				],
				filename: 'src/lib/server/field-policy-permissions.ts',
				code: `import {\n  ensureFieldPolicyPermissionsRegistered,\n  MANAGE_FIELD_POLICY_PERMISSION,\n  PERSONALIZE_FIELD_POLICY_PERMISSION\n} from '@happyvertical/smrt-fields';\n\nensureFieldPolicyPermissionsRegistered();\n\nMANAGE_FIELD_POLICY_PERMISSION;      // 'fields.policy.manage'\nPERSONALIZE_FIELD_POLICY_PERMISSION; // 'fields.policy.personalize'`
			},
			{
				title: 'A missing identity denies rather than skips',
				intro:
					'Both the write guard and the read guard treat an absent identity component as a denial. A context that carries permissions but no user id — API-key authentication, a service principal, a background job, a bare tenant context — may not touch the user tier at all. Because user rows carry no tenant by design, a skipped check would let one principal write another principal’s row, so an absent identity denies rather than passes through.',
				points: [
					'The batch resolve action takes identity exclusively from the ambient context; the request body cannot select another tenant or user.',
					'Saving or deleting an existing row is also authorized against the row’s persisted scope, looked up by primary key and by natural key.',
					'Server-side callers that legitimately need explicit identities call resolveFieldPolicy directly instead of going through the endpoint.'
				]
			},
			{
				title: 'The gear edits the form in front of you',
				intro:
					'FieldPolicyGearProvider makes the context-derived editor state available to any policy-aware form without choosing a transport. It takes a FieldPolicyEditorAdapter — load, create, update, delete — and that adapter must not accept tenant or user identifiers, because the server derives them. The provider also needs the same generated field definitions the form renders.',
				points: [
					'Normally the adapter wraps the generated FieldPolicy collection client’s getEditorState, create, update, and delete calls. An application that routes policy writes through its own endpoints can supply those instead; the contract is transport-neutral.',
					'Place the affordance with FieldPolicyGearButton, or set showPolicyGear on ObjectForm.',
					'The editor separates an Organization tab from a Personal tab; organizationScope selects app or tenant for hosts that administer the whole application.',
					'The gear posts an already-JSON-encoded default, which is the same wire contract the generated write routes use.',
					'registerFieldPolicyFocusTool registers the panel into an AdminShell dock without making the package depend on smrt-svelte.'
				],
				filename: 'src/lib/field-policy-gear.ts',
				code: `import type { FieldPolicyEditorAdapter } from '@happyvertical/smrt-fields/svelte';\nimport { fieldPolicies } from '$lib/generated-clients';\n\n// No tenant or user identifier appears anywhere in this contract.\nexport const fieldPolicyAdapter: FieldPolicyEditorAdapter = {\n  load: ({ objectRef }) => fieldPolicies.getEditorState({ objectRef }),\n  create: (input) => fieldPolicies.create(input),\n  update: ({ id, ...input }) => fieldPolicies.update(id, input),\n  delete: ({ id }) => fieldPolicies.delete(id)\n};`
			},
			{
				title: 'Mount the gear around the form',
				intro:
					'The provider wraps whatever renders the form. Inside it, ObjectForm can show the gear itself, or a hand-written form can place FieldPolicyGearButton wherever it belongs.',
				filename: 'ArticleWorkbench.svelte',
				code: `<script lang="ts">\n  import {\n    FieldPolicyGearProvider,\n    ObjectForm\n  } from '@happyvertical/smrt-fields/svelte';\n  import { fieldPolicyAdapter } from '$lib/field-policy-gear';\n\n  let { definition, policy } = $props();\n  let record = $state({});\n\n  const objectRef = '@happyvertical/smrt-content:Article';\n</script>\n\n<FieldPolicyGearProvider\n  {objectRef}\n  fields={definition.fields}\n  adapter={fieldPolicyAdapter}\n>\n  <ObjectForm\n    {objectRef}\n    fields={definition.fields}\n    {policy}\n    bind:value={record}\n    showPolicyGear\n  />\n</FieldPolicyGearProvider>`
			},
			{
				title: 'The control panel is the organization view',
				intro:
					'buildFieldPolicySettingsCatalog is a server-side, URL-driven catalog builder, and FieldPolicyControlPanel renders it with a catalog component the host injects. The panel displays code, app, and organization values by replaying the explained resolver layers rather than recalculating precedence, and it asks for an explicit confirmation before a reset or a drift prune.',
				points: [
					'The panel takes the same adapter as the gear plus a loadAudit call, typed FieldPolicyControlPanelAdapter.',
					'policyAudit is the only routed organization roll-up. It requires fields.policy.manage, returns the caller tenant’s editable rows and read-only app summaries, and represents other users strictly as per-field counts.',
					'Route permission is the host’s responsibility: check it in the server load before building the catalog.',
					'fieldPolicyControlPanelNavItem returns a permission-filtered navigation entry for the shell to place.'
				],
				filename: 'src/routes/app/settings/field-policies/+page.server.ts',
				code: `import {\n  buildFieldPolicySettingsCatalog,\n  MANAGE_FIELD_POLICY_PERMISSION,\n  parseFieldPolicyCatalogQuery\n} from '@happyvertical/smrt-fields';\n\nexport const load = async ({ locals, url }) => {\n  const membership = await requirePermission(locals, MANAGE_FIELD_POLICY_PERMISSION);\n\n  return {\n    permissions: membership.permissions,\n    fieldPolicies: await buildFieldPolicySettingsCatalog({\n      db: locals.db,\n      ...parseFieldPolicyCatalogQuery(url.searchParams)\n    })\n  };\n};`
			},
			{
				title: 'Personal preference versus organization rule',
				intro:
					'The Personal tab writes a user row, which follows the person rather than a membership. The Organization tab writes an app or tenant row that everyone in scope starts from. The difference matters most when the two disagree: the user tier wins, unless the organization has locked the field, in which case the personal row is skipped entirely while the lock stands.',
				points: [
					'A personal draft is shown against a non-disclosing signal of the lower layers, so a member never learns another tenant’s values from the editor.',
					'Manifest drift — rows for fields that no longer exist — is listed for administrators and pruned by ordinary deletes.',
					'Resolved results are cached briefly per database, object, tenant, user, and hierarchy loader; saving or deleting a row invalidates every entry for that object.'
				]
			},
			{
				title: 'Usage learning is merged upstream, not yet released',
				intro:
					'The optional usage-learning loop turns recent aggregated form usage into administrator-reviewed suggestions. It merged into the framework repository after the 0.40.61 cut and is present in no published release of @happyvertical/smrt-fields, so nothing described here is available to install today. The behaviour below is what the framework’s main branch implements now; treat the specifics as subject to change until a release ships them.',
				points: [
					'Capture is per-host opt-in and success-gated: a browser form reports only after its persistence handler acknowledges success, it requires both an ambient tenant and an authenticated user, and a form that supplies no reporter never captures anything.',
					'Values are minimized. Raw values travel only for low-cardinality boolean and reference fields; text, numbers, dates, JSON, and anything sensitive or read-permission-gated stay count-only, and the server drops fields the live registry does not recognize.',
					'Suggestions are read and decided under fields.policy.manage and are never applied automatically. Accepting one writes an ordinary tenant policy through the normal validation rails.',
					'Retention and rate limits are bounded: counters kept 90 days and capped at 100,000 rows, accepted suggestions pruned after 180 days, a 30-day cooldown after a dismissal, and at most one contribution per tenant, user, object, field, and UTC day. The maintenance schedules install dormant.'
				]
			},
			{
				title: 'The SaaS starter shows the whole path',
				intro:
					'The public smrt-saas-starter adopted the rail end to end at s-m-r-t 0.40.61: static ui hints on its settings object, a policy-aware ObjectForm with the gear, a permission-checked control panel route, and a shell navigation entry. It also shows the ordinary friction — its objects were closed to the generated API, so the one object the browser manages had to open a narrow include list before a form could round-trip.',
				points: [
					'packages/app-objects/src/models/StarterAppSetting.ts carries the @field({ ui }) seed and the narrowed api include list; its sibling StarterInvitation stays api: false.',
					'apps/web/src/lib/field-policy-client.ts holds the adapter, which posts to hand-written /api/field-policies routes rather than wrapping the generated client — the adapter contract is transport-neutral, so both shapes are valid.',
					'apps/web/src/lib/server/field-policy.ts wraps every call in the membership the application already verified and rejects any object reference other than its own settings object.',
					'apps/web/src/routes/app/settings/field-policies/+page.server.ts checks fields.policy.manage before it builds the catalog, and its test asserts a non-manager is refused before any data is loaded.',
					'The starter registers role-to-permission mapping in its own authorization module rather than seeding the framework permission catalog, which is worth knowing before copying it.'
				]
			},
			{
				title: 'Adoption checklist',
				intro:
					'Adopting field policy is additive, and there is nothing to rewrite: PolicyField outside a provider renders its children verbatim, so the forms you already have keep working until you wrap them. Each step below is useful on its own, and a project can stop after any of them.',
				points: [
					'1. Add @happyvertical/smrt-fields at the same exact version as the rest of your s-m-r-t packages. It pins smrt-core, smrt-tenancy, smrt-ui, and smrt-users to that version, and mixing versions installs a second copy of the object registry.',
					'2. Add it to the package list your build and your runtime already share — the packages array you pass to smrtConsumer in vite.config.ts, and the same list your application imports at startup. The consumer plugin then merges the package manifest and _smrt_field_policies migrates with the rest of your schema. Installing the dependency alone does not create the table.',
					'3. Seed presentation in code: add ui hints to the fields that deserve them, and remember the cold-start rule once you mark the first field.',
					'4. Grant fields.policy.manage to administrator roles and fields.policy.personalize to everyone who should be able to adjust their own forms.',
					'5. Resolve a policy in a server load and pass it to a form. PolicyField on a few fields is a complete first step.',
					'6. Open the generated API for any object whose form has to save, keeping the include list and writable list as narrow as the interface actually needs.',
					'7. Add the gear where a form deserves one, then the control panel route behind a server-side permission check.',
					'8. Review drift after a model change, since rows for removed fields survive until an administrator prunes them.'
				]
			}
		],
		related: [
			{ label: 'How resolution works', href: '/capabilities/field-policies' },
			{ label: 'Build a policy-aware form', href: '/capabilities/policy-aware-forms' },
			{ label: 'Field policy API', href: '/reference/field-policies' },
			{ label: 'Memberships and permissions', href: '/foundations/memberships-and-permissions' },
			{ label: 'Security defaults', href: '/reference/security' },
			{
				label: 'Starter: StarterAppSetting.ts',
				href: 'https://github.com/happyvertical/smrt-saas-starter/blob/e24131ab6ea9ebe46762065b8b413eba97559994/packages/app-objects/src/models/StarterAppSetting.ts',
				external: true
			},
			{
				label: 'Starter: field-policy-client.ts',
				href: 'https://github.com/happyvertical/smrt-saas-starter/blob/e24131ab6ea9ebe46762065b8b413eba97559994/apps/web/src/lib/field-policy-client.ts',
				external: true
			},
			{
				label: 'Starter: server/field-policy.ts',
				href: 'https://github.com/happyvertical/smrt-saas-starter/blob/e24131ab6ea9ebe46762065b8b413eba97559994/apps/web/src/lib/server/field-policy.ts',
				external: true
			},
			{
				label: 'Starter: control panel route',
				href: 'https://github.com/happyvertical/smrt-saas-starter/blob/e24131ab6ea9ebe46762065b8b413eba97559994/apps/web/src/routes/app/settings/field-policies',
				external: true
			}
		]
	}
];

export function getFoundationGuide(slug: string): Guide | undefined {
	return foundationGuides.find((guide) => guide.slug === slug);
}

export function getCapabilityGuide(slug: string): Guide | undefined {
	return capabilityGuides.find((guide) => guide.slug === slug);
}
