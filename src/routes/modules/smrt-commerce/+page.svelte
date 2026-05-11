<script lang="ts">
	import ModuleTabs from '$lib/components/ModuleTabs.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import ComponentExample from '$lib/components/ComponentExample.svelte';
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
	description="E-commerce with Contract STI hierarchy (5 types), invoice lifecycle, payment tracking, fulfillment, and optional ledger integration."
	badges={['v0.24.12', 'Invoicing', 'Contract STI (5)', 'Optional Tenancy']}
>
	{#snippet docs()}
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-commerce</strong> covers customers, vendors, contracts (5 STI types), invoices,
			payments, and fulfillment tracking. Customer and Vendor link to <a href="/modules/smrt-profiles">smrt-profiles</a>
			via plain string IDs. Invoice and Payment optionally integrate with
			<a href="/modules/smrt-ledgers">smrt-ledgers</a> via dynamic import — if ledgers isn't
			installed, <code>recognizeRevenue()</code> and <code>recordPayment()</code> simply return
			<code>null</code>.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Customer/Vendor linked to Profile via plain string ID (no cross-package FK). Customer has <code>creditLimit</code>, <code>paymentTerms</code>; Vendor has <code>leadTimeDays</code>, <code>minimumOrder</code></li>
				<li>Contract STI hierarchy: <strong>Estimate</strong>, <strong>Order</strong>, <strong>Lease</strong>, <strong>Agreement</strong>, <strong>PurchaseOrder</strong> — 5 types sharing one table</li>
				<li>Invoice lifecycle: <code>draft → sent → viewed → partial → paid</code> (plus <code>overdue</code>, <code>cancelled</code>, <code>written_off</code>)</li>
				<li>Revenue recognition via <code>recognizeRevenue()</code> — creates balanced AR journal (DR Accounts Receivable, CR Revenue, CR Tax Payable)</li>
				<li><strong>Invoice controls payment status</strong> — call <code>Invoice.updatePaymentStatus(amountPaid)</code>, not Payment</li>
				<li>Fulfillment/FulfillmentLineItem for shipment/delivery tracking</li>
				<li>Optional ledger integration via dynamic import — returns <code>null</code> when smrt-ledgers isn't installed</li>
				<li><strong>Optional tenancy</strong>: all models use <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code> with nullable <code>tenantId</code></li>
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

		<h3>Contract (STI Base — 5 Types)</h3>
		<p>Contract is an STI base class. Five concrete types share one table: <strong>Estimate</strong>, <strong>Order</strong>, <strong>Lease</strong>, <strong>Agreement</strong>, and <strong>PurchaseOrder</strong>. Create via <code>ContractCollection</code> with a <code>_meta_type</code> discriminator.</p>
		<CodeBlock
			code={`// STI types: Estimate, Order, Lease, Agreement, PurchaseOrder
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
		<p>Status machine: <code>draft → sent → viewed → partial → paid</code> (also <code>overdue</code>, <code>cancelled</code>, <code>written_off</code>). <strong>No tax-rate field</strong> — tax rates must be calculated externally. <code>recognizeRevenue()</code> creates a balanced AR journal; ledger integration is optional via dynamic import and returns <code>null</code> if smrt-ledgers isn't installed.</p>
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
		<p>Payment tracks payments against invoices. PaymentAllocation handles payment-to-invoice allocation. Note: <strong>Invoice controls payment status</strong>, not the Payment model -- use <code>Invoice.updatePaymentStatus()</code>.</p>
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
  ledgerId: ledger.id,
  receivablesAccountId: arAccount.id,
  revenueAccountId: revenueAccount.id,
  taxPayableAccountId: taxAccount.id
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
			<p>Within-package relationships use <code>@foreignKey()</code>. Cross-package links are plain string IDs — this avoids circular dependencies (see the framework standards in <code>docs/content/standards.md §7</code>):</p>
			<ul>
				<li><code>customerId</code> → <code>@foreignKey('Customer')</code> (within-package hard reference)</li>
				<li><code>profileId</code> → plain string to <a href="/modules/smrt-profiles">smrt-profiles</a></li>
				<li><code>arJournalId</code>, <code>revenueJournalId</code> → plain string to <a href="/modules/smrt-ledgers">smrt-ledgers</a></li>
			</ul>
			<p>To fetch the linked Profile object you must instantiate a <code>ProfileCollection</code> separately and look it up by ID.</p>
		</section>

		<section>
			<h2>Tenancy</h2>
			<p>All models in this package apply <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code> from <a href="/modules/smrt-tenancy">smrt-tenancy</a> with a nullable <code>tenantId</code> column. Rows created inside a <code>withTenant()</code> context are filtered automatically; rows created outside a tenant context are visible to all tenants — useful for shared customer catalogs or single-tenant deployments.</p>
		</section>

		<section>
			<h2>Best Practices</h2>
			<div>
				<div>
					<h3>DOs</h3>
					<ul>
						<li>Use <code>generateInvoiceNumber()</code> for race-free numbering</li>
						<li>Always allocate payments to specific invoices via <code>PaymentAllocation</code></li>
						<li>Check <code>getUnallocatedFromPayment()</code> before allocating</li>
						<li>Call <code>recognizeRevenue()</code> after sending invoices (no-op if ledgers absent)</li>
						<li>Recalculate invoice totals after line-item changes</li>
						<li>Use <code>Invoice.updatePaymentStatus(totalAllocated)</code> to drive status — never set status manually on Payment</li>
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
						<li>Don't store currency as integer cents here — commerce uses <strong>decimal</strong> fields (affiliates uses cents — different convention)</li>
					</ul>
				</div>
			</div>
		</section>
	{/snippet}

	{#snippet components()}
		<section>
			<h2>Commerce Components</h2>
			<p>
				The <code>@happyvertical/smrt-commerce</code> package includes 6 Svelte 5 components for building
				complete invoicing and billing interfaces.
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
