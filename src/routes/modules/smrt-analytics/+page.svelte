<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-analytics"
	description="GA4 / Plausible / Matomo analytics with server-side event tracking, scheduled reports, and tenant-overridable AI prompts via smrt-prompts."
	badges={['v0.29.34', 'GA4', 'Plausible', 'Matomo', 'Prompt Registry']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-analytics</strong> covers GA4, Plausible, and Matomo properties, data streams,
			server-side events, and saved reports. AI methods (<code>analyzePerformance()</code>,
			<code>analyzeResults()</code>, <code>hasPositiveTrends()</code>) route through
			<a href="/modules/smrt-prompts">smrt-prompts</a> so tenants can override templates and models
			without code changes. UI components auto-register slots with
			<code>ModuleUIRegistry</code> from <code>@happyvertical/smrt-svelte</code>.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Three providers: GA4 (Measurement Protocol), Plausible (Events API), Matomo</li>
				<li>
					STI everywhere (<code>tableStrategy: 'sti'</code>): <code>AnalyticsProperty</code>,
					<code>AnalyticsDataStream</code>, <code>AnalyticsEvent</code>,
					<code>AnalyticsReport</code>
				</li>
				<li>
					Server-side event tracking with retry queue (<code>pending</code>/<code>sent</code>/<code
						>failed</code
					>)
				</li>
				<li>
					Scheduled reports (<code>once</code>/<code>daily</code>/<code>weekly</code>/<code
						>monthly</code
					>) with cached result data
				</li>
				<li>
					<strong>Three registered prompts</strong> via smrt-prompts — tenant-overridable templates, models,
					and params
				</li>
				<li>
					<strong>UI slot registry</strong>: <code>analytics-summary</code>,
					<code>events-table</code>, <code>property-info</code>, <code>property-status-badge</code>,
					<code>stat-card</code>, <code>trend-badge</code>
				</li>
				<li>
					Tenancy-fallback: omits <code>tenantId</code> so <code>withTenant()</code> context applies automatically
				</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-analytics`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  AnalyticsProperty, AnalyticsPropertyCollection,
  AnalyticsDataStream, AnalyticsDataStreamCollection,
  AnalyticsEvent, AnalyticsEventCollection,
  AnalyticsProvider, DataStreamType
} from '@happyvertical/smrt-analytics';

// Initialize collections
const properties = new AnalyticsPropertyCollection(db);
const streams = new AnalyticsDataStreamCollection(db);
const events = new AnalyticsEventCollection(db);

// Create GA4 property
const property = await properties.create({
  name: 'main-site',
  displayName: 'Main Site Analytics',
  provider: AnalyticsProvider.GA4,
  externalId: 'properties/123456789',
  measurementId: 'G-XXXXXXXXXX',
  apiSecret: 'server-side-secret',
  status: 'active',
});

// Add a web data stream
await streams.create({
  propertyId: property.id,
  displayName: 'Web Traffic',
  streamType: DataStreamType.WEB,
  measurementId: 'G-XXXXXXXXXX',
  defaultUri: 'https://example.com',
  status: 'active',
});

// Track a server-side event with retry support
const event = await events.create({
  propertyId: property.id,
  eventName: 'purchase',
  clientId: 'client-uuid',
  params: JSON.stringify({ value: 99.99, currency: 'USD' }),
  status: 'pending',
});

// After sending: markSent() / markFailed('timeout') mutate in place (sync),
// then persist with save()
event.markSent();
await event.save();`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>AnalyticsProperty</h3>
		<CodeBlock
			code={`class AnalyticsProperty extends SmrtObject {
  name: string
  displayName: string
  provider: 'ga4' | 'plausible' | 'matomo'   // AnalyticsProvider enum
  externalId?: string              // e.g. 'properties/123456789'
  measurementId?: string           // GA4 (G-XXXXXXXXXX), Firebase app ID for mobile
  apiSecret?: string               // GA4 server-side secret (plaintext — see Gotchas)
  siteDomain?: string              // Plausible site domain / Matomo idSite
  providerMetadata?: string        // JSON: extensible per-provider config
  status: 'active' | 'inactive' | 'pending'
  lastSyncAt?: Date

  // smrt-prompts: smrtAnalytics.property.analyzePerformance
  async analyzePerformance(options?: { period?: string }): Promise<{ action: string; period: string; analysis: string }>

  // inline is() — NOT registered
  async isPerformingWell(): Promise<boolean>
}`}
			language="typescript"
		/>

		<h3>AnalyticsEvent</h3>
		<CodeBlock
			code={`class AnalyticsEvent extends SmrtObject {
  propertyId: string
  eventName: string           // 'page_view', 'purchase', 'sign_up', etc.
  clientId: string            // Anonymous client identifier
  userId?: string             // Authenticated user
  params: string              // JSON string (use getter/setter helpers)
  eventTimestamp: Date
  status: 'pending' | 'sent' | 'failed'  // TrackingEventStatus enum
  retryCount: number
  sentAt?: Date
  errorMessage?: string

  isPageview(): boolean
  isConversion(): boolean
  markSent(): void                      // Sync — sets status='sent' + sentAt (call save() to persist)
  markFailed(error: string): void       // Sync — sets status='failed', stores error, increments retryCount
  shouldRetry(maxRetries?: number): boolean  // default maxRetries = 3
  resetForRetry(): void                 // Reset to pending for retry
  toTrackEvent(): SDKTrackEvent         // Convert to SDK payload
}`}
			language="typescript"
		/>

		<h3>AnalyticsReport</h3>
		<CodeBlock
			code={`class AnalyticsReport extends SmrtObject {
  propertyId: string
  name: string
  dimensions: string          // JSON array of dimension objects
  metrics: string             // JSON array of metric objects
  dimensionFilter?: string    // JSON — excluded from prompt variables
  metricFilter?: string       // JSON — excluded from prompt variables
  dateRangeStart: string      // e.g. '7daysAgo'
  dateRangeEnd: string        // e.g. 'today'
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'  // ReportFrequency
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed'
  resultData?: string         // Cached JSON — FORWARDED VERBATIM to AI (see Prompt Registry)
  rowCount?: number
  lastRunAt?: Date
  nextRunAt?: Date

  isDue(): boolean
  calculateNextRun(): void        // Recomputes and sets nextRunAt in place

  // smrt-prompts: smrtAnalytics.report.analyzeResults (a single AI call;
  // returned response shape includes "insights" mirroring "analysis").
  async analyzeResults(): Promise<{ action: string; analysis: string; insights: string }>

  // smrt-prompts: smrtAnalytics.report.hasPositiveTrends
  async hasPositiveTrends(): Promise<boolean>
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Event Tracking</h2>
		<CodeBlock
			code={`// Track page view
const pageView = await events.create({
  propertyId: property.id,
  eventName: 'page_view',
  clientId: req.cookies.clientId,
  userId: req.user?.id,
  params: {
    page_location: req.url,
    page_title: 'Product Page',
    page_referrer: req.headers.referer
  },
  eventTimestamp: new Date()
});
await pageView.save();

// Track purchase
const purchase = await events.create({
  propertyId: property.id,
  eventName: 'purchase',
  clientId: req.cookies.clientId,
  userId: req.user.id,
  params: {
    transaction_id: order.id,
    value: order.total,
    currency: 'USD',
    items: order.items.map(item => ({
      item_id: item.productId,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price
    }))
  },
  eventTimestamp: new Date()
});
await purchase.save();

// Get stats
const stats = await events.getPropertyStats(property.id);
console.log(\`Total: \${stats.total}, Sent: \${stats.sent}\`);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Scheduled Reports</h2>
		<CodeBlock
			code={`// Create weekly report
const report = await reports.create({
  propertyId: property.id,
  name: 'Weekly Traffic Report',
  dimensions: ['country', 'deviceCategory', 'date'],
  metrics: ['activeUsers', 'sessions', 'bounceRate'],
  dateRange: 'last7Days',
  frequency: 'WEEKLY',
  status: 'SCHEDULED'
});
await report.save();

// Check if due
if (report.isDue()) {
  report.status = 'RUNNING';
  await report.save();

  // Run report (integrate with SDK)
  const results = await runAnalyticsReport(report);

  report.resultData = results;
  report.rowCount = results.length;
  report.lastRunAt = new Date();
  report.status = 'COMPLETED';
  await report.save();

  // AI analysis
  const insights = await report.analyzeResults();
  console.log(insights);
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>AI-Powered Analysis</h2>
		<p>
			Three of the four AI methods on this package route through the smrt-prompts registry; <code
				>isPerformingWell()</code
			>
			still uses the inline <code>is()</code> shortcut.
		</p>
		<CodeBlock
			code={`// Routed through smrt-prompts (tenant-overridable)
const { analysis } = await property.analyzePerformance({ period: '7 days' });
// returns { action, period, analysis }
// analysis: "Traffic up 15% this week. Top sources: organic search (45%),
//  direct (30%). Mobile usage increased to 68%."

// Still uses inline is() — not registered
const isHealthy = await property.isPerformingWell();
// true if metrics trending positively

// Routed through smrt-prompts — and FORWARDS resultData verbatim (see below)
const reportInsights = await report.analyzeResults();
// { action, analysis, insights }  // insights mirrors analysis in the response shape

const hasGrowth = await report.hasPositiveTrends();
// true if key metrics improving`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Prompt Registry</h2>
		<p>
			Three prompts are registered at module-load time via <code>definePrompt()</code> from
			<a href="/modules/smrt-prompts">@happyvertical/smrt-prompts</a> and re-exported from the package
			root for tenant override targeting.
		</p>
		<table>
			<thead>
				<tr>
					<th>Key</th>
					<th>Method</th>
					<th>Variables (PII-conscious)</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>smrtAnalytics.property.analyzePerformance</code></td>
					<td><code>AnalyticsProperty.analyzePerformance()</code></td>
					<td
						><code>period</code>, <code>propertyDisplayName</code>,
						<code>propertyProvider</code></td
					>
				</tr>
				<tr>
					<td><code>smrtAnalytics.report.analyzeResults</code></td>
					<td><code>AnalyticsReport.analyzeResults()</code></td>
					<td
						><code>reportName</code>, <code>reportDimensions</code>, <code>reportMetrics</code>,
						<code>dateRangeStart</code>, <code>dateRangeEnd</code>, <code>rowCount</code>,
						<code>reportData</code></td
					>
				</tr>
				<tr>
					<td><code>smrtAnalytics.report.hasPositiveTrends</code></td>
					<td><code>AnalyticsReport.hasPositiveTrends()</code></td>
					<td><code>reportMetrics</code>, <code>reportData</code></td>
				</tr>
			</tbody>
		</table>

		<h3>Excluded from variables (never reach the AI provider)</h3>
		<ul>
			<li>
				<code>id</code>, <code>propertyId</code>, <code>tenantId</code>, <code>externalId</code> — internal
				FKs / UUIDs that link to identifying records
			</li>
			<li>
				<code>apiSecret</code>, <code>measurementId</code>, <code>siteDomain</code> — provider
				credentials and platform-specific IDs (GA4 API secrets, Matomo <code>idSite</code>, custom
				<code>G-XXXX</code> measurement IDs)
			</li>
			<li>
				<code>providerMetadata</code> — extensible JSON that may contain credentials or account IDs
			</li>
			<li>
				<code>lastError</code>, raw <code>dimensionFilter</code> / <code>metricFilter</code> JSON — error
				strings (may contain auth tokens) and filter expressions that may reference cookie IDs, user-pseudo-IDs,
				or IP-derived geos
			</li>
		</ul>

		<h3 id="resultdata-contract">
			<code>resultData</code> is forwarded verbatim — callers must de-PII
		</h3>
		<aside>
			<p>
				<strong>This package does not — and cannot — strip PII from result rows.</strong> The row
				schema is determined by the dimensions and metrics the caller asked the analytics provider
				to return. If the caller persists rows containing a <code>userPseudoId</code>,
				<code>clientId</code>, IP-derived geolocation, or any other identifier, those fields
				<strong>will reach the AI provider</strong>. The forwarding contract is pinned by
				<code>src/__tests__/analytics-report-prompt.test.ts</code>.
			</p>
			<p>Callers must do one of the following before invoking <code>analyzeResults()</code>:</p>
			<ul>
				<li>
					Exclude PII-bearing dimensions before persisting <code>resultData</code> (e.g. don't
					request <code>userPseudoId</code> as a GA4 dimension).
				</li>
				<li>Apply a column allowlist at the call site.</li>
				<li>
					Override the prompt template via <code>PromptOverride</code> to redact rows server-side.
				</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>UI Slot Registry</h2>
		<p>
			Svelte components live in <code>src/svelte/</code> and auto-register with
			<code>ModuleUIRegistry</code>
			from <code>@happyvertical/smrt-svelte/registry</code> when
			<code>@happyvertical/smrt-analytics/svelte</code>
			is imported. Slot declarations are exported via the <code>./ui</code> subpath.
		</p>
		<p>
			Slots: <code>analytics-summary</code>, <code>events-table</code>, <code>property-info</code>,
			<code>property-status-badge</code>, <code>stat-card</code>, <code>trend-badge</code> (see
			<code>ANALYTICS_UI_SLOTS</code> for icons / categories / display order).
		</p>
		<CodeBlock
			code={`import '@happyvertical/smrt-analytics/svelte'; // side-effect: registers slots
import { ModuleUIRegistry } from '@happyvertical/smrt-svelte/registry';

const StatCard = ModuleUIRegistry.get(
  '@happyvertical/smrt-analytics',
  'stat-card',
);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Tenancy</h2>
		<p>
			Models in this package use a <strong>tenancy-fallback</strong> pattern: <code>tenantId</code>
			is omitted from the model surface so any <code>withTenant()</code> context applied at the call
			site automatically propagates through the SMRT tenancy interceptor — no per-model decorator
			needed. See <a href="/modules/smrt-tenancy">smrt-tenancy</a> for the call-site pattern and the
			canonical rule in <code>docs/content/standards.md §7</code>.
		</p>
	</section>

	<section>
		<h2>Best Practices</h2>
		<div>
			<aside>
				<h3>DOs</h3>
				<ul>
					<li>Use server-side tracking for sensitive events (purchases)</li>
					<li>Implement retry logic with <code>shouldRetry()</code> check</li>
					<li>Cache report results to reduce API calls</li>
					<li>
						De-PII <code>resultData</code> at the call site before persisting —
						<a href="#resultdata-contract">forward-verbatim contract</a>
					</li>
					<li>
						Override prompt templates via <code>PromptOverride</code> for tenant-specific tone/redaction
					</li>
					<li>Use ISO 4217 currency codes</li>
				</ul>
			</aside>
			<aside>
				<h3>DON'Ts</h3>
				<ul>
					<li>
						Don't store API secrets unencrypted long-term (GA4 secrets currently stored plaintext —
						TODO)
					</li>
					<li>Don't retry failed events indefinitely (use a max-retries cutoff)</li>
					<li>Don't send PII in event parameters</li>
					<li>
						Don't request <code>userPseudoId</code>, <code>clientId</code>, or IP-derived geos in
						report dimensions if <code>analyzeResults()</code> will run on the data
					</li>
					<li>Don't run expensive reports without caching</li>
					<li>Don't track events without <code>propertyId</code></li>
				</ul>
			</aside>
		</div>
	</section>

	<section>
		<h2>Related Modules</h2>
		<div>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>Base classes and framework</p>
			</a>
			<a href="/modules/smrt-properties">
				<h3>smrt-properties</h3>
				<p>Website property management</p>
			</a>
		</div>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
		<a href="/modules/smrt-ads">Next: smrt-ads</a>
	</nav>
</ModulePage>
