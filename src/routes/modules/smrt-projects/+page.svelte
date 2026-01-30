<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>smrt-projects - Project Management | SMRT Framework</title>
  <meta name="description" content="Project management with issue tracking, Living Spec pattern, and time tracking components." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-4">smrt-projects</h1>
    <p class="text-xl text-gray-600 mb-4">
      Project and repository management with AI-powered issue tracking, Living Spec pattern, and comprehensive time tracking UI.
    </p>
    <div class="flex gap-2 flex-wrap">
      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">v0.19.0</span>
      <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Projects</span>
      <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Living Spec</span>
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">7 Components</span>
    </div>
  </div>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Overview</h2>
    <p class="mb-4">
      <strong>smrt-projects</strong> provides project board management, repository integration, issue/PR tracking,
      and AI-powered Living Spec pattern where comments are synthesized into issue bodies. Now includes 7 new time
      tracking components for approval workflows.
    </p>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <p class="font-semibold mb-2">Key Features:</p>
      <ul class="list-disc list-inside space-y-1">
        <li>Project board management (GitHub Projects, Jira, Linear)</li>
        <li>Living Spec: AI-synthesized issue bodies from comments</li>
        <li>Issue/PR tracking with sync throttling</li>
        <li>AI classification (bugs vs features)</li>
        <li>7 time tracking components (NEW v0.19.0)</li>
        <li>Token management with security</li>
      </ul>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Installation</h2>
    <CodeBlock code={`npm install @happyvertical/smrt-projects`} language="bash" />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Quick Start</h2>
    <CodeBlock
      code={`import {
  RepositoryCollection, IssueCollection, ProjectCollection
} from '@happyvertical/smrt-projects';

// Initialize
const repos = await RepositoryCollection.create({ db: {...} });
const issues = await IssueCollection.create({ db: {...} });
const projects = await ProjectCollection.create({ db: {...} });

// Connect repository
const repo = await repos.create({
  owner: 'happyvertical',
  name: 'smrt',
  providerType: 'github',
  tokenConfigKey: 'GITHUB_TOKEN'  // From env, not stored in DB
});
await repo.save();

// Sync repository metadata
await repo.sync();

// Discover issues
const discoveredIssues = await repo.getIssues({ state: 'open' });

// Get or create tracked issue
const issue = await issues.create({
  repositoryId: repo.id,
  number: 123,
  title: 'Add dark mode',
  body: 'We should support dark mode',
  state: 'open'
});
await issue.save();

// Living Spec: Synthesize comments into body
const result = await issue.incorporateFeedback({
  applyUpdate: true,  // Update issue on GitHub
  model: 'sonnet'
});
console.log(result.synthesized); // Updated body with comments`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Core Models</h2>

    <h3 class="text-2xl font-semibold mb-3">Repository</h3>
    <CodeBlock
      code={`class Repository extends SmrtObject {
  owner: string
  name: string
  fullName: string         // owner/name
  description?: string
  defaultBranch: string
  isPrivate: boolean
  providerType: 'github' | 'gitlab' | 'bitbucket' | 'azure'
  baseUrl?: string         // For self-hosted
  tokenConfigKey: string   // Env var name (not the token itself!)
  lastSyncedAt?: Date

  async sync(options?): Promise<void>
  async getIssues(filters?): Promise<Issue[]>
  async getPullRequests(filters?): Promise<PullRequest[]>
  async createIssue(data): Promise<Issue>
  async createPullRequest(data): Promise<PullRequest>
  async hasOpenIssuesMatching(criteria): Promise<boolean>  // AI
  async summarizeActivity(): Promise<string>  // AI
}`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">Issue (Living Spec)</h3>
    <CodeBlock
      code={`class Issue extends SmrtObject {
  repositoryId: string
  number: number
  nodeId: string
  title: string
  body: string
  state: 'open' | 'closed'
  author: string
  labels: string[]
  assignees: string[]
  commentsCount: number
  originalBody?: string    // Before synthesis
  synthesisCount: number   // How many times synthesized
  lastSyncedAt?: Date

  // Living Spec Pattern
  async incorporateFeedback(options): Promise<IncorporateFeedbackResult>
  async rollback(): Promise<void>

  // AI-Powered
  async needsReview(): Promise<boolean>
  async isBugReport(): Promise<boolean>
  async isFeatureRequest(): Promise<boolean>
  async suggestLabels(): Promise<string[]>

  // Operations
  async sync(options?): Promise<void>
  async getComments(): Promise<Comment[]>
  async addComment(body: string): Promise<Comment>
  async close(): Promise<void>
  async addLabels(labels: string[]): Promise<void>
  async assign(username: string): Promise<void>
  getUrl(): string
}`}
      language="typescript"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">Project</h3>
    <CodeBlock
      code={`class Project extends SmrtObject {
  projectId: string        // Provider-specific ID
  projectNumber?: number
  title: string
  owner: string
  url?: string
  providerType: 'github' | 'jira' | 'linear' | 'zenhub'
  statuses: string[]       // Available columns/statuses
  fields: Array<{id, name, type}>
  statusFieldId?: string
  statusOptions?: Array<{id, name}>
  lastSyncedAt?: Date

  async sync(): Promise<void>
  async addItem(issue | pr): Promise<void>
  async listItems(filters?): Promise<ProjectItem[]>
  async updateItemStatus(itemId, status): Promise<void>
  async updateItemField(itemId, fieldId, value): Promise<void>
  async getStatuses(): Promise<string[]>
  async getFields(): Promise<Field[]>
  async getItemsByStatus(status): Promise<ProjectItem[]>
  async moveItem(issue, status): Promise<void>
  async analyzeHealth(): Promise<string>  // AI
}`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Living Spec Pattern</h2>
    <p class="mb-4">
      The Living Spec pattern automatically incorporates comment feedback into issue bodies using AI synthesis.
    </p>
    <CodeBlock
      code={`// 1. Create issue on GitHub
const issue = await issues.create({
  repositoryId: repo.id,
  number: 42,
  title: 'Add user authentication',
  body: 'We need to add login functionality'
});
await issue.save();

// 2. Users comment on the issue with feedback:
// - "Should support OAuth2"
// - "Need password reset flow"
// - "2FA required for admins"

// 3. Incorporate feedback using AI
const result = await issue.incorporateFeedback({
  applyUpdate: true,       // Update issue on GitHub
  model: 'sonnet',         // Claude Sonnet
  synthesisStrategy: 'append'  // or 'replace', 'merge'
});

console.log(result.synthesized);
// "We need to add login functionality with OAuth2 support,
//  password reset flow, and 2FA for admins."

// 4. Original body is preserved
console.log(issue.originalBody);  // "We need to add login functionality"
console.log(issue.synthesisCount); // 1

// 5. Rollback if needed
await issue.rollback();
// Restores originalBody to body field`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Time Tracking Components (NEW v0.19.0)</h2>

    <h3 class="text-2xl font-semibold mb-3">TimeEntryCard</h3>
    <CodeBlock
      code={`<script>
  import { TimeEntryCard } from '@happyvertical/smrt-projects/svelte';

  const entry = {
    id: 'entry-1',
    date: new Date('2025-01-15'),
    hours: 8.5,
    description: 'Developed new feature',
    status: 'submitted',
    amount: 1062.50,
    workerName: 'John Doe',
    hourlyRate: 125
  };
</script>

<TimeEntryCard {entry} href="/entries/entry-1" />`}
      language="svelte"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">TimeSummary</h3>
    <CodeBlock
      code={`<TimeSummary
  totalHours={160}
  totalValue={20000}
  pendingHours={40}
  approvedHours={120}
  entryCount={20}
  layout="grid"
/>`}
      language="svelte"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">ApprovalActions</h3>
    <CodeBlock
      code={`<ApprovalActions
  status="submitted"
  onapprove={() => approve()}
  onreject={() => showRejectDialog()}
  onedit={() => edit()}
  ondelete={() => confirmDelete()}
/>`}
      language="svelte"
    />

    <h3 class="text-2xl font-semibold mb-3 mt-6">BulkActions</h3>
    <CodeBlock
      code={`<BulkActions
  selectedCount={5}
  onclear={() => clearSelection()}
  onapproveall={() => bulkApprove()}
  onrejectall={() => bulkReject()}
  onexport={() => exportSelected()}
/>`}
      language="svelte"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">AI-Powered Features</h2>
    <CodeBlock
      code={`// Classify issues
const isBug = await issue.isBugReport();
const isFeature = await issue.isFeatureRequest();
const needsAttention = await issue.needsReview();

// Suggest labels
const suggestedLabels = await issue.suggestLabels();
// ['bug', 'priority:high', 'needs-design']

// Analyze comment sentiment
const sentiment = await comment.getSentiment();
// 'positive' | 'negative' | 'neutral'

// Extract action items from comments
const actionItems = await comment.extractActionItems();
// ['Add OAuth2 support', 'Implement password reset']

// Suggest PR reviewers
const reviewers = await pr.suggestReviewers();

// Check merge readiness
const isReady = await pr.isReadyToMerge();

// Analyze project health
const health = await project.analyzeHealth();
// "3 blocked issues, 2 PRs need review, on track for Q1"`}
      language="typescript"
    />
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Best Practices</h2>
    <div class="space-y-6">
      <div class="bg-green-50 border-l-4 border-green-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✓ DOs</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Use tokenConfigKey (env var name) not actual tokens</li>
          <li>Call incorporateFeedback periodically for Living Spec</li>
          <li>Check synthesis count before re-synthesizing</li>
          <li>Use sync throttling (5 minutes default)</li>
          <li>Store originalBody for audit trail</li>
        </ul>
      </div>
      <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <h3 class="text-lg font-semibold mb-2">✗ DON'Ts</h3>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Don't store tokens in database (security risk)</li>
          <li>Don't sync without throttling (API rate limits)</li>
          <li>Don't synthesize issues without user approval</li>
          <li>Don't lose originalBody (breaks rollback)</li>
          <li>Don't ignore synthesisCount (avoid over-synthesis)</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="mb-12">
    <h2 class="text-3xl font-bold mb-4">Related Modules</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <a href="/modules/smrt-core" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-core</h3>
        <p class="text-sm text-gray-600">Base classes and framework</p>
      </a>
      <a href="/modules/smrt-profiles" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-profiles</h3>
        <p class="text-sm text-gray-600">User profiles for authors/assignees</p>
      </a>
      <a href="/modules/smrt-commerce" class="block p-4 border rounded hover:border-blue-500 transition">
        <h3 class="font-semibold mb-2">smrt-commerce</h3>
        <p class="text-sm text-gray-600">Invoicing for time tracking</p>
      </a>
    </div>
  </section>

  <div class="border-t pt-6 mt-12">
    <div class="flex justify-between">
      <a href="/modules" class="text-blue-600 hover:underline">← Back to Modules</a>
      <a href="/modules/smrt-analytics" class="text-blue-600 hover:underline">Next: smrt-analytics →</a>
    </div>
  </div>
</div>
