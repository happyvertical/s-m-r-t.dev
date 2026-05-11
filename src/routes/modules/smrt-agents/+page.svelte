<script lang="ts">
	import ModuleTabs from '$lib/components/ModuleTabs.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModuleTabs
	name="smrt-agents"
	description="Build autonomous actors with persistent state, inter-agent communication via DispatchBus, and comprehensive lifecycle management."
	badges={['v0.24.12', 'Agents', 'DispatchBus']}
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
				<li><strong>Lifecycle Management</strong>: <code>initialize()</code> → <code>validate()</code> → <code>run()</code> → <code>shutdown()</code></li>
				<li>
					<strong>Inter-Agent Communication</strong>: DispatchBus for async messaging with wildcard
					patterns
				</li>
				<li><strong>Interest-Based Queries</strong>: Declarative object discovery with optional AI <code>qualify()</code> post-filter</li>
				<li>
					<strong>Lazy <code>agent_config</code></strong>: <code>$env</code> sentinels + <code>static configResolvers</code> unfreeze env-derived values at task pickup (#1161)
				</li>
				<li><strong>Tenant Alignment</strong>: <code>TenantAgent</code> walks the tenant hierarchy with merged manifest + override permissions (#1208)</li>
				<li>
					<strong>Status Tracking</strong>: Five states (idle, initializing, running, error, shutdown)
				</li>
				<li><strong>UI Slots</strong>: Admin panel component declarations for configuration</li>
				<li><strong>Opt-in Signal Handlers</strong>: <code>manageProcessSignals: true</code> for single-agent processes</li>
				<li><strong>smrt-prompts Adoption</strong>: AI methods register templates via <code>definePrompt()</code> for runtime overrides</li>
			</ul>

			<h3>Tenancy</h3>
			<p>
				Agents use <code>@TenantScoped({'{'} mode: 'optional' {'}'})</code>: an agent may be global
				(no tenant) or bound to a tenant via <code>TenantAgent</code>. The <code>tenant_agents</code>
				junction resolves bindings by walking the tenant hierarchy and merging manifest defaults with
				per-tenant permission overrides.
			</p>

			<h3>Architecture</h3>
			<div class="diagram">
				<pre>
┌─────────────────────────────────────────────────────────────┐
│                      SMRT Agent Framework                    │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Agent (extends SmrtObject)              │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ • Status tracking (5 states)                         │  │
│  │ • Lifecycle: initialize → validate → run → shutdown  │  │
│  │ • Opt-in signal handlers (manageProcessSignals)      │  │
│  │ • DispatchBus, interests, lazy agent_config          │  │
│  │ • Tenant-aware (optional, hierarchy-resolved)        │  │
│  └──────────────────────────────────────────────────────┘  │
│           ▲                                                  │
│           │  extends                                         │
│  ┌────────┴─────────────────────────────────────┐          │
│  │ Praeco │ Suasor │ BillingAgent │ ...          │          │
│  └──────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
				</pre>
			</div>

			<h3>Use Cases</h3>
			<ul>
				<li>Scheduled batch processing (ETL, data migrations)</li>
				<li>Web scraping and content aggregation (Praeco / Caelus)</li>
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

			<h3>Peer Dependencies</h3>
			<ul>
				<li><code>svelte@^5.0.0</code> (optional, for UI components)</li>
				<li><code>@happyvertical/smrt-prompts</code> (optional, for prompt overrides)</li>
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
  }

  private async fetchDataBatch() { return []; }
  private async processItem(item: any) { /* ... */ }
}`}
				language="typescript"
			/>

			<h3>2. Execute the Agent</h3>
			<CodeBlock
				code={`const agent = new DataProcessorAgent({
  name: 'data-processor-1',
});

await agent.execute();
// initialize() → validate() → run() → idle`}
				language="typescript"
			/>

			<h3>3. Query Agent State</h3>
			<CodeBlock
				code={`// Agents are persisted as SmrtObjects
const agent = await DataProcessorAgent.findBy({ name: 'data-processor-1' });
console.log(agent.status);         // 'idle', 'running', 'error', etc.
console.log(agent.itemsProcessed); // 150
console.log(agent.lastRunAt);`}
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

shutdown() ◄── (opt-in: manageProcessSignals on SIGTERM/SIGINT)
  (shutdown)
				</pre>
			</div>

			<h4>Lifecycle Methods</h4>
			<ul>
				<li><strong>initialize()</strong>: setup phase — connect to external services, load dependencies</li>
				<li><strong>validate()</strong>: validate configuration and prerequisites</li>
				<li><strong>run()</strong>: main execution logic (abstract — must implement)</li>
				<li><strong>shutdown()</strong>: cleanup — close connections, clear timers, deregister signals</li>
			</ul>

			<h3>2. Agent Status (5 States)</h3>
			<table>
				<thead>
					<tr><th>Status</th><th>Description</th></tr>
				</thead>
				<tbody>
					<tr><td><code>idle</code></td><td>Agent created, not running</td></tr>
					<tr><td><code>initializing</code></td><td>initialize() in progress</td></tr>
					<tr><td><code>running</code></td><td>run() executing</td></tr>
					<tr><td><code>error</code></td><td>Exception occurred during execution</td></tr>
					<tr><td><code>shutdown</code></td><td>Graceful shutdown in progress</td></tr>
				</tbody>
			</table>

			<h3>3. Configuration Management</h3>
			<p>Three-layer configuration with priority order:</p>
			<ol>
				<li><strong>Database-persisted config</strong> (highest): user-modified via admin panels (<code>AgentConfig</code> rows)</li>
				<li><strong>File-based config</strong>: <code>getModuleConfig('agent-name', defaults)</code> from <code>smrt.config.ts</code> + env</li>
				<li><strong>Agent class defaults</strong>: hardcoded defaults in constructor</li>
			</ol>

			<CodeBlock
				code={`import { getModuleConfig } from '@happyvertical/smrt-config';

@smrt()
class MyAgent extends Agent {
  protected config = getModuleConfig('my-agent', {
    enabled: true,
    timeout: 30000
  });

  async run() {
    // DB overrides file overrides defaults
    const merged = await this.getMergedConfig('settings');
    console.log(merged.timeout);
  }
}`}
				language="typescript"
			/>

			<h4>Lazy <code>agent_config</code> Resolution (#1161)</h4>
			<p>
				Persisted <code>agent_config</code> snapshots env-derived values at sync time, so rotated env
				vars don't reach already-stored schedule rows. Two complementary mechanisms unfreeze them at
				task pickup:
			</p>
			<CodeBlock
				code={`// 1. $env sentinels + a global resolver
import { registerConfigResolver } from '@happyvertical/smrt-agents';

registerConfigResolver('sharedAssetStorage', () => resolveSharedAssetStorage());
// persisted: { "assetStorage": { "$env": "sharedAssetStorage" } }

// 2. static configResolvers on the agent class -- declarative, discoverable
class Praeco extends Agent {
  static override configResolvers = {
    assetStorage: () => resolveSharedAssetStorage(),
  };
}

// The TaskRunner calls resolveLazyConfig() immediately before constructing
// the agent, so live values always win over snapshotted ones.`}
				language="typescript"
			/>
			<p>
				<code>resolveLazyConfig</code>, <code>registerConfigResolver</code>, and
				<code>getClassConfigResolvers</code> are re-exported from
				<code>@happyvertical/smrt-core</code> for cases where agents isn't on the import path.
			</p>

			<h3>4. State Persistence</h3>
			<ul>
				<li>Any public property on Agent is automatically persisted to database</li>
				<li>Agents share a single <code>agents</code> table via Single Table Inheritance (STI)</li>
				<li>Call <code>await this.save()</code> to persist state changes</li>
			</ul>
		</section>

		<section id="dispatch-bus">
			<h2>DispatchBus Communication</h2>
			<p>
				Agents communicate asynchronously via DispatchBus, an event-driven messaging system with
				persistent subscriptions and wildcard pattern matching.
			</p>

			<h3>Persistent Subscriptions</h3>
			<CodeBlock
				code={`// Emitting (in any agent)
const bus = await this.getDispatch();
await bus.emit('campaign.completed', { campaignId: '123' }, { source: 'Suasor' });

// Subscribing (in receiving agent)
async handleDispatch(payload: unknown, metadata: DispatchMetadata): Promise<void> {
  if (metadata.type === 'campaign.completed') {
    await this.recordRevenue(payload as { campaignId: string; revenue: number });
  }
}

async run() {
  await this.processDispatches(); // dispatches handleDispatch() per pending row
}`}
				language="typescript"
			/>

			<h3>Wildcard Pattern Matching</h3>
			<table>
				<thead>
					<tr><th>Pattern</th><th>Matches</th></tr>
				</thead>
				<tbody>
					<tr><td><code>campaign.*</code></td><td>campaign.started, campaign.completed</td></tr>
					<tr><td><code>agent.*.completed</code></td><td>agent.suasor.completed, agent.fiscus.completed</td></tr>
					<tr><td><code>*</code></td><td>All single-segment events</td></tr>
					<tr><td><code>*.*.completed</code></td><td>Multi-level events with 'completed' suffix</td></tr>
				</tbody>
			</table>

			<h3>CLI Commands</h3>
			<CodeBlock
				code={`smrt dispatch:list --status pending --source Suasor
smrt dispatch:process --subscriber Fiscus
smrt dispatch:retry --max-attempts 3
smrt dispatch:cleanup --completed-older-than 30`}
				language="bash"
			/>
		</section>

		<section id="interests">
			<h2>Interest-Based Queries</h2>
			<p>
				The <code>interests</code> system provides a declarative way to query objects the agent is
				interested in, with filters, sorting, limiting, custom handlers, and an optional AI
				<code>qualify()</code> post-filter.
			</p>

			<CodeBlock
				code={`constructor(options: AgentOptions = {}) {
  super({
    ...options,
    interests: {
      objects: {
        Meeting: {
          filter: { status: 'upcoming' },
          handler: async (m) => ({ action: 'recap', meeting: m }),
        },
      },
      qualify: async (items) => items.filter(/* AI-based post-filter */),
    },
  });
}

async run() {
  for (const { type, data, handled } of await this.interesting()) {
    if (handled?.action === 'recap') await this.recap(data);
  }
}`}
				language="typescript"
			/>
		</section>

		<section id="tenant-agent">
			<h2>TenantAgent -- Multi-Tenant Bindings</h2>
			<p>
				The <code>TenantAgent</code> model provides a junction table (<code>tenant_agents</code>)
				binding agents to tenants with permission overrides and hierarchy resolution. As of v0.24.x
				(#1208) the inheritance walk is aligned with smrt-users tenant resolution: an agent enabled
				on a parent tenant is implicitly enabled on every descendant unless overridden.
			</p>
			<ul>
				<li><strong>Explicit binding</strong>: row exists for tenant (<code>source: 'explicit'</code>)</li>
				<li><strong>Inherited</strong>: walks up tenant hierarchy (<code>source: 'inherited'</code>)</li>
				<li><strong>Permissions</strong>: manifest defaults merged with per-tenant overrides</li>
			</ul>
			<CodeBlock
				code={`import { TenantAgentCollection } from '@happyvertical/smrt-agents';

const bindings = await TenantAgentCollection.create({ db });

// Explicit binding
await bindings.create({
  agentId: agent.id,
  tenantId: tenant.id,
  enabled: true,
  permissionOverrides: {
    'agents.run': 'GRANT',
    'agents.schedule': 'DENY',
  },
});

// Resolve effective binding (walks ancestors if no explicit row)
const effective = await bindings.resolveForTenant(agent.id, tenant.id);
console.log(effective.source);      // 'explicit' | 'inherited'
console.log(effective.permissions); // merged manifest + override snapshot`}
				language="typescript"
			/>
		</section>

		<section id="agent-schedule">
			<h2>AgentSchedule</h2>
			<p>
				Cron-based scheduling stored in <code>_smrt_agent_schedules</code>. Executed by the
				ScheduleRunner from <a href="/modules/smrt-jobs">smrt-jobs</a> — see that page for the runner
				wiring.
			</p>
			<CodeBlock
				code={`import { AgentScheduleCollection } from '@happyvertical/smrt-agents';

const schedules = await AgentScheduleCollection.create({ db });
await schedules.create({
  agentType: 'DataProcessorAgent',
  cron: '0 2 * * *',     // 02:00 UTC daily (cron is UTC, not timezone-aware)
  method: 'run',          // default
  maxConcurrent: 1,
  timeout: 300000,        // 5 minutes (ms)
});`}
				language="typescript"
			/>
		</section>

		<section id="signal-handlers">
			<h2>Signal Handler Infrastructure</h2>
			<p>
				Signal handling is <strong>opt-in</strong>: pass <code>manageProcessSignals: true</code> in
				agent options for single-agent processes. The base <code>shutdown()</code> deregisters those
				handlers, so always call <code>super.shutdown()</code> from overrides. Multi-agent processes
				(e.g. running under TaskRunner) should leave this off and let the runner orchestrate
				shutdown.
			</p>
			<CodeBlock
				code={`@smrt()
class MyAgent extends Agent {
  constructor(options: AgentOptions = {}) {
    super({ ...options, manageProcessSignals: true });
  }

  async shutdown(): Promise<void> {
    this.logger.info('Cleaning up connections...');
    await this.closeConnections();
    await super.shutdown(); // Tears down signal handlers
  }
}`}
				language="typescript"
			/>
		</section>

		<section id="summary-article">
			<h2>SummaryArticleResult Type</h2>
			<p>
				<code>SummaryArticleResult</code> is the canonical return shape for agents that generate
				article summaries (e.g. Praeco). It pairs the article body with structured image descriptors
				and surfaces the prompt key used, so callers can re-run with a different template via the
				prompt registry.
			</p>
			<CodeBlock
				code={`import type {
  SummaryArticleResult,
  SummaryArticleOptions,
  SummaryArticleImage,
} from '@happyvertical/smrt-agents';

const result: SummaryArticleResult = await praeco.summarizeArticle({
  sourceUrl,
  promptKey: 'smrtAgents.praeco.summary', // overridable via smrt-prompts
});`}
				language="typescript"
			/>
		</section>

		<section id="prompt-registry">
			<h2>Prompt Registry</h2>
			<p>
				Agent AI methods that talk to an LLM register their templates with
				<a href="/modules/smrt-prompts"><code>@happyvertical/smrt-prompts</code></a>
				so tenants can override the template, model, and params at runtime without forking the
				agent.
			</p>
			<table>
				<thead>
					<tr><th>Prompt Key</th><th>Variables (PII-conscious)</th></tr>
				</thead>
				<tbody>
					<tr>
						<td><code>smrtAgents.praeco.summary</code></td>
						<td><code>title</code>, <code>sourceUrl</code>, <code>bodyExcerpt</code>, <code>language</code></td>
					</tr>
					<tr>
						<td><code>smrtAgents.interests.qualify</code></td>
						<td><code>type</code>, <code>candidates</code> (id + label only)</td>
					</tr>
				</tbody>
			</table>
			<p>
				Internal foreign-key fields (<code>tenantId</code>, <code>ownerId</code>) and raw
				<code>metadata</code> blobs are intentionally excluded from the variable surface. See
				<a href="/modules/smrt-prompts">smrt-prompts</a> for the override workflow.
			</p>
		</section>

		<section id="best-practices">
			<h2>Best Practices</h2>
			<ol>
				<li>Always call <code>super</code> from overridden lifecycle methods</li>
				<li>Persist state regularly with <code>await this.save()</code> — long-running agents lose progress on crash otherwise</li>
				<li>Use <code>manageProcessSignals</code> only on single-agent entry points; let TaskRunner handle multi-agent shutdown</li>
				<li>Prefer <code>static configResolvers</code> over <code>$env</code> sentinels when the resolver is class-specific (it's discoverable)</li>
				<li>For tenant-scoped agents, always check the effective <code>TenantAgent</code> binding before running privileged actions</li>
				<li>Register prompts via <code>definePrompt()</code> so tenants can override without code changes</li>
			</ol>
		</section>

		<section id="related">
			<h2>Related Modules</h2>
			<div class="link-grid">
				<a href="/modules/smrt-core" class="link-card">
					<h3>smrt-core</h3>
					<p>SmrtObject, DispatchBus, ObjectRegistry</p>
				</a>
				<a href="/modules/smrt-jobs" class="link-card">
					<h3>smrt-jobs</h3>
					<p>TaskRunner and ScheduleRunner — the agent runtime</p>
				</a>
				<a href="/modules/smrt-prompts" class="link-card">
					<h3>smrt-prompts</h3>
					<p>Tenant-overridable prompt registry</p>
				</a>
				<a href="/modules/smrt-cli" class="link-card">
					<h3>smrt-cli</h3>
					<p>CLI for agent execution and dispatch management</p>
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
