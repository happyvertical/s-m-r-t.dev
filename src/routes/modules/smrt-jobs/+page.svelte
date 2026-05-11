<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-jobs"
	description="Background job execution with persistent queue, retry strategies, cron scheduling, and a fluent JobBuilder API."
	badges={['v0.24.12', 'Task Runner', 'Scheduler', 'Fluent API']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-jobs</strong> provides background job execution for any SmrtObject method. Jobs
			are persisted in the <code>_smrt_jobs</code> system table, processed by a polling-based
			TaskRunner with concurrency control, and can be scheduled via cron expressions through the
			ScheduleRunner. This is also the runtime that the
			<a href="/modules/smrt-agents">smrt-agents</a> <code>AgentSchedule</code> model targets.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li><code>withBackgroundJobs()</code> mixin adds <code>.bg()</code> and <code>.background()</code> to any SmrtObject</li>
				<li>Fluent JobBuilder: delay, priority, retries, queue, timeout</li>
				<li>TaskRunner: polling-based execution with concurrency, atomic claims, and heartbeats</li>
				<li>ScheduleRunner: cron-based recurring job creation (UTC, not timezone-aware)</li>
				<li>JobHandle for tracking, waiting, cancelling, and retrying</li>
				<li>Event-driven: <code>job:started</code>, <code>job:completed</code>, <code>job:failed</code>, <code>job:retrying</code></li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Architecture</h2>
		<CodeBlock
			code={`SmrtObject.bg('method')
  ──► SmrtJob (in _smrt_jobs)
       ──► TaskRunner picks up
            ──► executes via ObjectRegistry

AgentSchedule (cron)
  ──► ScheduleRunner creates SmrtJob (queue='agents', priority=75)
       ──► TaskRunner executes
            ──► ScheduleRunner updates lastRunAt / nextRunAt`}
			language="text"
		/>
	</section>

	<section>
		<h2>Tenancy</h2>
		<p>
			<code>SmrtJob</code> is a system table (prefix <code>_smrt_</code>) and is intentionally
			<strong>not</strong> tenant-scoped — the runner needs a single global queue across tenants.
			Tenant context is preserved through the job's <code>objectType</code> + <code>objectId</code>
			lookup: when the runner hydrates the target object, its own <code>@TenantScoped</code>
			declaration governs row visibility. Jobs are claimed atomically via
			<code>status='running'</code> + <code>workerId</code> so concurrent runners never double-pick.
		</p>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-jobs`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import { withBackgroundJobs, TaskRunner } from '@happyvertical/smrt-jobs';
import { Document } from './document.js';

// Mixin adds .bg() and .background() to any SmrtObject class
const BackgroundDocument = withBackgroundJobs(Document);
const doc = new BackgroundDocument({ db });
await doc.initialize();

// Quick enqueue -- runs when a TaskRunner picks it up
const handle = await doc.bg('generateSummary', { format: 'md' });

// Fluent builder for advanced options
const handle2 = await doc.background('generateSummary', { format: 'md' })
  .delay('5m')
  .priority('high')
  .retries(5)
  .queue('analysis')
  .timeout(600000)
  .enqueue();

// Wait for result (polling-based, default 100ms)
const result = await handle2.wait({ timeout: 60000, pollInterval: 100 });`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>SmrtJob</h3>
		<CodeBlock
			code={`class SmrtJob extends SmrtObject {
  queue: string               // 'default' by default
  objectType: string          // Class name for ObjectRegistry lookup
  objectId: string
  method: string              // Method to call on the object
  args: string                // JSON arguments
  runAt: Date
  priority: number            // Higher = sooner
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  attempts: number
  maxAttempts: number
  timeout: number             // Default 5 minutes (ms)
  retryStrategy: string
  workerId?: string
  workerHeartbeat?: Date
  resultPointer?: string      // App-defined result storage (just a string)
}`}
			language="typescript"
		/>

		<h3>TaskRunner</h3>
		<CodeBlock
			code={`const runner = new TaskRunner({
  concurrency: 5,             // Max parallel jobs
  pollInterval: 1000,         // Poll every 1 second
  heartbeatInterval: 30000,   // Heartbeat every 30 seconds
  shutdownTimeout: 30000,     // Graceful shutdown timeout
  queues: ['default', 'analysis', 'agents'],
});
await runner.initialize(db);
await runner.start();

// 1. Polls listReady() for pending jobs (runAt <= NOW, priority DESC, runAt ASC)
// 2. Claims atomically: status='running', workerId=this.id
// 3. Resolves class via ObjectRegistry.getClass(objectType), constructs, calls method
//    Internal args _agentConfig and _scheduleId are stripped before the method runs
// 4. On failure: schedules future runAt via retry strategy

runner.on('job:completed', (job, result) => { /* ... */ });
runner.on('job:failed', (job, error) => { /* ... */ });

// Graceful shutdown
process.on('SIGTERM', () => runner.stop());`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Cron Scheduling</h2>
		<CodeBlock
			code={`import { ScheduleRunner } from '@happyvertical/smrt-jobs';

// Polls _smrt_agent_schedules every 60s for due cron entries.
// Creates SmrtJob rows with queue='agents', priority=75.
const scheduleRunner = new ScheduleRunner({ pollInterval: 30000 });
await scheduleRunner.initialize(db);
await scheduleRunner.start();

// Wire TaskRunner events back to ScheduleRunner so it can update lastRun state.
taskRunner.on('job:completed', (job) => {
  const scheduleId = job.args?._scheduleId;
  if (scheduleId) scheduleRunner.handleJobCompletion(scheduleId, true);
});
taskRunner.on('job:failed', (job, error) => {
  const scheduleId = job.args?._scheduleId;
  if (scheduleId) scheduleRunner.handleJobCompletion(scheduleId, false, error.message);
});

// Cron format: 5-field (minute hour dom month dow)
// Supports: *, ranges, lists, steps
// All times are UTC (not timezone-aware)`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>JobBuilder -- Fluent API</h2>
		<CodeBlock
			code={`const handle = await doc.background('analyze', { detailed: true })
  .delay('5m')
  .priority('high')
  .retries(5)
  .queue('analysis')
  .timeout(600000)
  .enqueue();

await handle.wait({ timeout: 60000, pollInterval: 100 });`}
			language="typescript"
		/>
		<p>
			<code>bg()</code> is shorthand for the common case:
			<code>{'await doc.bg(\'analyze\', args)'}</code> enqueues immediately and returns a
			<code>JobHandle</code>.
		</p>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>withBackgroundJobs()</code> mixin to add background capabilities</li>
				<li>Use the fluent builder for complex job configuration</li>
				<li>Wire ScheduleRunner events to TaskRunner for completion tracking</li>
				<li>Implement graceful shutdown with <code>runner.stop()</code></li>
				<li>Use priority levels for job ordering (critical/high/normal/low)</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't forget to call <code>.enqueue()</code> on the builder — it's lazy</li>
				<li>Don't assume timezone support (cron is UTC only)</li>
				<li>Don't expect a dead letter queue — failed jobs stay in DB with <code>status='failed'</code></li>
				<li>Don't rely on <code>resultPointer</code> without implementing a result backend</li>
				<li>Don't poll too aggressively with <code>handle.wait()</code> (default 100ms is reasonable)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-agents">
				<h3>smrt-agents</h3>
				<p>AgentSchedule + TaskRunner orchestration</p>
			</a>
			<a href="/modules/smrt-core">
				<h3>smrt-core</h3>
				<p>SmrtObject and ObjectRegistry</p>
			</a>
			<a href="/modules/smrt-config">
				<h3>smrt-config</h3>
				<p>Configuration loading</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
