<script lang="ts">
	import ModuleTabs from '$lib/components/ModuleTabs.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import {
		InvoiceCard,
		InvoiceHeader,
		InvoiceLineItems,
		InvoiceTotals,
		InvoiceActions
	} from '@happyvertical/smrt-commerce/svelte';

	const sampleInvoice = {
		id: 'inv-123',
		invoiceNumber: 'INV-2025-0001',
		status: 'sent' as const,
		issueDate: new Date('2025-01-15'),
		dueDate: new Date('2025-02-15'),
		totalAmount: 525000, // $5,250.00 in cents
		customerName: 'Acme Corporation',
		projectName: 'Website Redesign'
	};

	const sampleLineItems = [
		{
			id: 'item-1',
			description: 'Web Design Services',
			quantity: 40,
			unitPrice: 10000, // $100.00 in cents
			amount: 400000,
			category: 'Design',
			sourceType: 'time' as const
		},
		{
			id: 'item-2',
			description: 'Development Hours',
			quantity: 25,
			unitPrice: 5000, // $50.00 in cents
			amount: 125000,
			category: 'Development',
			sourceType: 'time' as const
		}
	];
</script>

<ModuleTabs
	name="smrt-commerce"
	description="E-commerce with Contract STI hierarchy (9 types), invoice lifecycle, payment tracking, fulfillment, and optional ledger integration."
	badges={['v0.29.34', 'Invoicing', 'Contract STI (9)', 'Optional Tenancy']}
>
	{#snippet docs()}
		<section>
			<h2>Overview</h2>
			<p>
				<strong>smrt-commerce</strong> covers customers, vendors, contracts (9 STI types), invoices,
				payments, and fulfillment tracking. Customer and Vendor link to
				<a href="/modules/smrt-profiles">smrt-profiles</a>
				via plain string IDs. Invoice and Payment optionally integrate with
				<a href="/modules/smrt-ledgers">smrt-ledgers</a> via dynamic import — if ledgers isn't
				installed, <code>recognizeRevenue()</code> and <code>recordPayment()</code> simply return
				<code>null</code>.
			</p>
			<aside>
				<p>Key Features:</p>
				<ul>
					<li>
						Customer/Vendor linked to Profile via plain string ID (no cross-package FK). Customer
						has <code>creditLimit</code>, <code>paymentTerms</code>; Vendor has
						<code>leadTimeDays</code>, <code>minimumOrderAmount</code>
					</li>
					<li>
						Contract STI hierarchy: <strong>Estimate</strong>, <strong>Order</strong>,
						<strong>Lease</strong>, <strong>Agreement</strong>, <strong>PurchaseOrder</strong>,
						<strong>WholesaleOrder</strong>, <strong>ProductionOrder</strong>,
						<strong>Cart</strong>, <strong>LicenseSale</strong> — 9 types sharing one table
					</li>
					<li>
						Invoice lifecycle: <code>draft → sent → viewed → partial → paid</code> (plus
						<code>overdue</code>, <code>cancelled</code>, <code>written_off</code>)
					</li>
					<li>
						Revenue recognition via <code>recognizeRevenue()</code> — creates balanced AR journal (DR
						Accounts Receivable, CR Revenue, CR Tax Payable)
					</li>
					<li>
						<strong>Invoice controls payment status</strong> — call
						<code>Invoice.updatePaymentStatus(amountPaid)</code>, not Payment
					</li>
					<li>Fulfillment/FulfillmentLineItem for shipment/delivery tracking</li>
					<li>
						Optional ledger integration via dynamic import — returns <code>null</code> when smrt-ledgers
						isn't installed
					</li>
					<li>
						<strong>Optional tenancy</strong>: all models use
						<code>@TenantScoped({'{'} mode: 'optional' {'}'})</code>
						with nullable <code>tenantId</code>
					</li>
				</ul>
			</aside>
		</section>

		<section>
			<h2>Installation</h2>
			<CodeBlock code={`npm install @happyvertical/smrt-commerce`} language="bash" />
		</section>

		<section>
			<h2>Quick Start</h2>
			<CodeBlock
				code={`import {
  Customer, CustomerCollection,
  Order, ContractCollection,
  Invoice, InvoiceCollection,
  Payment, PaymentCollection,
  ContractStatus, InvoiceStatus, PaymentMethod
} from '@happyvertical/smrt-commerce';

// Create a customer linked to a profile
const customers = new CustomerCollection(db);
const customer = await customers.create({
  profileId: 'profile-uuid',
  creditLimit: 10000.00,
  paymentTerms: 'Net 30',
});
await customer.save();

// Create an order (STI contract type)
const contracts = new ContractCollection(db);
const order = await contracts.create({
  _meta_type: 'Order',
  customerId: customer.id,
  subtotal: 1000.00,
  taxAmount: 50.00,
  totalAmount: 1050.00,
  currency: 'CAD',
});
await order.save();

// Create an invoice for the order
const invoices = new InvoiceCollection(db);
const invoiceNumber = await invoices.generateInvoiceNumber();
const invoice = await invoices.create({
  customerId: customer.id,
  contractId: order.id,
  invoiceNumber,
  subtotal: 1000.00,
  taxAmount: 50.00,
  totalAmount: 1050.00,
});
await invoice.save();

// Recognize revenue (creates balanced journal in smrt-ledgers)
await invoice.recognizeRevenue({
  arAccountId: 'ar-account-id',
  revenueAccountId: 'revenue-account-id',
  taxAccountId: 'tax-account-id',
});

// Record a payment
const payments = new PaymentCollection(db);
const payment = await payments.create({
  contractId: order.id,
  customerId: customer.id,
  amount: 1050.00,
  method: PaymentMethod.CREDIT_CARD,
});
await payment.save();`}
				language="typescript"
			/>
		</section>

		<section>
			<h2>Core Models</h2>

			<h3>Contract (STI Base — 9 Types)</h3>
			<p>
				Contract is an STI base class. Nine concrete types share one table: <strong>Estimate</strong
				>, <strong>Order</strong>, <strong>Lease</strong>, <strong>Agreement</strong>,
				<strong>PurchaseOrder</strong>, <strong>WholesaleOrder</strong>,
				<strong>ProductionOrder</strong>, <strong>Cart</strong>, and <strong>LicenseSale</strong>.
				Create via <code>ContractCollection</code> with a <code>_meta_type</code> discriminator.
			</p>
			<CodeBlock
				code={`// STI types: Estimate, Order, Lease, Agreement, PurchaseOrder,
//            WholesaleOrder, ProductionOrder, Cart, LicenseSale
class Contract extends SmrtObject {
  // Create via ContractCollection with _meta_type
  customerId?: string    // @foreignKey('Customer') — within-package FK
  vendorId?: string
  subtotal: number       // decimal (not integer cents)
  taxAmount: number
  totalAmount: number
  currency: string
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'completed' | 'cancelled'
  issueDate: Date
  dueDate?: Date
  reference?: string
  terms?: string
  // tenantScoped: optional
}`}
				language="typescript"
			/>

			<h3>Invoice</h3>
			<p>
				Status machine: <code>draft → sent → viewed → partial → paid</code> (also
				<code>overdue</code>, <code>cancelled</code>, <code>written_off</code>).
				<strong>No tax-rate field</strong>
				— tax rates must be calculated externally. <code>recognizeRevenue()</code> creates a
				balanced AR journal; ledger integration is optional via dynamic import and returns
				<code>null</code> if smrt-ledgers isn't installed.
			</p>
			<CodeBlock
				code={`class Invoice extends SmrtObject {
  invoiceNumber: string
  customerId: string
  contractId?: string
  subtotal: number          // decimal (not integer cents)
  taxAmount: number
  totalAmount: number
  amountPaid: number
  status: 'draft' | 'sent' | 'viewed' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'written_off'
  arJournalId?: string      // Plain string ref to smrt-ledgers
  revenueJournalId?: string // Plain string ref to smrt-ledgers

  // Status management (Invoice controls payment status, not Payment model)
  markSent(): void
  markViewed(): void
  updatePaymentStatus(amountPaid: number): void

  // Accounting integration (optional — dynamic import; returns null if smrt-ledgers not installed)
  async recognizeRevenue(options: RecognizeRevenueOptions): Promise<Journal | null>
  // Creates: DR Accounts Receivable, CR Revenue, CR Tax Payable
}`}
				language="typescript"
			/>

			<h3>Payment / PaymentAllocation</h3>
			<p>
				Payment tracks payments against invoices. PaymentAllocation handles payment-to-invoice
				allocation. Note: <strong>Invoice controls payment status</strong>, not the Payment model --
				use <code>Invoice.updatePaymentStatus()</code>.
			</p>
			<CodeBlock
				code={`class Payment extends SmrtObject {
  contractId: string
  customerId: string
  amount: number           // decimal
  currency: string
  method: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'crypto' | 'other'
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
  journalId?: string       // Plain string ref to smrt-ledgers

  // Ledger integration (optional)
  async recordPayment(options: RecordPaymentOptions): Promise<Journal | null>
  // Creates: DR Cash, CR Accounts Receivable
}`}
				language="typescript"
			/>

			<h3>PaymentIntent (multi-rail quote)</h3>
			<p>
				A <code>PaymentIntent</code> is a short-lived (minutes, not days) pre-payment commitment. It
				locks a USD price for a fixed window and lists one or more <code>PaymentOption</code>s, each
				describing a different payment rail (USDC-on-Base, BTC, Stripe, …). The first option that
				receives a payment wins; the others are implicitly retired. It is deliberately distinct from
				<code>Estimate</code>: no line items, just coordination of the moment-of-payment. The optional
				<code>x402Capable</code> flag on an option marks rails usable in agent-driven HTTP-402 flows.
			</p>
			<CodeBlock
				code={`// status: awaiting_payment -> paid -> (issued | retired),
//         with expired / cancelled as alternate terminal exits.
class PaymentIntent extends SmrtObject {
  offeringRef: string        // abstract idempotency scope (e.g. a Sku id)
  licenseeEmail: string
  paymentOptions: PaymentOption[]   // JSON column; one rail each
  usdPriceLocked: number     // decimal; canonical USD price
  priceLockWindowMs: number  // default 15 min
  priceLockExpiresAt: Date | null
  status: PaymentIntentStatus
  paidOptionBackendId: string       // set by the verified paid path
  paymentId: string                 // plain string ref to the Payment

  // Verified transition: loads the Payment, requires it COMPLETED, and
  // reconciles rail (backendId) + currency + nativeAmount before marking paid.
  async verifyAndMarkPaid(args: { backendId: string; paymentId: string }): Promise<void>
  markIssued(): void   // PAID -> ISSUED once rights/fulfillment are created
  expire(): void       // AWAITING_PAYMENT -> EXPIRED
  cancel(reason?: string): void
  retire(reason?: string): void     // PAID/ISSUED -> RETIRED (refund/chargeback)
  isOptionRetired(backendId: string): boolean   // flag inbound funds to losing rails
}

interface PaymentOption {
  backendId: string    // 'base-usdc' | 'btc' | 'stripe' | ...
  currency: string     // rail-qualified, e.g. 'USDC-base'
  payTo: string        // address / account / Stripe intent id
  nativeAmount: number // decimal, in 'currency'
  chain?: string
  memo?: string
  x402Capable?: boolean
  expiresAt?: string
}`}
				language="typescript"
			/>
			<Callout variant="security" title="Forge/repoint guards on the paid path">
				The generated create/update surface may only set the quote fields; <code>status</code>,
				<code>paymentId</code> and <code>paidOptionBackendId</code> are excluded so a caller cannot
				forge a PAID intent through a route. <code>save()</code> re-validates the status transition on
				every write and, for a PAID/ISSUED row, re-verifies the backing <code>Payment</code> and
				freezes <code>paymentId</code> / <code>paidOptionBackendId</code> / <code>usdPriceLocked</code>
				/ <code>paymentOptions</code>. Corrections go through <code>retire()</code> plus a fresh intent
				— a settled intent is never repointed.
			</Callout>

			<h3>Payout (read-only by audit)</h3>
			<p>
				<code>Payout</code> is the outgoing side of a <code>Payment</code>: funds leaving the
				operator's wallet for a vendor's payout address. It carries a gross / fee / net triple and a
				<code>pending → sent → confirmed</code> machine (with <code>failed</code>, resettable to
				<code>pending</code> via <code>resetFromFailed()</code>).
			</p>
			<Callout variant="security" title="No safe generated write on any surface">
				A Payout has <strong>no generated write on API, MCP, or CLI</strong> — all three surfaces are
				locked to <code>list</code> / <code>get</code>. The only way to mint one is the verified
				<code>PayoutCollection.createFromPayment()</code> domain path, which derives the amounts from
				the source Payment and starts <code>PENDING</code>. <code>save()</code> enforces the
				<code>gross = fee + net</code> invariant (non-negative), requires a <code>backendTxRef</code>
				for <code>SENT</code> / <code>CONFIRMED</code>, and caps <code>grossAmount</code> by the source
				Payment's settled funds (the source Payment must resolve).
			</Callout>
			<CodeBlock
				code={`// Build a PENDING payout from a settled Payment, then advance it explicitly.
const payouts = await PayoutCollection.create({ db });
const payout = await payouts.createFromPayment({
  payment,                 // the source Payment row
  vendorId: vendor.id,
  operatorFee: 5.0,        // in the payment's native currency
});
await payout.save();       // validates gross/fee/net + caps by source Payment

payout.markSent('0xabc…'); // PENDING -> SENT (backendTxRef required)
await payout.save();
payout.markConfirmed();    // SENT -> CONFIRMED (only reachable from SENT)
await payout.save();`}
				language="typescript"
			/>

			<h3>LicenseSale (immutable once issued)</h3>
			<p>
				<code>LicenseSale</code> is the licensing STI subtype: one sale of rights for a fee, with a
				typed rights snapshot (medium, distribution scope, exclusivity, duration, territory,
				sublicensing, derivatives) plus signed-PDF artefacts (<code>pdfUrl</code>,
				<code>pdfHash</code>, optional <code>onChainHashRegistryRef</code>).
			</p>
			<Callout variant="warning" title="Rights freeze at ACCEPTED">
				Once a <code>LicenseSale</code> is saved with status <code>ACCEPTED</code>, its rights
				snapshot is frozen — re-saving with mutated <code>rights*</code> fields throws. The only legal
				move out of <code>ACCEPTED</code> is <code>revoke()</code> (sets <code>CANCELLED</code>
				without touching the snapshot). To change terms, issue a <em>new</em> LicenseSale and leave the
				old row as the historical record.
			</Callout>
			<CodeBlock
				code={`const contracts = new ContractCollection(db);
const license = await contracts.create({
  _meta_type: 'LicenseSale',
  skuId: 'sku-uuid',
  licenseeEmail: 'buyer@example.com',
  paymentId: payment.id,
  rightsMedium: 'web,social',
  rightsExclusivity: 'non-exclusive',
  rightsDuration: 'perpetual',
  rightsTerritory: 'worldwide',
  status: 'accepted',     // freezes the rights snapshot on save
});
await license.save();

license.getRightsSnapshot();  // typed LicenseRightsSnapshot
license.revoke();             // ACCEPTED -> CANCELLED, snapshot untouched
await license.save();`}
				language="typescript"
			/>
		</section>

		<section>
			<h2>Cart → Order at checkout</h2>
			<p>
				<code>Cart</code> and <code>Order</code> are both Contract STI subtypes sharing the
				<code>contracts</code> table, so a cart holds the same line items, totals, and customer
				reference as a real order. Checkout promotes the row <strong>in place</strong> — the
				application flips <code>_meta_type</code> from <code>Cart</code> to <code>Order</code> rather
				than copying data between tables. A <code>Cart</code> starts in <code>draft</code> via the
				base <code>Contract.status</code> default; the framework does not enforce a cart → order state
				machine, so application code advances the status at checkout.
			</p>
			<CodeBlock
				code={`const contracts = new ContractCollection(db);

// Shopper's working cart (transient order-in-progress).
const cart = await contracts.create({
  _meta_type: 'Cart',
  customerId: customer.id,
  currency: 'USD',
});
await cart.save();

// …add line items / totals onto the same row…

// Promote in place at checkout: same row, new discriminator + status.
cart._meta_type = 'Order';
cart.status = 'pending';
await cart.save();`}
				language="typescript"
			/>
		</section>

		<section>
			<h2>Invoice Management</h2>

			<h3>Invoice Lifecycle</h3>
			<CodeBlock
				code={`// 1. Create draft invoice
const invoice = await invoices.create({
  customerId: customer.id,
  invoiceNumber: await invoices.generateInvoiceNumber({
    prefix: 'INV',           // Custom prefix
    format: 'prefix-year-seq' // INV-2025-0001
  }),
  issueDate: new Date(),
  dueDate: new Date(Date.now() + 30 * 86400000),
  status: 'DRAFT'
});
await invoice.save();

// 2. Add line items
const item = await lineItems.create({
  invoiceId: invoice.id,
  description: 'Web Development',
  quantity: 40,
  unitPrice: 125,
  taxRate: 0.05,
  sourceType: 'contract',
  sourceId: order.id
});
item.amount = item.calculateAmount();
await item.save();

// 3. Update invoice totals
invoice.subtotal = await lineItems.getSubtotalForInvoice(invoice.id);
invoice.taxAmount = await lineItems.getTaxForInvoice(invoice.id);
invoice.totalAmount = await lineItems.getTotalForInvoice(invoice.id);
await invoice.save();

// 4. Send to customer
invoice.markSent();
await invoice.save();

// 5. Track customer view
invoice.markViewed();
await invoice.save();

// 6. Recognize revenue (accounting)
const journal = await invoice.recognizeRevenue({
  arAccountId: arAccount.id,
  revenueAccountId: revenueAccount.id,
  taxAccountId: taxAccount.id   // optional
});
// Creates: Debit AR, Credit Revenue, Credit Tax Payable`}
				language="typescript"
			/>

			<h3>Payment Allocation</h3>
			<CodeBlock
				code={`// Record payment
const payment = await payments.create({
  contractId: order.id,
  customerId: customer.id,
  amount: 5250,
  method: 'BANK_TRANSFER',
  transactionId: 'bank_123'
});
await payment.save();

// Record with ledger
const journal = await payment.recordPayment({
  ledgerId: ledger.id,
  receivablesAccountId: arAccount.id,
  cashAccountId: bankAccount.id
});
// Creates: Debit Cash, Credit AR

// Check available amount
const available = await allocations.getUnallocatedFromPayment(
  payment.id, payment.amount
);

// Allocate to invoices
const allocation1 = await allocations.create({
  paymentId: payment.id,
  invoiceId: invoice1.id,
  amount: 1050,
  allocatedBy: 'user-uuid'
});
await allocation1.save();

const allocation2 = await allocations.create({
  paymentId: payment.id,
  invoiceId: invoice2.id,
  amount: 4200,
  allocatedBy: 'user-uuid'
});
await allocation2.save();

// Update invoice statuses
const total1 = await allocations.getTotalAllocatedToInvoice(invoice1.id);
invoice1.updatePaymentStatus(total1);
await invoice1.save(); // Status becomes PAID

const total2 = await allocations.getTotalAllocatedToInvoice(invoice2.id);
invoice2.updatePaymentStatus(total2);
await invoice2.save(); // Status becomes PARTIAL or PAID`}
				language="typescript"
			/>
		</section>

		<section>
			<h2>Cross-Package References</h2>
			<p>
				Within-package relationships use <code>@foreignKey()</code>. Cross-package links are plain
				string IDs — this avoids circular dependencies (see the framework standards in
				<code>docs/content/standards.md §7</code>):
			</p>
			<ul>
				<li>
					<code>customerId</code> → <code>@foreignKey('Customer')</code> (within-package hard reference)
				</li>
				<li>
					<code>profileId</code> → plain string to
					<a href="/modules/smrt-profiles">smrt-profiles</a>
				</li>
				<li>
					<code>arJournalId</code>, <code>revenueJournalId</code> → plain string to
					<a href="/modules/smrt-ledgers">smrt-ledgers</a>
				</li>
			</ul>
			<p>
				To fetch the linked Profile object you must instantiate a <code>ProfileCollection</code> separately
				and look it up by ID.
			</p>
		</section>

		<section>
			<h2>Tenancy</h2>
			<p>
				All models in this package apply <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code>
				from <a href="/modules/smrt-tenancy">smrt-tenancy</a> with a nullable <code>tenantId</code>
				column. Rows created inside a <code>withTenant()</code> context are filtered automatically; rows
				created outside a tenant context are visible to all tenants — useful for shared customer catalogs
				or single-tenant deployments.
			</p>
		</section>

		<section>
			<h2>Best Practices</h2>
			<div>
				<div>
					<h3>DOs</h3>
					<ul>
						<li>Use <code>generateInvoiceNumber()</code> for race-free numbering</li>
						<li>
							Always allocate payments to specific invoices via <code>PaymentAllocation</code>
						</li>
						<li>Check <code>getUnallocatedFromPayment()</code> before allocating</li>
						<li>
							Call <code>recognizeRevenue()</code> after sending invoices (no-op if ledgers absent)
						</li>
						<li>Recalculate invoice totals after line-item changes</li>
						<li>
							Use <code>Invoice.updatePaymentStatus(totalAllocated)</code> to drive status — never set
							status manually on Payment
						</li>
					</ul>
				</div>
				<div>
					<h3>DON'Ts</h3>
					<ul>
						<li>Don't manually set invoice numbers (race conditions)</li>
						<li>Don't over-allocate payments (check available first)</li>
						<li>Don't cancel paid invoices — use <code>writeOff</code> instead</li>
						<li>Don't skip <code>updatePaymentStatus()</code> after allocation</li>
						<li>Don't modify line items without recalculating totals</li>
						<li>
							Don't store currency as integer cents here — commerce uses <strong>decimal</strong> fields
							(affiliates uses cents — different convention)
						</li>
					</ul>
				</div>
			</div>
		</section>
	{/snippet}

	{#snippet components()}
		<section>
			<h2>Commerce Components</h2>
			<p>
				The <code>@happyvertical/smrt-commerce</code> package includes 6 Svelte 5 components for
				building complete invoicing and billing interfaces:
				<code>InvoiceCard</code>, <code>InvoiceHeader</code>, <code>InvoiceLineItems</code>,
				<code>InvoiceTotals</code>, <code>InvoiceActions</code>, and <code>UnbilledItems</code>.
			</p>

			<h2>InvoiceCard</h2>
			<p>Display a summary of an invoice in card format.</p>

			<ComponentExample
				code={`<InvoiceCard
  invoice={{
    invoiceNumber: 'INV-2025-0001',
    status: 'sent',
    totalAmount: 525000,
    customerName: 'Acme Corporation'
  }}
  currency="USD"
/>`}
			>
				<InvoiceCard invoice={sampleInvoice} currency="USD" />
			</ComponentExample>

			<h2>InvoiceLineItems</h2>
			<p>Editable table for invoice line items with calculations.</p>

			<ComponentExample
				code={`<InvoiceLineItems
  items={lineItems}
  currency="USD"
  editable={false}
/>`}
			>
				<InvoiceLineItems items={sampleLineItems} currency="USD" editable={false} />
			</ComponentExample>

			<h2>Full Invoice View</h2>
			<p>Combine multiple components for a complete invoice display.</p>

			<ComponentExample
				code={`<div class="invoice">
  <InvoiceHeader {invoice} />
  <InvoiceLineItems {items} currency="USD" />
  <InvoiceTotals {invoice} currency="USD" />
  <InvoiceActions
    status={invoice.status}
    onsend={() => {}}
    onprint={() => {}}
  />
</div>`}
			>
				<div class="invoice-demo">
					<InvoiceLineItems items={sampleLineItems} currency="USD" editable={false} />
				</div>
			</ComponentExample>

			<h2>Installation</h2>
			<CodeBlock
				code={`npm install @happyvertical/smrt-commerce

import {
  InvoiceCard,
  InvoiceHeader,
  InvoiceLineItems,
  InvoiceTotals,
  InvoiceActions
} from '@happyvertical/smrt-commerce/svelte';`}
				language="bash"
			/>

			<p>
				<a href="/components/commerce">View detailed component docs →</a>
			</p>
		</section>

		<section>
			<h2>Related Modules</h2>
			<div class="link-grid">
				<a href="/modules/smrt-ledgers" class="link-card">
					<h3>smrt-ledgers</h3>
					<p>Double-entry accounting integration</p>
				</a>
				<a href="/modules/smrt-profiles" class="link-card">
					<h3>smrt-profiles</h3>
					<p>Customer/vendor profile links</p>
				</a>
				<a href="/modules/smrt-products" class="link-card">
					<h3>smrt-products</h3>
					<p>Product catalog for line items</p>
				</a>
				<a href="/modules/smrt-projects" class="link-card">
					<h3>smrt-projects</h3>
					<p>Time tracking for invoicing</p>
				</a>
			</div>
		</section>
	{/snippet}
</ModuleTabs>
