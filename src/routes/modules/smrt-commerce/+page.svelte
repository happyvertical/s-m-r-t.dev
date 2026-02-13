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
	description="Complete commerce system with contracts, invoicing, payments, fulfillment tracking, and accounting integration."
	badges={['v0.19.0', 'Invoicing', '6 Components']}
>
	{#snippet docs()}
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-commerce</strong> provides complete commerce management including orders, invoices,
			payments, and fulfillment tracking. It integrates with smrt-ledgers for double-entry accounting
			and supports external accounting systems via the @happyvertical/accounting SDK.
		</p>
		<div>
			<p>Key Features:</p>
			<ul>
				<li>Contract management with STI (orders, estimates, leases, agreements)</li>
				<li>Invoice generation with auto-numbering and multi-status workflow</li>
				<li>Payment recording with allocation to invoices</li>
				<li>Ledger integration (AR/revenue recognition)</li>
				<li>Fulfillment tracking with shipping/delivery</li>
				<li>6 new Svelte 5 invoice components</li>
			</ul>
		</div>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-commerce`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  CustomerCollection, InvoiceCollection,
  InvoiceLineItemCollection, PaymentCollection
} from '@happyvertical/smrt-commerce';

// Initialize
const customers = await CustomerCollection.create({ db: {...} });
const invoices = await InvoiceCollection.create({ db: {...} });
const lineItems = await InvoiceLineItemCollection.create({ db: {...} });
const payments = await PaymentCollection.create({ db: {...} });

// Create customer
const customer = await customers.create({
  profileId: 'profile-uuid',
  creditLimit: 50000,
  paymentTerms: 'Net 30'
});
await customer.save();

// Create invoice
const invoice = await invoices.create({
  customerId: customer.id,
  invoiceNumber: await invoices.generateInvoiceNumber(), // INV-2025-0001
  issueDate: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  subtotal: 1000,
  taxAmount: 50,
  totalAmount: 1050,
  status: 'DRAFT'
});
await invoice.save();

// Add line items
const item = await lineItems.create({
  invoiceId: invoice.id,
  description: 'Consulting Services',
  quantity: 50,
  unitPrice: 20,
  taxRate: 0.05
});
item.amount = item.calculateAmount();
await item.save();

// Send invoice
invoice.markSent();
await invoice.save();

// Record payment
const payment = await payments.create({
  customerId: customer.id,
  amount: 1050,
  method: 'BANK_TRANSFER'
});
await payment.save();`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Contract (STI Base)</h3>
		<CodeBlock
			code={`class Contract extends SmrtObject {
  contractType: 'ORDER' | 'ESTIMATE' | 'LEASE' | 'AGREEMENT' | 'PURCHASE_ORDER'
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED'
  customerId?: string
  vendorId?: string
  subtotal: number
  taxAmount: number
  totalAmount: number
  issueDate: Date
  dueDate?: Date
  expiryDate?: Date  // For estimates
  reference?: string
  terms?: string

  isDraft(): boolean
  isAccepted(): boolean
  isCompleted(): boolean
  isExpired(): boolean
  isOverdue(): boolean
  recalculateTotals(): void
}`}
			language="typescript"
		/>

		<h3>Invoice</h3>
		<CodeBlock
			code={`class Invoice extends SmrtObject {
  invoiceNumber: string
  customerId: string
  contractId?: string
  issueDate: Date
  dueDate: Date
  paidDate?: Date
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'WRITTEN_OFF'
  subtotal: number
  taxAmount: number
  totalAmount: number
  amountPaid: number
  arJournalId?: string      // Ledger integration
  revenueJournalId?: string
  sentAt?: Date
  viewedAt?: Date

  // Status management
  markSent(): void
  markViewed(): void
  updatePaymentStatus(amountPaid: number): void
  cancel(): void
  writeOff(): void

  // Financial
  getAmountDue(): number
  isPaid(): boolean
  isOverdue(): boolean

  // Accounting integration
  async recognizeRevenue(options): Promise<Journal>
  toAccountingInput(): any
}`}
			language="typescript"
		/>

		<h3>Payment</h3>
		<CodeBlock
			code={`class Payment extends SmrtObject {
  contractId: string
  customerId: string
  amount: number
  currency: string
  method: 'CASH' | 'CHECK' | 'CREDIT_CARD' | 'BANK_TRANSFER' | 'CRYPTO' | 'OTHER'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
  transactionId?: string
  journalId?: string  // Ledger integration
  paidAt?: Date

  async recordPayment(options): Promise<Journal>
  markFailed(reason: string): void
  cancel(): void
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
			<h2>Best Practices</h2>
			<div>
				<div>
					<h3>DOs</h3>
					<ul>
						<li>Use generateInvoiceNumber() for consistent numbering</li>
						<li>Always allocate payments to specific invoices</li>
						<li>Check getUnallocatedFromPayment() before allocating</li>
						<li>Call recognizeRevenue() after sending invoices</li>
						<li>Recalculate invoice totals after line item changes</li>
					</ul>
				</div>
				<div>
					<h3>DON'Ts</h3>
					<ul>
						<li>Don't manually set invoice numbers (race conditions)</li>
						<li>Don't over-allocate payments (check available first)</li>
						<li>Don't cancel paid invoices (use writeOff if needed)</li>
						<li>Don't skip updatePaymentStatus() after allocation</li>
						<li>Don't modify line items without recalculating totals</li>
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
