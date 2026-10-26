import { SMRT_VERSION } from '$lib/version';

/**
 * The tree of the release this build installs. Every package row was
 * re-verified against that release's `AGENTS.md` (the rows on 2026-10-18 for
 * #328, after first being audited at the tooling pin), so all sources follow
 * the installed version and /docs/reference/evidence can state one release for
 * the page.
 *
 * #366 retired the rows only the old homepage sections and the #358 block
 * pages cited (thirteen); git history before that commit holds them if a
 * feature sentence needs one again.
 */
const INSTALLED_TREE = `https://github.com/happyvertical/smrt/blob/v${SMRT_VERSION}`;
const SITE_SOURCE =
	'https://github.com/happyvertical/s-m-r-t.dev/blob/5b0cf65c3cc122468415a460a3f8225f0c2316a5/AGENTS.md#L25-L46';

export type WhySmrtClaim = {
	/** Stable id; the row anchor on /docs/reference/evidence. */
	id: string;
	/** Release-audit wording. Kept exactly as audited. */
	claim: string;
	/** Plain-language rendering of `claim`. */
	display: string;
	canonical: { label: string; href: string };
	source: { label: string; href: string };
	demo?: { label: string; href: string };
};

/**
 * Release-audit ledger behind /docs/reference/evidence. Keep broad positioning claims out of
 * this list: each entry must point to the canonical, release-verified detail.
 */
export const whySmrtClaims: WhySmrtClaim[] = [
	{
		id: 'article-projection',
		claim: 'One Article model can project into human and agent-facing interfaces.',
		display: 'One record description becomes both the human screens and the agent tools.',
		canonical: { label: 'What is a SAADL?', href: '/docs/reference/saadl' },
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
		canonical: { label: 'Agent-assisted forms', href: '/docs/capabilities/agent-assisted-forms' },
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
		canonical: { label: 'Agents', href: '/docs/agents' },
		source: {
			label: 'smrt-web release contract',
			href: `${INSTALLED_TREE}/packages/smrt-web/AGENTS.md`
		},
		demo: { label: 'UI overview', href: '/docs/ui' }
	},
	{
		id: 'policy-checks',
		claim:
			'A described control or tool remains subject to principal, tenant-boundary, and scope and permission checks, and fails closed when a binding is missing.',
		display:
			'However a request arrives, the same permission checks apply — down to the stored record.',
		canonical: { label: 'Security defaults', href: '/docs/reference/security' },
		source: {
			label: 'Application MCP release contract',
			href: `${INSTALLED_TREE}/packages/smrt-app-mcp/AGENTS.md`
		},
		demo: { label: 'Governed interaction demo', href: '/docs/ui' }
	},
	{
		id: 'runtime-awareness',
		claim:
			'The development MCP server reads the workspace and installed packages. Only with a development database configured does it add read-only system-table health and a sanitized booted registry snapshot. It never executes the project’s app entry or reads record payloads, agent configuration, or credentials.',
		display:
			'A coding agent’s development server reads the project and its installed packages. It sees a development database’s system tables only when one is configured, and never your records.',
		canonical: {
			label: 'Agent-legible applications',
			href: '/docs/capabilities/agent-legible-applications'
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
		canonical: { label: 'Mobile', href: '/docs/capabilities/mobile' },
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
	}
];
