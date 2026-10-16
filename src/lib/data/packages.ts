import type { GuideCallout } from '$lib/data/callouts';
import { SMRT_VERSION } from '$lib/version';
// The planner is on its own version line, not the framework release. Its
// installed package.json is the only honest source for the number it renders.
import plannerPackage from '@happyvertical/smrt-planner/package.json';

export type PackageCategory =
	| 'Foundation'
	| 'Agents & runtime'
	| 'Web & UI'
	| 'Content & media'
	| 'Business & operations'
	| 'Domain models'
	| 'Mobile';

export type PackageKind = 'models' | 'runtime' | 'tooling' | 'ui' | 'mobile';

export interface PackageComponentGroup {
	title: string;
	description: string;
	importPath: string;
	components: string[];
}

export interface PackageDetail {
	title: string;
	body: string;
	href?: string;
	linkLabel?: string;
}

export interface SmrtPackage {
	slug: string;
	name: string;
	category: PackageCategory;
	kind: PackageKind;
	summary: string;
	highlights: string[];
	components: string[];
	componentGroups: PackageComponentGroup[];
	details: PackageDetail[];
	componentImport?: string;
	exampleResource?: string;
	/**
	 * Replaces the generic fallback copy on the overview note and the four
	 * generated-interface panels when that copy would be wrong. The default text
	 * assumes a package without models is infrastructure or tooling, which is not
	 * true of every one of them.
	 */
	surfaceNote?: string;
	/**
	 * Replaces the "no playground module yet" copy for a package that does ship
	 * one the site cannot currently render. Saying nothing would be the same as
	 * claiming the package has no previews, which is not true of every package
	 * missing from `playgroundModules`.
	 */
	playgroundNote?: string;
	version: string;
	status?: PackageStatus;
	/**
	 * Source repository URL for a package that lives outside the smrt monorepo.
	 * The renderer prefers it over the monorepo `tree/v<version>/packages/<dir>` link.
	 */
	repository?: string;
	/** Admonition shown above the tabs, for packages that need a caveat up front. */
	notice?: GuideCallout;
}

/**
 * `stub` means the package is published and importable but its exports are not
 * implemented yet. It is deliberately distinct from `new`: a reader must not
 * mistake "recently added" for "ready to build on".
 */
export type PackageStatus = 'stable' | 'new' | 'foundation' | 'private' | 'stub';

export const packageStatusLabels: Record<Exclude<PackageStatus, 'stable'>, string> = {
	new: 'New',
	foundation: 'Foundation',
	private: 'Source distribution',
	stub: 'Not implemented'
};

type PackageOptions = Partial<
	Pick<
		SmrtPackage,
		| 'kind'
		| 'highlights'
		| 'components'
		| 'componentGroups'
		| 'details'
		| 'componentImport'
		| 'exampleResource'
		| 'surfaceNote'
		| 'playgroundNote'
		| 'status'
		| 'repository'
		| 'notice'
	>
>;

/**
 * Packages released on a version line of their own. Every other smrt-* package
 * releases in lockstep and renders SMRT_VERSION.
 */
const OWN_VERSION_LINES: Record<string, string> = {
	'smrt-planner': plannerPackage.version
};

const smrtUiComponentGroups: PackageComponentGroup[] = [
	{
		title: 'Fields and form structure',
		description:
			'Build labeled forms, group related fields, and make validation errors clear and visible.',
		importPath: '@happyvertical/smrt-ui/forms',
		components: [
			'Form',
			'Field',
			'FormGroup',
			'Fieldset',
			'InputGroup',
			'ErrorSummary',
			'FormActionBar'
		]
	},
	{
		title: 'Text and structured input',
		description:
			'Collect free text, selected options, related records, multiple values, tags, dates, times, files, and dictated speech.',
		importPath: '@happyvertical/smrt-ui/forms',
		components: [
			'Input',
			'Textarea',
			'Select',
			'Combobox',
			'RelationInput',
			'SearchInput',
			'Listbox',
			'MultiSelect',
			'TagsInput',
			'CountrySelect',
			'ProvinceSelect',
			'CurrencySelect',
			'DatePicker',
			'TimePicker',
			'FilePicker',
			'DictationButton',
			'DictationStatus'
		]
	},
	{
		title: 'Choices and values',
		description: 'Use the control that matches the decision instead of rebuilding choice behavior.',
		importPath: '@happyvertical/smrt-ui/forms',
		components: [
			'Checkbox',
			'RadioGroup',
			'Radio',
			'Switch',
			'Toggle',
			'ToggleButton',
			'SegmentedControl',
			'Slider',
			'RangeSlider'
		]
	},
	{
		title: 'Capture',
		description:
			'Take a photo from the device camera or a drawn signature, and submit it with the surrounding native form.',
		importPath: '@happyvertical/smrt-ui/forms',
		components: ['CameraCapture', 'SignaturePad']
	},
	{
		title: 'Agent interaction contracts',
		description:
			'Give chat, voice, tutorial, or test adapters a stable way to inspect and assist with forms. Agents stage proposals; a person confirms them in StagedControlReview.',
		importPath: '@happyvertical/smrt-ui/forms',
		components: [
			'createControlInteractionRegistry',
			'stageControlProposals',
			'StagedControlReview',
			'ControlIdentity',
			'ControlSnapshot',
			'ControlCommand',
			'ControlInteractionPolicy'
		]
	},
	{
		title: 'Actions and display',
		description:
			'Common actions and compact display primitives with one theme and accessibility contract.',
		importPath: '@happyvertical/smrt-ui/ui',
		components: [
			'Button',
			'IconToggle',
			'IconToggleGroup',
			'Dropdown',
			'Menu',
			'Pagination',
			'Badge',
			'Chip',
			'Avatar',
			'Card',
			'Skeleton',
			'Tooltip',
			'Tree'
		]
	},
	{
		title: 'Disclosure and popovers',
		description: 'Reveal supporting information without inventing new interaction rules.',
		importPath: '@happyvertical/smrt-ui/ui',
		components: ['Popover', 'Disclosure', 'Accordion', 'AccordionItem']
	},
	{
		title: 'Feedback and overlays',
		description:
			'Explain status and progress, or open a focused task while preserving keyboard and focus behavior. PhoneSheet and WorkingStrip are the phone surfaces.',
		importPath: '@happyvertical/smrt-ui/feedback',
		components: [
			'Alert',
			'ToastViewport',
			'createToaster',
			'Progress',
			'ProgressBar',
			'Meter',
			'Spinner',
			'LoadingOverlay',
			'WorkingStrip',
			'Modal',
			'Drawer',
			'Sheet',
			'PhoneSheet',
			'ConfirmDialog'
		]
	},
	{
		title: 'Collections and tables',
		description:
			'Search, select, filter, page, and present typed collections with durable, serializable table view state.',
		importPath: '@happyvertical/smrt-ui/data',
		components: [
			'CollectionToolbar',
			'CollectionList',
			'ContentList',
			'DataTable',
			'SortableHeader',
			'ListSortSelect'
		]
	},
	{
		title: 'Charts',
		description:
			'One renderer for bar, line, pie, table, and stat charts over structural ChartData. The /charts/format entry is Svelte-free.',
		importPath: '@happyvertical/smrt-ui/charts',
		components: ['Chart', 'formatWidgetValue']
	},
	{
		title: 'Chat primitives',
		description:
			'Message, reaction, and typing primitives that smrt-chat composes; they import no chat runtime.',
		importPath: '@happyvertical/smrt-ui/chat',
		components: ['MessageBubble', 'ReactionPicker', 'TypingIndicator']
	},
	{
		title: 'Layout',
		description:
			'Compose the page around the working controls without tying the package to an application domain.',
		importPath: '@happyvertical/smrt-ui/layout',
		components: [
			'Container',
			'PageLayout',
			'Grid',
			'ActionGroup',
			'Header',
			'Footer',
			'Masthead',
			'PageHeader',
			'EmptyState',
			'SummaryCard'
		]
	},
	{
		title: 'Navigation',
		description: 'Switch between related views and show the active filter set.',
		importPath: '@happyvertical/smrt-ui',
		components: ['Tabs', 'FilterChips']
	},
	{
		title: 'Display and status',
		description: 'Render common values and compact status consistently.',
		importPath: '@happyvertical/smrt-ui',
		components: ['ConfidenceBadge', 'CurrencyDisplay', 'DateDisplay', 'Icon', 'StatusBadge']
	},
	{
		title: 'Calendar',
		description:
			'Time-zone-aware month and week grids with a phone agenda, over a Svelte-free date model. Calendar and DayView are deprecated.',
		importPath: '@happyvertical/smrt-ui/calendar',
		components: ['CalendarView', 'toEntries', 'layoutMonth', 'layoutWeek', 'dateKeyInZone']
	},
	{
		title: 'Membership and permission UI',
		description:
			'Domain-neutral views typed against shared membership, role, and permission contracts.',
		importPath: '@happyvertical/smrt-ui',
		components: [
			'MembershipCard',
			'MembershipList',
			'PermissionCheck',
			'PermissionPicker',
			'RoleBadge',
			'RoleSelector'
		]
	},
	{
		title: 'Module UI registry',
		description:
			'Register package-owned working surfaces without importing domain packages into the foundation.',
		importPath: '@happyvertical/smrt-ui/registry',
		components: ['createModuleUIRegistry', 'ModuleUIRegistry']
	},
	{
		title: 'Internationalization',
		description: 'Render translated text from the shared client message context.',
		importPath: '@happyvertical/smrt-ui/i18n',
		components: ['Trans']
	},
	{
		title: 'Themes',
		description: 'Apply the shared design tokens and light, dark, or system color preference.',
		importPath: '@happyvertical/smrt-ui/themes',
		components: ['ThemeProvider', 'ColorSchemeToggle', 'ThemeSwitcher']
	}
];

const usersComponentGroups: PackageComponentGroup[] = [
	{
		title: 'Account and directory UI',
		description: 'Render people, invite them, and give a signed-in person their own menu.',
		importPath: '@happyvertical/smrt-users/svelte',
		components: ['UserAvatar', 'UserCard', 'UserList', 'UserForm', 'UserMenu', 'InviteUserModal']
	},
	{
		title: 'Sessions and OIDC routes',
		description:
			'Mount sign-in, callback, and session handling as SvelteKit routes instead of writing the protocol by hand.',
		importPath: '@happyvertical/smrt-users/sveltekit',
		components: [
			'createSessionHandler',
			'createSessionCookie',
			'destroySessionCookie',
			'switchSessionTenant',
			'createOidcLoginHandler',
			'createOidcCallbackHandler',
			'getOidcClientRegistration',
			'beginOidcLogin',
			'completeOidcLogin'
		]
	},
	{
		title: 'Password and device PIN routes',
		description:
			'Mount email and password sign-in for an app without an identity provider, or a per-person PIN on an enrolled device.',
		importPath: '@happyvertical/smrt-users/sveltekit',
		components: ['createPasswordCredentialHandlers', 'createDeviceCredentialHandlers']
	},
	{
		title: 'Terminal device-code routes',
		description:
			'Let a command-line tool start a login, have a person approve it in the browser, and exchange it for a bearer session.',
		importPath: '@happyvertical/smrt-users/sveltekit',
		components: [
			'createTerminalAuthStartHandler',
			'createTerminalAuthTokenHandler',
			'createBearerSessionDeleteHandler',
			'mountTerminalLoginPage',
			'loadBearerSessionContext',
			'parseBearerToken'
		]
	},
	{
		title: 'Identity services',
		description: 'The transport-neutral services the route handlers are built from.',
		importPath: '@happyvertical/smrt-users',
		components: [
			'SessionService',
			'OidcLoginService',
			'TerminalAuthService',
			'PasswordCredentialService',
			'DeviceCredentialService',
			'LoginAttemptLimiter',
			'TenantService',
			'AccessRequestService',
			'MagicLinkService',
			'MobileAuthService'
		]
	},
	{
		title: 'Permissions and row-level security',
		description:
			'Build the permission catalog, resolve what a principal may do, and generate Postgres policies.',
		importPath: '@happyvertical/smrt-users',
		components: [
			'syncPermissionCatalog',
			'registerPermissionDefinitions',
			'PermissionResolver',
			'checkOperationPermission',
			'assertOperationPermission',
			'generatePostgresPermissionSql',
			'applyPostgresPermissionPolicies',
			'withSessionPermissionContext'
		]
	},
	{
		title: 'Discovery contract',
		description: 'Emit and validate the pinnable artifact a CLI or MCP consumer discovers.',
		importPath: '@happyvertical/smrt-users/app-contract',
		components: [
			'createDiscoveryConformanceArtifact',
			'validateDiscoveryConformanceArtifact',
			'canonicalizeDiscoveryArtifact',
			'deriveCommandRequirements'
		]
	}
];

const smrtSvelteComponentGroups: PackageComponentGroup[] = [
	{
		title: 'Application context',
		description:
			'Wrap the app once, then read session, permissions, mode, theme, and socket state from anywhere inside it.',
		importPath: '@happyvertical/smrt-svelte',
		components: [
			'Provider',
			'ModulePanel',
			'useAppState',
			'usePermissions',
			'useAuth',
			'useMode',
			'useTheme',
			'useSocket'
		]
	},
	{
		title: 'Rich form inputs',
		description:
			'Provider-backed inputs for the values applications actually collect, beyond the foundation controls. RelationInput moved to @happyvertical/smrt-ui/forms; the re-export here is deprecated.',
		importPath: '@happyvertical/smrt-svelte/forms',
		components: [
			'Form',
			'TextInput',
			'TextareaInput',
			'NumberInput',
			'MoneyInput',
			'MeasurementInput',
			'DateTimeInput',
			'DateRangeInput',
			'SelectInput',
			'CheckboxInput',
			'SearchInput',
			'PhoneInput',
			'AddressInput',
			'FileUpload',
			'FormMicButton'
		]
	},
	{
		title: 'Composed app shell',
		description:
			'One browser-only root that composes Provider, ThemeProvider, the theme CSS, AdminShell, and tenant navigation; the template root layout uses it.',
		importPath: '@happyvertical/smrt-svelte/app',
		components: [
			'AppShell',
			'OwnerSetupForm',
			'ShellSettingsPage',
			'ShellLayoutEditor',
			'RuntimeDiagnosticsWebMcp',
			'useShellLayout'
		]
	},
	{
		title: 'Application shell',
		description: 'The four-edge AdminShell family and its panels, activity surfaces, and hotkeys.',
		importPath: '@happyvertical/smrt-svelte/workspace',
		components: [
			'AdminShell',
			'TenantNav',
			'ActivityList',
			'ActivityItem',
			'ActivityBadge',
			'ActivityToasts',
			'AppScopePanel',
			'SystemScopePanel',
			'SystemStatusChips',
			'ShellSettingsPanel',
			'ShortcutsOverlay',
			'ShellCorner',
			'ShellDockTool',
			'HotkeyInput',
			'WorkspaceAccountMenu'
		]
	},
	{
		title: 'Shell state and manifest navigation',
		description:
			'Drive panel state, keyboard shortcuts, and persisted settings, and build tenant navigation from the manifest.',
		importPath: '@happyvertical/smrt-svelte/workspace',
		components: [
			'createShellState',
			'ShellState',
			'useAdminShell',
			'resolveShellConfig',
			'DEFAULT_SHELL_KEYMAP',
			'LocalStorageShellSettingsAdapter',
			'tenantNavFromManifest',
			'pluralizeClassName'
		]
	},
	{
		title: 'Command palette',
		description:
			'A trigger and dialog on one global shortcut, with navigation and manifest providers; mount it once as an AppShell slot item.',
		importPath: '@happyvertical/smrt-svelte/command-palette',
		components: [
			'CommandPalette',
			'createCommandPalette',
			'setCommandPalette',
			'useCommandPaletteProvider'
		]
	},
	{
		title: 'Recipe screens',
		description:
			'List, view, create, and edit screens derived from a generated web definition and the resolved field policy.',
		importPath: '@happyvertical/smrt-svelte/screens',
		components: ['RecipeScreens', 'ListScreen', 'DetailScreen', 'EditForm', 'deriveScreenFields']
	},
	{
		title: 'Overview surfaces',
		description:
			'A customizable widget grid joined to the shell layout edit mode, with a host-owned controller; the server load contract is on /overview/server.',
		importPath: '@happyvertical/smrt-svelte/overview',
		components: ['OverviewGrid', 'createOverview']
	},
	{
		title: 'Cookbook shell',
		description:
			'Build AppShell sections and recipe surfaces from a cookbook and the recipe catalog; loadCookbookApp on /cookbook/server reads and validates it.',
		importPath: '@happyvertical/smrt-svelte/cookbook',
		components: ['CookbookApp', 'CookbookSectionPage', 'buildCookbookShell']
	},
	{
		title: 'Import and export',
		description:
			'CSV and TSV import with column mapping, a validation preview, and an error report, plus column-selected export. Both follow the collection definitions and the resolved field policy.',
		importPath: '@happyvertical/smrt-svelte/import-export',
		components: ['ImportExport']
	},
	{
		title: 'Sortable',
		description:
			'Pointer, touch, keyboard, and screen-reader sorting of containers and items on the Board drag engine.',
		importPath: '@happyvertical/smrt-svelte/sortable',
		components: ['Sortable']
	},
	{
		title: 'Focus tools dock',
		description:
			'The first-generation dock, kept on its own opt-in subpath while applications migrate to AdminShell focus tools.',
		importPath: '@happyvertical/smrt-svelte/workspace/legacy',
		components: ['ToolsDock', 'defineToolsDock', 'useToolsDock', 'tryUseToolsDock']
	},
	{
		title: 'Browser AI components',
		description: 'Speech input, capability gating, and honest model download feedback.',
		importPath: '@happyvertical/smrt-svelte/browser-ai/svelte',
		components: ['VoiceInput', 'AILoadingOverlay', 'DownloadProgress', 'CapabilityGate', 'STTTest']
	},
	{
		title: 'Browser AI hooks and warm cache',
		description:
			'Call a local model from a component, and keep an initialized adapter across navigation.',
		importPath: '@happyvertical/smrt-svelte',
		components: [
			'useLLM',
			'useSTT',
			'useTTS',
			'getCachedLLM',
			'setCachedLLM',
			'clearAllCaches',
			'getCacheStats'
		]
	},
	{
		title: 'Browser AI adapters',
		description:
			'Framework-neutral capability detection and the adapters behind the hooks. Speech-to-text is browser-speech, whisper-cpp, whisper-local (alias whisper-wasm), or moonshine; the on-device models need the optional @happyvertical/speech peer.',
		importPath: '@happyvertical/smrt-svelte/browser-ai',
		components: [
			'detectCapabilities',
			'canEnableSmrtMode',
			'getBestLLMBackend',
			'getBestSTTBackend',
			'WebLLMAdapter',
			'BrowserSpeechSTTAdapter',
			'WhisperCppSTTAdapter',
			'WhisperLocalSTTAdapter',
			'WhisperWasmSTTAdapter',
			'createWhisperLocalModel',
			'createSttDictationSource',
			'BrowserSynthesisTTSAdapter',
			'RECOMMENDED_MODELS'
		]
	},
	{
		title: 'Live collections and feeds',
		description:
			'Svelte 5 bindings over the browser data runtime, plus an activity feed and an update-available signal.',
		importPath: '@happyvertical/smrt-svelte/web',
		components: ['liveCollection', 'activityFeed', 'useUpdateAvailable']
	},
	{
		title: 'Page agent tools',
		description:
			"Declare a component-owned browser tool, or bind a declared view intent to a mounted control or data view, for the component's lifetime.",
		importPath: '@happyvertical/smrt-svelte',
		components: ['useWebMcpTool', 'useViewIntent']
	},
	{
		title: 'Server-side helpers',
		description:
			'Build a translated message snapshot on the server so the first render is already in the right language.',
		importPath: '@happyvertical/smrt-svelte/i18n/server',
		components: ['buildI18nSnapshot']
	},
	{
		title: 'Settings catalog',
		description: 'A searchable, paginated settings index with a detail pane.',
		importPath: '@happyvertical/smrt-svelte/settings',
		components: ['SettingsCatalog', 'paginateSettingsCatalog']
	}
];

function definePackage(
	category: PackageCategory,
	slug: string,
	summary: string,
	options: PackageOptions = {}
): SmrtPackage {
	return {
		slug,
		name: `@happyvertical/${slug}`,
		category,
		kind: options.kind ?? 'models',
		summary,
		highlights: options.highlights ?? [],
		components: options.components ?? [],
		componentGroups: options.componentGroups ?? [],
		details: options.details ?? [],
		componentImport: options.componentImport,
		exampleResource: options.exampleResource,
		surfaceNote: options.surfaceNote,
		playgroundNote: options.playgroundNote,
		version: OWN_VERSION_LINES[slug] ?? SMRT_VERSION,
		status: options.status ?? 'stable',
		repository: options.repository,
		notice: options.notice
	};
}

export const packages: SmrtPackage[] = [
	definePackage(
		'Foundation',
		'smrt-core',
		'The object model, persistence layer, AI operations, manifests, and generated interfaces at the center of every s-m-r-t app.',
		{
			kind: 'runtime',
			status: 'foundation',
			highlights: [
				'Typed, column-backed list projections without object hydration',
				'Context memory and semantic search for durable learned patterns',
				'Change feeds, conditional reads, sync apply, REST, MCP, WebMCP, and CLI generation',
				'Recipes: declared user-facing units collected into the manifest, plus a cookbook document and engine',
				'A one-call smrt() Vite preset over the packages declared in smrt.config.ts'
			],
			details: [
				{
					title: 'Recipes and cookbooks',
					body: 'A SmrtRecipe is a named, user-facing unit smaller than a package, such as Sales or Customers. Its static id, label, models, nav, requires, and options are read structurally by the scanner into the manifest and knowledge recipes. The /cookbook entry validates and migrates a cookbook v1 document; /cookbook/engine runs typed cookbook commands with idempotent retries, atomic batches, and receipts.'
				},
				{
					title: 'One Vite plugin call for a SvelteKit app',
					body: 'smrt() from @happyvertical/smrt-core/vite applies the decorator config and composes smrtConsumer and smrtPlugin with the SvelteKit conventions. The consumed packages are the declared list under consumer.packages in smrt.config.ts; a missing or malformed list fails the build. smrtPlugin and smrtConsumer remain public for custom setups. Generated routes resolve collections through the runtime exported from $lib/server/smrt; a hand-written getCollection export is deprecated.'
				},
				{
					title: 'Move a model or close its surface without a subclass',
					body: 'A class that moves between packages declares its old qualified names in previousQualifiedNames, and lookups by the old name keep resolving. smrt db:migrate-qualified-names rewrites stored names on request. ObjectRegistry.registerOverride closes the generated API, MCP, or CLI surface of a package model, or makes its tenancy required, at startup. Only complete closures are supported; reopening throws. The browser entry builds and evaluates without Node-only modules.'
				}
			],
			exampleResource: 'products'
		}
	),
	definePackage(
		'Foundation',
		'smrt-config',
		'One configuration layer for s-m-r-t packages, runtime settings, safe exports, and secret-aware loading.',
		{ kind: 'runtime' }
	),
	definePackage(
		'Foundation',
		'smrt-types',
		'Shared cross-package TypeScript contracts and enums with almost no runtime weight.',
		{ kind: 'runtime' }
	),
	definePackage(
		'Foundation',
		'smrt-scanner',
		'Fast OXC-based source scanning that turns decorated classes into the s-m-r-t manifest.',
		{
			kind: 'tooling',
			highlights: [
				'Shared bounded source discovery for scanner and manifest preflight',
				'Mandatory dependency and hidden-directory pruning',
				'Symlink traversal disabled unless explicitly enabled'
			],
			details: [
				{
					title: 'Discovery stays inside the source tree',
					body: 'discoverSourceFiles applies one bounded policy to OxcScanner and the core manifest preflight. It always excludes node_modules and hidden paths, interprets patterns relative to cwd, and does not follow symbolic links by default. A project whose real source files live behind a symlink can opt in explicitly through the scanner or manifest builder.'
				}
			]
		}
	),
	definePackage(
		'Foundation',
		'smrt-tenancy',
		'Automatic tenant isolation, context propagation, required or optional scope, and tenant-aware query enforcement.',
		{
			highlights: [
				'Required, optional, and global data scopes',
				'AsyncLocalStorage context propagation',
				'Tenant-safe interceptors across lookups, hydration, search, and collection memory',
				'Super-admin bypass is a per-class opt-in, off by default'
			],
			details: [
				{
					title: 'Directory changes can notify other systems',
					body: 'The tenancy interceptor emits directory.<class>.created, updated, and deleted through dispatchBus after save or delete for configured directoryClasses. It is an event hook for directory projections, not a replacement for the request tenant context.'
				},
				{
					title: 'Adapters establish the context for their host',
					body: 'SvelteKit is one adapter. Express applications use createExpressMiddleware and enterTenantContext. CLI work uses createCliContext: run keeps a caller context, runWithTenant selects one tenant, runAsSystem is cross-tenant by explicit system authority, and runAsSuperAdmin is the more privileged explicit path.'
				},
				{
					title: 'Scope covers each read path',
					body: 'Tenant context applies to list and get calls, slug lookups, model hydration, vector search, and collection memory. Required models fail closed without a tenant context. A system context removes the context entirely and skips every check. withSuperAdminBypass keeps the tenant context and lifts enforcement only for classes that set allowSuperAdminBypass to true. The flag defaults to false, and unresolved config fails closed. auditTenantScopedRegistrations reports runtime-only registrations whose natural key omits the tenant column.'
				}
			],
			components: ['TenantCard', 'TenantSwitcher'],
			componentImport: '@happyvertical/smrt-tenancy/svelte',
			exampleResource: 'tenants'
		}
	),
	definePackage(
		'Foundation',
		'smrt-users',
		'Users, sessions, memberships, hierarchical tenants, roles, fine-grained permissions, access requests, and Postgres RLS.',
		{
			highlights: [
				'Manifest-derived operation permissions',
				'Opt-in role inheritance through tenant trees',
				'OIDC, email and password, device PIN, and terminal device-code sign-in on one session model',
				'One shared login attempt budget across every credential flow',
				'Reusable mobile auth/session handlers and access-request graduation'
			],
			componentGroups: usersComponentGroups,
			components: usersComponentGroups.flatMap((group) => group.components),
			details: [
				{
					title: 'Keep signup approval separate from login',
					body: 'AccessRequestService records a pre-User request for access. An approval flow can graduate that request into the user, membership, and tenant records it authorizes. MagicLinkService instead issues a single-use MagicLinkToken for email login; it is a login credential, not a waitlist approval.'
				},
				{
					title: 'Role inheritance is a separate opt-in',
					body: 'Tenant cascade and role inheritance answer different questions. A Role with inheritsToDescendants lets a membership resolve from the nearest flagged ancestor; a direct membership row still takes precedence and the result records inheritedFromTenantId. Seed or update roles with inheritsToDescendants deliberately—turning on tenant cascade alone does not enable this path.'
				},
				{
					title: 'OIDC login against your identity provider',
					body: 'Declare providers under packages.users.auth.oidc. Mount createOidcLoginHandler and createOidcCallbackHandler from the /sveltekit subpath. Each login creates an independent state, nonce, and PKCE verifier, and the challenge method is always S256. The callback checks state, the RFC 9207 authorization-response issuer, and provider errors. It also checks the JWKS-signed ID token and nonce before it reads claims. When the ID token omits email, the callback uses the UserInfo endpoint.',
					href: '/foundations/users-and-profiles',
					linkLabel: 'See the sign-in flows'
				},
				{
					title: 'First identity binding fails closed',
					body: 'A new issuer and subject can resolve to a canonical global Person that already has an owning User. Provisioning then stops with OidcProvisioningError code profile_owned. It does not create a new User, OIDC identity, or session. An application with an invitation or approval workflow can supply authorizeProfileOwner to authorize that first binding. A return value of undefined keeps the fail-closed default. A null value rejects the login.',
					href: '/foundations/users-and-profiles',
					linkLabel: 'See the sign-in flows'
				},
				{
					title: 'Terminal device-code sign-in',
					body: 'TerminalAuthService runs the device-code flow for command-line tools, and createRequest returns a device code, a short user code, and a verification URL. The CLI keeps the device code, and the person types the short user code. The service stores only a hash of the device code, and approval is idempotent. exchangeDeviceCode answers pending, expired, or approved. An approved answer includes a bearer token that resolves to the same session context as a browser cookie. Failed approvals have a per-user rate limit because user codes are short, and the handler reports the limit as 429.',
					href: '/foundations/users-and-profiles',
					linkLabel: 'See the sign-in flows'
				},
				{
					title: 'Password sign-in without an identity provider',
					body: 'PasswordCredentialService signs in existing, active users with an email and password; it never creates a user. The password lives in its own sensitive object with no generated REST, MCP, or CLI surface. Hashing is scrypt with a per-hash salt, and weaker hashes are upgraded on the next sign-in. Every refusal returns the same 401, so timing does not reveal whether an account exists. Mount the flow with createPasswordCredentialHandlers from the /sveltekit subpath.',
					href: '/foundations/users-and-profiles',
					linkLabel: 'See the sign-in flows'
				},
				{
					title: 'A PIN layered on an enrolled device',
					body: 'A shared tablet enrolled through the device-code grant holds a device-account bearer session. DeviceCredentialService lets a person sign in on that device with a short PIN. The result is a layered session with authMethod pin and a parentSessionId. The session is valid only while the device session is, never widens tenant scope, and signs out independently. Administering PINs needs users.pin.manage from a non-PIN session.',
					href: '/foundations/users-and-profiles',
					linkLabel: 'See the sign-in flows'
				},
				{
					title: 'One login budget for every credential',
					body: 'Terminal approval, device PIN, and password sign-in reserve an attempt through LoginAttemptLimiter before any credential work. The budget is stored in the database, so it holds across replicas, and its keys are hashed. A rate limit answers 429 with Retry-After. Generated CLI commands on the identity models are list and get only, or closed.'
				},
				{
					title: 'Sync the permission catalog after migration',
					body: 'syncPermissionCatalog merges three sources: manifest permissions, custom entries from smrt.config.ts, and definitions added at runtime. It reconciles them into Permission rows. The operation reports created, updated, and unchanged slugs. You can run it on every deploy. It is additive and never deletes a stale permission, grants a role, or emits row-level-security SQL.',
					href: '/reference/authorization',
					linkLabel: 'Authorization model'
				},
				{
					title: 'Row-level security is generated, not hand-written',
					body: 'generatePostgresPermissionSql inspects tenant-scoped models whose scope is required and returns the statements for them; applyPostgresPermissionPolicies executes those statements. Each table gets row-level security enabled and forced, plus one policy per action guarded by the shared smrt_rls_bypass, smrt_current_tenant_id, and smrt_has_permission functions. Models it cannot target safely are reported as skipped with a reason rather than silently omitted.',
					href: '/reference/authorization',
					linkLabel: 'Authorization model'
				},
				{
					title: 'A pinnable discovery contract',
					body: 'The /app-contract subpath carries the versioned discovery artifact that a CLI or MCP consumer can validate and pin. createDiscoveryConformanceArtifact emits deterministically ordered JSON with a SHA-256 integrity digest, and validateDiscoveryConformanceArtifact checks structure, ordering, and that digest in one call.',
					href: '/foundations/interfaces',
					linkLabel: 'Generated interfaces'
				}
			],
			componentImport: '@happyvertical/smrt-users/svelte',
			exampleResource: 'users'
		}
	),
	definePackage(
		'Foundation',
		'smrt-profiles',
		'People, organizations, identities, metadata, and reciprocal or directional relationships.',
		{
			highlights: [
				'Profiles remain separate from authentication records',
				'Reciprocal and directional relationship types',
				'Time-bounded relationship terms and contextual third parties',
				'Organization-to-organization links on the same Profile rows',
				'Ordered web links and a public-figure flag on the profile'
			],
			details: [
				{
					title: 'Attach identities without exposing credentials',
					body: 'Profiles can carry OIDC and Nostr identities, one-time magic-link records, and API keys. Nostr keypairs are encrypted; API-key material is SHA-256 hashed and shown only at creation. resolveIdentity and the createProfileFromOidc and createProfileFromNostr helpers keep canonical-person and email reservation checks in one place.'
				},
				{
					title: 'Keep extensible metadata and audit evidence controlled',
					body: 'ProfileMetafield supplies the validation schema for ProfileMetadata, whose collection supports add, get, batchGet, and batchUpdate. ProfileAsset is the owned-asset join. AuditLog is a sensitive model with no generated read routes. It records actor, action, reason, before and after changes, resource, source, and delegated identity. createAuditWriter, the consumer-authorized readAuditTrail, and the bounded pruneAuditTrail are its access paths; its super-admin bypass is an explicit policy choice.'
				},
				{
					title: 'Links and public figures',
					body: 'ProfileLink stores ordered web links with a platform, a validated http or https url, an optional label, and a sort order. Write them through replaceForProfile and reorder on the collection, or setLinks and getLinks on the profile; each is one transaction. Profile.isPublic records that a person is a public figure and nothing more; consumers decide visibility.'
				},
				{
					title: 'Relate two organizations',
					body: 'Organization is a Profile subtype, so an organization relates to another the way a person does. Create a supplier type with getOrCreateBySlug, then call addRelationship on the mill with the shop and the supplier slug. A directional type writes that one row. A reciprocal type with a handler also writes the inverse, and the shipped handlers are friend, spouse, partner, colleague, and sibling. Read the link from either side with getRelationships, date it with addTerm, and name a third profile as its context.',
					href: '/reference/profile-relationships',
					linkLabel: 'Profile relationships'
				},
				{
					title: 'A relationship is not a tenant link and not a permission',
					body: 'ProfileRelationship carries one tenantId, and the Tenant record in smrt-users has no profile field. A tenant-to-tenant partnership is something an application builds on top, for example one Organization profile per tenant. Permission resolution never reads a relationship, so relating two profiles changes nothing about access.',
					href: '/foundations/tenants',
					linkLabel: 'Decide where data belongs'
				}
			],
			exampleResource: 'profiles'
		}
	),
	definePackage(
		'Foundation',
		'smrt-languages',
		'Code-first language strings with application, config, and tenant overrides plus AI-assisted translation.',
		{ exampleResource: 'language-strings' }
	),
	definePackage(
		'Foundation',
		'smrt-prompts',
		'A typed prompt registry with editable, tenant-aware overrides and predictable resolution.',
		{ exampleResource: 'prompt-overrides' }
	),
	definePackage(
		'Foundation',
		'smrt-secrets',
		'Per-tenant secrets protected by envelope encryption, rotation, and audit trails.',
		{ exampleResource: 'secrets' }
	),
	definePackage(
		'Foundation',
		'smrt-features',
		'Code-first feature definitions with tenant-aware overrides and deterministic evaluation.',
		{ exampleResource: 'features' }
	),
	definePackage(
		'Foundation',
		'smrt-fields',
		'Layered field policy: per-field defaults, visibility tiers, labels, help, ordering, and organization locks resolved over the code seed at app, tenant, and user scope.',
		{
			status: 'new',
			highlights: [
				'Code seed, app, tenant, and user layers resolved into one policy per object',
				'Generated forms that render only the fields present in both the manifest definition and the resolved policy',
				'A form gear and an organization control panel behind two dedicated permissions'
			],
			components: [
				'FieldPolicyProvider',
				'PolicyField',
				'ModeSwitch',
				'AdvancedFields',
				'FormHelp',
				'ObjectForm',
				'ObjectFormSourceProvider',
				'FieldPolicyGearProvider',
				'FieldPolicyGearButton',
				'FieldPolicyEditor',
				'FieldPolicyControlPanel'
			],
			componentImport: '@happyvertical/smrt-fields/svelte',
			componentGroups: [
				{
					title: 'Policy-aware form primitives',
					description:
						'Wrap the inputs a hand-written form already has. Outside a provider PolicyField renders its children verbatim, so a form can adopt policy one field at a time.',
					importPath: '@happyvertical/smrt-fields/svelte',
					components: [
						'FieldPolicyProvider',
						'PolicyField',
						'ModeSwitch',
						'AdvancedFields',
						'FormHelp'
					]
				},
				{
					title: 'Generated object forms',
					description:
						'Build a create or edit form from generated browser field definitions and a resolved policy. Alternatively, register every generated collection once. Let each form request its object reference.',
					importPath: '@happyvertical/smrt-fields/svelte',
					components: ['ObjectForm', 'ObjectFormSourceProvider']
				},
				{
					title: 'Policy administration',
					description:
						'The per-form gear for organization and personal overrides, and the tenant-wide control panel that replays the resolved layers.',
					importPath: '@happyvertical/smrt-fields/svelte',
					components: [
						'FieldPolicyGearProvider',
						'FieldPolicyGearButton',
						'FieldPolicyEditor',
						'FieldPolicyControlPanel'
					]
				}
			],
			details: [
				{
					title: 'How resolution works',
					body: 'Four layers merge low to high: the code seed from @field({ ui }), app rows, the tenant chain, then the signed-in user. A column left empty inherits from the layer below and resetting a customization deletes the row.',
					href: '/capabilities/field-policies',
					linkLabel: 'Read the field policy guide'
				},
				{
					title: 'Building forms',
					body: 'PolicyField adopts an existing form incrementally; ObjectForm renders the fields present in both the generated definitions and the resolved policy.',
					href: '/capabilities/policy-aware-forms',
					linkLabel: 'Build a policy-aware form'
				},
				{
					title: 'Running it in production',
					body: 'The form gear, the organization control panel, the two permissions, and the difference between a personal preference and an organization rule.',
					href: '/capabilities/field-policy-operations',
					linkLabel: 'Operate field policies'
				},
				{
					title: 'API and semantics',
					body: 'Exported functions and types, the canonical object reference format, the default-value wire contract, write validation, and caching.',
					href: '/reference/field-policies',
					linkLabel: 'Field policy API'
				},
				{
					title: 'A recipe for form customization',
					body: 'The package declares the fields.form-customization recipe, emitted into the manifest and knowledge recipes with its own user-facing help. It declares a server runtime.'
				}
			],
			surfaceNote:
				'Policy rows are not a browsable resource, and FieldPolicy generates create, update, and delete routes. It also generates the resolve, editor-state, and policy-audit collection actions. Generated list and get remain closed because the model is not tenant-scoped. Unrestricted reads would enumerate every tenant and user row. The generated CLI mirrors that shape and is writes-only. MCP is closed entirely.'
		}
	),

	definePackage(
		'Agents & runtime',
		'smrt-agents',
		'Autonomous actors with scheduling, interests, dispatch, durable learning, principal execution, and safe agent-to-agent delegation.',
		{
			status: 'new',
			highlights: [
				'Recall-before and capture-after learning loops',
				'Multi-instance agents backed by durable personas',
				'Agent availability inherited down the tenant tree',
				'Principal-bounded worker orchestration with a maximum delegation depth'
			],
			components: [
				'AgentDashboard',
				'AgentScheduleList',
				'AgentScheduleForm',
				'AgentRunHistory',
				'AgentAdminPanel',
				'AgentAdminTabs',
				'AgentSettingsShell',
				'AgentSettingsForm',
				'ScheduleStatusBadge'
			],
			details: [
				{
					title: 'Dispatch and discovery are explicit contracts',
					body: 'DispatchBus emits and handles inter-agent messages, with matching dispatch CLI commands. An interest declared with interesting() discovers qualifying objects through its filter instead of relying on an unbounded scan.'
				},
				{
					title: 'Run tools as a bounded principal',
					body: 'executeAsPrincipal creates a PrincipalRun and checks assertToolAllowed and assertOperation before work proceeds. This is agent execution authority, distinct from smrt-users assertOperationPermission. A data surface can expose data.discover, data.inspect, and data.query through createDataSurfaceTools; report surfaces separately expose reports.query, refresh, drilldown, and export.'
				},
				{
					title: 'The host owns the process, not the agent',
					body: 'Signal handling is optional. An agent with manageProcessSignals set to true installs SIGTERM and SIGINT handlers. These handlers shut down and exit. The default false value registers nothing, which is suitable for a server or job runner. Do not enable this option for multiple agents unless the host coordinates shutdown. The first handler to finish exits the process.'
				},
				{
					title: 'Resolve tenant agents, do not list them',
					body: 'TenantAgent rows are explicit bindings between a tenant and an agent class. Call resolveForTenant on TenantAgentCollection to find what a tenant can run. Supply the tenant id and a function that returns ancestor ids. The resolver merges manifest permission defaults under explicit overrides and walks the tenant tree for inherited agents. Each result identifies its explicit or inherited source tenant. A plain list returns only explicit rows, without inheritance, merged permissions, or provenance.',
					href: '/foundations/tenants',
					linkLabel: 'How tenants nest'
				},
				{
					title: 'Delegation cannot widen authority',
					body: 'A worker invocation carries a delegation envelope with the acting user, tenant, allowed tools, correlation id, and depth. Depth is capped at three, and a requested principal that broadens the parent user, tenant, or on-behalf-of subject is rejected. Tool access is fail-closed: an execution whose allowed-tool list is missing or empty permits no tools at all.',
					href: '/capabilities/learning-agents',
					linkLabel: 'Learning and delegation'
				},
				{
					title: 'Scheduling is declared here and run elsewhere',
					body: 'AgentSchedule records the cron expression, next and last run, concurrency ceiling, timeout, target method, and success and failure counts. The runner that starts these schedules is in smrt-jobs. Thus, an application selects its execution host instead of receiving a background worker with the agent model.',
					href: '/reference/packages/smrt-jobs',
					linkLabel: 'smrt-jobs'
				},
				{
					title: 'Agents can offer create entries',
					body: 'An agent class declares a literal static createEntries array, and the scanner captures it into the serialized agent. resolveAgentCreateEntries filters those entries by base path, access level, and capabilities, so a shell can offer them as create options.'
				},
				{
					title: 'Two Svelte entry points',
					body: 'The svelte subpath registers the schedule components with the shared module UI registry when it is imported. When a page only renders the admin shells, import from svelte/admin instead: it exposes the same admin components with no registration side effect.'
				}
			],
			componentImport: '@happyvertical/smrt-agents/svelte',
			exampleResource: 'agents'
		}
	),
	definePackage(
		'Agents & runtime',
		'smrt-personas',
		'Tenant-owned agent personalities that scope instructions, tools, identity, memory, feedback, and human-approved adaptation.',
		{
			status: 'new',
			highlights: [
				'Context-aware persona resolution',
				'Independent memory and schedules per durable agent instance',
				'Feedback-driven directive proposals with a human approval gate'
			],
			components: ['DirectiveReviewQueue'],
			details: [
				{
					title: 'Resolution walks the context hierarchy',
					body: 'PersonaResolver.resolve selects an exact context before a type-scoped or tenant-wide persona, then uses priority and name for a stable tie-break. It walks ancestors and intersects the persona ceiling with TenantAgent, so a closer or broader record cannot silently widen the agent tool ceiling.'
				},
				{
					title: 'Learning signals propose; people approve',
					body: 'Feedback accepts accept, reject, correction, rating, outcome, and metric signals and deduplicates them by fingerprint. reinforceFromFeedback can strengthen memory, while ReflectionRunner creates a DirectiveProposal. DirectiveApprovalService remains permission-gated. Durable instances use personaInstanceKey, agentOptionsForPersona, and schedulePersonaInstance; upgradeSingletonToDefaultPersona preserves an existing singleton path.'
				}
			],
			componentImport: '@happyvertical/smrt-personas/svelte',
			exampleResource: 'agent-personas'
		}
	),
	definePackage(
		'Agents & runtime',
		'smrt-jobs',
		'Persistent background work, schedules, retries, runners, queue controls, and operational visibility.',
		{
			highlights: [
				'An opt-in allowlist for the methods a job row may call',
				'A per-tenant ceiling on in-flight jobs',
				'Retry counts clamped rather than trusted',
				'Automatic retention for terminal jobs and job events'
			],
			components: [
				'JobDashboard',
				'JobList',
				'JobDetail',
				'JobStats',
				'JobStatusBadge',
				'JobActions'
			],
			details: [
				{
					title: 'Build a job before you enqueue it',
					body: 'The fluent builder composes delay(), priority(), retries(), queue(), and timeout() before enqueue(); bg() is the short form for background work. Delivery is at least once. timeoutBehavior chooses fail, warn, or kill, so idempotency belongs in the job method.'
				},
				{
					title: 'Schedules use local wall-clock time',
					body: 'ScheduleRunner fires forward once: cron matching uses local time, is not timezone-aware, and does not backfill missed runs. Worker liveness uses a process-global live set, an off-loop ticker, and lease recovery. ForgeDeliveryCollection and ForgeProjectionRuntime provide durable projections and dead-letter replay.'
				},
				{
					title: 'Say which methods a job may call',
					body: 'A persisted job row names an object type and a method, so the runner must know which methods are reachable. Mark a method with the backgroundEligible decorator. For non-decorator code, call markBackgroundEligible. These operations add an allowlist to the class. A class that marks nothing keeps the default behavior. After one method is marked, the runner refuses every method outside the list.'
				},
				{
					title: 'One tenant cannot drain the queue',
					body: 'Enqueueing counts the non-terminal jobs for a tenant and refuses another job above the limit. The default limit is ten thousand, and each call or job builder can change it. A value of zero disables the check. Jobs without a tenant do not count against the limit. Requested retry counts are clamped to the supported maximum. Thus, a misconfigured caller cannot pin a worker on a poison job.'
				},
				{
					title: 'Terminal outcomes commit with their event',
					body: 'Completion, permanent failure, timeout, stale-worker recovery, and cancel update the job row and append its versioned event in one transaction. If either write fails, neither commits. listTerminalOutcomes on the event collection requires an explicit tenant, reads newest first, and returns only the safe terminal shape without arguments, results, or raw errors.'
				},
				{
					title: 'Retention starts after the runner is stable',
					body: 'TaskRunner schedules its first retention sweep one interval after start, never at startup. The default policy keeps completed or canceled jobs for seven days. It keeps failed jobs and events for thirty days. Dry-run cleanup is available before a deletion policy changes.'
				}
			],
			componentImport: '@happyvertical/smrt-jobs/svelte',
			exampleResource: 'jobs'
		}
	),
	definePackage(
		'Agents & runtime',
		'smrt-chat',
		'Rooms, direct messages, threads, persona-bound conversations, tool loops, the AssistantDock, helper preferences, and voice gateway turns.',
		{
			status: 'new',
			highlights: [
				'AssistantDock with its own mounted SvelteKit routes',
				'Assistant turns that suspend for browser tools and resume with their results',
				'Runtime report, overview, and data-surface tools for the persona extraTools seam',
				'Two recipes: chat.assistant places the dock in the shell header; chat.rooms brings the room models'
			],
			components: [
				'ChatLayout',
				'MessageList',
				'MessageInput',
				'AgentChat',
				'AgentSessionPanel',
				'ToolCallDisplay',
				'MiniChat',
				'AssistantDock',
				'AssistantThreadList',
				'FloatingAssistant',
				'HelperControlPanel',
				'ChatTabs'
			],
			componentImport: '@happyvertical/smrt-chat/svelte',
			details: [
				{
					title: 'Chat is a closed service facade',
					body: 'ChatService keeps its collections and agent-reply bridge private, so callers use the supported conversation operations instead of bypassing membership or lifecycle checks. All seven models expose only generated list and get. allowedTools is fail-closed: an absent or empty allowlist grants no agent tool access. The agent authors as its resolved bot Profile, recorded on the session as agentProfileId, never as the agentId slug.'
				},
				{
					title: 'The tool loop and streams have bounded entry points',
					body: 'runToolLoop and runPersonaConversationTurn use the manifest tool catalog with DEFAULT_MAX_STEPS. Non-manifest extraTools pass the same allow-list; createDataSurfaceTools supplies principal-bound discovery and reads. runChatConversationStream and createChatStreamHandler provide token SSE through SmrtChatBackend. Voice sessions use createVoiceChatSession and handleVoiceGatewayTurn; validate their tenant, actor, persona, and conversation binding because a gateway bearer token is not user authentication. captureChatFeedback records thumbs and can feed learning reinforcement.'
				},
				{
					title: 'The AssistantDock and its routes',
					body: 'AssistantDock reads the mounted descriptors of a host data-surface registry; with none it is plain chat. mountAssistantRoutes from the /sveltekit subpath serves the dock from one catch-all route. The principal comes from event.locals, and threads only from the actor keyed session room. runAssistantTurn runs one turn over the tool loop with server tools and declared browser tools. A browser tool call suspends the turn; the browser resumes it with results, which reach the model marked untrusted. Destructive browser calls always wait for the person.'
				},
				{
					title: 'Report and overview tools for the assistant',
					body: 'createRuntimeReportTools returns reports.runtime.sources, define, list, and run for the persona extraTools seam. The model supplies only a declarative RuntimeReportSpec from smrt-reports, and sources are a server-owned allow-list. A report is saved only after a person confirms the exact spec; without a confirmation host, apply returns an awaiting_confirmation proposal and stores nothing. createOverviewTools returns overviews.describe, apply, and undo over a host-opened overview page.'
				},
				{
					title: 'Helper preferences are presentation policy',
					body: 'HelperPreferencesService on the package root loads, saves, and resets a per-profile helper choice under a host-supplied authorize and policy. It is never an identity, persona, or tool authority. Browser code imports the DTO, parser, and field list from the /helper-preferences subpath, which ships no server adapter. HelperControlPanel keeps a local draft apart from the applied snapshot, and FloatingAssistant accepts the saved bottom-corner placement.'
				}
			],
			exampleResource: 'messages'
		}
	),
	definePackage(
		'Agents & runtime',
		'smrt-app-mcp',
		'App-runtime MCP server scaffolding and transport adapters for exposing a s-m-r-t application over HTTP.',
		{
			kind: 'runtime',
			highlights: [
				'One stateless Streamable HTTP mount, with a fresh protocol server per request',
				'Principal-aware per-tool policy evaluated on discovery and on the call',
				'Tool-list cache metadata that stays private unless a public catalog is verified'
			],
			details: [
				{
					title: 'Mount the application surface',
					body: 'createMcpAppServer wraps generated core tools with an application allow-list, public tool patterns, a per-principal tool policy, and workflow assertions. mountMcpRoute serves server/discover, tools/list, and tools/call from the sveltekit subpath; the REST-shaped mountMcpToolsRoute and mountMcpCallRoute aliases are deprecated for one release.',
					href: '/tooling/app-mcp',
					linkLabel: 'Generated and application MCP'
				},
				{
					title: 'Authorization is terminated in front of it',
					body: 'The package trusts the principal supplied by the application adapter. It does not implement an OAuth authorization server or validate bearer tokens. A public deployment validates the token at the gateway. The deployment supplies the request principal, tenant, and permissions only after successful validation.',
					href: '/tooling/compatibility',
					linkLabel: 'Compatibility and operations'
				}
			]
		}
	),
	definePackage(
		'Agents & runtime',
		'smrt-dev-mcp',
		'Development-time knowledge, review, architecture, introspection, and code-generation tools for AI coding agents.',
		{
			kind: 'tooling',
			highlights: [
				'Twenty-one read-only tools over a workspace, with no access to application data',
				'A declared ok, coverage, diagnostics, and data result envelope on every tool',
				'Ships as a self-contained Agent Plugin with one bundled review skill'
			],
			details: [
				{
					title: 'The Development MCP server',
					body: 'The server reads source, manifests, and authored documentation from a workspace on disk. It never writes files, never executes generated code, and calls no model provider: review and architecture tools return deterministic findings plus a reusable prompt bundle.',
					href: '/tooling/dev-mcp',
					linkLabel: 'smrt-dev-mcp'
				},
				{
					title: "Runtime tools use the project's own core",
					body: 'The standalone installation ships static tooling and the scanner, not smrt-core, SQL drivers, AI, or filesystem providers. Code generation, knowledge and context tools, agent skills, and introspection of a built manifest work without a runtime. Source-scan enrichment and the runtime tools resolve @happyvertical/smrt-core from the selected project; install its dependencies first.',
					href: '/tooling/dev-mcp',
					linkLabel: 'smrt-dev-mcp'
				},
				{
					title: 'Coverage instead of a silent empty answer',
					body: 'Package discovery reads the workspace globs and records the source of each package object. An empty result produces an error-grade diagnostic that names the checked roots and artifact paths. Thus, an unreadable project is not reported as a project without a model.',
					href: '/tooling/knowledge',
					linkLabel: 'Knowledge tooling'
				}
			]
		}
	),

	definePackage(
		'Web & UI',
		'smrt-ui',
		'Provider-free Svelte 5 components for accessible forms, agent-assisted controls, feedback, collections, charts, overlays, layouts, and themes.',
		{
			kind: 'ui',
			status: 'new',
			highlights: [
				'One component contract for semantics, keyboard use, state, themes, and testing',
				'Forms that chat, voice, tutorials, and tests can address through a consent-aware registry',
				'Reusable collection, table, chart, feedback, disclosure, and overlay patterns with stable row identity',
				'Package-owned working examples in the shared playground'
			],
			componentGroups: smrtUiComponentGroups,
			components: smrtUiComponentGroups.flatMap((group) => group.components),
			details: [
				{
					title: 'The leaf of the Svelte stack',
					body: 'The package depends only on svelte and smrt-types, so domain packages take its primitives without depending on smrt-svelte. It owns the visual primitives and the Provider-free form controls. smrt-svelte owns the Provider-backed rich Form and the specialized inputs, and re-exports the base inputs from here. Identity views such as RoleBadge and MembershipList live here because they import no domain package.'
				},
				{
					title: 'Use canonical tokens and aliases intentionally',
					body: 'Five presets ship: material, glass, studio, smrt, and happyvertical. Themes use Material 3 names as canonical tokens and retain additive aliases for migration: spacing and radius aliases such as extra-small and sm, plus motion aliases from short1 through long4. Aliases preserve older consumers; new design work should name the canonical semantic token.'
				},
				{
					title: 'A shared component standard',
					body: 'Foundation controls use native semantics, stable server-safe IDs, and Svelte 5 bindable state. They have visible focus and validation states, reduced-motion rules, semantic design tokens, and focused accessibility tests. Every exported component root carries data-smrt-component, and internal parts carry data-smrt-part; both are public styling hooks.'
				},
				{
					title: 'Forms agents can assist with',
					body: 'Controls can publish their identity, meaning, options, constraints, sensitivity, and current state. An adapter may point to a field or propose a change, while the form keeps consent and secret handling explicit.',
					href: '/capabilities/agent-assisted-forms',
					linkLabel: 'Learn how agent-assisted forms work'
				},
				{
					title: 'Reusable collection surfaces',
					body: 'CollectionToolbar, CollectionList, and DataTable cover search, selection, list or grid presentation, filtering, pagination, expansion, density, and empty or loading states. DataTable keeps a stable row key through local transforms and renders footer rows and column summaries. It exposes serializable controller state when the application owns filtering, sorting, or paging.'
				},
				{
					title: 'Charts without a report dependency',
					body: 'Chart from /charts renders bar, line, pie, table, and stat from a structural ChartData value. A report or widget package hands it rows instead of importing a charting library. smrt-reports draws its runtime report results with it. /charts/format holds the minor-unit number formatting and loads in plain Node.'
				},
				{
					title: 'Feedback and focused tasks',
					body: 'Alerts, toasts, progress, meters, drawers, popovers, disclosure, and accordions share the same status, focus, keyboard, motion, and theme conventions as the form controls.'
				},
				{
					title: 'Phone surfaces and capture',
					body: 'PhoneSheet replaces drawers and centered modals on a phone, as a full page or a sheet that closes on a swipe. WorkingStrip shows a transport-neutral working status with pause, review, stop, and close controls. FormActionBar groups form actions and fixes them to the bottom on phones. CameraCapture and SignaturePad post their result with the native form.'
				},
				{
					title: 'One calendar entry point',
					body: 'CalendarView renders month and week grids in a named time zone and a phone agenda. Its date model is Svelte-free, so a route can compute day keys on the server. Calendar and DayView remain as deprecated exports; they computed days in host-local time.'
				},
				{
					title: 'Focused public imports',
					body: 'Import from /forms, /ui, /feedback, /data, /layout, /calendar, /charts, /chat, /i18n, /registry, and /themes. Each import then identifies the applicable foundation part. The Svelte-free /form-retry, /data-surface, /charts/format, and /themes/presets entries are safe in plain Node. Server adapters take their protocol limits from /data-surface, not from the /data component barrel. The package root remains a compatibility barrel.'
				}
			],
			componentImport: '@happyvertical/smrt-ui/forms'
		}
	),
	definePackage(
		'Web & UI',
		'smrt-svelte',
		'The top-of-stack Svelte integration: AppShell, Provider, rich forms, recipe screens, browser AI, live collections, and permissions.',
		{
			kind: 'ui',
			status: 'new',
			highlights: [
				'AppShell composes Provider, ThemeProvider, and the four-edge AdminShell with tenant navigation',
				'Recipe screens, a command palette, overview grids, and CSV import and export on their own subpaths',
				'Tenant navigation built from the manifest, not hand-written',
				'SvelteKit server-to-client collection and message hydration',
				'Live-query bindings and browser AI adapters with a warm cache'
			],
			componentGroups: smrtSvelteComponentGroups,
			components: smrtSvelteComponentGroups.flatMap((group) => group.components),
			details: [
				{
					title: 'The UI and Svelte layers share i18n deliberately',
					body: 'smrt-ui owns defineMessages, useI18n, Trans, and template rendering in the browser. smrt-svelte builds the server snapshot with buildI18nSnapshot and passes it through Provider. Put canonical themes under src/themes; src/theme is a legacy alias during migration.'
				},
				{
					title: 'Gate dock tools and page actions at the boundary',
					body: 'ToolDef.gates and composeDockAvailability decide whether an AdminShell dock tool is available before it is shown or invoked. The use:permission action makes the same permission decision in a component; applications can choose hide-only behavior without treating visibility as authorization. The web subpath also adapts live activity feeds and exposes updateAvailable.'
				},
				{
					title: 'Navigation the manifest already describes',
					body: 'tenantNavFromManifest turns a manifest into ordered navigation sections. It drops collections, internal and test classes, and items without a REST list route. It also drops single-table-inheritance subtypes that share a parent collection because the polymorphic endpoint already includes them. Pass permittedResources to filter the resources that a role can see. The filter checks the inheritance chain, so a permitted subtype keeps its applicable base link. Sorted output prevents manifest changes from reordering the sidebar.',
					href: '/capabilities/application-shell',
					linkLabel: 'How the shell is composed'
				},
				{
					title: 'AppShell is the composed entry',
					body: 'AppShell on the /app subpath wraps Provider, ThemeProvider, the theme CSS, AdminShell, and TenantNav built from the nav you pass. It is browser-only and lives beside /workspace, so the AdminShell barrel stays free of Provider. A dock snippet receives the data-surface registry, so a host places its assistant there without this package importing smrt-chat. Pass layout and onlayoutchange to own shell layout persistence, or neither to store it in user settings.',
					href: '/capabilities/application-shell',
					linkLabel: 'How the shell is composed'
				},
				{
					title: 'Screens derived from recipes',
					body: 'RecipeScreens, ListScreen, DetailScreen, and EditForm on the /screens subpath derive their views from a generated web definition and the resolved field policy. The /cookbook subpath builds AppShell sections and recipe surfaces from a cookbook document. CommandPalette mounts once as a shell slot item and owns the global shortcut. OverviewGrid joins the shell layout edit mode; ImportExport maps CSV columns against collection definitions.'
				},
				{
					title: 'AdminShell replaced the first-generation shells',
					body: 'The public workspace surface is the four-edge AdminShell contract. The earlier WorkspaceShell and RoleShell primitives remain only as migration references. No subpath exports them. Compose new work with AdminShell panels and focus tools. The earlier focus-tool dock stays available on the workspace/legacy subpath during application migration.',
					href: '/capabilities/application-shell',
					linkLabel: 'How the shell is composed'
				},
				{
					title: 'Browser AI preloads on a strategy you choose',
					body: 'Provider accepts a preload strategy of none, eager, idle, or on-visible. The default idle strategy schedules work in an idle callback. eager starts immediately, and none defers each adapter until first use. on-visible is manual: the package schedules nothing, and the application starts the preload. Adapters warm sequentially, and one failure does not stop the remaining adapters. A module-level cache keeps each initialized adapter, so navigation does not download a model again.'
				},
				{
					title: 'Calling a local model from a component',
					body: 'useLLM runs inside the Provider and exposes initialize, chat, and unload alongside reactive isReady, isGenerating, currentModel, error, and downloadProgress values. Streaming is delivered through an onToken callback while chat still resolves to the finished string. Unmounting deliberately does not unload the model, because the download is the expensive part.'
				},
				{
					title: 'One language snapshot per render',
					body: 'buildI18nSnapshot resolves server message templates for a locale, including tenant overrides. Provider accepts the result. The browser interpolates variables. A missing key uses the registered English default and then the key itself. Thus, a partly translated application still renders. The matching useI18n store and Trans component are in the UI foundation.',
					href: '/reference/packages/smrt-ui',
					linkLabel: 'smrt-ui'
				}
			],
			componentImport: '@happyvertical/smrt-svelte'
		}
	),
	definePackage(
		'Web & UI',
		'smrt-web',
		'A manifest-generated browser data runtime with typed collections, persistence, live updates, and offline mutation replay.',
		{
			kind: 'runtime',
			status: 'new',
			highlights: [
				'SvelteKit hydration seeding',
				'SSE live updates with polling fallback',
				'Durable IndexedDB outbox and version-aware persistence',
				'WebMCP tools',
				'Policy-governed bespoke tools and a dependency-free view-intent entry',
				'A page-side registry of the WebMCP tools the page itself registered'
			],
			details: [
				{
					title: 'The page can see its own tools',
					body: 'installWebMcpPageToolRegistry on the /webmcp-page-tools subpath records every registered tool while forwarding to the native context. An in-page assistant can then list and run the same tools an outside agent sees. The entry is dependency-free. Collection fetches accept a plain array, a list envelope with an items property, or a data envelope.'
				},
				{
					title: 'Offline writes and read persistence solve different problems',
					body: 'OfflineOutboxConfig keeps a durable IndexedDB write queue, with Web Locks leader election, exponential backoff, sync-apply-only replay, and onConflict and onSyncStateChange callbacks. persistCollection is the separate read cache: it rehydrates through SQLite-WASM or OPFS, writes back, and invalidates when the manifest hash changes.'
				}
			]
		}
	),
	definePackage(
		'Web & UI',
		'smrt-playground',
		'Shared package playground discovery, preview metadata, runtime hosting, and dev workbench components.',
		{
			kind: 'ui',
			highlights: [
				'One searchable catalog with the UI foundation first and packages grouped below it',
				'Package-owned, lazy-loaded examples instead of a central copy of every demo',
				'Clearly labeled mock and live modes with package overview pages'
			],
			components: ['PlaygroundHost'],
			componentImport: '@happyvertical/smrt-playground/svelte',
			details: [
				{
					title: 'Each package owns its preview module',
					body: 'A package publishes ./playground as a SmrtPlaygroundModule with packageName, entries, and load. The host discovers metadata and lazy-loads the selected entry, so a package can evolve its own demonstration without copying it into a central catalog. Use smrt playground init, list, and dev to scaffold, inspect, and run that contract.'
				}
			]
		}
	),
	definePackage(
		'Web & UI',
		'smrt-app-cli',
		'A reusable branded CLI factory for s-m-r-t apps with decorator-driven resources and a stdio MCP bridge.',
		{ kind: 'tooling' }
	),
	definePackage(
		'Web & UI',
		'smrt-cli',
		'The framework developer CLI for manifests, database migrations, application operations, cookbooks, introspection, and generated resources.',
		{
			kind: 'tooling',
			details: [
				{
					title: 'Operate production schema changes deliberately',
					body: 'db:migrate --postgres-safe orders dependencies, uses concurrent-index mode, applies lock and statement timeouts, and probes orphan foreign keys. doctor --db and db:status --parity compare the live schema. db:rollback executes only a reconstructible down migration or refuses; --mark-only changes migration bookkeeping without changing schema. db:prune supports dry-run and skip controls for retention work. SQLite type changes rebuild the table. db:migrate-qualified-names rewrites stored deprecated qualified names on request, and --empty-text-as-null converts empty text to NULL during a column change.'
				},
				{
					title: 'Which database a db command uses',
					body: 'Every db command resolves its database once, at startup. An explicit packages.cli.database.url from any config layer wins, so a stray shell DATABASE_URL never retargets it. DATABASE_URL comes next, with the engine from the config, DATABASE_TYPE, or the URL scheme. With neither, the command runs against an in-memory database.'
				},
				{
					title: 'Operate the application with smrt app',
					body: 'smrt app install, setup, start, stop, recover, doctor, open, backup, export, import, migrate, worker, dev, and build are the operations. They replace the copied operator scripts a template used to ship. Each generated package.json script is one of these one-liners. Local operations run under one operation lock, and start proves readiness against the loopback health route before it reports success.'
				},
				{
					title: 'Cookbooks and the kitchen',
					body: 'smrt cookbook validate checks a cookbook file or URL against the v1 schema and the recipe manifests. smrt cookbook apply creates a project from it and the start template. smrt kitchen serves the planner on localhost, where a person chats a cookbook into shape and sends it to a directory. smrt kitchen apply does the same from a plan URL.'
				}
			]
		}
	),
	definePackage(
		'Web & UI',
		'smrt-vitest',
		'Vitest integration for manifest generation, package discovery, isolated databases, and Svelte setup.',
		{ kind: 'tooling' }
	),
	definePackage(
		'Web & UI',
		'smrt-template-sveltekit',
		'The recommended SvelteKit application scaffold: AppShell as the root layout, a server runtime built once, and smrt app one-liners for every lifecycle script.',
		{
			kind: 'tooling',
			details: [
				{
					title: 'The shell and the server runtime',
					body: 'The root layout renders AppShell from @happyvertical/smrt-svelte/app with the generated read-only WebMCP definitions and a hand-written nav. The server side is createSmrtSvelteKitRuntime from @happyvertical/smrt-app-runtime/sveltekit, built once in src/lib/server/smrt.ts. That module exports only runtime, and generated routes resolve collections through runtime.getCollection. A legacy getCollection or getSmrtConfig export is deprecated and honored for one release.'
				},
				{
					title: 'Lifecycle scripts are CLI commands',
					body: 'Every package.json script is a smrt app one-liner, and the template ships no scripts directory. db:migrate builds first and then runs smrt app migrate under the operation lock. The production baseline is adapter-node with separate web, task-worker, and schedule-worker processes. Workers import the build-compiled registration before creating runners.'
				}
			]
		}
	),
	definePackage(
		'Web & UI',
		'smrt-template-site-static-json',
		'A static community-site scaffold with JSON data storage and package-owned UI conventions.',
		{ kind: 'tooling' }
	),

	definePackage(
		'Content & media',
		'smrt-content',
		'Documents, articles, publication state, governed editing, contributions, references, and transparent review workflows.',
		{
			components: [
				'ArticleCard',
				'ArticleList',
				'ContentEditor',
				'GovernedContentEditor',
				'ContentReferencesPanel',
				'ContentContributionPortal',
				'Markdown'
			],
			componentImport: '@happyvertical/smrt-content/svelte',
			details: [
				{
					title: 'Editorial governance makes stale review visible',
					body: 'Policies, profiles, and assignments resolve through resolveGovernance. runReviewAction checks its review fingerprint before it can move a piece through the publish-readiness gate. Contributions progress from submitted to approved, rejected, or withdrawn, then promoted, with trust level, revisions, and attachments retained.'
				},
				{
					title: 'Published work keeps its correction history',
					body: 'issueCorrectionAction and ContentVersion preserve freeze-on-publish semantics. Published transparency differs from preview transparency. References may pin targetVersion and getReferenceDrift detects when a target moves. ContentFeedSource can parse and sync RSS or Atom feeds; thumbnails can be headline cards, static maps, or AI-generated, and ContentAgentChat scopes editor sessions to tenant and content.'
				}
			],
			exampleResource: 'articles'
		}
	),
	definePackage(
		'Content & media',
		'smrt-assets',
		'Provider-neutral asset storage, metadata, versions, associations, and AI-assisted operations.',
		{
			components: [
				'AssetManager',
				'AssetGrid',
				'AssetList',
				'AssetDetail',
				'AssetToolbar',
				'CreateAssetModal'
			],
			componentImport: '@happyvertical/smrt-assets/svelte',
			details: [
				{
					title: 'Version and derive assets through the runtime',
					body: 'createNewVersion maintains primaryVersionId and findVersions history. AssetRuntime exposes createAssetRuntime, storeSourceAsset, storeDerivedAsset, linkDerivation, and setExtractionStatus. ASSET_ROLES, ASSET_METADATA_KEYS, and ASSET_EXTRACTION_STATUS give integrations a shared vocabulary; AssetAssociation records polymorphic provenance.'
				},
				{
					title: 'Serving has explicit response semantics',
					body: 'serveAsset and resolveAssetForServing choose 403, 404, redirect 302, or upstream failure 502 based on access and availability. remoteMode chooses proxy or redirect. FolderCollection uses SmrtHierarchical getTree and getPath; load a planned subtree rather than recursively resolving each node to avoid an N+1 query pattern.'
				}
			],
			exampleResource: 'assets'
		}
	),
	definePackage(
		'Content & media',
		'smrt-assets-local',
		'Local image metadata and variant processing for the s-m-r-t asset runtime.',
		{ kind: 'runtime' }
	),
	definePackage(
		'Content & media',
		'smrt-assets-ergot',
		'Ergot-backed asset processing, search, workflows, and remote execution.',
		{ kind: 'runtime' }
	),
	definePackage(
		'Content & media',
		'smrt-images',
		'Image galleries, uploads, editing, categorization, metadata extraction, and semantic search.',
		{
			components: ['AssetsGallery', 'ImageEditor', 'ImageUploader'],
			componentImport: '@happyvertical/smrt-images/svelte',
			details: [
				{
					title: 'AI metadata and derivation retain provenance',
					body: 'ImageCategorizer categorizes curated metadata into tags, a description, confidence, and subjects; image bytes are not sent. generateAltText uses the prompt registry, a PII-safe allowlist, and tenant overrides. ImageEditor creates new Image records that link to their source through sourceAssetId. ImageDeriver records source provenance through AssetAssociation links when asked. UpstreamManager preserves external-provider provenance, while ImageMetadataExtractor reads dimensions, format, and EXIF.'
				},
				{
					title: 'Local adjustments without a GPU',
					body: 'Brightness, contrast, color, black-and-white, rotate, flip, region crop, and resize run locally through sharp. imageAdjustVariants offers two to four versions of one operation. encodeImageAdjustments and decodeImageAdjustments make a short URL-safe spec for preview routes, and decode refuses anything it did not write. applyImageAdjustments renders, and ImageEditor.adjust saves one result as a derivative.'
				},
				{
					title: 'Collection helpers filter loaded records',
					body: 'ImageCollection can select aspect ratio, landscape, portrait, square, high-resolution, or missing-alt-text images. These helpers filter in memory, so they belong after a bounded database query rather than as a substitute for a large server-side search.'
				}
			],
			exampleResource: 'images'
		}
	),
	definePackage(
		'Content & media',
		'smrt-messages',
		'A unified STI hierarchy for email, social, and other communication channels, plus in-app notifications.',
		{
			components: ['AccountList', 'MessageList', 'MessageDetail', 'ComposeForm'],
			componentImport: '@happyvertical/smrt-messages/svelte',
			details: [
				{
					title: 'Channels and accounts are polymorphic',
					body: 'Message has Email, Tweet, and SlackMessage subtypes; Account has Email, Twitter, Slack, Zulip, and Telegram subtypes. Import a provider from smrt-messages/providers/email, slack, twitter, or all when needed. The root import remains free of provider SDK weight, and credentialSecretId points to write-only smrt-secrets storage.'
				},
				{
					title: 'Persona routes are wired by a trusted caller',
					body: 'MessagingEndpoint, PersonaMessageRoute, and PersonaMessagingService operate behind messages.send and messages.manage-routes. createPersonaMessagingTool fixes personaId in trusted wiring so an agent-provided argument cannot choose a different persona. EmailAccount.readIntakeMessage is the authorized seam for opt-in ingestion of full message bytes; it never advances sync checkpoints.'
				},
				{
					title: 'In-app notifications are a closed service',
					body: 'UserNotification stores one row per recipient with kind, title, body, link, severity, a source reference, and read and dismissed state. UserNotificationService is the only access path: notify and notifyMany deduplicate on the source reference, and listForUser, countUnread, markRead, dismiss, and markAllRead filter on the recipient. Generated REST, MCP, and CLI are off, because a tenant-scoped list would expose every member. Hosts expose their own routes with the signed-in user id.'
				}
			],
			exampleResource: 'messages'
		}
	),
	definePackage(
		'Content & media',
		'smrt-voice',
		'Voice profiles, source samples, cloning, synthesis, and timing data for spoken media.',
		{ exampleResource: 'voice-profiles' }
	),
	definePackage(
		'Content & media',
		'smrt-video',
		'Characters, performers, scenes, production workflows, frames, and AI video operations.',
		{ exampleResource: 'scenes' }
	),
	definePackage(
		'Content & media',
		'smrt-social',
		'Connected social accounts, OAuth, multi-platform publishing, and scheduled posts.',
		{
			components: ['SocialAccountSettings'],
			componentImport: '@happyvertical/smrt-social/svelte',
			exampleResource: 'social-posts'
		}
	),

	definePackage(
		'Business & operations',
		'smrt-commerce',
		'Customers, vendors, contracts, invoices, credit notes, payments, payment rails, tax codes, and fulfillment, with four recipes.',
		{
			highlights: [
				'Four recipes: customers, vendors, sales, and purchases',
				'Tenant tax codes with exclusive, inclusive, or no-tax line pricing over exact integer minor units',
				'Issued invoices keep their net amounts and stored tax; credit notes and the tax summary read those facts',
				'One issuing provider and any number of payment rails'
			],
			components: [
				'InvoiceCard',
				'InvoiceHeader',
				'InvoiceLineItems',
				'InvoiceTotals',
				'InvoiceActions',
				'UnbilledItems',
				'CustomerSelect',
				'VendorSelect',
				'QuoteEditor',
				'PurchaseOrderEditor',
				'InvoiceRecordScreen'
			],
			componentImport: '@happyvertical/smrt-commerce/svelte',
			details: [
				{
					title: 'Recipes cover the headers first',
					body: 'commerce.customers, commerce.vendors, commerce.sales, and commerce.purchases are declared in the package and emitted into the manifest recipes. Sales requires customers and purchases requires vendors. They cover Customer, Vendor, Order, and PurchaseOrder headers only; line items, fulfillment, invoices, and payments are later recipes. Each ships user-facing help, and the fields it shows carry plain-language descriptions.'
				},
				{
					title: 'One contract hierarchy supports commercial lifecycle',
					body: 'channelId distinguishes Estimate, Order, Lease, Agreement, PurchaseOrder, WholesaleOrder, ProductionOrder, Cart, and LicenseSale in one table. LicenseSale snapshots rights immutably and revoke() is its explicit transition. Money is stored as integer minor units. InvoiceLineItem.quantity is decimal with six fractional places; rounding happens once, where quantity times price meets money. There are no tolerances on any money path. The cost-billing subpath is an independent entry for signed cost billing with explicit tax rounding.'
				},
				{
					title: 'Sales and purchase contracts have separate parties',
					body: 'The base Contract holds no party. Abstract SalesContract owns customerId and covers Order, Estimate, Agreement, Lease, LicenseSale, WholesaleOrder, and Cart. Abstract PurchaseContract owns vendorId and covers PurchaseOrder and ProductionOrder. A sales leaf refuses vendorId and a purchase leaf refuses customerId. The contractId on Invoice, Payment, and Fulfillment points at SalesContract. Run preflightCommercePartyLinks on existing data before an upgrade.'
				},
				{
					title: 'Tax codes and components',
					body: 'A TaxCode lists one or more TaxComponent rows. Each has an exact percent and an optional liability account; a GST plus PST code has two. A used component never changes its percent: archive it and add a replacement. Every tenant starts with exempt, zero-rated, and out-of-scope codes. TaxSettings holds the tenant defaults, registrations, line amount type, and rounding scope. A line resolves its code from its own override, then a customer exemption, the product, the customer, and the tenant default. applyTaxCodeExamplePack imports example codes for Canada, the UK, Australia, and New Zealand; they are examples to review, not jurisdiction rules.'
				},
				{
					title: 'Exclusive, inclusive, or no-tax pricing',
					body: 'calculateMoneyDocument prices each line as quantity times unit price less one discount. An exclusive line amount is the net before tax. An inclusive amount is the gross the customer sees, and the net is derived by removing tax. A none line carries no tax and needs an out-of-scope code. Rounding is per line or per document, and the chosen scope is stored with the invoice. previewInvoiceMoney shows a proposed draft without writing it.'
				},
				{
					title: 'Issued invoices keep net amounts and stored tax',
					body: 'Saving a draft line recalculates the whole invoice once and writes the header totals, each line, and its DocumentTax rows together. InvoiceLineItem.amount is the net line amount and taxAmount is stored beside it. DocumentTax is read-only and records the code, component, percent, liability account, taxable base, and tax for each document. When an invoice leaves draft its money is frozen, and later edits to amounts or lines are refused. getInvoiceMoneyFacts reads the stored facts without recalculating them, and InvoiceRecordScreen shows them on a record page.'
				},
				{
					title: 'Every invoice and contract write needs a tenant',
					body: 'After creating a tenant, call ensureCommerceTenant(db, tenantId, { cookbook }) once. It seeds the tax settings, the standard tax codes, and the cookbook defaults, returns { tenantId }, and is safe to repeat. Money data written by an earlier release is refused with COMMERCE_DATA_NEEDS_UPGRADE, and the error names the one-time command to run: smrt db:upgrade-commerce-money.'
				},
				{
					title: 'Credit notes',
					body: 'A credit note is an Invoice with kind credit_note that names the invoice it credits. It credits a quantity or an amount of a source line, never more than the line, or adds a goodwill line with its own tax code. Tax comes from the source invoice as issued, not from current settings. An issued credit note reduces the source balance. A refund is a Payment of kind refund, allocated only to a credit note.'
				},
				{
					title: 'Posting by account and the tax summary',
					body: 'Revenue recognition posts each line net to the revenue account stored on the line. Each tax component posts to its own liability account. A credit note posts the reverse. cancelWithRevenueReversal cancels a posted invoice by posting an exact reversing journal. TaxSummaryReport is a materialized report of taxable amounts, tax, and recoverable tax by period, currency, kind of tax code, and component. Expense and ledger figures sit beside them, and each figure drills down to its documents. createTaxSummaryMaterializedReportHost registers it with an application, and MaterializedReportTable from smrt-reports renders it.'
				},
				{
					title: 'Invoices, payments, and payouts retain evidence',
					body: 'recognizeRevenue posts accounts-receivable journal evidence. PaymentAllocation and Invoice.updatePaymentStatus connect settlement to the invoice. PaymentIntent locks a multi-rail price behind an idempotency key, while PaymentInstrument identifies the selected rail. Vendor payouts move from pending to sent, confirmed, or failed.'
				},
				{
					title: 'Payment rails behind one issuing provider',
					body: 'A runtime has one issuing provider and any number of paymentProviders, each with a unique name and its own inbox namespace. Settlement is decided by the pure decideAttempt from gateway state and the payment policy; the gateway is authoritative, and nothing here counts confirmations. Crypto rails implement the port over the payments package and never call a gateway from here. Rails never save cards or charge tax. CustomerSelect and VendorSelect are the registered selectors; QuoteEditor and PurchaseOrderEditor keep draft strings apart from minor-unit revisions.'
				}
			],
			exampleResource: 'invoices'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-products',
		'A product catalog and reference module for package, federation, standalone, and browser-store consumption.',
		{ exampleResource: 'products' }
	),
	definePackage(
		'Business & operations',
		'smrt-inventory',
		'Multi-location SKUs, stock levels, immutable movements, and guarded stock mutation.',
		{ exampleResource: 'stock-levels' }
	),
	definePackage(
		'Business & operations',
		'smrt-manufacturing',
		'Industry-neutral bills of materials, cost rollups, and production orders.',
		{ exampleResource: 'production-orders' }
	),
	definePackage(
		'Business & operations',
		'smrt-ledgers',
		'Double-entry accounting, journal lifecycle, balance enforcement, and traceable entries.',
		{
			details: [
				{
					title: 'Journal entries must balance',
					body: 'Accounts have debit- or credit-normal types. A Journal moves from draft to posted or voided, and each JournalEntry is debit-XOR-credit. BALANCE_EPSILON is 0.01. This catches arithmetic imbalance, but a mixed-unit journal can still balance numerically without being semantically valid; keep integer-minor-unit commerce values consistent.'
				},
				{
					title: 'Commerce posts to the accounts each invoice recorded',
					body: 'smrt-commerce posts each invoice line net to the revenue account stored on that line, and each tax component to its own liability account. Integer minor units balance exactly. A canceled invoice gets a reversing journal; the original stays posted.'
				},
				{
					title: 'Posted movements for reporting',
					body: 'JournalEntryCollection.listPostedMovements returns the posted debits and credits for a tenant, a set of accounts, a date range, and a currency, leaving out drafts and voids. The commerce tax summary uses it to set the movement on each tax liability account beside the tax it expects.'
				},
				{
					title: 'Summaries keep sensitive prompt variables out',
					body: 'Journal.summarize() uses the smrtLedgers.journal.summarize prompt-registry entry and excludes PII-conscious variables before invoking a provider.'
				}
			],
			exampleResource: 'journal-entries'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-subscriptions',
		'Tenant plans, grants, entitlement resolution, usage thresholds, and subscription UI.',
		{
			components: ['PlanPicker', 'SubscriptionSummary', 'UsageThresholds'],
			componentImport: '@happyvertical/smrt-subscriptions/svelte',
			exampleResource: 'subscriptions'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-reports',
		'Materialized aggregate read models with incremental refresh, schedules, and tenant fan-out, plus runtime reports compiled per principal from a stored spec, with browser surfaces.',
		{
			highlights: [
				'Decorated groupings, measures, and time buckets',
				'Incremental refresh with watermarks and affected-group recomputation',
				'Durable scheduled refresh through smrt-jobs',
				'Runtime reports: a declarative spec stored as data, never a stored result',
				'Saved-report routes and a report chart widget on the /svelte subpath'
			],
			components: [
				'SavedReports',
				'ReportDetail',
				'ReportResult',
				'ReportConfirmation',
				'ReportPicker',
				'RuntimeReportsRoute',
				'RuntimeReportDetailRoute',
				'RuntimeReportChartWidget',
				'MaterializedReportTable'
			],
			componentImport: '@happyvertical/smrt-reports/svelte',
			details: [
				{
					title: 'Runtime reports are data, not code',
					body: 'parseRuntimeReportSpec accepts a closed grammar with no SQL, expressions, joins, tables, or tenants. compileRuntimeReportSpec resolves it against a server-owned source allow-list, the registry field policy, the live principal permissions, and a fail-closed tenant predicate. A stored RuntimeReport is recompiled for the running principal on every run, and result rows are never persisted. The assistant tools that define and run them live in smrt-chat.'
				},
				{
					title: 'Two recipes with different surfaces',
					body: 'reports.materialized declares the internal refresh tables: runs, watermarks, locks, schedules, and refresh tasks. An app owns its report classes, so the recipe does not list them. Those tables have no REST or MCP surface, so the recipe has no nav and no browser surface. reports.runtime brings the RuntimeReport model with nav, the /reports and /reports/:id routes, and the runtime-report-chart widget.'
				},
				{
					title: 'Server surfaces for the browser components',
					body: 'createRuntimeReportConfirmHandler serves the confirmation a person gives before a proposed report is saved; runRuntimeReportForPrincipal and archiveRuntimeReportForPrincipal reuse the read and create grants. Source allow-lists come from the packages.reports.runtime.sources config block; no configuration means no sources. The components take server report types as type-only imports and draw charts with smrt-ui/charts.'
				},
				{
					title: 'The adapter is the exposure boundary',
					body: 'buildReportAdapterDescriptor and queryReportMaterializedRows bind tenant context, projection, paging, filters, and facets before rows cross an application boundary. The adapter redacts fields that the caller is not allowed to expose.'
				},
				{
					title: 'Refresh, views, exports, and schedules retain their state',
					body: 'getReportLifecycle describes availability; previewReportRefresh and applyReportRefresh run through an action host. Saved views revalidate policy and migrate from v0 to v1. Exports bind to a snapshot fingerprint and page offset worker contract. SmrtReportSchedule supports cron, durable enqueue, and onChange interception.'
				}
			],
			exampleResource: 'reports'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-analytics',
		'Analytics properties, streams, server-side events, and useful reporting surfaces.',
		{
			components: ['AnalyticsSummary', 'EventsTable', 'PropertyInfo', 'StatCard', 'TrendBadge'],
			componentImport: '@happyvertical/smrt-analytics/svelte',
			details: [
				{
					title: 'Analytics has tenant-scoped source models',
					body: 'AnalyticsProperty, AnalyticsDataStream, AnalyticsEvent, and AnalyticsReport hold the property, incoming stream, events, and report state in the tenant boundary.'
				},
				{
					title: 'AI reporting receives a controlled result payload',
					body: 'analyzePerformance, analyzeResults, and hasPositiveTrends use the prompt registry. The resultData forwarding contract excludes PII-conscious values, so callers must not persist or add sensitive data merely to make it available to an AI provider. Generated MCP exposes only list and get on AnalyticsReport; analyzeResults is a model method the application calls, not a tool.'
				}
			],
			exampleResource: 'analytics-events'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-ads',
		'Priority-based ad delivery, weighted variations, and immutable event tracking.',
		{ exampleResource: 'ads' }
	),
	definePackage(
		'Business & operations',
		'smrt-marketing',
		'Cross-channel campaigns, immutable performance snapshots, and computed budget pacing.',
		{
			highlights: [
				'Campaigns and channels share one budget and one reporting shape',
				'Ingested metric snapshots are deduplicated and never edited in place',
				'Pacing is computed from the evidence rather than stored'
			],
			components: [
				'MarketingDashboard',
				'CampaignList',
				'CampaignDetail',
				'ChannelMix',
				'BudgetPacing'
			],
			componentImport: '@happyvertical/smrt-marketing/svelte',
			exampleResource: 'campaigns'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-affiliates',
		'Partners, tiered commissions, attribution, and payout processing. Now a compatibility shim over the smrt-sales commissions module — new applications should use smrt-sales directly.',
		// No exampleResource: the shim declares no models of its own, so it
		// generates no REST, MCP, WebMCP, or CLI surface. The models live in
		// smrt-sales.
		{
			surfaceNote:
				'A deprecated compatibility shim that re-exports the smrt-sales commissions module under its legacy names. It declares no models of its own, so it generates no interfaces — those come from @happyvertical/smrt-sales.'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-sales',
		'Provider-neutral agreement execution, CRM, referral intake and attribution, and a neutral commissions core.',
		{
			highlights: [
				'Subpath modules — agreements, crm, referrals, commissions — keep consumers scoped',
				'Referral attribution records its exceptions and conflicts instead of guessing',
				'Commission plans, earning events, and payouts stay separate from client invoices'
			],
			components: [
				'SalesDashboard',
				'LeadList',
				'LeadDetail',
				'OpportunityBoard',
				'OpportunityDetail',
				'ReferralLinkManager',
				'ReferralStatusList',
				'ReferrerEarningsSummary',
				'PayoutHistoryList',
				'ExecutedAgreementsList',
				'CommissionBreakdown',
				'CommissionExpenseSummary',
				'AttributionConflictQueue',
				'PayoutBatchReview'
			],
			componentImport: '@happyvertical/smrt-sales/svelte',
			exampleResource: 'leads'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-projects',
		'Provider-neutral projects, repositories, issues, pull requests, and the time workflows re-exported from smrt-timesheets.',
		{
			components: [
				'TimeEntryCard',
				'TimeEntryList',
				'TimeSummary',
				'DurationDisplay',
				'ApprovalActions',
				'BulkActions'
			],
			componentImport: '@happyvertical/smrt-projects/svelte',
			details: [
				{
					title: 'Managed delivery uses durable handoffs',
					body: 'ProjectIntegration holds credential grants for ManagedProjectClient. DevelopmentRequest and WorkLink carry requested work; ProjectDeliveryEvent replays idempotently; PreviewApproval records the approval boundary; AssistanceRequest and AssistanceEvent retain escalation evidence.'
				},
				{
					title: 'Service billing and repository sync retain correction paths',
					body: 'ServiceTimeEntry, ServiceChargeSnapshot, and ServiceCompensationSnapshot are owned by smrt-timesheets and re-exported here unchanged, on the same tables. SubscriptionServiceCommercialResolver prices client work through smrt-subscriptions; provider compensation is a separate resolver and snapshot. The time-entry Svelte components are re-exported from smrt-timesheets too. Repository, issue, and pull-request sync supports GitHub, GitLab, Bitbucket, and Azure. incorporateFeedback can preview or roll back Living Spec changes, while Project.analyzeHealth evaluates the synchronized project.'
				},
				{
					title: 'Issues do not need a repository',
					body: 'Issue and Label carry an optional repositoryId and an optional projectId, so an issue can belong to a project alone. hasRepository gates every provider call: sync is a no-op, state changes stay local, and getRepository throws. The schema change adds the project columns and relaxes repository_id to nullable; db:migrate generates it.'
				}
			],
			exampleResource: 'projects'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-support',
		'Channel-neutral support cases with lifecycle, routing, service targets, escalation, and auditable service time.',
		{
			highlights: [
				'Chat and email land in one tenant-scoped case, idempotent on replay',
				'Writes go through service facades so lifecycle and audit evidence cannot be bypassed',
				'Delivery work stays in smrt-projects; a work link connects the two'
			],
			components: [
				'CaseQueue',
				'CaseDetail',
				'TargetList',
				'RoutingRationale',
				'TimeEntryApprovalQueue'
			],
			componentImport: '@happyvertical/smrt-support/svelte',
			exampleResource: 'support-cases'
		}
	),

	definePackage(
		'Domain models',
		'smrt-events',
		'Deeply nested events, series, participants, placements, and meeting presentation.',
		{
			components: ['MeetingView'],
			componentImport: '@happyvertical/smrt-events/svelte',
			details: [
				{
					title: 'Events can nest without a depth ceiling',
					body: 'SmrtHierarchical supplies getParent, getChildren, getAncestors, getDescendants, getHierarchy, and moveTo. Load the needed tree shape rather than recursively resolving every relation. EventSeries defines daily, weekly, monthly, or yearly recurrence, and expandRecurrence or EventSeries.getOccurrences expand it into instants that keep the start wall-clock time in its zone. Event.allDay marks a whole-day event whose endDate is the exclusive midnight after its last day. Event.timeZone is an IANA zone, and an empty value inherits. EventType carries a custom-field JSON schema.'
				},
				{
					title: 'Participants and assets carry presentation detail',
					body: 'EventParticipant records role, placement, grouping, and conflictColumns; numeric placement can serve both layout and ordering. EventAsset is the owned-asset join with getAssets, addAsset, and removeAsset.'
				}
			],
			exampleResource: 'events'
		}
	),
	definePackage(
		'Domain models',
		'smrt-places',
		'Hierarchical places, geocoding, lookup-or-create, and proximity search.',
		{ exampleResource: 'places' }
	),
	definePackage(
		'Domain models',
		'smrt-facts',
		'Distributed knowledge with provenance, confidence, semantic reconciliation, and evolution chains.',
		{ exampleResource: 'facts' }
	),
	definePackage(
		'Domain models',
		'smrt-properties',
		'Digital properties and nested zones for content, ads, and application placement.',
		{ exampleResource: 'properties' }
	),
	definePackage(
		'Domain models',
		'smrt-sites',
		'Multi-tenant site lifecycle, configuration, and prioritized agent bindings.',
		{ exampleResource: 'sites' }
	),
	definePackage(
		'Domain models',
		'smrt-tags',
		'Context-scoped hierarchical tags, aliases, and multi-language labels.',
		{ exampleResource: 'tags' }
	),
	definePackage(
		'Domain models',
		'smrt-gnode',
		'Federation scaffolding for gnode knowledge bases: published types and class shells, with none of the discovery or exchange behavior implemented yet.',
		{
			kind: 'runtime',
			status: 'stub',
			notice: {
				variant: 'warning',
				title: 'Stubs only — do not build on this yet',
				body: 'Every method is a placeholder. discoverPeers() and exchangePeers() on Federation return empty arrays, PeerExchangeProtocol.exchange() returns an empty array, and WebFingerProtocol.discover() returns null. The package registers no s-m-r-t models, and the stub source imports nothing — though installing it still pulls the smrt-core and SDK dependencies it declares. It is published so the intended shape is visible, not because it works.'
			},
			highlights: [
				'Ships today: the GnodePeer, FederationConfig, and WebFingerResponse types',
				'Ships today: Federation, WebFingerProtocol, and PeerExchangeProtocol class shells whose methods return an empty array or null',
				'Planned: WebFinger discovery at /.well-known/gnode, peer exchange at /api/federation/peers, and ActivityPub-inspired cross-gnode queries'
			],
			details: [
				{
					title: 'What you can rely on now',
					body: 'The exported type definitions are stable enough for design work. A peer has a url, name, discoveredAt, and optional lastSeen. Federation configuration covers enabled, discoverability, peers, autodiscovery, and peerExchange. Nothing behind these types does network work.'
				},
				{
					title: 'What is still to be built',
					body: 'Peer discovery over WebFinger, the peer-exchange endpoint, and cross-gnode querying are all unimplemented. Until they land, an application that needs federation has to implement the transport itself rather than importing it from here.'
				},
				{
					title: 'Check upstream before you plan around it',
					body: 'The source is the current truth. The README has the same stubs-only warning, but some parts are behind the code. It reports no dependencies, although the package declares smrt-core and several SDK adapters. Read the source before you assume that planned behavior is available.',
					href: 'https://github.com/happyvertical/smrt/tree/main/packages/gnode',
					linkLabel: 'Open the package source'
				}
			]
		}
	),

	definePackage(
		'Mobile',
		'smrt-mobile',
		'Kotlin Multiplatform state and services for offline packs, durable writes, evidence capture, authentication, networking, and cross-platform presenters.',
		{
			kind: 'mobile',
			status: 'private',
			highlights: [
				'SQLDelight offline queue and pack store',
				'PKCE sessions, authenticated Ktor networking, and idempotent multipart uploads',
				'Shared StateFlow presenters consumed by Compose and SwiftUI'
			]
		}
	),
	definePackage(
		'Mobile',
		'smrt-mobile-contract',
		'Manifest and allowlist code generation into mobile contracts and Kotlin or Swift DTOs.',
		{ kind: 'tooling' }
	),
	definePackage(
		'Mobile',
		'smrt-android',
		'Compose shell, s-m-r-t theme, and Android adapters for barcode, speech, on-device AI, secure auth, and storage.',
		{ kind: 'mobile', status: 'private' }
	),
	definePackage(
		'Mobile',
		'smrt-ios',
		'SwiftUI shell, s-m-r-t theme, and iOS adapters for VisionKit, Speech, Foundation Models, Keychain, and native storage.',
		{ kind: 'mobile', status: 'private' }
	),

	// Documented from the published tarballs; the site does not install these
	// packages, so none has a playground module registered here.
	definePackage(
		'Foundation',
		'smrt-preferences',
		'Saved user-interface preferences: tenant defaults and per-user overrides for overview layouts and the app frame, validated per registered kind.',
		{
			status: 'new',
			highlights: [
				'Two built-in kinds: overview (widget layout of a customizable overview page) and shell-layout (AdminShell settings)',
				'An organization sets the default; each person keeps their own version on top; reset returns to the layer below',
				'Every kind validates its payload on save and again on load; invalid data is refused or dropped and reported'
			],
			details: [
				{
					title: 'Stores, not the model',
					body: 'createPreferenceStore, createOverviewStore, and createShellSettingsPreferences are the application API. The UiPreferenceRecord model refuses writes that do not come from the store and never returns another person’s preferences. Saves pass the revision they loaded; a stale revision returns conflict instead of overwriting.'
				},
				{
					title: 'Permissions are per kind',
					body: 'overviews.customize and shell.customize change the organization default; overviews.personalize and shell.personalize keep a personal version. Owners and admins receive all four when role permissions are seeded; members and viewers receive the two personalize slugs. The store reads them from the signed-in person’s permission set in the request context.'
				},
				{
					title: 'Register more kinds',
					body: 'registerPreferenceKind takes a kind name, a format version, the two permission slugs, and a validate function. The table _smrt_ui_preferences is created by smrt db:migrate, never at runtime.'
				}
			],
			surfaceNote:
				'The preference table has no generated REST, MCP, WebMCP, or CLI surface: a generated route would skip kind validation. Applications call the stores from their own server code.'
		}
	),
	definePackage(
		'Foundation',
		'smrt-approvals',
		'A decision gate: revision-bound, single-use approvals with quorum, expiry, tenant policy, and an append-only event ledger.',
		{
			status: 'new',
			highlights: [
				'A package defines an approval kind; a requester opens a request bound to one revision of one subject',
				'Only human principals of the same tenant holding the kind’s permission decide, once each; agents and services may request and consume',
				'Not a workflow engine: no stages, no executor, no compensation'
			],
			details: [
				{
					title: 'Request, decide, consume',
					body: 'ApprovalRequest is one gate on one subject revision. ApprovalEvent is the append-only ledger and the source of truth. ApprovalPolicy lets a tenant tighten a kind with a higher quorum, a shorter expiry, or one more permission; it can never loosen the defaults. An approved request is consumed exactly once against the revision the consumer is about to act on.'
				},
				{
					title: 'Concurrency has one winner',
					body: 'Every transition is one guarded conditional UPDATE plus one event insert in the same transaction. Concurrent double approval or double consumption has exactly one winner; the loser is refused and writes nothing. Each transition returns transitioned, already_applied for an idempotent requestKey replay, or refused with a typed reason.'
				},
				{
					title: 'Only the service writes',
					body: 'A request or event built directly is refused at the model layer. Events cannot be updated or deleted. Optional self-approval needs an explicit selfApprovalPermission on the kind and is recorded on the event.'
				}
			],
			surfaceNote:
				'The generated REST and MCP surface is list and get only, and there is no generated CLI. Writes go through ApprovalService.'
		}
	),
	definePackage(
		'Foundation',
		'smrt-webhooks',
		'Outbound webhook subscriptions with HMAC-signed delivery to public HTTPS endpoints, a durable jobs queue, retries, and a safe delivery log.',
		{
			status: 'new',
			highlights: [
				'WebhookChangeFeed reads the committed change feed, including delete tombstones, and advances a persisted cursor only after enqueue is durable',
				'A unique (tenant, subscription, event) outbox row and its job enqueue commit in one transaction; repeated dispatch is a no-op',
				'Only HTTPS port 443 to public unicast addresses, DNS pinned, no redirects, bounded deadlines'
			],
			components: ['WebhookAdmin'],
			componentImport: '@happyvertical/smrt-webhooks/svelte',
			details: [
				{
					title: 'Two publication paths, never both',
					body: 'The durable path polls the change feed per tenant context and publishes identity-only payloads. registerWebhookModelEvents is a low-latency hook binding with an explicit model allowlist, but a crash between source commit and enqueue can miss an event. Do not enable both for the same models. A pruned cursor raises WebhookHistoryExpiredError and stops rather than dropping history.'
				},
				{
					title: 'At-least-once delivery',
					body: 'Five attempts use the jobs package’s exponential retry. A delivery lease prevents overlapping attempts; an expired lease permits recovery after worker death. Receivers must deduplicate the x-smrt-delivery header. The signature is sha256 HMAC over the timestamp and the exact persisted body.'
				},
				{
					title: 'Administration stays on the server',
					body: 'WebhookAdminService authorizes administrators through a host callback. The WebhookAdmin component takes subscriptions, deliveries, and onCreate, onToggle, onReplay callbacks; it never receives signing secrets. The integrations.webhooks recipe declares a server runtime and a settings panel, not model navigation.'
				}
			],
			surfaceNote:
				'Secrets and payloads are sensitive fields, so generated REST, MCP, WebMCP, and CLI access is disabled. The host exposes administration through its own authenticated routes.'
		}
	),
	definePackage(
		'Agents & runtime',
		'smrt-playbooks',
		'Layered playbook definitions, app and tenant overrides, and plan resolution for agents: a named sequence of steps every agent surface follows.',
		{
			highlights: [
				'Resolution layers: code default, config override, stored app override, stored tenant override, runtime override',
				'A playbook is a script, never a call: resolution returns a plan and nothing here executes a step',
				'Step lists are never editable; enablement and plane lists only narrow'
			],
			details: [
				{
					title: 'Define and resolve',
					body: 'definePlaybook registers code defaults in a global process registry, so a package ships its own playbooks. resolvePlaybook merges the layers and returns a plan or fails closed with a specific reason: unknown-playbook, disabled, plane-not-declared, intent-registry-unavailable, or unknown-intent. A TTL cache keyed by key and tenant is invalidated on override save or delete.'
				},
				{
					title: 'Two kinds of step',
					body: 'An operation step names a qualified model and action, never a generated tool name. An intent step names a declared view intent and is valid only where a surface is mounted. Steps never classify themselves; classification is inherited from the referenced operation and undeclared operations resolve to destructive.'
				},
				{
					title: 'Preflight predicts, never grants',
					body: 'preflightPlaybook resolves through the caller’s own layer chain and returns a per-step verdict of allow, deny, or unknown plus an aggregate. Every step re-enforces authorization at execution.'
				}
			],
			exampleResource: 'playbook-overrides'
		}
	),
	definePackage(
		'Agents & runtime',
		'smrt-mcp-apps',
		'A framework-neutral, browser-only view-side bridge for portable MCP Apps: lifecycle, correlated transport, and capability gates.',
		{
			kind: 'runtime',
			status: 'new',
			highlights: [
				'McpAppBridge binds one host window and one exact origin from trusted configuration for its whole lifetime',
				'Implements initialize, server tools/call, ui/open-link, text ui/message, text and structured model-context updates, display-mode requests, and teardown',
				'Bounded JSON everywhere: nesting, array, key, and character budgets, with cycles and accessors rejected'
			],
			details: [
				{
					title: 'What it is not',
					body: 'It is not a server adapter, host or sandbox implementation, authorization layer, or WebMCP tool registrar. No app-tools capability is advertised. Resource proxying, sampling, and downloads have no built-in adapter; an opt-in extension adapter may register a bounded contract. Consumers must keep a normal app or review URL fallback.'
				},
				{
					title: 'Svelte bindings',
					body: 'useMcpApp and useMcpAppIntent are imported from the explicit @happyvertical/smrt-svelte/mcp-apps subpath. useMcpApp constructs the bridge on mount and disposes it on unmount. useMcpAppIntent binds a declared view intent to a mounted registry as a component-local callable, never a remote tool.'
				},
				{
					title: 'Pinned upstream contract',
					body: 'The runtime schema of a pinned ext-apps revision is authoritative. Its prose examples differ from the schema in places; contract tests pin the runtime shapes explicitly.'
				}
			],
			surfaceNote:
				'A browser-side bridge without models. It defines no resource of its own; the tools it calls come from the application MCP server the host exposes.'
		}
	),
	definePackage(
		'Agents & runtime',
		'smrt-mcp-openai',
		'Optional OpenAI navigation, settings, context, messages, and composer mentions for authorized s-m-r-t MCP Apps.',
		{
			kind: 'runtime',
			status: 'new',
			notice: {
				variant: 'note',
				title: 'No OpenAI host compatibility is claimed yet',
				body: 'The package tests against a synthetic host. Its README states that this does not prove desktop, web, iOS, or Android support, and that actual host acceptance remains open.'
			},
			highlights: [
				'Ordinary s-m-r-t apps do not import this package',
				'Server helpers wrap existing app-MCP workflows; they add no second server and no authorization policy',
				'Browser helpers depend on the portable smrt-mcp-apps bridge and fall back to inline layouts and plain links'
			],
			details: [
				{
					title: 'Server composition',
					body: 'withOpenAiEntrypoints marks idempotent read tools as global or thread entry points. bindOpenAiSettings wraps a read and an update workflow into structured settings; the owning handlers authorize ownership, recheck the tenant, and persist atomically. openAiDisplayMetadata and openAiOnboardingDeclaration return metadata the application merges itself.'
				},
				{
					title: 'Browser navigation',
					body: 'observeOpenAiNavigation consumes bounded host context, recognizes only deep links, and calls a designated server tool with the URL. Repeated identical routes do not duplicate calls. Query parameters are untrusted input, never identity or approval. Only a rejected tool call selects the denied fallback.'
				},
				{
					title: 'Context, messages, mentions',
					body: 'updateOpenAiModelContext and sendOpenAiMessage use negotiated native support and fall back to portable text. withOpenAiMentionSearch declares bounded composer search; results are discovery hints, and the selection workflow rechecks ownership on every call.'
				}
			],
			surfaceNote:
				'An adapter over the application MCP server. It defines no models and generates no interfaces; every tool it decorates belongs to the host application.'
		}
	),
	definePackage(
		'Web & UI',
		'smrt-app-runtime',
		'Validated local, self-hosted, and cloud runtime composition for s-m-r-t applications, with a SvelteKit entry for server hooks.',
		{
			kind: 'runtime',
			highlights: [
				'The local profile owns user data paths, SQLite custody, application-secret creation, and a single-use loopback owner bootstrap',
				'Deployed profiles compose provider bindings for database, authentication, assets, and secrets, readiness-checked before startup',
				'Application migrations run through an explicit, idempotent prepareDatabase hook; runtime never creates tables implicitly'
			],
			details: [
				{
					title: 'Private local applications',
					body: 'initializeLocalApplicationRuntime claims a dedicated mode-0700 data root in the OS application-data directory and serializes initializers with a SQLite lock database. The first valid bootstrap claim creates a Person, User, default Tenant, owner Role and Membership, and Session in one transaction. Local MCP tokens are owner-bound, scoped, expiring, and stored only as an HMAC.'
				},
				{
					title: 'Deployed profiles and workers',
					body: 'initializeDeployedApplicationRuntime composes only self-hosted and cloud. createTaskWorker and createScheduleWorker run the jobs package runners in separate processes against the shared PostgreSQL database; the web process does not start them. health is process liveness; readiness probes database, auth, assets, and secrets.'
				},
				{
					title: 'The SvelteKit entry',
					body: 'createSmrtSvelteKitRuntime from the sveltekit subpath returns init and handle for hooks.server.ts. init is the fail-closed startup gate. handle runs URL tenant selection, the signed session, and then publishes tenant context only when the active context matches the verified session tenant.'
				}
			],
			surfaceNote:
				'Infrastructure composition without models of its own. The generated interfaces an application serves come from the packages it registers, not from this one.'
		}
	),
	definePackage(
		'Web & UI',
		'smrt-workbench',
		'A shared developer workbench for s-m-r-t packages and consumer projects: package metadata, route modules, previews, scripts, docs, and manifests in one browser host.',
		{
			kind: 'tooling',
			components: ['WorkbenchHost'],
			componentImport: '@happyvertical/smrt-workbench/svelte',
			highlights: [
				'Consumer projects add a workbench script that runs smrt workbench dev after installing smrt-cli and this package',
				'Read-only for command execution: scripts and validation commands are shown as copyable text',
				'Package-owned workbench modules export route modules and metadata through defineWorkbenchModule'
			],
			details: [
				{
					title: 'What it composes',
					body: 'The workbench mounts package route modules, smrt-playground previews, package metadata, scripts, docs, manifests, and knowledge summaries in a single shared host. smrt-playground keeps preview discovery and rendering; smrt-dev-mcp keeps knowledge freshness and review bundles.'
				},
				{
					title: 'Three views',
					body: 'A workspace root shows every workspace package, and a package directory focuses the host on that package. A consumer project shows installed package metadata plus local project knowledge. Yarn consumers must use the node-modules linker, because the browser host is served from the installed package directory.'
				}
			],
			surfaceNote:
				'Developer tooling without models. It renders other packages’ surfaces and generates none of its own.'
		}
	),
	definePackage(
		'Web & UI',
		'smrt-planner',
		'The s-m-r-t app planner as a mountable Svelte component with cookbooks, recipes, layout, theme, and export tabs, a typed command set, and a plan snapshot.',
		{
			kind: 'tooling',
			status: 'new',
			repository: 'https://github.com/happyvertical/smrt-planner',
			components: ['Planner', 'PlannerControls', 'HostPlanner'],
			componentImport: '@happyvertical/smrt-planner',
			highlights: [
				'Add recipes or whole packages and an app mock-up assembles around them: navigation, a list and record view with a form per model, and help pages',
				'Ready-made cookbooks for a bakery, a mechanic, a welder, a yoga studio, and other small businesses; the cookbook saves in the browser or is left to the host',
				'Commands are published as tool definitions, so an LLM or MCP server can drive the planner'
			],
			details: [
				{
					title: 'Mount it in a host page',
					body: 'Planner and createPlannerController come from the package root, which is Svelte source and needs a Svelte-compiling bundler. Its props are all optional: controller, basePath, inference, layout, persistence, themeControls, advancedStylesHref, defaultTitle, tabs, backLink, and onready. The controller runs commands such as add_recipes, set_policy, apply_cookbook, and undo, and returns a snapshot and receipt or a typed error. A host that owns an AppShell mounts PlannerControls inside it with PLANNER_SHELL_EDGE_TOGGLES and PLANNER_SHELL_PANEL_DEFAULTS.'
				},
				{
					title: 'What the tabs cover',
					body: 'The tabs are cookbooks, recipes, features, layout, theme, settings, and export. The pencil in the header edits the menu and every section page in place, and each edit lands in the cookbook layout and overviews. Metric, records, and chart widgets read the in-browser sample data. Theme offers palettes, appearance, a brand color wheel, fonts, and an Advanced Styles CSS editor. Export shows what the cookbook holds, a prompt to copy for a coding agent, and the download.'
				},
				{
					title: 'Drive it from a model',
					body: 'commandTools from the commands subpath is every command as name, description, and inputSchema. The snapshot is a compact read-only plan of a few kilobytes, fit for a prompt. Passing inference switches the assistant on; without it the planner has no chat icon. A plain Node server uses the core subpath for the schemas, buildHostPrompt, parseHostReply, the cookbook library, and createHeadlessPlanner. It serves the prebuilt app from the app subpath. HostPlanner mounts the same planner inside a Kitchen host such as an MCP app or widget.'
				},
				{
					title: 'Mounted on this site as Build a boilerplate',
					body: 'This site mounts the complete Planner on its Build a boilerplate page with a backLink to the documentation. An on-device browser model is offered first; a bring-your-own endpoint, with any key held in memory for the tab, is the alternative. The page is the site name, passed as defaultTitle; the package keeps its own.',
					href: '/build-a-boilerplate',
					linkLabel: 'Open Build a boilerplate'
				},
				{
					title: 'Its own release line and repository',
					body: 'The planner is published on its own version line, separate from the framework release, and its source lives in its own repository. Its catalog is generated from the registry and committed, so a build needs no network.',
					href: 'https://github.com/happyvertical/smrt-planner',
					linkLabel: 'Open the planner repository'
				}
			],
			surfaceNote:
				'A browser component with no models. It describes the REST routes, MCP tools, and CLI commands other packages generate; it generates none itself.'
		}
	),
	definePackage(
		'Content & media',
		'smrt-comments',
		'Tenant-scoped comments on any record, mention notification composition, and a browser-safe RecordComments component.',
		{
			status: 'new',
			components: ['RecordComments'],
			componentImport: '@happyvertical/smrt-comments/svelte',
			highlights: [
				'Comments attach to arbitrary records through a qualified polymorphic metaType and metaId pair',
				'CommentService requires a trusted actor and a host authorizeRecord callback on both create and listForRecord',
				'No runtime dependency on smrt-messages: the host composes mention notifications through a structural interface'
			],
			details: [
				{
					title: 'Mentions and delivery',
					body: 'Mentions are UUIDs, deduplicated, limited to 50; self-mentions do not notify. Validation finishes before the single insert, so an invalid mention leaves no row. The comment is saved before delivery; a delivery rejection leaves it saved, and the retry is delivery, not create.'
				},
				{
					title: 'The component owns nothing but the view',
					body: 'RecordComments takes authorized comment projections, an onsubmit callback, and a contextKey naming tenant, actor, and record. Changing the key clears drafts and ignores stale submissions. The host owns loading, authentication, mention selection, and refresh. The comments.records recipe has no global navigation: a discussion needs an already-authorized parent record.'
				}
			],
			surfaceNote:
				'Generated REST, MCP, WebMCP, and CLI access is disabled. Direct model and collection APIs are persistence primitives for trusted code, not authorization boundaries.',
			playgroundNote:
				'The package exports RecordCommentsPlayground, a standalone sample-record preview with local-only posting. This site does not install the package, so the preview is not rendered here.'
		}
	),
	definePackage(
		'Content & media',
		'smrt-ingestion',
		'Durable tenant-scoped intake: receipts, evidence, analysis attempts, proposals, and an action journal, with inbox and review components for people.',
		{
			status: 'new',
			notice: {
				variant: 'warning',
				title: 'Preview-only: automation stays disabled',
				body: 'The README reports that the published reference workflow did not meet its supported-reference quality gates and did not establish safety. The recipes do not configure a source or provider, expose generic CRUD routes, or enable automatic execution.'
			},
			components: ['IntakeInbox', 'IntakeReview', 'EvidenceViewer'],
			componentImport: '@happyvertical/smrt-ingestion/svelte',
			highlights: [
				'Receipt identity is tenant, source, and delivery key; a source retries the same receive call after failure or lost acknowledgment',
				'Every read and write rechecks the host scope predicate; source metadata is never authority',
				'Configured source adapters for email, a watch folder, and vendor webhooks preserve bytes and never perform domain writes'
			],
			details: [
				{
					title: 'Receive, analyze, journal',
					body: 'receive accepts bounded original byte buffers with stable part ids and becomes ready only after every part is durable. analyze appends immutable input revisions; claimAnalysis uses leases, monotonic fences, and attempt budgets. createAction, publishProposal, and appendPlan persist explicit intentions for the later review and execution layer; they approve nothing.'
				},
				{
					title: 'Deletion and retention',
					body: 'expire revokes access and pending work before removing bytes and calling the host purgeDerived callback. Interrupted deletion is retried by repairDeletions and sweepRetention. Minimal identities remain; content-bearing payloads are redacted. Only SQLite and PostgreSQL are supported.'
				},
				{
					title: 'Human review',
					body: 'IntakeInbox and IntakeReview mount through an authenticated host using the browser-safe IntakeReviewHost contract. The ingestion.inbox and ingestion.review recipes register those routes for a host to mount and declare no model navigation.'
				}
			],
			surfaceNote:
				'Generated REST, CLI, and MCP mutation of the persistence models is disabled. Hosts expose authorized DTO methods through their own authenticated transport.'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-timesheets',
		'Shared time entries: who worked how long on what, approval and correction, and immutable charge and compensation snapshots taken at approval.',
		{
			status: 'new',
			components: [
				'TimeEntryCard',
				'TimeEntryList',
				'TimeSummary',
				'DurationDisplay',
				'TimeEntryApprovalQueue'
			],
			componentImport: '@happyvertical/smrt-timesheets/svelte',
			highlights: [
				'One model for professional services, shop floors, and job sites: a Profile or an agent, a generic work reference, a duration, a source',
				'Approved entries never change; a correction is a new row and the original flips to corrected',
				'Money is never on the entry: approval writes one charge and one compensation snapshot in integer minor units'
			],
			details: [
				{
					title: 'Moved out of projects and support',
					body: 'ServiceTimeEntry, the two snapshots, and ServiceEvidenceService moved here from smrt-projects. The table names are unchanged, so existing rows need no migration, and the old qualified names resolve as deprecated aliases. Under pnpm an application that depends on smrt-projects or smrt-support must add this package directly, or the CLI stops planning the three time tables.'
				},
				{
					title: 'Attendance and period timecards',
					body: 'The attendance subpath adds AttendancePunch, AttendanceBreak, and AttendanceService: punch in and out, paid and unpaid breaks, autoClose, and offline replay where committed attendance wins. The rollup subpath adds per-person regular and overtime rollups, immutable confirmation, and attributed adjustments. Calendar, holiday, and overtime rules belong to the consumer.'
				},
				{
					title: 'Decimal hours and dated labour pricing',
					body: 'A source that supplies decimal hours records durationHours as exact text; seconds and timestamps stay null. DatedLabourCommercialResolver is an opt-in resolver with effective-dated customer, wage, and burden rates; the host authorizes the schedule and binds the work date.'
				}
			],
			exampleResource: 'service-time-entries'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-expenses',
		'Expense records: a cost incurred against a job, work package, or project, with deduplicated receipts, an explicit review, reimbursement, and purchase-order drawdown.',
		{
			status: 'new',
			components: [
				'ExpenseForm',
				'ExpenseList',
				'ExpenseReceiptCapture',
				'ExpenseReviewPanel',
				'ExpenseReviewQueue'
			],
			componentImport: '@happyvertical/smrt-expenses/svelte',
			highlights: [
				'Review is method-only: review, reject, markDuplicate, and reopen; a reviewed expense’s money, dates, cost object, vendor, and payer are frozen',
				'The same receipt file twice on one expense is refused; the same file on two expenses is reported for a person to look at',
				'Reviewed actuals reduce what remains open on a smrt-commerce purchase commitment, each exactly once'
			],
			details: [
				{
					title: 'Money and currencies',
					body: 'Amounts are integer minor units with an ISO 4217 currency. Totals are per currency and never summed across currencies. An expense matched to a commitment must share its currency. Optional financial facts reconcile a subtotal and signed tax components to the amount and yield a cost basis. Recoverable tax is stated explicitly, and no tax law is inferred. A refund is a negative expense that names the expense it refunds.'
				},
				{
					title: 'Expenses in the commerce tax summary',
					body: 'The smrt-commerce tax summary reads reviewed expenses as recoverable tax. Each supplier tax component needs a tenant-approved mapping to one of its tax codes. An unmapped component shows as a warning, never as a zero. An expense drawn against a purchase order that already records its tax is flagged rather than counted twice.'
				},
				{
					title: 'What belongs elsewhere',
					body: 'Allowances are budget records, not expenses. Labour belongs to smrt-timesheets. Receipt OCR and accounting-provider posting are out of scope. Vendors and commitments come from smrt-commerce; a commitment is a PurchaseContract, which is a PurchaseOrder or a ProductionOrder; receipt files come from smrt-assets; profiles are referenced by id without a dependency.'
				},
				{
					title: 'Tenancy',
					body: 'Tenancy is optional by default, like smrt-commerce. A consumer makes it required with registerTenantScopedClass for Expense and ExpenseReceipt. A receipt takes its expense’s tenant, and tenants never move once stored.'
				}
			],
			surfaceNote:
				'Models and collections ship with a closed generated surface: no REST, MCP, WebMCP, or CLI operation reaches cost data. Applications expose expenses through their own permission-checked routes.',
			playgroundNote:
				'The package ships a playground module for its entry and review components. This site does not install the package, so the previews are not rendered here.'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-human-resources',
		'HR records: who works for an organization, as what, and with what standing. Employment with dated terms, and qualifications with expiry.',
		{
			status: 'new',
			components: [
				'EmployeeList',
				'EmployeeForm',
				'PersonQualifications',
				'ExpiringQualificationsList'
			],
			componentImport: '@happyvertical/smrt-human-resources/svelte',
			highlights: [
				'One Employment per tenant and profile with a stable id; a rehire adds a term, and history is append-only',
				'Dates are calendar dates with no timezone; the package has no clock and never flips a status when a date passes',
				'QualificationService.check is the gate before allowing work: not-held, not-yet-issued, expired, suspended, or revoked'
			],
			details: [
				{
					title: 'Employment',
					body: 'hire, end, rehire, changePosition, changeWorkerType, placeOnLeave, and returnFromLeave are dated changes recorded by EmploymentService. An end may be recorded ahead of the last day; employed-on-a-date is answered from the terms, never from the stored status. A login belongs to one employment at a time.'
				},
				{
					title: 'Qualifications',
					body: 'A Qualification defines a ticket, certification, authorization, training, or restriction. A HeldQualification carries issue and expiry dates; a renewal is a new row pointing at the old one. suspend, reinstate, and revoke take an effectiveOn, and standing is decided from the dated history everywhere.'
				},
				{
					title: 'Boundaries',
					body: 'Pay belongs to payroll, time records to smrt-timesheets, logins and permissions to smrt-users, and identity to smrt-profiles. Every model is tenant-scoped, sensitive, and closed; writes go through the two services, which are constructed from a trusted actor the application has already authorized.'
				}
			],
			surfaceNote:
				'Every model and collection publishes no generated REST, MCP, WebMCP, or CLI operation. The application authorizes the acting person and calls EmploymentService or QualificationService.'
		}
	)
];

export const packageCategories: PackageCategory[] = [
	'Foundation',
	'Agents & runtime',
	'Web & UI',
	'Content & media',
	'Business & operations',
	'Domain models',
	'Mobile'
];

export function getPackage(slug: string): SmrtPackage | undefined {
	return packages.find((item) => item.slug === slug);
}

export function packagesInCategory(category: PackageCategory): SmrtPackage[] {
	return packages.filter((item) => item.category === category);
}
