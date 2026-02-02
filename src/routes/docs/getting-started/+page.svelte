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

		<h3 class="text-2xl font-semibold mb-3">Option 1: Create New Project (Recommended)</h3>
		<CodeBlock
			code={`npm create smrt-app@latest my-app
cd my-app
npm install
npm run dev`}
			language="bash"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">Option 2: Add to Existing Project</h3>
		<CodeBlock
			code={`npm install @happyvertical/smrt-core @happyvertical/smrt-types`}
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
			code={`import { SmrtObject, field, smrt } from '@happyvertical/smrt-core';

@smrt({
  api: true,    // Generate REST API
  cli: true,    // Generate CLI commands
  mcp: true     // Generate MCP tools
})
export class Task extends SmrtObject {
  @field({ required: true })
  title: string = '';

  @field()
  description: string = '';

  @field({ default: 'todo' })
  status: 'todo' | 'in_progress' | 'done' = 'todo';

  @field()
  dueDate?: Date;

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
  static itemClass = Task;

  // Custom query methods
  async findByStatus(status: string) {
    return this.list({ where: { status } });
  }

  async findOverdue() {
    return this.list({
      where: {
        status: { $ne: 'done' },
        dueDate: { $lt: new Date() }
      }
    });
  }
}`}
			language="typescript"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">Step 3: Use Your Object</h3>
		<CodeBlock
			code={`import { TaskCollection } from './models/TaskCollection.js';

// Initialize
const tasks = await TaskCollection.create({
  db: { /* database config */ }
});

// Create
const task = await tasks.create({
  title: 'Learn SMRT Framework',
  description: 'Read the getting started guide',
  dueDate: new Date('2025-01-20')
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
  database: {
    type: 'postgresql',
    host: process.env.DB_HOST,
    port: 5432,
    database: 'myapp',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  api: {
    enabled: true,
    port: 3000,
    prefix: '/api'
  },
  cli: {
    enabled: true
  },
  mcp: {
    enabled: true,
    port: 3100
  }
});`}
			language="typescript"
		/>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Next Steps</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<a href="/docs/objects" class="block p-6 border rounded hover:border-blue-500 transition">
				<h3 class="text-xl font-semibold mb-2">→ Learn About Objects</h3>
				<p class="text-sm text-gray-600">
					Deep dive into SmrtObject, fields, relationships, and computed properties
				</p>
			</a>

			<a href="/docs/collections" class="block p-6 border rounded hover:border-blue-500 transition">
				<h3 class="text-xl font-semibold mb-2">→ Learn About Collections</h3>
				<p class="text-sm text-gray-600">Querying, filtering, pagination, and bulk operations</p>
			</a>

			<a href="/docs/agents" class="block p-6 border rounded hover:border-blue-500 transition">
				<h3 class="text-xl font-semibold mb-2">→ Learn About Agents</h3>
				<p class="text-sm text-gray-600">
					Build autonomous agents with persistent state and AI integration
				</p>
			</a>

			<a href="/modules" class="block p-6 border rounded hover:border-blue-500 transition">
				<h3 class="text-xl font-semibold mb-2">→ Explore Modules</h3>
				<p class="text-sm text-gray-600">
					Discover 29 production-ready modules for common use cases
				</p>
			</a>
		</div>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Common Patterns</h2>

		<h3 class="text-2xl font-semibold mb-3">Relationships</h3>
		<CodeBlock
			code={`import { foreignKey, manyToMany } from '@happyvertical/smrt-core';

@smrt()
class Project extends SmrtObject {
  @field({ required: true })
  name: string = '';

  @foreignKey(() => User)
  ownerId: string = '';

  @manyToMany(() => Tag, { through: 'project_tags' })
  tags: Tag[] = [];
}`}
			language="typescript"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">Computed Properties</h3>
		<CodeBlock
			code={`@smrt()
class Order extends SmrtObject {
  @field()
  subtotal: number = 0;

  @field()
  taxRate: number = 0.08;

  get total(): number {
    return this.subtotal * (1 + this.taxRate);
  }
}`}
			language="typescript"
		/>

		<h3 class="text-2xl font-semibold mb-3 mt-6">AI-Powered Methods</h3>
		<CodeBlock
			code={`@smrt()
class Document extends SmrtObject {
  @field()
  content: string = '';

  // AI automatically generates these methods
  async summarize(): Promise<string> {
    // AI-powered summarization
  }

  async extractKeywords(): Promise<string[]> {
    // AI-powered keyword extraction
  }
}`}
			language="typescript"
		/>
	</section>

	<section class="mb-12">
		<h2 class="text-3xl font-bold mb-4">Need Help?</h2>
		<ul class="space-y-2">
			<li>
				<a href="/faq" class="text-blue-600 hover:underline"> → Check the FAQ </a>
			</li>
			<li>
				<a
					href="https://github.com/happyvertical/smrt/issues"
					class="text-blue-600 hover:underline"
					target="_blank"
					rel="noopener"
				>
					→ Report an issue on GitHub
				</a>
			</li>
			<li>
				<a href="/modules/smrt-core" class="text-blue-600 hover:underline">
					→ Read the smrt-core documentation
				</a>
			</li>
		</ul>
	</section>
</div>
