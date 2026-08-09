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
	version: string;
	status?: 'stable' | 'new' | 'foundation' | 'private';
}

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
		| 'status'
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
		description: 'Add search, selection, list/grid views, pagination, and richer tabular browsing.',
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
		version: SMRT_VERSION,
		status: options.status ?? 'stable'
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
		{ kind: 'tooling' }
	),
	definePackage(
		'Foundation',
		'smrt-tenancy',
		'Automatic tenant isolation, context propagation, required or optional scope, and tenant-aware query enforcement.',
		{
			highlights: [
				'Required, optional, and global data scopes',
				'AsyncLocalStorage context propagation',
				'Tenant-safe interceptors and STI-aware global queries'
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
				'Reusable mobile auth/session handlers and access-request graduation'
			],
			components: ['UserAvatar', 'UserCard', 'UserForm', 'UserList', 'UserMenu', 'InviteUserModal'],
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
		'Agents & runtime',
		'smrt-agents',
		'Autonomous actors with scheduling, interests, dispatch, durable learning, principal execution, and safe agent-to-agent delegation.',
		{
			status: 'new',
			highlights: [
				'Recall-before and capture-after learning loops',
				'Multi-instance agents backed by durable personas',
				'Principal-bounded worker orchestration with a maximum delegation depth'
			],
			components: [
				'AgentDashboard',
				'AgentScheduleList',
				'AgentScheduleForm',
				'AgentRunHistory',
				'AgentAdminPanel',
				'AgentAdminTabs',
				'AgentSettingsShell'
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
			components: [
				'JobDashboard',
				'JobList',
				'JobDetail',
				'JobStats',
				'JobStatusBadge',
				'JobActions'
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
		{ kind: 'runtime' }
	),
	definePackage(
		'Agents & runtime',
		'smrt-dev-mcp',
		'Development-time knowledge, review, architecture, introspection, and code-generation tools for AI coding agents.',
		{ kind: 'tooling' }
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
				'Reusable collection, table, feedback, disclosure, and overlay patterns',
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
					body: 'CollectionToolbar, CollectionList, and DataTable cover search, selection, list or grid presentation, filtering, pagination, expansion, density, and empty or loading states.'
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
				'SvelteKit server-to-client collection hydration',
				'Live-query bindings and browser AI adapters'
			],
			components: [
				'Provider',
				'TextInput',
				'MoneyInput',
				'ModulePanel',
				'AdminShell',
				'TenantNav',
				'VoiceInput'
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
		'Federation building blocks for local, interoperable knowledge bases.',
		{ kind: 'runtime' }
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
