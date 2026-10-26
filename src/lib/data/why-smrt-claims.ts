import { SMRT_VERSION } from '$lib/version';

/**
 * The tree of the release this build installs. Every package row was
 * re-verified against that release's `AGENTS.md` (the original rows on
 * 2026-10-18 for #328, after first being audited at the tooling pin; the
 * homepage feature rows for #321 slice B), so all sources follow the installed
 * version and /reference/evidence can state one release for the page.
 */
const INSTALLED_TREE = `https://github.com/happyvertical/smrt/blob/v${SMRT_VERSION}`;
const SITE_SOURCE =
	'https://github.com/happyvertical/s-m-r-t.dev/blob/5b0cf65c3cc122468415a460a3f8225f0c2316a5/AGENTS.md#L25-L46';

export type WhySmrtClaim = {
	/** Stable id for filtering a row at a render site (e.g. the homepage). */
	id: string;
	/** Release-audit wording. Kept exactly as audited; not shown on the homepage. */
	claim: string;
	/** Plain-language rendering of `claim` for the homepage evidence strip. */
	display: string;
	canonical: { label: string; href: string };
	source: { label: string; href: string };
	demo?: { label: string; href: string };
};

/**
 * Release-audit ledger for the homepage. Keep broad positioning claims out of
 * this list: each entry must point to the canonical, release-verified detail.
 */
export const whySmrtClaims: WhySmrtClaim[] = [
	{
		id: 'article-projection',
		claim: 'One Article model can project into human and agent-facing interfaces.',
		display: 'One record description becomes both the human screens and the agent tools.',
		canonical: { label: 'What is a SAADL?', href: '/reference/saadl' },
		source: {
			label: 'Core release contract',
			href: `${INSTALLED_TREE}/packages/core/AGENTS.md`
		}
	},
	{
		id: 'control-lifecycle',
		claim:
			'Form controls carry a stable identity through a transport-neutral control interaction registry. An agent can stage a value under sensitivity checks; only a local human handler submits the confirmed apply.',
		display:
			'Every control has a stable name; an agent can stage a value only where sensitivity rules allow, and only a person’s confirmation applies it.',
		canonical: { label: 'Agent-assisted forms', href: '/capabilities/agent-assisted-forms' },
		source: {
			label: 'smrt-ui release contract',
			href: `${INSTALLED_TREE}/packages/smrt-ui/AGENTS.md`
		},
		demo: { label: 'Agent-aware form demo', href: '/playground?entry=agent-aware-form' }
	},
	{
		id: 'webmcp',
		claim:
			'MCP and WebMCP expose selected operations with shared model metadata and policy boundaries.',
		display:
			'Selected operations become agent tools with the same names, inputs, and policy as the human interface.',
		canonical: { label: 'Agents', href: '/agents' },
		source: {
			label: 'smrt-web release contract',
			href: `${INSTALLED_TREE}/packages/smrt-web/AGENTS.md`
		},
		demo: { label: 'UI overview', href: '/ui' }
	},
	{
		id: 'policy-checks',
		claim:
			'A described control or tool remains subject to principal, tenant-boundary, and scope and permission checks, and fails closed when a binding is missing.',
		display:
			'However a request arrives, the same permission checks apply — down to the stored record.',
		canonical: { label: 'Security defaults', href: '/reference/security' },
		source: {
			label: 'Application MCP release contract',
			href: `${INSTALLED_TREE}/packages/smrt-app-mcp/AGENTS.md`
		},
		demo: { label: 'Governed interaction demo', href: '/ui' }
	},
	{
		id: 'runtime-awareness',
		claim:
			'The development MCP server reads the workspace and installed packages. Only with a development database configured does it add read-only system-table health and a sanitized booted registry snapshot. It never executes the project’s app entry or reads record payloads, agent configuration, or credentials.',
		display:
			'A coding agent’s development server reads the project and its installed packages. It sees a development database’s system tables only when one is configured, and never your records.',
		canonical: {
			label: 'Agent-legible applications',
			href: '/capabilities/agent-legible-applications'
		},
		source: {
			label: 'Development MCP release contract',
			href: `${INSTALLED_TREE}/packages/smrt-dev-mcp/AGENTS.md`
		}
	},
	{
		id: 'mobile-kmp',
		claim:
			'Native mobile uses shared Kotlin Multiplatform logic with Compose and SwiftUI adapters.',
		display:
			'Native mobile shares one Kotlin Multiplatform core behind separate Compose and SwiftUI screens.',
		canonical: { label: 'Mobile', href: '/capabilities/mobile' },
		source: {
			label: 'Mobile source contract (source-only; package publishing deferred)',
			href: `${INSTALLED_TREE}/packages/smrt-mobile/AGENTS.md`
		}
	},
	{
		id: 'self-hosting',
		claim:
			'This public documentation site is the framework’s primary test bed and uses the released UI and playground packages directly.',
		display:
			'This site itself runs on the released packages it documents, not a separate internal build.',
		canonical: { label: 'Component playground', href: '/playground' },
		source: {
			label: 'Documentation site source',
			href: SITE_SOURCE
		}
	},
	// Homepage feature sections (#321 slice B). One row per section in
	// `homepage-features.ts`; the section's "Sources" link resolves to its row.
	{
		id: 'in-app-assistant',
		claim:
			'AssistantDock reads mounted data-surface descriptors and offers only fail-closed allowed tools as the resolved principal. Structured questions take their options from code. A browser inference backend can run the model on-device.',
		display:
			'An application adds the assistant dock itself. The dock reads the open page, acts only as the signed-in person, asks with forms the application defines, and can run in the browser.',
		canonical: { label: 'smrt-chat', href: '/reference/packages/smrt-chat' },
		source: {
			label: 'smrt-chat release contract',
			href: `${INSTALLED_TREE}/packages/chat/AGENTS.md`
		},
		demo: { label: 'build-a-boilerplate', href: '/build-a-boilerplate' }
	},
	{
		id: 'propose-confirm',
		claim:
			'Agents can stage but cannot self-confirm form values. Secret controls never accept staging. Only human principals decide approvals. Directive proposals activate only on human review.',
		display:
			'An agent can propose a value, a request, or an instruction change; a person applies, decides, or activates it.',
		canonical: { label: 'Agent-assisted forms', href: '/capabilities/agent-assisted-forms' },
		source: {
			label: 'smrt-ui, smrt-approvals, and smrt-personas release contracts',
			href: `${INSTALLED_TREE}/packages/smrt-ui/AGENTS.md`
		},
		demo: { label: 'Agent-aware form demo', href: '/playground?entry=agent-aware-form' }
	},
	{
		id: 'runtime-reports',
		claim:
			'A runtime report is a declarative spec stored as data under a closed grammar with no SQL. It is previewed in the browser and saved only after a human confirms the exact spec. Every run recompiles it for the running principal.',
		display:
			'A report asked for in words is stored as data, previewed first, saved on confirmation, and re-checked against permissions every run.',
		canonical: { label: 'Reports', href: '/capabilities/reports' },
		source: {
			label: 'smrt-reports release contract',
			href: `${INSTALLED_TREE}/packages/reports/AGENTS.md`
		}
	},
	{
		id: 'ingestion-preview',
		claim:
			'Ingestion keeps original bytes as evidence from email, watch-folder, vendor-webhook, and capture sources. Proposals come from one host-defined handler catalog. Generation never approves or applies. Automation remains disabled and the package is preview-only.',
		display:
			'Incoming documents are kept as evidence, read, and turned into proposals a person reviews; the package is preview-only.',
		canonical: { label: 'smrt-ingestion', href: '/reference/packages/smrt-ingestion' },
		source: {
			label: 'smrt-ingestion release contract',
			href: `${INSTALLED_TREE}/packages/ingestion/AGENTS.md`
		}
	},
	{
		id: 'who-can-see-what',
		claim:
			'Tenant scope is applied by collection interceptors on list, get, save, and delete. Generated PostgreSQL row policies enforce the same permission catalog. Field policies gate reads and generated writes. AuditLog records actor and delegated identity.',
		display:
			'Which records a request may see is decided at the data layer for every surface, and PostgreSQL enforces it too. Fields and audit follow the same rules.',
		canonical: { label: 'Tenants', href: '/foundations/tenants' },
		source: {
			label: 'smrt-users and smrt-tenancy release contracts',
			href: `${INSTALLED_TREE}/packages/users/AGENTS.md`
		}
	},
	// The hero's "blurs the line" passage (#335) cites the application's own
	// agents; this row is its source. smrt-agents is installed here, so the
	// claim is checkable against node_modules as well as the release tree.
	// Two rows, one source each: a row cites exactly one contract, so the
	// scheduled-agent facts and the chat-agent facts are kept apart.
	{
		id: 'agents-included',
		claim:
			'AgentSchedule stores cron schedules that ScheduleRunner executes. executeAsPrincipal runs agent work as a persona’s bound user through the existing RBAC cascade.',
		display:
			'An application’s own agents run on schedules as a bound user account, with that account’s permissions.',
		canonical: { label: 'Agents', href: '/agents' },
		source: {
			label: 'smrt-agents release contract',
			href: `${INSTALLED_TREE}/packages/agents/AGENTS.md`
		}
	},
	{
		id: 'chat-agents',
		claim:
			'An AgentSession carries an app-controlled allowedTools list and enforces it fail-closed: an empty or unparseable list permits no tools.',
		display:
			'An agent in chat may use only the tools the application lists for it; an empty list means none.',
		canonical: { label: 'smrt-chat', href: '/reference/packages/smrt-chat' },
		source: {
			label: 'smrt-chat release contract',
			href: `${INSTALLED_TREE}/packages/chat/AGENTS.md`
		}
	},
	{
		id: 'agent-doors',
		claim:
			'The application MCP server exposes an explicit model allow-list with required scopes and an effects filter. Bearer principals are bound into the app’s RLS context. WebMCP excludes undeclared tools under a default read-only policy. The generated CLI exposes the actions the application selected; the app CLI bridge reaches the same MCP path.',
		display:
			'MCP, the command line, and in-page browser tools are each turned on per application and name their operations. Browser tools start read-only and the command line carries the actions the application selected. Writes run as a signed-in identity.',
		canonical: { label: 'Agents', href: '/agents' },
		source: {
			label: 'Application MCP release contract',
			href: `${INSTALLED_TREE}/packages/smrt-app-mcp/AGENTS.md`
		}
	},
	// Building blocks (#352 slice A, #353). One row per `supplied` bullet that
	// is a claim rather than a description; `blocks.ts` lists the id in
	// `evidence`. Each row cites exactly one package contract.
	{
		id: 'profile-sti',
		claim:
			'Profile is a single-table-inheritance base shared by Person, Organization and Bot. Its metadata is a @oneToMany relationship with a generated accessor, and ProfileAsset is the owned-asset join. AuditLog records actor and delegated identity, and FactSubject attaches facts to any record polymorphically. A subclass never publishes more than its parent.',
		display:
			'A Person is a kind of Profile, so relationships, metadata, assets, audit history and facts attached to the profile are reachable through one record and its generated tools.',
		canonical: { label: 'Users and profiles', href: '/foundations/users-and-profiles' },
		source: {
			label: 'smrt-profiles release contract',
			href: `${INSTALLED_TREE}/packages/profiles/AGENTS.md`
		}
	},
	{
		id: 'jobs-at-least-once',
		claim:
			'Job execution is at-least-once, never exactly-once: a timed-out handler keeps running and its job fails without retry. Recovery keys on worker-process liveness, never per-job heartbeat freshness, and a terminal outcome and its event commit in one transaction.',
		display:
			'Background work runs at least once, never exactly once. Recovery waits for a worker to be really dead, and each final outcome is written with its own record.',
		canonical: { label: 'smrt-jobs', href: '/reference/packages/smrt-jobs' },
		source: {
			label: 'smrt-jobs release contract',
			href: `${INSTALLED_TREE}/packages/jobs/AGENTS.md`
		}
	},
	{
		id: 'webhooks-at-least-once',
		claim:
			'Outbound webhooks publish durable model changes from the change feed with tenant and runtime cursors and sign the exact stored payload bytes. HTTP delivery is at least once, and receivers deduplicate the stable delivery id. Generated API, CLI and MCP access is disabled.',
		display:
			'Webhook events are signed as stored and delivered at least once; the receiver deduplicates by delivery id.',
		canonical: { label: 'smrt-webhooks', href: '/reference/packages/smrt-webhooks' },
		source: {
			label: 'smrt-webhooks release contract',
			href: `${INSTALLED_TREE}/packages/webhooks/AGENTS.md`
		}
	},
	{
		id: 'playbook-steps',
		claim:
			'A playbook resolves to a plan the agent executes step by step and never executes as a unit. Each step is authorized independently: at the REST boundary in the browser, or by PrincipalRun.assertToolAllowed() on the server. No stored override has a column for the step list.',
		display:
			'An agent’s playbook is a plan, not a permission. Every step is checked on its own where it runs, and no override can change the steps.',
		canonical: { label: 'Agents', href: '/agents' },
		source: {
			label: 'smrt-playbooks release contract',
			href: `${INSTALLED_TREE}/packages/playbooks/AGENTS.md`
		}
	},
	{
		id: 'approvals-human-decide',
		claim:
			'Only human principals decide an approval; agents and services may request, consume and expire. Every transition is one guarded UPDATE plus one append-only event insert in a single transaction, and policy may only tighten.',
		display:
			'Only a person can decide an approval; an agent can ask for one. Each decision is one guarded write with its own ledger entry.',
		canonical: { label: 'smrt-approvals', href: '/reference/packages/smrt-approvals' },
		source: {
			label: 'smrt-approvals release contract',
			href: `${INSTALLED_TREE}/packages/approvals/AGENTS.md`
		}
	},
	{
		id: 'learning-boundaries',
		claim:
			'Agent learning is an opt-in recall-before and capture-after loop over LearningMemory, off by default. Memory is bound to (agentType, agentInstanceId), so two tenants on one agent class never share it. A DelegationEnvelope carries an immutable principal with depth capped at three, and a worker cannot run under a broader user or tenant.',
		display:
			'An agent learns only when switched on and remembers per tenant and instance. It can hand work to another agent only under the same user and tenant.',
		canonical: { label: 'Learning agents', href: '/capabilities/learning-agents' },
		source: {
			label: 'smrt-agents release contract',
			href: `${INSTALLED_TREE}/packages/agents/AGENTS.md`
		}
	}
];
