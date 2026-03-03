<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>Getting Started - SMRT Framework</title>
	<meta
		name="description"
		content="Get started with SMRT - a full-stack TypeScript framework for building scalable applications with auto-generated APIs."
	/>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-4">Getting Started with SMRT</h1>
		<p class="text-xl text-gray-600">
			Learn how to install SMRT, create your first project, and build your first SmrtObject in under
			10 minutes.
		</p>
	</div>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">What is SMRT?</h2>
		<p class="mb-4">
			SMRT is a full-stack TypeScript framework that abstracts away implementation details for
			databases, REST APIs, MCP tools, and CLI commands through simple object definitions. Define
			your data models once, and SMRT automatically generates everything you need.
		</p>
		<div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
			<p class="font-semibold mb-2">Core Benefits:</p>
			<ul class="list-disc list-inside space-y-1">
				<li><strong>No Vendor Lock:</strong> Works with PostgreSQL, SQLite, and more</li>
				<li><strong>Adaptable:</strong> Easy to extend and customize</li>
				<li><strong>Brief:</strong> Minimal boilerplate code</li>
				<li><strong>Scalable:</strong> From prototypes to production</li>
			</ul>
		</div>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Prerequisites</h2>
		<ul class="list-disc list-inside space-y-2">
			<li>Node.js 20+ installed</li>
			<li>Basic TypeScript knowledge</li>
			<li>Familiarity with npm/pnpm</li>
		</ul>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Installation</h2>

		<h3 class="text-2xl font-semibold mb-3">Install Core Packages</h3>
		<CodeBlock
			code={`pnpm add @happyvertical/smrt-core @happyvertical/smrt-types @happyvertical/smrt-config`}
			language="bash"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">Add Domain Packages as Needed</h3>
		<p class="mb-4">
			Install additional packages for your use case. For example, for agents and background jobs:
		</p>
		<CodeBlock
			code={`pnpm add @happyvertical/smrt-agents @happyvertical/smrt-jobs`}
			language="bash"
		/>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Your First SmrtObject</h2>

		<h3 class="text-2xl font-semibold mb-3">Step 1: Define Your Model</h3>
		<p class="mb-4">
			Create a file <code class="bg-gray-100 px-2 py-1 rounded">src/models/Task.ts</code>:
		</p>
		<CodeBlock
			code={`import { SmrtObject, smrt } from '@happyvertical/smrt-core';

@smrt({
  api: true,    // Generate REST API
  cli: true,    // Generate CLI commands
  mcp: true     // Generate MCP tools
})
export class Task extends SmrtObject {
  title: string = '';
  description: string = '';
  status: string = 'todo';
  dueDate: string = '';

  // Custom method
  complete() {
    this.status = 'done';
  }
}`}
			language="typescript"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">Step 2: Create the Collection</h3>
		<CodeBlock
			code={`import { SmrtCollection } from '@happyvertical/smrt-core';
import { Task } from './Task.js';

export class TaskCollection extends SmrtCollection<Task> {
  static readonly _itemClass = Task;

  // Custom query methods
  async findByStatus(status: string) {
    return this.list({ where: { status } });
  }

  async findOverdue() {
    return this.list({
      where: {
        'status !=': 'done',
        'dueDate <': new Date().toISOString()
      }
    });
  }
}`}
			language="typescript"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">Step 3: Use Your Object</h3>
		<CodeBlock
			code={`import { TaskCollection } from './models/TaskCollection.js';

// Create collection via static factory
const tasks = await TaskCollection.create({
  db: 'tasks.db'
});

// Create
const task = await tasks.create({
  title: 'Learn SMRT Framework',
  description: 'Read the getting started guide',
  dueDate: '2025-01-20'
});
await task.save();

// Query
const allTasks = await tasks.list();
const todoTasks = await tasks.findByStatus('todo');
const overdue = await tasks.findOverdue();

// Update
task.status = 'in_progress';
await task.save();

// Custom method
task.complete();
await task.save();

// Delete
await task.delete();`}
			language="typescript"
		/>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Auto-Generated Features</h2>

		<p class="mb-4">
			With the <code class="bg-gray-100 px-2 py-1 rounded">@smrt</code> decorator, you automatically get:
		</p>

		<h3 class="text-2xl font-semibold mb-3">REST API Endpoints</h3>
		<CodeBlock
			code={`GET    /api/tasks          # List tasks
GET    /api/tasks/:id      # Get task by ID
POST   /api/tasks          # Create task
PATCH  /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task`}
			language="http"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">CLI Commands</h3>
		<CodeBlock
			code={`smrt tasks list
smrt tasks get <id>
smrt tasks create --title "My Task"
smrt tasks update <id> --status done
smrt tasks delete <id>`}
			language="bash"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">MCP Tools (Claude Integration)</h3>
		<p class="mb-2">Claude Code can now interact with your tasks using natural language.</p>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Configuration</h2>

		<p class="mb-4">
			Create <code class="bg-gray-100 px-2 py-1 rounded">smrt.config.ts</code> in your project root:
		</p>
		<CodeBlock
			code={`import { defineConfig } from '@happyvertical/smrt-config';

export default defineConfig({
  smrt: {
    logLevel: 'info',
    environment: 'development',
    embeddings: { provider: 'local' }
  },
  modules: {
    // Module-scoped configs keyed by module name
    'my-agent': {
      cronSchedule: '0 2 * * *',
      maxRetries: 3
    }
  },
  packages: {
    // Package-scoped configs keyed by package name
    ai: { defaultModel: 'gpt-4o' }
  }
});`}
			language="typescript"
		/>

		<div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4 mb-4">
			<p class="font-semibold mb-2">Note:</p>
			<p>
				The config top-level keys are <code class="bg-gray-100 px-2 py-1 rounded">smrt</code> (global options),
				<code class="bg-gray-100 px-2 py-1 rounded">modules</code> (module-scoped config),
				<code class="bg-gray-100 px-2 py-1 rounded">packages</code> (package-scoped config),
				<code class="bg-gray-100 px-2 py-1 rounded">site</code> (site templates), and
				<code class="bg-gray-100 px-2 py-1 rounded">export</code> (SSG export).
				Use <code class="bg-gray-100 px-2 py-1 rounded">getModuleConfig()</code> and
				<code class="bg-gray-100 px-2 py-1 rounded">getPackageConfig()</code> to retrieve them at runtime.
			</p>
		</div>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Next Steps</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<a href="/docs/objects" class="block p-6 border rounded hover:border-blue-500 transition">
				<h3 class="text-xl font-semibold mb-2">Learn About Objects</h3>
				<p class="text-sm text-gray-600">
					Deep dive into SmrtObject, fields, relationships, and computed properties
				</p>
			</a>

			<a href="/docs/collections" class="block p-6 border rounded hover:border-blue-500 transition">
				<h3 class="text-xl font-semibold mb-2">Learn About Collections</h3>
				<p class="text-sm text-gray-600">Querying, filtering, pagination, and bulk operations</p>
			</a>

			<a href="/docs/agents" class="block p-6 border rounded hover:border-blue-500 transition">
				<h3 class="text-xl font-semibold mb-2">Learn About Agents</h3>
				<p class="text-sm text-gray-600">
					Build autonomous agents with persistent state and AI integration
				</p>
			</a>

			<a href="/modules" class="block p-6 border rounded hover:border-blue-500 transition">
				<h3 class="text-xl font-semibold mb-2">Explore Modules</h3>
				<p class="text-sm text-gray-600">
					Discover 38 production-ready modules for common use cases
				</p>
			</a>
		</div>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Common Patterns</h2>

		<h3 class="text-2xl font-semibold mb-3">Relationships</h3>
		<CodeBlock
			code={`import { SmrtObject, smrt, foreignKey, manyToMany } from '@happyvertical/smrt-core';

@smrt()
class Project extends SmrtObject {
  name: string = '';

  @foreignKey(User)
  ownerId: string = '';

  @manyToMany(Tag, { through: 'project_tags' })
  tags: Tag[] = [];
}`}
			language="typescript"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">Computed Properties</h3>
		<CodeBlock
			code={`@smrt()
class Order extends SmrtObject {
  subtotal: number = 0.0;
  taxRate: number = 0.08;

  get total(): number {
    return this.subtotal * (1 + this.taxRate);
  }
}`}
			language="typescript"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">AI-Powered Methods</h3>
		<CodeBlock
			code={`// is() — evaluate criteria against the object, returns boolean
const isValid = await product.is(\`
  - Has a non-empty description
  - Price is greater than $10
  - Name does not contain profanity
\`);

// do() — perform an action based on instructions, returns string
const summary = await product.do(\`
  Write a 50-word marketing description.
  Highlight key features and target audience.
\`);`}
			language="typescript"
		/>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Need Help?</h2>
		<ul class="space-y-2">
			<li>
				<a href="/faq" class="text-blue-600 hover:underline"> Check the FAQ </a>
			</li>
			<li>
				<a
					href="https://github.com/happyvertical/smrt/issues"
					class="text-blue-600 hover:underline"
					target="_blank"
					rel="noopener"
				>
					Report an issue on GitHub
				</a>
			</li>
			<li>
				<a href="/modules/smrt-core" class="text-blue-600 hover:underline">
					Read the smrt-core documentation
				</a>
			</li>
		</ul>
	</section>
</div>
