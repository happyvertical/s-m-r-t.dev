<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
	<title>FAQ - s-m-r-t Framework</title>
	<meta
		name="description"
		content="Frequently asked questions about the s-m-r-t framework, troubleshooting, and best practices."
	/>
</svelte:head>

<Grid>
	<div class="page-header">
		<nav class="breadcrumb">
			<span>FAQ</span>
		</nav>
		<h1>Frequently Asked Questions</h1>
		<p class="lead">
			Common questions about the s-m-r-t framework, setup, troubleshooting, and best practices.
		</p>
	</div>

	<!-- Getting Started -->
	<section>
		<h2>Getting Started</h2>

		<div class="faq-item">
			<h3>What does s-m-r-t stand for?</h3>
			<p>
				<a
					href="https://www.youtube.com/watch?v=ls5BFzuxGw4"
					target="_blank"
					rel="noopener noreferrer">https://www.youtube.com/watch?v=ls5BFzuxGw4</a
				>
			</p>
		</div>

		<div class="faq-item">
			<h3>What is s-m-r-t?</h3>
			<p>
				s-m-r-t is a full-stack TypeScript framework that abstracts away implementation details for
				databases, REST APIs, MCP tools, and CLI commands. Define your data models once with the
				@smrt decorator, and get auto-generated APIs, CLI commands, and Claude integration.
			</p>
		</div>

		<div class="faq-item">
			<h3>Which databases does s-m-r-t support?</h3>
			<p>s-m-r-t supports multiple databases through adapters:</p>
			<ul>
				<li>SQLite (great for development and testing)</li>
				<li>PostgreSQL (recommended for production)</li>
				<li>DuckDB (analytical workloads)</li>
			</ul>
		</div>

		<div class="faq-item">
			<h3>Do I need to know SQL?</h3>
			<p>
				No! s-m-r-t abstracts database operations into TypeScript methods. However, understanding
				basic database concepts (tables, relationships, indexes) is helpful for building efficient
				applications.
			</p>
		</div>

		<div class="faq-item">
			<h3>Can I use s-m-r-t with an existing database?</h3>
			<p>
				Yes! s-m-r-t can work with existing databases. Use the scanner to generate SmrtObject
				classes from your existing schema, or manually define models that map to your tables.
			</p>
		</div>
	</section>

	<!-- Configuration & Setup -->
	<section>
		<h2>Configuration & Setup</h2>

		<div class="faq-item">
			<h3>How do I configure database connections?</h3>
			<p>
				Create a <code>smrt.config.ts</code> file with a <code>url</code> connection string:
			</p>
			<CodeBlock
				code={`export default {
  database: {
    adapter: 'postgres',
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/myapp'
  }
};

// For SQLite:
// database: { adapter: 'sqlite', url: 'myapp.db' }`}
				language="typescript"
			/>
		</div>

		<div class="faq-item">
			<h3>How do I enable API generation?</h3>
			<p>
				Add <code>api: true</code> to your @smrt decorator:
			</p>
			<CodeBlock
				code={`@smrt({
  api: true,  // Generates all CRUD endpoints
  // OR specify operations:
  api: {
    include: ['list', 'get', 'create']
  }
})
class Product extends SmrtObject {
  // ...
}`}
				language="typescript"
			/>
		</div>

		<div class="faq-item">
			<h3>How do I set up multi-tenancy?</h3>
			<p>
				Use the <a href="/modules/smrt-tenancy">smrt-tenancy</a> module with the @TenantScoped decorator.
				All queries will automatically filter by the current tenant context.
			</p>
		</div>
	</section>

	<!-- Development -->
	<section>
		<h2>Development</h2>

		<div class="faq-item">
			<h3>How do I run migrations?</h3>
			<p>s-m-r-t can auto-generate migrations from your models. Use the CLI:</p>
			<CodeBlock
				code={`smrt db:diff --generate
smrt db:migrate`}
				language="bash"
			/>
		</div>

		<div class="faq-item">
			<h3>How do I test s-m-r-t applications?</h3>
			<p>
				Use <a href="/modules/smrt-vitest">smrt-vitest</a> for testing with <code>smrtVitestPlugin()</code> in your vitest config and <code>createIsolatedTestDb()</code> for DB isolation:
			</p>
			<CodeBlock
				code={`import { createIsolatedTestDb } from '@happyvertical/smrt-vitest';

describe('Task Tests', () => {
  it('should create task', async () => {
    const db = await createIsolatedTestDb();
    const tasks = await TaskCollection.create({ db });

    const task = await tasks.create({
      title: 'Test Task'
    });

    expect(task.title).toBe('Test Task');
  });
});`}
				language="typescript"
			/>
		</div>

		<div class="faq-item">
			<h3>Can I use s-m-r-t with SvelteKit?</h3>
			<p>
				Yes! s-m-r-t works great with SvelteKit. Use the <a href="/modules/template-sveltekit"
					>template-sveltekit</a
				> template to get started with a pre-configured setup.
			</p>
		</div>

		<div class="faq-item">
			<h3>How do I integrate Claude AI?</h3>
			<p>
				s-m-r-t includes built-in MCP (Model Context Protocol) support. Enable it with <code
					>mcp: true</code
				>
				in your @smrt decorator, then start the MCP server with <code>smrt-dev-mcp start</code>.
				Claude Code can then interact with your objects using natural language.
			</p>
		</div>
	</section>

	<!-- Data Modeling -->
	<section>
		<h2>Data Modeling</h2>

		<div class="faq-item">
			<h3>How do I define relationships between models?</h3>
			<p>
				Use <code>foreignKey()</code> for same-package references and plain string IDs for cross-package references:
			</p>
			<CodeBlock
				code={`@smrt()
class Order extends SmrtObject {
  // Same-package: use foreignKey() helper
  customerId = foreignKey(Customer);

  // Cross-package: plain string ID (avoids circular deps)
  tenantId: string = '';
}`}
				language="typescript"
			/>
		</div>

		<div class="faq-item">
			<h3>What's the difference between CTI and STI?</h3>
			<p>
				<strong>CTI (Class Table Inheritance):</strong> Each class gets its own table. More
				normalized but requires joins.<br />
				<strong>STI (Single Table Inheritance):</strong> All subclasses share one table with a discriminator
				field. Faster queries but denormalized.
			</p>
			<p>Use CTI when subclasses have many unique fields. Use STI when they're similar.</p>
		</div>

		<div class="faq-item">
			<h3>How do I add computed properties?</h3>
			<p>Use TypeScript getters with <code>@field({'{'} transient: true {'}'})</code> for non-persisted properties:</p>
			<CodeBlock
				code={`@smrt()
class Order extends SmrtObject {
  subtotal: number = 0.0;    // DECIMAL
  taxRate: number = 0.0;     // DECIMAL

  @field({ transient: true })
  get total(): number {
    return this.subtotal * (1 + this.taxRate);
  }
}`}
				language="typescript"
			/>
		</div>
	</section>

	<!-- Performance -->
	<section>
		<h2>Performance</h2>

		<div class="faq-item">
			<h3>How do I optimize queries?</h3>
			<ul>
				<li>Use <code>limit</code> and <code>offset</code> for pagination</li>
				<li>Use <code>orderBy</code> for sorted results</li>
				<li>Set <code>conflictColumns</code> in @smrt() for efficient upsert operations</li>
				<li>Use <code>listByIds()</code> for batch fetching (single query)</li>
				<li>Use <code>getOrUpsert()</code> for find-or-create patterns</li>
			</ul>
		</div>

		<div class="faq-item">
			<h3>Should I use caching?</h3>
			<p>
				Yes! For frequently accessed data, implement caching at the collection level or use a
				dedicated caching layer (Redis, Memcached). s-m-r-t collections support custom caching
				strategies.
			</p>
		</div>

		<div class="faq-item">
			<h3>How do I handle large datasets?</h3>
			<ul>
				<li>Always use pagination for lists</li>
				<li>Implement cursor-based pagination for large tables</li>
				<li>Use background jobs for batch operations</li>
				<li>Consider data archiving strategies</li>
				<li>Optimize indexes for common queries</li>
			</ul>
		</div>
	</section>

	<!-- Troubleshooting -->
	<section>
		<h2>Troubleshooting</h2>

		<div class="faq-item">
			<h3>Build fails with "Cannot find module"</h3>
			<p>
				Ensure all s-m-r-t packages are installed and have matching versions. Run <code
					>npm install</code
				>
				and check for peer dependency warnings.
			</p>
		</div>

		<div class="faq-item">
			<h3>Database connection fails</h3>
			<p>Check:</p>
			<ul>
				<li>Database server is running</li>
				<li>Connection credentials are correct</li>
				<li>Firewall allows connections</li>
				<li>Database exists and user has permissions</li>
			</ul>
		</div>

		<div class="faq-item">
			<h3>API endpoints return 404</h3>
			<p>Verify:</p>
			<ul>
				<li><code>api: true</code> is set in @smrt decorator</li>
				<li>API server is running</li>
				<li>Manifest was generated (run build)</li>
				<li>Correct port and prefix in config</li>
			</ul>
		</div>

		<div class="faq-item">
			<h3>TypeScript errors with decorators</h3>
			<p>
				Enable experimental decorators in <code>tsconfig.json</code>:
			</p>
			<CodeBlock
				code={`{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}`}
				language="json"
			/>
		</div>
	</section>

	<!-- Deployment -->
	<section>
		<h2>Deployment</h2>

		<div class="faq-item">
			<h3>How do I deploy s-m-r-t applications?</h3>
			<p>s-m-r-t applications can be deployed anywhere Node.js runs:</p>
			<ul>
				<li>Docker containers (recommended)</li>
				<li>Kubernetes</li>
				<li>Traditional VPS (DigitalOcean, Linode)</li>
				<li>Serverless platforms (with limitations)</li>
				<li>Static hosts for adapter-static builds</li>
			</ul>
		</div>

		<div class="faq-item">
			<h3>What environment variables do I need?</h3>
			<p>At minimum:</p>
			<ul>
				<li><code>DATABASE_URL</code> (connection string for PostgreSQL or path for SQLite)</li>
				<li><code>NODE_ENV</code> (production, development)</li>
				<li><code>PORT</code> for the API server</li>
				<li>Any API keys for third-party services</li>
			</ul>
		</div>

		<div class="faq-item">
			<h3>Should I run migrations in production?</h3>
			<p>Yes, but with caution:</p>
			<ul>
				<li>Test migrations in staging first</li>
				<li>Run during maintenance windows for large changes</li>
				<li>Keep backups before schema changes</li>
				<li>Use migration tools for rollback capability</li>
			</ul>
		</div>
	</section>

	<!-- More Help -->
	<section class="last">
		<h2>Still Need Help?</h2>
		<ul class="help-links">
			<li>
				<a href="/docs/getting-started">→ Read the Getting Started guide</a>
			</li>
			<li>
				<a href="/modules">→ Browse module documentation</a>
			</li>
			<li>
				<a href="https://github.com/happyvertical/smrt/issues" target="_blank" rel="noopener"
					>→ Report an issue on GitHub</a
				>
			</li>
			<li>
				<a href="https://github.com/happyvertical/smrt/discussions" target="_blank" rel="noopener"
					>→ Ask a question in Discussions</a
				>
			</li>
		</ul>
	</section>
</Grid>

<style>
	.page-header {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	.breadcrumb {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
		color: var(--smrt-color-on-surface-variant, #666);
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.lead {
		font-size: 1.125rem;
		color: var(--smrt-color-on-surface-variant, #666);
		margin-bottom: 16px;
		line-height: 1.6;
	}

	section {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	section.last {
		border-bottom: none;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 24px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.faq-item {
		margin-bottom: 32px;
	}

	.faq-item:last-child {
		margin-bottom: 0;
	}

	h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 12px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	p {
		margin-bottom: 12px;
		line-height: 1.7;
		color: var(--smrt-color-on-surface, #333);
	}

	ul {
		margin-bottom: 16px;
		padding-left: 24px;
	}

	li {
		margin-bottom: 8px;
		line-height: 1.6;
		color: var(--smrt-color-on-surface, #333);
	}

	code {
		background: var(--smrt-color-surface-container, #f5f5f5);
		padding: 2px 6px;
		border-radius: var(--smrt-radius-sm, 4px);
		font-family: var(--smrt-font-family-mono, ui-monospace, monospace);
		font-size: 0.9em;
		color: var(--smrt-color-on-surface, #333);
	}

	a {
		color: var(--smrt-color-primary, #1976d2);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.help-links {
		list-style: none;
		padding: 0;
	}

	.help-links li {
		margin-bottom: 12px;
	}

	.help-links a {
		font-weight: 500;
	}
</style>
