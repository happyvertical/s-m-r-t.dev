<script lang="ts">
	import ModulePage from '$lib/components/ModulePage.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<ModulePage
	name="smrt-sites"
	description="Site lifecycle management for multi-tenant networks with agent bindings, provisioning tracking, and portal configuration."
	badges={['v0.24.12', 'Site Lifecycle', 'Agent Bindings', 'Multi-Tenant']}
>
	<section>
		<h2>Overview</h2>
		<p>
			<strong>smrt-sites</strong> manages deployable websites within a tenant hierarchy. Sites
			progress through a draft-to-archived lifecycle, track infrastructure provisioning, and bind
			to agent classes with priority ordering and per-site configuration overrides.
		</p>
		<aside>
			<p>Key Features:</p>
			<ul>
				<li>Site lifecycle: draft, active, suspended, archived</li>
				<li>Agent bindings with priority ordering and per-site config overrides</li>
				<li>Infrastructure provisioning tracking (pending/provisioning/ready/failed)</li>
				<li>Portal configuration for theme, branding, and navigation</li>
				<li>Required tenant scoping on all models</li>
				<li>SiteService facade for lifecycle operations</li>
			</ul>
		</aside>
	</section>

	<section>
		<h2>Installation</h2>
		<CodeBlock code={`npm install @happyvertical/smrt-sites`} language="bash" />
	</section>

	<section>
		<h2>Quick Start</h2>
		<CodeBlock
			code={`import {
  Site, SiteCollection,
  SiteAgentBinding, SiteAgentBindingCollection,
  SiteService
} from '@happyvertical/smrt-sites';

// Create collections
const sites = await SiteCollection.create({ db });
const bindings = await SiteAgentBindingCollection.create({ db });

// Use SiteService for lifecycle operations
const service = new SiteService({ sites, bindings });

// Create a site (starts in draft status)
const site = await service.createSite('tenant-123', {
  name: 'Community Hub',
  domain: 'hub.example.com',
  tier: 'standard',
});

// Activate after validation (requires name + domain)
await service.activateSite(site.id);

// Mark infrastructure as provisioned
await service.markProvisioned(site.id);

// Bind agents with priority ordering (higher = first)
await service.bindAgent(site.id, 'Praeco', { schedule: '0 * * * *' });
await service.bindAgent(site.id, 'Caelus', { maxArticles: 50 });

// Get enabled agents sorted by priority descending
const agents = await service.getEnabledAgents(site.id);

// Suspend or archive a site
await service.suspendSite(site.id);
await service.archiveSite(site.id);`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Core Models</h2>

		<h3>Site</h3>
		<CodeBlock
			code={`class Site extends SmrtObject {
  name: string
  domain: string              // Unique per tenant
  tier: 'free' | 'standard' | 'premium'
  status: 'draft' | 'active' | 'suspended' | 'archived'
  provisioningStatus: 'pending' | 'provisioning' | 'ready' | 'failed'
  provisioningTimestamp?: Date
  portalConfig: string        // JSON (theme, branding, navigation)
  databaseUrl?: string

  getPortalConfig(): SitePortalConfig
  setPortalConfig(config: SitePortalConfig): void

  // @TenantScoped({ mode: 'required' })
}`}
			language="typescript"
		/>

		<h3>SiteAgentBinding</h3>
		<CodeBlock
			code={`class SiteAgentBinding extends SmrtObject {
  siteId: string
  agentClass: string          // Agent class name
  priority: number            // Higher values execute first
  enabled: boolean
  config?: string             // JSON per-site overrides (nullable)

  getConfig(): Record<string, any> | null

  // conflictColumns: ['site_id', 'agent_class']
  // @TenantScoped({ mode: 'required' })
}`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Agent Bindings</h2>
		<CodeBlock
			code={`// bindAgent() upserts: updates config if exists, creates if not
await service.bindAgent(site.id, 'Praeco', {
  schedule: '0 * * * *',
  maxItems: 20,
});

// Update an existing binding's config
await service.bindAgent(site.id, 'Praeco', {
  schedule: '*/30 * * * *',  // Changed to every 30 min
  maxItems: 50,
});

// Get enabled agents sorted by priority descending
const agents = await service.getEnabledAgents(site.id);
// Returns SiteAgentBinding[] ordered by priority

// Unbind an agent
await service.unbindAgent(site.id, 'Praeco');`}
			language="typescript"
		/>
	</section>

	<section>
		<h2>Best Practices</h2>
		<article>
			<h3>DOs</h3>
			<ul>
				<li>Use <code>SiteService</code> for all lifecycle operations</li>
				<li>Validate name and domain before activating a site</li>
				<li>Use <code>bindAgent()</code> for upsert behavior on agent bindings</li>
				<li>Track provisioning status separately from site status</li>
				<li>Use <code>getPortalConfig()</code>/<code>setPortalConfig()</code> for type-safe access</li>
			</ul>
		</article>
		<article>
			<h3>DON'Ts</h3>
			<ul>
				<li>Don't skip tenant context (both models require tenant scoping)</li>
				<li>Don't create duplicate domain entries within the same tenant</li>
				<li>Don't manually set agent binding config without using <code>bindAgent()</code></li>
				<li>Don't confuse portalConfig object/string forms (constructor accepts both)</li>
			</ul>
		</article>
	</section>

	<section>
		<h2>Related Modules</h2>
		<nav>
			<a href="/modules/smrt-agents">
				<h3>smrt-agents</h3>
				<p>Agent lifecycle and binding targets</p>
			</a>
			<a href="/modules/smrt-tenancy">
				<h3>smrt-tenancy</h3>
				<p>Required tenant scoping</p>
			</a>
			<a href="/modules/smrt-properties">
				<h3>smrt-properties</h3>
				<p>Digital property and zone management</p>
			</a>
		</nav>
	</section>

	<nav>
		<a href="/modules">Back to Modules</a>
	</nav>
</ModulePage>
