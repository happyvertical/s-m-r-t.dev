<script lang="ts">
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<svelte:head>
  <title>FAQ - SMRT Framework</title>
  <meta name="description" content="Frequently asked questions about the SMRT framework, troubleshooting, and best practices." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
  <p class="text-xl text-gray-600 mb-8">
    Common questions about the SMRT framework, setup, troubleshooting, and best practices.
  </p>

  <div class="space-y-8">
    <!-- Getting Started -->
    <section>
      <h2 class="text-3xl font-bold mb-4">Getting Started</h2>

      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-2">What is SMRT?</h3>
          <p class="text-gray-700">
            SMRT is a full-stack TypeScript framework that abstracts away implementation details for databases,
            REST APIs, MCP tools, and CLI commands. Define your data models once with the @smrt decorator, and
            get auto-generated APIs, CLI commands, and Claude integration.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">Which databases does SMRT support?</h3>
          <p class="text-gray-700 mb-2">
            SMRT supports multiple databases through adapters:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>PostgreSQL (recommended for production)</li>
            <li>SQLite (great for development and testing)</li>
            <li>MySQL/MariaDB</li>
            <li>JSON files (for static sites)</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">Do I need to know SQL?</h3>
          <p class="text-gray-700">
            No! SMRT abstracts database operations into TypeScript methods. However, understanding basic
            database concepts (tables, relationships, indexes) is helpful for building efficient applications.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">Can I use SMRT with an existing database?</h3>
          <p class="text-gray-700">
            Yes! SMRT can work with existing databases. Use the scanner to generate SmrtObject classes from
            your existing schema, or manually define models that map to your tables.
          </p>
        </div>
      </div>
    </section>

    <!-- Configuration & Setup -->
    <section>
      <h2 class="text-3xl font-bold mb-4">Configuration & Setup</h2>

      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-2">How do I configure database connections?</h3>
          <p class="text-gray-700 mb-2">
            Create a <code class="bg-gray-100 px-2 py-1 rounded">smrt.config.ts</code> file:
          </p>
          <CodeBlock
            code={`export default {
  database: {
    type: 'postgresql',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    database: 'myapp',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};`}
            language="typescript"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">How do I enable API generation?</h3>
          <p class="text-gray-700 mb-2">
            Add <code class="bg-gray-100 px-2 py-1 rounded">api: true</code> to your @smrt decorator:
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

        <div>
          <h3 class="text-xl font-semibold mb-2">How do I set up multi-tenancy?</h3>
          <p class="text-gray-700">
            Use the <a href="/modules/smrt-tenancy" class="text-blue-600 hover:underline">smrt-tenancy</a> module
            with the @TenantScoped decorator. All queries will automatically filter by the current tenant context.
          </p>
        </div>
      </div>
    </section>

    <!-- Development -->
    <section>
      <h2 class="text-3xl font-bold mb-4">Development</h2>

      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-2">How do I run migrations?</h3>
          <p class="text-gray-700">
            SMRT can auto-generate migrations from your models. Use the CLI:
          </p>
          <CodeBlock code={`smrt migrations generate\nsmrt migrations run`} language="bash" />
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">How do I test SMRT applications?</h3>
          <p class="text-gray-700 mb-2">
            Use <a href="/modules/smrt-vitest" class="text-blue-600 hover:underline">smrt-vitest</a> for testing:
          </p>
          <CodeBlock
            code={`import { createTestDb, createFixture } from '@happyvertical/smrt-vitest';

describe('Task Tests', () => {
  it('should create task', async () => {
    const db = await createTestDb();
    const tasks = await TaskCollection.create({ db });

    const task = await createFixture(tasks, 'Task', {
      title: 'Test Task'
    });

    expect(task.title).toBe('Test Task');
  });
});`}
            language="typescript"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">Can I use SMRT with SvelteKit?</h3>
          <p class="text-gray-700">
            Yes! SMRT works great with SvelteKit. Use the <a href="/modules/template-sveltekit" class="text-blue-600 hover:underline">template-sveltekit</a> template
            to get started with a pre-configured setup.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">How do I integrate Claude AI?</h3>
          <p class="text-gray-700">
            SMRT includes built-in MCP (Model Context Protocol) support. Enable it with <code class="bg-gray-100 px-2 py-1 rounded">mcp: true</code>
            in your @smrt decorator, then start the MCP server with <code class="bg-gray-100 px-2 py-1 rounded">smrt-dev-mcp start</code>.
            Claude Code can then interact with your objects using natural language.
          </p>
        </div>
      </div>
    </section>

    <!-- Data Modeling -->
    <section>
      <h2 class="text-3xl font-bold mb-4">Data Modeling</h2>

      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-2">How do I define relationships between models?</h3>
          <p class="text-gray-700 mb-2">
            Use <code class="bg-gray-100 px-2 py-1 rounded">@foreignKey</code> and <code class="bg-gray-100 px-2 py-1 rounded">@manyToMany</code> decorators:
          </p>
          <CodeBlock
            code={`@smrt()
class Order extends SmrtObject {
  @foreignKey(() => User)
  userId: string = '';

  @manyToMany(() => Product, { through: 'order_products' })
  products: Product[] = [];
}`}
            language="typescript"
          />
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">What's the difference between CTI and STI?</h3>
          <p class="text-gray-700">
            <strong>CTI (Class Table Inheritance):</strong> Each class gets its own table. More normalized but requires joins.<br/>
            <strong>STI (Single Table Inheritance):</strong> All subclasses share one table with a discriminator field. Faster queries but denormalized.
            <br/><br/>
            Use CTI when subclasses have many unique fields. Use STI when they're similar.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">How do I add computed properties?</h3>
          <p class="text-gray-700 mb-2">
            Use TypeScript getters:
          </p>
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
        </div>
      </div>
    </section>

    <!-- Performance -->
    <section>
      <h2 class="text-3xl font-bold mb-4">Performance</h2>

      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-2">How do I optimize queries?</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Use <code class="bg-gray-100 px-2 py-1 rounded">select</code> to fetch only needed fields</li>
            <li>Add indexes with <code class="bg-gray-100 px-2 py-1 rounded">@field({'{'}index: true{'}'})</code></li>
            <li>Use pagination with <code class="bg-gray-100 px-2 py-1 rounded">limit</code> and <code class="bg-gray-100 px-2 py-1 rounded">offset</code></li>
            <li>Eager load relationships to avoid N+1 queries</li>
            <li>Use connection pooling in production</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">Should I use caching?</h3>
          <p class="text-gray-700">
            Yes! For frequently accessed data, implement caching at the collection level or use a dedicated
            caching layer (Redis, Memcached). SMRT collections support custom caching strategies.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">How do I handle large datasets?</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>Always use pagination for lists</li>
            <li>Implement cursor-based pagination for large tables</li>
            <li>Use background jobs for batch operations</li>
            <li>Consider data archiving strategies</li>
            <li>Optimize indexes for common queries</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Troubleshooting -->
    <section>
      <h2 class="text-3xl font-bold mb-4">Troubleshooting</h2>

      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-2">Build fails with "Cannot find module"</h3>
          <p class="text-gray-700">
            Ensure all SMRT packages are installed and have matching versions. Run <code class="bg-gray-100 px-2 py-1 rounded">npm install</code>
            and check for peer dependency warnings.
          </p>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">Database connection fails</h3>
          <p class="text-gray-700">
            Check:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>Database server is running</li>
            <li>Connection credentials are correct</li>
            <li>Firewall allows connections</li>
            <li>Database exists and user has permissions</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">API endpoints return 404</h3>
          <p class="text-gray-700">
            Verify:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li><code class="bg-gray-100 px-2 py-1 rounded">api: true</code> is set in @smrt decorator</li>
            <li>API server is running</li>
            <li>Manifest was generated (run build)</li>
            <li>Correct port and prefix in config</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">TypeScript errors with decorators</h3>
          <p class="text-gray-700">
            Enable experimental decorators in <code class="bg-gray-100 px-2 py-1 rounded">tsconfig.json</code>:
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
      </div>
    </section>

    <!-- Deployment -->
    <section>
      <h2 class="text-3xl font-bold mb-4">Deployment</h2>

      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-semibold mb-2">How do I deploy SMRT applications?</h3>
          <p class="text-gray-700">
            SMRT applications can be deployed anywhere Node.js runs:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>Docker containers (recommended)</li>
            <li>Kubernetes</li>
            <li>Traditional VPS (DigitalOcean, Linode)</li>
            <li>Serverless platforms (with limitations)</li>
            <li>Static hosts for adapter-static builds</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">What environment variables do I need?</h3>
          <p class="text-gray-700">
            At minimum:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li><code class="bg-gray-100 px-2 py-1 rounded">DB_HOST</code>, <code class="bg-gray-100 px-2 py-1 rounded">DB_USER</code>, <code class="bg-gray-100 px-2 py-1 rounded">DB_PASSWORD</code></li>
            <li><code class="bg-gray-100 px-2 py-1 rounded">NODE_ENV</code> (production, development)</li>
            <li><code class="bg-gray-100 px-2 py-1 rounded">PORT</code> for the API server</li>
            <li>Any API keys for third-party services</li>
          </ul>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-2">Should I run migrations in production?</h3>
          <p class="text-gray-700">
            Yes, but with caution:
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>Test migrations in staging first</li>
            <li>Run during maintenance windows for large changes</li>
            <li>Keep backups before schema changes</li>
            <li>Use migration tools for rollback capability</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- More Help -->
    <section>
      <h2 class="text-3xl font-bold mb-4">Still Need Help?</h2>
      <ul class="space-y-2">
        <li>
          <a href="/docs/getting-started" class="text-blue-600 hover:underline">
            → Read the Getting Started guide
          </a>
        </li>
        <li>
          <a href="/modules" class="text-blue-600 hover:underline">
            → Browse module documentation
          </a>
        </li>
        <li>
          <a href="https://github.com/happyvertical/smrt/issues" class="text-blue-600 hover:underline" target="_blank" rel="noopener">
            → Report an issue on GitHub
          </a>
        </li>
        <li>
          <a href="https://github.com/happyvertical/smrt/discussions" class="text-blue-600 hover:underline" target="_blank" rel="noopener">
            → Ask a question in Discussions
          </a>
        </li>
      </ul>
    </section>
  </div>
</div>
