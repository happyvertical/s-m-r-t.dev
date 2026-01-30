<script lang="ts">
  import ModulePage from '$lib/components/ModulePage.svelte';
  import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage 
  name="smrt-core" 
  description="The foundational AI agent framework providing ORM, code generation, AI operations, and standardized collections for building intelligent TypeScript applications."
  badges={['v0.17.100', 'Core Foundation', 'ESM']}
>
  <section id="overview">
    <h2>Overview</h2>
    <p>
      <code>@happyvertical/smrt-core</code> is the heart of the SMRT framework. It provides:
    </p>
    <ul>
      <li><strong>AI-First Object Framework</strong> - TypeScript classes with built-in AI operations (is, do, describe)</li>
      <li><strong>Object-Relational Mapping</strong> - Automatic database schema generation from TypeScript definitions</li>
      <li><strong>Standardized Collections</strong> - Advanced CRUD with SQL-like querying</li>
      <li><strong>Code Generators</strong> - Auto-generate REST APIs, MCP servers, CLI commands, and Swagger docs</li>
      <li><strong>Vite Plugin</strong> - Virtual modules for seamless development integration</li>
      <li><strong>Context Memory</strong> - Persistent storage for learned patterns</li>
      <li><strong>Semantic Search</strong> - Built-in embedding support for similarity</li>
    </ul>
  </section>

  <section id="installation">
    <h2>Installation</h2>
    <CodeBlock code={`npm install @happyvertical/smrt-core`} language="bash" />

    <h3>Dependencies</h3>
    <p>smrt-core builds on the HappyVertical SDK:</p>
    <CodeBlock code={`npm install @happyvertical/ai @happyvertical/sql @happyvertical/files`} language="bash" />
  </section>

  <section id="quick-start">
    <h2>Quick Start</h2>
    <p>Create your first SMRT object in under 5 minutes:</p>

    <h3>1. Define Your Object</h3>
    <CodeBlock code={`import { SmrtObject, SmrtCollection, smrt } from '@happyvertical/smrt-core';

@smrt({ cli: true, api: true })
export class Product extends SmrtObject {
  name: string = '';
  description: string = '';
  price: number = 0.0;    // Decimal point → DECIMAL type
  quantity: number = 0;   // No decimal → INTEGER type
  active: boolean = true;
}

export class ProductCollection extends SmrtCollection<Product> {
  static readonly _itemClass = Product;
}`} language="typescript" />

    <h3>2. Initialize Collection</h3>
    <CodeBlock code={`// Create and initialize collection
const products = await ProductCollection.create({
  db: 'products.db',  // SQLite database
  ai: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY
  }
});

await products.initialize();`} language="typescript" />

    <h3>3. CRUD Operations</h3>
    <CodeBlock code={`// Create
const product = await products.create({
  name: 'Widget',
  description: 'A useful widget',
  price: 29.99,
  quantity: 100,
  active: true
});
await product.save();

// Read
const all = await products.list({ limit: 10 });
const one = await products.get(product.id);

// Update
product.price = 24.99;
await product.save();

// Delete
await product.delete();`} language="typescript" />

    <h3>4. AI Operations</h3>
    <CodeBlock code={`// Ask yes/no questions
const isExpensive = await product.is(\`
  - Price is above $50
  - Premium quality product
\`);

// Perform AI actions
const summary = await product.do(\`
  Create a compelling 2-sentence product description
  that highlights the key benefits.
\`);

// Generate descriptions
const description = await product.describe();
console.log(description);
// "Widget is a useful product priced at $29.99..."`} language="typescript" />
  </section>

  <section id="core-concepts">
    <h2>Core Concepts</h2>

    <h3>Architecture</h3>
    <p>smrt-core uses a registry-driven design:</p>
    <CodeBlock code={`┌─────────────────────────────────────────┐
│  @smrt Decorated Classes                │
│  (auto-register on instantiation)       │
└────────────┬────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────┐
│  ObjectRegistry (Global Singleton)      │
│  • Class constructors                   │
│  • Field definitions                    │
│  • Decorator configurations             │
│  • Collection instances (cached)        │
└────────────┬────────────────────────────┘
             │
    ┌────────┼────────┐
    ↓        ↓        ↓
 REST API  MCP Tools  CLI`} language="text" />

    <h3>Three Core Classes</h3>
    <ul>
      <li><strong>SmrtClass</strong> - Foundation providing database, filesystem, and AI client access</li>
      <li><strong>SmrtObject</strong> - Persistent entities with unique IDs, timestamps, and AI operations</li>
      <li><strong>SmrtCollection&lt;T&gt;</strong> - Manages sets of SmrtObject instances with CRUD operations</li>
    </ul>

    <h3>Field System</h3>
    <p>Use TypeScript types for automatic schema inference:</p>
    <CodeBlock code={`class Product extends SmrtObject {
  name: string = '';              // → TEXT
  quantity: number = 0;           // → INTEGER (no decimal)
  price: number = 0.0;            // → DECIMAL (has decimal)
  active: boolean = true;         // → BOOLEAN
  tags: string[] = [];            // → JSON
  createdAt: Date = new Date();   // → DATETIME
}`} language="typescript" />

    <p>Or use field helpers when constraints are needed:</p>
    <CodeBlock code={`import { text, decimal, foreignKey } from '@happyvertical/smrt-core/decorators';

class Product extends SmrtObject {
  name = text({ required: true, maxLength: 100 });
  price = decimal({ min: 0, max: 999999.99, required: true });
  categoryId = foreignKey(Category, { onDelete: 'restrict' });
}`} language="typescript" />
  </section>

  <section id="ai-integration">
    <h2>AI Integration</h2>

    <h3>The is() Method</h3>
    <p>Ask yes/no questions about your objects:</p>
    <CodeBlock code={`const isHighQuality = await document.is(\`
  - Contains more than 500 words
  - Has clear structure and headings
  - Uses professional language
\`);

if (isHighQuality) {
  await document.publish();
}`} language="typescript" />

    <h3>The do() Method</h3>
    <p>Perform AI-powered actions:</p>
    <CodeBlock code={`const summary = await document.do(\`
  Create a 2-sentence summary of this document.
  Focus on the key points and main conclusions.
\`);

const translation = await document.do(\`
  Translate the title to Spanish.
\`);`} language="typescript" />

    <h3>The describe() Method</h3>
    <p>Generate human-readable descriptions:</p>
    <CodeBlock code={`const description = await product.describe();
// Returns professional description suitable for display`} language="typescript" />

    <h3>AI Tools & Function Calling</h3>
    <p>Objects expose methods as AI tools automatically:</p>
    <CodeBlock code={`class Document extends SmrtObject {
  async summarize() { /* ... */ }
  async analyze() { /* ... */ }
  async translate(language: string) { /* ... */ }
}

// AI can call these methods during do() operations
const result = await document.do(\`
  Analyze this document and translate the summary to Spanish.
\`);
// AI will call analyze() and translate() as needed`} language="typescript" />
  </section>

  <section id="querying">
    <h2>Advanced Querying</h2>

    <h3>Query Operators</h3>
    <CodeBlock code={`const products = await collection.list({
  where: {
    'price >': 10,          // Greater than
    'price <=': 100,        // Less than or equal
    'name like': '%widget%', // Pattern matching
    'category in': ['A', 'B', 'C'],
    'inStock': true,         // Equals (default)
    'deletedAt !=': null    // Not equal
  },
  orderBy: ['price DESC', 'name ASC'],
  limit: 20,
  offset: 0
});`} language="typescript" />

    <h3>Eager Loading (Prevent N+1 Queries)</h3>
    <CodeBlock code={`// Load relationships efficiently with SQL JOINs
const orders = await orderCollection.list({
  limit: 100,
  include: ['customerId', 'productId']  // Pre-load relationships
});

// Access without additional queries
for (const order of orders) {
  const customer = order.getRelated('customerId');  // Already loaded!
  const product = order.getRelated('productId');
}`} language="typescript" />

    <h3>Direct SQL Access</h3>
    <CodeBlock code={`// Template literal safety (SQL injection prevention)
const expensive = await collection.db.many\`
  SELECT * FROM products
  WHERE price > \${100}
  ORDER BY price DESC
\`;

const count = await collection.db.pluck\`
  SELECT COUNT(*) FROM products WHERE category = \${'electronics'}
\`;`} language="typescript" />
  </section>

  <section id="code-generation">
    <h2>Code Generation</h2>

    <h3>The @smrt Decorator</h3>
    <p>Control what gets generated for each object:</p>
    <CodeBlock code={`@smrt({
  api: { include: ['list', 'get', 'create', 'update', 'delete'] },
  mcp: { include: ['list', 'get'] },  // Read-only for AI
  cli: true,
  swagger: true
})
export class Product extends SmrtObject { }`} language="typescript" />

    <h3>REST API Generator</h3>
    <CodeBlock code={`import { APIGenerator } from '@happyvertical/smrt-core/generators';

const generator = new APIGenerator({
  basePath: '/api/v1',
  enableCors: true,
  port: 3000
});

generator.registerCollection('products', productCollection);
const { server, url } = generator.createServer();

// Generated endpoints:
// GET    /api/v1/products       - List
// POST   /api/v1/products       - Create
// GET    /api/v1/products/:id   - Get
// PUT    /api/v1/products/:id   - Update
// DELETE /api/v1/products/:id   - Delete`} language="typescript" />

    <h3>MCP Server Generator</h3>
    <CodeBlock code={`import { MCPGenerator } from '@happyvertical/smrt-core/generators';

const generator = new MCPGenerator({
  name: 'smrt-mcp-server',
  version: '1.0.0'
});

generator.registerCollection('products', productCollection);
const tools = generator.generateTools();

// Generated MCP tools:
// list_products, get_product_by_id, create_product,
// update_product, delete_product`} language="typescript" />

    <h3>CLI Commands</h3>
    <CodeBlock code={`# Auto-generated from @smrt({ cli: true })
npx smrt products list
npx smrt products get <id>
npx smrt products create --name "Widget" --price 29.99
npx smrt products update <id> --price 24.99
npx smrt products delete <id>`} language="bash" />
  </section>

  <section id="context-memory">
    <h2>Context Memory System</h2>
    <p>Store and retrieve learned patterns:</p>

    <CodeBlock code={`// Store learned patterns
await object.remember({
  scope: 'parser/html/domain.com',
  key: 'article-selector',
  value: '.main-article',
  confidence: 0.95,
  metadata: { discoveredAt: new Date() }
});

// Retrieve with ancestor fallback
const context = await object.recall({
  scope: 'parser/html/domain.com/news',
  key: 'article-selector',
  includeAncestors: true  // Falls back to parent scopes
});

// Batch retrieval
const allContexts = await object.recallAll({
  scope: 'config/processing',
  includeDescendants: true
});

// Cleanup
await object.forget({ scope, key });
await object.forgetScope({ scope, includeDescendants: true });`} language="typescript" />

    <h3>Use Case: Web Scraper Learning</h3>
    <CodeBlock code={`class WebScraper extends SmrtObject {
  async discoverSelector(url: string) {
    const hostname = new URL(url).hostname;

    // Try to recall learned selector
    const remembered = await this.recall({
      scope: \`parser/\${hostname}\`,
      key: 'main-content',
      includeAncestors: true
    });

    if (remembered) return remembered.value;

    // Discover and remember
    const selector = await this.do(\`Find CSS selector for main content\`);
    await this.remember({
      scope: \`parser/\${hostname}\`,
      key: 'main-content',
      value: selector,
      confidence: 0.9
    });

    return selector;
  }
}`} language="typescript" />
  </section>

  <section id="relationships">
    <h2>Relationships</h2>

    <h3>Foreign Keys</h3>
    <CodeBlock code={`import { foreignKey } from '@happyvertical/smrt-core/decorators';

class Order extends SmrtObject {
  customerId = foreignKey(Customer, { onDelete: 'cascade' });
  productId = foreignKey(Product, { onDelete: 'restrict' });
  total: number = 0.0;
}

// Load relationship
await order.loadRelated('customerId');
const customer = order.getRelated('customerId');`} language="typescript" />

    <h3>One-to-Many</h3>
    <CodeBlock code={`import { oneToMany } from '@happyvertical/smrt-core/decorators';

class Customer extends SmrtObject {
  orders = oneToMany(Order, { foreignKey: 'customerId' });
}

// Access related records
const orders = await customer.loadRelated('orders');`} language="typescript" />

    <h3>Many-to-Many</h3>
    <CodeBlock code={`import { manyToMany } from '@happyvertical/smrt-core/decorators';

class Product extends SmrtObject {
  relatedProducts = manyToMany(Product, {
    through: 'product_relations'
  });
}

// Access related products
const related = await product.loadRelated('relatedProducts');`} language="typescript" />
  </section>

  <section id="sti">
    <h2>Single Table Inheritance</h2>
    <p>Polymorphic object hierarchies in a single database table:</p>

    <CodeBlock code={`import { Meta } from '@happyvertical/smrt-core';

@smrt({ tableStrategy: 'sti' })
class Event extends SmrtObject {
  title: string = '';          // Base table column
  startTime: Date = new Date(); // Base table column
}

@smrt()
class Meeting extends Event {
  location: string = '';       // Base table column
  roomNumber: Meta<string> = ''; // Stored in _meta_data JSONB
  attendees: Meta<string[]> = [];
}

@smrt()
class Concert extends Event {
  venue: string = '';          // Base table column
  artist: Meta<string> = '';   // Stored in _meta_data JSONB
  ticketPrice: Meta<number> = 0;
}

// Polymorphic queries
const events = await eventCollection.list({
  where: { '_meta_type': ['Meeting', 'Concert'] }
});

// Returns correct subclass instances
events.forEach(event => {
  if (event instanceof Meeting) {
    console.log(\`Meeting at \${event.location}\`);
  } else if (event instanceof Concert) {
    console.log(\`Concert by \${event.artist}\`);
  }
});`} language="typescript" />
  </section>

  <section id="vite-plugin">
    <h2>Vite Plugin</h2>
    <p>Auto-generate virtual modules during development:</p>

    <CodeBlock code={`// vite.config.ts
import { smrtPlugin } from '@happyvertical/smrt-core/vite-plugin';

export default {
  plugins: [
    smrtPlugin({
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts'],
      generateTypes: true,
      hmr: true,
      svelteKit: {
        enabled: true,
        routesDir: 'src/routes/api',
        objectsDir: 'src/lib/objects'
      }
    })
  ]
};`} language="typescript" />

    <h3>Virtual Modules</h3>
    <CodeBlock code={`// Auto-generated type-safe imports
import { setupRoutes } from '@smrt/routes';
import { createClient } from '@smrt/client';
import { tools } from '@smrt/mcp';
import { manifest } from '@smrt/manifest';
import type { Product } from '@smrt/types';`} language="typescript" />
  </section>

  <section id="databases">
    <h2>Database Support</h2>

    <h3>Supported Databases</h3>
    <ul>
      <li><strong>SQLite</strong> - <code>{"{ type: 'sqlite', url: 'app.db' }"}</code></li>
      <li><strong>PostgreSQL</strong> - <code>{"{ type: 'postgres', url: 'postgres://...' }"}</code></li>
      <li><strong>DuckDB</strong> - <code>{"{ type: 'duckdb', url: 'data.db' }"}</code></li>
      <li><strong>JSON</strong> - <code>{"{ type: 'json', url: 'data.json' }"}</code> (testing only)</li>
    </ul>

    <h3>Configuration</h3>
    <CodeBlock code={`// String shortcut (auto-detects type)
const collection = await ProductCollection.create({
  db: 'products.db'
});

// Config object
const collection = await ProductCollection.create({
  db: {
    type: 'sqlite',
    url: 'products.db'
  }
});

// DatabaseInterface instance
import { getDatabase } from '@happyvertical/sql';
const db = await getDatabase({ type: 'postgres', url: '...' });
const collection = await ProductCollection.create({ db });`} language="typescript" />
  </section>

  <section id="best-practices">
    <h2>Best Practices</h2>
    <ol>
      <li><strong>Use TypeScript types</strong> for simple properties - let the framework infer the schema</li>
      <li><strong>Use field helpers</strong> only when you need constraints or validation</li>
      <li><strong>Always define static _itemClass</strong> on collection classes</li>
      <li><strong>Use factory pattern</strong> for collection creation (<code>create()</code> method)</li>
      <li><strong>Leverage eager loading</strong> to prevent N+1 query problems</li>
      <li><strong>Set confidence scores</strong> in context memory for pattern reliability</li>
      <li><strong>Use hierarchical scopes</strong> for context organization</li>
      <li><strong>Cache AI responses</strong> in object properties to avoid redundant calls</li>
      <li><strong>Use direct SQL</strong> for complex queries when the ORM is insufficient</li>
      <li><strong>Organize by concerns</strong> - one object class per business entity</li>
    </ol>
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
      <a href="/modules/smrt-users" class="link-card">
        <h3>smrt-users →</h3>
        <p>Multi-tenant user management</p>
      </a>
      <a href="/modules/smrt-agents" class="link-card">
        <h3>smrt-agents →</h3>
        <p>Build autonomous agents</p>
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
</style>
