<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>smrt-agents - Autonomous Agent Framework | SMRT Documentation</title>
	<meta
		name="description"
		content="Build autonomous actors with persistent state, inter-agent communication via DispatchBus, and lifecycle management in the SMRT framework."
	/>
</svelte:head>

<Grid>
	<nav class="breadcrumb" slot="header">
		<a href="/">Home</a>
		<span>/</span>
		<a href="/modules">Modules</a>
		<span>/</span>
		<span>smrt-agents</span>
	</nav>

	<h1>smrt-agents</h1>
	<p class="lead">
		Build autonomous actors with persistent state, inter-agent communication via DispatchBus, and
		comprehensive lifecycle management.
	</p>

	<section id="overview">
		<h2>Overview</h2>
		<p>
			The <code>@happyvertical/smrt-agents</code> package provides a base Agent class for building
			autonomous actors in the SMRT ecosystem. Agents are persistent, state-managing objects that extend
			SmrtObject with automatic database persistence, lifecycle management, inter-agent communication,
			and admin panel UI integration.
		</p>

		<h3>Key Features</h3>
		<ul>
			<li><strong>Persistent State</strong>: Automatic database persistence via SmrtObject</li>
			<li><strong>Lifecycle Management</strong>: Initialize, validate, run, and shutdown hooks</li>
			<li>
				<strong>Inter-Agent Communication</strong>: DispatchBus for async messaging with wildcard patterns
			</li>
			<li><strong>Interest-Based Queries</strong>: Declarative object discovery and filtering</li>
			<li><strong>Configuration Management</strong>: Three-layer config (file + database + defaults)</li>
			<li><strong>Status Tracking</strong>: Five states (idle, initializing, running, error, shutdown)</li>
			<li><strong>UI Slots</strong>: Admin panel component declarations for configuration</li>
			<li><strong>Graceful Shutdown</strong>: Signal handlers for SIGTERM/SIGINT</li>
		</ul>

		<h3>Architecture</h3>
		<div class="diagram">
			<pre>
┌─────────────────────────────────────────────────────────────┐
│                      SMRT Agent Framework                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Agent (Abstract Base Class)              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • Extends SmrtObject (database persistence)          │  │
│  │ • Status tracking (5 states)                         │  │
│  │ • Lifecycle hooks (initialize, validate, run)        │  │
│  │ • Signal handlers (graceful shutdown)                │  │
│  │ • Logger integration                                 │  │
│  │ • DispatchBus communication                          │  │
│  │ • Interest-based querying                            │  │
│  └──────────────────────────────────────────────────────┘  │
│           ▲                                                  │
│           │  extends                                         │
│  ┌────────┴─────────────────────────────────────┐          │
│  │ DataProcessor │ Scraper │ BillingAgent │ ... │          │
│  └──────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
			</pre>
		</div>

		<h3>Use Cases</h3>
		<ul>
			<li>Scheduled batch processing (ETL, data migrations)</li>
			<li>Web scraping and content aggregation</li>
			<li>Event-driven workflows (billing, notifications)</li>
			<li>Background jobs and long-running tasks</li>
			<li>Report generation and analytics</li>
			<li>Data synchronization between systems</li>
			<li>Content moderation and analysis</li>
		</ul>
	</section>

	<section id="installation">
		<h2>Installation</h2>

		<h3>Using pnpm (recommended)</h3>
		<CodeBlock
			code={`pnpm add @happyvertical/smrt-agents`}
			language="bash"
		/>

		<h3>Using npm</h3>
		<CodeBlock
			code={`npm install @happyvertical/smrt-agents`}
			language="bash"
		/>

		<h3>Using bun</h3>
		<CodeBlock
			code={`bun add @happyvertical/smrt-agents`}
			language="bash"
		/>

		<h3>Peer Dependencies</h3>
		<ul>
			<li><code>svelte@^5.0.0</code> (optional, for UI components)</li>
		</ul>
	</section>

	<section id="quick-start">
		<h2>Quick Start (5 Minutes)</h2>

		<h3>1. Create Your First Agent</h3>
		<CodeBlock
			code={`import {'{ Agent }'} from '@happyvertical/smrt-agents';
import {'{ smrt }'} from '@happyvertical/smrt-core';

@smrt()
class DataProcessorAgent extends Agent {
  protected config = {
    batchSize: 100,
    maxRetries: 3
  };

  itemsProcessed: number = 0;
  lastRunAt?: Date;

  async run(): Promise<void> {
    this.logger.info('Starting data processing');

    const items = await this.fetchDataBatch();
    for (const item of items) {
      await this.processItem(item);
      this.itemsProcessed++;
    }

    this.lastRunAt = new Date();
    await this.save(); // Persist state

    this.logger.info(\`Processed \${'${this.itemsProcessed}'} items\`);
  }

  private async fetchDataBatch() {
    // Your implementation
    return [];
  }

  private async processItem(item: any) {
    // Your implementation
  }
}`}
			language="typescript"
		/>

		<h3>2. Execute the Agent</h3>
		<CodeBlock
			code={`const agent = new DataProcessorAgent({
  name: 'data-processor-1'
});

await agent.execute();
// initialize() → validate() → run()`}
			language="typescript"
		/>

		<h3>3. Query Agent State</h3>
		<CodeBlock
			code={`// Agents are persisted as SmrtObjects
const agent = await DataProcessorAgent.findBy({ name: 'data-processor-1' });
console.log(agent.status);        // 'idle', 'running', 'error', etc.
console.log(agent.itemsProcessed); // 150
console.log(agent.lastRunAt);      // 2026-01-12T10:30:00.000Z`}
			language="typescript"
		/>
	</section>

	<section id="core-concepts">
		<h2>Core Concepts</h2>

		<h3>1. Agent Lifecycle</h3>
		<div class="diagram">
			<pre>
execute() calls:
  initialize() ──► validate() ──► run() ──► [idle]
     (idle)        (validates)   (running)    │
       │                                       │
       └─► [error] ◄───────────────────────── ┘

shutdown() ◄── (on SIGTERM/SIGINT)
  (shutdown)
			</pre>
		</div>

		<h4>Lifecycle Methods</h4>
		<ul>
			<li>
				<strong>initialize()</strong>: Setup phase - connect to external services, load dependencies
			</li>
			<li><strong>validate()</strong>: Validate configuration and prerequisites</li>
			<li><strong>run()</strong>: Main execution logic (abstract - must implement)</li>
			<li><strong>shutdown()</strong>: Cleanup - close connections, clear timers</li>
		</ul>

		<h3>2. Agent Status (5 States)</h3>
		<table>
			<thead>
				<tr>
					<th>Status</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>idle</code></td>
					<td>Agent created, not running</td>
				</tr>
				<tr>
					<td><code>initializing</code></td>
					<td>initialize() in progress</td>
				</tr>
				<tr>
					<td><code>running</code></td>
					<td>run() executing</td>
				</tr>
				<tr>
					<td><code>error</code></td>
					<td>Exception occurred during execution</td>
				</tr>
				<tr>
					<td><code>shutdown</code></td>
					<td>Graceful shutdown in progress</td>
				</tr>
			</tbody>
		</table>

		<h3>3. Configuration Management</h3>
		<p>Three-layer configuration with priority order:</p>
		<ol>
			<li><strong>Database-persisted config</strong> (highest): User-modified via admin panels</li>
			<li><strong>File-based config</strong>: From smrt.config.js or environment</li>
			<li><strong>Agent class defaults</strong>: Hardcoded defaults in constructor</li>
		</ol>

		<CodeBlock
			code={`import {'{ getModuleConfig }'} from '@happyvertical/smrt-config';

@smrt()
class MyAgent extends Agent {
  // Layer 3: Defaults
  protected config = getModuleConfig('my-agent', {
    enabled: true,
    timeout: 30000
  });

  async run() {
    // Layer 1+2+3 merged
    const merged = await this.getMergedConfig();
    console.log(merged.timeout); // From DB, file, or default
  }
}`}
			language="typescript"
		/>

		<h3>4. State Persistence</h3>
		<ul>
			<li>Any public property on Agent is automatically persisted to database</li>
			<li>Agents share a single <code>agents</code> table using Single Table Inheritance (STI)</li>
			<li>Call <code>await this.save()</code> to persist state changes</li>
		</ul>

		<CodeBlock
			code={`@smrt()
class TrackingAgent extends Agent {
  // These properties auto-persist
  totalItems: number = 0;
  lastRunAt?: Date;
  errors: Array<{'{ message: string, at: Date }'}> = [];

  async run() {
    this.totalItems = 100;
    this.lastRunAt = new Date();
    await this.save(); // Write to database
  }
}`}
			language="typescript"
		/>
	</section>

	<section id="dispatch-bus">
		<h2>DispatchBus Communication</h2>
		<p>
			Agents communicate asynchronously via DispatchBus, an event-driven messaging system with
			persistent subscriptions and wildcard pattern matching.
		</p>

		<h3>Dispatch Lifecycle</h3>
		<div class="diagram">
			<pre>
emit() ──► pending ──► process() ──► processing ──► completed
                                           │
                                           └──► failed ──► retry() ──► pending
			</pre>
		</div>

		<h3>Subscription Types</h3>

		<h4>1. In-Memory Handlers (immediate)</h4>
		<CodeBlock
			code={`const bus = await agent.getDispatch();

// Called synchronously when dispatch is emitted
bus.on('campaign.completed', async (payload, metadata) => {
  console.log('Campaign completed:', payload);
});

// Fire-and-forget (errors logged, not propagated)
await bus.emit('campaign.completed', { campaignId: '123' });`}
			language="typescript"
		/>

		<h4>2. Persistent Subscriptions (deferred)</h4>
		<CodeBlock
			code={`const bus = await agent.getDispatch();

// Create persistent subscription (stored in database)
await bus.subscribe({
  signalType: 'campaign.*',
  subscriber: 'BillingAgent'
});

// Process pending dispatches for this agent
await agent.processDispatches();

// Implement handler in agent class
async handleDispatch(payload: unknown, metadata: DispatchMetadata) {
  if (metadata.type === 'campaign.completed') {
    const data = payload as {'{ campaignId: string, revenue: number }'};
    await this.recordRevenue(data);
  }
}`}
			language="typescript"
		/>

		<h3>Wildcard Pattern Matching</h3>
		<table>
			<thead>
				<tr>
					<th>Pattern</th>
					<th>Matches</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>campaign.*</code></td>
					<td>campaign.started, campaign.completed</td>
				</tr>
				<tr>
					<td><code>agent.*.completed</code></td>
					<td>agent.suasor.completed, agent.fiscus.completed</td>
				</tr>
				<tr>
					<td><code>*</code></td>
					<td>All events (one segment only, not dots)</td>
				</tr>
				<tr>
					<td><code>*.*.completed</code></td>
					<td>Multi-level events with 'completed' suffix</td>
				</tr>
			</tbody>
		</table>

		<h3>CLI Commands</h3>
		<CodeBlock
			code={`# List dispatches with filters
smrt dispatch:list --status pending --source Suasor

# Process pending for specific agent
smrt dispatch:process --subscriber Fiscus

# Retry failed dispatches
smrt dispatch:retry --max-attempts 3

# Cleanup old dispatches
smrt dispatch:cleanup --completed-older-than 30`}
			language="bash"
		/>
	</section>

	<section id="interests">
		<h2>Interest-Based Queries</h2>
		<p>
			The <code>interests</code> system provides a declarative way to query objects the agent is
			interested in, with filters, sorting, limiting, and custom handlers.
		</p>

		<h3>Basic Interest Configuration</h3>
		<CodeBlock
			code={`constructor(options: AgentOptions = {}) {
  super({
    ...options,
    interests: {
      filter: {'{ status: \'active\' }'},
      sort: 'createdAt DESC',
      objects: {
        Meeting: {
          name: 'upcoming',
          filter: {'{ \'scheduledAt >\': new Date() }'},
          sort: 'scheduledAt ASC',
          limit: 10,
          handler: async (meeting, agent) => ({
            action: 'analyze',
            meeting,
            url: \`https://example.com/meetings/\${'${meeting.id}'}\`
          })
        }
      }
    }
  });
}

async run() {
  const items = await this.interesting();

  for (const {'{ type, data, name, handled }'} of items) {
    this.logger.info(\`Processing \${'${type}'}\`, {
      name,
      action: handled?.action,
      id: data.id
    });

    if (handled?.action === 'analyze') {
      await this.analyzeItem(data);
    }
  }
}`}
			language="typescript"
		/>

		<h3>Multiple Filters per Class</h3>
		<CodeBlock
			code={`objects: {
  Document: [
    {
      name: 'needs-review',
      filter: {'{ status: \'pending\' }'}
    },
    {
      name: 'expired',
      query: (t) => [
        \`\${'${t}'}.expires_at < datetime('now')\`,
        []
      ]
    },
    {
      name: 'high-priority',
      filter: {'{ priority: \'high\' }'},
      sort: 'createdAt DESC',
      limit: 5
    }
  ]
}`}
			language="typescript"
		/>

		<h3>Custom SQL Queries</h3>
		<CodeBlock
			code={`objects: {
  Invoice: {
    query: (t) => [
      \`\${'${t}'}.amount > ? AND \${'${t}'}.status = ?\`,
      [1000, 'unpaid']
    ]
  }
}`}
			language="typescript"
		/>
	</section>

	<section id="tutorials">
		<h2>Tutorials</h2>

		<h3>Tutorial 1: Building a Web Scraper Agent</h3>
		<p>Create an agent that scrapes web pages with error tracking and rate limiting.</p>

		<h4>Step 1: Define the Agent Class</h4>
		<CodeBlock
			code={`@smrt()
class ScraperAgent extends Agent {
  protected config = {
    targetUrl: 'https://example.com',
    userAgent: 'Mozilla/5.0...',
    requestDelay: 1000,
    maxPages: 50
  };

  lastCrawledUrl?: string;
  pagesProcessed: number = 0;
  errorLog: Array<{'{ url: string, error: string, timestamp: Date }'}> = [];
}`}
			language="typescript"
		/>

		<h4>Step 2: Implement Validation</h4>
		<CodeBlock
			code={`async validate(): Promise<void> {
  if (!this.config.targetUrl) {
    throw new Error('targetUrl is required');
  }

  try {
    new URL(this.config.targetUrl);
  } catch {
    throw new Error(\`Invalid targetUrl: \${'${this.config.targetUrl}'}\`);
  }
}`}
			language="typescript"
		/>

		<h4>Step 3: Implement run() with Rate Limiting</h4>
		<CodeBlock
			code={`async run(): Promise<void> {
  const urls = await this.discoverUrls();

  for (const url of urls.slice(0, this.config.maxPages)) {
    try {
      await this.scrapeUrl(url);
      this.lastCrawledUrl = url;
      this.pagesProcessed++;

      // Rate limiting
      await this.delay(this.config.requestDelay);
    } catch (error) {
      this.errorLog.push({
        url,
        error: error.message,
        timestamp: new Date()
      });
      this.logger.error('Scraping failed', {'{ url, error }'});
    }
  }

  await this.save();
}

private delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}`}
			language="typescript"
		/>

		<h3>Tutorial 2: Event-Driven Billing Agent</h3>
		<p>Build an agent that listens for campaign completion events and records revenue.</p>

		<h4>Step 1: Set Up Subscriptions</h4>
		<CodeBlock
			code={`@smrt()
class BillingAgent extends Agent {
  protected config = {'{ enabled: true }'};

  totalRevenue: number = 0;
  campaignsProcessed: number = 0;

  async run(): Promise<void> {
    const bus = await this.getDispatch();

    // Subscribe to campaign events
    await bus.subscribe({
      signalType: 'campaign.*',
      subscriber: this.constructor.name
    });

    // Process any pending dispatches
    const processed = await this.processDispatches();
    this.logger.info(\`Processed \${'${processed}'} dispatches\`);
  }
}`}
			language="typescript"
		/>

		<h4>Step 2: Implement Dispatch Handler</h4>
		<CodeBlock
			code={`async handleDispatch(
  payload: unknown,
  metadata: DispatchMetadata
): Promise<void> {
  if (metadata.type === 'campaign.completed') {
    const data = payload as {'{ campaignId: string, revenue: number }'};

    this.totalRevenue += data.revenue;
    this.campaignsProcessed++;
    await this.save();

    this.logger.info('Campaign revenue recorded', {
      campaignId: data.campaignId,
      revenue: data.revenue,
      total: this.totalRevenue
    });
  }
}`}
			language="typescript"
		/>

		<h3>Tutorial 3: Resilient Agent with Retry Logic</h3>
		<p>Create an agent that retries failed operations with exponential backoff.</p>

		<CodeBlock
			code={`@smrt()
class ResilientAgent extends Agent {
  protected config = {
    maxRetries: 3,
    retryDelay: 5000
  };

  attemptCount: number = 0;
  successCount: number = 0;
  failureCount: number = 0;
  lastSuccess?: Date;

  async run(): Promise<void> {
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        this.attemptCount++;
        await this.performWork();

        this.successCount++;
        this.lastSuccess = new Date();
        await this.save();

        this.logger.info('Work completed successfully');
        return;
      } catch (error) {
        this.failureCount++;
        this.logger.error(\`Attempt \${'${attempt + 1}'} failed\`, {'{ error }'});

        if (attempt < this.config.maxRetries - 1) {
          this.logger.info(\`Retrying in \${'${this.config.retryDelay}'}ms\`);
          await this.delay(this.config.retryDelay);
        } else {
          await this.save();
          throw new Error(
            \`All \${'${this.config.maxRetries}'} attempts failed\`
          );
        }
      }
    }
  }

  private async performWork(): Promise<void> {
    // Your implementation
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}`}
			language="typescript"
		/>

		<h3>Tutorial 4: Agent with UI Slots</h3>
		<p>Create an agent with admin panel configuration UI.</p>

		<h4>Step 1: Declare UI Slots</h4>
		<CodeBlock
			code={`@smrt()
class ConfigurableAgent extends Agent {
  static override uiSlots: AgentUISlots = {
    sources: {
      id: 'sources',
      label: 'Data Sources',
      description: 'Configure data source scrapers',
      icon: 'database',
      order: 1
    },
    settings: {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      order: 2
    }
  };

  protected config = {};
}`}
			language="typescript"
		/>

		<h4>Step 2: Load Merged Config in run()</h4>
		<CodeBlock
			code={`async run(): Promise<void> {
  // Load merged config (file + db)
  const sourcesConfig = await this.getMergedConfig('sources');
  const settingsConfig = await this.getMergedConfig('settings');

  this.logger.info('Configuration loaded', {
    sourcesConfig,
    settingsConfig
  });

  // Use configuration...
}`}
			language="typescript"
		/>

		<h4>Step 3: Create Svelte Component</h4>
		<CodeBlock
			code={`<!-- SourcesSlot.svelte -->
<script lang="ts">
  import type {'{ Agent }'} from '@happyvertical/smrt-agents';

  export let agent: Agent;
  export let slotId: string;

  let sources = [];

  async function loadConfig() {
    const config = await agent.loadSlotConfig(slotId);
    sources = config?.sources || [];
  }

  async function saveConfig() {
    await agent.saveSlotConfig(slotId, {'{ sources }'});
  }
</script>

<div class="sources-config">
  <h3>Data Sources</h3>
  {#each sources as source}
    <input bind:value={source.url} placeholder="URL" />
  {/each}
  <button on:click={saveConfig}>Save</button>
</div>`}
			language="svelte"
		/>
	</section>

	<section id="examples">
		<h2>Examples</h2>

		<h3>Example 1: News Aggregator Agent</h3>
		<CodeBlock
			code={`@smrt()
class NewsAggregatorAgent extends Agent {
  protected config = {
    sources: [
      {'{ url: \'https://news1.com/rss\', category: \'tech\' }'},
      {'{ url: \'https://news2.com/rss\', category: \'business\' }'}
    ],
    keywords: ['AI', 'blockchain', 'climate']
  };

  articlesProcessed: number = 0;

  constructor(options: AgentOptions = {}) {
    super({
      ...options,
      interests: {
        objects: {
          Article: {
            filter: {'{ status: \'pending\' }'},
            handler: async (article) => ({
              action: article.content.match(this.config.keywords)
                ? 'publish'
                : 'skip'
            })
          }
        }
      }
    });
  }

  async run(): Promise<void> {
    // Scrape sources
    for (const source of this.config.sources) {
      const articles = await this.scrapeSource(source);
      for (const article of articles) {
        await Article.create(article);
      }
    }

    // Process interesting articles
    const items = await this.interesting();
    for (const {'{ data, handled }'} of items) {
      if (handled?.action === 'publish') {
        await this.publishArticle(data);
        this.articlesProcessed++;
      }
    }

    await this.save();
  }
}`}
			language="typescript"
		/>

		<h3>Example 2: Data Sync Agent</h3>
		<CodeBlock
			code={`@smrt()
class DataSyncAgent extends Agent {
  protected config = {
    apiUrl: 'https://api.example.com',
    cronSchedule: '0 2 * * *', // Daily at 2 AM
    batchSize: 100
  };

  lastSyncAt?: Date;
  itemsSynced: number = 0;
  syncErrors: number = 0;

  async run(): Promise<void> {
    this.logger.info('Starting data sync');

    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      try {
        const items = await this.fetchBatch(offset);

        for (const item of items) {
          await this.syncItem(item);
          this.itemsSynced++;
        }

        offset += this.config.batchSize;
        hasMore = items.length === this.config.batchSize;

        // Save progress after each batch
        await this.save();
      } catch (error) {
        this.syncErrors++;
        this.logger.error('Sync batch failed', {'{ offset, error }'});
        throw error;
      }
    }

    this.lastSyncAt = new Date();
    await this.save();
  }

  private async fetchBatch(offset: number) {
    const response = await fetch(
      \`\${'${this.config.apiUrl}'}/items?offset=\${'${offset}'}&limit=\${'${this.config.batchSize}'}\`
    );
    return response.json();
  }

  private async syncItem(item: any) {
    // Your sync logic
  }
}`}
			language="typescript"
		/>

		<h3>Example 3: Report Generation Agent</h3>
		<CodeBlock
			code={`@smrt()
class ReportAgent extends Agent {
  protected config = {
    recipients: ['admin@example.com'],
    format: 'pdf'
  };

  reportsGenerated: number = 0;

  constructor(options: AgentOptions = {}) {
    super({
      ...options,
      interests: {
        objects: {
          Meeting: {
            filter: {'{ \'scheduledAt >\': startOfWeek(), \'scheduledAt <\': endOfWeek() }'}
          }
        }
      }
    });
  }

  async run(): Promise<void> {
    const items = await this.interesting();
    const meetings = items.map(i => i.data);

    const report = await this.generateReport(meetings);
    await this.sendReport(report);

    this.reportsGenerated++;
    await this.save();
  }

  private async generateReport(meetings: any[]) {
    // Generate PDF/HTML report
    return {
      title: 'Weekly Meeting Report',
      meetings,
      generatedAt: new Date()
    };
  }

  private async sendReport(report: any) {
    // Email or Slack notification
    this.logger.info('Report sent to ' + this.config.recipients.join(', '));
  }
}`}
			language="typescript"
		/>
	</section>

	<section id="integration">
		<h2>Integration with Other Modules</h2>

		<h3>smrt-core</h3>
		<ul>
			<li><strong>SmrtObject</strong>: Agent extends SmrtObject for database persistence</li>
			<li><strong>DispatchBus</strong>: Inter-agent communication via core/dispatch</li>
			<li><strong>ObjectRegistry</strong>: Class discovery for interest queries</li>
		</ul>

		<h3>smrt-config</h3>
		<CodeBlock
			code={`import {'{ getModuleConfig }'} from '@happyvertical/smrt-config';

@smrt()
class MyAgent extends Agent {
  protected config = getModuleConfig('my-agent', {
    enabled: true,
    timeout: 30000
  });
}`}
			language="typescript"
		/>

		<h3>smrt-cli</h3>
		<CodeBlock
			code={`# Dispatch management
smrt dispatch:list --status pending
smrt dispatch:process --subscriber MyAgent
smrt dispatch:cleanup --completed-older-than 7

# Agent execution (if registered)
smrt agent:run --name MyAgent`}
			language="bash"
		/>

		<h3>Integration Pattern: Agent + DispatchBus + Collection</h3>
		<div class="diagram">
			<pre>
DataProcessorAgent
      ├─► emits: data.processed
      └─► subscribed to: data.ready

BillingAgent
      ├─► listens for: data.processed
      └─► emits: billing.updated

ReportAgent
      ├─► listens for: billing.updated
      ├─► queries Meetings (interests)
      └─► emits: report.generated
			</pre>
		</div>
	</section>

	<section id="best-practices">
		<h2>Best Practices</h2>

		<h3>1. Always Call Super Methods</h3>
		<CodeBlock
			code={`async initialize(): Promise<this> {
  await super.initialize(); // Critical!
  // Your initialization...
  return this;
}

async shutdown(): Promise<void> {
  this.logger.info('Cleaning up');
  await super.shutdown(); // Clean up signal handlers
}`}
			language="typescript"
		/>

		<h3>2. Persist State Regularly</h3>
		<CodeBlock
			code={`async run(): Promise<void> {
  for (const item of items) {
    await this.process(item);
    this.itemsProcessed++;
    await this.save(); // Save after each batch/item
  }
}`}
			language="typescript"
		/>

		<h3>3. Handle Errors Gracefully</h3>
		<CodeBlock
			code={`async run(): Promise<void> {
  try {
    await this.doWork();
  } catch (error) {
    this.errors.push({'{ message: error.message, at: new Date() }'});
    await this.save();
    throw error; // Re-throw to set status to 'error'
  }
}`}
			language="typescript"
		/>

		<h3>4. Use Clear Signal Types</h3>
		<CodeBlock
			code={`// Good - clear hierarchy
'campaign.completed'
'order.payment.failed'
'agent.fiscus.ready'

// Bad - ambiguous
'done'
'error'
'data'`}
			language="typescript"
		/>

		<h3>5. Always Include Source in Dispatch</h3>
		<CodeBlock
			code={`// Good - traceable
await bus.emit('event', payload, {
  source: this.constructor.name,
  sourceId: 'instance-1'
});

// Bad - unknown origin
await bus.emit('event', payload);`}
			language="typescript"
		/>

		<h3>6. Implement Proper Validation</h3>
		<CodeBlock
			code={`async validate(): Promise<void> {
  if (!this.config.required) {
    throw new Error('Required config missing');
  }

  // Validate dependencies
  if (!await this.externalService.ping()) {
    throw new Error('External service unavailable');
  }
}`}
			language="typescript"
		/>
	</section>

	<section id="troubleshooting">
		<h2>Troubleshooting</h2>

		<h3>Agent must be saved before loading configs</h3>
		<p><strong>Solution:</strong> Call <code>await agent.save()</code> after creation</p>
		<CodeBlock
			code={`const agent = new MyAgent({'{ name: \'my-agent-1\' }'});
await agent.save(); // Required before config methods
const config = await agent.loadSlotConfig('sources');`}
			language="typescript"
		/>

		<h3>No interests configured</h3>
		<p><strong>Solution:</strong> Pass <code>interests</code> in constructor options</p>
		<CodeBlock
			code={`constructor(options: AgentOptions = {}) {
  super({
    ...options,
    interests: {
      objects: {
        Meeting: {'{ filter: { status: \'active\' } }'}
      }
    }
  });
}`}
			language="typescript"
		/>

		<h3>Database not configured for dispatch</h3>
		<p><strong>Solution:</strong> Ensure agent is created with <code>db</code> option</p>
		<CodeBlock
			code={`import {'{ smrt }'} from '@happyvertical/smrt-core';

await smrt.initialize({'{ db: { type: \'sqlite\', url: \'app.db\' } }'}); // Required
const agent = new MyAgent({'{ name: \'my-agent-1\' }'});
const bus = await agent.getDispatch(); // Now works`}
			language="typescript"
		/>

		<h3>Dispatch not being processed</h3>
		<p>
			<strong>Solution:</strong> Call <code>await bus.process()</code> explicitly for persistent subscriptions
		</p>
		<CodeBlock
			code={`// In-memory handlers are immediate
bus.on('event', handler); // Called synchronously

// Persistent subscriptions require processing
await bus.subscribe({'{ signalType: \'event\', subscriber: \'MyAgent\' }'});
await agent.processDispatches(); // Must call explicitly`}
			language="typescript"
		/>

		<h3>ObjectRegistry class not found</h3>
		<p><strong>Solution:</strong> Ensure target class has <code>@smrt()</code> decorator</p>
		<CodeBlock
			code={`@smrt() // Required for registry
class Meeting extends SmrtObject {
  // ...
}`}
			language="typescript"
		/>

		<h3>Signal handlers not cleaning up</h3>
		<p><strong>Solution:</strong> Always call <code>await super.shutdown()</code></p>
		<CodeBlock
			code={`async shutdown(): Promise<void> {
  // Your cleanup
  if (this.timer) clearInterval(this.timer);

  // Always call super to remove signal handlers
  await super.shutdown();
}`}
			language="typescript"
		/>
	</section>

	<section id="api-reference">
		<h2>API Reference</h2>

		<h3>Agent Class</h3>
		<table>
			<thead>
				<tr>
					<th>Method</th>
					<th>Returns</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>execute()</code></td>
					<td><code>Promise&lt;this&gt;</code></td>
					<td>Run full lifecycle: initialize → validate → run</td>
				</tr>
				<tr>
					<td><code>initialize()</code></td>
					<td><code>Promise&lt;this&gt;</code></td>
					<td>Setup phase - override for custom initialization</td>
				</tr>
				<tr>
					<td><code>validate()</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Validate configuration - throw on errors</td>
				</tr>
				<tr>
					<td><code>run()</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Main execution logic - abstract, must implement</td>
				</tr>
				<tr>
					<td><code>shutdown()</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Cleanup - clear timers, close connections</td>
				</tr>
				<tr>
					<td><code>getDispatch()</code></td>
					<td><code>Promise&lt;DispatchBus&gt;</code></td>
					<td>Get or create dispatch bus for communication</td>
				</tr>
				<tr>
					<td><code>processDispatches()</code></td>
					<td><code>Promise&lt;number&gt;</code></td>
					<td>Process pending dispatches, return count</td>
				</tr>
				<tr>
					<td><code>handleDispatch()</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Override to handle incoming dispatches</td>
				</tr>
				<tr>
					<td><code>interesting()</code></td>
					<td><code>Promise&lt;InterestItem[]&gt;</code></td>
					<td>Query objects matching interest configuration</td>
				</tr>
				<tr>
					<td><code>getMergedConfig()</code></td>
					<td><code>Promise&lt;any&gt;</code></td>
					<td>Load merged config (file + database + defaults)</td>
				</tr>
				<tr>
					<td><code>loadSlotConfig()</code></td>
					<td><code>Promise&lt;any&gt;</code></td>
					<td>Load database config for specific slot</td>
				</tr>
				<tr>
					<td><code>saveSlotConfig()</code></td>
					<td><code>Promise&lt;void&gt;</code></td>
					<td>Save config for specific slot to database</td>
				</tr>
				<tr>
					<td><code>exportConfig()</code></td>
					<td><code>Promise&lt;any&gt;</code></td>
					<td>Export sanitized config (for static builds)</td>
				</tr>
			</tbody>
		</table>

		<h3>AgentOptions</h3>
		<table>
			<thead>
				<tr>
					<th>Property</th>
					<th>Type</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>name</code></td>
					<td><code>string</code></td>
					<td>Unique agent name</td>
				</tr>
				<tr>
					<td><code>interests</code></td>
					<td><code>InterestConfig</code></td>
					<td>Interest-based query configuration</td>
				</tr>
				<tr>
					<td><code>db</code></td>
					<td><code>DatabaseOptions</code></td>
					<td>Database configuration (inherited from SmrtObject)</td>
				</tr>
			</tbody>
		</table>

		<h3>AgentStatusType</h3>
		<CodeBlock
			code={`type AgentStatusType = 'idle' | 'initializing' | 'running' | 'error' | 'shutdown';`}
			language="typescript"
		/>
	</section>

	<section id="related">
		<h2>Related Modules</h2>
		<ul>
			<li><a href="/modules/smrt-core">smrt-core</a> - SmrtObject, DispatchBus, ObjectRegistry</li>
			<li><a href="/modules/smrt-config">smrt-config</a> - Configuration management</li>
			<li><a href="/modules/smrt-cli">smrt-cli</a> - CLI commands for agents</li>
			<li>
				<a href="/modules/smrt-dev-mcp">smrt-dev-mcp</a> - MCP server for agent development
			</li>
		</ul>
	</section>
</Grid>

<style>
	.lead {
		font-size: 1.25rem;
		margin-bottom: 2rem;
	}

	.breadcrumb {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		color: #666;
	}

	.breadcrumb a {
		color: #0066cc;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	section {
		margin-bottom: 3rem;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid #e5e5e5;
	}

	th {
		font-weight: 600;
		background-color: #f5f5f5;
	}

	code {
		background-color: #f5f5f5;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.9em;
	}

	.diagram {
		background-color: #f5f5f5;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 1rem 0;
	}

	.diagram pre {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.4;
	}

	h2 {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e5e5;
	}

	h3 {
		margin-top: 1.5rem;
	}

	h4 {
		margin-top: 1rem;
		font-size: 1rem;
	}
</style>
