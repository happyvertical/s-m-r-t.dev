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
			}
		]
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
	}
];

export function getFoundationGuide(slug: string): Guide | undefined {
	return foundationGuides.find((guide) => guide.slug === slug);
}

export function getCapabilityGuide(slug: string): Guide | undefined {
	return capabilityGuides.find((guide) => guide.slug === slug);
}
