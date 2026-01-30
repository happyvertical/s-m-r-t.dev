<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Grid from '$lib/components/Grid.svelte';
</script>

<svelte:head>
	<title>smrt-types | SMRT Modules</title>
	<meta name="description" content="Shared TypeScript type definitions for the HAVE SDK" />
</svelte:head>

<Grid>
	<article class="prose">
		<nav class="breadcrumb">
			<a href="/modules">Modules</a>
			<span>/</span>
			<span>smrt-types</span>
		</nav>

		<h1>@happyvertical/smrt-types</h1>
		<p class="lead">
			Shared TypeScript type definitions and interfaces used across multiple SMRT packages to prevent circular dependencies and ensure type safety.
		</p>

		<div class="meta">
			<span class="badge">v0.17.100</span>
			<span class="badge">Core Foundation</span>
			<span class="badge">ESM</span>
			<span class="badge">Zero Dependencies</span>
		</div>

		<section id="overview">
			<h2>Overview</h2>
			<p>
				<code>@happyvertical/smrt-types</code> provides shared TypeScript definitions that are used across the entire SMRT ecosystem. By centralizing these types, we avoid circular dependencies between packages and ensure consistent interfaces throughout the SDK.
			</p>
			<p>
				Currently, this package exports the <strong>Signal System</strong> types, which power automatic method tracking and event distribution across SMRT objects.
			</p>
		</section>

		<section id="installation">
			<h2>Installation</h2>
			<CodeBlock code={`npm install @happyvertical/smrt-types`} language="bash" />
			<p class="note">
				<strong>Note:</strong> This package is typically installed as a dependency of other SMRT packages. You rarely need to install it directly.
			</p>
		</section>

		<section id="signal-system">
			<h2>Signal System</h2>
			<p>
				The Signal System provides automatic observability into SMRT method execution, enabling logging, metrics, pub/sub updates, and distributed tracing without manual instrumentation.
			</p>

			<h3>Signal Interface</h3>
			<CodeBlock code={`import type { Signal } from '@happyvertical/smrt-types';

// Signal structure
interface Signal {
  // Execution tracking
  id: string;              // Unique execution ID
  objectId: string;        // SMRT object instance ID
  className: string;       // SMRT class name
  method: string;          // Method being executed

  // Lifecycle stage
  type: 'start' | 'step' | 'end' | 'error';

  // Optional progress tracking
  step?: string;           // Custom step label

  // Execution data
  args?: any[];           // Sanitized arguments
  result?: any;           // Return value (on 'end')
  error?: Error;          // Error (on 'error')
  duration?: number;      // Execution time in ms

  // Metadata
  timestamp: Date;
  metadata?: Record<string, any>;
}`} language="typescript" />

			<h3>SignalType</h3>
			<p>Four lifecycle stages for method execution:</p>
			<ul>
				<li><code>start</code> - Method execution started</li>
				<li><code>step</code> - Manual progress step (optional)</li>
				<li><code>end</code> - Method completed successfully</li>
				<li><code>error</code> - Method failed with error</li>
			</ul>

			<CodeBlock code={`type SignalType = 'start' | 'step' | 'end' | 'error';`} language="typescript" />

			<h3>SignalAdapter Interface</h3>
			<p>Adapters consume signals for specific purposes (logging, metrics, tracing, etc.):</p>
			<CodeBlock code={`import type { SignalAdapter, Signal } from '@happyvertical/smrt-types';

class MyAdapter implements SignalAdapter {
  async handle(signal: Signal): Promise<void> {
    // Process the signal
    // Errors are caught by SignalBus
  }
}

// Common adapter use cases:
// - Logging: Write to console, file, or logging service
// - Metrics: Track execution counts, durations, errors
// - Pub/Sub: Broadcast real-time updates to clients
// - Tracing: Send spans to distributed tracing systems`} language="typescript" />
		</section>

		<section id="usage">
			<h2>Usage in SMRT Objects</h2>
			<p>
				SMRT objects automatically emit signals during method execution. You can listen to these signals using the internal signal bus:
			</p>

			<CodeBlock code={`import { SmrtObject } from '@happyvertical/smrt-core';
import type { Signal } from '@happyvertical/smrt-types';

class Product extends SmrtObject {
  async analyze() {
    // Signals automatically emitted:
    // - 'start' when method begins
    // - 'end' when method completes
    // - 'error' if method throws
  }
}

// Listen to signals
const product = new Product();
const signalBus = product._signalBus;

signalBus?.on('method:before', (signal: Signal) => {
  console.log(\`Starting: \${signal.method}\`);
});

signalBus?.on('method:after', (signal: Signal) => {
  console.log(\`Completed: \${signal.method} in \${signal.duration}ms\`);
});

signalBus?.on('method:error', (signal: Signal) => {
  console.error(\`Failed: \${signal.method}\`, signal.error);
});

await product.analyze();`} language="typescript" />

			<h3>Custom Step Signals</h3>
			<p>Emit manual progress steps within methods:</p>
			<CodeBlock code={`class Document extends SmrtObject {
  async process() {
    this._signalBus?.emit({
      id: 'exec-123',
      objectId: this.id,
      className: 'Document',
      method: 'process',
      type: 'step',
      step: 'downloading',
      timestamp: new Date()
    });

    await this.download();

    this._signalBus?.emit({
      ...
      step: 'parsing',
      ...
    });

    await this.parse();
  }
}`} language="typescript" />
		</section>

		<section id="adapters">
			<h2>Signal Adapters</h2>

			<h3>Example: Logging Adapter</h3>
			<CodeBlock code={`import type { SignalAdapter, Signal } from '@happyvertical/smrt-types';

class LoggingAdapter implements SignalAdapter {
  async handle(signal: Signal): Promise<void> {
    const log = {
      time: signal.timestamp,
      class: signal.className,
      method: signal.method,
      type: signal.type
    };

    if (signal.type === 'end') {
      log.duration = signal.duration;
      console.log('✓', log);
    } else if (signal.type === 'error') {
      log.error = signal.error?.message;
      console.error('✗', log);
    } else if (signal.type === 'start') {
      console.log('→', log);
    }
  }
}`} language="typescript" />

			<h3>Example: Metrics Adapter</h3>
			<CodeBlock code={`class MetricsAdapter implements SignalAdapter {
  private metrics = new Map<string, number[]>();

  async handle(signal: Signal): Promise<void> {
    if (signal.type === 'end' && signal.duration) {
      const key = \`\${signal.className}.\${signal.method}\`;
      const durations = this.metrics.get(key) || [];
      durations.push(signal.duration);
      this.metrics.set(key, durations);
    }
  }

  getAverageDuration(className: string, method: string): number {
    const key = \`\${className}.\${method}\`;
    const durations = this.metrics.get(key) || [];
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  }
}`} language="typescript" />

			<h3>Example: Pub/Sub Adapter</h3>
			<CodeBlock code={`class WebSocketAdapter implements SignalAdapter {
  constructor(private ws: WebSocket) {}

  async handle(signal: Signal): Promise<void> {
    // Broadcast progress to connected clients
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        event: 'method:progress',
        data: {
          class: signal.className,
          method: signal.method,
          type: signal.type,
          progress: signal.step,
          timestamp: signal.timestamp
        }
      }));
    }
  }
}`} language="typescript" />
		</section>

		<section id="benefits">
			<h2>Why Centralize Types?</h2>
			<ol>
				<li><strong>Prevent Circular Dependencies</strong> - Shared types can be imported without creating dependency cycles</li>
				<li><strong>Single Source of Truth</strong> - Type definitions maintained in one place</li>
				<li><strong>Version Synchronization</strong> - All packages use the same type version</li>
				<li><strong>Type Safety</strong> - TypeScript ensures consistency across the SDK</li>
				<li><strong>Tree Shaking</strong> - Zero runtime overhead (types only)</li>
			</ol>
		</section>

		<section id="api-reference">
			<h2>API Reference</h2>

			<h3>Exports</h3>
			<CodeBlock code={`// Type exports (no runtime code)
export type { Signal } from './signals.js';
export type { SignalAdapter } from './signals.js';
export type { SignalType } from './signals.js';`} language="typescript" />

			<h3>Signal Properties</h3>
			<table class="api-table">
				<thead>
					<tr>
						<th>Property</th>
						<th>Type</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>id</code></td>
						<td><code>string</code></td>
						<td>Unique execution identifier</td>
					</tr>
					<tr>
						<td><code>objectId</code></td>
						<td><code>string</code></td>
						<td>SMRT object instance ID</td>
					</tr>
					<tr>
						<td><code>className</code></td>
						<td><code>string</code></td>
						<td>SMRT class name</td>
					</tr>
					<tr>
						<td><code>method</code></td>
						<td><code>string</code></td>
						<td>Method being executed</td>
					</tr>
					<tr>
						<td><code>type</code></td>
						<td><code>SignalType</code></td>
						<td>Lifecycle stage</td>
					</tr>
					<tr>
						<td><code>step</code></td>
						<td><code>string?</code></td>
						<td>Custom progress label</td>
					</tr>
					<tr>
						<td><code>args</code></td>
						<td><code>any[]?</code></td>
						<td>Sanitized arguments</td>
					</tr>
					<tr>
						<td><code>result</code></td>
						<td><code>any?</code></td>
						<td>Return value (on 'end')</td>
					</tr>
					<tr>
						<td><code>error</code></td>
						<td><code>Error?</code></td>
						<td>Error (on 'error')</td>
					</tr>
					<tr>
						<td><code>duration</code></td>
						<td><code>number?</code></td>
						<td>Execution time (ms)</td>
					</tr>
					<tr>
						<td><code>timestamp</code></td>
						<td><code>Date</code></td>
						<td>When signal was emitted</td>
					</tr>
					<tr>
						<td><code>metadata</code></td>
						<td><code>Record?</code></td>
						<td>Additional context</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section id="best-practices">
			<h2>Best Practices</h2>
			<ol>
				<li><strong>Don't install directly</strong> - Let other SMRT packages bring it in as a dependency</li>
				<li><strong>Use type-only imports</strong> - <code>import type { Signal } from '@happyvertical/smrt-types'</code></li>
				<li><strong>Handle adapter errors</strong> - SignalAdapter.handle() should catch its own errors</li>
				<li><strong>Sanitize sensitive data</strong> - Don't include passwords or keys in signal.args</li>
				<li><strong>Keep adapters lightweight</strong> - Signals are emitted frequently; avoid heavy operations</li>
			</ol>
		</section>

		<section id="next-steps">
			<h2>Next Steps</h2>
			<div class="link-grid">
				<a href="/modules/smrt-core" class="link-card">
					<h3>← smrt-core</h3>
					<p>Core AI agent framework</p>
				</a>
				<a href="/modules/smrt-config" class="link-card">
					<h3>smrt-config →</h3>
					<p>Configuration management</p>
				</a>
			</div>
		</section>
	</article>
</Grid>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
	}

	.breadcrumb a {
		color: var(--smrt-color-on-surface-variant, #666);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--smrt-color-primary, #1976d2);
	}

	.breadcrumb span:not(:last-child) {
		color: #ccc;
	}

	.prose {
		grid-column: 1 / -1;
		max-width: 900px;
		margin: 0 auto;
		padding: 48px 24px;
	}

	.prose h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.lead {
		font-size: 1.2rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 24px;
		line-height: 1.6;
	}

	.meta {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.badge {
		display: inline-block;
		padding: 4px 12px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: 12px;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.note {
		padding: 16px;
		background: #f0f7ff;
		border-left: 4px solid #0066cc;
		margin: 16px 0;
		font-size: 0.95rem;
	}

	.prose h2 {
		font-size: 1.75rem;
		font-weight: 600;
		margin-top: 64px;
		margin-bottom: 24px;
		padding-top: 16px;
		border-top: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.prose h2:first-of-type {
		border-top: none;
		margin-top: 0;
	}

	.prose h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 16px;
	}

	.prose p {
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		line-height: 1.7;
	}

	.prose ul, .prose ol {
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		padding-left: 24px;
		line-height: 1.7;
	}

	.prose li {
		margin-bottom: 8px;
	}

	.prose code:not(pre code) {
		font-family: var(--font-mono);
		font-size: 0.9em;
		padding: 2px 6px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		border-radius: 3px;
		color: #d63384;
	}

	.api-table {
		width: 100%;
		border-collapse: collapse;
		margin: 24px 0;
		font-size: 0.9rem;
	}

	.api-table th {
		text-align: left;
		padding: 12px;
		background: var(--smrt-color-surface-container, #f5f5f5);
		font-weight: 600;
		border-bottom: 2px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.api-table td {
		padding: 12px;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
		vertical-align: top;
	}

	.api-table td:first-child {
		font-family: var(--font-mono);
		font-size: 0.85rem;
	}

	.api-table td:nth-child(2) {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.api-table td:nth-child(3) {
		color: var(--smrt-color-on-surface-variant, #666);
	}

	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
		margin-top: 24px;
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
