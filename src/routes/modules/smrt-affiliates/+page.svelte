<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-affiliates"
	description="Partner revenue sharing with multi-type partners, multi-tier commissions, and payout processing — a cross-tenant network by design."
	badges={['v0.29.34', 'Revenue Share', 'Commissions', 'Payouts', 'Cross-Tenant']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-affiliates</strong> tracks affiliate partners and commissions for revenue-sharing
			networks. Partners can hold multiple roles, commissions are immutable records tied to ad
			events, and payouts aggregate earnings into batch disbursements. The whole network is
			<strong>cross-tenant by design</strong> — see Tenancy below.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>
					Multi-type <strong>Partner</strong>: <code>publisher</code> / <code>salesperson</code> /
					<code>referrer</code> stored as a JSON array — partners can hold multiple roles
				</li>
				<li>
					<strong>4 commission types</strong> per ad event: <code>display</code> (publisher),
					<code>referral</code>
					(referrer), <code>sales</code> (salesperson), <code>parent</code> (parent publisher's share)
				</li>
				<li>
					<strong>Parent commission share</strong>: salesperson's <code>parentCommissionShare</code> diverts
					a fraction to the parent publisher
				</li>
				<li>
					<strong>Immutable Commission</strong>: no update/delete API; <code>commissionRate</code>
					is copied at event time, not a live reference to <code>Partner.commissionRate</code>
				</li>
				<li>
					<strong>Payout lifecycle</strong>:
					<code>pending → approved → processing → completed</code>
					(or <code>failed</code>)
				</li>
				<li>
					<strong>Integer cents</strong>: all monetary fields are integer cents. Helpers
					<code>getTotalInDollars()</code>, <code>getAmountInDollars()</code>;
					<code>Commission.calculateAmount(grossRevenue, rate)</code>
					uses <code>Math.round()</code>
				</li>
				<li>
					<strong>NOT tenant-scoped</strong> (intentional) — the affiliate network is a cross-tenant graph;
					see Tenancy below
				</li>
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
			code={`// @smrt(...) — deliberately NOT @TenantScoped (cross-tenant network; see Tenancy)
class Partner extends SmrtObject {
  profileId: string          // plain string → smrt-profiles
  propertyId?: string        // plain string → smrt-properties
  parentPartnerId?: string   // Parent publisher hierarchy
  referredById?: string      // Referral attribution
  partnerTypes: string       // JSON array of PartnerType (multi-role)
  displayCommissionRate: number
  salesCommissionRate: number
  referralCommissionRate: number
  parentCommissionShare: number  // Share passed to parent publisher
  status: 'pending' | 'active' | 'suspended'

  getPartnerTypes(): PartnerType[]   // parses JSON string
  getEffectiveSalesRate(): number    // salesCommissionRate × (1 − parentCommissionShare)
}`}
			language="typescript"
		/>

		<h3>Commission (Immutable)</h3>
		<CodeBlock
			code={`// @smrt({ api: { include: ['create', 'list', 'get'] }, ... }) — no update/delete (audit trail); NOT tenant-scoped
class Commission extends SmrtObject {
  eventId: string            // plain string → smrt-ads AdEvent
  partnerId: string
  commissionType: 'display' | 'referral' | 'sales' | 'parent' | 'overhead'
  grossRevenue: number       // Integer cents
  commissionRate: number     // copied at event time — NOT a live ref to Partner.commissionRate
  commissionAmount: number   // Integer cents (uses Math.round())
  currency: string
  status: 'pending' | 'included' | 'paid'

  static calculateAmount(grossRevenue: number, rate: number): number
  getAmountInDollars(): number
}`}
			language="typescript"
		/>

		<h3>Payout</h3>
		<CodeBlock
			code={`// @smrt(...) — NOT tenant-scoped (cross-tenant network)
class Payout extends SmrtObject {
  partnerId: string
  periodStart: Date
  periodEnd: Date
  displayEarnings: number    // Integer cents
  referralEarnings: number
  salesEarnings: number
  parentEarnings: number
  totalAmount: number        // Integer cents
  currency: string
  invoiceId?: string         // plain string → smrt-commerce (external mapping)
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
		<h2>Tenancy</h2>
		<p>
			<strong>None of the three models in this package are tenant-scoped.</strong> This is
			deliberate. Per <code>docs/content/standards.md §7</code>, tenant-aware models normally apply
			<code>@TenantScoped({'{'} mode: 'optional' {'}'})</code> from
			<a href="/modules/smrt-tenancy">smrt-tenancy</a>; each <code>@smrt(...)</code> block in this package
			carries an inline comment pointing back to this rationale.
		</p>
		<p>The affiliate network is a cross-tenant graph <em>by design</em>:</p>
		<ul>
			<li>
				<strong>Partner</strong> — a single publisher operating sites across different tenants needs a
				stable identity for revenue aggregation, payout thresholds, and tax reporting. Slicing per tenant
				would either duplicate the row or hide payouts owed across tenants.
			</li>
			<li>
				<strong>Commission</strong> — attributes revenue to a partner across whichever tenant generated
				the underlying ad event. Cross-tenant attribution is the entire point.
			</li>
			<li>
				<strong>Payout</strong> — aggregates commissions for a partner regardless of which tenant the
				revenue came from. A tenant-scoped query would produce systematically incorrect totals.
			</li>
		</ul>
		<p>
			This is the same reasoning that keeps <code>TenantKey</code> in
			<a href="/modules/smrt-secrets">smrt-secrets</a> out of the tenancy interceptor: rows that must
			be queried across tenants to fulfil their purpose should not be silently filtered.
		</p>
		<p>
			<strong>Need tenant-attributed reporting?</strong> Aggregate by joining
			<code>Commission</code>
			rows back to <code>eventId</code> (in <a href="/modules/smrt-ads">smrt-ads</a>) and the
			originating ad's tenant — don't add <code>@TenantScoped</code> here.
		</p>
	</section>

	<section>
		<h2>Currency: Integer Cents</h2>
		<p>
			All monetary fields in this package are <strong>integer cents</strong> (unlike
			<a href="/modules/smrt-commerce">smrt-commerce</a>, which uses decimal fields). Display values
			must be converted via the provided helpers:
		</p>
		<CodeBlock
			code={`// Storage (integer cents)
const commission = await commissions.create({
  grossRevenue: 1000,        // $10.00
  commissionRate: 0.50,
  commissionAmount: Commission.calculateAmount(1000, 0.50),  // 500 cents — uses Math.round()
});

// Display (dollars)
commission.getAmountInDollars();   // 5.00
payout.getTotalInDollars();        // total payout in dollars

// Effective sales rate accounting for parent share
salesperson.parentCommissionShare = 0.20;       // 20% to parent publisher
salesperson.getEffectiveSalesRate();
// = salesCommissionRate × (1 − 0.20)`}
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
