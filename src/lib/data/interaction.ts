import type { Guide } from '$lib/data/guides';

/**
 * Released s-m-r-t version used to verify the interaction contract and examples.
 * Move this pin only after the installed control, form, chat, and voice surfaces
 * have been checked again.
 */
export const INTERACTION_PINNED_VERSION = '0.42.4';

const SMRT_TREE = `https://github.com/happyvertical/smrt/blob/v${INTERACTION_PINNED_VERSION}`;

const interactionGuides: Guide[] = [
	{
		slug: 'human-agent-communication',
		navTitle: 'Human-agent communication',
		eyebrow: 'Interaction 01',
		title: 'Communicate through shipped application interfaces',
		lede: 'People and application agents can use natural language, chat, and voice. Each interface connects to declared operations or controls at an explicit application boundary.',
		plainEnglish:
			'The application supplies the meaning and authority. Chat and voice supply another way to request the same bounded work.',
		packages: ['smrt-ui', 'smrt-svelte', 'smrt-chat', 'smrt-app-mcp'],
		pinnedVersion: INTERACTION_PINNED_VERSION,
		sources: [
			{
				label: 'smrt-ui interaction contract',
				href: `${SMRT_TREE}/packages/smrt-ui/src/components/forms/control-interaction.ts`
			},
			{
				label: 'smrt-svelte package guidance',
				href: `${SMRT_TREE}/packages/smrt-svelte/AGENTS.md`
			},
			{ label: 'smrt-chat package guidance', href: `${SMRT_TREE}/packages/chat/AGENTS.md` }
		],
		sections: [
			{
				title: 'Natural language uses declared meaning',
				intro:
					'Generated MCP and WebMCP descriptions give an agent names, inputs, and constraints for declared operations. The control registry gives an adapter the equivalent description for visible controls.',
				points: [
					'The agent requests a declared operation instead of inferring an action from screen pixels.',
					'The application resolves the request through its principal, tenant, permission, and field rules.',
					'Natural-language input does not create a second application-logic path.'
				]
			},
			{
				title: 'Chat keeps the tool boundary explicit',
				intro:
					'smrt-chat ships rooms, messages, agent sessions, streaming clients, and server-controlled tool lists. Its service checks membership and keeps generated model writes read-only.',
				points: [
					'An agent session stores the allowed tool names for that conversation.',
					'The server offers and executes only tools that the current principal can use.',
					'A product adapter can translate a trusted chat request into a control command.'
				]
			},
			{
				title: 'Voice uses the same application boundary',
				intro:
					'smrt-svelte ships browser speech-to-text, text-to-speech, and language-model adapters. Its provider-backed form also owns spoken-input behavior.',
				points: [
					'A voice adapter identifies its command source as voice.',
					'The rich form can collect spoken values through the configured browser AI adapters.',
					'smrt-chat voice sessions bind a gateway session to the tenant, actor, persona, and conversation.'
				]
			},
			{
				title: 'Know the current connection limit',
				intro:
					'The packages do not ship one general adapter that connects every chat or voice request to every form. The application selects the forms, commands, and transports that it exposes.',
				points: [
					'Installing smrt-chat does not let a chat agent operate all controls.',
					'The provider-free smrt-ui form has no chat, voice, or model dependency.',
					'The interaction registry records command context but does not authenticate its actor.'
				]
			}
		],
		related: [
			{ label: 'UI implementation: rich forms and browser AI', href: '/packages/smrt-svelte' },
			{
				label: 'Framework mechanism: agent-legible applications',
				href: '/capabilities/agent-legible-applications'
			},
			{ label: 'Reference contract: generated interfaces', href: '/reference/interfaces' },
			{ label: 'Related guide: expose your app over MCP', href: '/guides/expose-your-app-over-mcp' }
		]
	},
	{
		slug: 'control-discovery',
		navTitle: 'Control discovery and meaning',
		eyebrow: 'Interaction 02',
		title: 'Discover a control by identity and meaning',
		lede: 'A control publishes a stable address, human-readable meaning, choices, constraints, sensitivity, capabilities, and current state.',
		plainEnglish:
			'An adapter asks the form what each control means. It does not guess from the control position or visible text.',
		packages: ['smrt-ui', 'smrt-svelte'],
		pinnedVersion: INTERACTION_PINNED_VERSION,
		sources: [
			{
				label: 'smrt-ui interaction contract',
				href: `${SMRT_TREE}/packages/smrt-ui/src/components/forms/control-interaction.ts`
			},
			{ label: 'smrt-ui package guidance', href: `${SMRT_TREE}/packages/smrt-ui/AGENTS.md` }
		],
		sections: [
			{
				title: 'Use a stable control identity',
				intro:
					'Each address combines a formId and controlId. An optional subject identifies the record or application object that the form edits.',
				points: [
					'formId identifies the form without using its position in the page.',
					'controlId identifies one control inside that form.',
					'The optional subject has a type, an id, and an optional label.'
				]
			},
			{
				title: 'Publish meaning and constraints',
				intro:
					'Metadata describes the control kind, label, description, options, constraints, unit, sensitivity, readable state, writable state, and capabilities.',
				points: [
					'Options include a value, label, and optional disabled state.',
					'Constraints can include required, minimum, maximum, step, length, and pattern rules.',
					'Capabilities state which read, navigation, explanation, validation, and mutation actions are available.'
				]
			},
			{
				title: 'Inspect the current state',
				intro:
					'list and get return a snapshot with metadata and runtime state. Runtime state can report disabled, read-only, valid, and validation-message values.',
				points: [
					'A readable control can include its live value.',
					'A staged proposal appears separately from the live value.',
					'A redaction flag tells the adapter when a live or staged value is not available.'
				]
			},
			{
				title: 'Derive capabilities from real handles',
				intro:
					'The registry derives default capabilities from the handles that a control registers. A control can declare a narrower capability list when the application requires it.',
				points: [
					'A control needs a value reader before the registry advertises read.',
					'A control needs a value writer before the registry advertises stage, apply, or undo.',
					'Secret controls never advertise read or mutation capabilities.'
				]
			}
		],
		related: [
			{
				label: 'UI implementation: smrt-ui form controls',
				href: '/packages/smrt-ui?tab=components'
			},
			{
				label: 'Framework mechanism: agent-legible applications',
				href: '/capabilities/agent-legible-applications'
			},
			{ label: 'Reference contract: generated interfaces', href: '/reference/interfaces' },
			{ label: 'Related guide: test your application', href: '/guides/testing-your-app' }
		]
	},
	{
		slug: 'commands-and-lifecycle',
		navTitle: 'Commands and lifecycle',
		eyebrow: 'Interaction 03',
		title: 'Move from inspection to a confirmed change',
		lede: 'The interaction lifecycle separates discovery, guidance, validation, a proposed value, and an approved live change.',
		plainEnglish:
			'An agent can prepare a change without making the change. The person can review the proposal before the application applies it.',
		packages: ['smrt-ui', 'smrt-svelte'],
		pinnedVersion: INTERACTION_PINNED_VERSION,
		sources: [
			{
				label: 'smrt-ui interaction contract',
				href: `${SMRT_TREE}/packages/smrt-ui/src/components/forms/control-interaction.ts`
			},
			{
				label: 'smrt-ui interaction tests',
				href: `${SMRT_TREE}/packages/smrt-ui/src/components/forms/__tests__/control-interaction.test.ts`
			}
		],
		sections: [
			{
				title: 'Follow the command lifecycle',
				intro:
					'Use the registry in this order when an agent helps with a control. The focus action is also available when an adapter must move keyboard focus.',
				points: [
					'1. Inspect the control with list or get.',
					'2. Reveal or highlight the applicable control.',
					'3. Explain its meaning, options, constraints, sensitivity, and capabilities.',
					'4. Validate the current value with the control rule.',
					'5. Stage the proposed value.',
					'6. Apply the reviewed value after confirmation.',
					'7. Clear the value or undo the last registry change after confirmation.'
				]
			},
			{
				title: 'Stage without changing the live value',
				intro:
					'Stage stores a proposed value in the registry. Stage does not call the control writer and does not change the live value.',
				points: [
					'The next snapshot shows the live value and staged value separately.',
					'Staging an agent proposal does not require confirmation under the default policy.',
					'An application can use a stricter custom policy before it accepts a staged proposal.'
				]
			},
			{
				title: 'Confirm agent mutations',
				intro:
					'An agent apply, clear, or undo command always returns human_confirmation_required under the default policy, regardless of confirmed. Only a human, through a real local click routed via executeLocalControlCommand, can apply, clear, or undo.',
				points: [
					'Apply uses the staged value unless the command supplies a direct value.',
					'Apply stores the previous value for undo and then validates the new value.',
					'Clear stores the previous value before it calls the control clear handle.'
				]
			},
			{
				title: 'Keep undo inside its real boundary',
				intro:
					'Undo restores a value from the current interaction registry history. It does not reverse a saved server record or an external operation.',
				points: [
					'Each control has its own in-memory undo history.',
					'An empty history returns nothing_to_undo.',
					'The application owns any transaction or persisted-record rollback.'
				]
			}
		],
		related: [
			{
				label: 'UI implementation: canonical success-and-refusal demonstration',
				href: '/ui#agent-addressable-components'
			},
			{
				label: 'Playground: agent-aware form demonstration',
				href: '/playground?entry=agent-aware-form'
			},
			{
				label: 'Framework mechanism: agent-assisted forms',
				href: '/capabilities/agent-assisted-forms'
			},
			{
				label: 'Reference contract: control interaction registry',
				href: '/reference/control-interaction'
			},
			{ label: 'Related guide: test your application', href: '/guides/testing-your-app' }
		]
	},
	{
		slug: 'input-sources-and-provenance',
		navTitle: 'Input sources and provenance',
		eyebrow: 'Interaction 04',
		title: 'Preserve the source of each command',
		lede: 'User, voice, agent, tutorial, and test adapters use one control command contract. Command context keeps the source attached to execution and events.',
		plainEnglish:
			'The form receives the same small command shape from each adapter. It still records which adapter requested the command.',
		packages: ['smrt-ui', 'smrt-svelte'],
		pinnedVersion: INTERACTION_PINNED_VERSION,
		sources: [
			{
				label: 'smrt-ui interaction contract',
				href: `${SMRT_TREE}/packages/smrt-ui/src/components/forms/control-interaction.ts`
			}
		],
		sections: [
			{
				title: 'Use one command contract',
				intro:
					'Every adapter sends a command and a ControlCommandContext. The context source is user, voice, agent, tutorial, or test.',
				points: [
					'User identifies direct user-interface input.',
					'Voice identifies a spoken-input adapter.',
					'Agent identifies an application-agent request.',
					'Tutorial and test identify guided and automated operations.'
				]
			},
			{
				title: 'Keep context with interaction events',
				intro:
					'The registry includes command context in staged and completed command events. Subscribers can observe the source, confirmation state, actorId, and sessionId.',
				points: [
					'Registered and unregistered events identify control lifecycle changes.',
					'Staged events identify the proposal and its source.',
					'Command events include the request, context, result, identity, and timestamp.'
				]
			},
			{
				title: 'Do not confuse a source label with authentication',
				intro:
					'Command context preserves provenance inside the registry, but the registry does not authenticate actorId or sessionId. The trusted adapter supplies and verifies that context.',
				points: [
					'actorId and sessionId are optional correlation values, not credentials.',
					'An adapter must pass its real source instead of relying on the default user context.',
					'Application authorization remains outside the transport-neutral registry.'
				]
			},
			{
				title: 'Persist an audit trail when the product needs one',
				intro:
					'The subscribe method reports live interaction events. The registry does not store a durable audit log after the page or registry ends.',
				points: [
					'An application can send selected events to its authorized audit service.',
					'The audit service must minimize values and protect sensitive context.',
					'Tests can subscribe to the same events without a separate control API.'
				]
			}
		],
		related: [
			{ label: 'UI implementation: smrt-ui form registry', href: '/packages/smrt-ui' },
			{
				label: 'Framework mechanism: agent-assisted forms',
				href: '/capabilities/agent-assisted-forms'
			},
			{ label: 'Reference contract: authorization model', href: '/reference/authorization' },
			{ label: 'Related guide: test your application', href: '/guides/testing-your-app' }
		]
	},
	{
		slug: 'consent-sensitivity-and-authority',
		navTitle: 'Consent, sensitivity, and authority',
		eyebrow: 'Interaction 05',
		title: 'Keep awareness separate from authority',
		lede: 'A control description can make state and capabilities visible. It does not give an adapter permission to read or change the control.',
		plainEnglish:
			'Knowing that a control exists is not permission to use it. Policy, control state, and user consent still decide each request.',
		packages: ['smrt-ui', 'smrt-svelte', 'smrt-users'],
		pinnedVersion: INTERACTION_PINNED_VERSION,
		sources: [
			{
				label: 'smrt-ui interaction contract',
				href: `${SMRT_TREE}/packages/smrt-ui/src/components/forms/control-interaction.ts`
			},
			{
				label: 'smrt-ui interaction tests',
				href: `${SMRT_TREE}/packages/smrt-ui/src/components/forms/__tests__/control-interaction.test.ts`
			}
		],
		sections: [
			{
				title: 'Fail closed for secrets and locked controls',
				intro:
					'The default policy denies mutation for secret, non-writable, disabled, and read-only controls. Secret values are redacted and secret controls do not advertise read or mutation capabilities.',
				points: [
					'A secret mutation returns sensitive_control.',
					'A non-writable mutation returns control_not_writable.',
					'A disabled or read-only mutation returns control_not_editable.',
					'An unknown control returns not_found and an unavailable action returns unsupported.'
				]
			},
			{
				title: 'Treat sensitive controls as an explicit policy decision',
				intro:
					'Sensitive and secret are different classifications in the released API. Sensitive does not automatically redact a value or deny staging under the default policy.',
				points: [
					'Agent apply, clear, and undo are refused outright for any control, sensitive or not — sensitivity adds independent read and write restrictions on top.',
					'An application that must deny or redact sensitive values supplies a stricter custom policy and readable metadata.',
					'The application must test that policy before it exposes the adapter.'
				]
			},
			{
				title: 'Require consent for agent mutations',
				intro:
					'The default policy permits an agent to stage a proposal. It always denies agent apply, clear, and undo — confirmed: true does not change that. Only a human, through a real local gesture verified by executeLocalControlCommand, can confirm one.',
				points: [
					'Confirmation is a real local click that the registry verifies, not a signal an adapter can assert.',
					'The registry does not create a confirmation dialog or authenticate the person who confirmed.',
					'The application can require confirmation for more sources and actions in a custom policy.'
				]
			},
			{
				title: 'Keep application authority at the application boundary',
				intro:
					'The interaction registry governs one visible control surface. Server operations still use the authenticated principal, tenant scope, permissions, and field policy.',
				points: [
					'Control discovery does not widen a principal permission set.',
					'An offered tool is not proof that its execution is authorized.',
					'A custom policy can narrow the registry, but it cannot replace server authorization.'
				]
			}
		],
		related: [
			{ label: 'UI implementation: consent-aware controls', href: '/packages/smrt-ui' },
			{
				label: 'Framework mechanism: awareness is not authority',
				href: '/capabilities/agent-legible-applications#awareness-is-not-authority'
			},
			{ label: 'Reference contract: security defaults', href: '/reference/security' },
			{ label: 'Related guide: expose your app over MCP', href: '/guides/expose-your-app-over-mcp' }
		]
	}
];

/** Audited copy source for the single-route Interaction section. */
export const interactionContent = { guides: interactionGuides };

export function getInteractionGuide(slug: string): Guide | undefined {
	return interactionGuides.find((guide) => guide.slug === slug);
}

/** Ordered content families rendered as stable anchors on `/interaction`. */
export function listInteractionGuides(): readonly Guide[] {
	return interactionGuides;
}
