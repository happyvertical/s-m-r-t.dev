<svelte:head>
	<title>Objects | s-m-r-t</title>
</svelte:head>

<article class="prose">
	<h1>SMRT Objects</h1>
	<p class="lead">
		SMRT Objects are the core persistence layer in the SMRT framework. They provide automatic
		database schema generation, AI-powered methods, and lifecycle hooks.
	</p>

	<h2 id="decorator">@smrt() Decorator</h2>
	<p>
		Register a class with the framework to enable auto-generation of APIs, CLI commands, and MCP
		tools.
	</p>
	<pre><code
			>{`import { SmrtObject, smrt } from '@happyvertical/smrt-core';

@smrt({
  api: { include: ['list', 'get', 'create'] },
  mcp: { include: ['list', 'get', 'analyze'] },
  cli: true,
  tableStrategy: 'cti'  // or 'sti' for Single Table Inheritance
})
class Product extends SmrtObject {
  name: string = '';
  price: number = 0.0;
}`}</code
		></pre>

	<h3>Configuration Options</h3>
	<table>
		<thead>
			<tr>
				<th>Option</th>
				<th>Type</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr
				><td><code>name</code></td><td>string</td><td
					>Custom registration name (defaults to class name)</td
				></tr
			>
			<tr><td><code>tableName</code></td><td>string</td><td>Custom database table name</td></tr>
			<tr
				><td><code>tableStrategy</code></td><td>'cti' | 'sti'</td><td
					>Inheritance strategy (default: 'cti')</td
				></tr
			>
			<tr><td><code>api</code></td><td>boolean | object</td><td>REST API generation config</td></tr>
			<tr><td><code>mcp</code></td><td>boolean | object</td><td>MCP tools generation config</td></tr
			>
			<tr
				><td><code>cli</code></td><td>boolean | object</td><td>CLI commands generation config</td
				></tr
			>
			<tr><td><code>ai</code></td><td>object</td><td>AI-callable methods config</td></tr>
			<tr><td><code>hooks</code></td><td>object</td><td>Lifecycle hooks</td></tr>
			<tr><td><code>embeddings</code></td><td>object</td><td>Semantic search config</td></tr>
		</tbody>
	</table>

	<h2 id="field-types">Field Types</h2>
	<p>SMRT supports two patterns for defining fields.</p>

	<h3>TypeScript Types (Primary Pattern)</h3>
	<p>Use TypeScript types for most properties. The AST scanner infers SQL types automatically.</p>
	<pre><code
			>{`class Product extends SmrtObject {
  name: string = '';              // TEXT
  description: string = '';       // TEXT
  quantity: number = 0;           // INTEGER (no decimal)
  price: number = 0.0;            // DECIMAL (has decimal)
  rating: number = 4.5;           // DECIMAL (has decimal)
  active: boolean = true;         // BOOLEAN
  tags: string[] = [];            // JSON
  metadata: Record<string, any> = {}; // JSON
  launchedAt: Date = new Date();  // DATETIME
}`}</code
		></pre>

	<h3>The 0 vs 0.0 Heuristic</h3>
	<p>Numeric default values determine column type:</p>
	<table>
		<thead>
			<tr><th>Pattern</th><th>Column Type</th><th>Reasoning</th></tr>
		</thead>
		<tbody>
			<tr><td><code>count: number = 0</code></td><td>INTEGER</td><td>No decimal point</td></tr>
			<tr><td><code>price: number = 0.0</code></td><td>DECIMAL</td><td>Has decimal point</td></tr>
			<tr><td><code>rating: number = 4.5</code></td><td>DECIMAL</td><td>Has decimal point</td></tr>
			<tr
				><td><code>quantity: number = 1.0</code></td><td>DECIMAL</td><td>Trailing .0 counts</td></tr
			>
		</tbody>
	</table>

	<h3>Field Decorators (When Required)</h3>
	<p>Use decorators for relationships, constraints, or nullable decimals.</p>
	<pre><code
			>{`import { foreignKey, oneToMany, manyToMany, field, meta } from '@happyvertical/smrt-core';

class Order extends SmrtObject {
  // Relationships
  customerId = foreignKey(Customer);
  items = oneToMany(OrderItem);
  tags = manyToMany(Tag, { through: 'order_tags' });

  // Constraints
  @field({ required: true, unique: true, maxLength: 100 })
  orderNumber: string = '';

  // Nullable decimal
  @field({ nullable: true })
  discount: number | null = null;

  // Meta field (STI)
  @meta()
  specialInstructions: string = '';
}`}</code
		></pre>

	<h2 id="inheritance">Inheritance</h2>
	<p>SMRT supports multi-level class inheritance with two strategies.</p>

	<h3>Class Table Inheritance (CTI)</h3>
	<p>Default strategy. Each class gets its own table.</p>
	<pre><code
			>{`@smrt()
class Event extends SmrtObject {
  title: string = '';
  date: Date = new Date();
}

@smrt()
class Meeting extends Event {
  roomNumber: string = '';  // Stored in 'meetings' table
}`}</code
		></pre>

	<h3>Single Table Inheritance (STI)</h3>
	<p>All classes share one table with a discriminator column.</p>
	<pre><code
			>{`@smrt({ tableStrategy: 'sti' })
class Event extends SmrtObject {
  title: string = '';
  date: Date = new Date();
}

@smrt()  // Inherits STI from parent
class Meeting extends Event {
  @meta()  // Stored in _meta_data JSONB
  roomNumber: string = '';
}

@smrt()
class Concert extends Event {
  @meta()
  artist: string = '';
}`}</code
		></pre>

	<h3>Polymorphic Queries</h3>
	<pre><code
			>{`const collection = await EventCollection.create({ db: 'events.db' });

// Returns mixed Meeting, Concert instances
const events = await collection.list({ orderBy: 'date ASC' });

for (const event of events) {
  if (event instanceof Meeting) {
    console.log(event.roomNumber);
  } else if (event instanceof Concert) {
    console.log(event.artist);
  }
}

// Filter by type
const meetings = await collection.list({
  where: { _meta_type: 'Meeting' }
});`}</code
		></pre>

	<h2 id="ai-methods">AI-Powered Methods</h2>
	<p>SmrtObject includes built-in AI methods for evaluation and transformation.</p>

	<h3>is()</h3>
	<p>Evaluate criteria against the object. Returns boolean.</p>
	<pre><code
			>{`const product = await products.get('widget-123');

const isValid = await product.is(\`
  - Has a non-empty description
  - Price is greater than $10
  - Name does not contain profanity
\`);
// Returns: true or false`}</code
		></pre>

	<h3>do()</h3>
	<p>Perform an action based on instructions. Returns string result.</p>
	<pre><code
			>{`const summary = await product.do(\`
  Write a 50-word marketing description.
  Highlight key features and target audience.
\`);
// Returns: "Introducing the premium Widget..."`}</code
		></pre>

	<h3>describe()</h3>
	<p>Generate a description of the object.</p>
	<pre><code
			>{`const description = await product.describe();
// Returns: "A high-quality widget for home improvement..."

const brief = await product.describe({ maxTokens: 50 });
// Returns: "Premium widget, steel construction"`}</code
		></pre>

	<h2 id="migrations">Automatic Migrations</h2>
	<p>Schema evolves with your code. Add a field, SMRT handles the migration.</p>
	<pre><code
			>{`// Before
class Product extends SmrtObject {
  name: string = '';
}

// After - just add the field
class Product extends SmrtObject {
  name: string = '';
  description: string = '';  // New field
  price: number = 0.0;       // New field
}

// On next startup, SMRT automatically:
// - Detects schema changes
// - Generates ALTER TABLE statements
// - Applies migrations safely`}</code
		></pre>

	<h2 id="auto-generated">Auto-Generated Interfaces</h2>
	<p>Define once, get REST APIs, CLI commands, and MCP tools automatically.</p>
	<pre><code
			>{`@smrt({
  api: { include: ['list', 'get', 'create', 'update'] },
  cli: true,
  mcp: true
})
class Product extends SmrtObject {
  name: string = '';
  price: number = 0.0;
}

// You now have:
// REST: GET /api/products, POST /api/products, etc.
// CLI:  smrt product:list, smrt product:create --name "Widget"
// MCP:  product_list, product_create tools for AI agents`}</code
		></pre>

	<h3>Runtime Introspection</h3>
	<p>Query object metadata at runtime for dynamic behavior.</p>
	<pre><code
			>{`// Get field definitions
const fields = Product.getFields();
// { name: { type: 'string' }, price: { type: 'number', decimal: true } }

// Check relationships
const relationships = Product.getRelationships();
// { categoryId: { type: 'foreignKey', target: 'Category' } }

// Generate forms, validate input, build queries dynamically`}</code
		></pre>

	<h2 id="context-memory">Context Memory</h2>
	<p>Objects can remember and recall learned patterns with confidence scoring.</p>
	<pre><code
			>{`// Remember a successful parsing strategy
await document.remember({
  scope: 'parser/html',
  key: 'selector',
  value: { pattern: '.article-content p' },
  confidence: 0.9
});

// Later, recall the strategy
const strategy = await document.recall({
  scope: 'parser/html',
  key: 'selector',
  minConfidence: 0.7
});

// Hierarchical scopes - falls back to parent if specific not found
const strategy = await document.recall({
  scope: 'parser/html/news-site',
  key: 'selector',
  includeAncestors: true  // Checks parser/html/news-site, parser/html, parser
});`}</code
		></pre>

	<h2 id="semantic-search">Semantic Search</h2>
	<p>Find objects by meaning, not just keywords. Configure embeddings on your class.</p>
	<pre><code
			>{`@smrt({
  embeddings: {
    fields: ['title', 'content'],
    provider: 'openai',
    model: 'text-embedding-3-small'
  }
})
class Article extends SmrtObject {
  title: string = '';
  content: string = '';
}

// Search by meaning
const results = await articles.semanticSearch(
  'articles about machine learning trends',
  { limit: 10, minSimilarity: 0.7 }
);

// Find similar articles
const similar = await articles.findSimilar(article, {
  limit: 5,
  excludeSelf: true
});`}</code
		></pre>

	<h2 id="lifecycle-hooks">Lifecycle Hooks</h2>
	<p>Configure hooks in the <code>@smrt()</code> decorator.</p>
	<pre><code
			>{`@smrt({
  hooks: {
    beforeSave: 'validateData',
    afterSave: async (instance) => {
      await notifySubscribers(instance);
    },
    beforeDelete: 'checkDependencies',
    afterDelete: 'cleanupRelated'
  }
})
class Document extends SmrtObject {
  title: string = '';
  wordCount: number = 0;

  async validateData() {
    this.wordCount = this.content.split(/\\s+/).length;
  }

  async checkDependencies() {
    const refs = await this.getReferences();
    if (refs.length > 0) {
      throw new Error('Cannot delete: has references');
    }
  }
}`}</code
		></pre>

	<h3>Available Hooks</h3>
	<table>
		<thead><tr><th>Hook</th><th>Trigger</th></tr></thead>
		<tbody>
			<tr><td><code>beforeSave</code></td><td>Before save() executes</td></tr>
			<tr><td><code>afterSave</code></td><td>After save() completes</td></tr>
			<tr><td><code>beforeCreate</code></td><td>Before first save (new object)</td></tr>
			<tr><td><code>afterCreate</code></td><td>After first save (new object)</td></tr>
			<tr><td><code>beforeUpdate</code></td><td>Before save (existing object)</td></tr>
			<tr><td><code>afterUpdate</code></td><td>After save (existing object)</td></tr>
			<tr><td><code>beforeDelete</code></td><td>Before delete() executes</td></tr>
			<tr><td><code>afterDelete</code></td><td>After delete() completes</td></tr>
		</tbody>
	</table>

	<h2 id="serialization">Serialization</h2>

	<h3>toJSON()</h3>
	<p>
		Framework method handling STI, meta fields, and serialization. <strong>Do not override.</strong>
	</p>

	<h3>transformJSON() Hook</h3>
	<p>Safe customization point for adding computed fields.</p>
	<pre><code
			>{`@smrt()
class Article extends SmrtObject {
  title: string = '';
  body: string = '';

  protected transformJSON(data: any): any {
    return {
      ...data,
      wordCount: this.body.split(/\\s+/).length,
      preview: this.body.substring(0, 100),
      readingTime: Math.ceil(this.body.split(/\\s+/).length / 200)
    };
  }
}`}</code
		></pre>

	<h3>Dangerous Pattern</h3>
	<pre><code
			>{`// DO NOT DO THIS
class Article extends SmrtObject {
  toJSON() {
    return { id: this.id, title: this.title };
    // Missing: _meta_type, _meta_data, other fields
    // Breaks STI and causes "Missing _meta_type discriminator" errors
  }
}

// If you must override, call super first
class Article extends SmrtObject {
  toJSON() {
    const data = super.toJSON();
    return { ...data, custom: 'value' };
  }
}`}</code
		></pre>

	<h2 id="relationships">Relationships</h2>

	<h3>foreignKey</h3>
	<p>Many-to-one relationship. Creates a column with the referenced object's ID.</p>
	<pre><code
			>{`class Order extends SmrtObject {
  customerId = foreignKey(Customer);
}

// Usage
const order = await orders.get('order-123');
const customer = await order.loadRelated('customerId');
console.log(customer.name);`}</code
		></pre>

	<h3>oneToMany</h3>
	<p>One-to-many relationship. No column created; queries via inverse foreign key.</p>
	<pre><code
			>{`class Customer extends SmrtObject {
  orders = oneToMany(Order, { foreignKey: 'customerId' });
}

// Usage
const customer = await customers.get('cust-456');
const orders = await customer.loadRelatedMany('orders');`}</code
		></pre>

	<h3>manyToMany</h3>
	<p>Many-to-many relationship via join table.</p>
	<pre><code
			>{`class Product extends SmrtObject {
  tags = manyToMany(Tag, { through: 'product_tags' });
}`}</code
		></pre>

	<h2 id="best-practices">Best Practices</h2>

	<h3>1. Use TypeScript Types by Default</h3>
	<pre><code
			>{`// Preferred
class Product extends SmrtObject {
  name: string = '';
  price: number = 0.0;
  quantity: number = 0;
}

// Only when necessary
class Product extends SmrtObject {
  @field({ required: true, unique: true })
  sku: string = '';
  categoryId = foreignKey(Category);
}`}</code
		></pre>

	<h3>2. Always Initialize Objects</h3>
	<pre><code
			>{`const product = new Product({ name: 'Widget' });
await product.initialize();  // Required before database operations
await product.save();

// Or use collection.create() which calls initialize automatically
const product = await collection.create({ name: 'Widget' });`}</code
		></pre>

	<h3>3. Keep STI Hierarchies Shallow</h3>
	<pre><code
			>{`// Good: 2 levels
Event
├── Meeting
├── Conference
└── Concert

// Avoid: 3+ levels
Event
└── CorporateEvent
    ├── Meeting
    └── Training`}</code
		></pre>
</article>

<style>
	.prose {
		max-width: 100%;
	}

	.prose h1 {
		font-size: 2.5rem;
		font-weight: 600;
		margin-bottom: 16px;
	}

	.prose .lead {
		font-size: 1.2rem;
		line-height: 1.6;
		color: #444;
		margin-bottom: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid var(--color-grid);
	}

	.prose h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 48px;
		margin-bottom: 16px;
		padding-top: 24px;
		border-top: 1px solid var(--color-grid);
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

	.prose pre {
		background: #1a1a1a;
		color: #f0f0f0;
		padding: 20px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.5;
		margin: 16px 0 24px;
	}

	.prose code {
		font-family: var(--font-mono);
		font-size: 0.9em;
	}

	.prose p code,
	.prose li code,
	.prose td code {
		background: #f5f5f5;
		padding: 2px 6px;
	}

	.prose table {
		width: 100%;
		border-collapse: collapse;
		margin: 16px 0 24px;
		font-size: 0.9rem;
	}

	.prose th,
	.prose td {
		text-align: left;
		padding: 12px;
		border-bottom: 1px solid var(--color-grid);
	}

	.prose th {
		font-weight: 600;
		background: #fafafa;
	}

	.prose strong {
		font-weight: 600;
	}
</style>
