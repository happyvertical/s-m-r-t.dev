/**
 * Where every `/features/<section>/<feature>` and `/features/<section>` URL
 * the site served before the #375 regrouping goes now. The nine old sections
 * and forty-nine features are frozen here because `features.ts` no longer holds
 * them; the routes prerender one 301 per entry, and `legacy-routes.test.ts`
 * counts them and checks every target is a live page, never another redirect.
 *
 * A feature that stayed on the map goes to its new page; one that left it goes
 * to the Docs page that already documents it.
 */

/** Old section id → its new group, or the Docs page when no group fits. */
export const legacySectionTargets: Record<string, string> = {
	agents: '/features/assistant',
	basics: '/docs/foundations',
	screens: '/docs/ui',
	content: '/features/publish',
	messaging: '/features/talk',
	commerce: '/features/sell',
	operations: '/features/plan',
	marketing: '/features/grow',
	world: '/features/plan'
};

/** Old `section/feature` → target. */
export const legacyFeatureTargets: Record<string, string> = {
	'agents/tools': '/features/assistant/tools',
	'agents/blueprint': '/docs/capabilities/agent-legible-applications',
	'agents/agents': '/features/assistant/agents',
	'agents/forms': '/docs/capabilities/agent-assisted-forms',
	'agents/memory': '/features/assistant/memory',
	'agents/approvals': '/features/team/approvals',
	'agents/ingestion': '/docs/reference/packages/smrt-ingestion',
	'agents/jobs': '/docs/reference/packages/smrt-jobs',
	'agents/webhooks': '/docs/reference/packages/smrt-webhooks',
	'agents/facts': '/docs/reference/packages/smrt-facts',
	'basics/records': '/docs/foundations/objects-and-collections',
	'basics/fields': '/docs/reference/packages/smrt-fields',
	'basics/flags': '/docs/reference/packages/smrt-features',
	'basics/people': '/features/team/people',
	'basics/tenants': '/docs/foundations/tenants',
	'basics/realtime': '/docs/capabilities/live-data',
	'basics/reports': '/features/grow/reports',
	'screens/shell': '/docs/capabilities/application-shell',
	'screens/mobile': '/docs/capabilities/mobile',
	'content/articles': '/features/publish/articles',
	'content/assets': '/features/publish/images',
	'content/images': '/features/publish/images',
	'content/voice': '/features/publish/voice',
	'content/video': '/features/publish/video',
	'content/comments': '/features/publish/comments',
	'messaging/chat': '/features/talk/chat',
	'messaging/email': '/features/talk/email',
	'messaging/slack': '/features/talk/slack',
	'messaging/social': '/features/publish/social',
	'commerce/commerce': '/features/sell',
	'commerce/products': '/features/sell/products',
	'commerce/ledgers': '/docs/reference/packages/smrt-ledgers',
	'commerce/subscriptions': '/features/sell/subscriptions',
	'operations/inventory': '/features/buy/inventory',
	'operations/manufacturing': '/features/make/assemblies',
	'operations/projects': '/features/plan/projects',
	'operations/support': '/features/talk/support',
	'operations/timesheets': '/features/team/timesheets',
	'operations/expenses': '/features/buy/expenses',
	'operations/hr': '/features/team/hr',
	'marketing/campaigns': '/features/grow/campaigns',
	'marketing/ads': '/features/grow/ads',
	'marketing/affiliates': '/features/grow/affiliates',
	'marketing/sales': '/docs/reference/packages/smrt-sales',
	'marketing/analytics': '/features/grow/analytics',
	'marketing/properties': '/docs/reference/packages/smrt-properties',
	'world/events': '/features/plan/events',
	'world/places': '/features/plan/places',
	'world/tags': '/docs/reference/packages/smrt-tags'
};
