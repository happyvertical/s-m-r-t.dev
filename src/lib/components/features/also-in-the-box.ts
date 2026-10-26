/**
 * "Also in the box": up to three real components a feature ships beyond its
 * live example, shown as tiles under the example frame (#364).
 *
 * Every `name` is exported from `from` at the release this site documents.
 * Checked against the published tarballs for `SMRT_VERSION` (the packages the
 * site does not install were scratch-installed), not from memory. A feature
 * with no Svelte surface has no entry here, and its page leaves the section
 * out rather than inventing one. `features.test.ts`-style drift is caught by
 * `also-in-the-box.test.ts`, which pins the shape; the export check itself is
 * a manual step when `SMRT_VERSION` moves (`pnpm run update:smrt`).
 */

export interface FeatureComponent {
	/** The exported component name. */
	name: string;
	/** The import path it comes from. */
	from: string;
	/** One plain sentence about what it does for the person using it. */
	line: string;
}

const tile = (name: string, from: string, line: string): FeatureComponent => ({
	name,
	from: `@happyvertical/${from}`,
	line
});

/** Keyed by feature id. Missing key = no component tiles for that feature. */
export const alsoInTheBox: Record<string, FeatureComponent[]> = {
	// Agents
	tools: [
		tile(
			'ToolCallDisplay',
			'smrt-chat/svelte',
			'A tool call and its result, shown in the conversation.'
		)
	],
	agents: [
		tile('AgentScheduleForm', 'smrt-agents/svelte', 'When an agent runs.'),
		tile('AgentRunHistory', 'smrt-agents/svelte', 'Every run an agent has made.'),
		tile('ScheduleStatusBadge', 'smrt-agents/svelte', 'Whether a schedule is on, at a glance.')
	],
	forms: [
		tile(
			'StagedControlReview',
			'smrt-ui/forms',
			'Where a person reviews what an agent proposed, then applies it.'
		)
	],
	memory: [
		tile(
			'DirectiveReviewQueue',
			'smrt-personas/svelte',
			'Directives an agent proposed, waiting for a person.'
		)
	],
	ingestion: [
		tile('IntakeInbox', 'smrt-ingestion/svelte', 'Documents that have arrived.'),
		tile('IntakeReview', 'smrt-ingestion/svelte', 'One document, and what was read from it.'),
		tile('EvidenceViewer', 'smrt-ingestion/svelte', 'The original beside what was extracted.')
	],
	jobs: [
		tile('JobList', 'smrt-jobs/svelte', 'Every job and where it stands.'),
		tile('JobDetail', 'smrt-jobs/svelte', 'One job, its attempts and its result.'),
		tile('JobStatusBadge', 'smrt-jobs/svelte', 'Queued, running, failed or done.')
	],
	webhooks: [
		tile(
			'WebhookAdmin',
			'smrt-webhooks/svelte',
			'Subscriptions and their deliveries, for an administrator.'
		)
	],

	// Basics
	records: [
		tile('DataTable', 'smrt-ui/data', 'Any collection as a sortable, selectable table.'),
		tile('CollectionList', 'smrt-ui/data', 'Any collection as a list of cards.')
	],
	fields: [
		tile('FieldPolicyEditor', 'smrt-fields/svelte', 'Edit labels, defaults and locks for a layer.'),
		tile(
			'FieldPolicySuggestionQueue',
			'smrt-fields/svelte',
			'Suggested policy changes, waiting for review.'
		),
		tile(
			'FieldPolicyGearButton',
			'smrt-fields/svelte',
			'A gear beside a field that opens its policy.'
		)
	],
	flags: [
		tile('FeatureSettingsPanel', 'smrt-features/svelte', 'Switch a feature on or off for a tenant.')
	],
	people: [
		tile('SignInForm', 'smrt-users/svelte', 'Sign in.'),
		tile('AccountSecurityPanel', 'smrt-users/svelte', 'Passkeys and sessions for one account.'),
		tile('UserMenu', 'smrt-users/svelte', 'Who is signed in, and how to sign out.')
	],
	tenants: [tile('TenantCard', 'smrt-tenancy/svelte', 'A tenant at a glance.')],
	reports: [
		tile('SavedReports', 'smrt-reports/svelte', 'The reports a person has saved.'),
		tile('ReportPicker', 'smrt-reports/svelte', 'Choose a source, its measures and groupings.'),
		tile(
			'ReportConfirmation',
			'smrt-reports/svelte',
			'A person confirms the exact report before it is saved.'
		)
	],

	// Screens
	shell: [
		tile('AppShell', 'smrt-svelte/app', 'Navigation, panels and a dock around your pages.'),
		tile(
			'AdminShell',
			'smrt-svelte/workspace',
			'A workspace shell with a rail, panels and content.'
		),
		tile(
			'CommandPalette',
			'smrt-svelte/command-palette',
			'Jump to any page or record from the keyboard.'
		)
	],

	// Content
	articles: [
		tile('ArticleList', 'smrt-content/svelte', 'Published articles as cards.'),
		tile('ContentContributionInbox', 'smrt-content/svelte', 'Contributions waiting for an editor.'),
		tile('Markdown', 'smrt-content/svelte', 'A body written in Markdown, rendered.')
	],
	assets: [
		tile('AssetManager', 'smrt-assets/svelte', 'Browse, upload and organise files.'),
		tile('AssetDetail', 'smrt-assets/svelte', 'One file and its details.'),
		tile('AttachmentPanel', 'smrt-assets/svelte', 'Files attached to any record.')
	],
	images: [
		tile('ImageUploader', 'smrt-images/svelte', 'Add an image to a record.'),
		tile('AssetsGallery', 'smrt-images/svelte', 'A gallery of a record’s images.')
	],
	voice: [tile('VoiceInput', 'smrt-svelte/browser-ai/svelte', 'Speak instead of type.')],
	comments: [
		tile('RecordComments', 'smrt-comments/svelte', 'A discussion on any record.'),
		tile('ModerationQueue', 'smrt-comments/svelte', 'Comments waiting for a moderator.')
	],

	// Messaging
	chat: [
		tile('MessageList', 'smrt-chat/svelte', 'The messages in a room.'),
		tile('MessageInput', 'smrt-chat/svelte', 'The box people type into.'),
		tile('AgentChat', 'smrt-chat/svelte', 'A conversation with an agent.')
	],
	email: [
		tile('ComposeForm', 'smrt-messages/svelte', 'Write a message.'),
		tile('ThreadView', 'smrt-messages/svelte', 'A conversation as a thread.'),
		tile('SendStatusBadge', 'smrt-messages/svelte', 'Whether a message was sent.')
	],
	slack: [
		tile('AccountCard', 'smrt-messages/svelte', 'One connected account at a glance.'),
		tile('MessageList', 'smrt-messages/svelte', 'The messages from an account.'),
		tile('MessageTypeBadge', 'smrt-messages/svelte', 'Which kind of message this is.')
	],
	social: [
		tile('SocialAccountSettings', 'smrt-social/svelte', 'Connect and manage social accounts.')
	],

	// Commerce
	commerce: [
		tile('InvoiceEditor', 'smrt-commerce/svelte', 'Build an invoice line by line.'),
		tile('QuoteEditor', 'smrt-commerce/svelte', 'Draft a quote.'),
		tile('CustomerDirectory', 'smrt-commerce/svelte', 'Your customers, searchable.')
	],
	products: [
		tile('ProductCard', 'smrt-products/components', 'A product at a glance.'),
		tile('ProductForm', 'smrt-products/components', 'Create or edit a product.')
	],
	subscriptions: [
		tile('PlanPicker', 'smrt-subscriptions/svelte', 'Choose a plan.'),
		tile('SubscriptionSummary', 'smrt-subscriptions/svelte', 'Plan, status and renewal.'),
		tile('UsageThresholds', 'smrt-subscriptions/svelte', 'Usage against each limit.')
	],

	// Operations
	inventory: [
		tile('StockLevels', 'smrt-inventory/svelte', 'What is on hand, by location.'),
		tile('MovementHistory', 'smrt-inventory/svelte', 'Every movement, in order.'),
		tile('AdjustStockForm', 'smrt-inventory/svelte', 'Correct a count.')
	],
	manufacturing: [
		tile('BomEditor', 'smrt-manufacturing/svelte', 'Edit a bill of materials.'),
		tile('BomStructureTree', 'smrt-manufacturing/svelte', 'A product’s parts, level by level.'),
		tile('ProductionRunList', 'smrt-manufacturing/svelte', 'Production runs and their state.')
	],
	projects: [
		tile('DevelopmentBoard', 'smrt-projects/svelte', 'Requests moving across a board.'),
		tile('DeliveryStatus', 'smrt-projects/svelte', 'Where delivery stands.')
	],
	support: [
		tile('CaseQueue', 'smrt-support/svelte', 'Open cases waiting for someone.'),
		tile('CaseDetail', 'smrt-support/svelte', 'One case and its timeline.'),
		tile('TargetList', 'smrt-support/svelte', 'Service targets.')
	],
	timesheets: [
		tile('TimeEntryList', 'smrt-timesheets/svelte', 'Time entries for a period.'),
		tile('TimeEntryApprovalQueue', 'smrt-timesheets/svelte', 'Entries waiting for approval.'),
		tile('TimeSummary', 'smrt-timesheets/svelte', 'Hours added up.')
	],
	expenses: [
		tile('ExpenseReviewQueue', 'smrt-expenses/svelte', 'Expenses waiting for review.'),
		tile('ExpenseReceiptCapture', 'smrt-expenses/svelte', 'Attach a receipt.'),
		tile('ExpenseForm', 'smrt-expenses/svelte', 'Enter an expense.')
	],
	hr: [
		tile('EmployeeList', 'smrt-human-resources/svelte', 'Everyone you employ.'),
		tile('PersonQualifications', 'smrt-human-resources/svelte', 'One person’s qualifications.'),
		tile(
			'ExpiringQualificationsList',
			'smrt-human-resources/svelte',
			'Qualifications about to lapse.'
		)
	],

	// Marketing
	campaigns: [
		tile('CampaignList', 'smrt-marketing/svelte', 'Every campaign and its state.'),
		tile('BudgetPacing', 'smrt-marketing/svelte', 'Spend against budget.'),
		tile('ChannelMix', 'smrt-marketing/svelte', 'Where a campaign runs.')
	],
	affiliates: [
		tile('ReferralLinkManager', 'smrt-sales/svelte', 'Create and manage referral links.'),
		tile('ReferrerEarningsSummary', 'smrt-sales/svelte', 'What a referrer has earned.')
	],
	sales: [
		tile('SalesDashboard', 'smrt-sales/svelte', 'Sales at a glance.'),
		tile('OpportunityBoard', 'smrt-sales/svelte', 'Opportunities moving across a board.'),
		tile('CommissionBreakdown', 'smrt-sales/svelte', 'How a commission was worked out.')
	],
	analytics: [
		tile('StatCard', 'smrt-analytics/svelte', 'One number, with context.'),
		tile('TrendBadge', 'smrt-analytics/svelte', 'Up, down or flat.'),
		tile('EventsTable', 'smrt-analytics/svelte', 'Events as they were recorded.')
	],

	// World
	events: [tile('CalendarView', 'smrt-ui/calendar', 'Events laid out on a calendar.')],
	places: [tile('AddressInput', 'smrt-svelte/forms', 'An address field.')],
	tags: [tile('TagsInput', 'smrt-ui/forms', 'Pick or create tags in a field.')]
};
