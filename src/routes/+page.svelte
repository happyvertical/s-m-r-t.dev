<script lang="ts">
	import Grid from '$lib/components/Grid.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import StructuredData from '$lib/components/StructuredData.svelte';
</script>

<SEO
	title="s-m-r-t Framework"
	description="The Business Logic Operating System. Future-proof AI infrastructure with built-in governance, audit trails, and event-driven agentic architecture. Deploy on-premise, VPC, or cloud."
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
			'The Business Logic Operating System. Future-proof AI infrastructure with built-in governance, audit trails, and event-driven agentic architecture.',
		sameAs: ['https://github.com/happyvertical/smrt']
	}}
/>

<StructuredData
	type="SoftwareApplication"
	data={{
		name: 's-m-r-t Framework',
		applicationCategory: 'BusinessApplication',
		operatingSystem: 'Linux, macOS, Windows',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		description:
			'The Business Logic Operating System. Future-proof AI infrastructure with built-in governance and audit trails.'
	}}
/>

<Grid>
	<!-- Enterprise Hero Section -->
	<section class="hero-enterprise">
		<div class="hero-content">
			<h1>The Business Logic Operating System</h1>
			<p class="hero-subtitle">
				Future-proof your AI infrastructure. Built-in governance, audit trails, and event-driven 
				architecture for enterprise-scale deployments.
			</p>
			<div class="hero-ctas">
				<a href="/docs" class="cta-primary">Get Started</a>
				<a href="/modules" class="cta-secondary">Explore Modules</a>
			</div>
		</div>
	</section>

	<!-- Enterprise Pillars -->
	<section class="hero">
		<div class="tenets">
			<div class="tenet">
				<h2>AI Future-Proofing</h2>
				<p>
					Model-agnostic architecture. Switch from OpenAI to Llama 3, Anthropic, or self-hosted 
					models without rewriting business logic.
				</p>
			</div>
			<div class="tenet">
				<h2>Governance Ready</h2>
				<p>
					Built-in audit trails, field-level encryption for PII, and compliance hooks. 
					Security team approved.
				</p>
			</div>
			<div class="tenet">
				<h2>Event-Driven Scale</h2>
				<p>
					Persistent inter-agent messaging with guaranteed delivery. Survives restarts, 
					handles retries automatically.
				</p>
			</div>
			<div class="tenet">
				<h2>Legacy Compatible</h2>
				<p>
					Headless architecture integrates with existing systems via REST APIs. 
					Use the framework as a backend for any frontend.
				</p>
			</div>
		</div>
	</section>

	<!-- Governance Section -->
	<section class="section-header">
		<h2>Built-in Governance</h2>
		<p>
			Enterprise security and compliance features that don't get in the way of development.
		</p>
	</section>

	<section class="example">
		<h3>Audit & Compliance</h3>
		<p class="example-desc">
			Every action tracked. Every change logged. Integrates with Datadog, ELK, or your existing 
			SIEM infrastructure.
		</p>
		<pre><code
				>{`@smrt({ audit: { enabled: true, retention: '7years' } })
class FinancialRecord extends SmrtObject {
  @field({ encrypted: true, pii: true })
  ssn: string = '';  // Encrypted at rest, audit-logged access

  @field({ encrypted: true })
  bankAccount: string = '';

  @action({ audit: true, requiresAuth: true, roles: ['finance'] })
  async processPayment(amount: number) {
    // Every call logged with user, timestamp, before/after state
    await this.recordAudit('payment.processed', { amount });
    return await this.executePayment(amount);
  }
}`}</code
			></pre>
	</section>

	<section class="example">
		<h3>Deterministic AI</h3>
		<p class="example-desc">
			Enforce structured outputs from LLMs. JSON Schema validation for every AI interaction.
		</p>
		<pre><code
				>{`// Enforce structured output schemas
const analysis = await invoice.analyze({
  schema: {
    riskLevel: 'low|medium|high',
    anomalies: 'string[]',
    confidence: 'number'
  }
});

// Deterministic classification
const category = await document.classify({
  options: ['invoice', 'receipt', 'contract', 'other'],
  requireConfidence: 0.9  // Retry if uncertain
});

// Validated extraction
const entities = await email.extract({
  schema: {
    sender: { type: 'string', required: true },
    amount: { type: 'number', min: 0 },
    dueDate: { type: 'date' }
  }
});`}</code
			></pre>
	</section>

	<!-- AI Infrastructure Section -->
	<section class="section-header">
		<h2>AI Infrastructure Future-Proofing</h2>
		<p>
			Abstract away model providers. Your business logic stays stable while AI technologies evolve.
		</p>
	</section>

	<section class="example">
		<h3>Model Agnostic by Design</h3>
		<p class="example-desc">
			Switch providers without code changes. Self-host for sensitive data. Use cloud for speed.
		</p>
		<pre><code
				>{`// Configure once, deploy anywhere
const config = {
  ai: {
    // Start with OpenAI
    provider: 'openai',
    model: 'gpt-4',
    
    // Switch to Anthropic
    // provider: 'anthropic',
    // model: 'claude-3-opus',
    
    // Or self-hosted for air-gapped environments
    // provider: 'ollama',
    // model: 'llama3:70b',
    // endpoint: 'http://internal.ai:11434'
  }
};

// Same code works everywhere
const summary = await document.do('Summarize key points');`}</code
			></pre>
	</section>

	<!-- Event-Driven Architecture -->
	<section class="section-header">
		<h2>Event-Driven Agentic Architecture</h2>
		<p>
			Reliable, decoupled, and resilient. Handle long-running tasks, retries, and failures automatically.
		</p>
	</section>

	<section class="example">
		<h3>Inter-Agent Dispatch</h3>
		<p class="example-desc">
			Persistent messaging with guaranteed delivery. Your agents communicate reliably, even across restarts.
		</p>
		<pre><code
				>{`// Publish events without worrying about subscribers
await dispatch.emit('invoice.processed', {
  invoiceId: 'INV-2024-001',
  amount: 50000,
  customerTier: 'enterprise'
});

// Subscribe with wildcards for flexible routing
await dispatch.subscribe({
  signalType: 'invoice.*',  // Matches invoice.created, invoice.paid, etc.
  subscriber: 'BillingAgent'
});

// Reliable processing with automatic retry
await dispatch.process('BillingAgent', async (payload, meta) => {
  // If this fails, it's retried with exponential backoff
  // If it crashes mid-process, it resumes on restart
  await this.updateRevenueRecognition(payload);
}, { 
  maxRetries: 5,
  deadLetterQueue: true  // Failures go to DLQ for analysis
});`}</code
			></pre>
	</section>

	<!-- Observability Section -->
	<section class="section-header">
		<h2>Production Observability</h2>
		<p>
			Built for 3 AM debugging sessions. Structured logging, OpenTelemetry integration, and distributed tracing.
		</p>
	</section>

	<section class="example">
		<h3>Structured Logging & Traces</h3>
		<p class="example-desc">
			Every operation traced. Every decision logged. Debug production issues with confidence.
		</p>
		<pre><code
				>{`@smrt({ 
  observability: {
    opentelemetry: { enabled: true },
    structuredLogs: true,
    traceAiCalls: true,
    metrics: ['latency', 'token_usage', 'error_rate']
  }
})
class SupportAgent extends Agent {
  async handleTicket(ticket: Ticket) {
    // Automatic span creation
    this.logger.info('Processing ticket', { 
      ticketId: ticket.id,
      priority: ticket.priority,
      customerTier: ticket.customer.tier
    });
    
    // AI calls automatically traced with token counts
    const sentiment = await ticket.analyzeSentiment();
    
    // Performance metrics emitted automatically
    await this.routeToTeam(ticket, sentiment);
  }
}`}</code
			></pre>
	</section>

	<!-- Deployment Section -->
	<section class="section-header">
		<h2>Enterprise Deployment</h2>
		<p>
			VPC, on-premise, air-gapped, or cloud. Your infrastructure, your rules.
		</p>
	</section>

	<section class="example">
		<h3>Deployment Patterns</h3>
		<p class="example-desc">
			Run anywhere. From startup SaaS to classified government networks.
		</p>
		<pre><code
				>{`// Public Cloud
const prod = await App.create({
  db: { type: 'postgres', url: process.env.DATABASE_URL },
  ai: { provider: 'openai', apiKey: process.env.OPENAI_KEY }
});

// VPC with PrivateLink
const vpc = await App.create({
  db: { type: 'postgres', host: '10.0.1.10' },
  ai: { 
    provider: 'bedrock',  // AWS PrivateLink
    vpcEndpoint: 'com.amazonaws.vpce...'
  }
});

// Air-gapped / On-premise
const classified = await App.create({
  db: { type: 'postgres', host: 'internal-db.local' },
  ai: { 
    provider: 'ollama',
    endpoint: 'http://ai-cluster.local:11434',
    model: 'llama3:70b'  // Self-hosted
  }
});`}</code
			></pre>
	</section>

	<!-- Core Features (Retained) -->
	<section class="section-header">
		<h2>Core Framework</h2>
		<p>
			Everything you need to build, deploy, and scale business logic with AI.
		</p>
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
		<p class="example-desc">Governance, security, and observability built-in.</p>
		<pre><code
				>{`@smrt({
  api: { rateLimit: 100 },
  mcp: { tools: ['search', 'create'] },
  audit: { enabled: true, retention: '7years' }
})
class Invoice extends SmrtObject {
  @field({ index: true, unique: true })
  invoiceNumber: string = '';

  @field({ precision: 2, min: 0 })
  amount: number = 0.0;

  @field({ enum: ['draft', 'sent', 'paid', 'overdue'] })
  status: string = 'draft';

  // Governance: encrypted PII
  @field({ encrypted: true, pii: true })
  customerTaxId: string = '';

  @field({ encrypted: true })
  notes: string = '';

  @computed()
  get isPastDue() {
    return this.status === 'sent' && this.dueDate < new Date();
  }

  // Governance: audit trail + RBAC
  @action({ requiresAuth: true, audit: true, roles: ['finance', 'admin'] })
  async markAsPaid(paymentMethod: string) {
    this.status = 'paid';
    await this.save();
  }

  // Deterministic AI with structured output
  async analyzeRisk() {
    return await this.analyze({
      schema: {
        riskLevel: 'low|medium|high|critical',
        anomalies: 'string[]',
        confidence: 'number'
      }
    });
  }
}`}</code
			></pre>
	</section>
</Grid>

<style>
	/* Enterprise Hero Section */
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

	/* Tenets Section */
	.hero {
		grid-column: 1 / -1;
		padding: 32px 0;
	}

	.tenets {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}

	.tenet {
		padding: 24px;
		background: var(--smrt-color-surface, #ffffff);
		border: 1px solid var(--smrt-color-outline, #e5e5e5);
		border-radius: var(--smrt-shape-medium, 8px);
	}

	.tenet h2 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 8px;
		color: var(--smrt-color-on-surface, #1a1a1a);
	}

	.tenet p {
		font-size: 0.9rem;
		color: var(--smrt-color-on-surface-variant, #666);
		line-height: 1.5;
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
		.tenets {
			grid-template-columns: repeat(2, 1fr);
		}

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
