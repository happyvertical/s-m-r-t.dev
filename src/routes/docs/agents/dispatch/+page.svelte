<svelte:head>
	<title>DispatchBus | s-m-r-t Documentation</title>
</svelte:head>

<article class="prose">
		<h1>DispatchBus</h1>
		<p class="lead">
			The DispatchBus provides asynchronous inter-agent communication. Agents emit events that other
			agents process later, enabling loose coupling.
		</p>

		<nav class="subnav">
			<a href="/docs/agents">&larr; Agents</a>
		</nav>

		<h2>Architecture</h2>
		<pre><code>{`┌─────────────┐     emit()      ┌──────────────────┐
│   Suasor    │ ───────────────►│  _smrt_dispatch  │
│   Agent     │                 │     (pending)    │
└─────────────┘                 └────────┬─────────┘
                                         │
                                         │ process('Fiscus')
                                         ▼
┌─────────────┐   handleDispatch()  ┌──────────────────┐
│   Fiscus    │ ◄───────────────────│  DispatchBus     │
│   Agent     │                     └──────────────────┘
└─────────────┘`}</code></pre>

		<h2>Creating a DispatchBus</h2>
		<pre><code>{`import { createDispatchBus } from '@happyvertical/smrt-core';

const bus = await createDispatchBus({
  db: { type: 'sqlite', url: 'app.db' }
});

// Or with existing DatabaseInterface
const bus = await createDispatchBus({ db: existingDb });`}</code></pre>

		<h2>Emitting Events</h2>
		<pre><code>{`const dispatch = await bus.emit(
  'campaign.completed',                    // Signal type
  { campaignId: 'camp-123', revenue: 5000 }, // Payload
  {
    source: 'Suasor',                      // Emitting agent
    sourceId: 'instance-1',                // Optional instance ID
    metadata: {                            // Optional trace metadata
      traceId: 'trace-abc123',
      environment: 'production'
    }
  }
);`}</code></pre>
		<p>The dispatch is persisted immediately with <code>status: 'pending'</code>.</p>

		<h2>Subscriptions</h2>

		<h3>Persistent Subscriptions</h3>
		<p>Survive application restarts:</p>
		<pre><code>{`// Create subscription
await bus.subscribe({
  signalType: 'campaign.completed',
  subscriber: 'Fiscus',
  handler: 'handleCampaignRevenue',
  enabled: true
});

// Remove subscription
await bus.unsubscribe('campaign.completed', 'Fiscus');

// List subscriptions
const subs = await bus.listSubscriptions('Fiscus');`}</code></pre>

		<h3>In-memory Handlers</h3>
		<p>For immediate reactions:</p>
		<pre><code>{`// Register handler (fire-and-forget)
bus.on('campaign.completed', async (payload, metadata) => {
  console.log(\`Campaign \${payload.campaignId} completed\`);
  await sendSlackNotification(payload);
});

// Unregister
bus.off('campaign.completed', handler);`}</code></pre>

		<h2>Wildcard Subscriptions</h2>
		<p>Pattern matching for event families:</p>
		<table>
			<thead><tr><th>Pattern</th><th>Matches</th><th>Does NOT Match</th></tr></thead>
			<tbody>
				<tr><td><code>campaign.*</code></td><td>campaign.started, campaign.completed</td><td>campaign.summer.started</td></tr>
				<tr><td><code>agent.*.completed</code></td><td>agent.suasor.completed, agent.fiscus.completed</td><td>agent.suasor.started</td></tr>
				<tr><td><code>*</code></td><td>All events</td><td>-</td></tr>
				<tr><td><code>*.*.completed</code></td><td>agent.suasor.completed, task.backup.completed</td><td>agent.completed</td></tr>
			</tbody>
		</table>
		<p>Rules:</p>
		<ul>
			<li><code>*</code> matches exactly one segment (anything except <code>.</code>)</li>
			<li>Multiple wildcards allowed</li>
			<li>Disabled subscriptions never match</li>
		</ul>

		<h2>Handler Types</h2>

		<h3>In-memory Handlers</h3>
		<ul>
			<li>Called synchronously when emit() is invoked</li>
			<li>Fire-and-forget (errors logged, not propagated)</li>
			<li>Useful for real-time notifications</li>
		</ul>

		<h3>Persistent Subscriptions</h3>
		<ul>
			<li>Stored in database</li>
			<li>Processed when process() is called</li>
			<li>Supports retry on failure</li>
			<li>Survives restarts</li>
		</ul>

		<pre><code>{`// In-memory (immediate)
bus.on('order.placed', async (payload, metadata) => {
  await sendConfirmationEmail(payload);
});

// Persistent (processed later)
await bus.subscribe({
  signalType: 'order.placed',
  subscriber: 'Fulfillment'
});

// Process pending dispatches
await bus.process('Fulfillment', async (payload, metadata) => {
  await createShipment(payload);
});`}</code></pre>

		<h2>Processing Dispatches</h2>
		<pre><code>{`const count = await bus.process(
  'Fiscus',                              // Subscriber name
  async (payload, metadata) => {         // Handler function
    console.log(\`Processing \${metadata.type}\`);
    console.log(\`From: \${metadata.source}\`);
    console.log(\`Trace: \${metadata.metadata.traceId}\`);

    // Process the dispatch...
  },
  {
    limit: 100,                          // Max dispatches to process
    signalTypes: ['campaign.completed']  // Optional filter
  }
);

console.log(\`Processed \${count} dispatches\`);`}</code></pre>

		<p>Handler receives:</p>
		<ul>
			<li><code>payload</code> - Original dispatch data</li>
			<li><code>metadata</code> - Dispatch metadata (id, type, source, attempts, etc.)</li>
		</ul>

		<h2>Dispatch Lifecycle</h2>
		<pre><code>{`pending ──► processing ──► completed
                     └──► failed ──► (retry) ──► pending`}</code></pre>

		<table>
			<thead><tr><th>Status</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td><code>pending</code></td><td>Waiting to be processed</td></tr>
				<tr><td><code>processing</code></td><td>Currently being handled</td></tr>
				<tr><td><code>completed</code></td><td>Successfully processed</td></tr>
				<tr><td><code>failed</code></td><td>Handler threw an error</td></tr>
			</tbody>
		</table>

		<h2>Retry Mechanism</h2>
		<pre><code>{`// Retry failed dispatches
const resetCount = await bus.retry({
  maxAttempts: 3,                        // Only retry if under this limit
  signalTypes: ['campaign.*'],           // Optional filter
  olderThan: new Date('2024-01-01')      // Optional age filter
});

console.log(\`Reset \${resetCount} dispatches for retry\`);

// Then process again
await bus.process('Fiscus', handler);`}</code></pre>
		<p>Retry resets <code>status</code> from <code>failed</code> to <code>pending</code>. The <code>attempts</code> counter is preserved.</p>

		<h2>Cleanup</h2>
		<p>Delete old dispatches to manage database size:</p>
		<pre><code>{`const result = await bus.cleanup({
  completedOlderThanDays: 30,
  failedOlderThanDays: 90
});

console.log(\`Deleted \${result.completedDeleted} completed\`);
console.log(\`Deleted \${result.failedDeleted} failed\`);`}</code></pre>

		<h2>Query Dispatches</h2>
		<pre><code>{`// List with filters
const pending = await bus.list({
  status: 'pending',
  source: 'Suasor',
  type: 'campaign.completed',
  limit: 50,
  offset: 0,
  orderBy: 'created_at DESC'
});

// Get by ID
const dispatch = await bus.get('dispatch-uuid');`}</code></pre>

		<h2>Tracing</h2>
		<p>Include metadata for observability:</p>
		<pre><code>{`await bus.emit(
  'order.placed',
  { orderId: 'ord-123' },
  {
    source: 'Checkout',
    sourceId: 'checkout-instance-1',
    metadata: {
      traceId: 'trace-abc123',
      spanId: 'span-xyz789',
      requestId: 'req-456',
      userId: 'user-789'
    }
  }
);

// Access in handler
await bus.process('Billing', async (payload, metadata) => {
  logger.info('Processing order', {
    dispatchId: metadata.id,
    traceId: metadata.metadata.traceId,
    source: metadata.source,
    attempts: metadata.attempts
  });
});`}</code></pre>

		<h3>DispatchMetadata Fields</h3>
		<table>
			<thead><tr><th>Field</th><th>Type</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td><code>id</code></td><td>string</td><td>Dispatch UUID</td></tr>
				<tr><td><code>type</code></td><td>string</td><td>Signal type</td></tr>
				<tr><td><code>source</code></td><td>string</td><td>Emitting agent name</td></tr>
				<tr><td><code>sourceId</code></td><td>string</td><td>Instance identifier</td></tr>
				<tr><td><code>createdAt</code></td><td>Date</td><td>Creation timestamp</td></tr>
				<tr><td><code>attempts</code></td><td>number</td><td>Processing attempts</td></tr>
				<tr><td><code>metadata</code></td><td>Record&lt;string, unknown&gt;</td><td>Custom trace data</td></tr>
			</tbody>
		</table>

		<h2>Internal Tables</h2>

		<h3>_smrt_dispatch</h3>
		<p>Stores dispatch messages:</p>
		<table>
			<thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td><code>id</code></td><td>TEXT</td><td>Unique identifier</td></tr>
				<tr><td><code>type</code></td><td>TEXT</td><td>Signal type (e.g., campaign.completed)</td></tr>
				<tr><td><code>source</code></td><td>TEXT</td><td>Emitting agent name</td></tr>
				<tr><td><code>source_id</code></td><td>TEXT</td><td>Optional instance identifier</td></tr>
				<tr><td><code>payload</code></td><td>TEXT</td><td>JSON-encoded payload</td></tr>
				<tr><td><code>status</code></td><td>TEXT</td><td>pending, processing, completed, failed</td></tr>
				<tr><td><code>attempts</code></td><td>INTEGER</td><td>Number of processing attempts</td></tr>
				<tr><td><code>last_error</code></td><td>TEXT</td><td>Error message from last failure</td></tr>
				<tr><td><code>processed_by</code></td><td>TEXT</td><td>Subscriber that processed</td></tr>
				<tr><td><code>metadata</code></td><td>TEXT</td><td>JSON-encoded trace metadata</td></tr>
			</tbody>
		</table>

		<h3>_smrt_dispatch_subscriptions</h3>
		<p>Stores persistent subscriptions:</p>
		<table>
			<thead><tr><th>Column</th><th>Type</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td><code>id</code></td><td>TEXT</td><td>Unique identifier</td></tr>
				<tr><td><code>signal_type</code></td><td>TEXT</td><td>Pattern to match (supports wildcards)</td></tr>
				<tr><td><code>subscriber</code></td><td>TEXT</td><td>Agent name</td></tr>
				<tr><td><code>handler</code></td><td>TEXT</td><td>Method name to invoke</td></tr>
				<tr><td><code>enabled</code></td><td>INTEGER</td><td>1 = active, 0 = disabled</td></tr>
			</tbody>
		</table>

		<h2>CLI Commands</h2>
		<pre><code>{`# List dispatches
smrt dispatch:list
smrt dispatch:list --status pending
smrt dispatch:list --source Suasor

# Process pending
smrt dispatch:process --subscriber Fiscus

# Retry failed
smrt dispatch:retry --max-attempts 3

# Cleanup old
smrt dispatch:cleanup --completed-older-than 30

# Manage subscriptions
smrt dispatch:subscriptions --subscriber Fiscus
smrt dispatch:subscribe --signal-type campaign.* --subscriber Fiscus
smrt dispatch:unsubscribe --signal-type campaign.* --subscriber Fiscus`}</code></pre>

		<h2>Best Practices</h2>

		<h3>Signal Types</h3>
		<pre><code>{`// Good - clear hierarchy
'campaign.completed'
'order.payment.failed'
'agent.fiscus.ready'

// Bad - ambiguous
'done'
'error'
'data'`}</code></pre>

		<h3>Always Include Source</h3>
		<pre><code>{`// Good - traceable
await bus.emit('event', payload, { source: 'Suasor', sourceId: 'instance-1' });

// Bad - unknown origin
await bus.emit('event', payload);`}</code></pre>

		<h3>Handle Failures Gracefully</h3>
		<pre><code>{`await bus.process('Fiscus', async (payload, metadata) => {
  try {
    await processPayload(payload);
  } catch (error) {
    // Log but rethrow to mark as failed
    console.error(\`Failed to process \${metadata.id}:\`, error);
    throw error;
  }
});`}</code></pre>

		<h3>Monitor with Wildcards</h3>
		<pre><code>{`// Monitor all events for logging/metrics
await bus.subscribe({
  signalType: '*',
  subscriber: 'MetricsCollector'
});`}</code></pre>

		<h3>Schedule Cleanup</h3>
		<pre><code>{`// In a scheduled job (daily)
await bus.cleanup({
  completedOlderThanDays: 7,
  failedOlderThanDays: 30
});`}</code></pre>
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

</style>
