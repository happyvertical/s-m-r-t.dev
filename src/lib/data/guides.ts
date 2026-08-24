import type { GuideCallout } from '$lib/data/callouts';
import { TOOLING_PINNED_VERSION } from '$lib/data/tooling';

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
	/** Optional admonition rendered after the section body. */
	callout?: GuideCallout;
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
		| 'agent-legibility'
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
		],
		related: [
			{
				label: 'AI methods, object memory, and semantic search',
				href: '/reference/ai-and-retrieval'
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
					'Tenant hierarchy, membership, and profile relationships answer different questions. Keeping them separate makes access rules clear.',
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
					'Required scope means every row belongs to a tenant. Optional scope allows shared rows and tenant rows. Global models remain outside tenant filtering. The request session establishes the authorized tenant context.'
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
				title: 'Sign in through an identity provider',
				intro:
					'Declare one or more OIDC providers in configuration. Mount a login route and a callback route. The handlers own the protocol. Each login gets its own state, nonce, and PKCE verifier. The callback verifies state and the authorization-response issuer. It also verifies the signed ID token and nonce before it reads a claim.',
				points: [
					'The PKCE challenge method is always S256.',
					'An ID token with no email claim falls back to the provider UserInfo endpoint.',
					'On success the handler links an OIDC identity, resolves the user, and sets the normal session cookie.',
					'A failed login without a configured redirect returns a plain 401 rather than describing the account.'
				],
				filename: 'src/routes/auth/[provider]/callback/+server.ts',
				code: `import { createOidcCallbackHandler } from '@happyvertical/smrt-users/sveltekit';\n\nexport const GET = createOidcCallbackHandler({\n  db: { type: 'postgres', url: process.env.DATABASE_URL! },\n  successRedirect: '/dashboard'\n});`
			},
			{
				title: 'The first identity binding is a decision you make',
				intro:
					'A new provider identity can resolve to a person record that already has an owning user. Sign-in then stops before it creates an account, identity link, or session. This behavior is deliberate. Matching email addresses do not prove that the same person is behind both. An application with an invitation or approval workflow can authorize that first binding explicitly.',
				points: [
					'Return undefined to keep the fail-closed default, or null to reject the login outright.',
					'The framework reloads both records by id inside the same transaction rather than trusting what you returned.',
					'The provider must report the email as verified, and an identity that is already bound can never be rebound.',
					'A race can run the hook twice, so it has to be safe to repeat.'
				],
				filename: 'src/routes/auth/[provider]/callback/+server.ts',
				code: `import { ProfileCollection } from '@happyvertical/smrt-profiles';\nimport { createOidcCallbackHandler } from '@happyvertical/smrt-users/sveltekit';\n\nexport const GET = createOidcCallbackHandler({\n  db,\n  authorizeProfileOwner: async ({ claims, db, users }) => {\n    const approval = await findApprovedInvite({ db, email: claims.email });\n    if (!approval) return undefined; // keep the secure default\n\n    const profiles = await ProfileCollection.create({ db });\n    const profile = await profiles.get({ id: approval.profileId });\n    const user = await users.get({ id: approval.userId });\n    if (!profile || !user) return null; // reject a stale approval\n\n    return { profile, user };\n  },\n  successRedirect: '/dashboard'\n});`
			},
			{
				title: 'Sign in from a terminal',
				intro:
					'Command-line tools use the device-code flow. The CLI starts a request and receives a secret device code, a short code the person reads aloud or types, and a verification URL. The person approves it in an already signed-in browser, and the CLI polls until it can exchange its device code for a bearer token.',
				points: [
					'The device code is stored only as a hash; the short user code is what a human handles.',
					'The bearer token resolves to the same session context as a browser cookie, so permissions and tenant scope match.',
					'Approving is idempotent, and a request expires if nobody approves it in time.',
					'Because user codes are short, repeated failed approvals are rate limited per user.'
				],
				filename: 'src/routes/api/cli/auth/token/+server.ts',
				code: `import { createTerminalAuthTokenHandler } from '@happyvertical/smrt-users/sveltekit';\n\n// The CLI polls this until it answers approved, then stores the token.\nexport const POST = createTerminalAuthTokenHandler({ db });`
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
					'Public model operations contribute permission names. Sync the catalog after migration, then seed or assign roles with the permissions your app needs.',
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
					'Generated routes are authentication-gated and tenant-scoped. Custom SvelteKit actions, jobs, and in-process writes must also check the principal permission snapshot. assertOperationPermission derives the same names the catalog holds and refuses an operation whose name is not in it.',
				filename: 'src/routes/articles/+page.server.ts',
				code: `import { assertOperationPermission } from '@happyvertical/smrt-users';\n\n// Throws OperationPermissionError (status: 403) unless the caller holds\n// articles.publish in the tenant that owns this article, or is running in\n// system or super-admin context. Map error.status to a response yourself.\nawait assertOperationPermission({\n  ...getSmrtConfig('Permission'),\n  collection: 'articles',\n  action: 'publish',\n  userId: locals.user.id,\n  tenantId: article.tenantId\n});`
			},
			{
				title: 'Postgres can check the same names on every row',
				intro:
					'A Postgres application can generate row-level security policies that check the same names. The request context publishes the resolved permissions to the database session. Each policy requires a tenant match and the applicable permission before a row operation. System context and super-admin sessions bypass these checks. Policy generation and application are deliberate steps. SQLite applications keep the catalog and guard but get no data-layer check.',
				links: [{ label: 'Authorization model', href: '/reference/authorization' }]
			},
			{
				title: 'Some packages contribute their own permissions',
				intro:
					'A framework package can add named permissions to the same catalog. Field policy contributes two: fields.policy.manage for organization-wide administration and fields.policy.personalize for a principal maintaining only their own preferences.'
			}
		],
		related: [
			{ label: 'Authorization model', href: '/reference/authorization' },
			{ label: 'Field policy operations', href: '/capabilities/field-policy-operations' }
		]
	},
	{
		slug: 'pages-and-data',
		navTitle: 'Build pages and live data',
		eyebrow: 'Foundation 05',
		title: 'Load the first page on the server',
		lede: 'Use the active session and tenant context in a SvelteKit server load. Return serializable rows. Give control to the browser only when the page must stay live.',
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
					'Register only the tools that apply to the current page. The tools use the signed-in browser session. The server remains responsible for authentication, tenant scope, writable fields, and permissions.'
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
		slug: 'agent-legible-applications',
		navTitle: 'Agent-legible applications',
		eyebrow: 'Framework approach',
		title: 'Build an application agents can understand',
		lede: 's-m-r-t describes the application at several layers. An agent can inspect declared domain logic, understand visible controls, and discover permitted operations. An exposed runtime bridge also lets the agent observe the active environment.',
		plainEnglish:
			'An agent receives bounded descriptions of the model, interface, and callable actions. The runtime bridge can also provide an active-environment view. The agent does not have to infer these details from files or rendered pixels.',
		packages: ['smrt-core', 'smrt-dev-mcp', 'smrt-ui', 'smrt-app-mcp'],
		visual: 'agent-legibility',
		sections: [
			{
				title: 'One application, four semantic views',
				intro:
					'Each registry answers a different question. Together they give people and agents a consistent map from what the product means to what this particular environment can do.',
				points: [
					'The domain manifest describes objects, fields, relationships, policies, and declared interfaces.',
					'When exposed, the runtime-environment registry describes which modules and capabilities are actually available in the active process.',
					'The control registry describes the visible form controls, their meaning, constraints, sensitivity, and state.',
					'MCP and WebMCP schemas describe the operations an agent may request at the current boundary.'
				]
			},
			{
				title: 'Compare what is declared with what is running',
				intro:
					'The runtime-environment registry is designed as a bounded bridge for development tooling. When a development MCP connection exposes that registry, an agent can compare workspace knowledge with the active process. The agent does not assume that a build artifact and its process agree.',
				points: [
					'Missing or stale registrations become diagnosable facts instead of mysterious runtime failures.',
					'Environment-specific modules and adapters can be discovered without hard-coding one deployment shape.',
					'The registry exposes capability metadata, not application records, credentials, principals, or tenant data.'
				],
				callout: {
					variant: 'version-added',
					title: 'Runtime bridge availability',
					body: `The current tooling reference is pinned to the released ${TOOLING_PINNED_VERSION} development MCP, which reads workspace and installed-package artifacts only. Treat runtime-environment awareness as available only when the installed development MCP explicitly exposes a runtime integration.`
				},
				links: [{ label: 'Development MCP and its runtime boundary', href: '/tooling/dev-mcp' }]
			},
			{
				title: 'Use the same pattern in the visible interface',
				intro:
					'Agent-assisted forms make controls legible in the same way. A stable form and control identity replaces DOM position or visible wording, while descriptions, options, validation, and sensitivity travel with the control.',
				points: [
					'Chat, voice, tutorials, and tests can share one control description.',
					'Highlight, explain, and validate commands can help without changing a value.',
					'Staged changes keep the proposed value separate until a confirmed apply command.'
				],
				links: [
					{
						label: 'Try the agent-assisted form pattern',
						href: '/capabilities/agent-assisted-forms'
					}
				]
			},
			{
				title: 'Awareness is not authority',
				intro:
					'Describing an environment or control does not grant permission to operate it. Development metadata remains separate from live data operations, and runtime calls still resolve through the application principal, tenant scope, field policy, and explicit confirmation rules.',
				points: [
					'The development MCP understands code and, when connected, bounded capability metadata; Tier 1 application MCP performs permitted data operations.',
					'Secret values stay out of control descriptions and generated outputs.',
					'An application can expose a narrow tool set even when its model supports more operations internally.'
				]
			},
			{
				title: 'Why explicit registries beat reverse-engineering',
				intro:
					'A semantic contract is stable across layout changes, deployment shapes, and agent providers. The same metadata also improves documentation, accessibility, validation, testing, and generated interfaces, so making the application legible does not create a separate agent-only implementation.',
				points: [
					'Less duplicated integration code and fewer human/agent interface drift bugs.',
					'More reliable automation than filesystem, DOM, or screenshot guessing.',
					'One inspectable boundary for builders, operators, tests, chat, and voice experiences.',
					'Security hardening flows through the shared model and registries instead of being recreated per adapter.'
				]
			}
		],
		related: [
			{ label: 'Software as Agentic Domain Logic', href: '/reference/saadl' },
			{ label: 'Agent-assisted forms', href: '/capabilities/agent-assisted-forms' },
			{ label: 'The development MCP server', href: '/tooling/dev-mcp' },
			{ label: 'WebMCP', href: '/capabilities/webmcp' }
		]
	},
	{
		slug: 'agent-assisted-forms',
		navTitle: 'Agent-assisted forms',
		eyebrow: 'New UI capability',
		title: 'Let an agent help with a form',
		lede: 's-m-r-t controls describe their identity, permitted operations, and page location to an adapter. The adapter can support chat, voice, tutorials, or tests. The description does not give the adapter unchecked page access.',
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
					'The standardized controls, registry, safety policy, s-m-r-t Svelte form bridge, and interactive playground example are included. A product chooses and connects the chat or voice adapter that exposes these commands. The installation of both packages does not let smrt-chat control every form.'
			}
		],
		related: [
			{ label: 'Agent-legible applications', href: '/capabilities/agent-legible-applications' },
			{ label: 'Component playground', href: '/playground' },
			{ label: 'WebMCP', href: '/capabilities/webmcp' }
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
					'The invoke-agent tool carries an immutable principal through worker calls. It intersects RBAC with agent and persona tool ceilings. Delegation depth has a maximum of three. Correlated completion events return to the conversation.'
			},
			{
				title: 'Which agents a tenant may run',
				intro:
					'Availability is a binding between a tenant and an agent class. It inherits down the tenant tree. The resolver merges manifest permission defaults under each explicit override. It checks ancestors for agents that the tenant did not enable. Each result identifies its local or inherited source. Direct reads of the binding rows answer a narrower question and skip this resolution.',
				points: [
					'Enable, disable, or clear an override per tenant and agent class.',
					'An override that is cleared falls back to inheritance rather than to off.',
					'Stored agent configuration is treated as sensitive and is sanitized before it reaches a browser.'
				]
			},
			{
				title: 'The host decides when an agent stops',
				intro:
					'An agent does not take over the process. Signal handling is optional for each instance. Thus, a server or job runner owns shutdown by default. A single-agent script can request signal handling explicitly. Schedules are declared with the agent and executed by the background job runner. Thus, the application selects the execution host instead of the agent model.'
			}
		],
		related: [
			{
				label: 'The remember() and recall() primitives underneath',
				href: '/reference/ai-and-retrieval'
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
		lede: 's-m-r-t generates WebMCP tools from the model actions and field metadata that MCP uses. It registers the tools with the browser. In-page agents can then discover and invoke the tools.',
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
					'tenantNavFromManifest groups resources by package and filters them by permitted resources. Build it in +layout.server.ts and the first render arrives with the correct navigation—no client fetch required.',
				points: [
					'Collections, internal and test classes, and anything without a REST list route are dropped.',
					'A subtype that shares its parent collection is dropped, because the shared endpoint is already polymorphic.',
					'permittedResources filters by role, expanding through inheritance so a permitted subtype keeps the link it routes through.',
					'Sections and items are sorted, so reordering the manifest never reshuffles the sidebar.'
				],
				filename: 'src/routes/+layout.server.ts',
				code: `import { tenantNavFromManifest } from '@happyvertical/smrt-svelte/workspace';\nimport { manifest } from '$lib/manifest';\n\nexport const load = async ({ locals }) => ({\n  nav: tenantNavFromManifest(manifest, {\n    permittedResources: locals.permittedResources,\n    sectionHints: { '@happyvertical/smrt-content': 'Content' },\n    basePath: ''\n  })\n});`
			},
			{
				title: 'Activities accept any transport',
				intro:
					'Jobs, polling, SSE, WebSockets, and application events all adapt into one activity registry. The shell itself stays transport-agnostic and SSR-safe.'
			},
			{
				title: 'AdminShell is the surface to build on',
				intro:
					'Earlier releases shipped a sidebar-and-inspector WorkspaceShell and a role-driven RoleShell. The four-edge AdminShell replaced both, and those primitives are no longer exported. Focus tools now live on the shell. The previous dock stays available on a separate legacy subpath. An existing application can migrate one screen at a time.'
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
		lede: 'A field policy sets the field label, initial visibility, default value, and help text. The code states a starting arrangement. An organization can adapt it. A person can adapt it again for one account.',
		plainEnglish:
			'The form your code ships is a starting point, not a final answer. An organization can change field visibility or set a default for all users. An individual can make the same changes for one account. These changes do not require code edits.',
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
					'Resolution runs low to high: the code seed, app rows, tenant chain, and signed-in user. Each stored row is sparse. A column with a NULL value inherits from the layer below it. Thus, a default change does not require repeated label, help, or visibility values.',
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
					'For a tenant hierarchy, resolution checks the chain from root to leaf. A parent organization can set a default that its branches inherit. A branch can override that default. A node can break permission inheritance. The break discards all earlier contributions in the chain. Only tenants at and after the last break contribute to merged and explained results.',
				points: [
					'The default hierarchy loader reads the tenant tree from smrt-users.',
					'When no hierarchy is available the resolver falls back to a flat, single-tenant chain.',
					'That fallback concerns tenant ancestry only. It is never a fallback around authorization.'
				]
			},
			{
				title: 'Locks are how an organization says no',
				intro:
					'Only an app or tenant row can set locked. A lock can come from the code, app, or tenant tier. The lock rejects user-scope writes for that field. Resolution also skips an existing user row. Thus, old personal overrides cannot stay active under a later lock.',
				points: [
					'A lock can be seeded in code with ui: { locked: true } and lifted by an organization administrator.',
					'Locks cascade with the tenant chain, so an ancestor tenant can lock a field for every branch beneath it.',
					'Unlocking restores the personal row that was being skipped rather than recreating it.'
				]
			},
			{
				title: 'A required field cannot quietly disappear',
				intro:
					'A required field can leave the basic tier only when it has a usable resolved default. The framework enforces this rule when it writes the row and when it reads the policy. Deletion of the row that supplied the default cannot make a form impossible to submit.',
				points: [
					'At read time a required field with no usable default always resolves basic and is flagged visibilityForced.',
					'During an update, the projected lower-layer lookup excludes the row that will be replaced. The framework rejects removal of its only default during a field demotion. This rejection occurs before the write.',
					'“Usable” excludes null and empty values, not false or zero.'
				]
			},
			{
				title: 'Policy is presentation, not permission',
				intro:
					'A field policy changes how a field is presented and pre-filled. It is not a security boundary and cannot be used as one. Two controls protect sensitive fields. The framework rejects stored defaults for these fields. The batch resolve endpoint also omits the fields from every response.',
				points: [
					'Defaults are refused outright on transient, sensitive, and read-permission-gated fields. A policy may still set their visibility, label, help, or order — it just cannot put a value in them.',
					'A policy row cannot address system fields, relationship pseudo-fields, or single-table-inheritance meta storage fields. A row that targets one of these fields cannot apply.',
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
			'You can keep an existing form and use policy to set the initial field visibility. You can also give an object reference to one component. The component then builds the form.',
		packages: ['smrt-fields', 'smrt-ui', 'smrt-web'],
		sections: [
			{
				title: 'Adopt policy one field at a time',
				intro:
					'FieldPolicyProvider owns the basic/advanced mode and publishes the resolved policy. PolicyField wraps any input. It supplies the label, help hint, required marker, and current-mode visibility. It supplies the default value only for new records. Outside a provider, PolicyField renders its children without changes. Thus, adoption can occur in steps.',
				points: [
					'ModeSwitch toggles between basic and advanced; AdvancedFields is the disclosure the advanced tier lives in.',
					'ModeSwitch, AdvancedFields, and FormHelp require a provider and fail visibly when one is missing; only PolicyField supports provider-free incremental adoption.',
					'Use exactly one FieldPolicyProvider per form. FormHelp must stay under that same provider so it follows the form mode; pass the object-level description to its objectDescription prop.',
					'Set isNewRecord={false} on an edit form so a resolved default never overwrites a loaded value.'
				],
				filename: 'ArticleForm.svelte',
				code: `<script lang="ts">\n  import {\n    AdvancedFields,\n    FieldPolicyProvider,\n    ModeSwitch,\n    PolicyField\n  } from '@happyvertical/smrt-fields/svelte';\n  import { Input, Textarea } from '@happyvertical/smrt-ui/forms';\n\n  let { policy, record, isNew = true } = $props();\n</script>\n\n<FieldPolicyProvider {policy} mode="basic">\n  <ModeSwitch />\n\n  <PolicyField name="title" isNewRecord={isNew}>\n    <Input id="title" bind:value={record.title} />\n  </PolicyField>\n\n  <AdvancedFields>\n    <PolicyField name="summary" isNewRecord={isNew}>\n      <Textarea id="summary" bind:value={record.summary} />\n    </PolicyField>\n  </AdvancedFields>\n</FieldPolicyProvider>`
			},
			{
				title: 'Render a whole object from its manifest',
				intro:
					'ObjectForm renders fields that occur in the generated browser definitions and the resolved policy, which sets the order. Generated definitions omit sensitive and transient fields, so these fields cannot reach the form. The batch resolve endpoint omits read-permission-gated fields. A server policy from resolveFieldPolicy still includes them, and this policy overlap does not filter permissions. Continue to enforce read permission at the existing boundary. The host supplies both inputs, and ObjectForm creates the FieldPolicyProvider that its fields and actions share.',
				points: [
					'Pass generated browser definitions, never raw server registry fields.',
					'Do not wrap ObjectForm in another FieldPolicyProvider. The actions snippet renders inside its provider and native form. It is the supported location for FormHelp. A plain submit button keeps native submission and the form validation.',
					'To reuse a mounted create form for another new record, replace the bound record with an empty object or change createSessionKey.'
				],
				filename: 'ArticleWorkbench.svelte',
				code: `<script lang="ts">\n  import { ObjectForm } from '@happyvertical/smrt-fields/svelte';\n  import { articles } from '$lib/generated-clients';\n\n  let { definition, policy } = $props();\n  let record = $state({});\n\n  async function save(event: SubmitEvent) {\n    event.preventDefault();\n    await articles.create(record);\n  }\n</script>\n\n<ObjectForm\n  objectRef="@happyvertical/smrt-content:Article"\n  fields={definition.fields}\n  {policy}\n  bind:value={record}\n  isNewRecord\n  showModeSwitch\n  onsubmit={save}\n>\n  {#snippet actions()}\n    <button type="submit">Save</button>\n  {/snippet}\n</ObjectForm>`
			},
			{
				title: 'Register the generated collections once',
				intro:
					'An application can register every generated collection definition in one place. It can put the batch resolve client behind ObjectFormSourceProvider. Forms under the provider need only their canonical object reference. The registry validates the generated definition and the untyped custom-action response. It fails closed with an accessible error state instead of a partial form.',
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
					'ObjectForm renders and binds a record. The generated application API still saves it. Objects declared with api: false have no save routes. A form for such an object usually needs a narrow API include list. Do not open the complete model.',
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
					'The built-in inputs cover text, integer, decimal, boolean, datetime, JSON, and reference identifiers. s-m-r-t has no select wire type. A field with fixed choices keeps its persisted type, which is usually text. The application registers a select-like renderer for that field. A field-specific registration wins over a wire-type registration.',
				points: [
					'createFieldInputRegistry returns a registry scoped to one application root rather than a global.',
					'Reference fields stay identifier inputs on purpose until an application supplies a chooser.',
					'policyToVisibleColumnIds adapts the resolved policy to a smrt-ui DataTable. It never reveals a statically hidden column. It does not hide unmapped action or computed columns.'
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
		lede: 'Two permissions divide organization rules from personal preferences. A gear edits the current form. A control panel shows the complete organization. Identity always comes from the request and not from the request body.',
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
					'Both the write guard and the read guard deny an absent identity component, although a context can carry permissions without a user id. Examples include API-key authentication, a service principal, a background job, and a bare tenant context. Such a context cannot read or change the user tier. User rows do not contain a tenant. Without the check, one principal could write another principal’s row. Thus, an absent identity causes a denial.',
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
					'buildFieldPolicySettingsCatalog is a server-side, URL-driven catalog builder. FieldPolicyControlPanel renders it with a catalog component that the host injects. The panel displays code, app, and organization values from the explained resolver layers. It does not calculate precedence again. The panel requires explicit confirmation before a reset or drift prune.',
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
					'The Personal tab writes a user row, which follows the person and not a membership. The Organization tab writes an app or tenant row that supplies the initial scoped value. The difference matters when the two values disagree. The user tier wins unless the organization locked the field. An active lock causes resolution to skip the personal row.',
				points: [
					'A personal draft is shown against a non-disclosing signal of the lower layers, so a member never learns another tenant’s values from the editor.',
					'Manifest drift — rows for fields that no longer exist — is listed for administrators and pruned by ordinary deletes.',
					'Resolved results are cached briefly per database, object, tenant, user, and hierarchy loader; saving or deleting a row invalidates every entry for that object.'
				]
			},
			{
				title: 'Usage learning turns aggregate patterns into reviewable suggestions',
				intro:
					'The optional usage-learning loop turns recent aggregated form usage into administrator-reviewed suggestions. It is opt-in at the host boundary, never applies a suggestion automatically, and installs its maintenance and suggestion schedules dormant until an operator enables them.',
				points: [
					'Each host must enable capture. A browser form reports only after its persistence handler acknowledges success. Capture requires an ambient tenant and an authenticated user. A form without a reporter captures nothing.',
					'Values are minimized. Only low-cardinality boolean and reference fields send raw values. Text, numbers, dates, JSON, sensitive fields, and read-permission-gated fields send counts only. The server drops fields that the live registry does not recognize.',
					'Suggestions are read and decided under fields.policy.manage and are never applied automatically. Accepting one writes an ordinary tenant policy through the normal validation rails.',
					'Retention and rate limits are bounded. Counters stay for 90 days and have a 100,000-row limit. Accepted suggestions stay for 180 days. A dismissal starts a 30-day cooldown. Each tenant, user, object, and field can contribute once each UTC day. The maintenance schedules install dormant.'
				]
			},
			{
				title: 'The SaaS starter shows the whole path',
				intro:
					'The public smrt-saas-starter uses the complete policy rail. It has static ui hints, a policy-aware ObjectForm, a permission-checked control panel route, and a shell navigation entry. The starter also shows an API constraint. Its objects were closed to the generated API. The browser-managed object needed a narrow include list before the form could save and reload data.',
				points: [
					'packages/app-objects/src/models/StarterAppSetting.ts carries the @field({ ui }) seed and the narrowed api include list; its sibling StarterInvitation stays api: false.',
					'apps/web/src/lib/field-policy-client.ts contains the adapter. The adapter posts to hand-written /api/field-policies routes instead of wrapping the generated client. The transport-neutral adapter contract permits both shapes.',
					'apps/web/src/lib/server/field-policy.ts wraps every call in the membership the application already verified and rejects any object reference other than its own settings object.',
					'apps/web/src/routes/app/settings/field-policies/+page.server.ts checks fields.policy.manage before it builds the catalog, and its test asserts a non-manager is refused before any data is loaded.',
					'The starter registers role-to-permission mapping in its own authorization module rather than seeding the framework permission catalog, which is worth knowing before copying it.'
				]
			},
			{
				title: 'Adoption checklist',
				intro:
					'Field policy adoption is additive. PolicyField outside a provider renders its children without changes. Existing forms continue to operate until you wrap them. Each step below is useful by itself. A project can stop after any step.',
				points: [
					'1. Add @happyvertical/smrt-fields at the same exact version as the rest of your s-m-r-t packages. It pins smrt-core, smrt-tenancy, smrt-ui, and smrt-users to that version, and mixing versions installs a second copy of the object registry.',
					'2. Add it to the package list that the build and runtime share. Pass this packages array to smrtConsumer in vite.config.ts. Import the same list when the application starts. The consumer plugin then merges the package manifest. _smrt_field_policies migrates with the rest of the schema. Installation of the dependency alone does not create the table.',
					'3. Seed presentation in code: add ui hints to the fields that deserve them, and remember the cold-start rule once you mark the first field.',
					'4. Grant fields.policy.manage to administrator roles and fields.policy.personalize to everyone who should be able to adjust their own forms.',
					'5. Resolve a policy in a server load and pass it to a form. PolicyField on a few fields is a complete first step.',
					'6. Open the generated API for each object that a form must save. Keep the include list and writable list as narrow as the interface needs.',
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
