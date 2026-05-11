<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-ledgers - Double-Entry Accounting | SMRT Framework</title>
	<meta
		name="description"
		content="Production-ready double-entry accounting ledger with chart of accounts, journal management, and automatic balance calculation for financial systems."
	/>
</svelte:head>

<ModulePage
	name="smrt-ledgers"
	description="Double-entry accounting with chart of accounts, journal lifecycle, balance enforcement, and tenant-overridable AI summaries via smrt-prompts."
	badges={['v0.24.12', 'Accounting', 'Double-Entry', 'Prompt Registry']}
>
	<!-- Overview -->
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-ledgers</strong> is a production-ready double-entry accounting system built on the
			SMRT framework. It provides the core accounting engine for financial systems, commerce modules,
			and business applications that need to track monetary transactions with proper accounting principles.
		</p>
		<p>
			The module enforces double-entry bookkeeping rules (debits = credits), supports hierarchical
			chart of accounts, multi-currency transactions, and tracks journal lifecycle from draft to
			posted to voided. Running balances and trial balances are calculated automatically from posted
			entries.
		</p>
		<aside>
			<p><strong>Key Features:</strong></p>
			<ul>
				<li>Enforced double-entry bookkeeping (debits = credits always)</li>
				<li>Five account types: Asset, Liability, Equity, Revenue, Expense</li>
				<li>Hierarchical chart of accounts with parent-child relationships</li>
				<li>Three-stage journal lifecycle (draft → posted → voided)</li>
				<li>Automatic running balance calculation from posted entries</li>
				<li>Multi-currency support with exchange rates</li>
				<li>Integration with commerce, invoicing, and other business modules</li>
				<li>Trial balance generation and account ledgers</li>
			</ul>
		</aside>
	</section>

	<!-- Installation -->
	<section>
		<h2>Installation</h2>
		<CodeBlock
			code={`npm install @happyvertical/smrt-ledgers
# or
pnpm add @happyvertical/smrt-ledgers`}
			language="bash"
		/>
		<p>
			The module depends on <code>@happyvertical/smrt-core</code> for SmrtObject and SmrtCollection
			base classes. It integrates seamlessly with <code>smrt-tenancy</code> for multi-tenant
			isolation and <code>smrt-commerce</code>
			for automatic transaction recording.
		</p>
	</section>

	<!-- Quick Start -->
	<section>
		<h2>Quick Start (5 Minutes)</h2>
		<p>
			Here's a minimal example showing how to set up a chart of accounts, create a journal entry,
			and post a transaction:
		</p>

		<h3>1. Initialize Collections</h3>
		<CodeBlock
			code={`import { AccountCollection, JournalCollection, JournalEntryCollection } from '@happyvertical/smrt-ledgers';

const accounts = new AccountCollection({ db: {...} });
const journals = new JournalCollection({ db: {...} });
const entries = new JournalEntryCollection({ db: {...} });`}
			language="typescript"
		/>

		<h3>2. Create Chart of Accounts</h3>
		<CodeBlock
			code={`// Create asset account (debit-normal)
const cashAccount = await accounts.create({
  number: '1000',
  name: 'Cash',
  type: 'asset',
  description: 'Cash on hand and in bank'
});

// Create revenue account (credit-normal)
const salesAccount = await accounts.create({
  number: '4000',
  name: 'Sales Revenue',
  type: 'revenue',
  description: 'Product and service sales'
});`}
			language="typescript"
		/>

		<h3>3. Create and Post a Journal Entry</h3>
		<CodeBlock
			code={`// Record a $150 cash sale
const journal = await journals.createWithEntries({
  date: new Date('2025-01-12'),
  description: 'Cash sale - Product #123',
  entries: [
    {
      accountId: cashAccount.id,
      debit: 150,
      credit: 0,
      currency: 'USD',
      memo: 'Cash received'
    },
    {
      accountId: salesAccount.id,
      debit: 0,
      credit: 150,
      currency: 'USD',
      memo: 'Revenue recognized'
    }
  ]
});

// Post the journal (validates balance first)
await journal.post();
console.log('Journal posted:', journal.number); // "JNL-0001"`}
			language="typescript"
		/>

		<h3>4. Query Account Balances</h3>
		<CodeBlock
			code={`// Get current balance for cash account
const cashBalance = await entries.getAccountBalance(cashAccount.id);
console.log('Cash balance:', cashBalance); // 150 (debit-normal, so positive)

// Get trial balance for all accounts
const trialBalance = await entries.getTrialBalance();
console.log('Trial balance:', trialBalance);
// [
//   { accountNumber: '1000', accountName: 'Cash', debit: 150, credit: 0 },
//   { accountNumber: '4000', accountName: 'Sales Revenue', debit: 0, credit: 150 }
// ]
// Total debits: 150, Total credits: 150 ✓`}
			language="typescript"
		/>
	</section>

	<!-- Core Concepts -->
	<section>
		<h2>Core Concepts</h2>

		<h3>Double-Entry Bookkeeping</h3>
		<p>
			Every transaction must balance: <strong>Total Debits = Total Credits</strong>. The system
			enforces this rule before posting journals. Balance check uses
			<code>Math.abs(totalDebits - totalCredits) &lt; BALANCE_EPSILON</code> where
			<code>BALANCE_EPSILON = 0.01</code> (floating-point rounding tolerance).
		</p>
		<aside>
			<p><strong>Key Rules:</strong></p>
			<ul>
				<li>Each entry is debit XOR credit (not both, validated on save)</li>
				<li>All amounts must be non-negative; zero-amount entries are rejected</li>
				<li>Journal must balance before posting (<code>BALANCE_EPSILON = 0.01</code>)</li>
				<li>Posted journals are <strong>immutable</strong> — can only be voided, not edited</li>
				<li>Entry requires <code>journalId</code>: save Journal first, then add entries</li>
				<li>Account types are inherited by children (child cannot differ from parent type)</li>
				<li>All models use <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code></li>
			</ul>
		</aside>

		<h3>Account Types</h3>
		<p>
			The five fundamental account types follow standard accounting principles. Each type has a
			"normal balance" (debit or credit) that determines how increases and decreases are recorded:
		</p>

		<article>
			<h4>1. Asset Accounts (Debit-Normal)</h4>
			<p>Resources owned by the business. Increased by debits, decreased by credits.</p>
			<p>
				<strong>Examples:</strong> Cash, Bank Accounts, Accounts Receivable, Inventory, Equipment
			</p>
			<p><code>Balance = Debits - Credits</code></p>
		</article>

		<article>
			<h4>2. Liability Accounts (Credit-Normal)</h4>
			<p>Obligations owed to others. Increased by credits, decreased by debits.</p>
			<p>
				<strong>Examples:</strong> Accounts Payable, Credit Cards, Loans, Accrued Expenses
			</p>
			<p><code>Balance = Credits - Debits</code></p>
		</article>

		<article>
			<h4>3. Equity Accounts (Credit-Normal)</h4>
			<p>Owner's stake in the business. Increased by credits, decreased by debits.</p>
			<p>
				<strong>Examples:</strong> Owner Capital, Retained Earnings, Common Stock
			</p>
			<p><code>Balance = Credits - Debits</code></p>
		</article>

		<article>
			<h4>4. Revenue Accounts (Credit-Normal)</h4>
			<p>Income earned from operations. Increased by credits, decreased by debits.</p>
			<p>
				<strong>Examples:</strong> Sales, Service Income, Interest Income, Rental Income
			</p>
			<p><code>Balance = Credits - Debits</code></p>
		</article>

		<article>
			<h4>5. Expense Accounts (Debit-Normal)</h4>
			<p>Costs of doing business. Increased by debits, decreased by credits.</p>
			<p>
				<strong>Examples:</strong> Rent, Utilities, Supplies, Cost of Goods Sold, Salaries
			</p>
			<p><code>Balance = Debits - Credits</code></p>
		</article>

		<h3>Hierarchical Chart of Accounts</h3>
		<p>
			Accounts can be organized in parent-child hierarchies for better organization and reporting:
		</p>
		<CodeBlock
			code={`// Create parent account
const assets = await accounts.create({
  number: '1000',
  name: 'Assets',
  type: 'asset'
});

// Create child account
const currentAssets = await assets.createChild({
  number: '1100',
  name: 'Current Assets'
});

// Create grandchild
const cash = await currentAssets.createChild({
  number: '1110',
  name: 'Cash'
});

// Get full path
console.log(await cash.getFullPath()); // "Assets > Current Assets > Cash"`}
			language="typescript"
		/>

		<h3>Journal Lifecycle</h3>
		<p>Journals progress through three states:</p>

		<article>
			<h4>Draft Status</h4>
			<p>
				Editable state where entries can be added or removed. Journals start in draft and must
				balance before posting. Draft journals do not affect account balances.
			</p>
		</article>

		<article>
			<h4>Posted Status</h4>
			<p>
				Immutable, locked state after validation. Posted journals are included in balance
				calculations. The <code>postedAt</code> timestamp is recorded. Cannot be edited or deleted.
			</p>
		</article>

		<article>
			<h4>Voided Status</h4>
			<p>
				Marked as cancelled with reason. Voided journals are excluded from balance calculations. The <code
					>voidedAt</code
				>
				timestamp and <code>voidReason</code> are recorded.
			</p>
		</article>

		<CodeBlock
			code={`// Create draft journal
const journal = await journals.createWithEntries({ /* ... */ });
console.log(journal.isDraft()); // true

// Add more entries while in draft
await journal.addEntry({
  accountId: taxAccount.id,
  debit: 10,
  credit: 0,
  memo: 'Sales tax'
});

// Post when ready (validates balance)
await journal.post();
console.log(journal.isPosted()); // true
console.log(journal.isEditable()); // false

// Void if needed
await journal.void('Entry error - wrong amount');
console.log(journal.isVoided()); // true`}
			language="typescript"
		/>
	</section>

	<!-- API Reference -->
	<section>
		<h2>API Reference</h2>

		<h3>Account Model</h3>
		<CodeBlock
			code={`class Account extends SmrtObject {
  // Core properties
  number: string              // e.g., "1000", "5030"
  name: string                // e.g., "Cash", "Coffee Expense"
  description: string
  type: AccountType           // 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  parentId: string | null     // Parent account for hierarchy
  active: boolean
  metadata: Record<string, unknown>

  // Type-checking methods
  isDebitNormal(): boolean    // true for asset, expense
  isCreditNormal(): boolean   // true for liability, equity, revenue
  isTopLevel(): boolean

  // Hierarchy navigation
  async getParent(): Account | null
  async getChildren(): Account[]
  async getAncestors(): Account[]
  async getFullPath(): string                    // "Assets > Current > Cash"
  async toTreeNode(): AccountTreeNode
  async createChild(options): Account

  // Balance queries
  async getBalance(asOfDate?: Date): number
}`}
			language="typescript"
		/>

		<h3>Journal Model</h3>
		<CodeBlock
			code={`class Journal extends SmrtObject {
  // Core properties
  number: string              // Auto-generated (e.g., "JNL-0001")
  date: Date
  description: string
  sourceModule: string        // e.g., "smrt-commerce", "manual"
  sourceRef: string | null    // External reference
  status: JournalStatus       // 'draft' | 'posted' | 'voided'
  postedAt: Date | null
  voidedAt: Date | null
  voidReason: string | null
  metadata: Record<string, unknown>

  // Status checks
  isDraft(): boolean
  isPosted(): boolean
  isVoided(): boolean
  isEditable(): boolean       // Only true for draft

  // Entry operations
  async getEntries(): JournalEntry[]
  async addEntry(data: JournalEntryData): void    // Draft-only

  // Balance validation
  async getTotalDebits(): number
  async getTotalCredits(): number
  async isBalanced(): boolean

  // State transitions
  async post(): void                             // Validates balance first
  async void(reason: string): void

  // Summary — AI-generated via smrt-prompts (see Prompt Registry below)
  async summarize(): string
}`}
			language="typescript"
		/>

		<aside>
			<p>
				<strong>AI summaries route through <a href="/modules/smrt-prompts">smrt-prompts</a>.</strong>
				<code>Journal.summarize()</code> resolves the <code>smrtLedgers.journal.summarize</code>
				prompt via the registry, so tenants can override the template, model, temperature, or other
				params from <code>_smrt_prompt_overrides</code> without code changes. PII-conscious variable
				selection: only non-identifying journal fields reach the AI provider.
			</p>
		</aside>

		<h3>JournalEntry Model</h3>
		<CodeBlock
			code={`class JournalEntry extends SmrtObject {
  // Core properties
  journalId: string           // Parent journal
  accountId: string           // Account affected
  debit: number               // Left side (0 if credit)
  credit: number              // Right side (0 if debit)
  currency: string            // e.g., "USD", "EUR"
  exchangeRate: number        // To base currency
  memo: string
  metadata: Record<string, unknown>

  // Amount checks
  isDebit(): boolean
  isCredit(): boolean
  getAmount(): number         // Positive value
  getBaseAmount(): number     // Amount * exchangeRate

  // Navigation
  async getJournal(): Journal | null
  async getAccount(): Account | null
  async getDescription(): string                // "DR Cash: $100 - Sales"
}`}
			language="typescript"
		/>

		<h3>AccountCollection Methods</h3>
		<CodeBlock
			code={`// Find accounts
await accounts.findByNumber('1000')
await accounts.findByType('asset')
await accounts.findActive()
await accounts.findTopLevel()
await accounts.findChildren(parentId)

// Organization
await accounts.getTree()                    // Full tree structure
await accounts.groupByType()                // Organized by type
await accounts.getDescendants(accountId)    // All children recursively

// Create or retrieve
await accounts.getOrCreateByNumber('1000', {
  name: 'Cash',
  type: 'asset'
})`}
			language="typescript"
		/>

		<h3>JournalCollection Methods</h3>
		<CodeBlock
			code={`// Find journals
await journals.findByNumber('JNL-123')
await journals.findByDateRange(startDate, endDate)
await journals.findBySource('smrt-commerce')
await journals.findByStatus('posted')
await journals.findDrafts()
await journals.findPosted()
await journals.findBySourceRef(orderId)
await journals.findByMonth(2025, 1)

// Create and manage
await journals.createWithEntries({
  date: new Date(),
  description: 'Transaction',
  entries: [...]
})
await journals.post(journalId)
await journals.void(journalId, 'Reason')`}
			language="typescript"
		/>

		<h3>JournalEntryCollection Methods</h3>
		<CodeBlock
			code={`// Find entries
await entries.findByJournal(journalId)
await entries.findByAccount(accountId)
await entries.findByAccounts([id1, id2])    // Avoids N+1

// Balance calculations
await entries.getAccountBalance(accountId, asOfDate)
// Returns signed balance: Asset/Expense = Debits - Credits
//                        Liability/Equity/Revenue = Credits - Debits

await entries.getTrialBalance(asOfDate)
// Returns: Array<{
//   accountNumber: string,
//   accountName: string,
//   debit: number,
//   credit: number
// }>

await entries.getTotalsForDateRange(startDate, endDate)
// Returns: { totalDebits: number; totalCredits: number }

await entries.getAccountLedger(accountId)
// Returns: Array<{
//   entry: JournalEntry,
//   runningBalance: number
// }>`}
			language="typescript"
		/>
	</section>

	<!-- Prompt Registry -->
	<section>
		<h2>Prompt Registry</h2>
		<p>
			<code>Journal.summarize()</code> routes through <a href="/modules/smrt-prompts">smrt-prompts</a>
			rather than calling <code>do()</code> directly. The prompt is registered at module-load time via
			<code>definePrompt()</code> in <code>src/prompts.ts</code>, side-effect imported from
			<code>src/index.ts</code> so consumers see it automatically after importing any export from this
			package.
		</p>
		<table>
			<thead>
				<tr>
					<th>Key</th>
					<th>Method</th>
					<th>Variables (PII-conscious)</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>smrtLedgers.journal.summarize</code></td>
					<td><code>Journal.summarize()</code></td>
					<td><code>journalNumber</code>, <code>journalDate</code>, <code>journalDescription</code>, <code>journalStatus</code>, <code>journalTotal</code>, <code>entryCount</code>, <code>journalBalanced</code></td>
				</tr>
			</tbody>
		</table>
		<p>
			<strong>Intentionally NOT exposed as prompt variables:</strong> <code>tenantId</code>,
			<code>sourceRef</code> (may reference customer/vendor identifiers), per-entry
			<code>accountId</code>/<code>id</code>, and the extensible <code>metadata</code> blob. Tenants
			who need richer context should override the template via <code>PromptOverride</code> and pass
			their own variables through a custom call site.
		</p>
		<CodeBlock
			code={`import { resolvePrompt } from '@happyvertical/smrt-prompts';

// Default summary
const summary = await journal.summarize();

// Tenant override: change the template/model from _smrt_prompt_overrides — no code change required.
//   key = 'smrtLedgers.journal.summarize'
//   tenantId = current tenant

// Manual call (e.g. for a custom variable set):
const resolved = await resolvePrompt('smrtLedgers.journal.summarize', {
  db,
  tenantId,
  vars: {
    journalNumber: journal.number,
    journalDate: journal.date.toISOString(),
    journalDescription: journal.description,
    journalStatus: journal.status,
    journalTotal: await journal.getTotalDebits(),
    entryCount: (await journal.getEntries()).length,
    journalBalanced: await journal.isBalanced(),
  },
});`}
			language="typescript"
		/>
	</section>

	<!-- Tutorials -->
	<section>
		<h2>Tutorials</h2>

		<article>
			<h3>Tutorial 1: Basic Ledger Setup and First Transaction (10-15 min)</h3>
			<p>Learn the fundamentals:</p>
			<ul>
				<li>Initialize account and journal collections</li>
				<li>Create simple chart of accounts (Cash, Sales Revenue)</li>
				<li>Create a draft journal with two entries</li>
				<li>Validate balance and post the journal</li>
				<li>Query account balances</li>
			</ul>
		</article>

		<article>
			<h3>Tutorial 2: Chart of Accounts and Account Management (15-20 min)</h3>
			<p>Build hierarchical account structures:</p>
			<ul>
				<li>Create parent-child account relationships (Assets {'>'} Current {'>'} Cash)</li>
				<li>Use getOrCreateByNumber for idempotent operations</li>
				<li>Organize accounts by type with groupByType()</li>
				<li>Display account tree structure</li>
				<li>Navigate hierarchy with getFullPath()</li>
			</ul>
		</article>

		<article>
			<h3>Tutorial 3: Complex Multi-Entry Transactions (15-20 min)</h3>
			<p>Handle real-world scenarios:</p>
			<ul>
				<li>Record product purchase with inventory tracking</li>
				<li>Account for Cost of Goods Sold (COGS)</li>
				<li>Handle tax entries in multi-entry journals</li>
				<li>Manage draft → posted workflow</li>
				<li>Void transactions with detailed reasons</li>
			</ul>
		</article>

		<article>
			<h3>Tutorial 4: Reporting and Reconciliation (15-20 min)</h3>
			<p>Generate financial reports:</p>
			<ul>
				<li>Generate trial balance reports</li>
				<li>Calculate account balances as of specific dates</li>
				<li>Create account ledgers with running balances</li>
				<li>Calculate totals for date ranges</li>
				<li>Integrate with external source modules</li>
			</ul>
		</article>
	</section>

	<!-- Examples -->
	<section>
		<h2>Real-World Examples</h2>

		<h3>Example 1: Small Business Daily Operations</h3>
		<p>Track daily transactions for a small business:</p>
		<CodeBlock
			code={`// Morning: Owner invests $5,000 cash
await journals.createWithEntries({
  date: new Date('2025-01-12 09:00'),
  description: 'Initial capital investment',
  entries: [
    { accountId: cashId, debit: 5000, credit: 0, memo: 'Owner investment' },
    { accountId: equityId, debit: 0, credit: 5000, memo: 'Owner capital' }
  ]
}).then(j => j.post());

// Purchase coffee supplies on credit card
await journals.createWithEntries({
  date: new Date('2025-01-12 10:30'),
  description: 'Coffee supplies purchase',
  entries: [
    { accountId: suppliesId, debit: 50, credit: 0, memo: 'Coffee beans' },
    { accountId: creditCardId, debit: 0, credit: 50, memo: 'Business credit card' }
  ]
}).then(j => j.post());

// Product sold for $150 cash
await journals.createWithEntries({
  date: new Date('2025-01-12 14:00'),
  description: 'Cash sale - Product #123',
  entries: [
    { accountId: cashId, debit: 150, credit: 0, memo: 'Cash received' },
    { accountId: salesId, debit: 0, credit: 150, memo: 'Revenue' }
  ]
}).then(j => j.post());

// Record COGS for inventory sold
await journals.createWithEntries({
  date: new Date('2025-01-12 14:00'),
  description: 'COGS for sale #123',
  entries: [
    { accountId: cogsId, debit: 60, credit: 0, memo: 'Cost of goods' },
    { accountId: inventoryId, debit: 0, credit: 60, memo: 'Inventory reduction' }
  ]
}).then(j => j.post());

// End-of-day balance check
const cashBalance = await entries.getAccountBalance(cashId);
console.log('Cash on hand:', cashBalance); // $5,100 (5000 + 150 - 50)

const apBalance = await entries.getAccountBalance(creditCardId);
console.log('Credit card payable:', apBalance); // $50`}
			language="typescript"
		/>

		<h3>Example 2: SaaS Subscription Billing</h3>
		<p>Handle recurring subscription revenue:</p>
		<CodeBlock
			code={`// Set up revenue accounts
const subscriptionRevenue = await accounts.create({
  number: '4100',
  name: 'Subscription Revenue',
  type: 'revenue'
});

const accountsReceivable = await accounts.create({
  number: '1200',
  name: 'Accounts Receivable',
  type: 'asset'
});

// Bill customer for monthly subscription
const invoice = await journals.createWithEntries({
  date: new Date('2025-01-01'),
  description: 'Monthly subscription - Customer ABC',
  sourceModule: 'smrt-commerce',
  sourceRef: 'invoice-12345',
  entries: [
    {
      accountId: accountsReceivable.id,
      debit: 99,
      credit: 0,
      memo: 'Invoice #12345'
    },
    {
      accountId: subscriptionRevenue.id,
      debit: 0,
      credit: 99,
      memo: 'Monthly Pro plan'
    }
  ]
});
await invoice.post();

// When payment received
const payment = await journals.createWithEntries({
  date: new Date('2025-01-05'),
  description: 'Payment received - Customer ABC',
  sourceModule: 'smrt-commerce',
  sourceRef: 'payment-67890',
  entries: [
    { accountId: cashId, debit: 99, credit: 0, memo: 'Payment received' },
    { accountId: accountsReceivable.id, debit: 0, credit: 99, memo: 'Invoice paid' }
  ]
});
await payment.post();

// Calculate monthly recurring revenue
const revenueBalance = await entries.getAccountBalance(
  subscriptionRevenue.id,
  new Date('2025-01-31')
);
console.log('January MRR:', revenueBalance);`}
			language="typescript"
		/>

		<h3>Example 3: Multi-Currency E-Commerce</h3>
		<p>Handle international transactions with exchange rates:</p>
		<CodeBlock
			code={`// Order received in EUR (€100) with exchange rate 1.1
const orderJournal = await journals.createWithEntries({
  date: new Date('2025-01-10'),
  description: 'International order - Customer EU',
  sourceModule: 'smrt-commerce',
  sourceRef: 'order-999',
  entries: [
    {
      accountId: accountsReceivable.id,
      debit: 100,
      credit: 0,
      currency: 'EUR',
      exchangeRate: 1.1,
      memo: 'Order in EUR'
    },
    {
      accountId: salesRevenue.id,
      debit: 0,
      credit: 100,
      currency: 'EUR',
      exchangeRate: 1.1,
      memo: 'Revenue in EUR'
    }
  ]
});
await orderJournal.post();

// Payment received in USD: $110 (100 * 1.1)
const paymentJournal = await journals.createWithEntries({
  date: new Date('2025-01-15'),
  description: 'Payment received - Customer EU',
  entries: [
    {
      accountId: cashId,
      debit: 110,
      credit: 0,
      currency: 'USD',
      exchangeRate: 1.0,
      memo: 'USD payment'
    },
    {
      accountId: accountsReceivable.id,
      debit: 0,
      credit: 110,
      currency: 'USD',
      exchangeRate: 1.0,
      memo: 'AR paid in USD (base amount = 100 EUR * 1.1)'
    }
  ]
});
await paymentJournal.post();

// Both entries have same base amount (110 USD), so they balance correctly`}
			language="typescript"
		/>

		<h3>Example 4: Month-End Close Process</h3>
		<p>Generate reports and close the month:</p>
		<CodeBlock
			code={`// Generate trial balance for January
const janTrialBalance = await entries.getTrialBalance(
  new Date('2025-01-31')
);

console.log('Trial Balance - January 2025');
console.log('================================');
janTrialBalance.forEach(row => {
  console.log(
    row.accountNumber.padEnd(6),
    row.accountName.padEnd(30),
    'DR:', row.debit.toFixed(2).padStart(10),
    'CR:', row.credit.toFixed(2).padStart(10)
  );
});

// Verify balance
const totalDebits = janTrialBalance.reduce((sum, row) => sum + row.debit, 0);
const totalCredits = janTrialBalance.reduce((sum, row) => sum + row.credit, 0);
console.log('Total Debits:', totalDebits.toFixed(2));
console.log('Total Credits:', totalCredits.toFixed(2));
console.log('Balanced:', Math.abs(totalDebits - totalCredits) < 0.01 ? '✓' : '✗');

// Post accrual entries for month-end
await journals.createWithEntries({
  date: new Date('2025-01-31'),
  description: 'Accrued rent expense',
  entries: [
    { accountId: rentExpenseId, debit: 2000, credit: 0, memo: 'January rent' },
    { accountId: accruedExpensesId, debit: 0, credit: 2000, memo: 'Accrued rent' }
  ]
}).then(j => j.post());

// Get account ledger with running balance
const cashLedger = await entries.getAccountLedger(cashId);
console.log('Cash Ledger:');
cashLedger.forEach(({ entry, runningBalance }) => {
  console.log(
    entry.date.toISOString().split('T')[0],
    entry.memo.padEnd(30),
    entry.isDebit() ? '+' + entry.getAmount() : '-' + entry.getAmount(),
    'Balance:', runningBalance.toFixed(2)
  );
});`}
			language="typescript"
		/>

		<h3>Example 5: Integration with Commerce Module</h3>
		<p>Automatically create journals from commerce transactions:</p>
		<CodeBlock
			code={`// In your smrt-commerce order processing
import { JournalCollection } from '@happyvertical/smrt-ledgers';

async function recordOrderSale(order: Order) {
  const journals = new JournalCollection({ db: {...} });

  // Create journal for the sale
  const saleJournal = await journals.createWithEntries({
    date: order.createdAt,
    description: 'Sale - Order #' + order.number,
    sourceModule: 'smrt-commerce',
    sourceRef: order.id,
    entries: [
      // Record revenue
      {
        accountId: cashAccountId,
        debit: order.total,
        credit: 0,
        currency: order.currency,
        memo: 'Payment received'
      },
      {
        accountId: salesRevenueId,
        debit: 0,
        credit: order.subtotal,
        currency: order.currency,
        memo: 'Product sales'
      },
      // Record tax collected
      {
        accountId: salesTaxPayableId,
        debit: 0,
        credit: order.taxAmount,
        currency: order.currency,
        memo: 'Sales tax collected'
      }
    ]
  });
  await saleJournal.post();

  // Create separate journal for COGS
  const cogsJournal = await journals.createWithEntries({
    date: order.createdAt,
    description: 'COGS - Order #' + order.number,
    sourceModule: 'smrt-commerce',
    sourceRef: order.id,
    entries: [
      {
        accountId: cogsAccountId,
        debit: order.costOfGoods,
        credit: 0,
        memo: 'Cost of goods sold'
      },
      {
        accountId: inventoryAccountId,
        debit: 0,
        credit: order.costOfGoods,
        memo: 'Inventory reduction'
      }
    ]
  });
  await cogsJournal.post();

  return { saleJournal, cogsJournal };
}`}
			language="typescript"
		/>
	</section>

	<!-- Integration Patterns -->
	<section>
		<h2>Integration Patterns</h2>

		<article>
			<h3>With smrt-core</h3>
			<p>
				All models extend <code>SmrtObject</code> for standard CRUD, validation, and lifecycle
				hooks. Collections extend <code>SmrtCollection</code> for querying, pagination, and advanced filtering.
			</p>
			<ul>
				<li><code>@smrt</code> decorator generates API endpoints, MCP tools, and CLI commands</li>
				<li>Automatic schema generation from TypeScript types</li>
				<li>Built-in validation and error handling</li>
				<li>Lifecycle hooks: beforeSave, afterSave, beforeDelete</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-commerce</h3>
			<p>
				Commerce orders automatically create ledger entries for sales, COGS, and inventory tracking:
			</p>
			<ul>
				<li>Orders trigger journal creation via <code>sourceModule = "smrt-commerce"</code></li>
				<li>Automatic COGS calculation and inventory reduction</li>
				<li>Revenue and tax accounts updated per order</li>
				<li>Source tracking with <code>sourceRef = orderId</code></li>
			</ul>
		</article>

		<article>
			<h3>With smrt-tenancy</h3>
			<p>
				Ledgers are automatically isolated per tenant using <code>@TenantScoped</code> decorator:
			</p>
			<ul>
				<li>Each tenant has separate chart of accounts</li>
				<li>Journals and entries filtered by tenant context</li>
				<li>Shared schema, separate data per tenant</li>
				<li>Tenant ID injected automatically via AsyncLocalStorage</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-users</h3>
			<p>User permissions control ledger access and modifications:</p>
			<ul>
				<li>RBAC controls who can create/post/void journals</li>
				<li>Audit trail tracks <code>createdBy</code> and <code>updatedBy</code></li>
				<li>Permission checks before posting or voiding</li>
				<li>User-specific ledger views based on roles</li>
			</ul>
		</article>

		<article>
			<h3>With smrt-profiles</h3>
			<p>Organization profiles link to chart of accounts:</p>
			<ul>
				<li>Profile metadata stores company-specific account numbering</li>
				<li>Multi-entity organizations have separate account trees</li>
				<li>Profile-level fiscal year and currency settings</li>
			</ul>
		</article>
	</section>

	<!-- Best Practices -->
	<section>
		<h2>Best Practices</h2>

		<article>
			<h3>Account Numbering</h3>
			<ul>
				<li>Use standardized ranges (1000-1999 Assets, 2000-2999 Liabilities, etc.)</li>
				<li>Include consistent leading zeros (e.g., "1000" not "1000")</li>
				<li>Reserve ranges for future sub-accounts (1100-1199 for Current Assets)</li>
				<li>Document your numbering scheme in organization metadata</li>
			</ul>
		</article>

		<article>
			<h3>Data Validation</h3>
			<ul>
				<li>Always create accounts before creating journal entries</li>
				<li>Use <code>getOrCreateByNumber()</code> for idempotent account setup</li>
				<li>Validate journal balance before calling <code>post()</code></li>
				<li>Check account <code>active</code> status before use</li>
				<li>Verify source references exist before linking</li>
			</ul>
		</article>

		<article>
			<h3>Posting Workflow</h3>
			<ul>
				<li>Keep journals in draft while building entries</li>
				<li>Validate complete transaction logic before posting</li>
				<li>Post only when all entries are finalized and balanced</li>
				<li>Never attempt to modify after posting (immutable)</li>
				<li>Use <code>void()</code> with detailed reasons for corrections</li>
			</ul>
		</article>

		<article>
			<h3>Performance</h3>
			<ul>
				<li>Use <code>findByAccounts()</code> for bulk queries (avoids N+1)</li>
				<li>Cache account tree structure for frequent access</li>
				<li>Filter by date early in queries (use indexed columns)</li>
				<li>Include only active accounts in reports</li>
				<li>Consider archiving old journals for historical data</li>
			</ul>
		</article>

		<article>
			<h3>Multi-Currency</h3>
			<ul>
				<li>Always set <code>exchangeRate</code> for non-base currency entries</li>
				<li>Store amounts in original currency for audit trail</li>
				<li>Calculate base amount: <code>amount * exchangeRate</code></li>
				<li>Track realized and unrealized gains/losses separately</li>
				<li>Use consistent decimal precision (2 places for most currencies)</li>
			</ul>
		</article>

		<article>
			<h3>Common Mistakes to Avoid</h3>
			<ul>
				<li>Don't create entries with both debit and credit amounts</li>
				<li>Don't modify journal entries after posting (immutable)</li>
				<li>Don't delete accounts with existing entries (set inactive instead)</li>
				<li>Don't include draft journals in balance calculations</li>
				<li>Don't forget to post journals (draft won't affect balances)</li>
				<li>Don't use negative amounts (use opposite side instead)</li>
			</ul>
		</article>
	</section>

	<!-- Troubleshooting -->
	<section>
		<h2>Common Issues and Troubleshooting</h2>

		<article>
			<h3>Error: "Journal is not balanced"</h3>
			<p><strong>Cause:</strong> Total debits ≠ total credits</p>
			<p>
				<strong>Solution:</strong> Check all entry amounts. Ensure the sum of debits equals the sum
				of credits before calling <code>post()</code>. Use <code>journal.getTotalDebits()</code> and
				<code>journal.getTotalCredits()</code> to debug.
			</p>
			<CodeBlock
				code={`const debits = await journal.getTotalDebits();
const credits = await journal.getTotalCredits();
console.log('Debits:', debits, 'Credits:', credits);
console.log('Difference:', Math.abs(debits - credits));`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Error: "Cannot add entries to posted journal"</h3>
			<p><strong>Cause:</strong> Trying to modify a posted (immutable) journal</p>
			<p>
				<strong>Solution:</strong> Posted journals cannot be edited. Void the journal with a reason and
				create a new correcting journal instead.
			</p>
			<CodeBlock
				code={`// Void the incorrect journal
await journal.void('Entry error - wrong amount');

// Create new correcting journal
const corrected = await journals.createWithEntries({...});
await corrected.post();`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Error: "Account not found"</h3>
			<p><strong>Cause:</strong> Referenced account doesn't exist or hasn't been saved</p>
			<p>
				<strong>Solution:</strong> Create and save the account before creating journal entries that reference
				it.
			</p>
			<CodeBlock
				code={`// Create account first
const account = await accounts.create({
  number: '1000',
  name: 'Cash',
  type: 'asset'
});

// Now use account.id in entries
await journals.createWithEntries({
  entries: [{ accountId: account.id, ... }]
});`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Error: "Entry cannot have both debit and credit"</h3>
			<p><strong>Cause:</strong> Entry validation failed</p>
			<p>
				<strong>Solution:</strong> Each entry must be debit-only OR credit-only (never both). Set the
				unused side to 0.
			</p>
			<CodeBlock
				code={`// Correct: debit-only
{ accountId: cashId, debit: 100, credit: 0 }

// Correct: credit-only
{ accountId: salesId, debit: 0, credit: 100 }

// WRONG: both sides
{ accountId: cashId, debit: 100, credit: 50 } // ✗ Error`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Issue: Unexpected balance calculation</h3>
			<p><strong>Cause:</strong> Including draft or voided journals in calculation</p>
			<p>
				<strong>Solution:</strong> Only posted journals affect balances. Draft and voided journals
				are excluded. Check journal status with <code>isPosted()</code>.
			</p>
			<CodeBlock
				code={`// Only posted journals count
const balance = await entries.getAccountBalance(accountId);

// Check which journals are included
const posted = await journals.findPosted();
console.log('Posted journals:', posted.length);`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Issue: Balance includes future transactions</h3>
			<p><strong>Cause:</strong> Missing <code>asOfDate</code> parameter</p>
			<p>
				<strong>Solution:</strong> Use <code>asOfDate</code> to calculate balance up to specific date.
			</p>
			<CodeBlock
				code={`// Get balance as of January 31st
const janBalance = await entries.getAccountBalance(
  accountId,
  new Date('2025-01-31')
);

// Get current balance (all posted entries)
const currentBalance = await entries.getAccountBalance(accountId);`}
				language="typescript"
			/>
		</article>

		<article>
			<h3>Issue: Cannot create child account</h3>
			<p><strong>Cause:</strong> Parent account hasn't been saved yet</p>
			<p>
				<strong>Solution:</strong> Call <code>save()</code> on parent before calling
				<code>createChild()</code>.
			</p>
			<CodeBlock
				code={`// Create and save parent first
const parent = await accounts.create({
  number: '1000',
  name: 'Assets',
  type: 'asset'
});

// Now create child
const child = await parent.createChild({
  number: '1100',
  name: 'Current Assets'
});`}
				language="typescript"
			/>
		</article>
	</section>

	<!-- Related Modules -->
	<section>
		<h2>Related Modules</h2>
		<ul>
			<li>
				<a href="/modules/smrt-core">smrt-core</a> - Base classes, decorators, and AI integration
			</li>
			<li>
				<a href="/modules/smrt-tenancy">smrt-tenancy</a> - Multi-tenant ledger isolation
			</li>
			<li>
				<a href="/modules/smrt-commerce">smrt-commerce</a> - Automatic journal creation from orders
			</li>
			<li>
				<a href="/modules/smrt-users">smrt-users</a> - RBAC permissions for ledger access
			</li>
		</ul>
	</section>

	<!-- Footer Navigation -->
	<nav>
		<a href="/modules">← Back to Modules</a>
		<a href="/modules/smrt-places">Next: smrt-places →</a>
	</nav>
</ModulePage>
