<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>Getting Started | s-m-r-t</title>
	<meta
		name="description"
		content="Install SMRT and create your first SmrtObject with auto-generated APIs, CLI commands, and MCP tools."
	/>
</svelte:head>

<article class="prose">
	<h1>Getting Started</h1>

	<section>
		<h2>What is SMRT?</h2>
		<p>
			SMRT is a full-stack TypeScript framework that generates database schemas, REST APIs, MCP
			tools, and CLI commands from simple object definitions. Define your data models once with the
			<code>@smrt</code> decorator, and the framework handles the rest.
		</p>
	</section>

	<section>
		<h2>Prerequisites</h2>
		<ul>
			<li>Node.js 20+</li>
			<li>Basic TypeScript knowledge</li>
			<li>npm or pnpm</li>
		</ul>
	</section>

	<section>
		<h2>Installation</h2>

		<h3>Option 1: Create New Project</h3>
		<CodeBlock
			code={`npm create smrt-app@latest my-app
cd my-app
npm install
npm run dev`}
			language="bash"
		/>

		<h3>Option 2: Add to Existing Project</h3>
		<CodeBlock
			code={`npm install @happyvertical/smrt-core @happyvertical/smrt-types`}
			language="bash"
		/>
	</section>

	<section>
		<h2>Your First SmrtObject</h2>

		<h3>Step 1: Define Your Model</h3>
		<p>
			Create a file <code>src/models/Task.ts</code>:
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

  complete() {
    this.status = 'done';
  }
}`}
			language="typescript"
		/>

		<h3>Step 2: Create the Collection</h3>
		<CodeBlock
			code={`import { SmrtCollection } from '@happyvertical/smrt-core';
import { Task } from './Task.js';

export class TaskCollection extends SmrtCollection<Task> {
  static itemClass = Task;

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

		<h3>Step 3: Use Your Object</h3>
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

	<section>
		<h2>Auto-Generated Interfaces</h2>

		<p>
			With the <code>@smrt</code> decorator, you get:
		</p>

		<h3>REST API Endpoints</h3>
		<CodeBlock
			code={`GET    /api/tasks          # List tasks
GET    /api/tasks/:id      # Get task by ID
POST   /api/tasks          # Create task
PATCH  /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task`}
			language="http"
		/>

		<h3>CLI Commands</h3>
		<CodeBlock
			code={`smrt tasks list
smrt tasks get <id>
smrt tasks create --title "My Task"
smrt tasks update <id> --status done
smrt tasks delete <id>`}
			language="bash"
		/>

		<h3>MCP Tools</h3>
		<p>Claude Code can interact with your objects using natural language via MCP.</p>
	</section>

	<section>
		<h2>Configuration</h2>

		<p>
			Create <code>smrt.config.ts</code> in your project root:
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

	<section>
		<h2>Common Patterns</h2>

		<h3>Relationships</h3>
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

		<h3>Computed Properties</h3>
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
	</section>

	<section>
		<h2>Next Steps</h2>
		<ul class="next-steps">
			<li>
				<a href="/docs/objects">Objects</a> — SmrtObject fields, relationships, AI methods, and lifecycle
				hooks
			</li>
			<li>
				<a href="/docs/collections">Collections</a> — Querying, filtering, pagination, and batch operations
			</li>
			<li><a href="/docs/agents">Agents</a> — Autonomous actors with persistent state</li>
			<li><a href="/modules">Modules</a> — Available packages organized by purpose</li>
		</ul>
	</section>

	<section>
		<h2>Help</h2>
		<ul>
			<li>
				<a href="/faq">FAQ</a>
			</li>
			<li>
				<a href="https://github.com/happyvertical/smrt/issues" target="_blank" rel="noopener">
					Report an issue on GitHub
				</a>
			</li>
			<li>
				<a href="/modules/smrt-core">smrt-core documentation</a>
			</li>
		</ul>
	</section>
</article>

<style>
	.prose {
		max-width: 100%;
	}

	.prose h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 24px;
	}

	section {
		margin-bottom: 48px;
	}

	.prose h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 16px;
		padding-top: 24px;
		border-top: 1px solid var(--smrt-color-outline, #e5e5e5);
	}

	section:first-of-type h2 {
		border-top: none;
		padding-top: 0;
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
		margin: 0 0 16px;
		padding-left: 24px;
	}

	.prose li {
		line-height: 1.7;
		margin-bottom: 8px;
	}

	.prose code {
		font-family: var(--smrt-font-family-mono, monospace);
		font-size: 0.9em;
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 2px 6px;
		border-radius: var(--smrt-radius-sm, 4px);
	}

	.prose a {
		color: var(--smrt-color-primary, #1976d2);
		text-decoration: none;
	}

	.prose a:hover {
		text-decoration: underline;
	}

	.next-steps {
		list-style: none;
		padding: 0;
	}

	.next-steps li {
		padding: 8px 0;
	}

	.next-steps a {
		font-weight: 600;
	}
</style>
