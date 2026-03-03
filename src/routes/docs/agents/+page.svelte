<svelte:head>
	<title>Agents | s-m-r-t Documentation</title>
</svelte:head>

<article class="prose">
	<h1>SMRT Agents</h1>
	<p class="lead">
		The Agent framework provides a base class for building autonomous actors in the SMRT ecosystem.
		Agents extend SmrtObject, inheriting automatic database persistence, AI-powered methods, and
		code generation capabilities.
	</p>

	<nav class="subnav">
		<a href="/docs/agents/dispatch">DispatchBus &rarr;</a>
	</nav>

	<h2>Agent Class</h2>
	<p>
		Agents are designed for long-running processes, scheduled tasks, and autonomous operations
		requiring state management.
	</p>
	<pre><code
			>{`import { Agent, type AgentOptions } from '@happyvertical/smrt-agents';
import { smrt } from '@happyvertical/smrt-core';
import { getModuleConfig } from '@happyvertical/smrt-config';

@smrt()
class DataProcessor extends Agent {
  protected config = getModuleConfig('data-processor', {
    batchSize: 100,
    maxRetries: 3
  });

  // State properties (auto-persisted)
  lastProcessedId: string = '';
  itemsProcessed: number = 0;

  async run(): Promise<void> {
    // Main agent logic
  }
}`}</code
		></pre>

	<p>Key characteristics:</p>
	<ul>
		<li>Abstract <code>config</code> property must be defined by subclasses</li>
		<li>All properties auto-persist to database via SmrtObject</li>
		<li>Uses Single Table Inheritance (STI) - all agents share the <code>agents</code> table</li>
		<li>Must apply <code>@smrt()</code> decorator on subclasses</li>
		<li>Automatic SIGTERM/SIGINT signal handling for graceful shutdown</li>
	</ul>

	<h2>Agent Lifecycle</h2>
	<pre><code
			>{`┌──────────────────────────────────────────────────────────┐
│                     execute()                            │
│                                                          │
│   initialize() ──► validate() ──► run() ──► [idle]     │
│        │                            │                    │
│        │                            ▼                    │
│        │                        [error]                  │
│                                                          │
│   shutdown() ◄─── SIGTERM/SIGINT                        │
└──────────────────────────────────────────────────────────┘`}</code
		></pre>

	<table>
		<thead><tr><th>Method</th><th>Purpose</th></tr></thead>
		<tbody>
			<tr><td><code>initialize()</code></td><td>Setup signal handlers, prepare resources</td></tr>
			<tr><td><code>validate()</code></td><td>Check configuration and dependencies</td></tr>
			<tr><td><code>run()</code></td><td>Main agent logic (abstract, must implement)</td></tr>
			<tr
				><td><code>shutdown()</code></td><td>Cleanup resources, remove signal handlers</td></tr
			>
			<tr><td><code>execute()</code></td><td>Orchestrates full lifecycle</td></tr>
		</tbody>
	</table>

	<pre><code
			>{`@smrt()
class WebScraper extends Agent {
  protected config = getModuleConfig('web-scraper', {
    targetUrl: 'https://example.com'
  });

  async initialize(): Promise<this> {
    await super.initialize();
    this.logger.info('Initializing scraper');
    return this;
  }

  async validate(): Promise<void> {
    if (!this.config.targetUrl) {
      throw new Error('targetUrl is required');
    }
  }

  async run(): Promise<void> {
    // Scraping logic
    await this.save(); // Persist state
  }

  async shutdown(): Promise<void> {
    this.logger.info('Cleaning up');
    await super.shutdown(); // Cleans up signal handlers
  }
}

// Execute
const agent = new WebScraper({ name: 'scraper-1' });
await agent.execute();`}</code
		></pre>

	<h2>Signal Handling (Graceful Shutdown)</h2>
	<p>
		Agents automatically register SIGTERM and SIGINT handlers during <code>initialize()</code>.
		When a signal is received, the agent transitions to <code>shutdown</code> status and calls
		<code>shutdown()</code> for cleanup. Signal handlers are automatically removed during shutdown.
	</p>
	<pre><code
			>{`@smrt()
class LongRunningAgent extends Agent {
  protected config = {};

  async run(): Promise<void> {
    while (this.status !== 'shutdown') {
      await this.processNextBatch();
      await this.save(); // Persist progress
    }
  }

  async shutdown(): Promise<void> {
    this.logger.info('Graceful shutdown initiated');
    // Finish current work, flush buffers, etc.
    await super.shutdown(); // Always call super to clean up signal handlers
  }
}`}</code
		></pre>

	<h2>Agent Status</h2>
	<pre><code
			>{`type AgentStatusType = 'idle' | 'initializing' | 'running' | 'error' | 'shutdown';`}</code
		></pre>

	<p>Status transitions automatically during lifecycle:</p>
	<ul>
		<li><code>idle</code> - Agent created, not running</li>
		<li><code>initializing</code> - initialize() in progress</li>
		<li><code>running</code> - run() executing</li>
		<li><code>error</code> - Exception occurred</li>
		<li><code>shutdown</code> - Graceful shutdown in progress</li>
	</ul>

	<h2>Agent State</h2>
	<p>Agent state is persisted via SmrtObject inheritance:</p>
	<pre><code
			>{`@smrt()
class Crawler extends Agent {
  protected config = getModuleConfig('crawler', { maxPages: 50 });

  // These persist to database
  lastCrawledUrl: string = '';
  pagesProcessed: number = 0;
  errors: Array<{ url: string; error: string }> = [];

  async run(): Promise<void> {
    this.lastCrawledUrl = 'https://example.com';
    this.pagesProcessed += 1;
    await this.save(); // Persist changes
  }
}`}</code
		></pre>

	<h2>TenantAgent -- Multi-Tenant Bindings</h2>
	<p>
		The <code>TenantAgent</code> model provides a junction table (<code>tenant_agents</code>)
		binding agents to tenants with permission overrides and hierarchy resolution:
	</p>
	<ul>
		<li><strong>Explicit binding:</strong> Row exists for tenant (source: 'explicit')</li>
		<li><strong>Inherited:</strong> Walks up tenant hierarchy (source: 'inherited')</li>
		<li><strong>Permissions:</strong> Manifest defaults merged with per-tenant overrides</li>
	</ul>
	<pre><code
			>{`import { TenantAgent, TenantAgentCollection } from '@happyvertical/smrt-agents';

// Check if agent is available for a tenant
const tenantAgents = await TenantAgentCollection.create({ db: 'app.db' });
const binding = await tenantAgents.list({
  where: { agentType: 'Praeco', tenantId: 'tenant-123' }
});`}</code
		></pre>

	<h2>AgentSchedule</h2>
	<p>
		Cron-based scheduling stored in the <code>_smrt_agent_schedules</code> table.
		Executed by <code>ScheduleRunner</code> from <code>smrt-jobs</code>.
	</p>
	<pre><code
			>{`import { AgentSchedule, AgentScheduleCollection } from '@happyvertical/smrt-agents';

// Fields: agentType, cron, method (default: 'run'),
//         maxConcurrent, timeout`}</code
		></pre>

	<h2>AgentConfig -- DB-Persisted Configuration</h2>
	<p>
		The <code>AgentConfig</code> model stores slot-based configuration in the database,
		merged with file-based config at runtime:
	</p>
	<pre><code
			>{`// Save config for a UI slot
await agent.saveSlotConfig('sources', {
  scrapers: ['civicweb', 'govstack'],
  refreshInterval: 3600
});

// Load merged config (file + db)
const config = await agent.getMergedConfig('sources');

// Export all config (for static builds)
const exported = await agent.exportConfig({ includeSecrets: false });`}</code
		></pre>

	<h2>Agent Communication</h2>
	<p>
		Agents communicate via the <a href="/docs/agents/dispatch">DispatchBus</a>. Built-in methods:
	</p>
	<pre><code
			>{`class Fiscus extends Agent {
  protected config = {};

  async processIncomingDispatches(): Promise<void> {
    const bus = await this.getDispatch();

    // Subscribe to events
    await bus.subscribe({
      signalType: 'campaign.*',
      subscriber: this.constructor.name
    });

    // Process pending dispatches
    await this.processDispatches();
  }

  // Override to handle dispatches
  async handleDispatch(payload: unknown, metadata: DispatchMetadata): Promise<void> {
    if (metadata.type === 'campaign.completed') {
      await this.recordRevenue(payload);
    }
  }
}`}</code
		></pre>

	<table>
		<thead><tr><th>Method</th><th>Purpose</th></tr></thead>
		<tbody>
			<tr><td><code>getDispatch()</code></td><td>Get or create DispatchBus instance</td></tr>
			<tr
				><td><code>handleDispatch(payload, metadata)</code></td><td
					>Override to process incoming dispatches</td
				></tr
			>
			<tr
				><td><code>processDispatches()</code></td><td
					>Process all pending dispatches for this agent</td
				></tr
			>
		</tbody>
	</table>

	<h2>Agent Interests</h2>
	<p>Agents can declaratively query objects they're interested in:</p>
	<pre><code
			>{`const agent = new MyAgent({
  name: 'my-agent',
  interests: {
    filter: { status: 'active' },
    sort: 'created_at DESC',
    objects: {
      Meeting: {
        filter: { 'scheduled_at >': new Date() },
        sort: 'scheduled_at ASC',
        limit: 10,
        handler: async (meeting, agent) => ({
          action: 'recap',
          meeting
        })
      },
      Document: [
        {
          name: 'needs-review',
          filter: { status: 'pending' }
        },
        {
          name: 'expired',
          query: (t) => [
            \`\${t}.expires_at < datetime('now')\`,
            []
          ]
        }
      ]
    }
  }
});

// Query all interesting items
const items = await agent.interesting();
for (const { type, data, name, handled } of items) {
  console.log(\`\${type} from "\${name}": action=\${handled?.action}\`);
}`}</code
		></pre>

	<h3>Interest Filter Options</h3>
	<table>
		<thead><tr><th>Option</th><th>Type</th><th>Purpose</th></tr></thead>
		<tbody>
			<tr
				><td><code>filter</code></td><td>Record&lt;string, any&gt;</td><td
					>SQL filter with operators</td
				></tr
			>
			<tr
				><td><code>query</code></td><td>(tableName) =&gt; [sql, params]</td><td
					>Custom SQL for complex patterns</td
				></tr
			>
			<tr><td><code>sort</code></td><td>string | string[]</td><td>ORDER BY clause</td></tr>
			<tr><td><code>limit</code></td><td>number</td><td>Max results</td></tr>
			<tr
				><td><code>qualify</code></td><td>(items) =&gt; Promise&lt;items&gt;</td><td
					>Post-filter async processing</td
				></tr
			>
			<tr
				><td><code>handler</code></td><td>(item, agent) =&gt; any</td><td
					>Action for each matched item</td
				></tr
			>
		</tbody>
	</table>

	<h2>Agent UI Slots</h2>
	<p>Agents declare admin panel slots for host applications:</p>
	<pre><code
			>{`@smrt()
class Praeco extends Agent {
  static override uiSlots: AgentUISlots = {
    sources: {
      id: 'sources',
      label: 'News Sources',
      description: 'Configure scrapers and data sources',
      icon: 'database',
      order: 1
    },
    settings: {
      id: 'settings',
      label: 'Agent Settings',
      icon: 'settings',
      order: 2
    }
  };

  protected config = {};
  async run(): Promise<void> {}
}

// Host app registers Svelte components
import { AgentUIRegistry } from '@happyvertical/smrt-agents/ui';
AgentUIRegistry.register('Praeco', 'sources', SourcesPanel);`}</code
		></pre>

	<h2>Internal Tables</h2>

	<h3>agent_configs</h3>
	<p>Stores agent slot configurations:</p>
	<table>
		<thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead>
		<tbody>
			<tr><td><code>id</code></td><td>TEXT</td><td>Unique identifier</td></tr>
			<tr><td><code>agentId</code></td><td>TEXT</td><td>Agent instance ID</td></tr>
			<tr><td><code>agentClass</code></td><td>TEXT</td><td>Agent class name</td></tr>
			<tr><td><code>slotId</code></td><td>TEXT</td><td>UI slot ID</td></tr>
			<tr><td><code>configData</code></td><td>JSON</td><td>Configuration data</td></tr>
			<tr><td><code>schemaVersion</code></td><td>INTEGER</td><td>Schema version</td></tr>
		</tbody>
	</table>

	<h3>_smrt_agent_schedules</h3>
	<p>Stores agent schedule definitions:</p>
	<table>
		<thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead>
		<tbody>
			<tr><td><code>agentType</code></td><td>TEXT</td><td>Agent class name</td></tr>
			<tr><td><code>cron</code></td><td>TEXT</td><td>Cron expression</td></tr>
			<tr><td><code>method</code></td><td>TEXT</td><td>Method to invoke (default: 'run')</td></tr>
			<tr><td><code>maxConcurrent</code></td><td>INTEGER</td><td>Max concurrent executions</td></tr>
			<tr><td><code>timeout</code></td><td>INTEGER</td><td>Execution timeout (ms)</td></tr>
		</tbody>
	</table>

	<h3>tenant_agents</h3>
	<p>Junction table binding agents to tenants:</p>
	<table>
		<thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead>
		<tbody>
			<tr><td><code>agentType</code></td><td>TEXT</td><td>Agent class name</td></tr>
			<tr><td><code>tenantId</code></td><td>TEXT</td><td>Tenant ID</td></tr>
			<tr><td><code>permissions</code></td><td>JSON</td><td>Per-tenant permission overrides</td></tr>
			<tr><td><code>status</code></td><td>TEXT</td><td>Binding status</td></tr>
		</tbody>
	</table>

	<h2>Best Practices</h2>

	<h3>1. Always Call super Methods</h3>
	<pre><code
			>{`async initialize(): Promise<this> {
  await super.initialize(); // Sets up signal handlers
  // Your initialization...
  return this;
}

async shutdown(): Promise<void> {
  // Your cleanup...
  await super.shutdown(); // Removes signal handlers
}`}</code
		></pre>

	<h3>2. Persist State Regularly</h3>
	<pre><code
			>{`async run(): Promise<void> {
  for (const item of items) {
    await this.process(item);
    this.itemsProcessed += 1;
    await this.save(); // Persist after each item
  }
}`}</code
		></pre>

	<h3>3. Handle Errors Gracefully</h3>
	<pre><code
			>{`async run(): Promise<void> {
  try {
    await this.doWork();
  } catch (error) {
    this.errors.push({ message: error.message, at: new Date() });
    await this.save();
    throw error; // Re-throw to set status to 'error'
  }
}`}</code
		></pre>

	<h3>4. Use getModuleConfig() for Configuration</h3>
	<pre><code
			>{`import { getModuleConfig } from '@happyvertical/smrt-config';

@smrt()
class MyAgent extends Agent {
  // Loads from smrt.config.ts modules.my-agent section
  protected config = getModuleConfig('my-agent', {
    cronSchedule: '0 2 * * *',
    maxRetries: 3
  });
}`}</code
		></pre>
</article>

<style>
	.prose {
		max-width: 100%;
	}

	.prose h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.2rem;
		line-height: 1.6;
		color: #444;
		margin-bottom: 24px;
	}

	.subnav {
		padding: 16px 0 48px;
		border-bottom: 1px solid var(--color-grid);
	}

	.subnav a {
		font-weight: 500;
		text-decoration: none;
		color: var(--color-accent);
	}

	.prose h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
		padding-top: 24px;
		border-top: 1px solid var(--color-grid);
	}

	.prose h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 12px;
	}

	.prose p {
		font-size: 1rem;
		line-height: 1.7;
		margin-bottom: 16px;
	}

	.prose ul {
		margin: 0 0 16px 24px;
	}

	.prose li {
		line-height: 1.7;
		margin-bottom: 8px;
	}

	.prose pre {
		background: #1a1a1a;
		color: #f0f0f0;
		padding: 20px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.5;
		margin: 16px 0 24px;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
	}

	.prose p code,
	.prose li code,
	.prose td code {
		background: #f5f5f5;
		padding: 2px 6px;
	}

	.prose table {
		width: 100%;
		border-collapse: collapse;
		margin: 16px 0 24px;
		font-size: 0.9rem;
	}

	.prose th,
	.prose td {
		text-align: left;
		padding: 12px;
		border-bottom: 1px solid var(--color-grid);
	}

	.prose th {
		font-weight: 600;
		background: #fafafa;
	}

	.prose strong {
		font-weight: 600;
	}

	.prose a {
		color: var(--color-accent);
	}
</style>
