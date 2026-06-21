<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-projects - Project Management | SMRT Framework</title>
	<meta
		name="description"
		content="Project management with issue tracking, Living Spec pattern, and time tracking components."
	/>
</svelte:head>

<ModulePage
	name="smrt-projects"
	description="Provider-agnostic project management -- GitHub-style issues, PRs, projects, and repositories with Living Spec AI synthesis."
	badges={['v0.29.34', 'Project Management', 'GitHub-style']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-projects</strong> manages repositories, issues, pull requests, and project boards with
			sync support for external providers (GitHub primary, GitLab/Bitbucket/Azure types defined). Features
			AI-powered Living Spec pattern where comments are synthesized into issue bodies, and PullRequest
			extends Issue via STI.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>6 models: Repository, Issue, PullRequest (STI on Issue), Project, Comment, Label</li>
				<li>Living Spec: AI-synthesized issue bodies from comments with rollback support</li>
				<li>Token config reference: stores env var name, not the token itself</li>
				<li>
					Sync throttle: operations skip if called within 5 minutes (override with force: true)
				</li>
				<li>
					Provider-agnostic: GitHub primary via @happyvertical/repos and @happyvertical/projects SDK
				</li>
				<li>Collection methods: discover(), findByRepository(), findOpen(), batchSync()</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-projects`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  Repository, RepositoryCollection,
  Issue, IssueCollection,
  PullRequest, PullRequestCollection,
  Project, ProjectCollection
} from '@happyvertical/smrt-projects';

// Initialize
const repos = new RepositoryCollection(db);
const issues = new IssueCollection(db);

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
  apply: true  // Update issue on GitHub (default false = preview only)
});
console.log(result.synthesized); // Updated body with comments`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Repository</h3>
		<CodeBlock
			code={`class Repository extends SmrtObject {
  owner: string
  name: string
  providerType: 'github' | 'gitlab' | 'bitbucket' | 'azure'
  tokenConfigKey: string   // Env var name (not the token!) -- resolved at runtime
  lastSyncedAt: Date | null

  async sync(options?): Promise<this>
  async getIssues(filters?): Promise<Issue[]>
  async getPullRequests(filters?): Promise<PullRequest[]>
  async createIssue(data): Promise<Issue>
  async createPullRequest(data): Promise<PullRequest>
  async summarizeActivity(): Promise<string>  // AI
}`}
			language="typescript"
		/>

		<h3>Issue (Living Spec -- STI Base)</h3>
		<p>
			PullRequest extends Issue via single-table inheritance. Both share the same table,
			discriminated by <code>_meta_type</code>.
		</p>
		<CodeBlock
			code={`class Issue extends SmrtObject {
  repositoryId: string     // FK
  number: number
  title: string
  body: string
  state: 'open' | 'closed'
  labels: string[]
  originalBody?: string    // Before synthesis
  synthesisCount: number   // Incremented on each incorporateFeedback apply

  // Living Spec Pattern
  async incorporateFeedback(options?: IncorporateFeedbackOptions): Promise<IncorporateFeedbackResult>
  async rollback(): Promise<{ success: boolean; message: string }>

  // AI-Powered
  async suggestLabels(): Promise<string[]>

  // Operations
  async sync(options?): Promise<this>
  async close(): Promise<void>
  async addLabels(labels: string[]): Promise<void>
  async addComment(body: string): Promise<Comment>
}

class PullRequest extends Issue {
  headRef: string
  baseRef: string
  merged: boolean
  draft: boolean
  additions: number
  deletions: number
  changedFiles: number

  async summarize(): Promise<string>
  async merge(method?: 'merge' | 'squash' | 'rebase'): Promise<void>
  async isReadyToMerge(): Promise<boolean>
  async suggestReviewers(): Promise<string[]>
}`}
			language="typescript"
		/>

		<h3>Project (GitHub Projects V2)</h3>
		<CodeBlock
			code={`class Project extends SmrtObject {
  projectId: string        // Provider-specific ID
  title: string
  providerType: 'github' | 'jira' | 'linear' | 'zenhub'
  statuses: ProjectStatus[]   // Available columns/statuses
  statusFieldId?: string

  async sync(options?): Promise<this>
  async addItem(issue | pr): Promise<ProjectItem>
  async moveItem(issue, status): Promise<void>
  async listItems(filters?): Promise<ProjectItem[]>
  async updateItemStatus(itemId, status): Promise<void>
  async analyzeHealth(): Promise<string>  // AI
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Living Spec Pattern</h2>
		<p>
			The Living Spec pattern automatically incorporates comment feedback into issue bodies using AI
			synthesis.
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
  apply: true,                 // Update issue on GitHub (default false = preview)
  prompt: 'Synthesize the feedback into the body',  // optional custom prompt
  since: new Date('2025-01-01')                      // optional: only newer comments
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

	<section>
		<h2>Time Tracking Components (NEW v0.19.0)</h2>

		<h3>TimeEntryCard</h3>
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

		<h3>TimeSummary</h3>
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

		<h3>ApprovalActions</h3>
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

		<h3>BulkActions</h3>
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

	<section>
		<h2>UI Components</h2>
		<p>
			Seven specialized Svelte components for time tracking and project management workflows. Each
			component is fully typed, accessible, and follows the SMRT design system.
		</p>
		<div class="link-grid">
			<a href="/components/projects/time-entry-card" class="link-card">
				<h3>TimeEntryCard</h3>
				<p>Display individual time entry with status and amount</p>
			</a>
			<a href="/components/projects/time-entry-list" class="link-card">
				<h3>TimeEntryList</h3>
				<p>List of time entries with filtering and pagination</p>
			</a>
			<a href="/components/projects/time-summary" class="link-card">
				<h3>TimeSummary</h3>
				<p>Aggregated time statistics and totals display</p>
			</a>
			<a href="/components/projects/duration-display" class="link-card">
				<h3>DurationDisplay</h3>
				<p>Formatted duration with configurable units</p>
			</a>
			<a href="/components/projects/approval-actions" class="link-card">
				<h3>ApprovalActions</h3>
				<p>Approve/reject controls for time entries</p>
			</a>
			<a href="/components/projects/bulk-actions" class="link-card">
				<h3>BulkActions</h3>
				<p>Batch operations on selected entries</p>
			</a>
			<a href="/components/projects/reject-dialog" class="link-card">
				<h3>RejectDialog</h3>
				<p>Modal for rejection with reason input</p>
			</a>
		</div>
		<CodeBlock
			code={`import {
  TimeEntryCard,
  TimeEntryList,
  TimeSummary,
  DurationDisplay,
  ApprovalActions,
  BulkActions,
  RejectDialog
} from '@happyvertical/smrt-projects/svelte';

// Example: Time entry with approval workflow
<TimeEntryCard {entry} href="/entries/{entry.id}">
  <svelte:fragment slot="actions">
    <ApprovalActions
      status={entry.status}
      onapprove={() => approve(entry.id)}
      onreject={() => openRejectDialog(entry)}
    />
  </svelte:fragment>
</TimeEntryCard>`}
			language="svelte"
		/>
		<p>
			<a href="/components/projects">View all project components →</a>
		</p>
	</section>

	<section>
		<h2>AI-Powered Features</h2>
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

	<section>
		<h2>Best Practices</h2>
		<div>
			<aside>
				<h3>✓ DOs</h3>
				<ul>
					<li>Use tokenConfigKey (env var name) not actual tokens</li>
					<li>Call incorporateFeedback periodically for Living Spec</li>
					<li>Check synthesis count before re-synthesizing</li>
					<li>Use sync throttling (5 minutes default)</li>
					<li>Store originalBody for audit trail</li>
				</ul>
			</aside>
			<aside>
				<h3>✗ DON'Ts</h3>
				<ul>
					<li>Don't store tokens in database (security risk)</li>
					<li>Don't sync without throttling (API rate limits)</li>
					<li>Don't synthesize issues without user approval</li>
					<li>Don't lose originalBody (breaks rollback)</li>
					<li>Don't ignore synthesisCount (avoid over-synthesis)</li>
				</ul>
			</aside>
		</div>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>Base classes and framework</p>
			</a>
			<a href="/modules/smrt-profiles">
				<h3>smrt-profiles</h3>
				<p>User profiles for authors/assignees</p>
			</a>
			<a href="/modules/smrt-commerce">
				<h3>smrt-commerce</h3>
				<p>Invoicing for time tracking</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">← Back to Modules</a>
		<a href="/modules/smrt-analytics">Next: smrt-analytics →</a>
	</nav>
</ModulePage>
