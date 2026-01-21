<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
</script>

<SEO
	title="s-m-r-t Framework"
	description="Full-stack TypeScript framework with AI agents, auto-generated APIs, MCP tools, and CLI commands. Build faster with no vendor lock, adaptability, brevity, and scalability."
	url="https://havesmrt.com"
	type="website"
/>

<StructuredData
	type="Organization"
	data={{
		name: 's-m-r-t Framework',
		url: 'https://havesmrt.com',
		logo: 'https://havesmrt.com/logo.png',
		description:
			'Full-stack TypeScript framework for building AI-powered applications with automatic API generation, CLI tools, and MCP integration.',
		sameAs: ['https://github.com/happyvertical/smrt']
	}}
/>

<StructuredData
	type="SoftwareApplication"
	data={{
		name: 's-m-r-t Framework',
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Linux, macOS, Windows',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		description:
			'Full-stack TypeScript framework with AI agents, auto-generated APIs, MCP tools, and CLI commands.'
	}}
/>

<Grid>
	<section class="example">
		<h3>Simple</h3>
		<p class="example-desc">Extend SmrtObject. That's it.</p>
		<pre><code>{`class Product extends SmrtObject {
  name: string = '';
  price: number = 0.0;    // DECIMAL (inferred from decimal)
  quantity: number = 0;   // INTEGER (inferred from integer)
  categoryId = foreignKey(Category);
}

// That's it. You get:
// - Database schema with migrations
// - REST API endpoints
// - MCP tools for AI agents
// - CLI: smrt product create --name "Widget" --price 9.99
// - AI-powered methods: is(), do(), describe()`}</code></pre>
	</section>

	<section class="hero">
		<div class="tenets">
			<div class="tenet">
				<h2>No vendor lock</h2>
				<p>Abstract away implementation details. Switch SQLite to PostgreSQL without refactoring.</p>
			</div>
			<div class="tenet">
				<h2>Adaptability</h2>
				<p>Evolve as quickly as possible through abstraction.</p>
			</div>
			<div class="tenet">
				<h2>Brevity</h2>
				<p>Agent context focuses on application logic, not implementation boilerplate.</p>
			</div>
			<div class="tenet">
				<h2>Scalability</h2>
				<p>Startup to enterprise seamlessly.</p>
			</div>
		</div>
	</section>

	<section class="example">
		<h3>Advanced</h3>
		<p class="example-desc">Decorators for complex use cases.</p>
		<pre><code>{`@smrt({ api: { rateLimit: 100 }, mcp: { tools: ['search', 'create'] } })
class Invoice extends SmrtObject {
  @field({ index: true, unique: true })
  invoiceNumber: string = '';

  @field({ precision: 2, min: 0 })
  amount: number = 0.0;

  @field({ enum: ['draft', 'sent', 'paid', 'overdue'] })
  status: string = 'draft';

  @field({ encrypted: true })
  notes: string = '';

  @computed()
  get isPastDue() {
    return this.status === 'sent' && this.dueDate < new Date();
  }

  @action({ requiresAuth: true, audit: true })
  async markAsPaid(paymentMethod: string) {
    this.status = 'paid';
    await this.save();
  }
}`}</code></pre>
	</section>

	<!-- OBJECTS SECTION -->
	<section class="section-header">
		<h2>Objects</h2>
		<p>AI-powered data models with built-in persistence, validation, and intelligence.</p>
	</section>

	<section class="example">
		<h3>AI-Powered Methods</h3>
		<p class="example-desc">Validate, transform, and describe content with AI.</p>
		<pre><code>{`// Validate content with AI
const isValid = await article.is("Is this article well-structured?");

// Transform content with AI
const summary = await article.do("Summarize in 3 bullet points");

// Generate descriptions automatically
const description = await product.describe();`}</code></pre>
	</section>

	<section class="example">
		<h3>Vector Embeddings</h3>
		<p class="example-desc">Semantic representations for similarity search.</p>
		<pre><code>{`// Generate embeddings for configured fields
await article.generateEmbeddings();

// Check if content changed since last embedding
if (await article.hasStaleEmbeddings()) {
  await article.generateEmbeddings();
}

// Get embedding vector for a field
const vector = await article.getEmbedding('content');`}</code></pre>
	</section>

	<section class="example">
		<h3>Object Memory</h3>
		<p class="example-desc">Learn patterns, recall them across sessions.</p>
		<pre><code>{`// Remember learned patterns with confidence scores
await scraper.remember({
  scope: 'parser/example.com',
  key: 'content-selector',
  value: '.article-body',
  confidence: 0.95
});

// Recall with hierarchical fallback
const selector = await scraper.recall({
  scope: 'parser/example.com',
  key: 'content-selector',
  includeAncestors: true
});`}</code></pre>
	</section>

	<!-- COLLECTIONS SECTION -->
	<section class="section-header">
		<h2>Collections</h2>
		<p>Query, search, and manage objects with powerful collection operations.</p>
	</section>

	<section class="example">
		<h3>Semantic Search</h3>
		<p class="example-desc">Find by meaning, not keywords.</p>
		<pre><code>{`// Search by text similarity
const results = await articles.semanticSearch('machine learning basics', {
  field: 'content',
  limit: 10,
  minSimilarity: 0.7
});

// Find similar to an existing object
const related = await articles.findSimilar(article, { limit: 5 });`}</code></pre>
	</section>

	<section class="example">
		<h3>Batch Operations</h3>
		<p class="example-desc">Efficient multi-record operations.</p>
		<pre><code>{`// Batch fetch by IDs (single query)
const items = await collection.listByIds(['id1', 'id2', 'id3']);

// Find or create with defaults
const user = await users.getOrUpsert(
  { email: 'user@example.com' },
  { name: 'New User', role: 'member' }
);`}</code></pre>
	</section>

	<section class="example">
		<h3>Interceptors</h3>
		<p class="example-desc">Hook into every operation.</p>
		<pre><code>{`GlobalInterceptors.register({
  name: 'tenancy',
  priority: 100,
  beforeList(className, options, context) {
    return {
      ...options,
      where: { ...options.where, tenantId: getTenantId() }
    };
  }
});`}</code></pre>
	</section>

	<!-- AGENTS SECTION -->
	<section class="section-header">
		<h2>Agents</h2>
		<p>Autonomous actors with full object capabilities and inter-agent communication.</p>
	</section>

	<section class="example">
		<h3>Agent Basics</h3>
		<p class="example-desc">Agents inherit all SmrtObject capabilities.</p>
		<pre><code>{`class Roboto extends Agent {
  topic: string = 'daily-digest';

  async run() {
    // Agents inherit all SmrtObject methods
    const isReady = await this.is('Has valid configuration?');

    // AI-powered content generation
    const summary = await this.do('Summarize today\\'s top stories');

    await this.save(); // Persist state to database
  }
}`}</code></pre>
	</section>

	<section class="example">
		<h3>Inter-Agent Dispatch</h3>
		<p class="example-desc">Async, persistent messaging between agents.</p>
		<pre><code>{`// One agent notifies others
await dispatch.emit('task.completed', {
  taskId: 'task-123',
  result: { items: 42 }
});

// Another agent subscribes with wildcards
await dispatch.subscribe({
  signalType: 'task.*',
  subscriber: 'Roboto'
});

// Process incoming messages (survives restarts)
await dispatch.process('Roboto', async (payload, meta) => {
  await this.handleResult(payload.taskId, payload.result);
});`}</code></pre>
	</section>

	<section class="example">
		<h3>Agent Memory</h3>
		<p class="example-desc">Agents learn and remember across sessions.</p>
		<pre><code>{`class Roboto extends Agent {
  async scrape(url: string) {
    // Try to recall learned selector
    const cached = await this.recall({
      scope: \`parser/\${new URL(url).hostname}\`,
      key: 'content-selector'
    });

    if (cached) return this.extract(url, cached.value);

    // Discover and remember for next time
    const selector = await this.do('Find the article content selector');
    await this.remember({
      scope: \`parser/\${new URL(url).hostname}\`,
      key: 'content-selector',
      value: selector,
      confidence: 0.9
    });
  }
}`}</code></pre>
	</section>
</Grid>

<style>
	.hero {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.tenets {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	.tenet {
		padding: 24px;
		border: 1px solid var(--color-grid);
	}

	.tenet h2 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.tenet p {
		font-size: 0.9rem;
		color: #666;
		line-height: 1.5;
	}

	.section-header {
		grid-column: 1 / -1;
		padding: 48px 0 24px;
		border-bottom: 1px solid var(--color-grid);
	}

	.section-header h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 8px;
	}

	.section-header p {
		font-size: 1rem;
		color: #666;
	}

	.example {
		grid-column: 1 / -1;
		padding: 48px 0;
		border-bottom: 1px solid var(--color-grid);
	}

	.example:last-of-type {
		border-bottom: none;
	}

	.example h3 {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-accent);
		margin-bottom: 8px;
	}

	.example-desc {
		color: #666;
		margin-bottom: 16px;
		font-size: 0.95rem;
	}

	pre {
		background: #1a1a1a;
		color: #f0f0f0;
		padding: 24px;
		overflow-x: auto;
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1.6;
	}

	@media (max-width: 900px) {
		.tenets {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 500px) {
		.tenets {
			grid-template-columns: 1fr;
		}
	}
</style>
