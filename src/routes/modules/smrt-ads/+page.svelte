<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-ads"
	description="Ad management system with waterfall priority, zone targeting, weighted A/B testing, and immutable event tracking."
	badges={['v0.20.44', 'Waterfall', 'A/B Testing', 'IAB Formats']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-ads</strong> provides ad campaign management with waterfall priority delivery, zone-based
			targeting, weighted variation selection, and immutable event tracking.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Waterfall priority system (1=highest, 2, 3...)</li>
				<li>Zone targeting with smrt-properties integration</li>
				<li>Weighted A/B testing for ad variations</li>
				<li>IAB-standard ad formats</li>
				<li>Immutable event tracking (impressions, clicks, conversions)</li>
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
			<li><strong>Sponsorship</strong> (priority 1): guaranteed premium placements, FIXED pricing</li>
			<li><strong>Standard</strong> (priority 2): regular programmatic ads, CPM pricing</li>
			<li><strong>House</strong> (priority 3): self-promotional fallback ads</li>
		</ul>
		<CodeBlock
			code={`class AdDeliveryTier extends SmrtObject {
  name: string
  priority: number          // 1=highest, 2, 3...
  pricingModel: 'fixed' | 'cpm' | 'cpc' | 'cpa'  // PricingModel enum
  description?: string
}`}
			language="typescript"
		/>

		<h3>AdGroup (Campaign)</h3>
		<CodeBlock
			code={`class AdGroup extends SmrtObject {
  name: string
  tierId: string            // FK to AdDeliveryTier
  contractId: string        // FK to Contract (smrt-commerce, plain string)
  status: 'draft' | 'active' | 'paused' | 'completed'  // AdGroupStatus
  dailyBudget: number = 0.0  // DECIMAL
  totalBudget: number = 0.0  // DECIMAL
  startDate: Date
  endDate: Date

  // JSON fields with getter/setter helpers
  setTargeting(rules: Record<string, any>): void
  getTargeting(): Record<string, any>
  setZoneIds(ids: string[]): void   // FK to Zone[] (smrt-properties)
  getZoneIds(): string[]
}`}
			language="typescript"
		/>

		<h3>AdVariation (Creative, STI)</h3>
		<p>Weight is a relative integer, not a percentage. A variation with <code>weight: 2</code> is twice as likely to be chosen as one with <code>weight: 1</code>.</p>
		<CodeBlock
			code={`class AdVariation extends SmrtObject {
  groupId: string
  name: string
  weight: number = 0        // Relative weight for A/B (2 = 2x more likely than 1)
  impressions: number = 0   // Denormalized count
  clicks: number = 0        // Denormalized count
  status: 'draft' | 'active' | 'paused'  // AdVariationStatus
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
			AdEvent is <strong>create-only</strong> -- no update or delete in API/MCP.
			Event types: <code>impression</code>, <code>click</code>, <code>conversion</code>.
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
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use lower priority numbers for premium tiers (1=highest)</li>
				<li>Set reasonable weights for A/B tests (sum doesn't need to be 100)</li>
				<li>Track impressions before serving to prevent double-counting</li>
				<li>Use targeting JSON for flexible audience rules</li>
				<li>Link to smrt-commerce contracts for billing</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't modify AdEvent records (immutable by design)</li>
				<li>Don't set weight to 0 (makes variation unselectable)</li>
				<li>Don't forget to filter by date range and status</li>
				<li>Don't serve ads without zone eligibility check</li>
				<li>Don't ignore tier priority ordering</li>
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
