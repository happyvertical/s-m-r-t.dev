<svelte:head>
	<title>Collections | s-m-r-t Documentation</title>
</svelte:head>

<article class="prose">
	<h1>SMRT Collections</h1>
	<p class="lead">
		SmrtCollection provides a standardized interface for managing sets of persistent SmrtObject
		instances. It handles database setup, schema generation, and provides a fluent API for querying
		objects.
	</p>

	<h2>Creating Collections</h2>

	<h3>Static Factory (Required)</h3>
	<p>
		Collections <strong>must</strong> be created using the static <code>create()</code> factory method.
	</p>
	<pre><code
			>{`import { SmrtCollection, SmrtObject, smrt } from '@happyvertical/smrt-core';

@smrt()
class Product extends SmrtObject {
  name: string = '';
  price: number = 0.0;
}

class ProductCollection extends SmrtCollection<Product> {
  static readonly _itemClass = Product;
}

// Create collection via static factory
const products = await ProductCollection.create({
  db: { type: 'sqlite', url: 'products.db' },
  ai: { provider: 'openai', apiKey: process.env.OPENAI_API_KEY }
});

// Wrong - constructor is protected
const collection = new ProductCollection(options); // Error`}</code
		></pre>

	<h2>CRUD Operations</h2>

	<h3>Create</h3>
	<p>Creates a new object instance, generates an ID, and saves to database.</p>
	<pre><code
			>{`const product = await products.create({
  name: 'Widget',
  price: 29.99
});
// product.id is now a UUID
// product is saved to database`}</code
		></pre>

	<p>For STI (Single Table Inheritance) classes, specify <code>_meta_type</code>:</p>
	<pre><code
			>{`const meeting = await events.create({
  _meta_type: 'Meeting',
  title: 'Team Standup',
  roomNumber: '101'
});`}</code
		></pre>

	<h3>Get</h3>
	<p>Retrieves a single object by ID, slug, or filter criteria.</p>
	<pre><code
			>{`// By UUID
const product = await products.get('uuid-123-456');

// By slug
const product = await products.get('widget-pro');

// By filter
const product = await products.get({ name: 'Widget' });`}</code
		></pre>

	<h3>Update</h3>
	<p>Objects are updated via the <code>save()</code> method after modification:</p>
	<pre><code
			>{`const product = await products.get('uuid-123');
product.price = 39.99;
await product.save();`}</code
		></pre>

	<h3>Delete</h3>
	<pre><code
			>{`const product = await products.get('uuid-123');
await product.delete();`}</code
		></pre>

	<h3>getOrUpsert</h3>
	<p>Get existing object or create if not found:</p>
	<pre><code
			>{`const product = await products.getOrUpsert(
  { slug: 'widget-pro', context: '/products' },
  { name: 'Widget Pro', price: 49.99 }  // defaults for new object
);`}</code
		></pre>

	<h2>Querying</h2>

	<h3>list()</h3>
	<p>Query objects with filtering, sorting, and pagination.</p>
	<pre><code
			>{`const results = await products.list({
  where: { status: 'active' },
  orderBy: 'created_at DESC',
  limit: 20,
  offset: 0
});`}</code
		></pre>

	<h3>WHERE Operators</h3>
	<p>Operators are specified in the field name:</p>
	<table>
		<thead><tr><th>Operator</th><th>Example</th><th>SQL</th></tr></thead>
		<tbody>
			<tr
				><td><code>=</code> (default)</td><td><code>{`{ status: 'active' }`}</code></td><td
					>status = 'active'</td
				></tr
			>
			<tr
				><td><code>&gt;</code></td><td><code>{`{ 'price >': 100 }`}</code></td><td
					>price &gt; 100</td
				></tr
			>
			<tr
				><td><code>&lt;</code></td><td><code>{`{ 'price <': 50 }`}</code></td><td>price &lt; 50</td
				></tr
			>
			<tr
				><td><code>&gt;=</code></td><td><code>{`{ 'stock >=': 10 }`}</code></td><td
					>stock &gt;= 10</td
				></tr
			>
			<tr
				><td><code>&lt;=</code></td><td><code>{`{ 'rating <=': 4.5 }`}</code></td><td
					>rating &lt;= 4.5</td
				></tr
			>
			<tr
				><td><code>!=</code></td><td><code>{`{ 'deleted_at !=': null }`}</code></td><td
					>deleted_at != NULL</td
				></tr
			>
			<tr
				><td><code>in</code></td><td><code>{`{ 'category in': ['A', 'B'] }`}</code></td><td
					>category IN ('A', 'B')</td
				></tr
			>
			<tr
				><td><code>like</code></td><td><code>{`{ 'name like': '%widget%' }`}</code></td><td
					>name LIKE '%widget%'</td
				></tr
			>
		</tbody>
	</table>

	<h3>Sorting</h3>
	<pre><code
			>{`// Single field
await products.list({ orderBy: 'price DESC' });

// Multiple fields
await products.list({ orderBy: ['category ASC', 'price DESC'] });`}</code
		></pre>

	<h3>Pagination</h3>
	<pre><code
			>{`await products.list({
  limit: 20,
  offset: 40  // Skip first 40 records
});`}</code
		></pre>

	<h3>count()</h3>
	<pre><code
			>{`const total = await products.count({});
const active = await products.count({ where: { status: 'active' } });`}</code
		></pre>

	<h2>Batch Operations</h2>

	<h3>listByIds()</h3>
	<p>Fetch multiple objects by ID in a single query:</p>
	<pre><code
			>{`// Single query, not N queries
const profiles = await profileCollection.listByIds([
  'id-1', 'id-2', 'id-3', 'id-4', 'id-5'
]);`}</code
		></pre>

	<h2>N+1 Query Prevention</h2>

	<h3>Eager Loading</h3>
	<p>Use <code>include</code> to pre-load relationships in a single query:</p>
	<pre><code
			>{`// N+1 problem: 1 + 100 queries
const orders = await orderCollection.list({ limit: 100 });
for (const order of orders) {
  await order.loadRelated('customerId'); // 100 separate queries
}

// Solution: 1 query with JOINs
const orders = await orderCollection.list({
  limit: 100,
  include: ['customerId', 'productId']
});

for (const order of orders) {
  const customer = order.getRelated('customerId'); // Already loaded
  const product = order.getRelated('productId');   // Already loaded
}`}</code
		></pre>

	<h3>listByIds Pattern</h3>
	<p>When you have a list of IDs from another query:</p>
	<pre><code
			>{`// Get all customer IDs from orders
const customerIds = orders.map(o => o.customerId);

// Single batched query
const customers = await customerCollection.listByIds(customerIds);

// Build lookup map
const customerMap = new Map(customers.map(c => [c.id, c]));`}</code
		></pre>

	<h2>Raw SQL Queries</h2>
	<p>For complex queries that the standard API cannot express:</p>
	<pre><code
			>{`// NOT EXISTS pattern
const meetingsWithoutRecaps = await meetingCollection.query(\`
  SELECT m.* FROM meetings m
  WHERE m.start_date < datetime('now')
  AND NOT EXISTS (
    SELECT 1 FROM contents c
    WHERE c.meeting_id = m.id
    AND c._meta_type = 'MeetingRecap'
  )
  ORDER BY m.start_date DESC
  LIMIT ?
\`, [10]);

// JOIN query
const products = await productCollection.query(\`
  SELECT p.* FROM products p
  INNER JOIN categories c ON p.category_id = c.id
  WHERE c.name = ? AND p.price > ?
  ORDER BY p.price ASC
\`, ['Electronics', 100]);`}</code
		></pre>

	<h2>Database Adapters</h2>
	<p>SMRT supports three database backends:</p>

	<h3>SQLite</h3>
	<p>Default adapter. Uses LibSQL client.</p>
	<pre><code
			>{`const collection = await ProductCollection.create({
  db: { type: 'sqlite', url: 'products.db' }
});

// In-memory
const collection = await ProductCollection.create({
  db: { type: 'sqlite', url: ':memory:' }
});

// Remote LibSQL/Turso
const collection = await ProductCollection.create({
  db: {
    type: 'sqlite',
    url: 'libsql://your-db.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN
  }
});`}</code
		></pre>

	<h3>PostgreSQL</h3>
	<pre><code
			>{`const collection = await ProductCollection.create({
  db: { type: 'postgres', url: 'postgres://user:pass@host:5432/db' }
});`}</code
		></pre>

	<h3>DuckDB / JSON</h3>
	<pre><code
			>{`const collection = await ProductCollection.create({
  db: {
    type: 'json',
    url: './data',
    writeStrategy: 'immediate'
  }
});`}</code
		></pre>

	<h2>Transactions</h2>

	<h3>Callback-based Transactions</h3>
	<pre><code
			>{`await db.transaction(async (tx) => {
  await tx.insert('orders', { id: 'ord-1', total: 100 });
  await tx.insert('order_items', { orderId: 'ord-1', product: 'Widget' });
  // Commits on success, rolls back on error
});`}</code
		></pre>

	<h3>Manual Transaction Control</h3>
	<pre><code
			>{`const tx = await db.beginTransaction();
try {
  await tx.insert('orders', { id: 'ord-1', total: 100 });
  await tx.insert('order_items', { orderId: 'ord-1', product: 'Widget' });
  await tx.commit();
} catch (error) {
  await tx.rollback();
  throw error;
}`}</code
		></pre>

	<h2>Context Memory</h2>
	<p>Collections can store learned patterns for reuse:</p>
	<pre><code
			>{`// Remember a parsing strategy
await documentCollection.remember({
  scope: 'parser/default',
  key: 'selector',
  value: { pattern: '.content article' },
  confidence: 0.8
});

// Recall with confidence threshold
const strategy = await documentCollection.recall({
  scope: 'parser/default',
  key: 'selector',
  minConfidence: 0.5
});

// Recall with ancestor fallback
const strategy = await documentCollection.recall({
  scope: 'parser/specific',
  key: 'selector',
  includeAncestors: true  // Falls back to parser/, then global
});`}</code
		></pre>

	<h2>Semantic Search</h2>
	<p>For collections with embedding configuration:</p>
	<pre><code
			>{`@smrt({
  embeddings: {
    fields: ['content', 'title'],
    dimensions: 1536,
    provider: 'openai'
  }
})
class Article extends SmrtObject {
  title: string = '';
  content: string = '';
}

// Search by text
const results = await articles.semanticSearch('machine learning trends', {
  limit: 10,
  minSimilarity: 0.7
});

// Find similar objects
const similar = await articles.findSimilar(article, {
  limit: 5,
  excludeSelf: true
});`}</code
		></pre>

	<h2>Best Practices</h2>

	<h3>1. Always Use Static Factory</h3>
	<pre><code
			>{`// Correct
const collection = await MyCollection.create(options);

// Wrong
const collection = new MyCollection(options);`}</code
		></pre>

	<h3>2. Define _itemClass</h3>
	<pre><code
			>{`class MyCollection extends SmrtCollection<MyObject> {
  static readonly _itemClass = MyObject; // Required
}`}</code
		></pre>

	<h3>3. Use listByIds for Batch Lookups</h3>
	<pre><code
			>{`// Good - single query
const profiles = await profileCollection.listByIds(ids);

// Bad - N queries
for (const id of ids) {
  const profile = await profileCollection.get(id);
}`}</code
		></pre>

	<h3>4. Use include for Relationships</h3>
	<pre><code
			>{`// Good - pre-loaded
const orders = await orderCollection.list({
  include: ['customerId']
});

// Bad - N+1
const orders = await orderCollection.list({});
for (const order of orders) {
  await order.loadRelated('customerId');
}`}</code
		></pre>

	<h3>5. Share Database Connections</h3>
	<pre><code
			>{`// Parent creates database
const parent = await ParentCollection.create({ db: 'app.db' });

// Child shares connection
const child = await ChildCollection.create({ db: parent.options.db });`}</code
		></pre>
</article>
