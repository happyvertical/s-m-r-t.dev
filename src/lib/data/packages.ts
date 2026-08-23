import type { GuideCallout } from '$lib/data/callouts';
import { SMRT_VERSION } from '$lib/version';

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
		| 'notice'
	>
>;

const smrtUiComponentGroups: PackageComponentGroup[] = [
	{
		title: 'Fields and form structure',
		description:
			'Build labelled forms, group related fields, and make validation errors easy to find.',
		importPath: '@happyvertical/smrt-ui/forms',
		components: ['Form', 'Field', 'FormGroup', 'Fieldset', 'InputGroup', 'ErrorSummary']
	},
	{
		title: 'Text and structured input',
		description:
			'Collect free text, selected options, multiple values, tags, dates, times, and files.',
		importPath: '@happyvertical/smrt-ui/forms',
		components: [
			'Input',
			'Textarea',
			'Select',
			'Combobox',
			'Listbox',
			'MultiSelect',
			'TagsInput',
			'DatePicker',
			'TimePicker',
			'FilePicker'
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
		title: 'Agent interaction contracts',
		description:
			'Give chat, voice, tutorial, or test adapters a stable way to inspect and assist with forms.',
		importPath: '@happyvertical/smrt-ui/forms',
		components: [
			'createControlInteractionRegistry',
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
			'Explain status and progress, or open a focused task while preserving keyboard and focus behavior.',
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
			'Modal',
			'Drawer',
			'Sheet',
			'ConfirmDialog'
		]
	},
	{
		title: 'Collections and tables',
		description:
			'Search, select, filter, page, and present typed collections with durable, serializable table view state.',
		importPath: '@happyvertical/smrt-ui/data',
		components: ['CollectionToolbar', 'CollectionList', 'ContentList', 'DataTable']
	},
	{
		title: 'Layout',
		description:
			'Compose the page around the working controls without tying the package to an application domain.',
		importPath: '@happyvertical/smrt-ui/layout',
		components: [
			'Container',
			'Grid',
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
		description: 'Present month and day schedules through the focused calendar entry point.',
		importPath: '@happyvertical/smrt-ui/calendar',
		components: ['Calendar', 'DayView']
	},
	{
		title: 'Membership and permission UI',
		description:
			'Domain-neutral views typed against shared membership, role, and permission contracts.',
		importPath: '@happyvertical/smrt-ui',
		components: ['MembershipCard', 'MembershipList', 'PermissionCheck', 'RoleBadge', 'RoleSelector']
	},
	{
		title: 'Module UI registry',
		description:
			'Register package-owned working surfaces without importing domain packages into the foundation.',
		importPath: '@happyvertical/smrt-ui/registry',
		components: ['createModuleUIRegistry', 'ModuleUIRegistry']
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
			'beginOidcLogin',
			'completeOidcLogin'
		]
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
			'Provider-backed inputs for the values applications actually collect, beyond the foundation controls.',
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
		description: 'Framework-neutral capability detection and the adapters behind the hooks.',
		importPath: '@happyvertical/smrt-svelte/browser-ai',
		components: [
			'detectCapabilities',
			'canEnableSmrtMode',
			'getBestLLMBackend',
			'getBestSTTBackend',
			'WebLLMAdapter',
			'BrowserSpeechSTTAdapter',
			'WhisperWasmSTTAdapter',
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
		version: SMRT_VERSION,
		status: options.status ?? 'stable',
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
				'Change feeds, conditional reads, sync apply, REST, MCP, WebMCP, and CLI generation'
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
				'Tenant-safe interceptors across lookups, hydration, search, and collection memory'
			],
			details: [
				{
					title: 'Scope covers each read path',
					body: 'Tenant context applies to list and get calls, slug lookups, model hydration, vector search, and collection memory. Required models fail closed without a tenant context; system and super-admin contexts are the explicit cross-tenant paths.'
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
				'OIDC login and terminal device-code auth on one session model',
				'Reusable mobile auth/session handlers and access-request graduation'
			],
			componentGroups: usersComponentGroups,
			components: usersComponentGroups.flatMap((group) => group.components),
			details: [
				{
					title: 'OIDC login against your identity provider',
					body: 'Declare providers under packages.users.auth.oidc and mount createOidcLoginHandler and createOidcCallbackHandler from the /sveltekit subpath. Each login mints an independent state, nonce, and PKCE verifier; the challenge method is always S256. The callback checks state, the RFC 9207 authorization-response issuer, the provider error, the JWKS-signed ID token, and the nonce before it will read claims, and falls back to the UserInfo endpoint when the ID token omits email.',
					href: '/foundations/users-and-profiles',
					linkLabel: 'See the sign-in flows'
				},
				{
					title: 'First identity binding fails closed',
					body: 'When a new issuer and subject resolve to a canonical global Person that already has an owning User, provisioning stops with OidcProvisioningError code profile_owned before it creates a new User, OIDC identity, or session. An application that runs its own invitation or approval workflow can supply the authorizeProfileOwner hook to authorize that first binding. Returning undefined keeps the fail-closed default and null rejects the login.',
					href: '/foundations/users-and-profiles',
					linkLabel: 'See the sign-in flows'
				},
				{
					title: 'Terminal device-code sign-in',
					body: 'TerminalAuthService runs the device-code flow for command-line tools: createRequest returns a device code the CLI keeps, a short user code the person types, and a verification URL. The device code is stored only as a hash, approval is idempotent, and exchangeDeviceCode answers pending, expired, or approved with a bearer token that resolves to the same session context as a browser cookie. Because user codes are short, failed approvals are rate limited per user and the handler surfaces that as 429.',
					href: '/foundations/users-and-profiles',
					linkLabel: 'See the sign-in flows'
				},
				{
					title: 'Sync the permission catalog after migration',
					body: 'syncPermissionCatalog merges three sources — permissions derived from the manifest, custom entries declared in smrt.config.ts, and definitions added at runtime — and reconciles them into Permission rows. It reports created, updated, and unchanged slugs, is safe to run on every deploy, and is additive: it never deletes a stale permission, grants a role, or emits row-level-security SQL.',
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
				'Time-bounded relationship terms and contextual third parties'
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
						'Build a create or edit form from generated browser field definitions and a resolved policy, or register every generated collection once and let forms ask for their object reference.',
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
				}
			],
			surfaceNote:
				'Policy rows are not a browsable resource. FieldPolicy generates create, update, and delete routes plus three collection actions (resolve, editor-state, policy-audit); generated list and get are deliberately closed because this model is not tenant-scoped and reading it freely would enumerate every tenant and user row. The generated CLI mirrors that shape and is writes-only; MCP is closed entirely.',
			playgroundNote:
				'This package does export a ./playground module, with a policy-driven form and a generated ObjectForm. It is not registered on this site yet: its Policy-Driven Form preview throws on mount because the preview renders FormHelp outside its FieldPolicyProvider. Tracked upstream as happyvertical/smrt#2272; the module goes back in once a release carries the fix.'
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
					title: 'The host owns the process, not the agent',
					body: 'Signal handling is opt-in. Construct an agent with manageProcessSignals set to true and it installs SIGTERM and SIGINT handlers that shut down and exit; omit it — the default — and nothing is registered, which is what a server or job runner wants. Do not enable it for several agents in one process unless the host coordinates shutdown itself, because the first handler to finish exits the process.'
				},
				{
					title: 'Resolve tenant agents, do not list them',
					body: 'TenantAgent rows are explicit bindings between a tenant and an agent class. To answer what a tenant can actually run, call resolveForTenant on TenantAgentCollection with the tenant id and a function that returns its ancestor ids: it merges manifest permission defaults under explicit overrides, walks the tenant tree for inherited agents, and marks each result explicit or inherited with the tenant it came from. A plain list returns only the explicit rows, with no inheritance, no merged permissions, and no provenance.',
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
					body: 'AgentSchedule records the cron expression, next and last run, concurrency ceiling, timeout, target method, and success and failure counts. The runner that fires those schedules lives in smrt-jobs, so an application chooses its own execution host rather than inheriting a background worker with the agent model.',
					href: '/packages/smrt-jobs',
					linkLabel: 'smrt-jobs'
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
					title: 'Say which methods a job may call',
					body: 'A persisted job row names an object type and a method, so the runner needs to know which methods are reachable. Mark a method with the backgroundEligible decorator, or call markBackgroundEligible for non-decorator code, and the class gains an allowlist. The rule is deliberately restrictive rather than enabling: a class that marks nothing keeps the default behavior, but once any method is marked the runner refuses every method outside the list.'
				},
				{
					title: 'One tenant cannot drain the queue',
					body: 'Enqueueing checks how many non-terminal jobs a tenant already holds and refuses to add another past the cap, which defaults to ten thousand and can be set per call or through the job builder. Setting it to zero disables the check, and jobs with no tenant are never counted against it. Requested retry counts are clamped to the supported maximum instead of being rejected, so a misconfigured caller cannot pin a worker on a poison job.'
				},
				{
					title: 'Retention starts after the runner is stable',
					body: 'TaskRunner schedules its first retention sweep one interval after start, never at startup. The default policy retains completed or cancelled jobs for seven days, failed jobs and events for thirty days, and supports dry-run cleanup before a deletion policy changes.'
				}
			],
			componentImport: '@happyvertical/smrt-jobs/svelte',
			exampleResource: 'jobs'
		}
	),
	definePackage(
		'Agents & runtime',
		'smrt-chat',
		'Rooms, direct messages, threads, persona-bound conversations, tool loops, and voice workbench surfaces.',
		{
			status: 'new',
			components: [
				'ChatLayout',
				'MessageList',
				'MessageInput',
				'AgentChat',
				'ToolCallDisplay',
				'MiniChat'
			],
			componentImport: '@happyvertical/smrt-chat/svelte',
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
					body: 'The package trusts the principal supplied by the application adapter. It does not implement an OAuth authorization server and does not validate bearer tokens itself, so a public deployment validates the token at the gateway and populates the request principal, tenant, and permissions only after that succeeds.',
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
				'Fifteen read-only tools over a workspace, with no access to application data',
				'A declared ok, coverage, diagnostics, and data result envelope on every tool',
				'Ships as a self-contained Agent Plugin with one bundled review skill'
			],
			details: [
				{
					title: 'The Tier 2 development plane',
					body: 'The server reads source, manifests, and authored documentation from a workspace on disk. It never writes files, never executes generated code, and calls no model provider: review and architecture tools return deterministic findings plus a reusable prompt bundle.',
					href: '/tooling/dev-mcp',
					linkLabel: 'smrt-dev-mcp'
				},
				{
					title: 'Coverage instead of a silent empty answer',
					body: 'Package discovery reads the workspace globs and records where each package objects came from. Discovering nothing is an error-grade diagnostic naming the roots and artifact paths checked, so an unreadable project is never reported as a project with no model.',
					href: '/tooling/knowledge',
					linkLabel: 'Knowledge tooling'
				}
			]
		}
	),

	definePackage(
		'Web & UI',
		'smrt-ui',
		'Provider-free Svelte 5 components for accessible forms, agent-assisted controls, feedback, collections, overlays, layouts, and themes.',
		{
			kind: 'ui',
			status: 'new',
			highlights: [
				'One component contract for semantics, keyboard use, state, themes, and testing',
				'Forms that chat, voice, tutorials, and tests can address through a consent-aware registry',
				'Reusable collection, table, feedback, disclosure, and overlay patterns with stable row identity',
				'Package-owned working examples in the shared playground'
			],
			componentGroups: smrtUiComponentGroups,
			components: smrtUiComponentGroups.flatMap((group) => group.components),
			details: [
				{
					title: 'A shared component standard',
					body: 'Foundation controls use native semantics first, stable server-safe IDs, Svelte 5 bindable state, visible focus and validation states, reduced-motion rules, semantic design tokens, and focused accessibility tests.'
				},
				{
					title: 'Forms agents can assist with',
					body: 'Controls can publish their identity, meaning, options, constraints, sensitivity, and current state. An adapter may point to a field or propose a change, while the form keeps consent and secret handling explicit.',
					href: '/capabilities/agent-assisted-forms',
					linkLabel: 'Learn how agent-assisted forms work'
				},
				{
					title: 'Reusable collection surfaces',
					body: 'CollectionToolbar, CollectionList, and DataTable cover search, selection, list or grid presentation, filtering, pagination, expansion, density, and empty or loading states. DataTable keeps a stable row key through local transforms and exposes serializable controller state when the application owns filtering, sorting, or paging.'
				},
				{
					title: 'Feedback and focused tasks',
					body: 'Alerts, toasts, progress, meters, drawers, popovers, disclosure, and accordions share the same status, focus, keyboard, motion, and theme conventions as the form controls.'
				},
				{
					title: 'Focused public imports',
					body: 'Import from /forms, /ui, /feedback, /data, /layout, and /themes so application code says which part of the foundation it depends on. The package root remains a compatibility barrel.'
				}
			],
			componentImport: '@happyvertical/smrt-ui/forms'
		}
	),
	definePackage(
		'Web & UI',
		'smrt-svelte',
		'The top-of-stack Svelte integration: Provider, rich forms, browser AI, live collections, permissions, and AdminShell.',
		{
			kind: 'ui',
			status: 'new',
			highlights: [
				'Four-edge AdminShell with tenant navigation and activity feeds',
				'Tenant navigation built from the manifest, not hand-written',
				'SvelteKit server-to-client collection and message hydration',
				'Live-query bindings and browser AI adapters with a warm cache'
			],
			componentGroups: smrtSvelteComponentGroups,
			components: smrtSvelteComponentGroups.flatMap((group) => group.components),
			details: [
				{
					title: 'Navigation the manifest already describes',
					body: 'tenantNavFromManifest turns a manifest into ordered nav sections. It drops collections, internal and test classes, and anything without a REST list route, then drops single-table-inheritance subtypes that share a parent collection, because the polymorphic endpoint at that shared URL already covers them. Pass permittedResources and it filters to what a role may see, walking up the inheritance chain so a permitted subtype does not lose the base link it actually routes through. Output is sorted, so manifest churn never reshuffles the sidebar.',
					href: '/capabilities/application-shell',
					linkLabel: 'How the shell is composed'
				},
				{
					title: 'AdminShell replaced the first-generation shells',
					body: 'The public workspace surface is the four-edge AdminShell contract. The earlier WorkspaceShell and RoleShell primitives remain in the package as migration references only and are not exported from any subpath, so new work should compose AdminShell panels and focus tools. The focus-tool dock from that generation stays reachable on the workspace/legacy subpath while applications move across.',
					href: '/capabilities/application-shell',
					linkLabel: 'How the shell is composed'
				},
				{
					title: 'Browser AI preloads on a strategy you choose',
					body: 'Provider accepts a preload strategy of none, eager, idle, or on-visible; idle is the default and schedules work in an idle callback. eager starts immediately, none defers every adapter to first use, and on-visible is a manual mode: the package schedules nothing and the application decides when to trigger the preload. Adapters warm sequentially, one failure is recorded rather than aborting the rest, and an initialized adapter is kept in a module-level cache so navigation does not re-download a model.'
				},
				{
					title: 'Calling a local model from a component',
					body: 'useLLM runs inside the Provider and exposes initialize, chat, and unload alongside reactive isReady, isGenerating, currentModel, error, and downloadProgress values. Streaming is delivered through an onToken callback while chat still resolves to the finished string. Unmounting deliberately does not unload the model, because the download is the expensive part.'
				},
				{
					title: 'One language snapshot per render',
					body: 'buildI18nSnapshot resolves message templates for a locale on the server, including tenant overrides, and Provider accepts the result. Variables are interpolated in the browser, and a missing key falls back to the registered English default and then to the key itself, so a partly translated app still renders. The matching useI18n store and Trans component live in the UI foundation.',
					href: '/packages/smrt-ui',
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
				'WebMCP data-plane tools'
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
				'Clearly labelled mock and live modes with package overview pages'
			],
			components: ['PlaygroundHost'],
			componentImport: '@happyvertical/smrt-playground/svelte'
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
		'The framework developer CLI for manifests, database migrations, testing, introspection, and generated resources.',
		{ kind: 'tooling' }
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
		'The recommended SvelteKit application scaffold with s-m-r-t integration and AdminShell as the default chrome.',
		{ kind: 'tooling' }
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
			exampleResource: 'images'
		}
	),
	definePackage(
		'Content & media',
		'smrt-messages',
		'A unified STI hierarchy for email, social, and other communication channels.',
		{
			components: ['AccountList', 'MessageList', 'MessageDetail', 'ComposeForm'],
			componentImport: '@happyvertical/smrt-messages/svelte',
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
		'Customers, vendors, contracts, invoices, payments, payment instruments, and fulfillment.',
		{
			components: [
				'InvoiceCard',
				'InvoiceHeader',
				'InvoiceLineItems',
				'InvoiceTotals',
				'InvoiceActions',
				'UnbilledItems'
			],
			componentImport: '@happyvertical/smrt-commerce/svelte',
			exampleResource: 'invoices'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-products',
		'A product catalogue and reference module for package, federation, standalone, and browser-store consumption.',
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
		{ exampleResource: 'journal-entries' }
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
		'Materialized aggregate read models with decorators, rebuild and incremental refresh, schedules, locking, and tenant fan-out.',
		{
			status: 'new',
			highlights: [
				'Decorated groupings, measures, and time buckets',
				'Incremental refresh with watermarks and affected-group recomputation',
				'Durable scheduled refresh through smrt-jobs'
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
			status: 'new',
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
		// No exampleResource: as of 0.40 the shim declares no models of its own, so
		// it generates no REST, MCP, WebMCP, or CLI surface. The models live in
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
			status: 'new',
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
		'Provider-neutral projects, repositories, issues, pull requests, and time workflows.',
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
			exampleResource: 'projects'
		}
	),
	definePackage(
		'Business & operations',
		'smrt-support',
		'Channel-neutral support cases with lifecycle, routing, service targets, escalation, and auditable service time.',
		{
			status: 'new',
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
					body: 'The exported type definitions are stable enough to design against: a peer is a url, name, discoveredAt, and optional lastSeen, and federation configuration covers enabled, discoverability, peers, autodiscovery, and peerExchange. Nothing behind those types performs network work.'
				},
				{
					title: 'What is still to be built',
					body: 'Peer discovery over WebFinger, the peer-exchange endpoint, and cross-gnode querying are all unimplemented. Until they land, an application that needs federation has to implement the transport itself rather than importing it from here.'
				},
				{
					title: 'Check upstream before you plan around it',
					body: 'The source is the current truth. The README carries the same stubs-only warning, but parts of it lag the code: it reports no dependencies while the package declares smrt-core and several SDK adapters. Read the source before assuming any of the planned behavior has arrived.',
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
		{ kind: 'tooling', status: 'new' }
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
