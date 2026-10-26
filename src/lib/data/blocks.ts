/**
 * Agentic building blocks (#352): the capabilities a builder will not have to
 * write from scratch, grouped into four branches for first-time builders.
 *
 * A block is a capability, not a package category. One package can be a block
 * (ingestion), a cross-cutting feature can be a block (agent-assisted forms),
 * and a package may sit behind several blocks. The reader test for every line
 * of copy here is "I won't have to build this capability from scratch" — never
 * "my app has this".
 *
 * Every `supplied` bullet was checked against the installed package's
 * `AGENTS.md` for the release this site documents (`SMRT_VERSION`), not
 * written from memory. Status labels ("Preview") are derived from
 * `packages.ts` at the render site and never typed here. Where a bullet is a
 * claim worth a source, `evidence` names the `why-smrt-claims.ts` row.
 */

export type BlockBranchId = 'agents' | 'basics' | 'ready-made' | 'screens';

export interface BlockBranch {
	id: BlockBranchId;
	title: string;
	lede: string;
	order: number;
}

export interface BlockGuideLink {
	label: string;
	href: string;
}

export interface BuildingBlock {
	/** Slug; also the route segment under /blocks. */
	id: string;
	branch: BlockBranchId;
	/** Plain words. Carries no hand-typed status. */
	title: string;
	/** One sentence, at most 25 words: what you will not build from scratch. */
	capability: string;
	/** What building this yourself involves (3–5 bullets). */
	fromScratch: string[];
	/** What smrt supplies (3–5 bullets, each verified against the installed package). */
	supplied: string[];
	/** What remains the builder's choice (2–4 bullets). */
	youDecide: string[];
	/** Package slugs from `packages.ts`; status is derived there. */
	packages: string[];
	guides: BlockGuideLink[];
	/** `why-smrt-claims.ts` row ids where a bullet is a claim. */
	evidence?: string[];
}

export const blockBranches: BlockBranch[] = [
	{
		id: 'agents',
		title: 'Agents',
		lede: 'Agents that read, propose and act inside the application, under the same rules as people.',
		order: 1
	},
	{
		id: 'basics',
		title: 'The Basics',
		lede: 'Records, people, permissions, live data and reports: the parts every application starts with.',
		order: 2
	},
	{
		id: 'ready-made',
		title: 'Ready-made pieces',
		lede: 'Domain records with their rules and screens, ready to include and extend.',
		order: 3
	},
	{
		id: 'screens',
		title: 'Screens',
		lede: 'The web shell, components and native mobile clients the application is shown through.',
		order: 4
	}
];

export const buildingBlocks: BuildingBlock[] = [
	// Branch: Agents
	{
		id: 'agent-tools',
		branch: 'agents',
		title: 'Agent tools from one declaration',
		capability:
			'One record declaration yields MCP tools, CLI commands and in-page browser tools, each carrying the same names and policy.',
		fromScratch: [
			'A tool schema, handler and error shape for every operation on every record.',
			'A server that speaks the MCP protocol, with authentication in front of it.',
			'A rule for which tools an anonymous caller may see and which need a signed-in identity.',
			'Separate wiring for a command-line client and for tools that run inside a web page.'
		],
		supplied: [
			'Generated REST, CLI and MCP operations from one @smrt() declaration, with the same names on every surface.',
			'An application MCP server with an explicit model allow-list, required scopes and an effects filter; tools outside the list answer not found.',
			'Unauthenticated callers see only read-only public tools, and policy denials fail closed with one safe denial envelope.',
			'In-page WebMCP tools register only read effects until a page opts into writes; undeclared custom actions count as destructive.',
			'A browser bridge for MCP Apps hosts and an optional OpenAI navigation adapter, both validating the wire contract.'
		],
		youDecide: [
			'Which records and actions each surface exposes.',
			'Who the principal is: the gateway that validates tokens and the mapping to an application identity.',
			'Whether any tool is public at all; the public pattern list starts empty.'
		],
		packages: ['smrt-core', 'smrt-app-mcp', 'smrt-web', 'smrt-mcp-apps', 'smrt-mcp-openai'],
		guides: [
			{ label: 'Agents', href: '/agents' },
			{ label: 'Generated interfaces', href: '/foundations/interfaces' },
			{ label: 'Expose your application over MCP', href: '/guides/expose-your-app-over-mcp' },
			{ label: 'Runtime MCP surfaces', href: '/tooling/app-mcp' }
		],
		evidence: ['agent-doors', 'webmcp']
	},
	{
		id: 'agent-legible-applications',
		branch: 'agents',
		title: 'Applications agents can read',
		capability:
			'A coding agent reads your declared records, fields and generated interfaces from the workspace, without running the application.',
		fromScratch: [
			'A parser that finds every model, field and relationship in the source tree.',
			'A description of the application a coding assistant can load without executing code.',
			'A way to tell generated evidence from a guess when the build is stale.',
			'A safe path for a development tool to look at a development database.'
		],
		supplied: [
			'A syntactic scanner that parses TypeScript and never executes it, resolving inheritance into one manifest.',
			'A read-only development MCP server with project introspection, class generation and knowledge freshness checks.',
			'Installed packages are indexed with the hash of each shipped AGENTS.md, so documentation drift is a visible signal.',
			'Optional database tools report migration, job and schedule health without reading payloads, agent configuration or credentials.',
			'Zero discovered objects is an error-grade diagnostic naming the paths checked, never an empty success.'
		],
		youDecide: [
			'Which coding-agent client launches the server, and from where.',
			'Whether a development database is configured for the runtime tools.',
			'How much of the project tree the scanner includes.'
		],
		packages: ['smrt-scanner', 'smrt-dev-mcp'],
		guides: [
			{ label: 'Agent-legible applications', href: '/capabilities/agent-legible-applications' },
			{ label: 'Development MCP', href: '/tooling/dev-mcp' },
			{ label: 'Knowledge tooling', href: '/tooling/knowledge' }
		],
		evidence: ['runtime-awareness']
	},
	{
		id: 'agents-included',
		branch: 'agents',
		title: 'Agents included',
		capability:
			'Scheduled and conversational agents run inside the application as a bound user, with only the tools the application lists.',
		fromScratch: [
			'An agent lifecycle with scheduling, retries and a record of each run.',
			'A way to give one agent class different instructions per customer.',
			'Chat rooms, threads and sessions that both people and agents write into.',
			'A tool allow-list that an agent cannot talk its way around.'
		],
		supplied: [
			'Agents extend a base class with a lifecycle, declared interests, inter-agent dispatch and cron schedules per tenant.',
			'Personas give one agent class per-tenant instructions, allowed tools and a bound user to run as.',
			'Chat rooms, threads, reactions and agent sessions whose allowed-tools list fails closed: an empty list permits no tools.',
			'Playbooks resolve to a plan the agent follows step by step; every step is authorized where it runs.',
			'Prompts are a typed registry with app and tenant overrides, so wording changes without a redeploy.'
		],
		youDecide: [
			'Which agents a tenant may run, and the schedule for each.',
			'The user each persona runs as, and so the permissions it inherits.',
			'Where the jobs runner that executes schedules is hosted.'
		],
		packages: ['smrt-agents', 'smrt-personas', 'smrt-playbooks', 'smrt-prompts', 'smrt-chat'],
		guides: [
			{ label: 'Agents', href: '/agents' },
			{ label: 'smrt-agents', href: '/reference/packages/smrt-agents' },
			{ label: 'smrt-chat', href: '/reference/packages/smrt-chat' }
		],
		evidence: ['agents-included', 'chat-agents', 'playbook-steps']
	},
	{
		id: 'agent-assisted-forms',
		branch: 'agents',
		title: 'Agent-assisted forms',
		capability: 'An agent can fill in a form as proposals, and a person applies or discards them.',
		fromScratch: [
			'A stable identity for every control so an agent can name it.',
			'A staging area where proposed values wait without touching the real inputs.',
			'Rules for which fields an agent may never touch, such as secrets.',
			'An apply step that only a real human gesture can complete.'
		],
		supplied: [
			'Form controls carry a stable form and control identity through a transport-neutral interaction registry.',
			'Agent values stay staged until a person applies or discards them in StagedControlReview; agents cannot self-confirm.',
			'Secret controls never accept staging, and sensitive values stay redacted in snapshots, events and the review surface.',
			'The generated form tool stages proposals only; it never writes or submits field values.',
			'View intents declared as data compile into registry commands with no path to REST.'
		],
		youDecide: [
			'Which forms opt into agent assistance.',
			'The exposure policy: read-only by default, writes on explicit opt-in.',
			'Which transport the agent arrives by: chat, voice, a browser tool or a test.'
		],
		packages: ['smrt-ui', 'smrt-svelte', 'smrt-web'],
		guides: [
			{ label: 'Agent-assisted forms', href: '/capabilities/agent-assisted-forms' },
			{ label: 'Policy-aware forms', href: '/capabilities/policy-aware-forms' },
			{ label: 'WebMCP', href: '/capabilities/webmcp' },
			{ label: 'Control interaction', href: '/reference/control-interaction' }
		],
		evidence: ['control-lifecycle', 'propose-confirm']
	},
	{
		id: 'learning-agents',
		branch: 'agents',
		title: 'Learning with boundaries',
		capability:
			'An agent can remember what worked, forget what failed and propose better instructions, while a person approves every instruction change.',
		fromScratch: [
			'A memory store with confidence scores and decay.',
			'Feedback capture tied back to the exact response it judges.',
			'A review queue for proposed instruction changes.',
			'Delegation between agents that cannot widen anyone’s permissions.'
		],
		supplied: [
			'An opt-in recall-before and capture-after loop: success raises confidence, and one failure drops a memory below the reuse floor.',
			'Memory is bound to the agent type and instance, so two tenants on one agent class never share it.',
			'Feedback rows carry a correlation id; a reflection runner records pending directive proposals it cannot activate.',
			'Activating a directive is a permission; approval writes the persona’s instruction override and records the decision.',
			'Delegation carries an immutable principal and a depth cap of three; a worker cannot run under a broader user or tenant.'
		],
		youDecide: [
			'Whether an agent learns at all; the trait is off by default.',
			'Who holds the permission to activate a proposed directive.',
			'The confidence floor and decay for each agent.'
		],
		packages: ['smrt-agents', 'smrt-personas'],
		guides: [
			{ label: 'Learning agents', href: '/capabilities/learning-agents' },
			{ label: 'Agents', href: '/agents' }
		],
		evidence: ['learning-boundaries', 'propose-confirm']
	},
	{
		id: 'approvals-and-governance',
		branch: 'agents',
		title: 'Approvals and governance',
		capability:
			'Decision gates, per-field rules and feature switches are stored as data with their history, instead of scattered through code.',
		fromScratch: [
			'An approval request with quorum, expiry and an append-only record of who decided.',
			'A per-field layer of defaults, labels, visibility and locks for app, tenant and user.',
			'Feature flags that a tenant can override without a redeploy.',
			'Guards so an agent can request but never approve.'
		],
		supplied: [
			'Approval requests with an append-only event ledger, quorum, expiry and tighten-only policies; every transition is one guarded update.',
			'Only human principals decide; agents and services may request, consume and expire.',
			'Field policy resolves code seed, app, tenant and user layers into one policy per object, with organization locks.',
			'Defaults are refused on transient, sensitive and permission-gated fields; a missing identity denies rather than skips.',
			'Code-first feature definitions with global and tenant-hierarchy overrides, written only through an authorized service.'
		],
		youDecide: [
			'Which actions need an approval, and from how many people.',
			'Which fields a tenant may relabel, hide or lock for its users.',
			'Who may write an override; the generated surfaces for these rows are closed.'
		],
		packages: ['smrt-approvals', 'smrt-fields', 'smrt-features'],
		guides: [
			{ label: 'Authorization model', href: '/reference/authorization' },
			{ label: 'Field policies', href: '/capabilities/field-policies' },
			{ label: 'Operate field policies', href: '/capabilities/field-policy-operations' },
			{ label: 'Agents', href: '/agents' }
		],
		evidence: ['approvals-human-decide', 'propose-confirm']
	},
	{
		id: 'ingestion',
		branch: 'agents',
		title: 'Ingestion',
		capability:
			'Documents that arrive by email, watch folder or webhook are kept as evidence, read, and turned into proposals a person reviews.',
		fromScratch: [
			'Intake from several sources with the original bytes kept.',
			'A record of each analysis attempt, including the failed ones.',
			'A review surface that shows the evidence beside the proposal.',
			'A rule that generation never approves or applies anything on its own.'
		],
		supplied: [
			'Original bytes are kept as evidence from email, watch-folder, vendor-webhook and capture sources.',
			'Analysis revisions, attempts, proposals, decisions and executions are append-only.',
			'Every read and write rechecks the host’s tenant and confidential scope; source metadata is never authority.',
			'Proposals come from one host-defined handler catalog; generation never approves or applies.',
			'Transport-neutral review components ship for an authenticated host to mount.'
		],
		youDecide: [
			'The handler catalog: what kinds of proposal your documents can become.',
			'Who reviews, and which proposals may apply.',
			'Whether to adopt it yet: the package is preview-only and automation stays disabled.'
		],
		packages: ['smrt-ingestion'],
		guides: [{ label: 'smrt-ingestion', href: '/reference/packages/smrt-ingestion' }],
		evidence: ['ingestion-preview']
	},
	{
		id: 'jobs-and-automation',
		branch: 'agents',
		title: 'Jobs and automation',
		capability:
			'Background work, cron schedules and signed outbound webhooks run on a durable queue with retries and recovery.',
		fromScratch: [
			'A job table, a worker that claims from it, and a retry strategy.',
			'Recovery when a worker dies mid-job, without re-running live ones.',
			'A cron parser that gets time zones and daylight saving right.',
			'Signed, retried delivery of events to outside systems.'
		],
		supplied: [
			'Any record method can run in the background with priority, delay, retries and a timeout; execution is at-least-once.',
			'Recovery keys on worker liveness: a blocked event loop never looks dead, and a dead process is reclaimed within its lease.',
			'Cron schedules evaluate in the row’s IANA time zone, daylight-saving correct, with no missed-run backfill.',
			'Outbound webhooks publish from the committed change feed, sign the exact stored bytes and deliver at least once.',
			'A terminal job outcome and its event are written in one transaction, and retention sweeps bound both tables.'
		],
		youDecide: [
			'Where the runner process lives; the package supplies no host.',
			'Idempotency keys for handlers, since a timed-out handler keeps running.',
			'Which models publish webhooks, and how receivers deduplicate the delivery id.'
		],
		packages: ['smrt-jobs', 'smrt-webhooks'],
		guides: [
			{ label: 'smrt-jobs', href: '/reference/packages/smrt-jobs' },
			{ label: 'smrt-webhooks', href: '/reference/packages/smrt-webhooks' }
		],
		evidence: ['jobs-at-least-once', 'webhooks-at-least-once']
	},
	{
		id: 'facts',
		branch: 'agents',
		title: 'Facts with provenance',
		capability:
			'Small units of knowledge keep their sources, a confidence score and a chain of corrections instead of being overwritten.',
		fromScratch: [
			'A fact table that stores where each statement came from and how much to trust it.',
			'Deduplication when two sources say nearly the same thing.',
			'A history of corrections that never loses the earlier version.',
			'A link from a fact to any record it is about.'
		],
		supplied: [
			'Each fact carries sources with a credibility score, and a confidence recalculated from source count, credibility and age.',
			'Reconciliation by meaning: near-duplicates merge, borderline cases ask a model whether to merge or branch, and new facts stay new.',
			'Evolution chains link a fact to its corrections and refinements, with traversal from root to current.',
			'FactSubject attaches a fact to any record by type and id; FactContent links facts to content as supporting or contradicting.'
		],
		youDecide: [
			'Which records become fact subjects.',
			'The thresholds at which facts merge or branch.',
			'When a disputed fact is superseded, and by whom.'
		],
		packages: ['smrt-facts'],
		guides: [
			{ label: 'smrt-facts', href: '/reference/packages/smrt-facts' },
			{ label: 'Add semantic search', href: '/guides/semantic-search' },
			{ label: 'AI and retrieval', href: '/reference/ai-and-retrieval' }
		]
	},

	// Branch: The Basics
	{
		id: 'records',
		branch: 'basics',
		title: 'Records',
		capability:
			'One class describes a record; persistence, migrations, relationships and the generated interfaces follow from that description.',
		fromScratch: [
			'Tables, columns, indexes and migrations for every record type.',
			'Loading related records without one query per row.',
			'Guarded writes so two people saving at once do not silently overwrite each other.',
			'Type definitions shared between server and browser.'
		],
		supplied: [
			'Models extend one base class; collections give list, get, save and delete with tenant scoping on every read and unique key.',
			'Schema is computed from the manifest and applied by the CLI; the runtime never creates application tables.',
			'Saves use revision compare-and-swap, and a natural-key save refuses to adopt another tenant’s row.',
			'The scanner reads decorated classes without executing them, so the manifest, types and routes come from source.',
			'Per-field labels, help, order and visibility start from the code seed and can be layered per app, tenant and user.'
		],
		youDecide: [
			'Your record types, fields and relationships.',
			'SQLite, DuckDB or PostgreSQL.',
			'Which generated operations each record exposes.'
		],
		packages: ['smrt-core', 'smrt-fields', 'smrt-types', 'smrt-scanner'],
		guides: [
			{ label: 'Objects and collections', href: '/foundations/objects-and-collections' },
			{ label: 'Collections', href: '/capabilities/collections' },
			{ label: 'Decorators', href: '/reference/decorators' },
			{ label: 'Relationships', href: '/reference/relationships' }
		],
		evidence: ['article-projection']
	},
	{
		id: 'people-and-permissions',
		branch: 'basics',
		title: 'People, tenants and permissions',
		capability:
			'Accounts, sign-in, tenants, roles and permissions are in place, and the data layer enforces who sees which records.',
		fromScratch: [
			'Users, sessions, password hashing, and sign-in with an identity provider.',
			'Tenants that nest, with roles that may or may not inherit.',
			'A permission check that holds on every surface, down to the database row.',
			'Per-tenant secrets, audit logs and preference storage.'
		],
		supplied: [
			'OIDC, email and password, passkey, device PIN and terminal device-code sign-in share one session model and one login attempt budget.',
			'Tenants nest to depth ten; a membership deny always wins, and role inheritance down the tree is opt-in.',
			'Tenant scope is applied by collection interceptors on list, get, save and delete, and generated PostgreSQL row policies enforce the same catalog.',
			'A Person is a kind of Profile, so relationships, metadata, assets, audit history and facts attached to the profile are reachable through one record and its generated tools.',
			'Per-tenant secrets use envelope encryption with rotation and audit; preferences hold tenant defaults and per-user overrides.'
		],
		youDecide: [
			'Your identity provider, or none: password and passkey sign-in need no provider.',
			'Your roles, and which permissions each one grants.',
			'Whether a tenant gets its own provisioned site, with agents bound to it.'
		],
		packages: [
			'smrt-users',
			'smrt-profiles',
			'smrt-tenancy',
			'smrt-secrets',
			'smrt-preferences',
			'smrt-sites'
		],
		guides: [
			{ label: 'Tenants', href: '/foundations/tenants' },
			{ label: 'Users and profiles', href: '/foundations/users-and-profiles' },
			{ label: 'Memberships and permissions', href: '/foundations/memberships-and-permissions' },
			{ label: 'Authorization model', href: '/reference/authorization' },
			{ label: 'Run a multi-tenant lifecycle', href: '/guides/multi-tenant-lifecycle' }
		],
		evidence: ['who-can-see-what', 'profile-sti']
	},
	{
		id: 'live-data',
		branch: 'basics',
		title: 'Live data',
		capability:
			'Screens stay current as records change, with cached reads, optimistic writes and offline replay handled for you.',
		fromScratch: [
			'Cache keys, stale-while-revalidate reads and request deduplication.',
			'Optimistic updates that roll back when the server rejects them.',
			'A change feed and a browser subscriber to invalidate what changed.',
			'An offline outbox that replays writes when the connection returns.'
		],
		supplied: [
			'Typed browser collections over the generated REST surface with stale-while-revalidate reads; identical concurrent reads coalesce into one request.',
			'Optimistic inserts persist through REST and roll back automatically on a server error.',
			'Server-rendered rows seed the cache, so the first client read makes no duplicate fetch.',
			'A durable change feed with cursors, a signal bus and an SSE client invalidate caches as rows change.',
			'Durable offline writes replay through sync-apply, with idempotency and leader election across tabs.'
		],
		youDecide: [
			'Which pages load the client-data engine; public pages stay without it.',
			'How stale a read may be before it refetches.',
			'Whether offline writes are allowed, and for which collections.'
		],
		packages: ['smrt-web', 'smrt-svelte', 'smrt-core'],
		guides: [
			{ label: 'Live data', href: '/capabilities/live-data' },
			{ label: 'Pages and data', href: '/foundations/pages-and-data' }
		]
	},
	{
		id: 'reports',
		branch: 'basics',
		title: 'Reports',
		capability:
			'Aggregate reports are declared or asked for in words, refreshed on a schedule, and re-checked against permissions on every run.',
		fromScratch: [
			'Materialized aggregate tables and the refresh jobs that keep them current.',
			'Locks and watermarks so two refreshes never fight.',
			'A safe way for an agent to define a report without writing SQL.',
			'Charts and a saved-reports screen.'
		],
		supplied: [
			'Declared reports with grouping, time buckets and aggregate measures, refreshed in full or incrementally with run tracking, watermarks and locks.',
			'Runtime reports are data under a closed grammar with no SQL, saved only after a person confirms the exact spec.',
			'Every run recompiles a report for the running principal with field policy, permissions and tenant checks.',
			'Sensitive and permission-gated fields never become public columns, and saved views are re-normalized against the current definition.',
			'Saved reports, report detail, results and a report picker ship as components, with charts from the shared UI package.'
		],
		youDecide: [
			'Which collections are report sources; no configuration means no sources.',
			'Refresh mode and schedule for each declared report.',
			'Who confirms a runtime report before it is stored.'
		],
		packages: ['smrt-reports', 'smrt-ui'],
		guides: [
			{ label: 'Reports', href: '/capabilities/reports' },
			{ label: 'smrt-reports', href: '/reference/packages/smrt-reports' }
		],
		evidence: ['runtime-reports']
	},

	// Branch: Ready-made pieces
	{
		id: 'content-and-media',
		branch: 'ready-made',
		title: 'Content and media',
		capability:
			'Articles, documents, files, images, comments, voice and video records come with versions, governance and storage adapters.',
		fromScratch: [
			'Drafts, review, publication, corrections and a version for each.',
			'File storage with versions and provenance, swappable between local and cloud.',
			'Image resizing, metadata extraction and alt text.',
			'Comments on any record, and records for voice and video production.'
		],
		supplied: [
			'Content models cover drafts, publication, contributions, reviews, corrections, versions, references and transparency evidence.',
			'Assets carry versions and a derivation chain; one asset runtime stores source and derived files behind a provider-neutral store.',
			'Local processing handles EXIF, orientation, dimensions and standard variants; an Ergot adapter adds cloud processing and search.',
			'Images extend Asset with dimensions and alt text, local adjustments, and AI categorization and alt-text generation.',
			'Comments attach a tenant-scoped discussion to any record; voice profiles and outputs and a video production hierarchy are records too.'
		],
		youDecide: [
			'Storage: local files, or Ergot with your own client and credentials.',
			'Governance policies and who reviews before publication.',
			'Speech and video providers; the records store what they produce.'
		],
		packages: [
			'smrt-content',
			'smrt-assets',
			'smrt-assets-local',
			'smrt-assets-ergot',
			'smrt-images',
			'smrt-voice',
			'smrt-video',
			'smrt-comments'
		],
		guides: [
			{ label: 'smrt-content', href: '/reference/packages/smrt-content' },
			{ label: 'smrt-assets', href: '/reference/packages/smrt-assets' },
			{ label: 'Working Playground', href: '/playground' }
		]
	},
	{
		id: 'messaging',
		branch: 'ready-made',
		title: 'Messaging',
		capability:
			'Email, chat-platform and social accounts, outbound messages, in-app notifications and scheduled posts are records with send status.',
		fromScratch: [
			'One message model across email, Slack, Telegram and more.',
			'Account credentials stored somewhere other than the account row.',
			'In-app notifications with read state per person.',
			'OAuth for social platforms and a post scheduler.'
		],
		supplied: [
			'Messages and accounts are two inheritance families covering email, Twitter, Slack, Zulip and Telegram, with send status and retries.',
			'Account credentials live in encrypted secrets; descriptors hold field definitions, never values.',
			'In-app notifications are one row per person with read and dismiss state, deduplicated on a source reference.',
			'Persona message routes let an agent send through an approved account and endpoint under the messages.send permission.',
			'Social accounts with OAuth state and PKCE, and posts with schedule, status and analytics fields.'
		],
		youDecide: [
			'Which provider entry points to import at startup; the root carries no provider SDKs.',
			'Who is notified of what; hosts decide and pass the signed-in user.',
			'The job that publishes scheduled posts; the schedule field alone sends nothing.'
		],
		packages: ['smrt-messages', 'smrt-social'],
		guides: [
			{ label: 'smrt-messages', href: '/reference/packages/smrt-messages' },
			{ label: 'smrt-social', href: '/reference/packages/smrt-social' }
		]
	},
	{
		id: 'commerce-and-money',
		branch: 'ready-made',
		title: 'Commerce and money',
		capability:
			'Customers, orders, invoices, payments, double-entry journals, subscriptions and sales agreements share one exact money model.',
		fromScratch: [
			'Invoice and contract state machines, with line items and tax.',
			'Money arithmetic that never loses a cent to floating point.',
			'A chart of accounts and balanced journals.',
			'Plans, entitlements, usage charges and commissions.'
		],
		supplied: [
			'Contracts, orders, invoices, payments, payouts and fulfillment with guarded state machines; money is integer minor units with no tolerance.',
			'Tax codes resolve per line on the server; client totals are never inputs.',
			'Products, materials, variant axes and SKUs as a generic catalog that your own subtypes extend.',
			'Double-entry accounts and journals that are immutable once posted; an invoice posts a balanced receivable entry.',
			'Plans with immutable versions, entitlements, usage charges and spending policies; CRM, referrals and a commissions core with payout settlement.'
		],
		youDecide: [
			'Payment rails and settlement; the package calls no gateway itself.',
			'Your tax codes and rates for each jurisdiction.',
			'Your product subtypes: the catalog ships only generic primitives.'
		],
		packages: [
			'smrt-commerce',
			'smrt-products',
			'smrt-ledgers',
			'smrt-subscriptions',
			'smrt-sales'
		],
		guides: [
			{ label: 'smrt-commerce', href: '/reference/packages/smrt-commerce' },
			{ label: 'smrt-ledgers', href: '/reference/packages/smrt-ledgers' },
			{ label: 'Working Playground', href: '/playground' }
		]
	},
	{
		id: 'operations',
		branch: 'ready-made',
		title: 'Operations',
		capability:
			'Stock, bills of materials, projects, support cases, time, expenses and employment records come with their audit trails.',
		fromScratch: [
			'A stock ledger where every change is a movement, not an edit.',
			'Bills of materials that nest and refuse loops.',
			'Support cases that join from chat or email and keep their timeline.',
			'Approved time and expenses that can never be edited after the fact.'
		],
		supplied: [
			'Stock levels derive from an append-only movement log; one service does every receive, reserve, transfer and adjust in a transaction.',
			'Multi-level bills of materials with routing, labor estimates, cycle refusal and production runs that consume and produce stock.',
			'Repositories, issues and pull requests sync from a provider; support cases join chat or email intake with service-target clocks and escalation.',
			'Time entries, attendance punches and period timecards; approved entries are frozen and corrections are new rows.',
			'Expenses with deduplicated receipts and method-only review; employment terms and qualifications with dated, append-only history.'
		],
		youDecide: [
			'Your locations, operations and routing.',
			'Approval paths for time and expenses, and who holds those permissions.',
			'Which provider your projects sync with, and its credentials.'
		],
		packages: [
			'smrt-inventory',
			'smrt-manufacturing',
			'smrt-projects',
			'smrt-support',
			'smrt-timesheets',
			'smrt-expenses',
			'smrt-human-resources'
		],
		guides: [
			{ label: 'smrt-inventory', href: '/reference/packages/smrt-inventory' },
			{ label: 'smrt-support', href: '/reference/packages/smrt-support' },
			{ label: 'Working Playground', href: '/playground' }
		]
	},
	{
		id: 'insight-and-marketing',
		branch: 'ready-made',
		title: 'Insight and marketing',
		capability:
			'Analytics properties, campaigns, ad delivery, commissions and the websites they run on are records with their evidence.',
		fromScratch: [
			'A model for GA4, Plausible or Matomo properties and their events.',
			'Campaign budgets, pacing and immutable performance snapshots.',
			'Ad formats, delivery tiers and weighted A/B variations.',
			'Zones on a website where content or ads may appear.'
		],
		supplied: [
			'Analytics properties, data streams, events and saved reports for GA4, Plausible and Matomo, with AI summaries that exclude credentials.',
			'Campaigns with budgets, lifecycle, channel links and immutable metric snapshots; pacing is computed, never stored.',
			'Ad delivery with a priority waterfall, weighted variations and create-only event tracking.',
			'Properties with hierarchical zones for placement, with cycle-safe moves and cascading or orphaning deletes.',
			'The affiliates package is a deprecated compatibility layer over the sales commissions core.'
		],
		youDecide: [
			'Provider connections and credentials for each property.',
			'Frequency caps and budget enforcement for ads; neither is built in.',
			'Attribution rules; marketing stores evidence and sales owns the math.'
		],
		packages: [
			'smrt-analytics',
			'smrt-marketing',
			'smrt-ads',
			'smrt-affiliates',
			'smrt-properties'
		],
		guides: [
			{ label: 'smrt-analytics', href: '/reference/packages/smrt-analytics' },
			{ label: 'smrt-marketing', href: '/reference/packages/smrt-marketing' },
			{ label: 'Working Playground', href: '/playground' }
		]
	},
	{
		id: 'events',
		branch: 'ready-made',
		title: 'Events',
		capability:
			'Events nest without limit, repeat as a series, carry participants with roles, and attach to places and assets.',
		fromScratch: [
			'A hierarchy of events within events, from a season down to one game.',
			'Recurrence rules that keep their wall-clock time across time zones.',
			'Participants with roles, team grouping and rankings.',
			'Custom fields that differ by event type, and files attached to an event.'
		],
		supplied: [
			'Events are hierarchical records with parent, series, type and place links, and a status lifecycle.',
			'Series expand daily, weekly, monthly or yearly recurrence into instants, keeping the start’s wall-clock time in its zone.',
			'Participants carry a role, a numeric placement and a group, unique per event, profile and role.',
			'Event types define a JSON schema for custom fields; owned assets attach through a dedicated join.'
		],
		youDecide: [
			'Your event types and their custom fields.',
			'How deep the hierarchy goes; nothing limits it.',
			'What a placement number means in each context: team order or ranking.'
		],
		packages: ['smrt-events'],
		guides: [
			{ label: 'smrt-events', href: '/reference/packages/smrt-events' },
			{ label: 'Working Playground', href: '/playground' }
		]
	},
	{
		id: 'places',
		branch: 'ready-made',
		title: 'Places',
		capability:
			'Places form a hierarchy with coordinates, geocoding on first lookup and proximity search, and abstract places are allowed.',
		fromScratch: [
			'A geographic hierarchy from country to room.',
			'Geocoding, with a database check before every provider call.',
			'Nearby search by distance, with a tolerance for near-identical coordinates.',
			'Room for places that have no coordinates at all.'
		],
		supplied: [
			'Places nest by parent with a slug-based type, from country and city to building, zone and room.',
			'Lookup-or-create reads the database first and geocodes only on a miss; OpenStreetMap is the default provider.',
			'Proximity search uses Haversine distance; coordinate matching tolerates about eleven meters at the equator.',
			'Coordinates are nullable, so abstract places such as game zones fit the same model.'
		],
		youDecide: [
			'Your geocoding provider and its key; OpenStreetMap needs none.',
			'Which records point at a place.',
			'Your place types beyond the shipped country, city, building, zone, room and region.'
		],
		packages: ['smrt-places'],
		guides: [{ label: 'smrt-places', href: '/reference/packages/smrt-places' }]
	},
	{
		id: 'tags',
		branch: 'ready-made',
		title: 'Tags',
		capability:
			'Tags form a hierarchy with context-scoped slugs and aliases in several languages, with merge and move handled.',
		fromScratch: [
			'A tag tree with stable public identifiers that survive a move.',
			'Translations and aliases for the same tag.',
			'Merging two tags without losing their children or aliases.',
			'Cleanup that removes only tags nothing depends on.'
		],
		supplied: [
			'Tags are hierarchical, identified by slug and context rather than id, with a denormalized depth.',
			'Aliases carry an ISO 639-1 language code and optional context scoping.',
			'A move detects circular references and recalculates levels; a merge moves children and aliases, then deletes the source.',
			'A taxonomy recipe declares Tag and TagAlias as one unit a cookbook can include.'
		],
		youDecide: [
			'Your tag vocabulary, and the contexts that keep separate vocabularies apart.',
			'Which records carry tags.',
			'Which languages get aliases, and who writes them.'
		],
		packages: ['smrt-tags'],
		guides: [{ label: 'smrt-tags', href: '/reference/packages/smrt-tags' }]
	},

	// Branch: Screens
	{
		id: 'screens-and-shell',
		branch: 'screens',
		title: 'Screens and shell',
		capability:
			'A themed application shell, form and data components, list and detail screens, and translated text are in place before you write a page.',
		fromScratch: [
			'An admin shell with navigation, panels, hotkeys and a command palette.',
			'Accessible form controls, tables, dialogs and charts with one theme.',
			'List, detail, create and edit screens for each record type.',
			'Translations with per-tenant overrides.'
		],
		supplied: [
			'AppShell composes the provider, theme and AdminShell; recipe screens derive list, view, create and edit from a generated definition and field policy.',
			'Domain-neutral components for forms, choices, data tables, feedback, layout, calendar and charts, under one token-based theme system.',
			'Themes ship as presets with light and dark schemes, and every component root carries a stable styling hook.',
			'Language strings resolve code, config, app and tenant layers with locale fallback and AI translation of missing locales.',
			'Package-owned playground previews render inside the active preset and color scheme.'
		],
		youDecide: [
			'Your pages and navigation; the shell supplies the frame.',
			'A theme preset, or a theme of your own from the token vocabulary.',
			'Which locales you support, and who reviews auto-translations.'
		],
		packages: ['smrt-ui', 'smrt-svelte', 'smrt-playground', 'smrt-languages'],
		guides: [
			{ label: 'Application shell', href: '/capabilities/application-shell' },
			{ label: 'UI overview', href: '/ui' },
			{ label: 'Working Playground', href: '/playground' },
			{ label: 'Component reference', href: '/reference/components' }
		],
		evidence: ['self-hosting']
	},
	{
		id: 'mobile',
		branch: 'screens',
		title: 'Mobile',
		capability:
			'Android and iOS clients share one Kotlin Multiplatform core, with DTOs generated from the same manifest as the web app.',
		fromScratch: [
			'Offline state, durable writes and authenticated networking for each platform.',
			'DTOs kept in step with the server’s records.',
			'A native shell per platform over shared state.'
		],
		supplied: [
			'Native mobile shares one Kotlin Multiplatform core behind separate Compose and SwiftUI screens.',
			'The contract package reads manifest.json and generates Kotlin and Swift DTOs from an object allowlist, with defaults on every field.',
			'Server, Kotlin and Swift share one owning package for the mobile auth and session wire types; a test asserts field-for-field parity.',
			'A source hash stamps generated output so drift is detectable.'
		],
		youDecide: [
			'Which records the mobile allowlist includes.',
			'Platform permissions, service configuration and store distribution.',
			'Whether to adopt now: the mobile packages are source distributions, not published packages.'
		],
		packages: ['smrt-mobile', 'smrt-mobile-contract', 'smrt-android', 'smrt-ios'],
		guides: [{ label: 'Mobile', href: '/capabilities/mobile' }],
		evidence: ['mobile-kmp']
	}
];

/**
 * Published packages that are not a capability a builder adopts: developer
 * tools, templates, runtimes and the planner. `blocks.test.ts` requires every
 * package in `packages.ts` to appear in a block or here, so the map can never
 * silently omit one. `smrt-dev-mcp` is also a block (Applications agents can
 * read) and stays listed here as the development tool it is. `smrt-gnode` is a
 * stub and keeps its package page only.
 */
export const toolingPackageSlugs: string[] = [
	'smrt-cli',
	'smrt-app-cli',
	'smrt-app-runtime',
	'smrt-config',
	'smrt-dev-mcp',
	'smrt-gnode',
	'smrt-planner',
	'smrt-template-site-static-json',
	'smrt-template-sveltekit',
	'smrt-vitest',
	'smrt-workbench'
];

export function getBuildingBlock(id: string): BuildingBlock | undefined {
	return buildingBlocks.find((block) => block.id === id);
}

export function blocksInBranch(branch: BlockBranchId): BuildingBlock[] {
	return buildingBlocks.filter((block) => block.branch === branch);
}
