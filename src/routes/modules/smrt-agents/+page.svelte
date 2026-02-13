<script lang="ts">
	import ModuleTabs from '$lib/components/ModuleTabs.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModuleTabs
	name="smrt-agents"
	description="Build autonomous actors with persistent state, inter-agent communication via DispatchBus, and comprehensive lifecycle management."
	badges={['v0.19.0', 'Agents', '4 Components']}
>
	{#snippet docs()}
		<section id="overview">
			<h2>Overview</h2>
			<p>
				The <code>@happyvertical/smrt-agents</code> package provides a base Agent class for building autonomous
				actors in the SMRT ecosystem. Agents are persistent, state-managing objects that extend SmrtObject
				with automatic database persistence, lifecycle management, inter-agent communication, and admin
				panel UI integration.
			</p>

			<h3>Key Features</h3>
			<ul>
				<li><strong>Persistent State</strong>: Automatic database persistence via SmrtObject</li>
				<li><strong>Lifecycle Management</strong>: Initialize, validate, run, and shutdown hooks</li>
				<li>
					<strong>Inter-Agent Communication</strong>: DispatchBus for async messaging with wildcard
					patterns
				</li>
				<li><strong>Interest-Based Queries</strong>: Declarative object discovery and filtering</li>
				<li>
					<strong>Configuration Management</strong>: Three-layer config (file + database + defaults)
				</li>
				<li>
					<strong>Status Tracking</strong>: Five states (idle, initializing, running, error, shutdown)
				</li>
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
			<CodeBlock code={`pnpm add @happyvertical/smrt-agents`} language="bash" />

			<h3>Using npm</h3>
			<CodeBlock code={`npm install @happyvertical/smrt-agents`} language="bash" />

			<h3>Using bun</h3>
			<CodeBlock code={`bun add @happyvertical/smrt-agents`} language="bash" />

			<h3>Peer Dependencies</h3>
			<ul>
				<li><code>svelte@^5.0.0</code> (optional, for UI components)</li>
			</ul>
		</section>

		<section id="quick-start">
			<h2>Quick Start (5 Minutes)</h2>

			<h3>1. Create Your First Agent</h3>
			<CodeBlock
				code={`import { Agent } from '@happyvertical/smrt-agents';
import { smrt } from '@happyvertical/smrt-core';

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

    this.logger.info('Processed ' + this.itemsProcessed + ' items');
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
				code={`import { getModuleConfig } from '@happyvertical/smrt-config';

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
  errors: Array<{ message: string; at: Date }> = [];

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
    const data = payload as { campaignId: string; revenue: number };
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
				The <code>interests</code> system provides a declarative way to query objects the agent is interested
				in, with filters, sorting, limiting, and custom handlers.
			</p>

			<h3>Basic Interest Configuration</h3>
			<CodeBlock
				code={`constructor(options: AgentOptions = {}) {
  super({
    ...options,
    interests: {
      filter: { status: 'active' },
      sort: 'createdAt DESC',
      objects: {
        Meeting: {
          name: 'upcoming',
          filter: { 'scheduledAt >': new Date() },
          sort: 'scheduledAt ASC',
          limit: 10,
          handler: async (meeting, agent) => ({
            action: 'analyze',
            meeting,
            url: 'https://example.com/meetings/' + meeting.id
          })
        }
      }
    }
  });
}

async run() {
  const items = await this.interesting();

  for (const { type, data, name, handled } of items) {
    this.logger.info('Processing ' + type, {
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
      filter: { status: 'pending' }
    },
    {
      name: 'expired',
      query: (t) => [
        t + '.expires_at < datetime(',
        []
      ]
    },
    {
      name: 'high-priority',
      filter: { priority: 'high' },
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
      t + '.amount > ? AND ' + t + '.status = ?',
      [1000, 'unpaid']
    ]
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
				code={`import { getModuleConfig } from '@happyvertical/smrt-config';

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
    await this.riskyOperation();
  } catch (error) {
    this.logger.error('Operation failed', { error });
    this.errors.push({ message: error.message, at: new Date() });
    await this.save();
    throw error; // Let status change to 'error'
  }
}`}
				language="typescript"
			/>

			<h3>4. Use Type-Safe Config</h3>
			<CodeBlock
				code={`interface MyAgentConfig {
  batchSize: number;
  apiUrl: string;
}

@smrt()
class MyAgent extends Agent {
  protected config!: MyAgentConfig; // Override base type

  protected override getDefaultConfig(): MyAgentConfig {
    return {
      batchSize: 100,
      apiUrl: 'https://api.example.com'
    };
  }
}`}
				language="typescript"
			/>

			<h3>5. Leverage Interests for Reactive Behavior</h3>
			<CodeBlock
				code={`constructor(options: AgentOptions = {}) {
  super({
    ...options,
    interests: {
      objects: {
        Invoice: {
          filter: { status: 'unpaid' },
          handler: async (invoice) => ({
            action: 'send-reminder',
            priority: invoice.amount > 1000 ? 'high' : 'normal'
          })
        }
      }
    }
  });
}

async run(): Promise<void> {
  const items = await this.interesting();

  for (const { data, handled } of items) {
    if (handled?.action === 'send-reminder') {
      await this.sendReminder(data, handled.priority);
    }
  }
}`}
				language="typescript"
			/>
		</section>

		<section id="related">
			<h2>Related Modules</h2>
			<div class="link-grid">
				<a href="/modules/smrt-core" class="link-card">
					<h3>smrt-core</h3>
					<p>Base classes and framework</p>
				</a>
				<a href="/modules/smrt-events" class="link-card">
					<h3>smrt-events</h3>
					<p>Event-driven agent triggers</p>
				</a>
				<a href="/modules/smrt-cli" class="link-card">
					<h3>smrt-cli</h3>
					<p>CLI for agent execution</p>
				</a>
			</div>
		</section>
	{/snippet}

	{#snippet components()}
		<section id="agent-components">
			<h2>Agent Components</h2>
			<p>
				The <code>@happyvertical/smrt-agents</code> package includes Svelte 5 components for building
				agent management interfaces. These components integrate with the agent backend to provide
				real-time monitoring and configuration.
			</p>

			<h3>Available Components</h3>
			<div class="link-grid">
				<a href="/components/agents/agent-dashboard" class="link-card">
					<h3>AgentDashboard</h3>
					<p>Overview panel with schedules and run history</p>
				</a>
				<a href="/components/agents/agent-schedule-list" class="link-card">
					<h3>AgentScheduleList</h3>
					<p>Table display of scheduled agents</p>
				</a>
				<a href="/components/agents/agent-schedule-form" class="link-card">
					<h3>AgentScheduleForm</h3>
					<p>Form for creating and editing schedules</p>
				</a>
				<a href="/components/agents/agent-run-history" class="link-card">
					<h3>AgentRunHistory</h3>
					<p>Table display of run history with status</p>
				</a>
			</div>

			<h2>Installation</h2>
			<CodeBlock
				code={`npm install @happyvertical/smrt-agents

import {
  AgentDashboard,
  AgentScheduleList,
  AgentScheduleForm,
  AgentRunHistory
} from '@happyvertical/smrt-agents/svelte';`}
				language="bash"
			/>

			<p>
				<a href="/components/agents">View detailed component docs →</a>
			</p>
		</section>

		<section id="components-related">
			<h2>Related Modules</h2>
			<div class="link-grid">
				<a href="/modules/smrt-core" class="link-card">
					<h3>smrt-core</h3>
					<p>Base classes and framework</p>
				</a>
				<a href="/modules/smrt-events" class="link-card">
					<h3>smrt-events</h3>
					<p>Event-driven agent triggers</p>
				</a>
				<a href="/modules/smrt-cli" class="link-card">
					<h3>smrt-cli</h3>
					<p>CLI for agent execution</p>
				</a>
			</div>
		</section>
	{/snippet}
</ModuleTabs>

<style>
	section {
		margin-bottom: 64px;
	}

	section h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 24px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	section h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	section h4 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 24px;
		margin-bottom: 12px;
	}

	section p {
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		line-height: 1.6;
	}

	section ul,
	section ol {
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		padding-left: 24px;
		line-height: 1.6;
	}

	section li {
		margin-bottom: 8px;
	}

	section code {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: 3px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 16px 0;
	}

	th,
	td {
		padding: 12px;
		text-align: left;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	th {
		font-weight: 600;
		background: var(--smrt-color-surface-container, #f5f5f5);
	}

	.diagram {
		background: #f8f8f8;
		border: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		border-radius: 8px;
		padding: 16px;
		margin: 16px 0;
		overflow-x: auto;
	}

	.diagram pre {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.4;
	}

	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
		margin: 24px 0;
	}

	.link-card {
		padding: 20px;
		background: #fafafa;
		text-decoration: none;
		transition: all 0.2s;
		border: 1px solid transparent;
	}

	.link-card:hover {
		background: var(--smrt-color-surface-container, #f0f0f0);
		transform: translateY(-2px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border-color: var(--smrt-color-primary, #1976d2);
	}

	.link-card h3 {
		font-size: 1rem;
		font-weight: 600;
		margin: 0 0 8px 0;
		color: #1a1a1a;
	}

	.link-card:hover h3 {
		color: var(--smrt-color-primary, #1976d2);
	}

	.link-card p {
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin: 0;
	}
</style>
