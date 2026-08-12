import { TOOLING_PINNED_VERSION } from '$lib/data/tooling';

const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${TOOLING_PINNED_VERSION}`;
const SITE_SOURCE =
	'https://github.com/happyvertical/s-m-r-t.dev/blob/04af1bb0ea69a7875ac09cc1e72ab1c448bc857a/AGENTS.md#L25-L46';

export type WhySmrtClaim = {
	claim: string;
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
		claim: 'One Article model can project into human and agent-facing interfaces.',
		canonical: { label: 'What is a SAADL?', href: '/reference/saadl' },
		source: {
			label: 'Core release contract',
			href: `${SMRT_TREE}/packages/core/AGENTS.md`
		}
	},
	{
		claim:
			'Controls can be explained, validated, staged, confirmed, or refused through a semantic registry.',
		canonical: { label: 'Agent-assisted forms', href: '/capabilities/agent-assisted-forms' },
		source: {
			label: 'smrt-ui release contract',
			href: `${SMRT_TREE}/packages/smrt-ui/AGENTS.md`
		},
		demo: { label: 'Component playground', href: '/playground' }
	},
	{
		claim:
			'MCP and WebMCP expose selected operations with shared model metadata and policy boundaries.',
		canonical: { label: 'WebMCP', href: '/capabilities/webmcp' },
		source: {
			label: 'smrt-web release contract',
			href: `${SMRT_TREE}/packages/smrt-web/AGENTS.md`
		}
	},
	{
		claim:
			'A described control or tool remains subject to principal, tenant, permission, and writable-field checks.',
		canonical: { label: 'Security defaults', href: '/reference/security' },
		source: {
			label: 'Application MCP release contract',
			href: `${SMRT_TREE}/packages/smrt-app-mcp/AGENTS.md`
		}
	},
	{
		claim:
			'Runtime awareness is conditional: released development tooling reads workspace and installed-package artifacts; a runtime bridge must be explicitly exposed.',
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
		claim:
			'Native mobile uses shared Kotlin Multiplatform logic with Compose and SwiftUI adapters.',
		canonical: { label: 'Mobile', href: '/capabilities/mobile' },
		source: {
			label: 'Mobile source contract (private; publishing deferred)',
			href: `${SMRT_TREE}/packages/smrt-mobile/AGENTS.md`
		}
	},
	{
		claim:
			'This public documentation site is the framework’s primary test bed and uses the released UI and playground packages directly.',
		canonical: { label: 'Component playground', href: '/playground' },
		source: {
			label: 'Documentation site source',
			href: SITE_SOURCE
		}
	}
];
