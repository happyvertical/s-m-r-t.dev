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
			>{`import { Agent } from '@happyvertical/smrt-agents';
import { smrt } from '@happyvertical/smrt-core';

@smrt()
class DataProcessor extends Agent {
  protected config = {
    batchSize: 100,
    maxRetries: 3
  };

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
				><td><code>shutdown()</code></td><td>Cleanup resources, handle graceful termination</td></tr
			>
			<tr><td><code>execute()</code></td><td>Orchestrates full lifecycle</td></tr>
		</tbody>
	</table>

	<pre><code
			>{`@smrt()
class WebScraper extends Agent {
  protected config = { targetUrl: 'https://example.com' };

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
    await super.shutdown();
  }
}

// Execute
const agent = new WebScraper({ name: 'scraper-1' });
await agent.execute();`}</code
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
  protected config = { maxPages: 50 };

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

	<h3>Configuration Storage</h3>
	<p>Agents support slot-based configuration:</p>
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

	<h2>Best Practices</h2>

	<h3>1. Always Call super Methods</h3>
	<pre><code
			>{`async initialize(): Promise<this> {
  await super.initialize(); // Important!
  // Your initialization...
  return this;
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
</article>
