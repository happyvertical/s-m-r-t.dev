<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-core"
	description="ORM, code generation, AI integration, and the DispatchBus. Everything else in the SMRT framework builds on this."
	badges={['v0.24.12', 'Core Foundation', 'ESM']}
>
	<section id="overview">
		<h2>Overview</h2>
		<p>
			<code>@happyvertical/smrt-core</code> is the heart of the SMRT framework. It provides:
		</p>
		<ul>
			<li>
				<strong>SmrtObject</strong> -- base persistent object with save, delete, is(), do(), loadFromId/Slug
			</li>
			<li>
				<strong>SmrtCollection</strong> -- CRUD collection: list, get, create, delete, getOrUpsert
			</li>
			<li>
				<strong>ObjectRegistry</strong> -- global singleton on <code>globalThis</code> for class metadata,
				fields, STI chains, and manifests
			</li>
			<li>
				<strong>Code Generators</strong> -- REST APIs, MCP servers, and CLI commands generated from
				<code>@smrt()</code>
			</li>
			<li>
				<strong>DispatchBus</strong> -- inter-agent messaging with persistent subscriptions, wildcards,
				and lifecycle (<code>pending → processing → completed</code>)
			</li>
			<li><strong>Single Table Inheritance</strong> -- polymorphic object hierarchies in a single table</li>
			<li><strong>GlobalInterceptors</strong> -- plugin hooks for beforeList/Get/Save/Delete (used by smrt-tenancy)</li>
		</ul>
	</section>

	<section id="installation">
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-core`} language="bash" />

		<h3>SDK Dependencies</h3>
		<p>smrt-core builds on the HappyVertical SDK:</p>
		<CodeBlock
			code={`npm install @happyvertical/ai @happyvertical/sql @happyvertical/files @happyvertical/utils`}
			language="bash"
		/>
	</section>

	<section id="quick-start">
		<h2>Quick Start</h2>
		<p>Define a SMRT object in a few lines:</p>

		<h3>1. Define Your Object</h3>
		<CodeBlock
			code={`import { smrt, SmrtObject, SmrtCollection, foreignKey } from '@happyvertical/smrt-core';

@smrt({ api: true, cli: true, mcp: true })
class Product extends SmrtObject {
  name: string = '';
  price: number = 0.0;          // DECIMAL (has decimal point)
  quantity: number = 0;          // INTEGER (no decimal point)
  isPublished: boolean = false;
  categoryId = foreignKey(Category);
}

class ProductCollection extends SmrtCollection<Product> {
  static readonly _itemClass = Product;
}`}
			language="typescript"
		/>

		<h3>2. Initialize Collection</h3>
		<p>
			Application tables are <strong>not</strong> created at runtime -- prepare them via the
			migration tooling (<code>smrt db:migrate</code>) before the first DB op. The collection
			only verifies the table exists and fails clearly if it doesn't.
		</p>
		<CodeBlock
			code={`const products = await ProductCollection.create({
  db: 'products.db'  // SQLite database
});`}
			language="typescript"
		/>

		<h3>3. CRUD Operations</h3>
		<CodeBlock
			code={`// Create
const product = await products.create({ name: 'Widget', price: 9.99 });
await product.save();

// Query
const results = await products.list({
  where: { isPublished: true, price: { op: '>', value: 5 } },
  orderBy: 'price DESC',
  limit: 20,
});

// Read
const one = await products.get(product.id);

// Update
product.price = 24.99;
await product.save();

// Delete
await product.delete();`}
			language="typescript"
		/>

		<h3>4. AI Operations</h3>
		<CodeBlock
			code={`// Ask yes/no questions about your objects (function calling under the hood)
const isExpensive = await product.is('costs more than the average product');

// Perform AI-powered actions
const description = await product.do('Write a short marketing description');`}
			language="typescript"
		/>
	</section>

	<section id="core-classes">
		<h2>Core Classes</h2>
		<table>
			<thead>
				<tr>
					<th>Class</th>
					<th>File</th>
					<th>Purpose</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>SmrtObject</code></td>
					<td><code>src/object.ts</code></td>
					<td>Base persistent object -- save, delete, is(), do(), loadFromId/Slug</td>
				</tr>
				<tr>
					<td><code>SmrtCollection</code></td>
					<td><code>src/collection.ts</code></td>
					<td>CRUD collection -- list, get, create, delete, getOrUpsert</td>
				</tr>
				<tr>
					<td><code>ObjectRegistry</code></td>
					<td><code>src/registry.ts</code></td>
					<td>Global singleton on <code>globalThis</code> -- class metadata, fields, STI chains, manifests</td>
				</tr>
				<tr>
					<td><code>DispatchBus</code></td>
					<td><code>src/dispatch/bus.ts</code></td>
					<td>Inter-agent messaging -- emit, subscribe (persistent), process</td>
				</tr>
				<tr>
					<td><code>GlobalInterceptors</code></td>
					<td><code>src/interceptors.ts</code></td>
					<td>Plugin system -- beforeList/Get/Save/Delete hooks used by smrt-tenancy</td>
				</tr>
			</tbody>
		</table>

		<h3>SmrtObject Lifecycle</h3>
		<p>
			<code>constructor(options)</code> → <code>initialize()</code> → ready for
			<code>save()</code> / <code>delete()</code> / <code>loadFromId()</code>:
		</p>
		<ul>
			<li>
				<code>initialize()</code> loads field initializers, applies option values (options override
				initializers), and loads from the DB if <code>id</code>/<code>slug</code> is provided
			</li>
			<li>
				<code>save()</code> upserts with STI validation, interceptor execution, and auto-embeddings
			</li>
			<li>
				<code>is(criteria)</code> / <code>do(instructions)</code> -- AI operations via function calling
			</li>
			<li>
				<code>getSlug()</code> -- auto-generates from <code>name</code> → <code>title</code> →
				<code>label</code> → <code>id</code>
			</li>
			<li>
				<code>loadRelated(fieldName)</code> -- lazy-loads relationships (cached in
				<code>_loadedRelationships</code> Map)
			</li>
		</ul>
	</section>

	<section id="querying">
		<h2>SmrtCollection Query</h2>
		<CodeBlock
			code={`await collection.list({
  where: { status: 'active', price: { op: '>', value: 10 } },
  limit: 50,
  offset: 0,
  orderBy: 'created_at DESC',
});`}
			language="typescript"
		/>

		<p>
			<strong>WHERE operators</strong>: <code>=</code>, <code>&gt;</code>, <code>&lt;</code>,
			<code>&gt;=</code>, <code>&lt;=</code>, <code>!=</code>, <code>in</code>, <code>not in</code>,
			<code>like</code>, <code>is null</code>, <code>is not null</code>. Arrays auto-detect
			<code>IN</code>. Dot notation drills into JSON columns: <code>metadata.userId</code>.
		</p>

		<p>STI child collections auto-filter by <code>_meta_type</code>.</p>

		<h3>Eager Loading (Prevent N+1 Queries)</h3>
		<CodeBlock
			code={`// Load relationships efficiently with SQL JOINs
const orders = await orderCollection.list({
  limit: 100,
  include: ['customerId', 'productId']  // Pre-load relationships
});

// Access without additional queries
for (const order of orders) {
  const customer = order.getRelated('customerId');  // Already loaded!
  const product = order.getRelated('productId');
}`}
			language="typescript"
		/>

		<h3>Direct SQL Access</h3>
		<CodeBlock
			code={`// Template literal safety (SQL injection prevention)
const expensive = await collection.db.many\`
  SELECT * FROM products
  WHERE price > \${100}
  ORDER BY price DESC
\`;

const count = await collection.db.pluck\`
  SELECT COUNT(*) FROM products WHERE category = \${'electronics'}
\`;`}
			language="typescript"
		/>
	</section>

	<section id="decorator">
		<h2>The @smrt() Decorator</h2>
		<p>Key options:</p>
		<ul>
			<li><code>tableName</code> -- override the default table name</li>
			<li><code>tableStrategy</code> -- <code>'cti'</code> (default) or <code>'sti'</code></li>
			<li>
				<code>conflictColumns</code> -- natural-key tuple used by <code>upsert()</code> (required on
				junction / upsert tables)
			</li>
			<li><code>api</code> / <code>mcp</code> / <code>cli</code> -- generator config (boolean or <code>{'{'} include: [...] {'}'}</code>)</li>
			<li><code>ai</code> -- callable methods exposed during <code>do()</code></li>
			<li><code>hooks</code> -- beforeSave / afterSave / beforeDelete / afterDelete</li>
			<li><code>embeddings</code> -- auto-generate embeddings on save</li>
			<li><code>tenantScoped</code> -- read by <code>@happyvertical/smrt-tenancy</code></li>
			<li><code>agent</code> -- mark as agent root for jobs/dispatch</li>
		</ul>
		<p>
			Registration also sets a <code>SMRT_TABLE_NAME</code> static property on the class -- this
			survives minification, so production bundles still resolve the right table.
		</p>

		<CodeBlock
			code={`@smrt({
  api: { include: ['list', 'get', 'create', 'update', 'delete'] },
  mcp: { include: ['list', 'get'] },  // Read-only for AI
  cli: true,
  conflictColumns: ['sku'],
})
export class Product extends SmrtObject {
  sku: string = '';
  name: string = '';
  price: number = 0.0;
}`}
			language="typescript"
		/>
	</section>

	<section id="dispatchbus">
		<h2>DispatchBus</h2>
		<p>Persistent inter-agent messaging backed by SQL:</p>
		<ul>
			<li><code>emit(signalType, payload, metadata)</code> -- creates a persistent Dispatch record</li>
			<li><code>on(pattern, handler)</code> -- in-memory handler, fires immediately</li>
			<li>
				<code>subscribe({'{'} signalType, subscriber {'}'})</code> -- persistent subscription that
				survives restarts
			</li>
			<li><code>process(subscriberName, handler)</code> -- process pending dispatches</li>
			<li>
				Wildcards: <code>campaign.*</code> matches <code>campaign.completed</code> (single segment
				only)
			</li>
			<li>Tables: <code>_smrt_dispatch</code>, <code>_smrt_dispatch_subscriptions</code></li>
			<li>
				Status lifecycle: <code>pending → processing → completed</code> (or <code>failed</code>)
			</li>
		</ul>

		<CodeBlock
			code={`import { dispatchBus } from '@happyvertical/smrt-core';

// Emit a signal
await dispatchBus.emit('campaign.completed', {
  campaignId: 'c-123',
  totalSent: 4200,
});

// Persistent subscription
await dispatchBus.subscribe({
  signalType: 'campaign.*',
  subscriber: 'analytics-worker',
});

// Drain queue in a worker process
await dispatchBus.process('analytics-worker', async (dispatch) => {
  await recordCampaignMetrics(dispatch.payload);
});`}
			language="typescript"
		/>
	</section>

	<section id="ai-integration">
		<h2>AI Integration</h2>

		<h3>The is() Method</h3>
		<p>Ask yes/no questions about your objects:</p>
		<CodeBlock
			code={`const isHighQuality = await document.is(\`
  - Contains more than 500 words
  - Has clear structure and headings
  - Uses professional language
\`);

if (isHighQuality) {
  await document.publish();
}`}
			language="typescript"
		/>

		<h3>The do() Method</h3>
		<p>Perform AI-powered actions:</p>
		<CodeBlock
			code={`const summary = await document.do(\`
  Create a 2-sentence summary of this document.
  Focus on the key points and main conclusions.
\`);`}
			language="typescript"
		/>

		<h3>AI Tools & Function Calling</h3>
		<p>Methods listed under <code>ai</code> in <code>@smrt()</code> are exposed as tools during do() calls.</p>
		<CodeBlock
			code={`@smrt({ ai: { callable: ['summarize', 'translate'] } })
class Document extends SmrtObject {
  async summarize() { /* ... */ }
  async translate(language: string) { /* ... */ }
}

const result = await document.do(\`
  Analyze this document and translate the summary to Spanish.
\`);
// AI will call summarize() and translate() as needed`}
			language="typescript"
		/>
	</section>

	<section id="sti">
		<h2>Single Table Inheritance (STI)</h2>
		<ul>
			<li>Base: <code>@smrt({'{'} tableStrategy: 'sti' {'}'})</code> -- children inherit, share one table</li>
			<li>
				Discriminator: <code>_meta_type</code> column with <strong>qualified names</strong> like
				<code>@happyvertical/smrt-content:Article</code>
			</li>
			<li>
				Child-specific fields: <code>@meta()</code> decorator stores them in <code>_meta_data</code>
				JSONB instead of as columns
			</li>
			<li>
				Polymorphic queries: the collection reads <code>_meta_type</code> and constructs the correct
				subclass dynamically
			</li>
			<li>Validation: <code>save()</code> fails fast if <code>_meta_type</code> is missing or mismatched</li>
		</ul>

		<CodeBlock
			code={`import { smrt, SmrtObject, meta } from '@happyvertical/smrt-core';

@smrt({ tableStrategy: 'sti' })
class Event extends SmrtObject {
  title: string = '';          // Base table column
  startTime: Date = new Date(); // Base table column
}

@smrt()
class Meeting extends Event {
  location: string = '';                  // Base table column
  @meta() roomNumber: string = '';        // Stored in _meta_data JSONB
  @meta() attendees: string[] = [];
}

@smrt()
class Concert extends Event {
  venue: string = '';                     // Base table column
  @meta() artist: string = '';            // Stored in _meta_data JSONB
  @meta() ticketPrice: number = 0;
}

// Polymorphic queries -- collection loads correct subclass automatically
const events = await eventCollection.list();
events.forEach(event => {
  if (event instanceof Meeting) console.log(\`Meeting at \${event.location}\`);
  if (event instanceof Concert) console.log(\`Concert by \${event.artist}\`);
});`}
			language="typescript"
		/>
	</section>

	<section id="code-generation">
		<h2>Code Generators</h2>
		<table>
			<thead>
				<tr>
					<th>Generator</th>
					<th>Location</th>
					<th>Output</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>REST API</td>
					<td><code>src/generators/rest.ts</code></td>
					<td>OpenAPI-compliant CRUD endpoints</td>
				</tr>
				<tr>
					<td>CLI</td>
					<td><code>src/generators/cli.ts</code></td>
					<td>Commander commands with auto-help</td>
				</tr>
				<tr>
					<td>MCP Server</td>
					<td><code>src/generators/mcp.ts</code></td>
					<td>Model Context Protocol tools</td>
				</tr>
			</tbody>
		</table>

		<h3>CLI Commands (Auto-Generated)</h3>
		<CodeBlock
			code={`# From @smrt({ cli: true })
npx smrt products:list
npx smrt products:get <id>
npx smrt products:create --name "Widget" --price 29.99
npx smrt products:update <id> --price 24.99
npx smrt products:delete <id>`}
			language="bash"
		/>
	</section>

	<section id="vite-plugin">
		<h2>Vite Plugin</h2>
		<p>Required to enable <code>@smrt()</code> decorators:</p>
		<CodeBlock
			code={`// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
      },
    },
  },
});`}
			language="typescript"
		/>
		<p>
			Build-time manifest generation happens via the vitest plugin (<a
				href="/modules/smrt-vitest">smrt-vitest</a
			>) at startup.
		</p>
	</section>

	<section id="databases">
		<h2>Database Support</h2>

		<ul>
			<li><strong>SQLite</strong> -- <code>{"{ type: 'sqlite', url: 'app.db' }"}</code></li>
			<li>
				<strong>PostgreSQL</strong> -- <code>{"{ type: 'postgres', url: 'postgres://...' }"}</code>
			</li>
			<li><strong>DuckDB</strong> -- <code>{"{ type: 'duckdb', url: 'data.db' }"}</code></li>
			<li>
				<strong>JSON</strong> -- <code>{"{ type: 'json', url: 'data.json' }"}</code> (testing only)
			</li>
		</ul>

		<CodeBlock
			code={`// String shortcut (auto-detects type)
const collection = await ProductCollection.create({ db: 'products.db' });

// Explicit config
const collection = await ProductCollection.create({
  db: { type: 'sqlite', url: 'products.db' },
});

// DatabaseInterface instance from @happyvertical/sql
import { getDatabase } from '@happyvertical/sql';
const db = await getDatabase({ type: 'postgres', url: process.env.DATABASE_URL });
const collection = await ProductCollection.create({ db });`}
			language="typescript"
		/>
	</section>

	<section id="gotchas">
		<h2>Gotchas</h2>
		<ul>
			<li>
				<strong>Never override <code>toJSON()</code></strong> -- <code>toJSON()</code> handles STI
				discriminator + meta field extraction. Use <code>transformJSON()</code> for custom serialization.
			</li>
			<li>
				<strong>Property init order</strong>: TypeScript initializers run first, then
				<code>initialize()</code> applies option values (options win).
			</li>
			<li>
				<strong>No runtime schema creation</strong>: application tables must be prepared explicitly via
				migrations/tooling. The runtime verifies tables exist and fails clearly if they don't.
			</li>
			<li>
				<strong>Retry logic</strong>: <code>db.get()</code> retries 3x at 250ms; <code>db.upsert()</code>
				retries 3x at 500ms. Tune by wrapping or replacing if you need different behavior.
			</li>
			<li>
				<strong>Field caching</strong>: <code>_cachedFields</code> is populated during
				<code>Collection.create()</code> -- eliminates async <code>getFields()</code> per query.
			</li>
			<li>
				<strong>Smart cloning</strong>: arrays/objects are shallow-cloned during property init to prevent
				aliasing (Issue #22).
			</li>
			<li>
				<strong>Table verification cache</strong>: <code>isTableVerified(dbUrl, tableName)</code> avoids
				redundant <code>tableExists()</code> calls across collections.
			</li>
			<li>
				<strong>Manifest required</strong>: build-time AST scanning produces a manifest. Without the
				vitest plugin you'll see <code>"No field metadata"</code> errors.
			</li>
			<li>
				<strong>Vite plugin loads scanner from <code>dist/</code> first</strong>:
				<code>src/vite-plugin/import-build-aware.ts</code> prefers <code>dist/</code> when it exists;
				it only falls back to <code>src/</code> on fresh clones. If you edit
				<code>src/scanner/*.ts</code> or <code>src/schema/generator.ts</code>, you must rebuild
				(<code>pnpm build</code> or <code>pnpm dev</code> / <code>pnpm build:watch</code>) before
				consumers will see the change. Sniffing <code>.ts</code> vs <code>.js</code> via
				<code>import.meta.url</code> was non-deterministic under tsx and broke 12-13 publishes (#1139).
			</li>
		</ul>
	</section>

	<section id="next-steps">
		<h2>Next Steps</h2>
		<div class="link-grid">
			<a href="/modules/smrt-types" class="link-card">
				<h3>smrt-types →</h3>
				<p>Shared TypeScript type definitions</p>
			</a>
			<a href="/modules/smrt-config" class="link-card">
				<h3>smrt-config →</h3>
				<p>Configuration management</p>
			</a>
			<a href="/modules/smrt-vitest" class="link-card">
				<h3>smrt-vitest →</h3>
				<p>Required Vitest plugin and test DB utilities</p>
			</a>
			<a href="/modules/smrt-tenancy" class="link-card">
				<h3>smrt-tenancy →</h3>
				<p>Multi-tenant context propagation</p>
			</a>
		</div>
	</section>
</ModulePage>

<style>
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

	table {
		width: 100%;
		border-collapse: collapse;
		margin: 1rem 0;
	}

	th,
	td {
		text-align: left;
		padding: 0.75rem;
		border-bottom: 1px solid var(--smrt-color-outline-variant, #e5e5e5);
	}

	th {
		font-weight: 600;
		background-color: var(--smrt-color-surface-container, #f5f5f5);
	}
</style>
