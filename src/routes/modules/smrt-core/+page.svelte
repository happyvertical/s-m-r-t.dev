<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
</script>

<ModulePage
	name="smrt-core"
	description="ORM, code generation, AI integration, and the DispatchBus. Everything else in the SMRT framework builds on this."
	badges={['v0.29.34', 'Core Foundation', 'ESM']}
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
				<strong>DispatchBus</strong> -- inter-agent messaging with persistent subscriptions,
				wildcards, and lifecycle (<code>pending → processing → completed</code>)
			</li>
			<li>
				<strong>Single Table Inheritance</strong> -- polymorphic object hierarchies in a single table
			</li>
			<li>
				<strong>GlobalInterceptors</strong> -- plugin hooks for beforeList/Get/Save/Delete (used by smrt-tenancy)
			</li>
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
			migration tooling (<code>smrt db:migrate</code>) before the first DB op. The collection only
			verifies the table exists and fails clearly if it doesn't.
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
					<td
						>Global singleton on <code>globalThis</code> -- class metadata, fields, STI chains, manifests</td
					>
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
				<code>conflictColumns</code> -- natural-key tuple used by <code>upsert()</code> (required on junction
				/ upsert tables)
			</li>
			<li>
				<code>api</code> / <code>mcp</code> / <code>cli</code> -- generator config (boolean or
				<code>{'{'} include: [...] {'}'}</code>)
			</li>
			<li><code>ai</code> -- callable methods exposed during <code>do()</code></li>
			<li><code>hooks</code> -- beforeSave / afterSave / beforeDelete / afterDelete</li>
			<li><code>embeddings</code> -- auto-generate embeddings on save</li>
			<li><code>tenantScoped</code> -- read by <code>@happyvertical/smrt-tenancy</code></li>
			<li><code>agent</code> -- mark as agent root for jobs/dispatch</li>
		</ul>
		<p>
			Registration also sets a <code>SMRT_TABLE_NAME</code> static property on the class -- this survives
			minification, so production bundles still resolve the right table.
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
			<li>
				<code>emit(signalType, payload, metadata)</code> -- creates a persistent Dispatch record
			</li>
			<li><code>on(pattern, handler)</code> -- in-memory handler, fires immediately</li>
			<li>
				<code>subscribe({'{'} signalType, subscriber {'}'})</code> -- persistent subscription that survives
				restarts
			</li>
			<li><code>process(subscriberName, handler)</code> -- process pending dispatches</li>
			<li>
				Wildcards: <code>campaign.*</code> matches <code>campaign.completed</code> (single segment only)
			</li>
			<li>Tables: <code>_smrt_dispatch</code>, <code>_smrt_dispatch_subscriptions</code></li>
			<li>
				Status lifecycle: <code>pending → processing → completed</code> (or <code>failed</code>)
			</li>
		</ul>

		<CodeBlock
			code={`import { createDispatchBus } from '@happyvertical/smrt-core';

const bus = await createDispatchBus({ db: { type: 'sqlite', url: 'app.db' } });

// Emit a signal
await bus.emit('campaign.completed', {
  campaignId: 'c-123',
  totalSent: 4200,
}, { source: 'suasor' });

// Persistent subscription
await bus.subscribe({
  signalType: 'campaign.*',
  subscriber: 'analytics-worker',
});

// Drain queue in a worker process (handler receives payload + metadata)
await bus.process('analytics-worker', async (payload, metadata) => {
  await recordCampaignMetrics(payload);
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
		<p>
			Methods listed under <code>ai</code> in <code>@smrt()</code> are exposed as tools during do() calls.
		</p>
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
			<li>
				Base: <code>@smrt({'{'} tableStrategy: 'sti' {'}'})</code> -- children inherit, share one table
			</li>
			<li>
				Discriminator: <code>_meta_type</code> column with <strong>qualified names</strong> like
				<code>@happyvertical/smrt-content:Article</code>
			</li>
			<li>
				Child-specific fields: <code>@meta()</code> decorator stores them in <code>_meta_data</code>
				JSONB instead of as columns
			</li>
			<li>
				Polymorphic queries: the collection reads <code>_meta_type</code> and constructs the correct subclass
				dynamically
			</li>
			<li>
				Validation: <code>save()</code> fails fast if <code>_meta_type</code> is missing or mismatched
			</li>
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
		<p>
			<code>smrtPlugin</code> (exported from
			<code>@happyvertical/smrt-core/vite-plugin</code>) is what makes <code>@smrt()</code> work. At
			build/dev time it scans your <code>src/</code> files, builds the object
			<strong>manifest</strong> (class names, fields, methods, decorator config), and exposes it to
			the runtime through virtual modules and a <code>.smrt/manifest.json</code> file the CLI reads.
		</p>

		<Callout variant="note" title="The manifest comes from this plugin, not from smrt-vitest">
			Build-time AST scanning and manifest generation are done by the Vite <code>smrtPlugin</code>
			in <code>@happyvertical/smrt-core</code>. <a href="/modules/smrt-vitest">smrt-vitest</a>
			is a separate Vitest plugin that wires the same scan into the <em>test</em> runtime so unit
			tests see field metadata -- it does not own the manifest. In a normal app it is the Vite
			plugin (configured in <code>vite.config.ts</code>) that produces the manifest your server
			and CLI consume.
		</Callout>

		<CodeBlock
			code={`// vite.config.ts
import { defineConfig } from 'vite';
import { smrtPlugin } from '@happyvertical/smrt-core/vite-plugin';

export default defineConfig({
  plugins: [
    smrtPlugin(),
  ],
  // Decorators still need esbuild configured:
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

		<Callout variant="warning" title="The scanner is loaded from dist/ first">
			The plugin prefers a built scanner under <code>dist/</code> and only falls back to
			<code>src/</code> on a fresh clone. If you edit smrt-core's
			<code>src/scanner/*</code> or <code>src/schema/generator.ts</code>, rebuild
			(<code>pnpm build</code> / <code>pnpm build:watch</code>) before consumers pick up the
			change. Without a manifest you'll see <code>"No field metadata"</code> errors at runtime.
		</Callout>

		<h3>SvelteKit route generation (<code>svelteKit.enabled</code>)</h3>
		<p>
			Pass <code>svelteKit: {'{'} enabled: true {'}'}</code> and the plugin writes real SvelteKit
			<code>+server.ts</code> route files for every <code>@smrt({'{'} api: true {'}'})</code> object
			-- regenerated on every change in dev. This is opt-in; it is <strong>off</strong> by default.
		</p>
		<CodeBlock
			code={`// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { smrtPlugin } from '@happyvertical/smrt-core/vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    smrtPlugin({
      svelteKit: {
        enabled: true,                  // default: false
        routesDir: 'src/routes/api',    // where +server.ts files are written
        objectsDir: 'src/lib/objects',  // where your @smrt() classes live
        configPath: 'src/lib/server',   // dir for the generated config
        configFileName: 'smrt.ts',      // generated config file name
        // kebabRoutes: true,           // /discover-from-url vs /discoverFromUrl
      },
    }),
    sveltekit(),
  ],
});`}
			language="typescript"
		/>

		<h4>What gets generated</h4>
		<table>
			<thead>
				<tr>
					<th>Path</th>
					<th>What it is</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>src/routes/api/&lt;collection&gt;/+server.ts</code></td>
					<td>Collection routes: <code>GET</code> (list), <code>POST</code> (create)</td>
				</tr>
				<tr>
					<td><code>src/routes/api/&lt;collection&gt;/[id]/+server.ts</code></td>
					<td>Item routes: <code>GET</code> / <code>PUT</code> / <code>DELETE</code></td>
				</tr>
				<tr>
					<td><code>src/lib/server/smrt.ts</code></td>
					<td>Central config + per-object <code>objectOverrides</code> (not overwritten once it exists)</td>
				</tr>
				<tr>
					<td><code>src/lib/server/smrt-register.ts</code></td>
					<td>Imports every object so the <code>@smrt()</code> decorators run (regenerated)</td>
				</tr>
				<tr>
					<td><code>.smrt/manifest.json</code></td>
					<td>Manifest for CLI discovery (<code>smrt db:migrate</code>, <code>db:status</code>)</td>
				</tr>
			</tbody>
		</table>
		<p>
			Generated route files are auto-added to <code>.gitignore</code>; the one exception is
			<code>smrt.ts</code>, which is yours to edit (the generator skips it if it already exists).
		</p>

		<h4>Generated routes are fail-closed</h4>
		<p>
			Every generated handler runs an auth guard before touching the collection. By default a
			route <strong>requires an authenticated principal</strong> on <code>locals</code> -- it
			throws <code>401</code> otherwise. You opt specific objects out per the
			<a href="#security">Security defaults</a> section below. A generated collection handler
			looks like this:
		</p>
		<CodeBlock
			code={`// src/routes/api/products/+server.ts  (generated, abridged)
import { error, json } from '@sveltejs/kit';

// Fail-closed: false = every route needs auth; true = public;
// 'read' = list/get public, writes still guarded.
const PUBLIC_ACCESS: boolean | 'read' = false;

function requireRouteAuth(locals: unknown, mutating: boolean): void {
  if (PUBLIC_ACCESS === true) return;
  if (PUBLIC_ACCESS === 'read' && !mutating) return;
  if (!hasAuthenticatedPrincipal(locals)) {
    throw error(401, 'Authentication required');
  }
}

export async function GET({ locals }) {
  requireRouteAuth(locals, false);   // read -> non-mutating
  // ... list, serialized via toPublicJSON()
}

export async function POST({ locals, request }) {
  requireRouteAuth(locals, true);    // write -> mutating
  const data = applyWritablePolicy(await request.json());
  // ... create
}`}
			language="typescript"
		/>
		<Callout variant="security" title="What counts as authenticated (no fail-open)">
			The guard treats only an <em>object-shaped</em> <code>locals.user</code> /
			<code>locals.session</code> (or an explicit <code>locals.smrtAuth === true</code> marker) as
			a principal. It deliberately ignores <code>locals.auth</code>: Auth.js/SvelteKit attach a
			callable <code>auth()</code> helper to <strong>every</strong> request -- including anonymous
			ones -- so honoring it would fail open. Wire your auth hook to set <code>locals.user</code>
			or <code>locals.session</code>.
		</Callout>
	</section>

	<section id="security">
		<h2>Security Defaults</h2>
		<p>
			Generated REST / MCP / SvelteKit surfaces ship with secure defaults so a new
			<code>@smrt({'{'} api: true {'}'})</code> object is not accidentally an open, fully-writable
			endpoint. Four mechanisms, all grounded in <code>@smrt()</code> /
			<code>@field()</code> config.
		</p>

		<h3>1. Fail-closed authorization (<code>api.public</code>)</h3>
		<p>Omit <code>public</code> and the route is protected. Opt out explicitly when data is public:</p>
		<CodeBlock
			code={`@smrt({ api: true })                         // default: every route requires auth
class Invoice extends SmrtObject {}

@smrt({ api: { public: 'read' } })           // list/get public; writes still need auth
class BlogPost extends SmrtObject {}

@smrt({ api: { public: true } })             // fully public (use only for genuinely public data)
class StatusPage extends SmrtObject {}`}
			language="typescript"
		/>

		<h3>2. Sensitive fields (<code>@field({'{'} sensitive: true {'}'})</code>)</h3>
		<p>
			Sensitive fields are still persisted, but the framework excludes them from
			<code>toPublicJSON()</code> -- the serializer used by every generated route -- so they never
			appear in responses, <strong>and</strong> rejects them as <code>where</code>-clause filter
			keys, closing the <code>?secret[like]=...</code> value-probing oracle.
		</p>

		<h3>3. Read-only fields (<code>@field({'{'} readonly: true {'}'})</code>)</h3>
		<p>
			Read-only fields are stripped from the request body before <code>create</code>/<code>update</code>,
			so callers cannot mass-assign them. Server-side code can still set them directly.
		</p>

		<h3>4. Writable allowlist (<code>api.writable</code>)</h3>
		<p>
			Generated <code>create</code>/<code>update</code> handlers run the body through a
			mass-assignment guard. Framework/server-managed fields (<code>id</code>,
			<code>tenantId</code>, timestamps, <code>_</code>-prefixed) and any
			<code>readonly</code> field are <strong>always</strong> stripped. Setting
			<code>writable</code> additionally restricts writes to that allowlist.
		</p>
		<CodeBlock
			code={`import { smrt, SmrtObject, field } from '@happyvertical/smrt-core';

@smrt({
  api: {
    public: 'read',                  // reads public, writes require auth
    writable: ['name', 'price'],     // only these may be set from the request body
  },
})
class Product extends SmrtObject {
  name: string = '';
  price: number = 0.0;

  @field({ sensitive: true })
  supplierCost: number = 0;          // never serialized; not filterable

  @field({ readonly: true })
  sku: string = '';                  // stripped from create/update bodies
}`}
			language="typescript"
		/>
		<Callout variant="warning" title="Custom serializers bypass the sensitive-field filter">
			If you supply <code>api.serializers</code>, your serializer <em>replaces</em>
			<code>toPublicJSON()</code>. A serializer that returns <code>item.toJSON()</code> (or spreads
			all fields) will leak <code>sensitive</code> fields that the default path would have stripped.
			You own that exclusion.
		</Callout>
	</section>

	<section id="custom-routes">
		<h2>Custom-Method Routes (<code>api.routes</code>)</h2>
		<p>
			Methods on a <code>@smrt()</code> class beyond the five CRUD actions are also exposed over
			HTTP. By default a custom route is a <code>POST</code> at the method name. Use
			<code>api.routes</code> to declare scope (item vs collection), HTTP verb, and path segment.
		</p>
		<table>
			<thead>
				<tr>
					<th>Field</th>
					<th>Effect</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>scope: 'item'</code></td>
					<td>Generates <code>/&lt;collection&gt;/[id]/&lt;path&gt;</code> (default for instance methods)</td>
				</tr>
				<tr>
					<td><code>scope: 'collection'</code></td>
					<td>Generates <code>/&lt;collection&gt;/&lt;path&gt;</code> (default for static methods)</td>
				</tr>
				<tr>
					<td><code>method</code></td>
					<td>HTTP verb (<code>GET</code>/<code>POST</code>/<code>PUT</code>/<code>PATCH</code>/<code>DELETE</code>); default <code>POST</code></td>
				</tr>
				<tr>
					<td><code>path</code></td>
					<td>URL segment override; defaults to the method name (wins over <code>kebabRoutes</code>)</td>
				</tr>
			</tbody>
		</table>
		<CodeBlock
			code={`@smrt({
  api: {
    include: ['list', 'get', 'archive', 'browseFacts'],
    routes: {
      // POST /articles/[id]/archive
      archive: { scope: 'item', method: 'POST' },
      // GET /articles/facts
      browseFacts: { scope: 'collection', method: 'GET', path: 'facts' },
    },
  },
})
class Article extends SmrtObject {
  async archive() { /* instance method -> item scope */ }
  static async browseFacts() { /* static method -> collection scope */ }
}`}
			language="typescript"
		/>
		<Callout variant="note" title="Custom routes are guarded and sensitive-safe too">
			The same fail-closed auth guard runs on custom-method handlers. Their return values are
			recursively routed through <code>toPublicJSON()</code> -- so a method that returns a
			<code>SmrtObject</code> (or one nested in an array/object) still has its
			<code>sensitive</code> fields stripped. A CLI method listed in <code>cli.include</code> must
			also be reachable via the API (it is invoked over HTTP), or the build fails; opt out with
			<code>cli: {'{'} skipApiCheck: true {'}'}</code> for genuinely in-process CLIs.
		</Callout>
	</section>

	<section id="read-cache">
		<h2>Read Cache &amp; Write-Invalidation</h2>
		<p>
			SSR pages re-query read-heavy, write-rare collections on every request. smrt-core ships an
			<strong>opt-in</strong> read-through cache that memoizes <code>list()</code>/<code>get()</code>
			result rows keyed by the final SQL + parameters, for a TTL you set.
		</p>
		<p>Enable per call, or per model via the decorator:</p>
		<CodeBlock
			code={`// Per call
const published = await resumes.list({
  where: { status: 'published' },
  cache: { ttl: 60_000 },          // memoize for 60s
});

// Per model (becomes the default for that collection's reads)
@smrt({ cache: { ttl: 60_000 } })
class Resume extends SmrtObject {}

// Force a fresh read even when the model opted in
const fresh = await resumes.list({ where: { status: 'published' }, cache: false });`}
			language="typescript"
		/>
		<p>
			<strong>Automatic write-invalidation.</strong> Because SMRT owns every mutation path
			(<code>save()</code>, <code>delete()</code>, <code>getOrUpsert()</code>, junction
			attach/detach), a successful write invalidates that table's cached entries in-process with no
			manual step. Even a raw write issued through <code>collection.query()</code> is treated as a
			mutation and invalidates. Entries are scoped per database identity and per table, so
			multi-DB processes and STI siblings stay coherent.
		</p>
		<Callout variant="warning" title="Per-process by default; bounded by TTL otherwise">
			Caches are per-process: with multiple replicas, a local write leaves peers stale until TTL
			unless you opt into <code>crossProcess: true</code> (broadcasts over the adapter's
			notification channel, e.g. Postgres <code>LISTEN/NOTIFY</code>). Invalidation also fires when
			a mutation's SQL <em>executes</em>, not when its transaction commits -- so a rollback can
			leave the cache invalidated for a write that never landed, and a concurrent reader can
			repopulate from a pre-commit snapshot. Target read-heavy / write-rare data; use
			<code>cache: false</code> where strict freshness matters. <code>count()</code> is never served
			from the cache.
		</Callout>
	</section>

	<section id="context-memory">
		<h2>Context Memory</h2>
		<p>
			Every <code>SmrtObject</code> can persist named, scoped values to the
			<code>_smrt_contexts</code> system table via <code>remember()</code> /
			<code>recall()</code>. It's a lightweight learned-pattern store -- e.g. an agent caching how
			to parse a given site -- keyed by <code>(owner_class, owner_id, scope, key, version)</code>,
			with an optional <code>confidence</code> score (0-1, default 1.0).
		</p>
		<CodeBlock
			code={`// Store a learned pattern (upserts on the same scope+key+version)
await agent.remember({
  scope: 'parser/example.com',
  key: normalizedUrl,
  value: { patterns: ['regex1', 'regex2'] },
  confidence: 0.9,
});

// Retrieve it; walk up parent scopes if not found at this level
const strategy = await agent.recall({
  scope: 'parser/example.com/article',
  key: normalizedUrl,
  includeAncestors: true,    // 'a/b/c' -> 'a/b' -> 'a' -> 'global'
  minConfidence: 0.6,
});`}
			language="typescript"
		/>
		<p>
			Related methods: <code>recallAll(scope)</code> to read every entry in a scope, and
			<code>forget(...)</code> to delete entries. <code>remember()</code>/<code>recall()</code>
			require <code>initialize()</code> to have run (they need the system DB).
		</p>
	</section>

	<section id="embeddings">
		<h2>Semantic Search &amp; Embeddings</h2>
		<p>
			Declare <code>embeddings</code> in <code>@smrt()</code> and the listed fields get vector
			embeddings stored in the <code>_smrt_embeddings</code> system table. Embeddings are
			auto-generated on <code>save()</code> (only when content changes, via a content hash), then
			you can run cosine-similarity search.
		</p>
		<CodeBlock
			code={`@smrt({
  embeddings: {
    fields: ['title', 'body'],
    provider: 'auto',          // 'local' (@xenova/transformers), 'ai', or 'auto'
    autoGenerate: true,        // embed on save (default true)
    regenerateOnChange: true,  // re-embed only when content changes (default true)
  },
})
class Article extends SmrtObject {
  title: string = '';
  body: string = '';
}`}
			language="typescript"
		/>
		<CodeBlock
			code={`// Semantic search: embeds the query, ranks by cosine similarity
const results = await articles.semanticSearch('machine learning trends', {
  limit: 10,
  minSimilarity: 0.7,   // 0-1 threshold (default 0)
});
for (const article of results) {
  console.log(\`\${article.title} (similarity: \${article._similarity})\`);
}

// "More like this" from an existing object (or its id)
const seed = await articles.get(someId);
const similar = await articles.findSimilar(seed, { limit: 5, excludeSelf: true });`}
			language="typescript"
		/>
		<Callout variant="note" title="Query and stored embeddings use the same model">
			<code>semanticSearch()</code> resolves the class/project embedding config and embeds the
			query with the <strong>same</strong> provider/model used for the stored vectors, so scores
			are comparable. Searching a field that isn't in the <code>embeddings.fields</code> list (or a
			model with no embedding config at all) throws a clear error rather than returning wrong
			results.
		</Callout>
	</section>

	<section id="cross-package-ref">
		<h2>Cross-Package References (<code>@crossPackageRef</code>)</h2>
		<p>
			<code>@foreignKey()</code> links objects in the <em>same</em> package and emits a real SQL FK
			constraint. When the target class lives in <strong>another</strong> package,
			<code>@crossPackageRef()</code> registers the relationship without a DB-level constraint --
			adding one would require the classes to be visible at schema-generation time and would force
			a circular package dependency. The column stays a plain <code>TEXT</code> (UUID) id.
		</p>
		<CodeBlock
			code={`import { smrt, SmrtObject, crossPackageRef } from '@happyvertical/smrt-core';

@smrt()
class Customer extends SmrtObject {
  // Target named as @package/scope:ClassName
  @crossPackageRef('@happyvertical/smrt-profiles:Profile')
  profileId: string = '';

  // Opt into save-time existence validation (catches typos / stale ids)
  @crossPackageRef('@happyvertical/smrt-profiles:Profile', { validate: true })
  primaryContactId: string = '';
}`}
			language="typescript"
		/>
		<p>
			What you gain over a plain string id: the relationship is registered with the
			<code>ObjectRegistry</code>, so <code>loadRelated('profileId')</code> and
			<code>Collection.list({'{'} include: ['profileId'] {'}'})</code> resolve it once the target
			package's manifest is loaded; and with <code>validate: true</code>, <code>save()</code>
			confirms the referenced object exists before the row lands.
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
				<strong>No runtime schema creation</strong>: application tables must be prepared explicitly
				via migrations/tooling. The runtime verifies tables exist and fails clearly if they don't.
			</li>
			<li>
				<strong>Retry logic</strong>: <code>db.get()</code> retries 3x at 250ms;
				<code>db.upsert()</code>
				retries 3x at 500ms. Tune by wrapping or replacing if you need different behavior.
			</li>
			<li>
				<strong>Field caching</strong>: <code>_cachedFields</code> is populated during
				<code>Collection.create()</code> -- eliminates async <code>getFields()</code> per query.
			</li>
			<li>
				<strong>Smart cloning</strong>: arrays/objects are shallow-cloned during property init to
				prevent aliasing (Issue #22).
			</li>
			<li>
				<strong>Table verification cache</strong>: <code>isTableVerified(dbUrl, tableName)</code>
				avoids redundant <code>tableExists()</code> calls across collections.
			</li>
			<li>
				<strong>Manifest required</strong>: build-time AST scanning produces the manifest, and it is
				the Vite <code>smrtPlugin</code> (see <a href="#vite-plugin">Vite Plugin</a>) that generates
				it for your app -- not <a href="/modules/smrt-vitest">smrt-vitest</a>, which only wires the
				same scan into the <em>test</em> runtime. Without a manifest you'll see
				<code>"No field metadata"</code> errors.
			</li>
			<li>
				<strong>Vite plugin loads scanner from <code>dist/</code> first</strong>: the plugin prefers
				<code>dist/</code> and only falls back to <code>src/</code> on fresh clones, so rebuild after
				editing <code>src/scanner/*</code> or <code>src/schema/generator.ts</code> (see the
				<a href="#vite-plugin">Vite Plugin</a> note). Sniffing <code>.ts</code> vs <code>.js</code>
				via <code>import.meta.url</code> was non-deterministic under tsx and broke 12-13 publishes
				(#1139).
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
