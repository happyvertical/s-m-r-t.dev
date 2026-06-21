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
		<li>
			<strong>Opt-in</strong> SIGTERM/SIGINT signal handling for graceful shutdown — pass
			<code>manageProcessSignals: true</code> in agent options (off by default)
		</li>
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
│   shutdown() ◄─── SIGTERM/SIGINT (only when             │
│                   manageProcessSignals: true)           │
└──────────────────────────────────────────────────────────┘`}</code
		></pre>

	<table>
		<thead><tr><th>Method</th><th>Purpose</th></tr></thead>
		<tbody>
			<tr
				><td><code>initialize()</code></td><td
					>Prepare resources; registers signal handlers only when
					<code>manageProcessSignals: true</code></td
				></tr
			>
			<tr><td><code>validate()</code></td><td>Check configuration and dependencies</td></tr>
			<tr><td><code>run()</code></td><td>Main agent logic (abstract, must implement)</td></tr>
			<tr
				><td><code>shutdown()</code></td><td
					>Cleanup resources; deregisters any signal handlers that were registered</td
				></tr
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
    await super.shutdown(); // Tears down any opt-in signal handlers
  }
}

// Execute
const agent = new WebScraper({ name: 'scraper-1' });
await agent.execute();`}</code
		></pre>

	<h2>Signal Handling (Graceful Shutdown)</h2>
	<p>
		Signal handling is <strong>opt-in</strong>, not automatic. Agents register SIGTERM and SIGINT
		handlers during <code>initialize()</code> <strong>only when</strong> the agent is constructed
		with <code>manageProcessSignals: true</code>. When enabled and a signal is received, the agent
		transitions to <code>shutdown</code> status and calls <code>shutdown()</code> for cleanup; the
		base <code>shutdown()</code> then deregisters those handlers (so always call
		<code>super.shutdown()</code> from an override). The first handler to finish calls
		<code>process.exit()</code>, so enable this on
		<strong>single-agent entry points only</strong> — when several agents share a process (e.g. under
		the smrt-jobs runtime) leave it off and let the host own process lifecycle.
	</p>
	<pre><code
			>{`@smrt()
class LongRunningAgent extends Agent {
  protected config = {};

  constructor(options: AgentOptions = {}) {
    // Opt in to SIGTERM/SIGINT handling for this single-agent process.
    super({ ...options, manageProcessSignals: true });
  }

  async run(): Promise<void> {
    while (this.status !== 'shutdown') {
      await this.processNextBatch();
      await this.save(); // Persist progress
    }
  }

  async shutdown(): Promise<void> {
    this.logger.info('Graceful shutdown initiated');
    // Finish current work, flush buffers, etc.
    await super.shutdown(); // Tears down the opt-in signal handlers
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
		<li><strong>Inherited:</strong> Walks up the tenant hierarchy (source: 'inherited')</li>
		<li><strong>Permissions:</strong> Manifest defaults merged with per-tenant overrides</li>
	</ul>
	<p>
		Resolving effective availability is <strong>not</strong> a plain <code>list()</code> query — a
		flat list would miss inherited bindings. Use <code>resolveForTenant(tenantId, getAncestorIds)</code>,
		which walks the ancestor chain (you supply the ancestor-id resolver, typically from smrt-users
		tenant resolution) and returns one <code>ResolvedAgentAvailability</code> per available agent,
		each tagged <code>source: 'explicit' | 'inherited'</code> with the merged permission snapshot. For a
		single explicit row, <code>findByTenantAndClass(tenantId, agentClass)</code> is the direct lookup.
	</p>
	<pre><code
			>{`import { TenantAgentCollection } from '@happyvertical/smrt-agents';

const tenantAgents = await TenantAgentCollection.create({ db: 'app.db' });

// Direct lookup of the explicit binding (no hierarchy walk).
const binding = await tenantAgents.findByTenantAndClass('tenant-123', 'Praeco');

// Effective availability across the hierarchy. getAncestorIds returns the
// tenant's ancestors (parent → root); wire it to your tenant resolver.
const availability = await tenantAgents.resolveForTenant(
  'tenant-123',
  getAncestorIds,
);
for (const entry of availability) {
  console.log(entry.source);      // 'explicit' | 'inherited'
  console.log(entry.permissions); // merged manifest + override snapshot
}`}</code
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

	<h2>Background Execution &amp; Safety Limits</h2>
	<p>
		Agents that run as background jobs go through the <a href="/modules/smrt-jobs">smrt-jobs</a>
		runtime, which adds two opt-in guards around the dispatch surface. Both live in
		<code>@happyvertical/smrt-jobs</code> (re-exported from its package root) and apply to any
		<code>SmrtObject</code> method the runner can invoke from a persisted job row, agents included.
	</p>

	<h3>backgroundEligible() — method allowlist</h3>
	<p>
		The runner only invokes methods that already exist on the prototype (no <code>eval</code>, no
		dynamic import), but a class can tighten that further. The
		<code>@backgroundEligible()</code> decorator (a legacy / <code>experimentalDecorators</code>
		method decorator, which is the mode the SMRT monorepo compiles with) builds up a static
		<code>backgroundEligibleMethods</code> allowlist on the class. Once <em>any</em> method is marked,
		the runner refuses to dispatch a job whose <code>method</code> is not on the list — turning the
		dispatch surface from &ldquo;any prototype method&rdquo; into an explicit contract. In
		non-decorator code, <code>markBackgroundEligible(ctor, ...methods)</code> does the same thing.
	</p>
	<pre><code
			>{`import { backgroundEligible } from '@happyvertical/smrt-jobs';
import { Agent } from '@happyvertical/smrt-agents';
import { smrt } from '@happyvertical/smrt-core';

@smrt()
class ReportAgent extends Agent {
  protected config = {};

  @backgroundEligible()
  async regenerate(): Promise<void> {} // reachable from a job

  async deleteEverything(): Promise<void> {} // NOT reachable — no allowlist entry

  async run(): Promise<void> {}
}`}</code
		></pre>
	<p>
		Enforcement happens in the runner via <code>isBackgroundEligibleMethod(ctor, method)</code>: it
		returns <code>true</code> when the class declared no allowlist (the default, back-compatible
		behaviour) or when the method is on the list, and <code>false</code> otherwise.
	</p>

	<h3>Per-tenant in-flight job cap</h3>
	<p>
		To stop one tenant from exhausting the shared worker pool (a cross-tenant denial of service), the
		jobs collection bounds how many non-terminal (pending/running) jobs a single tenant may hold at
		once. The default cap is <code>DEFAULT_TENANT_JOB_CAP</code> (<strong>10,000</strong>) and is
		enforced in one place — <code>assertWithinTenantCreationCap()</code> — shared by the
		<code>bg()</code> builder and the ScheduleRunner. Exceeding it throws
		<code>TenantJobCapExceededError</code>.
	</p>
	<ul>
		<li>
			The cap applies to the <strong>ambient tenant</strong>; global (no-tenant-context) jobs are
			exempt.
		</li>
		<li>Override per enqueue with <code>.tenantJobCap(max)</code>.</li>
		<li>
			Pass <code>0</code> (or a negative value) to disable the cap for trusted internal callers.
		</li>
		<li>
			A separate ceiling, <code>MAX_JOB_RETRIES</code> (25), clamps requested retry counts so a
			misconfigured <code>.retries(n)</code> can't pin a worker on a poison job forever.
		</li>
	</ul>
	<pre><code
			>{`import { bg } from '@happyvertical/smrt-jobs';

// Enqueue a background run of an agent method, with a tighter per-tenant cap.
await bg(reportAgent)
  .regenerate()
  .tenantJobCap(500) // refuse a 501st in-flight job for this tenant
  .enqueue();

// Trusted internal caller: disable the cap entirely.
await bg(reportAgent).regenerate().tenantJobCap(0).enqueue();`}</code
		></pre>

	<h2>Best Practices</h2>

	<h3>1. Always Call super Methods</h3>
	<pre><code
			>{`async initialize(): Promise<this> {
  await super.initialize(); // Registers signal handlers IF manageProcessSignals: true
  // Your initialization...
  return this;
}

async shutdown(): Promise<void> {
  // Your cleanup...
  await super.shutdown(); // Deregisters any handlers that were registered
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
