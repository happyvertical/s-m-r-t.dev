<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-commerce - Commerce & Invoicing | SMRT Framework</title>
  <meta name="description" content="Complete commerce system with contracts, invoicing, payments, and ledger integration." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-commerce</h1>
    <p class="text-xl text-gray-600 mb-4">
      Complete commerce system with contracts, invoicing, payments, fulfillment tracking, and accounting integration.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Invoicing</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Payments</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">6 Components</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-commerce</strong> provides complete commerce management including orders, invoices, payments, and fulfillment tracking.
      It integrates with smrt-ledgers for double-entry accounting and supports external accounting systems via the @happyvertical/accounting SDK.
    </p>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <p class="font-semibold mb-2">Key Features:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Contract management with STI (orders, estimates, leases, agreements)</li>
        <li>Invoice generation with auto-numbering and multi-status workflow</li>
        <li>Payment recording with allocation to invoices</li>
        <li>Ledger integration (AR/revenue recognition)</li>
        <li>Fulfillment tracking with shipping/delivery</li>
        <li>6 new Svelte 5 invoice components</li>
      </ul>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install @happyvertical/smrt-commerce`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Core Models</h2>

    <h3 class="text-2xl font-semibold mb-3">Contract (STI Base)</h3>
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

    <h3 class="text-2xl font-semibold mb-3 mt-6">Invoice</h3>
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

    <h3 class="text-2xl font-semibold mb-3 mt-6">Payment</h3>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Invoice Management</h2>

    <h3 class="text-2xl font-semibold mb-3">Invoice Lifecycle</h3>
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

    <h3 class="text-2xl font-semibold mb-3 mt-6">Payment Allocation</h3>
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

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Svelte Components (NEW v0.19.0)</h2>

    <h3 class="text-2xl font-semibold mb-3">Component Registration</h3>
    <CodeBlock
      code={`import '@happyvertical/smrt-commerce/svelte';
// Auto-registers all 6 invoice components`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">InvoiceCard</h3>
    <CodeBlock
      code={`<InvoiceCard
  invoice={{'}
    invoiceNumber: 'INV-2025-0001',
    status: 'SENT',
    totalAmount: 1050,
    dueDate: new Date('2025-02-15'),
    customerName: 'Acme Corp'
  {'}}
  currency="USD"
  href="/invoices/123"
/>`}
      language="svelte"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">InvoiceLineItems</h3>
    <CodeBlock
      code={`<InvoiceLineItems
  items={[
    {
      description: 'Consulting',
      quantity: 40,
      unitPrice: 125,
      amount: 5000,
      sourceType: 'time'
    }
  ]}
  editable={true}
  currency="USD"
  showSource={true}
  onupdate={(item) => saveLineItem(item)}
  ondelete={(item) => deleteLineItem(item)}
  onadd={() => addLineItem()}
/>`}
      language="svelte"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">InvoiceActions</h3>
    <CodeBlock
      code={`<InvoiceActions
  status="DRAFT"
  onsend={() => sendInvoice()}
  onedit={() => editInvoice()}
  ondelete={() => deleteInvoice()}
  onprint={() => printInvoice()}
/>`}
      language="svelte"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Best Practices</h2>
    <div class="space-y-6">
      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✓ DOs</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Use generateInvoiceNumber() for consistent numbering</li>
          <li>Always allocate payments to specific invoices</li>
          <li>Check getUnallocatedFromPayment() before allocating</li>
          <li>Call recognizeRevenue() after sending invoices</li>
          <li>Recalculate invoice totals after line item changes</li>
        </ul>
      </div>
      <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✗ DON'Ts</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Don't manually set invoice numbers (race conditions)</li>
          <li>Don't over-allocate payments (check available first)</li>
          <li>Don't cancel paid invoices (use writeOff if needed)</li>
          <li>Don't skip updatePaymentStatus() after allocation</li>
          <li>Don't modify line items without recalculating totals</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-ledgers" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-ledgers</h3>
        <p class="text-sm text-gray-600">Double-entry accounting integration</p>
      </a>
      <a href="/modules/smrt-profiles" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-profiles</h3>
        <p class="text-sm text-gray-600">Customer/vendor profile links</p>
      </a>
      <a href="/modules/smrt-products" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-products</h3>
        <p class="text-sm text-gray-600">Product catalog for line items</p>
      </a>
      <a href="/modules/smrt-projects" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-projects</h3>
        <p class="text-sm text-gray-600">Time tracking for invoicing</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-events" class="text-blue-600 hover:underline">Next: smrt-events →</a>
    </div>
  </div>
</div>
