import { TOOLING_PINNED_VERSION } from '$lib/data/tooling';

const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${TOOLING_PINNED_VERSION}`;
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
	}
];
