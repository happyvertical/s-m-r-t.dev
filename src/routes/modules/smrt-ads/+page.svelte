<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-ads"
	description="Ad delivery with priority waterfall, weighted A/B testing, and immutable event tracking."
	badges={['v0.29.34', 'Waterfall', 'A/B Testing', 'IAB Formats', 'Mixed Tenancy']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-ads</strong> manages ad campaigns with a priority waterfall, zone-based
			targeting, weighted creative variations for A/B testing, and immutable
			impression/click/conversion events. Cross-package references all use plain string IDs (no
			<code>@foreignKey()</code>) to avoid circular dependencies.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>
					<strong>Priority waterfall</strong>: lower priority number serves first — Sponsorship (1,
					FIXED pricing) → Standard (2, CPM) → House (3, fallback)
				</li>
				<li>
					<strong>Weighted A/B variations</strong>: <code>weight</code> is a relative integer —
					<code>weight=2</code>
					is 2× more likely than <code>weight=1</code>, not a percentage
				</li>
				<li>
					<strong>Denormalized counts</strong>: <code>impressions</code>/<code>clicks</code> live on
					<code>AdVariation</code>
					and are <em>eventually</em> consistent — refresh asynchronously
				</li>
				<li>
					<strong>Immutable event tracking</strong>: <code>AdEvent</code> is create-only (no
					update/delete in the generated API/MCP); <code>cli: false</code> due to high volume
				</li>
				<li>
					<strong>IAB-standard formats</strong>: <code>AdFormat</code> rows describe width/height/<code
						>formatType</code
					> (banner/native/video) — shared catalog, not per-tenant
				</li>
				<li>
					<strong>Mixed tenancy</strong>: <code>AdGroup</code>/<code>AdVariation</code>/<code
						>AdEvent</code
					>
					are tenant-scoped (optional); <code>AdFormat</code>/<code>AdDeliveryTier</code> are deliberately
					global — see Tenancy below
				</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-ads`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  AdDeliveryTier, AdDeliveryTierCollection,
  AdGroup, AdGroupCollection,
  AdVariation, AdVariationCollection,
  AdEvent, AdEventCollection,
  AdEventType, PricingModel, AdGroupStatus
} from '@happyvertical/smrt-ads';

// Define delivery tiers (lower priority number = served first)
const tiers = new AdDeliveryTierCollection(db);
const sponsorship = await tiers.create({
  name: 'Sponsorship',
  priority: 1,
  pricingModel: PricingModel.FIXED,
});

const standard = await tiers.create({
  name: 'Standard',
  priority: 2,
  pricingModel: PricingModel.CPM,
});

// Create an ad group with targeting and budget
const groups = new AdGroupCollection(db);
const group = await groups.create({
  name: 'Holiday Campaign',
  tierId: sponsorship.id,
  contractId: 'contract-uuid',     // plain string FK to smrt-commerce
  status: AdGroupStatus.ACTIVE,
  dailyBudget: 100.00,
  totalBudget: 3000.00,
  startDate: new Date('2025-06-01'),
  endDate: new Date('2025-08-31'),
});
group.setTargeting({ device: 'desktop', geo: 'US' });
group.setZoneIds(['zone-1', 'zone-2']);  // FK to smrt-properties zones
await group.save();

// Add variations with relative weights for A/B testing
// weight=2 is selected 2x more often than weight=1
const variations = new AdVariationCollection(db);
const varA = await variations.create({
  groupId: group.id,
  name: 'Version A - Blue CTA',
  weight: 2,
  status: 'active',
});

// Track an immutable event (create-only, no update/delete)
const events = new AdEventCollection(db);
await events.create({
  variationId: varA.id,
  zoneId: 'zone-uuid',
  siteId: 'site-uuid',
  eventType: AdEventType.IMPRESSION,
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>AdDeliveryTier (Priority Waterfall)</h3>
		<p>Lower priority number = higher priority in selection. Typical tiers:</p>
		<ul>
			<li>
				<strong>Sponsorship</strong> (priority 1): guaranteed premium placements, FIXED pricing
			</li>
			<li><strong>Standard</strong> (priority 2): regular programmatic ads, CPM pricing</li>
			<li><strong>House</strong> (priority 3): self-promotional fallback ads</li>
		</ul>
		<CodeBlock
			code={`// @smrt(...) — NOT @TenantScoped (shared catalog; see Tenancy section)
class AdDeliveryTier extends SmrtObject {
  name: string
  priority: number          // 1=highest, 2, 3...
  pricingModel: 'fixed' | 'cpm' | 'cpc' | 'cpa'  // PricingModel enum
  description?: string
}`}
			language="typescript"
		/>

		<h3>AdFormat (IAB Standard Dimensions)</h3>
		<p>
			<code>AdFormat</code> rows describe industry-standard IAB dimensions: 728×90 Leaderboard,
			300×250 Medium Rectangle, etc. Like <code>AdDeliveryTier</code>, it is a
			<strong>shared catalog table</strong> and is deliberately not tenant-scoped.
		</p>
		<CodeBlock
			code={`// @smrt(...) — NOT @TenantScoped (IAB industry standard; see Tenancy section)
class AdFormat extends SmrtObject {
  name: string              // e.g. 'Leaderboard', 'Medium Rectangle'
  width: number
  height: number
  formatType: 'banner' | 'native' | 'video'  // AdFormatType enum
  description?: string
}`}
			language="typescript"
		/>

		<h3>AdGroup (Campaign)</h3>
		<CodeBlock
			code={`// @smrt({ tableStrategy: 'sti', ... }) + @TenantScoped({ mode: 'optional' })
class AdGroup extends SmrtObject {
  name: string
  tierId: string            // @foreignKey('AdDeliveryTier')
  contractId: string        // @crossPackageRef to smrt-commerce Contract
  verticalSlug: string      // tag slug from smrt-tags
  status: 'draft' | 'active' | 'paused' | 'completed'  // AdGroupStatus
  dailyBudget: number = 0.0  // DECIMAL
  totalBudget: number = 0.0  // DECIMAL
  startDate: Date | null
  endDate: Date | null

  // JSON fields with getter/setter helpers (no schema validation on targeting rules)
  setTargeting(rules: Record<string, any>): void
  getTargeting(): Record<string, any>
  setZoneIds(ids: string[]): void   // plain string IDs → smrt-properties zones
  getZoneIds(): string[]
}`}
			language="typescript"
		/>

		<h3>AdVariation (Creative, STI)</h3>
		<p>
			Weight is a relative integer, not a percentage. A variation with <code>weight: 2</code> is
			twice as likely to be chosen as one with <code>weight: 1</code>. Denormalized counters (<code
				>impressions</code
			>, <code>clicks</code>) are eventually consistent — refresh from <code>AdEvent</code> aggregates
			if you need exact totals.
		</p>
		<CodeBlock
			code={`// @smrt({ tableStrategy: 'sti', ... }) + @TenantScoped({ mode: 'optional' })
class AdVariation extends SmrtObject {
  groupId: string           // @foreignKey('AdGroup')
  formatId: string          // @foreignKey('AdFormat')
  name: string
  clickUrl: string          // Click destination URL
  altText: string           // Accessibility alt text
  weight: number = 1        // Relative weight for A/B (2 = 2x more likely than 1)
  impressions: number = 0   // Denormalized count (eventually consistent)
  clicks: number = 0        // Denormalized count (eventually consistent)
  status: 'draft' | 'active' | 'paused'  // AdVariationStatus
  assetId: string           // @crossPackageRef → smrt-assets Asset
}`}
			language="typescript"
		/>

		<h3>AdEvent (Immutable, STI)</h3>
		<p>
			Create-only: the generated REST API and MCP server omit update and delete operations, and <code
				>cli: false</code
			> suppresses CLI generation because event volume is high. Track impressions, clicks, and conversions
			here.
		</p>
		<CodeBlock
			code={`// @smrt({ tableStrategy: 'sti', api: { include: ['create', 'list'] }, mcp: { include: ['create'] }, cli: false })
// + @TenantScoped({ mode: 'optional' })
class AdEvent extends SmrtObject {
  variationId: string       // @foreignKey('AdVariation')
  zoneId: string            // @crossPackageRef → smrt-properties Zone
  siteId: string            // denormalized from Zone for query efficiency
  eventType: 'impression' | 'click' | 'conversion'  // AdEventType
  timestamp: Date
  metadata: string          // JSON (IP, user agent, referrer, etc.)
  // immutable: no update or delete in API/MCP
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Waterfall Priority & Selection</h2>
		<CodeBlock
			code={`// Ad selection algorithm
async function selectAd(zoneId: string) {
  // 1. Find eligible groups for zone
  const eligibleGroups = await groups.findEligibleForZone(zoneId);
  // Filters: ACTIVE, in date range, has zoneId

  // 2. Sort by tier priority (1 first)
  eligibleGroups.sort((a, b) =>
    tierMap[a.tierName].priority - tierMap[b.tierName].priority
  );

  // 3. Select first group with available variations
  for (const group of eligibleGroups) {
    const variation = await variations.selectByWeight(group.id);
    if (variation) return variation;
  }

  return null; // No ads available
}

// Weighted selection (A/B testing)
const selected = await variations.selectByWeight(groupId);
// Weight 70 vs 30 = 70% chance of first variation`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Immutable Event Tracking</h2>
		<p>
			AdEvent is <strong>create-only</strong> -- no update or delete in API/MCP. Event types:
			<code>impression</code>, <code>click</code>, <code>conversion</code>.
			<code>cli: false</code> due to high volume.
		</p>
		<CodeBlock
			code={`// Track events (immutable -- create only)
await events.create({
  eventType: AdEventType.IMPRESSION,
  variationId: variation.id,
  zoneId: zoneId,
  siteId: propertyId,
});

await events.create({
  eventType: AdEventType.CLICK,
  variationId: variation.id,
  zoneId: zoneId,
  siteId: propertyId,
});`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Cross-Package References</h2>
		<p>
			All cross-package links use plain string IDs (no <code>@foreignKey()</code>) to avoid circular
			dependencies:
		</p>
		<ul>
			<li><code>contractId</code> → <a href="/modules/smrt-commerce">smrt-commerce</a></li>
			<li>
				<code>zoneId</code>, <code>siteId</code> →
				<a href="/modules/smrt-properties">smrt-properties</a>
			</li>
			<li><code>assetId</code> → <a href="/modules/smrt-assets">smrt-assets</a></li>
			<li><code>verticalSlug</code> → <a href="/modules/smrt-tags">smrt-tags</a></li>
		</ul>
	</section>

	<section>
		<h2>Tenancy</h2>
		<p>
			This package uses a <strong>mixed tenancy policy</strong>: the three transactional models that
			participate in per-tenant ad serving and event tracking apply
			<code>@TenantScoped({'{'} mode: 'optional' {'}'})</code>, while two catalog/lookup tables are
			deliberately global.
		</p>
		<table>
			<thead>
				<tr>
					<th>Model</th>
					<th>Tenancy</th>
					<th>Rationale</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>AdGroup</code></td>
					<td><code>@TenantScoped({'{'} mode: 'optional' {'}'})</code></td>
					<td>Per-tenant campaign with budgets and targeting.</td>
				</tr>
				<tr>
					<td><code>AdVariation</code></td>
					<td><code>@TenantScoped({'{'} mode: 'optional' {'}'})</code></td>
					<td>Per-tenant creative variant with weighted selection.</td>
				</tr>
				<tr>
					<td><code>AdEvent</code></td>
					<td><code>@TenantScoped({'{'} mode: 'optional' {'}'})</code></td>
					<td>Per-tenant immutable impression/click/conversion log.</td>
				</tr>
				<tr>
					<td><code>AdFormat</code></td>
					<td><strong>NOT</strong> tenant-scoped</td>
					<td
						>IAB standard dimensions are an industry catalog (728×90 Leaderboard, 300×250 Medium
						Rectangle, …), not a tenant-specific configuration.</td
					>
				</tr>
				<tr>
					<td><code>AdDeliveryTier</code></td>
					<td><strong>NOT</strong> tenant-scoped</td>
					<td
						>Tier ordering is part of the package's ad-serving contract (Sponsorship → Standard →
						House). Per-tenant tier definitions would fragment the selection algorithm without a
						clear use case.</td
					>
				</tr>
			</tbody>
		</table>
		<p>
			Each <code>@smrt(...)</code> block on <code>AdFormat</code> and <code>AdDeliveryTier</code>
			carries an inline comment pointing back to this rationale. This mirrors the documented exception
			pattern used in <a href="/modules/smrt-secrets">smrt-secrets</a> for
			<code>TenantKey</code>. Either model can still be filtered by tenant manually if a deployment
			needs custom overrides, but the default is global. Cross-link: the canonical rule is in
			<code>docs/content/standards.md §7</code>.
		</p>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use lower priority numbers for premium tiers (1 = highest)</li>
				<li>Set reasonable weights for A/B tests (sum doesn't need to be 100)</li>
				<li>Track impressions immutably via <code>AdEvent</code> — never mutate them</li>
				<li>Use targeting JSON for flexible audience rules</li>
				<li>Link to <a href="/modules/smrt-commerce">smrt-commerce</a> contracts for billing</li>
				<li>
					Refresh denormalized <code>impressions</code>/<code>clicks</code> from
					<code>AdEvent</code> aggregates when exactness matters
				</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>
					Don't modify <code>AdEvent</code> records — immutable by design (no update/delete in API/MCP)
				</li>
				<li>Don't set <code>weight</code> to 0 — that makes the variation unselectable</li>
				<li>Don't expect frequency capping or budget enforcement — external responsibility</li>
				<li>Don't trust targeting JSON shape — there is no schema validation</li>
				<li>Don't forget to filter eligibility by date range and status</li>
				<li>
					Don't tenant-scope <code>AdFormat</code>/<code>AdDeliveryTier</code> — they are shared catalogs
				</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-properties">
				<h3>smrt-properties</h3>
				<p>Zone targeting integration</p>
			</a>
			<a href="/modules/smrt-commerce">
				<h3>smrt-commerce</h3>
				<p>Contract and billing management</p>
			</a>
			<a href="/modules/smrt-assets">
				<h3>smrt-assets</h3>
				<p>Creative asset management</p>
			</a>
			<a href="/modules/smrt-tags">
				<h3>smrt-tags</h3>
				<p>Vertical categorization</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
		<a href="/modules/smrt-gnode">Next: smrt-gnode</a>
	</nav>
</ModulePage>
