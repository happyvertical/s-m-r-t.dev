<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
</script>

<SEO
	title="s-m-r-t Framework"
	description="Agentic Application Framework for building AI-powered applications. Model-agnostic, event-driven architecture with no vendor lock."
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
			'Agentic Application Framework for building AI-powered applications.',
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
			'Agentic Application Framework for building AI-powered applications.'
	}}
/>

<Grid>
	<!-- Hero Section -->
	<section class="hero-enterprise">
		<div class="hero-content">
			<h1>Agentic Application Framework</h1>
			<p class="hero-subtitle">
				Build AI-powered applications with model-agnostic architecture, 
				event-driven messaging, and zero vendor lock.
			</p>
			<div class="hero-ctas">
				<a href="/docs" class="cta-primary">Get Started</a>
				<a href="/modules" class="cta-secondary">Explore Modules</a>
			</div>
		</div>
	</section>

	<!-- Quick Start -->
	<section class="hero">
		<div class="quick-start">
			<h2>Quick Start</h2>
			<pre class="quick-start-code"><code>npm install @happyvertical/smrt-core

import &#123; SmrtObject, smrt &#125; from '@happyvertical/smrt-core';

@smrt()
class Task extends SmrtObject &#123;
  title: string = '';
  completed: boolean = false;
&#125;

const tasks = await TaskCollection.create(&#123; db: 'tasks.db' &#125;);
const task = await tasks.create(&#123; title: 'Learn SMRT' &#125;);</code></pre>
			<div class="quick-start-links">
				<a href="/docs/getting-started">Installation Guide →</a>
				<a href="/docs/objects">Objects API →</a>
				<a href="/docs/collections">Collections API →</a>
			</div>
		</div>
	</section>

	<!-- Simple/Advanced Examples -->
	<section class="section-header">
		<h2>Core Framework</h2>
		<p>Everything you need to build, deploy, and scale business logic with AI.</p>
	</section>

	<section class="example">
		<h3>Simple</h3>
		<p class="example-desc">Extend SmrtObject. That's it.</p>
		<pre><code
				>{`class Product extends SmrtObject {
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
// - AI-powered methods: is(), do(), describe()`}</code
			></pre>
	</section>

	<section class="example">
		<h3>Advanced</h3>
		<p class="example-desc">Decorators for complex use cases.</p>
		<pre><code
				>{`@smrt({ api: { rateLimit: 100 }, mcp: { tools: ['search', 'create'] } })
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
}`}</code
			></pre>
	</section>

	<!-- Objects Section -->
	<section class="section-header">
		<h2>Objects</h2>
		<p>AI-powered data models with built-in persistence, validation, and intelligence.</p>
	</section>

	<section class="example">
		<h3>AI-Powered Methods</h3>
		<p class="example-desc">Validate, transform, and describe content with AI.</p>
		<pre><code
				>{`// Validate content with AI
const isValid = await article.is("Is this article well-structured?");

// Transform content with AI
const summary = await article.do("Summarize in 3 bullet points");

// Generate descriptions automatically
const description = await product.describe();`}</code
			></pre>
	</section>

	<section class="example">
		<h3>Vector Embeddings</h3>
		<p class="example-desc">Semantic representations for similarity search.</p>
		<pre><code
				>{`// Generate embeddings for configured fields
await article.generateEmbeddings();

// Check if content changed since last embedding
if (await article.hasStaleEmbeddings()) {
  await article.generateEmbeddings();
}

// Get embedding vector for a field
const vector = await article.getEmbedding('content');`}</code
			></pre>
	</section>

	<section class="example">
		<h3>Object Memory</h3>
		<p class="example-desc">Learn patterns, recall them across sessions.</p>
		<pre><code
				>{`// Remember learned patterns with confidence scores
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
});`}</code
			></pre>
	</section>

	<!-- Collections Section -->
	<section class="section-header">
		<h2>Collections</h2>
		<p>Query, search, and manage objects with powerful collection operations.</p>
	</section>

	<section class="example">
		<h3>Semantic Search</h3>
		<p class="example-desc">Find by meaning, not keywords.</p>
		<pre><code
				>{`// Search by text similarity
const results = await articles.semanticSearch('machine learning basics', {
  field: 'content',
  limit: 10,
  minSimilarity: 0.7
});

// Find similar to an existing object
const related = await articles.findSimilar(article, { limit: 5 });`}</code
			></pre>
	</section>

	<section class="example">
		<h3>Batch Operations</h3>
		<p class="example-desc">Efficient multi-record operations.</p>
		<pre><code
				>{`// Batch fetch by IDs (single query)
const items = await collection.listByIds(['id1', 'id2', 'id3']);

// Find or create with defaults
const user = await users.getOrUpsert(
  { email: 'user@example.com' },
  { name: 'New User', role: 'member' }
);`}</code
			></pre>
	</section>

	<!-- Agents Section -->
	<section class="section-header">
		<h2>Agents</h2>
		<p>Autonomous actors with full object capabilities and inter-agent communication.</p>
	</section>

	<section class="example">
		<h3>Inter-Agent Dispatch</h3>
		<p class="example-desc">Async, persistent messaging between agents.</p>
		<pre><code
				>{`// One agent notifies others
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
});`}</code
			></pre>
	</section>
</Grid>

<style>
	/* Hero Section */
	.hero-enterprise {
		grid-column: 1 / -1;
		padding: 64px 0 32px;
		text-align: center;
	}

	.hero-content h1 {
		font-size: 3rem;
		font-weight: 700;
		margin-bottom: 24px;
		color: var(--smrt-color-on-background, #1a1a1a);
		line-height: 1.2;
	}

	.hero-subtitle {
		font-size: 1.25rem;
		color: var(--smrt-color-on-background-variant, #666);
		max-width: 700px;
		margin: 0 auto 32px;
		line-height: 1.6;
	}

	.hero-ctas {
		display: flex;
		gap: 16px;
		justify-content: center;
	}

	.cta-primary {
		display: inline-block;
		padding: 12px 24px;
		background: var(--smrt-color-primary, #1976d2);
		color: var(--smrt-color-on-primary, #ffffff);
		text-decoration: none;
		border-radius: var(--smrt-radius-md, 8px);
		font-weight: 500;
		transition: background 0.15s ease;
	}

	.cta-primary:hover {
		background: var(--smrt-color-primary-container, #1565c0);
	}

	.cta-secondary {
		display: inline-block;
		padding: 12px 24px;
		background: transparent;
		color: var(--smrt-color-primary, #1976d2);
		text-decoration: none;
		border-radius: var(--smrt-radius-md, 8px);
		font-weight: 500;
		border: 1px solid var(--smrt-color-outline, #e5e5e5);
		transition: background 0.15s ease;
	}

	.cta-secondary:hover {
		background: var(--smrt-color-surface-container-low, #fafafa);
	}

	/* Quick Start Section */
	.hero {
		grid-column: 1 / -1;
		padding: 32px 0;
	}

	.quick-start {
		padding: 32px;
		background: var(--smrt-color-surface, #ffffff);
		border: 1px solid var(--smrt-color-outline, #e5e5e5);
		border-radius: var(--smrt-shape-medium, 8px);
	}

	.quick-start h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 16px;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.quick-start-code {
		background: var(--smrt-color-surface-variant, #1a1a1a);
		color: var(--smrt-color-on-surface-variant, #f0f0f0);
		padding: 20px;
		overflow-x: auto;
		font-family: var(--smrt-font-family-mono, monospace);
		font-size: 0.85rem;
		line-height: 1.6;
		border-radius: var(--smrt-shape-medium, 8px);
		margin-bottom: 16px;
	}

	.quick-start-links {
		display: flex;
		gap: 24px;
		flex-wrap: wrap;
	}

	.quick-start-links a {
		color: var(--smrt-color-primary, #1976d2);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.9rem;
	}

	.quick-start-links a:hover {
		text-decoration: underline;
	}

	/* Section Headers */
	.section-header {
		grid-column: 1 / -1;
		padding: 48px 0 16px;
	}

	.section-header h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 8px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.section-header p {
		font-size: 1rem;
		color: var(--smrt-color-on-background-variant, #666);
	}

	/* Examples */
	.example {
		grid-column: 1 / -1;
		padding: 24px 0;
	}

	section:last-of-type {
		padding-bottom: 64px;
	}

	.example h3 {
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--smrt-color-primary, #1976d2);
		margin-bottom: 8px;
	}

	.example-desc {
		color: var(--smrt-color-on-background-variant, #666);
		margin-bottom: 16px;
		font-size: 0.95rem;
	}

	pre {
		background: var(--smrt-color-surface-variant, #1a1a1a);
		color: var(--smrt-color-on-surface-variant, #f0f0f0);
		padding: 24px;
		overflow-x: auto;
		font-family: var(--smrt-font-family-mono, monospace);
		font-size: 0.85rem;
		line-height: 1.6;
		border-radius: var(--smrt-shape-medium, 8px);
	}

	/* Responsive */
	@media (max-width: 900px) {
		.hero-content h1 {
			font-size: 2.25rem;
		}
	}

	@media (max-width: 500px) {
		.tenets {
			grid-template-columns: 1fr;
		}

		.hero-content h1 {
			font-size: 1.75rem;
		}

		.hero-ctas {
			flex-direction: column;
		}
	}
</style>
