import { SMRT_VERSION } from '$lib/version';

/**
 * Two story templates share one page. An interaction story walks the
 * person / agent / confirmation / failure contract. A batteries-included
 * story names what a consumer gets from the installed package, how the
 * capability is turned on, and the boundary it enforces.
 */
export type UIStoryGroup = 'contract' | 'battery';
export type UIStoryPointKind =
	'person' | 'discover' | 'operate' | 'confirm' | 'failure' | 'gets' | 'wiring' | 'boundary';
export type UIStoryLinkKind = 'playground' | 'reference' | 'gap';

export const contractPointKinds: UIStoryPointKind[] = [
	'person',
	'discover',
	'operate',
	'confirm',
	'failure'
];
export const batteryPointKinds: UIStoryPointKind[] = ['gets', 'wiring', 'boundary'];

export interface UIStoryGroupMeta {
	id: UIStoryGroup;
	kicker: string;
	title: string;
	intro: string;
}

export const uiStoryGroups: UIStoryGroupMeta[] = [
	{
		id: 'contract',
		kicker: 'Interaction stories',
		title: 'One boundary for people and agents',
		intro:
			'Each story names what a person sees, what an agent can discover and operate, where confirmation occurs, and how the component refuses unsafe work.'
	},
	{
		id: 'battery',
		kicker: 'Batteries included',
		title: 'What the installed package already includes',
		intro:
			'Each story names what a consumer gets from the installed package, how the capability is turned on, and the boundary it enforces.'
	}
];

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
	group: UIStoryGroup;
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
		group: 'contract',
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
				body: 'An agent can stage a value without changing the live value. An agent apply operation is always refused by default; only a human, through a real local click, can apply it.'
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
		group: 'contract',
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
		group: 'contract',
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
		group: 'contract',
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
		group: 'contract',
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
		group: 'contract',
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
		group: 'contract',
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
		group: 'contract',
		eyebrow: 'One component contract',
		title: 'Themes and accessibility',
		lede: 'Semantic tokens change presentation without changing component meaning or interaction.',
		description:
			'Foundation components share native semantics, visible focus, keyboard behavior, theme tokens, loading and disabled states, and reduced-motion rules. Each preset ships as generated and static stylesheets, with optional self-hosted fonts.',
		// Preset list, static stylesheets, fonts, and the generateThemeCSS() rule:
		// smrt-ui AGENTS.md, "What lives here" table and "Theme presets".
		// Token vocabulary and Material 3 aliases: smrt-svelte agents/themes.md.
		components: [
			'ThemeProvider',
			'ThemeSwitcher',
			'ColorSchemeToggle',
			'generateThemeCSS',
			'Button',
			'FormGroup',
			'DataTable'
		],
		highlights: [
			'Material, Glass, Studio, SMRT, and HappyVertical presets',
			'Light and dark color schemes',
			'Static preset stylesheets generated from the same tokens',
			'Optional self-hosted font files',
			'Token names with Material 3 aliases',
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
				body: 'The application can select a preset and color scheme through ThemeProvider, or link a static preset stylesheet. Components consume semantic tokens instead of installing private component themes.'
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
	},
	{
		id: 'staged-review',
		group: 'battery',
		eyebrow: 'On by default',
		title: 'Staged review for proposed values',
		lede: 'Both Form components mount a review surface for values that an agent proposes.',
		description:
			'A proposed value waits in the form until a person applies or discards it. The registry records who proposed each value, when, and against which revision.',
		// Mounted by both Forms, provenance record, human-only apply, secret
		// controls, stale proposals: smrt-ui AGENTS.md, "Rules". Default value:
		// `stagedReview = true` in smrt-ui and smrt-svelte dist Form.svelte.
		components: ['StagedControlReview', 'Form', 'ControlInteractionRegistry'],
		highlights: [
			'Mounted by the base Form and the rich Form',
			'stagedReview is true by default',
			'Provenance, timestamp, and revision per proposal',
			'Apply only through a local human gesture',
			'Secret controls never accept staging',
			'Stale and invalid proposals stay visible'
		],
		points: [
			{
				kind: 'gets',
				body: 'Every Form renders the review surface for staged changes. The surface lists each proposed value and offers apply and discard, singly or for the whole batch.'
			},
			{
				kind: 'wiring',
				body: 'The stagedReview prop is true on the base Form in smrt-ui and the rich Form in smrt-svelte. Passing false hides the built-in surface, and an application can mount StagedControlReview itself with the same registry and form ID.'
			},
			{
				kind: 'boundary',
				body: 'An agent can stage a value but cannot confirm it. Apply is accepted only from a trusted browser gesture while its event is dispatching. A serialized confirmed flag is not confirmation. Secret controls never accept staging, and sensitive values stay redacted in the review surface.'
			}
		],
		links: [
			{
				kind: 'playground',
				label: 'Agent-aware form: success and refusal',
				href: '/playground?entry=agent-aware-form',
				note: 'The demonstration stages a proposal and leaves the apply step to a person.'
			},
			{
				kind: 'reference',
				label: 'StagedControlReview reference',
				href: '/reference/components/staged-control-review'
			},
			{
				kind: 'reference',
				label: 'Control interaction contract',
				href: '/reference/control-interaction'
			}
		]
	},
	{
		id: 'content-routes',
		group: 'battery',
		eyebrow: 'Route components',
		title: 'Whole-page route components',
		lede: 'The content package ships complete admin and public pages that a host mounts as routes.',
		description:
			'Route components cover authoring, governance, facts, contributions, and the published article. Route metadata carries each page title, description, and default path, and, for the admin pages, a navigation entry.',
		// Route components, CONTENT_ROUTE_META, and navigation helpers: the
		// installed smrt-content dist/svelte/index.d.ts and routes/shared.d.ts.
		// ContentWorkspaceRoute wrapping ContentList: smrt-content
		// agents/content-list.md, "ContentList server-backed mode".
		// Asset manager and image studio routes: smrt-assets and smrt-images
		// dist/workbench.d.ts `routeModules`, and the Playground entry titles.
		components: [
			'ContentWorkspaceRoute',
			'ContentGovernanceRoute',
			'ContentFactsRoute',
			'ContentContributionsRoute',
			'PublishedArticleRoute',
			'CONTENT_ROUTE_META',
			'createContentRouteNavigation'
		],
		highlights: [
			'One import for every content page',
			'Route metadata with titles and default paths',
			'Navigation items from one helper',
			'Path overrides per route',
			'Asset manager and image studio routes in the package workbenches'
		],
		points: [
			{
				kind: 'gets',
				body: 'A host renders a workspace, governance admin, fact catalog, contribution inbox, or published article page from one component. The workspace page wraps ContentList with the package defaults.'
			},
			{
				kind: 'wiring',
				body: 'The components export from the smrt-content svelte subpath. CONTENT_ROUTE_META names the default path for each page, and createContentRouteNavigation returns navigation items with optional path overrides.'
			},
			{
				kind: 'boundary',
				body: 'A route component renders the page. The host owns the SvelteKit route file and the load function that supplies data. The published article loads one content record with its public transparency information.'
			}
		],
		links: [
			{
				kind: 'reference',
				label: 'ContentWorkspaceRoute reference',
				href: '/reference/components/content-workspace-route'
			},
			{
				kind: 'reference',
				label: 'smrt-content component reference',
				href: '/packages/smrt-content?tab=components'
			},
			{
				kind: 'playground',
				label: 'Asset Manager Route and Image Studio Route',
				href: '/playground',
				note: 'Open Assets, then Asset Manager Route, or Images, then Image Studio Route.'
			}
		]
	},
	{
		id: 'module-ui-registry',
		group: 'battery',
		eyebrow: 'Component discovery',
		title: 'Module UI registry',
		lede: 'A domain package registers its components at import time. A host resolves them by package name and slot ID.',
		description:
			'ModuleUIRegistry is one global registry in smrt-ui. Slot IDs are stable strings, so a host can reference a component without importing the package that owns it.',
		// Registration on import, stable slot IDs, the ./ui subpath, and the
		// registered slot lists: smrt-assets AGENTS.md and smrt-images AGENTS.md,
		// "UI Registry". Global singleton: smrt-ui dist/registry/module-registry.d.ts.
		// No domain imports in smrt-ui: smrt-ui AGENTS.md, "Rules".
		components: [
			'ModuleUIRegistry',
			'createModuleUIRegistry',
			'SmrtModuleMeta',
			'ModuleUISlot',
			'ASSETS_UI_SLOTS'
		],
		highlights: [
			'One global registry in smrt-ui',
			'Registration on import of a package svelte subpath',
			'Stable slot IDs per package',
			'Slot metadata with label, icon, and category',
			'A private registry through createModuleUIRegistry'
		],
		points: [
			{
				kind: 'gets',
				body: 'Importing a package svelte subpath registers its components. The assets package registers its manager, grid, list, detail, toolbar, action bar, and create modal as slots. The images package registers its gallery, editor, and uploader.'
			},
			{
				kind: 'wiring',
				body: 'A host imports the assets svelte subpath for its side effect, then calls ModuleUIRegistry.get with the package name and slot ID. The ui subpath exports the slot declarations, so a host can list them without a hard import of the components.'
			},
			{
				kind: 'boundary',
				body: 'The registry stores and returns component references. smrt-ui imports no domain package, so registration flows one way, from a domain package into the leaf.'
			}
		],
		links: [
			{
				kind: 'reference',
				label: 'AssetManager slot reference',
				href: '/reference/components/asset-manager',
				note: 'The reference page shows the slot metadata this component registers.'
			},
			{
				kind: 'reference',
				label: 'smrt-ui registry reference',
				href: '/packages/smrt-ui?tab=components'
			},
			{
				kind: 'playground',
				label: 'Asset Grid',
				href: '/playground',
				note: 'Open Assets, then Asset Grid.'
			}
		]
	},
	{
		id: 'translations',
		group: 'battery',
		eyebrow: 'Message catalogs',
		title: 'Translations and message catalogs',
		lede: 'Every package registers English defaults in code. A server snapshot supplies translations, and a lookup never returns blank.',
		description:
			'The client reads a per-locale dictionary of templates and fills placeholders itself. The language resolver stays on the server.',
		// Every claim: smrt-svelte agents/i18n.md, and the i18n split in
		// smrt-ui AGENTS.md, "Gotchas".
		components: ['useI18n', 'Trans', 'defineMessages', 'renderTemplate', 'buildI18nSnapshot'],
		highlights: [
			'English defaults registered with defineMessages',
			't for attributes and Trans for element bodies',
			'Snapshot, then registered default, then the key itself',
			'No async step during render',
			'Works outside a Provider',
			'Server-only buildI18nSnapshot'
		],
		points: [
			{
				kind: 'gets',
				body: 'Package components already carry their English strings. A component reads a string with t or Trans, and a lookup falls back from the snapshot to the registered default to the key.'
			},
			{
				kind: 'wiring',
				body: 'A load function calls buildI18nSnapshot with the request locale, tenant, and database, and passes the result to Provider as the i18n prop. Reassigning that prop switches locale and re-renders every string.'
			},
			{
				kind: 'boundary',
				body: 'Resolution has no async step, so render never waits on a network call. The languages package is imported only by the server subpath and stays out of the browser bundle.'
			}
		],
		links: [
			{
				kind: 'reference',
				label: 'Trans reference',
				href: '/reference/components/trans'
			},
			{
				kind: 'reference',
				label: 'smrt-svelte i18n reference',
				href: '/packages/smrt-svelte?tab=components'
			}
		]
	},
	{
		id: 'agent-admin-shells',
		group: 'battery',
		eyebrow: 'Operations UI included',
		title: 'Agent admin shells',
		lede: 'The agents package ships the admin panel, the settings shell, and a settings form that renders a declared schema.',
		description:
			'An agent class declares its admin panels as static uiSlots. A slot with a settingsSchema gets a form without custom component code.',
		// uiSlots, settingsSchema fallback, merged config, persona owner:
		// smrt-agents AGENTS.md, "Configuration". Side-effect-free subpath:
		// smrt-agents dist/svelte/admin.d.ts header and smrt-svelte AGENTS.md
		// opening paragraph. Dashboard, schedule, and run-history slots: the
		// shipped SmrtModuleMeta surfaced in the component reference.
		components: [
			'AgentAdminPanel',
			'AgentAdminTabs',
			'AgentSettingsShell',
			'AgentSettingsForm',
			'AgentUISlot',
			'AgentSettingsSchema'
		],
		highlights: [
			'Admin shells from a side-effect-free subpath',
			'Static uiSlots with id, label, icon, and order',
			'A settings schema that carries its version, rendered by AgentSettingsForm',
			'Settings owned per agent or per persona',
			'Dashboard, schedule, and run-history components in the registry'
		],
		points: [
			{
				kind: 'gets',
				body: 'An agent declares its panels once. Without a registered custom component, AgentSettingsForm renders the declared schema as the settings panel. Dashboard, schedule form, schedule list, and run history components register in the module UI registry.'
			},
			{
				kind: 'wiring',
				body: 'The shells import from the smrt-agents svelte admin subpath, which registers nothing on import. The svelte barrel adds the registry registration for the schedule components.'
			},
			{
				kind: 'boundary',
				body: 'Saved settings merge over file configuration through getMergedConfig, and the database value wins. A persona-backed agent stores settings under its persona ID.'
			}
		],
		links: [
			{
				kind: 'reference',
				label: 'AgentSettingsForm reference',
				href: '/reference/components/agent-settings-form'
			},
			{
				kind: 'reference',
				label: 'smrt-agents component reference',
				href: '/packages/smrt-agents?tab=components'
			},
			{
				kind: 'playground',
				label: 'Agent Dashboard, Schedule Form, and Run History',
				href: '/playground',
				note: 'Open Agents, then Agent Dashboard, Agent Schedule Form, or Agent Run History.'
			}
		]
	},
	{
		id: 'auth-and-sessions',
		group: 'battery',
		eyebrow: 'Sign-in and sessions',
		title: 'Auth and session wiring',
		lede: 'One handle hook loads the session, and ready-made handlers cover sign-in, callback, and mobile.',
		description:
			'The users package supplies the SvelteKit pieces. A session handler covers hooks.server.ts, cookie helpers cover form actions, and OIDC and mobile handlers cover sign-in.',
		// Handle hook, locals, cookie helpers: smrt-users AGENTS.md, "SvelteKit
		// Integration". Mobile handlers: "Mobile /api/mobile Handlers". Tenant
		// switch and email_verified: "Security (S5 #1400)". TTL in seconds:
		// "Gotchas". OIDC handler names: dist/sveltekit/index.d.ts.
		components: [
			'createSessionHandler',
			'createSessionCookie',
			'destroySessionCookie',
			'switchSessionTenant',
			'createOidcLoginHandler',
			'createOidcCallbackHandler',
			'createMobileAuthHandlers'
		],
		highlights: [
			'event.locals with user, membership, permissions, tenant, and session',
			'Cookie helpers for sign-in, sign-out, and tenant switch',
			'OIDC login and callback handlers',
			'Mobile sessions carried as a bearer token, with the sign-in handshake held by the server',
			'Session lifetime set in seconds',
			'Tenant switch verifies membership and rotates the session ID'
		],
		points: [
			{
				kind: 'gets',
				body: 'After createSessionHandler runs, every request carries the user, membership, permission slugs, tenant ID, and session ID on event.locals. Mobile apps get start, complete, session, and logout handlers plus a bearer guard for app-owned routes.'
			},
			{
				kind: 'wiring',
				body: 'hooks.server.ts exports the handle from createSessionHandler with a database, a TTL in seconds, and paths to skip. Form actions call createSessionCookie, destroySessionCookie, or switchSessionTenant, and two server routes export the OIDC login and callback handlers.'
			},
			{
				kind: 'boundary',
				body: 'A tenant switch is refused unless the user holds an active membership in the target tenant, and a successful switch issues a new session ID. OIDC sign-in refuses an identity that the provider reports as unverified email.'
			}
		],
		links: [
			{
				kind: 'reference',
				label: 'smrt-users package reference',
				href: '/packages/smrt-users'
			},
			{
				kind: 'playground',
				label: 'User Menu',
				href: '/playground',
				note: 'Open Users, then User Menu.'
			}
		]
	}
];
