<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
</script>

<SEO
	title="SMRT Framework"
	description="Full-stack TypeScript framework with AI agents, auto-generated APIs, MCP tools, and CLI commands. Build faster with no vendor lock, adaptability, brevity, and scalability."
	url="https://havesmrt.com"
	type="website"
/>

<StructuredData
	type="Organization"
	data={{
		name: 'SMRT Framework',
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
		name: 'SMRT Framework',
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
