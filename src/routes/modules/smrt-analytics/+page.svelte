<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-analytics"
	description="Server-side analytics tracking with GA4 and Plausible integration, event logging, scheduled reports, and AI-powered performance analysis."
	badges={['v0.20.44', 'GA4', 'Plausible', 'AI Insights']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-analytics</strong> provides server-side analytics event tracking, property/data stream
			management, scheduled reporting, and AI-powered performance analysis for GA4 and Plausible.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Server-side event tracking (GA4 Measurement Protocol, Plausible Events API)</li>
				<li>Property and data stream management</li>
				<li>Scheduled report generation with caching</li>
				<li>Event retry logic with status tracking</li>
				<li>AI-powered performance analysis and trend detection</li>
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

// After sending: markSent() or markFailed('timeout')
await event.markSent();`}
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
  provider: 'ga4' | 'plausible'   // AnalyticsProvider enum
  externalId?: string              // e.g. 'properties/123456789'
  measurementId?: string           // GA4 (G-XXXXXXXXXX)
  apiSecret?: string               // GA4 server-side secret
  siteDomain?: string              // Plausible site domain
  status: 'active' | 'inactive' | 'pending'
  lastSyncAt?: Date

  async analyzePerformance(): Promise<string>  // AI (do())
  async isPerformingWell(): Promise<boolean>   // AI (is())
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
  async markSent(): Promise<void>       // Sets sentAt timestamp
  async markFailed(error: string): Promise<void>  // Increments retryCount
  shouldRetry(maxRetries: number): boolean
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
  dateRangeStart: string      // e.g. '7daysAgo'
  dateRangeEnd: string        // e.g. 'today'
  frequency: 'once' | 'daily' | 'weekly' | 'monthly'  // ReportFrequency
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed'
  resultData?: string         // Cached results (JSON)
  rowCount?: number
  lastRunAt?: Date
  nextRunAt?: Date

  isDue(): boolean
  calculateNextRun(): Date | null
  async analyzeResults(): Promise<string>     // AI (do())
  async hasPositiveTrends(): Promise<boolean> // AI (is())
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
		<CodeBlock
			code={`// Analyze property performance
const analysis = await property.analyzePerformance();
// "Traffic up 15% this week. Top sources: organic search (45%),
//  direct (30%). Mobile usage increased to 68%."

const isHealthy = await property.isPerformingWell();
// true if metrics trending positively

// Analyze report trends
const reportInsights = await report.analyzeResults();
// "US traffic grew 20%, UK declined 5%. Mobile bounce rate
//  improved from 65% to 58%."

const hasGrowth = await report.hasPositiveTrends();
// true if key metrics improving`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<div>
			<aside>
				<h3>DOs</h3>
				<ul>
					<li>Use server-side tracking for sensitive events (purchases)</li>
					<li>Implement retry logic with shouldRetry() check</li>
					<li>Cache report results to reduce API calls</li>
					<li>Track both clientId and userId when available</li>
					<li>Use ISO 4217 currency codes</li>
				</ul>
			</aside>
			<aside>
				<h3>DON'Ts</h3>
				<ul>
					<li>Don't store unencrypted API secrets</li>
					<li>Don't retry failed events indefinitely</li>
					<li>Don't send PII in event parameters</li>
					<li>Don't run expensive reports without caching</li>
					<li>Don't track events without propertyId</li>
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
