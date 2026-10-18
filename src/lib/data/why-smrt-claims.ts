import { TOOLING_PINNED_VERSION } from '$lib/data/tooling';
import { SMRT_VERSION } from '$lib/version';

const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${TOOLING_PINNED_VERSION}`;
/**
 * The tree of the release this build installs. The homepage feature rows
 * (#321 slice B) were verified against the installed packages' `AGENTS.md`,
 * so their sources follow the installed version rather than the tooling pin.
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
			href: `${SMRT_TREE}/packages/core/AGENTS.md`
		}
	},
	{
		id: 'control-lifecycle',
		claim:
			'Controls can be explained, validated, staged, confirmed, or refused through a semantic registry.',
		display:
			'Any control can be explained, validated, staged, confirmed, or refused through one registry.',
		canonical: { label: 'Agent-assisted forms', href: '/capabilities/agent-assisted-forms' },
		source: {
			label: 'smrt-ui release contract',
			href: `${SMRT_TREE}/packages/smrt-ui/AGENTS.md`
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
			href: `${SMRT_TREE}/packages/smrt-web/AGENTS.md`
		},
		demo: { label: 'UI overview', href: '/ui' }
	},
	{
		id: 'policy-checks',
		claim:
			'A described control or tool remains subject to principal, tenant, permission, and writable-field checks.',
		display:
			'However a request arrives, the same permission checks apply — down to the stored record.',
		canonical: { label: 'Security defaults', href: '/reference/security' },
		source: {
			label: 'Application MCP release contract',
			href: `${SMRT_TREE}/packages/smrt-app-mcp/AGENTS.md`
		},
		demo: { label: 'Governed interaction demo', href: '/ui' }
	},
	{
		id: 'runtime-awareness',
		claim:
			'Runtime awareness is conditional: released development tooling reads workspace and installed-package artifacts; a runtime bridge must be explicitly exposed.',
		display:
			'An application becomes visible to a live coding-agent bridge only when it explicitly turns that bridge on.',
		canonical: {
			label: 'Agent-legible applications',
			href: '/capabilities/agent-legible-applications'
		},
		source: {
			label: 'Development MCP release contract',
			href: `${SMRT_TREE}/packages/smrt-dev-mcp/AGENTS.md`
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
			href: `${SMRT_TREE}/packages/smrt-mobile/AGENTS.md`
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
			'The assistant reads the open page, acts only as the signed-in person, asks with forms the application defines, and can run in the browser.',
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
			'Incoming documents are kept as evidence, read, and turned into proposals a person reviews; automation stays off while the package is preview-only.',
		canonical: { label: 'smrt-ingestion', href: '/reference/packages/smrt-ingestion' },
		source: {
			label: 'smrt-ingestion release contract',
			href: `${INSTALLED_TREE}/packages/ingestion/AGENTS.md`
		}
	},
	{
		id: 'who-can-see-what',
		claim:
			'Tenant hierarchy has a maximum depth of 10. Tenant scope is applied by collection interceptors on list, get, save, and delete. Generated PostgreSQL row policies enforce the same permission catalog. Field policies gate reads and generated writes. AuditLog records actor and delegated identity.',
		display:
			'Which records a request may see is decided at the data layer for every surface, with PostgreSQL enforcing it too; fields and audit follow the same rules.',
		canonical: { label: 'Tenants', href: '/foundations/tenants' },
		source: {
			label: 'smrt-users and smrt-tenancy release contracts',
			href: `${INSTALLED_TREE}/packages/users/AGENTS.md`
		}
	},
	{
		id: 'agent-doors',
		claim:
			'The application MCP server exposes an explicit model allow-list with required scopes and an effects filter. Unauthenticated callers see public read-only tools only. Bearer principals are bound into the app’s RLS context. WebMCP excludes undeclared tools under a default read-only policy. The app CLI bridges to the same MCP path.',
		display:
			'MCP, the command line, and in-page browser tools are each turned on per application, list their operations, and start read-only. Without a sign-in only public read tools are visible; writes run as a signed-in identity.',
		canonical: { label: 'Agents', href: '/agents' },
		source: {
			label: 'Application MCP release contract',
			href: `${INSTALLED_TREE}/packages/smrt-app-mcp/AGENTS.md`
		}
	}
];
