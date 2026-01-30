<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-messages - Email Management | SMRT Framework</title>
  <meta name="description" content="Email persistence and management with multi-provider support, threading, attachments, and intelligent sync capabilities." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <!-- Header Section -->
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-messages</h1>
    <p class="text-xl text-gray-600 mb-4">
      Email persistence and management module with multi-provider support (IMAP, POP3, Gmail),
      conversation threading, attachment handling, and intelligent sync engine.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Email</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Multi-Provider</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">ESM</span>
    </div>
  </div>

  <!-- Overview -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-messages</strong> provides TypeScript-first abstractions for managing email across multiple
      providers. It persists email data with rich metadata (threading, attachments, flags, labels) and synchronizes
      emails from remote servers with configurable options.
    </p>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <p class="font-semibold mb-2">Key Features:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Multi-provider support (IMAP, POP3, SMTP, Gmail API)</li>
        <li>Message threading with conversation reconstruction</li>
        <li>Attachment lifecycle management (inline and external storage)</li>
        <li>Folder/label management across email systems</li>
        <li>Incremental sync with progress tracking</li>
        <li>Rich metadata (headers, flags, labels, read status)</li>
        <li>Collection-based queries with advanced filtering</li>
      </ul>
    </div>
  </section>

  <!-- Installation -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock
      code={`npm install @happyvertical/smrt-messages
# or
pnpm add @happyvertical/smrt-messages`}
      language="bash"
    />
    <p class="mt-4 mb-4">
      Depends on <code>@happyvertical/smrt-core</code>, <code>@happyvertical/email</code>,
      and <code>@happyvertical/sql</code>.
    </p>
  </section>

  <!-- Quick Start -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start (5 Minutes)</h2>

    <h3 class="text-2xl font-semibold mb-3">1. Set Up Email Account</h3>
    <CodeBlock
      code={`import { EmailAccount, EmailAccountCollection } from '@happyvertical/smrt-messages';

const accounts = new EmailAccountCollection({ db: {...} });

// Create Gmail account
const account = new EmailAccount({
  name: 'Personal Gmail',
  email: 'user@gmail.com',
  providerType: 'gmail'
});

account.setSettings({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: 'user@gmail.com',
    pass: 'app-specific-password'  // NOT your Gmail password
  }
});

await account.save();`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">2. Sync Emails</h3>
    <CodeBlock
      code={`// Perform initial sync
const result = await account.syncFrom({
  folders: ['INBOX', 'SENT'],
  fullSync: true,
  downloadAttachments: true,
  maxConcurrency: 5,
  onProgress: (stats) => {
    console.log(\`Synced \${stats.processed}/\${stats.total}\`);
  }
});

console.log(\`Downloaded: \${result.messagesDownloaded}\`);
console.log(\`Duration: \${result.duration}ms\`);`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">3. Query Emails</h3>
    <CodeBlock
      code={`import { EmailCollection } from '@happyvertical/smrt-messages';

const emails = new EmailCollection({ db: {...} });

// Get unread emails
const unread = await emails.getUnread(account.id);

// Get recent emails
const recent = await emails.getRecent(20, account.id);

// Get emails with attachments
const withAttachments = await emails.getWithAttachments(account.id);

// Get thread conversation
const email = await emails.get(emailId);
const threadEmails = await email.getThreadEmails();`}
      language="typescript"
    />
  </section>

  <!-- Core Concepts -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Core Concepts</h2>

    <h3 class="text-2xl font-semibold mb-3">Data Model</h3>
    <p class="mb-4">
      Four core entities form the email management system:
    </p>

    <div class="space-y-6">
      <div class="bg-gray-50 p-4 rounded">
        <h4 class="text-xl font-semibold mb-2">Email Model</h4>
        <CodeBlock
          code={`class Email extends SmrtObject {
  accountId: string           // Parent account
  folderId: string            // Current folder
  messageId: string           // RFC 822 Message-ID (unique)
  threadId: string | null     // Conversation grouping
  subject: string
  fromAddress: string
  fromName: string
  toAddresses: string         // JSON array
  ccAddresses: string         // JSON array
  bccAddresses: string        // JSON array
  replyTo: string | null
  date: Date | null
  textBody: string
  htmlBody: string
  isRead: boolean
  isFlagged: boolean
  isAnswered: boolean
  isDraft: boolean
  hasAttachments: boolean
  size: number                // Bytes
  labels: string              // JSON array (Gmail)
  flags: string               // JSON array (IMAP)
  headers: string             // JSON object
  inReplyTo: string | null    // Parent message-ID
  references: string | null   // Thread references
  rawMessage: string | null   // Full MIME message
}`}
          language="typescript"
        />
      </div>

      <div class="bg-gray-50 p-4 rounded">
        <h4 class="text-xl font-semibold mb-2">EmailAccount Model</h4>
        <CodeBlock
          code={`class EmailAccount extends SmrtObject {
  name: string
  email: string
  providerType: 'smtp' | 'imap' | 'pop3' | 'gmail'
  settings: string            // JSON (encrypt in production)
  lastSyncAt: Date | null
  active: boolean

  // Methods
  async syncFrom(options): Promise<SyncResult>
  async createClient(): Promise<EmailClient>
  async getFolders(): Promise<EmailFolder[]>
  async getEmails(limit?): Promise<Email[]>
  async getUnreadCount(): Promise<number>
}`}
          language="typescript"
        />
      </div>

      <div class="bg-gray-50 p-4 rounded">
        <h4 class="text-xl font-semibold mb-2">EmailFolder Model</h4>
        <CodeBlock
          code={`class EmailFolder extends SmrtObject {
  accountId: string
  name: string
  path: string
  delimiter: string
  specialUse: string | null   // 'Inbox', 'Sent', 'Drafts', etc.
  messageCount: number
  unreadCount: number
  subscribed: boolean

  // Helper methods
  isInbox(): boolean
  isSent(): boolean
  isDrafts(): boolean
  isSpam(): boolean
  isSystemFolder(): boolean
}`}
          language="typescript"
        />
      </div>

      <div class="bg-gray-50 p-4 rounded">
        <h4 class="text-xl font-semibold mb-2">EmailAttachment Model</h4>
        <CodeBlock
          code={`class EmailAttachment extends SmrtObject {
  emailId: string
  filename: string
  contentType: string
  size: number
  contentDisposition: string  // 'attachment' | 'inline'
  contentId: string | null    // For inline images
  filePath: string | null     // External storage path

  // Helper methods
  isImage(): boolean
  isPdf(): boolean
  isInline(): boolean
  getExtension(): string
  getFormattedSize(): string
  async readContent(): Promise<Buffer | null>
}`}
          language="typescript"
        />
      </div>
    </div>

    <h3 class="text-2xl font-semibold mb-3 mt-8">Message Threading</h3>
    <p class="mb-4">
      Emails are grouped into conversations using <code>threadId</code>:
    </p>
    <CodeBlock
      code={`// Get all emails in a thread
const email = await emails.get(emailId);
const thread = await email.getThreadEmails();

// Sort chronologically
const sorted = thread.sort((a, b) => {
  return (a.date?.getTime() || 0) - (b.date?.getTime() || 0);
});

console.log(\`Thread has \${sorted.length} messages\`);`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-8">Sync Engine</h3>
    <p class="mb-4">
      The <code>syncFrom()</code> method synchronizes emails from remote servers:
    </p>
    <CodeBlock
      code={`const result = await account.syncFrom({
  folders: ['INBOX'],          // Specific folders or omit for all
  fullSync: false,             // true = re-download everything
  downloadAttachments: true,   // Save attachment files
  maxAttachmentSize: 10485760, // 10MB limit
  batchSize: 100,              // Messages per batch
  maxConcurrency: 5,           // Parallel connections
  since: new Date('2024-01-01'), // Incremental sync
  onProgress: (stats) => {
    // stats: { total, processed, current, folder }
  },
  onError: (error, message) => {
    // Handle sync errors
  }
});

// Result contains:
// - messagesDownloaded: number
// - attachmentsDownloaded: number
// - errors: Array<{ error, message }>
// - duration: number (ms)`}
      language="typescript"
    />
  </section>

  <!-- API Reference -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">API Reference</h2>

    <h3 class="text-2xl font-semibold mb-3">EmailCollection Methods</h3>
    <CodeBlock
      code={`// Queries
await emails.getByMessageId(accountId, messageId)
await emails.getByAccount(accountId)
await emails.getByFolder(folderId)
await emails.getByThread(threadId)
await emails.getUnread(accountId?)
await emails.getFlagged(accountId?)
await emails.getWithAttachments(accountId?)
await emails.getRecent(limit, accountId?)

// Counts
await emails.countByFolder(folderId)
await emails.countUnreadByFolder(folderId)
await emails.countByAccount(accountId)

// CRUD
await emails.list(options)
await emails.get(id)
await emails.create(data)
await emails.update(id, data)
await emails.delete(id)`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">Email Instance Methods</h3>
    <CodeBlock
      code={`// Status management
await email.markRead()
await email.markUnread()
await email.toggleFlagged()

// Relationships
await email.getAccount()
await email.getFolder()
await email.getAttachments()
await email.getThreadEmails()

// Address parsing
email.getToAddresses(): Array<{ name: string, address: string }>
email.getCcAddresses(): Array<{ name: string, address: string }>
email.getBccAddresses(): Array<{ name: string, address: string }>

// Metadata
email.getLabels(): string[]
email.setLabels(labels: string[]): void
email.getFlags(): string[]
email.setFlags(flags: string[]): void
email.getHeaders(): Record<string, string>
email.setHeaders(headers: Record): void

// Utilities
email.isUnread(): boolean
email.getPreview(maxLength: number): string`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">EmailAccountCollection Methods</h3>
    <CodeBlock
      code={`await accounts.getByEmail(email: string)
await accounts.getByProviderType(type: string)
await accounts.getActive()
await accounts.getInactive()
await accounts.getNeedingSync(maxAgeMinutes: number)
await accounts.search(query: string, filters?)`}
      language="typescript"
    />
  </section>

  <!-- Examples -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Real-World Examples</h2>

    <h3 class="text-2xl font-semibold mb-3">Example 1: Email Dashboard Widget</h3>
    <CodeBlock
      code={`// Show unread counts per folder
const account = await accounts.get(accountId);
const folders = await account.getFolders();

for (const folder of folders) {
  if (folder.isSystemFolder()) {
    console.log(\`\${folder.name}: \${folder.unreadCount} unread\`);
  }
}`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-8">Example 2: Conversation Thread UI</h3>
    <CodeBlock
      code={`const email = await emails.get(emailId);
const thread = await email.getThreadEmails();

const sorted = thread.sort((a, b) => {
  return (a.date?.getTime() || 0) - (b.date?.getTime() || 0);
});

const conversation = await Promise.all(
  sorted.map(async (e) => ({
    from: e.fromName || e.fromAddress,
    subject: e.subject,
    date: e.date,
    preview: e.getPreview(100),
    isRead: e.isRead,
    attachments: await e.getAttachments()
  }))
);

console.log(\`Thread with \${conversation.length} messages\`);`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-8">Example 3: Attachment Processing</h3>
    <CodeBlock
      code={`// Process all PDF attachments
const withAttachments = await emails.getWithAttachments(accountId);

for (const email of withAttachments) {
  const attachments = await email.getAttachments();
  const pdfs = attachments.filter(a => a.isPdf());

  for (const pdf of pdfs) {
    console.log(\`Processing: \${pdf.filename} (\${pdf.getFormattedSize()})\`);

    const content = await pdf.readContent();
    if (content) {
      // Process PDF content
      await processPdfData(content);
    }
  }
}`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-8">Example 4: Automated Email Archive</h3>
    <CodeBlock
      code={`// Archive emails older than 6 months
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

const all = await emails.list({ where: { accountId } });
const older = all.filter(e => e.date && e.date < sixMonthsAgo);

for (const email of older) {
  // Mark as archived
  email.flags = JSON.stringify(['\\\\Archive']);
  await email.save();

  console.log(\`Archived: \${email.subject}\`);
}`}
      language="typescript"
    />
  </section>

  <!-- Integration Patterns -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Integration Patterns</h2>

    <div class="space-y-6">
      <div>
        <h3 class="text-xl font-semibold mb-2">With @happyvertical/email</h3>
        <p class="text-sm mb-2">
          EmailAccount creates provider clients for sync:
        </p>
        <CodeBlock
          code={`const client = await account.createClient();
const folders = await client.listFolders();
const messages = await client.fetch({ folder: 'INBOX' });`}
          language="typescript"
        />
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-2">With @happyvertical/ai</h3>
        <p class="text-sm mb-2">
          Email model inherits SmrtObject with AI capabilities:
        </p>
        <CodeBlock
          code={`// AI-powered email summarization
const summary = await email.do('summarize this email thread');

// Sentiment analysis
const sentiment = await email.is('positive or negative');`}
          language="typescript"
        />
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-2">With smrt-users</h3>
        <p class="text-sm mb-2">
          Link email accounts to user profiles:
        </p>
        <CodeBlock
          code={`// User can have multiple email accounts
const userAccounts = await accounts.list({
  where: { userId: user.id, active: true }
});

// Permission-based access
if (user.can('view:emails')) {
  const emails = await emails.getByAccount(accountId);
}`}
          language="typescript"
        />
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-2">With smrt-assets</h3>
        <p class="text-sm mb-2">
          Store attachments as assets:
        </p>
        <CodeBlock
          code={`// Save attachment to asset system
const attachment = await attachments.get(attachmentId);
const content = await attachment.readContent();

const asset = await assets.create({
  filename: attachment.filename,
  contentType: attachment.contentType,
  size: attachment.size,
  content: content
});`}
          language="typescript"
        />
      </div>
    </div>
  </section>

  <!-- Best Practices -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Best Practices</h2>

    <div class="space-y-6">
      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✓ DOs</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Use app-specific passwords for Gmail/Outlook (not main password)</li>
          <li>Encrypt settings JSON before storing in database</li>
          <li>Implement incremental sync with <code>since</code> option</li>
          <li>Handle sync errors gracefully with <code>onError</code> callback</li>
          <li>Set reasonable batch sizes (100-500) to balance memory/speed</li>
          <li>Cache folder lists in UI (they change infrequently)</li>
          <li>Use thread IDs for conversation grouping</li>
          <li>Parse address arrays with <code>getToAddresses()</code> helpers</li>
        </ul>
      </div>

      <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✗ DON'Ts</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Don't store passwords in plaintext (always encrypt)</li>
          <li>Don't assume all providers support same features</li>
          <li>Don't download all attachments unconditionally</li>
          <li>Don't skip threadId during sync</li>
          <li>Don't modify JSON fields directly (use accessor methods)</li>
          <li>Don't run concurrent syncs on same account</li>
          <li>Don't ignore <code>onError</code> callbacks</li>
          <li>Don't bulk-delete without backup</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Troubleshooting -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Common Issues and Troubleshooting</h2>

    <div class="space-y-4">
      <div class="border rounded p-4">
        <h3 class="font-semibold mb-2 text-red-600">Issue: "Message already exists" after sync</h3>
        <p class="text-sm mb-2"><strong>Cause:</strong> Incremental sync skips existing messages</p>
        <p class="text-sm mb-2">
          <strong>Solution:</strong> Use <code>fullSync: true</code> for complete re-sync
        </p>
      </div>

      <div class="border rounded p-4">
        <h3 class="font-semibold mb-2 text-red-600">Issue: Attachment reads return null</h3>
        <p class="text-sm mb-2"><strong>Cause:</strong> File not found or file service not configured</p>
        <p class="text-sm mb-2">
          <strong>Solution:</strong> Check <code>attachment.filePath</code> exists and file service is set up
        </p>
      </div>

      <div class="border rounded p-4">
        <h3 class="font-semibold mb-2 text-orange-600">Issue: ThreadId is empty after sync</h3>
        <p class="text-sm mb-2"><strong>Cause:</strong> Email provider didn't return threadId</p>
        <p class="text-sm mb-2">
          <strong>Solution:</strong> Reconstruct threads using <code>inReplyTo</code> and message-ID headers
        </p>
      </div>

      <div class="border rounded p-4">
        <h3 class="font-semibold mb-2 text-orange-600">Issue: Sync takes too long</h3>
        <p class="text-sm mb-2"><strong>Cause:</strong> Large mailbox (10k+ emails) on first sync</p>
        <p class="text-sm mb-2">
          <strong>Solution:</strong> Use smaller <code>batchSize</code>, higher <code>maxConcurrency</code>,
          or sync only recent emails with <code>since</code>
        </p>
        <CodeBlock
          code={`await account.syncFrom({
  batchSize: 50,
  maxConcurrency: 10,
  since: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days
});`}
          language="typescript"
        />
      </div>

      <div class="border rounded p-4">
        <h3 class="font-semibold mb-2 text-orange-600">Issue: Unread count stale after marking read</h3>
        <p class="text-sm mb-2"><strong>Cause:</strong> Folder counts not updated after email operations</p>
        <p class="text-sm mb-2">
          <strong>Solution:</strong> Call <code>folder.refreshCounts()</code> after bulk operations
        </p>
        <CodeBlock
          code={`await email.markRead();
const folder = await email.getFolder();
await folder?.refreshCounts();`}
          language="typescript"
        />
      </div>
    </div>
  </section>

  <!-- Related Modules -->
  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-core" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-core</h3>
        <p class="text-sm text-gray-600">Base classes and database operations</p>
      </a>
      <a href="/modules/smrt-users" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-users</h3>
        <p class="text-sm text-gray-600">Link email accounts to user profiles</p>
      </a>
      <a href="/modules/smrt-assets" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-assets</h3>
        <p class="text-sm text-gray-600">Store attachments as managed assets</p>
      </a>
      <a href="/modules/smrt-agents" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-agents</h3>
        <p class="text-sm text-gray-600">AI-powered email processing agents</p>
      </a>
    </div>
  </section>

  <!-- Footer Navigation -->
  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-properties" class="text-blue-600 hover:underline">Next: smrt-properties →</a>
    </div>
  </div>
</div>
