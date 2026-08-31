export type ModuleStatus = 'foundation' | 'focused';

export interface ModuleGuideLink {
	label: string;
	href: string;
}

export type ModulePackageStatus =
	| 'Released'
	| 'New'
	| 'Source distribution'
	| 'Deprecated · compatibility only'
	| 'Not implemented';

export interface ModulePackageReference {
	slug: string;
	status: ModulePackageStatus;
}

export interface ApplicationModuleCluster {
	id: string;
	eyebrow: string;
	title: string;
	summary: string;
	status: ModuleStatus;
	highlights: string[];
	details: string[];
	foundation: string[];
	body: string;
	warning: string[];
	packages: ModulePackageReference[];
	demo: string[];
	guides: ModuleGuideLink[];
	note?: string;
}

/**
 * An outcome-based map of substantial application parts.
 *
 * Package Reference remains the exhaustive inventory. This list selects the
 * packages that remove a recognizable application workload and explains how
 * their released surfaces combine.
 */
export const foundationModuleClusters: ApplicationModuleCluster[] = [
	{
		id: 'identity-and-access',
		eyebrow: '01',
		title: 'Identity and access',
		summary:
			'Give each person a durable identity, tenant membership, session, role, and controlled view of application data.',
		status: 'foundation',
		highlights: [
			'Users, profiles, tenants, memberships, roles, permissions, sessions, access requests, feature decisions, and protected secrets ship as application models and services.',
			'OIDC and terminal sign-in use one session model. Tenant context and operation permissions apply the same identity to generated and custom interfaces.'
		],
		details: [
			'UserList, UserForm, InviteUserModal, TenantSwitcher, membership controls, and field-policy editors supply common administration surfaces.',
			'Field policy can change labels, help, visibility, order, and organization locks without creating a second form schema.'
		],
		foundation: [
			'The packages use the framework manifest, tenant context, generated interfaces, and the shared UI component contracts.',
			'Postgres applications can add generated row-level security. Other databases still use application permission guards and tenant-aware collections.'
		],
		body: 'This foundation removes the separate account, session, tenant, role, permission, invitation, feature-control, and field-preference projects that most applications need.',
		warning: [
			'Postgres supplies the generated row-level security layer. Other databases do not provide that additional data-layer check.'
		],
		packages: [
			{ slug: 'smrt-users', status: 'Released' },
			{ slug: 'smrt-tenancy', status: 'Released' },
			{ slug: 'smrt-profiles', status: 'Released' },
			{ slug: 'smrt-features', status: 'Released' },
			{ slug: 'smrt-fields', status: 'New' },
			{ slug: 'smrt-secrets', status: 'Released' }
		],
		demo: ['smrt-users', 'smrt-tenancy'],
		guides: [{ label: 'Run a multi-tenant lifecycle', href: '/guides/multi-tenant-lifecycle' }]
	},
	{
		id: 'agents-and-automation',
		eyebrow: '02',
		title: 'Agents and automation',
		summary:
			'Run governed agents, durable personas, conversations, schedules, background jobs, and application tools under one principal.',
		status: 'foundation',
		highlights: [
			'Agents declare interests, schedules, tools, tenant bindings, principal limits, and optional learning behavior.',
			'Personas add durable identity, memory, directives, feedback, and approval. Chat and jobs provide conversation and execution records.'
		],
		details: [
			'Agent dashboards, schedule forms, run history, directive review, chat layouts, tool-call views, and job operations ship with the packages.',
			'The shared module UI registry lets an application place package-owned views inside AdminShell or another shared UI surface.'
		],
		foundation: [
			'Principal execution intersects user permissions, agent limits, and persona tool limits before work reaches application models.',
			'The application MCP runtime exposes selected generated tools. The application must authenticate requests before supplying a principal.'
		],
		body: 'These modules remove separate work for persona storage, chat state, schedules, retries, tool policy, job visibility, and agent administration.',
		warning: [
			'smrt-personas and smrt-chat are new. Applications must validate their workflows before broad production use.',
			'smrt-jobs supplies runners and queue controls, but each deployment must select and operate an execution host.'
		],
		packages: [
			{ slug: 'smrt-agents', status: 'New' },
			{ slug: 'smrt-personas', status: 'New' },
			{ slug: 'smrt-chat', status: 'New' },
			{ slug: 'smrt-jobs', status: 'Released' },
			{ slug: 'smrt-prompts', status: 'Released' },
			{ slug: 'smrt-app-mcp', status: 'Released' }
		],
		demo: ['smrt-agents', 'smrt-chat', 'smrt-jobs'],
		guides: [
			{ label: 'Expose your application over MCP', href: '/guides/expose-your-app-over-mcp' },
			{ label: 'Test your application', href: '/guides/testing-your-app' }
		]
	},
	{
		id: 'content-and-media',
		eyebrow: '03',
		title: 'Content and media',
		summary:
			'Create governed content and manage the assets, images, messages, social posts, voice, and video around publication.',
		status: 'foundation',
		highlights: [
			'Content models cover drafts, publication, contributions, reviews, corrections, versions, references, and transparent governance evidence.',
			'Asset and media packages add storage, versions, image processing, communication accounts, message channels, social publishing, voice, and video production records.'
		],
		details: [
			'Content editors, contribution portals, governance views, asset managers, image tools, account lists, message readers, and compose forms ship today.',
			'Package-owned Playground views demonstrate the major content, asset, image, and message workflows.'
		],
		foundation: [
			'Content and media models use the same tenant scope, asset associations, generated interfaces, and shared UI registry as the framework.',
			'Provider-neutral storage boundaries let an application choose local or Ergot-backed processing without changing the content model.'
		],
		body: 'This cluster removes separate editorial workflow, asset library, image tool, inbox, social scheduler, voice record, and video workflow foundations.',
		warning: [
			'Voice, video, and social packages have no registered Playground examples on this site.',
			'External storage, messaging, social, voice, and video operations still require provider configuration and credentials.'
		],
		packages: [
			{ slug: 'smrt-content', status: 'Released' },
			{ slug: 'smrt-assets', status: 'Released' },
			{ slug: 'smrt-assets-local', status: 'Released' },
			{ slug: 'smrt-assets-ergot', status: 'Released' },
			{ slug: 'smrt-images', status: 'Released' },
			{ slug: 'smrt-messages', status: 'Released' },
			{ slug: 'smrt-social', status: 'Released' },
			{ slug: 'smrt-voice', status: 'Released' },
			{ slug: 'smrt-video', status: 'Released' }
		],
		demo: ['smrt-content', 'smrt-assets', 'smrt-images', 'smrt-messages'],
		guides: [],
		note: 'Guide gap: no current task guide follows a complete content or media workflow from configuration through deployment.'
	},
	{
		id: 'commerce-and-operations',
		eyebrow: '04',
		title: 'Commerce and operations',
		summary:
			'Connect products, stock, manufacturing, contracts, invoices, payments, accounting, subscriptions, and fulfillment.',
		status: 'foundation',
		highlights: [
			'Commerce models cover customers, vendors, contracts, invoices, payments, instruments, payouts, fulfillment, and guarded money operations.',
			'Product, inventory, manufacturing, ledger, and subscription models connect catalog demand to stock, production, accounting, plans, grants, and usage.'
		],
		details: [
			'Invoice cards, line items, totals, actions, unbilled work, plan selection, subscription summaries, and usage thresholds ship as Svelte components.',
			'The Commerce Playground shows invoice and unbilled-item workflows. Several supporting packages remain intentionally headless.'
		],
		foundation: [
			'Tenant-scoped models generate consistent data interfaces and permission names. Commerce operations can post balanced entries to smrt-ledgers.',
			'The packages use integer minor units for money and explicit services for guarded stock and payment state changes.'
		],
		body: 'These modules remove the base schemas and lifecycle rules for catalog, stock, production, billing, accounting, entitlement, and fulfillment work.',
		warning: [
			'Applications still supply payment rails, tax calculation, provider settlement, and deployment-specific accounting policy.',
			'smrt-subscriptions has UI components but no registered Playground module on this site.'
		],
		packages: [
			{ slug: 'smrt-commerce', status: 'Released' },
			{ slug: 'smrt-products', status: 'Released' },
			{ slug: 'smrt-inventory', status: 'Released' },
			{ slug: 'smrt-manufacturing', status: 'Released' },
			{ slug: 'smrt-ledgers', status: 'Released' },
			{ slug: 'smrt-subscriptions', status: 'Released' }
		],
		demo: ['smrt-commerce'],
		guides: [],
		note: 'Guide gap: no current task guide follows one order from product and inventory through payment and ledger posting.'
	}
];

export const focusedModuleClusters: ApplicationModuleCluster[] = [
	{
		id: 'support-and-projects',
		eyebrow: '05',
		title: 'Support and projects',
		summary:
			'Route customer cases, connect delivery work, synchronize provider records, and approve the time spent on each result.',
		status: 'focused',
		highlights: [
			'Project models cover repositories, issues, pull requests, time entries, approvals, and provider-neutral synchronization.',
			'Support models add channel-neutral cases, routing, service targets, escalation, audit evidence, and explicit links to delivery work.'
		],
		details: [
			'Time lists, summaries, duration display, approval actions, case queues, case detail, targets, and routing rationale ship with the packages.',
			'The Projects Playground demonstrates time entry, summary, and approval behavior.'
		],
		foundation: [
			'Both packages use tenant-scoped framework models and shared UI contracts. A work link connects support cases to project delivery records.',
			'Provider adapters synchronize external project systems without changing the application-facing model.'
		],
		body: 'This pair removes the first case queue, service-target engine, project provider layer, time ledger, and approval workflow.',
		warning: [
			'smrt-support is new and has no registered Playground example on this site.',
			'Provider synchronization requires application credentials and conflict policy for each connected service.'
		],
		packages: [
			{ slug: 'smrt-projects', status: 'Released' },
			{ slug: 'smrt-support', status: 'New' }
		],
		demo: ['smrt-projects'],
		guides: [],
		note: 'Guide gap: no current task guide connects an inbound support case to approved project delivery work.'
	},
	{
		id: 'analytics-and-growth',
		eyebrow: '06',
		title: 'Analytics and growth',
		summary:
			'Measure application activity, build reports, run campaigns, sell agreements, attribute referrals, and manage growth work.',
		status: 'focused',
		highlights: [
			'Analytics tracks properties, streams, events, and saved reports. Reporting adds materialized aggregates, schedules, locking, and incremental refresh.',
			'Ads, marketing, sales, referrals, commissions, and payouts cover acquisition work from delivery through attributed revenue.'
		],
		details: [
			'Analytics summaries, event tables, campaign dashboards, sales pipelines, agreement lists, attribution queues, and payout review surfaces ship with the modules.',
			'The Analytics Playground demonstrates summary, event, and property views from the released package.'
		],
		foundation: [
			'Provider records and metric snapshots use framework models, tenant scope, background schedules, generated interfaces, and shared UI registration.',
			'Sales keeps agreements, CRM, referrals, and commissions in focused subpaths while preserving one neutral data model.'
		],
		body: 'This cluster removes separate reporting infrastructure, event storage, campaign ledgers, CRM foundations, referral attribution, and commission payout models.',
		warning: [
			'smrt-reports, smrt-marketing, and smrt-sales are new. Provider connectors still require application configuration.',
			'smrt-affiliates is a deprecated compatibility layer. New applications must use the smrt-sales commissions module.'
		],
		packages: [
			{ slug: 'smrt-reports', status: 'New' },
			{ slug: 'smrt-analytics', status: 'Released' },
			{ slug: 'smrt-ads', status: 'Released' },
			{ slug: 'smrt-marketing', status: 'New' },
			{ slug: 'smrt-sales', status: 'New' },
			{ slug: 'smrt-affiliates', status: 'Deprecated · compatibility only' }
		],
		demo: ['smrt-analytics'],
		guides: [],
		note: 'Guide gap: no current task guide follows a measured campaign from event capture through attribution and reporting.'
	},
	{
		id: 'domain-knowledge',
		eyebrow: '07',
		title: 'Domain knowledge',
		summary:
			'Model events, places, facts, properties, sites, and tags without rebuilding their relationships and search behavior.',
		status: 'focused',
		highlights: [
			'Events include series, participants, placements, and nested programs. Places add hierarchy, geocoding, proximity, and lookup-or-create behavior.',
			'Facts preserve provenance, confidence, reconciliation, and evolution. Properties, sites, and tags organize where application knowledge appears.'
		],
		details: [
			'MeetingView supplies a complete event presentation. The other domain packages focus on models and generated interfaces.',
			'The Events Playground demonstrates the released meeting view with package-owned example data.'
		],
		foundation: [
			'Each model joins the framework registry and receives persistence, tenancy where declared, semantic operations, and generated interfaces.',
			'Content can link facts and assets. Sites and properties supply placement boundaries for content, ads, and application features.'
		],
		body: 'These modules remove recurring hierarchy, geospatial, provenance, taxonomy, event, site, and placement models from application projects.',
		warning: [
			'Most domain packages are headless and rely on generated interfaces or application-owned UI.',
			'smrt-gnode contains type definitions and class shells only. Federation discovery and exchange are not implemented.'
		],
		packages: [
			{ slug: 'smrt-events', status: 'Released' },
			{ slug: 'smrt-places', status: 'Released' },
			{ slug: 'smrt-facts', status: 'Released' },
			{ slug: 'smrt-properties', status: 'Released' },
			{ slug: 'smrt-sites', status: 'Released' },
			{ slug: 'smrt-tags', status: 'Released' },
			{ slug: 'smrt-gnode', status: 'Not implemented' }
		],
		demo: ['smrt-events'],
		guides: [{ label: 'Add semantic search', href: '/guides/semantic-search' }]
	},
	{
		id: 'mobile',
		eyebrow: '08',
		title: 'Mobile',
		summary:
			'Build Android and iOS clients on shared contracts, offline state, authentication, evidence capture, and native shells.',
		status: 'focused',
		highlights: [
			'The Kotlin Multiplatform foundation supplies offline packs, durable writes, authenticated networking, evidence capture, and shared state presenters.',
			'The contract package generates mobile allowlists and DTOs. Platform packages add Android and iOS shells and native adapters.'
		],
		details: [
			'smrt-android supplies a Compose shell, theme, and Android adapters. smrt-ios supplies the corresponding SwiftUI shell, theme, and adapters.',
			'Shared presenters let Compose and SwiftUI consume the same application state without sharing platform UI code.'
		],
		foundation: [
			'Mobile sessions use the same user, tenant, permission, and generated application contracts as web clients.',
			'Offline writes replay through the declared synchronization contract instead of bypassing application validation.'
		],
		body: 'This foundation removes separate offline queues, authentication contracts, cross-platform state, evidence capture, networking, and shell architecture for each client.',
		warning: [
			'smrt-mobile, smrt-android, and smrt-ios use source distribution. They are not public npm packages.',
			'This site has no browser Playground for native platform shells. Native applications must supply platform permissions and service configuration.'
		],
		packages: [
			{ slug: 'smrt-mobile', status: 'Source distribution' },
			{ slug: 'smrt-mobile-contract', status: 'New' },
			{ slug: 'smrt-android', status: 'Source distribution' },
			{ slug: 'smrt-ios', status: 'Source distribution' }
		],
		demo: [],
		guides: [],
		note: 'Guide gap: no current task guide builds and verifies one native client from the shared mobile contract.'
	}
];

export const applicationModuleClusters = [...foundationModuleClusters, ...focusedModuleClusters];

export function getApplicationModuleCluster(id: string): ApplicationModuleCluster | undefined {
	return applicationModuleClusters.find((cluster) => cluster.id === id);
}
