import type { Guide, GuideLink, GuideSection } from '$lib/data/guides';
import { SMRT_VERSION } from '$lib/version';

const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${SMRT_VERSION}`;

export interface ModelProjection {
	label: string;
	body: string;
	href: string;
}

export interface FrameworkTopic {
	slug: string;
	navTitle: string;
	eyebrow: string;
	title: string;
	summary: string;
	plainEnglish: string;
	pinnedVersion: string;
	packages: string[];
	visual?: Guide['visual'];
	content: GuideSection[];
	related?: GuideLink[];
	sources?: GuideLink[];
}

/**
 * The detailed model example now belongs to Framework. The homepage keeps its
 * current copy until the coordinated homepage change removes it.
 */
export const frameworkModelExample = `import {
  field, smrt, SmrtObject
} from '@happyvertical/smrt-core';

@smrt({
  api: {
    include: ['list', 'get', 'create', 'update']
  },
  mcp: { include: ['publish'] },
  cli: false,
  ui: {
    label: 'Articles',
    description: 'Stories your team publishes.'
  }
})
export class Article extends SmrtObject {
  title = '';
  body = '';
  featured = false;

  @field({ required: true })
  author = '';

  @field({
    readonly: true,
    description: 'Server-set; writes cannot touch it.'
  })
  viewCount = 0;

  @field({
    sensitive: true,
    exported: false,
    description: 'Editorial notes for the team.',
    ui: { group: 'Editorial', order: 10 }
  })
  authorNotes = '';

  async publish() {
    return true;
  }
}`;

/**
 * The homepage's "Describe the record once" section (`#what-you-get`) shows a
 * trimmed variant of the same model — the `@smrt()` config block plus two
 * fields — so the section stays one viewport tall. This is a teaser of the
 * data above, not a copy: Framework keeps the full `frameworkModelExample`.
 */
export const homepageModelExample = `import {
  field, smrt, SmrtObject
} from '@happyvertical/smrt-core';

@smrt({
  api: {
    include: ['list', 'get', 'create', 'update']
  },
  mcp: { include: ['publish'] },
  cli: false,
  ui: {
    label: 'Articles',
    description: 'Stories your team publishes.'
  }
})
export class Article extends SmrtObject {
  title = '';

  @field({ required: true })
  author = '';
}`;

export const frameworkModelProjections: ModelProjection[] = [
	{
		label: 'Storage and collections',
		body: 'A database table and a typed collection store and query articles.',
		href: '/framework#persistence-and-live-data'
	},
	{
		label: 'Forms',
		body: 'Form controls use the model fields, descriptions, validation, and field rules.',
		href: '/ui'
	},
	{
		label: 'REST API',
		body: 'Generated routes and clients expose only the actions selected on the model.',
		href: '/reference/interfaces'
	},
	{
		label: 'Commands',
		body: 'Application commands use the same declared actions when the model enables CLI access.',
		href: '/framework#generated-interfaces'
	},
	{
		label: 'Agent tools',
		body: 'The publish action becomes a described tool at an enabled MCP boundary.',
		href: '/tooling/app-mcp'
	},
	{
		label: 'Permissions',
		body: 'Named operation permissions apply at each network and application boundary.',
		href: '/framework#permissions-and-security'
	}
];

export const frameworkTopics: FrameworkTopic[] = [
	{
		slug: 'models-and-collections',
		navTitle: 'Models and collections',
		eyebrow: 'Framework 01',
		title: 'Describe application logic with models and collections',
		summary:
			'A model describes one kind of application record. Its collection supplies the standard read and write operations for those records.',
		plainEnglish:
			'Write one TypeScript class for a record such as an Article or Invoice. The framework uses that class to understand its data and operations.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-core'],
		visual: 'app-model',
		content: [
			{
				title: 'smrt-core supplies the shared foundation',
				intro:
					'smrt-core supplies SmrtObject, SmrtCollection, ObjectRegistry, database integration, change observation, and the generation hooks. Framework packages and application modules build on these same primitives.',
				points: [
					'SmrtObject keeps fields, relationships, validation, and useful methods together.',
					'SmrtCollection supplies list, get, count, create, query, and relationship loading.',
					'ObjectRegistry holds the live classes, fields, relationships, and collection registrations.',
					'Other packages add identity, tenancy, UI, agents, and application modules without a second model system.'
				]
			},
			{
				title: 'The model is the application definition',
				intro:
					'The class fields describe stored values. Decorators add relationships, tenant scope, interface actions, permissions, and UI descriptions. Methods hold application operations beside the data they use.',
				points: [
					'Field names and types become stable metadata.',
					'Relationship decorators connect models without a second relationship schema.',
					'Interface include lists select the operations that each generated surface can expose.',
					'Sensitive and read-protected fields stay outside generated public descriptions.'
				]
			},
			{
				title: 'Collections keep read behavior consistent',
				intro:
					'A normal collection list returns model instances with their methods. A selected list returns smaller plain rows. Both paths use the same field mapping, interceptors, tenant rules, and query limits.',
				links: [
					{ label: 'Collections reference', href: '/reference/collections' },
					{ label: 'Relationships reference', href: '/reference/relationships' }
				]
			}
		],
		related: [
			{ label: 'Start a basic application', href: '/starters/ground-up' },
			{ label: 'Application modules', href: '/modules' },
			{ label: 'Model-aware UI', href: '/ui' }
		],
		sources: [
			{
				label: 'smrt-core package instructions',
				href: `${SMRT_TREE}/packages/core/AGENTS.md`,
				external: true
			},
			{
				label: 'Generated surface contracts',
				href: `${SMRT_TREE}/packages/core/agents/generators.md`,
				external: true
			}
		]
	},
	{
		slug: 'persistence-and-live-data',
		navTitle: 'Persistence and live data',
		eyebrow: 'Framework 02',
		title: 'Keep server and browser data on one contract',
		summary:
			'The manifest supplies the database shape and generated data clients. Server collections and browser collections use that shared description.',
		plainEnglish:
			'The framework prepares storage from the model. It can render server data first, give the same rows to the browser, and report later changes.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-core', 'smrt-web', 'smrt-svelte'],
		visual: 'live',
		content: [
			{
				title: 'The manifest drives persistence',
				intro:
					'The scanner records model fields, relationships, table strategy, indexes, and tenant scope. Database migration uses that manifest. Runtime code does not create missing application tables in response to a request.',
				points: [
					'Migrations prepare SQLite or PostgreSQL before application traffic starts.',
					'Server collections map TypeScript field names to database columns.',
					'Interceptors apply tenant and application rules to the normal collection path.'
				]
			},
			{
				title: 'Hydration passes the first result to the browser',
				intro:
					'SvelteKit can load rows on the server and seed a generated browser collection with those rows. The first browser read can use the seed instead of making a duplicate request.',
				points: [
					'A shared browser client lets collections share cache entries.',
					'Generated fetchers use the same REST route scheme as the model surface.',
					'Manifest hashes separate client data that belongs to incompatible definitions.'
				]
			},
			{
				title: 'Change records support live and offline work',
				intro:
					'Writes append durable records to _smrt_changes. The _events stream can signal a browser to read from its last cursor. Polling is the fallback when the signal path is not available.',
				points: [
					'The change feed stores durable order and resume cursors.',
					'The signal path is a prompt to read the durable feed, not a second data source.',
					'An offline outbox replays writes through the same server contract with idempotency keys.'
				],
				links: [{ label: 'Hydration and live-data capability', href: '/capabilities/live-data' }]
			},
			{
				title: 'System facilities have narrow jobs',
				intro:
					'Tables with the _smrt_ prefix support framework operations. For example, _smrt_changes stores change records, _smrt_contexts stores scoped memory, and _smrt_embeddings stores retrieval vectors. They do not replace application models.',
				links: [
					{ label: 'AI and retrieval reference', href: '/reference/ai-and-retrieval' },
					{ label: 'Semantic search guide', href: '/guides/semantic-search' }
				]
			}
		],
		related: [
			{ label: 'Build pages and live data', href: '/foundations/pages-and-data' },
			{ label: 'UI components', href: '/ui' },
			{ label: 'Testing guide', href: '/guides/testing-your-app' }
		],
		sources: [
			{
				label: 'Core change-feed contract',
				href: `${SMRT_TREE}/packages/core/agents/change-feed.md`,
				external: true
			},
			{
				label: 'Core change-signal contract',
				href: `${SMRT_TREE}/packages/core/agents/change-signals.md`,
				external: true
			},
			{
				label: 'smrt-web package instructions',
				href: `${SMRT_TREE}/packages/smrt-web/AGENTS.md`,
				external: true
			}
		]
	},
	{
		slug: 'tenancy-and-identity',
		navTitle: 'Tenancy and identity',
		eyebrow: 'Framework 03',
		title: 'Separate identity, organization, and membership',
		summary:
			'Users authenticate. Profiles describe persons. Tenants define organization boundaries. Memberships connect these records for access decisions.',
		plainEnglish:
			'A login account, a person, and an organization are different records. A membership states which account can act in which organization.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-users', 'smrt-profiles', 'smrt-tenancy'],
		visual: 'identity',
		content: [
			{
				title: 'Each identity record has one job',
				intro:
					'A User is an authentication identity. A Profile is the application identity for a person or organization. A Tenant is an account or organization boundary. These records can change independently.',
				points: [
					'Identity-provider bindings attach external sign-in identities to a User.',
					'Profile relationships describe application meaning such as client, supplier, or representative.',
					'Tenant parent and child links describe an organization hierarchy.'
				]
			},
			{
				title: 'Membership connects a user to a tenant',
				intro:
					'A Membership joins one User, one Tenant, and one Role. A direct membership takes precedence in its tenant. A role can opt in to authority for descendant tenants.',
				points: [
					'An inactive direct membership denies access for that tenant.',
					'Ancestor membership authority is opt-in and uses the nearest valid ancestor.',
					'Group roles and tenant overrides stay inside their defined tenant boundary.'
				]
			},
			{
				title: 'Tenant context scopes data operations',
				intro:
					'Tenant context adds the tenant identifier to normal collection reads and writes for a tenant-scoped model. Missing required context fails closed. System and super-admin bypasses are explicit server operations.',
				links: [
					{ label: 'Multi-tenant lifecycle guide', href: '/guides/multi-tenant-lifecycle' },
					{ label: 'Security reference', href: '/reference/security' }
				]
			}
		],
		related: [
			{ label: 'Decide where data belongs', href: '/foundations/tenants' },
			{ label: 'Add people and accounts', href: '/foundations/users-and-profiles' },
			{ label: 'Human-agent interaction', href: '/interaction' }
		],
		sources: [
			{
				label: 'smrt-tenancy package instructions',
				href: `${SMRT_TREE}/packages/tenancy/AGENTS.md`,
				external: true
			},
			{
				label: 'smrt-users package instructions',
				href: `${SMRT_TREE}/packages/users/AGENTS.md`,
				external: true
			}
		]
	},
	{
		slug: 'permissions-and-security',
		navTitle: 'Permissions and security',
		eyebrow: 'Framework 04',
		title: 'Resolve authority at each operation boundary',
		summary:
			'Authentication identifies a caller. Tenant scope limits the data boundary. Operation permissions decide whether that caller can perform an action.',
		plainEnglish:
			'Knowing who made a request is not enough. The application must also check the tenant, the operation, and protected fields.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-users', 'smrt-tenancy', 'smrt-core'],
		visual: 'tenants',
		content: [
			{
				title: 'The manifest supplies stable operation names',
				intro:
					'The permission catalog derives names from the model and its exposed actions. A standard read maps to a name such as articles.read. A custom action maps to its own stable name.',
				points: [
					'Application guards check the catalog before hand-written actions run.',
					'Generated routes enforce authentication, tenant scope, writable fields, and operation rules.',
					'PostgreSQL row-level policies can apply the same resolved permission set at the data layer.'
				]
			},
			{
				title: 'Specific limits can only narrow authority',
				intro:
					'Roles, groups, tenant rules, and membership overrides resolve in a defined order. A membership deny wins at the final step. Application agents add their own class and persona tool limits to the user permission set.',
				points: [
					'A tenant deny can remove a permission that a role or group granted.',
					'A user-specific deny is final.',
					'Delegation between application agents keeps the same principal and cannot add authority.'
				]
			},
			{
				title: 'Descriptions do not grant access',
				intro:
					'An agent can know that a model, field, or operation exists without permission to read or change its data. Sensitive fields stay out of public model descriptions. The server resolves every requested operation as the active principal.',
				callout: {
					variant: 'security',
					title: 'Awareness is not authority',
					body: 'A manifest or tool description supplies meaning. It does not supply a session, a tenant, or a permission.'
				},
				links: [
					{ label: 'Authorization reference', href: '/reference/authorization' },
					{ label: 'Security reference', href: '/reference/security' }
				]
			}
		],
		related: [
			{ label: 'Grant access', href: '/foundations/memberships-and-permissions' },
			{ label: 'Field-policy UI', href: '/ui' },
			{ label: 'Application MCP security boundary', href: '/tooling/app-mcp' }
		],
		sources: [
			{
				label: 'smrt-users authorization contracts',
				href: `${SMRT_TREE}/packages/users/AGENTS.md`,
				external: true
			},
			{
				label: 'smrt-tenancy isolation contracts',
				href: `${SMRT_TREE}/packages/tenancy/AGENTS.md`,
				external: true
			}
		]
	},
	{
		slug: 'generated-interfaces',
		navTitle: 'Generated interfaces',
		eyebrow: 'Framework 05',
		title: 'Generate each interface from the same model',
		summary:
			'One model can supply storage, forms, REST routes, commands, MCP tools, WebMCP tools, and permission names. Each surface can expose a different action set.',
		plainEnglish:
			'The framework creates several ways to use the application. They share one description, so their names and field rules stay consistent.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-core', 'smrt-web'],
		visual: 'surfaces',
		content: [
			{
				title: 'Generation starts with declared actions',
				intro:
					'Each model selects its REST, MCP, and CLI actions. The generator reads the merged manifest and emits only the selected surface. The shared model description prevents a route schema and a tool schema from changing independently.',
				points: [
					'REST routes and clients serve application code.',
					'MCP tools serve connected application agents.',
					'WebMCP tools serve agents through an active browser page.',
					'CLI resources serve operators and scripts.',
					'Generated web collections serve browser data and forms.'
				]
			},
			{
				title: 'Stable descriptions prevent interface drift',
				intro:
					'Model, field, relationship, operation, and permission names come from the same manifest entries. Descriptions and JSON Schema inputs travel with the operation. A model change is therefore visible to each regenerated interface.',
				points: [
					'Fields use the same logical names across generated clients and tools.',
					'Relationship metadata identifies linked models without page-specific inference.',
					'Writable, sensitive, and permission-protected field rules apply before execution.'
				]
			},
			{
				title: 'The server remains the authority boundary',
				intro:
					'Generation does not make every action public. The host selects the surface, resolves the caller, applies tenant context, and checks the operation. A browser tool uses the signed-in page session. A remote MCP gateway resolves a principal for each request.',
				links: [
					{ label: 'Complete generated-interface reference', href: '/reference/interfaces' },
					{ label: 'WebMCP concept', href: '/capabilities/webmcp' },
					{ label: 'Expose an application over MCP', href: '/guides/expose-your-app-over-mcp' }
				]
			}
		],
		related: [
			{ label: 'Connect APIs, tools, and agents', href: '/foundations/interfaces' },
			{ label: 'Development tooling', href: '/tooling' },
			{ label: 'Working playground', href: '/playground' }
		],
		sources: [
			{
				label: 'Generated surface contracts',
				href: `${SMRT_TREE}/packages/core/agents/generators.md`,
				external: true
			},
			{
				label: 'smrt-web package instructions',
				href: `${SMRT_TREE}/packages/smrt-web/AGENTS.md`,
				external: true
			}
		]
	},
	{
		slug: 'agent-awareness',
		navTitle: 'Agent awareness and introspection',
		eyebrow: 'Framework 06',
		title: 'Give agents stable application descriptions',
		summary:
			'Source manifests, the runtime ObjectRegistry, generated operations, and version-matched knowledge help agents understand an application without guessing from files or pixels.',
		plainEnglish:
			'An application can describe its models and permitted tools. Coding tools can describe the project source. These descriptions do not give either kind of agent more authority.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-core', 'smrt-agents'],
		visual: 'agent-legibility',
		content: [
			{
				title: 'Source and runtime answer different questions',
				intro:
					'The source manifest describes declared objects, fields, relationships, methods, permissions, and generated interfaces. ObjectRegistry describes the model and collection classes registered in the active process.',
				points: [
					'.smrt/manifest.json is the runtime-focused source artifact.',
					'.smrt/smrt-knowledge.json is the deterministic review and architecture artifact.',
					'ObjectRegistry holds active constructors, collections, field metadata, relationships, and decorator configuration.',
					'Generated REST, MCP, WebMCP, and CLI descriptions use stable names and structured inputs.'
				]
			},
			{
				title: 'System facilities add operational context',
				intro:
					'Relevant _smrt_ facilities hold framework state with defined contracts. Change records, memory, embeddings, dispatch records, migrations, and field policies each have a narrow role. Agents must use the public framework operation for that role instead of treating the tables as an open data API.',
				points: [
					'_smrt_changes provides resumable change records.',
					'_smrt_contexts and _smrt_embeddings support scoped memory and retrieval.',
					'_smrt_dispatch stores durable application signals.',
					'_smrt_migrations and _smrt_backfills record framework maintenance work.'
				]
			},
			{
				title: 'Application agents and coding agents are different',
				intro:
					'An application agent operates the running application through a host-selected tool surface. A coding agent works on source, configuration, tests, and generated project knowledge. The two audiences use related descriptions but different authority boundaries.',
				points: [
					'Application agents act as a resolved principal and remain inside tenant, permission, and tool limits.',
					'Coding agents use installed package instructions, workspace manifests, and development introspection.',
					'A coding tool does not become an application data principal because it can read project metadata.',
					'An application tool does not gain source-edit authority because it can describe a model.'
				]
			},
			{
				title: 'Runtime development introspection has a release boundary',
				intro:
					'The current development MCP reads workspace and installed-package artifacts. A bridge to a running ObjectRegistry is available only when the installed development MCP explicitly supplies that integration. Do not infer a live connection from source introspection alone.',
				callout: {
					variant: 'version-added',
					title: 'Check the installed development tool',
					body: 'Runtime-environment awareness is conditional. The workspace view and the running process can differ.'
				},
				links: [{ label: 'Development MCP and its runtime boundary', href: '/tooling/dev-mcp' }]
			},
			{
				title: 'SAADL joins meaning and governed operations',
				intro:
					'Software as Agentic Domain Logic describes an application where persons and software agents reach the same permitted application operations. The application does not maintain a separate, reduced agent definition that can drift from the human interface.',
				links: [
					{ label: 'Complete SAADL terminology entry', href: '/reference/saadl' },
					{ label: 'Human-agent interaction', href: '/interaction' }
				]
			},
			{
				title: 'Awareness stays separate from authority',
				intro:
					'A stable description lets an agent plan and explain. It does not supply credentials, tenant data, or permission. The host chooses the visible operations, and the server checks each request.',
				links: [
					{ label: 'Authorization reference', href: '/reference/authorization' },
					{ label: 'Agent-assisted forms', href: '/capabilities/agent-assisted-forms' }
				]
			}
		],
		related: [
			{ label: 'Agent-legible applications', href: '/capabilities/agent-legible-applications' },
			{ label: 'Application-agent tooling', href: '/tooling/app-mcp' },
			{ label: 'Coding-agent tooling', href: '/tooling/dev-mcp' }
		],
		sources: [
			{
				label: 'smrt-core package instructions',
				href: `${SMRT_TREE}/packages/core/AGENTS.md`,
				external: true
			},
			{
				label: 'smrt-agents package instructions',
				href: `${SMRT_TREE}/packages/agents/AGENTS.md`,
				external: true
			}
		]
	}
];

export type FrameworkMigrationAction = 'keep' | 'move' | 'merge' | 'redirect';

export interface FrameworkMigrationDecision {
	source: string;
	status: FrameworkMigrationAction;
	href: string;
	note: string;
}

/**
 * Route settlement stays with the final information-architecture migration.
 * These decisions make the content outcome explicit while the old URLs remain
 * available for inbound links.
 */
export const frameworkMigrationDecisions: FrameworkMigrationDecision[] = [
	{
		source: '/foundations',
		status: 'redirect',
		href: '/framework',
		note: 'Apply the redirect in the final route migration after all destination sections are stable.'
	},
	{
		source: '/foundations/objects-and-collections',
		status: 'merge',
		href: '/framework#models-and-collections',
		note: 'Keep the source route until the final route migration.'
	},
	{
		source: '/foundations/tenants',
		status: 'merge',
		href: '/framework#tenancy-and-identity',
		note: 'Merge organization boundaries with the related identity concepts.'
	},
	{
		source: '/foundations/users-and-profiles',
		status: 'merge',
		href: '/framework#tenancy-and-identity',
		note: 'Keep the distinctions between authentication identity, profile, and tenant.'
	},
	{
		source: '/foundations/memberships-and-permissions',
		status: 'move',
		href: '/framework#permissions-and-security',
		note: 'Move the concept summary and link to the exhaustive authorization reference.'
	},
	{
		source: '/foundations/pages-and-data',
		status: 'merge',
		href: '/framework#persistence-and-live-data',
		note: 'Merge server loading with hydration, change signals, and offline replay.'
	},
	{
		source: '/foundations/interfaces',
		status: 'move',
		href: '/framework#generated-interfaces',
		note: 'Keep the concept summary separate from the exhaustive interface contract.'
	},
	{
		source: '/capabilities/collections',
		status: 'merge',
		href: '/framework#models-and-collections',
		note: 'Retain detailed collection behavior in the existing capability and reference pages.'
	},
	{
		source: '/capabilities/live-data',
		status: 'merge',
		href: '/framework#persistence-and-live-data',
		note: 'Retain the detailed capability page as supporting evidence.'
	},
	{
		source: '/capabilities/agent-legible-applications',
		status: 'merge',
		href: '/framework#agent-awareness',
		note: 'Keep the detailed registry and control examples as supporting evidence.'
	}
];
