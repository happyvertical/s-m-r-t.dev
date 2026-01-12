<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-ads - Ad Management | SMRT Framework</title>
  <meta name="description" content="Ad management with waterfall priority, zone targeting, A/B testing, and performance tracking." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-ads</h1>
    <p class="text-xl text-gray-600 mb-4">
      Ad management system with waterfall priority, zone targeting, weighted A/B testing, and immutable event tracking.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Waterfall</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">A/B Testing</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">IAB Formats</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-ads</strong> provides ad campaign management with waterfall priority delivery,
      zone-based targeting, weighted variation selection, and immutable event tracking.
    </p>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <p class="font-semibold mb-2">Key Features:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Waterfall priority system (1=highest, 2, 3...)</li>
        <li>Zone targeting with smrt-properties integration</li>
        <li>Weighted A/B testing for ad variations</li>
        <li>IAB-standard ad formats</li>
        <li>Immutable event tracking (impressions, clicks, conversions)</li>
      </ul>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install @happyvertical/smrt-ads`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
    <CodeBlock
      code={`import {
  AdDeliveryTierCollection, AdGroupCollection,
  AdVariationCollection, AdEventCollection
} from '@happyvertical/smrt-ads';

// Create delivery tier
const tier1 = await tiers.create({
  name: 'Premium',
  priority: 1,  // Highest priority
  pricingModel: 'CPM'
});
await tier1.save();

// Create ad group
const group = await groups.create({
  contractId: contract.id,
  tierName: tier1.name,
  verticalSlug: 'automotive',
  zoneIds: ['zone-1', 'zone-2'],  // smrt-properties zones
  targeting: { device: 'mobile', geo: 'US' },
  dailyBudget: 500,
  startDate: new Date('2025-01-20'),
  endDate: new Date('2025-02-20'),
  status: 'ACTIVE'
});
await group.save();

// Create variations with weights
const varA = await variations.create({
  groupId: group.id,
  formatName: 'leaderboard-728x90',
  assetId: asset1.id,
  clickUrl: 'https://example.com/promo',
  weight: 70  // 70% traffic
});
await varA.save();

const varB = await variations.create({
  groupId: group.id,
  formatName: 'leaderboard-728x90',
  assetId: asset2.id,
  clickUrl: 'https://example.com/promo2',
  weight: 30  // 30% traffic
});
await varB.save();

// Select variation (weighted random)
const selected = await variations.selectByWeight(group.id);

// Track impression
await events.create({
  eventType: 'IMPRESSION',
  variationId: selected.id,
  zoneId: 'zone-1',
  siteId: property.id
});`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Core Models</h2>

    <h3 class="text-2xl font-semibold mb-3">AdDeliveryTier (Priority)</h3>
    <CodeBlock
      code={`class AdDeliveryTier extends SmrtObject {
  name: string
  priority: number          // 1=highest, 2, 3...
  pricingModel: 'FIXED' | 'CPM' | 'CPC' | 'CPA'
  description?: string

  isHigherPriorityThan(other: AdDeliveryTier): boolean
  isFixedPricing(): boolean
  isPerformanceBased(): boolean
}`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">AdGroup (Campaign)</h3>
    <CodeBlock
      code={`class AdGroup extends SmrtObject {
  contractId: string        // FK to Contract (smrt-commerce)
  tierName: string          // Delivery tier
  verticalSlug?: string     // FK to Tag (smrt-tags)
  zoneIds: string[]         // FK to Zone[] (smrt-properties)
  targeting: Record<string, any>
  dailyBudget?: number
  totalBudget?: number
  startDate: Date
  endDate: Date
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'

  isActive(): boolean
  hasZoneId(zoneId: string): boolean
  addZoneId(zoneId: string): void
  removeZoneId(zoneId: string): void
}`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">AdVariation (Creative)</h3>
    <CodeBlock
      code={`class AdVariation extends SmrtObject {
  groupId: string
  formatName: string        // FK to AdFormat
  assetId: string           // FK to Asset (smrt-assets)
  clickUrl: string
  altText?: string
  weight: number            // For A/B testing (default: 100)
  impressions: number       // Denormalized
  clicks: number            // Denormalized
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED'

  getCTR(): number
  recordImpression(): void
  recordClick(): void
}`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Waterfall Priority & Selection</h2>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Performance Tracking</h2>
    <CodeBlock
      code={`// Track events (immutable)
await events.create({
  eventType: 'IMPRESSION',
  variationId: variation.id,
  zoneId: zoneId,
  siteId: propertyId,
  metadata: { userAgent: req.headers['user-agent'] }
});

await events.create({
  eventType: 'CLICK',
  variationId: variation.id,
  zoneId: zoneId,
  siteId: propertyId
});

// Get stats
const stats = await events.getVariationStats(variation.id);
console.log(\`CTR: \${stats.ctr}%, Conversions: \${stats.conversions}\`);

// Top performers
const topAds = await events.findTopPerformers(10);

// Date range analysis
const weekEvents = await events.findByDateRange(
  new Date('2025-01-20'),
  new Date('2025-01-27')
);`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Best Practices</h2>
    <div class="space-y-6">
      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✓ DOs</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Use lower priority numbers for premium tiers (1=highest)</li>
          <li>Set reasonable weights for A/B tests (sum doesn't need to be 100)</li>
          <li>Track impressions before serving to prevent double-counting</li>
          <li>Use targeting JSON for flexible audience rules</li>
          <li>Link to smrt-commerce contracts for billing</li>
        </ul>
      </div>
      <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✗ DON'Ts</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Don't modify AdEvent records (immutable by design)</li>
          <li>Don't set weight to 0 (makes variation unselectable)</li>
          <li>Don't forget to filter by date range and status</li>
          <li>Don't serve ads without zone eligibility check</li>
          <li>Don't ignore tier priority ordering</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-properties" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-properties</h3>
        <p class="text-sm text-gray-600">Zone targeting integration</p>
      </a>
      <a href="/modules/smrt-commerce" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-commerce</h3>
        <p class="text-sm text-gray-600">Contract and billing management</p>
      </a>
      <a href="/modules/smrt-assets" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-assets</h3>
        <p class="text-sm text-gray-600">Creative asset management</p>
      </a>
      <a href="/modules/smrt-tags" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-tags</h3>
        <p class="text-sm text-gray-600">Vertical categorization</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-gnode" class="text-blue-600 hover:underline">Next: smrt-gnode →</a>
    </div>
  </div>
</div>
