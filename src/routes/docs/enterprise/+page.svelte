<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
	title="Enterprise Guide - s-m-r-t Framework"
	description="Enterprise deployment patterns, governance features, observability, and AI infrastructure future-proofing for the s-m-r-t Framework."
	url="https://havesmrt.com/docs/enterprise"
	type="article"
/>

<h1>Enterprise Guide</h1>

<p class="lead">
	s-m-r-t is built for enterprise scale. From built-in governance and audit trails to air-gapped 
	deployments, the framework provides the security, observability, and future-proofing that 
	enterprise teams require.
</p>

<h2 id="governance">Built-in Governance</h2>

<p>
	Data protection and compliance aren't afterthoughts—they're core to the framework's design. 
	Every field, action, and interaction can be secured, audited, and controlled.
</p>

<h3>Field-Level Encryption</h3>

<p>
	Mark any field as encrypted and it will be automatically encrypted at rest. The framework 
	uses industry-standard AES-256 encryption with keys managed via your existing infrastructure 
	(AWS KMS, HashiCorp Vault, or environment variables).
</p>

<pre><code>{`@smrt()
class Customer extends SmrtObject {
  name: string = '';
  email: string = '';

  @field({ encrypted: true, pii: true })
  ssn: string = '';

  @field({ encrypted: true, pii: true })
  dateOfBirth: string = '';

  @field({ encrypted: true })
  bankAccountNumber: string = '';
}

// Encrypted fields are transparently handled
const customer = await Customer.get('cust-123');
console.log(customer.ssn); // Decrypted automatically: "123-45-6789"
await customer.save();     // Re-encrypted before storage`}</code></pre>

<h3>Comprehensive Audit Trails</h3>

<p>
	Every action can be logged with full context—who performed it, when, what changed, and why. 
	Integrate with your existing SIEM or use the built-in audit log storage.
</p>

<pre><code>{`@smrt({ audit: { enabled: true, retention: '7years' } })
class FinancialTransaction extends SmrtObject {
  @field()
  amount: number = 0;

  @field({ enum: ['pending', 'completed', 'reversed'] })
  status: string = 'pending';

  @action({ audit: true, requiresAuth: true })
  async reverse(reason: string) {
    // Automatically logged with:
    // - User who performed the action
    // - Timestamp
    // - Before/after values
    // - Reason provided
    this.status = 'reversed';
    await this.save();
  }
}

// Query audit history
const audits = await FinancialTransaction.getAudits({
  objectId: 'txn-123',
  since: new Date('2024-01-01')
});
// Returns: [{ user: 'alice@corp.com', action: 'reverse', 
//            before: {status: 'completed'}, after: {status: 'reversed'}, 
//            timestamp: '...', reason: 'Customer request' }]`}</code></pre>

<h3>Role-Based Access Control</h3>

<p>
	Actions can be restricted to specific roles, with automatic integration into your 
	authentication system.
</p>

<pre><code>{`@action({ 
  requiresAuth: true,
  roles: ['finance', 'admin'],
  permissions: ['transactions.write']
})
async processRefund(amount: number, reason: string) {
  // Only executes if the authenticated user has:
  // - 'finance' OR 'admin' role
  // - 'transactions.write' permission
  await this.createRefundTransaction(amount, reason);
}`}</code></pre>

<h2 id="deployment">Deployment Patterns</h2>

<p>
	s-m-r-t supports the full spectrum of enterprise deployment scenarios—from public cloud 
	SaaS to air-gapped government networks.
</p>

<h3>Public Cloud</h3>

<p>Standard deployment for most applications. Uses managed services for database and AI.</p>

<pre><code>{`const app = await App.create({
  name: 'my-enterprise-app',
  db: {
    type: 'postgres',
    url: process.env.DATABASE_URL,  // AWS RDS, Cloud SQL, etc.
    ssl: { rejectUnauthorized: false }
  },
  ai: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  },
  cache: {
    type: 'redis',
    url: process.env.REDIS_URL  // ElastiCache, Memorystore
  }
});`}</code></pre>

<h3>VPC with Private Connectivity</h3>

<p>
	Keep all traffic within your VPC. Use AWS PrivateLink or VPC endpoints to connect to 
	managed services without traversing the public internet.
</p>

<pre><code>{`const vpcApp = await App.create({
  name: 'vpc-secure-app',
  db: {
    type: 'postgres',
    host: '10.0.1.10',  // Internal VPC IP
    port: 5432,
    ssl: {
      ca: fs.readFileSync('/certs/rds-ca.pem')
    }
  },
  ai: {
    provider: 'bedrock',  // AWS PrivateLink
    region: 'us-east-1',
    credentials: {  // IAM role assumed from EC2/ECS
      roleArn: 'arn:aws:iam::123456789:role/AIBedrockAccess'
    }
  },
  // No internet egress required
  network: {
    egress: 'blocked',
    vpcEndpoints: ['bedrock', 'secretsmanager']
  }
});`}</code></pre>

<h3>On-Premise / Air-Gapped</h3>

<p>
	Deploy in environments with no internet connectivity. Use self-hosted models and 
	local infrastructure exclusively.
</p>

<pre><code>{`const airGappedApp = await App.create({
  name: 'classified-app',
  db: {
    type: 'postgres',
    host: 'internal-db.secure.local',
    port: 5432
    // No external connectivity
  },
  ai: {
    provider: 'ollama',
    endpoint: 'http://ai-cluster.secure.local:11434',
    model: 'llama3:70b',  // Self-hosted open source model
    // All AI processing stays on-premise
  },
  embedding: {
    provider: 'local',
    model: 'all-MiniLM-L6-v2'  // Local embedding model
  },
  telemetry: {
    enabled: true,
    // Export to internal observability stack
    endpoint: 'http://internal-otel.secure.local:4317'
  }
});`}</code></pre>

<h3>Hybrid: Sensitive Data On-Premise, General in Cloud</h3>

<p>
	Keep sensitive processing on-premise while using cloud AI for general tasks. 
	Route based on data classification.
</p>

<pre><code>{`@smrt()
class Document extends SmrtObject {
  @field()
  content: string = '';

  @field({ enum: ['public', 'internal', 'confidential', 'classified'] })
  classification: string = 'internal';

  async summarize() {
    // Route to appropriate AI provider based on classification
    const ai = this.classification === 'classified' 
      ? this.app.localAi      // On-premise
      : this.app.cloudAi;     // Cloud (faster, cheaper)
    
    return await ai.summarize(this.content);
  }
}`}</code></pre>

<h2 id="observability">Observability</h2>

<p>
	Production debugging requires visibility. s-m-r-t provides structured logging, 
	OpenTelemetry traces, and AI-specific metrics out of the box.
</p>

<h3>Structured Logging</h3>

<p>
	All operations emit structured JSON logs compatible with ELK, Datadog, Splunk, 
	or any log aggregation system.
</p>

<pre><code>{`@smrt({
  logging: {
    structured: true,
    level: 'info',
    includeContext: true
  }
})
class OrderProcessor {
  async processOrder(orderId: string) {
    this.logger.info('Starting order processing', {
      orderId,
      customerTier: this.customer.tier,
      itemCount: this.items.length
    });
    
    // ... processing logic ...
    
    this.logger.info('Order processed', {
      orderId,
      duration: Date.now() - start,
      status: 'completed'
    });
  }
}

// Output:
// {"level":"info","msg":"Starting order processing","orderId":"ORD-123","customerTier":"enterprise","itemCount":5,"timestamp":"2024-01-15T10:30:00Z","traceId":"abc123"}`}</code></pre>

<h3>OpenTelemetry Tracing</h3>

<p>
	Distributed traces automatically capture request flows, AI call latencies, 
	and database queries. Export to Jaeger, Zipkin, or any OTel-compatible backend.
</p>

<pre><code>{`const app = await App.create({
  telemetry: {
    traces: {
      enabled: true,
      exporter: 'otlp',
      endpoint: 'http://jaeger:4317'
    },
    metrics: {
      enabled: true,
      exporter: 'prometheus',
      port: 9090
    }
  }
});

// Spans are created automatically for:
// - HTTP requests
// - Database queries
// - AI model calls (with token counts)
// - Inter-agent dispatches`}</code></pre>

<h3>AI-Specific Metrics</h3>

<p>
	Monitor AI performance with built-in metrics for token usage, latency, 
	cache hit rates, and model confidence scores.
</p>

<pre><code>{`// Automatic metrics exposed at /metrics for Prometheus

# AI call latency by model
smrt_ai_latency_seconds_bucket{model="gpt-4",le="0.5"} 245
smrt_ai_latency_seconds_bucket{model="gpt-4",le="1.0"} 892
smrt_ai_latency_seconds_bucket{model="gpt-4",le="+Inf"} 900

# Token usage by operation
smrt_ai_tokens_total{model="gpt-4",type="input"} 1543200
smrt_ai_tokens_total{model="gpt-4",type="output"} 523400

# Semantic search performance
smrt_search_latency_seconds{index="articles"} 0.045
smrt_search_results_count{index="articles",query_type="semantic"} 10

# Agent dispatch metrics
smrt_dispatch_messages_total{status="delivered"} 12500
smrt_dispatch_messages_total{status="retry"} 45
smrt_dispatch_messages_total{status="dead_letter"} 3`}</code></pre>

<h2 id="ai-future-proofing">AI Future-Proofing</h2>

<p>
	The AI landscape changes rapidly. s-m-r-t's abstraction layer ensures your business 
	logic remains stable while you adapt to new models, providers, and capabilities.
</p>

<h3>Model-Agnostic Design</h3>

<p>
	Write once, run anywhere. The same code works with OpenAI, Anthropic, Google, 
	or self-hosted models.
</p>

<pre><code>{`// Configure provider at deployment time, not development time
const config = {
  ai: {
    // Option 1: OpenAI
    provider: 'openai',
    model: 'gpt-4-turbo',
    
    // Option 2: Anthropic
    // provider: 'anthropic',
    // model: 'claude-3-opus',
    
    // Option 3: Google
    // provider: 'vertex',
    // model: 'gemini-pro',
    
    // Option 4: Self-hosted
    // provider: 'ollama',
    // endpoint: 'http://local-ai:11434',
    // model: 'mixtral:8x7b'
  }
};

// Your business logic stays the same
const analysis = await document.do('Extract key terms and clauses');`}</code></pre>

<h3>Deterministic AI with Typed Interfaces</h3>

<p>
	Enforce structured outputs with JSON Schema validation. Never parse unreliable 
	free-form text responses again.
</p>

<pre><code>{`// Enforce exact output structure
const riskAssessment = await contract.analyze({
  schema: {
    riskLevel: {
      type: 'string',
      enum: ['low', 'medium', 'high', 'critical']
    },
    riskFactors: {
      type: 'array',
      items: { type: 'string' }
    },
    recommendedActions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          action: { type: 'string' },
          priority: { type: 'number', min: 1, max: 5 },
          owner: { type: 'string' }
        },
        required: ['action', 'priority']
      }
    },
    confidence: {
      type: 'number',
      min: 0,
      max: 1
    }
  }
});

// Returns validated, typed object:
// {
//   riskLevel: 'high',
//   riskFactors: ['unclear liability clause', 'missing termination date'],
//   recommendedActions: [
//     { action: 'Clarify liability', priority: 5, owner: 'Legal' }
//   ],
//   confidence: 0.94
// }`}</code></pre>

<h3>Multi-Model Strategies</h3>

<p>
	Use the right model for the job. Route simple tasks to fast/cheap models, 
	complex tasks to powerful models.
</p>

<pre><code>{`const routingConfig = {
  ai: {
    // Fast, cheap model for simple tasks
    default: { provider: 'openai', model: 'gpt-3.5-turbo' },
    
    // Powerful model for complex analysis
    reasoning: { provider: 'openai', model: 'gpt-4' },
    
    // Local model for sensitive data
    classified: { provider: 'ollama', model: 'llama3:70b' }
  }
};

class DocumentProcessor {
  async classify() {
    // Cheap, fast classification
    return await this.ai.default.classify({
      options: ['invoice', 'contract', 'memo', 'other']
    });
  }

  async extractTerms() {
    // Expensive but accurate extraction
    return await this.ai.reasoning.extract({
      schema: contractTermSchema
    });
  }

  async processClassified() {
    // On-premise for sensitive docs
    return await this.ai.classified.analyze({
      schema: classifiedAnalysisSchema
    });
  }
}`}</code></pre>

<h2 id="integration">Enterprise Integration</h2>

<p>
	s-m-r-t's headless architecture makes it ideal for integrating with existing 
	enterprise systems—whether they're modern APIs or legacy monoliths.
</p>

<h3>Legacy System Integration</h3>

<pre><code>{`// Bridge to SAP
@smrt()
class SAPBridge extends SmrtObject {
  @action()
  async syncPurchaseOrder(po: PurchaseOrder) {
    // Call SAP RFC
    const sapResult = await this.sap.call('BAPI_PO_CREATE1', {
      PO_HEADER: this.mapToSAPHeader(po),
      PO_ITEMS: po.items.map(i => this.mapToSAPItem(i))
    });
    
    // Store the SAP reference
    this.sapPONumber = sapResult.PO_NUMBER;
    await this.save();
  }
}

// Bridge to Salesforce
@smrt()
class SalesforceBridge extends SmrtObject {
  @action()
  async syncAccount(customer: Customer) {
    const sfAccount = await this.salesforce.sobject('Account').create({
      Name: customer.companyName,
      BillingStreet: customer.address.street,
      // ... mapping
    });
    
    customer.salesforceId = sfAccount.id;
    await customer.save();
  }
}`}</code></pre>

<h3>API Gateway Integration</h3>

<pre><code>{`// Expose as REST API for existing microservices
const api = await app.createApi({
  cors: {
    origin: ['https://legacy-app.corp.com'],
    credentials: true
  },
  auth: {
    // Integrate with existing auth
    provider: 'jwt',
    jwksUri: 'https://auth.corp.com/.well-known/jwks.json'
  }
});

// REST endpoints automatically available:
// GET    /api/products           -> Product.list()
// POST   /api/products           -> Product.create()
// GET    /api/products/:id       -> Product.get(id)
// PUT    /api/products/:id       -> Product.update(id, data)
// DELETE /api/products/:id       -> Product.delete(id)
// POST   /api/products/:id/do    -> product.do(instruction)`}</code></pre>

<style>
	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	.lead {
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--smrt-color-on-background-variant, #666);
		margin-bottom: 48px;
		max-width: 700px;
	}

	h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-top: 48px;
		margin-bottom: 16px;
		color: var(--smrt-color-on-background, #1a1a1a);
		padding-bottom: 8px;
		border-bottom: 2px solid var(--smrt-color-primary, #1976d2);
	}

	h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-top: 32px;
		margin-bottom: 12px;
		color: var(--smrt-color-on-background, #1a1a1a);
	}

	p {
		margin-bottom: 16px;
		line-height: 1.6;
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
		margin: 16px 0 32px;
	}

	code {
		font-family: var(--smrt-font-family-mono, monospace);
		font-size: 0.9em;
	}

	ul {
		margin-bottom: 16px;
		padding-left: 24px;
	}

	li {
		margin-bottom: 8px;
	}
</style>
