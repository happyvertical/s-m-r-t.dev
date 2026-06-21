<script lang="ts">
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
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
			<li>Node.js 24+ (the framework's <code>engines</code> require <code>node &gt;=24</code>)</li>
			<li>pnpm 9+ (npm also works)</li>
			<li>Basic TypeScript knowledge</li>
		</ul>
	</section>

	<section>
		<h2>Installation</h2>

		<h3>Option 1: Clone the SaaS starter (recommended)</h3>
		<p>
			The fastest way to see the whole framework in one place is the
			<a href="https://github.com/happyvertical/smrt-saas-starter" target="_blank" rel="noopener"
				>smrt-saas-starter</a
			>
			— a reference SvelteKit app wired up with the SMRT packages, auth, and admin UI. Clone it and run
			the dev server:
		</p>
		<CodeBlock
			code={`git clone https://github.com/happyvertical/smrt-saas-starter.git
cd smrt-saas-starter
pnpm install
pnpm dev`}
			language="bash"
		/>

		<h3>Option 2: Add SMRT to an existing SvelteKit project</h3>
		<p>
			Run <code>smrt init</code> inside an existing SvelteKit project to scaffold a
			<code>smrt.config.ts</code> and the wiring SMRT needs:
		</p>
		<CodeBlock code={`npx smrt init`} language="bash" />

		<h3>Option 3: Install packages by hand</h3>
		<p>Start from just the core package, then add what you need:</p>
		<CodeBlock code={`pnpm add @happyvertical/smrt-core`} language="bash" />
		<p>
			Most projects also pull in the shared types and the config loader, plus any domain packages
			for the problem you're solving (for example agents and background jobs):
		</p>
		<CodeBlock
			code={`pnpm add @happyvertical/smrt-types @happyvertical/smrt-config
pnpm add @happyvertical/smrt-agents @happyvertical/smrt-jobs`}
			language="bash"
		/>

		<Callout variant="note" title="Browse every package">
			See <a href="/modules">Modules</a> for the full catalog of <code>@happyvertical/smrt-*</code>
			packages organized by purpose.
		</Callout>
	</section>

	<section>
		<h2>Your First SmrtObject</h2>

		<h3>Step 1: Define Your Model</h3>
		<p>
			Create a file <code>src/models/Task.ts</code>:
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
  static readonly _itemClass = Task;

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

		<h3>Step 3: Use Your Object</h3>
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
				The config top-level keys are <code class="bg-gray-100 px-2 py-1 rounded">smrt</code>
				(global options),
				<code class="bg-gray-100 px-2 py-1 rounded">modules</code> (module-scoped config),
				<code class="bg-gray-100 px-2 py-1 rounded">packages</code> (package-scoped config),
				<code class="bg-gray-100 px-2 py-1 rounded">site</code> (site templates), and
				<code class="bg-gray-100 px-2 py-1 rounded">export</code> (SSG export). Use
				<code class="bg-gray-100 px-2 py-1 rounded">getModuleConfig()</code>
				and
				<code class="bg-gray-100 px-2 py-1 rounded">getPackageConfig()</code> to retrieve them at runtime.
			</p>
		</div>
	</section>

	<section>
		<h2>Common Patterns</h2>

		<h3>Relationships</h3>
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

		<h3>Computed Properties</h3>
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
		<h3>AI-Powered Methods</h3>
		<p>
			Every <code>SmrtObject</code> exposes three AI methods: <code>is()</code> (boolean check),
			<code>do()</code> (freeform action), and <code>describe()</code> (generate a description).
		</p>
		<CodeBlock
			code={`// is() — evaluate criteria, returns boolean
const isValid = await product.is(\`
  - Has a non-empty description
  - Price is greater than $10
  - Name does not contain profanity
\`);

// do() — perform an action based on instructions, returns string
const summary = await product.do(\`
  Write a 50-word marketing description.
  Highlight key features and target audience.
\`);

// describe() — generate a concise description, returns string
const blurb = await product.describe();`}
			language="typescript"
		/>
		<Callout variant="warning" title="What gets sent to the model">
			<code>is()</code>, <code>do()</code>, and <code>describe()</code> send only your
			criteria/instruction string to the model — the object's own field data is
			<strong>not</strong> serialized and sent. Pass any object values you want the model to reason about
			directly inside the instruction text.
		</Callout>
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
