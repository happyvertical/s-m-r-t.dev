import { SMRT_VERSION } from '$lib/version';

export type UIStoryPointKind = 'person' | 'discover' | 'operate' | 'confirm' | 'failure';
export type UIStoryLinkKind = 'playground' | 'reference' | 'gap';

export interface UIStoryPoint {
	kind: UIStoryPointKind;
	body: string;
}

export interface UIStoryLink {
	kind: UIStoryLinkKind;
	label: string;
	href: string;
	note?: string;
	external?: boolean;
}

export interface UIStory {
	id: string;
	eyebrow: string;
	title: string;
	lede: string;
	description: string;
	components: string[];
	highlights: string[];
	points: UIStoryPoint[];
	links: UIStoryLink[];
}

const SMRT_TREE = `https://github.com/happyvertical/smrt/tree/v${SMRT_VERSION}`;

export const uiStories: UIStory[] = [
	{
		id: 'agent-addressable-components',
		eyebrow: 'Shared control contract',
		title: 'Agent-addressable components',
		lede: 'A control can publish a stable contract without containing an agent or a model.',
		description:
			'An agent is a governed caller of the same component contract that a person uses. The contract keeps meaning, state, consent, and refusal explicit.',
		components: ['createControlInteractionRegistry', 'Form', 'Input', 'Select', 'Switch'],
		highlights: [
			'Stable form and control IDs',
			'Meaning, options, and constraints',
			'Sensitivity and current state',
			'Command source records',
			'Stage, validate, apply, and undo'
		],
		points: [
			{
				kind: 'person',
				body: 'A person sees labels, choices, current state, validation, and controls for staged or live changes.'
			},
			{
				kind: 'discover',
				body: 'An agent can find a control by stable form and control IDs. Metadata describes its meaning, options, constraints, sensitivity, state, and commands.'
			},
			{
				kind: 'operate',
				body: 'An adapter can request focus, reveal, highlight, explain, validate, stage, apply, clear, or undo operations. Each request identifies its command source.'
			},
			{
				kind: 'confirm',
				body: 'An agent can stage a value without changing the live value. An agent apply operation requires an explicit confirmation signal by default.'
			},
			{
				kind: 'failure',
				body: 'The default policy refuses writes to non-writable, disabled, read-only, or secret controls. Secret controls publish no read or mutation capability.'
			}
		],
		links: [
			{
				kind: 'playground',
				label: 'Agent-aware form: success and refusal',
				href: '/playground?entry=agent-aware-form',
				note: 'Run the same canonical demonstration in the standalone Playground.'
			},
			{
				kind: 'reference',
				label: 'Control interaction contract',
				href: '/reference/control-interaction'
			}
		]
	},
	{
		id: 'data-table-and-collections',
		eyebrow: 'Prominent working surface',
		title: 'DataTable and collections',
		lede: 'DataTable keeps controller-backed operations and programmatic commands on one serializable state contract.',
		description:
			'A durable row key lets a person, an adapter, and a later request refer to the same row after sorting, filtering, paging, or expansion.',
		components: [
			'DataTable',
			'DataTableController',
			'DataTableCommand',
			'DataTableSnapshot',
			'assertDataTableSelectionCurrent'
		],
		highlights: [
			'Search and declarative filters',
			'Ordered sorting and pagination',
			'Expansion and selection in controller state',
			'Density as a presentational component prop',
			'Local and manual ownership modes',
			'Controlled state proposals',
			'agentAddressable requires durable rowKey identity',
			'Serializable state and commands'
		],
		points: [
			{
				kind: 'person',
				body: 'A person can search, filter, sort several columns, change pages, expand rows, change density, and select durable row identities.'
			},
			{
				kind: 'discover',
				body: 'An agent can inspect JSON-safe view state, operation ownership modes, visible columns, selection scope, and the available plain-data commands.'
			},
			{
				kind: 'operate',
				body: 'An adapter can dispatch the same commands as controller-backed rendered controls. Density stays outside the controller snapshot as a presentational prop. Local mode transforms rows, while manual mode leaves filtering, sorting, or paging to the caller.'
			},
			{
				kind: 'confirm',
				body: 'A controlled controller emits a proposed state change. The host must replace the state before the proposal becomes live.'
			},
			{
				kind: 'failure',
				body: 'An agent-addressable table requires rowKey. Duplicate IDs fail closed, and an all-matching action rejects a stale query fingerprint or revision.'
			}
		],
		links: [
			{
				kind: 'playground',
				label: 'Data Table',
				href: '/playground',
				note: 'Open UI Foundation, then Data Table.'
			},
			{
				kind: 'reference',
				label: 'smrt-ui data reference',
				href: '/packages/smrt-ui?tab=components'
			}
		]
	},
	{
		id: 'model-driven-forms',
		eyebrow: 'Rich input composition',
		title: 'Model-driven forms and rich inputs',
		lede: 'Model metadata and field policy can shape one form without weakening its write boundary.',
		description:
			'Provider-backed inputs add application state, speech entry, and value-specific behavior. Field policy controls presentation, while the model remains the security authority.',
		components: [
			'ObjectForm',
			'FieldPolicyProvider',
			'TextInput',
			'MoneyInput',
			'DateTimeInput',
			'AddressInput',
			'FileUpload',
			'FormMicButton'
		],
		highlights: [
			'Model-aware field definitions',
			'Field-policy visibility and defaults',
			'Rich value-specific inputs',
			'Visible validation',
			'Secret value handling',
			'Explicit voice entry points'
		],
		points: [
			{
				kind: 'person',
				body: 'A person sees the applicable basic and advanced fields, rich value controls, help, validation, and a voice entry point when the application wires one.'
			},
			{
				kind: 'discover',
				body: 'An agent can discover visible control metadata and the resolved field arrangement. The model and field policy remain separate contracts.'
			},
			{
				kind: 'operate',
				body: 'An adapter can explain and validate values or stage permitted changes. Provider-backed inputs can connect speech results to the same form state.'
			},
			{
				kind: 'confirm',
				body: 'A proposed value stays separate until the person confirms it. The form can then apply and validate the value through its registered control.'
			},
			{
				kind: 'failure',
				body: 'A hidden field is not an authorization rule. Secret controls stay redacted, and model write policy must refuse protected fields at the server boundary.'
			}
		],
		links: [
			{
				kind: 'playground',
				label: 'Base Controls',
				href: '/playground',
				note: 'Open UI Foundation, then Base Controls. The policy-driven form preview remains blocked by site issue 156.'
			},
			{
				kind: 'reference',
				label: 'smrt-svelte form reference',
				href: '/packages/smrt-svelte?tab=components'
			},
			{
				kind: 'reference',
				label: 'Field policy API',
				href: '/reference/field-policies'
			}
		]
	},
	{
		id: 'chat-and-tool-calls',
		eyebrow: 'Visible agent work',
		title: 'Chat and tool calls',
		lede: 'Chat surfaces keep messages, tool operations, results, errors, and proposed edits visible.',
		description:
			'AgentChat composes session state, loading state, messages, tool calls, and field-change review. MessageBubble supplies accessible user, agent, and system message forms.',
		components: ['AgentChat', 'MessageBubble', 'ToolCallDisplay', 'MessageList', 'MessageInput'],
		highlights: [
			'User, agent, system, and tool roles',
			'Tool name and status',
			'Arguments, results, and errors',
			'Duration and loading state',
			'Field-change differences',
			'Explicit Apply callback',
			'Session status'
		],
		points: [
			{
				kind: 'person',
				body: 'A person sees message roles, session status, loading state, tool progress, tool details, and field-change differences before any suggested edit is applied.'
			},
			{
				kind: 'discover',
				body: 'An agent can receive the active session, allowed tool list, message context, and host callbacks that the application supplies.'
			},
			{
				kind: 'operate',
				body: 'The UI can display pending, running, successful, and failed tool calls. Each display can show arguments, results, errors, and duration.'
			},
			{
				kind: 'confirm',
				body: 'Suggested markdown displays an Apply control only when the host supplies an onapplychange callback. The callback keeps the final edit application-owned.'
			},
			{
				kind: 'failure',
				body: 'An inactive session disables message submission. A failed tool call keeps its error visible instead of presenting a successful result.'
			}
		],
		links: [
			{
				kind: 'playground',
				label: 'Message List and Message Input',
				href: '/playground',
				note: 'Open Chat, then Message List or Message Input.'
			},
			{
				kind: 'reference',
				label: 'smrt-chat component reference',
				href: '/packages/smrt-chat?tab=components'
			},
			{
				kind: 'gap',
				label: 'Track the missing AgentChat and tool-call preview',
				href: 'https://github.com/happyvertical/smrt/issues/2503',
				external: true
			}
		]
	},
	{
		id: 'application-shell',
		eyebrow: 'The live site shell',
		title: 'Application shell and navigation',
		lede: 'This documentation site is the live AdminShell example. The story does not nest or imitate another shell.',
		description:
			'The application bar holds primary navigation and site actions. The contextual application panel holds section navigation, and route content uses the shell main area.',
		components: [
			'AdminShell',
			'ShellState',
			'useAdminShell',
			'tenantNavFromManifest',
			'ActivityList',
			'ShellSettingsPanel'
		],
		highlights: [
			'Application bar and application panel',
			'Active ShellState context',
			'Manifest-derived tenant navigation',
			'Session and permission context',
			'Activities and focus tools',
			'User-owned settings',
			'Route-scoped cleanup'
		],
		points: [
			{
				kind: 'person',
				body: 'A visitor uses the application bar, search, site actions, contextual documentation panel, responsive navigation, focus restoration, and shell-owned scroll area on every docs route.'
			},
			{
				kind: 'discover',
				body: 'An integrated component can read the active ShellState from context. An application can derive permitted tenant navigation from its manifest.'
			},
			{
				kind: 'operate',
				body: 'A route can operate the active panel state and register focus tools or activities. Each registration returns a cleanup function for route unmount.'
			},
			{
				kind: 'confirm',
				body: 'Shell settings are user-owned preferences. Domain operations still use their own permission and confirmation rules.'
			},
			{
				kind: 'failure',
				body: 'Unused tenant, focus, and system edges stay hidden on this site. A hidden edge does not imply that its application capability is active.'
			}
		],
		links: [
			{
				kind: 'playground',
				label: 'Standalone AdminShell workbench source',
				href: `${SMRT_TREE}/packages/smrt-svelte/playground/src/routes/admin-shell`,
				note: 'The package workbench contains the full example. The installed release does not export it to the shared Playground.',
				external: true
			},
			{
				kind: 'reference',
				label: 'smrt-svelte shell reference',
				href: '/packages/smrt-svelte?tab=components'
			},
			{
				kind: 'gap',
				label: 'Track the shared AdminShell preview',
				href: 'https://github.com/happyvertical/smrt/issues/2503',
				external: true
			}
		]
	},
	{
		id: 'voice-and-browser-ai',
		eyebrow: 'Explicit browser capability',
		title: 'Voice and browser AI',
		lede: 'Browser AI starts with capability detection and explicit adapter configuration.',
		description:
			'Speech and local-model components show readiness, initialization, listening, generation, errors, and download progress. The application chooses and wires each adapter.',
		components: [
			'VoiceInput',
			'CapabilityGate',
			'DownloadProgress',
			'AILoadingOverlay',
			'useSTT',
			'useTTS',
			'useLLM'
		],
		highlights: [
			'Capability detection',
			'Speech input and output',
			'Model readiness',
			'Download progress',
			'Warm adapter cache',
			'Explicit adapter wiring'
		],
		points: [
			{
				kind: 'person',
				body: 'A person sees whether the capability is available, initializing, ready, listening, speaking, generating, downloading, or in an error state.'
			},
			{
				kind: 'discover',
				body: 'An agent can discover the capability and current adapter state that the Provider exposes. Availability does not grant microphone or mutation authority.'
			},
			{
				kind: 'operate',
				body: 'The application can initialize speech or model adapters, start or stop speech, stream model tokens, and keep initialized adapters in a warm cache.'
			},
			{
				kind: 'confirm',
				body: 'The browser and application own microphone consent. A speech result still enters the applicable control staging and confirmation policy.'
			},
			{
				kind: 'failure',
				body: 'CapabilityGate can withhold unsupported UI. Initialization errors and download state remain visible, and no adapter is selected without application configuration.'
			}
		],
		links: [
			{
				kind: 'gap',
				label: 'Track the missing browser-AI preview',
				href: 'https://github.com/happyvertical/smrt/issues/2503',
				note: 'The installed shared Playground has no browser-AI entry.',
				external: true
			},
			{
				kind: 'reference',
				label: 'smrt-svelte browser-AI reference',
				href: '/packages/smrt-svelte?tab=components'
			}
		]
	},
	{
		id: 'feedback-and-focused-work',
		eyebrow: 'State that stays visible',
		title: 'Feedback and focused work',
		lede: 'Feedback components identify progress, interruption, confirmation, and failure without hiding the active task.',
		description:
			'Alerts, toasts, progress, meters, dialogs, drawers, disclosure, and focus tools use shared state, focus, keyboard, motion, and theme conventions.',
		components: [
			'Alert',
			'ToastViewport',
			'Progress',
			'Meter',
			'ConfirmDialog',
			'Drawer',
			'Disclosure',
			'ShellDockTool'
		],
		highlights: [
			'Visible progress and errors',
			'Keyboard and focus control',
			'Explicit destructive confirmation',
			'Scoped focus tools',
			'Reduced-motion behavior'
		],
		points: [
			{
				kind: 'person',
				body: 'A person sees task status, progress, errors, available actions, and the focused work surface. Keyboard focus follows the open overlay or tool.'
			},
			{
				kind: 'discover',
				body: 'An agent can discover declared status, progress, available actions, and the subject of a registered focus tool or shell activity.'
			},
			{
				kind: 'operate',
				body: 'Application code can update an activity, open a focus tool, show feedback, or request a confirmation through the matching component contract.'
			},
			{
				kind: 'confirm',
				body: 'ConfirmDialog keeps a destructive decision explicit. The final operation remains in the application callback and its authorization boundary.'
			},
			{
				kind: 'failure',
				body: 'A failed activity keeps an error state. Escape, focus containment, disabled actions, and reduced motion prevent an overlay from becoming an uncontrolled path.'
			}
		],
		links: [
			{
				kind: 'playground',
				label: 'Feedback and Overlays',
				href: '/playground',
				note: 'Open UI Foundation, then Feedback and Overlays.'
			},
			{
				kind: 'reference',
				label: 'smrt-ui feedback reference',
				href: '/packages/smrt-ui?tab=components'
			}
		]
	},
	{
		id: 'themes-and-accessibility',
		eyebrow: 'One component contract',
		title: 'Themes and accessibility',
		lede: 'Semantic tokens change presentation without changing component meaning or interaction.',
		description:
			'Foundation components share native semantics, visible focus, keyboard behavior, theme tokens, loading and disabled states, and reduced-motion rules.',
		components: [
			'ThemeProvider',
			'ThemeSwitcher',
			'ColorSchemeToggle',
			'Button',
			'FormGroup',
			'DataTable'
		],
		highlights: [
			'Light and dark color schemes',
			'Semantic design tokens',
			'Visible keyboard focus',
			'Native control semantics',
			'Mobile layouts',
			'Reduced motion'
		],
		points: [
			{
				kind: 'person',
				body: 'A person can use the same control with a keyboard, pointer, touch target, screen reader, narrow viewport, reduced motion, or another theme.'
			},
			{
				kind: 'discover',
				body: 'An agent can discover semantic role, name, state, constraints, and declared options. Theme values do not change that interaction contract.'
			},
			{
				kind: 'operate',
				body: 'The application can select a theme preset and color scheme. Components consume semantic tokens instead of installing private component themes.'
			},
			{
				kind: 'confirm',
				body: 'Theme preference changes presentation only. A theme action does not confirm a domain operation or grant an agent command.'
			},
			{
				kind: 'failure',
				body: 'Unsupported themes keep token fallbacks, and reduced-motion rules remove nonessential motion. Disabled and invalid states remain explicit in every scheme.'
			}
		],
		links: [
			{
				kind: 'playground',
				label: 'Theme controls in every Playground preview',
				href: '/playground',
				note: 'Use the Theme and color-scheme controls in the standalone Playground.'
			},
			{
				kind: 'reference',
				label: 'smrt-ui theme reference',
				href: '/packages/smrt-ui?tab=components'
			}
		]
	}
];
