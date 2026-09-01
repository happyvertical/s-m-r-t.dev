import type { FrameworkTopic } from '$lib/data/framework';
import { SMRT_VERSION } from '$lib/version';

/**
 * `/agents` copy: what a software agent can do with a s-m-r-t application, the
 * four tool surfaces, the read-only exposure default, and the identity every
 * call runs as.
 *
 * `agentsTopics` is typed as `FrameworkTopic[]` — the same interface
 * `framework.ts` exports — on purpose, not because it is convenient. Reusing
 * the type means `FrameworkTopic.svelte` renders every topic with zero new
 * renderer code. It is also the guard that keeps this file off the
 * auto-discovery path: `guide-families.ts` treats any exported array whose
 * items carry `slug` + `lede` + `sections` as a `Guide[]` family, and
 * `registration.test.ts` then demands a `[slug]` route, sidebar entries,
 * `guideTracks`, and sitemap registration for it. `FrameworkTopic` has
 * `summary` + `content` instead of `lede` + `sections`, so `agentsTopics`
 * structurally cannot match that predicate — `/agents` stays a hand-written
 * landing page, the same way `interaction.ts` dodges the same discovery by
 * not exporting its `Guide[]` (see the comment at `interaction.ts:12`).
 */

const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${SMRT_VERSION}`;

export interface AgentDoor {
	index: string;
	door: string;
	description: string;
	plane: 'browser' | 'server';
	planeChip: string;
}

/**
 * The four tool surfaces. Shared by the landing hero's mini map (§3) and the
 * "doors table" visual under topic 01 (§2) so both stay in sync by
 * construction.
 */
export const agentsDoors: AgentDoor[] = [
	{
		index: '01',
		door: 'Generated model tools',
		description:
			"Tools written from the record declarations; calls run over the application's web routes.",
		plane: 'browser',
		planeChip: 'Browser · the signed-in person'
	},
	{
		index: '02',
		door: 'Mounted UI tools',
		description: 'Six fixed tools that read and operate the forms and tables on the page.',
		plane: 'browser',
		planeChip: 'Browser · the signed-in person'
	},
	{
		index: '03',
		door: 'Component tools',
		description: 'A tool one component declares for itself while it is on the page.',
		plane: 'browser',
		planeChip: 'Browser · the signed-in person'
	},
	{
		index: '04',
		door: 'Server principal tools',
		description: "The application's own agents, working as a persona's bound user.",
		plane: 'server',
		planeChip: 'Server · a bound user account'
	}
];

export const agentsDoorsReconciliation =
	'Three doors share one plane and one identity; the fourth has its own. The rest of this page follows that split.';

export interface AgentDefaultsRow {
	layer: string;
	defaultValue: string;
	changedBy: string;
}

/** The "defaults ladder" visual under topic 06 (§2). */
export const agentsDefaultsLadder: AgentDefaultsRow[] = [
	{
		layer: 'Installed library',
		defaultValue: 'Offers agents nothing',
		changedBy: 'The application registers definitions in a page'
	},
	{
		layer: 'Registration with no policy',
		defaultValue: 'Reads only',
		changedBy: 'An exposure policy that names write or destructive effects'
	},
	{
		layer: 'Mounted UI tools',
		defaultValue: 'Off, even when model tools are on',
		changedBy: 'A second, separate opt-in on the Provider'
	},
	{
		layer: 'Starter template',
		defaultValue: 'Read-only model tools on, feature-gated',
		changedBy: 'Editing one derived value in the root layout'
	}
];

export interface AgentPlaneCard {
	chip: string;
	rows: string[];
	actsAs: string;
}

/** The "two-plane diagram" visual under topic 04 (§2). */
export const agentsTwoPlanes: {
	browser: AgentPlaneCard;
	server: AgentPlaneCard;
	boundary: { title: string; subline: string };
	records: { label: string };
	ariaLabel: string;
} = {
	browser: {
		chip: 'BROWSER PLANE',
		rows: ['Page agent', 'registered tools', 'generated fetchers'],
		actsAs: 'acts as: the signed-in person.'
	},
	server: {
		chip: 'SERVER PLANE',
		rows: ['Application agent', 'persona', 'principal run'],
		actsAs: "acts as: the persona's bound user, inside three limits."
	},
	boundary: {
		title: 'Authenticated application routes',
		subline: 'identity · tenant · permission · field rules — checked on every request.'
	},
	records: { label: 'Records' },
	ariaLabel: 'Two agent planes meeting at one authenticated boundary.'
};

export const agentsTopics: FrameworkTopic[] = [
	{
		slug: 'where-agents-connect',
		navTitle: 'Where agents connect',
		eyebrow: 'Agents 01',
		title: 'Four ways in, on two levels of trust',
		summary:
			'An agent reaches a s-m-r-t application through one of four defined surfaces. Three live in the browser page and act as the person using it. The fourth runs on the server and is never visible to the browser.',
		plainEnglish:
			'Before asking what an agent may do, ask where it stands. An agent in the page works as the signed-in person. An agent on the server works as a user account an operator assigned to it.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-web', 'smrt-svelte', 'smrt-ui', 'smrt-agents'],
		content: [
			{
				title: 'Three doors open from the page',
				intro:
					"A page can offer an agent tools from three sources. Generated model tools come from the application's record declarations and run over its own web routes. Six fixed UI tools describe and operate the forms and tables currently on the page. A component can also declare a tool of its own for as long as it stays mounted.",
				points: [
					'Generated model tools carry the same names, descriptions, and input rules as the rest of the application.',
					'The six UI tools list, inspect, and operate form controls and data views.',
					'A component tool is removed when its component leaves the page.',
					'All three run as the signed-in page user. No page tool carries an account of its own.'
				]
			},
			{
				title: 'The fourth door never reaches the browser',
				intro:
					"The application's own agents — the ones that follow written instructions, run on schedules, and talk in chat — do their work on the server, as a user account bound to their persona. These server tools are a separate surface, and they are never registered in a browser page.",
				points: [
					'A server agent acts as the user account bound to its persona.',
					'Its allowed tools are a fixed list stored with that persona.',
					'Its actions are recorded as done on behalf of the person they serve.'
				]
			},
			{
				title: 'One set of rules behind every door',
				intro:
					'Whichever surface a request arrives on, the server resolves the same questions: who is asking, in which tenant, with which permissions, touching which fields. The door decides how a request arrives, never whether it is allowed.',
				links: [
					{ label: 'Exposure is not authorization', href: '#exposure-is-not-authorization' },
					{ label: 'Two planes, kept apart', href: '#two-planes' },
					{ label: 'Security reference', href: '/reference/security' }
				]
			}
		],
		sources: [
			{
				label: 'smrt-web package instructions',
				href: `${SMRT_TREE}/packages/smrt-web/AGENTS.md`,
				external: true
			},
			{
				label: 'smrt-svelte package instructions',
				href: `${SMRT_TREE}/packages/smrt-svelte/AGENTS.md`,
				external: true
			},
			{
				label: 'smrt-agents package instructions',
				href: `${SMRT_TREE}/packages/agents/AGENTS.md`,
				external: true
			}
		]
	},
	{
		slug: 'one-vocabulary',
		navTitle: 'One vocabulary, four projections',
		eyebrow: 'Agents 02',
		title: 'One declaration writes every tool',
		summary:
			'The actions a record declares become its web routes, its commands, and its agent tools. The api selection on the model gates all of them, and every action carries an effect class — read, write, or destructive — that exposure policies filter on.',
		plainEnglish:
			'You do not write agent tools. You declare what a record can do, once, and the framework writes the route, the command, and the tool from that declaration — with the same names, descriptions, and rules.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-core', 'smrt-web'],
		visual: 'surfaces',
		content: [
			{
				title: 'Tools are projections, not copies',
				intro:
					"REST, CLI, MCP, and WebMCP are four projections of one declared operation set, sharing one discovery and invocation contract. A browser tool is named after its record and action — an Article's list action is the tool article_list on every agent surface.",
				points: [
					'The api selection gates the browser tools too: an action excluded from the web API has no browser tool.',
					"Descriptions and input rules come from the model's own fields and metadata.",
					'Whether an action needs a record id is decided by the method itself — an instance method is item-scoped, a collection method is not — and route configuration cannot change that.'
				]
			},
			{
				title: 'Every action has a fixed effect class',
				intro:
					'Listing and reading are read. Creating and updating are write. Deleting is destructive. This classification is fixed for the standard actions — configuration cannot soften it — and it is what an exposure policy filters on.'
			},
			{
				title: 'An undeclared custom action counts as destructive',
				intro:
					'A custom method with no declared route metadata is classified destructive, non-idempotent, and open-world, so a browser capability policy never fails open. Under the read-only default that makes it invisible to page agents until its declaration says otherwise — and the contract asks you to declare safer semantics only when they are true.',
				filename: 'src/lib/objects/Report.ts',
				code: `@smrt({
  api: {
    exclude: ['delete'],
    routes: {
      preview: {
        method: 'GET',
        effect: 'read',
        idempotent: true,
        openWorld: false
      }
    }
  }
})
export class Report extends SmrtObject {
  async preview() {
    // A declared read: visible to page agents under the read-only default.
  }
}`
			}
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
		slug: 'exposure-is-not-authorization',
		navTitle: 'Exposure is not authorization',
		eyebrow: 'Agents 03',
		title: 'Showing a tool grants nothing',
		summary:
			'An exposure policy chooses which tools a page offers, and offering none of it is the default: registration without a policy exposes reads only. Whether any call succeeds is decided at the authenticated route it runs through — never by the fact that a tool was visible.',
		plainEnglish:
			"The list of tools an agent can see is a table of contents, not a set of keys. Every call still signs in, still lands in one tenant, and still passes the same permission and field checks as the person's own request.",
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-web', 'smrt-svelte'],
		content: [
			{
				title: 'The default is read-only',
				intro:
					"Registering tools without an exposure policy offers only read-effect tools. Write and destructive tools appear only when the application names those effects deliberately. The policy can also prefix the page's tool names and cap how many register at once.",
				filename: '@happyvertical/smrt-web · index.d.ts',
				code: `export interface WebMcpExposurePolicy {
  /** Allowed effects. Omitted means read-only exposure. */
  effects?: readonly ('read' | 'write' | 'destructive')[];
  /** Prefix every registered tool name with \`<namespace>_\`. */
  namespace?: string;
  /** Optional maximum tools registered by one call. */
  maxTools?: number;
}`
			},
			{
				title: 'Selection and permission are different questions',
				intro:
					'The exposure policy answers one question: which tools does this page offer. It does not answer whether a call succeeds. The package contract says so in its own words: this capability policy is not authorization — the authenticated REST surface remains the auth, tenant, field-write, and sensitive-data boundary.',
				callout: {
					variant: 'security',
					title: 'Two different questions',
					body: 'Which tools appear on a page is a capability choice. Whether a call succeeds is an authorization decision. The server answers the second question on every request, whatever the first answer was.'
				}
			},
			{
				title: 'A mistake fails closed at the server',
				intro:
					"Suppose a page offers a tool it should not have. The call still arrives at an authenticated route as the signed-in person, in that person's tenant, against that person's permissions and the record's field rules. A tool the person could not use fails there — the same way, and in the same place, it would fail for the person."
			}
		],
		sources: [
			{
				label: 'smrt-web package instructions',
				href: `${SMRT_TREE}/packages/smrt-web/AGENTS.md`,
				external: true
			},
			{
				label: 'smrt-web package README',
				href: `${SMRT_TREE}/packages/smrt-web/README.md`,
				external: true
			}
		]
	},
	{
		slug: 'two-planes',
		navTitle: 'Two planes, kept apart',
		eyebrow: 'Agents 04',
		title: 'Browser agents and server agents never trade places',
		summary:
			"A page tool always acts as the signed-in person; personas and agent-class limits play no part there. A server agent always acts as its persona's bound user, inside three limits at once. The two planes meet only at the application's authenticated routes.",
		plainEnglish:
			"There is no path from the page into a server agent's authority, and no persona hiding behind a page tool. Each plane has one identity story, and the server checks it on every request.",
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-web', 'smrt-agents', 'smrt-personas', 'smrt-users'],
		content: [
			{
				title: "The browser plane: the person's own authority",
				intro:
					"A tool registered in the page executes over the application's web routes as the signed-in user — the same session, tenant, and permissions the person already has. Persona allow-lists and agent-class ceilings do not participate on this plane. There is nothing for them to bound, because a page tool holds no identity of its own."
			},
			{
				title: 'The server plane: three limits at once',
				intro:
					'An application agent runs its work as the user account bound to its persona. What it can actually do is the overlap of three lists: what that user may do, what its class of agent may ever do, and what this persona is allowed to call. An action outside any one of the three does not run.',
				points: [
					"The database applies the bound user's row rules to every query in the run.",
					'Every action is recorded as done on behalf of the person it serves.',
					'Server principal tools are never registered in a browser page.'
				]
			},
			{
				title: 'They meet only at the boundary',
				intro:
					'Both planes end in the same place: one authenticated application request, resolved as one identity, in one tenant, against one permission set. Nothing else crosses between them. This is the mechanism behind a sentence the front page states without proof: an agent never has more power than the person it works for.',
				links: [
					{ label: 'Permissions and security', href: '/framework#permissions-and-security' },
					{ label: 'Authorization reference', href: '/reference/authorization' },
					{ label: 'Interaction', href: '/interaction' }
				]
			}
		],
		sources: [
			{
				label: 'smrt-agents package instructions',
				href: `${SMRT_TREE}/packages/agents/AGENTS.md`,
				external: true
			},
			{
				label: 'smrt-web package instructions',
				href: `${SMRT_TREE}/packages/smrt-web/AGENTS.md`,
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
		slug: 'state-not-screen',
		navTitle: 'State, not the screen',
		eyebrow: 'Agents 05',
		title: 'An agent asks the page what it means',
		summary:
			"Mounted forms and data views register their identity, meaning, constraints, and current state. Agent tools read those registries — never the rendered screen — and a proposed change waits for a person's own click to apply.",
		plainEnglish:
			'A page agent does not scan pixels or press buttons. It reads a live index of what is on the page, proposes a value beside the current one, and shows its work. The person applies it or throws it away.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-ui', 'smrt-svelte'],
		content: [
			{
				title: 'Controls carry their own description',
				intro:
					'Every registered control has a stable identity and a published meaning: kind, label, options, constraints, unit, sensitivity, and current state. A data view registers its columns the same way. The six fixed UI tools read these registries at call time; they do not inspect or simulate the screen.',
				points: [
					'The tool set does not change as components mount and unmount — the answers do.',
					'Secret values are never serialized into a tool response.',
					'Tool responses are marked as untrusted content for the agent reading them.'
				]
			},
			{
				title: 'Propose, then a person confirms',
				intro:
					"An agent can stage a value on a control. Staging records who proposed it and when, and places the proposal beside the current value for review. Applying it requires a person's own gesture, checked by the registry while the gesture is happening — input that merely claims to be a confirmed user action is rejected.",
				points: [
					'The review surface is a released component, StagedControlReview — not custom code each application writes.',
					'Apply, clear, and undo stay on the human side of the line.',
					'A protected field refuses staging outright. The refusal is part of the demo below.'
				]
			},
			{
				title: 'See it run',
				intro:
					'The same demo that runs on the front page and the UI overview: an agent finds a field, checks its proposal against the same rule a person sees, stages it, and is refused on a protected field. Nothing changes until the confirm click — which an agent cannot send.'
			}
		],
		sources: [
			{
				label: 'smrt-ui package instructions',
				href: `${SMRT_TREE}/packages/smrt-ui/AGENTS.md`,
				external: true
			},
			{
				label: 'smrt-svelte package instructions',
				href: `${SMRT_TREE}/packages/smrt-svelte/AGENTS.md`,
				external: true
			}
		]
	},
	{
		slug: 'what-you-turn-on',
		navTitle: 'What you turn on',
		eyebrow: 'Agents 06',
		title: 'The defaults are quiet, and every step up is deliberate',
		summary:
			'The framework always prepares the tool descriptions; the application decides whether any reach a browser. Saying nothing more offers reads only, and the mounted UI tools take a second, separate decision. The starter template makes the read-only choice for you.',
		plainEnglish:
			'An installed library offers agents nothing. A new application from the starter offers read-only record tools, in browsers that support them, and nothing else — until you decide otherwise.',
		pinnedVersion: SMRT_VERSION,
		packages: ['smrt-core', 'smrt-web', 'smrt-svelte'],
		content: [
			{
				title: 'A description is not an offer',
				intro:
					'Build time always emits the tool definitions — there is no switch for that, and none is needed, because a definition in a bundle does nothing. Tools exist for an agent only after the application registers them in a page.'
			},
			{
				title: 'One ladder of decisions',
				intro:
					'Each row is a separate decision with its own quiet default. No earlier row implies a later one.'
			},
			{
				title: "The starter's choice, in full",
				intro:
					'The starter template registers the generated read-only tools in its root layout. Three qualifications travel with that choice: it is read-only; it is feature-gated, so server rendering and browsers without the interface get nothing; and it does not enable the six UI tools, which remain a separate decision.',
				filename: 'src/routes/+layout.svelte (starter template)',
				lang: 'svelte',
				code: `<script lang="ts">
  import { webMcpToolDefinitions } from '@happyvertical/smrt-virt-web';
  import { Provider } from '@happyvertical/smrt-svelte';

  // Keep the optional data-plane runtime out of browsers that do not expose
  // WebMCP. SSR remains safe because the feature check is document-guarded.
  const webmcp = $derived(
    typeof document !== 'undefined' && 'modelContext' in document
      ? {
          definitions: webMcpToolDefinitions,
          basePath: '/api',
          effects: ['read'] as const,
        }
      : false,
  );
</script>

<Provider {webmcp}>
  <!-- … -->
</Provider>`
			}
		],
		sources: [
			{
				label: 'Generated surface contracts',
				href: `${SMRT_TREE}/packages/core/agents/generators.md`,
				external: true
			},
			{
				label: 'smrt-web package README',
				href: `${SMRT_TREE}/packages/smrt-web/README.md`,
				external: true
			},
			{
				label: 'Starter template root layout',
				href: `${SMRT_TREE}/packages/template-sveltekit/template/src/routes/+layout.svelte`,
				external: true
			}
		]
	}
];
