<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-affiliates"
	description="Revenue sharing with multi-type partners (publisher/salesperson/referrer), multi-tier commission attribution, and payout batch processing."
	badges={['v0.20.44', 'Revenue Share', 'Commissions', 'Payouts']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-affiliates</strong> provides affiliate partner and commission tracking for revenue
			sharing networks. Partners can hold multiple roles, commissions are immutable records tied to ad
			events, and payouts aggregate earnings into batch disbursements.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Multi-type partners: publisher, salesperson, referrer (multi-role per partner)</li>
				<li>4 commission types per ad event: Display, Referral, Sales, Parent</li>
				<li>Parent commission sharing (salesperson's parent publisher earns a share)</li>
				<li>Payout lifecycle: PENDING, APPROVED, PROCESSING, COMPLETED, FAILED</li>
				<li>All monetary values stored as integer cents</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-affiliates`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  Partner, PartnerCollection,
  Commission, CommissionCollection,
  Payout, PayoutCollection,
  PartnerType, CommissionType, CommissionStatus, PayoutStatus
} from '@happyvertical/smrt-affiliates';

// Register a publisher partner (earns display commissions)
const partners = new PartnerCollection(db);
const publisher = await partners.create({
  profileId: 'profile-uuid',
  propertyId: 'property-uuid',
  partnerTypes: JSON.stringify([PartnerType.PUBLISHER]),
  displayCommissionRate: 0.50,
  status: 'active',
});

// Attach a salesperson to the publisher
// parentCommissionShare: 20% of sales commission goes to parent
const salesperson = await partners.create({
  profileId: 'sales-profile-uuid',
  parentPartnerId: publisher.id,
  partnerTypes: JSON.stringify([PartnerType.SALESPERSON]),
  salesCommissionRate: 0.10,
  parentCommissionShare: 0.20,
  status: 'active',
});
// Effective sales rate: 0.10 * (1 - 0.20) = 0.08
salesperson.getEffectiveSalesRate(); // 0.08

// Record a commission (all monetary values in integer cents)
const commissions = new CommissionCollection(db);
await commissions.create({
  eventId: 'adevent-uuid',
  partnerId: publisher.id,
  commissionType: CommissionType.DISPLAY,
  grossRevenue: 1000,       // $10.00
  commissionRate: 0.50,
  commissionAmount: Commission.calculateAmount(1000, 0.50), // 500 cents
  currency: 'CAD',
  status: CommissionStatus.PENDING,
});

// Create a payout batch
const payouts = new PayoutCollection(db);
const payout = await payouts.create({
  partnerId: publisher.id,
  periodStart: new Date('2024-01-01'),
  periodEnd: new Date('2024-01-31'),
  displayEarnings: 25000,   // $250.00
  referralEarnings: 500,    // $5.00
  salesEarnings: 0,
  parentEarnings: 0,
  totalAmount: 25500,       // $255.00
  currency: 'CAD',
  status: PayoutStatus.PENDING,
});

// Payout lifecycle
payout.approve();
payout.markProcessing();
payout.complete('transfer-ref-123');
await payout.save();`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Partner</h3>
		<CodeBlock
			code={`class Partner extends SmrtObject {
  profileId: string          // FK to smrt-profiles
  propertyId?: string        // FK to smrt-properties
  parentPartnerId?: string   // Parent publisher hierarchy
  referredById?: string      // Referral attribution
  partnerTypes: string       // JSON array of PartnerType
  displayCommissionRate: number
  salesCommissionRate: number
  referralCommissionRate: number
  parentCommissionShare: number  // Share passed to parent
  status: 'pending' | 'active' | 'suspended'

  getPartnerTypes(): PartnerType[]
  getEffectiveSalesRate(): number
}`}
			language="typescript"
		/>

		<h3>Commission (Immutable)</h3>
		<CodeBlock
			code={`class Commission extends SmrtObject {
  eventId: string            // FK to smrt-ads AdEvent
  partnerId: string
  commissionType: 'display' | 'referral' | 'sales' | 'parent'
  grossRevenue: number       // Integer cents
  commissionRate: number
  commissionAmount: number   // Integer cents
  currency: string
  status: 'pending' | 'included' | 'paid'

  static calculateAmount(grossRevenue: number, rate: number): number
  getAmountInDollars(): number
}`}
			language="typescript"
		/>

		<h3>Payout</h3>
		<CodeBlock
			code={`class Payout extends SmrtObject {
  partnerId: string
  periodStart: Date
  periodEnd: Date
  displayEarnings: number    // Integer cents
  referralEarnings: number
  salesEarnings: number
  parentEarnings: number
  totalAmount: number        // Integer cents
  currency: string
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'failed'

  approve(): void
  markProcessing(): void
  complete(reference: string): void
  getTotalInDollars(): number
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Commission Types</h2>
		<CodeBlock
			code={`// Each ad event can generate up to 4 commissions:
//
// DISPLAY   -> Publisher (site owner earns share of impression revenue)
// REFERRAL  -> Referrer (partner who referred the publisher)
// SALES     -> Salesperson (partner who brought in the advertiser)
// PARENT    -> Parent publisher (share of salesperson's commission)
//
// Parent commission share example:
// Salesperson.parentCommissionShare = 0.20 (20%)
// Effective sales rate = salesRate * (1 - parentCommissionShare)

// Commission rate is copied at event time (immutable record)
// It does NOT update if Partner.commissionRate changes later`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>getPartnerTypes()</code> to parse the JSON string array</li>
				<li>Store all monetary values as integer cents (divide by 100 for display)</li>
				<li>Use <code>Commission.calculateAmount()</code> for consistent rounding</li>
				<li>Copy commission rates at event time for immutable attribution</li>
				<li>Use payout lifecycle methods for status transitions</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't modify or delete Commission records (immutable by design)</li>
				<li>Don't reference Partner.commissionRate after event time (use the copied rate)</li>
				<li>Don't display cent values directly (use <code>getTotalInDollars()</code> helpers)</li>
				<li>Don't add tenant scoping (intentionally cross-tenant for network visibility)</li>
				<li>Don't assume payout maps to ledger entries (integration is external)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-ads">
				<h3>smrt-ads</h3>
				<p>Ad events that generate commissions</p>
			</a>
			<a href="/modules/smrt-commerce">
				<h3>smrt-commerce</h3>
				<p>Invoice and contract management</p>
			</a>
			<a href="/modules/smrt-profiles">
				<h3>smrt-profiles</h3>
				<p>Partner identity profiles</p>
			</a>
			<a href="/modules/smrt-properties">
				<h3>smrt-properties</h3>
				<p>Publisher property references</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
